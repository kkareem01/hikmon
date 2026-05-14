# Trade Copy — Source of Truth

Canonical per-trade copy for the 12 trade landing pages. Edit copy **here first**, then propagate to each `<trade>.html` file.

## Propagation rules

- Every trade-specific block in the HTML is wrapped with `<!-- TRADE-COPY-BLOCK: <id> --> ... <!-- /TRADE-COPY-BLOCK -->` markers.
- To propagate a copy change: edit the field below, then `grep -n "TRADE-COPY-BLOCK: <id>" Hikmon\ Website/*.html` to find every matching block across all 12 pages and update each.
- "Universal copy" (below) is identical across all 12 files. If you change anything there, propagate to ALL 12 files.
- Per-trade fields are unique to one file. Only that file gets updated when the field changes.

## Universal copy (identical across all 12 files)

**Hero H1** (lines 1620–1621 in source):
> Get top 3 on Google in 30 days, or we work for free until you do.

**Eyebrow** (line 1615): `The Demand Capture Engine`

**Hero CTA**: `Get my free demo site`

**Trust strip** (lines 1641–1645): `NO SETUP FEE · EVER · 30-DAY GUARANTEE · CANCEL ANYTIME`

**Guarantee card "Result"**: `Top 3 on Google Maps`
**Guarantee card "Timeline"**: `30 days`
**Guarantee card "If we miss"**: `Every month free` / `until you're top 3`

**Without/With comparison** (lines 1700–1719): five rows each, universal copy across trades.

**Offer card 8 bullets** (lines 1820–1853): bullet 1 is trade-specific (see Stack item 01 below); bullets 2–8 are universal.

**Value stack items 02–06** (lines 1909–1994): titles/subs are universal (only item 02 sub line 1919 has a trade noun — see per-trade fields).

**Stack total reveal** (line 2000): `Total $6,200 of value for only $397 / 4 weeks today.`

**FAQ #2, #3, #5, #6, #7** (lines 2136–2207): universal copy across trades.

**30-Day Guarantee H2** (line 2228): `Top 3 in 30 days. Or every month after is free.`

**Final CTA H2** (lines 2252–2254): `Get top 3 on Google in 30 days. Or every month after is free.`

**Final CTA trust strip** (lines 2270–2274): `$297–$397 / 4 weeks · NO SETUP FEE · CANCEL ANYTIME`

**Footer copyright** (line 2340): `© 2026 HIKMON · ALL RIGHTS RESERVED`

**Footer ownership tag suffix** (line 2343): `· OWNED, NOT RENTED` (the `BUILT FOR <TRADE>` prefix is per-trade)

---

## Field reference (one row = one HTML line that swaps per trade)

| Tag ID | HTML line | What goes here |
|---|---|---|
| `title` | 6 | `<title>` content |
| `meta-description` | 7 | meta description |
| `canonical` | 8 | canonical URL slug |
| `hero-subhead-query` | 1626 | Trade's #1 high-intent Google search verbatim |
| `guarantee-card-search` | 1669 | "primary X search" in hero guarantee card |
| `authority-h2` | 1730 | "Most X business owners only dream..." H2 |
| `authority-high-ticket` | 1735 | High-ticket archetype + recurring revenue mention |
| `authority-slow-month` | 1741 | "phone goes quiet in X" |
| `authority-anchor-revenue` | 1744 | Anchor revenue pair (high-ticket + recurring) |
| `truth-paragraph-1-slow` | 1772 | "Y company...second truck...sit idle in X" |
| `truth-paragraph-4-query` | 1781 | Same query as line 1626 |
| `truth-peak-trough` | 1784 | Trade's peak/trough month pair |
| `truth-high-ticket` | 1787 | High-ticket dollar archetype + "obvious X choice" |
| `intro-card-bullet` | 1823 | "high-converting X website" |
| `stack-item-01-title` | 1903 | "High-converting X website" |
| `stack-item-01-sub` | 1904 | "Built to book X, X, financing, reviews. Mobile-first. Yours." |
| `stack-item-02-sub` | 1919 | "Out-indexes 90% of local X pins" |
| `timeline-30day-search` | 2035 | "your main X search" |
| `timeline-60day-shoulder` | 2041 | "Even in shoulder season" / "Even in slow weeks" |
| `letter-re` | 2073 | "Why X marketing has felt broken for so long" |
| `letter-greeting` | 2076 | "Dear X Owner," |
| `letter-paragraph-1` | 2079 | "Most X owners I talk to..." |
| `letter-pivot` | 2089 | "X marketing has felt broken because...for an X business that has to make payroll in Y" |
| `letter-peak-trough` | 2091 | Trade's peak/trough narrative voice |
| `faq-1-closing` | 2132 | "We built ours for X" |
| `faq-4-question` | 2162 | "Do you work with trades besides X?" |
| `faq-4-answer` | 2168 | "We help every home service trade — A, B, C..." (rotate to omit current trade) |
| `guarantee-body-search` | 2231 | "your primary X search" |
| `final-cta-body` | 2257 | "your X website" |
| `footer-description` | 2297 | "The Demand Capture Engine for residential X owners." |
| `footer-tagline` | 2343 | "BUILT FOR X" |

