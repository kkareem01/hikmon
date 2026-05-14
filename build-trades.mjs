// Build trade-specific landing pages by applying per-trade swaps to hvac.html.
// Usage: node build-trades.mjs            -> builds all 11 trades
//        node build-trades.mjs plumbing   -> builds just one trade
// Source of truth for copy is trade-copy.md; configs below mirror that doc.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(__dirname, 'hvac.html');

const TRADES = {
  plumbing: {
    titleNoun: 'plumbing',
    metaOwnerDesc: 'residential plumbing owners',
    heroQuery: 'emergency plumber near me',
    primaryXSearch: 'primary plumbing search',
    authorityComment: 'PLUMBING OWNERS',
    authorityH2: 'plumbing business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$8,000 repipe.</strong> The water-heater install that pays you for years',
    authorityPara3SlowMonth: 'between burst-pipe weeks',
    authorityPara4Revenue: 'repipes, water-heater installs, and maintenance plans',
    truthPara1: `You didn't start your plumbing company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle the week after a cold snap.`,
    truthPara5PeakTrough: 'stays busy during a freeze and panics every spring',
    truthPara6HighTicket: '$8,000 repipe',
    truthPara6Obvious: 'the obvious plumber in your zip code',
    introCardBullet: 'A high-converting plumbing website built to book jobs.',
    stack01Title: 'High-converting plumbing website',
    stack01Sub: 'Built to book emergency calls, repipe quotes, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local plumbing pins',
    timeline30Search: 'your main plumbing search',
    timeline60Slow: 'Even between cold snaps',
    letterRe: 'Why plumbing marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Plumbing Owner,',
    letterPara1Trade: 'Most plumbing owners I talk to have the same story.',
    letterPivot: 'Plumbing marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a plumbing business that has to make payroll between busy weeks.',
    letterPeakTrough: `Your phone rings during a cold snap. It barely rings the week after.`,
    faq1Closing: 'plumbers',
    faq4Question: 'Do you work with trades besides plumbing?',
    faq4Answer: `Yes. We help every home service trade — HVAC, electrical, roofing, and more. Plumbing is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary plumbing search',
    finalCtaWebsite: 'your plumbing website',
    footerDesc: 'residential plumbing owners',
    footerTagline: 'BUILT FOR PLUMBING',
  },

  electrical: {
    titleNoun: 'electrical',
    metaOwnerDesc: 'residential electrical contractors',
    heroQuery: 'electrician near me',
    primaryXSearch: 'primary electrical search',
    authorityComment: 'ELECTRICAL CONTRACTORS',
    authorityH2: 'electrical contractors',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$6,000 panel upgrade.</strong> The generator install that pays you for years',
    authorityPara3SlowMonth: 'between storm weeks',
    authorityPara4Revenue: 'panel upgrades and EV charger installs',
    truthPara1: `You didn't start your electrical company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle between storms.`,
    truthPara5PeakTrough: 'stays busy after a storm and panics the next quiet week',
    truthPara6HighTicket: '$6,000 panel upgrade',
    truthPara6Obvious: 'the obvious electrician in your zip code',
    introCardBullet: 'A high-converting electrical website built to book jobs.',
    stack01Title: 'High-converting electrical website',
    stack01Sub: 'Built to book emergency calls, panel upgrade quotes, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local electrical pins',
    timeline30Search: 'your main electrical search',
    timeline60Slow: 'Even between storms',
    letterRe: 'Why electrical marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Electrician,',
    letterPara1Trade: 'Most electricians I talk to have the same story.',
    letterPivot: 'Electrical marketing has felt broken because the way agencies price it was built for SaaS companies. Not for an electrical business that has to make payroll between storm weeks.',
    letterPeakTrough: `Your phone rings after a storm. It barely rings the next quiet week.`,
    faq1Closing: 'electricians',
    faq4Question: 'Do you work with trades besides electrical?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, roofing, and more. Electrical is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary electrical search',
    finalCtaWebsite: 'your electrical website',
    footerDesc: 'residential electrical contractors',
    footerTagline: 'BUILT FOR ELECTRICAL',
  },

  roofing: {
    titleNoun: 'roofing',
    metaOwnerDesc: 'residential roofing owners',
    heroQuery: 'roofers near me',
    primaryXSearch: 'primary roofing search',
    authorityComment: 'ROOFING OWNERS',
    authorityH2: 'roofing business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$18,000 roof replacement.</strong> The insurance claim that pays you for years',
    authorityPara3SlowMonth: 'between storms',
    authorityPara4Revenue: 'roof replacements and insurance claim jobs',
    truthPara1: `You didn't start your roofing company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle between storms.`,
    truthPara5PeakTrough: 'stays busy after a storm and panics in March',
    truthPara6HighTicket: '$18,000 roof replacement',
    truthPara6Obvious: 'the obvious roofer in your zip code',
    introCardBullet: 'A high-converting roofing website built to book jobs.',
    stack01Title: 'High-converting roofing website',
    stack01Sub: 'Built to book emergency calls, roof estimates, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local roofing pins',
    timeline30Search: 'your main roofing search',
    timeline60Slow: 'Even between storms',
    letterRe: 'Why roofing marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Roofing Owner,',
    letterPara1Trade: 'Most roofing owners I talk to have the same story.',
    letterPivot: 'Roofing marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a roofing business that has to make payroll between storm seasons.',
    letterPeakTrough: `Your phone rings after a hailstorm. It barely rings in March.`,
    faq1Closing: 'roofers',
    faq4Question: 'Do you work with trades besides roofing?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Roofing is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary roofing search',
    finalCtaWebsite: 'your roofing website',
    footerDesc: 'residential roofing owners',
    footerTagline: 'BUILT FOR ROOFING',
  },

  'garage-door': {
    titleNoun: 'garage doors',
    metaOwnerDesc: 'residential garage door owners',
    heroQuery: 'garage door repair near me',
    primaryXSearch: 'primary garage door search',
    authorityComment: 'GARAGE DOOR OWNERS',
    authorityH2: 'garage door business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$3,500 new door install.</strong> The opener-upgrade jobs that pay you for years',
    authorityPara3SlowMonth: 'between cold snaps',
    authorityPara4Revenue: 'spring replacements and new door installs',
    truthPara1: `You didn't start your garage door company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle the week after a cold snap.`,
    truthPara5PeakTrough: 'stays busy after a freeze and panics in May',
    truthPara6HighTicket: '$3,500 new door install',
    truthPara6Obvious: 'the obvious garage door pro in your zip code',
    introCardBullet: 'A high-converting garage door website built to book jobs.',
    stack01Title: 'High-converting garage door website',
    stack01Sub: 'Built to book emergency calls, new door quotes, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local garage door pins',
    timeline30Search: 'your main garage door search',
    timeline60Slow: 'Even between cold snaps',
    letterRe: 'Why garage door marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Garage Door Owner,',
    letterPara1Trade: 'Most garage door owners I talk to have the same story.',
    letterPivot: 'Garage door marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a garage door business that has to make payroll between cold snaps.',
    letterPeakTrough: `Your phone rings the first cold morning of winter. It barely rings in May.`,
    faq1Closing: 'garage door pros',
    faq4Question: 'Do you work with trades besides garage doors?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Garage doors are what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary garage door search',
    finalCtaWebsite: 'your garage door website',
    footerDesc: 'residential garage door owners',
    footerTagline: 'BUILT FOR GARAGE DOORS',
  },

  'pest-control': {
    titleNoun: 'pest control',
    metaOwnerDesc: 'residential pest control owners',
    heroQuery: 'exterminator near me',
    primaryXSearch: 'primary pest control search',
    authorityComment: 'PEST CONTROL OWNERS',
    authorityH2: 'pest control business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$2,500 termite treatment.</strong> The quarterly contract that pays you for years',
    authorityPara3SlowMonth: 'in November',
    authorityPara4Revenue: 'termite treatments and quarterly contracts',
    truthPara1: `You didn't start your pest control company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in November.`,
    truthPara5PeakTrough: 'stays busy in summer and panics in November',
    truthPara6HighTicket: '$2,500 termite treatment',
    truthPara6Obvious: 'the obvious exterminator in your zip code',
    introCardBullet: 'A high-converting pest control website built to book jobs.',
    stack01Title: 'High-converting pest control website',
    stack01Sub: 'Built to book urgent calls, recurring contracts, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local pest control pins',
    timeline30Search: 'your main pest control search',
    timeline60Slow: 'Even in the off-season',
    letterRe: 'Why pest control marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Pest Control Owner,',
    letterPara1Trade: 'Most pest control owners I talk to have the same story.',
    letterPivot: 'Pest control marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a pest control business that has to make payroll between summer surges.',
    letterPeakTrough: `Your phone rings in July. It barely rings in November.`,
    faq1Closing: 'pest control pros',
    faq4Question: 'Do you work with trades besides pest control?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Pest control is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary pest control search',
    finalCtaWebsite: 'your pest control website',
    footerDesc: 'residential pest control owners',
    footerTagline: 'BUILT FOR PEST CONTROL',
  },

  landscaping: {
    titleNoun: 'landscaping',
    metaOwnerDesc: 'residential landscaping owners',
    heroQuery: 'landscaper near me',
    primaryXSearch: 'primary landscaping search',
    authorityComment: 'LANDSCAPING OWNERS',
    authorityH2: 'landscaping business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$15,000 hardscape install.</strong> The maintenance contract that pays you for years',
    authorityPara3SlowMonth: 'in November',
    authorityPara4Revenue: 'hardscape installs and seasonal maintenance contracts',
    truthPara1: `You didn't start your landscaping company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in November.`,
    truthPara5PeakTrough: 'stays busy in May and panics in November',
    truthPara6HighTicket: '$15,000 hardscape install',
    truthPara6Obvious: 'the obvious landscaper in your zip code',
    introCardBullet: 'A high-converting landscaping website built to book jobs.',
    stack01Title: 'High-converting landscaping website',
    stack01Sub: 'Built to book maintenance calls, hardscape quotes, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local landscaping pins',
    timeline30Search: 'your main landscaping search',
    timeline60Slow: 'Even in the off-season',
    letterRe: 'Why landscaping marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Landscaping Owner,',
    letterPara1Trade: 'Most landscaping owners I talk to have the same story.',
    letterPivot: 'Landscaping marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a landscaping business that has to make payroll in November.',
    letterPeakTrough: `Your phone rings in May. It barely rings in November.`,
    faq1Closing: 'landscapers',
    faq4Question: 'Do you work with trades besides landscaping?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Landscaping is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary landscaping search',
    finalCtaWebsite: 'your landscaping website',
    footerDesc: 'residential landscaping owners',
    footerTagline: 'BUILT FOR LANDSCAPING',
  },

  pool: {
    titleNoun: 'pool service',
    metaOwnerDesc: 'residential pool service owners',
    heroQuery: 'pool service near me',
    primaryXSearch: 'primary pool service search',
    authorityComment: 'POOL SERVICE OWNERS',
    authorityH2: 'pool service business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$8,000 liner replacement.</strong> The weekly service contract that pays you for years',
    authorityPara3SlowMonth: 'in November',
    authorityPara4Revenue: 'liner replacements and weekly service contracts',
    truthPara1: `You didn't start your pool service company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in November.`,
    truthPara5PeakTrough: 'stays busy in June and panics in November',
    truthPara6HighTicket: '$8,000 liner replacement',
    truthPara6Obvious: 'the obvious pool pro in your zip code',
    introCardBullet: 'A high-converting pool service website built to book jobs.',
    stack01Title: 'High-converting pool service website',
    stack01Sub: 'Built to book service calls, equipment quotes, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local pool pins',
    timeline30Search: 'your main pool service search',
    timeline60Slow: 'Even in the off-season',
    letterRe: 'Why pool service marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Pool Service Owner,',
    letterPara1Trade: 'Most pool service owners I talk to have the same story.',
    letterPivot: 'Pool service marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a pool service business that has to make payroll in November.',
    letterPeakTrough: `Your phone rings in June. It barely rings in November.`,
    faq1Closing: 'pool pros',
    faq4Question: 'Do you work with trades besides pool service?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Pool service is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary pool service search',
    finalCtaWebsite: 'your pool service website',
    footerDesc: 'residential pool service owners',
    footerTagline: 'BUILT FOR POOL SERVICE',
  },

  cleaning: {
    titleNoun: 'cleaning',
    metaOwnerDesc: 'residential cleaning owners',
    heroQuery: 'house cleaning near me',
    primaryXSearch: 'primary cleaning search',
    authorityComment: 'CLEANING OWNERS',
    authorityH2: 'cleaning business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$1,200 deep clean.</strong> The recurring contract that pays you for years',
    authorityPara3SlowMonth: 'the first week of January',
    authorityPara4Revenue: 'recurring contracts and move-in/out jobs',
    truthPara1: `You didn't start your cleaning company so you could chase Angi leads on a Sunday night. You didn't buy the second van so it could sit idle the first week of January.`,
    truthPara5PeakTrough: 'stays busy through move-out season and panics every January',
    truthPara6HighTicket: '$1,200 deep clean',
    truthPara6Obvious: 'the obvious cleaner in your zip code',
    introCardBullet: 'A high-converting cleaning website built to book jobs.',
    stack01Title: 'High-converting cleaning website',
    stack01Sub: 'Built to book recurring contracts, deep cleans, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local cleaning pins',
    timeline30Search: 'your main cleaning search',
    timeline60Slow: 'Even in slow weeks',
    letterRe: 'Why cleaning marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Cleaning Owner,',
    letterPara1Trade: 'Most cleaning owners I talk to have the same story.',
    letterPivot: 'Cleaning marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a cleaning business that has to make payroll the first week of January.',
    letterPeakTrough: `Your phone rings the week of a move-out. It barely rings the first week of January.`,
    faq1Closing: 'cleaning companies',
    faq4Question: 'Do you work with trades besides cleaning?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Cleaning is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary cleaning search',
    finalCtaWebsite: 'your cleaning website',
    footerDesc: 'residential cleaning owners',
    footerTagline: 'BUILT FOR CLEANING',
  },

  painting: {
    titleNoun: 'painting',
    metaOwnerDesc: 'residential painting owners',
    heroQuery: 'painters near me',
    primaryXSearch: 'primary painting search',
    authorityComment: 'PAINTING OWNERS',
    authorityH2: 'painting business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$8,000 exterior repaint.</strong> The cabinet refinish that pays you for years',
    authorityPara3SlowMonth: 'in February',
    authorityPara4Revenue: 'exterior repaints and cabinet refinishes',
    truthPara1: `You didn't start your painting company so you could chase Angi leads on a Sunday night. You didn't buy the second van so it could sit idle in February.`,
    truthPara5PeakTrough: 'stays busy in May and panics in January',
    truthPara6HighTicket: '$8,000 exterior repaint',
    truthPara6Obvious: 'the obvious painter in your zip code',
    introCardBullet: 'A high-converting painting website built to book jobs.',
    stack01Title: 'High-converting painting website',
    stack01Sub: 'Built to book project quotes, exterior bids, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local painting pins',
    timeline30Search: 'your main painting search',
    timeline60Slow: 'Even in winter months',
    letterRe: 'Why painting marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Painting Owner,',
    letterPara1Trade: 'Most painting owners I talk to have the same story.',
    letterPivot: 'Painting marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a painting business that has to make payroll in February.',
    letterPeakTrough: `Your phone rings in May. It barely rings in January.`,
    faq1Closing: 'painters',
    faq4Question: 'Do you work with trades besides painting?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Painting is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary painting search',
    finalCtaWebsite: 'your painting website',
    footerDesc: 'residential painting owners',
    footerTagline: 'BUILT FOR PAINTING',
  },

  handyman: {
    titleNoun: 'handyman work',
    metaOwnerDesc: 'residential handyman businesses',
    heroQuery: 'handyman near me',
    primaryXSearch: 'primary handyman search',
    authorityComment: 'HANDYMEN',
    authorityH2: 'handyman business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$2,000 full-day project.</strong> The repeat customer that pays you for years',
    authorityPara3SlowMonth: 'the second week of January',
    authorityPara4Revenue: 'full-day projects and repeat-customer bookings',
    truthPara1: `You didn't start your handyman business so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle the second week of January.`,
    truthPara5PeakTrough: 'stays booked through the holidays and panics every January',
    truthPara6HighTicket: '$2,000 full-day project',
    truthPara6Obvious: 'the obvious handyman in your zip code',
    introCardBullet: 'A high-converting handyman website built to book jobs.',
    stack01Title: 'High-converting handyman website',
    stack01Sub: 'Built to book project quotes, full-day jobs, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local handyman pins',
    timeline30Search: 'your main handyman search',
    timeline60Slow: 'Even in slow weeks',
    letterRe: 'Why handyman marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Handyman,',
    letterPara1Trade: 'Most handymen I talk to have the same story.',
    letterPivot: 'Handyman marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a handyman business that has to make payroll the second week of January.',
    letterPeakTrough: `Your phone rings the week before Thanksgiving. It barely rings the second week of January.`,
    faq1Closing: 'handymen',
    faq4Question: 'Do you work with trades besides handyman work?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Handyman work is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary handyman search',
    finalCtaWebsite: 'your handyman website',
    footerDesc: 'residential handyman businesses',
    footerTagline: 'BUILT FOR HANDYMAN',
  },

  flooring: {
    titleNoun: 'flooring',
    metaOwnerDesc: 'residential flooring owners',
    heroQuery: 'flooring installer near me',
    primaryXSearch: 'primary flooring search',
    authorityComment: 'FLOORING OWNERS',
    authorityH2: 'flooring business owners',
    authorityPara1HighTicket: 'the <strong style="color: var(--forest-deep);">$12,000 whole-home install.</strong> The refinish job that pays you for years',
    authorityPara3SlowMonth: 'in February',
    authorityPara4Revenue: 'whole-home installs and refinish jobs',
    truthPara1: `You didn't start your flooring company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in February.`,
    truthPara5PeakTrough: 'stays busy in fall and panics in February',
    truthPara6HighTicket: '$12,000 whole-home install',
    truthPara6Obvious: 'the obvious flooring pro in your zip code',
    introCardBullet: 'A high-converting flooring website built to book jobs.',
    stack01Title: 'High-converting flooring website',
    stack01Sub: 'Built to book install quotes, refinish bids, financing, reviews. Mobile-first. Yours.',
    stack02LocalPins: 'local flooring pins',
    timeline30Search: 'your main flooring search',
    timeline60Slow: 'Even in slow months',
    letterRe: 'Why flooring marketing has felt <strong>broken</strong> for so long.',
    letterGreeting: 'Dear Flooring Owner,',
    letterPara1Trade: 'Most flooring owners I talk to have the same story.',
    letterPivot: 'Flooring marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a flooring business that has to make payroll in February.',
    letterPeakTrough: `Your phone rings in fall. It barely rings in February.`,
    faq1Closing: 'flooring pros',
    faq4Question: 'Do you work with trades besides flooring?',
    faq4Answer: `Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Flooring is what this page is built for. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.`,
    guaranteeBody: 'your primary flooring search',
    finalCtaWebsite: 'your flooring website',
    footerDesc: 'residential flooring owners',
    footerTagline: 'BUILT FOR FLOORING',
  },
};

