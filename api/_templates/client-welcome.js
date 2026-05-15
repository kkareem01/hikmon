'use strict';

// Client-facing welcome email. Renders a polished, branded confirmation that
// mirrors the welcome.html intake form back to the customer as a formal
// "profile" receipt. All CSS is inlined per-element for Gmail/Outlook/iOS.
//
// Brand tokens (Hikmon Website/brand_assets/colors.md):
//   forest #1F3D2C · amber #C97B19 · white #FFFFFF · elevated #FAFAF7
//   hairline #ECECE7 · charcoal #1A1A1A · ash #6B6B6B

const C = {
  forest: '#1F3D2C',
  forestMid: '#2D5640',
  amber: '#C97B19',
  amberSoft: '#F5E4CC',
  white: '#FFFFFF',
  elevated: '#FAFAF7',
  hairline: '#ECECE7',
  charcoal: '#1A1A1A',
  ash: '#6B6B6B',
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function firstNameOf(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return 'there';
  return trimmed.split(/\s+/)[0];
}

function formatDate(iso) {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

// One labelled row inside the profile card.
function profileRow(label, valueHtml) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${C.hairline};vertical-align:top;width:150px;font-family:${MONO};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.ash};">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${C.hairline};vertical-align:top;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.charcoal};">${valueHtml}</td>
    </tr>`;
}

function colorSwatches(colors) {
  const list = (colors || []).filter(Boolean);
  if (!list.length) {
    return `<span style="color:${C.ash};">I'll pick a palette that works.</span>`;
  }
  const cells = list
    .map(
      (hex) => `
        <td style="padding-right:10px;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td width="22" height="22" bgcolor="${esc(hex)}" style="width:22px;height:22px;border-radius:5px;border:1px solid ${C.hairline};">&nbsp;</td>
            <td style="padding-left:7px;font-family:${MONO};font-size:12px;color:${C.charcoal};">${esc(hex)}</td>
          </tr></table>
        </td>`,
    )
    .join('');
  return `<table cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`;
}

function logoBlock(logoUrl) {
  if (!logoUrl) {
    return `<span style="color:${C.ash};">No logo uploaded — I'll create a clean wordmark.</span>`;
  }
  const thumb = logoUrl.replace(
    '/upload/',
    '/upload/w_120,h_120,c_fit,f_auto,q_auto/',
  );
  return `<img src="${esc(thumb)}" width="72" height="72" alt="Your logo" style="display:block;border:1px solid ${C.hairline};border-radius:8px;background:${C.white};" />`;
}

function photoGrid(photoUrls) {
  const list = (photoUrls || []).filter(Boolean);
  if (!list.length) {
    return `<span style="color:${C.ash};">No photos yet — you can send them later.</span>`;
  }
  const shown = list.slice(0, 9);
  const extra = list.length - shown.length;
  const cells = shown
    .map((url) => {
      const thumb = url.replace(
        '/upload/',
        '/upload/w_150,h_150,c_fill,f_auto,q_auto/',
      );
      return `<td style="padding:0 6px 6px 0;"><img src="${esc(thumb)}" width="80" height="80" alt="" style="display:block;border-radius:6px;border:1px solid ${C.hairline};" /></td>`;
    })
    .join('');
  const more = extra > 0
    ? `<div style="margin-top:4px;font-family:${SANS};font-size:13px;color:${C.ash};">+${extra} more</div>`
    : '';
  return `<table cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>${more}`;
}

function bulletList(items, color) {
  const list = (items || []).filter(Boolean);
  if (!list.length) return `<span style="color:${C.ash};">—</span>`;
  return list
    .map(
      (s) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;background:${C.elevated};border:1px solid ${C.hairline};border-radius:999px;font-family:${SANS};font-size:13px;color:${color};">${esc(s)}</span>`,
    )
    .join('');
}

function timelineRow(when, what) {
  return `
    <tr>
      <td style="padding:11px 16px 11px 0;vertical-align:top;width:96px;font-family:${MONO};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.amber};">${esc(when)}</td>
      <td style="padding:11px 0;vertical-align:top;font-family:${SANS};font-size:15px;line-height:1.55;color:${C.charcoal};">${what}</td>
    </tr>`;
}

