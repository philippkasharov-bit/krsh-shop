const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Resolved from this file so the generator runs from any clone.
const IMG = path.join(__dirname, '..', '..', 'images');
// Optional first arg overrides the output path.
const OUT = process.argv[2] || path.join(__dirname, 'KRSH-CaseStudy.pptx');

const W = 10, H = 5.625, M = 0.62, CW = W - M * 2;

// ─── REAL tokens, lifted from style.css :root ───
const INK   = '0A0A0A';  // --black
const BONE  = 'F2EDE8';  // --white   (warm off-white, not #FFF)
const ACID  = 'E8FF00';  // --yellow
const PINK  = 'FF2D6B';  // --pink
const GRAY  = '141414';  // --gray
const GRAY2 = '1C1C1C';  // --gray2
const DIM   = '9D9A97';  // --text-dim flattened on ink
const HAIR  = '2A2A28';

const DISP = 'Arial Black';
const UI   = 'Arial';
const BODY = 'Cambria';

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Philipp Kasharov';
pres.title  = 'KRSH — Design Decision Pipeline';

const errs = [];
function guard(t, o) {
  if (o.x < -0.001 || o.y < -0.001 || o.x + o.w > W + 0.001 || o.y + o.h > H + 0.001)
    errs.push(`${t}: ${o.x},${o.y} ${o.w}x${o.h} -> r=${(o.x + o.w).toFixed(2)} b=${(o.y + o.h).toFixed(2)}`);
  return o;
}
function b64(f) {
  const p = path.join(IMG, f);
  if (!fs.existsSync(p)) return null;
  const e = path.extname(f).toLowerCase().replace('.', '');
  return (e === 'png' ? 'image/png' : 'image/jpeg') + ';base64,' + fs.readFileSync(p).toString('base64');
}
function slide() {
  const s = pres.addSlide();
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: INK }, line: { width: 0 } });
  return s;
}
function rect(s, o) { s.addShape(pres.ShapeType.rect, { ...guard('rect', o), line: { width: 0 } }); }
function tx(s, t, o) { s.addText(t, { margin: 0, valign: 'top', ...guard('tx', o) }); }
/** shape transparency is ignored by the renderer — dim on the image instead */
function photo(s, f, o, dim) {
  const d = b64(f); guard('ph', o);
  if (!d) return rect(s, { ...o, fill: { color: GRAY } });
  const i = { data: d, x: o.x, y: o.y, w: o.w, h: o.h, sizing: { type: 'cover', w: o.w, h: o.h } };
  if (dim) i.transparency = dim;
  s.addImage(i);
}
function tile(s, f, o, bg) {
  guard('tl', o); rect(s, { ...o, fill: { color: bg || BONE } });
  const d = b64(f); if (!d) return;
  const p = Math.min(o.w, o.h) * 0.05;
  s.addImage({ data: d, x: o.x + p, y: o.y + p, w: o.w - p * 2, h: o.h - p * 2,
    sizing: { type: 'contain', w: o.w - p * 2, h: o.h - p * 2 } });
}
function head(s, n, t, o = {}) {
  tx(s, n, { x: M, y: 0.4, w: 2, h: 0.2, fontSize: 9, bold: true, color: ACID, fontFace: UI, charSpacing: 3 });
  tx(s, t, { x: M, y: 0.66, w: o.w || CW, h: o.h || 0.5, fontSize: o.size || 30, bold: true,
    color: BONE, fontFace: DISP, lineSpacingMultiple: 0.98 });
}
function kick(s, t, o) {
  tx(s, t, { fontSize: 8.5, bold: true, color: ACID, fontFace: UI, charSpacing: 2.5, h: 0.2, ...o });
}

/**
 * THE PIPELINE — the deck's whole argument.
 * Four fixed stages, identical on every decision slide, so the reader can
 * compare reasoning across decisions instead of re-learning a new layout.
 */
const STAGES = ['CONSTRAINT', 'OPTIONS', 'DECISION', 'COST'];
function pipeline(s, y, cells, h) {
  const bw = (CW - 0.36) / 4, hh = h || 1.72;
  cells.forEach((c, i) => {
    const x = M + i * (bw + 0.12);
    const isDecision = i === 2;
    rect(s, { x, y, w: bw, h: hh, fill: { color: isDecision ? GRAY2 : GRAY } });
    rect(s, { x, y, w: bw, h: 0.035, fill: { color: isDecision ? ACID : HAIR } });
    tx(s, STAGES[i], { x: x + 0.16, y: y + 0.16, w: bw - 0.32, h: 0.18,
      fontSize: 7, bold: true, color: isDecision ? ACID : DIM, fontFace: UI, charSpacing: 2 });
    tx(s, c.t, { x: x + 0.16, y: y + 0.4, w: bw - 0.32, h: 0.42,
      fontSize: 11.5, bold: true, color: BONE, fontFace: UI, lineSpacingMultiple: 1.1 });
    tx(s, c.b, { x: x + 0.16, y: y + 0.86, w: bw - 0.32, h: hh - 1.0,
      fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.4 });
    if (i < 3) tx(s, '›', { x: x + bw + 0.005, y: y + hh / 2 - 0.14, w: 0.11, h: 0.28,
      fontSize: 14, color: HAIR, fontFace: UI, align: 'center' });
  });
}

