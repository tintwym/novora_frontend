'use client'

import {
  Children,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type Align = 'left' | 'right'

type DropdownAnchorProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  /** Menu horizontal alignment relative to the trigger */
  align?: Align
}

type PanelPos = {
  top: number
  left?: number
  right?: number
  minWidth: number
  maxHeight: number
}

/**
 * Wraps a custom dropdown trigger + menu.
 * - First child = trigger
 * - Remaining children (when open) = menu, portaled with fixed positioning
 * Closes on outside click / Escape and notifies peers via nv-dropdown-close.
 */
export default function DropdownAnchor({
  open,
  onClose,
  children,
  className = '',
  align = 'right',
}: DropdownAnchorProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const [pos, setPos] = useState<PanelPos | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const childList = Children.toArray(children)
  const trigger = childList[0] ?? null
  const menuNodes = open ? childList.slice(1) : []

  const updatePosition = () => {
    const root = rootRef.current
    if (!root) return
    const rect = root.getBoundingClientRect()
    const gap = 8
    const pad = 12
    const spaceBelow = window.innerHeight - rect.bottom - pad
    const spaceAbove = rect.top - pad
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow
    const available = Math.max(120, (openUp ? spaceAbove : spaceBelow) - gap)
    const menuWidth = menuRef.current?.offsetWidth || Math.max(rect.width, 140)
    const top = openUp
      ? Math.max(pad, rect.top - Math.min(280, available) - gap)
      : rect.bottom + gap

    if (align === 'right') {
      const right = Math.max(pad, window.innerWidth - rect.right)
      setPos({
        top,
        right,
        minWidth: Math.max(rect.width, 140),
        maxHeight: Math.min(280, available),
      })
    } else {
      const left = Math.min(
        Math.max(pad, rect.left),
        Math.max(pad, window.innerWidth - menuWidth - pad),
      )
      setPos({
        top,
        left,
        minWidth: Math.max(rect.width, 140),
        maxHeight: Math.min(280, available),
      })
    }
  }

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePosition()
    // Second pass after menu paints so width-based left align is accurate
    const id = requestAnimationFrame(() => updatePosition())
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, align, menuNodes.length])

  useEffect(() => {
    if (!open) return

    const onPeerClose = (event: Event) => {
      const detail = (event as CustomEvent<{ root: HTMLElement | null }>).detail
      if (detail?.root !== rootRef.current) onCloseRef.current()
    }
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      onCloseRef.current()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    const onReposition = () => updatePosition()

    window.addEventListener('nv-dropdown-close', onPeerClose)
    window.dispatchEvent(new CustomEvent('nv-dropdown-close', { detail: { root: rootRef.current } }))
    window.dispatchEvent(new CustomEvent('nv-selectmenu-close', { detail: { id: '__anchor__' } }))

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      window.removeEventListener('nv-dropdown-close', onPeerClose)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const menu =
    open && pos && mounted && menuNodes.length > 0
      ? createPortal(
          <div
            ref={menuRef}
            className="nv-dropdown-portal"
            style={
              {
                position: 'fixed',
                top: pos.top,
                left: pos.left ?? 'auto',
                right: pos.right ?? 'auto',
                minWidth: pos.minWidth,
                maxHeight: pos.maxHeight,
                zIndex: 90,
                overflow: 'auto',
              } satisfies CSSProperties
            }
          >
            {menuNodes}
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      {trigger}
      {menu}
    </div>
  )
}
