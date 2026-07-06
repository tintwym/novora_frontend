import { shellTitle } from '../config/nav'
import { useLocation } from 'react-router-dom'

export function PlaceholderModulePage() {
  const { pathname } = useLocation()
  const title = shellTitle(pathname)

  return (
    <div className="module-placeholder">
      <h2>{title}</h2>
      <p>
        Module scaffold — wire UI and API routes via <code>novora_backend</code>.
      </p>
    </div>
  )
}
