import { DESKTOP_MIN_WIDTH_PX } from '../../config/shell'
import { NovoraLogoMark } from '../brand/NovoraLogo'

export function DesktopOnlyNotice() {
  return (
    <div className="desktop-only-notice">
      <NovoraLogoMark className="desktop-only-notice-mark" />
      <h1>Novora HRMS</h1>
      <p>
        This admin console is built for desktop screens ({DESKTOP_MIN_WIDTH_PX}px wide or larger).
      </p>
      <p className="desktop-only-notice-sub">
        For leave, attendance, and claims on the go, use the Novora mobile app.
      </p>
    </div>
  )
}
