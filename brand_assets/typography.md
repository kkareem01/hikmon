# Hikmon Typography System

Three-font system: serif headline signals **authority and permanence** (the established trades), grotesque sans body keeps copy **legible and modern**, and a monospace accent reinforces **precision/blueprint** vibes (specs, technical credibility, the trades own this aesthetic). Avoid Inter+Inter — generic SaaS tell.

---

## Font stack

### Headlines — Source Serif 4
- Google Fonts, free, professional weight range
- Grounded and readable at display sizes — not editorial/foodie like Fraunces, not aggressive like Playfair
- Conveys: trustworthy, established, takes itself seriously
- Weights used: 400 (rare body usage), 600 (subheads), 700 (display)

### Body + UI — Inter
- Workhorse sans, ubiquitous, legible at every size
- Weights used: 400 (body), 500 (UI labels), 600 (button text, emphasis)

### Eyebrows + technical accents — Fragment Mono
- Google Fonts, single weight (400)
- Used for: section eyebrows, stat numbers, code-style labels, version/build markers
- Conveys: precision, blueprint, owner-operator detail orientation
- Always uppercased with wide tracking when used as eyebrow (`letter-spacing: 0.14em`)

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&family=Fragment+Mono&display=swap">
```

---

## Scale

```css
/* Display — Source Serif 4, tight tracking, deep forest color */
--text-display-xl:  72px;  line-height: 1.05; letter-spacing: -0.025em;  /* hero headline */
--text-display-lg:  56px;  line-height: 1.05; letter-spacing: -0.022em;  /* section H2 */
--text-display-md:  40px;  line-height: 1.1;  letter-spacing: -0.02em;   /* sub-section */
--text-display-sm:  28px;  line-height: 1.15; letter-spacing: -0.015em;  /* card heads */

/* Body — Inter, generous line-height for readability */
--text-body-lg:     19px;  line-height: 1.7;  letter-spacing: 0;         /* hero subhead */
--text-body:        17px;  line-height: 1.7;  letter-spacing: 0;         /* default */
--text-body-sm:     15px;  line-height: 1.6;  letter-spacing: 0;         /* meta */

/* UI — Inter, slightly tighter */
--text-ui:          15px;  line-height: 1.4;  letter-spacing: 0;         /* buttons, nav */
--text-ui-sm:       13px;  line-height: 1.4;  letter-spacing: 0.01em;    /* captions, badges */
--text-eyebrow:     12px;  line-height: 1.3;  letter-spacing: 0.14em;    /* Fragment Mono, uppercase */
--text-mono:        14px;  line-height: 1.5;  letter-spacing: 0;         /* Fragment Mono, body-size technical */
```

## Mobile scale (< 768px)

```css
--text-display-xl:  44px;   /* down from 72 */
--text-display-lg:  36px;   /* down from 56 */
--text-display-md:  28px;   /* down from 40 */
--text-display-sm:  22px;   /* down from 28 */
--text-body-lg:     18px;
--text-body:        16px;
```

## Pairing rules

- **Always** Source Serif on display + Inter on body. No mixing.
- **Never** Source Serif at <22px — switch to Inter.
- **Eyebrow text:** Fragment Mono, uppercase, `--text-eyebrow`, color `--amber-rich` (default) or `--forest-light` (on dark bg).
- **Stats / technical labels:** Fragment Mono, `--text-mono`, color `--amber-rich` for emphasis.
- Use `font-feature-settings: "ss01", "cv11"` on Inter for slightly more character (single-story `a`, straight `l`).
- Source Serif at display size: enable optical sizing — `font-variation-settings: "opsz" 60`.

## Examples

```html
<!-- Hero headline -->
<h1 style="font-family: 'Source Serif 4', serif; font-size: 72px; line-height: 1.05; letter-spacing: -0.025em; color: var(--forest-deep);">
  Stop paying for demand <em>you are not converting.</em>
</h1>

<!-- Body lead -->
<p style="font-family: 'Inter', sans-serif; font-size: 19px; line-height: 1.7; color: var(--charcoal);">
  We install The Demand Capture Engine for home service businesses…
</p>

<!-- Eyebrow -->
<span style="font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--amber-rich);">
  THE DEMAND CAPTURE ENGINE
</span>
```
