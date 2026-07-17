import { useMemo } from 'react'
import { DisciplinaryTab } from '../components/disciplinary/DisciplinaryTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function DisciplinaryPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <DisciplinaryTab employees={employees} />
}
