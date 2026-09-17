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
  left: number
  width: number
  maxHeight: number
  openUp: boolean
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

/**
 * Wraps a custom dropdown trigger + menu.
 * - First child = trigger
 * - Remaining children (when open) = menu, portaled with fixed positioning
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
    const menu = menuRef.current
    if (!root) return

    const rect = root.getBoundingClientRect()
    const gap = 8
    const pad = 8
    const spaceBelow = window.innerHeight - rect.bottom - pad
    const spaceAbove = rect.top - pad
    const openUp = spaceBelow < 168 && spaceAbove > spaceBelow
    const available = Math.max(120, (openUp ? spaceAbove : spaceBelow) - gap)

    const measured = menu?.offsetWidth ?? 0
    const menuWidth = Math.max(measured, rect.width, 160)
    const left =
      align === 'right'
        ? clamp(rect.right - menuWidth, pad, window.innerWidth - menuWidth - pad)
        : clamp(rect.left, pad, window.innerWidth - menuWidth - pad)

    const top = openUp
      ? clamp(rect.top - Math.min(menu?.offsetHeight || 200, available) - gap, pad, window.innerHeight - pad)
      : rect.bottom + gap

    setPos({
      top,
      left,
      width: menuWidth,
      maxHeight: Math.min(280, available),
      openUp,
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePosition()
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

    // Defer so the opening click cannot immediately close the menu
    const timer = window.setTimeout(() => {
      document.addEventListener('click', onPointerDown, true)
    }, 0)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('nv-dropdown-close', onPeerClose)
      document.removeEventListener('click', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const menuStyle: CSSProperties = pos
    ? {
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        minWidth: pos.width,
        maxHeight: pos.maxHeight,
        overflowY: 'auto',
        zIndex: 320,
        visibility: 'visible',
        pointerEvents: 'auto',
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 320,
        visibility: 'hidden',
        pointerEvents: 'none',
      }

  const menu =
    open && mounted && menuNodes.length > 0
      ? createPortal(
          <div
            ref={menuRef}
            className={`nv-dropdown-portal ${pos?.openUp ? 'nv-dropdown-portal--up' : ''}`}
            style={menuStyle}
          >
            {menuNodes}
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={`nv-dd-anchor relative shrink-0 ${className}`}>
      {trigger}
      {menu}
    </div>
  )
}
