import type {
  EmployeeProfileDetail,
  ProfileTabId,
} from '../../types/employeeProfile'
import {
  HrAddButton,
  HrCard,
  HrDataTable,
  HrEditBtn,
  HrEditLink,
  HrIconBtn,
  HrKvGrid,
  HrPill,
  HrProgressBar,
} from '../hr/HrPrimitives'

export type ProfileTabActions = {
  onDeleteEmployee: () => void
  onResetPassword: () => void
  onEditEmployment: () => void
  onEditHrNotes: () => void
  onEditPersonal: () => void
  onEditAddress: () => void
  onAddFamily: () => void
  onAddKin: () => void
  onAddBiometric: () => void
  onEditPayRate: () => void
  onAddAllowance: () => void
  onEditAllowance: (index: number) => void
  onAddDeduction: () => void
  onEditDeduction: (index: number) => void
  onAddCareer: () => void
  onEditCareer: (index: number) => void
  onAddEducation: () => void
  onEditEducation: (index: number) => void
  onUploadDocument: () => void
  onViewDocument: (index: number) => void
  onPassportEnabled: (v: boolean) => void
  onSameAsPermanent: (v: boolean) => void
  onBiometricEnabled: (v: boolean) => void
  onAutoClock: (v: boolean) => void
  onIgnoreMissingSwipe: (v: boolean) => void
  onIgnoreRotaDeduction: (v: boolean) => void
}

type TabProps = {
  data: EmployeeProfileDetail
  actions: ProfileTabActions
}

type Props = TabProps & { tab: ProfileTabId }

export function ProfileTabContent({ tab, data, actions }: Props) {
  switch (tab) {
    case 'summary':
      return <SummaryTab data={data} actions={actions} />
    case 'personal':
      return <PersonalTab data={data} actions={actions} />
    case 'family':
      return <FamilyTab data={data} actions={actions} />
    case 'biometric':
      return <BiometricTab data={data} actions={actions} />
    case 'payRate':
      return <PayRateTab data={data} actions={actions} />
    case 'career':
      return <CareerTab data={data} actions={actions} />
    case 'education':
      return <EducationTab data={data} actions={actions} />
    case 'documents':
      return <DocumentsTab data={data} actions={actions} />
  }
}

