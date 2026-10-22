import IsoRow, { IsoCube, TONES } from '../../components/IsoRow.jsx'
import IsoGrid from '../../components/IsoGrid.jsx'
import { useState } from 'react'
import { StepDots } from './loopHooks.jsx'
import './ProblemSolvingIso.css'

// One small isometric picture for each technique. Every picture is a short run
// of frames, built from the same cubes and tiles as the search pages. Nothing
// plays by itself: the arrows (or the dots) move from one frame to the next.

const swatch = (tone) => TONES[tone][0]

const Legend = ({ items }) => (
  <ul className="visual-legend">
    {items.map(([tone, text]) => (
      <li key={text}>{tone ? <span className="swatch" style={{ background: swatch(tone) }} /> : null} {text}</li>
    ))}
  </ul>
)

// The caption, with the back and next arrows and the frame dots underneath.
// Every caption is laid out in the same spot, invisibly, so the card is as tall
// as the longest one and the page does not move when the caption changes.
function Footer({ captions, tick, onPick }) {
  const last = captions.length - 1
  return (
    <>
      <div style={{ display: 'grid' }}>
        {captions.map((text, i) => (
          <p key={i} className="visual-caption" aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden' }}>{text}</p>
        ))}
        <p className="visual-caption" aria-live="polite" style={{ gridArea: '1 / 1' }}>{captions[tick]}</p>
      </div>
      <div className="step-nav">
        <button type="button" className="step-arrow" onClick={() => onPick(tick - 1)} disabled={tick === 0} aria-label="Previous step">&larr;</button>
        <StepDots count={captions.length} tick={tick} onPick={onPick} />
        <button type="button" className="step-arrow" onClick={() => onPick(tick + 1)} disabled={tick === last} aria-label="Next step">&rarr;</button>
      </div>
    </>
  )
}

// Several pictures that take turns in the same place: all are laid out on top of
// each other, so the space is as big as the biggest one.
function Swap({ index, children }) {
  return (
    <div style={{ display: 'grid' }}>
      {children.map((child, i) => (
        <div key={i} aria-hidden={i === index ? undefined : 'true'} style={{ gridArea: '1 / 1', alignSelf: 'center', visibility: i === index ? 'visible' : 'hidden' }}>
          {child}
        </div>
      ))}
    </div>
  )
}

