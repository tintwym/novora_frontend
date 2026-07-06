import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createSettingsStore, formatNow, nextSequentialId, normalizeOperatorRole } from '../../data/mockSettings'
import type {
  AppearancePrefs,
  BranchRecord,
  CompanyProfileData,
  EmailTemplateRecord,
  LocalizationConfig,
  NotificationConfig,
  SecurityConfig,
  SettingsStoreState,
} from '../../types/settings'

export function showSettingsToast(message: string) {
  window.alert(message)
}

type SettingsContextValue = {
  store: SettingsStoreState
  updateCompanyProfile: (data: CompanyProfileData) => void
  setModuleEnabled: (name: string, enabled: boolean) => void
  saveModules: () => void
  addBranch: (branch: Omit<BranchRecord, 'id'>) => void
  updateBranch: (id: string, patch: Partial<BranchRecord>) => void
  addDepartment: (name: string, head: string) => void
  addGrade: (code: string, minSalary: string, maxSalary: string) => void
  addOperator: (name: string, email: string, role: string) => void
  revokeOperator: (id: string) => void
  addRole: (name: string, description: string) => void
  addWorkflow: (name: string, description: string, routing: string) => void
  toggleWorkflow: (index: number) => void
  saveNotifications: (config: NotificationConfig) => void
  patchNotifications: (patch: { channels?: Record<string, boolean>; triggers?: Record<string, boolean> }) => void
  saveSecurity: (config: SecurityConfig) => void
  patchSecurity: (patch: Partial<SecurityConfig>) => void
  saveLocalization: (config: LocalizationConfig) => void
  patchLocalization: (patch: Partial<LocalizationConfig>) => void
  addEmailTemplate: (template: Omit<EmailTemplateRecord, 'id'>) => void
  updateEmailTemplate: (id: string, patch: Partial<EmailTemplateRecord>) => void
  runBackup: () => void
  updateBackup: (patch: Partial<SettingsStoreState['backup']>) => void
  revealApiKey: () => void
  regenerateApiKey: () => void
  setAppearance: (patch: Partial<AppearancePrefs>) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<SettingsStoreState>(createSettingsStore)

  const updateCompanyProfile = useCallback((data: CompanyProfileData) => {
    setStore((s) => ({ ...s, companyProfile: data }))
  }, [])

  const setModuleEnabled = useCallback((name: string, enabled: boolean) => {
    setStore((s) => {
      const m = s.modules[name]
      if (!m) return s
      return { ...s, modules: { ...s.modules, [name]: { ...m, enabled } } }
    })
  }, [])

  const saveModules = useCallback(() => {}, [])

  const addBranch = useCallback((branch: Omit<BranchRecord, 'id'>) => {
    setStore((s) => {
      const n = nextSequentialId(s.branches.map((b) => b.id), 'br-')
      return { ...s, branches: [...s.branches, { ...branch, id: `br-${n}` }] }
    })
  }, [])

  const updateBranch = useCallback((id: string, patch: Partial<BranchRecord>) => {
    setStore((s) => ({
      ...s,
      branches: s.branches.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }))
  }, [])

  const addDepartment = useCallback((name: string, head: string) => {
    setStore((s) => ({
      ...s,
      departments: [...s.departments, { name, head: head.toUpperCase(), employeeLabel: '0 employees' }],
    }))
  }, [])

  const addGrade = useCallback((code: string, minSalary: string, maxSalary: string) => {
    setStore((s) => ({
      ...s,
      grades: [...s.grades, { code, rangeLabel: `MYR ${minSalary} — MYR ${maxSalary}` }],
    }))
  }, [])

  const addOperator = useCallback((name: string, email: string, role: string) => {
    setStore((s) => {
      const n = nextSequentialId(s.operators.map((o) => o.id), 'op-')
      return {
        ...s,
        operators: [
          ...s.operators,
          { id: `op-${n}`, name, email, role: normalizeOperatorRole(role), lastActive: 'Just now', active: true },
        ],
      }
    })
  }, [])

  const revokeOperator = useCallback((id: string) => {
    setStore((s) => ({ ...s, operators: s.operators.filter((o) => o.id !== id) }))
  }, [])

  const addRole = useCallback((name: string, description: string) => {
    setStore((s) => ({
      ...s,
      roles: [...s.roles, { name: name.toUpperCase(), tag: 'Custom role', description }],
    }))
  }, [])

  const addWorkflow = useCallback((name: string, description: string, routing: string) => {
    setStore((s) => ({
      ...s,
      workflows: [...s.workflows, { name, description, routing, active: true }],
    }))
  }, [])

  const toggleWorkflow = useCallback((index: number) => {
    setStore((s) => ({
      ...s,
      workflows: s.workflows.map((w, i) => (i === index ? { ...w, active: !w.active } : w)),
    }))
  }, [])

  const saveNotifications = useCallback((config: NotificationConfig) => {
    setStore((s) => ({ ...s, notifications: config }))
  }, [])

  const patchNotifications = useCallback(
    (patch: { channels?: Record<string, boolean>; triggers?: Record<string, boolean> }) => {
      setStore((s) => ({
        ...s,
        notifications: {
          channels: patch.channels ?? s.notifications.channels,
          triggers: patch.triggers ?? s.notifications.triggers,
        },
      }))
    },
    [],
  )

  const saveSecurity = useCallback((config: SecurityConfig) => {
    setStore((s) => ({ ...s, security: config }))
  }, [])

  const patchSecurity = useCallback((patch: Partial<SecurityConfig>) => {
    setStore((s) => ({ ...s, security: { ...s.security, ...patch } }))
  }, [])

  const saveLocalization = useCallback((config: LocalizationConfig) => {
    setStore((s) => ({ ...s, localization: config }))
  }, [])

  const patchLocalization = useCallback((patch: Partial<LocalizationConfig>) => {
    setStore((s) => ({ ...s, localization: { ...s.localization, ...patch } }))
  }, [])

  const addEmailTemplate = useCallback((template: Omit<EmailTemplateRecord, 'id'>) => {
    setStore((s) => {
      const n = nextSequentialId(s.emailTemplates.map((t) => t.id), 'tpl-')
      return { ...s, emailTemplates: [{ ...template, id: `tpl-${n}` }, ...s.emailTemplates] }
    })
  }, [])

  const updateEmailTemplate = useCallback((id: string, patch: Partial<EmailTemplateRecord>) => {
    setStore((s) => ({
      ...s,
      emailTemplates: s.emailTemplates.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }, [])

  const runBackup = useCallback(() => {
    setStore((s) => ({
      ...s,
      backup: {
        ...s.backup,
        lastSuccess: formatNow(),
        snapshotGb: Math.round((s.backup.snapshotGb + 0.1) * 10) / 10,
      },
    }))
  }, [])

  const updateBackup = useCallback((patch: Partial<SettingsStoreState['backup']>) => {
    setStore((s) => ({ ...s, backup: { ...s.backup, ...patch } }))
  }, [])

  const revealApiKey = useCallback(() => {
    setStore((s) => ({ ...s, apiKeyRevealed: true }))
  }, [])

  const regenerateApiKey = useCallback(() => {
    const suffix = Date.now() % 100000
    setStore((s) => ({
      ...s,
      apiKeyFull: `sk-novora-live-${suffix}`,
      apiKeyMasked: `sk-novora-••••••••••••••••${suffix}`,
      apiKeyRevealed: false,
    }))
  }, [])

  const setAppearance = useCallback((patch: Partial<AppearancePrefs>) => {
    setStore((s) => ({ ...s, appearance: { ...s.appearance, ...patch } }))
  }, [])

  const value = useMemo(
    () => ({
      store,
      updateCompanyProfile,
      setModuleEnabled,
      saveModules,
      addBranch,
      updateBranch,
      addDepartment,
      addGrade,
      addOperator,
      revokeOperator,
      addRole,
      addWorkflow,
      toggleWorkflow,
      saveNotifications,
      patchNotifications,
      saveSecurity,
      patchSecurity,
      saveLocalization,
      patchLocalization,
      addEmailTemplate,
      updateEmailTemplate,
      runBackup,
      updateBackup,
      revealApiKey,
      regenerateApiKey,
      setAppearance,
    }),
    [
      store,
      updateCompanyProfile,
      setModuleEnabled,
      saveModules,
      addBranch,
      updateBranch,
      addDepartment,
      addGrade,
      addOperator,
      revokeOperator,
      addRole,
      addWorkflow,
      toggleWorkflow,
      saveNotifications,
      patchNotifications,
      saveSecurity,
      patchSecurity,
      saveLocalization,
      patchLocalization,
      addEmailTemplate,
      updateEmailTemplate,
      runBackup,
      updateBackup,
      revealApiKey,
      regenerateApiKey,
      setAppearance,
    ],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettingsStore(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettingsStore must be used within SettingsProvider')
  return ctx
}
