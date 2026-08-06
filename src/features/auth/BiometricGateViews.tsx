import { useEffect, useRef, useState } from 'react'
import { Fingerprint, Loader2, Lock } from 'lucide-react'
import BrandLockup from '@/components/brand/BrandLockup'
import {
  enrollPlatformPasskey,
  isWebAuthnAvailable,
  unlockWithPlatformPasskey,
} from './biometricGate'

type EnrollProps = {
  userId: string
  displayName: string
  email: string
  onEnrolled: () => void
  onSkip: () => void
}

export function BiometricEnrollOverlay({
  userId,
  displayName,
  email,
  onEnrolled,
  onSkip,
}: EnrollProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const available = isWebAuthnAvailable()

  const register = async () => {
    if (!available) {
      onSkip()
      return
    }
    setBusy(true)
    setError(null)
    try {
      await enrollPlatformPasskey(userId, displayName, email)
      onEnrolled()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register fingerprint passkey.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans px-6">
      <div className="w-full max-w-md animate-soft-fade-up text-center space-y-6">
        <BrandLockup size="md" className="justify-center" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2f66e0]/10 text-[#2f66e0]">
          <Fingerprint className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Register fingerprint</h1>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Hi {displayName}. Optionally register a fingerprint passkey to unlock Novora next time.
            Your session is already signed in — you can skip this.
          </p>
        </div>
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        {!available ? (
          <p className="text-sm text-slate-500">
            This browser does not support fingerprint / WebAuthn. Continue without it.
          </p>
        ) : null}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => void register()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f66e0] px-4 py-3 text-sm font-bold text-white hover:bg-[#2554c0] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {available ? 'Register fingerprint passkey' : 'Continue without fingerprint'}
          </button>
          {available ? (
            <button
              type="button"
              disabled={busy}
              onClick={onSkip}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Skip for now
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

type UnlockProps = {
  userId: string
  displayName: string
  onUnlocked: () => void
  onSkip: () => void
}

export function BiometricUnlockOverlay({ userId, displayName, onUnlocked, onSkip }: UnlockProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const prompted = useRef(false)

  const unlock = async () => {
    setBusy(true)
    setError(null)
    try {
      await unlockWithPlatformPasskey(userId)
      onUnlocked()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not unlock with fingerprint.')
    } finally {
      setBusy(false)
    }
  }

  // Prompt once after first paint without cascading setState from an effect body.
  useEffect(() => {
    if (prompted.current) return
    prompted.current = true
    if (!isWebAuthnAvailable()) return
    const id = window.setTimeout(() => {
      void unlock()
    }, 0)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prompt once on mount
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans px-6">
      <div className="w-full max-w-md animate-soft-fade-up text-center space-y-6">
        <BrandLockup size="md" className="justify-center" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2f66e0]/10 text-[#2f66e0]">
          <Lock className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Unlock Novora</h1>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Welcome back, {displayName}. Use your fingerprint passkey, or continue with your signed-in
            session.
          </p>
        </div>
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => void unlock()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f66e0] px-4 py-3 text-sm font-bold text-white hover:bg-[#2554c0] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
            Unlock with fingerprint
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onSkip}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Continue without fingerprint
          </button>
        </div>
      </div>
    </div>
  )
}
