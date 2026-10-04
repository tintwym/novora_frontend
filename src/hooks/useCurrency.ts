import { useCallback } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { DEFAULT_CURRENCY, formatAmount, formatMoney } from '@/lib/currency'

export function useCurrency() {
  const { session } = useAuth()
  const currency = session?.organization?.currency || DEFAULT_CURRENCY
  const money = useCallback(
    (amount: number | null | undefined, decimals?: number) => formatMoney(amount, currency, decimals),
    [currency],
  )
  const amount = useCallback(
    (value: number | null | undefined, decimals?: number) => formatAmount(value, currency, decimals),
    [currency],
  )
  return { currency, money, amount }
}
