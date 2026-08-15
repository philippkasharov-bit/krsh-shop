---
name: KRSH
description: Streetwear & sneakers — disciplined underground aesthetic on a dark editorial canvas
colors:
  black: "#0A0A0A"
  cream: "#F2EDE8"
  electric-lime: "#E8FF00"
  hot-pink: "#FF2D6B"
  surface-dark: "#141414"
  surface-raised: "#1C1C1C"
  text-dim: "rgba(242,237,232,0.65)"
  error: "#ff4444"
typography:
  display:
    fontFamily: "'Clash Display', sans-serif"
    fontSize: "clamp(72px, 13.5vw, 168px)"
    fontWeight: 700
    lineHeight: 0.87
    letterSpacing: "-3px"
  headline:
    fontFamily: "'Clash Display', sans-serif"
    fontSize: "clamp(40px, 5.5vw, 64px)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-2px"
  title:
    fontFamily: "'Clash Display', sans-serif"
    fontSize: "clamp(32px, 4vw, 48px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-1px"
  body:
    fontFamily: "'Satoshi', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Satoshi', sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "3px"
rounded:
  sm: "3px"
  md: "4px"
  lg: "6px"
  pill: "100px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "60px"
  section: "100px"
components:
  button-primary:
    backgroundColor: "{colors.electric-lime}"
    textColor: "{colors.black}"
    rounded: "{rounded.md}"
    padding: "16px 40px"
  button-primary-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.black}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    padding: "8px 0 6px"
  header-cta:
    backgroundColor: "{colors.electric-lime}"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  card-product:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.lg}"
    padding: "0"
  badge-new:
    backgroundColor: "{colors.electric-lime}"
    textColor: "{colors.black}"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
  badge-limited:
    backgroundColor: "{colors.hot-pink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
  input-default:
    backgroundColor: "rgba(242,237,232,0.08)"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
---

# Design System: KRSH

## Overview

**Creative North Star: "The Underground Catalog"**

KRSH presents streetwear with the authority of a subculture zine and the clarity of a premium e-commerce experience. The system runs dark — near-black surfaces broken by cream type and a single electric accent — with the restraint of an editorial layout and the edge of underground print culture. Every surface is dense without feeling cluttered: tight letter-spacing, compact labels, and generous section breathing room create a rhythm that reads as curated, not decorated.

The type pairing does the heavy lifting. Clash Display carries the brand voice at every scale — from the hero display down to price tags — with a geometric bite that reads as both modern and slightly confrontational. Satoshi handles body and UI copy with clean neutrality, staying out of the way. The two never compete: Clash owns identity, Satoshi owns information.

Motion is purposeful and gated. Scroll-triggered reveals (clip-path wipes, scale pops, blur-to-sharp focus pulls) give each section its own entrance, but every animation collapses to instant under `prefers-reduced-motion`. The custom cursor (a paint-drop that morphs on hover) and grain overlay add analog texture without interfering with usability.

**Key Characteristics:**
- Dark-dominant palette with a single electric accent
- Clash Display as the sole display/brand typeface at every heading scale
- Generous vertical section rhythm (100–160px padding) contrasted with tight internal density
- Asymmetric grid layouts that break uniform rhythm without losing readability
- Full `prefers-reduced-motion` gating on all animation
- Unified photo grade filter across all imagery for catalog cohesion

## Colors

A disciplined three-color system: dark ground, warm cream text, and electric lime as the sole accent. Hot pink appears only for scarcity signals.

