import { type InputHTMLAttributes, useId, useState } from 'react'

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label: string
  icon: 'mail' | 'lock' | 'user' | 'building'
  revealToggle?: boolean
}

function FieldIcon({ icon }: { icon: AuthFieldProps['icon'] }) {
  if (icon === 'mail') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 6h16v12H4V6Zm0 0 8 6 8-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (icon === 'user') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (icon === 'building') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 20V8l8-4 8 4v12H4Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M10.6 10.6A4 4 0 0 0 12 16a4 4 0 0 0 3.4-1.8M6.7 6.7C4.6 8.1 3 10 3 12s3.5 6 9 6c1.2 0 2.3-.2 3.3-.6M17.3 17.3C19.4 15.9 21 14 21 12s-3.5-6-9-6c-1.2 0-2.3.2-3.3.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AuthField({ label, icon, revealToggle, type, id, ...rest }: AuthFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && revealToggle && revealed ? 'text' : type

  return (
    <div className="auth-field">
      <label htmlFor={fieldId}>{label}</label>
      <div className="auth-field-input-wrap">
        <span className="auth-field-icon">
          <FieldIcon icon={icon} />
        </span>
        <input id={fieldId} type={inputType} className="auth-field-input" {...rest} />
        {isPassword && revealToggle ? (
          <button
            type="button"
            className="auth-field-reveal"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <EyeIcon open={revealed} />
          </button>
        ) : null}
      </div>
    </div>
  )
}
