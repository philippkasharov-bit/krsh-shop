import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { scenes, type Scene, type SceneCard } from '../data/journey'
import { segmentAt, transformFor } from '../lib/journey'
import { bySlug, money, ACCENT_HEX } from '../lib/products'
import { useBeat } from '../lib/beat'
import { EASE_OUT, EASE_SNAP } from '../lib/motion'

const N = scenes.length

/** The festival journey: one pinned stage, five scenes, scroll drives camera + clip (MOTION-SPEC "Journey"). */
export default function Journey() {
  const reduce = useReducedMotion()
  if (reduce) return <JourneyStatic />
  return <JourneyPinned />
}

function JourneyPinned() {
  const section = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  const [local, setLocal] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const s = segmentAt(p, N)
    if (s.index !== active) setActive(s.index)
    setLocal(s.local)
  })
  const goTo = (i: number) => {
    const el = section.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY + (i / N) * (el.offsetHeight - window.innerHeight) + 2
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis
    if (l) l.scrollTo(top, { duration: 1.2 }); else window.scrollTo({ top, behavior: 'smooth' })
  }
  return (
    <section ref={section} aria-label="The festival journey" style={{ height: `${N * 150}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {scenes.map((s, i) => (
          <SceneLayer key={s.id} scene={s} i={i} active={active === i} progress={scrollYProgress} onCardFocus={() => active !== i && goTo(i)} />
        ))}
        <Particles running />
        <Vignette />
        <SceneTitle scene={scenes[active]} />
        <ProgressHud active={active} local={local} onGo={goTo} />
        {active === 0 && local < 0.08 && <ScrollHint />}
      </div>
    </section>
  )
}

function SceneLayer({ scene, i, active, progress, onCardFocus }: {
  scene: Scene; i: number; active: boolean; progress: MotionValue<number>; onCardFocus: () => void
}) {
  const localMv = useTransform(progress, (p) => Math.max(0, Math.min(1, p * N - i)))
  const x = useTransform(localMv, (l) => transformFor(scene.dir, l).x)
  const y = useTransform(localMv, (l) => transformFor(scene.dir, l).y)
  const scale = useTransform(localMv, (l) => transformFor(scene.dir, l).scale)
  const inv = useTransform(scale, (s) => 1 / s)
  const video = useRef<HTMLVideoElement>(null)
  const idle = useRef(0)
  const [l, setL] = useState(0)
  const mobile = useIsMobile()
  useMotionValueEvent(localMv, 'change', (v) => { setL(v); idle.current = performance.now() })

  // Scrub the clip with scroll; when scrolling stops, it "breathes" ±0.15 s around the current frame.
  useEffect(() => {
    const v = video.current
    if (!v || !active) return
    let raf = 0
    const tick = (t: number) => {
      if (v.duration) {
        const base = localMv.get() * (v.duration - 0.2) + 0.1
        const resting = t - idle.current > 180
        const target = resting ? base + Math.sin(t / 318) * 0.15 : base
        if (Math.abs(v.currentTime - target) > 0.03) v.currentTime = Math.max(0, Math.min(v.duration, target))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, localMv])

  const media = scene.dir === 'side' ? 'w-[143%] h-full' : scene.dir === 'down' ? 'w-full h-[120%]' : 'w-full h-full'
  const origin = scene.id === 'gate' ? '50% 52%' : scene.id === 'detail' ? '50% 45%' : '50% 50%'
  return (
    <motion.div className="absolute inset-0" aria-hidden={!active}
      initial={false} animate={{ opacity: active ? 1 : 0, filter: active ? 'blur(0px)' : 'blur(4px)' }} transition={{ duration: 0.25 }}
      style={{ pointerEvents: active ? 'auto' : 'none', zIndex: active ? 2 : 1 }}>
      <motion.div className={`absolute left-0 top-0 ${media}`} style={{ x, y, scale, transformOrigin: origin }}>
        <motion.div className="absolute inset-0" animate={active && !scene.clip ? { scale: [1, 1.015, 1] } : { scale: 1 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          {scene.clip ? (
            <video ref={video} className="h-full w-full object-cover" muted playsInline preload={i < 2 ? 'auto' : 'metadata'} poster={scene.poster}>
              {scene.clip.webm && <source src={scene.clip.webm} type="video/webm" />}
              {scene.clip.mp4Small && <source src={scene.clip.mp4Small} type="video/mp4" media="(max-width: 768px)" />}
              <source src={scene.clip.mp4} type="video/mp4" />
            </video>
          ) : (
            <img src={scene.poster} alt="" className="h-full w-full object-cover" loading={i < 2 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />
          )}
        </motion.div>
        {(scene.id === 'gate' || scene.id === 'stage') && <Lasers strong={scene.id === 'stage'} />}
        {scene.id === 'gate' && <GateArc local={l} />}
        {scene.cards.map((c, k) => (
          <Tag key={`${c.slug}-${k}`} card={c} k={k} show={active && (scene.id !== 'tent' || l > 0.55)} inv={inv} onFocus={onCardFocus} compact={scene.id === 'tent'} dotOnly={mobile} />
        ))}
      </motion.div>
      {mobile && active && scene.id !== 'tent' && <TagRail cards={scene.cards} onFocus={onCardFocus} />}
      {scene.callouts && active && <Callouts items={scene.callouts} local={l} />}
      {scene.id === 'tent' && active && l > 0.85 && (
        <motion.div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: EASE_SNAP }}>
          <Link to="/shop" className="btn btn-gold" data-cursor="Shop">Browse all 16 pieces</Link>
        </motion.div>
      )}
    </motion.div>
  )
}

/** Wristband tag pinned to a person, with a leader line that draws in (MOTION-SPEC "Product tags"). */
function Tag({ card, k, show, inv, onFocus, compact, dotOnly }: { card: SceneCard; k: number; show: boolean; inv: MotionValue<number>; onFocus: () => void; compact?: boolean; dotOnly?: boolean }) {
  const p = bySlug(card.slug)
  const beat = useBeat()
  const dot = useTransform(beat, [0, 1], [0.6, 1.25])
  if (!p) return null
  const hex = ACCENT_HEX[p.accent]
  const up = card.y > 0.6
  const left = card.x > 0.55
  return (
    <motion.div className="absolute" style={{ left: `${card.x * 100}%`, top: `${card.y * 100}%`, scale: inv, transformOrigin: '0 0' }}>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: compact ? k * 0.06 : 0.15 + k * 0.08 }}>
            <motion.span className="absolute -left-1.5 -top-1.5 block h-3 w-3 rounded-full" style={{ background: hex, scale: dot, boxShadow: `0 0 0 4px ${hex}33` }} />
            {!compact && !dotOnly && (
              <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden>
                <motion.line x1="0" y1="0" x2={left ? -40 : 40} y2={up ? -56 : 56} stroke={hex} strokeWidth="1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.15 + k * 0.08 }} />
              </svg>
            )}
            {!dotOnly && 
            <motion.div className="absolute" style={compact ? { left: -60, top: 14 } : left ? { right: 40, top: up ? -96 : 56 } : { left: 40, top: up ? -96 : 56 }}
              initial={{ x: left ? 12 : -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.48, ease: EASE_SNAP, delay: (compact ? k * 0.06 : 0.45 + k * 0.08) }}>
              <Link to={`/shop/${card.slug}`} onFocus={onFocus} data-cursor="Open"
                className="group relative flex items-center gap-3 whitespace-nowrap border bg-black/75 py-2 pl-4 pr-3 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
                style={{ borderColor: `${hex}88`, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 6px 50%)' }}>
                <span className="block h-full w-1 absolute left-2 top-0" style={{ background: hex }} />
                <span className="pl-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory">{p.name}</span>
                <span className="relative h-4 overflow-hidden font-mono text-[11px] text-gold [perspective:200px]">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full group-focus-visible:-translate-y-full">{money(p.price)}</span>
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full group-focus-visible:-translate-y-full">Open →</span>
                </span>
              </Link>
            </motion.div>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Callouts({ items, local }: { items: NonNullable<Scene['callouts']>; local: number }) {
  const t = Math.max(0, Math.min(1, (local - 0.15) / 0.2))
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden={t === 0}>
      {items.map((c, i) => {
        const v = Math.max(0, Math.min(1, t * 1.6 - i * 0.3))
        return (
          <div key={c.label} className="absolute" style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, opacity: v, transform: `translateY(${(1 - v) * 10}px)` }}>
            <span className="block h-px bg-gold/70" style={{ width: `${v * 120}px` }} />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory-dim">{c.label}</p>
            <p className="display text-xl text-ivory">{c.value}</p>
          </div>
        )
      })}
    </div>
  )
}

/** Laser beams sweeping, flashing on the beat. */
function Lasers({ strong }: { strong?: boolean }) {
  const beat = useBeat()
  const opacity = useTransform(beat, [0, 1], strong ? [0.25, 0.7] : [0.1, 0.35])
  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ opacity }}>
      {[0, 1, 2].map((n) => (
        <motion.div key={n} className="absolute left-1/2 top-[38%] h-[160%] w-[3px] origin-top"
          style={{ background: 'linear-gradient(rgb(170 110 255 / .9), transparent 70%)', filter: 'blur(1px)' }}
          animate={{ rotate: [-60 + n * 40, -20 + n * 40, -60 + n * 40] }} transition={{ duration: 8 + n * 2, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </motion.div>
  )
}

/** Glowing gold arc behind the gate that brightens as you push in (ref R2). */
function GateArc({ local }: { local: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[14%] h-[70%] w-[46%] -translate-x-1/2 rounded-t-full border-t-2 border-x-2 border-gold"
      style={{ opacity: 0.15 + local * 0.6, boxShadow: `0 -10px ${30 + local * 50}px rgb(212 166 74 / ${0.2 + local * 0.4})`, maskImage: 'linear-gradient(black 40%, transparent 85%)' }} />
  )
}

function Vignette() {
  return <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgb(0 0 0 / .65))' }} />
}

function SceneTitle({ scene }: { scene: Scene }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5]"><div className="wrap pt-28">
      <AnimatePresence mode="wait">
        <motion.div key={scene.id} initial="hidden" animate="show" exit="exit">
          <motion.p className="font-mono text-[11px] tracking-[0.2em] text-gold" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}>
            {scene.index}/{String(N).padStart(2, '0')} · {scene.kicker}
          </motion.p>
          <h2 className="display t-1 mt-3 max-w-[12ch]" aria-label={scene.title}>
            {scene.title.split(' ').map((w, wi) => (
              <span key={wi} aria-hidden className="mr-[0.26em] inline-block overflow-hidden align-bottom pb-[0.1em]">
                {[...w].map((ch, ci) => (
                  <motion.span key={ci} className="inline-block"
                    variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: (wi * 4 + ci) * 0.028 } }, exit: { y: '-110%', transition: { duration: 0.25, ease: EASE_OUT } } }}>{ch}</motion.span>
                ))}
              </span>
            ))}
          </h2>
        </motion.div>
      </AnimatePresence>
    </div></div>
  )
}

function ProgressHud({ active, local, onGo }: { active: number; local: number; onGo: (i: number) => void }) {
  const beat = useBeat()
  const pulse = useTransform(beat, [0, 1], [1, 1.6])
  return (
    <nav aria-label="Journey scenes" className="absolute right-6 top-1/2 z-[6] -translate-y-1/2 md:right-10">
      <ol className="relative flex flex-col items-end gap-6">
        <span aria-hidden className="absolute right-[5px] top-1 bottom-1 w-px bg-line" />
        <span aria-hidden className="absolute right-[5px] top-1 w-px bg-gold origin-top" style={{ height: `calc(${((active + local) / (N - 1)) * 100}% - 8px)`, maxHeight: 'calc(100% - 8px)' }} />
        {scenes.map((s, i) => (
          <li key={s.id}>
            <button onClick={() => onGo(i)} className="group flex items-center gap-3" aria-current={active === i ? 'step' : undefined} aria-label={`${s.index} ${s.title}`}>
              <span className={`hidden md:inline font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity duration-300 ${active === i ? 'text-ivory opacity-100' : 'opacity-0 group-hover:opacity-60'}`}>{s.title}</span>
              <motion.span className={`relative block h-[11px] w-[11px] rounded-full border ${active >= i ? 'border-gold bg-gold' : 'border-ivory/40 bg-black'}`}
                style={active === i ? { scale: pulse } : undefined} />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function ScrollHint() {
  return (
    <motion.div aria-hidden className="absolute bottom-10 left-1/2 z-[6] -translate-x-1/2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ivory-dim"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      Scroll to enter
      <motion.span className="mx-auto mt-3 block h-10 w-px bg-gold origin-top" animate={{ scaleY: [0, 1, 0], y: [0, 0, 20] }} transition={{ duration: 1.6, repeat: Infinity }} />
    </motion.div>
  )
}

/** Dust/smoke drifting with slight parallax. One canvas, paused off-screen and in hidden tabs. */
function Particles({ running }: { running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c || !running) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const count = window.innerWidth < 768 ? 15 : 40
    let w = 0, h = 0, raf = 0, visible = true
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    resize()
    const ps = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.8, vx: (Math.random() - 0.5) * 0.15, vy: -0.05 - Math.random() * 0.2, a: 0.15 + Math.random() * 0.45, gold: Math.random() > 0.4 }))
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(c)
    const tick = () => {
      if (visible && !document.hidden) {
        ctx.clearRect(0, 0, w, h)
        for (const p of ps) {
          p.x += p.vx; p.y += p.vy
          if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w }
          if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = p.gold ? `rgba(212,166,74,${p.a})` : `rgba(190,150,255,${p.a * 0.7})`
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize) }
  }, [running])
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[4] h-full w-full" />
}

/** Reduced motion: no pin, no scrub, no particles. Posters stacked with their pieces. */
function JourneyStatic() {
  return (
    <section aria-label="The festival journey" className="pt-24">
      {scenes.map((s) => (
        <article key={s.id} className="wrap mt-16">
          <p className="font-mono text-[11px] tracking-[0.2em] text-gold">{s.index}/{String(N).padStart(2, '0')} · {s.kicker}</p>
          <h2 className="display t-2 mt-2">{s.title}</h2>
          <img src={s.poster} alt="" loading="lazy" className="mt-6 aspect-video w-full object-cover" />
          <ul className="mt-4 flex flex-wrap gap-3">
            {[...new Set(s.cards.map((c) => c.slug))].map((slug) => {
              const p = bySlug(slug)!
              return <li key={slug}><Link to={`/shop/${slug}`} className="link-u">{p.name} · {money(p.price)}</Link></li>
            })}
          </ul>
        </article>
      ))}
    </section>
  )
}

function useIsMobile() {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const on = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return m
}

/** Phones: dots stay on the people, tags line up along the bottom so none is cut off. */
function TagRail({ cards, onFocus }: { cards: SceneCard[]; onFocus: () => void }) {
  const slugs = [...new Set(cards.map((c) => c.slug))]
  return (
    <div className="absolute inset-x-0 bottom-6 z-10 flex flex-wrap justify-center gap-2 px-4">
      {slugs.map((slug, i) => {
        const p = bySlug(slug)!
        const hex = ACCENT_HEX[p.accent]
        return (
          <motion.div key={slug} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE_SNAP, delay: i * 0.05 }}>
            <Link to={`/shop/${slug}`} onFocus={onFocus} className="flex items-center gap-2 border bg-black/75 px-3 py-2 backdrop-blur-md" style={{ borderColor: `${hex}88` }}>
              <span className="h-2 w-2 rounded-full" style={{ background: hex }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{p.name}</span>
              <span className="font-mono text-[10px] text-gold">{money(p.price)}</span>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
