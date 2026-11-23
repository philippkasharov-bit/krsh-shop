# Pragmatic Hippy: festival shop design (v2)

Status: awaiting approval. Supersedes the "Drops" scroll piece, packshot style and Tasks 4–8 of `2026-11-23-krsh-rave-rebrand-design.md`. Tasks 1–3 there (catalog data, pages, logo, palette, copy) stay.

## Intent
The shop should feel like walking through a psy/rave festival and ending up at its market tent, where every piece is on display. Clothing is hippy mixed with streetwear, not flashy. Motion is the main differentiator.

## Clothing style
- Hippy x streetwear: washed black, charcoal, deep plum, earth tones; subtle tie-dye or hand-dyed washes at most; clean cuts. Max 2 design elements per piece, one of which is the logo.
- **The Pragmatic Hippy logo is the brand mark on every piece**, placed by garment type, never oversized:

| Garment | Logo placement |
|---|---|
| Jackets, shells, puffer (Strobe Jacket, Night Shell, Chrome Puffer) | Back, centred between shoulders, medium |
| Hoodie, velour track top | Back, medium; optional tiny mark on chest |
| Tees (Flyer Tee, Baby Tee 2000) | Small on left chest **or** small-medium on back (one only) |
| Corset top, chain tank | Small, lower back |
| Pants (Glow Cargo, Utility Pant, Low-Rise Flare, velour pant) | Small, left thigh or back pocket |
| Shoes | Heel tab |
| Bag | Small, front centre |
| Visor | Temple arm |

- Logo fidelity: AI generation cannot reproduce the logo exactly. Pieces are generated with a clean area at the placement; the real logo (`public/brand/logo-light.webp` / `logo-dark.webp`) is composited onto it in post with perspective and fabric blending.

## Motion: the festival journey (user's choice: animated clips)
Home is one scroll journey of scenes. Each scene is a short generated clip (image-to-video from an approved still) that is scrubbed by scroll, so it feels like a still that moves. Scroll direction changes between scenes:

1. **Gate** (zoom in): logo over the festival entrance at dusk; scroll pushes through the gate.
2. **Main stage** (down): crowd under lasers; people wearing our pieces; info cards pin to them.
3. **Market path** (sideways): horizontal pan past stalls and campsite at dawn.
4. **Detail** (zoom in): close-up on the logo on a jacket back; fabric and fit info.
5. **The tent shop** (zoom out): camera pulls back to reveal the market tent with all 16 pieces on display; each display is clickable and opens the product.

Clickable product cards ride on top of the clips. Each scene has a poster still (fallback for reduced motion, slow networks and mobile). Budget: 5 clips, 3–5 s each, 720p; cost checked before each, one test clip first.

## Design system: "festival HUD"
- Colours from the logo: black, gold accent, deep purple surfaces, crimson for rare detail. (Gold 8.8:1 on black; purple only for surfaces.)
- Type: Tanker (display), Switzer (text), mono for labels.
- Non-classic layout: thin grid lines with coordinates and small mono labels (HUD style, from the reference reel); stepped and arch cut-outs for image frames; overlapping cards instead of uniform rows. UI details borrowed from festival culture: wristband-style tags for line/price, ticket-stub cards, stamp badges for "Drop 01".
- The plain catalog grid stays at /shop as the accessible, fast way to browse.

## Non-goals / anti-goals
- No flashy, neon-heavy clothing. No fake reviews, real brands or real people.
- Not a heavy site on phones: posters first, clips lazy-loaded, lighter 480p variants.

## Approaches considered
A. Animated clips scrubbed by scroll (**chosen**). B. Real-time 2.5D three.js scene (recommended earlier; more build work, clickable in 3D). C. Full 3D models (rough, heavy; ruled out).

## Order of work
1. Restyle catalog copy to hippy x streetwear where needed; logo placement per piece in data.
2. 16 packshots (one test, approve, batch), logo composited in post.
3. 5 scene stills (one test, approve, batch).
4. 1 test clip, cost check, approve; then the other 4.
5. Build the journey (scroll engine with down / sideways / zoom segments, product cards, fallbacks) and the HUD design system.
6. Restyle the remaining pages to the HUD system; leftovers.

## Left to the builder
Exact clip lengths, encoding, card copy, grid density, cut-out shapes per section.
