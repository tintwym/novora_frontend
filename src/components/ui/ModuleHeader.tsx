import type { ReactNode } from 'react'

interface ModuleHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  eyebrow?: string
}

/**
 * Page title lives in the top bar. This header shows optional description + action row.
 */
export default function ModuleHeader({ title, description, actions, eyebrow }: ModuleHeaderProps) {
  if (!description && !actions && !eyebrow) return null
  return (
    <div className="nv-module-header" aria-label={title}>
      {(eyebrow || description) && (
        <div className="min-w-0 flex-1">
          {eyebrow ? <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">{eyebrow}</p> : null}
          {description ? <p className="nv-module-header__desc !mt-0">{description}</p> : null}
        </div>
      )}
      {actions ? <div className="nv-module-header__actions w-full min-w-0 sm:ml-auto sm:w-auto">{actions}</div> : null}
    </div>
  )
}
