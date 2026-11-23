import type { ReactNode } from 'react'

/** Festival wristband tag: notched end, accent strip. */
export default function Wristband({ children, color = 'var(--color-gold)', className = '' }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span className={`relative inline-flex items-center gap-2 border bg-black/70 py-1.5 pl-4 pr-3 font-mono text-[10px] uppercase tracking-[0.16em] ${className}`}
      style={{ borderColor: color, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 6px 50%)' }}>
      <span aria-hidden className="absolute left-2 top-0 h-full w-[3px]" style={{ background: color }} />
      <span className="pl-1">{children}</span>
    </span>
  )
}
