// Put the real Pragmatic Hippy logo onto a generated garment, as a single accent colour.
// Usage: node tools/composite-logo.mjs <in.png> <out.webp> --hex #e0352b --x 0.5 --y 0.3 --w 0.22 [--rot 0] [--opacity 0.92] [--size 1600]
// x/y = centre of the logo, w = logo width; all as fractions of the image.
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const [, , input, output, ...rest] = process.argv
const arg = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : d }
if (!input || !output) { console.error('usage: composite-logo <in> <out.webp> --hex --x --y --w'); process.exit(1) }
const hex = arg('hex', '#d4a64a'), x = +arg('x', 0.5), y = +arg('y', 0.3), w = +arg('w', 0.22)
const rot = +arg('rot', 0), opacity = +arg('opacity', 0.92), size = +arg('size', 1600)

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const logoSrc = path.join(root, 'public/brand/logo-light.webp')

const base = sharp(input).resize(size, size, { fit: 'cover' })
const logoW = Math.round(size * w)
// Logo on white → alpha from darkness (dark lines = opaque), then fill with the accent colour.
const { data, info } = await sharp(logoSrc).resize({ width: logoW }).greyscale().raw().toBuffer({ resolveWithObject: true })
const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const rgba = Buffer.alloc(info.width * info.height * 4)
for (let i = 0; i < info.width * info.height; i++) {
  const a = Math.max(0, Math.min(255, (235 - data[i]) * 1.6)) // white → 0, dark → 255
  rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = Math.round(a * opacity)
}
let logo = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png()
if (rot) logo = logo.rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
const logoBuf = await logo.toBuffer()
const meta = await sharp(logoBuf).metadata()
const left = Math.round(size * x - meta.width / 2), top = Math.round(size * y - meta.height / 2)

await base.composite([{ input: logoBuf, left, top, blend: 'over' }]).webp({ quality: 75 }).toFile(output)
console.log(`wrote ${output} logo ${meta.width}x${meta.height} at ${left},${top}`)
