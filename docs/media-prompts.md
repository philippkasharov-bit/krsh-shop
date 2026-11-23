# Media prompts (Pragmatic Hippy)

## Product packshots, 1:1, Magnific `images_generate` mode auto, ~135 credits each

Style v4 (design v2: two colours, logo per garment), appended to every piece:
> Minimal hippy streetwear. Studio product packshot of a single garment on an invisible mannequin, centred, full piece visible, on a seamless deep black background. Soft low-key lighting, gentle gold rim light, no glow, no haze. Sharp fabric detail. No people, no text, no logos, no props.

Per piece: "<garment> in <dark base>. The only accent: <accent colour> <trim>. The <logo spot> is completely plain and empty, no print. <view that shows the logo spot>."

Logo: composited after generation with `node tools/composite-logo.mjs <png> public/images/drops/<slug>.webp --hex <ACCENT_HEX> --x --y --w` (single accent colour, from public/brand/logo-light.webp).

| Piece | View | Logo box (x, y, w) |
|---|---|---|
| Strobe Jacket | back | 0.50, 0.45, 0.26 (approved) |
| Laser Corset Top | back; regenerated as Victorian goth brocade corset (user) | 0.70, 0.76, 0.09 |
| Glow Cargo | front; logo on cargo pocket (user), perspective quad | quad .287,.40,.372,.392,.373,.478,.29,.487 |
| Chain Mail Tank | back; logo near top (user) | 0.50, 0.19, 0.12 |
| Warehouse Hoodie | back (regenerated: first came out front view with glow) | 0.50, 0.43, 0.24 |
| Flyer Tee | back | 0.50, 0.38, 0.26 |
| Utility Pant | front | 0.62, 0.40, 0.09 |
| Night Shell | back | 0.50, 0.34, 0.24 |
| Baby Tee 2000 | front | 0.60, 0.40, 0.08 |
| Low-Rise Flare | front; logo by hip pocket (user) | 0.615, 0.16, 0.06 |
| Chrome Puffer | back | 0.50, 0.46, 0.24 |
| Velour Set | back | 0.50, 0.17, 0.13 |
| Strobe Sneaker | rear 3/4; logo #1a1a1a multiply, perspective on tab (user) | quad .75,.3525,.8425,.34,.8475,.4175,.755,.4225 |
| Court Hi | rear 3/4; logo #1a1a1a multiply, perspective on loop | quad .7925,.355,.8425,.35,.8425,.40,.794,.405 |
| Mini Shoulder Bag | front | 0.50, 0.62, 0.18 |
| Visor | 3/4; logo #1a1a1a multiply, perspective on arm | quad .7475,.4425,.82,.436,.82,.4825,.7475,.5025 |

Rule: if the logo spot is itself accent-coloured, the logo uses the dark base (#111) so it stays visible.

## Journey scene stills (16:9 except market 2:1), 1920 px WebP
gate, stage, market (2:1 for the sideways pan), detail (jacket back, real logo composited in red at 0.50, 0.54, w 0.16), tent (empty displays; product cards overlaid in code). Clips: made by the user; drop them in `public/media/journey/<scene>.mp4` and set `clip` in `src/data/journey.ts`.
