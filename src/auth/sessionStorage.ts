import type { User } from '../types/user'

const USER_KEY = 'novora_auth_user'
const REMEMBER_KEY = 'novora_remember_me'

export function loadCachedUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function saveCachedUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSessionStorage() {
  localStorage.removeItem(USER_KEY)
}

export function loadRememberMe(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === 'true'
}

export function saveRememberMe(value: boolean) {
  localStorage.setItem(REMEMBER_KEY, value ? 'true' : 'false')
}
