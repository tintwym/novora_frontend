import type { RecruitPillTone } from './recruitment'

export type PulseSurveyOption = { label: string; pct: number }

export type PulseSurvey = {
  title: string
  votes: string
  question: string
  options: PulseSurveyOption[]
}

export type SuggestionEntry = {
  category: string
  vibe: string
  vibeTone: RecruitPillTone
  id: string
  date: string
  text: string
  tag: string
  tags?: string[]
  nlp: string
  upvotes: number
}

export type ShoutOutMedal = { name: string; icon: string; tone: string; description: string }

export type ShoutOutCard = {
  initials: string
  name: string
  role: string
  badge: string
  badgeTone: string
  message: string
  meta: string
  applause: number
}

export type ActionLogEntry = {
  priority: string
  priorityTone: RecruitPillTone
  department: string
  ref: string
  title: string
  body: string
  footer: string
  status: string
  statusTone: RecruitPillTone
}

export type SentimentFeedRow = {
  topic: string
  sub: string
  vibe: string
  vibeTone: RecruitPillTone
  claps: number
}

export type RatioBar = { label: string; pct: number; color: string; trailing: string }
