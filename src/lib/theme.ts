export type ThemePreset = 'Slate Light' | 'Minimal Off-White' | 'Cyber Dark' | 'Emerald Forest'
export type DensityPreset = 'Compact' | 'Cozy' | 'Spacious'
export type AccentPreset = 'Novora Blue' | 'Rose Red' | 'Emerald Green' | 'Amber Gold'

export const THEME_STORAGE_KEY = 'novora.appearance.theme'
export const DENSITY_STORAGE_KEY = 'novora.appearance.density'
export const ACCENT_STORAGE_KEY = 'novora.appearance.accent'

export const DEFAULT_THEME: ThemePreset = 'Slate Light'
export const DEFAULT_DENSITY: DensityPreset = 'Cozy'
export const DEFAULT_ACCENT: AccentPreset = 'Novora Blue'

export const THEME_PRESETS: ThemePreset[] = [
  'Slate Light',
  'Minimal Off-White',
  'Cyber Dark',
  'Emerald Forest',
]

export const DENSITY_PRESETS: DensityPreset[] = ['Compact', 'Cozy', 'Spacious']

export const ACCENT_PRESETS: AccentPreset[] = [
  'Novora Blue',
  'Rose Red',
  'Emerald Green',
  'Amber Gold',
]

export function themeToDataAttr(theme: ThemePreset): string {
  switch (theme) {
    case 'Slate Light':
      return 'slate-light'
    case 'Minimal Off-White':
      return 'minimal-off-white'
    case 'Cyber Dark':
      return 'cyber-dark'
    case 'Emerald Forest':
      return 'emerald-forest'
  }
}

export function densityToDataAttr(density: DensityPreset): string {
  return density.toLowerCase()
}

export function isDarkTheme(theme: ThemePreset): boolean {
  return theme === 'Cyber Dark'
}

export function accentColors(accent: AccentPreset): { novora: string; deep: string } {
  switch (accent) {
    case 'Rose Red':
      return { novora: '#f43f5e', deep: '#e11d48' }
    case 'Emerald Green':
      return { novora: '#10b981', deep: '#059669' }
    case 'Amber Gold':
      return { novora: '#f59e0b', deep: '#d97706' }
    case 'Novora Blue':
    default:
      return { novora: '#2563eb', deep: '#1d4ed8' }
  }
}

export function readStoredTheme(): ThemePreset {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreset | null
    return value && THEME_PRESETS.includes(value) ? value : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export function readStoredDensity(): DensityPreset {
  if (typeof window === 'undefined') return DEFAULT_DENSITY
  try {
    const value = localStorage.getItem(DENSITY_STORAGE_KEY) as DensityPreset | null
    return value && DENSITY_PRESETS.includes(value) ? value : DEFAULT_DENSITY
  } catch {
    return DEFAULT_DENSITY
  }
}

export function readStoredAccent(): AccentPreset {
  if (typeof window === 'undefined') return DEFAULT_ACCENT
  try {
    const value = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentPreset | null
    return value && ACCENT_PRESETS.includes(value) ? value : DEFAULT_ACCENT
  } catch {
    return DEFAULT_ACCENT
  }
}
