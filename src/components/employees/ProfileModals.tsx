import { useState } from 'react'
import type {
  CareerRow,
  DocumentRow,
  EducationRow,
  EmployeeProfileDetail,
  FamilyMemberRow,
  PayLineRow,
  ProfilePersonal,
  ProfileSummary,
} from '../../types/employeeProfile'
import {
  HrCheckbox,
  HrField,
  HrFieldRow,
  HrInput,
  HrModal,
  HrSelect,
  HrTextarea,
} from '../hr/HrModal'

export type ModalType =
  | 'employment'
  | 'hrNotes'
  | 'personal'
  | 'address'
  | 'allowance'
  | 'deduction'
  | 'career'
  | 'education'
  | 'upload'
  | 'viewDoc'
  | 'family'
  | 'kin'
  | 'biometric'
  | null

type ProfileModalsProps = {
  modal: ModalType
  editIndex: number | null
  data: EmployeeProfileDetail
  onClose: () => void
  onSaveSummary: (summary: ProfileSummary) => void
  onSavePersonal: (personal: ProfilePersonal) => void
  onSaveAllowance: (row: PayLineRow, index: number | null) => void
  onSaveDeduction: (row: PayLineRow, index: number | null) => void
  onSaveCareer: (row: CareerRow, index: number | null) => void
  onSaveEducation: (row: EducationRow, index: number | null) => void
  onSaveDocument: (row: DocumentRow) => void
  onSaveFamily: (row: FamilyMemberRow) => void
}

export function ProfileModals({
  modal,
  editIndex,
  data,
  onClose,
  onSaveSummary,
  onSavePersonal,
  onSaveAllowance,
  onSaveDeduction,
  onSaveCareer,
  onSaveEducation,
  onSaveDocument,
  onSaveFamily,
}: ProfileModalsProps) {
  if (modal === 'employment') {
    return <EmploymentModal summary={data.summary} onClose={onClose} onSave={onSaveSummary} />
  }
  if (modal === 'hrNotes') {
    return <HrNotesModal notes={data.summary.hrNotes} onClose={onClose} onSave={(notes) =>
      onSaveSummary({ ...data.summary, hrNotes: notes })
    } />
  }
  if (modal === 'personal') {
    return <PersonalModal personal={data.personal} onClose={onClose} onSave={onSavePersonal} />
  }
  if (modal === 'address') {
    return <AddressModal personal={data.personal} onClose={onClose} onSave={onSavePersonal} />
  }
  if (modal === 'allowance') {
    const row = editIndex != null ? data.payRate.allowances[editIndex] : null
    return (
      <AllowanceModal
        row={row}
        onClose={onClose}
        onSave={(r) => onSaveAllowance(r, editIndex)}
      />
    )
  }
  if (modal === 'deduction') {
    const row = editIndex != null ? data.payRate.deductions[editIndex] : null
    return (
      <DeductionModal
        row={row}
        onClose={onClose}
        onSave={(r) => onSaveDeduction(r, editIndex)}
      />
    )
  }
  if (modal === 'career') {
    const row = editIndex != null ? data.career.rows[editIndex] : null
    return <CareerModal row={row} onClose={onClose} onSave={(r) => onSaveCareer(r, editIndex)} />
  }
  if (modal === 'education') {
    const row = editIndex != null ? data.education.rows[editIndex] : null
    return <EducationModal row={row} onClose={onClose} onSave={(r) => onSaveEducation(r, editIndex)} />
  }
  if (modal === 'upload') {
    return <UploadDocumentModal employeeName={data.header.fullName} onClose={onClose} onSave={onSaveDocument} />
  }
  if (modal === 'viewDoc' && editIndex != null) {
    return <ViewDocumentModal doc={data.documents.rows[editIndex]} onClose={onClose} />
  }
  if (modal === 'family') {
    return <FamilyModal onClose={onClose} onSave={onSaveFamily} />
  }
  return null
}

