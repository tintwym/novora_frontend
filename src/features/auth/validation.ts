/** Client-side rules mirrored from backend AuthDtos. */

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!values.password) {
    errors.password = 'Password is required'
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

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (!PASSWORD_PATTERN.test(values.password)) {
    errors.password =
      'Password must be 8–72 characters and include uppercase, lowercase, a number, and a symbol'
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
