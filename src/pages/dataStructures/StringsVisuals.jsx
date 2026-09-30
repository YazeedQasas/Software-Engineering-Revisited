import './StringsVisuals.css'

function StringBasicsVisual() {
  const chars = ['P', 'Y', 'T', 'H', 'O', 'N']

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Row of six boxes spelling PYTHON with indices above, and a crossed-out attempt to assign s[0] = 'p' showing that strings cannot be modified in place."
      >
        {chars.map((ch, i) => {
          const x = 15 + i * 46
          return (
            <g key={i}>
              <text x={x + 20} y={16} fontSize="9" textAnchor="middle" fill="var(--text)">{i}</text>
              <rect x={x} y="20" width="40" height="36" rx="4" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 20} y="44" fontSize="14" textAnchor="middle" fill="var(--text-h)">{ch}</text>
            </g>
          )
        })}
        <g className="anim-shake">
          <text x="150" y="88" fontSize="11" textAnchor="middle" fill="var(--text-h)">s[0] = &apos;p&apos;</text>
        </g>
        <line className="anim-draw-line1" x1="110" y1="76" x2="190" y2="98" stroke="var(--margin-line)" strokeWidth="2" />
        <line className="anim-draw-line2" x1="110" y1="98" x2="190" y2="76" stroke="var(--margin-line)" strokeWidth="2" />
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} /> character (read-only)</li>
        <li>TypeError: &apos;str&apos; object does not support item assignment</li>
      </ul>
    </div>
  )
}

function ConcatenationVisual() {
  const naiveHeights = [8, 16, 24, 32, 40, 48]
  const joinHeights = [8, 8, 8, 8, 8, 8]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 120"
        role="img"
        aria-label="Bar chart comparing repeated string concatenation, where each step copies more than the last, against building with a list and joining once, where every append is flat and only the final join is a longer bar."
      >
        {naiveHeights.map((h, i) => (
          <rect
            key={i}
            className="anim-bar"
            style={{ animationDelay: `${i * 0.15}s` }}
            x={15 + i * 18}
            y={100 - h}
            width="12"
            height={h}
            fill="var(--margin-line)"
          />
        ))}
        <text x="65" y="114" fontSize="9" textAnchor="middle" fill="var(--text)">naive +=</text>

        {joinHeights.map((h, i) => (
          <rect
            key={i}
            className="anim-bar"
            style={{ animationDelay: `${i * 0.08}s` }}
            x={175 + i * 16}
            y={100 - h}
            width="11"
            height={h}
            fill="var(--accent)"
          />
        ))}
        <rect className="anim-bar" style={{ animationDelay: '0.9s' }} x="271" y="52" width="14" height="48" fill="var(--accent)" />
        <text x="228" y="114" fontSize="9" textAnchor="middle" fill="var(--text)">list + join()</text>

        <line x1="8" y1="100" x2="292" y2="100" stroke="var(--border)" />
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--margin-line)' }} /> cost grows every step</li>
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> flat O(1) appends + one O(n) join</li>
      </ul>
    </div>
  )
}

function PalindromeVisual() {
  const chars = ['R', 'A', 'C', 'E', 'C', 'A', 'R']
  const step = 38
  const rightStartX = 12 + 6 * step

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="The string RACECAR with animated left and right pointers walking inward from both ends, checking that each pair of characters matches, until they meet in the middle."
      >
        <text x="150" y="12" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">
          checking each pair from the outside in
        </text>
        {chars.map((ch, i) => {
          const x = 12 + i * step
          return (
            <g key={i}>
              <rect x={x} y="20" width="34" height="30" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 17} y="39" fontSize="13" textAnchor="middle" fill="var(--text-h)">{ch}</text>
            </g>
          )
        })}

        <g className="anim-ptr-left">
          <rect x="12" y="20" width="34" height="30" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <polygon points="24,64 34,64 29,54" fill="var(--accent)" />
          <text x="29" y="76" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">L</text>
        </g>

        <g className="anim-ptr-right">
          <rect x={rightStartX} y="20" width="34" height="30" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <polygon points={`${rightStartX + 12},64 ${rightStartX + 22},64 ${rightStartX + 17},54`} fill="var(--accent)" />
          <text x={rightStartX + 17} y="76" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--accent)">R</text>
        </g>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'var(--accent)' }} /> left &amp; right pointers</li>
        <li>equal &#8594; step inward; not equal &#8594; not a palindrome</li>
      </ul>
    </div>
  )
}

function AnagramVisual() {
  const left = ['A', 'A', 'B', 'B']
  const right = ['A', 'B', 'A', 'B']

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 100"
        role="img"
        aria-label="AABB and ABAB shown as separate strings, both with the same character counts (A: 2, B: 2), illustrating that anagrams share identical letter frequencies regardless of order."
      >
        {left.map((ch, i) => {
          const x = 20 + i * 24
          return (
            <g key={i}>
              <rect x={x} y="15" width="20" height="26" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 10} y="33" fontSize="12" textAnchor="middle" fill="var(--text-h)">{ch}</text>
            </g>
          )
        })}
        <text className="anim-pulse" x="66" y="62" fontSize="10" textAnchor="middle" fill="var(--text)">A: 2  B: 2</text>

        <text className="anim-pulse" x="150" y="35" fontSize="18" textAnchor="middle" fill="var(--text-h)">=</text>

        {right.map((ch, i) => {
          const x = 188 + i * 24
          return (
            <g key={i}>
              <rect x={x} y="15" width="20" height="26" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 10} y="33" fontSize="12" textAnchor="middle" fill="var(--text-h)">{ch}</text>
            </g>
          )
        })}
        <text className="anim-pulse" x="234" y="62" fontSize="10" textAnchor="middle" fill="var(--text)">A: 2  B: 2</text>

        <text x="150" y="88" fontSize="9" textAnchor="middle" fill="var(--text)">same letters, same counts &#8594; anagram</text>
      </svg>
      <ul className="visual-legend">
        <li>Counter(a) == Counter(b)</li>
      </ul>
    </div>
  )
}

function SubstringSearchVisual() {
  const haystack = ['A', 'B', 'C', 'A', 'B', 'D']

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 300 90"
        role="img"
        aria-label="The haystack ABCABD with a needle window ABD sliding across positions 0, 1, and 2 (each a mismatch) before landing on position 3, which matches."
      >
        <rect className="anim-needle-try" x="8" y="25" width="118" height="40" rx="6" fill="none" stroke="var(--margin-line)" strokeWidth="2" strokeDasharray="5 3" />
        <rect className="anim-needle-match" x="122" y="25" width="118" height="40" rx="6" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />

        {haystack.map((ch, i) => {
          const x = 12 + i * 38
          return (
            <g key={i}>
              <rect x={x} y="34" width="34" height="30" rx="3" fill="var(--bg)" stroke="var(--border)" />
              <text x={x + 17} y="53" fontSize="13" textAnchor="middle" fill="var(--text-h)">{ch}</text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: 'none', border: '1px dashed var(--margin-line)' }} /> checked, no match</li>
        <li><span className="swatch" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }} /> match found</li>
      </ul>
    </div>
  )
}

export {
  StringBasicsVisual,
  ConcatenationVisual,
  PalindromeVisual,
  AnagramVisual,
  SubstringSearchVisual,
}
