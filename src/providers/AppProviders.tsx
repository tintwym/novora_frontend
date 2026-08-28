'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '@/providers/AuthProvider'

export default function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
