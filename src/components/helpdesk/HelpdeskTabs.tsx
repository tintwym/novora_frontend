import { useState } from 'react'
import {
  CATEGORY_VOLUMES,
  DIGITAL_CERTIFICATES,
  HELPDESK_TICKETS,
  KNOWLEDGE_FAQS,
  PERFORMANCE_LOGS,
  SLA_TARGETS,
} from '../../data/mockHelpdesk'
import type { HelpdeskTicket } from '../../types/helpdesk'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  HdAvatar,
  HdCard,
  HdDonut,
  HdField,
  HdHBar,
  HdKpiRow,
  HdSectionTitle,
  HdTableScroll,
} from './HelpdeskShared'

export function HelpdeskTicketsTab() {
  const [selectedId, setSelectedId] = useState('TKT-9201')
  const [internalNote, setInternalNote] = useState(false)
  const selected = HELPDESK_TICKETS.find((t) => t.id === selectedId) ?? HELPDESK_TICKETS[0]

  return (
    <div className="hd-tickets-tab">
      <HdKpiRow />
      <HdCard className="hd-filter-card">
        <div className="hd-filter-head">
          <span aria-hidden>☰</span>
          <span className="hd-section-title">FILTER SERVICE LOGS</span>
        </div>
        <div className="hd-filter-row">
          <input type="search" placeholder="Keywords" className="hd-filter-keywords" />
          <select defaultValue="All Categories" aria-label="Incident category">
            <option>All Categories</option>
            <option>Payroll Discrepancy</option>
            <option>Benefits Inquiry</option>
            <option>Document Request</option>
          </select>
          <select defaultValue="All Priorities" aria-label="Priority target">
            <option>All Priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select defaultValue="All States" aria-label="Lifecycle status">
            <option>All States</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </HdCard>
      <div className="hd-ticket-split">
        <HdCard className="hd-ticket-list" padding="0.75rem">
          {HELPDESK_TICKETS.map((ticket) => (
            <TicketListItem key={ticket.id} ticket={ticket} selected={ticket.id === selectedId} onSelect={() => setSelectedId(ticket.id)} />
          ))}
        </HdCard>
        <TicketDetail ticket={selected} internalNote={internalNote} onInternalNoteChange={setInternalNote} />
      </div>
    </div>
  )
}

function TicketListItem({ ticket, selected, onSelect }: { ticket: HelpdeskTicket; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`hd-ticket-item${selected ? ' selected' : ''}`} onClick={onSelect}>
      <div className="hd-ticket-item-head">
        <strong className="tone-primary">{ticket.id}</strong>
        <RecruitPill label={ticket.category} tone="neutral" />
        <RecruitPill label={ticket.priority} tone={ticket.priorityTone} />
      </div>
      <h4>{ticket.subject}</h4>
      <p className="hd-muted">{ticket.snippet}</p>
      <div className="hd-ticket-item-foot">
        <HdAvatar initials={ticket.initials} />
        <span className="hd-muted sm">
          {ticket.reporter} • {ticket.filedAt}
        </span>
        <RecruitPill label={ticket.status} tone={ticket.statusTone} />
      </div>
      {ticket.slaLabel || ticket.badge || ticket.escalated || ticket.secure ? (
        <div className="hd-ticket-badges">
          {ticket.slaLabel ? <RecruitPill label={ticket.slaLabel} tone="warning" /> : null}
          {ticket.badge ? <RecruitPill label={ticket.badge} tone="danger" /> : null}
          {ticket.escalated ? <RecruitPill label="ESCALATED" tone="warning" /> : null}
          {ticket.secure ? <RecruitPill label="SECURE" tone="purple" /> : null}
        </div>
      ) : null}
    </button>
  )
}

