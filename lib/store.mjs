/**
 * SQL-backed repository for strategy-call bookings (libSQL/Turso).
 * Slot uniqueness is enforced by UNIQUE(slot_date, slot_time): two simultaneous
 * attempts on the same slot — exactly one wins, the loser gets SLOT_TAKEN.
 */

import { getDb } from './db.mjs';

function rowToBooking(r) {
  return {
    id: r.id,
    audience: r.audience,
    customer: JSON.parse(r.customer_json),
    answers: JSON.parse(r.answers_json),
    slot: {
      date: r.slot_date,
      time: r.slot_time,
      durationMinutes: Number(r.slot_duration),
      tz: r.slot_tz,
    },
    displayTimezone: r.display_tz,
    consent: r.consent === 1,
    leadId: r.lead_id,
    ip: r.ip,
    userAgent: r.user_agent,
    emailStatus: r.email_status,
    emailDetail: r.email_detail,
    staffStatus: r.staff_status ?? 'new',
    meetUrl: r.meet_url ?? null,
    calendarEventId: r.calendar_event_id ?? null,
    meetingProvider: r.meeting_provider ?? null,
    createdAt: r.created_at,
  };
}

export async function findBookingById(id) {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM bookings WHERE id = ? LIMIT 1',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return rowToBooking(result.rows[0]);
}

export async function listBookingsBySlot(date, audience) {
  const db = getDb();
  const result = audience
    ? await db.execute({
        sql: 'SELECT * FROM bookings WHERE slot_date = ? AND audience = ?',
        args: [date, audience],
      })
    : await db.execute({
        sql: 'SELECT * FROM bookings WHERE slot_date = ?',
        args: [date],
      });
  return result.rows.map(rowToBooking);
}

export async function listBookingsByMonth(year, month, audience) {
  const db = getDb();
  const like = `${year}-${String(month).padStart(2, '0')}-%`;
  const result = audience
    ? await db.execute({
        sql: 'SELECT * FROM bookings WHERE slot_date LIKE ? AND audience = ?',
        args: [like, audience],
      })
    : await db.execute({
        sql: 'SELECT * FROM bookings WHERE slot_date LIKE ?',
        args: [like],
      });
  return result.rows.map(rowToBooking);
}

/** @returns { ok: true, booking } or { ok: false, error: 'SLOT_TAKEN' } */
export async function createBooking(record, idGenerator) {
  const db = getDb();
  const booking = { ...record, id: idGenerator(), createdAt: new Date().toISOString() };

  try {
    await db.execute({
      sql: `INSERT INTO bookings (
        id, audience, customer_json, answers_json,
        slot_date, slot_time, slot_duration, slot_tz,
        display_tz, consent, lead_id, ip, user_agent,
        email_status, email_detail, staff_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        booking.id,
        booking.audience,
        JSON.stringify(booking.customer ?? {}),
        JSON.stringify(booking.answers ?? {}),
        booking.slot.date,
        booking.slot.time,
        booking.slot.durationMinutes,
        booking.slot.tz,
        booking.displayTimezone ?? null,
        booking.consent ? 1 : 0,
        booking.leadId ?? null,
        booking.ip ?? null,
        booking.userAgent ?? null,
        booking.emailStatus ?? 'pending',
        booking.emailDetail ?? null,
        'new',
        booking.createdAt,
      ],
    });
    return { ok: true, booking };
  } catch (err) {
    const msg = String(err?.message || err);
    if (msg.includes('UNIQUE') || msg.includes('SQLITE_CONSTRAINT')) {
      return { ok: false, error: 'SLOT_TAKEN' };
    }
    throw err;
  }
}

/** Attach Google Meet / calendar details to a booking after the event is created. */
export async function updateBookingMeeting(id, { meetUrl, calendarEventId, provider }) {
  const db = getDb();
  const result = await db.execute({
    sql: 'UPDATE bookings SET meet_url = ?, calendar_event_id = ?, meeting_provider = ? WHERE id = ?',
    args: [meetUrl ?? null, calendarEventId ?? null, provider ?? null, id],
  });
  if (result.rowsAffected === 0) return { ok: false, error: 'NOT_FOUND' };
  return { ok: true };
}

export async function updateBookingEmailStatus(id, status, detail) {
  const db = getDb();
  const result = await db.execute({
    sql: 'UPDATE bookings SET email_status = ?, email_detail = ? WHERE id = ?',
    args: [status, detail ?? null, id],
  });
  if (result.rowsAffected === 0) return { ok: false, error: 'NOT_FOUND' };
  return { ok: true };
}