// ══════════════ 1 · COVER ══════════════
{
  const s = slide();
  photo(s, 'lookbook-3.jpg', { x: 4.55, y: 0, w: 5.45, h: H });
  tx(s, 'KRSH', { x: M, y: 1.3, w: 4.6, h: 1.1, fontSize: 78, bold: true, color: BONE, fontFace: DISP, charSpacing: 3 });
  tx(s, 'STREETWEAR  &  SNEAKERS', { x: M, y: 2.52, w: 3.9, h: 0.22, fontSize: 9, bold: true, color: DIM, fontFace: UI, charSpacing: 4 });
  rect(s, { x: M, y: 2.92, w: 0.9, h: 0.05, fill: { color: ACID } });
  tx(s, 'The decision pipeline behind\nan e-commerce build.',
    { x: M, y: 3.18, w: 3.9, h: 0.8, fontSize: 15, color: BONE, fontFace: BODY, lineSpacingMultiple: 1.35 });
  tx(s, 'CASE STUDY  ·  2026', { x: M, y: 4.66, w: 3.5, h: 0.22, fontSize: 9, bold: true, color: ACID, fontFace: UI, charSpacing: 3 });
  tx(s, 'Philipp Kasharov', { x: M, y: 4.92, w: 3.5, h: 0.24, fontSize: 11, color: DIM, fontFace: UI });
}

// ══════════════ 2 · THE METHOD ══════════════
{
  const s = slide();
  head(s, '01 —', 'HOW EVERY CHOICE WAS MADE');

  tx(s, 'No element in this build is a preference. Each one is the output of the same four-step pass — and every slide that follows shows its work in exactly this shape.',
    { x: M, y: 1.24, w: CW, h: 0.52, fontSize: 12, color: BONE, fontFace: BODY, lineSpacingMultiple: 1.4 });

  const bw = (CW - 0.36) / 4;
  const defs = [
    { t: 'What is fixed', b: 'A fact I do not control: the source photography, the catalog size, the device mix, the absence of a backend.' },
    { t: 'What was on the table', b: 'The two or three credible alternatives — written down so the choice is falsifiable, not retrofitted.' },
    { t: 'What shipped', b: 'The concrete value in the codebase: a hex, a column count, a millisecond figure, a breakpoint.' },
    { t: 'What it cost', b: 'The thing the decision gave up. A decision with no cost was never a decision.' },
  ];
  defs.forEach((d, i) => {
    const x = M + i * (bw + 0.12);
    const on = i === 2;
    rect(s, { x, y: 1.94, w: bw, h: 2.1, fill: { color: on ? GRAY2 : GRAY } });
    rect(s, { x, y: 1.94, w: bw, h: 0.035, fill: { color: on ? ACID : HAIR } });
    tx(s, String(i + 1).padStart(2, '0'), { x: x + 0.18, y: 2.16, w: 0.6, h: 0.26, fontSize: 12, bold: true, color: on ? ACID : DIM, fontFace: DISP });
    tx(s, STAGES[i], { x: x + 0.18, y: 2.48, w: bw - 0.36, h: 0.2, fontSize: 8, bold: true, color: ACID, fontFace: UI, charSpacing: 2 });
    tx(s, d.t, { x: x + 0.18, y: 2.72, w: bw - 0.36, h: 0.24, fontSize: 11.5, bold: true, color: BONE, fontFace: UI });
    tx(s, d.b, { x: x + 0.18, y: 3.02, w: bw - 0.36, h: 0.9, fontSize: 9, color: DIM, fontFace: UI, lineSpacingMultiple: 1.42 });
  });

  rect(s, { x: M, y: 4.36, w: 0.05, h: 0.62, fill: { color: ACID } });
  tx(s, 'The test I held every decision to',
    { x: M + 0.26, y: 4.36, w: CW - 0.26, h: 0.24, fontSize: 11, bold: true, color: ACID, fontFace: UI });
  tx(s, 'If I cannot name what the choice gave up, I have not made a decision — I have expressed a taste.',
    { x: M + 0.26, y: 4.64, w: CW - 0.26, h: 0.34, fontSize: 12.5, color: BONE, fontFace: BODY, italic: true });
}

// ══════════════ 3 · THE CONSTRAINTS ══════════════
{
  const s = slide();
  head(s, '02 —', 'THE FIXED INPUTS');
  tx(s, 'Four facts I could not change. Everything downstream is derived from these.',
    { x: M, y: 1.2, w: CW, h: 0.28, fontSize: 12, color: DIM, fontFace: BODY });

  const cons = [
    { n: 'Disparate photography', b: 'Seventeen product shots from different sources — white, grey and black backgrounds, inconsistent light and colour cast.', out: 'Forces a unifying grade + a tile' },
    { n: 'No backend', b: 'Static hosting only. No server, no session, no database, no auth.', out: 'Forces localStorage + no account wall' },
    { n: 'Small catalog', b: 'Seventeen products. Not seventy, not seven hundred.', out: 'Forces browse-first, not search-first' },
    { n: 'Solo build', b: 'One person designing and shipping. No design-system team to maintain a component library.', out: 'Forces a tiny token set, used strictly' },
  ];
  cons.forEach((c, i) => {
    const w = (CW - 0.36) / 4;
    const x = M + i * (w + 0.12);
    rect(s, { x, y: 1.66, w, h: 2.5, fill: { color: GRAY } });
    tx(s, c.n, { x: x + 0.18, y: 1.9, w: w - 0.36, h: 0.5, fontSize: 12, bold: true, color: BONE, fontFace: UI, lineSpacingMultiple: 1.1 });
    tx(s, c.b, { x: x + 0.18, y: 2.46, w: w - 0.36, h: 1.1, fontSize: 9.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.42 });
    rect(s, { x: x + 0.18, y: 3.6, w: w - 0.36, h: 0.012, fill: { color: HAIR } });
    tx(s, c.out, { x: x + 0.18, y: 3.72, w: w - 0.36, h: 0.36, fontSize: 9, bold: true, color: ACID, fontFace: UI, lineSpacingMultiple: 1.3 });
  });

  tx(s, 'Read that bottom row as the spine of this deck: each constraint hands the next section its brief.',
    { x: M, y: 4.44, w: CW, h: 0.3, fontSize: 11.5, color: BONE, fontFace: BODY });
}

