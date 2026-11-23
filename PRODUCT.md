# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4, React Router, Motion (`motion/react`), Lenis (smooth scroll), Vitest. Fonts: Tanker + Switzer via the Fontshare API, Martian Mono via Fontsource. Media tooling: `tools/catalog.mjs` (catalog JSON), `tools/composite-logo.mjs` (real logo onto packshots, with perspective), `tools/sitemap.mjs`.

## Users

Front-end craft evaluators: recruiters, hiring managers, potential clients and peer developers judging UI, UX and motion skill — not real shoppers.

## Product Purpose

Pragmatic Hippy is a fictional psy/rave festival clothing label built as a portfolio piece. The home page is a scroll journey through a festival (gate, main stage, market, close-up, tent shop) that ends in a shop where every piece is on display. Motion is the main differentiator.

## Positioning

Most portfolio shops stop at a homepage mockup. This one has depth (full purchase flow, real cart math, validation, empty states) and a signature scroll experience with motion on every detail.

## Operating Context

Routes: `/` (journey + edit + story + lines + lookbook), `/shop` (lines filter, search, sort), `/shop/:slug` (product), bag drawer, `/checkout`, `/wishlist`, `/maison` (Story), `/ateliers` (Pop-ups), `/faq`, 404. Data: `src/data/products.json` (16 pieces) and `src/data/journey.ts` (5 scenes).

## Capabilities and Constraints

- No backend: cart, checkout and wishlist are demo-only (localStorage `ph-cart`, `ph-wish`), no payment, nothing ships.
- Product shots and scene stills are AI-generated (Magnific); the logo on garments is the real logo composited in post, not generated.
- Journey clips are made by the owner and dropped into `public/media/journey/`; until then scenes animate their stills.
- Fontshare fonts must not be committed (licence, public repo).

## Brand Commitments

- Name: Pragmatic Hippy. Tagline: "Dress for the floor, wear it to the street."
- Garments: hippy x streetwear, about 80% dark base + one bright accent, max two design elements, the logo placed per garment type (see `docs/media-prompts.md`).
- Site palette: black, one gold accent, purple surfaces, crimson rarely (see DESIGN.md).
- Keep the fictional/demo disclaimers visible.

## Evidence on Hand

- 16 catalog pieces in `src/data/products.json` — the only legitimate catalog; do not invent more.
- No real customers, reviews, press or sales data exist — never fabricate any.
- Pop-up cities are fictional nights named by district, not real addresses.

## Product Principles

1. Depth over screenshots: every feature works end to end.
2. Motion everywhere, but purposeful and within the budget in `docs/MOTION-SPEC.md`.
3. Be upfront about what is simulated.
4. Accessibility is production-grade: WCAG 2.2 AA, keyboard reachable, reduced-motion path for everything.
5. One source of truth for data.

## Accessibility & Inclusion

WCAG 2.2 AA. Reduced motion removes pin, scrub, particles, custom cursor and beat pulses. Drawers and the mobile menu trap focus, close on Escape and return focus. Journey scenes are reachable by keyboard through the progress buttons; every product is also in `/shop`.
