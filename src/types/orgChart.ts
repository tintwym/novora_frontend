export type ChartLayout = 'concise' | 'small' | 'standard'

export type DeptKey = 'ceo' | 'engineering' | 'finance' | 'hr' | 'marketing' | 'operations' | 'open'

export type OrgChartNode = {
  id: string
  name: string
  role: string
  initials: string
  deptKey: DeptKey
  deptLabel: string
  memberCount?: number
  isOpenPosition?: boolean
  moreCount?: number
  reportsToName?: string
  children?: OrgChartNode[]
  grade?: string
  since?: string
  team?: string
}

export type DeptPalette = {
  cardBg: string
  border: string
  text: string
  avatarBg: string
  avatarFg: string
  accent: string
}

const palettes: Record<string, DeptPalette> = {
  engineering: {
    cardBg: '#eff6ff',
    border: '#bfdbfe',
    text: '#1e40af',
    avatarBg: '#dbeafe',
    avatarFg: '#1e3a8a',
    accent: '#2563eb',
  },
  finance: {
    cardBg: '#ecfdf5',
    border: '#a7f3d0',
    text: '#065f46',
    avatarBg: '#d1fae5',
    avatarFg: '#064e3b',
    accent: '#059669',
  },
  hr: {
    cardBg: '#f3e8ff',
    border: '#e9d5ff',
    text: '#6b21a8',
    avatarBg: '#e9d5ff',
    avatarFg: '#581c87',
    accent: '#9333ea',
  },
  marketing: {
    cardBg: '#fce7f3',
    border: '#fbcfe8',
    text: '#9d174d',
    avatarBg: '#fbcfe8',
    avatarFg: '#831843',
    accent: '#db2777',
  },
  operations: {
    cardBg: '#fffbeb',
    border: '#fde68a',
    text: '#92400e',
    avatarBg: '#fef3c7',
    avatarFg: '#78350f',
    accent: '#d97706',
  },
  default: {
    cardBg: '#f1f5f9',
    border: '#e2e8f0',
    text: '#0f172a',
    avatarBg: '#e2e8f0',
    avatarFg: '#0f172a',
    accent: '#64748b',
  },
}

export function deptPaletteForKey(key: DeptKey): DeptPalette {
  if (key === 'ceo' || key === 'open') return palettes.default
  return palettes[key] ?? palettes.default
}

export function deptPaletteForLabel(label: string): DeptPalette {
  const map: Record<string, DeptPalette> = {
    Engineering: palettes.engineering,
    Finance: palettes.finance,
    HR: palettes.hr,
    Marketing: palettes.marketing,
    Operations: palettes.operations,
  }
  return map[label] ?? palettes.default
}

export const DEPT_FILTERS = ['All', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'] as const

export const DEPT_SUMMARY: Record<string, number> = {
  Engineering: 342,
  Finance: 180,
  HR: 88,
  Marketing: 142,
  Operations: 261,
}

export const TOTAL_EMPLOYEES = 1284
export const DEPT_COUNT = 5

export function maxVisibleGrandchildren(layout: ChartLayout): number {
  if (layout === 'concise') return 0
  if (layout === 'small') return 1
  return 3
}

export function showMemberCounts(layout: ChartLayout): boolean {
  return layout !== 'concise'
}
