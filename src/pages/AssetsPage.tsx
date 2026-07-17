import { useMemo } from 'react'
import { AssetsTab } from '../components/assets/AssetsTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function AssetsPage() {
  const employees = useMemo(
    () =>
      mockModuleEmployees.map((row) => ({
        id: row.id,
        name: row.name,
        department: row.department,
      })),
    [],
  )

  return <AssetsTab employees={employees} />
}
