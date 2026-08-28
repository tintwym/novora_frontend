import type { LucideIcon } from 'lucide-react'
import { Construction, ArrowRight } from 'lucide-react'

export type ModuleCapability = {
  label: string
  status: 'live' | 'planned'
}

interface ModuleShellProps {
  title: string
  description: string
  icon?: LucideIcon
  capabilities?: ModuleCapability[]
  primaryAction?: {
    label: string
    onClick: () => void
  }
  children?: React.ReactNode
}

/** Honest polished shell for modules without a full backend yet. */
export default function ModuleShell({
  title,
  description,
  icon: Icon = Construction,
  capabilities = [],
  primaryAction,
  children,
}: ModuleShellProps) {
  return (
    <div className="space-y-5 select-none animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="nv-page-title text-xl">{title}</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>
        </div>
        {primaryAction ? (
          <button type="button" onClick={primaryAction.onClick} className="nv-btn-primary">
            {primaryAction.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {children}

      <div className="nv-panel p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-novora/10 text-novora flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-2">
            <h2 className="text-sm font-bold text-slate-900">Backend not available yet</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              This area is ready in the portal shell. Live data and mutations will appear here once
              the matching API ships — we are not showing fake records.
            </p>
          </div>
        </div>

        {capabilities.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {capabilities.map((cap) => (
              <div
                key={cap.label}
                className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-3 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-semibold text-slate-700">{cap.label}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    cap.status === 'live'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}
                >
                  {cap.status === 'live' ? 'Live' : 'Planned'}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
