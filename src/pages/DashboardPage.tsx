import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardTab } from '../components/dashboard/DashboardTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function DashboardPage() {
  const navigate = useNavigate()
  const employees = useMemo(() => mockModuleEmployees, [])

  return (
    <DashboardTab
      employees={employees}
      onNavigate={(path) => navigate(path)}
    />
  )
}