### Primary
- **Electric Lime** (#E8FF00): The only accent. CTAs, badges, active states, the `×` brand mark, footer headings, focus rings. Its rarity is its power — used sparingly against the dark ground, it reads as a signal, not a style.

### Tertiary
- **Hot Pink** (#FF2D6B): Reserved exclusively for scarcity/urgency: "Limited" badges and low-stock warnings. Never used for CTAs or general emphasis.

### Neutral
- **Near Black** (#0A0A0A): The primary ground. Every page, every section. Not true black — `#0A0A0A` carries just enough warmth to avoid CRT harshness.
- **Warm Cream** (#F2EDE8): Primary text color. Not white — the warm undertone pairs with the dark ground to reduce eye strain and feel editorial rather than technical.
- **Surface Dark** (#141414): Card backgrounds and secondary surfaces. One step above the ground, creating tonal depth without visible borders.
- **Surface Raised** (#1C1C1C): Hover state for cards. Another tonal step, felt more than seen.
- **Dim Text** (rgba(242,237,232,0.65)): Body copy, descriptions, secondary information. The same cream at reduced opacity, so it stays in-family rather than introducing a third hue.

### Named Rules
**The One Accent Rule.** Electric Lime is the only color that draws the eye. If a new element needs to stand out, it uses lime or it doesn't stand out. Adding a second accent color would collapse the system's signal-to-noise ratio.

**The Scarcity Exception.** Hot Pink exists only to signal limited availability. Using it elsewhere dilutes the urgency it carries.

## Typography

**Display Font:** Clash Display (with sans-serif fallback)
**Body Font:** Satoshi (with sans-serif fallback)

**Character:** Geometric authority meets clean utility. Clash Display's tight geometry and negative letter-spacing give every heading a slightly compressed, confrontational energy — it reads as a stencil stamp more than a polished serif. Satoshi disappears into the content, which is exactly its job.

### Hierarchy
- **Display** (700, clamp(72px, 13.5vw, 168px), 0.87): Hero title only. Massive, compressed, unmistakable. Letter-spacing: -3px.
- **Headline** (700, clamp(40px, 5.5vw, 64px), 0.95): Section titles ("New Arrivals", manifesto text). Letter-spacing: -2px. Prefixed with the `×` brand mark.
- **Title** (600, clamp(32px, 4vw, 48px), 1.05): Product names, page titles, order success. Letter-spacing: -1px.
- **Body** (400, 15px, 1.7): Descriptions, manifesto body, product details. Satoshi. Max comfortable width around 480–560px.
- **Label** (700, 10–13px, uppercase, 2–4px letter-spacing): Navigation, badges, CTAs, form labels, trust strip. The system's workhorse — appears more often than any other level. Always uppercase, always tracked wide.

### Named Rules
**The All-Caps Label Rule.** Every piece of UI text smaller than body size is uppercase with wide letter-spacing. This is what gives the system its disciplined, editorial feel. Sentence-case small text would read as a different brand.

## Layout

The system uses a 1200px max-width container with 40px horizontal padding, breaking to full-bleed only for the hero and featured drop. The vertical rhythm alternates between dense sections (20–24px internal gaps) and generous breathing room (80–160px section padding), creating a scroll experience that pulses rather than marches.

Grid behavior varies by section:
- **Product grid:** 4-column at desktop, with even-indexed cards offset 32px down to break uniformity. First card spans 2×2 on wide viewports.
- **Lookbook:** Asymmetric 1.1fr / 0.9fr two-column grid with vertical staggers (60px, -20px) on the second and third cards.
- **Featured drop:** Full-bleed 1:1 split — cream product shot left, dark info right.
- **Footer:** 1.5fr / 1fr / 1fr three-column grid.

Breakpoints: 1024px (grid simplification), 768px (single column, stagger resets), 480px (tighter padding).

## Elevation & Depth

The system is flat by default. There are no box shadows on surfaces at rest — depth is conveyed entirely through tonal layering (black → surface-dark → surface-raised) and the gradient wash on the body pseudo-element.

The single exception is `.btn-primary`, which uses a `0 4px 0 rgba(10,10,10,0.8)` hard shadow to create a physical "stamp" effect — the button reads as a raised sticker pressed onto the surface. On hover it lifts (`translateY(-1px)`, shadow grows to 5px); on active it presses flush (shadow shrinks to 1px, button drops 3px).

### Named Rules
**The Flat Ground Rule.** Surfaces don't float. Cards, inputs, and containers sit flush against their parent. The only element that lifts is the primary CTA, and its shadow is structural (a stamp, not a glow), not ambient.

## Shapes

Corner radii are minimal and functional: 3px on badges and small chips, 4px on buttons and inputs, 6px on cards and image containers, 100px (pill) on the header CTA only. The system avoids fully rounded corners on rectangular elements — the slight radius softens without losing the angular, printed-matter feel.

The `×` multiplication sign is the system's recurring glyph: it separates marquee items, prefixes section titles, and appears in the footer. It always renders in Electric Lime.

Image containers use a warm cream (#f2ede8) background with `object-fit: contain` and ~8% padding, so product shots float on a consistent light field regardless of the image's native background. All photos pass through `--photo-grade` (contrast 1.08, saturation 0.9, brightness 0.97) to unify disparate Unsplash stock into a single tonal family.

## Components

### Buttons
- **Primary:** Electric Lime background, black text, 4px radius, hard stamp shadow. Hover shifts to cream. Active presses down physically. All-caps label typography (12px, 700, 4px tracking).
- **Secondary:** No background, no border. Cream text with an animated yellow underline that extends from 30% to 100% width on hover. Used for "Our Story", "View All" — low-priority navigational actions.
- **Header CTA:** Pill-shaped (100px radius), Electric Lime fill, smaller padding. The only pill in the system — its shape signals primary site navigation.

### Badges
- **New:** Electric Lime background, black text. 10px uppercase, 3px radius.
- **Limited:** Hot Pink background, cream text. Same dimensions. The color alone carries the urgency.

### Cards (Product)
- **Background:** Surface Dark (#141414), 6px radius. Hover lifts to Surface Raised (#1C1C1C) with -3px translateY.
- **Image area:** Cream (#f2ede8) background, product image with contain fit and internal padding. Hover scales image to 1.05.
- **Info bar:** Name (15px, 700) left, price (Clash Display, 17px) right. 16px padding.
- **Quick View / Wishlist:** Appear on hover, bottom/top-right of image area.

### Inputs
- **Default:** Semi-transparent cream background (8% opacity), 1px cream border (18% opacity), 4px radius. 14px padding, Satoshi 16px.
- **Focus:** Border shifts to Electric Lime, background brightens to 12% opacity.
- **Shipping options:** Radio-label cards with cream border, full-width. Active state gets lime border.

### Navigation
- **Desktop:** Uppercase Satoshi labels (13px, 700, 3px tracking) in dim text. Hover brightens to full cream. No underlines.
- **Mobile:** Full-screen dark overlay with large nav links, CTA button at bottom.
- **Header:** Transparent on page load, blurs to 92% black on scroll. Fixed position, 20px → 14px padding transition.

### Marquee
- **Track:** Clash Display, 26px, 700, uppercase, 4px tracking. Continuous horizontal scroll at 30s per loop. Separator `×` glyphs in Electric Lime.

### Order Success
- **Icon:** 64px yellow circle with checkmark, animated scale-pop entrance.
- **Content:** Centered, max 480px, with order number in lime and body in dim text.

## Do's and Don'ts

### Do:
- **Do** use Electric Lime exclusively for interactive elements, active states, and the `×` glyph. Its restriction is what makes it effective.
- **Do** keep all label-scale text uppercase with 2–4px letter-spacing. This is the brand's editorial fingerprint.
- **Do** apply `--photo-grade` to every product and editorial photo. Cohesion across disparate images depends on this single filter.
- **Do** gate all animation behind `prefers-reduced-motion`. The GSAP global timeScale(50) collapse and Lenis skip are load-bearing accessibility features.
- **Do** use negative `outline-offset` (-3px) on elements with clip-path or tight overflow, so focus rings stay visible.
- **Do** maintain the tonal layering hierarchy: black → surface-dark → surface-raised. Three steps, no more.

### Don't:
- **Don't** introduce a second accent color. The one-accent discipline is the system's backbone.
- **Don't** use Hot Pink for anything except limited/scarcity indicators. It's a semantic signal, not a style choice.
- **Don't** add box shadows to cards, containers, or surfaces. Depth comes from tonal steps, not ambient shadows.
- **Don't** use sentence-case for UI labels. Every text element smaller than body size is uppercase with wide tracking.
- **Don't** set product images to `object-fit: cover`. Products float on the cream field via `contain` with padding — cropping them breaks the catalog's visual consistency.
- **Don't** use bounce or elastic easing on scroll-triggered animations. Deceleration curves (`power3.out`, `power4.out`) only — bounce reads as playful, not editorial.