function EmploymentModal({
  summary,
  onClose,
  onSave,
}: {
  summary: ProfileSummary
  onClose: () => void
  onSave: (s: ProfileSummary) => void
}) {
  const map = Object.fromEntries(summary.employment.map((e) => [e.key, e.value]))
  const [company, setCompany] = useState(map['Company'] ?? '')
  const [department, setDepartment] = useState(map['Department'] ?? '')
  const [position, setPosition] = useState(map['Position'] ?? '')
  const [jobType, setJobType] = useState(map['Job Type'] ?? '')
  const [joinDate, setJoinDate] = useState(map['Join date'] ?? '')
  const [grade, setGrade] = useState(map['Job grade'] ?? '')

  return (
    <HrModal
      open
      title="EDIT EMPLOYMENT DETAILS"
      subtitle="Update role, department and employment dates"
      icon={<span>💼</span>}
      onClose={onClose}
      onConfirm={() => {
        const employment = summary.employment.map((e) => {
          if (e.key === 'Company') return { ...e, value: company }
          if (e.key === 'Department') return { ...e, value: department }
          if (e.key === 'Position') return { ...e, value: position }
          if (e.key === 'Job Type') return { ...e, value: jobType }
          if (e.key === 'Join date') return { ...e, value: joinDate }
          if (e.key === 'Job grade') return { ...e, value: grade }
          return e
        })
        onSave({ ...summary, employment })
        onClose()
      }}
    >
      <HrField label="Company" required><HrInput value={company} onChange={(e) => setCompany(e.target.value)} /></HrField>
      <HrField label="Department" required><HrInput value={department} onChange={(e) => setDepartment(e.target.value)} /></HrField>
      <HrField label="Position" required><HrInput value={position} onChange={(e) => setPosition(e.target.value)} /></HrField>
      <HrField label="Job type"><HrInput value={jobType} onChange={(e) => setJobType(e.target.value)} /></HrField>
      <HrField label="Join date"><HrInput value={joinDate} onChange={(e) => setJoinDate(e.target.value)} /></HrField>
      <HrField label="Job grade"><HrInput value={grade} onChange={(e) => setGrade(e.target.value)} /></HrField>
    </HrModal>
  )
}

function HrNotesModal({ notes, onClose, onSave }: { notes: string; onClose: () => void; onSave: (n: string) => void }) {
  const [value, setValue] = useState(notes)
  return (
    <HrModal
      open
      title="HR NOTES"
      subtitle="Internal notes visible to HR admins only"
      icon={<span>📝</span>}
      onClose={onClose}
      onConfirm={() => { onSave(value); onClose() }}
    >
      <HrField label="Notes"><HrTextarea rows={5} value={value} onChange={(e) => setValue(e.target.value)} /></HrField>
    </HrModal>
  )
}

function PersonalModal({
  personal,
  onClose,
  onSave,
}: {
  personal: ProfilePersonal
  onClose: () => void
  onSave: (p: ProfilePersonal) => void
}) {
  const [form, setForm] = useState(personal)
  const set = (k: keyof ProfilePersonal, v: string) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <HrModal
      open
      title="EDIT PERSONAL INFORMATION"
      subtitle="Update employee personal and contact details"
      icon={<span>👤</span>}
      wide
      onClose={onClose}
      onConfirm={() => { onSave(form); onClose() }}
    >
      <HrFieldRow>
        <HrField label="Full Name" required><HrInput value={form.fullName} onChange={(e) => set('fullName', e.target.value)} /></HrField>
        <HrField label="Date of Birth"><HrInput value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} /></HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Gender"><HrInput value={form.gender} onChange={(e) => set('gender', e.target.value)} /></HrField>
        <HrField label="NRIC / ID No."><HrInput value={form.nric} onChange={(e) => set('nric', e.target.value)} /></HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Personal Email"><HrInput value={form.personalEmail} onChange={(e) => set('personalEmail', e.target.value)} /></HrField>
        <HrField label="Mobile No."><HrInput value={form.mobile} onChange={(e) => set('mobile', e.target.value)} /></HrField>
      </HrFieldRow>
    </HrModal>
  )
}

