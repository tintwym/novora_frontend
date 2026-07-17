import { useMemo } from 'react'
import { PerformanceTab } from '../components/performance/PerformanceTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function PerformancePage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <PerformanceTab employees={employees} />
}