Also per trade but separate from the HTML markers:
- **Top 5 services** (pull from welcome.html `TRADE_SERVICES`, lines 758–883)
- **LocalBusiness schema serviceType** (for future schema work — not in HTML yet)
- **OG image filename** (for future asset work — not in HTML yet)

---

## HVAC

### Slug & canonical
`hvac` → `hvac.html` → `https://hikmon.com/hvac.html`

### Trade noun forms
- Sentence: `HVAC` (always uppercase)
- Owner address: `HVAC Owner` / `HVAC owners`
- Company form: `your HVAC company`
- Obvious-X form: `the obvious HVAC choice in your zip code`
- Footer caps: `BUILT FOR HVAC`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential HVAC, or every month after is free`

### meta-description
`The Demand Capture Engine for residential HVAC owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`HVAC repair near me`

### authority-high-ticket
`the $12,000 replacement. The maintenance plan that pays you for years.`

### authority-slow-month
`in February`

### authority-anchor-revenue
`replacement jobs and maintenance plans`

### truth-paragraph-1-slow (full sentence)
`You didn't start your HVAC company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in February.`

### truth-paragraph-4-query
`AC repair near me`

### truth-peak-trough
`stays busy in July and panics in February`

### truth-high-ticket
`$12,000 install` (paired with `the obvious HVAC choice in your zip code`)

### stack-item-01-sub
`Built to book emergency calls, replacement quotes, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local HVAC pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in shoulder season.`

### letter-re
`Why HVAC marketing has felt broken for so long.`

### letter-greeting
`Dear HVAC Owner,`

### letter-paragraph-1
`Most HVAC owners I talk to have the same story.`

### letter-pivot
`HVAC marketing has felt broken because the way agencies price it was built for SaaS companies. Not for an HVAC business that has to make payroll in February.`

### letter-peak-trough
`Your phone rings in July. It barely rings in February.`

### faq-1-closing
`We built ours for HVAC.`

### faq-4-question
`Do you work with trades besides HVAC?`

### faq-4-answer
`Yes. We help every home service trade — plumbing, electrical, roofing, and more. HVAC is what we know best, and this page is built for HVAC. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary HVAC search`

### final-cta-body
`We build a real, working demo of your HVAC website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential HVAC owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR HVAC · OWNED, NOT RENTED`

### Top 5 services
1. AC repair
2. AC install / replace
3. Furnace repair
4. Furnace install / replace
5. Emergency / 24-7

### Schema serviceType
`HVACBusiness`

### OG image
`og-hvac.jpg` (1200x630) — HVAC technician + outdoor condenser unit, daylight

---

## Plumbing

### Slug & canonical
`plumbing` → `plumbing.html` → `https://hikmon.com/plumbing.html`

### Trade noun forms
- Sentence: `plumbing`
- Owner address: `Plumbing Owner` / `plumbing owners`
- Company form: `your plumbing company`
- Obvious-X form: `the obvious plumber in your zip code`
- Footer caps: `BUILT FOR PLUMBING`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential plumbing, or every month after is free`

### meta-description
`The Demand Capture Engine for residential plumbing owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`emergency plumber near me`

