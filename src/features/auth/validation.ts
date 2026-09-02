/** Client-side rules mirrored from backend AuthDtos. */

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 72

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COMMON_PASSWORDS = new Set([
  'password',
  'password1',
  'password123',
  '12345678',
  '123456789',
  'qwerty123',
  'letmein1',
  'welcome1',
  'admin123',
  'changeme1',
])

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export interface PasswordCheck {
  id: string
  label: string
  met: boolean
}

export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    {
      id: 'length',
      label: `${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters`,
      met: password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH,
    },
    {
      id: 'lower',
      label: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      id: 'upper',
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'digit',
      label: 'One number',
      met: /\d/.test(password),
    },
    {
      id: 'symbol',
      label: 'One symbol (!@#$…)',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ]
}

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase())
}

export type FieldErrors<T extends string> = Partial<Record<T, string>>

export interface LoginValues {
  email: string
  password: string
}

export interface RegisterValues {
  fullName: string
  companyName: string
  email: string
  password: string
  confirmPassword: string
}

export function validateLogin(values: LoginValues): FieldErrors<keyof LoginValues> {
  const errors: FieldErrors<keyof LoginValues> = {}

  const email = normalizeEmail(values.email)
  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  } else if (email.length > 254) {
    errors.email = 'Email is too long'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Password must be at most ${PASSWORD_MAX_LENGTH} characters`
  }

  return errors
}

export function validateRegister(values: RegisterValues): FieldErrors<keyof RegisterValues> {
  const errors: FieldErrors<keyof RegisterValues> = {}

  const fullName = values.fullName.trim()
  if (fullName.length > 200) {
    errors.fullName = 'Name must be at most 200 characters'
  }

  const companyName = values.companyName.trim()
  if (!companyName) {
    errors.companyName = 'Company name is required'
  } else if (companyName.length < 2 || companyName.length > 120) {
    errors.companyName = 'Company name must be 2–120 characters'
  }

  const email = normalizeEmail(values.email)
  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  } else if (email.length > 254) {
    errors.email = 'Email is too long'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (!PASSWORD_PATTERN.test(values.password)) {
    errors.password =
      'Password must be 8–72 characters and include uppercase, lowercase, a number, and a symbol'
  } else if (isCommonPassword(values.password)) {
    errors.password = 'This password is too common. Choose something more unique.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export function passwordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4
  label: string
} {
  if (!password) return { score: 0, label: '' }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'] as const
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] }
}
