# Internship Application Tracker — Design Brief

## Product framing

A single-purpose personal operations console for tracking internship applications in **Cloud Engineering, DevOps, and Systems** roles. It is not a generic job board: the vocabulary, metrics, and card anatomy are built around infrastructure-role hiring loops (phone screen → technical → final → offer).

Because the user explicitly requested a **Theme Switcher across five distinct architectural styles**, this project has an unusual constraint: the *shell* (layout, information architecture, typography scale, motion timing) is fixed and excellent, while the *material* (surfaces, shadows, borders, radii, palette) is fully swappable. So this brief defines one invariant skeleton plus five materials.

---

## Three stylistic approaches considered

### 1. Console Substrate
**Very Brief Intro:** A dense, instrument-panel aesthetic borrowed from datacenter NOC dashboards — monospace metadata, hairline rules, everything reading like a live system readout. Emotional intent: competence and control.
**Probability:** 0.021

### 2. Atelier Ledger
**Very Brief Intro:** A warm, editorial, paper-first aesthetic — a bound notebook for a job hunt, with serif display type, generous margins, and ink-like accents. Emotional intent: calm, personal, deliberate.
**Probability:** 0.084

### 3. Material Laboratory
**Very Brief Intro:** The interface treats each theme as a physical material sample under studio lighting — glass, clay, floating acrylic, raw newsprint, bare paper — with an invariant industrial-design chassis holding them. Emotional intent: curiosity and tactility.
**Probability:** 0.037

**Selected: 3 — Material Laboratory.** It is the only one of the three whose premise *requires* the five-theme switcher rather than tolerating it, so the user's headline feature becomes the design thesis instead of a bolt-on.

---

## Chosen approach, expanded

### Design Movement
**Industrial design specimen presentation** crossed with **Swiss information design**. Think Braun product photography plates and Dieter Rams spec sheets: a rigorously typographic, left-aligned, rail-and-canvas chassis whose sole job is to present material samples honestly. The chassis never competes with the material; the material never distorts the chassis.

### Core Principles
1. **Invariant chassis, variable material.** Layout grid, type scale, spacing rhythm, and motion timing are hard-coded and identical across all five themes. Only surface tokens change. Switching themes must feel like swapping the material of the same object, not loading a different app.
2. **Honest materials.** Each theme commits fully to its own physics. Glass actually blurs what is behind it (so there must be something behind it). Neomorphic surfaces share the exact background luminance so the extrusion is real. Brutalism has genuinely zero radius and zero shadow — no cheating with a soft border.
3. **Data density without noise.** Every card carries ten fields. They are ranked into three tiers (identity / timeline / detail) and the lower tiers are progressively revealed, so the grid reads as calm even when full.
4. **The status is the color.** Application status is the only element permitted its own hue in every theme. Everything else obeys the theme's palette. This makes the grid scannable regardless of material.

### Color Philosophy
The chassis is achromatic and theme-owned. Layered on top is a single **status spectrum** that is semantically fixed across all five themes — cool slate for Applied, warm amber for Phone Screen, electric cyan for Technical, violet for Final, green for Offer, red for Rejected, grey-blue for Waitlist. The reasoning: in a tracker, the user's eye is hunting for *state*, not for decoration. Reserving all saturation for state means the color budget is spent entirely on the one thing that carries information. Each theme re-tints these hues to sit correctly in its own material (e.g. brutalism uses flat web-safe versions; glass uses luminous, low-alpha versions).

### Layout Paradigm
A **fixed left rail + flowing canvas**, deliberately not a centered container. The rail (256px, sticky, full height) holds the wordmark, the theme selector, the metrics stack, and the filter/sort controls. The canvas holds only the card grid and scrolls independently. The grid is exactly 3 columns at desktop as specified, flowing left-to-right then wrapping downward, with each card locked to a square aspect ratio. This asymmetry means the controls never push the grid down and the metrics are always visible while scrolling — a genuine functional gain over a top toolbar.

### Signature Elements
1. **The specimen chip.** A small monospace label in the rail reading `MATERIAL / 0X — <THEME NAME>` that updates on theme change, framing the current theme as a lab sample.
2. **The status spine.** A vertical bar running the full height of the card's left edge, colored by status. It is the one motif that survives every theme (as glass glow, as clay extrusion, as a hard 8px black-bordered block, etc.) and makes the grid instantly parseable.
3. **Stage ladder.** A seven-notch horizontal progress ladder on each card showing how far the application has advanced through the interview loop, rendered in the theme's material.

### Interaction Philosophy
Interactions demonstrate the material's physics. Hovering a card in Glass lifts and increases blur saturation; in Neomorphic it presses inward; in Spatial it rises and its shadow spreads and softens; in Brutalism it translates 4px and its offset shadow snaps; in Minimal-Maximal only a hairline rule reveals. Same event, five honest responses.

