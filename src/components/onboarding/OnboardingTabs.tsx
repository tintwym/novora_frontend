import { useState, type ReactNode } from 'react'
import { RecruitHBar, RecruitPill } from '../recruitment/RecruitmentPrimitives'

type TalentProps = { talent: string }

const DOC_TAGS: Record<string, { bg: string; fg: string }> = {
  REQUIRED: { bg: '#fee2e2', fg: '#991b1b' },
  'LEGAL PROOF': { bg: '#ede9fe', fg: '#5b21b6' },
  CONTRACT: { bg: '#dbeafe', fg: '#2563eb' },
  'HEALTH CLEARANCE': { bg: '#d1fae5', fg: '#065f46' },
  CREDENTIALS: { bg: '#ffedd5', fg: '#c2410c' },
}

function OnboardIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = className ? ` ${className}` : ''
  if (name === 'doc-success') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M9 15l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'doc-warning') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M12 11v2M12 17h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'doc-neutral') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'quill') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-2.5-2.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m2 22 4-1 1-4 9-9 3 3-9 9-4 1z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'shield-check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'download') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'upload') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'info') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 16v-4M12 8h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'book') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'video') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <rect x="2" y="6" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m22 8-6 4 6 4V8z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'user-minus') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 11h-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 3v18h18M7 16v-5M12 16V8M17 16v-3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'check-circle') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'user-x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M17 8l4 4M21 8l-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'trophy') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM5 4H3v1a4 4 0 0 0 4 4M19 4h2v1a4 4 0 0 1-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'trend') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m3 17 6-6 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 7h7v7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return null
}

