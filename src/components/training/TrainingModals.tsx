import { type ReactNode, useEffect } from 'react'
import { TrainField, TrainFieldRow } from './TrainingShared'

type ModalProps = { open: boolean; onClose: () => void }

function TrainModalShell({
  open,
  title,
  saveLabel,
  onClose,
  children,
}: {
  open: boolean
  title: string
  saveLabel: string
  onClose: () => void
  children: ReactNode
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
    <div className="train-modal-overlay" role="presentation" onClick={onClose}>
      <div className="train-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="train-modal-head">
          <span className="train-modal-dot" aria-hidden />
          <h2>{title}</h2>
          <button type="button" className="train-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="train-modal-body">{children}</div>
        <div className="train-modal-foot">
          <button type="button" className="train-outline-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="train-primary-btn" onClick={onClose}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function TrainInput({ defaultValue, placeholder, readOnly }: { defaultValue?: string; placeholder?: string; readOnly?: boolean }) {
  return <input type="text" className="train-input" defaultValue={defaultValue} placeholder={placeholder} readOnly={readOnly} />
}

function TrainSelect({ defaultValue, options }: { defaultValue: string; options: string[] }) {
  return (
    <select className="train-input" defaultValue={defaultValue}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

function TrainTextarea({ defaultValue, placeholder, rows = 3 }: { defaultValue?: string; placeholder?: string; rows?: number }) {
  return <textarea className="train-input" rows={rows} defaultValue={defaultValue} placeholder={placeholder} />
}

export function NewTrainingTypeModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="New Training Type" saveLabel="Save training type" onClose={onClose}>
      <TrainField label="Training type name">
        <TrainInput placeholder="e.g. Management" />
      </TrainField>
      <TrainField label="Description">
        <TrainTextarea placeholder="Brief description" />
      </TrainField>
    </TrainModalShell>
  )
}

export function EditTrainingTypeModal({ open, onClose, name = 'Management' }: ModalProps & { name?: string }) {
  return (
    <TrainModalShell open={open} title="Edit Training Type" saveLabel="Save training type" onClose={onClose}>
      <TrainField label="Training type name">
        <TrainInput defaultValue={name} />
      </TrainField>
      <TrainField label="Description">
        <TrainTextarea defaultValue="Leadership, strategy & people management" />
      </TrainField>
    </TrainModalShell>
  )
}

export function NewCategoryModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="New Category" saveLabel="Save category" onClose={onClose}>
      <TrainField label="Category name">
        <TrainInput placeholder="e.g. Leadership" />
      </TrainField>
      <TrainField label="Training type">
        <TrainSelect defaultValue="Management" options={['Management', 'Technical', 'Compliance']} />
      </TrainField>
      <TrainField label="Description">
        <TrainTextarea placeholder="Category description" />
      </TrainField>
    </TrainModalShell>
  )
}

export function EditCategoryModal({ open, onClose, name = 'Leadership' }: ModalProps & { name?: string }) {
  return (
    <TrainModalShell open={open} title="Edit Category" saveLabel="Save category" onClose={onClose}>
      <TrainField label="Category name">
        <TrainInput defaultValue={name} />
      </TrainField>
      <TrainField label="Training type">
        <TrainSelect defaultValue="Management" options={['Management', 'Technical', 'Compliance']} />
      </TrainField>
      <TrainField label="Description">
        <TrainTextarea defaultValue="Leading teams & strategy" />
      </TrainField>
    </TrainModalShell>
  )
}

export function NewCourseModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="New Course" saveLabel="Save course" onClose={onClose}>
      <TrainField label="Course title">
        <TrainInput placeholder="e.g. Excel advanced" />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Type / category">
          <TrainSelect defaultValue="Management" options={['Management', 'Technical']} />
        </TrainField>
        <TrainField label="Delivery">
          <TrainSelect defaultValue="Internal" options={['Internal', 'External', 'Overseas']} />
        </TrainField>
      </TrainFieldRow>
      <TrainFieldRow>
        <TrainField label="Frequency">
          <TrainSelect defaultValue="One time" options={['One time', 'Annual', 'Repeat']} />
        </TrainField>
        <TrainField label="Mandatory">
          <TrainSelect defaultValue="Yes" options={['Yes', 'No']} />
        </TrainField>
      </TrainFieldRow>
    </TrainModalShell>
  )
}

export function EditCourseModal({ open, onClose, title = 'Leadership essentials' }: ModalProps & { title?: string }) {
  return (
    <TrainModalShell open={open} title="Edit Course" saveLabel="Save course" onClose={onClose}>
      <TrainField label="Course title">
        <TrainInput defaultValue={title} />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Type / category">
          <TrainSelect defaultValue="Management" options={['Management', 'Technical']} />
        </TrainField>
        <TrainField label="Delivery">
          <TrainSelect defaultValue="Internal" options={['Internal', 'External', 'Overseas']} />
        </TrainField>
      </TrainFieldRow>
      <TrainFieldRow>
        <TrainField label="Frequency">
          <TrainSelect defaultValue="One time" options={['One time', 'Annual', 'Repeat']} />
        </TrainField>
        <TrainField label="Mandatory">
          <TrainSelect defaultValue="Yes" options={['Yes', 'No']} />
        </TrainField>
      </TrainFieldRow>
    </TrainModalShell>
  )
}

