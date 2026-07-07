import type { ReactNode } from 'react'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { NovoraLogoMark } from '../brand/NovoraLogo'
import type { RecruitPillTone } from '../../types/recruitment'
import type { SettingsNavSection, SettingsPanelId } from '../../types/settings'

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const SET_ICONS: Record<string, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" {...stroke} />
      <line x1="16.5" y1="16.5" x2="21" y2="21" {...stroke} />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        {...stroke}
      />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6 6-6" {...stroke} />,
  save: (
    <>
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" {...stroke} />
      <path d="M17 21v-8H7v8M7 3v5h8" {...stroke} />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" {...stroke} />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" {...stroke} />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...stroke} />,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" {...stroke} />,
  refresh: (
    <>
      <path d="M3 12a9 9 0 0115.5-6.5" {...stroke} />
      <path d="M18 3v4h-4" {...stroke} />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" {...stroke} />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" {...stroke} />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="21" x2="4" y2="14" {...stroke} />
      <line x1="4" y1="10" x2="4" y2="3" {...stroke} />
      <line x1="12" y1="21" x2="12" y2="12" {...stroke} />
      <line x1="12" y1="8" x2="12" y2="3" {...stroke} />
      <line x1="20" y1="21" x2="20" y2="16" {...stroke} />
      <line x1="20" y1="12" x2="20" y2="3" {...stroke} />
      <line x1="1" y1="14" x2="7" y2="14" {...stroke} />
      <line x1="9" y1="8" x2="15" y2="8" {...stroke} />
      <line x1="17" y1="16" x2="23" y2="16" {...stroke} />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" {...stroke} />
      <path d="M14 2v6h6" {...stroke} />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" {...stroke} />
      <circle cx="9" cy="7" r="4" {...stroke} />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" {...stroke} />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" {...stroke} />
      <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" {...stroke} />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="3" y="14" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="14" width="7" height="7" rx="1" {...stroke} />
    </>
  ),
  branch: (
    <>
      <path d="M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 21a3 3 0 100-6 3 3 0 000 6z" {...stroke} />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" {...stroke} />
    </>
  ),
  org: (
    <>
      <circle cx="12" cy="5" r="3" {...stroke} />
      <path d="M12 8v4M8 12H5a2 2 0 00-2 2v5h6v-5a2 2 0 00-2-2zM16 12h3a2 2 0 012 2v5h-6v-5a2 2 0 012-2z" {...stroke} />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="10" {...stroke} />
      <path d="M9 12l2 2 4-4" {...stroke} />
    </>
  ),
  bell: (
    <>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" {...stroke} />
    </>
  ),
  puzzle: (
    <>
      <path d="M19.439 7.85c-.15.48-.45.89-.85 1.15-.4.26-.87.41-1.35.41H16v1.2c0 .48-.15.95-.41 1.35-.26.4-.67.7-1.15.85-.48.15-.99.15-1.47 0a2.12 2.12 0 01-1.15-.85 2.12 2.12 0 01-.41-1.35V10h-1.2c-.48 0-.95-.15-1.35-.41a2.12 2.12 0 01-.85-1.15 2.12 2.12 0 010-1.47 2.12 2.12 0 01.85-1.15c.4-.26.87-.41 1.35-.41H8V4.2c0-.48.15-.95.41-1.35.26-.4.67-.7 1.15-.85.48-.15.99-.15 1.47 0 .48.15.89.45 1.15.85.26.4.41.87.41 1.35V6h1.2c.48 0 .95.15 1.35.41.4.26.7.67.85 1.15.15.48.15.99 0 1.47z" {...stroke} />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" {...stroke} />
      <path d="M7 11V7a5 5 0 0110 0v4" {...stroke} />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 2a10 10 0 100 20 2.5 2.5 0 002.5-2.5c0-.66-.26-1.3-.73-1.77A2.5 2.5 0 0012 15.5" {...stroke} />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" {...stroke} />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" {...stroke} />
    </>
  ),
  mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" {...stroke} />
      <path d="M22 6l-10 7L2 6" {...stroke} />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" {...stroke} />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" {...stroke} />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" {...stroke} />
      <line x1="16" y1="2" x2="16" y2="6" {...stroke} />
      <line x1="8" y1="2" x2="8" y2="6" {...stroke} />
      <line x1="3" y1="10" x2="21" y2="10" {...stroke} />
    </>
  ),
}

export function SetIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`set-icon${className ? ` ${className}` : ''}`}>
      {SET_ICONS[name] ?? SET_ICONS.gear}
    </svg>
  )
}

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
  title?: ReactNode
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

export function SettingsSaveFooter({ label, onClick, icon }: { label: string; onClick: () => void; icon?: string }) {
  return (
    <div className="set-save-footer">
      <button type="button" className="set-btn primary" onClick={onClick}>
        {icon ? <SetIcon name={icon} className="set-btn-icon" /> : null}
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
  icon,
}: {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'danger-text'
  onClick?: () => void
  className?: string
  icon?: string
}) {
  return (
    <button type="button" className={`set-btn ${variant} ${className ?? ''}`} onClick={onClick}>
      {icon ? <SetIcon name={icon} className="set-btn-icon" /> : null}
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
        <NovoraLogoMark className="set-email-logo-mark" />
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
        <SetIcon name="gear" className="set-sidebar-header-icon" />
        Settings
        <SetIcon name="chevron-down" className="set-sidebar-chevron" />
      </div>
      <div className="set-sidebar-search">
        <SetIcon name="search" className="set-search-icon" />
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
                <SetIcon name={item.icon} className="set-nav-icon" />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="set-sidebar-help">
        <SetIcon name="help" className="set-help-icon" />
        <div>
          <strong>Need Help?</strong>
          <p>Visit our support center for configuration guides.</p>
        </div>
      </div>
    </aside>
  )
}