// Shared geometry for every decision slide, so the pipeline lands in the
// identical place each time and the reader's eye never has to re-orient.
const PROOF_Y = 1.16, PROOF_H = 1.34, PIPE_Y = 2.58, PIPE_H = 1.96, TAKE_Y = 4.68;
function takeaway(s, t) {
  rect(s, { x: M, y: TAKE_Y, w: 0.05, h: 0.36, fill: { color: ACID } });
  tx(s, t, { x: M + 0.24, y: TAKE_Y, w: CW - 0.24, h: 0.36, fontSize: 11.5, color: BONE, fontFace: BODY, lineSpacingMultiple: 1.25 });
}

// ══════════════ 4 · THE GROUND ══════════════
{
  const s = slide();
  head(s, '03 —', 'DECISION 01 · THE GROUND', { size: 26 });

  // proof: the source photography is uniformly low-light
  kick(s, 'THE EVIDENCE — EVERY EDITORIAL FRAME I HAD TO WORK WITH', { x: M, y: PROOF_Y, w: 6 });
  ['lookbook-1.jpg', 'lookbook-2.jpg', 'lookbook-3.jpg', 'hero-bg.jpg'].forEach((f, i) => {
    photo(s, f, { x: M + i * 1.34, y: PROOF_Y + 0.26, w: 1.22, h: 1.02 });
  });
  tx(s, 'Overcast, dusk, sodium light, wet concrete.\nNot one frame is bright. A white interface\nwould fight the imagery on every scroll.',
    { x: M + 5.5, y: PROOF_Y + 0.3, w: 3.2, h: 1.0, fontSize: 10, color: DIM, fontFace: UI, lineSpacingMultiple: 1.42 });

  pipeline(s, PIPE_Y, [
    { t: 'Low-light source art', b: 'All editorial photography is overcast and nocturnal. Product cutouts arrive on three different grounds — white, grey, black.' },
    { t: 'Three grounds tested', b: 'Gallery white · split (light catalog, dark editorial) · one dark ground. Split was rejected first — it makes the catalog feel like a different site.' },
    { t: '#0A0A0A everywhere', b: 'One ground, every page. Near-black rather than pure black, so surfaces at #141414 and #1C1C1C can still be read as raised.' },
    { t: 'Cutouts need a tile', b: 'White-background product shots cannot sit directly on ink — which is exactly what forces the card treatment two decisions later.' },
  ], PIPE_H);

  takeaway(s, 'The ground was chosen by the photography, not the other way round — and it immediately created the problem that the product card exists to solve.');
}

// ══════════════ 5 · THE ACCENTS ══════════════
{
  const s = slide();
  head(s, '04 —', 'DECISION 02 · TWO ACCENTS, STRICTLY SPLIT', { size: 24 });

  // proof: the two accents doing their two different jobs
  rect(s, { x: M, y: PROOF_Y, w: 4.2, h: PROOF_H, fill: { color: GRAY } });
  tx(s, 'INTERACTIVE', { x: M + 0.2, y: PROOF_Y + 0.16, w: 2, h: 0.18, fontSize: 7.5, bold: true, color: DIM, fontFace: UI, charSpacing: 2 });
  rect(s, { x: M + 0.2, y: PROOF_Y + 0.42, w: 1.7, h: 0.34, fill: { color: ACID } });
  tx(s, 'SHOP NOW', { x: M + 0.2, y: PROOF_Y + 0.42, w: 1.7, h: 0.34, fontSize: 8, bold: true, color: INK, fontFace: UI, align: 'center', valign: 'middle', charSpacing: 2 });
  tx(s, '#E8FF00\nButtons, links, prices,\nactive states. Nothing else.',
    { x: M + 2.05, y: PROOF_Y + 0.36, w: 2.0, h: 0.8, fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.35 });

  rect(s, { x: M + 4.44, y: PROOF_Y, w: 4.32, h: PROOF_H, fill: { color: GRAY } });
  tx(s, 'STATUS', { x: M + 4.64, y: PROOF_Y + 0.16, w: 2, h: 0.18, fontSize: 7.5, bold: true, color: DIM, fontFace: UI, charSpacing: 2 });
  rect(s, { x: M + 4.64, y: PROOF_Y + 0.42, w: 1.4, h: 0.34, fill: { color: PINK } });
  tx(s, 'LIMITED', { x: M + 4.64, y: PROOF_Y + 0.42, w: 1.4, h: 0.34, fontSize: 8, bold: true, color: BONE, fontFace: UI, align: 'center', valign: 'middle', charSpacing: 2 });
  tx(s, '#FF2D6B\nScarcity and stock only.\nNever clickable.',
    { x: M + 6.2, y: PROOF_Y + 0.36, w: 2.4, h: 0.8, fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.35 });

  pipeline(s, PIPE_Y, [
    { t: 'Two jobs, one signal', b: 'Actions must be unmissable. Scarcity must also be unmissable. One accent doing both teaches the shopper that a "Limited" badge is a button.' },
    { t: 'One accent vs two', b: 'A single accent plus neutral badges was tested — scarcity disappeared. Two unrelated accents risk a carnival if either leaks into decoration.' },
    { t: 'Acid = act. Pink = state.', b: '#E8FF00 is applied only to interactive elements. #FF2D6B is applied only to stock and scarcity. The split is absolute.' },
    { t: 'A rule to police', b: 'Two accents means two ways to be wrong. Every new component has to be checked against the split, forever.' },
  ], PIPE_H);

  takeaway(s, 'Colour here is a grammar, not a palette: hue encodes whether a thing can be acted on. Break the rule once and the whole page stops teaching.');
}

