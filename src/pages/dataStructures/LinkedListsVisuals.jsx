import './LinkedListsVisuals.css'

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

function SinglyVsDoublyVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 100"
        role="img"
        aria-label="Singly linked list with one forward pointer per node, compared to a doubly linked list with both a forward and a backward pointer per node."
      >
        <text x="62" y="14" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text)">singly</text>
        {[10, 50, 90].map((x, i) => (
          <rect key={i} x={x} y="30" width="30" height="24" rx="3" fill="var(--bg)" stroke="var(--border)" />
        ))}
        <line x1="40" y1="42" x2="50" y2="42" stroke="var(--accent)" strokeWidth="2" />
        <line x1="80" y1="42" x2="90" y2="42" stroke="var(--accent)" strokeWidth="2" />
        <line x1="120" y1="42" x2="132" y2="42" stroke="var(--accent)" strokeWidth="2" />
        <text x="138" y="46" fontSize="8" fill="var(--text)">None</text>

        <text x="228" y="14" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text)">doubly</text>
        {[170, 210, 250].map((x, i) => (
          <rect key={i} x={x} y="30" width="30" height="24" rx="3" fill="var(--bg)" stroke="var(--border)" />
        ))}
        <line x1="200" y1="37" x2="210" y2="37" stroke="var(--accent)" strokeWidth="2" />
        <line x1="240" y1="37" x2="250" y2="37" stroke="var(--accent)" strokeWidth="2" />
        <line x1="210" y1="48" x2="200" y2="48" stroke="var(--margin-line)" strokeWidth="2" />
        <line x1="250" y1="48" x2="240" y2="48" stroke="var(--margin-line)" strokeWidth="2" />
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> next pointer</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> prev pointer (doubly only)</li>
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
        <line x1="221" y1="39" x2="296" y2="39" stroke="var(--border)" strokeDasharray="3 3" opacity="0" />

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

function ReversalVisual() {
  const frame = (nodes, arrows, noneSide, label, x0) => (
    <g>
      {nodes.map((v, i) => (
        <g key={i}>
          <rect x={x0 + i * 20} y="18" width="16" height="16" rx="2" fill="var(--bg)" stroke="var(--border)" />
          <text x={x0 + i * 20 + 8} y="30" fontSize="9" textAnchor="middle" fill="var(--text-h)">{v}</text>
        </g>
      ))}
      {arrows.map(([from, to], i) => {
        const x1 = x0 + from * 20 + (from < to ? 16 : 0)
        const x2 = x0 + to * 20 + (from < to ? 0 : 16)
        return <line key={i} x1={x1} y1="26" x2={x2} y2="26" stroke="var(--accent)" strokeWidth="1.5" />
      })}
      {noneSide === 'left' && <text x={x0 - 14} y="30" fontSize="7" fill="var(--text)">N</text>}
      {noneSide === 'right' && <text x={x0 + nodes.length * 20 - 4} y="30" fontSize="7" fill="var(--text)">N</text>}
      <text x={x0 + (nodes.length * 20) / 2 - 10} y="46" fontSize="7" textAnchor="middle" fill="var(--text)">{label}</text>
    </g>
  )

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 60"
        role="img"
        aria-label="Three steps of reversing a linked list: links flip one at a time from the front, moving the prev and curr pointers forward until the whole list points the other way."
      >
        {frame([1, 2, 3, 4], [[0, 1], [1, 2], [2, 3]], 'right', 'prev=N curr=1', 6)}

        <g className="anim-reveal" style={{ animationDelay: '0.8s' }}>
          {frame([1, 2, 3, 4], [[1, 0], [1, 2], [2, 3]], 'left', 'prev=1 curr=2', 108)}
        </g>

        <g className="anim-reveal" style={{ animationDelay: '1.8s' }}>
          {frame([1, 2, 3, 4], [[1, 0], [2, 1], [2, 3]], 'left', 'prev=2 curr=3', 210)}
        </g>
      </svg>
      <ul className="visual-legend">
        <li>each step: save next, point curr back at prev, advance both</li>
      </ul>
    </div>
  )
}

