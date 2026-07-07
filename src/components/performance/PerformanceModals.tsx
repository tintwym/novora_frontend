import { type ReactNode, useEffect } from 'react'
import { GRANT_VIEW_LIST_ROSTER, SETUP_LINKED_CATEGORIES, VIEW_REPORT_SCORES } from '../../data/mockPerformance'
import { PerfField, PerfFieldRow, PerfGradeBox, PerfIcon } from './PerformanceShared'

type ModalProps = { open: boolean; onClose: () => void }

function PerfModalShell({
  open,
  title,
  confirmLabel,
  onClose,
  onConfirm,
  children,
  wide,
  footer,
}: {
  open: boolean
  title: string
  confirmLabel?: string
  onClose: () => void
  onConfirm?: () => void
  children: ReactNode
  wide?: boolean
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="perf-modal-overlay" role="presentation" onClick={onClose}>
      <div className={`perf-modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="perf-modal-head">
          <span className="perf-modal-dot" aria-hidden />
          <h2>{title}</h2>
          <button type="button" className="perf-modal-close-pill" onClick={onClose}>
            <PerfIcon name="close" className="perf-modal-close-icon" />
            Close
          </button>
        </div>
        <div className="perf-modal-body">{children}</div>
        {footer ?? (
          confirmLabel ? (
            <button type="button" className="perf-modal-save" onClick={onConfirm ?? onClose}>
              {confirmLabel}
            </button>
          ) : null
        )}
      </div>
    </div>
  )
}

function PerfModalInput({ defaultValue, placeholder, type = 'text' }: { defaultValue?: string; placeholder?: string; type?: string }) {
  return <input type={type} className="perf-modal-input" defaultValue={defaultValue} placeholder={placeholder} />
}

function PerfModalSelect({ defaultValue, children }: { defaultValue?: string; children: ReactNode }) {
  return (
    <select className="perf-modal-input" defaultValue={defaultValue}>
      {children}
    </select>
  )
}

function PerfModalTextarea({ defaultValue, placeholder, rows = 3 }: { defaultValue?: string; placeholder?: string; rows?: number }) {
  return <textarea className="perf-modal-input" rows={rows} defaultValue={defaultValue} placeholder={placeholder} />
}

export function NewLevelModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New Level" confirmLabel="Save Level Settings" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Level name">
        <PerfModalInput placeholder="e.g. Intermediate, Expert" />
      </PerfField>
      <PerfField label="Description">
        <PerfModalTextarea placeholder="Brief performance expectation summary" rows={3} />
      </PerfField>
    </PerfModalShell>
  )
}

export function EditLevelModal({ open, onClose, name = 'Basic', description = 'Entry-level performance expectation' }: ModalProps & { name?: string; description?: string }) {
  return (
    <PerfModalShell open={open} title="Edit Level" confirmLabel="Save Level Settings" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Level name">
        <PerfModalInput defaultValue={name} />
      </PerfField>
      <PerfField label="Description">
        <PerfModalTextarea defaultValue={description} rows={3} />
      </PerfField>
    </PerfModalShell>
  )
}

export function NewGradeModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New Grade" confirmLabel="Save Grade Settings" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Grade letter">
        <PerfModalInput placeholder="e.g. A" />
      </PerfField>
      <PerfField label="Grade name">
        <PerfModalInput placeholder="e.g. Excellent" />
      </PerfField>
      <PerfFieldRow>
        <PerfField label="Mark from">
          <PerfModalInput defaultValue="80" />
        </PerfField>
        <PerfField label="Mark to">
          <PerfModalInput defaultValue="100" />
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Apply for performance">
        <PerfModalSelect defaultValue="Yes">
          <option>Yes</option>
          <option>No</option>
        </PerfModalSelect>
      </PerfField>
    </PerfModalShell>
  )
}

export function EditGradeModal({ open, onClose, letter = 'A', name = 'Excellent', from = '80', to = '100' }: ModalProps & { letter?: string; name?: string; from?: string; to?: string }) {
  return (
    <PerfModalShell open={open} title="Edit Grade" confirmLabel="Save Grade Settings" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Grade letter">
        <PerfModalInput defaultValue={letter} />
      </PerfField>
      <PerfField label="Grade name">
        <PerfModalInput defaultValue={name} />
      </PerfField>
      <PerfFieldRow>
        <PerfField label="Mark from">
          <PerfModalInput defaultValue={from} />
        </PerfField>
        <PerfField label="Mark to">
          <PerfModalInput defaultValue={to} />
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Apply for performance">
        <PerfModalSelect defaultValue="Yes">
          <option>Yes</option>
          <option>No</option>
        </PerfModalSelect>
      </PerfField>
    </PerfModalShell>
  )
}

export function NewKpiSettingModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New KPI Setting" confirmLabel="Save KPI Band Settings" onClose={onClose} onConfirm={onClose}>
      <PerfField label="KPI setting name">
        <PerfModalInput placeholder="e.g. Attendance KPI" />
      </PerfField>
      <PerfField label="KPI type">
        <PerfModalSelect defaultValue="Attendance">
          <option>Attendance</option>
          <option>Achievement</option>
        </PerfModalSelect>
      </PerfField>
      <PerfFieldRow>
        <PerfField label="From %">
          <PerfModalInput defaultValue="95" />
        </PerfField>
        <PerfField label="To %">
          <PerfModalInput defaultValue="100" />
        </PerfField>
      </PerfFieldRow>
      <PerfFieldRow>
        <PerfField label="Target %">
          <PerfModalInput defaultValue="100" />
        </PerfField>
        <PerfField label="KPI score">
          <PerfModalInput defaultValue="100" />
        </PerfField>
      </PerfFieldRow>
    </PerfModalShell>
  )
}

export function EditKpiSettingModal(props: ModalProps) {
  return <NewKpiSettingModal {...props} />
}

export function NewEvalTypeModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New Eval Type" confirmLabel="Save Evaluation Type" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Type name">
        <PerfModalInput placeholder="e.g. Year-end appraisal" />
      </PerfField>
      <PerfField label="Every month">
        <PerfModalInput defaultValue="12 months" />
      </PerfField>
      <PerfField label="Achieve KPI">
        <PerfModalSelect defaultValue="Yes">
          <option>Yes</option>
          <option>No</option>
        </PerfModalSelect>
      </PerfField>
      <PerfField label="Notify before">
        <PerfModalInput defaultValue="30 days" />
      </PerfField>
      <PerfField label="Trainee evaluation">
        <PerfModalSelect defaultValue="No">
          <option>Yes</option>
          <option>No</option>
        </PerfModalSelect>
      </PerfField>
      <PerfField label="Appraiser">
        <PerfModalSelect defaultValue="Direct manager">
          <option>Direct manager</option>
          <option>HOD → HR</option>
        </PerfModalSelect>
      </PerfField>
    </PerfModalShell>
  )
}

export function EditEvalTypeModal({ open, onClose, name = 'Year-end appraisal' }: ModalProps & { name?: string }) {
  return (
    <PerfModalShell open={open} title="Edit Eval Type" confirmLabel="Save Evaluation Type" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Type name">
        <PerfModalInput defaultValue={name} />
      </PerfField>
      <PerfField label="Every month">
        <PerfModalInput defaultValue="12 months" />
      </PerfField>
      <PerfField label="Achieve KPI">
        <PerfModalSelect defaultValue="Yes">
          <option>Yes</option>
          <option>No</option>
        </PerfModalSelect>
      </PerfField>
      <PerfField label="Notify before">
        <PerfModalInput defaultValue="30 days" />
      </PerfField>
      <PerfField label="Trainee evaluation">
        <PerfModalSelect defaultValue="No">
          <option>Yes</option>
          <option>No</option>
        </PerfModalSelect>
      </PerfField>
      <PerfField label="Appraiser">
        <PerfModalSelect defaultValue="Direct manager">
          <option>Direct manager</option>
          <option>HOD → HR</option>
        </PerfModalSelect>
      </PerfField>
    </PerfModalShell>
  )
}

export function NewCategoryModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New Category" confirmLabel="Save Category Settings" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Category criteria name">
        <PerfModalInput placeholder="e.g. Technical abilities, Client communication" />
      </PerfField>
      <PerfFieldRow>
        <PerfField label="KPI connection type">
          <PerfModalSelect defaultValue="Attribute">
            <option>Attribute</option>
            <option>Competency</option>
            <option>KPI category</option>
            <option>Attendance KPI</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Weightage percentage %">
          <PerfModalInput defaultValue="20" />
        </PerfField>
      </PerfFieldRow>
      <PerfFieldRow>
        <PerfField label="Scoring system">
          <PerfModalSelect defaultValue="1-5 rating scale">
            <option>1-5 rating scale</option>
            <option>% achievement</option>
            <option>% attendance</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Measurement target">
          <PerfModalInput defaultValue="Measurement index" />
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Levels defined">
        <PerfModalInput defaultValue="4 levels" />
      </PerfField>
    </PerfModalShell>
  )
}

export function EditCategoryModal({ open, onClose, name = 'Technical skills', weight = '25' }: ModalProps & { name?: string; weight?: string }) {
  return (
    <PerfModalShell open={open} title="Edit Category" confirmLabel="Save Category Settings" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Category criteria name">
        <PerfModalInput defaultValue={name} />
      </PerfField>
      <PerfFieldRow>
        <PerfField label="KPI connection type">
          <PerfModalSelect defaultValue="Attribute">
            <option>Attribute</option>
            <option>Competency</option>
            <option>KPI category</option>
            <option>Attendance KPI</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Weightage percentage %">
          <PerfModalInput defaultValue={weight} />
        </PerfField>
      </PerfFieldRow>
      <PerfFieldRow>
        <PerfField label="Scoring system">
          <PerfModalSelect defaultValue="1-5 rating scale">
            <option>1-5 rating scale</option>
            <option>% achievement</option>
            <option>% attendance</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Measurement target">
          <PerfModalInput defaultValue="Measurement index" />
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Levels defined">
        <PerfModalInput defaultValue="4 levels" />
      </PerfField>
    </PerfModalShell>
  )
}

export function NewSetupModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New Setup" confirmLabel="Publish Configuration Setup" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Assessment template setup name">
        <PerfModalInput placeholder="e.g. Year-end Appraisal Form 2026" />
      </PerfField>
      <PerfField label="Evaluation type">
        <PerfModalSelect defaultValue="Year-end appraisal">
          <option>Year-end appraisal</option>
          <option>Probation review</option>
          <option>Mid-year appraisal</option>
          <option>360 Performance Review</option>
        </PerfModalSelect>
      </PerfField>
      <span className="perf-field-label">Linked categories to evaluate</span>
      <div className="perf-checkbox-list">
        {SETUP_LINKED_CATEGORIES.map((item) => (
          <label key={item.label}>
            <input type="checkbox" defaultChecked={item.checked} />
            {item.label}
          </label>
        ))}
      </div>
      <PerfFieldRow>
        <PerfField label="Appraiser notes">
          <PerfModalSelect defaultValue="Yes">
            <option>Yes</option>
            <option>No</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Career objectives">
          <PerfModalSelect defaultValue="Yes">
            <option>Yes</option>
            <option>No</option>
          </PerfModalSelect>
        </PerfField>
      </PerfFieldRow>
    </PerfModalShell>
  )
}

export function GrantPermissionModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="Grant Permission" confirmLabel="Authorize Evaluator Clearance" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Evaluator / Primary appraiser">
        <PerfModalSelect defaultValue="David Ng">
          <option>David Ng</option>
          <option>Nina Reza</option>
          <option>Kevin Lim</option>
        </PerfModalSelect>
      </PerfField>
      <PerfField label="Evaluation framework type">
        <PerfModalSelect defaultValue="Year-end appraisal">
          <option>Year-end appraisal</option>
          <option>Mid-year appraisal</option>
          <option>Probation review</option>
        </PerfModalSelect>
      </PerfField>
      <PerfFieldRow>
        <PerfField label="Access valid from">
          <PerfModalInput defaultValue="1 Jan 2026" />
        </PerfField>
        <PerfField label="Access valid to">
          <PerfModalInput defaultValue="31 Jan 2026" />
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Status">
        <PerfModalSelect defaultValue="Active">
          <option>Active</option>
          <option>On hold</option>
          <option>Expired</option>
        </PerfModalSelect>
      </PerfField>
    </PerfModalShell>
  )
}

export function GrantViewListModal({ open, onClose, evaluator = 'Kevin Lim' }: ModalProps & { evaluator?: string }) {
  return (
    <PerfModalShell
      open={open}
      title="View List"
      onClose={onClose}
      footer={
        <button type="button" className="perf-modal-dismiss" onClick={onClose}>
          Dismiss View list
        </button>
      }
    >
      <div className="perf-view-list-card">
        <span className="perf-section-title">REVIEW AUTHORIZATION</span>
        <div className="perf-view-list-head">
          <strong>{evaluator}</strong>
          <span className="perf-outline-badge">MID-YEAR APPRAISAL</span>
        </div>
      </div>
      <span className="perf-field-label">ASSIGNED EMPLOYEE ROSTER (2)</span>
      <div className="perf-roster-list">
        {GRANT_VIEW_LIST_ROSTER.map((row) => (
          <div key={row.name} className="perf-roster-row">
            <span>{row.name}</span>
            <em className="tone-success">● Authorized</em>
          </div>
        ))}
      </div>
    </PerfModalShell>
  )
}

export function NewEvaluationModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New Evaluation" confirmLabel="Establish Evaluation Workstation" onClose={onClose} onConfirm={onClose} wide>
      <div className="perf-info-banner">
        Initiate a brand new performance evaluation workstation record. You can select any employee and specify initial scorecard attribute scores.
      </div>
      <PerfField label="Select employee" required>
        <PerfModalSelect defaultValue="Ahmad Wahid (EMP-0001) — Operations">
          <option>Ahmad Wahid (EMP-0001) — Operations</option>
          <option>Sarah Lim (EMP-0021)</option>
          <option>Raj Kumar (EMP-0044)</option>
        </PerfModalSelect>
      </PerfField>
      <PerfFieldRow>
        <PerfField label="Review type" required>
          <PerfModalSelect defaultValue="Year-end appraisal">
            <option>Year-end appraisal</option>
            <option>Mid-year appraisal</option>
            <option>Probation review</option>
            <option>360 Performance Review</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Review period" required>
          <PerfModalInput defaultValue="Jan–Dec 2026" />
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Review date" required>
        <PerfModalInput defaultValue="27/06/2026" />
      </PerfField>
      <span className="perf-field-label">INITIAL ATTRIBUTE SCORES (1-5 SCALE)</span>
      <PerfFieldRow>
        <PerfField label="Code Quality">
          <PerfModalSelect defaultValue="4">
            <option>4</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Problem Solving">
          <PerfModalSelect defaultValue="4">
            <option>4</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="System Design">
          <PerfModalSelect defaultValue="4">
            <option>4</option>
          </PerfModalSelect>
        </PerfField>
      </PerfFieldRow>
      <PerfFieldRow>
        <PerfField label="Sprints Completed">
          <PerfModalInput defaultValue="10" />
        </PerfField>
        <PerfField label="Bugs SLA %">
          <PerfModalInput defaultValue="90" />
        </PerfField>
        <PerfField label="Attendance %">
          <PerfModalInput defaultValue="98%" />
        </PerfField>
      </PerfFieldRow>
    </PerfModalShell>
  )
}

export function NewCompetencyModal({ open, onClose }: ModalProps) {
  return (
    <PerfModalShell open={open} title="New Competency" confirmLabel="Save Competency Criteria" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Competency / skill name">
        <PerfModalInput placeholder="e.g. Communication, Technical proficiency" />
      </PerfField>
      <PerfFieldRow>
        <PerfField label="Competency type">
          <PerfModalSelect defaultValue="Competency">
            <option>Competency</option>
            <option>Sub-comp.</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Parent category group">
          <PerfModalSelect defaultValue="—">
            <option>—</option>
            <option>Leadership</option>
            <option>Problem solving</option>
          </PerfModalSelect>
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Definition & criteria">
        <PerfModalTextarea placeholder="Define standard behavioral indicators and rating keys..." rows={4} />
      </PerfField>
    </PerfModalShell>
  )
}

export function EditCompetencyModal({ open, onClose, name = 'Leadership', definition = 'Ability to guide, inspire and influence a team' }: ModalProps & { name?: string; definition?: string }) {
  return (
    <PerfModalShell open={open} title="Edit Competency" confirmLabel="Save Competency Criteria" onClose={onClose} onConfirm={onClose}>
      <PerfField label="Competency / skill name">
        <PerfModalInput defaultValue={name} />
      </PerfField>
      <PerfFieldRow>
        <PerfField label="Competency type">
          <PerfModalSelect defaultValue="Competency">
            <option>Competency</option>
            <option>Sub-comp.</option>
          </PerfModalSelect>
        </PerfField>
        <PerfField label="Parent category group">
          <PerfModalSelect defaultValue="—">
            <option>—</option>
            <option>Leadership</option>
            <option>Problem solving</option>
          </PerfModalSelect>
        </PerfField>
      </PerfFieldRow>
      <PerfField label="Definition & criteria">
        <PerfModalTextarea defaultValue={definition} rows={4} />
      </PerfField>
    </PerfModalShell>
  )
}

export function ViewReportModal({
  open,
  onClose,
  employee = 'Sarah Lim',
  grade = 'A',
  total = '91.7',
}: ModalProps & { employee?: string; grade?: string; total?: string }) {
  return (
    <PerfModalShell
      open={open}
      title="View Report"
      onClose={onClose}
      wide
      footer={
        <div className="perf-modal-footer-split">
          <button type="button" className="perf-modal-save" onClick={onClose}>
            Print EA certificate
          </button>
          <button type="button" className="perf-modal-dismiss" onClick={onClose}>
            Dismiss
          </button>
        </div>
      }
    >
      <div className="perf-report-card">
        <span className="perf-section-title">EMPLOYEE DOSSIER REVIEW CARD</span>
        <div className="perf-view-list-head">
          <strong>{employee}</strong>
          <PerfGradeBox letter={`Grade ${grade}`} bg="#dbeafe" />
        </div>
        <p className="perf-muted sm">Framework Type: Year-end appraisal • Review Period: Jan-Dec 2025</p>
        <p className="perf-muted sm tone-success">Appraiser Manager: David Ng • Status: Completed • Verified</p>
      </div>
      <span className="perf-field-label">SCORE MATRIX PARAMETERS</span>
      {VIEW_REPORT_SCORES.map((row) => (
        <div key={row.label} className="perf-score-row">
          <span>{row.label}</span>
          <strong>{row.score}</strong>
        </div>
      ))}
      <div className="perf-total-score-row">
        <strong>Total Weighted Performance Score</strong>
        <strong>{total} / 100</strong>
      </div>
    </PerfModalShell>
  )
}
