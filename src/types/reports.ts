export type ReportCategoryId = 'all' | 'core_hr' | 'financials' | 'talent_growth' | 'support_engagement'

export type ReportPanelId = 'report_centre' | 'scheduled' | 'custom_builder'

export type ReportInsightMetric = {
  label: string
  value: string
  sub: string
  subIsPositive?: boolean
}

export type ReportAvailableItem = {
  title: string
  tag: string
  description: string
}

export type ReportProgressBar = {
  label: string
  detail: string
  fraction: number
  color: string
}

export type ReportExecutiveBriefing = {
  riskLabel: string
  riskIsLow: boolean
  riskIsHigh: boolean
  strategicFocus: string
  financialImpact: string
  directives: string[]
}

export type ReportQuickSnapshot = {
  totalRecordsLabel: string
  totalRecordsValue: string
  lastUpdated: string
  autoRunStatus: string
  distributionTitle: string
  bars: ReportProgressBar[]
}

export type ReportModuleDefinition = {
  id: string
  label: string
  icon: string
  categories: ReportCategoryId[]
  reportsSectionTitle: string
  insights: ReportInsightMetric[]
  reports: ReportAvailableItem[]
  quickSnapshot: ReportQuickSnapshot
  briefing: ReportExecutiveBriefing
  overviewOnly?: boolean
}

export const REPORT_CATEGORIES: { id: ReportCategoryId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'core_hr', label: 'Core HR' },
  { id: 'financials', label: 'Financials & Benefits' },
  { id: 'talent_growth', label: 'Talent & Growth' },
  { id: 'support_engagement', label: 'Support & Engagement' },
]

export const REPORT_PANELS: { id: ReportPanelId; label: string }[] = [
  { id: 'report_centre', label: 'Report Centre' },
  { id: 'scheduled', label: 'Scheduled Reports' },
  { id: 'custom_builder', label: 'Custom Builder' },
]
