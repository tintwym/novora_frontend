import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  hint?: string
  rightSlot?: ReactNode
}

export default function AuthField({
  id,
  label,
  error,
  hint,
  rightSlot,
  className = '',
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`nv-input ${rightSlot ? 'pr-11' : ''} ${
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
          } ${className}`}
          {...props}
        />
        {rightSlot && <div className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</div>}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
