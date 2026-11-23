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

const base = sharp(await sharp(input).resize({ width: size }).toBuffer())
const H = (await base.metadata()).height // x, w, quad-x are fractions of width; y, quad-y of height
const logoW = Math.round(size * w)
// Logo on white → alpha from darkness (dark lines = opaque), then fill with the accent colour.
const { data, info } = await sharp(logoSrc).resize({ width: logoW }).greyscale().raw().toBuffer({ resolveWithObject: true })
const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const rgba = Buffer.alloc(info.width * info.height * 4)
for (let i = 0; i < info.width * info.height; i++) {
  const a = Math.max(0, Math.min(255, (235 - data[i]) * 1.6)) // white → 0, dark → 255
  rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = Math.round(a * opacity)
}
const blend = arg('blend', 'over')
const quadArg = arg('quad', null) // TL,TR,BR,BL as 8 fractions: perspective placement onto a surface
let logoBuf, left, top, mw, mh
if (quadArg) {
  const q = quadArg.split(',').map((v, i) => +v * (i % 2 ? H : size))
  const dst = [[q[0], q[1]], [q[2], q[3]], [q[4], q[5]], [q[6], q[7]]]
  const Hm = homography([[0, 0], [info.width, 0], [info.width, info.height], [0, info.height]], dst)
  const Hi = invert3(Hm)
  const xs = dst.map((p) => p[0]), ys = dst.map((p) => p[1])
  left = Math.floor(Math.min(...xs)); top = Math.floor(Math.min(...ys))
  mw = Math.ceil(Math.max(...xs)) - left; mh = Math.ceil(Math.max(...ys)) - top
  const out = Buffer.alloc(mw * mh * 4)
  for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) {
    const X = i + left + 0.5, Y = j + top + 0.5
    const w3 = Hi[6] * X + Hi[7] * Y + Hi[8]
    const u = (Hi[0] * X + Hi[1] * Y + Hi[2]) / w3, v = (Hi[3] * X + Hi[4] * Y + Hi[5]) / w3
    if (u < 0 || v < 0 || u >= info.width - 1 || v >= info.height - 1) continue
    const a = bilinearAlpha(rgba, info.width, u, v), o = (j * mw + i) * 4
    out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = a
  }
  logoBuf = await sharp(out, { raw: { width: mw, height: mh, channels: 4 } }).png().toBuffer()
} else {
  let logo = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png()
  if (rot) logo = logo.rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  logoBuf = await logo.toBuffer()
  const meta = await sharp(logoBuf).metadata()
  mw = meta.width; mh = meta.height
  left = Math.round(size * x - mw / 2); top = Math.round(H * y - mh / 2)
}

await base.composite([{ input: logoBuf, left, top, blend }]).webp({ quality: 75 }).toFile(output)
console.log(`wrote ${output} logo ${mw}x${mh} at ${left},${top}`)

function bilinearAlpha(buf, w, u, v) {
  const x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0
  const at = (xx, yy) => buf[(yy * w + xx) * 4 + 3]
  return Math.round(at(x0, y0) * (1 - fx) * (1 - fy) + at(x0 + 1, y0) * fx * (1 - fy) + at(x0, y0 + 1) * (1 - fx) * fy + at(x0 + 1, y0 + 1) * fx * fy)
}
/** 3x3 homography (row-major, h33 = 1) mapping 4 src points to 4 dst points. */
function homography(src, dst) {
  const A = [], B = []
  for (let k = 0; k < 4; k++) {
    const [sx, sy] = src[k], [dx, dy] = dst[k]
    A.push([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx]); B.push(dx)
    A.push([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy]); B.push(dy)
  }
  // Gaussian elimination
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r2 = c + 1; r2 < 8; r2++) if (Math.abs(A[r2][c]) > Math.abs(A[p][c])) p = r2
    ;[A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]]
    for (let r2 = 0; r2 < 8; r2++) if (r2 !== c) {
      const f = A[r2][c] / A[c][c]
      for (let k = c; k < 8; k++) A[r2][k] -= f * A[c][k]
      B[r2] -= f * B[c]
    }
  }
  return [...B.map((bv, i) => bv / A[i][i]), 1]
}
function invert3(m) {
  const [a, b, c, d, e, f, g, h, i] = m
  const A = e * i - f * h, Bv = -(d * i - f * g), C = d * h - e * g
  const det = a * A + b * Bv + c * C
  return [A, -(b * i - c * h), b * f - c * e, Bv, a * i - c * g, -(a * f - c * d), C, -(a * h - b * g), a * e - b * d].map((v) => v / det)
}
