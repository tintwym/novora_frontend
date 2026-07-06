import { useState } from 'react'
import {
  TRAINING_APPROVALS,
  TRAINING_ATTENDANCE,
  TRAINING_BEHALF_EMPLOYEES,
  TRAINING_BEHALF_SUBMITTED,
  TRAINING_BUDGET_REPORT,
  TRAINING_CATEGORIES,
  TRAINING_COMPLIANCE_REPORT,
  TRAINING_COURSES,
  TRAINING_HISTORY,
  TRAINING_REQUEST_TRACKER,
  TRAINING_SCHEDULE_SLOTS,
  TRAINING_SCHEDULES,
  TRAINING_SKILLS_REPORT,
  TRAINING_SUBJECTS,
  TRAINING_TYPES,
} from '../../data/mockTraining'
import type { ReportMode } from '../../types/training'
import { RecruitIconKpi } from '../recruitment/RecruitmentPrimitives'
import {
  EditAttendanceModal,
  EditCategoryModal,
  EditCourseModal,
  EditScheduleModal,
  EditSubjectModal,
  EditTrainingTypeModal,
  NewAttendanceModal,
  NewCategoryModal,
  NewCourseModal,
  NewScheduleModal,
  NewSubjectModal,
  NewTrainingTypeModal,
} from './TrainingModals'
import {
  TrainApprovers,
  TrainEditBtn,
  TrainEmpCell,
  TrainField,
  TrainFieldRow,
  TrainOutlineBtn,
  TrainPrimaryBtn,
  TrainSearchInput,
  TrainSectionPill,
  TrainSelect,
  TrainStatusPill,
  TrainTableCard,
  TrainTableScroll,
  TrainToolbarCard,
} from './TrainingShared'

export function TrainingTypeTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('Management')

  return (
    <div className="train-tab">
      <TrainToolbarCard
        left={<TrainSearchInput placeholder="Search type..." />}
        right={<TrainOutlineBtn onClick={() => setNewOpen(true)}>+ New Training Type</TrainOutlineBtn>}
      />
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Training type name</th>
                <th>Description</th>
                <th>Courses</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_TYPES.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>{row.description}</td>
                  <td>{row.courses}</td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <TrainEditBtn
                      onClick={() => {
                        setEditName(row.name)
                        setEditOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
      <NewTrainingTypeModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditTrainingTypeModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} />
    </div>
  )
}

export function TrainingCategoryTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('Leadership')

  return (
    <div className="train-tab">
      <TrainToolbarCard
        left={
          <>
            <TrainSelect defaultValue="All training types" options={['All training types', 'Management', 'Technical']} />
            <TrainSearchInput placeholder="Search category..." />
          </>
        }
        right={<TrainOutlineBtn onClick={() => setNewOpen(true)}>+ New Category</TrainOutlineBtn>}
      />
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Category name</th>
                <th>Training type</th>
                <th>Description</th>
                <th>Subjects</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_CATEGORIES.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>
                    <TrainStatusPill label={row.trainingType} tone={row.typeTone} />
                  </td>
                  <td>{row.description}</td>
                  <td>{row.subjects}</td>
                  <td>
                    <TrainEditBtn
                      onClick={() => {
                        setEditName(row.name)
                        setEditOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
      <NewCategoryModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditCategoryModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} />
    </div>
  )
}

