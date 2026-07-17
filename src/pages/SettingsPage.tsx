import { useEffect, useMemo, useRef } from 'react'
import { useAuth } from '../auth/AuthContext'
import { SettingsTab } from '../components/settings/SettingsTab'
import { useShellNav } from '../context/ShellNavContext'
import { mockModuleEmployees } from '../data/mockModuleEmployees'
import { defaultSettingsPanel, settingsSectionsFor } from '../data/mockSettings'

export function SettingsPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  const { user, booting } = useAuth()
  const isHrAdmin = Boolean(user?.canAccessHrAdmin)
  const { settingsPanel, setSettingsPanel } = useShellNav()
  const lastUserKey = useRef<string | null>(null)

  const allowedLabels = useMemo(
    () => new Set(settingsSectionsFor(isHrAdmin).flatMap((s) => s.items.map((i) => i.label))),
    [isHrAdmin],
  )

  useEffect(() => {
    if (booting) return
    const userKey = user?.id ?? 'guest'
    if (lastUserKey.current !== userKey) {
      lastUserKey.current = userKey
      setSettingsPanel(defaultSettingsPanel(isHrAdmin))
    }
  }, [booting, user?.id, isHrAdmin, setSettingsPanel])

  useEffect(() => {
    if (!allowedLabels.has(settingsPanel)) {
      setSettingsPanel(defaultSettingsPanel(isHrAdmin))
    }
  }, [allowedLabels, isHrAdmin, settingsPanel, setSettingsPanel])

  return (
    <SettingsTab
      activeSubTab={settingsPanel}
      setActiveSubTab={setSettingsPanel}
      employees={employees}
    />
  )
}
