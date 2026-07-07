import { useEffect, useState } from 'react'
import { LrnField, LrnFieldRow, LrnIcon } from './LearningShared'

type ModalProps = { open: boolean; onClose: () => void }

function LrnModalShell({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
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
    <div className="lrn-modal-overlay" role="presentation" onClick={onClose}>
      <div className="lrn-modal wide" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="lrn-modal-head">
          <LrnIcon name="upload" className="lrn-modal-head-icon" />
          <h2>{title}</h2>
          <button type="button" className="lrn-modal-close" onClick={onClose} aria-label="Close">
            <LrnIcon name="close" className="lrn-modal-close-icon" />
          </button>
        </div>
        <div className="lrn-modal-body">{children}</div>
        <div className="lrn-modal-foot">
          <button type="button" className="lrn-outline-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="lrn-primary-btn" onClick={onClose}>
            Unpack &amp; Complete Import
          </button>
        </div>
      </div>
    </div>
  )
}

const STANDARDS = [
  { title: 'SCORM 1.2', sub: 'Manifest.xml' },
  { title: 'SCORM 2004', sub: 'Unpacked zip' },
  { title: 'Experience API', sub: 'xAPI Wrapper' },
]

export function ImportScormModal({ open, onClose }: ModalProps) {
  const [standard, setStandard] = useState('SCORM 1.2')

  return (
    <LrnModalShell open={open} title="IMPORT SCORM / XAPI PACKAGE" onClose={onClose}>
      <span className="lrn-muted sm">Select Manifest Standard</span>
      <div className="lrn-standard-row">
        {STANDARDS.map((s) => (
          <button
            key={s.title}
            type="button"
            className={`lrn-standard-card${standard === s.title ? ' active' : ''}`}
            onClick={() => setStandard(s.title)}
          >
            <strong>{s.title}</strong>
            <em>{s.sub}</em>
          </button>
        ))}
      </div>
      <LrnField label="Course Title">
        <input type="text" className="lrn-input" placeholder="e.g., Threat Mitigation and Phishing Countermeasures" />
      </LrnField>
      <LrnFieldRow>
        <LrnField label="Provider Source">
          <select className="lrn-input" defaultValue="LinkedIn Learning">
            <option>LinkedIn Learning</option>
            <option>Coursera</option>
            <option>Udemy Business</option>
          </select>
        </LrnField>
        <LrnField label="Course Category">
          <select className="lrn-input" defaultValue="General / Core">
            <option>General / Core</option>
            <option>Engineering</option>
            <option>HR</option>
          </select>
        </LrnField>
      </LrnFieldRow>
      <LrnFieldRow>
        <LrnField label="Format Type">
          <select className="lrn-input" defaultValue="Interactive SCORM Module">
            <option>Interactive SCORM Module</option>
            <option>Video</option>
            <option>Document</option>
          </select>
        </LrnField>
        <LrnField label="Estimated duration">
          <input type="text" className="lrn-input" defaultValue="3h 30m" />
        </LrnField>
      </LrnFieldRow>
      <div className="lrn-dropzone">
        <LrnIcon name="upload" className="lrn-dropzone-icon" />
        <strong>Select standard ZIP file</strong>
        <p className="lrn-muted sm">Accepts .zip package files with metadata.xml manifest</p>
      </div>
    </LrnModalShell>
  )
}
