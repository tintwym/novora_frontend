import { useMemo } from 'react'
import { TrainingTab } from '../components/training/TrainingTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function TrainingPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <TrainingTab employees={employees} />
}
