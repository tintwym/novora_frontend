import { useEffect, useState } from 'react'
import { Toast, type ToastMessage } from '../ui/Toast'
import { clearActionToast, subscribeActionToast } from '../../utils/actionToast'

/** Mount once in AppShell so `showActionToast` drives the Downloads Toast UI. */
export function ToastHost() {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  useEffect(() => subscribeActionToast(setToast), [])

  return <Toast toast={toast} onClose={clearActionToast} />
}
