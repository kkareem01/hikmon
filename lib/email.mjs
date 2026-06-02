/**
 * Resend transactional email via fetch (no SDK). Honors DRY_RUN_EMAIL=true by
 * writing rendered HTML to tmp/ instead of calling the API — useful for local QA.
 * Two templates: the booker's strategy-call confirmation and Kareem's notification.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import * as log from './log.mjs';

const RESEND_URL = 'https://api.resend.com/emails';

export async function sendEmail({ to, from, subject, html, text, attachments, replyTo, headers }) {
  const dryRun = process.env.DRY_RUN_EMAIL === 'true';
  if (dryRun) {
    await mkdir('tmp', { recursive: true });
    const stamp = `${Date.now()}-${randomBytes(2).toString('hex')}`;
    const file = `tmp/email-${stamp}.html`;
    const banner = `<!-- DRY_RUN_EMAIL\nTo: ${Array.isArray(to) ? to.join(', ') : to}\nFrom: ${from}\nSubject: ${subject}\nReply-To: ${replyTo ?? ''}\nAttachments: ${(attachments || []).map((a) => a.filename).join(', ')}\n-->\n`;
    await writeFile(file, banner + html, 'utf8');
    await writeFile('tmp/last-email.html', banner + html, 'utf8');
    log.info(`Dry-run email written to ${file}`);
    return { ok: true, dryRun: true, file };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY missing.' };

  const body = { from, to: Array.isArray(to) ? to : [to], subject, html, text };
  if (replyTo) body.reply_to = replyTo;
  if (headers && Object.keys(headers).length > 0) body.headers = headers;
  if (attachments && attachments.length > 0) {
    body.attachments = attachments.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, 'utf8').toString('base64'),
      content_type: a.contentType ?? 'application/octet-stream',
    }));
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { ok: false, error: `Resend ${res.status}: ${detail.slice(0, 200)}` };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: `Email send failed: ${err.message}` };
  }
}

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatLongDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

function formatTime12h(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Hikmon brand: forest #1F3D2C, amber #C97B19/#E0913B, cream #FAFAF7.
const WRAPPER_OPEN = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;font-family:Georgia,'Times New Roman',serif;background:#FAFAF7;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #ECECE7;border-radius:4px;">
        <tr><td style="padding:28px 32px 18px 32px;border-bottom:3px solid #C97B19;background:#1F3D2C;border-radius:4px 4px 0 0;">
          <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.01em;">Hikmon</div>
          <div style="font-family:Georgia,serif;font-size:12px;color:#E0913B;letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">The Demand Capture Engine</div>
        </td></tr>
        <tr><td style="padding:32px;">`;

const WRAPPER_CLOSE = `        </td></tr>
        <tr><td style="padding:22px 32px;background:#FAFAF7;border-top:1px solid #ECECE7;font-size:13px;color:#6B6B6B;text-align:center;border-radius:0 0 4px 4px;">
          Hikmon &middot; <a href="mailto:kareem@hikmon.net" style="color:#C97B19;text-decoration:none;">kareem@hikmon.net</a> &middot; <a href="https://www.hikmon.net" style="color:#C97B19;text-decoration:none;">hikmon.net</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

// Confirmation to the prospect who booked the call. `businessName` here is the
// AGENCY (Hikmon); the prospect's own business is in booking.answers.businessName.
export function customerConfirmationEmail({ booking, businessName, businessPhone, confirmUrl }) {
  const dateLong = formatLongDate(booking.slot.date);
  const time = formatTime12h(booking.slot.time);
  const subject = `Your ${businessName} strategy call is booked — ${dateLong} at ${time}`;

  const html = WRAPPER_OPEN + `
    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:600;color:#1F3D2C;margin:0 0 16px 0;">You're booked, ${escapeHtml(booking.customer.firstName)}.</h1>
    <p style="margin:0 0 20px 0;">Your free strategy call is set for <strong>${dateLong} at ${time}</strong> (${escapeHtml(booking.displayTimezone || booking.slot.tz || 'America/New_York')}). I'll call you then.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;border:1px solid #ECECE7;border-radius:4px;">
      <tr><td style="padding:14px 18px;background:#F4EFE6;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1F3D2C;">Your call</td></tr>
      <tr><td style="padding:14px 18px;">
        <div style="margin-bottom:8px;"><strong>When:</strong> ${dateLong} at ${time}</div>
        <div style="margin-bottom:8px;"><strong>How long:</strong> about ${booking.slot.durationMinutes} minutes</div>
        <div><strong>Reference:</strong> ${booking.id}</div>
      </td></tr>
    </table>
    <h2 style="font-family:Georgia,serif;font-size:18px;color:#1F3D2C;margin:24px 0 12px 0;">What we'll cover</h2>
    <ul style="margin:0 0 24px 0;padding-left:20px;">
      <li style="margin-bottom:6px;">Where you rank on Google now and who's beating you.</li>
      <li style="margin-bottom:6px;">Exactly how the Demand Capture Engine would work for your business.</li>
      <li>Your questions — pricing, the guarantee, what's involved. No pressure.</li>
    </ul>
    ${confirmUrl ? `<p style="text-align:center;margin:24px 0 0 0;">
      <a href="${confirmUrl}" style="display:inline-block;background:#C97B19;color:#FFFFFF;padding:14px 28px;text-decoration:none;font-family:Georgia,serif;font-weight:700;letter-spacing:0.04em;font-size:14px;border-radius:9999px;">View call details</a>
    </p>` : ''}
    <p style="margin:24px 0 0 0;font-size:14px;color:#6B6B6B;">A calendar invitation is attached. Need to reschedule? Just reply to this email.</p>
    ` + WRAPPER_CLOSE;

  const text =
    `You're booked, ${booking.customer.firstName}.\n\n` +
    `Your free strategy call: ${dateLong} at ${time} (${booking.displayTimezone || booking.slot.tz})\n` +
    `About ${booking.slot.durationMinutes} minutes. Reference: ${booking.id}\n\n` +
    (confirmUrl ? `Details: ${confirmUrl}\n` : '') +
    `Need to reschedule? Reply to this email.\n`;

  return { subject, html, text };
}

// Notification to Kareem for each new strategy call.
export function ownerNotificationEmail({ booking }) {
  const dateLong = formatLongDate(booking.slot.date);
  const time = formatTime12h(booking.slot.time);
  const c = booking.customer || {};
  const a = booking.answers || {};
  const subject = `[STRATEGY CALL] ${a.businessName || c.firstName + ' ' + c.lastName} — ${dateLong} ${time}`;

  const answersRows = Object.entries(a)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;background:#F4EFE6;font-weight:700;width:38%;">${escapeHtml(k)}</td><td style="padding:6px 12px;">${escapeHtml(String(v ?? ''))}</td></tr>`)
    .join('');

  const html = WRAPPER_OPEN + `
    <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#1F3D2C;margin:0 0 16px 0;">New strategy call booked</h1>
    <p style="margin:0 0 16px 0;font-size:18px;"><strong>${dateLong}</strong> at <strong>${time}</strong> <span style="color:#6B6B6B;font-size:14px;">(${escapeHtml(booking.displayTimezone || '')})</span></p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;border:1px solid #ECECE7;font-size:14px;">
      <tr><td style="padding:8px 12px;background:#F4EFE6;font-weight:700;width:38%;">Name</td><td style="padding:8px 12px;">${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</td></tr>
      <tr><td style="padding:8px 12px;background:#F4EFE6;font-weight:700;">Phone</td><td style="padding:8px 12px;"><a href="tel:${escapeHtml(c.phone)}" style="color:#C97B19;">${escapeHtml(c.phone)}</a></td></tr>
      <tr><td style="padding:8px 12px;background:#F4EFE6;font-weight:700;">Email</td><td style="padding:8px 12px;"><a href="mailto:${escapeHtml(c.email)}" style="color:#C97B19;">${escapeHtml(c.email)}</a></td></tr>
      <tr><td style="padding:8px 12px;background:#F4EFE6;font-weight:700;">Reference</td><td style="padding:8px 12px;">${booking.id}</td></tr>
    </table>
    <h2 style="font-family:Georgia,serif;font-size:16px;color:#1F3D2C;margin:16px 0 8px 0;">Their answers</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECECE7;font-size:14px;">
      ${answersRows || '<tr><td style="padding:8px 12px;color:#6B6B6B;">No additional answers.</td></tr>'}
    </table>
    ` + WRAPPER_CLOSE;

  const text =
    `New strategy call booked\n\n${dateLong} ${time} (${booking.displayTimezone || ''})\n` +
    `${c.firstName} ${c.lastName}\n${c.phone} · ${c.email}\nReference: ${booking.id}\n\n` +
    `Answers:\n${Object.entries(a).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n`;

  return { subject, html, text };
}
