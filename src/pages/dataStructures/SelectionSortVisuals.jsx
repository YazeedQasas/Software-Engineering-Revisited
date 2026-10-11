function MovesVisual() {
  const rows = [
    { label: 'bubble sort', moves: 15, note: '15 swaps', color: 'var(--margin-line)' },
    { label: 'insertion sort', moves: 15, note: '15 shifts', color: 'var(--margin-line)' },
    { label: 'selection sort', moves: 3, note: '3 swaps', color: 'var(--success)' },
  ]
  const unit = 11

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 140"
        role="img"
        aria-label="How many times items get moved when sorting a backwards list of 6. Bubble sort makes 15 swaps, insertion sort makes 15 shifts, and selection sort makes only 3 swaps, because it places each item directly into its final spot. Selection sort still makes 15 comparisons."
      >
        {rows.map((r, i) => (
          <g key={r.label}>
            <text x="8" y={24 + i * 30} fontSize="9" fill="var(--text)">{r.label}</text>
            <rect x="82" y={12 + i * 30} width={r.moves * unit} height="16" rx="2" fill="var(--bg)" stroke={r.color} strokeWidth="1.5" />
            <text x={82 + r.moves * unit + 6} y={24 + i * 30} fontSize="9" fill="var(--text-h)">{r.note}</text>
          </g>
        ))}
        <text x="150" y="112" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
          at most n−1 swaps, one per pass
        </text>
        <text x="150" y="126" fontSize="9" textAnchor="middle" fill="var(--text)">
          but still n(n−1)/2 comparisons: O(n²)
        </text>
      </svg>
      <ul className="visual-legend">
        <li>moving items on a backwards list of 6</li>
      </ul>
    </div>
  )
}

export { MovesVisual }
