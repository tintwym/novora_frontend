'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Floating label for the collapsed sidebar rail.
 * Portaled to `document.body` so it is not clipped by the shell's `overflow: hidden`.
 */
export default function SidebarTooltip({
  label,
  show,
  children,
}: {
  label: string
  show: boolean
  children: ReactNode
}) {
  const tipId = useId()
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    })
  }, [])

  const openTip = useCallback(() => {
    updatePosition()
    setOpen(true)
  }, [updatePosition])

  const closeTip = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onScrollOrResize = () => updatePosition()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open, updatePosition])

  if (!show) return <>{children}</>

  return (
    <div
      ref={anchorRef}
      className="relative inline-flex w-full max-w-full justify-center"
      onMouseEnter={openTip}
      onMouseLeave={closeTip}
      onFocus={openTip}
      onBlur={closeTip}
    >
      {children}
      {mounted &&
        open &&
        createPortal(
          <span
            id={tipId}
            role="tooltip"
            className="nv-sidebar-tooltip pointer-events-none fixed z-[80] whitespace-nowrap rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-dropdown-bg)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--sidebar-text-hover)] shadow-lg"
            style={{
              top: pos.top,
              left: pos.left,
              transform: 'translateY(-50%)',
            }}
          >
            {label}
          </span>,
          document.body,
        )}
    </div>
  )
}