// Builds the standalone "profile" card. Reused as the success-screen snapshot
// in welcome.html step 6 (returned to the browser as profileSnapshotHtml).
function renderProfileCard(args) {
  const {
    bizName,
    tradeName,
    planLabel,
    amountFormatted,
    colors,
    logoUrl,
    photoUrls,
    servicesTargeted,
    servicesNotOffered,
    servicesOther,
    submittedAt,
    receiptNumber,
  } = args;

  const planValue = [planLabel, amountFormatted]
    .filter(Boolean)
    .join(' · ');

  const excludedHtml = (servicesNotOffered || []).filter(Boolean).length
    ? `<div style="margin-top:14px;">
         <div style="font-family:${MONO};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.ash};margin-bottom:6px;">Excluded</div>
         ${bulletList(servicesNotOffered, C.ash)}
       </div>`
    : '';

  const otherHtml = servicesOther
    ? `<div style="margin-top:12px;font-family:${SANS};font-size:14px;color:${C.ash};">Note: ${esc(servicesOther)}</div>`
    : '';

  return `
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.white};border:1px solid ${C.hairline};border-left:3px solid ${C.forest};border-radius:10px;">
    <tr><td style="padding:24px 26px;">
      <div style="font-family:${MONO};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.amber};margin-bottom:14px;">Your profile</div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${profileRow('Business', `<strong>${esc(bizName || '—')}</strong>`)}
        ${profileRow('Trade', esc(tradeName || '—'))}
        ${planValue ? profileRow('Plan', esc(planValue)) : ''}
        ${profileRow('Brand colors', colorSwatches(colors))}
        ${profileRow('Logo', logoBlock(logoUrl))}
        ${profileRow('Photos', photoGrid(photoUrls))}
        ${profileRow('Services targeted', bulletList(servicesTargeted, C.charcoal))}
        ${profileRow('Submitted', esc(formatDate(submittedAt)))}
        ${receiptNumber ? profileRow('Receipt', `<span style="font-family:${MONO};font-size:13px;color:${C.forest};">${esc(receiptNumber)}</span>`) : ''}
      </table>
      ${excludedHtml}
      ${otherHtml}
    </td></tr>
  </table>`;
}

