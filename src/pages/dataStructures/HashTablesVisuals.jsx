import './HashTablesVisuals.css'

function HashFunctionVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="The key 'amy' flowing through a hash function, producing index 2, which lands in slot 2 of an 8-slot bucket array."
      >
        <rect x="10" y="44" width="54" height="28" rx="4" fill="var(--bg)" stroke="var(--border)" />
        <text x="37" y="62" fontSize="11" textAnchor="middle" fill="var(--text-h)">&quot;amy&quot;</text>

        <rect x="98" y="40" width="64" height="36" rx="4" fill="var(--code-bg)" stroke="var(--border)" />
        <text x="130" y="62" fontSize="10" textAnchor="middle" fill="var(--text-h)">hash()</text>

        <g className="anim-reveal" style={{ animationDelay: '0s' }}>
          <line x1="66" y1="58" x2="96" y2="58" stroke="var(--accent)" strokeWidth="2" />
        </g>

        <g className="anim-reveal" style={{ animationDelay: '0.5s' }}>
          <line x1="164" y1="58" x2="194" y2="58" stroke="var(--accent)" strokeWidth="2" />
          <text x="232" y="62" fontSize="11" textAnchor="middle" fill="var(--text-h)">% 8 = 2</text>
        </g>

        <g className="anim-reveal" style={{ animationDelay: '1.4s' }}>
          <line x1="216" y1="72" x2="100" y2="93" stroke="var(--accent)" strokeWidth="2" />
        </g>

        {Array.from({ length: 8 }).map((_, i) => {
          const x = 8 + i * 35
          const isTarget = i === 2
          return (
            <rect
              key={i}
              className={isTarget ? 'anim-reveal' : undefined}
              style={isTarget ? { animationDelay: '1.9s' } : undefined}
              x={x}
              y="96"
              width="28"
              height="20"
              rx="3"
              fill={isTarget ? 'var(--accent-bg)' : 'var(--bg)'}
              stroke={isTarget ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={isTarget ? '2' : '1'}
            />
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} /> bucket array</li>
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> slot the key lands in</li>
      </ul>
    </div>
  )
}

function CollisionVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Two collision-resolution strategies: chaining, where a second key is linked onto the same bucket, and open addressing, where a second key probes forward to the next empty slot."
      >
        <text x="62" y="12" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text)">chaining</text>
        {Array.from({ length: 5 }).map((_, i) => {
          const x = 8 + i * 27
          const isHit = i === 2
          return (
            <rect
              key={i}
              x={x}
              y="20"
              width="23"
              height="22"
              rx="3"
              fill={isHit ? 'var(--accent-bg)' : 'var(--bg)'}
              stroke={isHit ? 'var(--accent)' : 'var(--border)'}
            />
          )
        })}
        <line x1="69" y1="42" x2="69" y2="56" stroke="var(--border)" />
        <rect x="52" y="56" width="34" height="18" rx="3" fill="var(--bg)" stroke="var(--border)" />
        <text x="69" y="69" fontSize="9" textAnchor="middle" fill="var(--text)">key1</text>
        <line x1="69" y1="74" x2="69" y2="86" stroke="var(--border)" />
        <g className="anim-reveal" style={{ animationDelay: '0.6s' }}>
          <rect x="52" y="86" width="34" height="18" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" />
          <text x="69" y="99" fontSize="9" textAnchor="middle" fill="var(--accent)">key2</text>
        </g>

        <text x="237" y="12" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text)">open addressing</text>
        {Array.from({ length: 5 }).map((_, i) => {
          const x = 165 + i * 27
          const isHit = i === 2
          return (
            <rect
              key={i}
              x={x}
              y="20"
              width="23"
              height="22"
              rx="3"
              fill={isHit ? 'var(--accent-bg)' : 'var(--bg)'}
              stroke={isHit ? 'var(--accent)' : 'var(--border)'}
            />
          )
        })}
        <text x="230" y="35" fontSize="8" textAnchor="middle" fill="var(--accent)">key1</text>
        <g className="anim-reveal" style={{ animationDelay: '1.2s' }}>
          <path d="M231,42 Q250,55 258,42" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x="246" y="20" width="23" height="22" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
          <text x="257" y="35" fontSize="8" textAnchor="middle" fill="var(--accent)">key2</text>
        </g>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> colliding key</li>
        <li>chaining links it on; probing finds the next open slot</li>
      </ul>
    </div>
  )
}

