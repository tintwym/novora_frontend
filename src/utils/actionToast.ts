import type { ToastMessage } from '../components/ui/Toast'

export type ToastType = ToastMessage['type']

type ToastListener = (toast: ToastMessage | null) => void

let listener: ToastListener | null = null
let lastToast: ToastMessage | null = null

export function subscribeActionToast(next: ToastListener) {
  listener = next
  next(lastToast)
  return () => {
    if (listener === next) listener = null
  }
}

/** Imperative toast API used across module tabs. */
export function showActionToast(message: string, type: ToastType = 'info') {
  const toast: ToastMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: message,
    type,
  }
  lastToast = toast
  listener?.(toast)
}

export function clearActionToast() {
  lastToast = null
  listener?.(null)
}
