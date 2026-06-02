/**
 * API handlers for the strategy-call booking system. Used by both the Vercel
 * serverless functions in /api/* and the local dev server (server.mjs).
 * Each handler accepts (req, res). server.mjs parses req.body for POSTs before
 * calling, matching Vercel's behavior.
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isValidAudience } from './audiences.mjs';
import { ensureBootstrapped } from './db.mjs';
import { validateBookingPayload } from './validate.mjs';
import { generateSlotsForDate, filterAvailableSlots, listMonth } from './slots.mjs';
import {
  findBookingById,
  listBookingsBySlot,
  listBookingsByMonth,
  createBooking,
  updateBookingEmailStatus,
} from './store.mjs';
import { newBookingId } from './id.mjs';
import { buildICS } from './ics.mjs';
import { sendEmail, customerConfirmationEmail, ownerNotificationEmail } from './email.mjs';
import * as log from './log.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let cachedConfig = null;

async function loadConfig() {
  if (cachedConfig) return cachedConfig;
  const raw = await readFile(join(ROOT, 'data/config.json'), 'utf8');
  cachedConfig = JSON.parse(raw);
  return cachedConfig;
}

function publicConfig(cfg) {
  return {
    storeTimezone: cfg.storeTimezone,
    businessHours: cfg.businessHours,
    blackoutDates: cfg.blackoutDates,
    defaultSlotDurationMinutes: cfg.defaultSlotDurationMinutes,
    fittingTypes: cfg.fittingTypes,
    leadTimeMinutes: cfg.leadTimeMinutes,
    maxAdvanceDays: cfg.maxAdvanceDays,
  };
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

function ok(data) { return { ok: true, data }; }
function err(message, code) { return { ok: false, error: message, code: code ?? null }; }
function getUrl(req) { return new URL(req.url, `http://${req.headers.host || 'localhost'}`); }

// Per-instance, in-memory rate limit. Acceptable trade-off vs. a KV store.
const RATE_LIMITS = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
function checkRateLimit(ip) {
  const now = Date.now();
  const cur = RATE_LIMITS.get(ip);
  if (!cur || cur.resetAt < now) {
    RATE_LIMITS.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (cur.count >= RATE_LIMIT_MAX) return false;
  cur.count += 1;
  return true;
}

export async function handleConfig(req, res) {
  const cfg = await loadConfig();
  sendJson(res, 200, ok(publicConfig(cfg)));
}

export async function handleAvailability(req, res) {
  await ensureBootstrapped();
  const url = getUrl(req);
  const date = url.searchParams.get('date');
  const audience = url.searchParams.get('audience');
  if (!date || !isValidAudience(audience)) {
    return sendJson(res, 400, err('Missing or invalid date / audience.'));
  }
  const cfg = await loadConfig();
  const all = generateSlotsForDate(date, cfg, audience);
  const booked = await listBookingsBySlot(date, audience);
  const bookedTimes = new Set(booked.map((b) => b.slot.time));
  const available = filterAvailableSlots(all, bookedTimes, date, cfg);
  const slots = all.map((time) => ({ time, available: available.includes(time) }));
  sendJson(res, 200, ok({ date, audience, slots }));
}

export async function handleAvailabilityMonth(req, res) {
  await ensureBootstrapped();
  const url = getUrl(req);
  const year = parseInt(url.searchParams.get('year') || '', 10);
  const month = parseInt(url.searchParams.get('month') || '', 10);
  const audience = url.searchParams.get('audience');
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12 || !isValidAudience(audience)) {
    return sendJson(res, 400, err('Missing or invalid year / month / audience.'));
  }
  const cfg = await loadConfig();
  const all = await listBookingsByMonth(year, month, audience);
  const map = new Map();
  for (const b of all) {
    if (!map.has(b.slot.date)) map.set(b.slot.date, new Set());
    map.get(b.slot.date).add(b.slot.time);
  }
  const days = listMonth(year, month, cfg, audience, map);
  sendJson(res, 200, ok({ year, month, audience, days }));
}

export async function handleCreateBooking(req, res) {
  await ensureBootstrapped();
  const ip = clientIp(req);
  if (!checkRateLimit(ip)) {
    return sendJson(res, 429, err('Too many bookings from your network. Try again later.'));
  }

  const body = req.body || {};
  const v = validateBookingPayload(body);
  if (!v.ok) return sendJson(res, 400, err(v.errors.join(' ')));

  const cfg = await loadConfig();
  const audience = v.value.audience;
  const fitting = cfg.fittingTypes[audience];
  const durationMinutes = fitting?.slotDurationMinutes ?? cfg.defaultSlotDurationMinutes ?? 30;

  const allSlots = generateSlotsForDate(v.value.slot.date, cfg, audience);
  if (!allSlots.includes(v.value.slot.time)) {
    return sendJson(res, 409, err('That slot is no longer available.', 'SLOT_TAKEN'));
  }
  const taken = await listBookingsBySlot(v.value.slot.date, audience);
  const open = filterAvailableSlots(allSlots, new Set(taken.map((b) => b.slot.time)), v.value.slot.date, cfg);
  if (!open.includes(v.value.slot.time)) {
    return sendJson(res, 409, err('That slot is no longer available.', 'SLOT_TAKEN'));
  }

  const record = {
    audience,
    customer: v.value.customer,
    answers: v.value.answers,
    slot: { date: v.value.slot.date, time: v.value.slot.time, durationMinutes, tz: cfg.storeTimezone },
    displayTimezone: v.value.timezone,
    consent: true,
    leadId: null,
    ip,
    userAgent: (req.headers['user-agent'] || '').slice(0, 200),
    emailStatus: 'pending',
  };

  const result = await createBooking(record, newBookingId);
  if (!result.ok) {
    if (result.error === 'SLOT_TAKEN') {
      return sendJson(res, 409, err('That slot is no longer available.', 'SLOT_TAKEN'));
    }
    return sendJson(res, 500, err('Could not save booking.'));
  }

  log.info(`strategy call booked ${result.booking.id} ${v.value.slot.date} ${v.value.slot.time}`);

  // Awaited so the serverless function doesn't terminate before email finishes.
  await fireEmails(result.booking, cfg).catch((e) => log.error('email pipeline crash', e?.message || e));

  return sendJson(res, 200, ok({
    id: result.booking.id,
    slot: result.booking.slot,
    customer: result.booking.customer,
  }));
}

async function fireEmails(booking, cfg) {
  const businessName = process.env.BUSINESS_NAME || 'Hikmon';
  const fromEmail = process.env.FROM_EMAIL || 'kareem@hikmon.net';
  const ownerEmail = process.env.OWNER_EMAIL || process.env.KAREEM_EMAIL || fromEmail;
  const siteUrl = process.env.SITE_URL || process.env.SITE_ORIGIN || 'http://localhost:3000';
  const audienceLabel = cfg.fittingTypes?.[booking.audience]?.label || 'Strategy call';
  const confirmUrl = `${siteUrl}/booking-confirmed?id=${booking.id}`;
  const fromHeader = `${businessName} <${fromEmail}>`;

  const ics = buildICS({
    id: booking.id,
    slot: booking.slot,
    durationMinutes: booking.slot.durationMinutes,
    tz: booking.slot.tz,
    summary: `${audienceLabel} with ${businessName}`,
    description: `Your free strategy call with ${businessName}. Reference: ${booking.id}.\n${confirmUrl}`,
    location: 'Phone call',
  });

  const customer = customerConfirmationEmail({ booking, businessName, confirmUrl });
  const owner = ownerNotificationEmail({ booking });

  const sends = [
    sendEmail({
      to: booking.customer.email,
      from: fromHeader,
      replyTo: ownerEmail,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
      attachments: [{ filename: 'strategy-call.ics', content: ics, contentType: 'text/calendar' }],
    }),
    sendEmail({
      to: ownerEmail,
      from: fromHeader,
      replyTo: booking.customer.email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    }),
  ];

  const results = await Promise.allSettled(sends);
  const failures = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok));
  const status = failures.length === 0 ? 'sent' : failures.length === results.length ? 'failed' : 'partial';
  const detail = failures.map((r) => (r.status === 'rejected' ? r.reason?.message : r.value?.error)).filter(Boolean).join(' | ');
  await updateBookingEmailStatus(booking.id, status, detail || null).catch(() => {});
  if (status !== 'sent') log.warn(`booking ${booking.id} email status=${status} detail=${detail}`);
}

export async function handleGetBooking(req, res, id) {
  await ensureBootstrapped();
  if (!id || !/^BK-[A-F0-9]+$/i.test(id)) return sendJson(res, 400, err('Invalid booking id.'));
  const b = await findBookingById(id);
  if (!b) return sendJson(res, 404, err('Booking not found.'));
  sendJson(res, 200, ok({
    id: b.id,
    audience: b.audience,
    slot: b.slot,
    displayTimezone: b.displayTimezone,
    customer: { firstName: b.customer.firstName, email: b.customer.email },
    createdAt: b.createdAt,
  }));
}

export async function handleGetBookingIcs(req, res, id) {
  await ensureBootstrapped();
  if (!id || !/^BK-[A-F0-9]+$/i.test(id)) { res.writeHead(400); return res.end('Invalid booking id.'); }
  const b = await findBookingById(id);
  if (!b) { res.writeHead(404); return res.end('Not found'); }
  const businessName = process.env.BUSINESS_NAME || 'Hikmon';
  const ics = buildICS({
    id: b.id,
    slot: b.slot,
    durationMinutes: b.slot.durationMinutes,
    tz: b.slot.tz,
    summary: `Strategy call with ${businessName}`,
    description: `Your free strategy call with ${businessName}. Reference: ${b.id}.`,
    location: 'Phone call',
  });
  res.writeHead(200, {
    'content-type': 'text/calendar; charset=utf-8',
    'content-disposition': `attachment; filename="strategy-call-${b.id}.ics"`,
    'cache-control': 'no-store',
  });
  res.end(ics);
}