// ══════════════ 6 · BONE, NOT WHITE ══════════════
{
  const s = slide();
  head(s, '05 —', 'DECISION 03 · BONE, NOT WHITE', { size: 26 });

  kick(s, 'THE DIFFERENCE AT BODY SIZE', { x: M, y: PROOF_Y, w: 5 });
  rect(s, { x: M, y: PROOF_Y + 0.26, w: 4.2, h: 1.02, fill: { color: INK } });
  rect(s, { x: M, y: PROOF_Y + 0.26, w: 4.2, h: 0.012, fill: { color: HAIR } });
  tx(s, '#FFFFFF — pure white', { x: M + 0.2, y: PROOF_Y + 0.42, w: 3.8, h: 0.2, fontSize: 8, color: DIM, fontFace: UI });
  tx(s, 'Real kicks for the culture.', { x: M + 0.2, y: PROOF_Y + 0.68, w: 3.8, h: 0.4, fontSize: 17, color: 'FFFFFF', fontFace: BODY });

  rect(s, { x: M + 4.44, y: PROOF_Y + 0.26, w: 4.32, h: 1.02, fill: { color: INK } });
  rect(s, { x: M + 4.44, y: PROOF_Y + 0.26, w: 4.32, h: 0.012, fill: { color: ACID } });
  tx(s, '#F2EDE8 — bone  · shipped', { x: M + 4.64, y: PROOF_Y + 0.42, w: 3.8, h: 0.2, fontSize: 8, color: ACID, fontFace: UI });
  tx(s, 'Real kicks for the culture.', { x: M + 4.64, y: PROOF_Y + 0.68, w: 3.9, h: 0.4, fontSize: 17, color: BONE, fontFace: BODY });

  pipeline(s, PIPE_Y, [
    { t: 'Halation on dark', b: 'Pure #FFF on near-black blooms at body size — the counters fill in and long paragraphs vibrate, especially on OLED.' },
    { t: 'White · grey · bone', b: 'Dropping to neutral grey fixes the bloom but reads as disabled text. Bone keeps full contrast while losing the glare.' },
    { t: '#F2EDE8 at 16px / 1.6', b: 'Warm off-white for primary type; secondary drops to the same colour at 65% rather than to a separate grey token.' },
    { t: 'A warm cast', b: 'Bone reads slightly warm next to neutral-grey product shots. Acceptable — the photo grade pulls saturation down to meet it.' },
  ], PIPE_H);

  takeaway(s, 'Secondary text is one token at 65% opacity, not a second colour — so there is exactly one way to be quiet, and it can never drift out of sync with the first.');
}

// ══════════════ 7 · THE TYPE SCALE ══════════════
{
  const s = slide();
  head(s, '06 —', 'DECISION 04 · A SCALE THAT NEEDS NO BREAKPOINTS', { size: 22 });

  kick(s, 'THE SHIPPED RAMP', { x: M, y: PROOF_Y, w: 5 });
  const ramp = [
    { l: 'Hero',    v: 'clamp(72px, 13.5vw, 168px)', sz: 30 },
    { l: 'Page',    v: 'clamp(48px, 8vw, 96px)',     sz: 20 },
    { l: 'Section', v: 'clamp(40px, 6vw, 80px)',     sz: 15 },
    { l: 'Body',    v: '16px / 1.6',                 sz: 10 },
  ];
  ramp.forEach((r, i) => {
    const x = M + i * 2.22;
    tx(s, 'Aa', { x, y: PROOF_Y + 0.24, w: 2.0, h: 0.62, fontSize: r.sz, bold: true, color: BONE, fontFace: DISP });
    tx(s, r.l, { x, y: PROOF_Y + 0.92, w: 2.0, h: 0.18, fontSize: 8.5, bold: true, color: ACID, fontFace: UI });
    tx(s, r.v, { x, y: PROOF_Y + 1.12, w: 2.1, h: 0.2, fontSize: 7.5, color: DIM, fontFace: UI });
  });

  pipeline(s, PIPE_Y, [
    { t: '320px to 1920px', b: 'The hero has to hold at both ends of the range, and the price has to stay legible at 13px inside a card.' },
    { t: 'Breakpoints vs vw vs clamp', b: 'Fixed sizes need a step at every breakpoint and always break between them. Pure vw goes unreadable on small screens.' },
    { t: 'clamp() on every display size', b: 'One declaration carries min, preferred and max. The hero runs 72px to 168px with no resize listener and no media query.' },
    { t: 'The middle is unattended', b: 'clamp interpolates linearly, so no single viewport is art-directed. Tablet type is arithmetically correct, never composed.' },
  ], PIPE_H);

  takeaway(s, 'Four clamp declarations replaced what would otherwise have been roughly twenty breakpoint overrides — the scale is the system, not the exceptions to it.');
}

// ══════════════ 8 · THE PHOTO GRADE ══════════════
{
  const s = slide();
  head(s, '07 —', 'DECISION 05 · ONE FILTER, FIFTEEN PHOTOGRAPHERS', { size: 22 });

  kick(s, 'THE PROBLEM — THREE NATIVE BACKGROUNDS IN ONE GRID', { x: M, y: PROOF_Y, w: 6 });
  [['krsh-venom.png', 'white'], ['krsh-ghost.png', 'grey'], ['krsh-fury.png', 'black'], ['krsh-terra.png', 'grey']].forEach((p, i) => {
    tile(s, p[0], { x: M + i * 1.34, y: PROOF_Y + 0.26, w: 1.22, h: 1.02 }, BONE);
  });
  tx(s, 'Different cameras, different light,\ndifferent colour casts — dropped into\none grid they read as fifteen brands.',
    { x: M + 5.5, y: PROOF_Y + 0.3, w: 3.2, h: 1.0, fontSize: 10, color: DIM, fontFace: UI, lineSpacingMultiple: 1.42 });

  pipeline(s, PIPE_Y, [
    { t: 'Seventeen sources', b: 'The catalog is assembled from unrelated stock. Nothing was shot for this brand, and no two frames share a grade.' },
    { t: 'Re-shoot · hand-edit · grade', b: 'Re-shooting was not available. Hand-editing seventeen files does not survive the eighteenth product being added.' },
    { t: 'One CSS custom property', b: 'contrast(1.08) saturate(0.9) brightness(0.97) — declared once as --photo-grade and applied to every product, lookbook and hero image.' },
    { t: 'It levels, it cannot fix', b: 'A global grade pulls a set toward each other. It will not rescue a genuinely bad frame, and it slightly flattens the good ones.' },
  ], PIPE_H);

  takeaway(s, 'This is the single highest-leverage line in the stylesheet: one declaration is what makes disparate stock read as one catalog shot by one brand.');
}

