import TreeView from '../../components/TreeView.jsx'
import {
  BASE,
  buildSeg,
  decompose,
  fillSeg,
  heightOf,
  layoutSeg,
  makeSeg,
  nodesOf,
  rangeText,
  smaller,
  snapshotSeg,
} from './segData.js'
import { StepDots, useLoop } from './loopHooks.jsx'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const RED = '#f2a5a5'
const GREY = '#e4e4e2'

const FULL = buildSeg(BASE)
const LAYOUT = layoutSeg(FULL)
const TOTAL = FULL.sum

const where = (node) => (node.lo === node.hi ? `position ${node.lo}` : `positions ${node.lo} to ${node.hi}`)
const stateMap = (list, state, into = {}) => {
  list.forEach((n) => {
    into[n.id] = state
  })
  return into
}

// The array as a row of numbered cells; `marked` cells are coloured.
function Cells({ values, marked = {} }) {
  return (
    <div className="cell-row" aria-hidden="true">
      {values.map((value, i) => (
        <span key={i} style={marked[i] ? { background: marked[i] } : undefined}>
          {value}
          <i>{i}</i>
        </span>
      ))}
    </div>
  )
}

// ------------------------------------------------ one query, start to end

const [QL, QR] = [2, 6]
const PARTS = decompose(FULL, QL, QR)
const PICKED_SUM = PARTS.full.reduce((a, n) => a + n.sum, 0)

const coveredBy = (nodes) => {
  const marked = {}
  nodes.forEach((n) => {
    for (let i = n.lo; i <= n.hi; i++) marked[i] = GREEN
  })
  return marked
}

const QUERY_FRAMES = [
  {
    picked: [],
    show: false,
    caption: 'Every node of this tree stores the sum of a range of the array. The root holds the sum of everything. The small label under a node says which positions it covers.',
  },
  {
    picked: [],
    show: true,
    caption: `We want the sum of ${where({ lo: QL, hi: QR })}. Yellow nodes are only partly inside that range, so we look at their children. Grey nodes are completely outside, so we ignore them.`,
  },
  ...PARTS.full.map((node, k) => ({
    picked: PARTS.full.slice(0, k + 1),
    show: true,
    caption: `The node for ${where(node)} is completely inside the range, so use its stored sum, ${node.sum}, without opening it.`,
  })),
  {
    picked: PARTS.full,
    show: true,
    caption: `${PARTS.full.map((n) => n.sum).join(' + ')} = ${PICKED_SUM}. We added up ${PARTS.full.length} stored sums instead of ${QR - QL + 1} separate numbers. For a million numbers it would be about 40 sums, not a million.`,
  },
]

