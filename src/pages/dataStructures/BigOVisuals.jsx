function GrowthVsSpeedVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 170"
        role="img"
        aria-label="Line chart showing an O(n squared) curve with a small constant starting below an O(n) line with a large constant, then crossing above it as input size grows."
      >
        <line x1="26" y1="15" x2="26" y2="145" stroke="var(--border)" />
        <line x1="26" y1="145" x2="285" y2="145" stroke="var(--border)" />

        <path d="M26,145 L285,55" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <path
          d="M26,145 C120,143 195,128 220,90 C238,64 260,35 285,20"
          fill="none"
          stroke="var(--margin-line)"
          strokeWidth="2.5"
        />

        <line
          x1="240"
          y1="15"
          x2="240"
          y2="145"
          stroke="var(--text)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <circle cx="240" cy="58" r="3" fill="var(--text-h)" />

        <text x="130" y="95" fontSize="10" fill="var(--accent)">O(n)</text>
        <text x="245" y="18" fontSize="10" fill="var(--margin-line)">O(n²)</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> O(n), large constant (slow machine)</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> O(n²), small constant (fast machine)</li>
      </ul>
      <p className="visual-caption">
        For small n, O(n²) can still be faster &mdash; past the crossover
        point, growth rate wins no matter how fast the hardware is.
      </p>
    </div>
  )
}

function BoundsVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 170"
        role="img"
        aria-label="Chart showing a jagged actual-runtime line with a smooth upper-bound curve above it (Big-O) and a smooth lower-bound curve below it (Big-Omega)."
      >
        <line x1="26" y1="15" x2="26" y2="145" stroke="var(--border)" />
        <line x1="26" y1="145" x2="285" y2="145" stroke="var(--border)" />

        <path
          d="M26,110 Q155,45 285,25"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <path
          d="M26,120 L55,98 L84,112 L113,82 L142,94 L171,66 L200,78 L229,50 L258,62 L285,42"
          fill="none"
          stroke="var(--text-h)"
          strokeWidth="2"
        />
        <path
          d="M26,132 Q155,118 285,75"
          fill="none"
          stroke="var(--sticky-border)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />

        <text x="248" y="22" fontSize="10" fill="var(--accent)">O(n)</text>
        <text x="95" y="76" fontSize="10" fill="var(--text-h)">actual</text>
        <text x="245" y="72" fontSize="10" fill="var(--sticky-border)">&#937;(n)</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> O(n) upper bound</li>
        <li><span className="swatch" style={{ background: 'var(--text-h)' }} /> actual runtime</li>
        <li><span className="swatch" style={{ background: 'var(--sticky-border)' }} /> &#937;(n) lower bound</li>
      </ul>
      <p className="visual-caption">
        Real runtime is noisy. Big-O caps it from above, Big-Omega floors
        it from below &mdash; Big-Theta is when both bounds meet.
      </p>
    </div>
  )
}

function DominantTermVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 170"
        role="img"
        aria-label="Two bar-chart panels comparing the terms of 3n plus 5. At n=2 the bars for 3n and +5 are similar heights; at n=100 the +5 bar shrinks to almost nothing next to the 3n bar."
      >
        <line x1="26" y1="145" x2="140" y2="145" stroke="var(--border)" />
        <line x1="170" y1="145" x2="285" y2="145" stroke="var(--border)" />

        <text x="60" y="20" fontSize="10" fill="var(--text)">n = 2</text>
        <rect x="55" y="35" width="20" height="110" fill="var(--accent)" />
        <rect x="95" y="53.3" width="20" height="91.7" fill="var(--margin-line)" />

        <text x="205" y="20" fontSize="10" fill="var(--text)">n = 100</text>
        <rect x="185" y="35" width="20" height="110" fill="var(--accent)" />
        <rect x="225" y="143.2" width="20" height="1.8" fill="var(--margin-line)" />
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> 3n</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> +5</li>
      </ul>
      <p className="visual-caption">
        At n = 2 the &ldquo;+5&rdquo; is a third of the total. At n = 100
        it&rsquo;s barely visible &mdash; so we drop it and just say O(n).
      </p>
    </div>
  )
}

function AmortizedCostVisual() {
  const tallHeights = { 2: 22, 4: 35, 8: 52, 16: 78 }
  const bars = Array.from({ length: 16 }, (_, i) => {
    const index = i + 1
    return { index, height: tallHeights[index] ?? 8 }
  })
  const step = 250 / (bars.length - 1)

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 170"
        role="img"
        aria-label="Bar chart of 16 sequential array appends. Most bars are short, representing O(1) appends, with occasional tall bars at doubling points representing the O(n) cost of resizing and copying the array."
      >
        <line x1="20" y1="145" x2="285" y2="145" stroke="var(--border)" />
        <line
          x1="20"
          y1="134"
          x2="285"
          y2="134"
          stroke="var(--text)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />

        {bars.map(({ index, height }) => {
          const x = 26 + step * (index - 1)
          const isResize = height > 8
          return (
            <rect
              key={index}
              x={x - 6}
              y={145 - height}
              width="12"
              height={height}
              fill={isResize ? 'var(--margin-line)' : 'var(--accent)'}
            />
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> O(1) append</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> O(n) resize + copy</li>
      </ul>
      <p className="visual-caption">
        Most appends are cheap (blue). The rare resize-and-copy (red) is
        O(n), but it&rsquo;s rare enough that the average per append stays
        O(1).
      </p>
    </div>
  )
}

export { GrowthVsSpeedVisual, BoundsVisual, DominantTermVisual, AmortizedCostVisual }
