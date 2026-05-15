'use strict';

// Minimal Airtable REST wrapper — no SDK. Covers the three operations the
// onboarding pipeline needs: create a client row, look one up by Stripe
// session id (idempotency), and log a failed submission for recovery.

const API_ROOT = 'https://api.airtable.com/v0';

function config() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error('AIRTABLE_API_KEY or AIRTABLE_BASE_ID is not set');
  }
  return {
    apiKey,
    baseId,
    clientsTable: process.env.AIRTABLE_TABLE_NAME || 'Clients',
    failedTable: process.env.AIRTABLE_FAILED_TABLE_NAME || 'FailedSubmissions',
  };
}

async function request(path, options = {}) {
  const { apiKey } = config();
  const res = await fetch(`${API_ROOT}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const detail =
      body && body.error ? JSON.stringify(body.error) : String(body);
    throw new Error(`Airtable ${res.status}: ${detail}`);
  }
  return body;
}

// Escapes a value for safe use inside an Airtable filterByFormula string.
function escapeFormulaValue(value) {
  return String(value).replace(/'/g, "\\'");
}

// Returns the existing record (or null) for a given Stripe checkout session.
async function findBySessionId(sessionId) {
  const { baseId, clientsTable } = config();
  const formula = `{StripeSessionID}='${escapeFormulaValue(sessionId)}'`;
  const query = `filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;
  const body = await request(
    `${baseId}/${encodeURIComponent(clientsTable)}?${query}`,
  );
  return body && body.records && body.records.length ? body.records[0] : null;
}

// Creates a client row. `fields` must match the Clients table schema.
async function createClient(fields) {
  const { baseId, clientsTable } = config();
  const body = await request(`${baseId}/${encodeURIComponent(clientsTable)}`, {
    method: 'POST',
    body: JSON.stringify({ fields, typecast: true }),
  });
  return body;
}

// Patches fields on an existing client row (e.g. email-sent checkboxes).
async function updateRecord(recordId, fields) {
  const { baseId, clientsTable } = config();
  return request(
    `${baseId}/${encodeURIComponent(clientsTable)}/${recordId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields, typecast: true }),
    },
  );
}

// Records a failed submission so a paid client is never silently lost.
async function logFailure(payload, error) {
  const { baseId, failedTable } = config();
  const fields = {
    Timestamp: new Date().toISOString(),
    Error: String(error && error.message ? error.message : error),
    SessionID: payload && payload.sessionId ? payload.sessionId : '',
    RawPayload: JSON.stringify(payload || {}, null, 2),
  };
  return request(`${baseId}/${encodeURIComponent(failedTable)}`, {
    method: 'POST',
    body: JSON.stringify({ fields, typecast: true }),
  });
}

// Deep link to a record in the Airtable UI (used in Kareem's email).
function recordUrl(recordId) {
  const { baseId } = config();
  return `https://airtable.com/${baseId}/${recordId}`;
}

module.exports = {
  findBySessionId,
  createClient,
  updateRecord,
  logFailure,
  recordUrl,
};
