import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutGrid,
  Clock,
  SlidersHorizontal,
  Search,
} from 'lucide-react';
import type { SidebarTab } from '@/types';
import { canAccessTab } from '@/lib/roles';
import { sidebarLabel } from '@/lib/navLabels';
import {
  MAIN_NAV_SECTIONS,
  REPORTS_SUB_NAV,
  SETTINGS_NAV_SECTIONS,
} from '@/lib/sidebarNav';
import BrandLockup from '@/components/brand/BrandLockup';
import NovoraLogo from '@/components/brand/NovoraLogo';
import SidebarTooltip from '@/components/layout/SidebarTooltip';
import { useTheme } from '@/providers/ThemeProvider';

const SIDEBAR_COLLAPSED_KEY = 'novora.sidebar.collapsed';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  reportsSubTab?: 'centre' | 'scheduled' | 'builder';
  setReportsSubTab?: (tab: 'centre' | 'scheduled' | 'builder') => void;
  settingsSubTab?: string;
  setSettingsSubTab?: (tab: string) => void;
  roles?: string[];
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  reportsSubTab = 'centre',
  setReportsSubTab,
  settingsSubTab = 'Company profile',
  setSettingsSubTab,
  roles = [],
}: SidebarProps) {
  const { isDarkSidebar } = useTheme();
  const [settingsSearch, setSettingsSearch] = useState('');
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  const rail = collapsed;
  const needsExpandedSubnav = activeTab === 'Reports' || activeTab === 'Settings';

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
    } catch {
      // ignore quota / private mode
    }
  }, [collapsed]);

  useEffect(() => {
    if (needsExpandedSubnav && collapsed) {
      setCollapsed(false);
    }
  }, [needsExpandedSubnav, collapsed]);

  const navSections = useMemo(
    () =>
      MAIN_NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => canAccessTab(roles, item.name)),
      })).filter((section) => section.items.length > 0),
    [roles],
  );

  const filteredSettingsSections = useMemo(
    () =>
      SETTINGS_NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.name.toLowerCase().includes(settingsSearch.toLowerCase()),
        ),
      })).filter((section) => section.items.length > 0),
    [settingsSearch],
  );

  const handleTabClick = (tab: SidebarTab) => {
    if (!canAccessTab(roles, tab)) return;
    setActiveTab(tab);
  };

  const toggleCollapsed = () => setCollapsed((v) => !v);

  const navBtnClass = (isActive: boolean) =>
    `nv-sidebar-nav-btn w-full flex items-center rounded-xl text-xs font-semibold tracking-wide cursor-pointer ${
      rail ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2'
    } ${
      isActive
        ? 'nv-sidebar-nav-btn-active'
        : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-item-hover-bg)] hover:text-[var(--sidebar-text-hover)]'
    }`;

  const subBtnClass = (isSubActive: boolean) =>
    `nv-sidebar-sub-btn w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-left cursor-pointer ${
      isSubActive
        ? 'nv-sidebar-sub-btn-active'
        : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-item-hover-bg)] hover:text-[var(--sidebar-text-hover)]'
    }`;

  const renderSubNav = (tab: SidebarTab) => {
    if (rail) return null;

    if (tab === 'Reports' && activeTab === 'Reports') {
      return (
        <div className="nv-sidebar-subnav pl-3 pr-1 mt-1 mb-1 space-y-0.5 select-none">
          {REPORTS_SUB_NAV.map((sub) => {
            const isSubActive = reportsSubTab === sub.id;
            const SubIcon =
              sub.id === 'centre' ? LayoutGrid : sub.id === 'scheduled' ? Clock : SlidersHorizontal;

            return (
              <button
                key={sub.id}
                id={`subnav-report-${sub.id}`}
                type="button"
                onClick={() => setReportsSubTab?.(sub.id)}
                className={`${subBtnClass(isSubActive)} ${sub.badge ? 'justify-between' : ''}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <SubIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{sub.label}</span>
                </span>
                {sub.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[var(--sidebar-item-hover-bg)] text-[var(--sidebar-muted)]">
                    {sub.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    if (tab === 'Settings' && activeTab === 'Settings') {
      return (
        <div className="nv-sidebar-subnav pl-2 pr-1 mt-1 mb-2 select-none">
          <div className="relative mb-2 px-1">
            <Search className="absolute left-2.5 top-2 h-3 w-3 text-[var(--sidebar-muted)]" />
            <input
              id="sidebar-settings-search-input"
              type="search"
              placeholder="Search settings..."
              value={settingsSearch}
              onChange={(e) => setSettingsSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-[10px] font-semibold text-[var(--sidebar-text-hover)] bg-[var(--sidebar-input-bg)] border border-[var(--sidebar-input-border)] focus:border-novora rounded-lg outline-none transition-colors duration-200"
            />
          </div>
          <div className="max-h-52 overflow-y-auto space-y-2.5 pr-0.5">
            {filteredSettingsSections.map((section) => (
              <div key={section.group} className="space-y-0.5">
                <div className="px-2 text-[9px] font-bold text-[var(--sidebar-muted)] uppercase tracking-wider">
                  {section.group}
                </div>
                {section.items.map((item) => {
                  const SubIcon = item.icon;
                  const isSubActive = settingsSubTab === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSettingsSubTab?.(item.name)}
                      className={subBtnClass(isSubActive)}
                    >
                      <SubIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            ))}
            {filteredSettingsSections.length === 0 && (
              <p className="px-2 py-2 text-[10px] text-[var(--sidebar-muted)] text-center">
                No matching settings
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderNavItem = (item: (typeof navSections)[0]['items'][0]) => {
    const Icon = item.icon;
    const isActive = activeTab === item.name;
    const label = sidebarLabel(item.name);
    const hasSubNav = item.name === 'Reports' || item.name === 'Settings';

    const button = (
      <button
        id={`nav-${item.name.replace(/\s+/g, '-').replace(/\//g, '').toLowerCase()}`}
        type="button"
        title={rail ? label : undefined}
        data-active={isActive ? 'true' : 'false'}
        onClick={() => handleTabClick(item.name)}
        className={navBtnClass(isActive)}
      >
        <Icon
          className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
            isActive ? 'text-[var(--sidebar-icon-active)]' : 'text-[var(--sidebar-text)]'
          }`}
        />
        {!rail && <span className="truncate">{label}</span>}
      </button>
    );

    return (
      <div key={item.name} className="flex flex-col">
        <SidebarTooltip label={label} show={rail}>
          {button}
        </SidebarTooltip>
        {hasSubNav && renderSubNav(item.name)}
      </div>
    );
  };

  return (
    <aside
      id="app-sidebar"
      data-collapsed={rail ? 'true' : 'false'}
      className={`${
        rail ? 'w-[4.5rem]' : 'w-68'
      } h-dvh sticky top-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col shrink-0 overflow-hidden`}
    >
      <div
        id="sidebar-logo-header"
        className={`h-16 border-b border-[var(--sidebar-border)] flex items-center shrink-0 ${
          rail ? 'justify-center px-2' : 'justify-between gap-2 px-3'
        }`}
      >
        {rail ? (
          <NovoraLogo className="h-8 w-8 shrink-0 transition-transform duration-300 hover:scale-105" />
        ) : (
          <BrandLockup
            variant={isDarkSidebar ? 'dark' : 'light'}
            size="md"
            className="min-w-0 animate-sidebar-brand-in"
          />
        )}
        {!rail && (
          <button
            type="button"
            id="sidebar-collapse-btn"
            onClick={toggleCollapsed}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className="nv-sidebar-icon-btn h-8 w-8 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        id="sidebar-nav-container"
        className={`flex-1 overflow-y-auto py-3 ${rail ? 'px-2 space-y-1' : 'px-3 space-y-4'}`}
      >
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1">
            {!rail && (
              <div className="px-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-muted)]">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">{section.items.map((item) => renderNavItem(item))}</div>
          </div>
        ))}
      </div>

      <div
        id="sidebar-footer-help"
        className={`border-t border-[var(--sidebar-footer-border)] shrink-0 ${rail ? 'p-2' : 'p-3'}`}
      >
        {rail ? (
          <div className="space-y-2">
            <SidebarTooltip label="Expand sidebar" show>
              <button
                type="button"
                id="sidebar-expand-btn"
                onClick={toggleCollapsed}
                aria-label="Expand sidebar"
                className="nv-sidebar-icon-btn w-full h-9"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </SidebarTooltip>
            <SidebarTooltip label="Need help?" show>
              <button
                type="button"
                aria-label="Need help?"
                className="nv-sidebar-icon-btn w-full h-9 bg-[var(--sidebar-sub-active-bg)] border-novora/25 text-[var(--sidebar-help-icon)]"
              >
                <HelpCircle className="h-4.5 w-4.5" />
              </button>
            </SidebarTooltip>
          </div>
        ) : (
          <button
            type="button"
            className="nv-sidebar-help-card w-full text-left p-3.5 rounded-xl flex gap-3 relative overflow-hidden group border border-[var(--sidebar-border)] cursor-pointer"
          >
            <HelpCircle className="h-5 w-5 text-[var(--sidebar-help-icon)] shrink-0 mt-0.5 transition-transform duration-300 group-hover:rotate-6" />
            <div>
              <div className="text-xs font-bold text-[var(--sidebar-text-hover)] leading-tight">
                Need help?
              </div>
              <div className="text-[10.5px] font-medium text-[var(--sidebar-text)] mt-1 leading-snug">
                Visit our support center
              </div>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}
