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
  openUp: boolean
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function optionSearchText(opt: SelectMenuOption): string {
  if (typeof opt.label === 'string' || typeof opt.label === 'number') {
    return String(opt.label)
  }
  return opt.value
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
  const typeaheadRef = useRef({ query: '', timer: 0 })
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<PanelPos | null>(null)
  const [mounted, setMounted] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const selected = options.find((opt) => opt.value === value)
  const selectedIndex = options.findIndex((opt) => opt.value === value)
  const label = selected?.label ?? placeholder
  const isToolbar = triggerClassName.includes('nv-select-trigger--toolbar')

  useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = () => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const gap = 8
    const pad = 8
    const spaceBelow = window.innerHeight - rect.bottom - pad
    const spaceAbove = rect.top - pad
    const openUp = preferUp ? spaceAbove > spaceBelow : spaceBelow < 200 && spaceAbove > spaceBelow
    const available = Math.max(120, (openUp ? spaceAbove : spaceBelow) - gap)
    const width = Math.max(rect.width, 168)
    const left = clamp(rect.left, pad, window.innerWidth - width - pad)

    if (openUp) {
      setPos({
        bottom: window.innerHeight - rect.top + gap,
        left,
        width,
        maxHeight: Math.min(280, available),
        openUp: true,
      })
    } else {
      setPos({
        top: rect.bottom + gap,
        left,
        width,
        maxHeight: Math.min(280, available),
        openUp: false,
      })
    }
  }

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePosition()
    const frame = requestAnimationFrame(() => updatePosition())
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, preferUp, options.length])

  useEffect(() => {
    if (!open) {
      setHighlightIndex(-1)
      return
    }
    setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open || highlightIndex < 0) return
    const panel = panelRef.current
    if (!panel) return
    const el = panel.querySelector<HTMLElement>(`[data-nv-option-index="${highlightIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [open, highlightIndex])

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
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (options.length === 0) return
        setHighlightIndex((prev) => {
          const base = prev < 0 ? (selectedIndex >= 0 ? selectedIndex : 0) : prev
          if (event.key === 'ArrowDown') return (base + 1) % options.length
          return (base - 1 + options.length) % options.length
        })
        return
      }

      if (event.key === 'Home') {
        event.preventDefault()
        if (options.length) setHighlightIndex(0)
        return
      }

      if (event.key === 'End') {
        event.preventDefault()
        if (options.length) setHighlightIndex(options.length - 1)
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (highlightIndex < 0 || highlightIndex >= options.length) return
        event.preventDefault()
        onChange(options[highlightIndex].value)
        setOpen(false)
        triggerRef.current?.focus()
        return
      }

      // Typeahead: accumulate printable characters
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        const nextQuery = `${typeaheadRef.current.query}${event.key.toLowerCase()}`
        typeaheadRef.current.query = nextQuery
        window.clearTimeout(typeaheadRef.current.timer)
        typeaheadRef.current.timer = window.setTimeout(() => {
          typeaheadRef.current.query = ''
        }, 700)

        const start = highlightIndex >= 0 ? highlightIndex + 1 : 0
        const pool = [...options.slice(start), ...options.slice(0, start)]
        const match = pool.find((opt) => optionSearchText(opt).toLowerCase().startsWith(nextQuery))
        if (match) {
          const idx = options.findIndex((opt) => opt.value === match.value)
          if (idx >= 0) setHighlightIndex(idx)
        }
      }
    }
    const onReposition = () => updatePosition()

    const timer = window.setTimeout(() => {
      document.addEventListener('click', onPointerDown, true)
    }, 0)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(typeaheadRef.current.timer)
      window.removeEventListener(CLOSE_EVENT, closeSelf)
      window.removeEventListener('nv-dropdown-close', closeFromAnchor)
      document.removeEventListener('click', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, autoId, options, highlightIndex, onChange, selectedIndex])

  const panelStyle: CSSProperties = pos
    ? {
        position: 'fixed',
        top: pos.top ?? 'auto',
        bottom: pos.bottom ?? 'auto',
        left: pos.left,
        width: pos.width,
        minWidth: pos.width,
        maxHeight: pos.maxHeight,
        zIndex: 320,
        visibility: 'visible',
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 320,
        visibility: 'hidden',
        pointerEvents: 'none',
      }

  const activeValue = highlightIndex >= 0 ? options[highlightIndex]?.value : value

  const panel =
    open && mounted
      ? createPortal(
          <ul
            ref={panelRef}
            role="listbox"
            id={`${autoId}-listbox`}
            className={`nv-select-panel ${pos?.openUp ? 'nv-dropdown-in--up' : 'nv-dropdown-in'}`}
            style={panelStyle}
            aria-activedescendant={activeValue != null ? `${autoId}-${activeValue}` : undefined}
          >
            {options.map((opt, index) => {
              const isSelected = opt.value === value
              const isHighlighted = index === highlightIndex
              return (
                <li key={`${opt.value}-${index}`} role="presentation">
                  <button
                    id={`${autoId}-${opt.value}`}
                    type="button"
                    role="option"
                    data-nv-option-index={index}
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                      triggerRef.current?.focus()
                    }}
                    className={`nv-select-option ${isSelected ? 'nv-select-option--active' : ''} ${
                      isHighlighted ? 'nv-select-option--highlight' : ''
                    }`}
                  >
                    <span className="nv-select-option-icon" aria-hidden>
                      {isSelected ? <Check strokeWidth={2.5} /> : null}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )
      : null

  const rootClass = [
    'nv-dropdown-anchor',
    isToolbar || className.includes('w-auto') || className.includes('shrink-0') ? 'shrink-0' : 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const openMenu = () => {
    if (disabled) return
    setOpen(true)
  }

  return (
    <div ref={rootRef} className={rootClass}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${autoId}-listbox` : undefined}
        onClick={() => {
          if (disabled) return
          setOpen((v) => !v)
        }}
        onKeyDown={(event) => {
          if (disabled) return
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            openMenu()
          } else if (event.key === 'Enter' || event.key === ' ') {
            // native button already toggles via click for Enter/Space; keep default
          }
        }}
        className={`nv-select-trigger w-full text-left ${open ? 'nv-select-trigger--open' : ''} ${triggerClassName}`}
      >
        <span className="nv-select-trigger-label truncate">{label}</span>
        <ChevronDown className="nv-select-trigger-chevron" aria-hidden />
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