### authority-high-ticket
`the $8,000 repipe. The water-heater install that pays you for years.`

### authority-slow-month
`between burst-pipe weeks`

### authority-anchor-revenue
`repipes, water-heater installs, and maintenance plans`

### truth-paragraph-1-slow (full sentence)
`You didn't start your plumbing company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle the week after a cold snap.`

### truth-paragraph-4-query
`emergency plumber near me`

### truth-peak-trough
`stays busy during a freeze and panics every spring`

### truth-high-ticket
`$8,000 repipe` (paired with `the obvious plumber in your zip code`)

### stack-item-01-sub
`Built to book emergency calls, repipe quotes, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local plumbing pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even between cold snaps.`

### letter-re
`Why plumbing marketing has felt broken for so long.`

### letter-greeting
`Dear Plumbing Owner,`

### letter-paragraph-1
`Most plumbing owners I talk to have the same story.`

### letter-pivot
`Plumbing marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a plumbing business that has to make payroll between busy weeks.`

### letter-peak-trough
`Your phone rings during a cold snap. It barely rings the week after.`

### faq-1-closing
`We built ours for plumbers.`

### faq-4-question
`Do you work with trades besides plumbing?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, electrical, roofing, and more. Plumbing is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary plumbing search`

### final-cta-body
`We build a real, working demo of your plumbing website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential plumbing owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR PLUMBING · OWNED, NOT RENTED`

### Top 5 services
1. Drain cleaning
2. Water heater install
3. Repiping
4. Leak detection / slab leak repair
5. Emergency / 24-7

### Schema serviceType
`Plumber`

### OG image
`og-plumbing.jpg` (1200x630) — plumber working on a water heater, residential setting

---

## Electrical

### Slug & canonical
`electrical` → `electrical.html` → `https://hikmon.com/electrical.html`

### Trade noun forms
- Sentence: `electrical`
- Owner address: `Electrician` / `electricians`
- Company form: `your electrical company`
- Obvious-X form: `the obvious electrician in your zip code`
- Footer caps: `BUILT FOR ELECTRICAL`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential electrical, or every month after is free`

### meta-description
`The Demand Capture Engine for residential electrical contractors. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`electrician near me`

### authority-high-ticket
`the $6,000 panel upgrade. The generator install that pays you for years.`

### authority-slow-month
`between storm weeks`

### authority-anchor-revenue
`panel upgrades and EV charger installs`

### truth-paragraph-1-slow (full sentence)
`You didn't start your electrical company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle between storms.`

### truth-paragraph-4-query
`electrician near me`

### truth-peak-trough
`stays busy after a storm and panics the next quiet week`

### truth-high-ticket
`$6,000 panel upgrade` (paired with `the obvious electrician in your zip code`)

### stack-item-01-sub
`Built to book emergency calls, panel upgrade quotes, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local electrical pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even between storms.`

### letter-re
`Why electrical marketing has felt broken for so long.`

### letter-greeting
`Dear Electrician,`

### letter-paragraph-1
`Most electricians I talk to have the same story.`

### letter-pivot
`Electrical marketing has felt broken because the way agencies price it was built for SaaS companies. Not for an electrical business that has to make payroll between storm weeks.`

### letter-peak-trough
`Your phone rings after a storm. It barely rings the next quiet week.`

### faq-1-closing
`We built ours for electricians.`

### faq-4-question
`Do you work with trades besides electrical?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, roofing, and more. Electrical is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary electrical search`

### final-cta-body
`We build a real, working demo of your electrical website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential electrical contractors. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR ELECTRICAL · OWNED, NOT RENTED`

### Top 5 services
1. Panel upgrade
2. EV charger install
3. Generator install
4. Lighting install
5. Emergency / 24-7

### Schema serviceType
`Electrician`

### OG image
`og-electrical.jpg` (1200x630) — electrician working on a panel, residential setting

---

## Roofing

