---
name: Pragmatic Hippy — Festival HUD
description: Psy/rave festival shop. Black canvas, one gold accent, deep purple surfaces, thin HUD grid lines, ticket and wristband UI, motion on every detail.
colors:
  ink: "#0B0A09"
  ink-2: "#141210"
  ink-3: "#1D1A17"
  ivory: "#F3EEE6"
  ivory-dim: "rgba(243,238,230,0.62)"
  gold: "#D4A64A"
  gold-deep: "#A57C2C"
  purple: "#3A2350"
  purple-2: "#5B3A7A"
  crimson: "#8E1B2B"
  line: "rgba(243,238,230,0.12)"
  garment-accents: { red: "#E0352B", orange: "#FF7A1A", acid: "#D7FF3A", blue: "#2F6BFF", pink: "#FF3D9A" }
typography:
  display: { fontFamily: "Tanker (Fontshare API)", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 0.98 }
  body: { fontFamily: "Switzer (Fontshare API)", fontSize: "16px", lineHeight: 1.7 }
  label: { fontFamily: "Martian Mono Variable", fontSize: "10.5px", letterSpacing: "0.16em", textTransform: uppercase }
rounded: { none: "0px" }
spacing: { section: "160px", gutter: "48px" }
motion: { see: "docs/MOTION-SPEC.md", easeOut: "cubic-bezier(0.16, 1, 0.3, 1)", snap: "cubic-bezier(0.34, 1.56, 0.64, 1)", beat: "128 BPM (469 ms)" }
---

# Design System: Pragmatic Hippy — Festival HUD

## 1. Visual theme
A psytrance festival at night, seen through a heads-up display. Black canvas, gold light, purple haze, one bright accent per garment. Logo: sun/moon face, headphones, bat wings (`public/brand/`).

## 2. Color roles
- **Gold** `#D4A64A` — the site's only accent: active states, prices on hover, stamps, progress. 8.8:1 on ink.
- **Purple** — surfaces and haze only, never text (purple-2 is 2.2:1 on ink).
- **Crimson** — rare detail.
- **Garment accents** (red, orange, acid, blue, pink) — only on product-specific UI: wristband tags, hotspots, card sweeps. Never as site chrome.

## 3. Typography
Tanker for display (uppercase-feeling, heavy), Switzer for text, Martian Mono for HUD labels. Fonts load from the Fontshare API (licence forbids committing the files to this public repo).

## 4. Components (`src/components/hud/`)
- **HudGrid** — 120 px hairline grid + mono coordinates; draws in, drifts toward the cursor, skews with scroll speed.
- **Wristband** — notched tag with an accent strip; used for lines, prices, counts.
- **Ticket card** (`ProductCard`) — perforated stub, cursor tilt, accent sweep, price flip.
- **Stamp** — rotating circular "Drop 01" mark, pulses on the beat.
- **CutFrame** — image in a step / arch / diagonal frame that opens on view.
- **Journey** — pinned 5-scene scroll piece on Home (`src/components/Journey.tsx`, data in `src/data/journey.ts`).

## 5. Layout
Break the uniform grid: staggered columns, overlapping frames, cut-out shapes, numbered sections (01–04) with typed-in mono eyebrows. The plain `/shop` grid stays for fast, accessible browsing.

## 6. Motion
Every UI change moves; the full contract is `docs/MOTION-SPEC.md`. Transform/opacity/clip-path only; one particle canvas; reduced motion removes pin, scrub, particles, cursor and beat pulse.

## 7. Do / Don't
- Do: one gold accent in chrome; garment accents only near their garment; hairlines, not shadows.
- Don't: gradients as decoration, rounded cards, more than two design elements on a garment, fake reviews or real brands.

## 8. Responsive
Under 768 px: journey tags become a bottom rail (dots stay on people), no custom cursor, half the particles, mobile menu is a focus-trapped dialog.

## 9. Sources
Logo (user). Motion references: spatialsites.co reel (state swap, look-closer zoom, labels), "boring hero sections" reel (stepped/arch/diagonal cuts, glowing arc), tech-fashion reel (HUD grid, push-in details).
