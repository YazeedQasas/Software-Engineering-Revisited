function HeapShapeVisual() {
  const values = [9, 5, 8, 1, 3, 2, 7]
  const width = 300
  const highlightParent = 1
  const highlightChildren = [3, 4]

  const place = (i) => {
    const level = Math.floor(Math.log2(i + 1))
    const slots = 2 ** level
    return { x: ((i - (slots - 1) + 0.5) / slots) * width, y: 92 + level * 38 }
  }
  const isHot = (i) => i === highlightParent || highlightChildren.includes(i)

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 200"
        role="img"
        aria-label="The list 9, 5, 8, 1, 3, 2, 7 shown twice: as a row of seven boxes numbered 0 to 6, and as a binary tree. Position 0 is the top, positions 1 and 2 are its children, 3 and 4 are the children of position 1, and 5 and 6 are the children of position 2. Every parent is bigger than its children, which makes it a max-heap."
      >
        {values.map((v, i) => (
          <g key={`a${i}`}>
            <rect
              x={8 + i * 40}
              y="8"
              width="34"
              height="30"
              rx="4"
              fill={isHot(i) ? 'var(--accent-bg)' : 'var(--bg)'}
              stroke={isHot(i) ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={isHot(i) ? 2 : 1}
            />
            <text x={8 + i * 40 + 17} y="29" fontSize="14" fontWeight="600" textAnchor="middle" fill="var(--text-h)">{v}</text>
            <text x={8 + i * 40 + 17} y="52" fontSize="9" textAnchor="middle" fill="var(--text)">{i}</text>
          </g>
        ))}

        <text x="8" y="72" fontSize="9" fill="var(--text)">the same list, drawn as a tree:</text>

        {values.map((_, i) => {
          if (i === 0) return null
          const parent = place((i - 1) >> 1)
          const child = place(i)
          return <line key={`e${i}`} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke="var(--border)" strokeWidth="1.5" />
        })}
        {values.map((v, i) => {
          const { x, y } = place(i)
          return (
            <g key={`n${i}`}>
              <circle cx={x} cy={y} r="15" fill={isHot(i) ? 'var(--accent-bg)' : 'var(--bg)'} stroke={isHot(i) ? 'var(--accent)' : 'var(--border)'} strokeWidth={isHot(i) ? 2 : 1} />
              <text x={x} y={y + 5} fontSize="13" fontWeight="600" textAnchor="middle" fill="var(--text-h)">{v}</text>
              <text x={x + 21} y={y + 3} fontSize="8" fill="var(--text)">{i}</text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> position 1 and its children, 3 and 4</li>
        <li>children of i: 2i + 1 and 2i + 2; parent: (i − 1) // 2</li>
      </ul>
    </div>
  )
}

// One row of a worked example: the list as boxes, and (optionally) the first
// `size` items as the heap tree. Items at position `size` or later are
// already sorted and drawn green. `hot` outlines items in blue, `swapped`
// colors them yellow.
function HeapStepRow({ values, size = values.length, hot = [], swapped = [], showTree = true }) {
  const width = 300
  const rowH = 38
  const levels = Math.floor(Math.log2(values.length)) + 1
  const treeTop = 66
  const height = showTree ? treeTop + levels * rowH - 8 : 56
  const place = (i) => {
    const level = Math.floor(Math.log2(i + 1))
    const slots = 2 ** level
    return { x: ((i - (slots - 1) + 0.5) / slots) * width, y: treeTop + level * rowH - 20 }
  }
  const look = (i) => {
    if (swapped.includes(i)) return { fill: 'var(--sticky)', stroke: 'var(--sticky-border)', w: 2 }
    if (hot.includes(i)) return { fill: 'var(--accent-bg)', stroke: 'var(--accent)', w: 2 }
    if (i >= size) return { fill: 'var(--success-bg)', stroke: 'var(--success-border)', w: 1 }
    return { fill: 'var(--bg)', stroke: 'var(--border)', w: 1 }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`The list ${values.slice(0, size).join(', ')}${size < values.length ? `, then the sorted items ${values.slice(size).join(', ')}` : ''}.`}
    >
      {values.map((v, i) => {
        const { fill, stroke, w } = look(i)
        return (
          <g key={`a${i}`}>
            <rect x={8 + i * 40} y="6" width="34" height="30" rx="4" fill={fill} stroke={stroke} strokeWidth={w} />
            <text x={8 + i * 40 + 17} y="27" fontSize="14" fontWeight="600" textAnchor="middle" fill="var(--text-h)">{v}</text>
            <text x={8 + i * 40 + 17} y="48" fontSize="9" textAnchor="middle" fill="var(--text)">{i}</text>
          </g>
        )
      })}
      {showTree && values.slice(0, size).map((_, i) => {
        if (i === 0) return null
        const parent = place((i - 1) >> 1)
        const child = place(i)
        return <line key={`e${i}`} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke="var(--border)" strokeWidth="1.5" />
      })}
      {showTree && values.slice(0, size).map((v, i) => {
        const { x, y } = place(i)
        const { fill, stroke, w } = look(i)
        return (
          <g key={`n${i}`}>
            <circle cx={x} cy={y} r="15" fill={fill} stroke={stroke} strokeWidth={w} />
            <text x={x} y={y + 5} fontSize="13" fontWeight="600" textAnchor="middle" fill="var(--text-h)">{v}</text>
          </g>
        )
      })}
    </svg>
  )
}

// A card holding one or more rows, each with an optional caption underneath.
function HeapStepVisual({ rows }) {
  return (
    <div className="visual-card">
      {rows.map((row, index) => (
        <div key={index} style={{ marginTop: index === 0 ? 0 : 12 }}>
          <HeapStepRow {...row} />
          {row.caption && <p style={{ fontSize: 12, margin: '2px 0 0', textAlign: 'center' }}>{row.caption}</p>}
        </div>
      ))}
    </div>
  )
}

export { HeapShapeVisual, HeapStepVisual }