// ══════════════ 9 · THE GRID ══════════════
{
  const s = slide();
  head(s, '08 —', 'DECISION 06 · THE GRID', { size: 28 });
  tx(s, 'Three breakpoints — 1024, 768, 480 — and every grid in the build reflows through them. The counts below are the shipped values.',
    { x: M, y: 1.16, w: CW, h: 0.3, fontSize: 11.5, color: DIM, fontFace: BODY });

  const cols = ['COMPONENT', 'DESKTOP', '≤1024', '≤768'];
  const colX = [M, M + 3.4, M + 5.3, M + 7.0];
  const colW = [3.2, 1.8, 1.6, 1.7];
  cols.forEach((c, i) => tx(s, c, { x: colX[i], y: 1.6, w: colW[i], h: 0.2, fontSize: 7.5, bold: true, color: ACID, fontFace: UI, charSpacing: 2 }));
  rect(s, { x: M, y: 1.84, w: CW, h: 0.012, fill: { color: HAIR } });

  const rows = [
    ['Home product grid', '4 columns', '3 columns', '2 columns'],
    ['Catalog grid', '3 columns', '3 columns', '2 columns'],
    ['Lookbook', '3 columns', '3 columns', 'Stacked'],
    ['Product page', '1.1fr / 1fr', '1.1fr / 1fr', 'Stacked'],
    ['Size selector', '6 columns', '6 columns', '4 columns'],
    ['Featured drop', '2 columns', 'Stacked', 'Stacked'],
  ];
  rows.forEach((r, i) => {
    const y = 2.0 + i * 0.34;
    if (i % 2 === 0) rect(s, { x: M, y: y - 0.04, w: CW, h: 0.32, fill: { color: GRAY } });
    r.forEach((cell, j) => tx(s, cell, { x: colX[j] + (j ? 0.12 : 0.12), y: y + 0.04, w: colW[j], h: 0.22,
      fontSize: 10, bold: j === 0, color: j === 0 ? BONE : DIM, fontFace: UI }));
  });

  rect(s, { x: M, y: 4.16, w: 4.24, h: 0.92, fill: { color: GRAY } });
  kick(s, 'WHY THE CATALOG NEVER GOES TO FOUR', { x: M + 0.18, y: 4.3, w: 3.9 });
  tx(s, 'The home grid is a teaser and can afford four. The catalog is a decision surface — at four columns the product image drops below the size where a silhouette is distinguishable.',
    { x: M + 0.18, y: 4.54, w: 3.9, h: 0.48, fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.35 });

  rect(s, { x: M + 4.5, y: 4.16, w: 4.26, h: 0.92, fill: { color: GRAY } });
  kick(s, 'WHY SIZES GO 6 → 4, NOT 6 → 3', { x: M + 4.68, y: 4.3, w: 3.9 });
  tx(s, 'Four keeps every size button above the 44px minimum touch target on a 360px screen. Three would have been comfortable but pushes the grid to three rows and below the fold.',
    { x: M + 4.68, y: 4.54, w: 3.9, h: 0.48, fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.35 });
}

// ══════════════ 10 · ANATOMY — PRODUCT CARD ══════════════
{
  const s = slide();
  head(s, '09 —', 'ANATOMY · THE PRODUCT CARD', { size: 26 });

  // the card itself, drawn to the shipped spec
  const cx = M, cy = 1.2, cw2 = 2.3;
  rect(s, { x: cx, y: cy, w: cw2, h: 2.92, fill: { color: GRAY } });
  tile(s, 'krsh-venom.png', { x: cx, y: cy, w: cw2, h: 2.3 }, BONE);
  rect(s, { x: cx + 0.16, y: cy + 0.16, w: 0.72, h: 0.22, fill: { color: PINK } });
  tx(s, 'LIMITED', { x: cx + 0.16, y: cy + 0.16, w: 0.72, h: 0.22, fontSize: 6, bold: true, color: BONE, fontFace: UI, align: 'center', valign: 'middle' });
  tx(s, '♡', { x: cx + cw2 - 0.42, y: cy + 0.14, w: 0.28, h: 0.26, fontSize: 12, color: BONE, fontFace: UI, align: 'center' });
  tx(s, 'KRSH Venom', { x: cx + 0.16, y: cy + 2.46, w: 1.3, h: 0.24, fontSize: 10, bold: true, color: BONE, fontFace: UI });
  tx(s, '$310', { x: cx + cw2 - 0.86, y: cy + 2.44, w: 0.7, h: 0.26, fontSize: 11.5, bold: true, color: BONE, fontFace: DISP, align: 'right' });

  const notes = [
    { n: '01', t: 'Bone tile · #F2EDE8', b: 'The debt the dark ground created, paid here. Source cutouts arrive on three backgrounds; the tile makes them one family.' },
    { n: '02', t: 'aspect-ratio 1 · contain · 8% pad', b: 'Every product occupies an identical square whatever its native crop. This, not the tile, is what makes the grid stay even.' },
    { n: '03', t: 'Badge · acid = new, pink = limited', b: 'The colour grammar applied. Top-left, where a left-to-right scan hits before the product itself.' },
    { n: '04', t: 'Wish button · 44px, hover-revealed', b: 'Kept out of the scan until intent shows, then made permanent under @media (hover: none) — touch has no hover to reveal it.' },
    { n: '05', t: 'Name 15px · price 17px', b: 'Baseline-aligned, price in the display face at the larger size: it is the number being compared across the grid.' },
    { n: '06', t: 'Price is bone, never acid', b: 'The single most useful constraint in the system. Acid means actionable — and a price is information, not a control.' },
  ];
  notes.forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 3.24 + col * 3.14, y = 1.14 + row * 1.16;
    tx(s, n.n, { x, y, w: 0.34, h: 0.2, fontSize: 8.5, bold: true, color: ACID, fontFace: DISP });
    tx(s, n.t, { x: x + 0.34, y, w: 2.5, h: 0.34, fontSize: 9.5, bold: true, color: BONE, fontFace: UI, lineSpacingMultiple: 1.15 });
    tx(s, n.b, { x: x + 0.34, y: y + 0.38, w: 2.5, h: 0.72, fontSize: 8.2, color: DIM, fontFace: UI, lineSpacingMultiple: 1.34 });
  });

  rect(s, { x: M, y: 4.72, w: 0.05, h: 0.5, fill: { color: ACID } });
  tx(s, 'Six decisions in one 300px card — and five of them are downstream of a constraint set three slides earlier. That traceability is the whole point of working this way.',
    { x: M + 0.24, y: 4.72, w: CW - 0.24, h: 0.5, fontSize: 11, color: BONE, fontFace: BODY, lineSpacingMultiple: 1.28 });
}

