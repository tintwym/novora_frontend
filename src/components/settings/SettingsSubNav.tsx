'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { SETTINGS_NAV_SECTIONS } from '@/lib/sidebarNav'

type SettingsSubNavProps = {
  activeSubTab: string
  setActiveSubTab: (tab: string) => void
}

export default function SettingsSubNav({ activeSubTab, setActiveSubTab }: SettingsSubNavProps) {
  const [search, setSearch] = useState('')

  const sections = useMemo(
    () =>
      SETTINGS_NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      })).filter((section) => section.items.length > 0),
    [search],
  )

  return (
    <aside className="nv-settings-subnav shrink-0 w-full lg:w-56">
      <div className="nv-panel p-3 lg:sticky lg:top-0">
        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Settings
        </p>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="Search settings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 focus:border-novora focus:bg-white rounded-xl outline-none transition-colors"
          />
        </div>
        <nav className="space-y-3 max-h-[min(60vh,32rem)] overflow-y-auto pr-0.5">
          {sections.map((section) => (
            <div key={section.group}>
              <p className="px-2 mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSubTab === item.name
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setActiveSubTab(item.name)}
                      className={`nv-settings-subnav-item w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-novora/10 text-novora-deep'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-novora' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          {sections.length === 0 && (
            <p className="px-2 py-3 text-[11px] text-slate-400 text-center">No matching settings</p>
          )}
        </nav>
      </div>
    </aside>
  )
}
