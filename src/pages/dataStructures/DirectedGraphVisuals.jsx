import GraphView, { GraphStore } from '../../components/GraphView.jsx'
import { FOLLOWS, TASKS, adjacencyList, adjacencyMatrix } from './graphData.js'
import { StepDots, useLoop } from './loopHooks.jsx'

const E = (from, to) => `${from}>${to}`
const ALL = FOLLOWS.edges.map((edge) => E(edge.from, edge.to))

// The opening animation. Each frame shows some of the edges, lights some of
// them up, and says one short thing.
const INTRO = [
  {
    caption: 'These dots are nodes. Think of each one as a person.',
    show: [],
    nodes: { 0: 'queued', 1: 'queued', 2: 'queued', 3: 'queued', 4: 'queued', 5: 'queued' },
  },
  {
    caption: 'A line between two nodes is an edge. This arrow means: 0 follows 1.',
    show: [E(0, 1)],
    edges: { [E(0, 1)]: 'active' },
    nodes: { 0: 'active', 1: 'queued' },
  },
  {
    caption: 'The arrow points one way. 1 does not follow 0 back.',
    show: [E(0, 1)],
    ghost: [{ from: '1', to: '0' }],
    edges: { [E(1, 0)]: 'ghost' },
  },
  {
    caption: 'Two arrows, one each way, mean 1 and 2 follow each other.',
    show: [E(0, 1), E(1, 2), E(2, 1)],
    edges: { [E(1, 2)]: 'active', [E(2, 1)]: 'active' },
    nodes: { 1: 'active', 2: 'active' },
  },
  {
    caption: 'A path follows the arrows: 0, then 1, then 4, then 5.',
    show: ALL,
    edges: { [E(0, 1)]: 'found', [E(1, 4)]: 'found', [E(4, 5)]: 'found' },
    nodes: { 0: 'found', 1: 'found', 4: 'found', 5: 'found' },
  },
  {
    caption: 'Follow 1, 4, 5, 2 and you are back at 1. That loop is called a cycle.',
    show: ALL,
    edges: { [E(1, 4)]: 'bad', [E(4, 5)]: 'bad', [E(5, 2)]: 'bad', [E(2, 1)]: 'bad' },
    nodes: { 1: 'bad', 4: 'bad', 5: 'bad', 2: 'bad' },
  },
]

