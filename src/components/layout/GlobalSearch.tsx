import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, CornerDownLeft, Loader2, Search, Sparkles, User } from 'lucide-react'
import type { Employee, SidebarTab } from '@/types'
import { canAccessTab } from '@/lib/roles'
import { MAIN_NAV_SECTIONS, navLabel } from '@/lib/sidebarNav'
import { ApiError, askPolicyAssistant, type PolicyQaResponse } from '@/services'

interface GlobalSearchProps {
  value: string
  onChange: (val: string) => void
  roles: string[] | undefined
  employees: Employee[]
  onNavigate: (tab: SidebarTab) => void
  onSelectEmployee: (emp: Employee) => void
}

type ResultItem =
  | { kind: 'ai'; key: string }
  | { kind: 'module'; key: string; tab: SidebarTab; hint?: string }
  | { kind: 'employee'; key: string; emp: Employee }

const MAX_QUESTION_LENGTH = 500

/** Plain-language phrases people type, mapped to the module that handles them. */
const INTENTS: { tab: SidebarTab; words: string[]; hint: string }[] = [
  { tab: 'Leave Management', words: ['leave', 'vacation', 'holiday', 'sick', 'time off', 'annual', 'maternity', 'absence'], hint: 'Leave requests and balances' },
  { tab: 'Payroll Management', words: ['payslip', 'salary', 'pay', 'payroll', 'tax', 'bonus', 'wage', 'deduction'], hint: 'Payslips, salary and tax' },
  { tab: 'Claims Management', words: ['claim', 'reimburse', 'expense', 'receipt', 'travel', 'mileage'], hint: 'Expense claims' },
  { tab: 'Attendance Management', words: ['attendance', 'punch', 'clock', 'shift', 'roster', 'overtime', 'timesheet', 'late'], hint: 'Punches, rosters and overtime' },
  { tab: 'Recruitment Management', words: ['hire', 'hiring', 'candidate', 'interview', 'job', 'vacancy', 'applicant', 'offer'], hint: 'Jobs, candidates and interviews' },
  { tab: 'On/Off-boarding Management', words: ['onboard', 'offboard', 'new joiner', 'resign', 'exit', 'checklist'], hint: 'Joiner and leaver checklists' },
  { tab: 'Performance Management', words: ['review', 'appraisal', 'goal', 'kpi', 'okr', 'feedback', 'performance'], hint: 'Reviews and goals' },
  { tab: 'Learning Management', words: ['course', 'learning', 'certificate', 'certification', 'e-learning'], hint: 'Courses and certificates' },
  { tab: 'Training Management', words: ['training', 'workshop', 'session', 'enrol', 'enroll'], hint: 'Training sessions' },
  { tab: 'Benefits Management', words: ['benefit', 'insurance', 'medical', 'health', 'dental', 'wellness'], hint: 'Insurance and benefits' },
  { tab: 'Assets Management', words: ['asset', 'laptop', 'device', 'phone', 'equipment', 'monitor'], hint: 'Company equipment' },
  { tab: 'Disciplinary Management', words: ['warning', 'misconduct', 'disciplinary', 'grievance', 'investigation'], hint: 'Cases and warnings' },
  { tab: 'Helpdesk & Inquiries Management', words: ['ticket', 'help', 'support', 'inquiry', 'question', 'policy'], hint: 'Tickets and HR questions' },
  { tab: 'Engagement Management', words: ['survey', 'pulse', 'engagement', 'morale', 'recognition'], hint: 'Surveys and recognition' },
  { tab: 'Employees Management', words: ['employee', 'staff', 'profile', 'directory', 'org chart', 'team'], hint: 'Directory and profiles' },
  { tab: 'Reports', words: ['report', 'analytics', 'export', 'headcount'], hint: 'Reports and exports' },
]

const QUESTION_START = /^(how|what|when|where|why|who|which|can|could|do|does|is|are|am|should|will|may|tell|explain)\b/i

function looksLikeQuestion(q: string): boolean {
  return q.endsWith('?') || QUESTION_START.test(q) || q.split(/\s+/).length >= 5
}

