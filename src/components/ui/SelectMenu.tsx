'use client'

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

export type SelectMenuOption = {
  value: string
  label: ReactNode
}

type SelectMenuProps = {
  value: string
  onChange: (value: string) => void
  options: SelectMenuOption[]
  className?: string
  id?: string
  disabled?: boolean
  placeholder?: string
  'aria-label'?: string
  triggerClassName?: string
  preferUp?: boolean
}

const CLOSE_EVENT = 'nv-selectmenu-close'

type PanelPos = {
  top?: number
  bottom?: number
  left: number
  width: number
  maxHeight: number
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export default function SelectMenu({
  value,
  onChange,
  options,
  className = '',
  id,
  disabled = false,
  placeholder = 'Select…',
  'aria-label': ariaLabel,
  triggerClassName = '',
  preferUp = false,
}: SelectMenuProps) {
  const autoId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<PanelPos | null>(null)
  const [mounted, setMounted] = useState(false)

  const selected = options.find((opt) => opt.value === value)
  const label = selected?.label ?? placeholder

  useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = () => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const gap = 6
    const pad = 8
    const spaceBelow = window.innerHeight - rect.bottom - pad
    const spaceAbove = rect.top - pad
    const openUp = preferUp ? spaceAbove > spaceBelow : spaceBelow < 180 && spaceAbove > spaceBelow
    const available = Math.max(120, (openUp ? spaceAbove : spaceBelow) - gap)
    const width = Math.max(rect.width, 160)
    const left = clamp(rect.left, pad, window.innerWidth - width - pad)

    if (openUp) {
      setPos({
        bottom: window.innerHeight - rect.top + gap,
        left,
        width,
        maxHeight: Math.min(256, available),
      })
    } else {
      setPos({
        top: rect.bottom + gap,
        left,
        width,
        maxHeight: Math.min(256, available),
      })
    }
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
  }, [open, preferUp, options.length])

  useEffect(() => {
    if (!open) return

    const closeSelf = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail
      if (detail?.id !== autoId) setOpen(false)
    }
    const closeFromAnchor = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string; id?: string }>).detail
      if (detail?.source === 'selectmenu' && detail?.id === autoId) return
      setOpen(false)
    }

    window.addEventListener(CLOSE_EVENT, closeSelf)
    window.addEventListener('nv-dropdown-close', closeFromAnchor)
    window.dispatchEvent(new CustomEvent(CLOSE_EVENT, { detail: { id: autoId } }))
    window.dispatchEvent(
      new CustomEvent('nv-dropdown-close', { detail: { root: null, source: 'selectmenu', id: autoId } }),
    )

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onReposition = () => updatePosition()

    // Defer so the opening click cannot immediately close the menu
    const timer = window.setTimeout(() => {
      document.addEventListener('click', onPointerDown, true)
    }, 0)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(CLOSE_EVENT, closeSelf)
      window.removeEventListener('nv-dropdown-close', closeFromAnchor)
      document.removeEventListener('click', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, autoId])

  const panelStyle: CSSProperties = pos
    ? {
        position: 'fixed',
        top: pos.top ?? 'auto',
        bottom: pos.bottom ?? 'auto',
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
        zIndex: 200,
        visibility: 'visible',
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 200,
        visibility: 'hidden',
        pointerEvents: 'none',
      }

  const panel =
    open && mounted
      ? createPortal(
          <ul
            ref={panelRef}
            role="listbox"
            className="nv-select-panel nv-dropdown-in"
            style={panelStyle}
            aria-activedescendant={selected ? `${autoId}-${value}` : undefined}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <li key={opt.value} role="presentation">
                  <button
                    id={`${autoId}-${opt.value}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                    className={`nv-select-option ${isSelected ? 'nv-select-option--active' : ''}`}
                  >
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    ) : (
                      <span className="w-3.5 shrink-0" aria-hidden />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={`nv-dropdown-anchor ${className}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (disabled) return
          setOpen((v) => !v)
        }}
        className={`nv-select-trigger w-full text-left ${open ? 'nv-select-trigger--open' : ''} ${triggerClassName}`}
      >
        <span className="nv-select-trigger-label truncate">{label}</span>
        <ChevronDown
          className={`nv-select-trigger-chevron ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {panel}
    </div>
  )
}

/** Helper to build options from native `<option>`-like pairs */
export function selectOptions(entries: Array<[string, ReactNode] | { value: string; label: ReactNode }>) {
  return entries.map((entry) =>
    Array.isArray(entry) ? { value: entry[0], label: entry[1] } : entry,
  )
}
