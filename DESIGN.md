---
name: KRSH Maison
description: Luxury footwear house. Warm near-black canvas, ivory type, one restrained gold accent, light serif display.
colors:
  ink: "#0B0A09"
  ink-2: "#141210"
  ink-3: "#1D1A17"
  ivory: "#F3EEE6"
  ivory-dim: "rgba(243,238,230,0.62)"
  gold: "#C9A96A"
  line: "rgba(243,238,230,0.12)"
typography:
  display: { fontFamily: "Fraunces Variable", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 0.95 }
  body: { fontFamily: "Inter Variable", fontSize: "16px", lineHeight: 1.7 }
  label: { fontFamily: "JetBrains Mono", fontSize: "11px", letterSpacing: "0.22em", textTransform: uppercase }
rounded: { none: "0px" }
spacing: { section: "160px", gutter: "48px" }
motion: { ease: "cubic-bezier(0.22, 1, 0.36, 1)", reveal: "900-1100ms", hover: "500-700ms" }
---

# Design System: KRSH Maison

## 1. Visual theme
Quiet luxury. A warm near-black canvas, ivory type, and a single gold accent used only for emphasis (italic words, active states, primary CTA, numerals). Photography does the selling; the interface stays out of the way. No gradients on UI, no rounded corners, no shadows. Depth comes from hairline borders and blurred glass on fixed bars.

## 2. Color roles
- `ink / ink-2 / ink-3`: page, raised surface, hover surface.
- `ivory`: primary text and outline buttons. `ivory-dim`: body copy, secondary labels.
- `gold`: the only accent. Keep scarce: one gold CTA per view.
- `line`: all dividers and borders (1px).

## 3. Typography
Fraunces at weight 300 for display, with an italic gold word as the signature flourish ("Made to be worn *slowly.*"). Inter for all reading text. JetBrains Mono in tracked uppercase for eyebrows, prices and sizes, which gives a catalogue/spec-sheet feel.

## 4. Components
Buttons: sharp, 1px border, uppercase 12px with 0.2em tracking; hover inverts. Cards: edge-to-edge image, slide-up "View details" bar, 1.4s slow zoom. Cart drawer: right-side dialog with free-shipping progress hairline. Size selector: 4-column hairline grid, sold-out sizes struck through. Accordion: serif titles, `+` rotates to `×`.

## 5. Layout
12-column feel, max width 1440px, 48px mobile / 96px desktop gutters, 160px between sections. Numbered section eyebrows (01, 02…). Asymmetric image grids for editorial pages.

## 6. Motion
All motion uses the single `ease-lux` curve. Headlines rise word-by-word from a mask; sections fade up once. Lenis smooth scroll; hero parallax. `prefers-reduced-motion` disables Lenis, parallax, grain and collapses all transitions.

## 7. Do / Don't
- Do keep one accent, large serif headlines, generous space, real photography.
- Don't add rounded corners, drop shadows, neon, or more than one gold element per fold.
- Don't invent products, reviews or press. Everything on the site is fictional and labelled so.

## 8. Responsive
Single-column under 768px. Header collapses to Menu. Product page gets a sticky bottom buy bar. Touch targets ≥ 40px.

## 9. Sources of ideas
Token/section structure follows the awesome-design-md format. Luxury restraint (single scarce accent, sharp CTAs, uppercase tracked labels, full-bleed imagery) follows the Ferrari-style DESIGN.md example. Motion and component patterns are adapted from Motion, React Bits, Aceternity, Magic UI and shadcn conventions; map pins follow mapcn's marker idea. See README.