// ══════════════ 11 · ANATOMY — THE BUY BOX ══════════════
{
  const s = slide();
  head(s, '10 —', 'ANATOMY · THE BUY BOX', { size: 26 });
  tx(s, 'The order of these five elements is the conversion decision. Each one answers the question the shopper asks before it.',
    { x: M, y: 1.16, w: CW, h: 0.28, fontSize: 11.5, color: DIM, fontFace: BODY });

  // shipped buy box
  const bx = M, by = 1.62, bw2 = 3.5;
  rect(s, { x: bx, y: by, w: bw2, h: 3.2, fill: { color: GRAY } });
  tx(s, 'KRSH VENOM', { x: bx + 0.2, y: by + 0.2, w: 3.0, h: 0.3, fontSize: 15, bold: true, color: BONE, fontFace: DISP });
  tx(s, '$310', { x: bx + 0.2, y: by + 0.56, w: 0.9, h: 0.3, fontSize: 17, bold: true, color: BONE, fontFace: DISP });
  rect(s, { x: bx + 1.14, y: by + 0.62, w: 1.0, h: 0.2, fill: { color: PINK } });
  tx(s, '47 LEFT', { x: bx + 1.14, y: by + 0.62, w: 1.0, h: 0.2, fontSize: 6, bold: true, color: BONE, fontFace: UI, align: 'center', valign: 'middle' });
  tx(s, 'SELECT SIZE', { x: bx + 0.2, y: by + 1.02, w: 2, h: 0.18, fontSize: 6.5, bold: true, color: DIM, fontFace: UI, charSpacing: 2 });
  ['40', '41', '42', '43', '44', '45'].forEach((z, i) => {
    const zx = bx + 0.2 + (i % 6) * 0.52, zy = by + 1.26;
    const on = i === 2, off = i === 5;
    rect(s, { x: zx, y: zy, w: 0.46, h: 0.34, fill: { color: on ? ACID : GRAY2 } });
    tx(s, z, { x: zx, y: zy, w: 0.46, h: 0.34, fontSize: 8, bold: true, color: on ? INK : (off ? '4A4A48' : BONE), fontFace: UI, align: 'center', valign: 'middle', strike: off });
  });
  rect(s, { x: bx + 0.2, y: by + 1.78, w: 3.1, h: 0.4, fill: { color: ACID } });
  tx(s, 'ADD TO BAG', { x: bx + 0.2, y: by + 1.78, w: 3.1, h: 0.4, fontSize: 8.5, bold: true, color: INK, fontFace: UI, align: 'center', valign: 'middle', charSpacing: 2 });
  rect(s, { x: bx + 0.2, y: by + 2.26, w: 3.1, h: 0.4, fill: { color: GRAY2 } });
  tx(s, '♡  SAVE', { x: bx + 0.2, y: by + 2.26, w: 3.1, h: 0.4, fontSize: 8.5, bold: true, color: BONE, fontFace: UI, align: 'center', valign: 'middle', charSpacing: 2 });

  const seq = [
    ['Name, then price', 'Identity before cost. Reversing these reads as a discount site, which is the opposite of the positioning.'],
    ['Scarcity beside price', 'Pink, never acid. It is a fact about stock, so it must not look like something to press.'],
    ['Size before the button', 'Sold-out sizes are struck through at 20% opacity rather than removed — absence reads as a rendering bug, a strike reads as information.'],
    ['One primary action', 'Acid, full width, 44px minimum. Nothing else on the page uses this treatment.'],
    ['Save, demoted', 'Same size, surface grey. Available to anyone looking for it, invisible to anyone who is not.'],
  ];
  seq.forEach((q, i) => {
    const y = 1.62 + i * 0.66;
    tx(s, String(i + 1).padStart(2, '0'), { x: 4.42, y, w: 0.3, h: 0.2, fontSize: 8.5, bold: true, color: ACID, fontFace: DISP });
    tx(s, q[0], { x: 4.76, y, w: 4.6, h: 0.2, fontSize: 10, bold: true, color: BONE, fontFace: UI });
    tx(s, q[1], { x: 4.76, y: y + 0.22, w: 4.6, h: 0.4, fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.35 });
  });
}

