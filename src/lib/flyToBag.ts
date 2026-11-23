/** A thumbnail arcs from the product image into the header bag (MOTION-SPEC "Add to bag", 700 ms). */
export function flyToBag(from: HTMLElement | null, src: string) {
  if (!from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const bag = document.querySelector<HTMLElement>('[data-bag-target]')
  if (!bag) return
  const a = from.getBoundingClientRect(), b = bag.getBoundingClientRect()
  const size = 96
  const img = document.createElement('img')
  img.src = src
  img.alt = ''
  Object.assign(img.style, {
    position: 'fixed', left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`, height: `${size}px`, objectFit: 'cover', zIndex: '140', pointerEvents: 'none', border: '1px solid rgb(212 166 74 / .6)',
  })
  document.body.appendChild(img)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2)
  img.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(.6)`, opacity: 1, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(.15)`, opacity: 0.2 },
  ], { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }).onfinish = () => {
    img.remove()
    bag.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 480, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' })
  }
}
