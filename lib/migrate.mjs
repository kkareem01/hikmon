/**
 * Idempotent schema migration for the strategy-call booking system.
 * One table: bookings. UNIQUE(slot_date, slot_time) enforces "one call per
 * physical time slot" at the DB level (race-safe). Safe to run repeatedly.
 */

import { getDb } from './db.mjs';

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS bookings (
    id              TEXT PRIMARY KEY,
    audience        TEXT NOT NULL,
    customer_json   TEXT NOT NULL,
    answers_json    TEXT NOT NULL,
    slot_date       TEXT NOT NULL,
    slot_time       TEXT NOT NULL,
    slot_duration   INTEGER NOT NULL,
    slot_tz         TEXT NOT NULL,
    display_tz      TEXT,
    consent         INTEGER NOT NULL,
    lead_id         TEXT,
    ip              TEXT,
    user_agent      TEXT,
    email_status    TEXT,
    email_detail    TEXT,
    staff_status    TEXT NOT NULL DEFAULT 'new',
    created_at      TEXT NOT NULL,
    UNIQUE(slot_date, slot_time)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_date_audience ON bookings(slot_date, audience)`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_month ON bookings(slot_date)`,
];

export async function migrate() {
  const db = getDb();
  for (const sql of STATEMENTS) {
    await db.execute(sql);
  }
}
