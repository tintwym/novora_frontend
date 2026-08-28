/**
 * Display layout for person names.
 * Spaced / punctuated names keep word breaks; compact romanized names
 * (e.g. email locals like tintwaiyanmin) become PascalCase syllables: TintWaiYanMin.
 */

/** Longest-first romanized syllables common in Myanmar given names. */
const SYLLABLES = [
  'thiri',
  'nyein',
  'maung',
  'thant',
  'lynn',
  'naing',
  'aung',
  'kyaw',
  'htut',
  'htet',
  'phyo',
  'tint',
  'hnin',
  'cho',
  'moe',
  'aye',
  'wai',
  'yan',
  'min',
  'myo',
  'win',
  'soe',
  'thu',
  'lin',
  'zaw',
  'pyi',
  'tin',
  'su',
  'yi',
  'ei',
  'oo',
  'ko',
  'u',
].sort((a, b) => b.length - a.length)

function titleCaseWord(word: string): string {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function stripEmployeePlaceholder(parts: string[]): string[] {
  if (parts.length >= 2 && parts[parts.length - 1]!.toLowerCase() === 'employee') {
    return parts.slice(0, -1)
  }
  return parts
}

function segmentCompactName(raw: string): string[] {
  const lower = raw.toLowerCase()
  const parts: string[] = []
  let i = 0
  while (i < lower.length) {
    let matched: string | null = null
    for (const syl of SYLLABLES) {
      if (lower.startsWith(syl, i)) {
        matched = syl
        break
      }
    }
    if (matched) {
      parts.push(matched)
      i += matched.length
      continue
    }
    // Consume until the next known syllable (or end).
    let j = i + 1
    while (j < lower.length) {
      const rest = lower.slice(j)
      if (SYLLABLES.some((syl) => rest.startsWith(syl))) break
      j += 1
    }
    parts.push(lower.slice(i, j))
    i = j
  }
  return parts.filter(Boolean)
}

function toPascalSyllables(token: string): string {
  // Already camelCase / PascalCase — normalize each capital-run.
  if (/[a-z][A-Z]/.test(token)) {
    return token
      .split(/(?=[A-Z])/)
      .filter(Boolean)
      .map((b) => titleCaseWord(b))
      .join('')
  }
  return segmentCompactName(token)
    .map((p) => titleCaseWord(p))
    .join('')
}

/** Prefer a readable layout for chrome (topbar, greetings, biometric). */
export function formatPersonDisplayName(fullName: string | null | undefined): string {
  const trimmed = (fullName ?? '').trim()
  if (!trimmed) return 'User'

  if (/[\s._+\-]+/.test(trimmed)) {
    const parts = stripEmployeePlaceholder(
      trimmed.split(/[\s._+\-]+/).filter(Boolean),
    )
    if (parts.length === 0) return 'User'
    if (parts.length === 1) return toPascalSyllables(parts[0]!)
    return parts.map((p) => titleCaseWord(p)).join(' ')
  }

  const compact = stripEmployeePlaceholder([trimmed])[0] ?? trimmed
  return toPascalSyllables(compact) || 'User'
}