function AddressModal({
  personal,
  onClose,
  onSave,
}: {
  personal: ProfilePersonal
  onClose: () => void
  onSave: (p: ProfilePersonal) => void
}) {
  const [form, setForm] = useState(personal)
  const set = (k: keyof ProfilePersonal, v: string) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <HrModal
      open
      title="EDIT CURRENT ADDRESS"
      subtitle="Update residential address for payroll and correspondence"
      icon={<span>📍</span>}
      wide
      onClose={onClose}
      onConfirm={() => { onSave(form); onClose() }}
    >
      <HrField label="Address line 1"><HrInput value={form.addr1} onChange={(e) => set('addr1', e.target.value)} /></HrField>
      <HrField label="Address line 2"><HrInput value={form.addr2} onChange={(e) => set('addr2', e.target.value)} /></HrField>
      <HrFieldRow>
        <HrField label="City"><HrInput value={form.city} onChange={(e) => set('city', e.target.value)} /></HrField>
        <HrField label="State"><HrInput value={form.state} onChange={(e) => set('state', e.target.value)} /></HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Postcode"><HrInput value={form.postcode} onChange={(e) => set('postcode', e.target.value)} /></HrField>
        <HrField label="Country"><HrInput value={form.country} onChange={(e) => set('country', e.target.value)} /></HrField>
      </HrFieldRow>
    </HrModal>
  )
}

function AllowanceModal({
  row,
  onClose,
  onSave,
}: {
  row: PayLineRow | null
  onClose: () => void
  onSave: (r: PayLineRow) => void
}) {
  const [label, setLabel] = useState(row?.label ?? 'Transport allowance')
  const [amount, setAmount] = useState(row?.amount ?? '300')
  const [frequency, setFrequency] = useState(row?.frequency ?? 'Monthly')
  const [taxable, setTaxable] = useState(row?.taxable ?? false)
  const [active, setActive] = useState(row?.active ?? true)
  return (
    <HrModal
      open
      title={row ? 'EDIT ALLOWANCE' : 'ADD ALLOWANCE'}
      subtitle="Configure recurring or one-off positive wage component"
      icon={<span>+</span>}
      onClose={onClose}
      onConfirm={() => {
        onSave({ label, amount, frequency, taxable, active })
        onClose()
      }}
    >
      <HrField label="Allowance type" required><HrInput value={label} onChange={(e) => setLabel(e.target.value)} /></HrField>
      <HrFieldRow>
        <HrField label="Amount (MYR)" required><HrInput value={amount} onChange={(e) => setAmount(e.target.value)} /></HrField>
        <HrField label="Frequency" required>
          <HrSelect value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option>Monthly</option>
            <option>One-off</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrCheckbox label="Is Taxable" checked={taxable} onChange={setTaxable} />
        <HrField label="Status" required>
          <HrSelect value={active ? 'Active' : 'Inactive'} onChange={(e) => setActive(e.target.value === 'Active')}>
            <option>Active</option>
            <option>Inactive</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
    </HrModal>
  )
}

function DeductionModal({
  row,
  onClose,
  onSave,
}: {
  row: PayLineRow | null
  onClose: () => void
  onSave: (r: PayLineRow) => void
}) {
  const [label, setLabel] = useState(row?.label ?? 'EPF (Employee)')
  const [amount, setAmount] = useState(row?.amount ?? '825')
  const [frequency, setFrequency] = useState(row?.frequency ?? 'Monthly')
  const [ref, setRef] = useState(row?.ref ?? '11%')
  const [active, setActive] = useState(row?.active ?? true)
  return (
    <HrModal
      open
      title={row ? 'EDIT DEDUCTION' : 'ADD DEDUCTION'}
      subtitle="Configure regular, statutory or voluntary wage reduction"
      icon={<span>+</span>}
      onClose={onClose}
      onConfirm={() => {
        onSave({ label, amount, frequency, ref, active })
        onClose()
      }}
    >
      <HrField label="Deduction type" required><HrInput value={label} onChange={(e) => setLabel(e.target.value)} /></HrField>
      <HrFieldRow>
        <HrField label="Amount (MYR)" required><HrInput value={amount} onChange={(e) => setAmount(e.target.value)} /></HrField>
        <HrField label="Frequency" required>
          <HrSelect value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option>Monthly</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Reference / type"><HrInput value={ref} onChange={(e) => setRef(e.target.value)} /></HrField>
        <HrField label="Status" required>
          <HrSelect value={active ? 'Active' : 'Inactive'} onChange={(e) => setActive(e.target.value === 'Active')}>
            <option>Active</option>
            <option>Inactive</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
    </HrModal>
  )
}