// Nodes, one-way edges, paths and cycles in six short frames.
function GraphIntroVisual() {
  const [tick, setTick] = useLoop(INTRO.length, 2600)
  const frame = INTRO[tick]
  const edges = [
    ...FOLLOWS.edges.filter((edge) => frame.show.includes(E(edge.from, edge.to))),
    ...(frame.ghost ?? []),
  ]

  return (
    <div className="visual-card">
      <GraphView
        graph={FOLLOWS}
        edges={edges}
        nodeStates={frame.nodes}
        edgeStates={frame.edges}
        ariaLabel="A graph of six people, 0 to 5, and who follows whom. Its edges are one-way arrows."
      />
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={INTRO.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// The same graph, and the two ways of writing it down, lit up one edge at a time.
function GraphStorageVisual() {
  const edges = FOLLOWS.edges
  const [tick] = useLoop(edges.length + 1, 1400)
  const active = tick < edges.length ? tick : null
  const adj = adjacencyList(FOLLOWS)
  const matrix = adjacencyMatrix(FOLLOWS)

  let hot = {}
  const edgeStates = {}
  const nodeStates = {}
  if (active !== null) {
    const { from, to } = edges[active]
    edgeStates[E(from, to)] = 'active'
    nodeStates[from] = 'active'
    nodeStates[to] = 'queued'
    hot = { chip: [from, adj[from].indexOf(to)], cell: [Number(from), Number(to)] }
  }

  return (
    <div className="visual-card">
      <div className="graph-split">
        <GraphView
          graph={FOLLOWS}
          nodeStates={nodeStates}
          edgeStates={edgeStates}
          ariaLabel="The graph of six people. Each edge lights up in turn, and the same edge lights up in the list and in the grid beside it."
        />
        <GraphStore graph={FOLLOWS} adj={adj} matrix={matrix} hot={hot} />
      </div>
      <ul className="visual-legend">
        <li>watch one edge light up in all three places: the drawing, the list and the grid</li>
      </ul>
    </div>
  )
}

const LOOP = {
  width: 300,
  height: 200,
  nodes: [
    { id: '0', x: 60, y: 44 },
    { id: '1', x: 240, y: 44 },
    { id: '2', x: 240, y: 156 },
    { id: '3', x: 60, y: 156 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '0' },
  ],
}

// A cycle (round and round forever) beside a graph with no cycle at all.
function GraphLoopsVisual() {
  const [tick] = useLoop(LOOP.edges.length, 900)
  const edge = LOOP.edges[tick]
  const loopEdges = { [E(edge.from, edge.to)]: 'bad' }
  const loopNodes = { [edge.to]: 'bad' }

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <figure>
          <GraphView
            graph={LOOP}
            edgeStates={loopEdges}
            nodeStates={loopNodes}
            ariaLabel="Four nodes joined in a ring by arrows: 0 to 1 to 2 to 3 and back to 0. Following the arrows brings you back to where you started."
          />
          <figcaption>
            A cycle
            <span>follow the arrows and you come back to the start</span>
          </figcaption>
        </figure>
        <figure>
          <GraphView
            graph={TASKS}
            nodeStates={{ 0: 'found' }}
            ariaLabel="Six tasks joined by arrows. Task 0 comes first, then 1 and 2, then 3, then 4 and 5. No path ever leads back to an earlier task."
          />
          <figcaption>
            No cycle
            <span>every path ends somewhere. This is the shape of &ldquo;do this before that&rdquo;</span>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

const DIRECTED_SCENES = [
  { title: 'A spread-out graph: 100 nodes, 150 edges', matrix: 10000, list: 250 },
  { title: 'A crowded graph: 100 nodes, 9,900 edges', matrix: 10000, list: 10000 },
]

// How much each way of storing a graph has to write down. `scenes` says how
// many entries the grid and the list need in each case; `note` is the caption.
function GraphSizeVisual({
  scenes = DIRECTED_SCENES,
  note = 'entries written down. The list needs one per node plus one per edge; the grid needs one per pair of nodes.',
  alt = 'How many entries each way of storing a graph needs. For 100 nodes and 150 edges, the grid needs 10,000 cells but the list only about 250 entries. For 100 nodes and 9,900 edges, where almost everyone points at everyone, the grid and the list both need about 10,000.',
}) {
  const scale = 250 / 10000

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 196"
        role="img"
        aria-label={alt}
      >
        {scenes.map(({ title, matrix, list }, i) => {
          const y = 6 + i * 96
          return (
            <g key={title}>
              <text x="4" y={y + 12} fontSize="11.5" fontWeight="600" fill="var(--text-h)">{title}</text>
              <text x="4" y={y + 36} fontSize="11" fill="var(--text)">grid</text>
              <rect x="40" y={y + 25} width={Math.max(2, matrix * scale)} height="14" rx="3" fill="#ffe27a" stroke="#b8912a" strokeWidth="0.8" />
              <text x={40 + matrix * scale + 6} y={y + 36} fontSize="11" fontWeight="700" fill="var(--text-h)">{matrix.toLocaleString()}</text>
              <text x="4" y={y + 62} fontSize="11" fill="var(--text)">list</text>
              <rect x="40" y={y + 51} width={Math.max(2, list * scale)} height="14" rx="3" fill="#8aa8ea" stroke="#2d4f9e" strokeWidth="0.8" />
              <text x={40 + list * scale + 6} y={y + 62} fontSize="11" fontWeight="700" fill="var(--text-h)">{list.toLocaleString()}</text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>{note}</li>
      </ul>
    </div>
  )
}

export { GraphIntroVisual, GraphStorageVisual, GraphLoopsVisual, GraphSizeVisual }
