import type { SidebarTab } from '@/types'

/** Short sidebar / chrome label — strip trailing "Management". */
export function sidebarLabel(tab: SidebarTab | string): string {
  if (tab === 'Helpdesk & Inquiries Management') return 'Helpdesk & Inquiries'
  if (tab === 'On/Off-boarding Management') return 'On/Off-boarding'
  return String(tab).replace(/ Management$/, '') || String(tab)
}
