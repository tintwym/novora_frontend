import { useCallback, useEffect, useState } from 'react'
import { fetchAdminDashboard, fetchEmployeeDashboard, fetchGrowthOnly } from '../api/dashboard'
import { useAuth } from '../auth/AuthContext'
import { DashboardAdminBody } from '../components/dashboard/DashboardAdminBody'
import type { DashboardData } from '../types/dashboard'

export function DashboardPage() {
  const { user } = useAuth()
  const employeeView = user?.isEmployee ?? false
  const [data, setData] = useState<DashboardData | null>(null)
  const [growthLoading, setGrowthLoading] = useState(false)

  const load = useCallback(async () => {
    const next = employeeView ? await fetchEmployeeDashboard() : await fetchAdminDashboard()
    setData(next)
  }, [employeeView])

  useEffect(() => {
    void load()
  }, [load])

  const onGrowthPeriodChange = useCallback(
    async (months: number) => {
      if (!data) return
      setGrowthLoading(true)
      try {
        const growth = await fetchGrowthOnly(employeeView, months)
        setData({
          ...data,
          growthMonths: months,
          growthPoints: growth.growthPoints,
          monthLabels: growth.monthLabels,
        })
      } finally {
        setGrowthLoading(false)
      }
    },
    [data, employeeView],
  )

  if (!data) {
    return (
      <div className="boot-screen">
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