### Animation
- Tokens: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`.
- Card entrance: 40ms stagger, `opacity 0→1` + `translateY(12px)→0`, 260ms ease-out.
- Theme transition: surfaces cross-fade over 320ms ease-in-out via transitions on `background`, `box-shadow`, `border-color`, `border-radius`. Never a full page flash.
- Card hover: 180ms ease-out, transform + shadow only.
- Dialog: 200ms, `scale(0.96)→1` + fade. Never from `scale(0)`.
- Buttons: `scale(0.97)` on `:active`, 140ms.
- All non-essential motion gated behind `prefers-reduced-motion: no-preference`.

### Typography System
- **Display / headings:** `Space Grotesk` — geometric, slightly technical, has personality at large sizes without being decorative.
- **Body / UI:** `Instrument Sans` — a humanist sans with more character than Inter, excellent at 13–15px.
- **Metadata / numerals / specimen labels:** `JetBrains Mono` — used for dates, URLs, resume versions, metric numerals, and the specimen chip. This is what gives the whole app its infrastructure-engineer credibility.
- Rules: display is always tight (`-0.03em`) and never lighter than 600. Metadata is always uppercase, `0.08em` tracked, at 11px. Body never exceeds 68 characters per line. Brutalism theme overrides display to a web-safe stack (Arial Black / Helvetica) as an honest expression of that style.

### Brand Essence
> **Runbook** — an application tracker built like infrastructure tooling, for engineers pursuing cloud, DevOps, and systems internships, that treats the job hunt as a pipeline with observable state.

Personality: **exacting, tactile, unhurried.**

### Brand Voice
Terse and operational, borrowing from CLI and SRE language without becoming a joke. Headlines are noun phrases, never sentences. Numbers are stated plainly. No hype, no exclamation marks, no "Get started today."
- Example line (empty state): `No applications in the pipeline. Add the first one.`
- Example line (metrics label): `INTERVIEW CONVERSION — 3 of 11 reached a technical round.`

### Wordmark & Logo
A monospace lowercase wordmark `runbook` with a preceding mark: three stacked horizontal bars of decreasing width inside a rounded square, reading simultaneously as a stack of servers, a list of entries, and a signal-strength meter descending. The mark is drawn as a single flat glyph so it survives every theme's material treatment, and it re-materializes per theme (frosted in glass, extruded in clay, hard-bordered in brutalism).

### Signature Brand Color
**Signal Cyan `#00D1C1`** — a saturated teal-cyan that reads as "cloud infrastructure" without being the default AWS orange or Azure blue. It is the accent on primary actions and the Technical Interview status hue, so the brand color is also the color of the most important moment in the pipeline.

---

## The five materials

| # | Theme | Material behaviour | Radius | Shadow strategy |
|---|-------|--------------------|--------|-----------------|
| 01 | **Liquid Glass** | Semi-transparent surfaces over a live animated gradient mesh; heavy `backdrop-filter: blur() saturate()`; 1px top-light border; specular sheen on hover | 20–28px | Diffuse ambient + inner top highlight |
| 02 | **Soft Clay** | Neomorphism + claymorphism fused: surface luminance identical to canvas, dual outset/inset shadows, matte, no borders at all | 28–36px | Paired light/dark offsets; inset on press |
| 03 | **Spatial Depth** | AR/VR inspired: elements float on distinct z-planes with extreme long-throw shadows, slight parallax, blurred depth-of-field backdrop | 18px | Multi-layer, very large blur radius, low alpha |
| 04 | **Brutalist** | Raw HTML: `#FFF` canvas, 3px `#000` borders, web-safe flat colors, zero radius, hard non-blurred offset shadow, all-caps monospace | 0px | `6px 6px 0 #000`, no blur |
| 05 | **Minimal / Maximal** | Deliberate half-and-half per the brief: monochromatic palette, medium whitespace, hairline rules and near-invisible chrome (minimal) — but oversized display numerals, dense metadata, and heavy type contrast (maximal) | 2px | None; separation by hairline rules only |

### Token contract
Every theme defines the same variable set on `[data-theme="..."]` in `client/src/index.css`:
surface / surface-raised / surface-sunken, text-primary / text-secondary / text-muted, border-hairline / border-strong / border-width, radius-card / radius-control, shadow-card / shadow-card-hover / shadow-control / shadow-inset, accent / accent-contrast, canvas-backdrop, plus the seven status hues and font-family assignments. Components only ever read tokens — no theme conditionals in component logic beyond one optional class hook.

## Style Decisions
- The left rail is never collapsed on desktop and never becomes a hamburger above 1024px.
- No card may use a border-radius literal; all radii come from `--radius-card` / `--radius-control`.
- Status hue is the only saturated color permitted outside the accent.
- All dates render in `JetBrains Mono`, format `YYYY-MM-DD`, never localized long form.
- Company logos fall back to a generated monogram tile using the status hue, never a broken image.
- The main canvas opens as a **specimen field** for application cards. Any hero, metric, or distribution content outside the rail must be visually subordinate to the card grid: metrics use the quieter `mat-instrument` material (never `mat-surface`), and the page headline is a spec-sheet caption line, not a marketing hero.
- **Spatial Depth** must show at least three clearly perceived z-planes — rail/instruments (deepest), summary surfaces (mid), cards (brightest and closest) — separated by atmospheric depth rather than a single dark surface language.
- Saturated color is reserved for status hues, Signal Cyan primary actions, and the current material indicator. No other UI chrome introduces competing vivid hues; Brutalism therefore uses flat black chrome and keeps blue exclusively as the Technical Interview status hue.
- The specimen/plate annotation system (`Plate 01`, `M1`–`M7`, `R1`–`R3`, tick strips, hairline rules) is a recurring page-wide language, not a decoration limited to the theme switcher.
- Display type in Glass and Spatial carries Swiss spec-sheet conviction: weight 700, tracking `-0.038em`.
