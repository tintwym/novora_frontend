import type { DashboardData } from '../../types/dashboard'
import { AbsenceQueueCard } from './AbsenceQueueCard'
import { AttendanceDonutCard } from './AttendanceDonutCard'
import { PayrollSummaryCard } from './PayrollSummaryCard'
import { RecentHiresCard } from './RecentHiresCard'
import { StatGrid } from './StatCard'
import { TimeTrackingCard } from './TimeTrackingCard'
import { WorkforceTrendsCard } from './WorkforceTrendsCard'

type DashboardAdminBodyProps = {
  data: DashboardData
  growthLoading?: boolean
  onGrowthPeriodChange: (months: number) => void
}

export function DashboardAdminBody({
  data,
  growthLoading,
  onGrowthPeriodChange,
}: DashboardAdminBodyProps) {
  return (
    <div className="dash-page">
      <StatGrid items={data.statItems} />

      <div className="dash-mid-row">
        <WorkforceTrendsCard
          points={data.growthPoints}
          labels={data.monthLabels}
          growthMonths={data.growthMonths}
          loading={growthLoading}
          onPeriodChange={onGrowthPeriodChange}
        />
        <AttendanceDonutCard slices={data.attendanceSlices} ratePercent={data.attendanceRatePercent} />
        <TimeTrackingCard />
      </div>

      <div className="dash-bottom-row">
        <RecentHiresCard hires={data.recentHires} />
        <AbsenceQueueCard requests={data.leaveRequests} />
        <PayrollSummaryCard payroll={data.payroll} />
      </div>
    </div>
  )
}
