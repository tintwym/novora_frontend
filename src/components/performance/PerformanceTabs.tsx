import { useState } from 'react'
import {
  ACHIEVEMENT_KPI_BANDS,
  ATTENDANCE_KPI_BANDS,
  COMPETENCIES,
  EMPLOYEE_REVIEW_HISTORY,
  EMPLOYEE_SCORE_BREAKDOWN,
  EMPLOYEE_TRAINING,
  EVAL_CATEGORIES,
  EVAL_SETUPS,
  EVAL_TYPES,
  EVALUATION_LIST,
  GRANT_PERMISSIONS,
  PERF_GRADES,
  PERF_LEVELS,
  PERF_RESULTS,
  REVIEW_REPORTS,
} from '../../data/mockPerformance'
import type { EvalSetupCard, KpiBandRow, PerfGradeRow, PerfLevelRow } from '../../types/performance'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  EditCategoryModal,
  EditCompetencyModal,
  EditEvalTypeModal,
  EditGradeModal,
  EditKpiSettingModal,
  EditLevelModal,
  GrantPermissionModal,
  GrantViewListModal,
  NewCategoryModal,
  NewCompetencyModal,
  NewEvalTypeModal,
  NewEvaluationModal,
  NewGradeModal,
  NewKpiSettingModal,
  NewLevelModal,
  NewSetupModal,
  ViewReportModal,
} from './PerformanceModals'
import {
  PerfActivePill,
  PerfAvatarName,
  PerfCard,
  PerfGradeBox,
  PerfKpiScoreCircle,
  PerfLinkBtn,
  PerfPrimaryBtn,
  PerfScoreBar,
  PerfSearch,
  PerfSectionTitle,
  PerfSelect,
  PerfTableScroll,
  PerfToolbarRow,
  PerfYesNoPill,
} from './PerformanceShared'

const TARGET_TONE_CLASS = {
  success: 'tone-success',
  primary: 'tone-primary',
  warning: 'tone-warning',
  danger: 'tone-danger',
} as const

