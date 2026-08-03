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
      <label htmlFor={id} className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-colors ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] focus:ring-2 focus:ring-[#2f66e0]/15'
          } ${rightSlot ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</div>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-[11px] font-semibold text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[11px] font-medium text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
