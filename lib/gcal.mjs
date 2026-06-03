/**
 * Google Calendar + Google Meet integration for the strategy-call booking system.
 *
 * On each booking we create a real event on a sales rep's Google Calendar with an
 * auto-generated Google Meet link. No SDK — plain fetch against the OAuth2 token
 * endpoint and the Calendar v3 REST API.
 *
 * Auth: a single offline OAuth2 refresh token (one Google account today). The same
 * primitive — events.insert on a calendarId — is what lets us round-robin across a
 * whole sales team later: add reps to `salesReps` in data/config.json, each with
 * their own calendarId, and the assignment logic below picks one.
 *
 * Required env (booking still succeeds without them — it just skips the Meet link):
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 */

import * as log from './log.mjs';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

/** True only when every credential needed to talk to Google is present. */
export function isConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN,
  );
}

/**
 * Exchange the long-lived refresh token for a short-lived access token.
 * Tokens last ~1h; serverless invocations are short, so we fetch fresh each call
 * rather than caching across cold starts.
 */
async function getAccessToken() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Google token ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error('Google token response had no access_token.');
  return data.access_token;
}

/**
 * Choose which rep's calendar a booking lands on.
 * Today: a single rep (or 'primary' fallback). Built so a future round-robin /
 * free-busy strategy is a change here, not a rewrite of the call sites.
 */
export function selectRep(salesReps, seed = 0) {
  const reps = Array.isArray(salesReps) ? salesReps.filter((r) => r && r.calendarId) : [];
  if (reps.length === 0) {
    return { id: 'default', name: process.env.BUSINESS_NAME || 'Hikmon', calendarId: 'primary' };
  }
  const idx = ((seed % reps.length) + reps.length) % reps.length;
  return reps[idx];
}

/** Add whole minutes to a naive wall-clock date/time (no timezone math). */
function addMinutesToLocal(date, time, minutes) {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d, h, mi, 0));
  dt.setUTCMinutes(dt.getUTCMinutes() + minutes);
  const p = (n) => String(n).padStart(2, '0');
  return {
    date: `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())}`,
    time: `${p(dt.getUTCHours())}:${p(dt.getUTCMinutes())}`,
  };
}

/**
 * Create a calendar event with a Google Meet link.
 * @returns {Promise<{meetUrl: string|null, eventId: string, htmlLink: string}>}
 */
export async function createMeetEvent({
  calendarId = 'primary',
  requestId,
  summary,
  description,
  date,
  time,
  durationMinutes,
  timeZone,
  attendees = [],
}) {
  const accessToken = await getAccessToken();
  const end = addMinutesToLocal(date, time, durationMinutes);

  const event = {
    summary,
    description,
    // Wall-clock + IANA timeZone: Google resolves the absolute instant and shows
    // each viewer the call in their own zone.
    start: { dateTime: `${date}T${time}:00`, timeZone },
    end: { dateTime: `${end.date}T${end.time}:00`, timeZone },
    conferenceData: {
      createRequest: {
        requestId, // idempotency key — same id never double-creates a conference
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };
  if (attendees.length > 0) {
    event.attendees = attendees.filter(Boolean).map((email) => ({ email }));
  }

  // sendUpdates=none: we send our own branded Resend confirmation + .ics, so we
  // don't want Google to also email the guest a duplicate invite.
  const url =
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events` +
    `?conferenceDataVersion=1&sendUpdates=none`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Calendar insert ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const entry = (data.conferenceData?.entryPoints || []).find((e) => e.entryPointType === 'video');
  const meetUrl = data.hangoutLink || entry?.uri || null;
  return { meetUrl, eventId: data.id, htmlLink: data.htmlLink || '' };
}

/**
 * High-level helper: given a saved booking + config, create its Meet event.
 * Returns null (and logs) on any failure so the booking flow degrades gracefully.
 * @returns {Promise<{meetUrl, eventId, provider, calendarId}|null>}
 */
export async function createMeetingForBooking(booking, cfg, { businessName }) {
  if (!isConfigured()) return null;

  // Deterministic-ish seed so reps share load without persistent counters.
  const seed = parseInt((booking.id.match(/[0-9A-F]+/i)?.[0] || '0').slice(-3), 16) || 0;
  const rep = selectRep(cfg.salesReps, seed);
  const audienceLabel = cfg.fittingTypes?.[booking.audience]?.label || 'Strategy call';

  try {
    const result = await createMeetEvent({
      calendarId: rep.calendarId,
      requestId: booking.id,
      summary: `${audienceLabel}: ${booking.answers?.businessName || booking.customer?.firstName || 'Prospect'} ↔ ${businessName}`,
      description:
        `Free strategy call with ${businessName}.\n` +
        `Booked by ${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() +
        `\nPhone: ${booking.customer?.phone || '—'}\nReference: ${booking.id}`,
      date: booking.slot.date,
      time: booking.slot.time,
      durationMinutes: booking.slot.durationMinutes,
      timeZone: booking.slot.tz,
      attendees: [booking.customer?.email],
    });
    log.info(`meet event created ${booking.id} rep=${rep.id} url=${result.meetUrl ? 'yes' : 'none'}`);
    return { ...result, provider: 'google-meet', calendarId: rep.calendarId, repId: rep.id };
  } catch (e) {
    log.warn(`meet event failed for ${booking.id}: ${e?.message || e}`);
    return null;
  }
}