function KpiBandTable({
  title,
  badge,
  badgeTone,
  bands,
  onEdit,
}: {
  title: string
  badge: string
  badgeTone: 'info' | 'purple'
  bands: KpiBandRow[]
  onEdit: () => void
}) {
  return (
    <PerfCard className="perf-kpi-band-card">
      <div className="perf-kpi-band-head">
        <strong>{title}</strong>
        <RecruitPill label={badge} tone={badgeTone} />
      </div>
      <PerfTableScroll>
        <table className="perf-table">
          <thead>
            <tr>
              <th>FROM %</th>
              <th>TO %</th>
              <th>TARGET %</th>
              <th>KPI SCORE</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {bands.map((row) => (
              <tr key={`${row.from}-${row.to}`}>
                <td>{row.from}</td>
                <td>{row.to}</td>
                <td className={row.targetTone ? TARGET_TONE_CLASS[row.targetTone] : undefined}>
                  <strong>{row.target}</strong>
                </td>
                <td>
                  <PerfKpiScoreCircle score={row.score} tone={row.scoreTone} />
                </td>
                <td>
                  <PerfLinkBtn onClick={onEdit}>Edit</PerfLinkBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PerfTableScroll>
    </PerfCard>
  )
}

function EvalSetupCardView({ setup }: { setup: EvalSetupCard }) {
  return (
    <PerfCard className="perf-setup-card">
      <div className="perf-setup-card-head">
        <strong>{setup.title}</strong>
        <PerfActivePill />
      </div>
      <p className="perf-setup-categories-label">Linked evaluation categories</p>
      <ul className="perf-setup-category-list">
        {setup.categories.map((cat) => (
          <li key={cat.label}>
            <span aria-hidden>{cat.checked ? '☑' : '☐'}</span>
            {cat.label}
          </li>
        ))}
      </ul>
      <hr className="perf-setup-divider" />
      <dl className="perf-setup-settings">
        {setup.settings.map((setting) => (
          <div key={setting.label} className="perf-setup-setting-row">
            <dt>{setting.label}</dt>
            <dd className={setting.positive ? 'tone-success' : undefined}>{setting.value}</dd>
          </div>
        ))}
      </dl>
    </PerfCard>
  )
}

function RatingRow({ label, selected }: { label: string; selected: number }) {
  return (
    <div className="perf-rating-row">
      <span className="perf-rating-label">{label}</span>
      <div className="perf-rating-circles">
        {[1, 2, 3, 4, 5].map((value) => (
          <span key={value} className={`perf-rating-circle${value === selected ? ' selected' : ''}`}>
            {value}
          </span>
        ))}
      </div>
      <span className="perf-rating-fraction">{selected}/5</span>
    </div>
  )
}

function KpiInputRow({ label, value, pct }: { label: string; value: string; pct: string }) {
  return (
    <div className="perf-kpi-input-row">
      <span>{label}</span>
      <input type="text" className="perf-kpi-input" defaultValue={value} aria-label={label} />
      <strong>{pct}</strong>
    </div>
  )
}

export function PerformanceLevelTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState<PerfLevelRow | null>(null)

  function openEdit(row: PerfLevelRow) {
    setEditRow(row)
    setEditOpen(true)
  }

  return (
    <div className="perf-level-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={<PerfSearch placeholder="Search level..." />}
          trailing={<PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New Level</PerfPrimaryBtn>}
        />
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>LEVEL NAME</th>
                <th>DESCRIPTION</th>
                <th>EMPLOYEES</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {PERF_LEVELS.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>{row.name}</td>
                  <td>{row.description}</td>
                  <td>
                    <PerfLinkBtn>{row.employees}</PerfLinkBtn>
                  </td>
                  <td>
                    <PerfActivePill />
                  </td>
                  <td>
                    <PerfLinkBtn onClick={() => openEdit(row)}>Edit</PerfLinkBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <NewLevelModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditLevelModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        name={editRow?.name}
        description={editRow?.description}
      />
    </div>
  )
}

export function PerformanceGradeTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState<PerfGradeRow | null>(null)

  function openEdit(row: PerfGradeRow) {
    setEditRow(row)
    setEditOpen(true)
  }

  return (
    <div className="perf-grade-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={<PerfSearch placeholder="Search grade..." />}
          trailing={<PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New Grade</PerfPrimaryBtn>}
        />
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>GRADE</th>
                <th>GRADE NAME</th>
                <th>MARK FROM</th>
                <th>MARK TO</th>
                <th>APPLY FOR PERFORMANCE</th>
                <th>EMPLOYEES</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {PERF_GRADES.map((row) => (
                <tr key={row.letter}>
                  <td>
                    <PerfGradeBox letter={row.letter} bg={row.letterBg} />
                  </td>
                  <td>{row.name}</td>
                  <td>{row.markFrom}</td>
                  <td>{row.markTo}</td>
                  <td>
                    <PerfYesNoPill yes={row.apply} />
                  </td>
                  <td>
                    <PerfLinkBtn>{row.employees}</PerfLinkBtn>
                  </td>
                  <td>
                    <PerfLinkBtn onClick={() => openEdit(row)}>Edit</PerfLinkBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <NewGradeModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditGradeModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        letter={editRow?.letter}
        name={editRow?.name}
        from={editRow?.markFrom}
        to={editRow?.markTo}
      />
    </div>
  )
}

export function PerformanceKpiTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="perf-kpi-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={
            <PerfSelect defaultValue="All KPI types" aria-label="KPI type filter">
              <option>All KPI types</option>
              <option>Attendance</option>
              <option>Achievement</option>
            </PerfSelect>
          }
          trailing={<PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New KPI Setting</PerfPrimaryBtn>}
        />
      </PerfCard>
      <div className="perf-kpi-split">
        <KpiBandTable
          title="Attendance KPI"
          badge="Attendance"
          badgeTone="info"
          bands={ATTENDANCE_KPI_BANDS}
          onEdit={() => setEditOpen(true)}
        />
        <KpiBandTable
          title="Achievement KPI"
          badge="Achievement"
          badgeTone="purple"
          bands={ACHIEVEMENT_KPI_BANDS}
          onEdit={() => setEditOpen(true)}
        />
      </div>
      <NewKpiSettingModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditKpiSettingModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  )
}

export function PerformanceEvalTypeTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')

  return (
    <div className="perf-eval-type-tab">
      <PerfCard>
        <div className="perf-toolbar-trailing-only">
          <PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New Eval Type</PerfPrimaryBtn>
        </div>
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>TYPE NAME</th>
                <th>EVERY MONTH</th>
                <th>ACHIEVE KPI</th>
                <th>NOTIFY BEFORE</th>
                <th>TRAINEE EVAL.</th>
                <th>APPRAISER</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {EVAL_TYPES.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.everyMonth}</td>
                  <td>
                    <PerfYesNoPill yes={row.achieveKpi} />
                  </td>
                  <td>{row.notifyBefore}</td>
                  <td>
                    <PerfYesNoPill yes={row.traineeEval} />
                  </td>
                  <td>{row.appraiser}</td>
                  <td>
                    <PerfActivePill />
                  </td>
                  <td>
                    <PerfLinkBtn
                      onClick={() => {
                        setEditName(row.name)
                        setEditOpen(true)
                      }}
                    >
                      Edit
                    </PerfLinkBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <NewEvalTypeModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditEvalTypeModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} />
    </div>
  )
}

export function PerformanceEvalCategoryTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editWeight, setEditWeight] = useState('')

  return (
    <div className="perf-eval-category-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={
            <PerfSelect defaultValue="All KPI types" aria-label="KPI type filter">
              <option>All KPI types</option>
              <option>Attribute</option>
              <option>KPI category</option>
            </PerfSelect>
          }
          trailing={<PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New Category</PerfPrimaryBtn>}
        />
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>CATEGORY NAME</th>
                <th>KPI TYPE</th>
                <th>WEIGHTAGE %</th>
                <th>SCORING SCHEME</th>
                <th>MEASUREMENT</th>
                <th>DEFINITION LEVELS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {EVAL_CATEGORIES.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>
                    <RecruitPill label={row.kpiType} tone={row.typeTone} />
                  </td>
                  <td>{row.weight}</td>
                  <td>{row.scoring}</td>
                  <td>{row.measurement}</td>
                  <td>
                    <RecruitPill label={row.levels} tone="neutral" />
                  </td>
                  <td>
                    <PerfLinkBtn
                      onClick={() => {
                        setEditName(row.name)
                        setEditWeight(row.weight.replace('%', ''))
                        setEditOpen(true)
                      }}
                    >
                      Edit
                    </PerfLinkBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <NewCategoryModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditCategoryModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} weight={editWeight} />
    </div>
  )
}

export function PerformanceEvalSetupTab() {
  const [newOpen, setNewOpen] = useState(false)

  return (
    <div className="perf-eval-setup-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={
            <PerfSelect defaultValue="All evaluation types" aria-label="Evaluation type filter">
              <option>All evaluation types</option>
              <option>Year-end</option>
              <option>Probation</option>
            </PerfSelect>
          }
          trailing={<PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New Setup</PerfPrimaryBtn>}
        />
      </PerfCard>
      <div className="perf-setup-split">
        {EVAL_SETUPS.map((setup) => (
          <EvalSetupCardView key={setup.title} setup={setup} />
        ))}
      </div>
      <NewSetupModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  )
}

