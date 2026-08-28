import type { ReactNode } from 'react'

export default function SidebarTooltip({
  label,
  show,
  children,
}: {
  label: string
  show: boolean
  children: ReactNode
}) {
  if (!show) return <>{children}</>

  return (
    <div className="group/sidebar-tip relative w-full">
      {children}
      <span
        role="tooltip"
        className="nv-sidebar-tooltip pointer-events-none absolute left-[calc(100%+0.625rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-dropdown-bg)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--sidebar-text-hover)] opacity-0 shadow-lg transition-all duration-200 group-hover/sidebar-tip:translate-x-0.5 group-hover/sidebar-tip:opacity-100"
      >
        {label}
      </span>
    </div>
  )
}
