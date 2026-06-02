/**
 * libSQL/Turso client singleton.
 * - Production (Vercel): TURSO_DATABASE_URL=libsql://... + TURSO_AUTH_TOKEN
 * - Local dev: TURSO_DATABASE_URL=file:local.db (no auth token needed)
 *
 * ensureBootstrapped() runs the (idempotent) migration once per warm container
 * so a fresh production DB self-heals without anyone running a script.
 */

import { createClient } from '@libsql/client';
import { migrate } from './migrate.mjs';

let client = null;
let bootstrapPromise = null;

export function getDb() {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL is not set. Use "file:local.db" for local dev or "libsql://...turso.io" for production.'
    );
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;
  client = createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });
  return client;
}

export async function ensureBootstrapped() {
  if (!bootstrapPromise) {
    bootstrapPromise = migrate().catch((e) => {
      bootstrapPromise = null;
      throw e;
    });
  }
  await bootstrapPromise;
}
