function SplitsVisual() {
  const levels = 4
  const rowH = 24

  // Good pivots: every piece splits into two halves.
  const balanced = []
  for (let lv = 0; lv < 3; lv++) {
    const count = 2 ** lv
    const w = 120 / count
    for (let k = 0; k < count; k++) {
      balanced.push({ x: 12 + k * w, y: 8 + lv * rowH, w: w - 2 })
    }
  }

  // Bad pivots: the pivot splits off one item, leaving nearly everything.
  const lopsided = []
  for (let lv = 0; lv < levels; lv++) {
    const w = 120 - lv * 26
    lopsided.push({ x: 168 + lv * 26, y: 8 + lv * rowH, w: w - 2, pivot: { x: 168 + lv * 26 - 18, y: 8 + lv * rowH } })
  }

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 150"
        role="img"
        aria-label="Left: a good pivot splits each piece into two roughly equal halves, so the pieces get small after only a few levels, about log n. Right: a bad pivot, always the smallest or largest item, peels off just one item per level, so the work stays almost as big at every level and takes about n levels."
      >
        <text x="72" y="104" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--success)">good pivots</text>
        <text x="72" y="117" fontSize="9" textAnchor="middle" fill="var(--text)">halves: log n levels</text>
        {balanced.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height="18" rx="3" fill="var(--success-bg)" stroke="var(--success-border)" />
        ))}

        <text x="228" y="104" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--margin-line)">bad pivots</text>
        <text x="228" y="117" fontSize="9" textAnchor="middle" fill="var(--text)">peel off one: n levels</text>
        {lopsided.map((b, i) => (
          <g key={i}>
            <rect x={b.pivot.x} y={b.pivot.y} width="14" height="18" rx="3" fill="var(--sticky)" stroke="var(--sticky-border)" />
            <rect x={b.x} y={b.y} width={b.w} height="18" rx="3" fill="var(--danger-bg)" stroke="var(--danger-border)" />
          </g>
        ))}

        <text x="150" y="140" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
          the pivot decides: O(n log n) or O(n²)
        </text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--sticky)', border: '1px solid var(--sticky-border)' }} /> the pivot, now in its final place</li>
        <li>each box is a piece still to be sorted</li>
      </ul>
    </div>
  )
}

const CELL = 34
const STEP = 40
const X0 = 12

// One row of the array for a worked example. Props:
//   values: numbers in order, pivot: index shown in yellow (or null),
//   pointers: [{ index, kind: 'left' | 'right', text }],
//   swap: [i, j] draws an arrow between two cells,
//   dividers: [{ after, label }] dashed lines between cells,
//   faded: indices drawn faint, locked: indices drawn green,
//   marked: indices outlined in blue (e.g. just swapped)
function StepRow({ values, pivot = null, pivotText = 'Pivot', pointers = [], swap = null, dividers = [], faded = [], locked = [], marked = [] }) {
  const width = X0 * 2 + values.length * STEP - (STEP - CELL)
  const cx = (i) => X0 + i * STEP + CELL / 2

  return (
    <svg
      viewBox={`0 0 ${width} 132`}
      role="img"
      aria-label={`The list ${values.join(', ')}${pivot !== null ? `, with ${values[pivot]} as the pivot` : ''}.`}
    >
      <defs>
        <marker id="qs-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill="var(--text)" />
        </marker>
      </defs>

      {dividers.map((d) => {
        const x = X0 + (d.after + 1) * STEP - (STEP - CELL) / 2
        return (
          <g key={d.after}>
            <line x1={x} y1="30" x2={x} y2="96" stroke="var(--text)" strokeDasharray="3 3" opacity="0.6" />
            {d.label && <text x={x} y="24" fontSize="9" textAnchor="middle" fill="var(--text)">{d.label}</text>}
          </g>
        )
      })}

      {values.map((v, i) => {
        const isPivot = i === pivot
        const isLocked = locked.includes(i)
        const isMarked = marked.includes(i)
        let fill = 'var(--bg)'
        let stroke = 'var(--border)'
        if (isLocked) {
          fill = 'var(--success-bg)'
          stroke = 'var(--success-border)'
        }
        if (isPivot) {
          fill = 'var(--sticky)'
          stroke = 'var(--sticky-border)'
        }
        if (isMarked) stroke = 'var(--accent)'
        return (
          <g key={i} opacity={faded.includes(i) ? 0.3 : 1}>
            <rect x={X0 + i * STEP} y="40" width={CELL} height="40" rx="4" fill={fill} stroke={stroke} strokeWidth={isMarked || isPivot ? 2 : 1} />
            <text x={cx(i)} y="66" fontSize="17" fontWeight="600" textAnchor="middle" fill="var(--text-h)">{v}</text>
          </g>
        )
      })}

      {pivot !== null && (
        <text x={cx(pivot)} y="102" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--sticky-border)">{pivotText}</text>
      )}

      {pointers.map((p) =>
        p.kind === 'left' ? (
          <g key={p.kind}>
            <polygon points={`${cx(p.index) - 5},92 ${cx(p.index) + 5},92 ${cx(p.index)},84`} fill="var(--accent)" />
            <text x={cx(p.index)} y={pivot === p.index ? 114 : 104} fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">{p.text}</text>
          </g>
        ) : (
          <g key={p.kind}>
            <polygon points={`${cx(p.index) - 5},28 ${cx(p.index) + 5},28 ${cx(p.index)},36`} fill="var(--margin-line)" />
            <text x={cx(p.index)} y="20" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--margin-line)">{p.text}</text>
          </g>
        ),
      )}

      {swap && (
        <path
          d={`M ${cx(swap[0]) + 8} 84 Q ${(cx(swap[0]) + cx(swap[1])) / 2} 126 ${cx(swap[1]) - 8} 84`}
          fill="none"
          stroke="var(--text)"
          strokeWidth="1.5"
          markerStart="url(#qs-arrow)"
          markerEnd="url(#qs-arrow)"
        />
      )}
    </svg>
  )
}

// A card holding one or more rows, each with an optional caption underneath.
function StepVisual({ rows }) {
  return (
    <div className="visual-card">
      {rows.map((row, index) => (
        <div key={index} style={{ marginTop: index === 0 ? 0 : 10 }}>
          <StepRow {...row} />
          {row.caption && <p style={{ fontSize: 12, margin: '2px 0 0', textAlign: 'center' }}>{row.caption}</p>}
        </div>
      ))}
    </div>
  )
}

export { SplitsVisual, StepVisual }