### Slug & canonical
`roofing` → `roofing.html` → `https://hikmon.com/roofing.html`

### Trade noun forms
- Sentence: `roofing`
- Owner address: `Roofing Owner` / `roofing owners`
- Company form: `your roofing company`
- Obvious-X form: `the obvious roofer in your zip code`
- Footer caps: `BUILT FOR ROOFING`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential roofing, or every month after is free`

### meta-description
`The Demand Capture Engine for residential roofing owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`roofers near me`

### authority-high-ticket
`the $18,000 roof replacement. The insurance claim that pays you for years.`

### authority-slow-month
`between storms`

### authority-anchor-revenue
`roof replacements and insurance claim jobs`

### truth-paragraph-1-slow (full sentence)
`You didn't start your roofing company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle between storms.`

### truth-paragraph-4-query
`roofers near me`

### truth-peak-trough
`stays busy after a storm and panics in March`

### truth-high-ticket
`$18,000 roof replacement` (paired with `the obvious roofer in your zip code`)

### stack-item-01-sub
`Built to book emergency calls, roof estimates, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local roofing pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even between storms.`

### letter-re
`Why roofing marketing has felt broken for so long.`

### letter-greeting
`Dear Roofing Owner,`

### letter-paragraph-1
`Most roofing owners I talk to have the same story.`

### letter-pivot
`Roofing marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a roofing business that has to make payroll between storm seasons.`

### letter-peak-trough
`Your phone rings after a hailstorm. It barely rings in March.`

### faq-1-closing
`We built ours for roofers.`

### faq-4-question
`Do you work with trades besides roofing?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Roofing is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary roofing search`

### final-cta-body
`We build a real, working demo of your roofing website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential roofing owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR ROOFING · OWNED, NOT RENTED`

### Top 5 services
1. Roof replacement
2. Roof repair
3. Storm damage repair
4. Insurance claims help
5. Emergency tarp

### Schema serviceType
`RoofingContractor`

### OG image
`og-roofing.jpg` (1200x630) — roofer on a residential roof, daylight

---

## Garage Door

### Slug & canonical
`garage-door` → `garage-door.html` → `https://hikmon.com/garage-door.html`

### Trade noun forms
- Sentence: `garage doors` (plural in title/meta); `garage door` (singular in compound nouns)
- Owner address: `Garage Door Owner` / `garage door owners`
- Company form: `your garage door company`
- Obvious-X form: `the obvious garage door pro in your zip code`
- Footer caps: `BUILT FOR GARAGE DOORS`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential garage doors, or every month after is free`

### meta-description
`The Demand Capture Engine for residential garage door owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`garage door repair near me`

### authority-high-ticket
`the $3,500 new door install. The opener-upgrade jobs that pay you for years.`

### authority-slow-month
`between cold snaps`

### authority-anchor-revenue
`spring replacements and new door installs`

### truth-paragraph-1-slow (full sentence)
`You didn't start your garage door company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle the week after a cold snap.`

### truth-paragraph-4-query
`garage door repair near me`

### truth-peak-trough
`stays busy after a freeze and panics in May`

### truth-high-ticket
`$3,500 new door install` (paired with `the obvious garage door pro in your zip code`)

### stack-item-01-sub
`Built to book emergency calls, new door quotes, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local garage door pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even between cold snaps.`

### letter-re
`Why garage door marketing has felt broken for so long.`

### letter-greeting
`Dear Garage Door Owner,`

### letter-paragraph-1
`Most garage door owners I talk to have the same story.`

### letter-pivot
`Garage door marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a garage door business that has to make payroll between cold snaps.`

### letter-peak-trough
`Your phone rings the first cold morning of winter. It barely rings in May.`

### faq-1-closing
`We built ours for garage door pros.`

### faq-4-question
`Do you work with trades besides garage doors?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Garage doors are what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary garage door search`

### final-cta-body
`We build a real, working demo of your garage door website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential garage door owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR GARAGE DOORS · OWNED, NOT RENTED`

### Top 5 services
1. Garage door repair
2. Spring replacement
3. Opener install
4. New door install
5. Emergency / 24-7

