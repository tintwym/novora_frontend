import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Building, ClipboardCheck } from 'lucide-react';
import type { AuthSession } from '@/types';

interface TopbarProps {
  activeTabName: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void;
  session?: AuthSession | null;
  onLogout?: () => void | Promise<void>;
}

export default function Topbar({
  activeTabName,
  onSearchChange,
  searchValue = '',
  addToast,
  session,
  onLogout,
}: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const displayName = session?.fullName || 'pinky';
  const displayEmail = session?.email || 'pinky.sharma@novora.com';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'P';

  const notifications = [
    { id: 1, title: 'Leave Approval', msg: 'Sarah Lim applied for 3 days annual leave', time: '10 min ago' },
    { id: 2, title: 'Onboarding Update', msg: 'System prepared accounts for new developer', time: '1 hour ago' },
    { id: 3, title: 'Claim Pending', msg: 'Travel claim uploaded by Raj Kumar', time: '3 hours ago' },
    { id: 4, title: 'Performance Review', msg: 'Daily feedback logs summarized', time: '1 day ago' },
    { id: 5, title: 'System Alert', msg: 'Automatic backup completed successfully', time: '1 day ago' },
  ];

  const handleNotificationClick = (title: string) => {
    addToast(`Opened notification: "${title}"`, 'info');
    setNotificationsOpen(false);
  };

  return (
    <header id="app-topbar" className="h-16 border-b border-slate-100 bg-white px-8 flex items-center justify-between shrink-0 relative z-40">
      <div className="flex items-center gap-2">
        <h1 id="topbar-section-title" className="text-[19px] font-bold text-slate-900 tracking-tight">
          {activeTabName === 'Employees Management' ? 'Employees Management' : activeTabName}
        </h1>
      </div>

      <div className="flex items-center gap-4.5">
        <div id="topbar-search-container" className="relative w-64 md:w-80">
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            id="topbar-search-input"
            type="text"
            placeholder="Search employees, modules..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-100 focus:border-slate-200 focus:bg-white focus:outline-none placeholder-slate-400 py-1.5 pl-10 pr-4 rounded-xl transition-all"
          />
        </div>

        <div id="topbar-notification-bell" className="relative">
          <button
            id="topbar-notification-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors relative"
          >
            <Bell className="h-4.5 w-4.5 text-slate-600" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border border-white">
              {notifications.length}
            </span>
          </button>

          {notificationsOpen && (
            <div id="topbar-notifications-dropdown" className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
                <span className="text-[11px] text-blue-600 font-semibold cursor-pointer" onClick={() => addToast('Cleared all alerts', 'success')}>Mark all as read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.title)}
                    className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50/50 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400 italic">{n.time}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed truncate">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="topbar-user-profile" className="relative">
          <button
            id="topbar-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50 cursor-pointer"
          >
            <div className="h-7 w-7 bg-[#2f66e0]/10 border border-[#2f66e0]/20 rounded-lg flex items-center justify-center text-sm font-bold text-[#2f66e0]">
              {initial}
            </div>
            <span className="text-xs font-bold text-slate-700 tracking-tight max-w-28 truncate">
              {displayName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1 shrink-0" />
          </button>

          {profileOpen && (
            <div id="topbar-profile-dropdown" className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50">
              <div className="px-4 py-2 border-b border-slate-50">
                <div className="font-bold text-xs text-slate-800 truncate">{displayName}</div>
                <div className="text-[10px] font-medium text-slate-400 truncate">{displayEmail}</div>
                {session?.companyName && (
                  <div className="text-[10px] font-semibold text-[#2f66e0] mt-0.5 truncate">
                    {session.companyName}
                  </div>
                )}
              </div>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                onClick={() => { setProfileOpen(false); addToast('Opened Profile Dashboard', 'info'); }}
              >
                <User className="h-4 w-4 text-slate-500" />
                My Profile
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                onClick={() => { setProfileOpen(false); addToast('Signed in as HR Administrator', 'info'); }}
              >
                <Building className="h-4 w-4 text-slate-500" />
                Company Profile
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                onClick={() => { setProfileOpen(false); addToast('Security Audit Log Loaded', 'info'); }}
              >
                <ClipboardCheck className="h-4 w-4 text-slate-500" />
                Security Logs
              </button>
              <div className="border-t border-slate-50 my-1"></div>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout?.();
                  addToast('Signed out successfully', 'success');
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
