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

function BracketsVisual() {
  const steps = [
    { read: '(', action: 'push', stack: ['('] },
    { read: '[', action: 'push', stack: ['(', '['] },
    { read: ']', action: 'pop', stack: ['('] },
    { read: ')', action: 'pop', stack: [] },
  ]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 130"
        role="img"
        aria-label="Checking the brackets in ([]) step by step. Reading ( pushes it, reading [ pushes it, reading ] pops the matching [, and reading ) pops the matching (, leaving the stack empty, so the brackets are balanced."
      >
        {steps.map((st, i) => {
          const x = 15 + i * 70
          return (
            <g key={i}>
              <text x={x + 22} y="14" fontSize="12" fontWeight="600" textAnchor="middle" fill="var(--text-h)">
                {st.read}
              </text>
              <text x={x + 22} y="28" fontSize="9" textAnchor="middle" fill={st.action === 'pop' ? 'var(--margin-line)' : 'var(--accent)'}>
                {st.action}
              </text>
              {st.stack.map((c, j) => {
                const top = j === st.stack.length - 1
                return (
                  <g key={j}>
                    <rect
                      x={x}
                      y={102 - j * 24}
                      width="44"
                      height="22"
                      rx="3"
                      fill={top ? 'var(--accent-bg)' : 'var(--bg)'}
                      stroke={top ? 'var(--accent)' : 'var(--border)'}
                    />
                    <text x={x + 22} y={117 - j * 24} fontSize="12" textAnchor="middle" fill="var(--text-h)">
                      {c}
                    </text>
                  </g>
                )
              })}
              {st.stack.length === 0 && (
                <text x={x + 22} y="117" fontSize="9" textAnchor="middle" fill="var(--text)">empty</text>
              )}
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>opening bracket: push &mdash; closing bracket: pop and compare</li>
        <li>empty at the end means every bracket was matched</li>
      </ul>
    </div>
  )
}

export { StackVisual, BracketsVisual, MonotonicStackVisual }
