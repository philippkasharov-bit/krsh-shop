// Generates src/data/products.json. Run: node tools/catalog.mjs > src/data/products.json
// Two colours per piece: ~80% dark base + ~20% one bright accent. Logo in the accent colour.
const P = [
  // name, price, line, kind, badge, base, accent, logo, code, desc, materials, fit
  ['Strobe Jacket', 320, 'flash', 'apparel', 'limited', 'Washed black', 'red', 'back', 'STJ',
    'Boxy cropped work jacket in washed black, red-stitched yoke and the sun-and-moon mark on the back. Built for a long night and the walk home.',
    ['Heavy cotton canvas', 'Contrast red topstitching', 'Two-way metal zip'], 'Boxy, cropped'],
  ['Laser Corset Top', 180, 'flash', 'apparel', 'limited', 'Charcoal', 'pink', 'lower-back', 'LCT',
    'Soft corset top in charcoal stretch twill with hot-pink lacing. Small mark on the lower back.',
    ['Stretch cotton twill', 'Flat boning in channels', 'Pink lacing'], 'Fitted'],
  ['Glow Cargo', 210, 'flash', 'apparel', 'limited', 'Dark olive', 'acid', 'thigh', 'GLC',
    'Loose cargo pants in dark olive ripstop. Acid-yellow pull tabs and a small mark on the left thigh.',
    ['Cotton ripstop', 'Acid-yellow pull tabs', 'Toggle ankle cinch'], 'Relaxed, tapered'],
  ['Chain Mail Tank', 150, 'flash', 'apparel', 'limited', 'Washed black', 'orange', 'lower-back', 'CMT',
    'Open-knit tank in washed black with an orange binding. Layers over a tee or on its own when it is hot.',
    ['Open cotton knit', 'Orange bound edges'], 'Draped'],
  ['Warehouse Hoodie', 140, 'street', 'apparel', null, 'Charcoal', 'orange', 'back', 'WHH',
    'Heavy boxy hoodie in charcoal with orange drawcords. The mark sits on the back between the shoulders.',
    ['480 gsm cotton fleece', 'Orange flat drawcords', 'Double-layer hood'], 'Boxy, dropped shoulder'],
  ['Flyer Tee', 65, 'street', 'apparel', null, 'Washed black', 'acid', 'back', 'FLT',
    'Heavyweight washed tee. One acid-yellow mark on the back, nothing on the front.',
    ['240 gsm cotton jersey', 'Water-based print'], 'Regular'],
  ['Utility Pant', 160, 'street', 'apparel', null, 'Deep plum', 'red', 'thigh', 'UTP',
    'Wide-leg pant in deep plum twill with red webbing straps and a small mark on the thigh.',
    ['Cotton twill', 'Red webbing straps', 'Hidden zip pocket'], 'Wide leg'],
  ['Night Shell', 230, 'street', 'apparel', null, 'Matte black', 'blue', 'back', 'NSH',
    'Light anorak in matte black with electric-blue zip pulls and the mark on the back. Packs into its own pocket.',
    ['Nylon taslan', 'Electric-blue zip pulls', 'Packable'], 'Oversized'],
  ['Baby Tee 2000', 70, 'y2k', 'apparel', 'new', 'Charcoal', 'pink', 'chest', 'BT2',
    'Cropped baby tee in charcoal rib with a small hot-pink mark on the chest.',
    ['Cotton-elastane rib', 'Pink chest print'], 'Cropped, fitted'],
  ['Low-Rise Flare', 150, 'y2k', 'apparel', 'new', 'Black wash', 'blue', 'thigh', 'LRF',
    'Low flared denim in a black wash with electric-blue back-pocket stitching and a small thigh mark.',
    ['12 oz denim', 'Blue contrast stitching'], 'Low rise, flared'],
  ['Chrome Puffer', 260, 'y2k', 'apparel', 'new', 'Matte black', 'red', 'back', 'CHP',
    'Cropped puffer in matte black with a red lining that shows at the cuffs and hood. Mark on the back.',
    ['Matte nylon shell', 'Red lining', 'Recycled fill'], 'Cropped, boxy'],
  ['Velour Set', 220, 'y2k', 'apparel', 'new', 'Deep plum', 'orange', 'back', 'VLS',
    'Track top and pant in deep plum velour with orange piping. Mark on the back of the top.',
    ['Cotton velour', 'Orange piping', 'Zip track top + pant'], 'Relaxed'],
  ['Strobe Sneaker', 240, 'gear', 'shoe', null, 'Black', 'acid', 'heel', 'STS',
    'Low black skate-court sneaker with an acid-yellow heel tab carrying the mark.',
    ['Suede and leather upper', 'Rubber cupsole', 'Padded collar'], null],
  ['Court Hi', 280, 'gear', 'shoe', null, 'Charcoal', 'red', 'heel', 'CTH',
    'Chunky charcoal high-top with a red heel tab and ankle strap. Built for a full night on your feet.',
    ['Leather and mesh upper', 'Cushioned midsole', 'Red ankle strap'], null],
  ['Mini Shoulder Bag', 90, 'gear', 'onesize', null, 'Black', 'blue', 'front', 'MSB',
    'Small black bag on a cord strap, electric-blue zip and a small mark on the front. Fits phone, keys, earplugs.',
    ['Coated canvas', 'Blue zip', 'Cord strap'], null],
  ['Visor', 85, 'gear', 'onesize', null, 'Smoke', 'pink', 'temple', 'VSR',
    'Wraparound shield glasses, smoke lens, hot-pink mark on the temple arm.',
    ['Polycarbonate shield', 'Pink temple print'], null],
]
const slug = (n) => n.toLowerCase().replace(/\s+/g, '-')
const label = { red: 'Red', orange: 'Orange', acid: 'Acid yellow', blue: 'Electric blue', pink: 'Hot pink' }
const out = P.map(([name, price, line, kind, badge, base, accent, logo, code, desc, materials, fit], id) => {
  const o = { id, name, price, line, kind, badge, img: `images/drops/${slug(name)}.webp`, base, accent, logo,
    color: `${base} / ${label[accent]}`, sku: `PH26-${code}`, stock: 20 + ((id * 37) % 60), desc, materials }
  if (fit) o.fit = fit
  return o
})
process.stdout.write(JSON.stringify(out, null, 1) + '\n')
