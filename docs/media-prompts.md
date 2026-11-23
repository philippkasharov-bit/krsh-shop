# Media prompts (Pragmatic Hippy)

## Product packshots, 1:1, Magnific `images_generate` mode auto, ~135 credits each

Style v4 (design v2: two colours, logo per garment), appended to every piece:
> Minimal hippy streetwear. Studio product packshot of a single garment on an invisible mannequin, centred, full piece visible, on a seamless deep black background. Soft low-key lighting, gentle gold rim light, no glow, no haze. Sharp fabric detail. No people, no text, no logos, no props.

Per piece: "<garment> in <dark base>. The only accent: <accent colour> <trim>. The <logo spot> is completely plain and empty, no print. <view that shows the logo spot>."

Logo: composited after generation with `node tools/composite-logo.mjs <png> public/images/drops/<slug>.webp --hex <ACCENT_HEX> --x --y --w` (single accent colour, from public/brand/logo-light.webp).

| Piece | View | Logo box (x, y, w) |
|---|---|---|
| Strobe Jacket | back | 0.50, 0.45, 0.26 (approved) |