### Schema serviceType
`HomeAndConstructionBusiness`

### OG image
`og-garage-door.jpg` (1200x630) — residential garage with new door installed, daylight

---

## Pest Control

### Slug & canonical
`pest-control` → `pest-control.html` → `https://hikmon.com/pest-control.html`

### Trade noun forms
- Sentence: `pest control`
- Owner address: `Pest Control Owner` / `pest control owners`
- Company form: `your pest control company`
- Obvious-X form: `the obvious exterminator in your zip code`
- Footer caps: `BUILT FOR PEST CONTROL`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential pest control, or every month after is free`

### meta-description
`The Demand Capture Engine for residential pest control owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`exterminator near me`

### authority-high-ticket
`the $2,500 termite treatment. The quarterly contract that pays you for years.`

### authority-slow-month
`in November`

### authority-anchor-revenue
`termite treatments and quarterly contracts`

### truth-paragraph-1-slow (full sentence)
`You didn't start your pest control company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in November.`

### truth-paragraph-4-query
`exterminator near me`

### truth-peak-trough
`stays busy in summer and panics in November`

### truth-high-ticket
`$2,500 termite treatment` (paired with `the obvious exterminator in your zip code`)

### stack-item-01-sub
`Built to book urgent calls, recurring contracts, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local pest control pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in the off-season.`

### letter-re
`Why pest control marketing has felt broken for so long.`

### letter-greeting
`Dear Pest Control Owner,`

### letter-paragraph-1
`Most pest control owners I talk to have the same story.`

### letter-pivot
`Pest control marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a pest control business that has to make payroll between summer surges.`

### letter-peak-trough
`Your phone rings in July. It barely rings in November.`

### faq-1-closing
`We built ours for pest control pros.`

### faq-4-question
`Do you work with trades besides pest control?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Pest control is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary pest control search`

### final-cta-body
`We build a real, working demo of your pest control website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential pest control owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR PEST CONTROL · OWNED, NOT RENTED`

### Top 5 services
1. Termite treatment
2. Rodent control
3. Mosquito control
4. Quarterly maintenance
5. Emergency / urgent

### Schema serviceType
`HomeAndConstructionBusiness`

### OG image
`og-pest-control.jpg` (1200x630) — pest control tech servicing a residential exterior, daylight

---

## Landscaping

### Slug & canonical
`landscaping` → `landscaping.html` → `https://hikmon.com/landscaping.html`

### Trade noun forms
- Sentence: `landscaping`
- Owner address: `Landscaping Owner` / `landscaping owners`
- Company form: `your landscaping company`
- Obvious-X form: `the obvious landscaper in your zip code`
- Footer caps: `BUILT FOR LANDSCAPING`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential landscaping, or every month after is free`

### meta-description
`The Demand Capture Engine for residential landscaping owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`landscaper near me`

### authority-high-ticket
`the $15,000 hardscape install. The maintenance contract that pays you for years.`

### authority-slow-month
`in November`

### authority-anchor-revenue
`hardscape installs and seasonal maintenance contracts`

### truth-paragraph-1-slow (full sentence)
`You didn't start your landscaping company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in November.`

### truth-paragraph-4-query
`landscaper near me`

### truth-peak-trough
`stays busy in May and panics in November`

### truth-high-ticket
`$15,000 hardscape install` (paired with `the obvious landscaper in your zip code`)

### stack-item-01-sub
`Built to book maintenance calls, hardscape quotes, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local landscaping pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in the off-season.`

### letter-re
`Why landscaping marketing has felt broken for so long.`

### letter-greeting
`Dear Landscaping Owner,`

### letter-paragraph-1
`Most landscaping owners I talk to have the same story.`

### letter-pivot
`Landscaping marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a landscaping business that has to make payroll in November.`

### letter-peak-trough
`Your phone rings in May. It barely rings in November.`

### faq-1-closing
`We built ours for landscapers.`

### faq-4-question
`Do you work with trades besides landscaping?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Landscaping is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary landscaping search`

