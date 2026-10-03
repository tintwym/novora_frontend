import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, HelpCircle, PanelLeftClose, PanelLeftOpen, Search, Settings } from 'lucide-react';
import type { SidebarTab } from '@/types';
import { canAccessTab } from '@/lib/roles';
import { MAIN_NAV_SECTIONS, SETTINGS_NAV_SECTIONS } from '@/lib/sidebarNav';
import BrandLockup from '@/components/brand/BrandLockup';
import NovoraLogo from '@/components/brand/NovoraLogo';
import SidebarTooltip from '@/components/layout/SidebarTooltip';
import { useTheme } from '@/providers/ThemeProvider';

const SIDEBAR_COLLAPSED_KEY = 'novora.sidebar.collapsed';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  roles?: string[];
  settingsSubTab?: string;
  setSettingsSubTab?: (tab: string) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  roles = [],
  settingsSubTab = 'Company profile',
  setSettingsSubTab,
}: SidebarProps) {
  const { isDarkSidebar } = useTheme();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false);
  const [settingsSearch, setSettingsSearch] = useState('');
  const [narrow, setNarrow] = useState(false);
  const moduleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const rail = collapsed || narrow;
  const settingsMode = activeTab === 'Settings' && !rail;

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
    } catch {
      // ignore
    }
  }, [collapsed]);

  useEffect(() => {
    if (!moduleMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!moduleMenuRef.current?.contains(e.target as Node)) setModuleMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModuleMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [moduleMenuOpen]);

  const navItems = useMemo(
    () => MAIN_NAV_SECTIONS.flatMap((s) => s.items).filter((item) => canAccessTab(roles, item.name)),
    [roles],
  );

  const settingsSections = useMemo(() => {
    const query = settingsSearch.trim().toLowerCase();
    return SETTINGS_NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => !query || item.name.toLowerCase().includes(query)),
    })).filter((section) => section.items.length > 0);
  }, [settingsSearch]);

  const handleTabClick = (tab: SidebarTab) => {
    if (!canAccessTab(roles, tab)) return;
    setModuleMenuOpen(false);
    setActiveTab(tab);
  };

  const collapseToggle = narrow ? null : (
    <button
      type="button"
      id={rail ? 'sidebar-expand-btn' : 'sidebar-collapse-btn'}
      onClick={() => setCollapsed((v) => !v)}
      title={rail ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'}
      className="nv-sidebar-toggle"
    >
      {rail ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
    </button>
  );

  return (
    <aside
      id="app-sidebar"
      data-collapsed={rail ? 'true' : 'false'}
      className={`nv-sidebar-shell ${rail ? 'nv-sidebar-shell--rail' : 'nv-sidebar-shell--expanded'}`}
    >
      {settingsMode ? (
        <div id="settings-sidebar-header" className="p-4 border-b border-[var(--sidebar-border)] shrink-0">
          <div className="flex items-center gap-2">
            <div ref={moduleMenuRef} className="relative flex-1 min-w-0">
              <button
                id="btn-settings-mode-selector"
                type="button"
                aria-haspopup="menu"
                aria-expanded={moduleMenuOpen}
                onClick={() => setModuleMenuOpen((open) => !open)}
                className="nv-sidebar-mode-btn"
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="h-4.5 w-4.5" />
                  <span>Settings</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${moduleMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {moduleMenuOpen && (
                <div
                  id="settings-sidebar-dropdown-menu"
                  role="menu"
                  className="absolute left-0 right-0 mt-2 bg-[var(--sidebar-dropdown-bg)] border border-[var(--sidebar-border)] rounded-xl shadow-xl py-2 max-h-[360px] overflow-y-auto z-50"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--sidebar-muted)] uppercase tracking-widest border-b border-[var(--sidebar-border)]">
                    Switch Module
                  </div>
                  {navItems
                    .filter((item) => item.name !== 'Settings')
                    .map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          role="menuitem"
                          onClick={() => handleTabClick(item.name)}
                          className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-[var(--sidebar-item-hover-bg)] text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-hover)] transition-colors text-left cursor-pointer"
                        >
                          <ItemIcon className="h-4 w-4 text-[var(--sidebar-muted)] shrink-0" />
                          <span className="text-[11.5px] font-bold">{item.name}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
            {collapseToggle}
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--sidebar-muted)]" />
            <input
              id="sidebar-settings-search-input"
              type="search"
              placeholder="Search settings..."
              value={settingsSearch}
              onChange={(e) => setSettingsSearch(e.target.value)}
              aria-label="Search settings"
              className="nv-sidebar-search-input"
            />
          </div>
        </div>
      ) : (
        <div id="sidebar-logo-header" className="nv-sidebar-header">
          {rail ? (
            <NovoraLogo className="h-8 w-8 shrink-0" />
          ) : (
            <BrandLockup variant={isDarkSidebar ? 'dark' : 'light'} size="md" className="min-w-0 flex-1" />
          )}
          {collapseToggle}
        </div>
      )}

      {settingsMode ? (
        <nav id="settings-sidebar-scroll-container" className="flex-1 overflow-y-auto px-4 py-4 space-y-5 select-none">
          {settingsSections.map((section) => (
            <div key={section.group} className="space-y-1.5">
              <div className="nv-sidebar-group-label">{section.group}</div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const SubIcon = item.icon;
                  const isSubActive = settingsSubTab === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      aria-current={isSubActive ? 'page' : undefined}
                      onClick={() => setSettingsSubTab?.(item.name)}
                      className={`nv-sidebar-sublink ${isSubActive ? 'nv-sidebar-sublink--active' : ''}`}
                    >
                      <SubIcon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {settingsSections.length === 0 && (
            <p className="text-center py-4 text-[11px] text-[var(--sidebar-muted)] font-medium">
              No matching settings found
            </p>
          )}
        </nav>
      ) : (
        <nav id="sidebar-nav-container" className="nv-sidebar-nav flex-1 overflow-y-auto">
          <div className="nv-sidebar-section-items">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <SidebarTooltip key={item.name} label={item.name} show={rail}>
                  <button
                    id={`nav-${item.name.replace(/\s+/g, '-').replace(/\//g, '').toLowerCase()}`}
                    type="button"
                    title={rail ? item.name : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleTabClick(item.name)}
                    className={`nv-sidebar-link ${isActive ? 'nv-sidebar-link--active' : ''} ${rail ? 'nv-sidebar-link--rail' : ''}`}
                  >
                    <span className="nv-sidebar-link-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    {!rail && <span className="truncate">{item.name}</span>}
                  </button>
                </SidebarTooltip>
              );
            })}
          </div>
        </nav>
      )}

      <div id="sidebar-footer-help" className="nv-sidebar-footer">
        {rail ? (
          <SidebarTooltip label="Need help?" show>
            <button type="button" className="nv-sidebar-footer-btn" aria-label="Need help?">
              <HelpCircle className="h-4 w-4" />
            </button>
          </SidebarTooltip>
        ) : (
          <button type="button" className="nv-sidebar-help">
            <span className="nv-sidebar-help-icon">
              <HelpCircle className="h-5 w-5" />
            </span>
            <span className="relative min-w-0 text-left">
              <span className="block text-xs font-bold text-[var(--sidebar-text-hover)] leading-tight">Need Help?</span>
              <span className="block text-[10.5px] font-medium text-[var(--sidebar-muted)] mt-1 leading-snug">
                Visit our support center
              </span>
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
