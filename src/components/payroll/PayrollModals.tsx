import { HrField, HrFieldRow, HrInput, HrModal, HrSelect } from '../hr/HrModal'

type ModalProps = { open: boolean; onClose: () => void }

export function AddAllowanceTypeModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="ADD NEW ALLOWANCE TYPE" icon={<span aria-hidden>⊕</span>} confirmLabel="Create Allowance" onClose={onClose} onConfirm={onClose}>
      <HrField label="Allowance name">
        <HrInput placeholder="e.g. Transport allowance" />
      </HrField>
      <HrField label="Policy type">
        <HrSelect defaultValue="Transport">
          <option>Transport</option>
          <option>Meal</option>
          <option>Normal</option>
          <option>Shift</option>
          <option>Grade</option>
        </HrSelect>
      </HrField>
      <HrField label="Amount (MYR)">
        <HrInput placeholder="300.00" />
      </HrField>
      <HrFieldRow>
        <HrField label="Taxable">
          <HrSelect defaultValue="No">
            <option>No</option>
            <option>Yes</option>
          </HrSelect>
        </HrField>
        <HrField label="On payslip">
          <HrSelect defaultValue="Yes">
            <option>Yes</option>
            <option>No</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
    </HrModal>
  )
}

export function EditAllowanceTypeModal({ open, onClose, name = 'Transport allowance' }: ModalProps & { name?: string }) {
  return (
    <HrModal open={open} title="EDIT ALLOWANCE POLICY" icon={<span aria-hidden>✎</span>} confirmLabel="Save Changes" onClose={onClose} onConfirm={onClose}>
      <HrField label="Allowance name">
        <HrInput defaultValue={name} />
      </HrField>
      <HrField label="Policy type">
        <HrSelect defaultValue="Transport">
          <option>Transport</option>
          <option>Meal</option>
          <option>Normal</option>
        </HrSelect>
      </HrField>
      <HrField label="Amount (MYR)">
        <HrInput defaultValue="300.00" />
      </HrField>
      <HrField label="Status">
        <HrSelect defaultValue="Active">
          <option>Active</option>
          <option>Inactive</option>
        </HrSelect>
      </HrField>
    </HrModal>
  )
}

export function AddBonusTypeModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="ADD NEW BONUS TYPE" icon={<span aria-hidden>⊕</span>} confirmLabel="Create Bonus" onClose={onClose} onConfirm={onClose}>
      <HrField label="Bonus name">
        <HrInput placeholder="e.g. Annual performance bonus" />
      </HrField>
      <HrField label="Policy type">
        <HrSelect defaultValue="Normal">
          <option>Normal</option>
          <option>Working service</option>
          <option>LTIP</option>
        </HrSelect>
      </HrField>
      <HrField label="Pay month">
        <HrSelect defaultValue="December">
          <option>December</option>
          <option>On anniversary</option>
          <option>March (FY end)</option>
        </HrSelect>
      </HrField>
      <HrField label="Based on">
        <HrSelect defaultValue="Fixed amount">
          <option>Fixed amount</option>
          <option>Salary x factor</option>
          <option>Performance eval</option>
        </HrSelect>
      </HrField>
    </HrModal>
  )
}

export function AddDepositTypeModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="ADD NEW DEPOSIT TYPE" icon={<span aria-hidden>⊕</span>} confirmLabel="Create Deposit" onClose={onClose} onConfirm={onClose}>
      <HrField label="Deposit type name">
        <HrInput placeholder="e.g. Uniform deposit" />
      </HrField>
      <HrField label="Code">
        <HrInput placeholder="UNI" />
      </HrField>
      <HrField label="Employment status">
        <HrSelect defaultValue="All staff">
          <option>All staff</option>
          <option>Permanent</option>
          <option>Engineering</option>
        </HrSelect>
      </HrField>
      <HrField label="Frequency">
        <HrSelect defaultValue="One-time">
          <option>One-time</option>
          <option>Monthly</option>
        </HrSelect>
      </HrField>
      <HrField label="Amount basis">
        <HrInput placeholder="Fixed MYR 100" />
      </HrField>
    </HrModal>
  )
}

export function AddDeductionTypeModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="ADD NEW DEDUCTION TYPE" icon={<span aria-hidden>⊕</span>} confirmLabel="Create Deduction" onClose={onClose} onConfirm={onClose}>
      <HrField label="Deduction name">
        <HrInput placeholder="e.g. Late deduction" />
      </HrField>
      <HrField label="Type">
        <HrSelect defaultValue="Rota rule">
          <option>Statutory</option>
          <option>Tax</option>
          <option>Rota rule</option>
          <option>Attendance</option>
          <option>Leave</option>
        </HrSelect>
      </HrField>
      <HrField label="Deduction rule">
        <HrInput placeholder="Per minute late" />
      </HrField>
      <HrField label="Amount / rate">
        <HrInput placeholder="MYR 0.50/min" />
      </HrField>
    </HrModal>
  )
}

