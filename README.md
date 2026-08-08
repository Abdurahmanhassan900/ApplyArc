# Runbook — Internship Application Tracker

A frontend-only application tracker for **Cloud Engineering, DevOps, and Systems** internships, built on the *Material Laboratory* design thesis: one invariant chassis presenting five swappable architectural materials.

## Features

| Area | Implementation |
|------|----------------|
| Layout | Fixed left rail (`17.5rem`, sticky, full height) + flowing canvas. Card grid is 1 / 2 / **3** columns and flows left-to-right, wrapping downward as entries are added. |
| Card | Square (`aspect-square`, `min-h-24rem`), radius from `--radius-card`. Displays Company Name, Company Logo, Job Title, Description, Date Applied, Job Posting URL, Resume Version, Next Action Date, Recruiter Contact (name / email / phone), and a Manual Notes indicator + editor. |
| Status | Seven states — Applied, Phone Screen, Technical Interview, Final Interview, Offer, Rejected, Waitlist. Changeable inline from the card menu. |
| Filters & sort | Status dropdown, role-track dropdown, free-text search, five sort orders plus two one-tap quick-sort buttons. |
| Metrics | Instrument strip computing total applications, interviews, rejections, offers, conversion rates, action queue (overdue / within 7 days), status distribution, and resume-version rotation. |
| Theme switcher | Five materials, persisted to `localStorage`, cycled with the `T` key. |
| Persistence | `localStorage` only — no backend. Seed pipeline on first load; restorable and clearable from the rail. |

## Theme switcher state management

State lives in exactly one place: `client/src/contexts/MaterialThemeContext.tsx`.

```
MaterialThemeProvider
  ├─ useState<ThemeId>          ← the single source of truth
  ├─ useEffect                  ← writes document.documentElement[data-theme]
  │                               + colorScheme + localStorage("runbook.theme")
  ├─ setTheme / cycleTheme      ← stable callbacks
  └─ useEffect(keydown "T")     ← keyboard cycle, ignored while typing
```

The provider hydrates synchronously from `localStorage` on first render, so there is no flash of the wrong material. Because the theme is expressed purely as a `data-theme` attribute on `<html>`, **no component contains a theme conditional for styling** — components read CSS custom properties and the attribute selector rebinds them.

## CSS variable architecture

All tokens live in `client/src/index.css`. `:root` holds the **invariant chassis** (motion easings and durations, layout metrics, font families, and the shadcn bridge). Each material then overrides the same contract under `:root[data-theme="<id>"]`:

```
Canvas       --canvas, --canvas-image, --canvas-overlay
Surfaces     --surface, --surface-raised, --surface-sunken,
             --surface-blur, --surface-blur-strong
Instruments  --instrument-surface, --instrument-border, --instrument-shadow
Text         --text-primary, --text-secondary, --text-muted
Borders      --border-width, --border-hairline, --border-strong, --border-top-light
Radii        --radius-card, --radius-control, --radius-pill
Shadows      --shadow-card, --shadow-card-hover, --shadow-control,
             --shadow-inset, --shadow-float
Accent       --accent, --accent-contrast, --accent-soft
Type         --font-display, --display-weight, --display-tracking, --display-transform
Motif        --spine-width, --spine-glow, --plate-tick, --card-hover-transform
Status (x7)  --status-<key>, --status-<key>-soft
```

### The five materials

| # | `data-theme` | Material | Radius | Shadow strategy |
|---|--------------|----------|--------|-----------------|
| 01 | `glass` | **Liquid Glass** — frosted translucent panels over an animated gradient mesh, `backdrop-filter: blur(28px) saturate(180%)`, top-light hairline, specular sheen on hover | 24px | Diffuse ambient + inner top highlight |
| 02 | `clay` | **Soft Clay** — neomorphism fused with claymorphism; surface luminance equals the canvas, zero borders, matte | 32px | Paired light/dark outsets + soft inner rim; inset on press |
| 03 | `spatial` | **Spatial Depth** — three perceptible z-planes (rail → instruments → cards) with long-throw depth-of-field shadows over a blurred environment | 18px | Four stacked layers up to 200px blur |
| 04 | `brutal` | **Brutalist** — `#FFF` canvas, 3px `#000` borders, web-safe flat status colors, all-caps Arial Black display type | **0px** | `7px 7px 0 #000`, unblurred |
| 05 | `minimax` | **Minimal · Maximal** — monochrome palette, hairline rules, no shadows (minimal) carrying oversized display numerals and dense mono metadata (maximal) | 2px | None; separation by rules only |

## Design invariants

- **Status hue is the only saturated color** outside Signal Cyan (`#00D1C1`) primary actions and the material indicator.
- No component hard-codes a radius, shadow, or surface color.
- The card grid is the primary object; metrics use the quieter `mat-instrument` material so the page never reads as a dashboard landing page.
- All dates render as `YYYY-MM-DD` in JetBrains Mono.
- Company logos fall back to a status-tinted monogram tile; never a broken image.

## Material primitives

Five classes carry the entire UI, each resolving through tokens:

| Class | Role |
|-------|------|
| `.mat-canvas` | Fixed page backdrop (image + overlay) so glass/spatial have something to refract |
| `.mat-surface` / `.mat-card` | Cards, rail, dialogs; `.mat-card` adds the per-material hover physics |
| `.mat-sunken` | Inputs, wells, meters |
| `.mat-control` / `.mat-accent` | Buttons, selects, chips |
| `.mat-float` | Dialogs and popovers (highest z-plane) |
| `.mat-instrument` | Subordinate readouts (metrics band) |

Typography roles: `.t-display`, `.t-meta`, `.t-mono`, `.t-numeral`. Plate annotation system: `.mat-plate-label`, `.mat-ticks`, `.mat-rule`.

## Motion

`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for entering/exiting, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for morphing. Card entrance staggers 40ms; theme transitions cross-fade surfaces over 320ms; hovers are 180ms transform + shadow only; buttons press to `scale(0.97)` in 140ms. All non-essential motion is gated behind `prefers-reduced-motion: no-preference`.

## File map

```
client/src/
  contexts/MaterialThemeContext.tsx   theme state (single source of truth)
  hooks/useInternships.ts             collection + view state, filtering, sorting, metrics
  lib/types.ts                        domain model, status spectrum, sort options
  lib/themes.ts                       theme registry (id, specimen, swatch, blurb)
  lib/format.ts                       date, URL, monogram helpers
  lib/seed.ts                         first-load sample pipeline
  components/
    BrandMark.tsx        mark + wordmark
    StatusChip.tsx       chip, status spine, stage ladder
    ThemeSwitcher.tsx    specimen tray dropdown
    MetricsDashboard.tsx instrument strip (M1–M7)
    FilterBar.tsx        filters, search, sort
    CompanyLogo.tsx      logo with monogram fallback
    InternshipCard.tsx   the square specimen card
    InternshipForm.tsx   add / edit dialog
    InternshipDetail.tsx full record + notes editor
  pages/
    Home.tsx             rail + canvas shell
    ThemePreview.tsx     /preview/:theme verification route
  index.css              the entire five-material token system
```

## Routes

- `/` — the tracker
- `/preview/:theme` — renders the tracker with a forced material (`glass`, `clay`, `spatial`, `brutal`, `minimax`); useful for reviewing a material without clicking the switcher
