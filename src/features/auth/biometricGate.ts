/**
 * Device-local WebAuthn (platform authenticator / fingerprint) gate.
 * First login registers a passkey-style credential; later visits unlock with it.
 * Session cookies still authenticate the API — this only unlocks the UI.
 */

const BIOMETRIC_STORAGE_KEY = 'novora.webauthn.enrollment'
const BIOMETRIC_SESSION_UNLOCK_KEY = 'novora.webauthn.sessionUnlocked'

export type BiometricEnrollment = {
  userId: string
  credentialId: string
}

/** UI unlock for this browser tab session (API cookie still authenticates). */
export function isSessionBiometricUnlocked(userId: string): boolean {
  try {
    return sessionStorage.getItem(BIOMETRIC_SESSION_UNLOCK_KEY) === userId
  } catch {
    return false
  }
}

export function markSessionBiometricUnlocked(userId: string): void {
  try {
    sessionStorage.setItem(BIOMETRIC_SESSION_UNLOCK_KEY, userId)
  } catch {
    // private mode / blocked storage
  }
}

export function clearSessionBiometricUnlocked(): void {
  try {
    sessionStorage.removeItem(BIOMETRIC_SESSION_UNLOCK_KEY)
  } catch {
    // ignore
  }
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBuffer(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function textEncoderBytes(value: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(value) as Uint8Array<ArrayBuffer>
}

function randomChallenge(): ArrayBuffer {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return bytes.buffer
}

export function isWebAuthnAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential && !!navigator.credentials
}

export function loadEnrollment(): BiometricEnrollment | null {
  try {
    const raw = localStorage.getItem(BIOMETRIC_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BiometricEnrollment
    if (!parsed?.userId || !parsed?.credentialId) return null
    return parsed
  } catch {
    return null
  }
}

export function isEnrolledFor(userId: string): boolean {
  return loadEnrollment()?.userId === userId
}

export function saveEnrollment(enrollment: BiometricEnrollment): void {
  localStorage.setItem(BIOMETRIC_STORAGE_KEY, JSON.stringify(enrollment))
}

export function clearEnrollment(): void {
  localStorage.removeItem(BIOMETRIC_STORAGE_KEY)
}

export async function enrollPlatformPasskey(userId: string, displayName: string, email: string): Promise<void> {
  if (!isWebAuthnAvailable()) {
    throw new Error('Fingerprint / passkey is not supported in this browser.')
  }

  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge: randomChallenge(),
      rp: {
        name: 'Novora HRMS',
        id: window.location.hostname,
      },
      user: {
        id: textEncoderBytes(userId),
        name: email,
        displayName,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60_000,
      attestation: 'none',
    },
  })) as PublicKeyCredential | null

  if (!credential) {
    throw new Error('Passkey registration was cancelled.')
  }

  saveEnrollment({
    userId,
    credentialId: bufferToBase64Url(credential.rawId),
  })
}

export async function unlockWithPlatformPasskey(userId: string): Promise<void> {
  if (!isWebAuthnAvailable()) {
    throw new Error('Fingerprint / passkey is not supported in this browser.')
  }

  const enrollment = loadEnrollment()
  if (!enrollment || enrollment.userId !== userId) {
    throw new Error('No passkey is registered for this account on this browser.')
  }

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomChallenge(),
      rpId: window.location.hostname,
      allowCredentials: [
        {
          type: 'public-key',
          id: base64UrlToBuffer(enrollment.credentialId),
          transports: ['internal'],
        },
      ],
      userVerification: 'required',
      timeout: 60_000,
    },
  })

  if (!assertion) {
    throw new Error('Unlock was cancelled.')
  }
}
