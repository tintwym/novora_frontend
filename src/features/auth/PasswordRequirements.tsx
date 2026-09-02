import { Check, X } from 'lucide-react'
import { getPasswordChecks } from './validation'

interface PasswordRequirementsProps {
  password: string
  showWhenEmpty?: boolean
}

export default function PasswordRequirements({
  password,
  showWhenEmpty = false,
}: PasswordRequirementsProps) {
  if (!password && !showWhenEmpty) return null

  const checks = getPasswordChecks(password)

  return (
    <ul className="space-y-1 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5" aria-live="polite">
      {checks.map((check) => (
        <li key={check.id} className="flex items-center gap-2 text-[11px] font-medium">
          {check.met ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
          ) : (
            <X className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
          )}
          <span className={check.met ? 'text-emerald-700' : 'text-slate-500'}>{check.label}</span>
        </li>
      ))}
    </ul>
  )
}
