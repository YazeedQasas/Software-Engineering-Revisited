import { useEffect, useState } from 'react'
import IsoRow, { IsoCube } from '../../components/IsoRow.jsx'

const HALVE_VALUES = [1, 2, 4, 5, 6, 7, 8, 9]
const HALVE_TARGET = 7
const HOLD_TICKS = 2

// Each frame of the loop: which cube is being checked, which are thrown away,
// and whether the search is over.
const FRAMES = [
  { mid: 3, gone: [], found: false },
  { mid: null, gone: [0, 1, 2, 3], found: false },
  { mid: 5, gone: [0, 1, 2, 3], found: false },
  { mid: 5, gone: [0, 1, 2, 3], found: true },
]

// A looping animation of the idea: look at the middle, throw away the half
// that cannot hold the target, and repeat on what is left.
function IsoHalvingVisual() {
  const [tick, setTick] = useState(0)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => setTick((t) => (t + 1) % (FRAMES.length + HOLD_TICKS)), 900)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const frame = reduceMotion ? FRAMES[FRAMES.length - 1] : FRAMES[Math.min(tick, FRAMES.length - 1)]
  const states = HALVE_VALUES.map((_, i) => {
    if (frame.found && i === frame.mid) return 'found'
    if (i === frame.mid) return 'active'
    if (frame.gone.includes(i)) return 'checked'
    return 'plain'
  })

  return (
    <div className="visual-card">
      <IsoRow
        values={HALVE_VALUES}
        states={states}
        lifted={frame.mid}
        marker={frame.mid}
        target={HALVE_TARGET}
        ariaLabel="A sorted row of eight cubes holding 1, 2, 4, 5, 6, 7, 8, 9. The middle cube, 5, is checked first. It is smaller than the 7 being looked for, so it and everything to its left fade away. The middle of the right half, the 7, is checked next and turns green."
      />
      <ul className="visual-legend">
        <li>check the middle, fade the half that cannot hold the target, repeat</li>
      </ul>
    </div>
  )
}

// A list of 16 shrinking by half on every check: 16, 8, 4, 2, 1 items left.
function IsoShrinkVisual() {
  const size = 8
  const h = size * 0.62
  const spacing = size * 1.9
  const rows = [16, 8, 4, 2, 1]
  const total = 16

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 128"
        role="img"
        aria-label="Five rows of cubes. The first row has 16 cubes. Each row below it keeps only the right half of the row above: 8 cubes, then 4, then 2, then a single green cube. Four checks are enough to get from 16 items down to one."
      >
        {rows.map((left, r) => {
          const y = 18 + r * 23
          return (
            <g key={left}>
              {Array.from({ length: total }).map((_, i) => {
                const alive = i >= total - left
                let tone = alive ? 'plain' : 'checked'
                if (left === 1 && alive) tone = 'found'
                return <IsoCube key={i} px={12 + i * spacing} py={y} s={size} h={h} tone={tone} />
              })}
              <text x="262" y={y + 2} fontSize="10" fill="var(--text)">
                {r === 0 ? '16 in play' : `${left} left`}
              </text>
              <text x="262" y={y + 14} fontSize="9" fill="var(--text)" opacity="0.7">
                {r === 0 ? 'start' : `after check ${r}`}
              </text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#2f9e44' }} /> the match</li>
        <li><span className="swatch" style={{ background: '#d0d0ce' }} /> thrown away</li>
        <li><span className="swatch" style={{ background: '#fff', border: '1px solid #c4c4c2' }} /> still in play</li>
      </ul>
    </div>
  )
}

export { IsoHalvingVisual, IsoShrinkVisual }
