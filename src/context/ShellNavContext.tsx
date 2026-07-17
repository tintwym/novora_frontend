import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

/** Matches Downloads ReportsTab sub-tab ids. */
export type ReportsSubTab = 'centre' | 'scheduled' | 'builder'

type ShellNavContextValue = {
  reportsPanel: ReportsSubTab
  setReportsPanel: (panel: ReportsSubTab) => void
  /** Downloads SettingsTab labels, e.g. "Company profile". */
  settingsPanel: string
  setSettingsPanel: (tab: string) => void
}

const ShellNavContext = createContext<ShellNavContextValue | null>(null)

export function ShellNavProvider({ children }: { children: ReactNode }) {
  const [reportsPanel, setReportsPanel] = useState<ReportsSubTab>('centre')
  const [settingsPanel, setSettingsPanel] = useState('Company profile')

  const value = useMemo(
    () => ({ reportsPanel, setReportsPanel, settingsPanel, setSettingsPanel }),
    [reportsPanel, settingsPanel],
  )

  return <ShellNavContext.Provider value={value}>{children}</ShellNavContext.Provider>
}

export function useShellNav() {
  const ctx = useContext(ShellNavContext)
  if (!ctx) {
    throw new Error('useShellNav must be used within ShellNavProvider')
  }
  return ctx
}
