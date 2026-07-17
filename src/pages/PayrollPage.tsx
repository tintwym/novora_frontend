import { useMemo } from 'react'
import { PayrollTab } from '../components/payroll/PayrollTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function PayrollPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <PayrollTab employees={employees} />
}