// Strict find/replace pairs based on hvac.html. Each FIND must be a unique
// string in hvac.html so the replacement is unambiguous.
function buildSwaps(slug, t) {
  return [
    // === HEAD META ===
    [
      `<title>Hikmon — Top 3 on Google Maps in 30 days for residential HVAC, or every month after is free</title>`,
      `<title>Hikmon — Top 3 on Google Maps in 30 days for residential ${t.titleNoun}, or every month after is free</title>`,
    ],
    [
      `<meta name="description" content="The Demand Capture Engine for residential HVAC owners. $397 / 4 weeks, or $3,564 upfront for the year (save $1,200). No setup fee. Top 3 on Google in 30 days, or every month after is free until you rank." />`,
      `<meta name="description" content="The Demand Capture Engine for ${t.metaOwnerDesc}. $397 / 4 weeks, or $3,564 upfront for the year (save $1,200). No setup fee. Top 3 on Google in 30 days, or every month after is free until you rank." />`,
    ],
    [
      `<link rel="canonical" href="https://hikmon.com/hvac.html" />`,
      `<link rel="canonical" href="https://hikmon.com/${slug}.html" />`,
    ],

    // === HERO SUBHEAD ===
    [
      `Right now, when a homeowner in your zip code Googles &ldquo;HVAC repair near me,&rdquo;`,
      `Right now, when a homeowner in your zip code Googles &ldquo;${t.heroQuery},&rdquo;`,
    ],

    // === GUARANTEE CARD (hero) ===
    [
      `<div class="text-[13px] mt-1" style="color: var(--ash);">primary HVAC search, your area</div>`,
      `<div class="text-[13px] mt-1" style="color: var(--ash);">${t.primaryXSearch}, your area</div>`,
    ],

    // === WITHOUT-COMPARISON CARD (hero) ===
    [
      `<span>Your phone goes quiet in February.</span>`,
      `<span>Your phone goes quiet ${t.authorityPara3SlowMonth}.</span>`,
    ],

    // === AUTHORITY SECTION ===
    [
      `<!-- ================== AUTHORITY: I'VE BUILT SOMETHING MOST HVAC OWNERS ONLY DREAM ABOUT ================== -->`,
      `<!-- ================== AUTHORITY: I'VE BUILT SOMETHING MOST ${t.authorityComment} ONLY DREAM ABOUT ================== -->`,
    ],
    [
      `I've built something most HVAC business owners <span style="color: var(--amber-rich); font-style: italic;">only dream about.</span>`,
      `I've built something most ${t.authorityH2} <span style="color: var(--amber-rich); font-style: italic;">only dream about.</span>`,
    ],
    [
      `Right now, the best jobs in your market are going somewhere else. The <strong style="color: var(--forest-deep);">$12,000 replacement.</strong> The maintenance plan that pays you for years. They're getting booked &mdash; just not by you.`,
      `Right now, the best jobs in your market are going somewhere else. ${t.authorityPara1HighTicket}. They're getting booked &mdash; just not by you.`,
    ],
    [
      `So you pay for Angi leads that go nowhere. You watch the company down the street &mdash; with worse reviews and weaker work &mdash; show up first on Google. You wonder why the phone goes quiet in February when the bills don't.`,
      `So you pay for Angi leads that go nowhere. You watch the company down the street &mdash; with worse reviews and weaker work &mdash; show up first on Google. You wonder why the phone goes quiet ${t.authorityPara3SlowMonth} when the bills don't.`,
    ],
    [
      `The owners who pull ahead aren't working more hours. They built a real local engine &mdash; Google Business Profile, reviews, service-area pages, a fast site &mdash; that brings replacement jobs and maintenance plans in on autopilot.`,
      `The owners who pull ahead aren't working more hours. They built a real local engine &mdash; Google Business Profile, reviews, service-area pages, a fast site &mdash; that brings ${t.authorityPara4Revenue} in on autopilot.`,
    ],

    // === TRUTH SECTION ===
    [
      `You didn't start your HVAC company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in February.`,
      t.truthPara1,
    ],
    [
      `It turns your Google Business Profile and your website into one working asset. The homeowner searching for "AC repair near me" at 7am finds you first. Trusts you in 10 seconds. Books before lunch.`,
      `It turns your Google Business Profile and your website into one working asset. The homeowner searching for "${t.heroQuery}" at 7am finds you first. Trusts you in 10 seconds. Books before lunch.`,
    ],
    [
      `That's the difference between a company that grows in every season &mdash; and a company that just stays busy in July and panics in February.`,
      `That's the difference between a company that grows in every season &mdash; and a company that just ${t.truthPara5PeakTrough}.`,
    ],
    [
      `You stop renting leads from Angi. You stop wondering if your missed call was a $12,000 install. You become <strong style="color: var(--forest-deep);">the obvious HVAC choice in your zip code.</strong>`,
      `You stop renting leads from Angi. You stop wondering if your missed call was a ${t.truthPara6HighTicket}. You become <strong style="color: var(--forest-deep);">${t.truthPara6Obvious}.</strong>`,
    ],

    // === INTRO CARD BULLET ===
    [
      `<div><div class="font-semibold" style="font-size: 16px; color: var(--forest-deep);">A high-converting HVAC website built to book jobs.</div></div>`,
      `<div><div class="font-semibold" style="font-size: 16px; color: var(--forest-deep);">${t.introCardBullet}</div></div>`,
    ],

    // === STACK ITEM 01 ===
    [
      `<div class="stack-title">High-converting HVAC website</div>`,
      `<div class="stack-title">${t.stack01Title}</div>`,
    ],
    [
      `<div class="stack-sub">Built to book emergency calls, replacement quotes, financing, reviews. Mobile-first. Yours.</div>`,
      `<div class="stack-sub">${t.stack01Sub}</div>`,
    ],

    // === STACK ITEM 02 ===
    [
      `<div class="stack-sub">Categories. 30 services. Photos. Q&amp;A. Description. Out-indexes 90% of local HVAC pins.</div>`,
      `<div class="stack-sub">Categories. 30 services. Photos. Q&amp;A. Description. Out-indexes 90% of ${t.stack02LocalPins}.</div>`,
    ],

    // === TIMELINE ===
    [
      `<p class="timeline-body">Your Google Maps pin shows up first for your main HVAC search. If we miss, every month after is free until you rank.</p>`,
      `<p class="timeline-body">Your Google Maps pin shows up first for ${t.timeline30Search}. If we miss, every month after is free until you rank.</p>`,
    ],
    [
      `<p class="timeline-body">Booked calls stay steady. Even in shoulder season. You stop paying for Angi leads. Your cost per booked call drops.</p>`,
      `<p class="timeline-body">Booked calls stay steady. ${t.timeline60Slow}. You stop paying for Angi leads. Your cost per booked call drops.</p>`,
    ],

    // === LETTER ===
    [
      `<div class="letter-re">Why HVAC marketing has felt <strong>broken</strong> for so long.</div>`,
      `<div class="letter-re">${t.letterRe}</div>`,
    ],
    [
      `<div class="letter-greeting">Dear HVAC Owner,</div>`,
      `<div class="letter-greeting">${t.letterGreeting}</div>`,
    ],
    [
      `<p>If you've ever paid for marketing and felt like nothing happened, you're not the only one. Most HVAC owners I talk to have the same story.</p>`,
      `<p>If you've ever paid for marketing and felt like nothing happened, you're not the only one. ${t.letterPara1Trade}</p>`,
    ],
    [
      `<p><strong>HVAC marketing has felt broken because the way agencies price it was built for SaaS companies. Not for an HVAC business that has to make payroll in February.</strong></p>`,
      `<p><strong>${t.letterPivot}</strong></p>`,
    ],
    [
      `<p>SaaS companies make the same money every month. You don't. Your phone rings in July. It barely rings in February. But the agency bill is the same in both months.</p>`,
      `<p>SaaS companies make the same money every month. You don't. ${t.letterPeakTrough} But the agency bill is the same in both months.</p>`,
    ],

    // === FAQ ===
    [
      `<p class="faq-answer">No catch. The big agencies charge $3,000&ndash;$8,000 a month plus a $5,000&ndash;$15,000 setup fee. They built that pricing for SaaS clients. We built ours for HVAC. Low monthly. No setup. Cancel anytime. We make our money over a long client relationship, not by extracting it upfront from one.</p>`,
      `<p class="faq-answer">No catch. The big agencies charge $3,000&ndash;$8,000 a month plus a $5,000&ndash;$15,000 setup fee. They built that pricing for SaaS clients. We built ours for ${t.faq1Closing}. Low monthly. No setup. Cancel anytime. We make our money over a long client relationship, not by extracting it upfront from one.</p>`,
    ],
    [
      `<span class="faq-question">Do you work with trades besides HVAC?</span>`,
      `<span class="faq-question">${t.faq4Question}</span>`,
    ],
    [
      `<p class="faq-answer">Yes. We help every home service trade — plumbing, electrical, roofing, and more. HVAC is what we know best, and this page is built for HVAC. The same 30-day guarantee works for every trade we take on. See <a href="/" style="color: var(--amber-rich); text-decoration: underline;">hikmon.com</a> for the full picture.</p>`,
      `<p class="faq-answer">${t.faq4Answer}</p>`,
    ],

    // === GUARANTEE ===
    [
      `If we don't rank you top 3 on Google Maps for your primary HVAC search by day 30,`,
      `If we don't rank you top 3 on Google Maps for ${t.guaranteeBody} by day 30,`,
    ],

    // === FINAL CTA ===
    [
      `We build a real, working demo of your HVAC website &mdash; free, before you pay a dollar.`,
      `We build a real, working demo of ${t.finalCtaWebsite} &mdash; free, before you pay a dollar.`,
    ],

    // === FOOTER ===
    [
      `The Demand Capture Engine for residential HVAC owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`,
      `The Demand Capture Engine for ${t.footerDesc}. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`,
    ],
    [
      `BUILT FOR HVAC · OWNED, NOT RENTED`,
      `${t.footerTagline} · OWNED, NOT RENTED`,
    ],
  ];
}