function CareerModal({
  row,
  onClose,
  onSave,
}: {
  row: CareerRow | null
  onClose: () => void
  onSave: (r: CareerRow) => void
}) {
  const [company, setCompany] = useState(row?.company ?? '')
  const [position, setPosition] = useState(row?.position ?? '')
  const [fromLabel, setFrom] = useState(row?.fromLabel ?? '')
  const [toLabel, setTo] = useState(row?.toLabel ?? '')
  const [reason, setReason] = useState(row?.reason ?? '')
  return (
    <HrModal
      open
      title={row ? 'EDIT CAREER ENTRY' : 'ADD CAREER ENTRY'}
      subtitle="Record past employee experience and roles"
      icon={<span>💼</span>}
      onClose={onClose}
      onConfirm={() => {
        onSave({ company, position, fromLabel, toLabel, reason })
        onClose()
      }}
    >
      <HrField label="Company" required><HrInput value={company} onChange={(e) => setCompany(e.target.value)} /></HrField>
      <HrField label="Position" required><HrInput value={position} onChange={(e) => setPosition(e.target.value)} /></HrField>
      <HrFieldRow>
        <HrField label="From"><HrInput value={fromLabel} onChange={(e) => setFrom(e.target.value)} /></HrField>
        <HrField label="To"><HrInput value={toLabel} onChange={(e) => setTo(e.target.value)} /></HrField>
      </HrFieldRow>
      <HrField label="Reason for leaving"><HrInput value={reason} onChange={(e) => setReason(e.target.value)} /></HrField>
    </HrModal>
  )
}

function EducationModal({
  row,
  onClose,
  onSave,
}: {
  row: EducationRow | null
  onClose: () => void
  onSave: (r: EducationRow) => void
}) {
  const [institution, setInstitution] = useState(row?.institution ?? '')
  const [qualification, setQualification] = useState(row?.qualification ?? '')
  const [field, setField] = useState(row?.field ?? '')
  const [year, setYear] = useState(row?.year ?? '')
  const [gradeLabel, setGrade] = useState(row?.gradeLabel ?? '')
  return (
    <HrModal
      open
      title={row ? 'EDIT EDUCATION' : 'ADD EDUCATION'}
      subtitle="Record employee academic history"
      icon={<span>🎓</span>}
      onClose={onClose}
      onConfirm={() => {
        onSave({ institution, qualification, field, year, gradeLabel })
        onClose()
      }}
    >
      <HrField label="Institution" required><HrInput placeholder="e.g. University of Malaya" value={institution} onChange={(e) => setInstitution(e.target.value)} /></HrField>
      <HrField label="Qualification" required><HrInput placeholder="e.g. Bachelor's Degree" value={qualification} onChange={(e) => setQualification(e.target.value)} /></HrField>
      <HrField label="Field of study"><HrInput placeholder="e.g. Computer Science" value={field} onChange={(e) => setField(e.target.value)} /></HrField>
      <HrFieldRow>
        <HrField label="Year"><HrInput placeholder="e.g. 2015" value={year} onChange={(e) => setYear(e.target.value)} /></HrField>
        <HrField label="Grade"><HrInput placeholder="e.g. First Class" value={gradeLabel} onChange={(e) => setGrade(e.target.value)} /></HrField>
      </HrFieldRow>
    </HrModal>
  )
}

