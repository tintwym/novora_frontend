import { useMemo } from 'react'
import { ClaimsTab } from '../components/claims/ClaimsTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function ClaimsPage() {
  const employees = useMemo(
    () =>
      mockModuleEmployees.map((row) => ({
        id: row.id,
        name: row.name,
        department: row.department,
      })),
    [],
  )

  return <ClaimsTab employees={employees} />
}
