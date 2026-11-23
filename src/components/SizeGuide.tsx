import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { APPAREL_SIZES, SHOE_SIZES, type Kind } from '../lib/products'
import { EASE } from '../lib/motion'
import { useDialog } from '../lib/useDialog'

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="mt-8 w-full text-left">
      <caption className="sr-only">Size chart</caption>
      <thead><tr className="eyebrow border-b border-line">{head.map((h) => <th key={h} scope="col" className="py-3 font-normal">{h}</th>)}</tr></thead>
      <tbody>{rows.map(([first, ...rest]) => (
        <tr key={first} className="border-b border-line font-mono text-sm"><th scope="row" className="py-3 font-normal">{first}</th>{rest.map((v, i) => <td key={i}>{v}</td>)}</tr>
      ))}</tbody>
    </table>
  )
}

export default function SizeGuide({ kind, open, onClose }: { kind: Kind; open: boolean; onClose: () => void }) {
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
              {kind === 'apparel' ? (<>
                <p className="text-ivory-dim leading-relaxed">Garment measurements, laid flat and doubled. Most pieces are cut boxy: size down for a closer fit.</p>
                <Table head={['Size', 'Chest (cm)', 'Length (cm)']} rows={APPAREL_SIZES.map((s, i) => [s, 96 + i * 6, 66 + i * 2])} />
                <h3 className="display t-4 mt-12">How to measure</h3>
                <p className="mt-4 text-ivory-dim leading-relaxed">Lay a top you like flat. Measure armpit to armpit and double it, then compare with “Chest”.</p>
              </>) : (<>
                <p className="text-ivory-dim leading-relaxed">Shoes are sized in EU. Between sizes, go up one.</p>
                <Table head={['EU', 'Foot (cm)']} rows={SHOE_SIZES.map((s, i) => [s, Math.round((22.5 + i * 0.67) * 10) / 10])} />
                <h3 className="display t-4 mt-12">How to measure</h3>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-ivory-dim leading-relaxed">
                  <li>Stand on paper with your heel against a wall.</li>
                  <li>Mark the tip of your longest toe.</li>
                  <li>Measure heel to mark and match it to “Foot (cm)”.</li>
                </ol>
              </>)}
              <p className="eyebrow mt-8">Approximate values · demo store</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
