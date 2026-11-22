# KRSH — Footwear, finished by hand

A fictional luxury sneaker house, built as a front-end portfolio piece. **v3** is a ground-up rebuild: Vite, React 19, TypeScript and Tailwind v4, with a luxury design system (see `DESIGN.md`).

```
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Journey
Home → Collection (filter, sort, search, 3/4-up) → Product (photo + 3D view, sizes with sold-out states, sticky buy bar, reviews) → Bag drawer → Checkout (inline validation, order confirmation). Also: Saved pairs, Maison, Ateliers (illustrative map + contact form), Care & FAQ, 404.

## Honesty
No backend. Cart and wishlist persist in `localStorage`. Checkout takes no payment. Products, reviews and stores are fictional and labelled as such. Prices are in USD (previously roubles ÷ 100).

## Structure
- `src/lib/products.ts` + `src/data/products.json`: single source of truth for the 13 products.
- `src/lib/store.tsx`: cart + wishlist context. `src/lib/motion.tsx`: shared reveal primitives.
- `legacy/`: the previous vanilla site, kept for reference.

## Accessibility
Skip link, focus-visible rings, labelled controls, `aria-live` quantity and status regions, modal cart drawer with Escape and focus handling, and full `prefers-reduced-motion` support.

## Inspiration
The rebuild borrows ideas from the sites below. Several could not be fetched live in the build environment (network allowlist), so those influences come from prior knowledge rather than a fresh read: Motion, Anime.js, Motion Primitives, React Bits, Aceternity UI, Magic UI, 21st.dev, shadcn/ui, Mobbin, Httpster, Land-book, Component Gallery, getdesign.md, Refero Styles, awesome-design-md, Open Peeps, 3dicons, unDraw, Spline, mapcn, Uiverse. Only awesome-design-md was read live.
