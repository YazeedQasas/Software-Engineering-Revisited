function ComparisonsVisual() {
  const n = 6
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 140"
        role="img"
        aria-label="For a list of 6 items, bubble sort makes 5 comparisons in the first pass, 4 in the second, then 3, 2 and 1. The bars shrink like a staircase, and the total is n times n minus 1 over 2, which grows as n squared."
      >
        {Array.from({ length: n - 1 }).map((_, i) => {
          const count = n - 1 - i
          return (
            <g key={i}>
              <text x="8" y={22 + i * 20} fontSize="9" fill="var(--text)">pass {i + 1}</text>
              <rect x="52" y={10 + i * 20} width={count * 38} height="15" rx="2" fill="var(--accent-bg)" stroke="var(--accent)" />
              <text x={52 + count * 38 + 6} y={22 + i * 20} fontSize="9" fill="var(--text-h)">{count}</text>
            </g>
          )
        })}
        <text x="150" y="124" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
          (n−1) + (n−2) + … + 1 = n(n−1)/2
        </text>
        <text x="150" y="136" fontSize="9" textAnchor="middle" fill="var(--text)">a staircase of work: O(n²)</text>
      </svg>
      <ul className="visual-legend">
        <li>every pass is one shorter, but there are still about n of them</li>
      </ul>
    </div>
  )
}

export { ComparisonsVisual }
