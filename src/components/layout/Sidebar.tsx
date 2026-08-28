import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserPlus,
  CalendarCheck2,
  FileMinus,
  ShieldAlert,
  CreditCard,
  Receipt,
  HeartHandshake,
  TrendingDown,
  Smile,
  GraduationCap,
  BookOpen,
  Package,
  FileBarChart,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LifeBuoy,
  LayoutGrid,
  Clock,
  SlidersHorizontal,
  Building2,
  Blocks,
  MapPin,
  GitBranch,
  ShieldCheck,
  CheckSquare,
  Bell,
  Puzzle,
  Shield,
  FileText,
  Contrast,
  Globe,
  Mail,
  Database,
  Search,
} from 'lucide-react';
import type { SidebarTab } from '@/types';
import { canAccessTab, canManageFullSystem } from '@/lib/roles';
import { sidebarLabel } from '@/lib/navLabels';
import BrandLockup from '@/components/brand/BrandLockup';
import NovoraLogo from '@/components/brand/NovoraLogo';

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
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const [settingsSearch, setSettingsSearch] = useState('');
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });
  const isFullSystem = canManageFullSystem(roles);
  const settingsMode = activeTab === 'Settings' && isFullSystem;
  // Settings nested nav needs labels — keep expanded while in Settings.
  const rail = collapsed && !settingsMode;

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
    } catch {
      // ignore quota / private mode
    }
  }, [collapsed]);

  const mainNavItems = (
    [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'Employees Management', icon: Users },
      { name: 'Recruitment Management', icon: Briefcase },
      { name: 'On/Off-boarding Management', icon: UserPlus },
      { name: 'Attendance Management', icon: CalendarCheck2 },
      { name: 'Leave Management', icon: FileMinus },
      { name: 'Disciplinary Management', icon: ShieldAlert },
      { name: 'Payroll Management', icon: CreditCard },
      { name: 'Claims Management', icon: Receipt },
      { name: 'Benefits Management', icon: HeartHandshake },
      { name: 'Helpdesk & Inquiries Management', icon: LifeBuoy },
      { name: 'Performance Management', icon: TrendingDown },
      { name: 'Engagement Management', icon: Smile },
      { name: 'Training Management', icon: GraduationCap },
      { name: 'Learning Management', icon: BookOpen },
      { name: 'Assets Management', icon: Package },
      { name: 'Reports', icon: FileBarChart },
      { name: 'Settings', icon: Settings },
    ] as const
  ).filter((item) => canAccessTab(roles, item.name));

  const handleTabClick = (tab: SidebarTab) => {
    if (!canAccessTab(roles, tab)) return;
    setActiveTab(tab);
    setMainMenuOpen(false);
  };

  const toggleCollapsed = () => setCollapsed((v) => !v);

  const settingsNavSections = [
    {
      group: 'ORGANISATION',
      items: [
        { name: 'Company profile', icon: Building2 },
        { name: 'Modules', icon: Blocks },
        { name: 'Branch & location', icon: MapPin },
        { name: 'Department & position', icon: GitBranch },
      ],
    },
    {
      group: 'ACCESS CONTROL',
      items: [
        { name: 'Users & accounts', icon: Users },
        { name: 'Roles & permissions', icon: ShieldCheck },
        { name: 'Approval workflow', icon: CheckSquare },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { name: 'Notifications', icon: Bell },
        { name: 'Integrations', icon: Puzzle },
        { name: 'Security', icon: Shield },
        { name: 'Audit log', icon: FileText },
      ],
    },
    {
      group: 'PREFERENCES',
      items: [
        { name: 'Appearance', icon: Contrast },
        { name: 'Language', icon: Globe },
        { name: 'Email templates', icon: Mail },
        { name: 'Backup & data', icon: Database },
      ],
    },
  ];

  const filteredSettingsSections = settingsNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(settingsSearch.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  const handleSettingsSubTabClick = (subTabName: string) => {
    setSettingsSubTab?.(subTabName);
  };

  const navBtnClass = (isActive: boolean) =>
    `w-full flex items-center rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
      rail ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2'
    } ${
      isActive
        ? 'bg-novora text-white shadow-sm shadow-novora/30'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`;

  return (
    <aside
      id="app-sidebar"
      data-collapsed={rail ? 'true' : 'false'}
      className={`${
        rail ? 'w-[4.5rem]' : 'w-68'
      } h-dvh sticky top-0 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0 overflow-hidden transition-[width] duration-200 ease-out`}
    >
      {settingsMode ? (
        <React.Fragment>
          <div id="settings-sidebar-header" className="p-4 border-b border-slate-800/80">
            <div className="relative">
              <button
                id="btn-settings-mode-selector"
                type="button"
                onClick={() => setMainMenuOpen(!mainMenuOpen)}
                className="w-full bg-novora text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between shadow-sm hover:bg-novora-deep transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="h-4.5 w-4.5 text-white" />
                  <span className="tracking-wide">Settings</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${mainMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {mainMenuOpen && (
                <div id="settings-sidebar-dropdown-menu" className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 max-h-90 overflow-y-auto z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    Switch Module
                  </div>
                  {mainNavItems
                    .filter((item) => item.name !== 'Settings')
                    .map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleTabClick(item.name)}
                          className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-white/5 text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                        >
                          <ItemIcon className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-[11.5px] font-bold">{sidebarLabel(item.name)}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="relative mt-3">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="sidebar-settings-search-input"
                type="text"
                placeholder="Search settings..."
                value={settingsSearch}
                onChange={(e) => setSettingsSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[11px] font-bold text-slate-200 bg-slate-900/80 border border-slate-700 focus:border-novora focus:bg-slate-900 rounded-xl outline-none"
              />
            </div>
          </div>

          <div id="settings-sidebar-scroll-container" className="flex-1 overflow-y-auto px-4 py-4 space-y-5 select-none">
            {filteredSettingsSections.map((section) => (
              <div key={section.group} className="space-y-1.5">
                <div className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  {section.group}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const SubIcon = item.icon;
                    const isSubActive = settingsSubTab === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleSettingsSubTabClick(item.name)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-novora/15 text-sky-200 border-l-2 border-novora'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                        }`}
                      >
                        <SubIcon className={`h-4 w-4 ${isSubActive ? 'text-sky-300' : 'text-slate-500'}`} />
                        <span className="truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredSettingsSections.length === 0 && (
              <div className="text-center py-4 text-[11px] text-slate-400 font-medium">
                No matching settings found
              </div>
            )}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div
            id="sidebar-logo-header"
            className={`h-16 border-b border-slate-800/80 flex items-center ${
              rail ? 'justify-center px-2' : 'justify-between gap-2 px-3'
            }`}
          >
            {rail ? (
              <NovoraLogo className="h-8 w-8 shrink-0" />
            ) : (
              <BrandLockup variant="dark" size="md" className="min-w-0" />
            )}
            {!rail && (
              <button
                type="button"
                id="sidebar-collapse-btn"
                onClick={toggleCollapsed}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
                className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:bg-white/5 hover:text-slate-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            id="sidebar-nav-container"
            className={`flex-1 overflow-y-auto py-3 space-y-0.5 ${rail ? 'px-2' : 'px-3'}`}
          >
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              const label = sidebarLabel(item.name);

              if (item.name === 'Reports') {
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      id="nav-reports"
                      type="button"
                      title={label}
                      onClick={() => handleTabClick('Reports')}
                      className={navBtnClass(isActive)}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!rail && <span className="truncate">{label}</span>}
                    </button>

                    {isActive && !rail && (
                      <div className="pl-5 pr-1 mt-1 mb-1 space-y-0.5 select-none animate-soft-fade-up">
                        <button
                          id="subnav-report-centre"
                          type="button"
                          onClick={() => setReportsSubTab?.('centre')}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left cursor-pointer ${
                            reportsSubTab === 'centre'
                              ? 'bg-novora/15 text-sky-200 border border-novora/20'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                            <span>Report centre</span>
                          </div>
                        </button>

                        <button
                          id="subnav-scheduled-reports"
                          type="button"
                          onClick={() => setReportsSubTab?.('scheduled')}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left cursor-pointer ${
                            reportsSubTab === 'scheduled'
                              ? 'bg-novora/15 text-sky-200 border border-novora/20'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span>Scheduled reports</span>
                          </div>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                              reportsSubTab === 'scheduled'
                                ? 'bg-novora/20 text-sky-200'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            3
                          </span>
                        </button>

                        <button
                          id="subnav-custom-builder"
                          type="button"
                          onClick={() => setReportsSubTab?.('builder')}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left cursor-pointer ${
                            reportsSubTab === 'builder'
                              ? 'bg-novora/15 text-sky-200 border border-novora/20'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                            <span>Custom builder</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  id={`nav-${item.name.replace(/\s+/g, '-').replace(/\//g, '').toLowerCase()}`}
                  key={item.name}
                  type="button"
                  title={label}
                  onClick={() => handleTabClick(item.name as SidebarTab)}
                  className={navBtnClass(isActive)}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!rail && <span className="truncate">{label}</span>}
                </button>
              );
            })}
          </div>
        </React.Fragment>
      )}

      <div id="sidebar-footer-help" className={`border-t border-slate-800/80 ${rail ? 'p-2' : 'p-3'} space-y-2`}>
        {rail ? (
          <>
            <button
              type="button"
              id="sidebar-expand-btn"
              onClick={toggleCollapsed}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="w-full h-9 inline-flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:bg-white/5 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Need help?"
              aria-label="Need help?"
              className="w-full h-9 inline-flex items-center justify-center rounded-xl bg-novora/15 hover:bg-novora/25 border border-novora/25 text-sky-200 transition-all cursor-pointer"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
          </>
        ) : (
          <button
              type="button"
              className="w-full text-left bg-slate-900/60 hover:bg-slate-900 transition-all p-3.5 rounded-xl flex gap-3 relative overflow-hidden group border border-slate-800 cursor-pointer"
            >
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-novora/10 rounded-full group-hover:scale-110 transition-transform" />
              <HelpCircle className="h-5 w-5 text-sky-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-100 leading-tight">Need help?</div>
                <div className="text-[10.5px] font-medium text-slate-400 mt-1 leading-snug">
                  Visit our support center
                </div>
              </div>
            </button>
        )}
      </div>
    </aside>
  );
}
