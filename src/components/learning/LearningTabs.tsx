import { useMemo, useState } from 'react'
import {
  COMPLETION_TEAMS,
  LEARNING_ASSESSMENTS,
  LEARNING_CERTS,
  LEARNING_CHAMPIONS,
  LEARNING_COURSES,
  LEARNING_PATHS,
  PATH_BUNDLE_OPTIONS,
} from '../../data/mockLearning'
import type { LearningCourse, LearningPath } from '../../types/learning'
import { RecruitIconKpi } from '../recruitment/RecruitmentPrimitives'
import { ImportScormModal } from './LearningModals'
import {
  LrnCard,
  LrnOutlineBtn,
  LrnPill,
  LrnPrimaryBtn,
  LrnProgressBar,
  LrnSearchInput,
  LrnSectionHead,
  LrnSelect,
  LrnTableScroll,
} from './LearningShared'

export function LearningCatalogTab() {
  const [courses, setCourses] = useState<LearningCourse[]>(LEARNING_COURSES)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [provider, setProvider] = useState('All Providers')
  const [importOpen, setImportOpen] = useState(false)

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return courses.filter((c) => {
      if (category !== 'All Categories' && c.category !== category) return false
      if (provider !== 'All Providers' && c.provider !== provider) return false
      if (q) {
        const hay = `${c.title} ${c.instructor} ${c.category} ${c.provider}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [courses, search, category, provider])

  function enroll(id: string) {
    setCourses((list) => list.map((c) => (c.id === id ? { ...c, enrolled: true } : c)))
  }

  function study(id: string) {
    setCourses((list) =>
      list.map((c) => {
        if (c.id !== id || !c.enrolled || c.completed) return c
        const next = Math.min(100, c.progress + 20)
        return { ...c, progress: next, completed: next >= 100 }
      }),
    )
  }

  return (
    <div className="lrn-tab">
      <div className="lrn-kpi-row">
        <RecruitIconKpi title="CATALOG INVENTORY SIZE" value={`${courses.length}`} subtext="courses deployed" icon="📚" iconColor="#2563eb" />
        <RecruitIconKpi title="MY CURRENT CLASSES" value="3" subtext="active courses" icon="✓" iconColor="#059669" />
        <RecruitIconKpi title="AVERAGE COMPLETION PROGRESS" value="53%" subtext="certified" icon="🎖" iconColor="#7c3aed" />
        <RecruitIconKpi title="COMPLIANCE RISKS PENDING" value="2" subtext="require attention" icon="⚠" iconColor="#dc2626" valueTone="danger" />
      </div>

      <LrnCard className="lrn-toolbar-card">
        <LrnSearchInput placeholder="Query title or instructor..." value={search} onChange={setSearch} />
        <div className="lrn-toolbar-actions">
          <select className="lrn-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category filter">
            {['All Categories', 'ENGINEERING', 'GENERAL', 'HR', 'MARKETING', 'FINANCE', 'OPERATIONS'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select className="lrn-select" value={provider} onChange={(e) => setProvider(e.target.value)} aria-label="Provider filter">
            {['All Providers', 'LinkedIn', 'Internal', 'Coursera', 'Udemy'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <LrnPrimaryBtn onClick={() => setImportOpen(true)}>⬆ Import SCORM/xAPI Packet</LrnPrimaryBtn>
        </div>
      </LrnCard>

      <LrnCard className="lrn-integration-hub">
        <div>
          <span className="lrn-section-title sm muted">ENTERPRISE LMS INTEGRATION HUB</span>
          <p className="lrn-muted sm">Instantly sync third-party curriculum content indexes</p>
        </div>
        <div className="lrn-integration-links">
          <button type="button" className="lrn-link-btn">
            ↗ Connect LinkedIn Learning
          </button>
          <button type="button" className="lrn-link-btn">
            ↗ Connect Coursera
          </button>
          <button type="button" className="lrn-link-btn">
            ↗ Connect Udemy Business
          </button>
        </div>
      </LrnCard>

      <div className="lrn-course-grid">
        {visible.map((course) => (
          <LrnCard key={course.id} className="lrn-course-card">
            <div className="lrn-course-head">
              <LrnPill label={course.category} tone="info" />
              <span className="lrn-rating">
                ★ {course.rating}
              </span>
            </div>
            <h4>{course.title}</h4>
            <p className="lrn-muted sm">Instructed by: {course.instructor}</p>
            <div className="lrn-course-meta">
              <div>
                <span className="lrn-meta-label">DURATION</span>
                <strong>{course.duration}</strong>
              </div>
              <div>
                <span className="lrn-meta-label">FORMAT</span>
                <strong>{course.format}</strong>
              </div>
              <div>
                <span className="lrn-meta-label">PROVIDER</span>
                <strong className="tone-primary">{course.provider}</strong>
              </div>
            </div>
            <div className="lrn-progress-head">
              <span className="lrn-muted sm">Course Progress</span>
              <strong>{course.progress}%</strong>
            </div>
            <LrnProgressBar pct={course.progress} />
            <div className="lrn-course-foot">
              <span className="lrn-muted sm">ID: {course.id}</span>
              <div className="lrn-course-actions">
                {(course.enrolled || course.completed) && (
                  <button type="button" className="lrn-link-btn">
                    Withdraw
                  </button>
                )}
                {course.completed ? (
                  <button type="button" className="lrn-success-btn">
                    ✓ Completed
                  </button>
                ) : course.enrolled ? (
                  <LrnPrimaryBtn onClick={() => study(course.id)}>▶ Study +20%</LrnPrimaryBtn>
                ) : (
                  <LrnPrimaryBtn onClick={() => enroll(course.id)}>Enroll as Student</LrnPrimaryBtn>
                )}
              </div>
            </div>
          </LrnCard>
        ))}
      </div>

      <ImportScormModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}

export function LearningPathsTab() {
  const [builderOpen, setBuilderOpen] = useState(false)
  const [customPaths, setCustomPaths] = useState<LearningPath[]>([])
  const [bundleCourses, setBundleCourses] = useState<string[]>([])

  const allPaths = [...LEARNING_PATHS, ...customPaths]

  function addCourse(title: string) {
    if (!bundleCourses.includes(title)) setBundleCourses((b) => [...b, title])
  }

  function saveBundle() {
    if (bundleCourses.length === 0) return
    const id = `PTH-${String(customPaths.length + 3).padStart(2, '0')}`
    setCustomPaths((p) => [
      ...p,
      {
        id,
        cohort: 'ENGINEERING COHORT',
        cohortTone: 'info',
        level: 'INTERMEDIATE',
        levelTone: 'info',
        title: 'Custom Learning Path Bundle',
        description: 'Custom learning path bundle',
        milestones: bundleCourses,
        enrollments: 0,
      },
    ])
    setBundleCourses([])
    setBuilderOpen(false)
  }

  return (
    <div className="lrn-tab">
      <LrnSectionHead
        title="STRUCTURED CURRICULUMS & COHORTS"
        subtitle="Allows managers to bundle multiple courses & check milestones together to track organizational core benchmarks."
        trailing={
          <LrnPrimaryBtn onClick={() => setBuilderOpen((o) => !o)}>{builderOpen ? 'Close Creator' : '+ Create Custom Path'}</LrnPrimaryBtn>
        }
      />

      {builderOpen ? (
        <LrnCard className="lrn-path-builder">
          <div className="lrn-path-builder-head">
            <span>
              <span aria-hidden>⚙</span> HR LEARNING PATH BUILDER BUNDLE
            </span>
            <button type="button" className="lrn-link-btn" onClick={() => setBuilderOpen(false)}>
              ✕ Close Creator
            </button>
          </div>
          <div className="lrn-path-builder-form">
            <input type="text" className="lrn-input" placeholder="e.g., Senior Systems Engineering Track" />
            <input type="text" className="lrn-input" placeholder="e.g., Specialized track focusing on DB isolation, hi..." />
            <LrnSelect defaultValue="Engineering" options={['Engineering', 'HR', 'Finance', 'Marketing', 'Operations']} label="Assigned department" />
            <LrnSelect defaultValue="Intermediate (201)" options={['Beginner (101)', 'Intermediate (201)', 'Advanced (301)']} label="Difficulty level" />
            <input type="text" className="lrn-input sm" defaultValue="8" aria-label="Total estimated hours" />
            <LrnPrimaryBtn onClick={saveBundle}>Save Bundle</LrnPrimaryBtn>
          </div>
          <span className="lrn-section-title sm muted">BUNDLE CATALOG COURSES INTO TRACK</span>
          <div className="lrn-bundle-list">
            {PATH_BUNDLE_OPTIONS.map((title) => (
              <div key={title} className={`lrn-bundle-item${bundleCourses.includes(title) ? ' added' : ''}`}>
                <span>{title}</span>
                <button type="button" className="lrn-link-btn" disabled={bundleCourses.includes(title)} onClick={() => addCourse(title)}>
                  {bundleCourses.includes(title) ? 'Added' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </LrnCard>
      ) : null}

      <div className="lrn-path-grid">
        {allPaths.map((path) => (
          <LrnCard key={path.id} className="lrn-path-card">
            <div className="lrn-path-head">
              <LrnPill label={path.cohort} tone={path.cohortTone} />
              <LrnPill label={path.level} tone={path.levelTone} />
              <span className="lrn-muted sm">ID: {path.id}</span>
            </div>
            <h4>{path.title}</h4>
            <p className="lrn-muted sm">{path.description}</p>
            <div className="lrn-syllabus-box">
              <span className="lrn-section-title sm muted">BUNDLED SYLLABUS ({path.milestones.length} MILESTONES)</span>
              <ul>
                {path.milestones.map((m, i) => (
                  <li key={m}>
                    <span>{m}</span>
                    <em>Course {i + 1}</em>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lrn-path-foot">
              <span className="lrn-muted sm">Tracks logged: {path.enrollments} team enrollments</span>
              <LrnOutlineBtn>Force Batch Assign</LrnOutlineBtn>
            </div>
          </LrnCard>
        ))}
      </div>
    </div>
  )
}

export function LearningComplianceTab() {
  return (
    <div className="lrn-tab">
      <LrnSectionHead
        title="COMPLIANCE WATCH & CERTIFICATION AUDIT SYSTEM"
        subtitle="Track security standard expiration parameters and execute direct renewal overrides for employee compliance files."
        trailing={<LrnPill label="AUDITS AUTO-CHECK ACTIVE" tone="warning" />}
      />

      <div className="lrn-alert-grid">
        <div className="lrn-alert-card expired">
          <div className="lrn-alert-top">
            <LrnPill label="EXPIRED" tone="danger" />
            <span className="lrn-muted sm">CRT-981</span>
          </div>
          <h4>ISO 27001 InfoSec Master Certificate</h4>
          <p className="lrn-muted sm">Assigned operator: Sarah Lim (Engineering)</p>
          <p className="lrn-muted sm">Certification Expiry: 2026-06-15</p>
          <p className="tone-danger sm">
            <strong>Deadline Status: Lapsed yesterday</strong>
          </p>
          <div className="lrn-alert-actions">
            <LrnPrimaryBtn>Email Warning Alert</LrnPrimaryBtn>
            <button type="button" className="lrn-blue-btn">
              Renew Overrides
            </button>
          </div>
        </div>

        <div className="lrn-alert-card expiring">
          <div className="lrn-alert-top">
            <LrnPill label="EXPIRING SOON" tone="warning" />
            <span className="lrn-muted sm">CRT-982</span>
          </div>
          <h4>Global GDPR Compliance Representative Cert</h4>
          <p className="lrn-muted sm">Assigned operator: Raj Kumar (Operations)</p>
          <p className="lrn-muted sm">Certification Expiry: 2026-07-18</p>
          <p className="tone-warning sm">
            <strong>Deadline Status: Expires in 24 days</strong>
          </p>
          <div className="lrn-alert-actions">
            <LrnPrimaryBtn>Email Warning Alert</LrnPrimaryBtn>
            <button type="button" className="lrn-blue-btn">
              Renew Overrides
            </button>
          </div>
        </div>

        <div className="lrn-audit-warning">
          <span aria-hidden>🛡</span>
          <h4>OFFICIAL AUDIT WARNING</h4>
          <p>
            Mandatory compliance certifications must remain active. Failure to renew before expiry may trigger audit flags and restrict system
            access.
          </p>
          <div className="lrn-audit-foot">
            <span aria-hidden>⚠</span>
            <span>GDPR fine caps may apply: €20M / 4% turnover for lapsed representative certifications.</span>
          </div>
        </div>
      </div>

      <LrnCard>
        <span className="lrn-section-title sm muted">ORGANIZATIONAL CERTIFICATE SECURITY LOG</span>
        <LrnTableScroll>
          <table className="lrn-table">
            <thead>
              <tr>
                <th>Certificate detail</th>
                <th>Employee name</th>
                <th>Issue date</th>
                <th>Expiry date</th>
                <th>Tracking state</th>
                <th>Quick auditing</th>
              </tr>
            </thead>
            <tbody>
              {LEARNING_CERTS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.cert}</strong>
                  </td>
                  <td>
                    <strong>{row.name}</strong>
                    <span className="lrn-muted sm block">{row.dept}</span>
                  </td>
                  <td>{row.issue}</td>
                  <td>{row.expiry}</td>
                  <td>
                    <LrnPill label={row.state} tone={row.stateTone} />
                  </td>
                  <td>
                    <div className="lrn-audit-actions">
                      <LrnOutlineBtn>Ping User</LrnOutlineBtn>
                      <button type="button" className="lrn-link-btn">
                        Renew File
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </LrnTableScroll>
      </LrnCard>
    </div>
  )
}

export function LearningAssessmentsTab() {
  const [selectedId, setSelectedId] = useState('QT-201')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [gradeMsg, setGradeMsg] = useState('')

  const assessment = LEARNING_ASSESSMENTS.find((a) => a.id === selectedId) ?? LEARNING_ASSESSMENTS[0]

  function gradeQuiz() {
    let correct = 0
    assessment.questions.forEach((q, i) => {
      if (answers[`${selectedId}-q${i}`] === q.correct) correct++
    })
    const total = assessment.questions.length
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100)
    setGradeMsg(`Score: ${correct}/${total} (${pct}%) — ${pct >= 75 ? 'Passed — certification granted' : 'Review required'}`)
  }

  return (
    <div className="lrn-tab lrn-assess-split">
      <LrnCard className="lrn-assess-sidebar">
        <span className="lrn-section-title sm muted">AVAILABLE KNOWLEDGE ASSESSMENTS</span>
        <p className="lrn-muted sm">
          Select from the randomized catalog list below to initiate real testing parameters before updating core completion certificates inside
          records.
        </p>
        {LEARNING_ASSESSMENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`lrn-assess-tile${selectedId === a.id ? ' active' : ''}`}
            onClick={() => {
              setSelectedId(a.id)
              setAnswers({})
              setGradeMsg('')
            }}
          >
            <span className="tone-primary sm bold">{a.id}: {a.title}</span>
            <p className="lrn-muted sm">🕐 {a.duration}</p>
            <p className="lrn-muted sm">{a.itemCount}</p>
          </button>
        ))}
        <div className="lrn-rubric-box">
          <strong>⚠ GRADING RUBRICS</strong>
          <p className="lrn-muted sm">Requires 75% score or above to grant course certifications. Users are permitted multiple attempts.</p>
        </div>
      </LrnCard>

      <LrnCard className="lrn-quiz-panel">
        <div className="lrn-quiz-head">
          <div>
            <span className="tone-primary sm bold">ACTIVE TESTING SESSION ENFORCED</span>
            <h3>{assessment.title}</h3>
          </div>
          <button type="button" className="lrn-link-btn">
            EXIT QUIZ
          </button>
        </div>
        {assessment.questions.map((q, i) => (
          <div key={q.text} className="lrn-quiz-question">
            <span className="lrn-muted sm bold">
              QUESTION ITEM {i + 1} OF {assessment.questions.length}
            </span>
            <p>
              <strong>{q.text}</strong>
            </p>
            <div className="lrn-quiz-options">
              {q.options.map((opt) => (
                <label key={opt} className="lrn-quiz-option">
                  <span>{opt}</span>
                  <input
                    type="radio"
                    name={`${selectedId}-q${i}`}
                    checked={answers[`${selectedId}-q${i}`] === opt}
                    onChange={() => setAnswers((a) => ({ ...a, [`${selectedId}-q${i}`]: opt }))}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="lrn-quiz-foot">
          <span className="lrn-muted sm">All inputs are logged under active anti-tamper constraints</span>
          <LrnPrimaryBtn onClick={gradeQuiz}>Request Test Grade →</LrnPrimaryBtn>
        </div>
        {gradeMsg ? <p className="lrn-grade-msg">{gradeMsg}</p> : null}
      </LrnCard>
    </div>
  )
}

export function LearningAnalyticsTab() {
  return (
    <div className="lrn-tab">
      <div className="lrn-analytics-split">
        <LrnCard>
          <div className="lrn-completion-head">
            <span className="lrn-section-title sm muted">COHORT CURRICULUM COMPLETION RATES</span>
            <LrnPill label="TARGET: 80% MIN" tone="info" />
          </div>
          <p className="lrn-muted sm">Aggregated metrics detailing the ratio of staff completing active training milestones</p>
          {COMPLETION_TEAMS.map((team) => (
            <div key={team.name} className="lrn-team-row">
              <span>{team.name}</span>
              <LrnProgressBar pct={team.pct} />
              <em className="lrn-muted sm">
                {team.pct}% Complete ({team.certified} certified)
              </em>
            </div>
          ))}
          <div className="lrn-sync-foot">
            <span className="lrn-muted sm">Integrated from continuous HRMS performance syncs</span>
            <span className="lrn-muted sm">Sync cycle: 2026-Q2 Audit</span>
          </div>
        </LrnCard>

        <LrnCard>
          <span className="lrn-section-title sm muted">TRAINING EFFICIENCY KPI METRICS</span>
          <div className="lrn-eff-kpi">
            <span className="lrn-muted sm">Cumulative Learning Hours</span>
            <div className="lrn-eff-row">
              <strong>1,482 Hours</strong>
              <span className="tone-success sm bold">+14% MoM</span>
            </div>
          </div>
          <div className="lrn-eff-kpi">
            <span className="lrn-muted sm">Avg Test Score Standard Deviation</span>
            <div className="lrn-eff-row">
              <strong>84.5% Grade</strong>
              <span className="tone-primary sm bold">Pass Limit Rank</span>
            </div>
          </div>
          <div className="lrn-eff-kpi">
            <span className="lrn-muted sm">Active Certification Certificates</span>
            <div className="lrn-eff-row">
              <strong>112 Issued Tokens</strong>
              <span className="tone-purple sm bold">94% Active</span>
            </div>
          </div>
          <div className="lrn-insight-box">
            <span aria-hidden>💡</span>
            <p>
              <strong>Coaching Insight:</strong> High density completion detected in HR and Accounting. Engineering exhibits completion lag due to
              tight sprints. Buffer allocations recommended.
            </p>
          </div>
        </LrnCard>
      </div>

      <LrnCard>
        <span className="lrn-section-title sm muted">PERSONNEL CONTINUOUS LEARNING CHAMPIONS (Q2 LEADERS)</span>
        <div className="lrn-champion-grid">
          {LEARNING_CHAMPIONS.map((ch) => (
            <article key={ch.rank} className="lrn-champion-card">
              <span className="lrn-rank-badge">{ch.rank}</span>
              <strong>{ch.name}</strong>
              <p className="lrn-muted sm">{ch.role}</p>
              <p className="lrn-muted sm">
                {ch.classes} · {ch.hours}
              </p>
              <span className="lrn-champion-badge">{ch.badge}</span>
            </article>
          ))}
        </div>
      </LrnCard>
    </div>
  )
}
