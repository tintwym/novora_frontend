'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginPage } from '@/features/auth'
import { useAuth } from '@/providers/AuthProvider'
import { portalHomePath } from '@/lib/roles'

export default function LoginRoute() {
  const { session, handleAuthSuccess } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace(portalHomePath(session.roles))
    }
  }, [session, router])

  // Show the form immediately — do not wait for bootstrap /me (that blocked the page on cold starts).
  if (session) return null

  return (
    <LoginPage
      onSuccess={handleAuthSuccess}
      onGoRegister={() => router.push('/register')}
      onGoLanding={() => router.push('/')}
    />
  )
}