export function TrainingCourseTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('Leadership essentials')

  return (
    <div className="train-tab">
      <TrainToolbarCard
        left={
          <>
            <TrainSelect defaultValue="All types" options={['All types', 'Management', 'Technical']} />
            <TrainSelect defaultValue="All delivery" options={['All delivery', 'Internal', 'External']} />
            <TrainSearchInput placeholder="Search course..." />
          </>
        }
        right={<TrainPrimaryBtn onClick={() => setNewOpen(true)}>+ New Course</TrainPrimaryBtn>}
      />
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>Course title</th>
                <th>Type / Category</th>
                <th>Delivery</th>
                <th>Frequency</th>
                <th>Mandatory</th>
                <th>Due within</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_COURSES.map((row) => (
                <tr key={row.title}>
                  <td>
                    <strong>{row.title}</strong>
                  </td>
                  <td>
                    <TrainStatusPill label={row.category} tone={row.categoryTone} />
                  </td>
                  <td>{row.delivery}</td>
                  <td>{row.frequency}</td>
                  <td>
                    <TrainStatusPill label={row.mandatory ? 'Yes' : 'No'} tone={row.mandatory ? 'danger' : 'neutral'} />
                  </td>
                  <td>{row.dueWithin}</td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <TrainEditBtn
                      onClick={() => {
                        setEditTitle(row.title)
                        setEditOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
      <NewCourseModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditCourseModal open={editOpen} onClose={() => setEditOpen(false)} title={editTitle} />
    </div>
  )
}

export function TrainingSubjectTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('Team leadership')

  return (
    <div className="train-tab">
      <TrainToolbarCard
        left={
          <>
            <TrainSelect defaultValue="All courses" options={['All courses', 'Leadership essentials']} />
            <TrainSearchInput placeholder="Search subject..." />
          </>
        }
        right={<TrainPrimaryBtn onClick={() => setNewOpen(true)}>+ New Subject</TrainPrimaryBtn>}
      />
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>Subject title</th>
                <th>Course</th>
                <th>Internal trainer</th>
                <th>External trainer</th>
                <th>Achieve skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_SUBJECTS.map((row) => (
                <tr key={row.title}>
                  <td>
                    <strong>{row.title}</strong>
                  </td>
                  <td>{row.course}</td>
                  <td>{row.internalTrainer}</td>
                  <td>{row.externalTrainer}</td>
                  <td>
                    <TrainStatusPill label={row.skill} tone={row.skillTone} />
                  </td>
                  <td>
                    <TrainEditBtn
                      onClick={() => {
                        setEditTitle(row.title)
                        setEditOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
      <NewSubjectModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditSubjectModal open={editOpen} onClose={() => setEditOpen(false)} title={editTitle} />
    </div>
  )
}

export function TrainingScheduleTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="train-tab">
      <TrainToolbarCard
        left={
          <>
            <TrainSelect defaultValue="All courses" options={['All courses', 'Leadership essentials']} />
            <TrainSelect defaultValue="All status" options={['All status', 'Upcoming', 'Ongoing']} />
            <TrainSelect defaultValue="dd/mm/yyyy" options={['dd/mm/yyyy', '12/05/2026']} />
          </>
        }
        right={
          <>
            <TrainOutlineBtn>Copy schedule</TrainOutlineBtn>
            <TrainPrimaryBtn onClick={() => setNewOpen(true)}>+ Create New</TrainPrimaryBtn>
          </>
        }
      />
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>Course title</th>
                <th>Type</th>
                <th>Period</th>
                <th>Days</th>
                <th>Fee (MYR)</th>
                <th>Company cont.</th>
                <th>Request before</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_SCHEDULES.map((row) => (
                <tr key={`${row.course}-${row.period}`}>
                  <td>
                    <strong>{row.course}</strong>
                  </td>
                  <td>{row.type}</td>
                  <td>{row.period}</td>
                  <td>{row.days}</td>
                  <td>{row.fee}</td>
                  <td>
                    <strong className="tone-purple">{row.companyCont}</strong>
                  </td>
                  <td>{row.requestBefore}</td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <TrainEditBtn onClick={() => setEditOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
      <NewScheduleModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditScheduleModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  )
}

export function TrainingRequestTab() {
  const [slots, setSlots] = useState([true, true, false])

  return (
    <div className="train-tab train-split">
      <div className="train-panel">
        <h3 className="train-panel-title">NEW TRAINING REQUEST</h3>
        <TrainField label="Course title" required>
          <TrainSelect defaultValue="Excel advanced" options={['Excel advanced', 'Leadership essentials', 'Agile & Scrum']} />
        </TrainField>
        <TrainFieldRow>
          <TrainField label="Date from" required>
            <input type="text" className="train-input" defaultValue="12/05/2026" />
          </TrainField>
          <TrainField label="Date to" required>
            <input type="text" className="train-input" defaultValue="14/05/2026" />
          </TrainField>
        </TrainFieldRow>
        <TrainFieldRow>
          <TrainField label="No. of days">
            <input type="text" className="train-input readonly" defaultValue="3" readOnly />
          </TrainField>
          <TrainField label="Course fee (MYR)">
            <input type="text" className="train-input readonly" defaultValue="500.00" readOnly />
          </TrainField>
        </TrainFieldRow>
        <div className="train-field">
          <span>
            Training schedule selection <em className="train-req">*</em>
          </span>
          {TRAINING_SCHEDULE_SLOTS.map((slot, i) => (
            <label key={slot} className="train-check-row">
              <input type="checkbox" checked={slots[i]} onChange={(e) => setSlots((s) => s.map((v, j) => (j === i ? e.target.checked : v)))} />
              {slot}
            </label>
          ))}
        </div>
        <TrainField label="Location" required>
          <input type="text" className="train-input" defaultValue="Training room A, Level 3" />
        </TrainField>
        <TrainField label="Request reason">
          <textarea className="train-input" rows={3} placeholder="Reason for this training request..." />
        </TrainField>
        <label className="train-check-row">
          <input type="checkbox" defaultChecked />
          Send email notification to approver
        </label>
        <div className="train-form-actions">
          <TrainOutlineBtn>Cancel</TrainOutlineBtn>
          <TrainPrimaryBtn>Submit request</TrainPrimaryBtn>
        </div>
      </div>

      <div className="train-panel">
        <div className="train-panel-head">
          <h3 className="train-panel-title">MY TRAINING (STATUS TRACKER)</h3>
          <div className="train-summary-pills">
            <span className="train-sum-pill warning">Pending: 2</span>
            <span className="train-sum-pill success">Allocated: 1</span>
          </div>
        </div>
        <TrainTableScroll>
          <table className="train-table compact">
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {TRAINING_REQUEST_TRACKER.map((row) => (
                <tr key={`${row.course}-${row.date}`}>
                  <td>{row.course}</td>
                  <td>{row.date}</td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <button type="button" className="train-link-btn">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </div>
    </div>
  )
}

export function TrainingBehalfTab() {
  const [employees, setEmployees] = useState(TRAINING_BEHALF_EMPLOYEES)

  return (
    <div className="train-tab train-split">
      <div className="train-panel">
        <h3 className="train-panel-title">REQUEST ON BEHALF</h3>
        <TrainSectionPill>Select employees</TrainSectionPill>
        <TrainField label="Submit for">
          <TrainSelect defaultValue="Individual employee" options={['Individual employee', 'Department']} />
        </TrainField>
        <TrainField label="Department">
          <TrainSelect defaultValue="-- Select --" options={['-- Select --', 'Engineering', 'Operations']} />
        </TrainField>
        <span className="train-field-label">Employees</span>
        {employees.map((emp) => (
          <label key={emp.id} className="train-check-row">
            <input
              type="checkbox"
              checked={emp.checked}
              onChange={(e) => setEmployees((list) => list.map((x) => (x.id === emp.id ? { ...x, checked: e.target.checked } : x)))}
            />
            {emp.label}
          </label>
        ))}
        <TrainSectionPill>Training details</TrainSectionPill>
        <TrainField label="Course title">
          <TrainSelect defaultValue="Leadership essentials (12-14 May)" options={['Leadership essentials (12-14 May)', 'Excel advanced']} />
        </TrainField>
        <TrainField label="Location">
          <input type="text" className="train-input" defaultValue="Training Room A" />
        </TrainField>
        <TrainField label="Company contribution">
          <input type="text" className="train-input" defaultValue="100% / Fixed MYR" />
        </TrainField>
        <label className="train-check-row">
          <input type="checkbox" defaultChecked />
          Send email to approver
        </label>
        <label className="train-check-row">
          <input type="checkbox" />
          Approve now (bypass email approval)
        </label>
        <div className="train-form-actions">
          <TrainOutlineBtn>Cancel</TrainOutlineBtn>
          <TrainPrimaryBtn>Submit on behalf</TrainPrimaryBtn>
        </div>
      </div>

      <div className="train-panel">
        <h3 className="train-panel-title">MY SUBMITTED REQUESTS ON BEHALF</h3>
        <TrainTableScroll>
          <table className="train-table compact">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_BEHALF_SUBMITTED.map((row) => (
                <tr key={`${row.name}-${row.course}`}>
                  <td>
                    <TrainEmpCell initials={row.initials} name={row.name} color={row.avatarColor} />
                  </td>
                  <td>{row.course}</td>
                  <td>{row.date}</td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </div>
    </div>
  )
}

export function TrainingApprovalTab() {
  return (
    <div className="train-tab">
      <div className="train-approval-head">
        <div>
          <h3 className="train-panel-title">APPROVAL QUEUE</h3>
          <p className="train-muted">Please review pending training nominations and verify resource limits</p>
        </div>
        <span className="train-pending-badge">🕐 2 pending approvals</span>
      </div>
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Course</th>
                <th>Date</th>
                <th>Location</th>
                <th>Approved by</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_APPROVALS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <TrainEmpCell initials={row.initials} name={row.name} color={row.avatarColor} />
                  </td>
                  <td>
                    <strong>{row.course}</strong>
                  </td>
                  <td>{row.date}</td>
                  <td>{row.location}</td>
                  <td>
                    <TrainApprovers approvers={row.approvers} />
                  </td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    {row.processed ? (
                      <em className="train-muted">Processed</em>
                    ) : (
                      <div className="train-action-pair">
                        <button type="button" className="train-approve-btn">
                          ✓ Approve
                        </button>
                        <button type="button" className="train-deny-btn">
                          ✕ Deny
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
    </div>
  )
}

export function TrainingAttendanceTab() {
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="train-tab">
      <TrainToolbarCard
        left={
          <>
            <TrainSelect defaultValue="All courses" options={['All courses', 'Leadership']} />
            <TrainSelect defaultValue="All departments" options={['All departments']} />
            <TrainSelect defaultValue="06/05/2026" options={['06/05/2026']} />
            <TrainOutlineBtn>Reset</TrainOutlineBtn>
          </>
        }
      />
      <div className="train-attendance-actions">
        <TrainOutlineBtn onClick={() => setNewOpen(true)}>+ Create New Attendance</TrainOutlineBtn>
      </div>
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Course / Subject</th>
                <th>Schedule date</th>
                <th>Actual date</th>
                <th>Time in</th>
                <th>Time out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_ATTENDANCE.map((row) => (
                <tr key={row.name}>
                  <td>
                    <TrainEmpCell initials={row.initials} name={row.name} color={row.avatarColor} />
                  </td>
                  <td>{row.courseSubject}</td>
                  <td>{row.scheduleDate}</td>
                  <td>{row.actualDate}</td>
                  <td>{row.timeIn}</td>
                  <td>{row.timeOut}</td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <TrainEditBtn onClick={() => setEditOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
      <NewAttendanceModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EditAttendanceModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  )
}

export function TrainingHistoryTab() {
  return (
    <div className="train-tab">
      <TrainToolbarCard
        left={
          <>
            <TrainSelect defaultValue="All status" options={['All status', 'Pending', 'Completed']} />
            <TrainSelect defaultValue="All departments" options={['All departments']} />
            <TrainSelect defaultValue="All courses" options={['All courses']} />
            <TrainSearchInput placeholder="Search employee..." className="sm" />
            <button type="button" className="train-link-btn">
              Reset
            </button>
          </>
        }
        right={<TrainOutlineBtn>Export history</TrainOutlineBtn>}
      />
      <TrainTableCard>
        <TrainTableScroll>
          <table className="train-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Course title</th>
                <th>Days</th>
                <th>Fee (MYR)</th>
                <th>Approved by</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_HISTORY.map((row) => (
                <tr key={row.name}>
                  <td>
                    <TrainEmpCell initials={row.initials} name={row.name} color={row.avatarColor} />
                  </td>
                  <td>
                    <strong>{row.course}</strong>
                  </td>
                  <td>{row.days}</td>
                  <td>{row.fee}</td>
                  <td>
                    <span className={row.approvedTone ? `tone-${row.approvedTone}` : ''}>{row.approvedBy}</span>
                  </td>
                  <td>
                    <TrainStatusPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <TrainEditBtn label="View" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrainTableScroll>
      </TrainTableCard>
    </div>
  )
}

export function TrainingReportsTab() {
  const [mode, setMode] = useState<ReportMode>('compliance')

  return (
    <div className="train-tab">
      <div className="train-reports-head">
        <div>
          <h3 className="train-panel-title">
            <span aria-hidden>📊</span> Training Management Analytics &amp; Reports
          </h3>
          <p className="train-muted">
            Monitor corporate safety compliance, workforce skill acquisitions, and strategic budget allocations.
          </p>
        </div>
        <div className="train-report-toggles">
          <button type="button" className={mode === 'compliance' ? 'active' : ''} onClick={() => setMode('compliance')}>
            Compliance &amp; Safety
          </button>
          <button type="button" className={mode === 'skills' ? 'active' : ''} onClick={() => setMode('skills')}>
            Skills Gap Matrix
          </button>
          <button type="button" className={mode === 'budget' ? 'active' : ''} onClick={() => setMode('budget')}>
            Budget &amp; Vendor Invoices
          </button>
        </div>
      </div>

      <div className="train-kpi-row">
        <RecruitIconKpi
          title="COMPLIANCE RATE"
          value="83.3%"
          subtext="5 of 6 mandatory sign-offs completed"
          icon="🛡"
          iconColor="#059669"
          trend="● ON TRACK"
        />
        <RecruitIconKpi
          title="SKILLS IDENTIFIED"
          value="6 Core Skills"
          subtext="Actively tracked across 4 departments"
          icon="🎓"
          iconColor="#2563eb"
        />
        <RecruitIconKpi
          title="TOTAL INVESTED BUDGET"
          value="MYR 8,400"
          subtext="Committed corporate training funds"
          icon="💰"
          iconColor="#7c3aed"
        />
        <RecruitIconKpi
          title="TRAINING FORMATS"
          value="3 Formats"
          subtext="50% Internal, 30% External, 20% Overseas"
          icon="📈"
          iconColor="#d97706"
        />
      </div>

      <TrainTableCard>
        <TrainToolbarCard
          left={
            <>
              <TrainSearchInput
                placeholder={
                  mode === 'skills'
                    ? 'Search employee, department or skill...'
                    : mode === 'budget'
                      ? 'Search vendor or course...'
                      : 'Search employee or course...'
                }
              />
              {mode === 'skills' ? <TrainSelect defaultValue="All Departments" options={['All Departments', 'Engineering', 'Finance']} /> : null}
            </>
          }
          right={<TrainOutlineBtn>⬇ Export Report Data</TrainOutlineBtn>}
        />
        <TrainTableScroll>
          {mode === 'compliance' ? <ComplianceReportTable /> : null}
          {mode === 'skills' ? <SkillsReportTable /> : null}
          {mode === 'budget' ? <BudgetReportTable /> : null}
        </TrainTableScroll>
      </TrainTableCard>
    </div>
  )
}

function ComplianceReportTable() {
  return (
    <table className="train-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Course title</th>
          <th>Category</th>
          <th>Due date</th>
          <th>Mandatory</th>
          <th>Completion status</th>
          <th>Sign off</th>
        </tr>
      </thead>
      <tbody>
        {TRAINING_COMPLIANCE_REPORT.map((row) => (
          <tr key={row.employee}>
            <td>
              <strong>{row.employee}</strong>
            </td>
            <td>{row.course}</td>
            <td>
              <TrainStatusPill label={row.category} tone="neutral" />
            </td>
            <td>{row.dueDate}</td>
            <td>
              {row.mandatory ? <strong className="tone-warning">Yes</strong> : 'No'}
            </td>
            <td>
              <TrainStatusPill label={row.completionStatus} tone={row.completionTone} />
            </td>
            <td>{row.signOff}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SkillsReportTable() {
  return (
    <table className="train-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Department</th>
          <th>Program enrolled</th>
          <th>Skills acquired / target</th>
          <th>Proficiency state</th>
        </tr>
      </thead>
      <tbody>
        {TRAINING_SKILLS_REPORT.map((row) => (
          <tr key={row.employee}>
            <td>
              <strong>{row.employee}</strong>
            </td>
            <td>{row.department}</td>
            <td>{row.program}</td>
            <td>
              <div className="train-skill-tags">
                {row.skills.map((s) => (
                  <TrainStatusPill key={s} label={s} tone="neutral" />
                ))}
              </div>
            </td>
            <td>
              <TrainStatusPill label={row.proficiency} tone={row.proficiencyTone} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BudgetReportTable() {
  return (
    <table className="train-table">
      <thead>
        <tr>
          <th>Vendor partner</th>
          <th>Covered course program</th>
          <th>Payment type</th>
          <th>Base price</th>
          <th>Company contribution</th>
          <th>Invoice status</th>
        </tr>
      </thead>
      <tbody>
        {TRAINING_BUDGET_REPORT.map((row) => (
          <tr key={row.vendor}>
            <td>
              <strong>{row.vendor}</strong>
            </td>
            <td>{row.course}</td>
            <td>{row.paymentType}</td>
            <td>{row.basePrice}</td>
            <td>
              <strong className="tone-primary">{row.contribution}</strong>
            </td>
            <td>
              <TrainStatusPill label={row.invoiceStatus} tone={row.invoiceTone} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