export function NewSubjectModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="New Subject" saveLabel="Save subject" onClose={onClose}>
      <TrainField label="Subject title">
        <TrainInput placeholder="e.g. Team leadership" />
      </TrainField>
      <TrainField label="Course category">
        <TrainSelect defaultValue="Leadership essentials" options={['Leadership essentials', 'Excel advanced']} />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Internal trainer">
          <TrainInput />
        </TrainField>
        <TrainField label="External trainer">
          <TrainInput defaultValue="—" />
        </TrainField>
      </TrainFieldRow>
      <TrainField label="Achieved skills">
        <TrainInput placeholder="e.g. People mgmt" />
      </TrainField>
    </TrainModalShell>
  )
}

export function EditSubjectModal({ open, onClose, title = 'Team leadership' }: ModalProps & { title?: string }) {
  return (
    <TrainModalShell open={open} title="Edit Subject" saveLabel="Save subject" onClose={onClose}>
      <TrainField label="Subject title">
        <TrainInput defaultValue={title} />
      </TrainField>
      <TrainField label="Course category">
        <TrainSelect defaultValue="Leadership essentials" options={['Leadership essentials', 'Excel advanced']} />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Internal trainer">
          <TrainInput defaultValue="David Ng" />
        </TrainField>
        <TrainField label="External trainer">
          <TrainInput defaultValue="—" />
        </TrainField>
      </TrainFieldRow>
      <TrainField label="Achieved skills">
        <TrainInput defaultValue="People mgmt" />
      </TrainField>
    </TrainModalShell>
  )
}

export function NewScheduleModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="New Schedule" saveLabel="Save parameters" onClose={onClose}>
      <TrainField label="Course title">
        <TrainSelect defaultValue="Leadership essentials" options={['Leadership essentials', 'Excel advanced', 'Agile & Scrum']} />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Type">
          <TrainSelect defaultValue="Internal" options={['Internal', 'External', 'Overseas']} />
        </TrainField>
        <TrainField label="Period">
          <TrainInput defaultValue="12–14 May" />
        </TrainField>
      </TrainFieldRow>
      <TrainFieldRow>
        <TrainField label="Days">
          <TrainInput defaultValue="3" />
        </TrainField>
        <TrainField label="Fee (MYR)">
          <TrainInput defaultValue="500/pax" />
        </TrainField>
      </TrainFieldRow>
    </TrainModalShell>
  )
}

export function EditScheduleModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="Edit Schedule" saveLabel="Save parameters" onClose={onClose}>
      <TrainField label="Course title">
        <TrainSelect defaultValue="Leadership essentials" options={['Leadership essentials', 'Excel advanced', 'Agile & Scrum']} />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Type">
          <TrainSelect defaultValue="Internal" options={['Internal', 'External', 'Overseas']} />
        </TrainField>
        <TrainField label="Period">
          <TrainInput defaultValue="12–14 May" />
        </TrainField>
      </TrainFieldRow>
      <TrainFieldRow>
        <TrainField label="Days">
          <TrainInput defaultValue="3" />
        </TrainField>
        <TrainField label="Fee (MYR)">
          <TrainInput defaultValue="500/pax" />
        </TrainField>
      </TrainFieldRow>
    </TrainModalShell>
  )
}

export function NewAttendanceModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="New Attendance" saveLabel="Save attendance" onClose={onClose}>
      <TrainField label="Employee name">
        <TrainSelect defaultValue="Sarah Lim" options={['Sarah Lim', 'Raj Kumar', 'Maya Tan']} />
      </TrainField>
      <TrainField label="Course / subject">
        <TrainInput defaultValue="Team leadership" />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Actual date">
          <TrainInput defaultValue="12 May" />
        </TrainField>
        <TrainField label="Status">
          <TrainSelect defaultValue="Present" options={['Present', 'Absent', 'Late']} />
        </TrainField>
      </TrainFieldRow>
      <TrainFieldRow>
        <TrainField label="Time in">
          <TrainInput defaultValue="09:00" />
        </TrainField>
        <TrainField label="Time out">
          <TrainInput defaultValue="13:00" />
        </TrainField>
      </TrainFieldRow>
    </TrainModalShell>
  )
}

export function EditAttendanceModal({ open, onClose }: ModalProps) {
  return (
    <TrainModalShell open={open} title="Edit Attendance" saveLabel="Save attendance" onClose={onClose}>
      <TrainField label="Employee name">
        <TrainSelect defaultValue="Sarah Lim" options={['Sarah Lim', 'Raj Kumar']} />
      </TrainField>
      <TrainField label="Course / subject">
        <TrainInput defaultValue="Leadership — Team leadership" />
      </TrainField>
      <TrainFieldRow>
        <TrainField label="Actual date">
          <TrainInput defaultValue="12 May" />
        </TrainField>
        <TrainField label="Status">
          <TrainSelect defaultValue="Present" options={['Present', 'Absent', 'Late']} />
        </TrainField>
      </TrainFieldRow>
      <TrainFieldRow>
        <TrainField label="Time in">
          <TrainInput defaultValue="09:02" />
        </TrainField>
        <TrainField label="Time out">
          <TrainInput defaultValue="13:05" />
        </TrainField>
      </TrainFieldRow>
    </TrainModalShell>
  )
}
