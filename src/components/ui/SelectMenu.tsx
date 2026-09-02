'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
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
}: SelectMenuProps) {
  const autoId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = options.find((opt) => opt.value === value)
  const label = selected?.label ?? placeholder

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`nv-dropdown-anchor ${className}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`nv-select-trigger w-full text-left ${open ? 'nv-select-trigger--open' : ''} ${triggerClassName}`}
      >
        <span className="nv-select-trigger-label truncate">{label}</span>
        <ChevronDown
          className={`nv-select-trigger-chevron ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="nv-dropdown-panel nv-select-panel"
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
        </ul>
      )}
    </div>
  )
}

/** Helper to build options from native `<option>`-like pairs */
export function selectOptions(entries: Array<[string, ReactNode] | { value: string; label: ReactNode }>) {
  return entries.map((entry) =>
    Array.isArray(entry) ? { value: entry[0], label: entry[1] } : entry,
  )
}
