# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vanilla HTML/CSS/JS, no build step, no framework — deliberate, to keep DOM/CSS/JS reasoning fully visible for review. GSAP + ScrollTrigger for scroll animation, Lenis for smooth scroll, Fontshare (Clash Display + Satoshi) for type.

## Users

Front-end craft evaluators: recruiters/hiring managers, potential clients, and peer developers assessing UI/UX skill — not real shoppers. They're judging visual design system quality, full purchase-flow completeness, and production-grade polish (accessibility, performance, SEO), typically by clicking through the whole journey rather than skimming a single screen.

## Product Purpose

KRSH is a self-initiated, fictional streetwear/sneaker e-commerce brand built as a front-end portfolio piece. It exists to demonstrate that the author can execute a complete customer journey — browse, filter, view a product, add to cart, check out — not just a polished hero mockup, because that's where real UX problems (empty states, cart math, form validation, confusing steps) actually surface. Success means an evaluator experiences a coherent, accessible, production-quality flow end to end.

## Positioning

Most junior/portfolio front-end work stops at a homepage mockup. KRSH's differentiator is depth: a full, working purchase flow (home → catalog → product → cart → checkout) plus deliberate accessibility engineering (documented Lighthouse 100/100/100/100, specific fixes for clip-path-clipped focus rings, marquee contrast, cart-badge/aria-label sync) that a neighboring "pretty landing page" portfolio piece could not truthfully claim.

## Operating Context

Live structure: `index.html` → `catalog.html` → `product.html?id=N` → cart drawer → `checkout.html`, plus `about.html`, `faq.html`, `contact.html`, `404.html`. Cart and wishlist persist via `localStorage` only. All 15 products live in one source of truth, `products-data.js` (`window.KRSH_PRODUCTS`), consumed by `catalog.js` and the dynamic `product.html`.

## Capabilities and Constraints

- No backend: cart, checkout, and wishlist are demo-only — no real payment processing, no cross-device persistence.
- Product imagery is Unsplash stock, not a real catalog shoot.
- Built solo, not shipped to real users, so some flows (e.g. checkout) are intentionally simplified vs. a production store.
- No framework/build step is a permanent constraint, not a temporary one — future work should keep reasoning visible in plain HTML/CSS/JS rather than introducing tooling.

## Brand Commitments

- Name: KRSH. Tagline: "Your feet. Your rules." Founding story: started in a garage in 2019.
- Voice: streetwear/underground-culture register — "No hype tax", "real kicks for the culture", direct and unpolished rather than corporate.
- Visual identity (established, treat as binding unless a redesign is explicitly requested): stencil/spray-cut aesthetic — interactive surfaces (buttons, cards, badges) use hand-tuned `clip-path: polygon()` to read as spray-stencilled, on a disciplined grid so the "chaos" stays readable. Motion layer is a custom canvas graffiti engine (floating icon particles, interactive spray-paint cursor, scroll-triggered SVG "tag" art) layered on GSAP/ScrollTrigger/Lenis.
- All motion is gated behind `prefers-reduced-motion`: canvas loops don't start, GSAP tweens collapse via `gsap.globalTimeline.timeScale(50)`, Lenis inertia scroll is skipped in favor of native scroll. This gating is a durable requirement for any future motion work.

## Evidence on Hand

- 15 real product entries with prices, names, and images in `products-data.js` — treat as the only legitimate product catalog; do not invent additional products without adding them there.
- No real customer testimonials, press, or sales data exist — do not fabricate any.
- Trust-strip claims (free shipping over $200, secure checkout, 14-day returns, authenticity guaranteed) and the newsletter signup are fictional storefront conventions consistent with the portfolio premise, not verified business facts.

## Product Principles

1. Depth over polish-only: every feature must work end to end (real cart math, real empty states, real validation), not just look right in a screenshot.
2. Identity is disciplined chaos: the stencil/spray aesthetic and graffiti motion layer express the brand, but a strict grid and motion gating keep it usable and accessible — never let expression break function.
3. No backend is a feature of the premise, not a gap to hide: be upfront in visible copy/docs about what's real vs. simulated.
4. Accessibility is production-grade, not an afterthought: WCAG 2.2 AA is the durable bar; motion, contrast, and focus-visibility fixes made during the Lighthouse-100 pass must not regress.
5. One source of truth for data (`products-data.js`) — never duplicate product HTML per page.

## Accessibility & Inclusion

WCAG 2.2 AA is the durable target. Preserve existing fixes: negative `outline-offset` focus rings on `clip-path`-cut elements (positive offsets get clipped by the polygon), contrast-checked marquee opacity against actual background color, and cart badge count synced into the cart button's `aria-label`. Full `prefers-reduced-motion` gating (canvas loops, GSAP timescale, Lenis native-scroll fallback) must be preserved in any motion work.
