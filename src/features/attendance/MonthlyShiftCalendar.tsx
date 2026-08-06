import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import type { Employee } from '@/types'
import { localTodayIso } from '@/lib/dates'

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'flexible' | 'off'

export type ShiftAssignment = {
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  shiftType: ShiftType
  startTime: string
  endTime: string
  location: string
  notes?: string
}

interface MonthlyShiftCalendarProps {
  isHr: boolean
  employees: Employee[]
  shifts: ShiftAssignment[]
  onAssignShift: (shift: Omit<ShiftAssignment, 'id'>) => void
  onDeleteShift: (shiftId: string) => void
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const SHIFT_META: Record<
  ShiftType,
  { bg: string; text: string; border: string; label: string; start: string; end: string }
> = {
  morning: {
    bg: 'bg-[#2f66e0]/10',
    text: 'text-[#2f66e0]',
    border: 'border-[#2f66e0]/25',
    label: 'Morning',
    start: '08:00',
    end: '16:00',
  },
  afternoon: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Afternoon',
    start: '14:00',
    end: '22:00',
  },
  night: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    label: 'Night',
    start: '22:00',
    end: '06:00',
  },
  flexible: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Flexible',
    start: '09:00',
    end: '18:00',
  },
  off: {
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200',
    label: 'Off',
    start: '00:00',
    end: '00:00',
  },
}

const WORKPLACES = ['Main office', 'Branch office', 'Remote']

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function dateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
}

