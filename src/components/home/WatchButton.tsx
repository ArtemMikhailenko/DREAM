"use client";

/** Round glass play button that opens the showreel in the theater right away. */
export function WatchButton({ label }: { label: string }) {
  return (
    <button type="button" className="h2-watch" aria-label={label} onClick={() => window.dispatchEvent(new CustomEvent("dc:open-reel"))}>
      <span className="h2-watch-ic glass-btn" aria-hidden="true">
        <i className="h2-watch-wave" /><i className="h2-watch-wave" />
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      </span>
      <span className="h2-watch-t">{label}</span>
    </button>
  );
}
