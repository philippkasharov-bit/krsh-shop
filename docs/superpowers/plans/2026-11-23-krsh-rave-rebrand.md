# KRSH Rave Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn KRSH into Pragmatic Hippy, a rave clothing brand: new 16-piece catalog, logo-based gold/purple identity, and a scroll-scrubbed video "Drops" piece.

**Architecture:** One data source (`src/data/products.json` + `src/lib/products.ts`) drives every page; the catalog changes from shoe categories to four lines with per-kind sizes. Media is generated with Magnific (stills first, then image-to-video), encoded locally with ffmpeg, served from `public/`. The Drops piece is a pinned section that maps scroll progress to `video.currentTime`.

**Tech Stack:** Vite 8, React 19, TypeScript, Tailwind v4, motion/react, Lenis; Vitest (new, dev only); Magnific MCP; ffmpeg 9 (installed).

**Spec:** `docs/superpowers/specs/2026-11-23-krsh-rave-rebrand-design.md`

## Global Constraints
- Lines and prices exactly as in the spec (16 pieces, USD).
- Sizes: clothing `XS S M L XL`; shoes EU `36..46`; bag/visor `One size`.
- Brand name Pragmatic Hippy; palette from logo: black, gold accent (#d4a64a), deep purple (#3a2350), crimson detail only. Logo files in public/brand/.
- No fabricated reviews, ratings, press or real brands. Keep demo disclaimers.
- Fonts stay on the Fontshare API; never commit font files (public repo, FFL).
- Every Magnific video call: `simulate_cost` first; one test clip and user OK before the rest; total video budget agreed with the user before Task 6.
- Generated images: one first, review with `creations_read`, then the batch.
- Commit on `ccr-7a56163f-n0juph`; no PR unless asked.

## Review Focus
1. Old shop URLs (`/shop?cat=low`, `/product/krsh-venom`) → expect the "all" filter / 404 page, not a crash.
2. Cart/wishlist in `localStorage` holding old product ids or numeric shoe sizes → expect stale items dropped, not rendered as `undefined`.
3. Reduced motion → Drops shows posters + static info, no scrubbing.
4. Slow network / video fails to load → poster stays, info still readable.
5. Mobile (375 px) → Drops pin does not trap scroll; callouts don't overflow.

---

### Task 1: Data model and catalog

**Files:**
- Modify: `src/lib/products.ts`, `src/data/products.json`, `package.json`
- Create: `src/lib/products.test.ts`

**Interfaces:**
- Produces: `type Line = 'flash' | 'street' | 'y2k' | 'gear'`; `type Kind = 'apparel' | 'shoe' | 'onesize'`; `Product { id, name, price, line, kind, badge: 'new'|'limited'|null, img, color, sku, stock, desc, materials: string[], fit?: string }` (no `rating/reviewCount/reviews/model/category`); `lineLabel: Record<Line,string>` = Flash / Street / Y2K / Gear; `sizesFor(p: Product): string[]`; `soldOut(p: Product, size: string): boolean`; existing `bySlug, slugOf, money, FREE_SHIPPING_AT, edition` keep their signatures (`edition` returns `'Drop of 200'`).

- [ ] **Step 1:** `npm i -D vitest --silent`; add script `"test": "vitest run"`.
- [ ] **Step 2: Write failing tests** in `products.test.ts`:
  - `catalog has 16 pieces, 4 per line` → counts per `line` all equal 4.
  - `prices match spec` → `bySlug('strobe-jacket')!.price === 320`, `bySlug('flyer-tee')!.price === 65`, `bySlug('visor')!.price === 85`.
  - `sizesFor apparel/shoe/onesize` → `['XS','S','M','L','XL']`, `['36',…,'46']` (11 items), `['One size']`.
  - `no reviews fields` → every product lacks `reviews` and `rating`.
  - `slugs unique` → `new Set(products.map(slugOf)).size === 16`.
- [ ] **Step 3:** Run `npm test` → FAIL.
- [ ] **Step 4:** Rewrite `products.json` with the 16 pieces (ids 0–15; `img: "images/drops/<slug>.webp"`; Flash pieces `badge: 'limited'`, Y2K `'new'`; materials/desc written fresh per piece, short, no claims of real stock or press). Update `products.ts` to the interfaces above.
- [ ] **Step 5:** `npm test` → PASS. `npx tsc -b` will fail in pages; that is Task 2.
- [ ] **Step 6:** Commit `feat: rave catalog data model`.

### Task 2: Wire pages to the new model

**Files:** Modify `src/pages/Shop.tsx`, `Home.tsx`, `Product.tsx`, `src/components/ProductCard.tsx`, `CartDrawer.tsx`, `SizeGuide.tsx`, `Footer.tsx`, `src/lib/store.tsx`.

**Interfaces:** Consumes Task 1. Shop query param becomes `?line=`; unknown values fall back to `all`. Store `size` type becomes `string`.

- [ ] **Step 1: Failing test** in `src/lib/store.test.ts`: `sanitizeCart` (new export from `store.tsx`, `(items: unknown) => CartItem[]`) drops items whose id is not in `products` or whose size is not in `sizesFor(product)`; returns `[]` for non-arrays.
- [ ] **Step 2:** `npm test` → FAIL; implement `sanitizeCart`, apply on load for cart and wishlist (wishlist: drop unknown ids); → PASS.
- [ ] **Step 3:** Update pages: Shop filters by line (labels from `lineLabel`); Product page uses `sizesFor`, removes reviews/rating block and the 3D tab (`ModelViewer` stays for the hero until Task 7); SizeGuide shows an apparel chest/length table for `apparel`, EU→cm for `shoe`, hidden for `onesize`; Footer links per line; copy "footwear" → "pieces".
- [ ] **Step 4:** `npx tsc -b && npm test` → both pass.
- [ ] **Step 5: Browser check** (preview `krsh-dev`): `/shop`, `/shop?line=flash`, `/shop?cat=low` (→ all), `/product/strobe-jacket` (sizes XS–XL), `/product/visor` (one size, no guide), add to bag, reload, bag intact; old `/product/krsh-venom` → 404 page. Images may be missing until Task 4: use the existing placeholder fallback.
- [ ] **Step 6:** Commit `feat: pages use rave catalog`.

### Task 3: Identity: accent and copy

**Files:** Modify `src/index.css`, all `*.tsx` using `gold`, `index.html` meta, `src/lib/seo.ts`, `src/pages/Maison.tsx`, `Faq.tsx`, `Ateliers.tsx`, `Home.tsx` copy, `src/components/Marquee.tsx`.

- [ ] **Step 1:** Keep `--color-gold` (retune to `#d4a64a`), add `--color-purple: #3a2350` and `--color-purple-2: #5b3a7a`; replace `--color-oxblood` by `--color-crimson: #8e1b2b`; logo in Header (dark version, ~44px) and Footer; wordmark "Pragmatic Hippy" replaces "KRSH" everywhere in copy/meta. Check gold-on-ink and ink-on-gold contrast ≥ 4.5:1 for text sizes used.
- [ ] **Step 2:** Copy: tagline "Dress for the floor, wear it to the street."; meta title "KRSH — Rave wear, made after dark"; description keeps "fictional … portfolio build" disclaimer; Maison/Ateliers rewritten as a fictional warehouse-party label; FAQ: sizing (apparel + shoes), drops, returns; marquee items are line names and drop numbers.
- [ ] **Step 3:** `npx tsc -b`; browser pass on Home, Maison, FAQ at 1280 and 375 px; one screenshot each width.
- [ ] **Step 4:** Commit `feat: Pragmatic Hippy identity (logo, palette, copy)`.

### Task 4: Reference stills (16 product shots)

**Files:** Create `public/images/drops/<slug>.webp` ×16, `docs/media-prompts.md` (prompts used, for reproducibility).

- [ ] **Step 1:** Write one master style prompt in `docs/media-prompts.md`: studio packshot on graphite seamless, hard side light, gold rim light, faint purple haze, garment on invisible form, square 1:1, no logos/text except "KRSH" where a print is called for, no people. Per piece: one line describing it from the spec catalog.
- [ ] **Step 2:** `simulate_cost` for `images_generate` with that prompt; report credits for 16 to the user.
- [ ] **Step 3:** Generate Strobe Jacket only; `creations_read`; show the user; adjust prompt until approved.
- [ ] **Step 4:** Generate the other 15; `creations_read` each; regenerate any that miss (max 2 retries each, then ask).
- [ ] **Step 5:** Download, `ffmpeg -i in -vf scale=2000:-1 -c:v libwebp -quality 82 out.webp`; each ≤ 350 KB. Browser check `/shop` grid looks consistent.
- [ ] **Step 6:** Commit `feat: drop packshots`; delete old `public/images/krsh-*.webp` in the same commit.

### Task 5: Scene stills + one test video

**Files:** Create `src/data/drops.ts`, `public/media/drops/<scene>-poster.webp`.

**Interfaces:** Produces `interface Drop { id: string; slug: string /* product */; scene: 'warehouse'|'street'|'skatepark'|'club'; title: string; info: { fabric: string; fit: string; drop: string } ; poster: string; video?: { webm: string; mp4: string } }` and `export const drops: Drop[]` (4–8 entries; start with Strobe Jacket/warehouse, Night Shell/street, Warehouse Hoodie/skatepark, Chrome Puffer/club).

- [ ] **Step 1:** For each scene, generate a worn-in-scene still from the product still (`images_reimagine` or `images_generate` with reference); same one-first rule; save posters.
- [ ] **Step 2:** `video_models_list`; pick an image-to-video model; `simulate_cost` for one 5 s 720p clip from the warehouse poster; tell the user the per-clip cost × scene count.
- [ ] **Step 3:** After user OK, generate the warehouse clip; `video_view_frames`; check garment stays consistent and motion reads under scrubbing (no cuts). If it fails twice, stop and offer the stills fallback.
- [ ] **Step 4:** Agree total video budget with the user. Commit `feat: drop posters and data`.

### Task 6: Remaining videos + encoding

**Files:** Create `public/media/drops/<scene>.webm`, `.mp4`.

- [ ] **Step 1:** Generate remaining clips within the agreed budget; `video_view_frames` each.
- [ ] **Step 2:** Encode for scrubbing (every frame a keyframe so seeking is smooth): `ffmpeg -i in.mp4 -an -vf scale=-2:720 -c:v libx264 -g 1 -crf 26 -movflags +faststart out.mp4` and `-c:v libvpx-vp9 -g 1 -crf 36 -b:v 0 out.webm`; each ≤ 4 MB; also a 480p variant for ≤ 768 px screens.
- [ ] **Step 3:** Fill `video` fields in `drops.ts`. Commit `feat: drop scene videos`.

### Task 7: Drops scroll piece + hero

**Files:** Create `src/components/Drops.tsx`, `src/lib/useScrollProgress.ts`; modify `src/pages/Home.tsx`; remove `ModelViewer` usage from the hero (keep component file only if used elsewhere, else delete it and `@google/model-viewer`).

**Interfaces:** `useScrollProgress(ref: RefObject<HTMLElement>): MotionValue<number>` (0..1 across the section); `<Drops items={drops} />`.

- [ ] **Step 1: Failing test** `src/lib/drops.test.ts`: `sceneAt(progress: number, count: number): { index: number; local: number }` (new, in `Drops.tsx` or `drops.ts`) — `sceneAt(0,4)` → `{index:0,local:0}`, `sceneAt(0.5,4)` → `{index:2,local:0}`, `sceneAt(1,4)` → `{index:3,local:1}`, clamps outside 0..1.
- [ ] **Step 2:** Implement → PASS.
- [ ] **Step 3:** Build `Drops`: section height `items.length * 120vh`, sticky 100vh stage; active scene video `currentTime = local * duration` via rAF (no `play()`); crossfade 200 ms between scenes; hairline callouts (fabric / fit / drop / price + "Add to bag" linking to the product) draw in at `local` 0.15–0.35; preload only current + next video; `prefers-reduced-motion` → stacked posters with static info, no pin; `<source>` webm then mp4, 480p via `media`.
- [ ] **Step 4:** Hero: replace 3D sneaker with the Strobe Jacket warehouse poster + headline; keep marquee.
- [ ] **Step 5:** Browser verification: desktop + 375 px + reduced-motion emulation; throttle network (Slow 4G) and confirm posters + info show before video; no console errors; Lighthouse performance ≥ 80 on mobile for Home.
- [ ] **Step 6:** Commit `feat: Drops scroll piece and new hero`.

### Task 8: Leftovers and docs

**Files:** Modify `src/components/Header.tsx` (mobile menu), `sitemap.xml`, `HANDOFF.md`, `DESIGN.md`, `PRODUCT.md`.

- [ ] **Step 1:** Mobile menu uses `useDialog` (focus trap, Esc, scroll lock); verify with keyboard at 375 px.
- [ ] **Step 2:** Regenerate `sitemap.xml` from `products` (16 product URLs + pages).
- [ ] **Step 3:** Update DESIGN.md (gold/purple tokens, logo, lines), PRODUCT.md (rave wear), HANDOFF.md status.
- [ ] **Step 4:** `npm test && npx tsc -b && npm run build` all pass; commit `chore: menu a11y, sitemap, docs`.
