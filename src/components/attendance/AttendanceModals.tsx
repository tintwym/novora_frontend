import { HrField, HrFieldRow, HrInput, HrModal, HrSelect } from '../hr/HrModal'

type ModalProps = { open: boolean; onClose: () => void }

export function CreateTimesheetModal({ open, onClose }: ModalProps) {
  return (
    <HrModal
      open={open}
      title="Create Corporate Timesheet"
      icon={<span aria-hidden>⊕</span>}
      confirmLabel="Publish Timesheet"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrField label="Employee record">
        <HrSelect defaultValue="">
          <option value="">-- Choose employee --</option>
          <option>Sarah Lim</option>
          <option>Raj Kumar</option>
        </HrSelect>
      </HrField>
      <HrFieldRow>
        <HrField label="Shift layout">
          <HrSelect defaultValue="Standard shift">
            <option>Standard shift</option>
            <option>Night shift</option>
          </HrSelect>
        </HrField>
        <HrField label="Duty days pattern">
          <HrInput defaultValue="Mon-Fri" />
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Date from">
          <HrInput defaultValue="1 May 2026" />
        </HrField>
        <HrField label="Date to">
          <HrInput defaultValue="31 May 2026" />
        </HrField>
      </HrFieldRow>
      <HrField label="Total target work days">
        <HrInput defaultValue="22" />
      </HrField>
    </HrModal>
  )
}

export function EditTimesheetModal({ open, onClose, employee = 'Sarah Lim' }: ModalProps & { employee?: string }) {
  return (
    <HrModal
      open={open}
      title="Edit Corporate Timesheet"
      icon={<span aria-hidden>⚙</span>}
      confirmLabel="Save Changes"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrField label="Employee record (read-only)">
        <div className="att-readonly-field">
          <strong>{employee}</strong> • Engineering
        </div>
      </HrField>
      <HrFieldRow>
        <HrField label="Shift layout">
          <HrSelect defaultValue="Standard">
            <option>Standard</option>
            <option>Night shift</option>
          </HrSelect>
        </HrField>
        <HrField label="Duty days pattern">
          <HrInput defaultValue="Mon-Fri" />
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Date from">
          <HrInput defaultValue="1 May" />
        </HrField>
        <HrField label="Date to">
          <HrInput defaultValue="31 May" />
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Total target days">
          <HrInput defaultValue="22" />
        </HrField>
        <HrField label="Status">
          <HrSelect defaultValue="Active">
            <option>Active</option>
            <option>On leave</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
    </HrModal>
  )
}

export function CreateShiftPatternModal({ open, onClose }: ModalProps) {
  return (
    <HrModal
      open={open}
      title="Create Corporate Shift Pattern"
      confirmLabel="Create Pattern"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrField label="Pattern name">
        <HrInput placeholder="e.g. Afternoon Shift, EMEA Support" />
      </HrField>
      <HrFieldRow>
        <HrField label="Work hours">
          <HrInput defaultValue="09:00 - 18:00" />
        </HrField>
        <HrField label="Break hours">
          <HrInput defaultValue="13:00 - 14:00 (1h)" />
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Allow in (OT)">
          <HrInput defaultValue="60 mins" />
        </HrField>
        <HrField label="Allow out (OT)">
          <HrInput defaultValue="60 mins" />
        </HrField>
      </HrFieldRow>
      <HrField label="Night shift">
        <HrSelect defaultValue="No">
          <option>No</option>
          <option>Yes</option>
        </HrSelect>
      </HrField>
    </HrModal>
  )
}

export function AddOtSetupModal({ open, onClose }: ModalProps) {
  return (
    <HrModal
      open={open}
      title="Configure Extra Hours Alignment"
      icon={<span className="att-modal-icon-success" aria-hidden>🕐</span>}
      confirmLabel="Approve Allocation"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrField label="Select employee for accordance">
        <HrSelect defaultValue="">
          <option value="">-- Choose employee --</option>
          <option>Raj K</option>
          <option>Sarah L</option>
        </HrSelect>
      </HrField>
      <HrFieldRow>
        <HrField label="OT alignment date">
          <HrInput defaultValue="13/06/2026" />
        </HrField>
        <HrField label="Proposed hours (e.g. 2.5)">
          <HrInput defaultValue="2.0" />
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="OT start time">
          <HrInput defaultValue="06:00 PM" />
        </HrField>
        <HrField label="OT end time">
          <HrInput defaultValue="08:00 PM" />
        </HrField>
      </HrFieldRow>
    </HrModal>
  )
}
