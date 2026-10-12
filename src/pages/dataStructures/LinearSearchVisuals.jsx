import { useEffect, useState } from 'react'
import IsoRow, { IsoCube } from '../../components/IsoRow.jsx'

const SCAN_VALUES = [4, 9, 2, 7, 5, 8, 1, 6]
const SCAN_TARGET = 7
const SCAN_FOUND = SCAN_VALUES.indexOf(SCAN_TARGET)
const HOLD_TICKS = 3

// A looping animation of the idea: a marker walks along the row, ruling
// cubes out one by one, until it lands on the target and the cube turns green.
function IsoScanVisual() {
  const [tick, setTick] = useState(0)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => setTick((t) => (t + 1) % (SCAN_FOUND + 1 + HOLD_TICKS)), 650)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const position = reduceMotion ? SCAN_FOUND : Math.min(tick, SCAN_FOUND)
  const done = position === SCAN_FOUND
  const states = SCAN_VALUES.map((_, i) => {
    if (done && i === SCAN_FOUND) return 'found'
    if (i === position) return 'active'
    if (i < position) return 'checked'
    return 'plain'
  })

  return (
    <div className="visual-card">
      <IsoRow
        values={SCAN_VALUES}
        states={states}
        lifted={position}
        marker={position}
        target={SCAN_TARGET}
        ariaLabel="A row of eight cubes holding 4, 9, 2, 7, 5, 8, 1, 6. A marker moves along them one at a time, fading each cube that is not 7, until it reaches the 7, which turns green."
      />
      <ul className="visual-legend">
        <li>one cube at a time, from the front, until the match turns green</li>
      </ul>
    </div>
  )
}

// Best, average and worst case side by side: how many cubes get checked.
function IsoCasesVisual() {
  const size = 11
  const cases = [
    { title: 'best case', note: '1 check', checked: 0, found: 0, left: 8 },
    { title: 'average', note: 'about n / 2', checked: 3, found: 3, left: 118 },
    { title: 'worst case', note: 'all n checks', checked: 7, found: 7, left: 228 },
  ]
  const n = 8
  const gap = size * 1.25
  const a = size * 0.866
  const h = size * 0.62

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 130"
        role="img"
        aria-label="Three small rows of eight cubes. Best case: the target is the first cube, so only one cube is checked. Average case: the target is somewhere in the middle, so about half the cubes are checked. Worst case: the target is the last cube or missing, so all of the cubes are checked."
      >
        {cases.map((c) => (
          <g key={c.title}>
            <text x={c.left + 40} y="14" fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">{c.title}</text>
            {Array.from({ length: n }).map((_, i) => {
              const px = c.left + a + 2 + i * gap * 0.866
              const py = 34 + i * gap * 0.5
              let tone = 'plain'
              if (i === c.found) tone = 'found'
              else if (i < c.checked) tone = 'checked'
              return <IsoCube key={i} px={px} py={py} s={size} h={h} tone={tone} />
            })}
            <text x={c.left + 40} y="122" fontSize="10" textAnchor="middle" fill="var(--text)">{c.note}</text>
          </g>
        ))}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#2f9e44' }} /> the match</li>
        <li><span className="swatch" style={{ background: '#d0d0ce' }} /> checked and ruled out</li>
        <li><span className="swatch" style={{ background: '#fff', border: '1px solid #c4c4c2' }} /> never reached</li>
      </ul>
    </div>
  )
}

export { IsoScanVisual, IsoCasesVisual }
