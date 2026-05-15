'use strict';

// Internal new-client notification sent to Kareem. Plain and functional —
// every submitted field, asset links, and quick deep-links into the tools.

const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, Menlo, monospace";

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label, valueHtml) {
  return `
    <tr>
      <td style="padding:7px 14px 7px 0;vertical-align:top;font-family:${MONO};font-size:12px;color:#6B6B6B;white-space:nowrap;">${esc(label)}</td>
      <td style="padding:7px 0;vertical-align:top;font-family:${SANS};font-size:14px;color:#1A1A1A;">${valueHtml}</td>
    </tr>`;
}

function link(url, text) {
  if (!url) return '<span style="color:#6B6B6B;">—</span>';
  return `<a href="${esc(url)}" style="color:#C97B19;">${esc(text || url)}</a>`;
}

function assetLinks(items, label) {
  const list = (items || []).filter(Boolean);
  if (!list.length) return `<span style="color:#6B6B6B;">none</span>`;
  return list
    .map((it, i) => link(it.url, `${label} ${i + 1} (${it.format || 'file'})`))
    .join('<br/>');
}

// args: { payload, stripe, receiptNumber, airtableUrl, cloudinaryFolderUrl, stripeCustomerUrl }
function renderKareemEmail(args) {
  const { payload, stripe, receiptNumber, airtableUrl, cloudinaryFolderUrl, stripeCustomerUrl } = args;
  const p = payload || {};
  const s = stripe || {};

  const subject = `[Hikmon] New client: ${p.bizName || 'Unknown'} — ${p.trade || '?'}, ${p.plan || '?'}`;

  const submittedAt = p.submittedAt ? new Date(p.submittedAt) : new Date();
  const when = submittedAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const amount =
    s.amountTotal != null
      ? `$${(s.amountTotal / 100).toFixed(2)} ${(s.currency || 'usd').toUpperCase()}`
      : '—';

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#FAFAF7;font-family:${SANS};">
  <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #ECECE7;border-radius:8px;padding:24px;">
    <h2 style="margin:0 0 4px;font-size:18px;color:#1F3D2C;">New paid client</h2>
    <p style="margin:0 0 18px;font-size:14px;color:#6B6B6B;">${esc(p.bizName || 'Unknown')} (${esc(p.trade || '?')}) — submitted ${esc(when)}${receiptNumber ? ` · Receipt ${esc(receiptNumber)}` : ''}</p>

    <h3 style="margin:18px 0 4px;font-size:13px;color:#1F3D2C;text-transform:uppercase;letter-spacing:0.06em;">Stripe</h3>
    <table cellpadding="0" cellspacing="0" border="0">
      ${row('Customer', esc(s.name || p.customerName || '—'))}
      ${row('Email', esc(s.email || p.customerEmail || '—'))}
      ${row('Amount', esc(amount))}
      ${row('Plan', esc(p.plan || '—'))}
      ${row('Customer ID', esc(s.customerId || '—'))}
      ${row('Session ID', esc(p.sessionId || '—'))}
    </table>

    <h3 style="margin:20px 0 4px;font-size:13px;color:#1F3D2C;text-transform:uppercase;letter-spacing:0.06em;">Submission</h3>
    <table cellpadding="0" cellspacing="0" border="0">
      ${row('Business', esc(p.bizName || '—'))}
      ${row('Trade', esc(p.tradeName || p.trade || '—'))}
      ${row('Brand colors', esc((p.colors || []).filter(Boolean).join(', ') || '—'))}
      ${row('Services targeted', esc((p.servicesTargeted || []).filter(Boolean).join(', ') || '—'))}
      ${row('Services excluded', esc((p.servicesNotOffered || []).filter(Boolean).join(', ') || 'none'))}
      ${row('Other notes', esc(p.servicesOther || '—'))}
    </table>

    <h3 style="margin:20px 0 4px;font-size:13px;color:#1F3D2C;text-transform:uppercase;letter-spacing:0.06em;">Assets</h3>
    <table cellpadding="0" cellspacing="0" border="0">
      ${row('Logo', p.logo ? link(p.logo.url, `logo (${p.logo.format || 'file'})`) : '<span style="color:#6B6B6B;">none</span>')}
      ${row('Photos', assetLinks(p.photos, 'photo'))}
    </table>

    <h3 style="margin:20px 0 4px;font-size:13px;color:#1F3D2C;text-transform:uppercase;letter-spacing:0.06em;">Quick actions</h3>
    <table cellpadding="0" cellspacing="0" border="0">
      ${row('Airtable', link(airtableUrl, 'Open client record'))}
      ${row('Cloudinary', link(cloudinaryFolderUrl, 'Open asset folder'))}
      ${row('Stripe', link(stripeCustomerUrl, 'Open customer'))}
    </table>
  </div>
</body></html>`;

  const text = [
    `NEW PAID CLIENT — ${p.bizName || 'Unknown'} (${p.trade || '?'})`,
    `Submitted ${when}${receiptNumber ? ` · Receipt ${receiptNumber}` : ''}`,
    '',
    'STRIPE',
    `  Customer: ${s.name || p.customerName || '—'}`,
    `  Email: ${s.email || p.customerEmail || '—'}`,
    `  Amount: ${amount}`,
    `  Plan: ${p.plan || '—'}`,
    `  Customer ID: ${s.customerId || '—'}`,
    `  Session ID: ${p.sessionId || '—'}`,
    '',
    'SUBMISSION',
    `  Business: ${p.bizName || '—'}`,
    `  Trade: ${p.tradeName || p.trade || '—'}`,
    `  Brand colors: ${(p.colors || []).filter(Boolean).join(', ') || '—'}`,
    `  Services targeted: ${(p.servicesTargeted || []).filter(Boolean).join(', ') || '—'}`,
    `  Services excluded: ${(p.servicesNotOffered || []).filter(Boolean).join(', ') || 'none'}`,
    `  Other notes: ${p.servicesOther || '—'}`,
    '',
    'ASSETS',
    `  Logo: ${p.logo ? p.logo.url : 'none'}`,
    ...((p.photos || []).filter(Boolean).map((ph, i) => `  Photo ${i + 1}: ${ph.url}`)),
    '',
    'QUICK ACTIONS',
    `  Airtable: ${airtableUrl || '—'}`,
    `  Cloudinary: ${cloudinaryFolderUrl || '—'}`,
    `  Stripe: ${stripeCustomerUrl || '—'}`,
  ].join('\n');

  return { subject, html, text };
}

module.exports = { renderKareemEmail };