function renderClientEmail(args) {
  const {
    customerName,
    bizName,
    receiptNumber,
    submittedAt,
  } = args;

  const firstName = firstNameOf(customerName);
  const receiptShort = receiptNumber || 'pending';
  const dateShort = (submittedAt ? new Date(submittedAt) : new Date())
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toUpperCase();

  const subject = `Hikmon — your profile (#${receiptShort}) is locked in for ${bizName || 'your business'}`;
  const preheader = 'Everything you just submitted, mirrored back. Here is what happens next.';

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.elevated};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.elevated};">
  <tr><td align="center" style="padding:0;">
    <table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;">

      <!-- Top forest band -->
      <tr><td style="background:${C.forest};border-radius:12px 12px 0 0;padding:18px 28px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td style="vertical-align:middle;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="30" height="30" bgcolor="${C.amber}" style="width:30px;height:30px;border-radius:7px;text-align:center;vertical-align:middle;font-family:${SERIF};font-weight:bold;font-size:16px;color:${C.white};">H</td>
              <td style="padding-left:10px;font-family:${SERIF};font-weight:bold;font-size:18px;color:${C.white};">Hikmon</td>
            </tr></table>
          </td>
          <td align="right" style="vertical-align:middle;font-family:${MONO};font-size:11px;letter-spacing:0.08em;color:rgba(255,255,255,0.82);">RECEIPT · #${esc(receiptShort)} · ${esc(dateShort)}</td>
        </tr></table>
      </td></tr>

      <!-- Hero -->
      <tr><td style="background:${C.white};padding:34px 28px 8px;">
        <h1 style="margin:0 0 12px;font-family:${SERIF};font-weight:bold;font-size:28px;line-height:1.25;color:${C.forest};">You're in, ${esc(firstName)}.</h1>
        <p style="margin:0;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.charcoal};">
          I've got everything I need for <strong>${esc(bizName || 'your business')}</strong>. Below is a copy of what you submitted &mdash; keep this for your records. I start building <em style="font-style:italic;color:${C.amber};">today</em>.
        </p>
      </td></tr>

      <!-- Profile card -->
      <tr><td style="background:${C.white};padding:22px 28px 8px;">
        ${renderProfileCard(args)}
      </td></tr>

      <!-- Timeline -->
      <tr><td style="background:${C.white};padding:24px 28px 8px;">
        <div style="border-top:1px solid ${C.hairline};padding-top:20px;">
          <div style="font-family:${MONO};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.amber};margin-bottom:8px;">What happens next</div>
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            ${timelineRow('Today', '<strong>Grant me Google Business Profile access</strong> on our call.')}
            ${timelineRow('This week', "<strong>I build everything.</strong> Your site, GBP optimization, and tracking &mdash; fully assembled.")}
            ${timelineRow('Day 7', '<strong>Site goes live</strong> at your domain. Walkthrough video sent to your inbox.')}
            ${timelineRow('Day 30', '<strong>Top 3 on Google Maps</strong> &mdash; or every month after is free until you rank.')}
          </table>
        </div>
      </td></tr>

      <!-- What I need -->
      <tr><td style="background:${C.white};padding:20px 28px 8px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.amberSoft};border-radius:10px;">
          <tr><td style="padding:18px 20px;">
            <div style="font-family:${MONO};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.amber};margin-bottom:6px;">What I need from you (1 thing)</div>
            <div style="font-family:${SANS};font-size:15px;line-height:1.55;color:${C.charcoal};">Hop on the Google Business Profile share call we already booked. That's the only thing standing between you and launch.</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- Signature -->
      <tr><td style="background:${C.white};padding:26px 28px 30px;">
        <div style="border-top:1px solid ${C.hairline};padding-top:22px;">
          <p style="margin:0 0 4px;font-family:${SANS};font-size:15px;color:${C.charcoal};">Building this for you,</p>
          <p style="margin:0;font-family:${SERIF};font-weight:bold;font-size:18px;color:${C.forest};">Kareem</p>
          <p style="margin:2px 0 0;font-family:${SANS};font-size:14px;color:${C.ash};">Hikmon · <a href="mailto:kareem@hikmon.com" style="color:${C.amber};text-decoration:none;">kareem@hikmon.com</a></p>
          <p style="margin:14px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.ash};">If anything in your profile above is wrong, just reply to this email &mdash; I read every one.</p>
        </div>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${C.elevated};border-radius:0 0 12px 12px;padding:18px 28px;text-align:center;font-family:${SANS};font-size:12px;color:${C.ash};">
        Hikmon &middot; Demand Capture Engine for home service businesses
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    `You're in, ${firstName}.`,
    '',
    `I've got everything I need for ${bizName || 'your business'}. This is a copy of what you submitted — keep it for your records. I start building today.`,
    '',
    `YOUR PROFILE (Receipt #${receiptShort})`,
    `- Business: ${bizName || '—'}`,
    `- Trade: ${args.tradeName || '—'}`,
    args.planLabel ? `- Plan: ${[args.planLabel, args.amountFormatted].filter(Boolean).join(' · ')}` : null,
    `- Brand colors: ${(args.colors || []).filter(Boolean).join(', ') || "I'll pick a palette"}`,
    `- Logo: ${args.logoUrl ? 'uploaded' : "none — I'll create a wordmark"}`,
    `- Photos: ${(args.photoUrls || []).filter(Boolean).length} uploaded`,
    `- Services targeted: ${(args.servicesTargeted || []).filter(Boolean).join(', ') || '—'}`,
    (args.servicesNotOffered || []).filter(Boolean).length
      ? `- Services excluded: ${args.servicesNotOffered.join(', ')}`
      : null,
    args.servicesOther ? `- Note: ${args.servicesOther}` : null,
    `- Submitted: ${formatDate(submittedAt)}`,
    '',
    'WHAT HAPPENS NEXT',
    '- Today: Grant me Google Business Profile access on our call.',
    '- This week: I build everything — site, GBP, tracking.',
    '- Day 7: Site goes live at your domain.',
    '- Day 30: Top 3 on Google Maps, or every month after is free until you rank.',
    '',
    'WHAT I NEED FROM YOU (1 thing): Hop on the Google Business Profile share call we already booked.',
    '',
    'Building this for you,',
    'Kareem',
    'Hikmon · kareem@hikmon.com',
    '',
    'If anything in your profile is wrong, just reply to this email.',
  ]
    .filter((line) => line !== null)
    .join('\n');

  return { subject, html, text };
}

module.exports = { renderClientEmail, renderProfileCard };
