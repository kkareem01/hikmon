# Hikmon Color System

Brand direction: warm + trustworthy for local home service business owners (HVAC, plumbing, electrical, roofing, garage door, pest control, landscaping, pool service, cleaning, painting, handyman, flooring).

The palette signals **established** (deep forest green = banks, John Deere, insurance), **clean** (true white, not cream), and **craft-oriented** (amber = copper, leather, wood-tones).

Deliberate inverse of dark-mode SaaS aesthetic — tradespeople distrust glowing futurism.

---

## Tokens

```css
:root {
  /* Surfaces */
  --white:           #FFFFFF;   /* primary background */
  --white-elevated:  #FAFAF7;   /* cards, elevated surfaces (barely-off white) */
  --hairline:        #ECECE7;   /* dividers, borders */

  /* Forest green — primary */
  --forest-deep:     #1F3D2C;   /* headlines, primary buttons, dark surfaces */
  --forest-mid:      #2D5640;   /* primary hover, secondary surfaces */
  --forest-light:    #4A7359;   /* tertiary accents, muted icons */

  /* Amber — accent */
  --amber-rich:      #C97B19;   /* CTA, highlights, link underlines */
  --amber-glow:      #E0913B;   /* amber hover state */
  --amber-soft:      #F5E4CC;   /* amber tinted backgrounds (testimonials, etc.) */

  /* Text */
  --charcoal:        #1A1A1A;   /* primary body text */
  --ash:             #6B6B6B;   /* meta text, captions */
  --ash-light:       #9C9C9C;   /* placeholder, disabled */
}
```

## Tinted shadows

CLAUDE.md hard rule: never flat `shadow-md`. All shadows tinted with forest green at low opacity for cohesion.

```css
--shadow-sm: 0 1px 2px rgba(31, 61, 44, 0.06),
             0 2px 6px rgba(31, 61, 44, 0.04);

--shadow-md: 0 4px 12px rgba(31, 61, 44, 0.08),
             0 12px 32px rgba(31, 61, 44, 0.06);

--shadow-lg: 0 12px 32px rgba(31, 61, 44, 0.10),
             0 32px 64px rgba(31, 61, 44, 0.08);

--shadow-amber: 0 8px 24px rgba(201, 123, 25, 0.18),
                0 2px 6px rgba(201, 123, 25, 0.12);
```

## Layering (per CLAUDE.md depth guardrail)

- **Base** — `--white` (page background)
- **Elevated** — `--white-elevated` + `--shadow-sm` (cards, content blocks)
- **Floating** — `--white-elevated` + `--shadow-md` (sticky nav, popovers)
- **Modal** — `--white-elevated` + `--shadow-lg` (dialogs, full-screen overlays)
- **Inverse** — `--forest-deep` (dark panels, footer, occasional inverted sections)

## Usage rules

- Body text on white = `--charcoal`, never pure black.
- Headlines = `--forest-deep` (preferred) or `--charcoal`. Never green for body — too saturated to read at small sizes.
- CTAs = `--amber-rich` background, `--white` text. Hover → `--amber-glow`.
- Secondary CTAs = `--forest-deep` background, `--white` text.
- Dividers = `--hairline` only. No 1px black/gray lines.
- Never use default Tailwind palette utilities (`bg-green-700`, `text-amber-500`, etc.). Always reference these custom tokens.
