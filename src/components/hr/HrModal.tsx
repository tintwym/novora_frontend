import { type FormEvent, type ReactNode, useEffect } from 'react'

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
                ✓ {confirmLabel}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
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
  return (
    <label className={`hr-field ${className}`.trim()}>
      <span>
        {label}
        {required ? <em>*</em> : null}
      </span>
      {children}
    </label>
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