export function EditDeductionTypeModal({ open, onClose, name = 'EPF (employee)' }: ModalProps & { name?: string }) {
  return (
    <HrModal open={open} title="EDIT DEDUCTION TYPE" icon={<span aria-hidden>✎</span>} confirmLabel="Save Changes" onClose={onClose} onConfirm={onClose}>
      <HrField label="Deduction name">
        <HrInput defaultValue={name} />
      </HrField>
      <HrField label="Type">
        <HrSelect defaultValue="Statutory">
          <option>Statutory</option>
          <option>Tax</option>
          <option>Rota rule</option>
        </HrSelect>
      </HrField>
      <HrField label="Deduction rule">
        <HrInput defaultValue="Based on salary" />
      </HrField>
      <HrField label="Amount / rate">
        <HrInput defaultValue="11%" />
      </HrField>
    </HrModal>
  )
}

export function AddTaxCategoryModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="ADD NEW TAX CATEGORY" icon={<span aria-hidden>⊕</span>} confirmLabel="Create Tax" onClose={onClose} onConfirm={onClose}>
      <HrField label="Tax name">
        <HrInput placeholder="e.g. Personal income tax" />
      </HrField>
      <HrField label="Code">
        <HrInput placeholder="PCB" />
      </HrField>
      <HrField label="Calculate on">
        <HrSelect defaultValue="Monthly salary">
          <option>Monthly salary</option>
          <option>Basic salary</option>
        </HrSelect>
      </HrField>
      <HrField label="Calc. overall income">
        <HrSelect defaultValue="Yes">
          <option>Yes</option>
          <option>No</option>
        </HrSelect>
      </HrField>
    </HrModal>
  )
}

export function EditTaxCategoryModal({ open, onClose, name = 'Personal income tax' }: ModalProps & { name?: string }) {
  return (
    <HrModal open={open} title="EDIT TAX CATEGORY" icon={<span aria-hidden>✎</span>} confirmLabel="Save Changes" onClose={onClose} onConfirm={onClose}>
      <HrField label="Tax name">
        <HrInput defaultValue={name} />
      </HrField>
      <HrField label="Code">
        <HrInput defaultValue="PCB" />
      </HrField>
      <HrField label="Calculate on">
        <HrSelect defaultValue="Monthly salary">
          <option>Monthly salary</option>
          <option>Basic salary</option>
        </HrSelect>
      </HrField>
      <HrField label="Status">
        <HrSelect defaultValue="Active">
          <option>Active</option>
          <option>Inactive</option>
        </HrSelect>
      </HrField>
    </HrModal>
  )
}

export function RegisterEmolumentModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="REGISTER CUSTOM EMOLUMENT" icon={<span aria-hidden>⊕</span>} confirmLabel="Register Emolument" onClose={onClose} onConfirm={onClose}>
      <HrField label="Compensation component name">
        <HrInput placeholder="e.g. Phone allowance" />
      </HrField>
      <HrField label="Reference code">
        <HrInput placeholder="EMOL-07" />
      </HrField>
      <HrField label="Exempt allowance limit">
        <HrInput placeholder="Exempt up to MYR 300 / year" />
      </HrField>
      <HrField label="Taxable status">
        <HrSelect defaultValue="Taxable Gross">
          <option>Taxable Gross</option>
          <option>Exempt Category</option>
        </HrSelect>
      </HrField>
    </HrModal>
  )
}

export function NewPaymentDurationModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="CREATE NEW PAYMENT DURATION" icon={<span aria-hidden>📅</span>} confirmLabel="Create Duration" onClose={onClose} onConfirm={onClose}>
      <HrField label="Duration name">
        <HrInput placeholder="Monthly (Jun 2026)" />
      </HrField>
      <HrFieldRow>
        <HrField label="Period start">
          <HrInput defaultValue="1 Jun 2026" />
        </HrField>
        <HrField label="Period end">
          <HrInput defaultValue="30 Jun 2026" />
        </HrField>
      </HrFieldRow>
      <HrField label="Pay date">
        <HrInput defaultValue="30 Jun 2026" />
      </HrField>
      <HrField label="1-day basic salary based on">
        <HrInput defaultValue="26 working days / month" />
      </HrField>
    </HrModal>
  )
}

export function RunPayrollConfirmModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="EXECUTE MAY 2026 MONTH-END RUN" icon={<span aria-hidden>🧮</span>} confirmLabel="Confirm & Execute Payroll Disbursement" onClose={onClose} onConfirm={onClose} wide>
      <p className="pay-modal-desc">
        Once executed, this action locks monthly calculation parameters, records progressive taxing logs, and disburses digital payslips to active employees.
      </p>
      <div className="pay-run-summary">
        <div>
          <span>Target Headcount</span>
          <strong>430 Active Staff</strong>
        </div>
        <div>
          <span>Estimated Gross Payroll Release</span>
          <strong>MYR 60,598</strong>
        </div>
        <div>
          <span>Tax & EPF Withholdings</span>
          <strong className="tone-danger">- MYR 42,912.44</strong>
        </div>
      </div>
    </HrModal>
  )
}
