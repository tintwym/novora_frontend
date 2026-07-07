import { useEffect, useRef, useState } from 'react'
import { checkIn, checkOut, fetchMyAttendance, shortTime, todayIso } from '../../api/attendance'
import { ApiError } from '../../api/client'
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
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const loadSeq = useRef(0)

  const today = logs.find((l) => l.workDate === todayIso())
  const canCheckIn = !loading && !today?.checkInTime
  const canCheckOut = !loading && today?.checkInTime && !today?.checkOutTime
  const status = !today?.checkInTime ? 'Standby' : today?.checkOutTime ? 'Complete' : 'Active'

  async function load() {
    const seq = ++loadSeq.current
    setLoading(true)
    const result = await fetchMyAttendance()
    if (seq !== loadSeq.current) return
    if (result.ok) {
      setLogs(result.logs)
      setError(null)
    } else {
      setLogs([])
      setError(result.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    void load()
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => {
      loadSeq.current += 1
      window.clearInterval(id)
    }
  }, [])

  async function onCheckIn() {
    setBusy(true)
    setActionError(null)
    try {
      await checkIn()
      await load()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Check-in failed')
    } finally {
      setBusy(false)
    }
  }

  async function onCheckOut() {
    setBusy(true)
    setActionError(null)
    try {
      await checkOut()
      await load()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Check-out failed')
    } finally {
      setBusy(false)
    }
  }

  const clock = now.toLocaleTimeString('en-GB', { hour12: false })
  const dateLabel = now
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase()

  return (
    <DashboardCard className="dash-time-card">
      <CardHeader title="TIME TRACKING" action={<LiveBadge />} />
      <div className="dash-time-head">
        <div>
          <p className="dash-clock">{clock}</p>
          <p className="dash-clock-date">{dateLabel}</p>
        </div>
        <div className="dash-status-pill">{status.toUpperCase()}</div>
      </div>
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
        <span>TOTAL SESSION TIME</span>
        <strong>{sessionLabel(today)}</strong>
      </div>
      {error ? <p className="dash-time-error">{error}</p> : null}
      {actionError ? <p className="dash-time-error">{actionError}</p> : null}
      <div className="dash-punch-actions">
        <button
          type="button"
          className="dash-punch-outline-btn"
          disabled={busy || !canCheckIn}
          onClick={() => void onCheckIn()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M12 11c1.66 0 3-1.34 3-3S13.66 5 12 5 9 6.34 9 8s1.34 3 3 3zM18 21v-1a5 5 0 00-5-5H11a5 5 0 00-5 5v1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M16 11l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          PUNCH IN
        </button>
        <button
          type="button"
          className="dash-punch-outline-btn"
          disabled={busy || !canCheckOut}
          onClick={() => void onCheckOut()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          PUNCH OUT
        </button>
      </div>
    </DashboardCard>
  )
}
