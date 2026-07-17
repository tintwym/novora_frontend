import { useMemo } from 'react'
import { HelpdeskTab } from '../components/helpdesk/HelpdeskTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function HelpdeskPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <HelpdeskTab employees={employees} />
}
