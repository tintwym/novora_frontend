import { useEffect, useRef, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import Toast, { type ToastMessage } from '@/components/ui/Toast'
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
import { LoginPage, RegisterPage } from '@/features/auth'
import LandingPage from '@/features/landing/LandingPage'
import { toAuthSession } from '@/features/auth/mapSession'
import { fetchMe, logout, ApiError } from '@/services'
import type { SidebarTab, SubTab, Employee, AuthSession } from '@/types'
import { mockEmployees } from '@/mocks/mockEmployees'
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'

type AuthScreen = 'landing' | 'login' | 'register'

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [authScreen, setAuthScreen] = useState<AuthScreen>('landing')
  const [authBootstrapping, setAuthBootstrapping] = useState(true)
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('Dashboard')
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Employee Profile')
  const [reportsSubTab, setReportsSubTab] = useState<'centre' | 'scheduled' | 'builder'>('centre')
  const [settingsSubTab, setSettingsSubTab] = useState<string>('Company profile')
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    mockEmployees.find((e) => e.id === 'EMP-0285') || mockEmployees[0],
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const [deptFilterState, setDeptFilterState] = useState<string>('All departments')
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false)
  const toastIdRef = useRef(0)

  const addToast = (text: string, type: 'success' | 'loading' | 'error' | 'info') => {
    toastIdRef.current += 1
    setToast({
      id: String(toastIdRef.current),
      text,
      type,
    })
  }

  const removeToast = () => {
    setToast(null)
  }

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const me = await fetchMe()
        if (!cancelled) {
          setSession(toAuthSession(me))
        }
      } catch (err) {
        if (!cancelled) {
          setSession(null)
          // Only surface unexpected failures (network), not normal 401
          if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
            // Keep silent on boot — login page will show connect errors on submit
          }
        }
      } finally {
        if (!cancelled) setAuthBootstrapping(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const handleAuthSuccess = (next: AuthSession) => {
    setSession(next)
    setActiveSidebarTab('Dashboard')
    addToast(`Welcome to Novora, ${next.fullName}`, 'success')
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Still clear local session even if the network call fails
    }
    setSession(null)
    setAuthScreen('landing')
  }

  if (authBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-[#2f66e0]" />
          <p className="text-xs font-semibold tracking-wide uppercase">Loading Novora…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <>
        {authScreen === 'landing' ? (
          <LandingPage
            onSignIn={() => setAuthScreen('login')}
            onStartTrial={() => setAuthScreen('register')}
          />
        ) : authScreen === 'login' ? (
          <LoginPage
            onSuccess={handleAuthSuccess}
            onGoRegister={() => setAuthScreen('register')}
            onGoLanding={() => setAuthScreen('landing')}
          />
        ) : (
          <RegisterPage
            onSuccess={handleAuthSuccess}
            onGoLogin={() => setAuthScreen('login')}
            onGoLanding={() => setAuthScreen('landing')}
          />
        )}
        <Toast toast={toast} onClose={removeToast} />
      </>
    )
  }

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev])
    setSelectedEmployee(newEmp)
    setActiveSidebarTab('Employees Management')
    setActiveSubTab('Employee Profile')
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

  const handleSubTabChange = (tab: SubTab) => {
    setActiveSubTab(tab)
  }

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
    <div id="novora-hrms-root" className="flex min-h-screen bg-slate-50 select-none font-sans overflow-hidden">
      <Sidebar
        activeTab={activeSidebarTab}
        setActiveTab={setActiveSidebarTab}
        reportsSubTab={reportsSubTab}
        setReportsSubTab={setReportsSubTab}
        settingsSubTab={settingsSubTab}
        setSettingsSubTab={setSettingsSubTab}
      />

      <main id="main-portal-contents" className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          activeTabName={activeSidebarTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          addToast={addToast}
          session={session}
          onLogout={handleLogout}
        />

        <div id="portal-inner-board" className="flex-1 overflow-y-auto px-8 py-6">
          {activeSidebarTab === 'Employees Management' ? (
            <div id="employees-module-root" className="space-y-6">
              <div
                id="employees-module-header"
                className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200/85 pb-4 gap-4 align-middle"
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
                            ? 'text-[#2f66e0] bg-[#2f66e0]/8 border border-[#2f66e0]/10 font-bold'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                        }`}
                      >
                        {tab}
                        {isActive && (
                          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2f66e0] rounded-sm" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <div id="employees-top-controls" className="flex items-center gap-3 self-end md:self-auto relative">
                  <div id="dept-filter-dropdown" className="relative">
                    <button
                      id="dept-filter-btn"
                      onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl cursor-pointer"
                    >
                      <span>{deptFilterState}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    </button>

                    {deptDropdownOpen && (
                      <div
                        id="dept-dropdown-menu"
                        className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40"
                      >
                        {['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map(
                          (dept) => (
                            <button
                              key={dept}
                              onClick={() => filteredByDepartmentDropdown(dept)}
                              className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#2f66e0] transition-colors"
                            >
                              {dept}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <div id="export-actions-dropdown" className="relative">
                    <button
                      id="export-options-btn"
                      onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                      className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 font-bold text-xs text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Export</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    </button>

                    {exportDropdownOpen && (
                      <div
                        id="export-dropdown-items"
                        className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40"
                      >
                        <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                          Export Settings
                        </div>
                        <button
                          id="export-excel-item"
                          onClick={() => triggerExport('Excel')}
                          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                          <span>Export as Excel Worksheet</span>
                        </button>
                        <button
                          id="export-csv-item"
                          onClick={() => triggerExport('CSV')}
                          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                        >
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span>Export as CSV Table</span>
                        </button>
                        <button
                          id="export-pdf-item"
                          onClick={() => triggerExport('PDF')}
                          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                        >
                          <FileText className="h-4 w-4 text-red-500" />
                          <span>Export as PDF Report Booklet</span>
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
                      addToast('Employee directory record purged successfully.', 'success')
                    }}
                    onUpdateEmployee={(updatedEmp) => {
                      setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)))
                      setSelectedEmployee(updatedEmp)
                      addToast(`Changes committed for ${updatedEmp.name}.`, 'success')
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
          ) : activeSidebarTab === 'Dashboard' ? (
            <DashboardTab
              employees={employees}
              setActiveSidebarTab={setActiveSidebarTab}
              addToast={addToast}
            />
          ) : activeSidebarTab === 'On/Off-boarding Management' ? (
            <OnOffBoardingTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Benefits Management' ? (
            <BenefitsTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Helpdesk & Inquiries Management' ? (
            <HelpdeskTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Engagement Management' ? (
            <EngagementTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Learning Management' ? (
            <LearningTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Training Management' ? (
            <TrainingTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Assets Management' ? (
            <AssetsTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Recruitment Management' ? (
            <RecruitmentTab addToast={addToast} onAddEmployeeAsRecord={handleAddEmployee} />
          ) : activeSidebarTab === 'Attendance Management' ? (
            <AttendanceTab addToast={addToast} />
          ) : activeSidebarTab === 'Leave Management' ? (
            <LeaveTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Disciplinary Management' ? (
            <DisciplinaryTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Payroll Management' ? (
            <PayrollTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Claims Management' ? (
            <ClaimsTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Performance Management' ? (
            <PerformanceTab employees={employees} addToast={addToast} />
          ) : activeSidebarTab === 'Reports' ? (
            <ReportsTab
              employees={employees}
              addToast={addToast}
              activeSubTab={reportsSubTab}
              setActiveSubTab={setReportsSubTab}
            />
          ) : activeSidebarTab === 'Settings' ? (
            <SettingsTab
              employees={employees}
              addToast={addToast}
              activeSubTab={settingsSubTab}
              setActiveSubTab={setSettingsSubTab}
            />
          ) : null}
        </div>
      </main>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        addToast={addToast}
      />

      <Toast toast={toast} onClose={removeToast} />
    </div>
  )
}
