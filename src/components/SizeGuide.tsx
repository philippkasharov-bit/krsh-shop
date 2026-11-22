import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SIZES, sizeRow } from '../lib/products'
import { EASE } from '../lib/motion'
import { useDialog } from '../lib/useDialog'

export default function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null)
  useDialog(open, onClose, panel)
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside ref={panel} role="dialog" aria-modal="true" aria-label="Size guide"
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-[480px] flex-col bg-ink-2 border-l border-line"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.7, ease: EASE }}>
            <div className="flex h-[72px] items-center justify-between border-b border-line px-8">
              <h2 className="display t-3">Size guide</h2>
              <button className="eyebrow !text-ivory py-3 pl-4" onClick={onClose}>Close</button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <p className="text-ivory-dim leading-relaxed">KRSH runs true to size in US men’s sizing. Between sizes, go up half a size. Boots run slightly narrow.</p>
              <table className="mt-8 w-full text-left">
                <caption className="sr-only">Size conversion chart</caption>
                <thead><tr className="eyebrow border-b border-line">{['US', 'EU', 'UK', 'Foot (cm)'].map((h) => <th key={h} scope="col" className="py-3 font-normal">{h}</th>)}</tr></thead>
                <tbody>
                  {SIZES.map((s) => { const r = sizeRow(s); return (
                    <tr key={s} className="border-b border-line font-mono text-sm"><th scope="row" className="py-3 font-normal">{r.us}</th><td>{r.eu}</td><td>{r.uk}</td><td>{r.cm}</td></tr>
                  ) })}
                </tbody>
              </table>
              <h3 className="display t-4 mt-12">How to measure</h3>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-ivory-dim leading-relaxed">
                <li>Stand on paper with your heel against a wall.</li>
                <li>Mark the tip of your longest toe.</li>
                <li>Measure heel to mark and match it to “Foot (cm)”.</li>
              </ol>
              <p className="eyebrow mt-8">Approximate values · demo store</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