export function PreOnboardingPortalTab({ talent }: TalentProps) {
  const [contractSealed, setContractSealed] = useState(false)

  return (
    <div className="onboard-split main-side">
      <div>
        <OnboardCard>
          <div className="onboard-card-head">
            <div>
              <h3 className="onboard-label">DOCUMENT CLEARANCE LIST</h3>
              <p>Assigned profile requirements for {talent}.</p>
            </div>
            <strong className="onboard-warn-text">2 / 5 Verified</strong>
          </div>
          <DocRow
            title="National Registration IC / Passport Copy"
            tags={['LEGAL PROOF', 'REQUIRED']}
            uploaded="Uploaded 2026-06-10"
            status="Approved"
            tone="success"
            iconVariant="success"
          />
          <DocRow
            title="Digital Non-Disclosure Agreement (NDA)"
            tags={['LEGAL PROOF', 'REQUIRED']}
            uploaded="Uploaded 2026-06-14"
            status="Verify"
            tone="success"
            subtitle="Verification Required"
            subtitleTone="warning"
            action
            iconVariant="warning"
          />
          <DocRow
            title="Standard General Employment Offer Contract"
            tags={['CONTRACT', 'REQUIRED']}
            status="Pending Upload"
            tone="neutral"
            iconVariant="neutral"
          />
          <DocRow
            title="Medical Fitness Check Certificate"
            tags={['HEALTH CLEARANCE']}
            status="Pending Upload"
            tone="neutral"
            iconVariant="neutral"
          />
          <DocRow
            title="Post-Secondary Education Degrees & Transcripts"
            tags={['CREDENTIALS', 'REQUIRED']}
            uploaded="Uploaded 2026-06-11"
            status="Approved"
            tone="success"
            iconVariant="success"
          />
        </OnboardCard>

        <OnboardCard>
          <h3 className="onboard-label with-icon">
            <OnboardIcon name="quill" className="onboard-label-icon" />
            SECURE EMPLOYMENT AGREEMENT SEALED SIGNATURE
          </h3>
          {contractSealed ? (
            <div className="onboard-sealed">
              <span className="onboard-sealed-icon" aria-hidden>
                <OnboardIcon name="shield-check" />
              </span>
              <h4>Employment Offer Contract Legally Sealed</h4>
              <p>
                The agreement with <strong>{talent}</strong> has been certified via digital e-signatures and locked in
                corporate databases. IP addresses of execution: <strong>192.168.42.110</strong>.
              </p>
              <button type="button" className="onboard-link-btn inline">
                <OnboardIcon name="download" className="onboard-btn-icon" />
                Download Encrypted Legal Receipt PDF
              </button>
            </div>
          ) : (
            <>
              <p className="onboard-muted">
                To complete pre-onboarding workflows, please sign the Standard General Employment Offer Contract (DOC03)
                by typing their exact full legal name.
              </p>
              <div className="onboard-signature-row">
                <label>
                  <span>SIGNATURE MANIFEST FIELD</span>
                  <input type="text" placeholder="Type 'Sarah Lim' or equivalent" />
                </label>
                <div className="onboard-stamp">Digital Stamp</div>
              </div>
              <button type="button" className="onboard-primary-btn align-right" onClick={() => setContractSealed(true)}>
                <OnboardIcon name="shield-check" className="onboard-btn-icon" />
                Authorize and Seal Contract
              </button>
            </>
          )}
        </OnboardCard>
      </div>

      <div>
        <OnboardCard>
          <h3 className="onboard-label">UPLOAD NEW DOCUMENT</h3>
          <label className="onboard-field">
            <span>Document Title</span>
            <input type="text" placeholder="e.g. Visa Clearance" />
          </label>
          <label className="onboard-field">
            <span>Document Category</span>
            <select defaultValue="Legal Proof">
              <option>Legal Proof</option>
              <option>Contract</option>
            </select>
          </label>
          <div className="onboard-upload-zone">
            <OnboardIcon name="upload" className="onboard-upload-icon" />
            <strong>Click or Drag & Drop</strong>
            <p>Accepts PDF, JPG, PNG up to 10MB</p>
          </div>
          <button type="button" className="onboard-primary-btn full">
            + Upload Document
          </button>
        </OnboardCard>
        <div className="onboard-tip">
          <OnboardIcon name="info" className="onboard-tip-icon" />
          <div>
            <strong>Compliance Audit Tip</strong>
            <p>
              Legal Proof documents (such as NRIC, working passport) are cross-checked with the Federal Biometric
              Database. Turnaround time for automated compliance matches is ordinarily 4 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocRow({
  title,
  tags,
  uploaded,
  status,
  tone,
  subtitle,
  subtitleTone,
  action,
  iconVariant = 'neutral',
}: {
  title: string
  tags: string[]
  uploaded?: string
  status: string
  tone: 'success' | 'neutral'
  subtitle?: string
  subtitleTone?: 'warning'
  action?: boolean
  iconVariant?: 'success' | 'warning' | 'neutral'
}) {
  return (
    <div className={`onboard-doc-row tone-${iconVariant}`}>
      <span className={`onboard-doc-icon tone-${iconVariant}`} aria-hidden>
        <OnboardIcon name={`doc-${iconVariant}`} />
      </span>
      <div>
        <strong>{title}</strong>
        <div className="onboard-doc-tags">
          {tags.map((t) => {
            const s = DOC_TAGS[t] ?? { bg: '#f1f5f9', fg: '#475569' }
            return (
              <span key={t} style={{ background: s.bg, color: s.fg }}>
                {t}
              </span>
            )
          })}
          {uploaded ? <em>{uploaded}</em> : null}
        </div>
        {subtitle ? <span className={`onboard-doc-sub ${subtitleTone ?? ''}`}>{subtitle}</span> : null}
      </div>
      {action ? (
        <button type="button" className="onboard-verify-btn">
          Verify
        </button>
      ) : (
        <RecruitPill label={status} tone={tone} />
      )}
    </div>
  )
}

export function TasksChecklistsTab({ talent }: TalentProps) {
  return (
    <div className="onboard-split tasks">
      <div>
        <OnboardCard>
          <h3 className="onboard-label">CREATE CHECKLIST TASK</h3>
          <label className="onboard-field">
            <span>Milestone Action Statement</span>
            <input type="text" placeholder="e.g. Program key card entry" />
          </label>
          <label className="onboard-field">
            <span>Owning Department</span>
            <select defaultValue="IT Operations">
              <option>IT Operations</option>
              <option>HR Compliance</option>
            </select>
          </label>
          <label className="onboard-field">
            <span>Target Due Date</span>
            <input type="text" defaultValue="25/06/2026" />
          </label>
          <button type="button" className="onboard-primary-btn full">
            + Assign Milestone
          </button>
        </OnboardCard>
        <OnboardCard>
          <h3 className="onboard-label">TARGETED COMPLETION METRIC</h3>
          <strong className="onboard-talent-name">{talent}</strong>
          <div className="onboard-progress-track">
            <span style={{ width: '0%' }} />
          </div>
          <em className="onboard-pct">0%</em>
          <p className="onboard-muted">0 of 0 task clearances fulfilled.</p>
        </OnboardCard>
      </div>
      <OnboardCard className="onboard-milestone-card">
        <div className="onboard-card-head">
          <div>
            <h3>MILESTONE CLEARANCE LISTS</h3>
            <p>Clearing checklists across different administrative departments</p>
          </div>
          <button type="button" className="onboard-link-btn inline">
            <OnboardIcon name="check-circle" className="onboard-btn-icon" />
            Clear All Milestones
          </button>
        </div>
        <div className="onboard-empty">
          <span aria-hidden>!</span>
          <p>No specific tasks registered for {talent}.</p>
        </div>
      </OnboardCard>
    </div>
  )
}

export function KnowledgeBaseTab() {
  const policies = [
    {
      badge: 'POLICY',
      color: '#2563eb',
      title: 'Novora Professional Code of Conduct & Workplace Safety',
      desc: 'Defines expected behavioural standards, anti-harassment protocols, and emergency evacuation procedures for all staff.',
    },
    {
      badge: 'GUIDE',
      color: '#f59e0b',
      title: 'Remote Work & Flexible Scheduling Standards',
      desc: 'Outlines eligibility criteria, core collaboration hours, and equipment reimbursement for hybrid arrangements.',
    },
    {
      badge: 'POLICY',
      color: '#2563eb',
      title: 'Novora Healthcare Insurance Tiering Explained',
      desc: 'Breakdown of medical panel clinics, dependent coverage limits, and annual premium co-payment structures.',
    },
    {
      badge: 'GUIDE',
      color: '#f59e0b',
      title: 'Claims Submission & Office Lodging Policies',
      desc: 'Step-by-step guide for expense claims, travel allowances, and corporate accommodation booking workflows.',
    },
  ]

  return (
    <div className="onboard-split main-side">
      <OnboardCard>
        <div className="onboard-card-head knowledge-head">
          <div>
            <h3 className="onboard-label">KNOWLEDGE DIRECTORY SOP</h3>
            <p>Read-to-clear policies of conduct & training modules.</p>
          </div>
          <div className="onboard-search">
            <input type="search" placeholder="Search policy archives..." />
          </div>
        </div>
        <div className="onboard-policy-grid">
          {policies.map((p) => (
            <article key={p.title} className="onboard-policy-card">
              <div className="onboard-policy-head">
                <span style={{ background: `${p.color}26`, color: p.color }}>{p.badge}</span>
                <OnboardIcon name="book" className="onboard-policy-book" />
              </div>
              <strong>{p.title}</strong>
              <p className="onboard-policy-desc">{p.desc}</p>
              <button type="button" className="onboard-link-btn">
                Read handbook chapters ›
              </button>
            </article>
          ))}
        </div>
      </OnboardCard>
      <div>
        <OnboardCard>
          <h3 className="onboard-label">CULTURE ORIENTATION VIDEO</h3>
          <p>Incoming candidates must play the intro briefing culture documentary. Successfully completing the visual play session marks the task as cleared.</p>
          <div className="onboard-video">
            <OnboardIcon name="video" className="onboard-video-icon" />
            <strong>&quot;Welcome to Novora Core Team&quot;</strong>
            <em>Duration: 4m 32s</em>
            <button type="button" className="onboard-video-btn">
              <OnboardIcon name="video" className="onboard-btn-icon" />
              Play Video Session
            </button>
          </div>
          <div className="onboard-video-meta">
            <span>Policy Check ID code:</span>
            <strong>POL-VIDEO-CULT</strong>
          </div>
        </OnboardCard>
        <div className="onboard-handbook">
          <div>
            <strong>Handbook 2026 Edition</strong>
            <span>Comprehensive policies handbook</span>
          </div>
          <button type="button" aria-label="Download handbook">
            <OnboardIcon name="download" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function OffboardingTab() {
  return (
    <>
      <div className="onboard-exit-banner">
        <div>
          <span className="onboard-exit-badge">DEPARTURES & RESIGNATIONS WORKFLOW</span>
          <h3>Official Exit Clearance Protocols</h3>
          <p>Approve active resignations, program cross-department de-provisioning, and confirm secure handbacks.</p>
        </div>
        <span className="onboard-exit-banner-icon" aria-hidden>
          <OnboardIcon name="user-minus" />
        </span>
      </div>
      <div className="onboard-split offboard">
        <div>
          <OnboardCard className="onboard-table-card">
            <h3 className="onboard-label">DEPARTING OFFICER CASES</h3>
            <table className="onboard-table">
              <thead>
                <tr>
                  <th>DEPARTING EMPLOYEE</th>
                  <th>FILING DATE</th>
                  <th>LAST WORKING DAY</th>
                  <th>MANAGER APPROVAL</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Sarah Lim</strong>
                    <span>EMP-001</span>
                  </td>
                  <td>2026-06-01</td>
                  <td className="strong">2026-06-30</td>
                  <td>
                    <RecruitPill label="Approved" tone="success" />
                  </td>
                  <td>
                    <ApproveReject />
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>John Doe</strong>
                    <span>EMP-002</span>
                  </td>
                  <td>2026-06-12</td>
                  <td className="strong">2026-07-15</td>
                  <td>
                    <RecruitPill label="Pending" tone="warning" />
                  </td>
                  <td>
                    <ApproveReject />
                  </td>
                </tr>
              </tbody>
            </table>
          </OnboardCard>
          <OnboardCard>
            <div className="onboard-card-head">
              <div>
                <h3 className="onboard-label">CLEARANCE HANDBACK TRACKING (SARAH LIM)</h3>
                <p>Verify cross-department audits to authorize payroll releases</p>
              </div>
              <span className="onboard-muted">Case Code: RES051</span>
            </div>
            <p className="onboard-reason">
              Official reason stated: &quot;Accepted senior architectural role with expanded scope.&quot;
            </p>
            <div className="onboard-clearance-grid">
              <ClearanceBox title="IT CLEARANCE" sub="SSO & credentials" cleared />
              <ClearanceBox title="PAYROLL CLEAR" sub="Expenses & taxation" cleared />
              <ClearanceBox title="HR COMPLIANCE" sub="Official Exit Contract" />
              <ClearanceBox title="ACCESS BADGE" sub="Lock system & tokens" />
            </div>
            <p className="onboard-muted small">Click individual boxes above to toggle audited clearance status.</p>
          </OnboardCard>
        </div>
        <OnboardCard>
          <h3 className="onboard-label">DIGITIZE EXIT CASE</h3>
          <label className="onboard-field">
            <span>Impacted Employee</span>
            <select defaultValue="ahmad">
              <option value="ahmad">Ahmad Wahid (EMP-0001)</option>
            </select>
          </label>
          <label className="onboard-field">
            <span>Effective Filing Date</span>
            <input type="text" defaultValue="16/06/2026" />
          </label>
          <label className="onboard-field">
            <span>Requested Last Working Day</span>
            <input type="text" defaultValue="16/07/2026" />
          </label>
          <label className="onboard-field">
            <span>Specific resignation reason stated</span>
            <textarea rows={3} placeholder="e.g. Work environment feedback or external offers" />
          </label>
          <button type="button" className="onboard-navy-btn full">
            <OnboardIcon name="user-minus" className="onboard-btn-icon" />
            Initiate Exit Case
          </button>
        </OnboardCard>
      </div>
    </>
  )
}

function ApproveReject() {
  return (
    <div className="onboard-actions">
      <button type="button" className="onboard-success-btn">
        Approve
      </button>
      <button type="button" className="onboard-outline-btn">
        Reject
      </button>
    </div>
  )
}

function ClearanceBox({ title, sub, cleared }: { title: string; sub: string; cleared?: boolean }) {
  return (
    <div className={`onboard-clearance-box${cleared ? ' cleared' : ''}`}>
      <strong>{title}</strong>
      <span>{sub}</span>
      <RecruitPill label={cleared ? 'Cleared' : 'Pending'} tone={cleared ? 'success' : 'warning'} />
    </div>
  )
}

export function ExitInterviewsTab({ talent }: TalentProps) {
  return (
    <div className="onboard-split exit-three">
      <OnboardCard>
        <h3 className="onboard-label with-icon">
          <OnboardIcon name="chart" className="onboard-label-icon" />
          EXIT SENTIMENT DYNAMICS
        </h3>
        <p className="onboard-muted">A comprehensive audit score of compiled resignation metrics over the last 12 months.</p>
        <SentimentBar label="Work-Life balance index" score={4.5} color="#10b981" />
        <SentimentBar label="Compensation & Allowance satisfaction" score={3.5} color="#f59e0b" />
        <SentimentBar label="Management coordination trust" score={4.5} color="#10b981" />
        <SentimentBar label="Career Path & Skills Growth" score={3.5} color="#2563eb" />
        <div className="onboard-trigger-box">
          <strong>Top Departure Trigger:</strong> Better scope, seniority offer level & compensation package adjustments
          (72% of files).
        </div>
      </OnboardCard>
      <OnboardCard>
        <h3 className="onboard-label">LOG FEEDBACK FORM</h3>
        <label className="onboard-field">
          <span>Departing officer</span>
          <select defaultValue={talent}>
            <option>{talent}</option>
            <option>Sarah Lim</option>
            <option>John Doe</option>
          </select>
        </label>
        <label className="onboard-field">
          <span>Primary trigger of departure</span>
          <select defaultValue="growth">
            <option value="growth">Better career growth</option>
          </select>
        </label>
        <div className="onboard-field-row">
          <label className="onboard-field">
            <span>Work-Life Rating (1-5)</span>
            <input type="text" defaultValue="4" />
          </label>
          <label className="onboard-field">
            <span>Comp Rating (1-5)</span>
            <input type="text" defaultValue="4" />
          </label>
        </div>
        <label className="onboard-field">
          <span>Interview Comments / notes</span>
          <textarea rows={3} placeholder="e.g. Core team coordination feedback" />
        </label>
        <button type="button" className="onboard-primary-btn full">
          + Log Survey Audit
        </button>
      </OnboardCard>
      <OnboardCard>
        <h3 className="onboard-label">EXIT INTERVIEWS RECORD</h3>
        <ExitRecord
          code="EMP-001"
          trigger="Career opportunities & Growth"
          quote="Transition was exceedingly smooth. Novora has a fantastic engineering peer group."
          ratings={{ WORKLIFE: '4/5', COMP: '4/5', MANAGER: '5/5', GROWTH: '3/5' }}
        />
        <ExitRecord
          code="EMP-002"
          trigger="Family relocation"
          quote="Grateful for remote work allowances that helped during the relocation process."
          ratings={{ WORKLIFE: '5/5', COMP: '3/5', MANAGER: '4/5', GROWTH: '4/5' }}
        />
      </OnboardCard>
    </div>
  )
}

function SentimentBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="onboard-sentiment">
      <div>
        <span>{label}</span>
        <em>{score} / 5.0</em>
      </div>
      <div className="onboard-progress-track">
        <span style={{ width: `${(score / 5) * 100}%`, background: color }} />
      </div>
    </div>
  )
}

function ExitRecord({
  code,
  trigger,
  quote,
  ratings,
}: {
  code: string
  trigger: string
  quote: string
  ratings: Record<string, string>
}) {
  return (
    <article className="onboard-exit-record">
      <div className="onboard-exit-record-head">
        <strong>{code}</strong>
        <span>{trigger}</span>
      </div>
      <p>&quot;{quote}&quot;</p>
      <div className="onboard-exit-ratings">
        {Object.entries(ratings).map(([k, v]) => (
          <span key={k}>
            {k}: {v}
          </span>
        ))}
      </div>
    </article>
  )
}

export function ReportsAnalyticsTab() {
  return (
    <>
      <div className="onboard-kpi-row">
        <ReportKpi title="Completed Tasks Ratio" value="100%" sub="7 / 7 milestones checked" icon="check-circle" color="#10b981" footer="Fully cleared checklist" progress={100} progressColor="#10b981" />
        <ReportKpi title="Document Clear Rate" value="60%" sub="3 / 5 credentials verified" icon="shield" color="#2563eb" footer="60% verification progress" progress={60} progressColor="#2563eb" />
        <ReportKpi
          title="Active Offboarding"
          value="2"
          sub="Pending department signoffs & clearances"
          icon="user-x"
          color="#ef4444"
          footer="DEPARTMENT REVIEWS IN-PROGRESS"
          footerTone="warning"
        />
        <ReportKpi
          title="Exit Satisfaction Score"
          value="4.0 / 5.0"
          sub="Average across 2 surveys"
          icon="trophy"
          color="#8b5cf6"
          footer="HEALTHY TEAM MORALE INDICATORS"
          footerTone="purple"
          footerIcon="trend"
        />
      </div>
      <div className="onboard-split reports">
        <OnboardCard>
          <div className="onboard-card-head">
            <div>
              <h3>PENDING CLEARANCE AUDITING LOG</h3>
              <p>Track IT checklist status, security, and asset repossessions for exiting staff</p>
            </div>
            <button type="button" className="onboard-outline-btn">
              EXPORT CLEARANCE LOGS
            </button>
          </div>
          <table className="onboard-table">
            <thead>
              <tr>
                <th>ASSOCIATE</th>
                <th>IT ACCESS</th>
                <th>FINANCE ACCOUNT</th>
                <th>HR RECOURSE</th>
                <th>SECURITY ASSETS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Sarah Lim</strong>
                  <span>EMP-001</span>
                </td>
                <td className="cleared">CLEARED</td>
                <td className="cleared">CLEARED</td>
                <td className="pending">PENDING</td>
                <td className="pending">PENDING</td>
              </tr>
              <tr>
                <td>
                  <strong>John Doe</strong>
                  <span>EMP-002</span>
                </td>
                <td className="pending">PENDING</td>
                <td className="pending">PENDING</td>
                <td className="pending">PENDING</td>
                <td className="pending">PENDING</td>
              </tr>
            </tbody>
          </table>
        </OnboardCard>
        <div>
          <OnboardCard>
            <h3>CHECKLIST DENSITY BY DEPARTMENT</h3>
            <RecruitHBar label="IT Operations" value={3} max={3} color="#2563eb" trailing="3/3 done" />
            <RecruitHBar label="HR Compliance" value={1} max={1} color="#2563eb" trailing="1/1 done" />
            <RecruitHBar label="Finance Payroll" value={0} max={1} color="#2563eb" trailing="0/0 done" />
            <RecruitHBar label="Security Assets" value={0} max={1} color="#2563eb" trailing="0/0 done" />
            <RecruitHBar label="Engineering department" value={1} max={1} color="#2563eb" trailing="1/1 done" />
            <RecruitHBar label="HR Administration" value={2} max={2} color="#2563eb" trailing="2/2 done" />
          </OnboardCard>
          <OnboardCard>
            <h3>PRIMARY SEPARATION DRIVERS</h3>
            <RecruitHBar label="Career Growth / Job Hop" value={3} max={3} color="#8b5cf6" trailing="3 surveys (50%)" />
            <RecruitHBar label="Health / Personal Reasons" value={2} max={3} color="#10b981" trailing="2 surveys (33%)" />
            <RecruitHBar label="Compensation Alignments" value={1} max={3} color="#ec4899" trailing="1 surveys (17%)" />
          </OnboardCard>
        </div>
      </div>
    </>
  )
}

function ReportKpi({
  title,
  value,
  sub,
  icon,
  color,
  footer,
  footerTone,
  progress,
  progressColor,
  footerIcon,
}: {
  title: string
  value: string
  sub: string
  icon: string
  color: string
  footer: string
  footerTone?: 'warning' | 'purple'
  progress?: number
  progressColor?: string
  footerIcon?: string
}) {
  return (
    <article className="onboard-kpi-card">
      <div className="onboard-kpi-top">
        <div>
          <span>{title}</span>
          <strong>{value}</strong>
          <em>{sub}</em>
        </div>
        <span className="onboard-kpi-icon" style={{ background: `${color}1f`, color }}>
          <OnboardIcon name={icon} />
        </span>
      </div>
      {typeof progress === 'number' ? (
        <div className="onboard-kpi-progress">
          <span style={{ width: `${progress}%`, background: progressColor }} />
        </div>
      ) : null}
      <p className={footerTone ? `footer-${footerTone}` : ''}>
        {footerIcon ? <OnboardIcon name={footerIcon} className="onboard-kpi-footer-icon" /> : null}
        {footerTone === 'warning' ? <i className="onboard-kpi-dot warning" aria-hidden /> : null}
        {footer}
      </p>
    </article>
  )
}

function OnboardCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`onboard-card${className ? ` ${className}` : ''}`}>{children}</section>
}
