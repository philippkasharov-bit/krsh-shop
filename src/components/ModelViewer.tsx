import { useEffect, useState, createElement } from 'react'

/** Lazy-loads <model-viewer> (Google) so the 3D chunk never blocks first paint. */
export default function ModelViewer({ src, poster, alt, autoRotate = true, className = '' }: {
  src: string; poster?: string; alt: string; autoRotate?: boolean; className?: string
}) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    import('@google/model-viewer').then(() => live && setReady(true)).catch(() => {})
    return () => { live = false }
  }, [])
  if (!ready) return poster ? <img src={poster} alt={alt} className={`object-contain ${className}`} /> : <div className={className} />
  return createElement('model-viewer', {
    src, alt, poster, class: className, 'camera-controls': true, 'auto-rotate': autoRotate || undefined,
    'auto-rotate-delay': 0, 'rotation-per-second': '14deg', 'shadow-intensity': '1.2', 'shadow-softness': '1',
    exposure: '1.05', 'interaction-prompt': 'none', 'environment-image': 'neutral', loading: 'eager',
    style: { width: '100%', height: '100%', background: 'transparent', '--poster-color': 'transparent' },
  })
}
