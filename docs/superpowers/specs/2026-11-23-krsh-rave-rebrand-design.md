# KRSH rave-wear rebrand: design

Status: approved 2026-11-23. Size: project. Builder check: read by the author (no subagent, per user's token rules).

## Intent
KRSH stops being a sneaker house and becomes a **rave clothing brand** with a real, unique identity. The user found the old catalog (clean black/white sneakers) generic. Fictional/demo disclaimers stay.

## Identity (proposal, user approved direction)
- Tagline: "Dress for the floor, wear it to the street."
- Mood: warehouse party, flyer culture, Y2K tech. Palette: graphite + bone + ONE UV-acid accent (replaces gold). Type: Tanker display + Switzer text (done).
- Keep the name KRSH (user did not ask to change it).

## Catalog (16 pieces, USD, user approved)
- **Flash**: Strobe Jacket $320, Laser Corset Top $180, Glow Cargo $210, Chain Mail Tank $150
- **Street**: Warehouse Hoodie $140, Flyer Tee $65, Utility Pant $160, Night Shell $230
- **Y2K**: Baby Tee 2000 $70, Low-Rise Flare $150, Chrome Puffer $260, Velour Set $220
- **Gear**: Strobe Sneaker $240, Court Hi $280, Mini Shoulder Bag $90, Visor $85
Sizes: XS-XL for clothing, 36-46 for shoes, one-size for bag/visor.

## Scroll piece: "Drops" (user's choice: video scenes)
Pinned scroll sections; each drop = one piece shown worn in a different scene (warehouse floor, night street, skate park, Y2K club) with info callouts (fabric, fit, price, drop number) drawn as hairlines. Each scene is a generated video clip scrubbed by scroll position. Not a literal deconstruction; `sneaker.glb` is no longer needed for this.

## Goals
- Distinctive brand and catalog; one memorable scroll piece; consistent motion language elsewhere.
- Works on mobile and with reduced motion.

## Non-goals / anti-goals
- No real brands/people/trademarks; no fake reviews/press.
- Not a generic "dark luxury" look; no particles/gradient clutter.
- Must not ship heavy video that tanks load time.

## Constraints and risks
- Video is the costliest and least consistent generation. Mitigations: **simulate_cost before every video call; generate ONE clip first, view frames, then the rest**; short loops (3-5 s), 720p, WebM/MP4 tiered by device; poster still per scene as fallback and for reduced-motion; lazy-load per section; budget of ~8-10 scenes max.
- Consistent garment identity across scenes: use one approved reference still per piece as the video source (image-to-video).
- Fontshare fonts are not committed to the public repo (licence); loaded via API.
- Reel reference (spatialsites.co promo): borrow mechanics (state swap, "look closer" zoom, hairline labels), not layouts. See docs/MOTION-BRIEF.md.

## Approaches considered
1. Stills only (cheapest, safest, least motion). 2. **Video scenes (chosen by user).** 3. Hybrid stills + one video (recommended by author, not chosen). Because 2 was chosen, the cost/consistency gates above are mandatory, and stills double as fallbacks, so falling back to 1 is cheap.

## Order of work (for the plan)
1. Rewrite `products.json`, categories/filters, sizes, copy, accent token.
2. Generate reference stills for 16 pieces (one first, review, then batch).
3. Generate 1 test video, review, then remaining scenes within a credit budget agreed with the user.
4. Build the Drops scroll piece (canvas/video scrub, callouts, fallbacks); rebuild hero.
5. Leftovers from HANDOFF.md (mobile menu focus trap, sitemap, etc.).

## Left to the builder
Exact scene count, clip lengths, encoding, callout copy, hero composition, accent hex.
