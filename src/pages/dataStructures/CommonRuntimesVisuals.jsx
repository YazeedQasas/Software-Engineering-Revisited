function GrowthChartVisual() {
  const left = 30
  const right = 262
  const top = 14
  const bottom = 138
  const maxN = 10
  const maxY = 40

  const x = (n) => left + ((n - 1) / (maxN - 1)) * (right - left)
  const y = (v) => bottom - (Math.min(v, maxY) / maxY) * (bottom - top)

  const curves = [
    { label: '2ⁿ', color: 'var(--text-h)', f: (n) => 2 ** n },
    { label: 'n²', color: 'var(--margin-line)', f: (n) => n * n },
    { label: 'n log n', color: 'var(--sticky-border)', f: (n) => n * Math.log2(n) },
    { label: 'n', color: 'var(--accent)', f: (n) => n },
    { label: 'log n', color: 'var(--success)', f: (n) => Math.log2(n) },
    { label: '1', color: 'var(--text)', f: () => 1 },
  ]

  const steps = 120
  const trace = (f) => {
    const pts = []
    for (let k = 0; k <= steps; k++) {
      const n = 1 + (k / steps) * (maxN - 1)
      const v = f(n)
      if (v > maxY) break
      pts.push({ px: x(n), py: y(v) })
    }
    return pts
  }

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 160"
        role="img"
        aria-label="A chart of how the number of steps grows as the input size n grows from 1 to 10. A constant stays flat at the bottom, log n rises very slowly, n is a straight diagonal, n log n curves slightly above it, n squared climbs steeply, and 2 to the n shoots off the top of the chart."
      >
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--border)" />
        <line x1={left} y1={top} x2={left} y2={bottom} stroke="var(--border)" />
        <text x={(left + right) / 2} y="154" fontSize="8" textAnchor="middle" fill="var(--text)">input size n →</text>
        <text x="10" y={(top + bottom) / 2} fontSize="8" textAnchor="middle" fill="var(--text)" transform={`rotate(-90 10 ${(top + bottom) / 2})`}>steps</text>

        {curves.map((c) => {
          const pts = trace(c.f)
          const end = pts[pts.length - 1]
          return (
            <g key={c.label}>
              <polyline
                points={pts.map((p) => `${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ')}
                fill="none"
                stroke={c.color}
                strokeWidth="2"
              />
              <text x={end.px + 4} y={end.py + (c.label === '1' ? 3 : c.label === 'log n' ? 2 : 3)} fontSize="9" fontWeight="600" fill={c.color}>
                {c.label}
              </text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>the gap between the curves widens fast as n grows</li>
      </ul>
    </div>
  )
}

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1))

const families = {
  constant: { label: 'O(1)', color: 'var(--text)', maxN: 10, f: () => 1, caption: 'always 1 step, however big n gets' },
  log: { label: 'O(log n)', color: 'var(--success)', maxN: 10, f: (n) => Math.log2(n), caption: 'n = 1,000,000 → about 20 steps' },
  sqrt: { label: 'O(√n)', color: 'var(--success)', maxN: 10, f: (n) => Math.sqrt(n), caption: 'n = 1,000,000 → 1,000 steps' },
  linear: { label: 'O(n)', color: 'var(--accent)', maxN: 10, f: (n) => n, caption: 'n = 1,000,000 → 1,000,000 steps' },
  nlogn: { label: 'O(n log n)', color: 'var(--sticky-border)', maxN: 10, f: (n) => n * Math.log2(n), caption: 'n = 1,000,000 → about 20 million steps' },
  quadratic: { label: 'O(n²)', color: 'var(--margin-line)', maxN: 10, f: (n) => n * n, caption: 'n = 1,000,000 → 1 trillion steps' },
  exponential: { label: 'O(2ⁿ)', color: 'var(--margin-line)', maxN: 10, f: (n) => 2 ** n, caption: 'n = 30 → about 1 billion steps' },
  factorial: { label: 'O(n!)', color: 'var(--margin-line)', maxN: 7, f: (n) => factorial(Math.round(n)), caption: 'n = 15 → about 1.3 trillion steps', step: true },
}

function RuntimeGraphVisual({ kind }) {
  const fam = families[kind]
  const left = 26
  const right = 280
  const top = 14
  const bottom = 118
  const maxY = Math.max(fam.f(fam.maxN), fam.maxN) * 1.08

  const px = (n) => left + ((n - 1) / (fam.maxN - 1)) * (right - left)
  const py = (v) => bottom - (v / maxY) * (bottom - top)

  const samples = fam.step ? fam.maxN : 80
  const pts = Array.from({ length: samples }).map((_, k) => {
    const n = fam.step ? k + 1 : 1 + (k / (samples - 1)) * (fam.maxN - 1)
    return { px: px(n), py: py(fam.f(n)) }
  })
  const end = pts[pts.length - 1]
  const showRef = kind !== 'linear'

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 150"
        role="img"
        aria-label={`Graph of ${fam.label}: steps against input size n${showRef ? ', with a dashed straight line for O(n) to compare' : ''}. ${fam.caption}.`}
      >
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--border)" />
        <line x1={left} y1={top} x2={left} y2={bottom} stroke="var(--border)" />
        <text x={(left + right) / 2} y="132" fontSize="8" textAnchor="middle" fill="var(--text)">input size n →</text>
        <text x="9" y={(top + bottom) / 2} fontSize="8" textAnchor="middle" fill="var(--text)" transform={`rotate(-90 9 ${(top + bottom) / 2})`}>steps</text>

        {showRef && (
          <g>
            <line x1={px(1)} y1={py(1)} x2={px(fam.maxN)} y2={py(fam.maxN)} stroke="var(--border)" strokeDasharray="4 3" strokeWidth="1.5" />
            <text x={px(fam.maxN) - 2} y={py(fam.maxN) - 4} fontSize="8" textAnchor="end" fill="var(--text)">n</text>
          </g>
        )}

        <polyline
          points={pts.map((p) => `${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ')}
          fill="none"
          stroke={fam.color}
          strokeWidth="2.5"
        />
        {fam.step && pts.map((p, i) => <circle key={i} cx={p.px} cy={p.py} r="2.5" fill={fam.color} />)}
        <circle cx={end.px} cy={end.py} r="3.5" fill={fam.color} />
        <text x={Math.min(end.px, 276)} y={Math.max(end.py - 7, 11)} fontSize="9" fontWeight="600" textAnchor="end" fill={fam.color}>{fam.label}</text>

        <text x="150" y="146" fontSize="9" textAnchor="middle" fill="var(--text-h)">{fam.caption}</text>
      </svg>
    </div>
  )
}

export { GrowthChartVisual, RuntimeGraphVisual }
