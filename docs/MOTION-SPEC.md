# Pragmatic Hippy: motion spec

Every UI change on the site moves. This file is the contract: each row is built and checked in the browser. Durations in ms.

## References (checked)
- **R1 spatialsites reel**: one hero object, fixed stage; scroll swaps pose/colour/headline; hairline labels; "look closer" zoom. → journey scenes, detail scene, product page zoom.
- **R2 "boring hero sections" reel**: stepped, arch, diagonal cut-outs; glowing arc behind wordmark. → CutFrame shapes, gate scene arc, page transitions.
- **R3 tech-fashion reel**: glossy hero garment, push-in "details matter", colourway row, exploded fabric layers, HUD grid with mono labels. → HUD grid, product detail push-in, colourway/collection rail, optional exploded layers.
- **Logo**: sun/moon face, headphones, bat wings. → logo idle loop, loader, 404.

## Principles
1. **Alive at rest**: nothing is fully static; idle loops are slow and small (≤ 2% scale, ≤ 6 px, ≥ 4 s period).
2. **Answers every input**: hover, press, focus, scroll, scroll velocity, cursor position.
3. **One pulse**: a 128 BPM clock (469 ms beat) drives accent pulses (tags, stamps, progress dots), so the site breathes like a dancefloor.
4. **Transform and opacity only** (plus clip-path for reveals); 60 fps; pause anything off-screen.
5. **Reduced motion**: fades ≤ 200 ms, no scrub, no pin, no particles, no cursor effects, no BPM pulse.

