function Node({ x, y, value, w = 56, h = 32, highlight }) {
  const split = x + w * 0.58
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={highlight ? 'var(--accent-bg)' : 'var(--bg)'} stroke={highlight ? 'var(--accent)' : 'var(--border)'} strokeWidth={highlight ? '2' : '1'} />
      <line x1={split} y1={y} x2={split} y2={y + h} stroke={highlight ? 'var(--accent)' : 'var(--border)'} />
      <text x={x + (split - x) / 2} y={y + h / 2 + 4} fontSize="13" textAnchor="middle" fill="var(--text-h)">{value}</text>
    </g>
  )
}

function LinkedListVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Three nodes scattered at different positions, each holding a value and a pointer to the next node's location, ending in None -- unlike an array, the nodes are not stored next to each other in memory."
      >
        <Node x={10} y={35} value={4} />
        <Node x={130} y={10} value={9} />
        <Node x={226} y={58} value={2} />

        <line x1="53" y1="51" x2="130" y2="26" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="130" cy="26" r="3" fill="var(--accent)" />

        <line x1="173" y1="26" x2="226" y2="74" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="226" cy="74" r="3" fill="var(--accent)" />

        <line x1="269" y1="74" x2="269" y2="98" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="269" cy="98" r="3" fill="var(--accent)" />
        <text x="269" y="112" fontSize="9" textAnchor="middle" fill="var(--text)">None</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} /> value | next</li>
        <li>nodes live wherever the allocator put them &mdash; only the pointers connect them</li>
      </ul>
    </div>
  )
}

function WalkVisual() {
  const xs = [10, 80, 150, 220]
  const values = [4, 9, 2, 7]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 100"
        role="img"
        aria-label="A four-node linked list. To reach the fourth node you start at head and follow three next pointers, one hop at a time."
      >
        <text x="38" y="20" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">head</text>
        <polygon points="33,24 43,24 38,32" fill="var(--accent)" />
        {xs.map((x, i) => (
          <Node key={i} x={x} y={40} value={values[i]} highlight={i === 3} />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line x1={xs[i] + 56} y1="56" x2={xs[i + 1]} y2="56" stroke="var(--accent)" strokeWidth="2" />
            <circle cx={xs[i + 1]} cy="56" r="3" fill="var(--accent)" />
            <text x={xs[i] + 63} y="86" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">
              hop {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <ul className="visual-legend">
        <li>no jumping &mdash; every hop follows one <code>next</code> pointer</li>
      </ul>
    </div>
  )
}

function InsertDeleteVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="Inserting a new node X between A and B by rewiring two pointers -- A and B never move, unlike an array where everything after the insertion point has to shift."
      >
        <Node x={10} y={25} value="A" w={42} h={28} />
        <Node x={225} y={25} value="B" w={42} h={28} />

        <g className="anim-reveal" style={{ animationDelay: '0.4s' }}>
          <Node x={117} y={25} value="X" w={42} h={28} highlight />
        </g>

        <line x1="52" y1="39" x2="117" y2="39" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="117" cy="39" r="3" fill="var(--accent)" />
        <line x1="159" y1="39" x2="225" y2="39" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="225" cy="39" r="3" fill="var(--accent)" />
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> new node</li>
        <li>O(1) &mdash; two pointers change, nothing shifts</li>
      </ul>
    </div>
  )
}

function SinglyVsDoublyVisual() {
  const xs = [70, 140, 210]
  const row = (y, label) => (
    <g>
      <text x="10" y={y + 17} fontSize="10" fontWeight="600" fill="var(--text)">{label}</text>
      {xs.map((x, i) => (
        <rect key={i} x={x} y={y} width="40" height="26" rx="3" fill="var(--bg)" stroke="var(--border)" />
      ))}
    </g>
  )

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 180"
        role="img"
        aria-label="Three rows of three nodes. Singly linked: forward pointers only, ending in None. Doubly linked: forward and backward pointers. Circular: forward pointers, with the last node pointing back to the first."
      >
        {row(12, 'singly')}
        <line x1="110" y1="25" x2="140" y2="25" stroke="var(--accent)" strokeWidth="2" />
        <line x1="180" y1="25" x2="210" y2="25" stroke="var(--accent)" strokeWidth="2" />
        <line x1="250" y1="25" x2="262" y2="25" stroke="var(--accent)" strokeWidth="2" />
        <text x="266" y="29" fontSize="9" fill="var(--text)">None</text>

        {row(62, 'doubly')}
        <line x1="110" y1="70" x2="140" y2="70" stroke="var(--accent)" strokeWidth="2" />
        <line x1="180" y1="70" x2="210" y2="70" stroke="var(--accent)" strokeWidth="2" />
        <line x1="140" y1="80" x2="110" y2="80" stroke="var(--margin-line)" strokeWidth="2" />
        <line x1="210" y1="80" x2="180" y2="80" stroke="var(--margin-line)" strokeWidth="2" />

        {row(112, 'circular')}
        <line x1="110" y1="125" x2="140" y2="125" stroke="var(--accent)" strokeWidth="2" />
        <line x1="180" y1="125" x2="210" y2="125" stroke="var(--accent)" strokeWidth="2" />
        <path d="M230,138 Q140,176 90,138" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="90" cy="138" r="3" fill="var(--accent)" />
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> next pointer</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> prev pointer (doubly only)</li>
        <li>circular: the last node points back to the first instead of <code>None</code></li>
      </ul>
    </div>
  )
}

export { LinkedListVisual, WalkVisual, InsertDeleteVisual, SinglyVsDoublyVisual }
