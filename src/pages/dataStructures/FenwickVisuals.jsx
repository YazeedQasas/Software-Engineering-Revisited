import FenwickView, { Bits } from '../../components/FenwickView.jsx'
import TreeView from '../../components/TreeView.jsx'
import { BASE, bitLength, coverOf, coverText, fenSnapshot, fenTree, layoutFen, lowbit, queryPath, sumTo, updatePath } from './fenData.js'
import { StepDots, useLoop } from './loopHooks.jsx'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const RED = '#f2a5a5'

const N = BASE.length
const TREE = fenTree(BASE)
const BITS = bitLength(2 * N)

const positions = (from, to) => Array.from({ length: to - from + 1 }, (_, k) => from + k)
const paint = (list, state, into = {}) => {
  list.forEach((key) => {
    into[key] = state
  })
  return into
}
const coveredBy = (boxes, state, into = {}) => {
  boxes.forEach((b) => {
    const { from, to } = coverOf(b)
    paint(positions(from, to), state, into)
  })
  return into
}
// ------------------------------------------------ one question, start to end

const UPTO = 7
const QUERY_PATH = queryPath(UPTO) // 7, 6, 4
const QUERY_TOTAL = QUERY_PATH.reduce((a, b) => a + TREE[b], 0)

const QUERY_FRAMES = [
  {
    used: [],
    current: null,
    caption: 'Each bar is a stored sum, as wide as the part of the numbers (the row at the bottom) that it adds up. Bar 6, for example, adds up positions 5 and 6: 9 + 3 = 12.',
  },
  {
    used: [],
    current: UPTO,
    bits: [{ label: 'i', value: UPTO }],
    caption: `We want the sum of the first ${UPTO} numbers. Start with the bar that ends at position ${UPTO}.`,
  },
  ...QUERY_PATH.map((b, k) => {
    const next = QUERY_PATH[k + 1]
    const low = lowbit(b)
    return {
      used: QUERY_PATH.slice(0, k + 1),
      current: null,
      next,
      bits: [{ label: 'i', value: b }, { label: 'i & -i', value: low }, { label: 'next i', value: b - low }],
      caption: `Bar ${b} adds up ${coverText(b)}, so take its sum, ${TREE[b]}. ${next ? `What is left is the first ${next} numbers, which end at bar ${next}.` : 'Nothing is left, so we stop.'}`,
    }
  }),
  {
    used: QUERY_PATH,
    current: null,
    bits: [{ label: 'i', value: 0 }],
    caption: `${QUERY_PATH.map((b) => TREE[b]).join(' + ')} = ${QUERY_TOTAL}. We read ${QUERY_PATH.length} bars instead of ${UPTO} numbers. For a million numbers it would be at most about 20 bars.`,
  },
]

