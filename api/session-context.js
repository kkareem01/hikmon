'use strict';

// GET /api/session-context?session_id=cs_...
// Resolves a Stripe Checkout session into the context welcome.html needs to
// personalise the form (customer name, trade, plan, amount). Read-only, safe
// to call on every page load — failure here is non-blocking for the client.

const stripe = require('./_lib/stripe');

const VALID_TRADES = new Set([
  'hvac', 'plumbing', 'electrical', 'roofing', 'garage-door',
  'pest-control', 'landscaping', 'pool', 'cleaning', 'painting',
  'handyman', 'flooring',
]);

const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

// Derives 'monthly' | 'annual' | null from the session's recurring line item.
function derivePlan(session) {
  const items = session.line_items && session.line_items.data;
  if (!items || !items.length) return null;
  const interval =
    items[0].price &&
    items[0].price.recurring &&
    items[0].price.recurring.interval;
  if (interval === 'month') return 'monthly';
  if (interval === 'year') return 'annual';
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const url = new URL(req.url, 'http://localhost');
  const sessionId = (url.searchParams.get('session_id') || '').trim();

  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return json(res, 400, { error: 'Missing or malformed session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'line_items.data.price'],
    });

    const ageSeconds = Math.floor(Date.now() / 1000) - (session.created || 0);
    if (ageSeconds > SESSION_MAX_AGE_SECONDS) {
      return json(res, 404, { error: 'Session expired' });
    }

    const details = session.customer_details || {};
    const refTrade = (session.client_reference_id || '').toLowerCase();

    return json(res, 200, {
      sessionId: session.id,
      paid: session.payment_status === 'paid' ||
        session.payment_status === 'no_payment_required',
      email: details.email || null,
      name: details.name || null,
      amountTotal: session.amount_total,
      currency: session.currency,
      plan: derivePlan(session),
      trade: VALID_TRADES.has(refTrade) ? refTrade : null,
      customerId:
        session.customer && typeof session.customer === 'object'
          ? session.customer.id
          : session.customer || null,
    });
  } catch (err) {
    const status = err && err.statusCode === 404 ? 404 : 502;
    return json(res, status, {
      error: 'Could not retrieve session',
      detail: err && err.message ? err.message : String(err),
    });
  }
};
