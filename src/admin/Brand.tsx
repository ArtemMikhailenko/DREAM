/** Brand marks for the Payload admin (login screen + sidebar). */

export function Icon() {
  return (
    <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#0f0e0c" stroke="#e8a868" strokeWidth="1.5" />
      <path d="M11 10.5v11l9-5.5-9-5.5z" fill="#e8a868" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="dcp-logo">
      <span className="dcp-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="34" height="34">
          <rect x="1" y="1" width="30" height="30" rx="8" fill="#0f0e0c" stroke="#e8a868" strokeWidth="1.5" />
          <path d="M11 10.5v11l9-5.5-9-5.5z" fill="#e8a868" />
        </svg>
      </span>
      <span className="dcp-logo-text">
        <b>DC.PROD</b>
        <i>панель управления</i>
      </span>
    </div>
  );
}
