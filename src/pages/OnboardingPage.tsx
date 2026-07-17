import { useMemo } from 'react'
import { OnOffBoardingTab } from '../components/onboarding/OnOffBoardingTab'
import { mockModuleEmployees } from '../data/mockModuleEmployees'

export function OnboardingPage() {
  const employees = useMemo(() => mockModuleEmployees, [])
  return <OnOffBoardingTab employees={employees} />
}
