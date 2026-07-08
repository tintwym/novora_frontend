import { useRef, type ReactNode } from 'react'
import { useDemoButtonFallback } from '../../hooks/useDemoButtonFallback'

export function DemoButtonRoot({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  useDemoButtonFallback(rootRef)

  return (
    <div ref={rootRef} className="demo-button-root">
      {children}
    </div>
  )
}