function CycleDetectionVisual() {
  const xs = [15, 55, 95, 135, 175]
  const values = [1, 2, 3, 4, 5]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 110"
        role="img"
        aria-label="A linked list where node 5 points back to node 3, forming a cycle. A slow pointer moving one step at a time and a fast pointer moving two steps at a time eventually land on the same node."
      >
        {values.map((v, i) => (
          <g key={i}>
            <rect x={xs[i]} y="20" width="30" height="26" rx="3" fill="var(--bg)" stroke="var(--border)" />
            <text x={xs[i] + 15} y="38" fontSize="12" textAnchor="middle" fill="var(--text-h)">{v}</text>
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={xs[i] + 30} y1="33" x2={xs[i + 1]} y2="33" stroke="var(--border)" strokeWidth="1.5" />
        ))}
        <path d="M190,46 Q152,78 110,46" fill="none" stroke="var(--border)" strokeWidth="1.5" />

        <g className="anim-slow-ptr">
          <polygon points="18,64 28,64 23,54" fill="var(--accent)" />
          <text x="23" y="76" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--accent)">S</text>
        </g>
        <g className="anim-fast-ptr">
          <polygon points="18,90 28,90 23,80" fill="var(--margin-line)" />
          <text x="23" y="102" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--margin-line)">F</text>
        </g>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> slow (1 step)</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> fast (2 steps) &mdash; they meet &#8594; cycle</li>
      </ul>
    </div>
  )
}

function MergeVisual() {
  const a = [1, 3, 5]
  const b = [2, 4, 6]
  const merged = [
    { v: 1, from: 'a' }, { v: 2, from: 'b' }, { v: 3, from: 'a' },
    { v: 4, from: 'b' }, { v: 5, from: 'a' }, { v: 6, from: 'b' },
  ]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Two sorted lists, 1-3-5 and 2-4-6, merging into a single sorted list 1-2-3-4-5-6 by always picking whichever current head is smaller."
      >
        <text x="4" y="16" fontSize="9" fill="var(--text)">A</text>
        {a.map((v, i) => (
          <g key={i}>
            <rect x={24 + i * 44} y="4" width="34" height="24" rx="3" fill="var(--bg)" stroke="var(--accent)" />
            <text x={41 + i * 44} y="20" fontSize="12" textAnchor="middle" fill="var(--accent)">{v}</text>
          </g>
        ))}

        <text x="4" y="50" fontSize="9" fill="var(--text)">B</text>
        {b.map((v, i) => (
          <g key={i}>
            <rect x={24 + i * 44} y="38" width="34" height="24" rx="3" fill="var(--bg)" stroke="var(--margin-line)" />
            <text x={41 + i * 44} y="54" fontSize="12" textAnchor="middle" fill="var(--margin-line)">{v}</text>
          </g>
        ))}

        <text x="4" y="98" fontSize="9" fill="var(--text)">=</text>
        {merged.map((m, i) => (
          <g key={i} className="anim-reveal" style={{ animationDelay: `${i * 0.35}s` }}>
            <rect
              x={20 + i * 44}
              y="82"
              width="34"
              height="24"
              rx="3"
              fill={m.from === 'a' ? 'var(--accent-bg)' : 'var(--code-bg)'}
              stroke={m.from === 'a' ? 'var(--accent)' : 'var(--margin-line)'}
            />
            <text x={37 + i * 44} y="98" fontSize="12" textAnchor="middle" fill="var(--text-h)">{m.v}</text>
          </g>
        ))}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> taken from A</li>
        <li><span className="swatch" style={{ background: 'var(--code-bg)', border: '1px solid var(--margin-line)' }} /> taken from B</li>
      </ul>
    </div>
  )
}

export {
  LinkedListVisual,
  SinglyVsDoublyVisual,
  InsertDeleteVisual,
  ReversalVisual,
  CycleDetectionVisual,
  MergeVisual,
}
