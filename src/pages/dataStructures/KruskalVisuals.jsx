import GraphView, { edgeKey } from '../../components/GraphView.jsx'
import { PRIM_GRAPH, edgeBetween, kruskalRun, primRounds } from './graphData.js'
import { GraphFrames } from './GraphFrames.jsx'
import { StepDots, useLoop } from './loopHooks.jsx'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'

const G = PRIM_GRAPH
const RUN = kruskalRun(G)

const cable = ({ from, to, weight }) => `${from}–${to} (${weight})`
const keyOf = ({ from, to }) => edgeKey(edgeBetween(G, from, to))
const markEdges = (edges, state, into = {}) => {
  edges.forEach((edge) => {
    into[keyOf(edge)] = state
  })
  return into
}

// ------------------------------------------------ the whole run

// One frame before the loop starts, one for each edge looked at, one at the end.
const FRAMES = [
  {
    caption: 'Step one: sort every edge, cheapest first. Then go down the list, keeping an edge unless it would close a loop.',
    colours: {},
    tree: [],
    rejected: [],
    current: null,
    outcome: null,
  },
  ...RUN.rounds.map((round, i) => ({
    caption: round.kept
      ? `${cable(round.edge)}: ${round.edge.from} and ${round.edge.to} are in different groups, so keep it. The two groups become one.`
      : `${cable(round.edge)}: ${round.edge.from} and ${round.edge.to} are already in the same group. Keeping it would close a loop, so skip it.`,
    colours: round.colours,
    tree: round.tree,
    rejected: RUN.rounds.slice(0, i).filter((r) => !r.kept).map((r) => r.edge),
    current: round.edge,
    outcome: round.kept ? 'keep' : 'skip',
  })),
  {
    caption: `Done after ${RUN.tree.length} edges: every node is joined, for a total cost of ${RUN.total}. The last ${RUN.sorted.length - RUN.rounds.length} edges in the list were never even looked at.`,
    colours: RUN.rounds[RUN.rounds.length - 1].colours,
    tree: RUN.tree,
    rejected: RUN.rounds.filter((r) => !r.kept).map((r) => r.edge),
    current: null,
    outcome: null,
  },
]

// How one chip in the sorted list looks in a frame.
function chipState(frame, edge, i) {
  if (frame.current === edge) return frame.outcome === 'skip' ? 'skip' : 'now'
  if (frame.tree.includes(edge)) return 'kept'
  if (frame.rejected.includes(edge)) return 'skip'
  return i >= RUN.rounds.length && frame === FRAMES[FRAMES.length - 1] ? 'unseen' : ''
}

