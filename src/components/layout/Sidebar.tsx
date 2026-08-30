import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import type { SidebarTab } from '@/types';
import { canAccessTab } from '@/lib/roles';
import { sidebarLabel } from '@/lib/navLabels';
import { MAIN_NAV_SECTIONS } from '@/lib/sidebarNav';
import BrandLockup from '@/components/brand/BrandLockup';
import NovoraLogo from '@/components/brand/NovoraLogo';
import SidebarTooltip from '@/components/layout/SidebarTooltip';
import { useTheme } from '@/providers/ThemeProvider';

const SIDEBAR_COLLAPSED_KEY = 'novora.sidebar.collapsed';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  roles?: string[];
}

export default function Sidebar({ activeTab, setActiveTab, roles = [] }: SidebarProps) {
  const { isDarkSidebar } = useTheme();
  const [navSearch, setNavSearch] = useState('');
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  const rail = collapsed;

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
    } catch {
      // ignore
    }
  }, [collapsed]);

  const navSections = useMemo(() => {
    const query = navSearch.trim().toLowerCase();
    return MAIN_NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!canAccessTab(roles, item.name)) return false;
        if (!query) return true;
        return sidebarLabel(item.name).toLowerCase().includes(query);
      }),
    })).filter((section) => section.items.length > 0);
  }, [roles, navSearch]);

  const handleTabClick = (tab: SidebarTab) => {
    if (!canAccessTab(roles, tab)) return;
    setActiveTab(tab);
  };

  return (
    <aside
      id="app-sidebar"
      data-collapsed={rail ? 'true' : 'false'}
      className={`nv-sidebar-shell ${rail ? 'nv-sidebar-shell--rail' : 'nv-sidebar-shell--expanded'}`}
    >
      <div className="nv-sidebar-header">
        {rail ? (
          <NovoraLogo className="h-8 w-8 shrink-0" />
        ) : (
          <BrandLockup variant={isDarkSidebar ? 'dark' : 'light'} size="md" className="min-w-0 flex-1" />
        )}
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
      </div>

      {!rail && (
        <div className="nv-sidebar-search-wrap">
          <Search className="nv-sidebar-search-icon h-3.5 w-3.5" />
          <input
            type="search"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Find module..."
            className="nv-sidebar-search-input"
            aria-label="Search modules"
          />
        </div>
      )}

      <nav id="sidebar-nav-container" className="nv-sidebar-nav flex-1 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.id} className="nv-sidebar-section">
            {section.divider && <div className="nv-sidebar-divider" aria-hidden />}
            <div className="nv-sidebar-section-items">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                const label = sidebarLabel(item.name);

                const button = (
                  <button
                    id={`nav-${item.name.replace(/\s+/g, '-').replace(/\//g, '').toLowerCase()}`}
                    type="button"
                    title={rail ? label : undefined}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => handleTabClick(item.name)}
                    className={`nv-sidebar-link ${isActive ? 'nv-sidebar-link--active' : ''} ${rail ? 'nv-sidebar-link--rail' : ''}`}
                  >
                    <span className="nv-sidebar-link-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    {!rail && <span className="nv-sidebar-link-label truncate">{label}</span>}
                  </button>
                );

                return (
                  <SidebarTooltip key={item.name} label={label} show={rail}>
                    {button}
                  </SidebarTooltip>
                );
              })}
            </div>
          </div>
        ))}

        {!rail && navSearch && navSections.every((s) => s.items.length === 0) && (
          <p className="px-3 py-4 text-[11px] text-[var(--sidebar-muted)] text-center">No modules found</p>
        )}
      </nav>

      <div className="nv-sidebar-footer">
        {rail ? (
          <SidebarTooltip label="Need help?" show>
            <button type="button" className="nv-sidebar-footer-btn" aria-label="Need help?">
              <HelpCircle className="h-4 w-4" />
            </button>
          </SidebarTooltip>
        ) : (
          <button type="button" className="nv-sidebar-help">
            <span className="nv-sidebar-help-icon">
              <HelpCircle className="h-4 w-4" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-xs font-semibold text-[var(--sidebar-text-hover)]">Need help?</span>
              <span className="block text-[10px] text-[var(--sidebar-muted)] mt-0.5">Support center</span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--sidebar-muted)] shrink-0 ml-auto" />
          </button>
        )}
      </div>
    </aside>
  );
}
