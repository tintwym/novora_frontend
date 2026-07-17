import { useMemo } from 'react'
import { LearningTab } from '../components/learning/LearningTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function LearningPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <LearningTab employees={employees} />
}