function buildTrade(slug) {
  const t = TRADES[slug];
  if (!t) {
    console.error(`Unknown trade: ${slug}`);
    process.exit(1);
  }

  const src = fs.readFileSync(SOURCE, 'utf-8');
  let html = src;
  const missing = [];

  for (const [find, replace] of buildSwaps(slug, t)) {
    if (!html.includes(find)) {
      missing.push(find.slice(0, 80));
      continue;
    }
    html = html.replace(find, replace);
  }

  const outPath = path.join(__dirname, `${slug}.html`);
  fs.writeFileSync(outPath, html);

  // Sanity check: any stray HVAC reference is a bug.
  const strayHvac = html.match(/HVAC/gi) || [];
  const strayMonth = html.match(/\bFebruary\b/gi) || [];
  const strayJuly = html.match(/\bJuly\b/gi) || [];
  const strayAc = html.match(/AC repair/gi) || [];

  return {
    slug,
    out: outPath,
    missingFinds: missing,
    strayHvac: strayHvac.length,
    strayFebruary: strayMonth.length,
    strayJuly: strayJuly.length,
    strayAc: strayAc.length,
  };
}

const arg = process.argv[2];
const slugs = arg ? [arg] : Object.keys(TRADES);

const results = slugs.map(buildTrade);

console.log('\nBuild summary:');
console.log('================');
for (const r of results) {
  const status = (r.missingFinds.length === 0 && r.strayHvac === 0) ? '✓' : '✗';
  console.log(`${status}  ${r.slug.padEnd(14)} → ${path.basename(r.out)}  (HVAC refs: ${r.strayHvac}, missed swaps: ${r.missingFinds.length})`);
  if (r.missingFinds.length > 0) {
    console.log(`     missed: ${r.missingFinds.slice(0, 3).join(' | ')}`);
  }
  if (r.strayHvac > 0) {
    console.log(`     ⚠ ${r.strayHvac} stray HVAC reference(s) remaining`);
  }
}
console.log('');
