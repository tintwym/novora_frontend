import { useMemo } from 'react'
import { ReportsTab } from '../components/reports/ReportsTab'
import { useShellNav } from '../context/ShellNavContext'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function ReportsPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  const { reportsPanel, setReportsPanel } = useShellNav()

  return (
    <ReportsTab
      employees={employees}
      activeSubTab={reportsPanel}
      setActiveSubTab={setReportsPanel}
    />
  )
}