// A picture you step through: `render(frame)` draws one frame, and every frame has a caption.
function IsoLoop({ frames, render, legend, width = 440 }) {
  const [tick, setTick] = useState(0)
  return (
    <div className="visual-card">
      <div style={{ maxWidth: width, margin: '0 auto' }}>{render(frames[tick], tick)}</div>
      {legend && <Legend items={legend} />}
      <Footer captions={frames.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

const plain = (n, tone = 'plain') => Array(n).fill(tone)
const paint = (n, spec, base = 'plain') => {
  const states = plain(n, base)
  Object.entries(spec).forEach(([tone, list]) => list.forEach((i) => { states[i] = tone }))
  return states
}
const span = (from, to) => Array.from({ length: to - from + 1 }, (_, k) => from + k)

// ------------------------------------------------ brute force: every pair

const BN = [2, 5, 7, 9, 11, 14]
const BT = 18
const BPAIRS = BN.flatMap((_, i) => BN.slice(i + 1).map((__, k) => [i, i + 1 + k]))
const BFOUND = BPAIRS.findIndex(([i, j]) => BN[i] + BN[j] === BT) + 1 // 11

const BRUTE_FRAMES = [
  { shown: 0, caption: `Brute force looks at every pair of numbers. ${BN.length} numbers make ${BPAIRS.length} pairs, one tile each (the white tiles are not pairs). Find two that add up to ${BT}.` },
  { shown: 5, caption: 'Check the pairs one after another. A grey tile is a pair already checked, with its sum on it. The first five all start with 2.' },
  { shown: 10, caption: 'The next row of the grid, and the next, and so on: the work is the area of the grid, which is why it grows like n².' },
  { shown: BFOUND, found: true, caption: `Check ${BFOUND}: ${BN[BPAIRS[BFOUND - 1][0]]} + ${BN[BPAIRS[BFOUND - 1][1]]} = ${BT}. Found, after looking at ${BFOUND} of the ${BPAIRS.length} pairs.` },
]

function BruteVisual() {
  return (
    <IsoLoop
      frames={BRUTE_FRAMES}
      legend={[['target', 'a pair still to check'], ['closed', 'a pair already checked (with its sum)'], ['active', 'the pair being checked'], ['found', 'the pair that works']]}
      render={({ shown, found }) => (
        <IsoGrid
          rows={BN.length}
          cols={BN.length}
          size={19}
          room={10}
          ariaLabel={`A grid of every pair of the numbers ${BN.join(', ')}. ${shown} pairs have been checked.`}
          cell={(r, c) => {
            if (c <= r) return { tone: 'plain' }
            const k = BPAIRS.findIndex(([i, j]) => i === r && j === c)
            const label = String(BN[r] + BN[c])
            if (k < shown - 1) return { tone: 'closed', label }
            if (k === shown - 1) return { tone: found ? 'found' : 'active', label, lift: 4 }
            return { tone: 'target' }
          }}
        />
      )}
    />
  )
}

// ------------------------------------------------ recursion: a stack of calls

const STACK_FRAMES = [
  { cubes: [['f(4)', 'active']], caption: 'factorial(4) needs factorial(3) first, so it calls it and waits.' },
  { cubes: [['f(4)', 'plain'], ['f(3)', 'active']], caption: 'factorial(3) calls factorial(2) and waits. The waiting calls pile up like a stack of cubes.' },
  { cubes: [['f(4)', 'plain'], ['f(3)', 'plain'], ['f(2)', 'active']], caption: 'factorial(2) calls factorial(1).' },
  { cubes: [['f(4)', 'plain'], ['f(3)', 'plain'], ['f(2)', 'plain'], ['f(1)', 'found']], caption: 'factorial(1) is the base case: it answers 1 straight away, with no more calls. That is what stops the stack growing.' },
  { cubes: [['f(4)', 'plain'], ['f(3)', 'plain'], ['2', 'found']], caption: 'Now the stack unwinds. factorial(2) gets 1 back and returns 2 × 1 = 2.' },
  { cubes: [['f(4)', 'plain'], ['6', 'found']], caption: 'factorial(3) gets 2 and returns 3 × 2 = 6.' },
  { cubes: [['24', 'found']], caption: 'factorial(4) gets 6 and returns 4 × 6 = 24.' },
]

// A column of cubes, the first at the bottom. Each label sits beside its cube,
// because the cube above would cover a label written on top.
function Tower({ x, baseY, cubes, size, side = 'right' }) {
  const h = size * 0.62
  const a = size * 0.866
  return (
    <>
      {cubes.map(([label, tone], k) => (
        <g key={k}>
          <IsoCube px={x} py={baseY - k * h} s={size} h={h} tone={tone} />
          <text
            x={side === 'right' ? x + a + 8 : x - a - 8}
            y={baseY - k * h - h * 0.35}
            fontSize={Math.round(size * 0.42)}
            fontWeight="700"
            textAnchor={side === 'right' ? 'start' : 'end'}
            fill="var(--text-h)"
          >
            {label}
          </text>
        </g>
      ))}
    </>
  )
}

function StackVisual() {
  return (
    <IsoLoop
      frames={STACK_FRAMES}
      width={320}
      legend={[['active', 'the call running now'], ['plain', 'a call waiting for its answer'], ['found', 'an answer']]}
      render={({ cubes }) => (
        <svg viewBox="0 0 300 200" role="img" aria-label={`The call stack holds: ${cubes.map(([label]) => label).join(', ')}.`}>
          <Tower x={140} baseY={160} cubes={cubes} size={38} />
          <text x="150" y="196" fontSize="11" textAnchor="middle" fill="var(--text)">the call stack</text>
        </svg>
      )}
    />
  )
}

// ------------------------------------------------ divide and conquer

const DC = [4, 9, 2, 7, 1, 8, 5, 3]

const DIVIDE_FRAMES = [
  { states: plain(8), caption: 'Find the largest of 8 numbers by divide and conquer: split, solve the pieces, combine the answers.' },
  { states: paint(8, { active: span(0, 3), target: span(4, 7) }), caption: 'Divide: split the list into two halves.' },
  { states: paint(8, { active: [0, 1], target: [2, 3], start: [4, 5], goal: [6, 7] }), caption: 'Keep dividing, until the pieces are tiny. A piece of two is easy: its largest is the bigger one.' },
  { states: paint(8, { checked: [0, 2, 4, 7], found: [1, 3, 5, 6] }), caption: 'Conquer: the largest of each pair is 9, 7, 8 and 5.' },
  { states: paint(8, { checked: [0, 2, 3, 4, 6, 7], found: [1, 5] }), caption: 'Combine: 9 against 7 gives 9, and 8 against 5 gives 8.' },
  { states: paint(8, { checked: [0, 2, 3, 4, 5, 6, 7], found: [1] }), caption: 'Combine again: 9 against 8 gives 9. Halving 8 numbers took 3 levels, which is where log n comes from.' },
]

function DivideVisual() {
  return (
    <IsoLoop
      frames={DIVIDE_FRAMES}
      legend={[['found', 'the largest of its piece'], ['checked', 'beaten']]}
      render={({ states }) => <IsoRow values={DC} states={states} size={21} ariaLabel={`The numbers ${DC.join(', ')} being split into halves and combined.`} />}
    />
  )
}

// ------------------------------------------------ greedy

const COINS = [4, 3, 1]

const GREEDY_FRAMES = [
  { states: plain(3), marker: null, caption: 'Make 6 with as few coins as possible. The coins are 4, 3 and 1. The greedy rule: always take the biggest coin that still fits.' },
  { states: ['found', 'plain', 'plain'], marker: 0, caption: 'The biggest coin that fits in 6 is 4. Take it. 2 is left.' },
  { states: ['found', 'checked', 'found'], marker: 2, caption: '3 does not fit in 2, but 1 does. Take it. 1 is left.' },
  { states: ['found', 'checked', 'found'], marker: 2, caption: 'Take another 1. Nothing is left: 3 coins, 4 + 1 + 1.' },
  { states: ['checked', 'target', 'checked'], marker: 1, caption: 'But 3 + 3 does it with only 2 coins. Taking the biggest coin first felt best, and it could not be undone.' },
]

function GreedyVisual() {
  return (
    <IsoLoop
      frames={GREEDY_FRAMES}
      legend={[['found', 'a coin taken (greedy)'], ['target', 'the better answer: two of these']]}
      render={({ states, marker }) => <IsoRow values={COINS} states={states} marker={marker} size={26} ariaLabel="Three coin values: 4, 3 and 1." />}
    />
  )
}

// ------------------------------------------------ backtracking

const N = 4
const attacked = (queens) => {
  const set = new Set()
  queens.forEach(([qr, qc]) => {
    for (let r = qr + 1; r < N; r++) {
      const d = r - qr
      ;[qc, qc - d, qc + d].forEach((c) => {
        if (c >= 0 && c < N) set.add(`${r},${c}`)
      })
    }
  })
  return set
}

const QUEEN_FRAMES = [
  { queens: [[0, 0]], caption: 'Place 4 queens so that none attack each other, one row at a time. Row 0: try the first column. The grey tiles are attacked.' },
  { queens: [[0, 0], [1, 2]], caption: 'Row 1: columns 0 and 1 are attacked. Column 2 is the first safe tile.' },
  { queens: [[0, 0], [1, 2]], dead: true, caption: 'Row 2: every tile is attacked. A dead end, so there is no point going on from here.' },
  { queens: [[0, 0]], caption: 'Backtrack: pick the queen in row 1 back up and try its next column. In the end the first queen has to move as well.' },
  { queens: [[0, 1], [1, 3], [2, 0], [3, 2]], caption: 'Every row has a queen and none attack each other. Only 8 queens were ever placed, not all 256 boards.' },
]

function BacktrackVisual() {
  return (
    <IsoLoop
      frames={QUEEN_FRAMES}
      width={340}
      legend={[['found', 'a queen'], ['closed', 'attacked'], ['wall', 'a row with no safe tile']]}
      render={({ queens, dead }) => {
        const shade = attacked(queens)
        return (
          <IsoGrid
            rows={N}
            cols={N}
            size={27}
            room={12}
            ariaLabel={`A ${N} by ${N} board with queens at ${queens.map(([r, c]) => `row ${r} column ${c}`).join(', ')}.${dead ? ` Row ${queens.length} has no safe square.` : ''}`}
            cell={(r, c) => {
              if (queens.some(([qr, qc]) => qr === r && qc === c)) return { tone: 'found', label: 'Q', lift: 5 }
              if (dead && r === queens.length) return { tone: 'wall' }
              return { tone: shade.has(`${r},${c}`) ? 'closed' : 'plain' }
            }}
          />
        )
      }}
    />
  )
}

// ------------------------------------------------ dynamic programming

const FIB = [0, 1, 1, 2, 3, 5, 8]

const TABLE_FRAMES = [
  { upTo: 1, caption: 'Fill in a list from the left. fib(0) = 0 and fib(1) = 1 are known to begin with.' },
  ...FIB.slice(2).map((value, k) => {
    const i = k + 2
    return {
      upTo: i,
      caption: `fib(${i}) = fib(${i - 1}) + fib(${i - 2}) = ${FIB[i - 1]} + ${FIB[i - 2]} = ${value}. Both are already in the list, so nothing is worked out twice.`,
    }
  }),
  { upTo: FIB.length - 1, done: true, caption: 'fib(6) = 8 took just 5 additions. Each answer is remembered, so no sub-problem is ever repeated.' },
]

function TableVisual() {
  return (
    <IsoLoop
      frames={TABLE_FRAMES}
      legend={[['active', 'the two answers it is built from'], ['found', 'the new answer'], ['checked', 'remembered earlier']]}
      render={({ upTo, done }) => {
        const states = FIB.map((_, i) => (i > upTo ? 'plain' : 'checked'))
        if (!done && upTo >= 2) {
          states[upTo] = 'found'
          states[upTo - 1] = 'active'
          states[upTo - 2] = 'active'
        }
        if (done) states[upTo] = 'found'
        const values = FIB.map((v, i) => (i <= upTo ? v : '?'))
        return <IsoRow values={values} states={states} size={22} ariaLabel={`A list of Fibonacci numbers filled in up to position ${upTo}.`} />
      }}
    />
  )
}

// ------------------------------------------------ randomised

const QS = [5, 2, 9, 1, 7, 3]

const PIVOT_FRAMES = [
  { states: plain(6), lifted: null, caption: 'Quick sort needs a pivot. If it always takes the first number, an already sorted list can force the slow worst case.' },
  { states: paint(6, { target: [4] }), lifted: 4, caption: 'Pick the pivot at random instead. This time it is 7.' },
  { states: paint(6, { active: [0, 1, 3, 5], target: [4], found: [2] }), lifted: 4, caption: 'Smaller numbers go to one side (blue) and bigger ones to the other (green). Then repeat on each side.' },
  { states: paint(6, { active: [0, 1, 3, 5], target: [4], found: [2] }), lifted: 4, caption: 'Nobody can know which number will be picked, so no input can reliably cause the slow case. On average the pieces come out about even.' },
]

function PivotVisual() {
  return (
    <IsoLoop
      frames={PIVOT_FRAMES}
      legend={[['target', 'the random pivot'], ['active', 'smaller than the pivot'], ['found', 'bigger than the pivot']]}
      render={({ states, lifted }) => <IsoRow values={QS} states={states} lifted={lifted} marker={lifted} size={24} ariaLabel={`The numbers ${QS.join(', ')} with a random pivot.`} />}
    />
  )
}

// ------------------------------------------------ two pointers

const SORTED = [1, 3, 4, 6, 8, 11, 15]

const POINTER_FRAMES = [
  { states: plain(7), caption: 'Find two numbers in this sorted list that add up to 14. Put one pointer at each end.' },
  { states: paint(7, { active: [0, 6] }), caption: '1 + 15 = 16 is too big. 15 is too big with anything, so drop 15 and move the right pointer left.' },
  { states: paint(7, { checked: [6], active: [0, 5] }), caption: '1 + 11 = 12 is too small. 1 is too small with anything left, so drop 1 and move the left pointer right.' },
  { states: paint(7, { checked: [0, 6], found: [1, 5] }), caption: '3 + 11 = 14. Found, after 3 checks. Each check threw one number away for good.' },
]

function PointersVisual() {
  return (
    <IsoLoop
      frames={POINTER_FRAMES}
      legend={[['active', 'the two pointers'], ['checked', 'ruled out'], ['found', 'the pair that works']]}
      render={({ states }) => <IsoRow values={SORTED} states={states} size={22} ariaLabel={`The sorted list ${SORTED.join(', ')} with a pointer at each end.`} />}
    />
  )
}

// ------------------------------------------------ sliding window

const WIN = [2, 1, 5, 1, 3, 2, 9, 1, 4]
const sumOf = (from) => WIN.slice(from, from + 3).reduce((a, b) => a + b, 0)

const WINDOW_FRAMES = [
  { states: plain(9), caption: 'Find the biggest sum of 3 numbers in a row. Keep a window of 3 and slide it along.' },
  { states: paint(9, { active: [0, 1, 2] }), caption: `The first window: 2 + 1 + 5 = ${sumOf(0)}.` },
  { states: paint(9, { active: [1, 2, 3] }), caption: `Slide by one: add the new 1, drop the old 2. ${sumOf(0)} + 1 − 2 = ${sumOf(1)}. No need to add three numbers again.` },
  { states: paint(9, { active: [2, 3, 4] }), caption: `Slide again: add 3, drop 1. ${sumOf(1)} + 3 − 1 = ${sumOf(2)}. One addition and one subtraction each time.` },
  { states: paint(9, { found: [4, 5, 6] }), caption: `Window 4 to 6 has the biggest sum so far: 3 + 2 + 9 = ${sumOf(4)}.` },
  { states: paint(9, { found: [4, 5, 6] }), caption: `After the last slide the best is still ${sumOf(4)}. The window slid 6 times, whatever the window size.` },
]

function WindowVisual() {
  return (
    <IsoLoop
      frames={WINDOW_FRAMES}
      legend={[['active', 'the window'], ['found', 'the best window so far']]}
      render={({ states }) => <IsoRow values={WIN} states={states} size={19} ariaLabel={`The numbers ${WIN.join(', ')} with a window of three sliding along.`} />}
    />
  )
}

// ------------------------------------------------ fast and slow pointers

const LIST = ['A', 'B', 'C', 'D', 'E', 'F']
const LOOP_TO = 2
const nextOf = (i) => (i === LIST.length - 1 ? LOOP_TO : i + 1)
const CHASE = (() => {
  const steps = [[0, 0]]
  let [slow, fast] = [0, 0]
  do {
    slow = nextOf(slow)
    fast = nextOf(nextOf(fast))
    steps.push([slow, fast])
  } while (slow !== fast)
  return steps
})()

const CHASE_FRAMES = [
  { at: null, caption: 'A linked list whose last node, F, points back to C: a loop. How can code tell, without remembering every node it has seen?' },
  { at: 0, caption: 'Start two pointers at the head. The slow one moves 1 step at a time, the fast one moves 2.' },
  ...CHASE.slice(1).map(([slow, fast], k) => ({
    at: k + 1,
    caption: slow === fast
      ? `Slow and fast are both on ${LIST[slow]}: they met, so there is a loop. The fast pointer went round and caught up from behind.`
      : `Step ${k + 1}: slow moves to ${LIST[slow]} and fast moves to ${LIST[fast]}.${k === 1 ? ' Both are in the loop now, and fast gains one node on slow every step.' : ''}`,
  })),
  { at: CHASE.length - 1, caption: 'With no loop, fast would reach the end first. So meeting means a loop, and the check only needs two pointers: O(1) memory.' },
]

function ChaseVisual() {
  const s = 22
  const h = s * 0.62
  const at = (i) => ({ px: 38 + i * 38, py: 66 + i * 21 })
  return (
    <IsoLoop
      frames={CHASE_FRAMES}
      width={340}
      legend={[['active', 'slow: one step at a time'], ['target', 'fast: two steps'], ['found', 'where they met']]}
      render={({ at: frame }) => {
        const [slow, fast] = frame === null ? [null, null] : CHASE[frame]
        const met = slow !== null && slow === fast
        const first = at(5)
        const last = at(LOOP_TO)
        return (
          <svg viewBox="0 0 270 200" role="img" aria-label={`A linked list A to F where F points back to C.${slow !== null ? ` Slow is on ${LIST[slow]} and fast is on ${LIST[fast]}.` : ''}`}>
            <path d={`M${first.px},${first.py - h - 6} C${first.px},${first.py - 80} ${last.px},${last.py - 80} ${last.px},${last.py - h - 12}`} fill="none" stroke="#9a9a97" strokeWidth="1.6" strokeDasharray="4 3" />
            <polygon points={`${last.px},${last.py - h - 6} ${last.px - 5},${last.py - h - 15} ${last.px + 5},${last.py - h - 15}`} fill="#9a9a97" />
            {LIST.map((name, i) => {
              const { px, py } = at(i)
              const tone = met && i === slow ? 'found' : i === slow ? 'active' : i === fast ? 'target' : 'plain'
              return <IsoCube key={name} px={px} py={py} s={s} h={h} tone={tone} label={name} labelSize={12} />
            })}
            {slow !== null && (
              <>
                {met ? (
                  <text x={at(slow).px} y={at(slow).py - h - 28} fontSize="11" fontWeight="700" textAnchor="middle" fill="#237a35">slow + fast</text>
                ) : (
                  <>
                    <text x={at(slow).px} y={at(slow).py - h - 28} fontSize="11" fontWeight="700" textAnchor="middle" fill="#2d4f9e">slow</text>
                    <text x={at(fast).px} y={at(fast).py - h - 28} fontSize="11" fontWeight="700" textAnchor="middle" fill="#b8620a">fast</text>
                  </>
                )}
              </>
            )}
          </svg>
        )
      }}
    />
  )
}

// ------------------------------------------------ merge intervals

const SLOTS = span(0, 9)

const MERGE_FRAMES = [
  { states: plain(10), caption: 'Meetings on a timeline of 10 slots: A is slots 1 to 3, B is 2 to 6 and C is 8 to 9. Sorted by start. Which ones overlap?' },
  { states: paint(10, { active: span(1, 3) }), caption: 'Start with the first meeting, A: slots 1 to 3.' },
  { states: paint(10, { active: [1], target: span(4, 6), found: [2, 3] }), caption: 'B starts at slot 2, before A ends at 3. They overlap (green), so they can be merged.' },
  { states: paint(10, { found: span(1, 6) }), caption: 'Merge them into one meeting: the start of the first and the later of the two ends. Slots 1 to 6.' },
  { states: paint(10, { found: span(1, 6), active: [8, 9] }), caption: 'C starts at slot 8, after the merged meeting ended at 6. No overlap, so it stays a separate meeting.' },
]

function MergeVisual() {
  return (
    <IsoLoop
      frames={MERGE_FRAMES}
      legend={[['active', 'a meeting'], ['target', 'an overlapping meeting'], ['found', 'merged']]}
      render={({ states }) => <IsoRow values={SLOTS} states={states} size={19} ariaLabel="A timeline of 10 time slots with meetings being merged." />}
    />
  )
}

// ------------------------------------------------ cyclic sort

const CYCLIC_FRAMES = [
  { values: [4, 0, 3, 1], states: plain(4), caption: 'The numbers 0 to 4 with one missing. Put each number at the position with its own number, by swapping.' },
  { values: [4, 0, 3, 1], states: paint(4, { target: [0] }), caption: 'Position 0 holds 4, but there is no position 4 in a list of 4. Leave it and move on.' },
  { values: [0, 4, 3, 1], states: paint(4, { found: [0], active: [1] }), caption: 'Position 1 holds 0, which belongs at position 0. Swap them: 0 is home.' },
  { values: [0, 4, 1, 3], states: paint(4, { found: [0, 3], active: [2] }), caption: 'Position 2 holds 3, which belongs at position 3. Swap: 3 is home.' },
  { values: [0, 1, 4, 3], states: paint(4, { found: [0, 1, 3], target: [2] }), caption: 'Position 2 now holds 1, which belongs at position 1. Swap: 1 is home.' },
  { values: [0, 1, 4, 3], states: paint(4, { found: [0, 1, 3], target: [2] }), marker: 2, caption: 'Position 2 holds 4 instead of 2, so 2 is the missing number. Every swap sent one number home for good: O(n), no extra memory.' },
]

function CyclicVisual() {
  return (
    <IsoLoop
      frames={CYCLIC_FRAMES}
      legend={[['found', 'a number in its place'], ['active', 'the number being sent home'], ['target', 'a number with no home']]}
      render={({ values, states, marker }) => <IsoRow values={values} states={states} marker={marker ?? null} size={30} ariaLabel={`The list ${values.join(', ')}.`} />}
    />
  )
}

// ------------------------------------------------ two heaps

const HEAP_FRAMES = [
  { small: [5], large: [], caption: 'Add 5. The smaller half (a max-heap) holds 5, and the larger half is empty. The median is 5.' },
  { small: [2], large: [5], caption: 'Add 2. The halves are rebalanced: 2 on the left, 5 on the right. The median is halfway between the two tops: (2 + 5) / 2 = 3.5.' },
  { small: [2, 5], large: [8], caption: 'Add 8. Now 5 is the biggest of the smaller half and 8 is the smallest of the larger half. The left top is the median: 5.' },
  { small: [1, 2], large: [8, 5], caption: 'Add 1. The median is between the tops again: (2 + 5) / 2 = 3.5.' },
  { small: [1, 2, 5], large: [9, 8], caption: 'Add 9. The left has one more, so its top is the median: 5. Each add costs O(log n), and reading the median is O(1).' },
]

function HeapsVisual() {
  const size = 34
  const tower = (list) => list.map((value, k) => [String(value), k === list.length - 1 ? 'target' : 'plain'])
  return (
    <IsoLoop
      frames={HEAP_FRAMES}
      width={340}
      legend={[['target', 'the top of a heap: a middle value (biggest of the smaller half, smallest of the larger half)']]}
      render={({ small, large }) => (
        <svg viewBox="0 0 300 192" role="img" aria-label={`The smaller half holds ${small.join(', ')} and the larger half holds ${large.join(', ')}.`}>
          <Tower x={108} baseY={148} cubes={tower(small)} size={size} side="left" />
          <Tower x={192} baseY={148} cubes={tower(large)} size={size} />
          <text x="108" y="182" fontSize="11" textAnchor="middle" fill="var(--text)">smaller half</text>
          <text x="192" y="182" fontSize="11" textAnchor="middle" fill="var(--text)">larger half</text>
        </svg>
      )}
    />
  )
}

// ------------------------------------------------ kth element

const STREAM = [3, 2, 1, 5, 6, 4]

const KTH_FRAMES = [
  { states: plain(6), caption: 'Find the 2nd largest number. Keep a heap of just the 2 biggest numbers seen so far, never the whole list.' },
  { states: paint(6, { found: [0, 1] }), caption: 'Start with the first two: 3 and 2.' },
  { states: paint(6, { found: [0, 1], checked: [2] }), caption: '1 is not bigger than the smallest one kept (2), so skip it.' },
  { states: paint(6, { found: [0, 3], checked: [1, 2] }), caption: '5 beats the smallest kept (2): swap them. Kept: 3 and 5.' },
  { states: paint(6, { found: [3, 4], checked: [0, 1, 2] }), caption: '6 beats the smallest kept (3): swap. Kept: 5 and 6.' },
  { states: paint(6, { found: [3, 4], checked: [0, 1, 2, 5] }), caption: '4 does not beat 5: skip it.' },
  { states: paint(6, { target: [3], found: [4], checked: [0, 1, 2, 5] }), marker: 3, caption: 'The smallest number kept is the answer: 5 is the 2nd largest. The heap never held more than 2 numbers: O(n log k).' },
]

function KthVisual() {
  return (
    <IsoLoop
      frames={KTH_FRAMES}
      legend={[['found', 'kept in the heap'], ['checked', 'thrown away or skipped'], ['target', 'the answer']]}
      render={({ states, marker }) => <IsoRow values={STREAM} states={states} marker={marker ?? null} size={24} ariaLabel={`The numbers ${STREAM.join(', ')} being read, keeping the 2 biggest.`} />}
    />
  )
}

// ------------------------------------------------ multi-threaded

const TASK_TONES = ['found', 'start', 'goal', 'target']

const THREAD_FRAMES = [
  { mode: 'one', done: 0, caption: 'Four downloads, each of which spends 2 time units waiting for the network. One worker does them one after another: each tile is one time unit.' },
  { mode: 'one', done: 2, caption: 'The first download waits for 2 units. Nothing else can start while the worker is waiting.' },
  { mode: 'one', done: 8, caption: 'One after another, the four waits add up: 8 time units in all.' },
  { mode: 'many', caption: 'With four threads, all four downloads wait at the same time, one per row: 2 time units in all. The work is the same, but the waiting overlaps.' },
]

function ThreadsVisual() {
  const lane = (r, c) => ({ tone: TASK_TONES[r], label: c === 0 ? String(r + 1) : '' })
  return (
    <IsoLoop
      frames={THREAD_FRAMES}
      width={340}
      legend={[[null, 'each colour is one download, each tile one time unit']]}
      render={({ mode, done }) => (
        <Swap index={mode === 'one' ? 0 : 1}>
          {[
            <IsoGrid key="one" rows={1} cols={8} size={20} room={8} ariaLabel="One worker doing four downloads one after another, taking 8 time units." cell={(_, c) => (c < (done ?? 0) ? { tone: TASK_TONES[Math.floor(c / 2)], label: c % 2 === 0 ? String(c / 2 + 1) : '' } : { tone: 'plain' })} />,
            <IsoGrid key="many" rows={4} cols={2} size={20} room={8} ariaLabel="Four threads doing four downloads at the same time, taking 2 time units." cell={lane} />,
          ]}
        </Swap>
      )}
    />
  )
}

export {
  BruteVisual,
  StackVisual,
  DivideVisual,
  GreedyVisual,
  BacktrackVisual,
  TableVisual,
  PivotVisual,
  PointersVisual,
  WindowVisual,
  ChaseVisual,
  MergeVisual,
  CyclicVisual,
  HeapsVisual,
  KthVisual,
  ThreadsVisual,
}
