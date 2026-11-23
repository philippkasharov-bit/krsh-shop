// Writes public/sitemap.xml from the catalog. Run: node tools/sitemap.mjs
import fs from 'node:fs'
const BASE = 'https://philippkasharov-bit.github.io/krsh-shop'
const products = JSON.parse(fs.readFileSync(new URL('../src/data/products.json', import.meta.url)))
const slug = (n) => n.toLowerCase().replace(/\s+/g, '-')
const pages = [['/', '1.0'], ['/shop', '0.9'], ['/maison', '0.6'], ['/ateliers', '0.5'], ['/faq', '0.5'], ...products.map((p) => [`/shop/${slug(p.name)}`, '0.8'])]
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([u, pr]) => `  <url><loc>${BASE}${u}</loc><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`
fs.writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap: ${pages.length} urls`)