function SummaryTab({ data, actions }: TabProps) {
  const { summary } = data
  return (
    <div className="emp-tab-stack">
      <div className="emp-tab-grid emp-tab-grid-2">
      <div className="emp-tab-col">
        <HrCard title="Employment details" trailing={<HrEditLink onClick={actions.onEditEmployment} />}>
          <dl className="hr-kv-list">
            {summary.employment.map((row) => (
              <div key={row.key} className="hr-kv-row">
                <dt>{row.key}</dt>
                <dd>
                  {row.key === 'Employment status' ? (
                    <HrPill tone="success">{row.value}</HrPill>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </HrCard>
        <HrCard title="Leave balance">
          {summary.leaveBalances.map((row) => (
            <HrProgressBar
              key={row.label}
              label={row.label}
              percent={(row.used / row.total) * 100}
              color={row.colorKey}
              right={`${row.used} / ${row.total} days`}
            />
          ))}
        </HrCard>
      </div>
      <div className="emp-tab-col">
        <HrCard title="Performance overview">
          {summary.performanceSkills.map((s) => (
            <HrProgressBar
              key={s.label}
              label={s.label}
              percent={s.percent}
              color={s.colorKey}
              right={`${s.percent}%`}
            />
          ))}
          <div className="hr-kv-list hr-kv-list-spaced">
            <div className="hr-kv-row">
              <dt>Last appraisal</dt>
              <dd>{summary.lastAppraisal}</dd>
            </div>
            <div className="hr-kv-row">
              <dt>Next review</dt>
              <dd>{summary.nextReview}</dd>
            </div>
          </div>
        </HrCard>
        <HrCard title="HR notes" trailing={<HrEditLink onClick={actions.onEditHrNotes} />}>
          <p className="emp-notes">{summary.hrNotes}</p>
          <div className="emp-notes-flags">
            <span>
              Blacklisted <strong className={summary.blacklisted ? 'danger' : 'success'}>{summary.blacklisted ? 'Yes' : 'No'}</strong>
            </span>
            <span>
              Auto clock-in <strong>{summary.autoClockIn ? 'Enabled' : 'Disabled'}</strong>
            </span>
          </div>
        </HrCard>
      </div>
      </div>
    </div>
  )
}

function PersonalTab({ data, actions }: TabProps) {
  const p = data.personal
  return (
    <div className="emp-tab-stack">
      <HrCard title="Personal information" trailing={<HrEditLink onClick={actions.onEditPersonal} />}>
        <HrKvGrid
          rows={[
            { label: 'Full Name', value: p.fullName },
            { label: 'Date of Birth', value: p.dateOfBirth },
            { label: 'Gender', value: p.gender },
            { label: 'Nationality', value: p.nationality },
            { label: 'NRIC / ID No.', value: p.nric },
            { label: 'Religion', value: p.religion },
            { label: 'Marital Status', value: p.maritalStatus },
            { label: 'Personal Email', value: p.personalEmail },
            { label: 'Mobile No.', value: p.mobile },
            { label: 'Race', value: p.race },
          ]}
        />
      </HrCard>
      <HrCard
        title="Passport details"
        trailing={
          <label className="hr-checkbox hr-checkbox-inline">
            <input
              type="checkbox"
              checked={p.passportEnabled}
              onChange={(e) => actions.onPassportEnabled(e.target.checked)}
            />
            <span>ENABLE</span>
          </label>
        }
      >
        {p.passportEnabled ? (
          <HrKvGrid
            rows={[
              { label: 'Passport No.', value: p.passportNo },
              { label: 'Country of Issue', value: p.passportCountry },
              { label: 'Issue Date', value: p.passportIssue },
              { label: 'Expiry Date', value: p.passportExpiry },
            ]}
          />
        ) : (
          <p className="emp-muted">Passport section disabled.</p>
        )}
      </HrCard>
      <HrCard title="Current address" trailing={<HrEditLink label="Edit" onClick={actions.onEditAddress} />}>
        <HrKvGrid
          rows={[
            { label: 'Address line 1', value: p.addr1 },
            { label: 'Address line 2', value: p.addr2 },
            { label: 'City', value: p.city },
            { label: 'State', value: p.state },
            { label: 'Postcode', value: p.postcode },
            { label: 'Country', value: p.country },
          ]}
        />
        <label className="hr-checkbox">
          <input
            type="checkbox"
            checked={p.sameAsPermanent}
            onChange={(e) => actions.onSameAsPermanent(e.target.checked)}
          />
          <span>Same as permanent address</span>
        </label>
      </HrCard>
    </div>
  )
}

function FamilyTab({ data, actions }: TabProps) {
  const { family } = data
  return (
    <div className="emp-tab-stack">
      <HrCard title="Family members" trailing={<HrAddButton label="Add member" onClick={actions.onAddFamily} />}>
        <HrDataTable
          columns={['NAME', 'RELATIONSHIP', 'DATE OF BIRTH', 'NRIC / ID', 'TAX EXEMPT', 'PASSPORT', 'ACTIONS']}
          rows={family.members.map((m) => [
            <strong key="n">{m.name}</strong>,
            m.relationship,
            m.dob,
            m.nric,
            <HrPill key="t" tone={m.taxExempt ? 'success' : 'danger'}>{m.taxExempt ? 'YES' : 'NO'}</HrPill>,
            m.passport,
            <button key="e" type="button" className="hr-text-danger">EDIT</button>,
          ])}
        />
      </HrCard>
      <HrCard
        title="Next of kin / emergency contact"
        trailing={<HrAddButton label="Add" onClick={actions.onAddKin} />}
      >
        <HrDataTable
          columns={['NAME', 'RELATIONSHIP', 'CONTACT NO.', 'ADDRESS', 'ACTIONS']}
          rows={family.emergencyContacts.map((c) => [
            c.name,
            c.relationship,
            c.phone,
            c.address,
            <button key="e" type="button" className="hr-text-danger">EDIT</button>,
          ])}
        />
      </HrCard>
    </div>
  )
}

function BiometricTab({ data, actions }: TabProps) {
  const b = data.biometric
  return (
    <div className="emp-tab-stack">
      <HrCard
        title="Biometric device registration"
        trailing={
          <div className="emp-card-actions">
            <label className="hr-checkbox hr-checkbox-inline">
              <input type="checkbox" checked={b.enabled} onChange={(e) => actions.onBiometricEnabled(e.target.checked)} />
              <span>ENABLED</span>
            </label>
            <HrAddButton label="Add device" onClick={actions.onAddBiometric} />
          </div>
        }
      >
        <HrDataTable
          columns={['TA NUMBER', 'TERMINAL NAME', 'DEVICE TYPE', 'LOCATION', 'STATUS', 'ACTIONS']}
          rows={b.devices.map((d) => [
            d.taNumber,
            d.terminal,
            d.deviceType,
            d.location,
            <HrPill key="s" tone="success">ACTIVE</HrPill>,
            <HrEditLink key="e" label="Edit" />,
          ])}
        />
      </HrCard>
      <HrCard title="Attendance settings">
        <div className="emp-attendance-settings">
          <div className="emp-attendance-checks">
            <label className="hr-checkbox-block">
              <input type="checkbox" checked={b.autoClock} onChange={(e) => actions.onAutoClock(e.target.checked)} />
              <span>
                <strong>Auto clock-in / clock-out</strong>
                <em>System auto-records attendance based on shift.</em>
              </span>
            </label>
            <label className="hr-checkbox-block">
              <input
                type="checkbox"
                checked={b.ignoreMissingSwipe}
                onChange={(e) => actions.onIgnoreMissingSwipe(e.target.checked)}
              />
              <span>
                <strong>Ignore missing swipe</strong>
                <em>Suppress missing swipe alerts.</em>
              </span>
            </label>
            <label className="hr-checkbox-block">
              <input
                type="checkbox"
                checked={b.ignoreRotaDeduction}
                onChange={(e) => actions.onIgnoreRotaDeduction(e.target.checked)}
              />
              <span>
                <strong>Ignore rota deduction</strong>
                <em>Skip deduction rules for this employee.</em>
              </span>
            </label>
          </div>
          <div className="emp-shift-box">
            <span>ASSIGNED SHIFT</span>
            <strong>{b.assignedShift}</strong>
          </div>
        </div>
      </HrCard>
    </div>
  )
}

function PayRateTab({ data, actions }: TabProps) {
  const pay = data.payRate
  return (
    <div className="emp-tab-stack">
      <HrCard title="Base pay rate" trailing={<HrEditLink onClick={actions.onEditPayRate} />}>
        <HrKvGrid
          rows={[
            { label: 'Pay Grade', value: pay.payGrade },
            { label: 'Pay Type', value: pay.payType },
            { label: 'Currency', value: pay.currency },
            { label: 'Basic Salary', value: <span className="emp-salary">MYR {pay.basicSalary}</span> },
            { label: 'Effective Date', value: pay.effectiveDate },
            { label: 'Bank Account', value: pay.bankMasked },
          ]}
        />
      </HrCard>
      <HrCard
        title="Allowances"
        subtitle="Recurring or one-off positive wage components"
        trailing={<HrAddButton label="Add Allowance" onClick={actions.onAddAllowance} />}
      >
        <PayLinesTable
          kind="allowance"
          rows={pay.allowances}
          onEdit={actions.onEditAllowance}
        />
      </HrCard>
      <HrCard
        title="Deductions"
        subtitle="Regular, statutory or voluntary wage deductions"
        trailing={<HrAddButton label="Add Deduction" onClick={actions.onAddDeduction} />}
      >
        <PayLinesTable
          kind="deduction"
          rows={pay.deductions}
          onEdit={actions.onEditDeduction}
        />
      </HrCard>
      <div className="emp-net-pay">
        <div className="emp-net-pay-copy">
          <span className="emp-net-pay-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v10M9 10h4.5a2.5 2.5 0 010 5H9" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <div>
            <strong>ESTIMATED NET PAY (MONTHLY)</strong>
            <span>Basic + Allowances − Deductions</span>
          </div>
        </div>
        <div className="emp-net-pay-total">
          <span className="emp-net-pay-arrow" aria-hidden>↓</span>
          <strong className="emp-net-amount">MYR {pay.estimatedNetMonthly}</strong>
        </div>
      </div>
    </div>
  )
}

function PayLinesTable({
  kind,
  rows,
  onEdit,
}: {
  kind: 'allowance' | 'deduction'
  rows: EmployeeProfileDetail['payRate']['allowances']
  onEdit: (index: number) => void
}) {
  const isAllowance = kind === 'allowance'
  return (
    <HrDataTable
      columns={
        isAllowance
          ? ['ALLOWANCE TYPE', 'AMOUNT (MYR)', 'FREQUENCY', 'TAXABLE', 'STATUS', 'ACTIONS']
          : ['DEDUCTION TYPE', 'AMOUNT (MYR)', 'FREQUENCY', 'REFERENCE', 'STATUS', 'ACTIONS']
      }
      rows={rows.map((r, i) => [
        r.label,
        <span key="a" className={isAllowance ? 'emp-amount-pos' : 'emp-amount-neg'}>
          MYR {r.amount}
        </span>,
        r.frequency,
        isAllowance ? (
          <HrPill key="t" tone={r.taxable ? 'taxYes' : 'taxNo'}>{r.taxable ? 'YES' : 'NO'}</HrPill>
        ) : (
          (r.ref ?? '—')
        ),
        <HrPill key="s" tone="success">ACTIVE</HrPill>,
        <div key="act" className="emp-row-actions">
          <HrEditBtn onClick={() => onEdit(i)} />
          <HrIconBtn label="Delete">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          </HrIconBtn>
        </div>,
      ])}
    />
  )
}

function CareerTab({ data, actions }: TabProps) {
  return (
    <HrCard
      title="Career history"
      subtitle="Previous professional roles and corporate experience"
      trailing={<HrAddButton label="Add Career Entry" onClick={actions.onAddCareer} />}
    >
      <HrDataTable
        columns={['COMPANY', 'POSITION', 'FROM', 'TO', 'REASON FOR LEAVING', 'ACTIONS']}
        rows={data.career.rows.map((r, i) => [
          <strong key="c">{r.company}</strong>,
          r.position,
          r.fromLabel,
          r.toLabel,
          r.reason,
          <div key="a" className="emp-row-actions">
            <HrEditBtn onClick={() => actions.onEditCareer(i)} />
            <HrIconBtn label="Delete">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
            </HrIconBtn>
          </div>,
        ])}
      />
    </HrCard>
  )
}

function EducationTab({ data, actions }: TabProps) {
  return (
    <HrCard
      title="Education"
      subtitle="Academic credentials and degrees"
      trailing={<HrAddButton label="Add Education" onClick={actions.onAddEducation} />}
    >
      <HrDataTable
        columns={['INSTITUTION', 'QUALIFICATION', 'FIELD OF STUDY', 'YEAR', 'GRADE', 'ACTIONS']}
        rows={data.education.rows.map((r, i) => [
          <strong key="i">{r.institution}</strong>,
          r.qualification,
          r.field,
          r.year,
          <HrPill key="g" tone="success">{r.gradeLabel.toUpperCase()}</HrPill>,
          <div key="a" className="emp-row-actions">
            <HrEditBtn onClick={() => actions.onEditEducation(i)} />
            <HrIconBtn label="Delete">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
            </HrIconBtn>
          </div>,
        ])}
      />
    </HrCard>
  )
}

function DocumentsTab({ data, actions }: TabProps) {
  return (
    <HrCard title="Employee documents" trailing={<HrAddButton label="Upload" onClick={actions.onUploadDocument} />}>
      <HrDataTable
        columns={['DOCUMENT NAME', 'TYPE', 'UPLOADED', 'EXPIRY', 'ACTIONS']}
        rows={data.documents.rows.map((r, i) => [
          <span key="n" className="emp-doc-name">
            <span className="emp-doc-icon" aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M7 4h7l5 5v11H7V4z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M14 4v5h5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            {r.name}
          </span>,
          <HrPill key="t" tone="info">{r.type}</HrPill>,
          r.uploaded,
          r.expiry,
          <div key="a" className="emp-row-actions">
            <button type="button" className="hr-outline-btn" onClick={() => actions.onViewDocument(i)}>View</button>
            <HrIconBtn label="Delete">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
            </HrIconBtn>
          </div>,
        ])}
      />
    </HrCard>
  )
}
