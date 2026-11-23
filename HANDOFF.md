# STATUS (2026-11-23, read this first)
Brand is now **Pragmatic Hippy** (logo in public/brand/). Branch ccr-7a56163f-n0juph, nothing pushed.
- Spec: docs/superpowers/specs/2026-11-23-pragmatic-hippy-festival-design.md (approved). Plan: docs/superpowers/plans/2026-11-23-pragmatic-hippy-festival.md. Motion contract: docs/MOTION-SPEC.md. Decisions: docs/superpowers/rulings.md.
- Done: Tasks 1-6 (two-colour catalog + logo spots; 16 packshots with real logo via tools/composite-logo.mjs incl. --quad perspective; 5 journey stills; motion foundation; Journey on Home; HUD components + ticket cards on Home). Tests: npm test (18).
- Clips: the user makes them. Drop mp4 (and optional webm/480p) in public/media/journey/ and set `clip` on the scene in src/data/journey.ts; scrubbing + rest-breathing is already coded (untested without a file).
- Task 6 done (all MOTION-SPEC rows for Product, Bag, Checkout, Story, Pop-ups, FAQ, Saved, 404, mobile menu; sitemap via tools/sitemap.mjs; DESIGN.md/PRODUCT.md). Decisions: docs/superpowers/rulings.md.
- Next ideas: drop in the journey clips; run Lighthouse on mobile; check the reduced-motion path with OS setting on.
- Unverified: reduced-motion paths (no toggle in the browser pane); clip scrub path; checkout confirmation stamp; Lighthouse.
- Credits: ~3,600 Magnific credits spent of ~20,000.

---

# KRSH — handoff for the next Claude Code session

Written at the end of a cloud session so a local (PC) session can continue without re-deriving anything.

## Where things are
- Repo: `philippkasharov-bit/krsh-shop`, branch **`ccr-7a56163f-n0juph`** (all work is pushed there; no PR opened yet — only open one if asked).
- Get it locally:
  ```
  git clone https://github.com/philippkasharov-bit/krsh-shop
  cd krsh-shop && git checkout ccr-7a56163f-n0juph
  npm install && npm run dev
  ```
- Old vanilla site is archived in `legacy/`. Read `DESIGN.md`, `PRODUCT.md`, `README.md` first.

## Decisions the user made
1. **Rebuild from scratch** on Vite + React 19 + TypeScript + Tailwind v4 (they chose this over keeping vanilla). Also: React Router, Motion (`motion/react`), Lenis, `@google/model-viewer` (lazy 3D).
2. **Luxury premium design system** ("Maison"): warm near-black, ivory type, ONE gold accent, sharp corners, hairlines, no shadows.
3. **Latin/English copy, USD prices** (old prices were roubles; converted as rubles ÷ 100).
4. **Keep fictional/demo disclaimers**, no invented testimonials.
5. **Typography direction C "Brutal luxe"**: they hate generic fonts. Target = **Tanker or Melodrama** (display) + **Switzer** (text), all from Fontshare. Current fonts are TEMPORARY stand-ins (Rozha One / Familjen Grotesk / Martian Mono via Fontsource). Swap = edit only the three `--font-*` tokens in `src/index.css`. Verify Fontshare licences when installing.
6. **Motion is the main differentiator** of the site (latest message). Plan: one signature scroll piece + a consistent motion language everywhere else (page transitions, hover, cursor, text reveals), less decoration elsewhere, performance budget, reduced-motion fallback.

