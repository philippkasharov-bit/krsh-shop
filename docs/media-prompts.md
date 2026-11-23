# Media prompts (Pragmatic Hippy)

## Product packshots, 1:1, Magnific `images_generate` mode auto, ~135 credits each

Style v4 (design v2: two colours, logo per garment), appended to every piece:
> Minimal hippy streetwear. Studio product packshot of a single garment on an invisible mannequin, centred, full piece visible, on a seamless deep black background. Soft low-key lighting, gentle gold rim light, no glow, no haze. Sharp fabric detail. No people, no text, no logos, no props.

Per piece: "<garment> in <dark base>. The only accent: <accent colour> <trim>. The <logo spot> is completely plain and empty, no print. <view that shows the logo spot>."

Logo: composited after generation with `node tools/composite-logo.mjs <png> public/images/drops/<slug>.webp --hex <ACCENT_HEX> --x --y --w` (single accent colour, from public/brand/logo-light.webp).

| Piece | View | Logo box (x, y, w) |
|---|---|---|
| Strobe Jacket | back | 0.50, 0.45, 0.26 (approved) |
| Laser Corset Top | back | 0.66, 0.74, 0.11 |
| Glow Cargo | front | 0.60, 0.42, 0.09 |
| Chain Mail Tank | back | 0.50, 0.80, 0.13 |
| Warehouse Hoodie | back (regenerated: first came out front view with glow) | 0.50, 0.43, 0.24 |
| Flyer Tee | back | 0.50, 0.38, 0.26 |
| Utility Pant | front | 0.62, 0.40, 0.09 |
| Night Shell | back | 0.50, 0.34, 0.24 |
| Baby Tee 2000 | front | 0.60, 0.40, 0.08 |
| Low-Rise Flare | front | 0.58, 0.42, 0.07 |
| Chrome Puffer | back | 0.50, 0.46, 0.24 |
| Velour Set | back | 0.50, 0.17, 0.13 |
| Strobe Sneaker | rear 3/4; logo #111 on acid tab | 0.77, 0.42, 0.08 |
| Court Hi | rear 3/4; logo #111 on red loop | 0.822, 0.33, 0.05, rot 2 |
| Mini Shoulder Bag | front | 0.50, 0.62, 0.18 |
| Visor | 3/4; logo #111 on pink arm | 0.78, 0.455, 0.07, rot 8 |

Rule: if the logo spot is itself accent-coloured, the logo uses the dark base (#111) so it stays visible.
