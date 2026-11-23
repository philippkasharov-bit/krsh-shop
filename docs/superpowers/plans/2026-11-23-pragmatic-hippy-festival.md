# Pragmatic Hippy Festival Shop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Festival-journey home page (5 scroll-scrubbed clips, down / sideways / zoom), two-colour hippy-streetwear catalog with the logo placed per garment, and a "festival HUD" design system.

**Architecture:** Product data gains `accent` and `logo` fields. Packshots are generated with a clean placement area and the real logo is composited in post by a Node script (sharp). The journey is one sticky stage driven by a pure `segmentAt()` function that maps scroll progress to scene index, local progress and a transform per direction; video `currentTime` follows local progress.

**Tech Stack:** Vite 8, React 19, TS, Tailwind v4, motion/react, Lenis, Vitest; sharp (dev, new); Magnific MCP; ffmpeg 9.

**Spec:** `docs/superpowers/specs/2026-11-23-pragmatic-hippy-festival-design.md` (Tasks 1–3 of `docs/superpowers/plans/2026-11-23-krsh-rave-rebrand.md` are done and stay).

## Global Constraints
- Two colours per piece: ~80% dark base + ~20% one bright accent from {red, orange, acid yellow, electric blue, hot pink}; max 2 design elements, one is the logo; logo in the accent colour.
- Logo placement per garment exactly as the spec table.
- Paid media: `simulate_cost` first, one test, user OK, then batch. Clips: 5 max, 3–5 s, 720p (+480p).
- Site palette: black, gold `#d4a64a`, purple surfaces only, crimson rare. Fonts via Fontshare API only.
- **Motion contract: `docs/MOTION-SPEC.md`.** Every row there is built by the task that owns the element and checked in the browser; reduced-motion row checked too.
- No fake reviews/people/brands; demo disclaimers stay. Commit on `ccr-7a56163f-n0juph`, no PR unless asked.

## Review Focus
1. Reduced motion → journey shows 5 posters stacked with cards, no pin, no scrub.
2. Clip fails / slow 3G → poster stays visible, cards still clickable.
3. Phone 375 px → sideways segment does not cause page-level horizontal scroll; cards fit.
4. Fast scroll / jump to bottom → ends on tent-shop scene, no stuck video, no blank stage.
5. Keyboard → every product card in the journey is reachable and opens the product.

---

### Task 1: Data: accent and logo placement
**Files:** Modify `src/data/products.json`, `src/lib/products.ts`, `src/lib/products.test.ts`; generator `tools/catalog.mjs` (move from scratchpad).
**Interfaces:** Produces `type Accent = 'red'|'orange'|'acid'|'blue'|'pink'`; `ACCENT_HEX: Record<Accent,string>` = red `#e0352b`, orange `#ff7a1a`, acid `#d7ff3a`, blue `#2f6bff`, pink `#ff3d9a`; `type LogoSpot = 'back'|'chest'|'lower-back'|'thigh'|'heel'|'front'|'temple'`; `Product` gains `base: string; accent: Accent; logo: LogoSpot`.
- [ ] Tests: every product has `accent` in ACCENT_HEX and a `base`; logo spot by name: Strobe Jacket/Night Shell/Chrome Puffer/Warehouse Hoodie/Velour Set → `back`; Flyer Tee → `back`, Baby Tee 2000 → `chest`; Laser Corset Top/Chain Mail Tank → `lower-back`; Glow Cargo/Utility Pant/Low-Rise Flare → `thigh`; sneakers → `heel`; bag → `front`; Visor → `temple`; each accent used ≥ 2 times.
- [ ] Run → FAIL. Update generator + JSON (colours rewritten as "<base> / <accent>", descriptions hippy x streetwear, no flashy wording). Run → PASS. Commit.

### Task 2: Packshots + logo compositing
**Files:** Create `tools/composite-logo.mjs`, `public/images/drops/<slug>.webp` ×16; update `docs/media-prompts.md`.
**Interfaces:** CLI `node tools/composite-logo.mjs <in.png> <out.webp> --hex <accent> --x <0..1> --y <0..1> --w <0..1> [--rot deg]`: builds a single-colour logo from `public/brand/logo-light.webp` (luminance → alpha), tints it, overlays with `multiply`-then-`over` at the given normalised box, exports 1600 px WebP q75.
- [ ] Prompt template v4 in media-prompts.md (dark base + accent, clean empty area at the logo spot, view that shows that spot, low-key light, black seamless).
- [ ] simulate_cost; generate Strobe Jacket; composite logo; show user; iterate until OK.
- [ ] Generate other 15 (count/batches); `creations_read` each; redo misses (max 2); composite each; each ≤ 350 KB. Delete old `public/images/krsh-*.webp`. Browser check `/shop`. Commit.