### final-cta-body
`We build a real, working demo of your landscaping website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential landscaping owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR LANDSCAPING · OWNED, NOT RENTED`

### Top 5 services
1. Lawn mowing
2. Hardscape (pavers / patio)
3. Irrigation install
4. Tree trimming
5. Maintenance plans

### Schema serviceType
`HomeAndConstructionBusiness`

### OG image
`og-landscaping.jpg` (1200x630) — finished residential hardscape patio + lawn, daylight

---

## Pool

### Slug & canonical
`pool` → `pool.html` → `https://hikmon.com/pool.html`

### Trade noun forms
- Sentence: `pool service`
- Owner address: `Pool Service Owner` / `pool service owners`
- Company form: `your pool service company`
- Obvious-X form: `the obvious pool pro in your zip code`
- Footer caps: `BUILT FOR POOL SERVICE`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential pool service, or every month after is free`

### meta-description
`The Demand Capture Engine for residential pool service owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`pool service near me`

### authority-high-ticket
`the $8,000 liner replacement. The weekly service contract that pays you for years.`

### authority-slow-month
`in November`

### authority-anchor-revenue
`liner replacements and weekly service contracts`

### truth-paragraph-1-slow (full sentence)
`You didn't start your pool service company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in November.`

### truth-paragraph-4-query
`pool service near me`

### truth-peak-trough
`stays busy in June and panics in November`

### truth-high-ticket
`$8,000 liner replacement` (paired with `the obvious pool pro in your zip code`)

### stack-item-01-sub
`Built to book service calls, equipment quotes, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local pool pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in the off-season.`

### letter-re
`Why pool service marketing has felt broken for so long.`

### letter-greeting
`Dear Pool Service Owner,`

### letter-paragraph-1
`Most pool service owners I talk to have the same story.`

### letter-pivot
`Pool service marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a pool service business that has to make payroll in November.`

### letter-peak-trough
`Your phone rings in June. It barely rings in November.`

### faq-1-closing
`We built ours for pool pros.`

### faq-4-question
`Do you work with trades besides pool service?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Pool service is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary pool service search`

### final-cta-body
`We build a real, working demo of your pool service website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential pool service owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR POOL SERVICE · OWNED, NOT RENTED`

### Top 5 services
1. Weekly service
2. Equipment repair
3. Pool opening
4. Pool closing
5. Liner replacement

### Schema serviceType
`HomeAndConstructionBusiness`

### OG image
`og-pool.jpg` (1200x630) — backyard residential pool, daylight, clean

---

## Cleaning

### Slug & canonical
`cleaning` → `cleaning.html` → `https://hikmon.com/cleaning.html`

### Trade noun forms
- Sentence: `cleaning`
- Owner address: `Cleaning Owner` / `cleaning owners`
- Company form: `your cleaning company`
- Obvious-X form: `the obvious cleaner in your zip code`
- Footer caps: `BUILT FOR CLEANING`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential cleaning, or every month after is free`

### meta-description
`The Demand Capture Engine for residential cleaning owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`house cleaning near me`

### authority-high-ticket
`the $1,200 deep clean. The recurring contract that pays you for years.`

### authority-slow-month
`the first week of January`

### authority-anchor-revenue
`recurring contracts and move-in/out jobs`

### truth-paragraph-1-slow (full sentence)
`You didn't start your cleaning company so you could chase Angi leads on a Sunday night. You didn't buy the second van so it could sit idle the first week of January.`

### truth-paragraph-4-query
`house cleaning near me`

### truth-peak-trough
`stays busy through move-out season and panics every January`

### truth-high-ticket
`$1,200 deep clean` (paired with `the obvious cleaner in your zip code`)

### stack-item-01-sub
`Built to book recurring contracts, deep cleans, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local cleaning pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in slow weeks.`

### letter-re
`Why cleaning marketing has felt broken for so long.`

### letter-greeting
`Dear Cleaning Owner,`

### letter-paragraph-1
`Most cleaning owners I talk to have the same story.`

### letter-pivot
`Cleaning marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a cleaning business that has to make payroll the first week of January.`

