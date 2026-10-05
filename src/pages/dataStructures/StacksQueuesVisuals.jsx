function StackVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 130"
        role="img"
        aria-label="A vertical stack of boxes with a fourth box repeatedly appearing and disappearing on top, showing that push and pop only ever touch the top of the stack."
      >
        <rect x="80" y="93" width="70" height="22" rx="3" fill="var(--bg)" stroke="var(--border)" />
        <text x="115" y="108" fontSize="12" textAnchor="middle" fill="var(--text-h)">1</text>
        <rect x="80" y="68" width="70" height="22" rx="3" fill="var(--bg)" stroke="var(--border)" />
        <text x="115" y="83" fontSize="12" textAnchor="middle" fill="var(--text-h)">2</text>
        <rect x="80" y="43" width="70" height="22" rx="3" fill="var(--bg)" stroke="var(--border)" />
        <text x="115" y="58" fontSize="12" textAnchor="middle" fill="var(--text-h)">3</text>

        <g className="anim-reveal">
          <rect x="80" y="18" width="70" height="22" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
          <text x="115" y="33" fontSize="12" textAnchor="middle" fill="var(--accent)">4</text>
        </g>

        <line x1="158" y1="29" x2="180" y2="29" stroke="var(--text)" strokeWidth="1" />
        <text x="184" y="33" fontSize="9" fill="var(--text)">top</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} /> in the stack</li>
        <li>push and pop only ever touch the top &mdash; LIFO</li>
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

function MonotonicStackVisual() {
  const nums = [3, 1, 4]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 110"
        role="img"
        aria-label="Scanning [3, 1, 4]: when 4 is reached, it is bigger than both 1 and 3 sitting on the stack, so both get popped and resolved as having 4 for their next greater element."
      >
        {nums.map((v, i) => {
          const x = 100 + i * 50
          const isCurrent = i === 2
          return (
            <g key={i}>
              <rect x={x} y="10" width="40" height="28" rx="3" fill={isCurrent ? 'var(--accent-bg)' : 'var(--bg)'} stroke={isCurrent ? 'var(--accent)' : 'var(--border)'} strokeWidth={isCurrent ? '2' : '1'} />
              <text x={x + 20} y="29" fontSize="13" textAnchor="middle" fill={isCurrent ? 'var(--accent)' : 'var(--text-h)'}>{v}</text>
            </g>
          )
        })}
        <text x="200" y="8" fontSize="8" textAnchor="middle" fill="var(--accent)">current</text>

        <text x="16" y="12" fontSize="9" fill="var(--text)">stack</text>
        <rect x="16" y="68" width="36" height="24" rx="3" fill="var(--bg)" stroke="var(--border)" />
        <text x="34" y="85" fontSize="12" textAnchor="middle" fill="var(--text-h)">1</text>
        <rect x="16" y="40" width="36" height="24" rx="3" fill="var(--bg)" stroke="var(--border)" />
        <text x="34" y="57" fontSize="12" textAnchor="middle" fill="var(--text-h)">3</text>

        <g className="anim-reveal" style={{ animationDelay: '0s' }}>
          <text x="90" y="85" fontSize="10" fontWeight="600" fill="var(--accent)">&#8594; next greater = 4</text>
        </g>
        <g className="anim-reveal" style={{ animationDelay: '0.6s' }}>
          <text x="90" y="57" fontSize="10" fontWeight="600" fill="var(--accent)">&#8594; next greater = 4</text>
        </g>
      </svg>
      <ul className="visual-legend">
        <li>while top &lt; current: pop it, record the answer &mdash; then push current</li>
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

export {
  StackVisual,
  QueueVisual,
  TwoStacksQueueVisual,
  MonotonicStackVisual,
  DequeVisual,
}
