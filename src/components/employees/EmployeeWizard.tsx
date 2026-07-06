import { type ReactNode, useState } from 'react'
import { HrCheckbox, HrField, HrFieldRow, HrInput, HrSelect } from '../hr/HrModal'

const STEPS = ['Details', 'Personal', 'Off duty', 'Biometric', 'Review'] as const
const FOOTER_LABELS = [
  'Organisation & employment details',
  'Personal & address information',
  'Off duty day configuration',
  'Biometric device registration',
  'Review before saving',
] as const

const TIPS = [
  '• Employee No. can be auto-generated via Settings.\n• Employment Status, Department and Position must be set up in Settings first.\n• Tick "Active" to mark the employee as currently working.',
  '• Nationality and Religion dropdowns are configured in Settings.\n• Passport section is optional — enable it with the checkbox.\n• Tick "same address" if current and permanent addresses match.',
  '• Select days the employee does not work.\n• Full day off means no attendance required.\n• Half day applies to mornings or afternoons based on shift.',
  '• The TA Number must match the number enrolled on the physical biometric device.\n• Multiple terminals can be added with the + button.\n• Enable auto clock-in to skip manual swipes.',
  '• Check all sections before saving.\n• You can go back to any step to make changes.\n• Once saved, the employee record goes live immediately.',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
type DayMode = 'none' | 'full' | 'half'

type BioRow = { ta: string; terminal: string }

type EmployeeWizardProps = {
  onClose: () => void
  onSaved?: () => void
}

export function EmployeeWizard({ onClose, onSaved }: EmployeeWizardProps) {
  const [step, setStep] = useState(0)

  // Step 0
  const [empNo, setEmpNo] = useState('EMP-0343')
  const [activeEmployee, setActiveEmployee] = useState(true)
  const [autoClock, setAutoClock] = useState(false)
  const [ignoreRota, setIgnoreRota] = useState(false)
  const [ignoreSwipe, setIgnoreSwipe] = useState(false)
  const [employmentStatus, setEmploymentStatus] = useState('Permanent')
  const [company, setCompany] = useState('Novora')
  const [location, setLocation] = useState('Kuala Lumpur HQ')
  const [branch, setBranch] = useState('Main Branch')
  const [department, setDepartment] = useState('Engineering')
  const [section, setSection] = useState('Tech Division')
  const [position, setPosition] = useState('Senior Developer')
  const [jobType, setJobType] = useState('Full-time')
  const [appointment, setAppointment] = useState('Confirmed')
  const [jobGrade, setJobGrade] = useState('Grade 7 — Managerial')
  const [joinDate, setJoinDate] = useState('17/06/2020')
  const [positionStart, setPositionStart] = useState('17/06/2020')
  const [reportsTo, setReportsTo] = useState('David Ng (Director of Engineering)')
  const [employerNote, setEmployerNote] = useState('')
  const [remarks, setRemarks] = useState('')

  // Step 1
  const [firstName, setFirstName] = useState('Sarah')
  const [lastName, setLastName] = useState('Lim Wai Ling')
  const [nric, setNric] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('Female')
  const [marital, setMarital] = useState('Married')
  const [nationality, setNationality] = useState('Malaysian')
  const [race, setRace] = useState('Chinese')
  const [religion, setReligion] = useState('Buddhism')
  const [personalEmail, setPersonalEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [passportEnabled, setPassportEnabled] = useState(false)
  const [passportNo, setPassportNo] = useState('')
  const [passportCountry, setPassportCountry] = useState('Malaysia')
  const [passportIssue, setPassportIssue] = useState('')
  const [passportExpiry, setPassportExpiry] = useState('')
  const [addr1, setAddr1] = useState('')
  const [addr2, setAddr2] = useState('')
  const [city, setCity] = useState('Shah Alam')
  const [state, setState] = useState('Selangor')
  const [postcode, setPostcode] = useState('40170')
  const [addrCountry, setAddrCountry] = useState('Malaysia')
  const [samePermanent, setSamePermanent] = useState(true)

  // Step 2 — default Mon+Sat full, Fri half
  const [dayOff, setDayOff] = useState<DayMode[]>(['none', 'full', 'none', 'none', 'none', 'half', 'full'])

  // Step 3
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [bioRows, setBioRows] = useState<BioRow[]>([{ ta: 'TA-00451', terminal: 'Main Lobby — Terminal 1' }])

  function tapDay(index: number, mode: 'full' | 'half') {
    setDayOff((prev) => {
      const next = [...prev]
      if (mode === 'full') {
        next[index] = prev[index] === 'full' ? 'none' : 'full'
      } else {
        next[index] = prev[index] === 'half' ? 'none' : 'half'
      }
      return next
    })
  }

  function next() {
    if (step < 4) setStep((s) => s + 1)
    else {
      onSaved?.()
      onClose()
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1)
    else onClose()
  }

  const fullDays = DAYS.filter((_, i) => dayOff[i] === 'full')
  const halfDays = DAYS.filter((_, i) => dayOff[i] === 'half')
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'New Employee'

  return (
    <div className="emp-wizard-overlay">
      <div className="emp-wizard">
        <header className="emp-wizard-header">
          <button type="button" className="emp-wizard-back" onClick={onClose}>
            ‹ Employee Directory
          </button>
          <div className="emp-wizard-header-actions">
            <button type="button" className="emp-wizard-link">Save as draft</button>
            <button type="button" className="emp-wizard-link" onClick={onClose}>Cancel</button>
            <button type="button" className="emp-wizard-menu" aria-label="More">⋯</button>
          </div>
        </header>

        <div className="emp-wizard-body">
          <div className="emp-wizard-main">
            <WizardStepper step={step} />
            <div className="emp-wizard-content">
              {step === 0 ? (
                <StepDetails
                  empNo={empNo} setEmpNo={setEmpNo}
                  activeEmployee={activeEmployee} setActiveEmployee={setActiveEmployee}
                  autoClock={autoClock} setAutoClock={setAutoClock}
                  ignoreRota={ignoreRota} setIgnoreRota={setIgnoreRota}
                  ignoreSwipe={ignoreSwipe} setIgnoreSwipe={setIgnoreSwipe}
                  employmentStatus={employmentStatus} setEmploymentStatus={setEmploymentStatus}
                  company={company} setCompany={setCompany}
                  location={location} setLocation={setLocation}
                  branch={branch} setBranch={setBranch}
                  department={department} setDepartment={setDepartment}
                  section={section} setSection={setSection}
                  position={position} setPosition={setPosition}
                  jobType={jobType} setJobType={setJobType}
                  appointment={appointment} setAppointment={setAppointment}
                  jobGrade={jobGrade} setJobGrade={setJobGrade}
                  joinDate={joinDate} setJoinDate={setJoinDate}
                  positionStart={positionStart} setPositionStart={setPositionStart}
                  reportsTo={reportsTo} setReportsTo={setReportsTo}
                  employerNote={employerNote} setEmployerNote={setEmployerNote}
                  remarks={remarks} setRemarks={setRemarks}
                />
              ) : null}
              {step === 1 ? (
                <StepPersonal
                  firstName={firstName} setFirstName={setFirstName}
                  lastName={lastName} setLastName={setLastName}
                  nric={nric} setNric={setNric}
                  dob={dob} setDob={setDob}
                  gender={gender} setGender={setGender}
                  marital={marital} setMarital={setMarital}
                  nationality={nationality} setNationality={setNationality}
                  race={race} setRace={setRace}
                  religion={religion} setReligion={setReligion}
                  personalEmail={personalEmail} setPersonalEmail={setPersonalEmail}
                  mobile={mobile} setMobile={setMobile}
                  workEmail={workEmail} setWorkEmail={setWorkEmail}
                  passportEnabled={passportEnabled} setPassportEnabled={setPassportEnabled}
                  passportNo={passportNo} setPassportNo={setPassportNo}
                  passportCountry={passportCountry} setPassportCountry={setPassportCountry}
                  passportIssue={passportIssue} setPassportIssue={setPassportIssue}
                  passportExpiry={passportExpiry} setPassportExpiry={setPassportExpiry}
                  addr1={addr1} setAddr1={setAddr1}
                  addr2={addr2} setAddr2={setAddr2}
                  city={city} setCity={setCity}
                  state={state} setState={setState}
                  postcode={postcode} setPostcode={setPostcode}
                  addrCountry={addrCountry} setAddrCountry={setAddrCountry}
                  samePermanent={samePermanent} setSamePermanent={setSamePermanent}
                />
              ) : null}
              {step === 2 ? (
                <StepOffDuty dayOff={dayOff} onTap={tapDay} />
              ) : null}
              {step === 3 ? (
                <StepBiometric
                  enabled={biometricEnabled}
                  setEnabled={setBiometricEnabled}
                  rows={bioRows}
                  setRows={setBioRows}
                />
              ) : null}
              {step === 4 ? (
                <StepReview
                  name={displayName}
                  empNo={empNo}
                  department={department}
                  position={position}
                  jobType={jobType}
                  employmentStatus={employmentStatus}
                  joinDate={joinDate}
                  jobGrade={jobGrade}
                  company={company}
                  nationality={nationality}
                  dob={dob}
                  nric={nric}
                  mobile={mobile}
                  addr1={addr1}
                  fullDays={fullDays}
                  halfDays={halfDays}
                  bioCount={biometricEnabled ? bioRows.length : 0}
                  autoClock={autoClock}
                />
              ) : null}
            </div>
            <footer className="emp-wizard-footer">
              <span>Step {step + 1}: {FOOTER_LABELS[step]}</span>
              <div className="emp-wizard-footer-btns">
                {step > 0 ? (
                  <button type="button" className="emp-wizard-back-btn" onClick={back}>
                    ← Back
                  </button>
                ) : null}
                <button type="button" className="emp-wizard-next-btn" onClick={next}>
                  {step === 4 ? 'Save employee ✓' : 'Next step →'}
                </button>
              </div>
            </footer>
          </div>
          <aside className="emp-wizard-side">
            <div className="emp-wizard-progress-card">
              <span className="emp-wizard-progress-label">STEP {step + 1} OF 5</span>
              <strong className="emp-wizard-progress-pct">{Math.round(((step + 1) / 5) * 100)}%</strong>
              <div className="emp-wizard-progress-track">
                <span style={{ width: `${((step + 1) / 5) * 100}%` }} />
              </div>
              <span className="emp-wizard-progress-sub">complete</span>
            </div>
            <div className="emp-wizard-tips-card">
              <h3>TIPS</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{TIPS[step]}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function WizardStepper({ step }: { step: number }) {
  return (
    <div className="emp-wizard-stepper">
      {STEPS.map((label, i) => {
        const done = i < step
        const active = i === step
        return (
          <div key={label} className="emp-wizard-step">
            <div className="emp-wizard-step-line">
              {i > 0 ? <span className={`line before${i <= step ? ' done' : ''}`} /> : null}
              <span className={`dot${done ? ' done' : ''}${active ? ' active' : ''}`}>
                {done ? '✓' : i + 1}
              </span>
              {i < STEPS.length - 1 ? <span className={`line after${i < step ? ' done' : ''}`} /> : null}
            </div>
            <span className={`emp-wizard-step-label${active ? ' active' : ''}${done ? ' done' : ''}`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function WizCard({ title, badge, trailing, children }: { title: string; badge?: string; trailing?: ReactNode; children: ReactNode }) {
  return (
    <section className="wiz-card">
      <div className="wiz-card-head">
        <div>
          <h3>{title}</h3>
          {badge ? <span className="wiz-badge-required">{badge}</span> : null}
        </div>
        {trailing}
      </div>
      {children}
    </section>
  )
}

type DetailsProps = {
  empNo: string; setEmpNo: (v: string) => void
  activeEmployee: boolean; setActiveEmployee: (v: boolean) => void
  autoClock: boolean; setAutoClock: (v: boolean) => void
  ignoreRota: boolean; setIgnoreRota: (v: boolean) => void
  ignoreSwipe: boolean; setIgnoreSwipe: (v: boolean) => void
  employmentStatus: string; setEmploymentStatus: (v: string) => void
  company: string; setCompany: (v: string) => void
  location: string; setLocation: (v: string) => void
  branch: string; setBranch: (v: string) => void
  department: string; setDepartment: (v: string) => void
  section: string; setSection: (v: string) => void
  position: string; setPosition: (v: string) => void
  jobType: string; setJobType: (v: string) => void
  appointment: string; setAppointment: (v: string) => void
  jobGrade: string; setJobGrade: (v: string) => void
  joinDate: string; setJoinDate: (v: string) => void
  positionStart: string; setPositionStart: (v: string) => void
  reportsTo: string; setReportsTo: (v: string) => void
  employerNote: string; setEmployerNote: (v: string) => void
  remarks: string; setRemarks: (v: string) => void
}

function StepDetails(p: DetailsProps) {
  return (
    <>
      <WizCard title="Profile photo & options">
        <div className="wiz-photo-row">
          <button type="button" className="wiz-photo-upload">
            <span>+</span>
            Upload
          </button>
          <div className="wiz-check-grid">
            <HrCheckbox label="Active employee" checked={p.activeEmployee} onChange={p.setActiveEmployee} />
            <HrCheckbox label="Auto clock-in / clock-out" checked={p.autoClock} onChange={p.setAutoClock} />
            <HrCheckbox label="Ignore rota deduction" checked={p.ignoreRota} onChange={p.setIgnoreRota} />
            <HrCheckbox label="Ignore missing swipe" checked={p.ignoreSwipe} onChange={p.setIgnoreSwipe} />
          </div>
        </div>
      </WizCard>
      <WizCard title="Organisation information" badge="REQUIRED">
        <p className="wiz-section-label">Employment</p>
        <div className="wiz-form-grid">
          <HrField label="Employee No." required>
            <div className="wiz-empno-row">
              <HrInput value={p.empNo} onChange={(e) => p.setEmpNo(e.target.value)} />
              <button type="button" className="hr-outline-btn">Auto-generate</button>
            </div>
          </HrField>
          <HrField label="Employment Status" required>
            <HrSelect value={p.employmentStatus} onChange={(e) => p.setEmploymentStatus(e.target.value)}>
              <option>Permanent</option><option>Contract</option><option>Probation</option>
            </HrSelect>
          </HrField>
          <HrField label="Company" required><HrInput value={p.company} onChange={(e) => p.setCompany(e.target.value)} /></HrField>
          <HrField label="Location" required><HrInput value={p.location} onChange={(e) => p.setLocation(e.target.value)} /></HrField>
          <HrField label="Branch"><HrInput value={p.branch} onChange={(e) => p.setBranch(e.target.value)} /></HrField>
          <HrField label="Department" required>
            <HrSelect value={p.department} onChange={(e) => p.setDepartment(e.target.value)}>
              <option>Engineering</option><option>HR</option><option>Operations</option><option>Finance</option>
            </HrSelect>
          </HrField>
          <HrField label="Section">
            <HrSelect value={p.section} onChange={(e) => p.setSection(e.target.value)}>
              <option>Tech Division</option><option>Core</option><option>Platform</option>
            </HrSelect>
          </HrField>
          <HrField label="Position" required>
            <HrSelect value={p.position} onChange={(e) => p.setPosition(e.target.value)}>
              <option>Senior Developer</option><option>Principal Engineer</option><option>Engineer</option>
            </HrSelect>
          </HrField>
        </div>
        <p className="wiz-section-label">Classification</p>
        <div className="wiz-form-grid">
          <HrField label="Job Type" required>
            <HrSelect value={p.jobType} onChange={(e) => p.setJobType(e.target.value)}>
              <option>Full-time</option><option>Part-time</option>
            </HrSelect>
          </HrField>
          <HrField label="Type of Appointment">
            <HrSelect value={p.appointment} onChange={(e) => p.setAppointment(e.target.value)}>
              <option>Confirmed</option><option>Probation</option>
            </HrSelect>
          </HrField>
          <HrField label="Job Grade">
            <HrSelect value={p.jobGrade} onChange={(e) => p.setJobGrade(e.target.value)}>
              <option>Grade 7 — Managerial</option><option>G-6</option><option>G-7 / Sub B</option>
            </HrSelect>
          </HrField>
          <HrField label="Join Date" required><HrInput value={p.joinDate} onChange={(e) => p.setJoinDate(e.target.value)} /></HrField>
          <HrField label="Position Start Date"><HrInput value={p.positionStart} onChange={(e) => p.setPositionStart(e.target.value)} /></HrField>
          <HrField label="Reports To">
            <HrSelect value={p.reportsTo} onChange={(e) => p.setReportsTo(e.target.value)}>
              <option>David Ng (Director of Engineering)</option><option>Engineering Manager</option>
            </HrSelect>
          </HrField>
        </div>
        <p className="wiz-section-label">Notes</p>
        <HrField label="Employer's Note">
          <textarea className="hr-input hr-textarea" rows={3} placeholder="Internal notes visible only to HR admins..." value={p.employerNote} onChange={(e) => p.setEmployerNote(e.target.value)} />
        </HrField>
        <HrField label="Remarks">
          <textarea className="hr-input hr-textarea" rows={3} placeholder="General remarks about this employee..." value={p.remarks} onChange={(e) => p.setRemarks(e.target.value)} />
        </HrField>
      </WizCard>
    </>
  )
}

function StepPersonal(p: {
  firstName: string; setFirstName: (v: string) => void
  lastName: string; setLastName: (v: string) => void
  nric: string; setNric: (v: string) => void
  dob: string; setDob: (v: string) => void
  gender: string; setGender: (v: string) => void
  marital: string; setMarital: (v: string) => void
  nationality: string; setNationality: (v: string) => void
  race: string; setRace: (v: string) => void
  religion: string; setReligion: (v: string) => void
  personalEmail: string; setPersonalEmail: (v: string) => void
  mobile: string; setMobile: (v: string) => void
  workEmail: string; setWorkEmail: (v: string) => void
  passportEnabled: boolean; setPassportEnabled: (v: boolean) => void
  passportNo: string; setPassportNo: (v: string) => void
  passportCountry: string; setPassportCountry: (v: string) => void
  passportIssue: string; setPassportIssue: (v: string) => void
  passportExpiry: string; setPassportExpiry: (v: string) => void
  addr1: string; setAddr1: (v: string) => void
  addr2: string; setAddr2: (v: string) => void
  city: string; setCity: (v: string) => void
  state: string; setState: (v: string) => void
  postcode: string; setPostcode: (v: string) => void
  addrCountry: string; setAddrCountry: (v: string) => void
  samePermanent: boolean; setSamePermanent: (v: boolean) => void
}) {
  return (
    <>
      <WizCard
        title="Personal information"
        badge="REQUIRED"
        trailing={<span className="wiz-identity-badge">IDENTITY</span>}
      >
        <div className="wiz-form-grid">
          <HrField label="First Name" required><HrInput value={p.firstName} onChange={(e) => p.setFirstName(e.target.value)} placeholder="e.g. Sarah" /></HrField>
          <HrField label="Last Name" required><HrInput value={p.lastName} onChange={(e) => p.setLastName(e.target.value)} placeholder="e.g. Lim Wai Ling" /></HrField>
          <HrField label="NRIC / National ID" required><HrInput value={p.nric} onChange={(e) => p.setNric(e.target.value)} /></HrField>
          <HrField label="Date of Birth" required><HrInput value={p.dob} onChange={(e) => p.setDob(e.target.value)} placeholder="dd/mm/yyyy" /></HrField>
          <HrField label="Gender" required>
            <HrSelect value={p.gender} onChange={(e) => p.setGender(e.target.value)}><option>Female</option><option>Male</option></HrSelect>
          </HrField>
          <HrField label="Marital Status">
            <HrSelect value={p.marital} onChange={(e) => p.setMarital(e.target.value)}><option>Married</option><option>Single</option></HrSelect>
          </HrField>
          <HrField label="Nationality" required>
            <HrSelect value={p.nationality} onChange={(e) => p.setNationality(e.target.value)}><option>Malaysian</option><option>Singaporean</option></HrSelect>
          </HrField>
          <HrField label="Race">
            <HrSelect value={p.race} onChange={(e) => p.setRace(e.target.value)}><option>Chinese</option><option>Malay</option><option>Indian</option></HrSelect>
          </HrField>
          <HrField label="Religion">
            <HrSelect value={p.religion} onChange={(e) => p.setReligion(e.target.value)}><option>Buddhism</option><option>Islam</option><option>Christianity</option></HrSelect>
          </HrField>
          <HrField label="Personal Email"><HrInput value={p.personalEmail} onChange={(e) => p.setPersonalEmail(e.target.value)} /></HrField>
          <HrField label="Mobile No."><HrInput value={p.mobile} onChange={(e) => p.setMobile(e.target.value)} /></HrField>
          <HrField label="Work Email"><HrInput value={p.workEmail} onChange={(e) => p.setWorkEmail(e.target.value)} /></HrField>
        </div>
      </WizCard>
      <WizCard
        title="Passport details"
        trailing={<HrCheckbox label="ENABLE" checked={p.passportEnabled} onChange={p.setPassportEnabled} />}
      >
        <div className={`wiz-passport-fields${p.passportEnabled ? '' : ' disabled'}`}>
          <div className="wiz-form-grid">
            <HrField label="Passport No."><HrInput value={p.passportNo} onChange={(e) => p.setPassportNo(e.target.value)} disabled={!p.passportEnabled} /></HrField>
            <HrField label="Country of Issue"><HrInput value={p.passportCountry} onChange={(e) => p.setPassportCountry(e.target.value)} disabled={!p.passportEnabled} /></HrField>
            <HrField label="Issue Date"><HrInput value={p.passportIssue} onChange={(e) => p.setPassportIssue(e.target.value)} disabled={!p.passportEnabled} /></HrField>
            <HrField label="Expiry Date"><HrInput value={p.passportExpiry} onChange={(e) => p.setPassportExpiry(e.target.value)} disabled={!p.passportEnabled} /></HrField>
          </div>
        </div>
      </WizCard>
      <WizCard title="Current address">
        <HrField label="Address Line 1"><HrInput value={p.addr1} onChange={(e) => p.setAddr1(e.target.value)} /></HrField>
        <HrField label="Address Line 2"><HrInput value={p.addr2} onChange={(e) => p.setAddr2(e.target.value)} /></HrField>
        <div className="wiz-form-grid">
          <HrField label="City" required>
            <HrSelect value={p.city} onChange={(e) => p.setCity(e.target.value)}><option>Shah Alam</option><option>Kuala Lumpur</option></HrSelect>
          </HrField>
          <HrField label="State">
            <HrSelect value={p.state} onChange={(e) => p.setState(e.target.value)}><option>Selangor</option><option>KL</option></HrSelect>
          </HrField>
          <HrField label="Postcode"><HrInput value={p.postcode} onChange={(e) => p.setPostcode(e.target.value)} /></HrField>
          <HrField label="Country" required>
            <HrSelect value={p.addrCountry} onChange={(e) => p.setAddrCountry(e.target.value)}><option>Malaysia</option><option>Singapore</option></HrSelect>
          </HrField>
        </div>
        <HrCheckbox label="Permanent address is the same as current address" checked={p.samePermanent} onChange={p.setSamePermanent} />
      </WizCard>
    </>
  )
}

function StepOffDuty({ dayOff, onTap }: { dayOff: DayMode[]; onTap: (i: number, mode: 'full' | 'half') => void }) {
  return (
    <WizCard title="Off duty days">
      <p className="wiz-hint">
        Select the days this employee is off. Click once for full day off, twice for half day, third click to clear.
      </p>
      <p className="wiz-day-row-label full">FULL DAY OFF</p>
      <div className="wiz-day-row">
        {DAYS.map((d, i) => (
          <button
            key={`f-${d}`}
            type="button"
            className={`wiz-day-btn${dayOff[i] === 'full' ? ' full' : ''}`}
            onClick={() => onTap(i, 'full')}
          >
            {d}
          </button>
        ))}
      </div>
      <p className="wiz-day-row-label half">HALF DAY OFF</p>
      <div className="wiz-day-row">
        {DAYS.map((d, i) => (
          <button
            key={`h-${d}`}
            type="button"
            className={`wiz-day-btn${dayOff[i] === 'half' ? ' half' : ''}`}
            onClick={() => onTap(i, 'half')}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="wiz-legend">
        <span><i className="full" /> Full day off</span>
        <span><i className="half" /> Half day off</span>
      </div>
    </WizCard>
  )
}

function StepBiometric({
  enabled,
  setEnabled,
  rows,
  setRows,
}: {
  enabled: boolean
  setEnabled: (v: boolean) => void
  rows: BioRow[]
  setRows: (r: BioRow[]) => void
}) {
  return (
    <WizCard
      title="Biometric registration"
      trailing={<HrCheckbox label="ENABLE BIOMETRIC" checked={enabled} onChange={setEnabled} />}
    >
      <p className="wiz-hint">
        Register the employee on one or more biometric terminals. The TA number must match the number enrolled on the physical device.
      </p>
      {rows.map((row, i) => (
        <div key={i} className="wiz-bio-row">
          <HrFieldRow>
            <HrField label="TA Number" required>
              <HrInput
                value={row.ta}
                onChange={(e) => {
                  const next = [...rows]
                  next[i] = { ...row, ta: e.target.value }
                  setRows(next)
                }}
              />
            </HrField>
            <HrField label="Terminal" required>
              <HrSelect
                value={row.terminal}
                onChange={(e) => {
                  const next = [...rows]
                  next[i] = { ...row, terminal: e.target.value }
                  setRows(next)
                }}
              >
                <option>Main Lobby — Terminal 1</option>
                <option>Level 3 — Terminal 2</option>
              </HrSelect>
            </HrField>
          </HrFieldRow>
          {rows.length > 1 ? (
            <button type="button" className="wiz-remove-row" onClick={() => setRows(rows.filter((_, j) => j !== i))}>×</button>
          ) : null}
        </div>
      ))}
      <button type="button" className="wiz-add-link" onClick={() => setRows([...rows, { ta: '', terminal: 'Main Lobby — Terminal 1' }])}>
        + Add another terminal
      </button>
    </WizCard>
  )
}

function StepReview(p: {
  name: string; empNo: string; department: string; position: string
  jobType: string; employmentStatus: string; joinDate: string; jobGrade: string
  company: string; nationality: string; dob: string; nric: string; mobile: string; addr1: string
  fullDays: string[]; halfDays: string[]
  bioCount: number; autoClock: boolean
}) {
  const initials = p.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'NE'
  return (
    <WizCard title="Review & confirm">
      <div className="wiz-review-header">
        <span className="wiz-review-avatar">{initials}</span>
        <div>
          <h4>{p.name}</h4>
          <p>{p.empNo} • {p.department} • {p.position}</p>
        </div>
      </div>
      <div className="wiz-review-grid">
        <div>
          <h5>DETAILS</h5>
          <dl>
            <div><dt>Company</dt><dd>{p.company}</dd></div>
            <div><dt>Department</dt><dd>{p.department}</dd></div>
            <div><dt>Job Type</dt><dd>{p.jobType} + {p.employmentStatus}</dd></div>
            <div><dt>Join Date</dt><dd>{p.joinDate}</dd></div>
            <div><dt>Grade</dt><dd>{p.jobGrade}</dd></div>
          </dl>
        </div>
        <div>
          <h5>PERSONAL</h5>
          <dl>
            <div><dt>Nationality</dt><dd>{p.nationality}</dd></div>
            <div><dt>Date of birth</dt><dd>{p.dob || '—'}</dd></div>
            <div><dt>NRIC</dt><dd>{p.nric || '—'}</dd></div>
            <div><dt>Mobile</dt><dd>{p.mobile || '—'}</dd></div>
            <div><dt>Address</dt><dd>{p.addr1 || '—'}</dd></div>
          </dl>
        </div>
        <div>
          <h5>OFF DUTY</h5>
          <dl>
            <div><dt>Full day off</dt><dd className="full">{p.fullDays.join(', ') || '—'}</dd></div>
            <div><dt>Half day off</dt><dd className="half">{p.halfDays.join(', ') || '—'}</dd></div>
          </dl>
        </div>
        <div>
          <h5>BIOMETRIC</h5>
          <dl>
            <div><dt>Terminals</dt><dd>{p.bioCount} terminal(s) active</dd></div>
            <div><dt>Auto clock-in</dt><dd>{p.autoClock ? 'On' : 'Off'}</dd></div>
          </dl>
        </div>
      </div>
      <p className="wiz-review-note">
        ● Please review all information above. Once saved, the employee record will be active and accessible in the directory.
      </p>
    </WizCard>
  )
}