### letter-peak-trough
`Your phone rings the week of a move-out. It barely rings the first week of January.`

### faq-1-closing
`We built ours for cleaning companies.`

### faq-4-question
`Do you work with trades besides cleaning?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Cleaning is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary cleaning search`

### final-cta-body
`We build a real, working demo of your cleaning website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential cleaning owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR CLEANING · OWNED, NOT RENTED`

### Top 5 services
1. Recurring weekly
2. Deep cleaning
3. Move-in / move-out cleaning
4. Carpet cleaning
5. Same-day service

### Schema serviceType
`HomeAndConstructionBusiness`

### OG image
`og-cleaning.jpg` (1200x630) — clean residential interior, soft natural light

---

## Painting

### Slug & canonical
`painting` → `painting.html` → `https://hikmon.com/painting.html`

### Trade noun forms
- Sentence: `painting`
- Owner address: `Painting Owner` / `painting owners`
- Company form: `your painting company`
- Obvious-X form: `the obvious painter in your zip code`
- Footer caps: `BUILT FOR PAINTING`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential painting, or every month after is free`

### meta-description
`The Demand Capture Engine for residential painting owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`painters near me`

### authority-high-ticket
`the $8,000 exterior repaint. The cabinet refinish that pays you for years.`

### authority-slow-month
`in February`

### authority-anchor-revenue
`exterior repaints and cabinet refinishes`

### truth-paragraph-1-slow (full sentence)
`You didn't start your painting company so you could chase Angi leads on a Sunday night. You didn't buy the second van so it could sit idle in February.`

### truth-paragraph-4-query
`painters near me`

### truth-peak-trough
`stays busy in May and panics in January`

### truth-high-ticket
`$8,000 exterior repaint` (paired with `the obvious painter in your zip code`)

### stack-item-01-sub
`Built to book project quotes, exterior bids, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local painting pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in winter months.`

### letter-re
`Why painting marketing has felt broken for so long.`

### letter-greeting
`Dear Painting Owner,`

### letter-paragraph-1
`Most painting owners I talk to have the same story.`

### letter-pivot
`Painting marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a painting business that has to make payroll in February.`

### letter-peak-trough
`Your phone rings in May. It barely rings in January.`

### faq-1-closing
`We built ours for painters.`

### faq-4-question
`Do you work with trades besides painting?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Painting is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary painting search`

### final-cta-body
`We build a real, working demo of your painting website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential painting owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR PAINTING · OWNED, NOT RENTED`

### Top 5 services
1. Interior painting
2. Exterior painting
3. Cabinet painting
4. Deck staining
5. Color consultation

### Schema serviceType
`HousePainter`

### OG image
`og-painting.jpg` (1200x630) — exterior of a freshly painted residential home, daylight

---

## Handyman

### Slug & canonical
`handyman` → `handyman.html` → `https://hikmon.com/handyman.html`

### Trade noun forms
- Sentence: `handyman work` (in title/meta); `handyman` (in compound nouns)
- Owner address: `Handyman` / `handymen`
- Company form: `your handyman business`
- Obvious-X form: `the obvious handyman in your zip code`
- Footer caps: `BUILT FOR HANDYMAN`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential handyman work, or every month after is free`

### meta-description
`The Demand Capture Engine for residential handyman businesses. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`handyman near me`

### authority-high-ticket
`the $2,000 full-day project. The repeat customer that pays you for years.`

### authority-slow-month
`the second week of January`

### authority-anchor-revenue
`full-day projects and repeat-customer bookings`

### truth-paragraph-1-slow (full sentence)
`You didn't start your handyman business so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle the second week of January.`

### truth-paragraph-4-query
`handyman near me`

### truth-peak-trough
`stays booked through the holidays and panics every January`

### truth-high-ticket
`$2,000 full-day project` (paired with `the obvious handyman in your zip code`)

### stack-item-01-sub
`Built to book project quotes, full-day jobs, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local handyman pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in slow weeks.`

### letter-re
`Why handyman marketing has felt broken for so long.`

### letter-greeting
`Dear Handyman,`

