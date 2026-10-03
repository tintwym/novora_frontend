import type { ReactNode } from 'react'

interface ModuleHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  eyebrow?: string
}

/**
 * Module pages keep passing a title for accessibility/search, but the visible page name lives in
 * the top bar (original Novora layout), so only optional actions render here.
 */
export default function ModuleHeader({ title, actions }: ModuleHeaderProps) {
  if (!actions) return null
  return (
    <div className="nv-module-header" aria-label={title}>
      <div className="nv-module-header__actions ml-auto">{actions}</div>
    </div>
  )
}
