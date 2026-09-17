'use client'

import { useCallback, useEffect, useId, useState } from 'react'

const CLOSE_EVENT = 'nv-dropdown-close'

/**
 * Shared open/close behavior for custom action dropdowns (export menus, filters, etc.).
 * Ensures only one custom dropdown is open at a time and closes on outside click / Escape.
 */
export function useDropdownMenu(defaultOpen = false) {
  const id = useId()
  const [open, setOpen] = useState(defaultOpen)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        window.dispatchEvent(new CustomEvent(CLOSE_EVENT, { detail: { id } }))
      }
      return next
    })
  }, [id])

  useEffect(() => {
    if (!open) return

    const onPeerClose = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail
      if (detail?.id !== id) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener(CLOSE_EVENT, onPeerClose)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener(CLOSE_EVENT, onPeerClose)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, id])

  return { open, setOpen, toggle, close, id }
}
