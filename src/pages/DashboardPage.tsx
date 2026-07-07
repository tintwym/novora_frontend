import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchAdminDashboard, fetchEmployeeDashboard, fetchGrowthOnly } from '../api/dashboard'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { DashboardAdminBody } from '../components/dashboard/DashboardAdminBody'
import { NovoraBrand } from '../components/brand/NovoraLogo'
import type { DashboardData } from '../types/dashboard'

export function DashboardPage() {
  const { user } = useAuth()
  const employeeView = user?.isEmployee ?? false
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [growthLoading, setGrowthLoading] = useState(false)
  const loadSeq = useRef(0)

  const load = useCallback(async () => {
    const seq = ++loadSeq.current
    setError(null)
    try {
      const next = employeeView ? await fetchEmployeeDashboard() : await fetchAdminDashboard()
      if (seq === loadSeq.current) setData(next)
    } catch (e) {
      if (seq === loadSeq.current) {
        setData(null)
        setError(e instanceof ApiError ? e.message : 'Failed to load dashboard')
      }
    }
  }, [employeeView])

  useEffect(() => {
    void load()
  }, [load])

  const onGrowthPeriodChange = useCallback(
    async (months: number) => {
      if (!data) return
      const seq = ++loadSeq.current
      setGrowthLoading(true)
      try {
        const growth = await fetchGrowthOnly(employeeView, months)
        if (seq !== loadSeq.current) return
        setData((prev) =>
          prev
            ? {
                ...prev,
                growthMonths: months,
                growthPoints: growth.growthPoints,
                monthLabels: growth.monthLabels,
              }
            : prev,
        )
      } catch (e) {
        if (seq === loadSeq.current) {
          setError(e instanceof ApiError ? e.message : 'Failed to update growth chart')
        }
      } finally {
        if (seq === loadSeq.current) setGrowthLoading(false)
      }
    },
    [data, employeeView],
  )

  if (error) {
    return (
      <div className="boot-screen">
        <p>{error}</p>
        <button type="button" className="btn-primary" onClick={() => void load()}>
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="boot-screen">
        <NovoraBrand size="sm" showTagline={false} />
        <div className="boot-spinner" aria-hidden />
        <p>Loading dashboard…</p>
      </div>
    )
  }

  return (
    <DashboardAdminBody
      data={data}
      growthLoading={growthLoading}
      onGrowthPeriodChange={(months) => void onGrowthPeriodChange(months)}
    />
  )
}