function TicketDetail({
  ticket,
  internalNote,
  onInternalNoteChange,
}: {
  ticket: HelpdeskTicket
  internalNote: boolean
  onInternalNoteChange: (v: boolean) => void
}) {
  return (
    <HdCard className="hd-ticket-detail">
      <div className="hd-ticket-detail-scroll">
        <div className="hd-ticket-state-row">
          <strong className="tone-primary">{ticket.id}</strong>
          <span className="hd-muted sm">STATE:</span>
          <select defaultValue={ticket.status} aria-label="Ticket state">
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
        <h3>{ticket.subject}</h3>
        <p className="hd-muted sm">
          {ticket.category} • Filed: {ticket.filedAt}
        </p>
        <HdField label="Primary Operator Role">
          <div className="hd-operator-row">
            <HdAvatar initials="CW" tone="blue" />
            <span>Chong Wei Min (Compensation Leads)</span>
            <select defaultValue="Transfer Agent…" aria-label="Transfer agent">
              <option>Transfer Agent…</option>
              <option>Payroll Ops</option>
            </select>
          </div>
        </HdField>
        <HdField label="Reporter Transcript">
          <div className="hd-transcript">
            Hi team, my May overtime payout appears lower than expected after the weekend roster sync. The multiplier for public holiday hours seems to have reverted to 1.0x instead of 2.0x. Please review OT_Roster_May_16.pdf and confirm the calculation basis.
          </div>
        </HdField>
        <p className="hd-attachment">
          <span aria-hidden>📎</span> OT_Roster_May_16.pdf
        </p>
        {ticket.breached || ticket.escalated ? (
          <div className="hd-sla-escalator">
            <strong>SLA OVERDUE ESCALATOR</strong>
            <p>This ticket has exceeded its SLA window.</p>
            <button type="button" className="hd-danger-btn">
              Trigger Breach Re-route
            </button>
          </div>
        ) : null}
        <HdField label="Discussion Trail">
          <p className="hd-chat-system">Ticket registered. Category identified as &quot;Payroll Discrepancy&quot;. Assigned to Compensation Leads queue.</p>
          <div className="hd-chat-operator">
            <strong>Chong Wei Min</strong>
            <p>Thanks Sarah — I am reviewing the May roster sync logs and multiplier table. Will update within the hour.</p>
          </div>
        </HdField>
      </div>
      <div className="hd-reply-bar">
        <select defaultValue="INSERT CORRECTED DOCUMENT" aria-label="Insert document">
          <option>INSERT CORRECTED DOCUMENT</option>
          <option>Attach payslip</option>
        </select>
        <label className="hd-internal-note">
          <input type="checkbox" checked={internalNote} onChange={(e) => onInternalNoteChange(e.target.checked)} />
          INTERNAL NOTE ONLY
        </label>
        <div className="hd-reply-row">
          <input type="text" placeholder="Clarify calculation details with the reporter…" />
          <button type="button" className="hd-send-btn" aria-label="Send reply">
            ➤
          </button>
        </div>
      </div>
    </HdCard>
  )
}

export function HelpdeskDocumentTab() {
  const [compiled, setCompiled] = useState(false)

  return (
    <>
      <HdKpiRow />
      <div className="hd-split doc">
        <HdCard>
          <div className="hd-portal-head">
            <span aria-hidden>✦</span>
            <span className="hd-section-title">HR STANDARD LETTERS PORTAL</span>
          </div>
          <p className="hd-muted">
            Choose any employee. The system automatically populates dynamic payroll ledger, design, and join info instantly.
          </p>
          <HdField label="Associate Record">
            <select defaultValue="-- Choose employee details --">
              <option>-- Choose employee details --</option>
              <option>Sarah Lim (EMP-001)</option>
              <option>John Doe (EMP-002)</option>
            </select>
          </HdField>
          <HdField label="Letter Format Template">
            <select defaultValue="Standard Employment Verification Letter (Bank/Embassy Spec)">
              <option>Standard Employment Verification Letter (Bank/Embassy Spec)</option>
              <option>Salary Certificate</option>
            </select>
          </HdField>
          <HdField label="Issued For (Recipient Organisation)">
            <input type="text" placeholder="e.g. Citibank Mortgage Hub, Japanese Consulate Regional Office" />
          </HdField>
          <HdField label="Specific Purpose / Memo (Optional)">
            <textarea rows={3} placeholder="e.g. To facilitate the processing of a home loan application under official package clauses." />
          </HdField>
          <button type="button" className="hd-navy-btn full" onClick={() => setCompiled(true)}>
            📄 Compile & Auto-Populate Letter
          </button>
        </HdCard>
        <HdCard className="hd-letter-preview">
          {compiled ? (
            <div className="hd-letter-content">
              <span className="hd-section-title">STANDARD EMPLOYMENT VERIFICATION LETTER</span>
              <p>To Whom It May Concern,</p>
              <p>
                This is to certify that Sarah Lim (EMP-001) has been employed with Novora since 12 March 2022 in the capacity of Senior Analyst. Current monthly remuneration is RM 8,500.00.
              </p>
              <p className="hd-muted sm">Issued: DOC-1003 • Certified digital seal applied</p>
            </div>
          ) : (
            <div className="hd-letter-empty">
              <span aria-hidden>📄</span>
              <strong>NO DYNAMIC LETTER ACTIVE</strong>
              <p>
                Select an employee record on the left-wing console and click &apos;Compile & Auto-Populate Letter&apos; to generate a beautiful printable corporate verification document.
              </p>
            </div>
          )}
        </HdCard>
      </div>
      <HdCard>
        <HdSectionTitle title="Recent Issued Digital Certificates" />
        {DIGITAL_CERTIFICATES.map((cert, i) => (
          <div key={cert.title} className={`hd-cert-row${i > 0 ? ' bordered' : ''}`}>
            <div>
              <strong>{cert.title}</strong>
              <p className="hd-muted sm">{cert.subtitle}</p>
            </div>
            <RecruitPill label={cert.status} tone={cert.statusTone} />
          </div>
        ))}
      </HdCard>
    </>
  )
}