export default function MonthlyShiftCalendar({
  isHr,
  employees,
  shifts,
  onAssignShift,
  onDeleteShift,
  addToast,
}: MonthlyShiftCalendarProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [monthIndex, setMonthIndex] = useState(now.getMonth())
  const [deptFilter, setDeptFilter] = useState('All')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAssign, setShowAssign] = useState(false)

  const [assignEmpId, setAssignEmpId] = useState(employees[0]?.apiId || employees[0]?.id || '')
  const [assignType, setAssignType] = useState<ShiftType>('morning')
  const [assignDate, setAssignDate] = useState(localTodayIso())
  const [assignStart, setAssignStart] = useState('08:00')
  const [assignEnd, setAssignEnd] = useState('16:00')
  const [assignLocation, setAssignLocation] = useState(WORKPLACES[0])
  const [assignNotes, setAssignNotes] = useState('')

  useEffect(() => {
    if (employees[0] && !assignEmpId) {
      setAssignEmpId(employees[0].apiId || employees[0].id)
    }
  }, [employees, assignEmpId])

  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department))
    return ['All', ...Array.from(set).sort()]
  }, [employees])

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const firstDay = new Date(year, monthIndex, 1).getDay()

  const filtered = useMemo(() => {
    return shifts.filter((s) => deptFilter === 'All' || s.department === deptFilter)
  }, [shifts, deptFilter])

  const byDate = useMemo(() => {
    const map: Record<string, ShiftAssignment[]> = {}
    for (const s of filtered) {
      ;(map[s.date] ??= []).push(s)
    }
    return map
  }, [filtered])

  const selectedShifts = selectedDate ? byDate[selectedDate] ?? [] : []

  const goPrev = () => {
    if (monthIndex === 0) {
      setMonthIndex(11)
      setYear((y) => y - 1)
    } else setMonthIndex((m) => m - 1)
  }

  const goNext = () => {
    if (monthIndex === 11) {
      setMonthIndex(0)
      setYear((y) => y + 1)
    } else setMonthIndex((m) => m + 1)
  }

  const goToday = () => {
    const t = new Date()
    setYear(t.getFullYear())
    setMonthIndex(t.getMonth())
    setSelectedDate(localTodayIso(t))
  }

  const openAssign = (dateStr: string) => {
    if (!isHr) {
      addToast('Only HR can schedule shifts.', 'info')
      return
    }
    if (employees.length === 0) {
      addToast('Load the directory before scheduling.', 'info')
      return
    }
    setAssignDate(dateStr)
    const meta = SHIFT_META[assignType]
    setAssignStart(meta.start)
    setAssignEnd(meta.end)
    setShowAssign(true)
  }

  const handleTypeChange = (type: ShiftType) => {
    setAssignType(type)
    setAssignStart(SHIFT_META[type].start)
    setAssignEnd(SHIFT_META[type].end)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const emp = employees.find((x) => x.apiId === assignEmpId || x.id === assignEmpId)
    if (!emp) {
      addToast('Pick an employee.', 'error')
      return
    }
    onAssignShift({
      employeeId: emp.apiId || emp.id,
      employeeName: emp.name,
      department: emp.department,
      date: assignDate,
      shiftType: assignType,
      startTime: assignStart,
      endTime: assignEnd,
      location: assignLocation,
      notes: assignNotes.trim() || undefined,
    })
    setShowAssign(false)
    setAssignNotes('')
    setSelectedDate(assignDate)
    addToast(`Scheduled ${emp.name} for ${assignDate}`, 'success')
  }

  const cells: ReactNode[] = []
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`pad-${i}`} className="min-h-24 bg-slate-50/40 rounded-xl" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(year, monthIndex, day)
    const dayShifts = byDate[key] ?? []
    const isToday = key === localTodayIso()
    const isSelected = key === selectedDate
    cells.push(
      <button
        key={key}
        type="button"
        onClick={() => setSelectedDate(key)}
        onDoubleClick={() => openAssign(key)}
        className={`min-h-24 rounded-xl border p-2 text-left transition-all ${
          isSelected
            ? 'border-[#2f66e0] bg-[#2f66e0]/5 shadow-sm'
            : isToday
              ? 'border-[#2f66e0]/35 bg-white'
              : 'border-slate-100 bg-white hover:border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-bold ${isToday ? 'text-[#2f66e0]' : 'text-slate-700'}`}>{day}</span>
          {isHr ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(ev) => {
                ev.stopPropagation()
                openAssign(key)
              }}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  ev.stopPropagation()
                  openAssign(key)
                }
              }}
              className="h-5 w-5 rounded-md text-slate-300 hover:text-[#2f66e0] hover:bg-[#2f66e0]/10 inline-flex items-center justify-center"
            >
              <Plus className="h-3 w-3" />
            </span>
          ) : null}
        </div>
        <div className="space-y-1">
          {dayShifts.slice(0, 3).map((s) => {
            const meta = SHIFT_META[s.shiftType]
            return (
              <div
                key={s.id}
                className={`truncate rounded-md px-1.5 py-0.5 text-[9px] font-bold border ${meta.bg} ${meta.text} ${meta.border}`}
                title={`${s.employeeName} · ${s.startTime}-${s.endTime}`}
              >
                {s.employeeName.split(' ')[0]} · {meta.label}
              </div>
            )
          })}
          {dayShifts.length > 3 ? (
            <p className="text-[9px] font-semibold text-slate-400">+{dayShifts.length - 3} more</p>
          ) : null}
        </div>
      </button>,
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="nv-panel p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center p-1 rounded-xl border border-slate-200 bg-slate-50">
              <button type="button" onClick={goPrev} className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goToday}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded-lg"
              >
                Today
              </button>
              <button type="button" onClick={goNext} className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight inline-flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#2f66e0]" />
              {MONTH_NAMES[monthIndex]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-9 text-xs font-bold bg-white border border-slate-200 rounded-xl px-3"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All departments' : d}
                </option>
              ))}
            </select>
            {isHr ? (
              <button type="button" onClick={() => openAssign(localTodayIso())} className="nv-btn-primary h-9">
                <Plus className="h-3.5 w-3.5" />
                Schedule
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(SHIFT_META) as ShiftType[]).map((key) => {
            const meta = SHIFT_META[key]
            return (
              <span
                key={key}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${meta.bg} ${meta.text} ${meta.border}`}
              >
                {meta.label}
              </span>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">{cells}</div>

      {selectedDate ? (
        <div className="nv-panel p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900">Shifts on {selectedDate}</h4>
            {isHr ? (
              <button type="button" onClick={() => openAssign(selectedDate)} className="text-xs font-bold text-[#2f66e0]">
                Add shift
              </button>
            ) : null}
          </div>
          {selectedShifts.length === 0 ? (
            <p className="text-xs text-slate-500">No shifts scheduled for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedShifts.map((s) => {
                const meta = SHIFT_META[s.shiftType]
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{s.employeeName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        <span className={`${meta.text} font-semibold`}>{meta.label}</span>
                        {' · '}
                        {s.startTime}–{s.endTime}
                        {' · '}
                        {s.location}
                      </p>
                    </div>
                    {isHr ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteShift(s.id)
                          addToast('Shift removed.', 'success')
                        }}
                        className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-50 inline-flex items-center justify-center"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      <p className="text-[11px] text-slate-400 px-1">
        Roster planning is saved on this device until a scheduling API ships. Live punches still come from
        the time clock.
      </p>

      {showAssign ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <form onSubmit={handleSubmit} className="w-full max-w-md nv-panel shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Schedule shift</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Device-local until API is ready</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssign(false)}
                className="h-8 w-8 rounded-lg border border-slate-100 text-slate-500 inline-flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">Employee</span>
                <select
                  value={assignEmpId}
                  onChange={(e) => setAssignEmpId(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                >
                  {employees.map((e) => (
                    <option key={e.apiId || e.id} value={e.apiId || e.id}>
                      {e.name} · {e.department}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Date</span>
                  <input
                    type="date"
                    value={assignDate}
                    onChange={(e) => setAssignDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Shift</span>
                  <select
                    value={assignType}
                    onChange={(e) => handleTypeChange(e.target.value as ShiftType)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  >
                    {(Object.keys(SHIFT_META) as ShiftType[]).map((k) => (
                      <option key={k} value={k}>
                        {SHIFT_META[k].label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Start</span>
                  <input
                    type="time"
                    value={assignStart}
                    onChange={(e) => setAssignStart(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500">End</span>
                  <input
                    type="time"
                    value={assignEnd}
                    onChange={(e) => setAssignEnd(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  />
                </label>
              </div>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">Location</span>
                <select
                  value={assignLocation}
                  onChange={(e) => setAssignLocation(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                >
                  {WORKPLACES.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">Notes</span>
                <input
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  placeholder="Optional"
                />
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAssign(false)}
                  className="h-9 px-3.5 text-xs font-bold border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="nv-btn-primary h-9">
                  <Clock className="h-3.5 w-3.5" />
                  Save shift
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export function loadShifts(): ShiftAssignment[] {
  try {
    const raw = localStorage.getItem('novora.attendance.shifts')
    if (!raw) return []
    const parsed = JSON.parse(raw) as ShiftAssignment[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveShifts(shifts: ShiftAssignment[]) {
  try {
    localStorage.setItem('novora.attendance.shifts', JSON.stringify(shifts))
  } catch {
    // ignore quota
  }
}
