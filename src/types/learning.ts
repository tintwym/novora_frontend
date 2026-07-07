import type { RecruitPillTone } from './recruitment'

export type LearningCourse = {
  id: string
  category: string
  title: string
  instructor: string
  duration: string
  format: string
  provider: string
  progress: number
  enrolled: boolean
  completed: boolean
  rating: number
}

export type LearningPath = {
  id: string
  cohort: string
  cohortTone: RecruitPillTone
  level: string
  levelTone: RecruitPillTone
  title: string
  description: string
  milestones: string[]
  enrollments: number
}

export type LearningCertRow = {
  id: string
  cert: string
  name: string
  dept: string
  issue: string
  expiry: string
  state: string
  stateTone: RecruitPillTone
}

export type QuizQuestion = {
  text: string
  options: string[]
  correct: string
}

export type LearningAssessment = {
  id: string
  title: string
  duration: string
  itemCount: string
  questions: QuizQuestion[]
}

export type CompletionTeam = {
  name: string
  pct: number
  certified: string
}

export type LearningChampion = {
  rank: string
  name: string
  role: string
  classes: string
  hours: string
  badge: string
  badgeTone: string
}
