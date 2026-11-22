export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-line py-6" aria-hidden>
      <div className="marquee-track flex gap-16 whitespace-nowrap">
        {row.concat(row).map((t, i) => (
          <span key={i} className="display t-2 flex items-center gap-16">
            {t}<span className="text-gold text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
