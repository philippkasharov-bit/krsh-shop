# Case-study deck generator

Builds `KRSH-CaseStudy.pptx` — the 16-slide portfolio deck that documents the
design decisions behind this site.

## Run

```bash
cd tools/case-study
npm install
npm run build
```

Output lands next to the script. Pass a path to send it elsewhere:

```bash
node generate.js /some/where/deck.pptx
```

## Exporting a PDF

`pptxgenjs` only writes `.pptx`. For the PDF used on Behance, open the result in
PowerPoint and use **File → Export → Create PDF/XPS**, or run LibreOffice:

```bash
soffice --headless --convert-to pdf KRSH-CaseStudy.pptx
```

## Notes

- Product and editorial photography is read from `../../images` at build time
  and embedded as base64, so the deck is self-contained once generated.
- The palette constants at the top of `generate.js` mirror `:root` in
  `style.css`. **If the site's tokens change, update them here too** — the deck
  claims to document the shipped values, so drift makes it wrong.
- A geometry guard aborts the build if any element falls outside the slide
  canvas, rather than silently writing off-slide content.
- Shape-level `transparency` is ignored by PowerPoint's renderer, so image
  scrims are applied via the image's own `transparency` instead. Don't
  "fix" this by layering translucent rectangles — they render opaque.
