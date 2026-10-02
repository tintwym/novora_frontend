import React, { useState } from 'react'
import { Sparkles, Send, LifeBuoy } from 'lucide-react'
import { ApiError, askPolicyAssistant, type PolicyQaResponse } from '@/services'

interface PolicyAssistantPanelProps {
  /** Opens the ticket form pre-filled with the unanswered question. */
  onEscalate: (question: string) => void
}

type Exchange = { id: number; question: string; reply: PolicyQaResponse }

const SUGGESTED_QUESTIONS = [
  'How many annual leave days do I get?',
  'Can unused leave carry forward?',
  'What is the overtime rate on weekends?',
  'When is the next public holiday?',
]

const MAX_QUESTION_LENGTH = 500

export default function PolicyAssistantPanel({ onEscalate }: PolicyAssistantPanelProps) {
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Exchange[]>([])

  const ask = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setBusy(true)
    setError(null)
    try {
      const reply = await askPolicyAssistant(trimmed.slice(0, MAX_QUESTION_LENGTH))
      setHistory((prev) => [{ id: Date.now(), question: trimmed, reply }, ...prev].slice(0, 5))
      setQuestion('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'The assistant is unavailable right now.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div id="helpdesk-policy-assistant" className="nv-card p-4.5 shadow-xs space-y-3.5">
      <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-50">
        <Sparkles className="h-4 w-4 text-novora" />
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Ask HR Assistant</span>
        <span className="ml-auto text-[10px] font-bold text-slate-400">
          Answers from your company&apos;s HR settings
        </span>
      </div>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          void ask(question)
        }}
      >
        <input
          type="text"
          value={question}
          maxLength={MAX_QUESTION_LENGTH}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How many sick leave days do I have per year?"
          aria-label="Ask a question about company HR policies"
          className="nv-input h-10 flex-1 text-xs"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !question.trim()}
          className="h-10 inline-flex items-center gap-1.5 px-4 text-xs font-extrabold text-white bg-novora hover:bg-opacity-95 rounded-xl cursor-pointer disabled:opacity-60 shrink-0"
        >
          <Send className={`h-3.5 w-3.5 ${busy ? 'animate-pulse' : ''}`} />
          {busy ? 'Thinking…' : 'Ask'}
        </button>
      </form>

      {history.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={busy}
              onClick={() => {
                setQuestion(q)
                void ask(q)
              }}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full border border-novora/20 bg-novora/5 text-novora hover:bg-novora/10 cursor-pointer disabled:opacity-60"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="text-[11px] font-bold text-rose-600">
          {error}
        </p>
      )}

      {history.length > 0 && (
        <ul className="space-y-3" aria-live="polite">
          {history.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 space-y-2">
              <p className="text-[11px] font-black text-slate-800">{item.question}</p>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{item.reply.answer}</p>
              {item.reply.sources.length > 0 && (
                <p className="text-[10px] font-bold text-slate-400">
                  Based on: {item.reply.sources.join(', ')}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[10px] italic text-slate-400">{item.reply.disclaimer}</span>
                <button
                  type="button"
                  onClick={() => onEscalate(item.question)}
                  className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-novora hover:underline cursor-pointer"
                >
                  <LifeBuoy className="h-3 w-3" />
                  Still need help? File a ticket
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
