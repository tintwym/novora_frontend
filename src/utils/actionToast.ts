const TOAST_HOST_ID = 'novora-action-toast-host'
const TOAST_DURATION_MS = 2800

export function showActionToast(message: string) {
  let host = document.getElementById(TOAST_HOST_ID)
  if (!host) {
    host = document.createElement('div')
    host.id = TOAST_HOST_ID
    host.className = 'action-toast-host'
    host.setAttribute('aria-live', 'polite')
    host.setAttribute('aria-atomic', 'true')
    document.body.appendChild(host)
  }

  const toast = document.createElement('div')
  toast.className = 'action-toast'
  toast.textContent = message
  host.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('action-toast-visible'))

  window.setTimeout(() => {
    toast.classList.remove('action-toast-visible')
    window.setTimeout(() => toast.remove(), 280)
  }, TOAST_DURATION_MS)
}
