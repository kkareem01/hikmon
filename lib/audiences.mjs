/**
 * Booking audience(s) for Hikmon. There is a single one — the free strategy call.
 * FIELD_SCHEMAS defines step 2 of the booking form (the business questions).
 * MUST stay in sync with assets/js/booking-form.js FIELD_SCHEMAS.
 * (server.mjs runs a startup self-test that warns if the two drift.)
 */

export const AUDIENCES = ['strategy'];

export const FIELD_SCHEMAS = {
  strategy: [
    {
      name: 'businessName',
      label: 'Business name',
      type: 'text',
      required: true,
      maxLength: 80,
      placeholder: 'e.g. Smith & Sons Heating and Cooling',
    },
    {
      name: 'trade',
      label: 'Your trade',
      type: 'select',
      required: true,
      options: [
        'HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Garage doors',
        'Landscaping', 'Pest control', 'Cleaning', 'Painting', 'Other home service',
      ],
    },
    {
      name: 'currentSite',
      label: 'Current website (optional)',
      type: 'text',
      required: false,
      maxLength: 200,
      placeholder: 'yoursite.com — or leave blank',
    },
    {
      name: 'notes',
      label: "What's your biggest challenge right now? (optional)",
      type: 'textarea',
      required: false,
      maxLength: 500,
      placeholder: 'Slow phone, losing jobs to competitors, outdated website…',
    },
  ],
};

export function isValidAudience(a) {
  return AUDIENCES.includes(a);
}

export function fieldNames(audience) {
  const schema = FIELD_SCHEMAS[audience];
  if (!schema) return [];
  return schema.map((f) => f.name);
}
