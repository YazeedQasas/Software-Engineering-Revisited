function MemoryLayoutVisual() {
  const values = ['12', '7', '45', '3', '90', '21']
  const addresses = [100, 104, 108, 112, 116, 120]
  const highlightIndex = 3

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Row of six boxes representing contiguous array memory, each labeled with its index and memory address. Index 3 is highlighted to show it can be jumped to directly."
      >
        {values.map((value, i) => {
          const x = 15 + i * 46
          const isHighlighted = i === highlightIndex
          return (
            <g key={i}>
              <text x={x + 20} y={28} fontSize="9" textAnchor="middle" fill="var(--text)">
                {i}
              </text>
              <rect
                x={x}
                y={35}
                width="40"
                height="40"
                rx="4"
                fill={isHighlighted ? 'var(--accent-bg)' : 'var(--bg)'}
                stroke={isHighlighted ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={isHighlighted ? '2' : '1'}
              />
              <text
                x={x + 20}
                y={60}
                fontSize="13"
                textAnchor="middle"
                fill={isHighlighted ? 'var(--accent)' : 'var(--text-h)'}
                fontWeight={isHighlighted ? '700' : '400'}
              >
                {value}
              </text>
              <text x={x + 20} y={92} fontSize="9" textAnchor="middle" fill="var(--text)">
                {addresses[i]}
              </text>
            </g>
          )
        })}
        <text x="150" y="112" fontSize="10" textAnchor="middle" fill="var(--text)">
          address = 100 + (3 × 4) = 112
        </text>
      </svg>
    </div>
  )
}

function ShiftVisual() {
  const before = ['1', '2', '3', '4', '5']
  const after = ['99', '1', '2', '3', '4', '5']
  const x = (i) => 15 + i * 46

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 150"
        role="img"
        aria-label="An array of five items shown before and after inserting 99 at index 0. Every original item moves one slot to the right."
      >
        <defs>
          <marker id="arr-shift-head" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--accent)" />
          </marker>
        </defs>

        <text x="15" y="14" fontSize="9" fill="var(--text)">before</text>
        {before.map((value, i) => (
          <g key={`b${i}`}>
            <rect x={x(i)} y={20} width="40" height="30" rx="4" fill="var(--bg)" stroke="var(--border)" />
            <text x={x(i) + 20} y={40} fontSize="12" textAnchor="middle" fill="var(--text-h)">
              {value}
            </text>
            <line
              x1={x(i) + 20}
              y1={52}
              x2={x(i + 1) + 20}
              y2={88}
              stroke="var(--accent)"
              strokeWidth="1.2"
              markerEnd="url(#arr-shift-head)"
            />
          </g>
        ))}

        <text x="15" y="84" fontSize="9" fill="var(--text)">after insert(0, 99)</text>
        {after.map((value, i) => {
          const isNew = i === 0
          return (
            <g key={`a${i}`}>
              <rect
                x={x(i)}
                y={92}
                width="40"
                height="30"
                rx="4"
                fill={isNew ? 'var(--accent-bg)' : 'var(--bg)'}
                stroke={isNew ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={isNew ? '2' : '1'}
              />
              <text
                x={x(i) + 20}
                y={112}
                fontSize="12"
                textAnchor="middle"
                fill={isNew ? 'var(--accent)' : 'var(--text-h)'}
                fontWeight={isNew ? '700' : '400'}
              >
                {value}
              </text>
            </g>
          )
        })}
        <text x="150" y="142" fontSize="10" textAnchor="middle" fill="var(--text)">
          every old item moved one slot right
        </text>
      </svg>
    </div>
  )
}

export { MemoryLayoutVisual, ShiftVisual }
