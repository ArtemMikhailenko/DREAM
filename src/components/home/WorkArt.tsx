/**
 * Drawn covers for the home case cards — no stock photography. Each one is a
 * monochrome scene from the case's own world that comes alive on hover:
 * 0 lens/aperture (brand film), 1 rising results chart (ads), 2 content feed (SMM).
 */
export function WorkArt({ variant }: { variant: number }) {
  if (variant % 3 === 0) {
    return (
      <svg className="wa wa-lens" viewBox="0 0 400 500" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="wa-l-g" cx="50%" cy="46%" r="60%">
            <stop offset="0" stopColor="#2a2925" />
            <stop offset="1" stopColor="#0b0b0a" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill="url(#wa-l-g)" />
        <g transform="translate(200 230)">
          <g className="wa-rings">
            {[150, 122, 96, 72].map((r, i) => (
              <circle key={r} r={r} fill="none" stroke="rgba(244,241,234,.16)" strokeWidth={i === 0 ? 1.4 : 1} strokeDasharray={i % 2 ? "2 7" : "none"} />
            ))}
          </g>
          <g className="wa-blades">
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} d="M0 -70 L40 -40 L22 -6 Z" fill="rgba(244,241,234,.07)" stroke="rgba(244,241,234,.28)" strokeWidth="1" transform={`rotate(${i * 45})`} />
            ))}
          </g>
          <circle className="wa-iris" r="20" fill="#0b0b0a" stroke="rgba(232,168,104,.9)" strokeWidth="1.5" />
          <circle r="5" fill="rgba(232,168,104,.9)" />
        </g>
      </svg>
    );
  }
  if (variant % 3 === 1) {
    const bars = [38, 52, 46, 70, 64, 92, 118, 150];
    return (
      <svg className="wa wa-chart" viewBox="0 0 400 500" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#0f0f0e" />
        <g stroke="rgba(244,241,234,.07)">
          {[120, 180, 240, 300, 360].map((y) => <line key={y} x1="28" x2="372" y1={y} y2={y} />)}
        </g>
        <g className="wa-bars">
          {bars.map((b, i) => (
            <rect key={i} x={40 + i * 42} y={380 - b * 1.6} width="22" height={b * 1.6} rx="4"
              fill={i === bars.length - 1 ? "rgba(232,168,104,.85)" : "rgba(244,241,234,.14)"}
              style={{ ["--i" as string]: i }} />
          ))}
        </g>
        <polyline className="wa-line" points="51,330 93,305 135,316 177,268 219,280 261,224 303,182 345,118"
          fill="none" stroke="rgba(244,241,234,.85)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle className="wa-peak" cx="345" cy="118" r="6" fill="#e8a868" />
      </svg>
    );
  }
  // content rhythm: a soft waveform of posts, the latest one lit
  const bars = Array.from({ length: 34 }, (_, i) => 30 + Math.abs(Math.sin(i * 0.55) * 90 + Math.sin(i * 1.7) * 40));
  return (
    <svg className="wa wa-wave" viewBox="0 0 400 500" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wa-w-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1917" />
          <stop offset="1" stopColor="#0b0b0a" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#wa-w-g)" />
      <g className="wa-wave-bars">
        {bars.map((b, i) => (
          <rect key={i} x={30 + i * 10.2} y={250 - b / 2} width="3" height={b} rx="1.5"
            fill={i === 22 ? "rgba(232,168,104,.95)" : "rgba(244,241,234,.22)"}
            style={{ ["--i" as string]: i }} />
        ))}
      </g>
      <circle className="wa-wave-dot" cx="255" cy="250" r="5" fill="#e8a868" />
    </svg>
  );
}