### letter-paragraph-1
`Most handymen I talk to have the same story.`

### letter-pivot
`Handyman marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a handyman business that has to make payroll the second week of January.`

### letter-peak-trough
`Your phone rings the week before Thanksgiving. It barely rings the second week of January.`

### faq-1-closing
`We built ours for handymen.`

### faq-4-question
`Do you work with trades besides handyman work?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Handyman work is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary handyman search`

### final-cta-body
`We build a real, working demo of your handyman website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential handyman businesses. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR HANDYMAN · OWNED, NOT RENTED`

### Top 5 services
1. TV mounting
2. Drywall repair
3. Furniture assembly
4. General repairs
5. Same-day service

### Schema serviceType
`HomeAndConstructionBusiness`

### OG image
`og-handyman.jpg` (1200x630) — handyman with toolbelt in a residential setting, daylight

---

## Flooring

### Slug & canonical
`flooring` → `flooring.html` → `https://hikmon.com/flooring.html`

### Trade noun forms
- Sentence: `flooring`
- Owner address: `Flooring Owner` / `flooring owners`
- Company form: `your flooring company`
- Obvious-X form: `the obvious flooring pro in your zip code`
- Footer caps: `BUILT FOR FLOORING`

### title
`Hikmon — Top 3 on Google Maps in 30 days for residential flooring, or every month after is free`

### meta-description
`The Demand Capture Engine for residential flooring owners. $297–$397 / 4 weeks. No setup fee. No 12-month contract. Top 3 on Google in 30 days, or every month after is free until you rank.`

### hero-subhead-query
`flooring installer near me`

### authority-high-ticket
`the $12,000 whole-home install. The refinish job that pays you for years.`

### authority-slow-month
`in February`

### authority-anchor-revenue
`whole-home installs and refinish jobs`

### truth-paragraph-1-slow (full sentence)
`You didn't start your flooring company so you could chase Angi leads on a Sunday night. You didn't buy the second truck so it could sit idle in February.`

### truth-paragraph-4-query
`flooring installer near me`

### truth-peak-trough
`stays busy in fall and panics in February`

### truth-high-ticket
`$12,000 whole-home install` (paired with `the obvious flooring pro in your zip code`)

### stack-item-01-sub
`Built to book install quotes, refinish bids, financing, reviews. Mobile-first. Yours.`

### stack-item-02-sub
`Categories. 30 services. Photos. Q&A. Description. Out-indexes 90% of local flooring pins.`

### timeline-60day-shoulder
`Booked calls stay steady. Even in slow months.`

### letter-re
`Why flooring marketing has felt broken for so long.`

### letter-greeting
`Dear Flooring Owner,`

### letter-paragraph-1
`Most flooring owners I talk to have the same story.`

### letter-pivot
`Flooring marketing has felt broken because the way agencies price it was built for SaaS companies. Not for a flooring business that has to make payroll in February.`

### letter-peak-trough
`Your phone rings in fall. It barely rings in February.`

### faq-1-closing
`We built ours for flooring pros.`

### faq-4-question
`Do you work with trades besides flooring?`

### faq-4-answer
`Yes. We help every home service trade — HVAC, plumbing, electrical, and more. Flooring is what this page is built for. The same 30-day guarantee works for every trade we take on.`

### guarantee-body-search
`your primary flooring search`

### final-cta-body
`We build a real, working demo of your flooring website — free, before you pay a dollar. If it doesn't beat what you have today, you walk away with the demo. No pressure.`

### footer-description
`The Demand Capture Engine for residential flooring owners. We turn your Google Business Profile and website into assets you actually own — top 3 on Google Maps in 30 days, or every month after is free.`

### footer-tagline
`BUILT FOR FLOORING · OWNED, NOT RENTED`

### Top 5 services
1. Hardwood install
2. LVT / luxury vinyl install
3. Tile install
4. Hardwood refinishing
5. Carpet install

### Schema serviceType
`HomeAndConstructionBusiness`

### OG image
`og-flooring.jpg` (1200x630) — newly installed hardwood floor, residential interior, daylight
