# KRSH — Streetwear & Sneakers

A self-initiated e-commerce portfolio project: a fictional streetwear/sneaker
brand built to demonstrate front-end craft — visual design system, full
purchase flow, and production-grade polish (accessibility, performance,
SEO) — with no backend and no framework.

**Live structure:** `index.html` → `catalog.html` → `product.html?id=N` →
cart drawer → `checkout.html`. Also: `about.html`, `faq.html`, `contact.html`,
`404.html`.

## Why this exists

Most junior portfolios show a homepage mockup. This project instead builds
the whole customer journey — browse, filter, view a product, add to cart,
check out — because that's where real UX problems live (empty states, cart
math, form validation, a confusing step), not on the hero.

## Design system

**Visual identity:** stencil/spray-cut aesthetic — every interactive
surface (buttons, cards, badges) uses a hand-tuned `clip-path: polygon()`
to read as spray-stencilled rather than a soft rounded rectangle. Paired
with a disciplined grid underneath so the "chaos" stays readable.

**Motion:** a custom canvas-based graffiti engine (`graffiti.js`) — floating
icon particles, an interactive spray-paint cursor, and scroll-triggered SVG
"tag" art — layered on top of GSAP + ScrollTrigger + Lenis for scroll-linked
reveals. All of it is gated behind `prefers-reduced-motion`: the continuous
canvas loops don't start at all, GSAP tweens collapse to instant via
`gsap.globalTimeline.timeScale(50)`, and Lenis's inertia scroll is skipped
in favor of native scroll.

**Data:** all 15 products live in one place, `products-data.js`
(`window.KRSH_PRODUCTS`), consumed by both the catalog grid (`catalog.js`)
and the dynamic product page (`product.html?id=N`). One source of truth
instead of duplicating product HTML per page.

## Accessibility

Audited with Lighthouse (mobile + desktop) to a clean 100/100/100/100
(Accessibility / Best Practices / SEO / agentic-browsing). Notable fixes
made during that pass, kept here because the *why* is easy to lose:

- **Clip-path clips outlines.** Any element with a stencil `clip-path` was
  silently swallowing its own focus ring — a positive-offset outline gets
  clipped by the same polygon as the element. Fixed with a global
  `:focus-visible` rule that uses a *negative* `outline-offset` on those
  elements so the ring draws inside the cut shape instead of outside it.
- **Decorative marquee text failed contrast.** The scrolling brand strip
  used low-opacity text for a "ghosted" look; contrast-checked opacities
  against the actual background color instead of eyeballing it.
- **Cart badge vs. aria-label mismatch.** The cart button's `aria-label`
  ("Open cart") didn't include the visible item-count badge, which axe
  flags as a screen-reader/visual mismatch. Fixed by syncing the label with
  the live count (`Open cart, 2 items`) whenever the cart updates.

## Known trade-offs (being upfront, not hiding them)

- No backend — cart/checkout/wishlist are demo-only (localStorage,
  no real payment or persistence across devices).
- Product imagery is Unsplash stock, not a real catalog shoot.
- Built solo as a portfolio piece, not shipped to real users — so some
  decisions (e.g. checkout flow) are simplified vs. a production store.

## Stack

Vanilla HTML/CSS/JS. GSAP + ScrollTrigger for scroll animation, Lenis for
smooth scroll, Fontshare (Clash Display + Satoshi) for type. No build step,
no framework — deliberate, to keep the DOM/CSS/JS reasoning fully visible
for review.
