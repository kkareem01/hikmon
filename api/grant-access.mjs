/**
 * POST /api/grant-access — a client submits their Google Business Profile listing
 * so Kareem can request manager access. Emails Kareem (via Resend) with the
 * details; the client then accepts the manager invite from their own inbox.
 * No SMS, no database — just the notification email.
 */

import { sendEmail, gbpAccessRequestEmail } from '../lib/email.mjs';
import * as log from '../lib/log.mjs';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Per-instance, in-memory rate limit — light spam guard, same approach as bookings.
const RATE_LIMITS = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

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

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

export default async function (req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }

  const ip = clientIp(req);
  if (!checkRateLimit(ip)) {
    return json(res, 429, { ok: false, error: 'Too many requests. Try again later.' });
  }

  // Vercel parses JSON bodies for us; guard anyway.
  const body = (req.body && typeof req.body === 'object') ? req.body : {};
  const kind = body.kind === 'help' ? 'help' : 'added';
  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const business = String(body.business || '').trim().slice(0, 160);
  const listing = String(body.listing || '').trim().slice(0, 1000);
  const details = String(body.details || '').trim().slice(0, 2000);

  if (!EMAIL_RE.test(email)) {
    return json(res, 400, { ok: false, error: 'Please include a valid email.' });
  }
  if (kind === 'help' && !details) {
    return json(res, 400, { ok: false, error: 'Tell us who set up your listing so we can help.' });
  }

  const fromEmail = process.env.FROM_EMAIL || 'kareem@hikmon.net';
  const ownerEmail = process.env.OWNER_EMAIL || process.env.KAREEM_EMAIL || fromEmail;
  const businessName = process.env.BUSINESS_NAME || 'Hikmon';

  const tpl = gbpAccessRequestEmail({ kind, name, email, business, listing, details });
  const result = await sendEmail({
    to: ownerEmail,
    from: `${businessName} <${fromEmail}>`,
    replyTo: email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  if (!result.ok) {
    log.error(`grant-access email failed: ${result.error}`);
    return json(res, 502, { ok: false, error: 'Could not send right now. Please try again.' });
  }

  log.info(`grant-access (${kind}) from ${email}`);
  return json(res, 200, { ok: true });
}
