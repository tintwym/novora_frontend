import React, { useState } from 'react';
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
  const isFullSystem = canManageFullSystem(roles);

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

  // Settings groupings matching Screenshot 15
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

  // Filter settings list based on search term
  const filteredSettingsSections = settingsNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(settingsSearch.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  // Switch Settings category sub-selection
  const handleSettingsSubTabClick = (subTabName: string) => {
    setSettingsSubTab?.(subTabName);
  };

  return (
    <aside id="app-sidebar" className="w-68 min-h-screen bg-white border-r border-slate-100 flex flex-col shrink-0">
      
      {/* ----------------- RENDER IF ACTIVE PORTAL TAB IS 'Settings' (Admin/HR only) ----------------- */}
      {activeTab === 'Settings' && isFullSystem ? (
        <React.Fragment>
          {/* Blue Settings mode header with dropdown selector */}
          <div id="settings-sidebar-header" className="p-4 border-b border-[#f8fafc]">
            <div className="relative">
              <button
                id="btn-settings-mode-selector"
                onClick={() => setMainMenuOpen(!mainMenuOpen)}
                className="w-full bg-[#2f66e0] text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between shadow-xs hover:bg-[#2557cb] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="h-4.5 w-4.5 text-white" />
                  <span className="tracking-wide">Settings</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${mainMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {mainMenuOpen && (
                <div id="settings-sidebar-dropdown-menu" className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl py-2 max-h-90 overflow-y-auto z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Switch Module
                  </div>
                  {mainNavItems
                    .filter((item) => item.name !== 'Settings')
                    .map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleTabClick(item.name)}
                          className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50 text-slate-650 hover:text-slate-900 transition-colors text-left cursor-pointer"
                        >
                          <ItemIcon className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-[11.5px] font-bold">{sidebarLabel(item.name)}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Quick search settings */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="sidebar-settings-search-input"
                type="text"
                placeholder="Search settings..."
                value={settingsSearch}
                onChange={(e) => setSettingsSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[11px] font-bold text-slate-700 bg-slate-50/75 border border-slate-150 focus:border-[#2f66e0] focus:bg-white rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Settings Lists Scroll Container */}
          <div id="settings-sidebar-scroll-container" className="flex-1 overflow-y-auto px-4 py-4 space-y-5 select-none">
            {filteredSettingsSections.map((section) => (
              <div key={section.group} className="space-y-1.5">
                <div className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {section.group}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const SubIcon = item.icon;
                    const isSubActive = settingsSubTab === item.name;

                    return (
                      <button
                        key={item.name}
                        onClick={() => handleSettingsSubTabClick(item.name)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-blue-50 text-[#2f66e0] border-l-2 border-[#2f66e0]/80'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <SubIcon className={`h-4 w-4 ${isSubActive ? 'text-[#2f66e0]' : 'text-slate-500'}`} />
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
        /* ----------------- RENDER NORMAL MULTI-MODULE MENU ----------------- */
        <React.Fragment>
          {/* Brand Logo Header */}
          <div id="sidebar-logo-header" className="h-16 px-5 border-b border-slate-100 flex items-center">
            <BrandLockup size="md" />
          </div>

          {/* Navigation Links */}
          <div id="sidebar-nav-container" className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              if (item.name === 'Reports') {
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      id={`nav-reports`}
                      onClick={() => handleTabClick('Reports')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2f66e0] text-white shadow-sm shadow-[#2f66e0]/25'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sidebarLabel(item.name)}</span>
                    </button>

                    {isActive && (
                      <div className="pl-5 pr-1 mt-1 mb-1 space-y-0.5 select-none animate-soft-fade-up">
                        <button
                          id="subnav-report-centre"
                          onClick={() => setReportsSubTab?.('centre')}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left cursor-pointer ${
                            reportsSubTab === 'centre'
                              ? 'bg-[#2f66e0]/8 text-[#2f66e0] border border-[#2f66e0]/10'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                            <span>Report centre</span>
                          </div>
                        </button>

                        <button
                          id="subnav-scheduled-reports"
                          onClick={() => setReportsSubTab?.('scheduled')}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left cursor-pointer ${
                            reportsSubTab === 'scheduled'
                              ? 'bg-[#2f66e0]/8 text-[#2f66e0] border border-[#2f66e0]/10'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span>Scheduled reports</span>
                          </div>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            reportsSubTab === 'scheduled'
                              ? 'bg-[#2f66e0]/15 text-[#2f66e0]'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            3
                          </span>
                        </button>

                        <button
                          id="subnav-custom-builder"
                          onClick={() => setReportsSubTab?.('builder')}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left cursor-pointer ${
                            reportsSubTab === 'builder'
                              ? 'bg-[#2f66e0]/8 text-[#2f66e0] border border-[#2f66e0]/10'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
                  onClick={() => handleTabClick(item.name as SidebarTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2f66e0] text-white shadow-sm shadow-[#2f66e0]/25'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{sidebarLabel(item.name)}</span>
                </button>
              );
            })}
          </div>
        </React.Fragment>
      )}

      {/* Footer Support Card */}
      <div id="sidebar-footer-help" className="p-3 border-t border-slate-100">
        <button
          type="button"
          className="w-full text-left bg-[#f0f5ff] hover:bg-[#e4eeff] transition-all p-3.5 rounded-xl flex gap-3 relative overflow-hidden group border border-[#dce7ff] cursor-pointer"
        >
          <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-blue-400/10 rounded-full group-hover:scale-110 transition-transform" />
          <HelpCircle className="h-5 w-5 text-[#2f66e0] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Need help?</div>
            <div className="text-[10.5px] font-medium text-slate-500 mt-1 leading-snug">
              Visit our support center
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