// Asking for the sum of positions 2 to 6.
function QueryVisual() {
  const [tick, setTick] = useLoop(QUERY_FRAMES.length, 4600)
  const frame = QUERY_FRAMES[tick]
  const states = {}
  if (frame.show) {
    stateMap(PARTS.partial, 'queued', states)
    stateMap(PARTS.none, 'checked', states)
    stateMap(frame.picked, 'found', states)
  }

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={snapshotSeg(FULL, LAYOUT)}
        states={states}
        ariaLabel={`A segment tree over the numbers ${BASE.join(', ')}. Each node holds the sum of a range of them. Asking for the sum of positions ${QL} to ${QR} uses ${PARTS.full.length} nodes: ${PARTS.full.map((n) => `positions ${rangeText(n)} with sum ${n.sum}`).join(', ')}. The total is ${PICKED_SUM}.`}
      />
      <Cells values={BASE} marked={frame.show ? coveredBy(frame.picked) : {}} />
      <ul className="kr-chips" aria-label="The stored sums used so far">
        {frame.picked.length === 0 && <li className="kr-chip unseen" style={{ listStyle: 'none' }}>no sums used yet</li>}
        {frame.picked.map((n) => (
          <li key={n.id} className="kr-chip kept" style={{ listStyle: 'none' }}>{n.sum}</li>
        ))}
      </ul>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> inside the range: use its sum</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> partly inside: look at its children</li>
        <li><span className="swatch" style={{ background: GREY }} /> outside: ignore</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={QUERY_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ building it

const BUILD_ROOT = fillSeg(makeSeg(BASE), BASE)
const BUILD_LEVELS = heightOf(BUILD_ROOT) // 3: the leaves, then three levels up

const BUILD_FRAMES = [
  {
    upTo: -1,
    caption: 'An empty tree over eight numbers. Each circle is waiting for the sum of the range under it.',
  },
  ...Array.from({ length: BUILD_LEVELS + 1 }, (_, h) => {
    const fresh = nodesOf(BUILD_ROOT).filter((n) => heightOf(n) === h)
    const sample = fresh[0]
    let caption
    if (h === 0) {
      caption = 'The leaves, along the bottom, are the array itself: one number each.'
    } else if (h === BUILD_LEVELS) {
      caption = `The root adds its two children: ${sample.left.sum} + ${sample.right.sum} = ${sample.sum}. That is the sum of the whole array.`
    } else {
      caption = `One level up, each node adds its two children: ${fresh.map((n) => `${n.left.sum} + ${n.right.sum} = ${n.sum}`).join(', ')}.`
    }
    return { upTo: h, caption }
  }),
]

// Filling the tree from the bottom up.
function BuildVisual() {
  const [tick, setTick] = useLoop(BUILD_FRAMES.length, 4200)
  const frame = BUILD_FRAMES[tick]
  const nodes = nodesOf(BUILD_ROOT)
  const states = {}
  nodes.forEach((n) => {
    const h = heightOf(n)
    if (h === frame.upTo) states[n.id] = 'found'
    else if (h < frame.upTo) states[n.id] = 'checked'
  })

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={snapshotSeg(BUILD_ROOT, LAYOUT, { show: (n) => heightOf(n) <= frame.upTo })}
        states={states}
        ariaLabel={`Building a segment tree over ${BASE.join(', ')} from the bottom up. The leaves copy the array, and each node above holds the sum of its two children. The root ends up holding ${TOTAL}.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> filled in just now</li>
        <li><span className="swatch" style={{ background: GREY }} /> filled in earlier</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={BUILD_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ changing a number

const [UI, UVALUE] = [4, 1]
const UPDATE_ROOT = buildSeg(BASE)
const PATH = nodesOf(UPDATE_ROOT)
  .filter((n) => n.lo <= UI && UI <= n.hi)
  .sort((a, b) => b.index - a.index) // leaf first, root last

// Frame k: the leaf is new and the first k ancestors have been fixed.
const UPDATE_FRAMES = (() => {
  const values = BASE.slice()
  values[UI] = UVALUE
  const after = buildSeg(values)
  const oldOf = Object.fromEntries(nodesOf(UPDATE_ROOT).map((n) => [n.id, n.sum]))
  const newOf = Object.fromEntries(nodesOf(after).map((n) => [n.id, n.sum]))
  const frames = [
    { fixed: 0, caption: `Change ${where({ lo: UI, hi: UI })} from ${BASE[UI]} to ${UVALUE}. Which sums does that make wrong?` },
  ]
  for (let k = 1; k <= PATH.length; k++) {
    const node = PATH[k - 1]
    frames.push({
      fixed: k,
      caption:
        k === 1
          ? `The leaf is overwritten. Now the ${PATH.length - 1} nodes above it (red) are out of date, because each one covers position ${UI}.`
          : `Node ${rangeText(node)} adds its two children again: ${oldOf[node.id]} becomes ${newOf[node.id]}.${k === PATH.length ? ' The root is right again.' : ''}`,
    })
  }
  frames.push({
    fixed: PATH.length,
    caption: `${PATH.length} of ${nodesOf(UPDATE_ROOT).length} nodes changed, one per level. The other ${nodesOf(UPDATE_ROOT).length - PATH.length} were never touched. That is why an update is fast.`,
    done: true,
  })
  return { frames, newOf, oldOf }
})()

// One number changes: the nodes above it are fixed on the way up.
function UpdateVisual() {
  const [tick, setTick] = useLoop(UPDATE_FRAMES.frames.length, 4400)
  const frame = UPDATE_FRAMES.frames[tick]
  const { newOf } = UPDATE_FRAMES
  const states = {}
  PATH.forEach((node, idx) => {
    if (frame.fixed === 0) return
    if (idx < frame.fixed) states[node.id] = frame.done ? 'found' : idx === frame.fixed - 1 ? 'active' : 'found'
    else states[node.id] = 'bad'
  })
  const tree = snapshotSeg(UPDATE_ROOT, LAYOUT)
  tree.nodes.forEach((node) => {
    const idx = PATH.findIndex((n) => n.id === node.id)
    if (idx !== -1 && idx < frame.fixed) node.label = String(newOf[node.id])
  })

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={tree}
        states={states}
        ariaLabel={`Changing position ${UI} from ${BASE[UI]} to ${UVALUE} in a segment tree. Only the ${PATH.length} nodes that cover that position change, from the leaf up to the root.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: RED }} /> out of date</li>
        <li><span className="swatch" style={{ background: BLUE }} /> being fixed now</li>
        <li><span className="swatch" style={{ background: GREEN }} /> new sum stored</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={UPDATE_FRAMES.frames.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ the same tree, another question

const MIN_ROOT = buildSeg(BASE, smaller)

// The same shape holding sums and holding smallest values.
function SameTreeVisual() {
  const panels = [
    { root: FULL, title: 'Each node holds the sum of its range', note: 'combine two children with +' },
    { root: MIN_ROOT, title: 'Each node holds the smallest of its range', note: 'combine two children with min' },
  ]

  return (
    <div className="visual-card">
      {panels.map(({ root, title, note }) => (
        <figure key={title} style={{ margin: '0 0 8px' }}>
          <TreeView
            className="trie-view"
            tree={snapshotSeg(root, LAYOUT)}
            states={{ n1: 'found' }}
            ariaLabel={`${title}. The root holds ${root.sum}.`}
          />
          <figcaption style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-h)' }}>
            {title}
            <span style={{ display: 'block', fontSize: 12, color: 'var(--text)' }}>{note}</span>
          </figcaption>
        </figure>
      ))}
      <ul className="visual-legend">
        <li>same numbers, same shape, same code. Only the way two children are combined changes (and what an empty range gives back: 0 for a sum, infinity for a minimum).</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ cost

const N = 1000
const LEVELS = Math.ceil(Math.log2(N)) // 10

// Steps for n = 1000 numbers: a plain loop against the tree.
function WorkVisual() {
  const rows = [
    { label: `Plain loop over a range: up to ${N} additions`, value: N, color: YELLOW, stroke: '#b8912a' },
    { label: `Tree query: at most about 2 × ${LEVELS} = ${2 * LEVELS} stored sums`, value: 2 * LEVELS, color: GREEN, stroke: '#237a35' },
    { label: `Tree update: ${LEVELS + 1} nodes, one per level`, value: LEVELS + 1, color: GREEN, stroke: '#237a35' },
  ]
  const scale = 300 / N

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label={`For ${N} numbers, adding up a range with a loop can take ${N} additions. A segment tree query uses at most about ${2 * LEVELS} stored sums, and an update changes ${LEVELS + 1} nodes.`}
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
        <li>the tree&rsquo;s cost grows with the <em>number of levels</em> (log n), not with the size of the range.</li>
      </ul>
    </div>
  )
}

export { QueryVisual, BuildVisual, UpdateVisual, SameTreeVisual, WorkVisual }
