function GrowthVsSpeedVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Line chart showing an O(n squared) curve with a small constant starting below an O(n) line with a large constant, then crossing above it as input size grows."
      >
        <line x1="24" y1="10" x2="24" y2="105" stroke="var(--border)" />
        <line x1="24" y1="105" x2="285" y2="105" stroke="var(--border)" />

        <path d="M24,105 L285,40" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <path
          d="M24,105 C110,103 180,92 205,65 C222,46 250,20 285,10"
          fill="none"
          stroke="var(--margin-line)"
          strokeWidth="2.5"
        />

        <line
          x1="222"
          y1="10"
          x2="222"
          y2="105"
          stroke="var(--text)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <circle cx="222" cy="47" r="3" fill="var(--text-h)" />

        <text x="120" y="70" fontSize="10" fill="var(--accent)">O(n)</text>
        <text x="228" y="14" fontSize="10" fill="var(--margin-line)">O(n²)</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> O(n), large constant</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> O(n²), small constant</li>
      </ul>
    </div>
  )
}

function BoundsVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Chart showing a jagged actual-runtime line with a smooth upper-bound curve above it (Big-O) and a smooth lower-bound curve below it (Big-Omega)."
      >
        <line x1="24" y1="10" x2="24" y2="105" stroke="var(--border)" />
        <line x1="24" y1="105" x2="285" y2="105" stroke="var(--border)" />

        <path
          d="M24,80 Q150,32 285,16"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <path
          d="M24,88 L50,70 L76,84 L102,58 L128,70 L154,46 L180,58 L206,34 L232,46 L258,24 L285,32"
          fill="none"
          stroke="var(--text-h)"
          strokeWidth="2"
        />
        <path
          d="M24,98 Q150,88 285,54"
          fill="none"
          stroke="var(--sticky-border)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />

        <text x="248" y="14" fontSize="10" fill="var(--accent)">O(n)</text>
        <text x="86" y="54" fontSize="10" fill="var(--text-h)">actual</text>
        <text x="245" y="50" fontSize="10" fill="var(--sticky-border)">&#937;(n)</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> O(n) upper</li>
        <li><span className="swatch" style={{ background: 'var(--text-h)' }} /> actual runtime</li>
        <li><span className="swatch" style={{ background: 'var(--sticky-border)' }} /> &#937;(n) lower</li>
      </ul>
    </div>
  )
}

function DominantTermVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Two bar-chart panels comparing the terms of 3n plus 5. At n=2 the bars for 3n and +5 are similar heights; at n=100 the +5 bar shrinks to almost nothing next to the 3n bar."
      >
        <line x1="18" y1="105" x2="122" y2="105" stroke="var(--border)" />
        <line x1="152" y1="105" x2="256" y2="105" stroke="var(--border)" />

        <text x="55" y="15" fontSize="10" fill="var(--text)">n = 2</text>
        <rect x="46" y="25" width="18" height="80" fill="var(--accent)" />
        <rect x="80" y="38.3" width="18" height="66.7" fill="var(--margin-line)" />

        <text x="182" y="15" fontSize="10" fill="var(--text)">n = 100</text>
        <rect x="176" y="25" width="18" height="80" fill="var(--accent)" />
        <rect x="210" y="103.7" width="18" height="1.3" fill="var(--margin-line)" />
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> 3n</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> +5</li>
      </ul>
    </div>
  )
}

function AmortizedCostVisual() {
  const tallHeights = { 2: 16, 4: 26, 8: 40, 16: 60 }
  const bars = Array.from({ length: 16 }, (_, i) => {
    const index = i + 1
    return { index, height: tallHeights[index] ?? 6 }
  })
  const step = 246 / (bars.length - 1)

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Bar chart of 16 sequential array appends. Most bars are short, representing O(1) appends, with occasional tall bars at doubling points representing the O(n) cost of resizing and copying the array."
      >
        <line x1="18" y1="105" x2="282" y2="105" stroke="var(--border)" />
        <line
          x1="18"
          y1="97"
          x2="282"
          y2="97"
          stroke="var(--text)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />

        {bars.map(({ index, height }) => {
          const x = 24 + step * (index - 1)
          const isResize = height > 6
          return (
            <rect
              key={index}
              x={x - 6}
              y={105 - height}
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
    </div>
  )
}

export { GrowthVsSpeedVisual, BoundsVisual, DominantTermVisual, AmortizedCostVisual }
