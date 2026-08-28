'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterPage } from '@/features/auth'
import { useAuth } from '@/providers/AuthProvider'
import { portalHomePath } from '@/lib/roles'

export default function RegisterRoute() {
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
    <RegisterPage
      onSuccess={handleAuthSuccess}
      onGoLogin={() => router.push('/login')}
      onGoLanding={() => router.push('/')}
    />
  )
}
