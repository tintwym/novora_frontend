import { type ReactNode, useState } from 'react'

const STEPS = ['Position details', 'Requirements', 'Approval & routing'] as const

type JobRequisitionWizardProps = { onClose: () => void }

export function JobRequisitionWizard({ onClose }: JobRequisitionWizardProps) {
  const [step, setStep] = useState(0)
  const [skills, setSkills] = useState(['HRBP', 'Labour law (MY)', 'Performance mgmt'])
  const [skillInput, setSkillInput] = useState('')
  const [responsibilities, setResponsibilities] = useState(
    '• Partner with department heads on workforce planning\n• Lead end-to-end recruitment for assigned departments\n• Manage employee relations and grievance handling',
  )

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills([...skills, s])
    setSkillInput('')
  }

  function removeSkill(s: string) {
    setSkills(skills.filter((x) => x !== s))
  }

  return (
    <div className="recruit-dark-overlay" role="presentation" onClick={onClose}>
      <div className="recruit-dark-modal recruit-wizard" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <header className="recruit-dark-head">
          <div>
            <h2>New job requisition</h2>
            <p>REQ-2026-013 · Novora HRMS PTE Ltd</p>
          </div>
          <button type="button" className="recruit-dark-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="recruit-dark-stepper" aria-label="Requisition steps">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`recruit-dark-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
            >
              <div className="recruit-dark-step-track">
                {i > 0 ? <span className="line" aria-hidden /> : <span className="line spacer" aria-hidden />}
                <span className="dot">{i < step ? '✓' : i + 1}</span>
                {i < STEPS.length - 1 ? <span className="line" aria-hidden /> : <span className="line spacer" aria-hidden />}
              </div>
              <span className="label">{label}</span>
            </div>
          ))}
        </div>

        <div className="recruit-dark-body">
          {step === 0 ? (
            <>
              <DarkSection title="POSITION DETAILS">
                <div className="recruit-dark-grid">
                  <DarkField label="Position title" required value="HR Business Partner" />
                  <DarkField label="Department" required value="Human Resources" />
                  <DarkField label="Employment type" required value="Permanent" />
                  <DarkField label="Work arrangement" value="On-site" />
                  <DarkField label="Headcount" required value="1" />
                  <DarkField label="Salary range (MYR)" value="5,500 – 7,000" />
                  <DarkField label="Target fill date" required value="13 May 2026" />
                  <DarkField label="Reports to" value="Nina Reza (Head of HR)" />
                </div>
                <DarkTextarea label="Justification / notes" placeholder="Briefly justify the need for this position..." />
              </DarkSection>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <DarkSection title="QUALIFICATIONS">
                <div className="recruit-dark-grid">
                  <DarkSelect label="Minimum education" required value="Bachelor's degree" />
                  <DarkField label="Field of study" placeholder="e.g. Human Resource Management, Business" />
                  <DarkSelect label="Minimum experience (years)" required value="Fresh graduate (0 yrs)" />
                  <DarkSelect label="Language requirement" value="English only" />
                </div>
              </DarkSection>
              <DarkSection title="SKILLS REQUIRED">
                <div className="recruit-skill-tags">
                  {skills.map((s) => (
                    <span key={s}>
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="recruit-skill-add">
                  <input
                    type="text"
                    placeholder="Type a skill and press Add..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button type="button" onClick={addSkill}>
                    + Add skill
                  </button>
                </div>
              </DarkSection>
              <DarkSection title="JOB DESCRIPTION">
                <label className="recruit-dark-field full">
                  <span>
                    Key responsibilities <em>*</em>
                  </span>
                  <textarea rows={5} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
                </label>
              </DarkSection>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <DarkSection title="APPROVAL CHAIN">
                <p className="recruit-dark-hint">Auto-configured from org hierarchy — adjust if needed.</p>
                <div className="recruit-approver-row">
                  <span className="num active">1</span>
                  <div>
                    <strong>Nina Reza</strong>
                    <span>Head of HR · Direct manager approval</span>
                  </div>
                  <RecruitDarkPill tone="warning">Pending</RecruitDarkPill>
                </div>
                <div className="recruit-approver-row">
                  <span className="num">2</span>
                  <div>
                    <strong>Ahmad Wahid</strong>
                    <span>CEO · Final approval (new headcount)</span>
                  </div>
                  <RecruitDarkPill tone="neutral">Waiting</RecruitDarkPill>
                </div>
              </DarkSection>
              <DarkSection title="NOTIFICATION SETTINGS">
                <DarkCheck label="Email approvers when requisition is submitted" checked />
                <DarkCheck label="Notify me when each approver acts" checked />
                <DarkCheck label="Auto-publish job posting when fully approved" checked />
                <DarkCheck label="Notify HR team on approval" />
              </DarkSection>
              <DarkSection title="ASSIGN RECRUITER">
                <div className="recruit-dark-grid">
                  <DarkSelect label="Primary recruiter" required value="Maya Tan (HR Executive)" />
                  <DarkSelect label="Hiring manager" value="Nina Reza (Head of HR)" />
                </div>
              </DarkSection>
              <div className="recruit-summary-card">
                <h3>Requisition summary</h3>
                <dl>
                  <div><dt>Ref. no.</dt><dd>REQ-2026-013</dd></div>
                  <div><dt>Position</dt><dd>HR Business Partner</dd></div>
                  <div><dt>Department</dt><dd>Human Resources</dd></div>
                  <div><dt>Employment type</dt><dd>Permanent · On-site</dd></div>
                  <div><dt>Salary range</dt><dd>MYR 5,500 – 7,000</dd></div>
                  <div><dt>Target fill</dt><dd>13 May 2026</dd></div>
                  <div><dt>Approvers</dt><dd>Nina Reza → Ahmad Wahid</dd></div>
                </dl>
              </div>
            </>
          ) : null}
        </div>

        <footer className="recruit-dark-footer">
          <span>
            Step {step + 1} of 3 — {STEPS[step]}
          </span>
          <div>
            {step > 0 ? (
              <button type="button" className="recruit-dark-ghost" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            ) : (
              <button type="button" className="recruit-dark-ghost" onClick={onClose}>
                Cancel
              </button>
            )}
            {step < 2 ? (
              <button type="button" className="recruit-dark-primary" onClick={() => setStep(step + 1)}>
                Next →
              </button>
            ) : (
              <button type="button" className="recruit-dark-success" onClick={onClose}>
                ✓ Submit requisition
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

export function AddCandidateModal({ onClose }: { onClose: () => void }) {
  return (
    <DarkModal
      title="Add New Candidate Profile"
      subtitle="Create a manual candidate record & submit to screenings pipeline"
      onClose={onClose}
      confirmLabel="Import and screen →"
      onConfirm={onClose}
    >
      <DarkSection title="CANDIDATE CORE IDENTITY" icon="user">
        <DarkField label="Full Name" required placeholder="e.g. Jasmine Kaur" className="full" />
        <div className="recruit-dark-grid">
          <DarkField label="Contact Email" placeholder="e.g. jasmine.kaur@gmail.com" />
          <DarkField label="Phone Number" placeholder="e.g. +60 12-345 6789" />
        </div>
      </DarkSection>
      <DarkSection title="PROFESSIONAL CREDENTIALS" icon="award">
        <div className="recruit-dark-grid">
          <DarkField label="Total Relevant Experience" value="3 yrs" />
          <DarkField label="Highest Educational Qualification" value="Bachelor Degree" />
        </div>
      </DarkSection>
      <DarkSection title="TARGET SPECIFICATIONS" icon="briefcase">
        <div className="recruit-dark-grid">
          <DarkSelect label="Source Channel" value="LinkedIn Job Ads" />
          <DarkSelect label="Target Job Requisition" required value="HR Business Partner (REQ-2025-047)" />
          <DarkField label="Expected Monthly Salary (MYR)" placeholder="e.g. 6,500" />
          <DarkSelect label="Notice Period" value="Immediate / Available immediately" />
        </div>
      </DarkSection>
      <DarkSection title="DOCUMENT ATTACHMENTS">
        <div className="recruit-upload-zone">
          <span>↑</span>
          <p>Drag & drop Candidate CV/Resume PDF or click to browse local folders (Max size: 10MB)</p>
          <div className="recruit-upload-file">jasmine_kaur_cv_screen.pdf · 1.2 MB</div>
        </div>
      </DarkSection>
      <p className="recruit-dark-footnote">* Marked fields are mandatory for screening analysis</p>
    </DarkModal>
  )
}

export function ScheduleInterviewModal({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState<'video' | 'call' | 'physical'>('video')
  return (
    <DarkModal
      title="Schedule Candidate Meeting / Interview"
      subtitle="Connect email addresses, allocate calendar events & assign panel evaluators"
      onClose={onClose}
      wide
      confirmLabel="Schedule & Book Calendar →"
      onConfirm={onClose}
    >
      <div className="recruit-schedule-layout">
        <div>
          <DarkSelect label="Target Candidate Profile" value="-- Choose active candidate record --" className="full" />
          <div className="recruit-dark-grid three">
            <DarkSelect label="Interview Stage" value="Phone screening" />
            <div className="recruit-format-toggle">
              <span>Meeting Format</span>
              <div>
                {(['video', 'call', 'physical'] as const).map((f) => (
                  <button key={f} type="button" className={format === f ? 'active' : ''} onClick={() => setFormat(f)}>
                    {f === 'video' ? 'Video' : f === 'call' ? 'Call' : 'Physical'}
                  </button>
                ))}
              </div>
            </div>
            <DarkSelect label="Expected duration" value="30 mins screening" />
            <DarkField label="Schedule date" value="20/06/2026" />
            <DarkField label="Time slotted" value="11:00 AM" />
            <DarkField label="Meeting address / URL" placeholder="Zoom link or room" />
          </div>
          <DarkField label="Assigned Panel Interviewers · Users" value="Nina Reza + Ahmad Wahid" className="full" />
          <DarkTextarea label="Custom Instructions / Notes to Candidate" placeholder="e.g. Please bring a copy of your project portfolio..." />
          <DarkSection title="NOTIFICATION SETTINGS">
            <DarkCheck label="Email direct calendar RSVP request sheet" checked />
            <DarkCheck label="Send SMS / WhatsApp checklist reminders (24h before)" checked />
          </DarkSection>
        </div>
        <aside className="recruit-calendar-preview">
          <h4>EVALUATOR CORE CALENDARS</h4>
          <p className="date">20 Jun 2026</p>
          <div className="recruit-cal-slot">09:30 AM — Daily Operations Standup</div>
          <div className="recruit-cal-slot active">11:00 AM — Candidate Interview Slot</div>
          <div className="recruit-cal-slot warn">12:30 PM — C-Suite Lunch Meeting</div>
          <div className="recruit-cal-slot">03:00 PM — Quarterly Budget Reviews</div>
          <p className="avail">● Nina Reza — Available</p>
          <p className="avail">● Ahmad Wahid — Available</p>
        </aside>
      </div>
    </DarkModal>
  )
}

export function DraftOfferModal({ onClose }: { onClose: () => void }) {
  const [validity, setValidity] = useState(14)
  const [benefits, setBenefits] = useState({
    medical: true,
    leave: true,
    epf: true,
    relocation: false,
  })
  return (
    <DarkModal
      title="Draft Terms of Contract Offer & Employment Package"
      subtitle="Approve final package, define allowance & review real-time live preview contract papers"
      onClose={onClose}
      wide
      confirmLabel="Approve & Dispatch Package"
      confirmClass="success"
      onConfirm={onClose}
    >
      <div className="recruit-offer-layout">
        <div>
          <DarkSelect label="Approved Candidate Selection" value="-- Select screen passed candidate records --" className="full" />
          <div className="recruit-dark-grid">
            <DarkField label="Starting Basic Salary — MYR" required value="6,000" />
            <DarkField label="Special Position Allowance (MYR)" value="600" />
            <DarkSelect label="Employment Grade" value="G-5 / Sub B" />
            <DarkSelect label="Probation Period Duration" value="3 months" />
          </div>
          <label className="recruit-dark-field full">
            <span>Offer Validity Period — {validity} calendar days</span>
            <input type="range" min={7} max={30} value={validity} onChange={(e) => setValidity(Number(e.target.value))} />
          </label>
          <DarkSection title="CORE BENEFITS INCLUDED">
            <div className="recruit-benefit-grid">
              {[
                ['medical', 'Comprehensive Medical Cover'],
                ['leave', '16 Days Annual Paid Leave'],
                ['epf', 'EPF / SOCSO / EIS Employer Caps'],
                ['relocation', 'Executive Relocation Package'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={benefits[key as keyof typeof benefits] ? 'active' : ''}
                  onClick={() => setBenefits({ ...benefits, [key]: !benefits[key as keyof typeof benefits] })}
                >
                  {benefits[key as keyof typeof benefits] ? '✓' : ''} {label}
                </button>
              ))}
            </div>
          </DarkSection>
        </div>
        <div className="recruit-offer-preview">
          <div className="recruit-letter">
            <header>
              <strong>NOVORA HRMS PTE LTD</strong>
              <span>CONFIDENTIAL // RECORD</span>
            </header>
            <p className="addr">Level 25, Marina Bay Financial Centre, Singapore</p>
            <p className="date">13 June 2026</p>
            <h3>LETTER OF EMPLOYMENT OFFER</h3>
            <p>
              Dear <mark>Select Approved Candidate</mark>,
            </p>
            <p>
              We are pleased to offer you the position of <strong>HR Business Partner</strong> with Novora HRMS PTE Ltd.
            </p>
            <ul>
              <li>Basic Salary: MYR 6,000/month</li>
              <li>Allowances: MYR 600/month</li>
              <li>Internal Grade: G-5 / Sub B</li>
              <li>Probation Range: 3 months</li>
              <li>Expiry Period: This package must be signed within {validity} calendar days.</li>
            </ul>
            <div className="recruit-letter-sign">
              <div>
                <em>Nina Reza</em>
                <span>NINA REZA · HEAD OF HR</span>
              </div>
              <div>
                <span className="line">CANDIDATE SIGNATURE · ACCEPT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="recruit-dark-footnote">* Offers will be dispatched via secure DocuSign envelope to the candidate</p>
    </DarkModal>
  )
}

function DarkModal({
  title,
  subtitle,
  children,
  onClose,
  onConfirm,
  confirmLabel,
  wide,
  confirmClass,
}: {
  title: string
  subtitle: string
  children: ReactNode
  onClose: () => void
  onConfirm: () => void
  confirmLabel: string
  wide?: boolean
  confirmClass?: string
}) {
  return (
    <div className="recruit-dark-overlay" role="presentation" onClick={onClose}>
      <div
        className={`recruit-dark-modal${wide ? ' wide' : ''}`}
        role="dialog"
        aria-modal
        onClick={(e) => e.stopPropagation()}
      >
        <header className="recruit-dark-head">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button type="button" className="recruit-dark-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="recruit-dark-body">{children}</div>
        <footer className="recruit-dark-footer">
          <span />
          <div>
            <button type="button" className="recruit-dark-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={`recruit-dark-primary${confirmClass ? ` ${confirmClass}` : ''}`} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

function DarkSection({ title, children, icon }: { title: string; children: ReactNode; icon?: string }) {
  return (
    <section className="recruit-dark-section">
      <h3>
        {icon ? <span aria-hidden>{icon === 'user' ? '👤' : icon === 'award' ? '🏅' : '💼'}</span> : null}
        {title}
      </h3>
      {children}
    </section>
  )
}

function DarkField({
  label,
  value,
  placeholder,
  required,
  className = '',
}: {
  label: string
  value?: string
  placeholder?: string
  required?: boolean
  className?: string
}) {
  return (
    <label className={`recruit-dark-field${className ? ` ${className}` : ''}`}>
      <span>
        {label}
        {required ? <em>*</em> : null}
      </span>
      <input type="text" defaultValue={value} placeholder={placeholder} />
    </label>
  )
}

function DarkSelect({
  label,
  value,
  required,
  className = '',
}: {
  label: string
  value: string
  required?: boolean
  className?: string
}) {
  return (
    <label className={`recruit-dark-field${className ? ` ${className}` : ''}`}>
      <span>
        {label}
        {required ? <em>*</em> : null}
      </span>
      <select defaultValue={value}>
        <option>{value}</option>
      </select>
    </label>
  )
}

function DarkTextarea({ label, placeholder, rows = 3 }: { label: string; placeholder?: string; rows?: number }) {
  return (
    <label className="recruit-dark-field full">
      <span>{label}</span>
      <textarea rows={rows} placeholder={placeholder} />
    </label>
  )
}

function DarkCheck({ label, checked = false }: { label: string; checked?: boolean }) {
  return (
    <label className="recruit-dark-check">
      <input type="checkbox" defaultChecked={checked} />
      <span>{label}</span>
    </label>
  )
}

function RecruitDarkPill({ children, tone }: { children: ReactNode; tone: 'warning' | 'neutral' }) {
  return <span className={`recruit-dark-pill ${tone}`}>{children}</span>
}
