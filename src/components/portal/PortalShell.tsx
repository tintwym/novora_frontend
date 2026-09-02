'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import {
  AddEmployeeModal,
  EmployeeDirectoryTab,
  EmployeeProfileTab,
  EmployeeReportsTab,
  OrgChartTab,
} from '@/features/employees'
import { DashboardTab } from '@/features/dashboard'
import { AttendanceTab } from '@/features/attendance'
import { LeaveTab } from '@/features/leave'
import { PayrollTab } from '@/features/payroll'
import { ClaimsTab } from '@/features/claims'
import { BenefitsTab } from '@/features/benefits'
import { HelpdeskTab } from '@/features/helpdesk'
import { PerformanceTab } from '@/features/performance'
import { EngagementTab } from '@/features/engagement'
import { TrainingTab } from '@/features/training'
import { LearningTab } from '@/features/learning'
import { AssetsTab } from '@/features/assets'
import { DisciplinaryTab } from '@/features/disciplinary'
import { OnOffBoardingTab } from '@/features/onboarding'
import { RecruitmentTab } from '@/features/recruitment'
import { ReportsTab } from '@/features/reports'
import { SettingsTab } from '@/features/settings'
import { useAuth } from '@/providers/AuthProvider'
import type { SidebarTab, SubTab, Employee } from '@/types'
import {
  canAccessPortal,
  canAccessTab,
  canManageFullSystem,
  defaultTabFor,
  parsePortalId,
  portalHomePath,
  portalPath,
  slugToTab,
} from '@/lib/roles'
import { BookOpen, ChevronDown, Download, FileSpreadsheet, FileText } from 'lucide-react'

