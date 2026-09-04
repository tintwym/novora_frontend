import type { ReactNode } from 'react'

interface ModuleHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  eyebrow?: string
}

/** Shared page header for HR module surfaces — keeps hierarchy consistent. */
export default function ModuleHeader({ title, description, actions, eyebrow }: ModuleHeaderProps) {
  return (
    <div className="nv-module-header animate-soft-fade-up">
      <div className="nv-module-header__copy">
        {eyebrow ? <p className="nv-section-label mb-2">{eyebrow}</p> : null}
        <h2 className="nv-module-header__title">{title}</h2>
        {description ? <p className="nv-module-header__desc">{description}</p> : null}
      </div>
      {actions ? <div className="nv-module-header__actions">{actions}</div> : null}
    </div>
  )
}