export default function GlobalSearch({
  value,
  onChange,
  roles,
  employees,
  onNavigate,
  onSelectEmployee,
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [busy, setBusy] = useState(false)
  const [answer, setAnswer] = useState<{ question: string; reply: PolicyQaResponse } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const query = value.trim()
  const lower = query.toLowerCase()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  const items = useMemo<ResultItem[]>(() => {
    if (!query) return []

    const modules: ResultItem[] = []
    const seen = new Set<SidebarTab>()
    const allowed = MAIN_NAV_SECTIONS.flatMap((s) => s.items)
      .map((i) => i.name)
      .filter((tab) => tab !== 'Settings' && canAccessTab(roles, tab))

    for (const tab of allowed) {
      if (navLabel(tab).toLowerCase().includes(lower)) {
        seen.add(tab)
        modules.push({ kind: 'module', key: `m-${tab}`, tab })
      }
    }
    for (const intent of INTENTS) {
      if (seen.has(intent.tab) || !allowed.includes(intent.tab)) continue
      if (intent.words.some((w) => new RegExp(`\\b${w}`).test(lower))) {
        seen.add(intent.tab)
        modules.push({ kind: 'module', key: `m-${intent.tab}`, tab: intent.tab, hint: intent.hint })
      }
    }

    const people: ResultItem[] = employees
      .filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.id.toLowerCase().includes(lower) ||
          (e.position || '').toLowerCase().includes(lower),
      )
      .slice(0, 5)
      .map((emp) => ({ kind: 'employee', key: `e-${emp.apiId || emp.id}`, emp }))

    const ai: ResultItem = { kind: 'ai', key: 'ai' }
    return looksLikeQuestion(query)
      ? [ai, ...modules.slice(0, 4), ...people]
      : [...modules.slice(0, 4), ...people, ai]
  }, [query, lower, roles, employees])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const askAi = async () => {
    if (!query || busy) return
    setBusy(true)
    setError(null)
    try {
      const reply = await askPolicyAssistant(query.slice(0, MAX_QUESTION_LENGTH))
      setAnswer({ question: query, reply })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'The assistant is unavailable right now.')
    } finally {
      setBusy(false)
    }
  }

  const choose = (item: ResultItem) => {
    if (item.kind === 'ai') {
      void askAi()
      return
    }
    setOpen(false)
    setAnswer(null)
    onChange('')
    if (item.kind === 'module') onNavigate(item.tab)
    else onSelectEmployee(item.emp)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (!items.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => (i + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + items.length) % items.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = items[activeIndex]
      if (item) choose(item)
    }
  }

  const showPanel = open && query.length > 0
  const showAnswer = answer !== null && answer.question === query

  return (
    <div ref={wrapRef} id="topbar-search-container" className="nv-search-wrap relative hidden md:block md:w-52 xl:w-80">
      <Search className="nv-search-icon h-4 w-4" aria-hidden />
      <input
        ref={inputRef}
        id="topbar-search-input"
        type="search"
        placeholder="Search or ask AI…"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setError(null)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="nv-search-input"
        aria-label="Search employees and modules, or ask the HR assistant"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="topbar-search-results"
        autoComplete="off"
      />

      {showPanel && (
        <div
          id="topbar-search-results"
          role="listbox"
          className="absolute right-0 top-full mt-2 w-[min(28rem,calc(100vw-2rem))] nv-card shadow-xl py-2 z-50 max-h-[70vh] overflow-y-auto"
        >
          {items.map((item, idx) => {
            const active = idx === activeIndex
            const base = `w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors ${
              active ? 'bg-slate-50' : 'hover:bg-slate-50'
            }`

            if (item.kind === 'ai') {
              return (
                <button
                  key={item.key}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => choose(item)}
                  className={`${base} ${idx > 0 ? 'border-t border-slate-100 mt-1' : ''}`}
                >
                  <span className="h-8 w-8 rounded-lg bg-novora/10 text-novora flex items-center justify-center shrink-0">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800">Ask Novora AI</span>
                    <span className="block text-[11px] text-slate-500 truncate">&ldquo;{query}&rdquo;</span>
                  </span>
                  {active && <CornerDownLeft className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                </button>
              )
            }

            if (item.kind === 'module') {
              return (
                <button
                  key={item.key}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => choose(item)}
                  className={base}
                >
                  <span className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800">Go to {navLabel(item.tab)}</span>
                    {item.hint && <span className="block text-[11px] text-slate-500 truncate">{item.hint}</span>}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.key}
                type="button"
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => choose(item)}
                className={base}
              >
                <span className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-800 truncate">{item.emp.name}</span>
                  <span className="block text-[11px] text-slate-500 truncate">
                    {[item.emp.position, item.emp.department].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </button>
            )
          })}

          {error && (
            <p role="alert" className="px-4 pt-2 text-[11px] font-bold text-rose-600">
              {error}
            </p>
          )}

          {showAnswer && answer && (
            <div className="mx-3 mt-2 rounded-xl border border-novora/15 bg-novora/5 p-3 space-y-2" aria-live="polite">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-novora" />
                <span className="text-[10px] font-black uppercase tracking-wider text-novora">AI answer</span>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed select-text">{answer.reply.answer}</p>
              {answer.reply.sources.length > 0 && (
                <p className="text-[10px] font-bold text-slate-400">Based on: {answer.reply.sources.join(', ')}</p>
              )}
              <p className="text-[10px] italic text-slate-400">{answer.reply.disclaimer}</p>
            </div>
          )}

          <p className="px-4 pt-2 mt-1 text-[10px] text-slate-400 border-t border-slate-50">
            ↑↓ to move · Enter to open or ask · Esc to close · ⌘K / Ctrl+K to search
          </p>
        </div>
      )}
    </div>
  )
}
