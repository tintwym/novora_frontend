import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { allPanelIds, defaultSettingsPanel, settingsSectionsFor } from '../data/mockSettings'
import type { SettingsPanelId } from '../types/settings'
import { SettingsProvider } from '../components/settings/SettingsContext'
import { SettingsPanelRouter } from '../components/settings/SettingsPanels'
import { SettingsSidebar } from '../components/settings/SettingsShared'
import '../styles/settings.css'

function SettingsPageInner() {
  const { user, booting } = useAuth()
  const isHrAdmin = Boolean(user?.canAccessHrAdmin)
  const baseSections = useMemo(() => settingsSectionsFor(isHrAdmin), [isHrAdmin])
  const panelIds = useMemo(() => allPanelIds(baseSections), [baseSections])
  const [selectedId, setSelectedId] = useState<SettingsPanelId>('appearance')
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const lastUserKey = useRef<string | null>(null)

  useEffect(() => {
    if (booting) return
    const userKey = user?.id ?? 'guest'
    if (lastUserKey.current !== userKey) {
      lastUserKey.current = userKey
      setSelectedId(defaultSettingsPanel(isHrAdmin))
    }
  }, [booting, user?.id, isHrAdmin])

  useEffect(() => {
    const allowed = new Set(panelIds)
    if (!allowed.has(selectedId)) {
      setSelectedId(defaultSettingsPanel(isHrAdmin))
    }
  }, [panelIds, isHrAdmin, selectedId])

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return baseSections
    return baseSections
      .map((s) => ({ ...s, items: s.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((s) => s.items.length > 0)
  }, [baseSections, search])

  useEffect(() => {
    const visible = filteredSections.flatMap((s) => s.items.map((i) => i.id))
    if (visible.length > 0 && !visible.includes(selectedId)) {
      setSelectedId(visible[0])
    }
  }, [filteredSections, selectedId])

  function selectPanel(id: SettingsPanelId) {
    setSelectedId(id)
    setDrawerOpen(false)
  }

  return (
    <div className="set-module">
      <button type="button" className="set-sections-toggle" onClick={() => setDrawerOpen(true)}>
        Sections
      </button>
      {drawerOpen ? <button type="button" className="set-drawer-backdrop" aria-label="Close sections" onClick={() => setDrawerOpen(false)} /> : null}
      <div className={`set-layout ${drawerOpen ? 'drawer-open' : ''}`}>
        <SettingsSidebar sections={filteredSections} selectedId={selectedId} onSelect={selectPanel} search={search} onSearchChange={setSearch} />
        <div className="set-content">
          {panelIds.map((id) => (
            <div key={id} className="set-panel-slot" hidden={selectedId !== id}>
              <SettingsPanelRouter panelId={id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SettingsPage() {
  return (
    <SettingsProvider>
      <SettingsPageInner />
    </SettingsProvider>
  )
}
