import { useMemo } from 'react'
import { LeaveTab } from '../components/leave/LeaveTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function LeavePage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <LeaveTab employees={employees} />
}
