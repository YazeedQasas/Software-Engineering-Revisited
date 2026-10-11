function ShiftsVisual() {
  const rows = [
    { label: 'already sorted', shifts: 0, note: '0 shifts', color: 'var(--success)' },
    { label: 'random order', shifts: 7.5, note: 'about 7 or 8', color: 'var(--accent)' },
    { label: 'backwards', shifts: 15, note: '15 shifts', color: 'var(--margin-line)' },
  ]
  const unit = 12

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 130"
        role="img"
        aria-label="How many times insertion sort shifts an item on a list of 6. An already sorted list needs 0 shifts, a random list needs about 7 or 8, and a backwards list needs 15, which is n times n minus 1 over 2. More out of order means more shifts."
      >
        {rows.map((r, i) => (
          <g key={r.label}>
            <text x="8" y={24 + i * 30} fontSize="9" fill="var(--text)">{r.label}</text>
            <rect x="90" y={12 + i * 30} width={Math.max(r.shifts * unit, 2)} height="16" rx="2" fill="var(--bg)" stroke={r.color} strokeWidth="1.5" />
            <text x={90 + Math.max(r.shifts * unit, 2) + 6} y={24 + i * 30} fontSize="9" fill="var(--text-h)">{r.note}</text>
          </g>
        ))}
        <text x="150" y="108" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
          shifts = how far items are from their place
        </text>
        <text x="150" y="122" fontSize="9" textAnchor="middle" fill="var(--text)">
          worst case n(n−1)/2 → O(n²)
        </text>
      </svg>
      <ul className="visual-legend">
        <li>for a list of 6 items</li>
      </ul>
    </div>
  )
}

export { ShiftsVisual }