export default function PortalShell() {
  const params = useParams<{ portal: string; module?: string }>()
  const portalParam = params.portal
  const moduleParam = params.module
  const router = useRouter()
  const {
    authReady,
    session,
    employees,
    setEmployees,
    selectedEmployee,
    setSelectedEmployee,
    addToast,
    handleLogout,
  } = useAuth()

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Employee Profile')
  const [reportsSubTab, setReportsSubTab] = useState<'centre' | 'scheduled' | 'builder'>('centre')
  const [settingsSubTab, setSettingsSubTab] = useState<string>('Company profile')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const [deptFilterState, setDeptFilterState] = useState<string>('All departments')
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false)

  const portal = parsePortalId(portalParam)
  const tabFromSlug = slugToTab(moduleParam ?? 'dashboard')
  const requestedTab = tabFromSlug ?? (session ? defaultTabFor(session.roles) : 'Dashboard')
  const activeTab: SidebarTab =
    session && canAccessTab(session.roles, requestedTab)
      ? requestedTab
      : session
        ? defaultTabFor(session.roles)
        : 'Dashboard'

  useEffect(() => {
    if (!authReady) return
    if (!session) {
      router.replace('/login')
      return
    }
    if (!portal || !canAccessPortal(session.roles, portal)) {
      router.replace(portalHomePath(session.roles))
      return
    }
    if (!moduleParam || !tabFromSlug || activeTab !== requestedTab) {
      router.replace(portalPath(portal, activeTab))
    }
  }, [
    authReady,
    session,
    portal,
    moduleParam,
    tabFromSlug,
    activeTab,
    requestedTab,
    router,
  ])

  if (!authReady || !session || !portal || !canAccessPortal(session.roles, portal)) {
    return null
  }

  if (!moduleParam || !tabFromSlug || activeTab !== requestedTab) {
    return null
  }

  const goToTab = (tab: SidebarTab) => {
    if (!canAccessTab(session.roles, tab)) {
      addToast('That module is limited to Admin and HR roles.', 'info')
      return
    }
    router.push(portalPath(portal, tab))
  }

  const handleAddEmployee = (newEmp: Employee) => {
    if (!canManageFullSystem(session.roles)) {
      addToast('Only Admin or HR can add employees.', 'error')
      return
    }
    setEmployees((prev) => [newEmp, ...prev])
    setSelectedEmployee(newEmp)
    setActiveSubTab('Employee Profile')
    router.push(portalPath(portal, 'Employees Management'))
  }

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp)
    setActiveSubTab('Employee Profile')
    addToast(`Switched active profile view to ${emp.name}`, 'info')
  }

  const triggerExport = (format: 'Excel' | 'CSV' | 'PDF') => {
    setExportDropdownOpen(false)
    addToast(`Compiling and sanitizing employee dataset for ${format}...`, 'loading')
    setTimeout(() => {
      addToast(
        `Dataset successfully downloaded as Novora_Employees.${format === 'Excel' ? 'xlsx' : format.toLowerCase()}`,
        'success',
      )
    }, 1800)
  }

  const handleSubTabChange = (tab: SubTab) => setActiveSubTab(tab)

  const filteredByDepartmentDropdown = (dept: string) => {
    setDeptFilterState(dept)
    setDeptDropdownOpen(false)
    if (dept === 'All departments') {
      addToast('Showing employees across all departments', 'info')
    } else {
      addToast(`Filtered layout to show only ${dept}`, 'info')
    }
  }

  return (
    <div
      id="novora-hrms-root"
      className="flex h-dvh min-h-0 select-none font-sans overflow-hidden"
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={goToTab}
        roles={session.roles}
      />

      <main id="main-portal-contents" className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Topbar
          activeTabName={activeTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          addToast={addToast}
          session={session}
          onLogout={handleLogout}
        />

        <div
          id="portal-inner-board"
          key={activeTab}
          className="flex-1 min-h-0 overflow-y-auto animate-portal-content-in"
        >
          {!canAccessTab(session.roles, activeTab) ? null : activeTab === 'Employees Management' ? (
            <div id="employees-module-root" className="space-y-6">
              <div
                id="employees-module-header"
                className="nv-card flex flex-col md:flex-row md:items-center justify-between px-4 py-1.5 gap-3"
              >
                <div id="employees-navigation-tabs" className="flex items-center gap-2 select-none">
                  {(
                    [
                      'Employee Profile',
                      'Employee Directory',
                      'Organisation Chart',
                      'Employee Reports',
                    ] as SubTab[]
                  ).map((tab) => {
                    const isActive = activeSubTab === tab
                    return (
                      <button
                        id={`tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                        key={tab}
                        onClick={() => handleSubTabChange(tab)}
                        className={`text-sm font-semibold px-4.5 py-2.5 rounded-xl transition-all relative cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 text-novora'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  })}
                </div>

                <div
                  id="employees-top-controls"
                  className="flex items-center gap-3 self-end md:self-auto relative shrink-0 flex-nowrap"
                >
                  <div id="dept-filter-dropdown" className="relative shrink-0">
                    <button
                      id="dept-filter-btn"
                      onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                      className="h-9 inline-flex items-center gap-2 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span className="whitespace-nowrap">{deptFilterState}</span>
                      <ChevronDown className="nv-chevron-down nv-chevron-down--md" />
                    </button>

                    {deptDropdownOpen && (
                      <div
                        id="dept-dropdown-menu"
                        className="nv-dropdown-menu nv-dropdown-menu--right w-48 nv-card shadow-lg py-1.5"
                      >
                        {['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map(
                          (dept) => (
                            <button
                              key={dept}
                              onClick={() => filteredByDepartmentDropdown(dept)}
                              className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-novora transition-colors"
                            >
                              {dept}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <div id="export-actions-dropdown" className="relative shrink-0">
                    <button
                      id="export-options-btn"
                      onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                      className="h-9 inline-flex items-center gap-2 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-novora/35 hover:bg-novora/5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Download className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Export</span>
                      <ChevronDown className="nv-chevron-down nv-chevron-down--md" />
                    </button>

                    {exportDropdownOpen && (
                      <div
                        id="export-dropdown-items"
                        className="nv-dropdown-menu nv-dropdown-menu--right w-44 nv-card shadow-lg py-1.5"
                      >
                        <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                          Export Settings
                        </div>
                        <button
                          id="export-excel-item"
                          onClick={() => triggerExport('Excel')}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                        >
                          <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-500 shrink-0" strokeWidth={2} />
                          <span>Export as Excel</span>
                        </button>
                        <button
                          id="export-csv-item"
                          onClick={() => triggerExport('CSV')}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                        >
                          <FileText className="h-4.5 w-4.5 text-blue-500 shrink-0" strokeWidth={2} />
                          <span>Export as CSV</span>
                        </button>
                        <button
                          id="export-pdf-item"
                          onClick={() => triggerExport('PDF')}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                        >
                          <BookOpen className="h-4.5 w-4.5 text-rose-500 shrink-0" strokeWidth={2} />
                          <span>Export as PDF</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div id="active-sub-tab-stage">
                {activeSubTab === 'Employee Profile' && (
                  <EmployeeProfileTab
                    employee={selectedEmployee}
                    onBackToDirectory={() => handleSubTabChange('Employee Directory')}
                    onDeleteEmployee={(id) => {
                      const nextEmps = employees.filter((e) => e.id !== id)
                      setEmployees(nextEmps)
                      setSelectedEmployee(nextEmps[0] || null)
                      handleSubTabChange('Employee Directory')
                    }}
                    onUpdateEmployee={(updatedEmp) => {
                      setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)))
                      setSelectedEmployee(updatedEmp)
                    }}
                    addToast={addToast}
                  />
                )}

                {activeSubTab === 'Employee Directory' && (
                  <EmployeeDirectoryTab
                    employees={employees.filter(
                      (emp) =>
                        deptFilterState === 'All departments' || emp.department === deptFilterState,
                    )}
                    onSelectEmployee={handleSelectEmployee}
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                    searchValue={searchValue}
                    onSearchValueChange={setSearchValue}
                  />
                )}

                {activeSubTab === 'Organisation Chart' && (
                  <OrgChartTab
                    employees={employees}
                    onSelectEmployee={handleSelectEmployee}
                    addToast={addToast}
                  />
                )}

                {activeSubTab === 'Employee Reports' && (
                  <EmployeeReportsTab employees={employees} addToast={addToast} />
                )}
              </div>
            </div>
          ) : activeTab === 'Dashboard' ? (
            <DashboardTab
              employees={employees}
              setActiveSidebarTab={goToTab}
              addToast={addToast}
              roles={session.roles}
              userName={session.fullName || session.email}
            />
          ) : activeTab === 'On/Off-boarding Management' ? (
            <OnOffBoardingTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Benefits Management' ? (
            <BenefitsTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Helpdesk & Inquiries Management' ? (
            <HelpdeskTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Engagement Management' ? (
            <EngagementTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Learning Management' ? (
            <LearningTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Training Management' ? (
            <TrainingTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Assets Management' ? (
            <AssetsTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Recruitment Management' ? (
            <RecruitmentTab addToast={addToast} onAddEmployeeAsRecord={handleAddEmployee} />
          ) : activeTab === 'Attendance Management' ? (
            <AttendanceTab addToast={addToast} />
          ) : activeTab === 'Leave Management' ? (
            <LeaveTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Disciplinary Management' ? (
            <DisciplinaryTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Payroll Management' ? (
            <PayrollTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Claims Management' ? (
            <ClaimsTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Performance Management' ? (
            <PerformanceTab employees={employees} addToast={addToast} />
          ) : activeTab === 'Reports' ? (
            <ReportsTab
              employees={employees}
              addToast={addToast}
              activeSubTab={reportsSubTab}
              setActiveSubTab={(tab) => setReportsSubTab(tab as 'centre' | 'scheduled' | 'builder')}
            />
          ) : activeTab === 'Settings' ? (
            <SettingsTab
              employees={employees}
              addToast={addToast}
              activeSubTab={settingsSubTab}
              setActiveSubTab={setSettingsSubTab}
            />
          ) : null}
        </div>
      </main>

      {canManageFullSystem(session.roles) && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddEmployee={handleAddEmployee}
          addToast={addToast}
        />
      )}
    </div>
  )
}