## Tokens (`src/lib/motion.tsx` + CSS vars)
| Token | Value |
|---|---|
| `--ease-out` (lux) | cubic-bezier(0.16, 1, 0.3, 1) |
| `--ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) |
| `--ease-snap` | cubic-bezier(0.34, 1.56, 0.64, 1) (overshoot) |
| spring | stiffness 320, damping 28 |
| `--d-micro` / `--d-small` / `--d-med` / `--d-large` / `--d-scene` | 120 / 240 / 480 / 800 / 1200 |
| stagger | letters 28, list items 60, cards 80 |
| beat | 469 (128 BPM) |

## Global layer
| Element | Trigger | Motion |
|---|---|---|
| Loader (first visit) | load | Logo sun rays rotate 0→90° (1200, lux), wings unfold scaleX 0.6→1 from body (800, snap), moon crescent fades in; then loader clips away with arch shape (800). Skipped on repeat visits (sessionStorage). |
| Page transition | route change | Outgoing page: stepped clip-path wipe up (600, in-out). Incoming: arch reveal from bottom (800, lux) + content rise 24 px. Scroll resets under the wipe. |
| Smooth scroll | always | Lenis, lerp 0.1. Scroll velocity feeds a `velocity` motion value (−1..1). |
| Grain | always | SVG noise overlay, opacity 0.06, shifts position in 8 steps per second. |
| HUD grid | load / cursor / scroll | Lines draw in (stroke-dashoffset, 1200, stagger 40); mono coordinates count up; grid parallax 4 px toward cursor; skew ≤ 2° with scroll velocity. |
| Cursor (pointer: fine) | move / hover | Gold dot (6 px) follows instantly; ring (32 px) follows with spring. On links: ring scales 1.6, label "View"; on product: "Open"; on add: "Add"; on drag areas: "Drag". Magnetic pull on buttons, max 8 px. Hidden on touch. |
| Header | scroll | Hides on scroll down, shows on up (existing, 480). Logo sun rays rotate with scroll velocity (±20°/s, spring back). Nav underline slides between hovered items (spring). Bag count flips (rotateX 90→0, 240) on change and bag icon bounces (snap). |
| Marquee | scroll | Speed scales with scroll velocity (1×–4×); direction follows scroll direction. Items pulse on beat (opacity 0.7→1). |
| Links | hover/focus | Underline draws left→right (240), leaves right (240). Focus ring gold, 2 px, fades in 120. |
| Buttons | hover / press | Fill sweeps from bottom (480, lux); text swaps colour mid-sweep; press scale 0.97 (120); magnetic. |
| Images | enter viewport | CutFrame clip-path opens (step/arch/diag, 1000, lux) + image scale 1.15→1 (1400). |
| Headings | enter viewport | Letters rise from mask, stagger 28; eyebrow types in (mono, 18 ms/char). |
| Numbers | enter viewport | Count up (1200, out). |
| Logo idle (anywhere shown) | always | Sun rays rotate 360° / 60 s; moon side breathes (opacity 0.85↔1, 4 s). |

## Journey (home)
Pinned stage, section height 5 × 150vh. Clip `currentTime` = local progress × duration.
| Element | Motion |
|---|---|
| Scene direction | Gate zoom-in (scale 1→1.6), Stage down (y 0→−10%), Market side (x 0→−30%), Detail zoom-in, Tent zoom-out (1.6→1). |
| Scene change | 250 ms crossfade + 4 px blur on the outgoing clip; next clip preloaded. |
| Alive at rest | When scrolling stops, clip "breathes": ping-pongs ±0.15 s around the current time (2 s period). Canvas particles (dust/smoke, 40 desktop / 15 mobile) drift with parallax. Laser beams (CSS conic gradients) sweep on stage and gate, flash on beat. |
| Scene title | Letters rise from mask (stagger 28) on enter, rise out on exit; mono scene index "02/05" types in. |
| Progress HUD | Right edge: 5 dots + line; line fills with progress; active dot pulses on beat; scene name crossfades. Click a dot = smooth scroll to that scene. |
| Product tags (wristbands) | On enter: SVG leader line draws from the person to the tag (400), tag slides out 12 px with snap; hover: tag lifts 4 px, price flips (rotateX), accent dot pulses; focus = hover. |
| Gate | Glowing gold arc behind the logo (from R2) brightens as you zoom in. |
| Detail | Hairline callouts (fabric, fit, logo spot) draw in at 15–35% local progress (R1). |
| Tent finale | After zoom-out, 16 display hotspots appear with stagger 60; hover lifts the piece and draws an accent ring; click opens the product. A "Browse all" ticket slides up at the end. |

## Shop (/shop)
| Element | Motion |
|---|---|
| Filter change | Cards FLIP-animate to new positions (500, lux); leaving cards scale 0.9 + fade (240); count number rolls. |
| Ticket card | Enter: stagger 80, rise 24 px. Hover: packshot 3D tilt toward cursor (max 6°), image scale 1.05, perforated edge shifts 2 px, accent stripe sweeps across (480). |
| Sort | List reorders with FLIP; sort label crossfades. |
| Line chips | Active chip background slides between chips (shared layout, spring). |

## Product page
| Element | Motion |
|---|---|
| Image | Enter: CutFrame arch opens. Cursor tilt (max 4°). Zoom lens on hover (existing 2.2×). Logo-spot hotspot pulses on beat; click = push-in zoom to the logo (800, lux) (R3 "details matter"). |
| Sizes | Press scale 0.96; selected fill sweeps from left (240); sold-out strike-through draws (240); error = row shakes 6 px × 3 (220). |
| Add to bag | Button text → progress line (400) → check mark draws (240) → reverts; a thumbnail flies (FLIP arc) to the bag icon (700); bag bounces + count flips. |
| Accordion | Height spring; plus rotates to ×; content fades up 8 px. |
| Related rail | Horizontal drag rail with inertia; cards tilt with drag velocity. |

## Bag drawer / checkout
| Element | Motion |
|---|---|
| Drawer | Slides in with stepped clip-path edge (600); backdrop fades (240); items stagger 60. |
| Qty change | Number rolls up/down (240); line total rolls. |
| Remove | Item collapses height + slides out right (400). |
| Fields | Underline draws on focus (240); label floats up (240); error shake 6 px × 3 + red text fades in. |
| Confirm | "Order received (demo)" stamp slams in: scale 1.4→1, rotate −8°, snap (480), then ink bleed (opacity). |

## Other pages
| Page | Motion |
|---|---|
| Story | Steps reveal along a drawn vertical line; each step's number counts. Image CutFrames. |
| Pop-ups map | Pins drop in with snap, stagger 80; active pin ripples on beat; panel crossfades city. |
| FAQ | Accordion as product page; group titles mask-rise. |
| Saved | Heart fills with a scale pop (snap); removing collapses the card. |
| 404 | Logo wings flap (rotate ±6°, 1.2 s loop); "Off the path" letters scatter on cursor proximity. |
| Newsletter | Success = stamp; error = shake. |
| Loading (lazy routes, images) | Gold shimmer skeleton (1.6 s sweep). |

## Performance budget
- JS motion only on transform/opacity/clip-path; `will-change` only while animating.
- One canvas (particles) at a time, paused via IntersectionObserver and when tab hidden.
- Clips: 720p desktop, 480p ≤ 768 px; posters first; only current + next clip loaded.
- Mobile: no cursor, half particles, no tilt; journey keeps scrub.
- Targets: 60 fps desktop scroll; mobile Lighthouse performance ≥ 70; CLS < 0.05.
