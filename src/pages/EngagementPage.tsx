import { useMemo } from 'react'
import { EngagementTab } from '../components/engagement/EngagementTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function EngagementPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <EngagementTab employees={employees} />
}
