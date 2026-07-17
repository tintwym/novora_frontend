import { useMemo } from 'react'
import { BenefitsTab } from '../components/benefits/BenefitsTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function BenefitsPage() {
  const employees = useMemo(
    () =>
      mockModuleEmployees.map((row) => ({
        id: row.id,
        name: row.name,
        department: row.department,
      })),
    [],
  )

  return <BenefitsTab employees={employees} />
}
