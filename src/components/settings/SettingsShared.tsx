import type { ReactNode } from 'react'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import type { RecruitPillTone } from '../../types/recruitment'
import type { SettingsNavSection, SettingsPanelId } from '../../types/settings'

export function SettingsPill({ label, tone = 'neutral' }: { label: string; tone?: RecruitPillTone }) {
  return <RecruitPill label={label} tone={tone} />
}

export function showSettingsSaved(message: string) {
  window.alert(message)
}

export function SettingsPageHeader({
  title,
  subtitle,
  trailing,
}: {
  title: string
  subtitle?: string
  trailing?: ReactNode
}) {
  return (
    <div className="set-page-header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {trailing ? <div className="set-page-header-actions">{trailing}</div> : null}
    </div>
  )
}

export function SettingsCard({
  title,
  trailing,
  children,
}: {
  title?: string
  trailing?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="set-card">
      {title || trailing ? (
        <div className="set-card-head">
          {title ? <h3>{title}</h3> : <span />}
          {trailing}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function SettingsCapsLabel({ children }: { children: ReactNode }) {
  return <span className="set-caps-label">{children}</span>
}

export function SettingsInlineFormBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="set-inline-form">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

export function SettingsField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="set-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function SettingsInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="set-input" {...props} />
}

export function SettingsTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="set-textarea" {...props} />
}

export function SettingsSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select className="set-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

export function SettingsToggle({
  label,
  sub,
  checked,
  onChange,
  switchOnly = false,
}: {
  label: string
  sub?: string
  checked: boolean
  onChange: (v: boolean) => void
  switchOnly?: boolean
}) {
  if (switchOnly) {
    return (
      <button
        type="button"
        role="switch"
        aria-label={label || 'Toggle'}
        aria-checked={checked}
        className={`set-toggle set-toggle-only ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    )
  }

  return (
    <div className="set-toggle-row">
      <div>
        {label ? <strong>{label}</strong> : null}
        {sub ? <p>{sub}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`set-toggle ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  )
}

export function SettingsCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="set-checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

export function SettingsTwoCol({ children }: { children: ReactNode[] }) {
  return <div className="set-two-col">{children}</div>
}

export function SettingsSaveFooter({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="set-save-footer">
      <button type="button" className="set-btn primary" onClick={onClick}>
        {label}
      </button>
    </div>
  )
}

export function SettingsSimpleTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="set-table-wrap">
      <table className="set-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SettingsBtn({
  children,
  variant = 'primary',
  onClick,
  className,
}: {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'danger-text'
  onClick?: () => void
  className?: string
}) {
  return (
    <button type="button" className={`set-btn ${variant} ${className ?? ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export function EmailPreview({ subject, body }: { subject: string; body: string }) {
  return (
    <div className="set-email-preview">
      <p className="set-email-meta">From: Novora Alerts &lt;no-reply@novora.com&gt;</p>
      <p className="set-email-meta">Subject: {subject || '(Enter subject above...)'}</p>
      <div className="set-email-brand">
        <span className="set-email-logo">NV</span>
        <strong>NOVORA PTE LTD</strong>
      </div>
      <div className={`set-email-body ${body ? '' : 'empty'}`}>
        {body || 'Start writing the email template body on the left to review real-time markup previews...'}
      </div>
      <p className="set-email-footer">
        This message is an automated notification dispatched by Novora Core Platform.
        <br />© 2026 Novora Pte Ltd. All corporate rights reserved.
      </p>
    </div>
  )
}

export function SettingsSidebar({
  sections,
  selectedId,
  onSelect,
  search,
  onSearchChange,
}: {
  sections: SettingsNavSection[]
  selectedId: SettingsPanelId
  onSelect: (id: SettingsPanelId) => void
  search: string
  onSearchChange: (v: string) => void
}) {
  return (
    <aside className="set-sidebar">
      <div className="set-sidebar-header">
        <span aria-hidden>⚙</span>
        Settings
        <span className="set-sidebar-chevron" aria-hidden>
          ▾
        </span>
      </div>
      <div className="set-sidebar-search">
        <span aria-hidden>🔍</span>
        <input
          type="search"
          placeholder="Search settings..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search settings"
        />
      </div>
      <nav className="set-sidebar-nav">
        {sections.map((section) => (
          <div key={section.title} className="set-sidebar-section">
            <span className="set-sidebar-section-title">{section.title}</span>
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={selectedId === item.id ? 'active' : ''}
                onClick={() => onSelect(item.id)}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="set-sidebar-help">
        <strong>Need Help?</strong>
        <p>Visit our support center for configuration guides.</p>
      </div>
    </aside>
  )
}