export function HelpdeskAnalyticsTab() {
  return (
    <>
      <HdKpiRow showProgress />
      <div className="hd-analytics-grid">
        <HdCard>
          <HdSectionTitle title="Ticket Volume by Category" subtitle="Distribution over current operating calendar year." />
          {CATEGORY_VOLUMES.map((row) => (
            <HdHBar key={row.label} label={row.label} pct={row.pct} color={row.color} trailing={row.trailing} />
          ))}
        </HdCard>
        <HdCard className="hd-donut-card">
          <HdSectionTitle title="Estimated SLA Breached Ratio" subtitle="Compliance target bound: 95% threshold." />
          <HdDonut pct={80} label="SLA SAFE" />
          <p className="hd-muted sm center">
            <strong>1 Active breach alerts need delegation.</strong> Automatic Slack integration warns operations team.
          </p>
        </HdCard>
        <HdCard>
          <HdSectionTitle title="Resolution Turnaround Targets" subtitle="Audit times listed by Priority classes." />
          {SLA_TARGETS.map((row) => (
            <div key={row.level} className="hd-sla-target-row">
              <RecruitPill label={row.level} tone={row.levelTone} />
              <span>
                Target: {row.target} | YTD Avg: {row.ytdAvg}
              </span>
              {row.actionRequired ? <RecruitPill label="ACTION REQUIRED" tone="danger" /> : null}
            </div>
          ))}
        </HdCard>
      </div>
      <div className="hd-systemic-alert">
        <div className="hd-systemic-head">
          <span aria-hidden>⚠</span>
          <strong>SYSTEMIC PAYROLL PROCESSING PAIN POINTS IDENTIFIED</strong>
          <button type="button" className="hd-danger-btn">
            Sync Overtime Multiplier DB
          </button>
        </div>
        <p>
          Spike in Payroll Discrepancy tickets linked to weekend timesheet multiplier anomalies and roster-claims database sync issue #SNC-9281.
        </p>
        <div className="hd-reconcile-box">
          RECONCILE SYSTEM ACTION RECOMMENDATION: Reset automated Roster-Claims database sync protocol logs #SNC-9281.
        </div>
      </div>
      <HdCard>
        <HdSectionTitle
          title="Recent Operations Lead Performance Logs"
          trailing={
            <button type="button" className="hd-outline-btn">
              Download CSV report
            </button>
          }
        />
        <HdTableScroll>
          <table className="hd-table">
            <thead>
              <tr>
                <th>TICKET REFERENCE</th>
                <th>FILER CONTACT</th>
                <th>ASSIGNED AGENT CATEGORY</th>
                <th>SLA LIMIT</th>
                <th>RESOLUTION TIME</th>
                <th>STATUS CODE</th>
              </tr>
            </thead>
            <tbody>
              {PERFORMANCE_LOGS.map((row) => (
                <tr key={row.ticketRef}>
                  <td className="tone-primary">
                    <strong>{row.ticketRef}</strong>
                  </td>
                  <td>{row.filer}</td>
                  <td>{row.category}</td>
                  <td>{row.slaLimit}</td>
                  <td className={row.completed ? 'tone-success' : 'hd-muted'}>{row.resolutionTime}</td>
                  <td>
                    <RecruitPill label={row.statusCode} tone={row.statusTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </HdTableScroll>
      </HdCard>
    </>
  )
}

export function HelpdeskKnowledgeTab() {
  return (
    <>
      <HdKpiRow />
      <HdCard>
        <div className="hd-kb-head">
          <div>
            <div className="hd-portal-head">
              <span aria-hidden>📖</span>
              <span className="hd-section-title">COMPANY POLICIES & SELF-HELP ARCHIVES</span>
            </div>
            <p className="hd-muted">
              Answers to general questions regarding payroll multiplier metrics, optical benefits coverage caps, internet claims, and remote limits.
            </p>
          </div>
          <input type="search" className="hd-kb-search" placeholder="Query payroll, tax, handbook clauses…" />
        </div>
        <div className="hd-faq-grid">
          {KNOWLEDGE_FAQS.map((faq) => (
            <button key={faq.question} type="button" className="hd-faq-item">
              <div>
                <RecruitPill label={faq.category} tone="info" />
                <strong>{faq.question}</strong>
              </div>
              <span aria-hidden>›</span>
            </button>
          ))}
        </div>
      </HdCard>
    </>
  )
}
