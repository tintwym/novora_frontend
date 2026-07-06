import { useEffect, useState } from 'react'

/** Minimum viewport width for the admin web console. */
export const DESKTOP_MIN_WIDTH_PX = 1280

export function useMinDesktopWidth() {
  const [wideEnough, setWideEnough] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= DESKTOP_MIN_WIDTH_PX,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`)
    const update = () => setWideEnough(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return wideEnough
}
