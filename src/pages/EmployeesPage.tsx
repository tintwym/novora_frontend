import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { AddEmployeeModal } from '../components/employees/AddEmployeeModal'
import { EmployeeDirectoryTab } from '../components/employees/EmployeeDirectoryTab'
import { EmployeeProfileTab } from '../components/employees/EmployeeProfileTab'
import { EmployeeReportsTab } from '../components/employees/EmployeeReportsTab'
import { OrgChartTab } from '../components/employees/OrgChartTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'
import type { ModuleEmployee } from '../types/moduleEmployee'
import { showActionToast } from '../utils/actionToast'

const MODULE_TABS = [
  { id: 'profile', label: 'Employee Profile' },
  { id: 'directory', label: 'Employee Directory' },
  { id: 'org', label: 'Organisation Chart' },
  { id: 'reports', label: 'Employee Reports' },
] as const

const DEPARTMENTS = ['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function EmployeesPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('profile')
  const [employees, setEmployees] = useState<ModuleEmployee[]>(() => [...mockModuleEmployees])
  const [selectedEmployee, setSelectedEmployee] = useState<ModuleEmployee | null>(
    () => mockModuleEmployees.find((e) => e.id === 'EMP-0285') ?? mockModuleEmployees[0] ?? null,
  )
  const [showWizard, setShowWizard] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [deptFilter, setDeptFilter] = useState<string>('All departments')
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false)
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const controlsRef = useRef<HTMLDivElement>(null)

  const directoryEmployees = useMemo(
    () =>
      employees.filter(
        (emp) => deptFilter === 'All departments' || emp.department === deptFilter,
      ),
    [employees, deptFilter],
  )

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) {
        setDeptDropdownOpen(false)
        setExportDropdownOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const triggerExport = (format: 'Excel' | 'CSV' | 'PDF') => {
    setExportDropdownOpen(false)
    showActionToast(`Compiling and sanitizing employee dataset for ${format}...`, 'loading')
    window.setTimeout(() => {
      showActionToast(
        `Dataset successfully downloaded as Novora_Employees.${format === 'Excel' ? 'xlsx' : format.toLowerCase()}`,
        'success',
      )
    }, 1200)
  }

  return (
    <div className={`emp-module${showWizard ? ' emp-module--wizard-open' : ''}`}>
      {showWizard ? (
        <AddEmployeeModal
          onClose={() => setShowWizard(false)}
          onAddEmployee={(emp) => {
            setEmployees((prev) => [emp, ...prev])
            setSelectedEmployee(emp)
            setModuleTab('profile')
          }}
        />
      ) : (
        <div id="employees-module-root" className="space-y-6">
          <div
            id="employees-module-header"
            className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200/85 pb-4 gap-4"
          >
            <nav
              id="employees-navigation-tabs"
              className="flex items-center gap-2 select-none flex-wrap"
              aria-label="Employment modules"
            >
              {MODULE_TABS.map((t) => {
                const isActive = moduleTab === t.id
                return (
                  <button
                    key={t.id}
                    id={`tab-${t.label.replace(/\s+/g, '-').toLowerCase()}`}
                    type="button"
                    onClick={() => setModuleTab(t.id)}
                    className={`text-sm font-semibold px-4.5 py-2.5 rounded-xl transition-all relative cursor-pointer ${
                      isActive
                        ? 'text-[#2f66e0] bg-[#2f66e0]/8 border border-[#2f66e0]/10 font-bold'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                    }`}
                  >
                    {t.label}
                    {isActive ? (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2f66e0] rounded-sm" />
                    ) : null}
                  </button>
                )
              })}
            </nav>

            <div
              id="employees-top-controls"
              ref={controlsRef}
              className="flex items-center gap-3 self-end md:self-auto relative"
            >
              <div id="dept-filter-dropdown" className="relative">
                <button
                  id="dept-filter-btn"
                  type="button"
                  onClick={() => {
                    setDeptDropdownOpen((open) => !open)
                    setExportDropdownOpen(false)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">{deptFilter}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>

                {deptDropdownOpen ? (
                  <div
                    id="dept-dropdown-menu"
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setDeptFilter(dept)
                          setDeptDropdownOpen(false)
                          showActionToast(
                            dept === 'All departments'
                              ? 'Showing employees across all departments'
                              : `Filtered layout to show only ${dept}`,
                            'info',
                          )
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#2f66e0] transition-colors"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div id="export-actions-dropdown" className="relative">
                <button
                  id="export-options-btn"
                  type="button"
                  onClick={() => {
                    setExportDropdownOpen((open) => !open)
                    setDeptDropdownOpen(false)
                  }}
                  className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 font-bold text-xs text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Export</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>

                {exportDropdownOpen ? (
                  <div
                    id="export-dropdown-items"
                    className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40"
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                      Export Settings
                    </div>
                    <button
                      id="export-excel-item"
                      type="button"
                      onClick={() => triggerExport('Excel')}
                      className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                      <span>Export as Excel Worksheet</span>
                    </button>
                    <button
                      id="export-csv-item"
                      type="button"
                      onClick={() => triggerExport('CSV')}
                      className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                    >
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Export as CSV Table</span>
                    </button>
                    <button
                      id="export-pdf-item"
                      type="button"
                      onClick={() => triggerExport('PDF')}
                      className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                    >
                      <FileText className="h-4 w-4 text-red-500" />
                      <span>Export as PDF Report Booklet</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div id="active-sub-tab-stage">
            {moduleTab === 'profile' ? (
              <EmployeeProfileTab
                employee={selectedEmployee}
                onBackToDirectory={() => setModuleTab('directory')}
                onDeleteEmployee={(id) => {
                  setEmployees((prev) => prev.filter((e) => e.id !== id))
                  setSelectedEmployee((prev) => (prev?.id === id ? null : prev))
                  setModuleTab('directory')
                  showActionToast('Employee directory record purged successfully.', 'success')
                }}
                onUpdateEmployee={(emp) => {
                  setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)))
                  setSelectedEmployee(emp)
                  showActionToast(`Changes committed for ${emp.name}.`, 'success')
                }}
              />
            ) : null}
            {moduleTab === 'directory' ? (
              <EmployeeDirectoryTab
                employees={directoryEmployees}
                searchValue={searchValue}
                onSearchValueChange={setSearchValue}
                onOpenAddModal={() => setShowWizard(true)}
                onSelectEmployee={(emp) => {
                  setSelectedEmployee(emp)
                  setModuleTab('profile')
                }}
              />
            ) : null}
            {moduleTab === 'org' ? (
              <OrgChartTab
                employees={employees}
                onSelectEmployee={(emp) => {
                  setSelectedEmployee(emp)
                  setEmployees((prev) => (prev.some((e) => e.id === emp.id) ? prev : [emp, ...prev]))
                  setModuleTab('profile')
                }}
              />
            ) : null}
            {moduleTab === 'reports' ? <EmployeeReportsTab employees={employees} /> : null}
          </div>
        </div>
      )}
    </div>
  )
}