// ══════════════ 12 · THE SCROLL NARRATIVE ══════════════
{
  const s = slide();
  head(s, '11 —', 'DECISION 07 · THE ORDER OF THE HOMEPAGE', { size: 24 });
  tx(s, 'Section order is an argument. This one withholds price until the shopper has a reason to care about it.',
    { x: M, y: 1.16, w: CW, h: 0.28, fontSize: 11.5, color: DIM, fontFace: BODY });

  const secs = [
    { n: 'Hero',        w: 'WIDE',   b: 'Positioning before product. Two words and one action.' },
    { n: 'Lookbook',    w: 'WIDE',   b: 'How it is worn, on real streets. Desire before price.' },
    { n: 'Featured',    w: 'NARROW', b: 'One product, deep. A single decision, fully argued.' },
    { n: 'Marquee',     w: 'BREAK',  b: 'A tonal reset. Gives the eye somewhere to stop.' },
    { n: 'New arrivals',w: 'WIDE',   b: 'Many products, shallow. The first time price appears in a grid.' },
    { n: 'Manifesto',   w: 'NARROW', b: 'The close, for anyone who scrolled without clicking.' },
  ];
  const bw3 = (CW - 0.5) / 6;
  secs.forEach((sec, i) => {
    const x = M + i * (bw3 + 0.1);
    const accent = sec.w === 'BREAK';
    rect(s, { x, y: 1.62, w: bw3, h: 2.16, fill: { color: accent ? GRAY2 : GRAY } });
    rect(s, { x, y: 1.62, w: bw3, h: 0.035, fill: { color: accent ? HAIR : ACID } });
    tx(s, String(i + 1).padStart(2, '0'), { x: x + 0.14, y: 1.82, w: 0.5, h: 0.2, fontSize: 9, bold: true, color: ACID, fontFace: DISP });
    tx(s, sec.n, { x: x + 0.14, y: 2.08, w: bw3 - 0.28, h: 0.38, fontSize: 10.5, bold: true, color: BONE, fontFace: UI, lineSpacingMultiple: 1.1 });
    tx(s, sec.w, { x: x + 0.14, y: 2.5, w: bw3 - 0.28, h: 0.18, fontSize: 6.5, bold: true, color: DIM, fontFace: UI, charSpacing: 1.5 });
    tx(s, sec.b, { x: x + 0.14, y: 2.74, w: bw3 - 0.28, h: 0.92, fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.35 });
  });

  rect(s, { x: M, y: 3.98, w: 4.24, h: 1.0, fill: { color: GRAY } });
  kick(s, 'THE RHYTHM', { x: M + 0.18, y: 4.14, w: 3.9 });
  tx(s, 'Wide · wide · narrow · break · wide · narrow. The page never presents two dense grids back to back, so scrolling has a pulse rather than a slope.',
    { x: M + 0.18, y: 4.38, w: 3.9, h: 0.52, fontSize: 9, color: DIM, fontFace: UI, lineSpacingMultiple: 1.4 });

  rect(s, { x: M + 4.5, y: 3.98, w: 4.26, h: 1.0, fill: { color: GRAY } });
  kick(s, 'THE COST', { x: M + 4.68, y: 4.14, w: 3.9 });
  tx(s, 'A shopper who arrived knowing exactly what they wanted has to scroll past two editorial sections to reach a grid. The nav mitigates it; the order still costs them.',
    { x: M + 4.68, y: 4.38, w: 3.9, h: 0.52, fontSize: 9, color: DIM, fontFace: UI, lineSpacingMultiple: 1.4 });
}

// ══════════════ 13 · MOTION ══════════════
{
  const s = slide();
  head(s, '12 —', 'DECISION 08 · MOTION', { size: 28 });

  kick(s, 'ONE CURVE, USED EVERYWHERE', { x: M, y: PROOF_Y, w: 5 });
  rect(s, { x: M, y: PROOF_Y + 0.24, w: CW, h: 0.72, fill: { color: GRAY } });
  tx(s, 'cubic-bezier(0.16, 1, 0.3, 1)', { x: M + 0.24, y: PROOF_Y + 0.38, w: 3.2, h: 0.3, fontSize: 15, bold: true, color: ACID, fontFace: 'Courier New' });
  tx(s, 'Fast out, long settle. Every transition in the build uses this one curve — 0.6s on product imagery, 0.4s on card transforms, 0.2s on controls. Duration carries the weight of the element; the curve never changes, so the whole interface moves like one object.',
    { x: M + 3.6, y: PROOF_Y + 0.34, w: 5.1, h: 0.56, fontSize: 9, color: DIM, fontFace: UI, lineSpacingMultiple: 1.38 });

  pipeline(s, PIPE_Y, [
    { t: 'Staged reveals', b: 'The editorial layout needs sequenced entrances — type, then subhead, then action — that CSS alone expresses as brittle chained delays.' },
    { t: 'CSS · GSAP · both', b: 'Pure CSS could not stage the sequence. GSAP alone still judders, because trackpad, wheel and touch report scroll differently.' },
    { t: 'GSAP + ScrollTrigger + Lenis', b: 'GSAP owns the timeline, ScrollTrigger owns enter and exit, Lenis normalises the scroll input the other two are reacting to.' },
    { t: 'Roughly 60KB of library', b: 'Real weight, on a site with no framework. Justified only because motion is doing identity work here, not decoration.' },
  ], PIPE_H);

  takeaway(s, 'Five separate prefers-reduced-motion blocks in the stylesheet resolve every one of these transitions instantly — same content, same hierarchy, no motion.');
}

