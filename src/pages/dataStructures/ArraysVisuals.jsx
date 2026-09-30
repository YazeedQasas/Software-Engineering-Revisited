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
              <text x={x + 20} y={88} fontSize="8" textAnchor="middle" fill="var(--text)">
                {addresses[i]}
              </text>
              {isHighlighted && (
                <text x={x + 20} y={18} fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
                  arr[3]
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} /> element</li>
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> base + (3 &times; size) = address 112</li>
      </ul>
    </div>
  )
}

function ResizeVisual() {
  const frames = [
    { capacity: 1, filled: 1 },
    { capacity: 2, filled: 2 },
    { capacity: 4, filled: 4 },
    { capacity: 8, filled: 5 },
  ]
  const box = 14
  const gap = 2
  let cursor = 4
  const positions = frames.map((frame) => {
    const start = cursor
    cursor += frame.capacity * (box + gap) + 20
    return start
  })

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="Four snapshots of a dynamic array's backing storage: capacity 1 full, capacity 2 full, capacity 4 full, capacity 8 with room to spare, each doubling after the previous one filled up."
      >
        {frames.map((frame, fi) => {
          const startX = positions[fi]
          return (
            <g key={fi}>
              {Array.from({ length: frame.capacity }).map((_, bi) => (
                <rect
                  key={bi}
                  x={startX + bi * (box + gap)}
                  y="18"
                  width={box}
                  height={box}
                  rx="2"
                  fill={bi < frame.filled ? 'var(--accent)' : 'var(--bg)'}
                  stroke={bi < frame.filled ? 'var(--accent)' : 'var(--border)'}
                />
              ))}
              <text
                x={startX + (frame.capacity * (box + gap)) / 2 - gap / 2}
                y="48"
                fontSize="9"
                textAnchor="middle"
                fill="var(--text)"
              >
                cap {frame.capacity}
              </text>
              {fi < frames.length - 1 && (
                <text
                  x={startX + frame.capacity * (box + gap) + 8}
                  y="30"
                  fontSize="12"
                  fill="var(--text)"
                >
                  &#8594;
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> used slot</li>
        <li><span className="swatch" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} /> spare capacity</li>
      </ul>
    </div>
  )
}

function ShiftVisual() {
  const before = ['A', 'B', 'C', 'D', 'E']
  const after = ['X', 'A', 'B', 'C', 'D', 'E']

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Before and after rows showing that inserting a new element X at the start of an array shifts every existing element one position to the right."
      >
        <text x="4" y="37" fontSize="9" fill="var(--text)">before</text>
        {before.map((label, i) => {
          const x = 48 + i * 34
          return (
            <g key={i}>
              <rect x={x} y="20" width="28" height="26" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 14} y="37" fontSize="12" textAnchor="middle" fill="var(--text-h)">{label}</text>
            </g>
          )
        })}

        <text x="62" y="70" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--accent)">insert</text>

        <text x="4" y="97" fontSize="9" fill="var(--text)">after</text>
        {after.map((label, i) => {
          const x = 48 + i * 34
          const isNew = i === 0
          return (
            <g key={i}>
              <rect
                x={x}
                y="80"
                width="28"
                height="26"
                rx="3"
                fill={isNew ? 'var(--accent-bg)' : 'var(--bg)'}
                stroke={isNew ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={isNew ? '2' : '1'}
              />
              <text
                x={x + 14}
                y="97"
                fontSize="12"
                textAnchor="middle"
                fill={isNew ? 'var(--accent)' : 'var(--text-h)'}
                fontWeight={isNew ? '700' : '400'}
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> new element</li>
        <li>everything after it shifts one slot right</li>
      </ul>
    </div>
  )
}

function TwoPointersVisual() {
  const values = [1, 3, 5, 7, 9, 11, 13]
  const left = 2
  const right = 6

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="Sorted array with a left pointer at index 2 and a right pointer at index 6, whose values sum to the target, illustrating the two-pointer technique."
      >
        <text x="150" y="12" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">
          5 + 13 = 18 (target)
        </text>
        {values.map((value, i) => {
          const x = 12 + i * 38
          const isLeft = i === left
          const isRight = i === right
          const active = isLeft || isRight
          const color = isLeft ? 'var(--accent)' : isRight ? 'var(--margin-line)' : 'var(--border)'
          return (
            <g key={i}>
              <rect
                x={x}
                y="20"
                width="34"
                height="30"
                rx="3"
                fill={active ? 'var(--code-bg)' : 'var(--bg)'}
                stroke={color}
                strokeWidth={active ? '2' : '1'}
              />
              <text x={x + 17} y="39" fontSize="13" textAnchor="middle" fill="var(--text-h)">{value}</text>
              {isLeft && (
                <>
                  <polygon points={`${x + 12},64 ${x + 22},64 ${x + 17},54`} fill="var(--accent)" />
                  <text x={x + 17} y="76" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">L</text>
                </>
              )}
              {isRight && (
                <>
                  <polygon points={`${x + 12},64 ${x + 22},64 ${x + 17},54`} fill="var(--margin-line)" />
                  <text x={x + 17} y="76" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--margin-line)">R</text>
                </>
              )}
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> left pointer</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> right pointer</li>
      </ul>
    </div>
  )
}

function SlidingWindowVisual() {
  const values = [4, 2, 7, 1, 5, 3, 6]
  const box = 34
  const gap = 4
  const step = box + gap

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 100"
        role="img"
        aria-label="Array with a window of three elements highlighted at one position, and a dashed outline showing the window after sliding one step to the right."
      >
        <text x="150" y="14" fontSize="9" fill="var(--text)" textAnchor="middle">slide &#8594;</text>

        <rect x="8" y="26" width={step * 3 - gap + 8} height="44" rx="6" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
        <rect x="46" y="26" width={step * 3 - gap + 8} height="44" rx="6" fill="none" stroke="var(--margin-line)" strokeWidth="2" strokeDasharray="5 3" />

        {values.map((value, i) => {
          const x = 12 + i * step
          return (
            <g key={i}>
              <rect x={x} y="35" width={box} height="30" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + box / 2} y="54" fontSize="13" textAnchor="middle" fill="var(--text-h)">{value}</text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> window (start)</li>
        <li><span className="swatch" style={{ background: 'none', border: '1px dashed var(--margin-line)' }} /> window (next)</li>
      </ul>
    </div>
  )
}

function PrefixSumVisual() {
  const values = [3, 1, 4, 1, 5, 2]
  const prefix = [3, 4, 8, 9, 14, 16]
  const box = 30
  const gap = 4
  const step = box + gap

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Array row on top and its running prefix-sum row below, showing that the sum of a range can be read off as the difference of two prefix sums."
      >
        <text x="4" y="37" fontSize="9" fill="var(--text)">array</text>
        {values.map((value, i) => {
          const x = 45 + i * step
          const inRange = i >= 2 && i <= 4
          return (
            <g key={i}>
              <rect
                x={x}
                y="20"
                width={box}
                height="26"
                rx="3"
                fill={inRange ? 'var(--accent-bg)' : 'var(--bg)'}
                stroke={inRange ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={inRange ? '2' : '1'}
              />
              <text x={x + box / 2} y="37" fontSize="12" textAnchor="middle" fill="var(--text-h)">{value}</text>
            </g>
          )
        })}

        <text x="4" y="92" fontSize="9" fill="var(--text)">prefix</text>
        {prefix.map((value, i) => {
          const x = 45 + i * step
          const isBoundary = i === 1 || i === 4
          return (
            <g key={i}>
              <rect
                x={x}
                y="75"
                width={box}
                height="26"
                rx="3"
                fill={isBoundary ? 'var(--code-bg)' : 'var(--bg)'}
                stroke={isBoundary ? 'var(--margin-line)' : 'var(--border)'}
                strokeWidth={isBoundary ? '2' : '1'}
              />
              <text x={x + box / 2} y="92" fontSize="12" textAnchor="middle" fill="var(--text-h)">{value}</text>
            </g>
          )
        })}

        <text x="150" y="115" fontSize="9" textAnchor="middle" fill="var(--text-h)">
          sum(2..4) = 14 &minus; 4 = 10
        </text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> range to sum</li>
        <li><span className="swatch" style={{ background: 'var(--code-bg)', border: '1px solid var(--margin-line)' }} /> prefix values used</li>
      </ul>
    </div>
  )
}

export {
  MemoryLayoutVisual,
  ResizeVisual,
  ShiftVisual,
  TwoPointersVisual,
  SlidingWindowVisual,
  PrefixSumVisual,
}
