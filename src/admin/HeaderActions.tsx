const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Header action: jump to the live site.
 *
 * Payload renders this into `.app-header__actions-wrapper`, the empty stretch
 * between the breadcrumb and the locale switcher — the one thing editors reach
 * for constantly and otherwise have to reach for a new tab to do.
 */
export function HeaderActions() {
  return (
    <a className="dcp-head-site" href={SITE_URL} target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
        <path d="M14 4h6v6M20 4l-9 9" />
      </svg>
      <span>Открыть сайт</span>
    </a>
  );
}
