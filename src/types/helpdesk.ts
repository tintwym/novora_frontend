import type { RecruitPillTone } from './recruitment'

export type HelpdeskTicket = {
  id: string
  category: string
  priority: string
  priorityTone: RecruitPillTone
  subject: string
  snippet: string
  reporter: string
  initials: string
  filedAt: string
  status: string
  statusTone: RecruitPillTone
  slaLabel?: string
  badge?: string
  breached?: boolean
  escalated?: boolean
  secure?: boolean
}

export type DigitalCertificate = {
  title: string
  subtitle: string
  status: string
  statusTone: RecruitPillTone
}

export type CategoryVolume = {
  label: string
  pct: number
  color: string
  trailing: string
}

export type SlaTarget = {
  level: string
  levelTone: RecruitPillTone
  target: string
  ytdAvg: string
  actionRequired?: boolean
}

export type PerformanceLogRow = {
  ticketRef: string
  filer: string
  category: string
  slaLimit: string
  resolutionTime: string
  completed: boolean
  statusCode: string
  statusTone: RecruitPillTone
}

export type KnowledgeFaq = {
  category: string
  question: string
}
