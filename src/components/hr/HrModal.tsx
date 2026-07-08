import { cloneElement, isValidElement, type FormEvent, type ReactNode, useEffect, useId } from 'react'

type HrModalProps = {
  open: boolean
  title: string
  subtitle?: string
  icon?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onClose: () => void
  onConfirm?: () => void
  confirmDisabled?: boolean
  children: ReactNode
  wide?: boolean
}

export function HrModal({
  open,
  title,
  subtitle,
  icon,
  confirmLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  onClose,
  onConfirm,
  confirmDisabled,
  children,
  wide,
}: HrModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onConfirm?.()
  }

  return (
    <div className="hr-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className={`hr-modal${wide ? ' hr-modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hr-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hr-modal-header">
          <div className="hr-modal-title-row">
            {icon ? <span className="hr-modal-icon">{icon}</span> : null}
            <div>
              <h2 id="hr-modal-title">{title}</h2>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </div>
          <button type="button" className="hr-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="hr-modal-body">{children}</div>
          <div className="hr-modal-footer">
            <button type="button" className="hr-modal-cancel" onClick={onClose}>
              {cancelLabel}
            </button>
            {onConfirm ? (
              <button type="submit" className="hr-modal-confirm" disabled={confirmDisabled}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
                {confirmLabel}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}

export function HrModalIcon({ children }: { children: ReactNode }) {
  return <span className="hr-modal-icon-badge">{children}</span>
}

export function HrModalPlusIcon() {
  return (
    <HrModalIcon>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    </HrModalIcon>
  )
}

export function HrModalBriefcaseIcon() {
  return (
    <HrModalIcon>
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="7" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </HrModalIcon>
  )
}

export function HrModalGraduationIcon() {
  return (
    <HrModalIcon>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M22 10L12 5 2 10l10 5 10-5z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6 12v5c0 0 3 3 6 3s6-3 6-3v-5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </HrModalIcon>
  )
}

export function HrModalUploadIcon() {
  return (
    <HrModalIcon>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3v12M7 10l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </HrModalIcon>
  )
}

export function HrModalUserIcon() {
  return (
    <HrModalIcon>
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </HrModalIcon>
  )
}

export function HrModalLocationIcon() {
  return (
    <HrModalIcon>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </HrModalIcon>
  )
}

export function HrModalNotesIcon() {
  return (
    <HrModalIcon>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 4h12v16l-4-3H6V4z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </HrModalIcon>
  )
}

export function HrField({
  label,
  required,
  children,
  className = '',
}: {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  const fieldId = useId().replace(/:/g, '')
  const labelId = `${fieldId}-label`
  const control = isValidElement<{
    id?: string
    'aria-label'?: string
    'aria-labelledby'?: string
    'aria-required'?: boolean
  }>(children)
    ? cloneElement(children, {
        id: children.props.id ?? fieldId,
        'aria-labelledby': children.props['aria-labelledby'] ?? labelId,
        'aria-label': children.props['aria-label'] ?? label,
        'aria-required': required ? true : children.props['aria-required'],
      })
    : children

  return (
    <div className={`hr-field ${className}`.trim()}>
      <span id={labelId} className="hr-field-label">
        {label}
        {required ? <em>*</em> : null}
      </span>
      {control}
    </div>
  )
}

export function HrInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="hr-input" {...props} />
}

export function HrSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="hr-input hr-select" {...props} />
}

export function HrTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="hr-input hr-textarea" {...props} />
}

export function HrFieldRow({ children }: { children: ReactNode }) {
  return <div className="hr-field-row">{children}</div>
}

export function HrCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="hr-checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}