function UploadDocumentModal({
  employeeName,
  onClose,
  onSave,
}: {
  employeeName: string
  onClose: () => void
  onSave: (r: DocumentRow) => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Contract / Offer')
  const [hasExpiry, setHasExpiry] = useState(false)
  return (
    <HrModal
      open
      title="UPLOAD DOCUMENT"
      subtitle={`Store secure files in the system dossier for ${employeeName}.`}
      icon={<span>⬆</span>}
      confirmLabel="Upload"
      onClose={onClose}
      onConfirm={() => {
        if (!name.trim()) return
        onSave({
          name: name.trim(),
          type: type.split('/')[0].trim(),
          uploaded: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          expiry: hasExpiry ? '—' : '—',
        })
        onClose()
      }}
      confirmDisabled={!name.trim()}
    >
      <div className="hr-dropzone">
        <strong>Drag & drop your file here</strong>
        <button type="button" className="hr-dropzone-link">browse your computer</button>
        <span>Accepts documents up to 10MB (PDF, PNG, JPG)</span>
      </div>
      <HrField label="Document name" required><HrInput placeholder="e.g. Appointment Letter" value={name} onChange={(e) => setName(e.target.value)} /></HrField>
      <HrFieldRow>
        <HrField label="Doc type" required>
          <HrSelect value={type} onChange={(e) => setType(e.target.value)}>
            <option>Contract / Offer</option>
            <option>ID</option>
            <option>Certificate</option>
          </HrSelect>
        </HrField>
        <HrCheckbox label="Has expiry date" checked={hasExpiry} onChange={setHasExpiry} />
      </HrFieldRow>
    </HrModal>
  )
}

function ViewDocumentModal({ doc, onClose }: { doc: DocumentRow; onClose: () => void }) {
  return (
    <HrModal
      open
      title={doc.name.toUpperCase()}
      subtitle={`${doc.type} | Last modified ${doc.uploaded}`}
      wide
      onClose={onClose}
      cancelLabel="Close document frame"
    >
      <div className="hr-doc-preview">
        <div className="hr-doc-preview-header">
          <h3>NOVORA BUSINESS SYSTEMS SDN BHD</h3>
          <p>LEVEL 28, MENARA BINJAI, NO. 2 JALAN BINJAI, 50450 KUALA LUMPUR, MALAYSIA</p>
        </div>
        <p className="hr-doc-meta">
          <span>Date: {doc.uploaded}</span>
          <span>Private & Confidential</span>
        </p>
        <p><strong>SUBJECT: LETTER OF EMPLOYMENT AND TERMS OF CONTRACT</strong></p>
        <p>
          We are pleased to offer you employment with Novora Business Systems Sdn Bhd under the terms
          outlined in this letter.
        </p>
        <div className="hr-doc-terms">
          <div><span>Position</span><strong>Principal Engineer</strong></div>
          <div><span>Department</span><strong>Engineering</strong></div>
          <div><span>Grade Allocation</span><strong>G-7 / Sub B</strong></div>
          <div><span>Commencement Date</span><strong>1 Mar 2022</strong></div>
          <div><span>Basic Monthly Salary</span><strong className="emp-salary">MYR 7,500.00</strong></div>
          <div><span>Employment Status</span><strong>Permanent</strong></div>
        </div>
        <p className="hr-doc-sign">SARAH / SIGNED DIGITAL</p>
      </div>
    </HrModal>
  )
}

function FamilyModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (r: FamilyMemberRow) => void
}) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('Spouse')
  const [dob, setDob] = useState('')
  const [nric, setNric] = useState('')
  const [taxExempt, setTaxExempt] = useState(false)
  return (
    <HrModal
      open
      title="ADD FAMILY RELATION"
      subtitle="Register dependent or next-of-kin for benefits and tax"
      icon={<span>👨‍👩‍👧</span>}
      confirmLabel="Confirm Add"
      onClose={onClose}
      onConfirm={() => {
        onSave({ name, relationship, dob, nric, taxExempt, passport: 'N/A' })
        onClose()
      }}
    >
      <HrField label="Name" required><HrInput value={name} onChange={(e) => setName(e.target.value)} /></HrField>
      <HrField label="Relationship" required>
        <HrSelect value={relationship} onChange={(e) => setRelationship(e.target.value)}>
          <option>Spouse</option>
          <option>Child</option>
          <option>Mother</option>
          <option>Father</option>
        </HrSelect>
      </HrField>
      <HrFieldRow>
        <HrField label="Date of birth"><HrInput value={dob} onChange={(e) => setDob(e.target.value)} /></HrField>
        <HrField label="NRIC / ID"><HrInput value={nric} onChange={(e) => setNric(e.target.value)} /></HrField>
      </HrFieldRow>
      <HrCheckbox label="Tax exempt" checked={taxExempt} onChange={setTaxExempt} />
    </HrModal>
  )
}
