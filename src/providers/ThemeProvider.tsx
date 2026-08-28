'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  DEFAULT_DENSITY,
  DEFAULT_THEME,
  DENSITY_STORAGE_KEY,
  THEME_STORAGE_KEY,
  accentColors,
  densityToDataAttr,
  isDarkTheme,
  readStoredAccent,
  readStoredDensity,
  readStoredTheme,
  themeToDataAttr,
  type AccentPreset,
  type DensityPreset,
  type ThemePreset,
} from '@/lib/theme'

type ThemeContextValue = {
  theme: ThemePreset
  density: DensityPreset
  accent: AccentPreset
  isDarkSidebar: boolean
  setTheme: (theme: ThemePreset) => void
  setDensity: (density: DensityPreset) => void
  setAccent: (accent: AccentPreset) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyAppearance(theme: ThemePreset, density: DensityPreset, accent: AccentPreset) {
  const root = document.documentElement
  const { novora, deep } = accentColors(accent)

  root.dataset.theme = themeToDataAttr(theme)
  root.dataset.density = densityToDataAttr(density)
  root.style.setProperty('--color-novora', novora)
  root.style.setProperty('--color-novora-deep', deep)
  root.style.colorScheme = isDarkTheme(theme) ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreset>(DEFAULT_THEME)
  const [density, setDensityState] = useState<DensityPreset>(DEFAULT_DENSITY)
  const [accent, setAccentState] = useState<AccentPreset>(DEFAULT_ACCENT)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedTheme = readStoredTheme()
    const storedDensity = readStoredDensity()
    const storedAccent = readStoredAccent()
    setThemeState(storedTheme)
    setDensityState(storedDensity)
    setAccentState(storedAccent)
    applyAppearance(storedTheme, storedDensity, storedAccent)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    applyAppearance(theme, density, accent)
  }, [ready, theme, density, accent])

  const setTheme = useCallback((next: ThemePreset) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // ignore quota / private mode
    }
  }, [])

  const setDensity = useCallback((next: DensityPreset) => {
    setDensityState(next)
    try {
      localStorage.setItem(DENSITY_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const setAccent = useCallback((next: AccentPreset) => {
    setAccentState(next)
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      density,
      accent,
      isDarkSidebar: isDarkTheme(theme),
      setTheme,
      setDensity,
      setAccent,
    }),
    [theme, density, accent, setTheme, setDensity, setAccent],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
