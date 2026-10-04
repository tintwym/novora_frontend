export const DEFAULT_CURRENCY = 'SGD'

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { value: 'MMK', label: 'MMK — Myanmar Kyat' },
  { value: 'THB', label: 'THB — Thai Baht' },
  { value: 'IDR', label: 'IDR — Indonesian Rupiah' },
  { value: 'PHP', label: 'PHP — Philippine Peso' },
  { value: 'VND', label: 'VND — Vietnamese Dong' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'CNY', label: 'CNY — Chinese Yuan' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'HKD', label: 'HKD — Hong Kong Dollar' },
]

function fractionDigits(currency: string): number {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {
    return 2
  }
}

export function formatAmount(amount: number | null | undefined, currency: string, decimals?: number): string {
  const digits = decimals ?? fractionDigits(currency)
  const value = Number.isFinite(Number(amount)) ? Number(amount) : 0
  return value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

/** Renders as "SGD 1,234.50" — code prefix keeps every currency unambiguous. */
export function formatMoney(amount: number | null | undefined, currency: string, decimals?: number): string {
  return `${currency} ${formatAmount(amount, currency, decimals)}`
}
