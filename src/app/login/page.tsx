'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginPage } from '@/features/auth'
import { useAuth } from '@/providers/AuthProvider'
import { portalHomePath } from '@/lib/roles'

export default function LoginRoute() {
  const { authReady, session, handleAuthSuccess } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authReady && session) {
      router.replace(portalHomePath(session.roles))
    }
  }, [authReady, session, router])

  if (!authReady) return null
  if (session) return null

  return (
    <LoginPage
      onSuccess={handleAuthSuccess}
      onGoRegister={() => router.push('/register')}
      onGoLanding={() => router.push('/')}
    />
  )
}