// Asking for the sum of the first 7 numbers. With `bits`, the binary behind
// each jump is shown too.
function QueryVisual({ bits = false }) {
  const [tick, setTick] = useLoop(QUERY_FRAMES.length, 4600)
  const frame = QUERY_FRAMES[tick]
  const states = paint(frame.used, 'found')
  if (frame.current) states[frame.current] = 'active'
  if (frame.next) states[frame.next] = 'queued'
  const cells = coveredBy(frame.used, 'found')

  return (
    <div className="visual-card">
      <FenwickView
        n={N}
        values={BASE}
        tree={TREE}
        states={states}
        cells={cells}
        ariaLabel={`A Fenwick tree over the numbers ${BASE.join(', ')}. Asking for the sum of the first ${UPTO} numbers reads ${QUERY_PATH.length} bars: ${QUERY_PATH.map((b) => `bar ${b} with sum ${TREE[b]}`).join(', ')}. The total is ${QUERY_TOTAL}.`}
      />
      {bits && frame.bits && <Bits rows={frame.bits} width={BITS} />}
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> read: its sum is added</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> the next bar to read</li>
        <li><span className="swatch" style={{ background: BLUE }} /> where we start</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={QUERY_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ who owns what

const OWN_FRAMES = BASE.map((_, k) => {
  const i = k + 1
  const low = lowbit(i)
  const extra = i === 1 ? ' Every odd number ends in 1, so odd bars hold just one number.' : i === N ? ' The biggest bar adds up everything.' : ''
  return {
    i,
    caption: `${i} is ${i.toString(2)} in binary. Its lowest 1 is worth ${low}, so bar ${i} adds up ${low} ${low === 1 ? 'position' : 'positions'}: ${coverText(i)}.${extra}`,
  }
})

// Every bar in turn, with the binary number that decides how wide it is.
function LowbitVisual() {
  const [tick, setTick] = useLoop(OWN_FRAMES.length, 4200)
  const frame = OWN_FRAMES[tick]
  const low = lowbit(frame.i)

  return (
    <div className="visual-card">
      <FenwickView
        n={N}
        values={BASE}
        tree={TREE}
        states={{ [frame.i]: 'active' }}
        cells={coveredBy([frame.i], 'found')}
        ariaLabel={`Bar ${frame.i} adds up ${coverText(frame.i)}. Its number in binary is ${frame.i.toString(2)}, and its lowest 1 is worth ${low}.`}
      />
      <Bits rows={[{ label: 'i', value: frame.i }, { label: 'i & -i', value: low }]} width={BITS} />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: BLUE }} /> the bar we are looking at</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the positions it adds up</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> the lowest 1 in binary</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={OWN_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ changing a number

const [UPOS, UDELTA] = [3, 5]
const UPDATE_PATH = updatePath(UPOS, N) // 3, 4, 8

const UPDATE_FRAMES = (() => {
  const frames = [
    {
      fixed: 0,
      caption: `Add ${UDELTA} to position ${UPOS} (it is ${BASE[UPOS - 1]} now). Which bars add up position ${UPOS}? Bars ${UPDATE_PATH.slice(0, -1).join(', ')} and ${UPDATE_PATH[UPDATE_PATH.length - 1]}. Those are now wrong.`,
    },
  ]
  UPDATE_PATH.forEach((b, k) => {
    const low = lowbit(b)
    const next = b + low
    frames.push({
      fixed: k + 1,
      bits: [{ label: 'i', value: b }, { label: 'i & -i', value: low }, { label: 'next i', value: next }],
      caption: `Bar ${b} adds up ${coverText(b)}, which includes position ${UPOS}: ${TREE[b]} becomes ${TREE[b] + UDELTA}. ${next <= N ? `Add the lowest 1 to jump to the next bar: ${b} + ${low} = ${next}.` : `${b} + ${low} = ${next} is past the last bar, so we stop.`}`,
    })
  })
  frames.push({
    fixed: UPDATE_PATH.length,
    done: true,
    caption: `${UPDATE_PATH.length} of ${N} bars changed. The other ${N - UPDATE_PATH.length} never needed a look. That is why a change is fast.`,
  })
  return frames
})()

// One number changes: every bar over it is fixed, hopping up by the lowest 1.
function UpdateVisual() {
  const [tick, setTick] = useLoop(UPDATE_FRAMES.length, 4400)
  const frame = UPDATE_FRAMES[tick]
  const tree = TREE.map((sum, b) => (UPDATE_PATH.indexOf(b) !== -1 && UPDATE_PATH.indexOf(b) < frame.fixed ? sum + UDELTA : sum))
  const values = BASE.map((v, k) => (k + 1 === UPOS && frame.fixed > 0 ? v + UDELTA : v))
  const states = {}
  UPDATE_PATH.forEach((b, k) => {
    if (k < frame.fixed) states[b] = frame.done || k < frame.fixed - 1 ? 'found' : 'active'
    else states[b] = 'bad'
  })

  return (
    <div className="visual-card">
      <FenwickView
        n={N}
        values={values}
        tree={tree}
        states={states}
        cells={frame.fixed > 0 ? { [UPOS]: 'found' } : { [UPOS]: 'queued' }}
        ariaLabel={`Adding ${UDELTA} to position ${UPOS} in a Fenwick tree. Only the ${UPDATE_PATH.length} bars that add up that position change: ${UPDATE_PATH.join(', ')}.`}
      />
      {frame.bits && <Bits rows={frame.bits} width={BITS} />}
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: YELLOW }} /> the position being changed</li>
        <li><span className="swatch" style={{ background: RED }} /> out of date</li>
        <li><span className="swatch" style={{ background: BLUE }} /> being fixed now</li>
        <li><span className="swatch" style={{ background: GREEN }} /> new sum stored</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={UPDATE_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ any range

const [RL, RR] = [3, 6]
const FIRST_PATH = queryPath(RR) // 6, 4
const SECOND_PATH = queryPath(RL - 1) // 2
const FIRST_SUM = sumTo(BASE, RR)
const SECOND_SUM = sumTo(BASE, RL - 1)

const RANGE_FRAMES = [
  {
    stage: 0,
    caption: `We want the sum of positions ${RL} to ${RR}. But a Fenwick tree only knows sums that start at position 1.`,
  },
  {
    stage: 1,
    caption: `So first take the sum of the first ${RR} numbers. Bars ${FIRST_PATH.join(' and ')} cover them exactly: ${FIRST_PATH.map((b) => TREE[b]).join(' + ')} = ${FIRST_SUM}.`,
  },
  {
    stage: 2,
    caption: `That also counted positions 1 to ${RL - 1}, which we did not want. Take the sum of the first ${RL - 1} numbers: ${SECOND_PATH.map((b) => `bar ${b}`).join(' and ')} gives ${SECOND_SUM}.`,
  },
  {
    stage: 3,
    caption: `${FIRST_SUM} − ${SECOND_SUM} = ${FIRST_SUM - SECOND_SUM}. And positions ${RL} to ${RR} really are ${BASE.slice(RL - 1, RR).join(' + ')} = ${FIRST_SUM - SECOND_SUM}.`,
  },
]

// A range is the first `right` numbers, minus the first `left - 1`.
function RangeVisual() {
  const [tick, setTick] = useLoop(RANGE_FRAMES.length, 4800)
  const { stage, caption } = RANGE_FRAMES[tick]
  const states = {}
  const cells = {}
  if (stage === 0) paint(positions(RL, RR), 'queued', cells)
  if (stage >= 1) {
    paint(FIRST_PATH, 'found', states)
    coveredBy(FIRST_PATH, 'found', cells)
  }
  if (stage >= 2) {
    paint(SECOND_PATH, 'bad', states)
    coveredBy(SECOND_PATH, 'bad', cells)
  }

  return (
    <div className="visual-card">
      <FenwickView
        n={N}
        values={BASE}
        tree={TREE}
        states={states}
        cells={cells}
        ariaLabel={`The sum of positions ${RL} to ${RR} is the sum of the first ${RR} (${FIRST_SUM}) minus the sum of the first ${RL - 1} (${SECOND_SUM}), which is ${FIRST_SUM - SECOND_SUM}.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> added: the first {RR} numbers</li>
        <li><span className="swatch" style={{ background: RED }} /> taken away: the first {RL - 1}</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> the positions we want</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{caption}</p>
      <StepDots count={RANGE_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ the tree in the array

const FOREST_LAYOUT = layoutFen(N)
const FOREST = fenSnapshot(N, FOREST_LAYOUT)
const STARTS = [1, 3, 5, 7]

const FOREST_FRAMES = [
  {
    start: null,
    caption: 'Draw each bar as a node, and join it to the bar above it: bar i hands its changes up to bar i + (i & -i). It is a tree after all, with bar 8, the one that adds up everything, as the root.',
  },
  ...STARTS.map((start) => {
    const path = updatePath(start, N)
    return {
      start,
      path,
      caption: `Changing position ${start} means fixing bar ${start} and every bar above it: ${path.join(', ')}. ${path.length} of ${N} bars.`,
    }
  }),
  {
    start: null,
    caption: 'The tree is only about log n levels tall, so a change never has to fix more than about log n bars: 20 for a million numbers.',
  },
]

// Following the arrows up: the bars a change has to fix.
function TreeVisual() {
  const [tick, setTick] = useLoop(FOREST_FRAMES.length, 4400)
  const frame = FOREST_FRAMES[tick]
  const states = {}
  frame.path?.forEach((b) => {
    states[`b${b}`] = b === frame.start ? 'active' : 'queued'
  })

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={FOREST}
        states={states}
        ariaLabel={`The ${N} bars of a Fenwick tree drawn as a tree. Bar i is joined to bar i + (i & -i) above it, and bar ${N} is the root.${frame.path ? ` Changing position ${frame.start} fixes bars ${frame.path.join(', ')}.` : ''}`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: BLUE }} /> the changed position&rsquo;s own bar</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> bars above it that must be fixed too</li>
        <li>the small label under a bar is the part of the array it adds up</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={FOREST_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ cost

const COUNT = 1000
const LEVELS = Math.ceil(Math.log2(COUNT)) // 10

// Steps for 1000 numbers: a plain loop against the tree.
function WorkVisual() {
  const rows = [
    { label: `Plain loop over a range: up to ${COUNT} additions`, value: COUNT, color: YELLOW, stroke: '#b8912a' },
    { label: `Tree: sum of the first i, at most ${LEVELS} bars`, value: LEVELS, color: GREEN, stroke: '#237a35' },
    { label: `Tree: add to a number, at most ${LEVELS} bars`, value: LEVELS, color: GREEN, stroke: '#237a35' },
  ]
  const scale = 300 / COUNT

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label={`For ${COUNT} numbers, adding up a range with a loop can take ${COUNT} additions. A Fenwick tree reads at most ${LEVELS} bars to answer, and changes at most ${LEVELS} bars to update.`}
      >
        {rows.map(({ label, value, color, stroke }, i) => {
          const y = 6 + i * 48
          return (
            <g key={label}>
              <text x="4" y={y + 12} fontSize="11.5" fill="var(--text-h)">{label}</text>
              <rect x="4" y={y + 18} width={Math.max(value * scale, 3)} height="16" rx="3" fill={color} stroke={stroke} strokeWidth="0.8" />
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>the tree&rsquo;s cost is the number of <em>1s in a binary number</em> (at most log n), not the size of the range.</li>
      </ul>
    </div>
  )
}

export { QueryVisual, LowbitVisual, UpdateVisual, RangeVisual, TreeVisual, WorkVisual }
