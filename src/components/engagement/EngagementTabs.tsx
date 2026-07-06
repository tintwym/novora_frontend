import { useState } from 'react'
import {
  ACTION_LOGS,
  BADGE_DISTRIBUTION,
  ENPS_GROUP_RATIOS,
  PULSE_SURVEYS,
  SENTIMENT_FEED,
  SHOUT_OUT_MEDALS,
  SHOUT_OUTS,
  SUGGESTIONS,
} from '../../data/mockEngagement'
import { RecruitIconKpi, RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  EngAvatar,
  EngCard,
  EngField,
  EngHBar,
  EngSectionTitle,
  EngTableScroll,
} from './EngagementShared'

export function EngagementPulseTab() {
  const [enpsVote, setEnpsVote] = useState<number | null>(null)

  return (
    <div className="eng-tab">
      <div className="eng-pulse-top">
        <EngCard className="eng-enps-card">
          <div className="eng-enps-head">
            <span className="eng-section-title sm">COMPUTED ENPS SCORE</span>
            <RecruitPill label="Healthy (50+)" tone="success" />
          </div>
          <strong className="eng-enps-score">+54</strong>
          <div className="eng-enps-bars">
            <div className="eng-enps-bar-row">
              <span className="tone-danger">10% DETRACTORS (0-6)</span>
              <div className="eng-enps-track">
                <span style={{ width: '10%', background: '#dc2626' }} />
              </div>
            </div>
            <div className="eng-enps-bar-row">
              <span className="eng-muted">25% PASSIVES (7-8)</span>
              <div className="eng-enps-track">
                <span style={{ width: '25%', background: '#94a3b8' }} />
              </div>
            </div>
            <div className="eng-enps-bar-row">
              <span className="tone-success">64% PROMOTERS (9-10)</span>
              <div className="eng-enps-track">
                <span style={{ width: '64%', background: '#059669' }} />
              </div>
            </div>
          </div>
          <p className="eng-muted sm right">Total active participants: 59 members</p>
        </EngCard>

        <EngCard className="eng-vote-card">
          <span className="eng-section-title sm">CAST YOUR ANONYMOUS ENPS VOTE</span>
          <p className="eng-vote-question">
            How likely is it that you would recommend our organization as a high-performing workplace to colleagues?
          </p>
          <div className="eng-vote-scale">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                type="button"
                className={enpsVote === i ? 'selected' : ''}
                onClick={() => setEnpsVote(i)}
                aria-label={`Score ${i}`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="eng-vote-labels">
            <span className="tone-danger">0 - NOT LIKELY</span>
            <span className="tone-success">10 - EXTREMELY LIKELY</span>
          </div>
          <p className="eng-vote-secure">
            <span aria-hidden>🛡</span> Encrypted with SHA-256 peer-shuffling algorithms
          </p>
        </EngCard>
      </div>

      <EngSectionTitle
        title="WEEKLY PULSE MICRO-SURVEYS"
        subtitle="Automated brief check-ins to monitor team friction points"
        trailing={<RecruitPill label="3 Live surveys" tone="info" />}
      />
      <div className="eng-pulse-grid">
        {PULSE_SURVEYS.map((survey) => (
          <EngCard key={survey.title} className="eng-pulse-survey">
            <div className="eng-pulse-survey-head">
              <span className="tone-primary eng-pulse-cat">{survey.title}</span>
              <span className="eng-muted sm">{survey.votes}</span>
            </div>
            <p className="eng-pulse-question">{survey.question}</p>
            {survey.options.map((opt) => (
              <EngHBar key={opt.label} label={opt.label} pct={opt.pct} color="#2563eb" trailing={`${opt.pct}%`} />
            ))}
          </EngCard>
        ))}
      </div>
    </div>
  )
}

export function EngagementSentimentTab() {
  return (
    <div className="eng-tab eng-split">
      <EngCard className="eng-split-side">
        <div className="eng-card-head">
          <span aria-hidden>💡</span>
          <span className="eng-section-title sm">ANONYMITY SUGGESTION BOX</span>
        </div>
        <EngField label="Target area category">
          <select defaultValue="Office Amenities & Comfort" aria-label="Target area category">
            <option>Office Amenities & Comfort</option>
            <option>Workload & Pace</option>
            <option>Policy Clarity</option>
          </select>
        </EngField>
        <EngField label="Constructive post text">
          <textarea
            rows={4}
            placeholder="e.g. Type 'Our team is feeling stressed by tight deployment milestones...'"
          />
        </EngField>
        <div className="eng-sentiment-check">
          <span>AI text sentiment pre-check</span>
          <RecruitPill label="NEUTRAL" tone="neutral" />
        </div>
        <p className="eng-muted sm eng-proxy-note">
          <span aria-hidden>✎</span> Automated secure proxy strips author email, identity ID, and terminal logs.
        </p>
        <button type="button" className="eng-primary-btn">
          ✈ File Safe Suggestion
        </button>
      </EngCard>

      <EngCard className="eng-split-main">
        <EngSectionTitle title="PUBLIC SUGGESTIONS LEDGER" trailing={<span className="eng-muted sm">3 submitted entries</span>} />
        <div className="eng-suggestion-list">
          {SUGGESTIONS.map((s) => (
            <article key={s.id} className="eng-suggestion-card">
              <div className="eng-suggestion-body">
                <div className="eng-suggestion-meta">
                  <RecruitPill label={s.category} tone="info" />
                  <RecruitPill label={s.vibe} tone={s.vibeTone} />
                  <span className="eng-muted sm">
                    ID: {s.id} {s.date}
                  </span>
                </div>
                <p className="eng-suggestion-text">&ldquo;{s.text}&rdquo;</p>
                <p className="eng-suggestion-tag">AI TAGS: {s.tag}</p>
                <div className="eng-nlp-box">
                  <span aria-hidden>〰</span>
                  <span>NLP DIAGNOSTIC: {s.nlp}</span>
                </div>
              </div>
              <div className="eng-upvote-col">
                <span className="eng-heart" aria-hidden>
                  ♥
                </span>
                <strong>{s.upvotes}</strong>
                <span className="eng-upvote-label">
                  VOUCH &amp;
                  <br />
                  UPVOTE
                </span>
              </div>
            </article>
          ))}
        </div>
      </EngCard>
    </div>
  )
}

export function EngagementShoutOutTab() {
  const [selectedMedal, setSelectedMedal] = useState('Collaborative Hero')

  return (
    <div className="eng-tab eng-split">
      <EngCard className="eng-split-side">
        <div className="eng-card-head">
          <span aria-hidden>🏅</span>
          <span className="eng-section-title sm">SEND A VIRTUAL HIGH-FIVE</span>
        </div>
        <EngField label="Pick recipient colleague">
          <select defaultValue="Ahmad Wahid (Chief Executive Officer • Operations)" aria-label="Recipient colleague">
            <option>Ahmad Wahid (Chief Executive Officer • Operations)</option>
            <option>Sarah Lim (Lead Software Architect • Engineering)</option>
          </select>
        </EngField>
        <span className="eng-field-label">Choose appreciation ribbon medal</span>
        <div className="eng-medal-list">
          {SHOUT_OUT_MEDALS.map((medal) => (
            <button
              key={medal.name}
              type="button"
              className={`eng-medal-item${selectedMedal === medal.name ? ' selected' : ''}`}
              onClick={() => setSelectedMedal(medal.name)}
            >
              <span className="eng-medal-icon" aria-hidden>
                {medal.icon}
              </span>
              <span>
                <strong>{medal.name}</strong>
                <em className="eng-muted sm">{medal.description}</em>
              </span>
            </button>
          ))}
        </div>
        <EngField label="Appreciation message note">
          <textarea rows={3} placeholder="Say thank you or highlight an exceptional job done contextually..." />
        </EngField>
        <button type="button" className="eng-primary-btn">
          + Publish High-Five Shoutout
        </button>
      </EngCard>

      <EngCard className="eng-split-main">
        <EngSectionTitle
          title="PUBLIC PEER RECOGNITION STREAM"
          trailing={<span className="tone-primary sm bold">Values in Action</span>}
        />
        <div className="eng-shoutout-list">
          {SHOUT_OUTS.map((card) => (
            <article key={card.name} className="eng-shoutout-card">
              <div className="eng-shoutout-head">
                <EngAvatar initials={card.initials} />
                <div>
                  <strong>{card.name}</strong>
                  <p className="eng-muted sm">{card.role}</p>
                </div>
                <span className="eng-badge-pill">{card.badge}</span>
              </div>
              <p className="eng-shoutout-message">{card.message}</p>
              <div className="eng-shoutout-foot">
                <span className="eng-muted sm">via {card.meta}</span>
                <button type="button" className="eng-applause-btn">
                  👏 Applause {card.applause}
                </button>
              </div>
            </article>
          ))}
        </div>
      </EngCard>
    </div>
  )
}

export function EngagementManagerTab() {
  return (
    <div className="eng-tab">
      <div className="eng-kpi-row">
        <RecruitIconKpi
          title="OPERATIONAL BURNOUT INDEX"
          value="High Risk (64%)"
          subtext="Flagged: Operations & QA"
          icon="🔥"
          iconColor="#dc2626"
          valueTone="danger"
        />
        <RecruitIconKpi
          title="TEAM PARTICIPATION RATE"
          value="88.5% casted"
          subtext="Exceeds compliance targets"
          icon="👥"
          iconColor="#059669"
          trend="Exceeds compliance targets"
        />
        <RecruitIconKpi
          title="WELLNESS BUDGET AFFINITY"
          value="92% score"
          subtext="HSA programs approved"
          icon="😊"
          iconColor="#2563eb"
        />
        <RecruitIconKpi
          title="ACTION DOCKET COUNT"
          value="2 Pending"
          subtext="1 completed objective today"
          icon="📋"
          iconColor="#7c3aed"
          trend="1 completed objective today"
        />
      </div>

      <div className="eng-split">
        <EngCard className="eng-split-side">
          <div className="eng-card-head">
            <span aria-hidden>🎯</span>
            <span className="eng-section-title sm">CREATE ENGAGEMENT ACTION PLAN</span>
          </div>
          <EngField label="Action docket title">
            <input type="text" placeholder="e.g. Workload audit sprint planning buffers" />
          </EngField>
          <div className="eng-form-row">
            <EngField label="Target department">
              <select defaultValue="Engineering" aria-label="Target department">
                <option>Engineering</option>
                <option>Operations</option>
              </select>
            </EngField>
            <EngField label="Critical priority">
              <select defaultValue="High" aria-label="Critical priority">
                <option>● High</option>
                <option>Medium</option>
              </select>
            </EngField>
          </div>
          <EngField label="Due date">
            <input type="text" placeholder="dd/mm/yyyy" />
          </EngField>
          <EngField label="Execution notes">
            <textarea rows={3} placeholder="Specify deliverables, milestones, or HR feedback channels..." />
          </EngField>
          <button type="button" className="eng-primary-btn">
            + Deploy Action Objective
          </button>
        </EngCard>

        <EngCard className="eng-split-main">
          <span className="eng-section-title sm muted">ORGANIZATIONAL WELLNESS &amp; ACTION PLANNING LOGS</span>
          <div className="eng-action-list">
            {ACTION_LOGS.map((log) => (
              <article key={log.ref} className="eng-action-card">
                <div className="eng-action-meta">
                  <RecruitPill label={log.priority} tone={log.priorityTone} />
                  <RecruitPill label={log.department} tone="info" />
                  <span className="eng-muted sm">Reference: {log.ref}</span>
                </div>
                <h4>{log.title}</h4>
                <p className="eng-muted sm">{log.body}</p>
                <div className="eng-action-foot">
                  <span className="eng-muted sm">
                    <span aria-hidden>🕐</span> {log.footer}
                  </span>
                  <RecruitPill label={log.status} tone={log.statusTone} />
                </div>
              </article>
            ))}
          </div>
        </EngCard>
      </div>

      <div className="eng-alert-banner" role="alert">
        <span aria-hidden>🛡</span>
        <div>
          <strong>Operational Friction Alerts Under Alarm</strong>
          <p>
            Text analysis matching on the Anonymous feedback ledger signals recurring overtime indicators within our{' '}
            <strong>Operations &amp; QA</strong> divisions. Buffer renegotiation policies are recommended to HR advisors
            coordinates to preempt potential resignations.
          </p>
        </div>
      </div>
    </div>
  )
}

export function EngagementReportsTab() {
  return (
    <div className="eng-tab">
      <div className="eng-kpi-row">
        <RecruitIconKpi
          title="UNIFIED ENPS RATING"
          value="+54 eNPS"
          subtext="38 Promoters • 6 Detractors"
          icon="😊"
          iconColor="#059669"
          trend="● HIGH MORALE TIER"
        />
        <RecruitIconKpi
          title="PULSE POLLS CASTED"
          value="133 votes"
          subtext="Across 3 micro-topic survey polls"
          icon="📋"
          iconColor="#2563eb"
        />
        <RecruitIconKpi
          title="PEER APPRECIATION"
          value="2 Shout-Outs"
          subtext="23 claps and badges shared"
          icon="💬"
          iconColor="#7c3aed"
          trend="⚡ HIGHLY ENGAGED PEER CULTURE"
        />
        <article className="recruit-kpi-card eng-action-progress-kpi">
          <div className="recruit-kpi-top">
            <div>
              <span className="recruit-kpi-title">ACTION PLAN PROGRESS</span>
              <strong className="tone-pink">1 / 3 Done</strong>
              <span className="muted">Mitigation items completed in 48-hour SLAs</span>
            </div>
            <span className="recruit-kpi-icon" style={{ background: '#fce7f3', color: '#db2777' }}>
              🎯
            </span>
          </div>
          <div className="eng-progress-track">
            <span style={{ width: '33%' }} />
          </div>
        </article>
      </div>

      <div className="eng-reports-split">
        <EngCard className="eng-reports-feed">
          <EngSectionTitle
            title="REAL-TIME VIBE &amp; SENTIMENT FEED"
            subtitle="Analyzing anonymous submissions against cognitive burnout alarm limits"
            trailing={
              <button type="button" className="eng-outline-btn">
                Export sentiment metrics
              </button>
            }
          />
          <EngTableScroll>
            <table className="eng-table">
              <thead>
                <tr>
                  <th>Suggestion topic</th>
                  <th>Vibe classification</th>
                  <th>Safety pass</th>
                  <th>Claps shared</th>
                </tr>
              </thead>
              <tbody>
                {SENTIMENT_FEED.map((row) => (
                  <tr key={row.topic}>
                    <td>
                      <strong>{row.topic}</strong>
                      <span className="eng-muted sm block">{row.sub}</span>
                    </td>
                    <td>
                      <RecruitPill label={row.vibe} tone={row.vibeTone} />
                    </td>
                    <td>
                      <span className="eng-safe-pass">✓ ENCRYPTED SAFE</span>
                    </td>
                    <td>
                      <strong>♥ {row.claps}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </EngTableScroll>
        </EngCard>

        <div className="eng-reports-side">
          <EngCard>
            <EngSectionTitle title="ENPS GROUP TALLY WEIGHTS" />
            {ENPS_GROUP_RATIOS.map((bar) => (
              <EngHBar key={bar.label} label={bar.label} pct={bar.pct} color={bar.color} trailing={bar.trailing} />
            ))}
          </EngCard>
          <EngCard>
            <EngSectionTitle title="SHARED BADGES DISTRIBUTION" />
            {BADGE_DISTRIBUTION.map((bar) => (
              <EngHBar key={bar.label} label={bar.label} pct={bar.pct} color={bar.color} trailing={bar.trailing} />
            ))}
          </EngCard>
        </div>
      </div>
    </div>
  )
}
