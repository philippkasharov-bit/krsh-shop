import { useEffect } from 'react'
export function useTitle(t?: string) {
  useEffect(() => { document.title = t ? `${t} — KRSH` : 'KRSH — Footwear, finished by hand' }, [t])
}
