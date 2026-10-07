function TimeVsSpaceVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 150"
        role="img"
        aria-label="Two small charts over the life of a program. Time keeps climbing because steps add up and never come back. Space rises and falls as memory is created and released, and what counts is the highest point, the peak."
      >
        <text x="77" y="14" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">time</text>
        <line x1="20" y1="115" x2="135" y2="115" stroke="var(--border)" />
        <polyline
          points="20,115 40,104 60,90 80,72 100,50 120,28 135,16"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
        />
        <text x="77" y="132" fontSize="8" textAnchor="middle" fill="var(--text)">steps add up, never come back</text>

        <text x="222" y="14" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">space</text>
        <line x1="165" y1="115" x2="280" y2="115" stroke="var(--border)" />
        <polyline
          points="165,115 185,92 205,60 225,36 245,70 265,98 280,108"
          fill="none"
          stroke="var(--margin-line)"
          strokeWidth="2.5"
        />
        <line x1="165" y1="36" x2="280" y2="36" stroke="var(--margin-line)" strokeDasharray="3 3" />
        <text x="276" y="30" fontSize="8" textAnchor="end" fill="var(--margin-line)">peak</text>
        <text x="222" y="132" fontSize="8" textAnchor="middle" fill="var(--text)">memory is freed; count the peak</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> time: a running total</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> space: a high-water mark</li>
      </ul>
    </div>
  )
}

function CallStackSpaceVisual() {
  const frames = ['fact(1)', 'fact(2)', 'fact(3)', 'fact(4)']

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 140"
        role="img"
        aria-label="Left: a loop keeps one small box of variables no matter how large n is. Right: a recursive function stacks one frame per call, so four calls means four boxes in memory at once."
      >
        <text x="75" y="14" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">loop</text>
        <rect x="35" y="96" width="80" height="24" rx="3" fill="var(--bg)" stroke="var(--border)" />
        <text x="75" y="112" fontSize="10" textAnchor="middle" fill="var(--text-h)">i, total</text>
        <text x="75" y="136" fontSize="8" textAnchor="middle" fill="var(--text)">one box: O(1)</text>

        <text x="225" y="14" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">recursion</text>
        {frames.map((f, i) => (
          <g key={f}>
            <rect
              x="180"
              y={96 - i * 25}
              width="90"
              height="22"
              rx="3"
              fill={i === frames.length - 1 ? 'var(--accent-bg)' : 'var(--bg)'}
              stroke={i === frames.length - 1 ? 'var(--accent)' : 'var(--border)'}
            />
            <text x="225" y={111 - i * 25} fontSize="10" textAnchor="middle" fill="var(--text-h)">{f}</text>
          </g>
        ))}
        <text x="225" y="136" fontSize="8" textAnchor="middle" fill="var(--text)">one box per call: O(n)</text>
      </svg>
      <ul className="visual-legend">
        <li>each unfinished call keeps its own frame alive on the call stack</li>
      </ul>
    </div>
  )
}

export { TimeVsSpaceVisual, CallStackSpaceVisual }
