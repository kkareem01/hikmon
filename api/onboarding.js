'use strict';

// POST /api/onboarding
// Receives the completed welcome.html intake form (JSON — files were already
// uploaded client-side to Cloudinary). Verifies the Stripe session, writes a
// row to Airtable, and sends the client + Kareem their emails.
//
// Resilience: a paid client must never be lost. If Airtable fails, the
// submission is still logged (FailedSubmissions) and emailed to Kareem with
// the full raw payload.

const stripe = require('./_lib/stripe');
const airtable = require('./_lib/airtable');
const {
  renderClientEmail,
  renderProfileCard,
} = require('./_templates/client-welcome');
const { renderKareemEmail } = require('./_templates/kareem-notify');

const VALID_TRADES = new Set([
  'hvac', 'plumbing', 'electrical', 'roofing', 'garage-door',
  'pest-control', 'landscaping', 'pool', 'cleaning', 'painting',
  'handyman', 'flooring',
]);

const PLAN_LABELS = { monthly: 'Monthly', annual: 'Annual' };

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

// Reads the JSON body whether Vercel pre-parsed it or left a raw stream.
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function cleanArray(value) {
  return Array.isArray(value) ? value.filter((v) => v != null && v !== '') : [];
}

// Normalises one Cloudinary asset record to the shape we trust.
function cleanAsset(a) {
  if (!a || typeof a !== 'object' || typeof a.url !== 'string') return null;
  if (!/^https:\/\/res\.cloudinary\.com\//.test(a.url)) return null;
  return {
    url: a.url,
    public_id: typeof a.public_id === 'string' ? a.public_id : '',
    format: typeof a.format === 'string' ? a.format : '',
    bytes: Number.isFinite(a.bytes) ? a.bytes : 0,
  };
}

function pad(n) {
  return String(n).padStart(4, '0');
}

function receiptFor(recordNumber, sessionId) {
  const year = new Date().getFullYear();
  if (recordNumber != null) return `HK-${year}-${pad(recordNumber)}`;
  // Fallback when Airtable did not return an autonumber.
  return `HK-${year}-${sessionId.slice(-6).toUpperCase()}`;
}

function cloudinaryFolderUrl(sessionId) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || 'hikmon';
  const q = encodeURIComponent(`folder:hikmon/${sessionId}`);
  return `https://console.cloudinary.com/console/${cloud}/media_library/search?q=${q}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  // ---- Parse + validate the submission ------------------------------------
  let payload;
  try {
    payload = await readBody(req);
  } catch {
    return json(res, 400, { error: 'Invalid JSON body' });
  }

  const sessionId = String(payload.sessionId || '').trim();
  const bizName = String(payload.bizName || '').trim();

  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return json(res, 400, { error: 'Missing or malformed sessionId' });
  }
  if (!bizName) {
    return json(res, 400, { error: 'Business name is required' });
  }

  const trade = VALID_TRADES.has(String(payload.trade || '').toLowerCase())
    ? String(payload.trade).toLowerCase()
    : null;

  const submission = {
    sessionId,
    bizName,
    trade,
    tradeName: String(payload.tradeName || trade || '').trim(),
    plan: payload.plan === 'annual' ? 'annual' : payload.plan === 'monthly' ? 'monthly' : null,
    colors: cleanArray(payload.colors).map((c) => String(c).trim()).slice(0, 3),
    photos: cleanArray(payload.photos).map(cleanAsset).filter(Boolean).slice(0, 30),
    logo: cleanAsset(payload.logo),
    servicesNotOffered: cleanArray(payload.servicesNotOffered).map(String),
    servicesTargeted: cleanArray(payload.servicesTargeted).map(String),
    servicesOther: String(payload.servicesOther || '').trim(),
    submittedAt: payload.submittedAt || new Date().toISOString(),
  };

  // ---- Verify the Stripe session (authoritative customer identity) --------
  let stripeCtx = {
    email: null, name: null, amountTotal: null,
    currency: 'usd', customerId: null,
  };
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    });
    const details = session.customer_details || {};
    stripeCtx = {
      email: details.email || null,
      name: details.name || null,
      amountTotal: session.amount_total,
      currency: session.currency || 'usd',
      customerId:
        session.customer && typeof session.customer === 'object'
          ? session.customer.id
          : session.customer || null,
    };
  } catch (err) {
    // A real Stripe session is required — without it we cannot trust the sale.
    return json(res, 402, {
      error: 'Could not verify your purchase. Please contact kareem@hikmon.net.',
      detail: err && err.message ? err.message : String(err),
    });
  }

  const customerEmail = stripeCtx.email || String(payload.customerEmail || '').trim();
  const customerName = stripeCtx.name || String(payload.customerName || '').trim();

  const amountFormatted =
    stripeCtx.amountTotal != null
      ? `$${(stripeCtx.amountTotal / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      : '';

  // ---- Idempotency: a re-submit returns the existing record ---------------
  let recordId = null;
  let recordNumber = null;
  let airtableError = null;
  try {
    const existing = await airtable.findBySessionId(sessionId);
    if (existing) {
      const receiptNumber = receiptFor(
        existing.fields && existing.fields.RecordID,
        sessionId,
      );
      return json(res, 200, {
        ok: true,
        duplicate: true,
        recordId: existing.id,
        receiptNumber,
        profileSnapshotHtml: renderProfileCard({
          bizName,
          tradeName: submission.tradeName,
          planLabel: PLAN_LABELS[submission.plan] || '',
          amountFormatted,
          colors: submission.colors,
          logoUrl: submission.logo ? submission.logo.url : null,
          photoUrls: submission.photos.map((p) => p.url),
          servicesTargeted: submission.servicesTargeted,
          servicesNotOffered: submission.servicesNotOffered,
          servicesOther: submission.servicesOther,
          submittedAt: submission.submittedAt,
          receiptNumber,
        }),
      });
    }
  } catch (err) {
    // Lookup failure is non-fatal — fall through and attempt the insert.
    airtableError = err;
  }

  // ---- Write the client row to Airtable -----------------------------------
  if (!airtableError) {
    try {
      const fields = {
        BusinessName: bizName,
        CustomerEmail: customerEmail || undefined,
        CustomerName: customerName || undefined,
        Trade: trade || undefined,
        Plan: submission.plan || undefined,
        Status: 'New',
        StripeSessionID: sessionId,
        StripeCustomerID: stripeCtx.customerId || undefined,
        AmountPaid:
          stripeCtx.amountTotal != null ? stripeCtx.amountTotal / 100 : undefined,
        BrandColors: JSON.stringify(submission.colors),
        Logo: submission.logo ? [{ url: submission.logo.url }] : undefined,
        Photos: submission.photos.length
          ? submission.photos.map((p) => ({ url: p.url }))
          : undefined,
        ServicesNotOffered: submission.servicesNotOffered.join(', '),
        ServicesOther: submission.servicesOther || undefined,
        ServicesTargeted: submission.servicesTargeted.join(', '),
        SubmittedAt: submission.submittedAt,
        CloudinaryFolder: cloudinaryFolderUrl(sessionId),
        RawPayload: JSON.stringify(submission, null, 2),
      };
      const record = await airtable.createClient(fields);
      recordId = record.id;
      recordNumber = record.fields && record.fields.RecordID;
    } catch (err) {
      airtableError = err;
    }
  }

  // If Airtable failed entirely, log the raw submission so it is recoverable.
  if (airtableError) {
    try {
      await airtable.logFailure(submission, airtableError);
    } catch {
      /* last-resort capture is the Kareem email below */
    }
  }

  const receiptNumber = receiptFor(recordNumber, sessionId);

  // ---- Build + send emails ------------------------------------------------
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.FROM_EMAIL || 'kareem@hikmon.net';
  const from = `Kareem at Hikmon <${fromEmail}>`;

  const emailArgs = {
    customerName,
    customerEmail,
    bizName,
    trade,
    tradeName: submission.tradeName,
    planLabel: PLAN_LABELS[submission.plan] || '',
    amountFormatted,
    colors: submission.colors,
    logoUrl: submission.logo ? submission.logo.url : null,
    photoUrls: submission.photos.map((p) => p.url),
    servicesTargeted: submission.servicesTargeted,
    servicesNotOffered: submission.servicesNotOffered,
    servicesOther: submission.servicesOther,
    submittedAt: submission.submittedAt,
    receiptNumber,
  };

  let clientEmailSent = false;
  let kareemEmailSent = false;

  if (customerEmail) {
    try {
      const mail = renderClientEmail(emailArgs);
      await resend.emails.send({
        from,
        to: customerEmail,
        replyTo: fromEmail,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
      clientEmailSent = true;
    } catch (err) {
      console.error('[onboarding] client email failed:', err);
    }
  }

  try {
    const kareem = renderKareemEmail({
      payload: submission,
      stripe: stripeCtx,
      receiptNumber,
      airtableUrl: recordId ? airtable.recordUrl(recordId) : null,
      cloudinaryFolderUrl: cloudinaryFolderUrl(sessionId),
      stripeCustomerUrl: stripeCtx.customerId
        ? `https://dashboard.stripe.com/customers/${stripeCtx.customerId}`
        : null,
    });
    const subjectPrefix = airtableError ? '[ACTION NEEDED — Airtable failed] ' : '';
    await resend.emails.send({
      from,
      to: process.env.KAREEM_EMAIL || fromEmail,
      replyTo: customerEmail || fromEmail,
      subject: subjectPrefix + kareem.subject,
      html: kareem.html,
      text: kareem.text,
    });
    kareemEmailSent = true;
  } catch (err) {
    console.error('[onboarding] kareem email failed:', err);
  }

  // Best-effort: stamp the email-sent checkboxes on the Airtable record.
  if (recordId && (clientEmailSent || kareemEmailSent)) {
    try {
      await airtable.updateRecord(recordId, {
        ClientEmailSent: clientEmailSent,
        KareemEmailSent: kareemEmailSent,
      });
    } catch (err) {
      console.error('[onboarding] checkbox update failed:', err);
    }
  }

  // ---- Decide the response ------------------------------------------------
  // The submission is safe if it reached Airtable OR Kareem's inbox.
  if (!recordId && !kareemEmailSent) {
    return json(res, 500, {
      error:
        'We could not save your submission. Your answers are still here — ' +
        'please try Submit again, or email kareem@hikmon.net.',
    });
  }

  return json(res, 200, {
    ok: true,
    recordId,
    receiptNumber,
    clientEmailSent,
    kareemEmailSent,
    airtableSaved: Boolean(recordId),
    profileSnapshotHtml: renderProfileCard({
      bizName,
      tradeName: submission.tradeName,
      planLabel: PLAN_LABELS[submission.plan] || '',
      amountFormatted,
      colors: submission.colors,
      logoUrl: submission.logo ? submission.logo.url : null,
      photoUrls: submission.photos.map((p) => p.url),
      servicesTargeted: submission.servicesTargeted,
      servicesNotOffered: submission.servicesNotOffered,
      servicesOther: submission.servicesOther,
      submittedAt: submission.submittedAt,
      receiptNumber,
    }),
  });
};
