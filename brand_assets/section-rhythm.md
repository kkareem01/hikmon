# Section Rhythm — Option B

Decision: predominantly white site with **2-3 dark anchor sections** in `--forest-deep` to create rhythm and emphasis (matches Mouse's alternating dark/light cadence without going dark-mode-SaaS).

---

## Section background plan (top to bottom)

| # | Section | Background | Why |
|---|---|---|---|
| 1 | Hero | `--forest-deep` (DARK) | Bold opening anchor — guarantee deserves dramatic treatment |
| 2 | Trust strip / logos | `--white` | Reset to clean baseline |
| 3 | Features intro | `--white` | Pure content, max readability |
| 4 | Feature deep-dive 1 (Get Found) | `--white` | Pure content |
| 5 | Feature deep-dive 2 (Capture) | `--white-elevated` | Subtle differentiation between adjacent feature blocks |
| 6 | Feature deep-dive 3 (Speed-to-Lead) | `--white` | |
| 7 | Feature deep-dive 4 (Reporting) | `--white-elevated` | |
| 8 | 6-tile benefits grid | `--white` | |
| 9 | Integrations (CRM logos) | `--white` | |
| 10 | Tabbed showcase | `--white-elevated` | |
| 11 | Old Way vs New Way comparison | `--forest-deep` (DARK) | Mid-page anchor — a high-emotion section, the "wake up call" |
| 12 | Pricing | `--white` | Clarity matters most here |
| 13 | Testimonials | `--white` with `--amber-soft` accent cards | Warm, human |
| 14 | FAQ | `--white` | |
| 15 | Final CTA | `--forest-deep` (DARK) | Closing anchor — last chance, dramatic |
| 16 | Footer | `--forest-deep` (DARK) | Carries from CTA |

**Total dark anchors:** 3 (hero, comparison, CTA+footer block) — exactly the rhythm Option B specified.

---

## Inverse rules (when on `--forest-deep` background)

- Headlines → `--white`
- Body text → `rgba(255, 255, 255, 0.85)` (slightly muted off-white reads better than pure white at body size)
- Eyebrow → `--amber-rich`
- Primary CTA → `--amber-rich` background, `--white` text (same as light-bg)
- Secondary CTA → transparent background, `1px solid rgba(255,255,255,0.25)` border, `--white` text → hover: `rgba(255,255,255,0.05)` fill
- Dividers → `rgba(255, 255, 255, 0.08)`
- No tinted shadows on dark sections (forest-on-forest is invisible) — use subtle inner highlights instead

## Texture on dark sections

Per CLAUDE.md anti-generic guardrail (gradients + grain), dark sections get:
- Layered radial gradients from `--forest-mid` peaks at top-left + bottom-right
- SVG noise overlay at 0.03 opacity for grain
- Optional: subtle 1px hairline "grid" via repeating linear-gradient at 0.04 opacity (very faint, references blueprint paper)
