'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LandingPage from '@/features/landing/LandingPage'
import { useAuth } from '@/providers/AuthProvider'
import { portalHomePath } from '@/lib/roles'

export default function HomePage() {
  const { authReady, session } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authReady && session) {
      router.replace(portalHomePath(session.roles))
    }
  }, [authReady, session, router])

  if (!authReady) return null
  if (session) return null

  return (
    <LandingPage
      onSignIn={() => router.push('/login')}
      onStartTrial={() => router.push('/register')}
    />
  )
}
