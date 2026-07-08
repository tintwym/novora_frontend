import { useEffect, type RefObject } from 'react'
import { showActionToast } from '../utils/actionToast'

function getReactOnClick(btn: HTMLButtonElement): unknown {
  const propsKey = Object.keys(btn).find((key) => key.startsWith('__reactProps$'))
  if (!propsKey) return undefined
  const props = (btn as unknown as Record<string, { onClick?: unknown }>)[propsKey]
  return props?.onClick
}

function buttonHasClickHandler(btn: HTMLButtonElement): boolean {
  if (typeof getReactOnClick(btn) === 'function') return true
  if (btn.onclick) return true
  return false
}

function shouldSkipButton(btn: HTMLButtonElement): boolean {
  if (btn.disabled) return true
  if (btn.getAttribute('aria-disabled') === 'true') return true
  if (btn.dataset.noDemoAction !== undefined) return true
  if (btn.type === 'submit' || btn.type === 'reset') return true
  if (buttonHasClickHandler(btn)) return true
  return false
}

function getActionMessage(btn: HTMLButtonElement): string {
  const label =
    btn.getAttribute('aria-label')?.trim() ||
    btn.textContent?.trim().replace(/\s+/g, ' ') ||
    'Action'

  if (btn.classList.contains('hr-toolbar-pill-export') || /\bexport\b/i.test(label)) {
    return 'Export started…'
  }
  if (/\bdownload\b/i.test(label)) {
    const name = label.replace(/\bdownload\b/gi, '').trim()
    return name ? `Downloading ${name}…` : 'Downloading…'
  }

  return `${label} — demo preview.`
}

export function useDemoButtonFallback(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return

      const target = event.target
      if (!(target instanceof Element)) return

      const btn = target.closest('button')
      if (!btn || !root.contains(btn)) return
      if (shouldSkipButton(btn)) return

      showActionToast(getActionMessage(btn))
    }

    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [containerRef])
}