### Task 3: Scene stills and clips
**Files:** `public/media/journey/<scene>.webp` (poster), `<scene>-720.mp4/.webm`, `<scene>-480.mp4`; `src/data/journey.ts`.
**Interfaces:** `type Dir = 'down'|'side'|'zoom-in'|'zoom-out'`; `interface Scene { id: 'gate'|'stage'|'market'|'detail'|'tent'; dir: Dir; title: string; poster: string; clip?: { mp4: string; webm: string; mp4Small: string }; cards: { slug: string; x: number; y: number }[] }`; `export const scenes: Scene[]` in the spec order.
- [ ] Stills: generate gate first (with our pieces worn, people anonymous/not real), user OK, then stage/market/detail/tent (tent shows display racks; product cards are overlaid, not baked in).
- [ ] `video_models_list`; simulate_cost for one image-to-video clip; generate the gate clip with a camera move matching its `dir`; `video_view_frames`; user OK; then the other 4.
- [ ] Encode with every frame a keyframe (`-g 1`) for smooth seeking: mp4 x264 crf 26 + webm vp9 crf 36 at 720p, mp4 at 480p; each ≤ 4 MB. Commit.

### Task 4a: Motion foundation
**Files:** Modify `src/lib/motion.tsx`, `src/index.css`, `src/components/Layout.tsx`, `Header.tsx`, `Marquee.tsx`; create `src/lib/beat.ts`, `src/lib/useVelocity.ts`, `src/components/{Cursor,Grain,PageTransition,Loader}.tsx`.
**Interfaces:** `beatPhase(tMs: number, bpm = 128): number` (0..1); `useBeat(): MotionValue<number>`; `useScrollVelocity(): MotionValue<number>` (−1..1, clamped); tokens per MOTION-SPEC "Tokens".
- [ ] Tests: `beatPhase(0)===0`, `beatPhase(234.375)` ≈ 0.5, `beatPhase(468.75)` ≈ 0 (wraps); velocity clamp unit test on the pure mapper `mapVelocity(px_per_s: number): number` (0→0, 4000→1, −9000→−1).
- [ ] Implement global layer rows of MOTION-SPEC (loader, page transition, grain, cursor, header, marquee, links, buttons, headings, numbers, logo idle) with reduced-motion branches.
- [ ] Browser: each row checked desktop + reduced motion; no layout shift; commit.

### Task 4: Journey engine + component
**Files:** Create `src/lib/journey.ts`, `src/lib/journey.test.ts`, `src/components/Journey.tsx`; modify `src/pages/Home.tsx` (replace hero + ModelViewer; remove `@google/model-viewer` and `ModelViewer.tsx` if unused).
**Interfaces:** `segmentAt(progress: number, n: number): { index: number; local: number }` (clamped); `transformFor(dir: Dir, local: number): { x: string; y: string; scale: number }` — down: y `-(local*10)%`; side: x `-(local*30)%`; zoom-in: scale `1 + local*0.6`; zoom-out: scale `1.6 - local*0.6`.
- [ ] Tests: `segmentAt(0,5)`→`{0,0}`, `(0.5,5)`→`{2,0.5}`, `(1,5)`→`{4,1}`, `(-1,5)`→`{0,0}`, `(2,5)`→`{4,1}`; `transformFor('zoom-in',1).scale===1.6`, `('zoom-out',1).scale===1`, `('side',0.5).x==='-15%'`.
- [ ] Run → FAIL; implement; → PASS.
- [ ] Implement every "Journey" row of MOTION-SPEC (breathing clip, particles, lasers, titles, progress HUD, tags with leader lines, gate arc, detail callouts, tent finale).
- [ ] Component: section height `n*150vh`, sticky 100svh stage with `overflow:hidden`; current + next video preloaded; rAF sets `currentTime = local*duration`; 250 ms crossfade between scenes; cards as `<Link>`s (wristband tag: name + price), focusable; reduced motion / no video → posters + cards stacked, no pin.
- [ ] Browser: desktop, 375 px, reduced motion, Slow 4G throttle, keyboard tab through cards; no console errors; mobile Lighthouse perf ≥ 70. Commit.

### Task 5: Festival HUD design system
**Files:** Create `src/components/hud/{HudGrid,Tag,TicketCard,Stamp,CutFrame}.tsx`; modify `src/index.css` (tokens + `clip-path` utilities `.cut-step`, `.cut-arch`, `.cut-diag`); `DESIGN.md`.
- [ ] Build components (HudGrid: hairline grid + mono coordinates; Tag: wristband with notch; TicketCard: product card with perforated edge; Stamp: rotated "Drop 01"; CutFrame: image in step/arch/diag clip).
- [ ] Apply to Home sections after the journey (edit, lines, story) with overlapping, non-uniform layout; ProductCard → TicketCard style.
- [ ] Browser at 1280 / 375 px; screenshot each. Commit.

### Task 6: Remaining pages, leftovers, review
- [ ] Shop/Product/Story/Pop-ups/FAQ use HUD components; mobile menu via `useDialog`; regenerate `sitemap.xml`; update DESIGN.md, PRODUCT.md, HANDOFF.md.
- [ ] `npm test && npx tsc -b && npm run build` pass; final whole-branch review; commit.
