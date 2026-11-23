import { useEffect } from 'react'
export function useTitle(t?: string) {
  useEffect(() => { document.title = t ? `${t} — Pragmatic Hippy` : 'Pragmatic Hippy — Rave wear, made after dark' }, [t])
}
