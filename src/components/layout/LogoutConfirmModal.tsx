import { useEffect, useId, useState } from 'react'

type LogoutConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function LogoutConfirmModal({ open, onClose, onConfirm }: LogoutConfirmModalProps) {
  const titleId = useId()
  const descId = useId()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setLoading(false)
      return
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, loading, onClose])

  if (!open) return null

  async function handleConfirm() {
    if (loading) return
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell-modal-overlay" role="presentation" onClick={loading ? undefined : onClose}>
      <div
        className="shell-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shell-modal-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 id={titleId}>Log out?</h2>
        <p id={descId}>You will need to sign in again to access your Novora workspace.</p>
        <div className="shell-modal-actions">
          <button type="button" className="shell-modal-btn ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="shell-modal-btn danger" onClick={() => void handleConfirm()} disabled={loading}>
            {loading ? 'Signing out…' : 'Log out'}
          </button>
        </div>
      </div>
    </div>
  )
}