// ══════════════ 14 · ACCESSIBILITY ══════════════
{
  const s = slide();
  head(s, '13 —', 'THE DETAILS THAT DO NOT SHOW UP IN A SCREENSHOT', { size: 22 });

  rect(s, { x: M, y: 1.2, w: 2.24, h: 1.9, fill: { color: GRAY } });
  tx(s, '17', { x: M, y: 1.42, w: 2.24, h: 0.78, fontSize: 56, bold: true, color: ACID, fontFace: DISP, align: 'center' });
  tx(s, 'OUT OF 20', { x: M, y: 2.24, w: 2.24, h: 0.2, fontSize: 8.5, bold: true, color: BONE, fontFace: UI, align: 'center', charSpacing: 2 });
  tx(s, 'Self-audit, five dimensions', { x: M, y: 2.5, w: 2.24, h: 0.36, fontSize: 8.5, color: DIM, fontFace: UI, align: 'center' });

  const det = [
    ['44px minimum on every control', 'Size buttons carry min-height: 44px explicitly, which is what forces the 6→4 column reflow rather than the other way round.'],
    ['Sold-out sizes struck, not removed', 'line-through at 20% opacity with cursor: not-allowed. Removing them makes the grid look broken and hides information.'],
    ['focus-visible on eleven selector groups', 'outline-offset: -3px so the ring sits inside the control and never collides with a neighbour in a tight grid.'],
    ['@media (hover: none) fallbacks', 'Every hover-revealed affordance has a touch equivalent. Without it the wishlist button is unreachable on a phone.'],
  ];
  det.forEach((d, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 3.14 + col * 3.22, y = 1.2 + row * 1.0;
    rect(s, { x, y: y + 0.03, w: 0.04, h: 0.16, fill: { color: ACID } });
    tx(s, d[0], { x: x + 0.18, y, w: 2.86, h: 0.22, fontSize: 9.5, bold: true, color: BONE, fontFace: UI });
    tx(s, d[1], { x: x + 0.18, y: y + 0.26, w: 2.86, h: 0.68, fontSize: 8.5, color: DIM, fontFace: UI, lineSpacingMultiple: 1.38 });
  });

  rect(s, { x: M, y: 3.3, w: CW, h: 0.012, fill: { color: HAIR } });
  kick(s, 'THE ONE I HAVE NOT PAID YET', { x: M, y: 3.5, w: 5 });
  tx(s, 'Product photography still ships as PNG. WebP with a PNG fallback would cut the payload by roughly 60% and is the largest remaining win in the build. It is logged as a P2 and it is genuinely not done — the audit found it, and shipping the case study before shipping the fix is the honest order.',
    { x: M, y: 3.76, w: CW, h: 0.8, fontSize: 11, color: BONE, fontFace: BODY, lineSpacingMultiple: 1.4 });
}

// ══════════════ 15 · THE COST LEDGER ══════════════
{
  const s = slide();
  head(s, '14 —', 'EVERY COST THIS PIPELINE ACCEPTED', { size: 26 });
  tx(s, 'Collected from the fourth column of every decision. This is the part of a case study that is usually missing.',
    { x: M, y: 1.16, w: CW, h: 0.28, fontSize: 11.5, color: DIM, fontFace: BODY });

  const ledger = [
    ['Dark ground', 'White-background cutouts need a tile to sit on', 'Paid — the card'],
    ['Two accents', 'A grammar that must be policed on every new component', 'Ongoing'],
    ['Bone type', 'Reads slightly warm against neutral product shots', 'Absorbed by the grade'],
    ['clamp() scale', 'No viewport in the middle of the range is art-directed', 'Accepted'],
    ['Global photo grade', 'Levels a set; cannot rescue a bad frame', 'Accepted'],
    ['Editorial-first order', 'Costs the high-intent shopper two scrolls', 'Mitigated by nav'],
    ['Motion libraries', 'Roughly 60KB on a no-framework site', 'Accepted'],
  ];
  const lx = [M, M + 2.3, M + 6.5];
  const lw = [2.1, 4.1, 2.2];
  ['DECISION', 'WHAT IT COST', 'STATUS'].forEach((h, i) =>
    tx(s, h, { x: lx[i], y: 1.6, w: lw[i], h: 0.2, fontSize: 7.5, bold: true, color: ACID, fontFace: UI, charSpacing: 2 }));
  rect(s, { x: M, y: 1.84, w: CW, h: 0.012, fill: { color: HAIR } });

  ledger.forEach((r, i) => {
    const y = 2.0 + i * 0.42;
    if (i % 2 === 0) rect(s, { x: M, y: y - 0.06, w: CW, h: 0.4, fill: { color: GRAY } });
    tx(s, r[0], { x: lx[0] + 0.12, y: y + 0.03, w: lw[0], h: 0.24, fontSize: 9.5, bold: true, color: BONE, fontFace: UI });
    tx(s, r[1], { x: lx[1] + 0.12, y: y + 0.03, w: lw[1], h: 0.24, fontSize: 9.5, color: DIM, fontFace: UI });
    tx(s, r[2], { x: lx[2] + 0.12, y: y + 0.03, w: lw[2], h: 0.24, fontSize: 9.5, bold: true, color: r[2] === 'Ongoing' ? PINK : ACID, fontFace: UI });
  });

  tx(s, 'Seven decisions, seven costs, none of them hidden. A design I cannot argue against is a design I have not finished thinking about.',
    { x: M, y: 5.0, w: CW, h: 0.34, fontSize: 11.5, color: BONE, fontFace: BODY, italic: true });
}

// ══════════════ 16 · CLOSE ══════════════
{
  const s = slide();
  photo(s, 'lookbook-2.jpg', { x: 5.0, y: 0, w: 5.0, h: H });
  tx(s, 'KRSH', { x: M, y: 1.4, w: 4.2, h: 1.05, fontSize: 74, bold: true, color: BONE, fontFace: DISP, charSpacing: 3 });
  rect(s, { x: M, y: 2.62, w: 0.9, h: 0.05, fill: { color: ACID } });
  tx(s, 'YOUR FEET.  YOUR RULES.', { x: M, y: 2.86, w: 4.4, h: 0.24, fontSize: 10, bold: true, color: ACID, fontFace: UI, charSpacing: 4 });
  tx(s, 'krsh-shop.netlify.app', { x: M, y: 3.42, w: 4.4, h: 0.3, fontSize: 15, bold: true, color: BONE, fontFace: UI });
  tx(s, 'Philipp Kasharov  ·  philippkasharov@gmail.com', { x: M, y: 3.82, w: 4.6, h: 0.24, fontSize: 10.5, color: DIM, fontFace: UI });
  tx(s, 'Design & front-end build  ·  2026', { x: M, y: 4.08, w: 4.6, h: 0.24, fontSize: 10.5, color: DIM, fontFace: UI });
}

// ─── write ───
if (errs.length) { console.error('GEOMETRY:\n' + errs.join('\n')); process.exit(1); }
pres.writeFile({ fileName: OUT })
  .then(() => console.log('OK ->', OUT, '| slides:', pres.slides.length))
  .catch(e => { console.error(e); process.exit(1); });
