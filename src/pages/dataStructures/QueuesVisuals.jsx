function QueueLinkedVisual() {
  const xs = [14, 104, 194]
  const values = [1, 2, 3]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 100"
        role="img"
        aria-label="A queue built from a linked list. A front pointer marks the first node, where items leave, and a back pointer marks the last node, where new items join."
      >
        {xs.map((x, i) => {
          const split = x + 56 * 0.58
          return (
            <g key={i}>
              <rect x={x} y="30" width="56" height="32" rx="4" fill="var(--bg)" stroke="var(--border)" />
              <line x1={split} y1="30" x2={split} y2="62" stroke="var(--border)" />
              <text x={x + (split - x) / 2} y="50" fontSize="13" textAnchor="middle" fill="var(--text-h)">{values[i]}</text>
            </g>
          )
        })}
        {[0, 1].map((i) => (
          <g key={i}>
            <line x1={xs[i] + 56} y1="46" x2={xs[i + 1]} y2="46" stroke="var(--accent)" strokeWidth="2" />
            <circle cx={xs[i + 1]} cy="46" r="3" fill="var(--accent)" />
          </g>
        ))}
        <line x1="250" y1="46" x2="270" y2="46" stroke="var(--accent)" strokeWidth="2" />
        <text x="274" y="50" fontSize="9" fill="var(--text)">None</text>

        <polygon points="37,24 47,24 42,32" fill="var(--accent)" />
        <text x="42" y="18" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">front</text>
        <text x="42" y="82" fontSize="9" textAnchor="middle" fill="var(--text)">dequeue here</text>

        <polygon points="217,24 227,24 222,32" fill="var(--margin-line)" />
        <text x="222" y="18" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--margin-line)">back</text>
        <text x="222" y="82" fontSize="9" textAnchor="middle" fill="var(--text)">enqueue here</text>
      </svg>
      <ul className="visual-legend">
        <li>two pointers, one per end, so both ends are <code>O(1)</code></li>
      </ul>
    </div>
  )
}

function PriorityVisual() {
  const arrival = [
    { label: 'A', p: 3 },
    { label: 'B', p: 1 },
    { label: 'C', p: 2 },
  ]
  const served = [arrival[1], arrival[2], arrival[0]]

  const row = (items, y, label, highlight) => (
    <g>
      <text x="10" y={y + 19} fontSize="9" fill="var(--text)">{label}</text>
      {items.map((it, i) => (
        <g key={it.label}>
          <rect
            x={80 + i * 70}
            y={y}
            width="60"
            height="28"
            rx="3"
            fill={highlight ? 'var(--accent-bg)' : 'var(--bg)'}
            stroke={highlight ? 'var(--accent)' : 'var(--border)'}
          />
          <text x={110 + i * 70} y={y + 18} fontSize="12" textAnchor="middle" fill="var(--text-h)">
            {it.label} (p{it.p})
          </text>
        </g>
      ))}
    </g>
  )

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="Three tasks arrive in the order A, B, C with priorities 3, 1, 2. A priority queue serves them in priority order: B, then C, then A."
      >
        {row(arrival, 8, 'arrives', false)}
        {row(served, 52, 'served', true)}
      </svg>
      <ul className="visual-legend">
        <li>served by priority (lowest number first), not by arrival</li>
      </ul>
    </div>
  )
}

function QueueVisual() {
  const values = [1, 2, 3, 4]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="A horizontal queue. The front box fades out to show it being dequeued, and a new box fades in at the back to show an enqueue, while the two boxes in the middle stay put."
      >
        {values.map((v, i) => {
          const x = 20 + i * 58
          const animated = i === 0 || i === 3
          const content = (
            <g key={i}>
              <rect x={x} y="20" width="50" height="30" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 25} y="39" fontSize="13" textAnchor="middle" fill="var(--text-h)">{v}</text>
            </g>
          )
          if (!animated) return content
          return (
            <g key={i} className="anim-reveal" style={{ animationDelay: i === 0 ? '0s' : '2.25s' }}>
              {content}
            </g>
          )
        })}
        <text x="45" y="72" fontSize="9" textAnchor="middle" fill="var(--text)">front (dequeue)</text>
        <text x="223" y="72" fontSize="9" textAnchor="middle" fill="var(--text)">back (enqueue)</text>
      </svg>
      <ul className="visual-legend">
        <li>front: dequeue here</li>
        <li>back: enqueue here &mdash; FIFO</li>
      </ul>
    </div>
  )
}

function TwoStacksQueueVisual() {
  const inStack = [1, 2, 3]
  const outStack = [3, 2, 1]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 110"
        role="img"
        aria-label="An in-stack holding 1, 2, 3 from bottom to top. When dumped onto an out-stack one at a time, the order reverses to 3, 2, 1 from bottom to top, putting 1 -- the first one ever enqueued -- back on top, ready to dequeue."
      >
        <text x="70" y="12" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text)">in</text>
        {inStack.map((v, i) => (
          <g key={i}>
            <rect x="40" y={78 - i * 25} width="60" height="22" rx="3" fill="var(--bg)" stroke="var(--border)" />
            <text x="70" y={93 - i * 25} fontSize="12" textAnchor="middle" fill="var(--text-h)">{v}</text>
          </g>
        ))}

        <text x="150" y="58" fontSize="9" textAnchor="middle" fill="var(--text)">dump &#8594;</text>

        <text x="230" y="12" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text)">out</text>
        {outStack.map((v, i) => (
          <g key={i} className="anim-reveal" style={{ animationDelay: `${i * 0.3}s` }}>
            <rect x="200" y={78 - i * 25} width="60" height="22" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" />
            <text x="230" y={93 - i * 25} fontSize="12" textAnchor="middle" fill="var(--accent)">{v}</text>
          </g>
        ))}
      </svg>
      <ul className="visual-legend">
        <li>pop from in, push to out &mdash; reverses the order back to FIFO</li>
      </ul>
    </div>
  )
}

function DequeVisual() {
  const values = [2, 3, 4]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="A deque where a new box can appear on the left via appendleft, or on the right via append, while the middle boxes stay put -- O(1) at either end."
      >
        <g className="anim-reveal" style={{ animationDelay: '0s' }}>
          <rect x="15" y="20" width="50" height="30" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
          <text x="40" y="39" fontSize="13" textAnchor="middle" fill="var(--accent)">1</text>
        </g>

        {values.map((v, i) => {
          const x = 77 + i * 58
          return (
            <g key={i}>
              <rect x={x} y="20" width="50" height="30" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 25} y="39" fontSize="13" textAnchor="middle" fill="var(--text-h)">{v}</text>
            </g>
          )
        })}

        <g className="anim-reveal" style={{ animationDelay: '2.25s' }}>
          <rect x="251" y="20" width="50" height="30" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
          <text x="276" y="39" fontSize="13" textAnchor="middle" fill="var(--accent)">5</text>
        </g>

        <text x="40" y="68" fontSize="8" textAnchor="middle" fill="var(--text)">appendleft/popleft</text>
        <text x="276" y="68" fontSize="8" textAnchor="middle" fill="var(--text)">append/pop</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> new at either end</li>
        <li>O(1) to push or pop at either end</li>
      </ul>
    </div>
  )
}

export { QueueVisual, QueueLinkedVisual, PriorityVisual, TwoStacksQueueVisual, DequeVisual }
