import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type ModuleStatProps = {
  label: string
  value: string | number
  hint?: string
  icon?: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function ModuleStatCard({ label, value, hint, icon: Icon, trend, trendUp }: ModuleStatProps) {
  return (
    <div className="nv-stat-card">
      <div className="flex items-start justify-between gap-2">
        {Icon ? (
          <span className="nv-stat-icon">
            <Icon className="h-4 w-4" />
          </span>
        ) : (
          <span />
        )}
        {trend ? (
          <span className={`text-[10px] font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </span>
        ) : null}
      </div>
      <div className="mt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-bold text-slate-900 tracking-tight">{value}</p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  )
}

type ModuleToolbarProps = {
  children: ReactNode
  className?: string
}

export function ModuleToolbar({ children, className = '' }: ModuleToolbarProps) {
  return <div className={`nv-toolbar ${className}`}>{children}</div>
}

type ModulePanelProps = {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  action?: ReactNode
}

export function ModulePanel({ children, className = '', title, description, action }: ModulePanelProps) {
  return (
    <section className={`nv-panel ${className}`}>
      {(title || description || action) && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? <h2 className="text-sm font-bold text-slate-900">{title}</h2> : null}
            {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

type ModuleTabProps = {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

export function ModuleTabs({ tabs, active, onChange }: ModuleTabProps) {
  return (
    <div className="nv-tab-list">
      {tabs.map((tab) => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={isActive ? 'nv-tab nv-tab-active' : 'nv-tab'}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
