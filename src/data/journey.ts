import type { Dir } from '../lib/journey'
import { products, slugOf } from '../lib/products'

export interface SceneCard { slug: string; x: number; y: number }
export interface Scene {
  id: 'gate' | 'stage' | 'market' | 'detail' | 'tent'
  dir: Dir
  index: string
  title: string
  kicker: string
  poster: string
  /** Wide scenes (market) are wider than the screen so the sideways pan has room. */
  wide?: boolean
  /** Your clips go here: drop files in public/media/journey/ and fill this in. */
  clip?: { mp4: string; webm?: string; mp4Small?: string }
  cards: SceneCard[]
  callouts?: { label: string; value: string; x: number; y: number }[]
}

const tentCards: SceneCard[] = products.map((p, i) => ({
  slug: slugOf(p),
  x: 0.12 + (i % 4) * 0.21,
  y: 0.4 + Math.floor(i / 4) * 0.12,
}))

export const scenes: Scene[] = [
  { id: 'gate', dir: 'zoom-in', index: '01', title: 'Through the gate', kicker: 'Dusk · Day one',
    poster: '/media/journey/gate.webp',
    cards: [{ slug: 'strobe-jacket', x: 0.36, y: 0.62 }, { slug: 'laser-corset-top', x: 0.51, y: 0.68 }, { slug: 'warehouse-hoodie', x: 0.63, y: 0.6 }] },
  { id: 'stage', dir: 'down', index: '02', title: 'Main stage', kicker: '128 BPM · Lasers up',
    poster: '/media/journey/stage.webp',
    cards: [{ slug: 'chrome-puffer', x: 0.08, y: 0.66 }, { slug: 'glow-cargo', x: 0.53, y: 0.74 }, { slug: 'night-shell', x: 0.7, y: 0.68 }, { slug: 'laser-corset-top', x: 0.9, y: 0.78 }] },
  { id: 'market', dir: 'side', index: '03', title: 'The market path', kicker: 'Dawn · Walk it off', wide: true,
    poster: '/media/journey/market.webp',
    cards: [{ slug: 'flyer-tee', x: 0.14, y: 0.5 }, { slug: 'mini-shoulder-bag', x: 0.46, y: 0.55 }, { slug: 'velour-set', x: 0.86, y: 0.55 }] },
  { id: 'detail', dir: 'zoom-in', index: '04', title: 'Look closer', kicker: 'Strobe Jacket · Drop 01',
    poster: '/media/journey/detail.webp',
    cards: [{ slug: 'strobe-jacket', x: 0.5, y: 0.8 }],
    callouts: [
      { label: 'Fabric', value: 'Heavy cotton canvas', x: 0.22, y: 0.3 },
      { label: 'Fit', value: 'Boxy, cropped', x: 0.78, y: 0.36 },
      { label: 'Mark', value: 'Red print, back', x: 0.72, y: 0.62 },
    ] },
  { id: 'tent', dir: 'zoom-out', index: '05', title: 'The tent shop', kicker: 'Every piece, on display',
    poster: '/media/journey/tent.webp', cards: tentCards },
]
