'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { parsePortalId, portalHomePath } from '@/lib/roles'

export default function PortalIndexPage() {
  const params = useParams<{ portal: string }>()
  const router = useRouter()
  const { authReady, session } = useAuth()

  useEffect(() => {
    if (!authReady) return
    if (!session) {
      router.replace('/login')
      return
    }
    const portal = parsePortalId(params.portal)
    if (portal === 'admin' || portal === 'hr' || portal === 'employee') {
      router.replace(`/${portal}/dashboard`)
      return
    }
    router.replace(portalHomePath(session.roles))
  }, [authReady, session, params.portal, router])

  return null
}
