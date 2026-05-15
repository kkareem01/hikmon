'use strict';

// Shared Stripe client. Fails fast if the secret key is missing so a
// misconfigured deploy errors loudly instead of silently 500ing later.
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

module.exports = require('stripe')(key);