function LoadFactorVisual() {
  const frame1 = { count: 8, filled: 5, box: 9, gap: 1 }
  const frame2 = { count: 8, filled: 6, box: 9, gap: 1 }
  const frame3 = { count: 16, filled: 6, box: 6, gap: 1 }

  function renderFrame(frame, startX, highlightLast) {
    const step = frame.box + frame.gap
    return Array.from({ length: frame.count }).map((_, i) => {
      const x = startX + i * step
      const filled = i < frame.filled
      const isLast = highlightLast && i === frame.filled - 1
      return (
        <rect
          key={i}
          className={isLast ? 'anim-reveal' : undefined}
          style={isLast ? { animationDelay: '1s' } : undefined}
          x={x}
          y="20"
          width={frame.box}
          height={frame.box}
          fill={filled ? (isLast ? 'var(--margin-line)' : 'var(--accent)') : 'var(--bg)'}
          stroke={filled ? 'none' : 'var(--border)'}
        />
      )
    })
  }

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 320 90"
        role="img"
        aria-label="A bucket array filling from 5 of 8 slots to 6 of 8 slots, crossing the resize threshold, then rehashing into a 16-slot array that is only 38 percent full."
      >
        {renderFrame(frame1, 4, false)}
        <text x="44" y="42" fontSize="8" textAnchor="middle" fill="var(--text)">5/8 (63%)</text>

        <text x="92" y="16" fontSize="12" fill="var(--text)">&#8594;</text>

        {renderFrame(frame2, 104, true)}
        <g className="anim-reveal" style={{ animationDelay: '1.6s' }}>
          <text x="144" y="42" fontSize="8" textAnchor="middle" fill="var(--margin-line)">75% &#8594; resize!</text>
        </g>

        <text x="192" y="16" fontSize="12" fill="var(--text)">&#8594;</text>

        <g className="anim-reveal" style={{ animationDelay: '2.4s' }}>
          {renderFrame(frame3, 204, false)}
          <text x="260" y="42" fontSize="8" textAnchor="middle" fill="var(--text)">6/16 (38%)</text>
        </g>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> filled slot</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> crosses the resize threshold</li>
      </ul>
    </div>
  )
}

function WorstCaseVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Left: eight buckets each holding at most one item, giving O(1) lookups. Right: every item hashed into the same single bucket, forming a long chain that degrades lookups to O(n)."
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 8 + i * 18
          return (
            <g key={i}>
              <circle cx={x + 7} cy="24" r="3.5" fill="var(--accent)" />
              <rect x={x} y="32" width="14" height="14" rx="2" fill="var(--bg)" stroke="var(--border)" />
            </g>
          )
        })}
        <text x="72" y="98" fontSize="9" textAnchor="middle" fill="var(--text)">well-distributed: O(1)</text>

        {Array.from({ length: 8 }).map((_, i) => {
          const x = 165 + i * 15
          const isHot = i === 3
          return (
            <rect key={i} x={x} y="56" width="12" height="14" rx="2" fill={isHot ? 'var(--margin-line)' : 'var(--bg)'} stroke={isHot ? 'none' : 'var(--border)'} />
          )
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            className="anim-reveal"
            style={{ animationDelay: `${i * 0.3}s` }}
            cx="216"
            cy={50 - i * 8}
            r="3.5"
            fill="var(--margin-line)"
          />
        ))}
        <text x="222" y="98" fontSize="9" textAnchor="middle" fill="var(--text)">all collide: O(n)</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> average case</li>
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> worst case &mdash; one giant chain</li>
      </ul>
    </div>
  )
}

function TwoSumVisual() {
  const values = [2, 7, 11, 15]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Scanning [2, 7, 11, 15] for a pair that sums to 9: 2 is stored in a seen map, then 7's complement (2) is found in the map, confirming a match at indices 0 and 1."
      >
        <text x="150" y="12" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">target = 9</text>

        {values.map((v, i) => {
          const x = 20 + i * 60
          return (
            <g key={i}>
              <rect x={x} y="20" width="44" height="30" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 22} y="40" fontSize="13" textAnchor="middle" fill="var(--text-h)">{v}</text>
            </g>
          )
        })}

        <g className="anim-reveal" style={{ animationDelay: '0.3s' }}>
          <rect x="20" y="20" width="44" height="30" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <rect x="20" y="62" width="60" height="20" rx="3" fill="var(--code-bg)" stroke="var(--accent)" />
          <text x="50" y="76" fontSize="9" textAnchor="middle" fill="var(--text-h)">seen: 2&#8594;0</text>
        </g>

        <g className="anim-reveal" style={{ animationDelay: '1.8s' }}>
          <rect x="20" y="20" width="104" height="30" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
          <text x="150" y="98" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">7&apos;s complement (2) is in the map &#8594; match!</text>
        </g>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--code-bg)', border: '1px solid var(--accent)' }} /> values seen so far</li>
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> match found</li>
      </ul>
    </div>
  )
}

export {
  HashFunctionVisual,
  CollisionVisual,
  LoadFactorVisual,
  WorstCaseVisual,
  TwoSumVisual,
}