## What is built (all working, verified in a browser)
- Pages: Home (3D hero, marquee, edit, numbers, silhouettes, lookbook, service strip), Collection (filter/sort/search/3-up-4-up, URL state), Product (photo + 3D view, hover zoom, 12-size grid with sold-out states, size-guide drawer, reviews, related, sticky mobile buy bar), Bag drawer, Checkout (inline validation, confirmation), Saved, Maison, Ateliers (illustrative SVG map + contact), Care & FAQ, 404.
- Data: `src/data/products.json` + `src/lib/products.ts` (13 products, one source of truth). Cart/wishlist in `localStorage` via `src/lib/store.tsx`.
- Passes already done: type scale (`t-mega/t-1..t-4`), `mt-section` spacing token, fill-sweep buttons, **alignment/symmetry pass** (3+3 header, square uncropped cards, 3-up lookbook, etc.), **nav/UX pass** (focus trap + focus return in drawers via `src/lib/useDialog.ts`, back-button scroll restore in `Layout.tsx`, larger tap targets, category breadcrumb, header hides on scroll down and sticky filter bar follows it via `--hdr`, page fade, checkout back link).
- Known gotcha fixed: base resets must live in `@layer base` or they override Tailwind utilities (the selected size button was unreadable).

## Open items / next steps (suggested order)
1. **Real fonts** (Tanker/Melodrama + Switzer) from Fontshare — network was opened late in the session, not yet done.
2. **Imagery**: product photos are only 1000×1000 (hero 1024, lookbook ~900) so they look soft, especially under the 2.2× zoom. Plan: upscale all 13 product shots + lookbook/about with Magnific (`images_upscale`; modes: `ultra-sublime` 2–4× or `ultra-photo` 2×, then downscale to ~2000–2400 px WebP). Keep real catalog photos as the catalog; use generated media only for atmosphere / the scroll piece. The Magnific upload host is `ak-data.magnific.com` (was blocked earlier; check it now). Check `simulate_cost` before video/batches.
3. **Signature scroll piece — "The Deconstruction"** (user liked the coffee-cup example: cups made and dropped, coffee flying out). Plan: ~500vh pinned section; shoe settles → parts lift apart with labels (leather/laces/sole) → drift + particles → snap back with a gold flash → price + Add to bag, then unpin. Preferred tech: canvas image sequence (120–180 WebP frames, tiered loading, lighter on mobile); alternative: live 3D with a model split into parts. **Blocker:** `public/media/sneaker.glb` is ONE mesh / ONE material, so it cannot be pulled apart. Needs generated frames/clip (Magnific image→video, extract frames) or a segmented/generated 3D model. Reduced-motion fallback = assembled shoe with labels.
4. **Reference reel not yet seen**: `https://www.instagram.com/reel/Df-ubB6s7Nj/` — Instagram needs login, so the cloud session could not open it. On the PC, open it (or ask the user for screenshots) and write a short **motion brief** before building.
5. Inspiration research: only a few pages could be fetched. Candidates (unverified summaries): Cumulus (awwwards.com/sites/cumulus, 3D coffee-machine scroll reveal), Mana Yerba Mate 3D scroll, TAG Heuer Eyewear, P448, Déplacé Maison, Jorik, scroll-driven-animations.style 3D shoe demo, Awwwards "luxury" category. Ask the user what they like before deciding.
6. Smaller leftovers: mobile menu has no focus trap/scroll lock; wishlist/FAQ/404 not re-checked on mobile; hero 3D shoe sits slightly off-centre in its ring; product cards still show mixed photo backgrounds (white/grey/black) — a consistent grade/crop would help; `sitemap.xml` is stale.

## Working agreements
- Step by step; show a plan before big changes; verify in a real browser before claiming done (Playwright is available in the cloud container; locally use `npm run dev`).
- Commit on the branch above; end commit messages with the Co-Authored-By / Claude-Session lines the harness provides; do NOT open a PR unless asked.
- Don't fabricate products, reviews or press. Keep demo disclaimers.
- Don't include the user's personal details in requests to external services.

## Environment notes (cloud session only)
- The cloud session's network is allow-listed: Awwwards and Instagram were refused; Fontshare, motion.dev and the Magnific upload host responded after the user granted web access. A local session has none of these limits and can use the user's logged-in browser.
- Magnific MCP is connected on a paid plan; results go to the Personal project unless a folder is named.