// Kruskal from the start to the end, with the sorted list of edges underneath.
function RoundsVisual() {
  const [tick, setTick] = useLoop(FRAMES.length, 4200)
  const frame = FRAMES[tick]
  const edgeStates = markEdges(frame.rejected, 'dim')
  markEdges(frame.tree, 'found', edgeStates)
  if (frame.current) edgeStates[keyOf(frame.current)] = frame.outcome === 'skip' ? 'bad' : 'active'

  return (
    <div className="visual-card">
      <GraphView
        graph={G}
        directed={false}
        nodeStates={frame.colours}
        edgeStates={edgeStates}
        ariaLabel="Kruskal's algorithm on seven towns joined by cables with costs. The edges are sorted from cheapest to dearest and kept unless they would join two nodes that are already in the same group. It keeps D to E, E to F, G to B, A to G, B to C and C to D, for a total cost of 23, and skips A to B and G to C."
      />
      <ul className="kr-chips" aria-label="The edges, cheapest first">
        {RUN.sorted.map((edge, i) => (
          <li key={keyOf(edge)} className={`kr-chip ${chipState(frame, edge, i)}`} style={{ listStyle: 'none' }}>{cable(edge)}</li>
        ))}
      </ul>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> kept</li>
        <li><span className="swatch" style={{ background: BLUE }} /> being looked at</li>
        <li><span className="swatch" style={{ background: '#f2a5a5' }} /> skipped: it would close a loop</li>
        <li>node colours: nodes that are already joined into one group</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ the loop test

const HALF = RUN.rounds[4] // five edges kept: two groups
const edgeAB = edgeBetween(G, 'A', 'B')
const edgeCD = edgeBetween(G, 'C', 'D')
const HALF_EDGES = markEdges(HALF.tree, 'found')
const LAST = RUN.rounds[RUN.rounds.length - 1]

const TEST = [
  {
    caption: 'Part way through. Two groups so far: A, B, C and G (blue), and D, E and F (orange). Every edge asks one question: are my two ends in the same group?',
    nodes: HALF.colours,
    edges: HALF_EDGES,
  },
  {
    caption: 'A–B (6): both ends are in the blue group. Keeping it would close a loop, so Kruskal skips it.',
    nodes: HALF.colours,
    edges: markEdges([edgeAB], 'bad', { ...HALF_EDGES }),
  },
  {
    caption: 'C–D (8): C is in the blue group and D is in the orange one. Different groups, so this edge joins them.',
    nodes: HALF.colours,
    edges: markEdges([edgeCD], 'active', { ...HALF_EDGES }),
  },
  {
    caption: 'Now there is just one group: every node is joined, with the cheapest set of edges.',
    nodes: LAST.colours,
    edges: markEdges(LAST.tree, 'found'),
  },
]

// The only test Kruskal needs: same group, or different groups?
function LoopTestVisual() {
  return (
    <GraphFrames
      frames={TEST}
      graph={G}
      ms={4400}
      ariaLabel="With two groups joined so far, the edge A to B has both ends in the blue group and would close a loop, so it is skipped. The edge C to D joins the blue group to the orange group, so it is kept, and everything is then one group."
    />
  )
}

// ------------------------------------------------ Kruskal or Prim?

const PRIM_THREE = primRounds(G, 'A').rounds[2]
const KRUSKAL_THREE = RUN.rounds[2]

// The same graph, after three edges, grown the two ways.
function VersusVisual() {
  const panels = [
    {
      title: 'Prim after 3 edges',
      sub: 'one tree, growing outwards from A',
      nodes: Object.fromEntries(PRIM_THREE.tree.map((id) => [id, 'found'])),
      edges: markEdges(PRIM_THREE.treeEdges, 'found'),
      list: PRIM_THREE.treeEdges,
    },
    {
      title: 'Kruskal after 3 edges',
      sub: 'separate groups that join up later',
      nodes: KRUSKAL_THREE.colours,
      edges: markEdges(KRUSKAL_THREE.tree, 'found'),
      list: KRUSKAL_THREE.tree,
    },
  ]

  return (
    <div className="visual-card">
      <div className="tree-pair">
        {panels.map(({ title, sub, nodes, edges, list }) => (
          <figure key={title}>
            <GraphView
              graph={G}
              directed={false}
              r={15}
              nodeStates={nodes}
              edgeStates={edges}
              ariaLabel={`${title}: it has kept ${list.map(cable).join(', ')}.`}
            />
            <figcaption>
              {title}
              <span>{sub}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ul className="visual-legend">
        <li>both end with the same tree, cost {RUN.total}, but Prim always has one tree and Kruskal starts with many small ones</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ cost

// How much of the work is which, counted from the real run.
function WorkVisual() {
  const e = G.edges.length
  const rows = [
    { label: `Edges sorted: all E = ${e}`, value: e, color: YELLOW, stroke: '#b8912a' },
    { label: `Edges looked at before stopping: ${RUN.rounds.length}`, value: RUN.rounds.length, color: BLUE, stroke: '#2d4f9e' },
    { label: `Edges kept: V − 1 = ${RUN.tree.length}`, value: RUN.tree.length, color: GREEN, stroke: '#237a35' },
  ]
  const scale = 300 / e

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label={`Kruskal's algorithm on this graph sorts all ${e} edges, looks at only ${RUN.rounds.length} of them before it has enough, and keeps ${RUN.tree.length}.`}
      >
        {rows.map(({ label, value, color, stroke }, i) => {
          const y = 6 + i * 48
          return (
            <g key={label}>
              <text x="4" y={y + 12} fontSize="11.5" fill="var(--text-h)">{label}</text>
              <rect x="4" y={y + 18} width={value * scale} height="16" rx="3" fill={color} stroke={stroke} strokeWidth="0.8" />
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>the sort is the big cost: <code>O(E log E)</code>, the same as <code>O(E log V)</code>. The loop after it is almost free.</li>
      </ul>
    </div>
  )
}

export { RoundsVisual, LoopTestVisual, VersusVisual, WorkVisual }
