import { useEffect, useState } from 'react'
import { checkIn, checkOut, fetchMyAttendance, shortTime, todayIso } from '../../api/attendance'
import type { AttendanceLog } from '../../types/dashboard'
import { CardHeader, DashboardCard, LiveBadge } from './DashboardCard'

function sessionLabel(today: AttendanceLog | undefined): string {
  if (!today?.checkInTime) return '0h 0m'
  const h = today.workHours
  if (h == null) return '0h 0m'
  const hours = Math.floor(h)
  const mins = Math.round((h - hours) * 60)
  return `${hours}h ${mins}m`
}

export function TimeTrackingCard() {
  const [now, setNow] = useState(() => new Date())
  const [logs, setLogs] = useState<AttendanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const today = logs.find((l) => l.workDate === todayIso())
  const canCheckIn = !loading && !today?.checkInTime
  const canCheckOut = !loading && today?.checkInTime && !today?.checkOutTime
  const status = !today?.checkInTime ? 'Standby' : today?.checkOutTime ? 'Complete' : 'Active'

  async function load() {
    setLoading(true)
    const list = await fetchMyAttendance()
    setLogs(list)
    setLoading(false)
  }

  useEffect(() => {
    void load()
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  async function onCheckIn() {
    setBusy(true)
    try {
      await checkIn()
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function onCheckOut() {
    setBusy(true)
    try {
      await checkOut()
      await load()
    } finally {
      setBusy(false)
    }
  }

  const clock = now.toLocaleTimeString('en-GB', { hour12: false })
  const dateLabel = now
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase()

  return (
    <DashboardCard>
      <CardHeader title="TIME TRACKING" action={<LiveBadge />} />
      <p className="dash-clock">{clock}</p>
      <p className="dash-clock-date">{dateLabel}</p>
      <div className="dash-status-pill">{status.toUpperCase()}</div>
      <div className="dash-punch-row">
        <div className="dash-punch-box">
          <span>CLOCK IN</span>
          <strong>{shortTime(today?.checkInTime ?? null)}</strong>
        </div>
        <div className="dash-punch-box">
          <span>CLOCK OUT</span>
          <strong>{shortTime(today?.checkOutTime ?? null)}</strong>
        </div>
      </div>
      <div className="dash-session-bar">
        <span>Total session time</span>
        <strong>{sessionLabel(today)}</strong>
      </div>
      <div className="dash-punch-actions">
        <button
          type="button"
          className="btn-primary dash-punch-btn"
          disabled={busy || !canCheckIn}
          onClick={() => void onCheckIn()}
        >
          Punch In
        </button>
        <button
          type="button"
          className="btn-outline dash-punch-btn"
          disabled={busy || !canCheckOut}
          onClick={() => void onCheckOut()}
        >
          Punch Out
        </button>
      </div>
    </DashboardCard>
  )
}