export function PerformanceGrantTab() {
  const [grantOpen, setGrantOpen] = useState(false)
  const [viewListOpen, setViewListOpen] = useState(false)
  const [viewEvaluator, setViewEvaluator] = useState('')

  return (
    <div className="perf-grant-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={
            <>
              <PerfSelect defaultValue="All evaluation types" aria-label="Evaluation type filter">
                <option>All evaluation types</option>
                <option>Year-end appraisal</option>
                <option>Mid-year</option>
              </PerfSelect>
              <PerfSelect defaultValue="All status" aria-label="Status filter">
                <option>All status</option>
                <option>Active</option>
                <option>Expired</option>
              </PerfSelect>
            </>
          }
          trailing={<PerfPrimaryBtn onClick={() => setGrantOpen(true)}>+ Grant Permission</PerfPrimaryBtn>}
        />
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>EVALUATOR</th>
                <th>EVALUATION TYPE</th>
                <th>REVIEW PERIOD FROM</th>
                <th>REVIEW PERIOD TO</th>
                <th>PENDING</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {GRANT_PERMISSIONS.map((row) => (
                <tr key={row.evaluator}>
                  <td>
                    <PerfAvatarName initials={row.initials} name={row.evaluator} bg={row.avatarBg} />
                  </td>
                  <td>{row.evalType}</td>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>
                    {row.pendingLink ? (
                      <PerfLinkBtn>{row.pending}</PerfLinkBtn>
                    ) : (
                      <span className="perf-muted">{row.pending}</span>
                    )}
                  </td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <div className="perf-grant-actions">
                      <PerfLinkBtn
                        onClick={() => {
                          setViewEvaluator(row.evaluator)
                          setViewListOpen(true)
                        }}
                      >
                        View list
                      </PerfLinkBtn>
                      {row.expired ? (
                        <PerfPrimaryBtn>Re-grant</PerfPrimaryBtn>
                      ) : (
                        <button type="button" className="perf-outline-btn danger">
                          Hold
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <GrantPermissionModal open={grantOpen} onClose={() => setGrantOpen(false)} />
      <GrantViewListModal open={viewListOpen} onClose={() => setViewListOpen(false)} evaluator={viewEvaluator} />
    </div>
  )
}

export function PerformanceEvaluationTab() {
  const [newOpen, setNewOpen] = useState(false)

  return (
    <div className="perf-evaluation-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={
            <>
              <PerfSelect defaultValue="All review types" aria-label="Review type filter">
                <option>All review types</option>
                <option>Year-end</option>
                <option>Mid-year</option>
                <option>Probation</option>
              </PerfSelect>
              <PerfSelect defaultValue="All status" aria-label="Status filter">
                <option>All status</option>
                <option>Pending</option>
                <option>Completed</option>
              </PerfSelect>
              <PerfSelect defaultValue="All departments" aria-label="Department filter">
                <option>All departments</option>
                <option>Engineering</option>
                <option>HR</option>
              </PerfSelect>
              <PerfSearch placeholder="Search employee..." className="perf-search-narrow" />
            </>
          }
          trailing={<PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New Evaluation</PerfPrimaryBtn>}
        />
      </PerfCard>

      <PerfCard className="perf-eval-entry-card">
        <div className="perf-eval-entry-head">
          <strong>Evaluation entry — Sarah Lim</strong>
          <RecruitPill label="PENDING" tone="warning" />
        </div>
        <div className="perf-eval-entry-fields">
          <div className="perf-readonly-field">
            <span>Employee *</span>
            <strong>Sarah Lim (EMP-0021)</strong>
          </div>
          <div className="perf-readonly-field">
            <span>Review type *</span>
            <strong>Year-end appraisal</strong>
          </div>
          <div className="perf-readonly-field">
            <span>Review date *</span>
            <strong>15/01/2026</strong>
          </div>
          <div className="perf-readonly-field">
            <span>Review period</span>
            <strong>1 Jan 2025 - 31 Dec 2025</strong>
          </div>
        </div>
      </PerfCard>

      <div className="perf-eval-split">
        <div className="perf-eval-scoring">
          <PerfPrimaryBtn>Load category list</PerfPrimaryBtn>

          <PerfCard className="perf-attribute-block">
            <strong className="perf-block-title">Attribute — technical skills (25%)</strong>
            <RatingRow label="Code quality & standards" selected={4} />
            <RatingRow label="Problem-solving ability" selected={5} />
            <RatingRow label="System design" selected={4} />
            <p className="perf-category-score">Category score: 86.7 / 100</p>
          </PerfCard>

          <PerfCard className="perf-kpi-block">
            <strong className="perf-block-title">KPI — project delivery (30%)</strong>
            <KpiInputRow label="Sprints completed on time" value="92" pct="92%" />
            <KpiInputRow label="Bugs resolved within SLA" value="88" pct="88%" />
            <p className="perf-muted sm italic">Final score: auto-calculated</p>
          </PerfCard>

          <PerfCard className="perf-attendance-block">
            <strong className="perf-block-title">Attendance KPI (10%)</strong>
            <p>
              <strong>Attendance rate (auto): 97%</strong>
            </p>
            <p className="perf-muted sm">Based on review period attendance data</p>
          </PerfCard>
        </div>

        <PerfCard className="perf-eval-sidebar">
          <strong>Objectives for next period</strong>
          <PerfSelect defaultValue="Achievement KPI" aria-label="Objective KPI type">
            <option>Achievement KPI</option>
            <option>Attendance KPI</option>
          </PerfSelect>
          <input type="text" className="perf-outline-input" placeholder="e.g. Lead frontend team Q1 2026" />
          <input type="text" className="perf-outline-input" placeholder="e.g. 95% sprint completion" />
          <textarea className="perf-outline-input" rows={3} placeholder="Notes on this objective…" />
          <button type="button" className="perf-outline-btn">
            + Add objective
          </button>
          <strong className="perf-sidebar-section">Appraiser note</strong>
          <textarea
            className="perf-outline-input"
            rows={4}
            placeholder="Notes and remarks from the appraiser about this evaluation period…"
          />
        </PerfCard>
      </div>

      <PerfCard>
        <PerfSectionTitle title="EVALUATION LIST — ALL EMPLOYEES" />
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>REVIEW TYPE</th>
                <th>REVIEW DATE</th>
                <th>REVIEW PERIOD</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {EVALUATION_LIST.map((row) => (
                <tr key={row.name}>
                  <td>
                    <PerfAvatarName initials={row.initials} name={row.name} bg={row.avatarBg} />
                  </td>
                  <td>{row.reviewType}</td>
                  <td>{row.reviewDate}</td>
                  <td>{row.reviewPeriod}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <PerfLinkBtn>{row.action}</PerfLinkBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>

      <NewEvaluationModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  )
}

export function PerformanceResultTab() {
  const [reportOpen, setReportOpen] = useState(false)
  const [reportEmployee, setReportEmployee] = useState('')
  const [reportGrade, setReportGrade] = useState('')
  const [reportTotal, setReportTotal] = useState('')

  function openReport(employee: string, grade: string, total: string) {
    setReportEmployee(employee)
    setReportGrade(grade)
    setReportTotal(total)
    setReportOpen(true)
  }

  return (
    <div className="perf-result-tab">
      <PerfCard>
        <PerfSectionTitle
          title="PERFORMANCE SUMMARIES"
          trailing={
            <button type="button" className="perf-outline-btn">
              Calculate grade
            </button>
          }
        />
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>ATTR. SCORE</th>
                <th>KPI SCORE</th>
                <th>COMP. SCORE</th>
                <th>ATTEND. SCORE</th>
                <th>TOTAL SCORE</th>
                <th>GRADE</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {PERF_RESULTS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <PerfAvatarName initials={row.initials} name={row.name} bg={row.avatarBg} />
                  </td>
                  <td>{row.attr}</td>
                  <td>{row.kpi}</td>
                  <td>{row.comp}</td>
                  <td>{row.attend}</td>
                  <td className={row.totalWarning ? 'tone-warning' : 'tone-primary'}>
                    <strong>{row.total}</strong>
                  </td>
                  <td>
                    <PerfGradeBox letter={row.grade} bg={row.gradeBg} />
                  </td>
                  <td>
                    <PerfLinkBtn onClick={() => openReport(row.name, row.grade, row.total)}>Detail</PerfLinkBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <ViewReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        employee={reportEmployee}
        grade={reportGrade}
        total={reportTotal}
      />
    </div>
  )
}

export function PerformanceCompetencyTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDefinition, setEditDefinition] = useState('')

  return (
    <div className="perf-competency-tab">
      <PerfCard>
        <PerfToolbarRow
          leading={
            <>
              <PerfSelect defaultValue="All types" aria-label="Competency type filter">
                <option>All types</option>
                <option>Competency</option>
                <option>Sub-comp.</option>
              </PerfSelect>
              <PerfSearch placeholder="Search competency..." />
            </>
          }
          trailing={<PerfPrimaryBtn onClick={() => setNewOpen(true)}>+ New Competency</PerfPrimaryBtn>}
        />
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>COMPETENCY NAME</th>
                <th>TYPE</th>
                <th>PARENT COMPETENCY</th>
                <th>DEFINITION</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {COMPETENCIES.map((row) => (
                <tr key={row.name}>
                  <td>{row.sub ? `↳ ${row.name}` : row.name}</td>
                  <td>
                    <RecruitPill label={row.type} tone={row.typeTone} />
                  </td>
                  <td>{row.parent}</td>
                  <td>{row.definition}</td>
                  <td>
                    <PerfLinkBtn
                      onClick={() => {
                        setEditName(row.name)
                        setEditDefinition(row.definition)
                        setEditOpen(true)
                      }}
                    >
                      Edit
                    </PerfLinkBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <NewCompetencyModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditCompetencyModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} definition={editDefinition} />
    </div>
  )
}

export function PerformanceReviewReportTab() {
  const [reportOpen, setReportOpen] = useState(false)
  const [reportEmployee, setReportEmployee] = useState('')
  const [reportGrade, setReportGrade] = useState('')
  const [reportTotal, setReportTotal] = useState('')

  function openReport(employee: string, grade: string, total: string) {
    setReportEmployee(employee)
    setReportGrade(grade)
    setReportTotal(total)
    setReportOpen(true)
  }

  return (
    <div className="perf-review-report-tab">
      <PerfCard>
        <PerfSectionTitle
          title="VERIFIED APPRAISAL REPORTS"
          trailing={<PerfPrimaryBtn>Export all</PerfPrimaryBtn>}
        />
      </PerfCard>
      <PerfCard>
        <PerfTableScroll>
          <table className="perf-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>REVIEW TYPE</th>
                <th>REVIEW PERIOD</th>
                <th>TOTAL SCORE</th>
                <th>GRADE</th>
                <th>APPRAISER</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {REVIEW_REPORTS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <PerfAvatarName initials={row.initials} name={row.name} bg={row.avatarBg} />
                  </td>
                  <td>{row.reviewType}</td>
                  <td>{row.reviewPeriod}</td>
                  <td className="tone-primary">
                    <strong>{row.total}</strong>
                  </td>
                  <td>
                    <PerfGradeBox letter={row.grade} bg={row.gradeBg} />
                  </td>
                  <td>{row.appraiser}</td>
                  <td>
                    <RecruitPill label="Completed" tone="success" />
                  </td>
                  <td>
                    <div className="perf-report-actions">
                      <PerfLinkBtn onClick={() => openReport(row.name, row.grade, row.total)}>View</PerfLinkBtn>
                      <PerfLinkBtn onClick={() => openReport(row.name, row.grade, row.total)}>PDF</PerfLinkBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfTableScroll>
      </PerfCard>
      <ViewReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        employee={reportEmployee}
        grade={reportGrade}
        total={reportTotal}
      />
    </div>
  )
}

export function PerformanceEmployeeProfileTab() {
  return (
    <div className="perf-employee-profile-tab">
      <PerfCard>
        <PerfSelect defaultValue="Sarah Lim (EMP-0021)" aria-label="Employee">
          <option>Sarah Lim (EMP-0021)</option>
          <option>Raj Kumar (EMP-0044)</option>
          <option>Ahmad L. (EMP-0088)</option>
        </PerfSelect>
      </PerfCard>

      <PerfCard className="perf-profile-header-card">
        <span className="perf-profile-avatar">SL</span>
        <div>
          <h3>Sarah Lim Wei Ling</h3>
          <p className="perf-muted">EMP-0021 · Engineering · Senior Developer</p>
        </div>
      </PerfCard>

      <div className="perf-profile-split">
        <PerfCard className="perf-profile-left">
          <strong>Score breakdown</strong>
          {EMPLOYEE_SCORE_BREAKDOWN.map((row) => (
            <PerfScoreBar key={row.label} label={row.label} value={row.value} color={row.color} />
          ))}
          <p className="perf-overall-score">Overall score 91.7 / 100</p>
        </PerfCard>

        <PerfCard className="perf-profile-right">
          <strong>Review history</strong>
          <PerfTableScroll>
            <table className="perf-table compact">
              <thead>
                <tr>
                  <th>REVIEW TYPE</th>
                  <th>PERIOD</th>
                  <th>SCORE</th>
                  <th>GRADE</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEE_REVIEW_HISTORY.map((row) => (
                  <tr key={`${row.type}-${row.period}`}>
                    <td>{row.type}</td>
                    <td>{row.period}</td>
                    <td>{row.score}</td>
                    <td>
                      <PerfGradeBox letter={row.grade} bg={row.gradeBg} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PerfTableScroll>

          <strong className="perf-sidebar-section">Training recommended</strong>
          <ul className="perf-training-list">
            {EMPLOYEE_TRAINING.map((row) => (
              <li key={row.label}>
                {row.label}
                {row.mandatory ? <RecruitPill label="Mandatory" tone="warning" /> : null}
              </li>
            ))}
          </ul>

          <strong className="perf-sidebar-section">Appraiser note (latest)</strong>
          <p className="perf-appraiser-note">
            Strong technical contributor with consistent improvement. Nominated for tech lead role in Q3 2026.
            Recommended for leadership training before promotion cycle.
          </p>
          <p className="perf-muted sm">— David Ng · 15 Jan 2026</p>
        </PerfCard>
      </div>
    </div>
  )
}
