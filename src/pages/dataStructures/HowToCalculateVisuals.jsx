function LoopGridVisual() {
  const size = 6
  const cell = 14
  const grid = (x0, y0, triangle) =>
    Array.from({ length: size * size }).map((_, k) => {
      const row = Math.floor(k / size)
      const col = k % size
      const counted = triangle ? col < row : true
      return (
        <rect
          key={`${x0}-${k}`}
          x={x0 + col * cell}
          y={y0 + row * cell}
          width={cell - 1}
          height={cell - 1}
          rx="2"
          fill={counted ? 'var(--accent-bg)' : 'var(--bg)'}
          stroke={counted ? 'var(--accent)' : 'var(--border)'}
        />
      )
    })

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 150"
        role="img"
        aria-label="Two six by six grids where each square is one run of the inner loop. Left: both loops run n times, so every square is counted, n times n. Right: the inner loop runs only up to the outer index, so only the squares below the diagonal are counted, about half, which is still on the order of n squared."
      >
        <text x="62" y="14" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text-h)">j in range(n)</text>
        {grid(20, 24, false)}
        <text x="62" y="128" fontSize="9" textAnchor="middle" fill="var(--text)">n × n squares</text>
        <text x="62" y="141" fontSize="9" textAnchor="middle" fill="var(--accent)">O(n²)</text>

        <text x="232" y="14" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text-h)">j in range(i)</text>
        {grid(190, 24, true)}
        <text x="232" y="128" fontSize="9" textAnchor="middle" fill="var(--text)">about half the squares</text>
        <text x="232" y="141" fontSize="9" textAnchor="middle" fill="var(--accent)">still O(n²)</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> one run of the inner loop</li>
        <li>half of n² is still n² once constants are dropped</li>
      </ul>
    </div>
  )
}

function HalvingVisual() {
  const bars = [
    { w: 240, label: 'n' },
    { w: 120, label: 'n/2' },
    { w: 60, label: 'n/4' },
    { w: 30, label: 'n/8' },
    { w: 15, label: '...' },
    { w: 7, label: '1' },
  ]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 150"
        role="img"
        aria-label="A bar representing n items is halved again and again: n, n over 2, n over 4, n over 8, and so on down to 1. The number of bars is the number of steps, which is about log base 2 of n."
      >
        {bars.map((b, i) => (
          <g key={i}>
            <rect
              x="20"
              y={8 + i * 18}
              width={b.w}
              height="13"
              rx="2"
              fill={i === 0 ? 'var(--bg)' : 'var(--accent-bg)'}
              stroke={i === 0 ? 'var(--border)' : 'var(--accent)'}
            />
            <text x={b.w + 28} y={19 + i * 18} fontSize="9" fill="var(--text)">{b.label}</text>
          </g>
        ))}
        <text x="150" y="128" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
          6 steps for n = 64
        </text>
        <text x="150" y="142" fontSize="9" textAnchor="middle" fill="var(--text)">
          halving until 1 takes about log₂ n steps
        </text>
      </svg>
      <ul className="visual-legend">
        <li>double n and you add just one more step</li>
      </ul>
    </div>
  )
}

function RecursionTreeVisual() {
  const levels = [
    { count: 1, label: '8' },
    { count: 2, label: '4' },
    { count: 4, label: '2' },
    { count: 8, label: '1' },
  ]
  const total = 260

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 160"
        role="img"
        aria-label="A recursion tree for merge sort on 8 items. The top level is one piece of 8, then two pieces of 4, four pieces of 2, and eight pieces of 1. Every level handles 8 items in total, and there are about log base 2 of 8, which is 3, levels of splitting, so total work is n times log n."
      >
        {levels.map((lv, i) => {
          const w = total / lv.count
          const y = 8 + i * 30
          return (
            <g key={i}>
              {Array.from({ length: lv.count }).map((_, k) => (
                <g key={k}>
                  <rect
                    x={20 + k * w + 1}
                    y={y}
                    width={w - 2}
                    height="22"
                    rx="3"
                    fill="var(--accent-bg)"
                    stroke="var(--accent)"
                  />
                  <text x={20 + k * w + w / 2} y={y + 15} fontSize="10" textAnchor="middle" fill="var(--text-h)">
                    {lv.label}
                  </text>
                </g>
              ))}
            </g>
          )
        })}
        <text x="150" y="138" fontSize="9" textAnchor="middle" fill="var(--text)">
          every level handles n items in total
        </text>
        <text x="150" y="152" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
          n per level × log n levels = O(n log n)
        </text>
      </svg>
      <ul className="visual-legend">
        <li>each box is one call; the number is the size of its piece</li>
      </ul>
    </div>
  )
}

export { LoopGridVisual, HalvingVisual, RecursionTreeVisual }
