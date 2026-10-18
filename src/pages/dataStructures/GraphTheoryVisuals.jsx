import GraphView from '../../components/GraphView.jsx'
import { KONIGSBERG } from './graphData.js'
import { StepDots, useLoop } from './loopHooks.jsx'

// ------------------------------------------------ the seven bridges

// The map: four pieces of land (green) in a river (blue), joined by seven bridges.
function KonigsbergMap() {
  const bridge = (x1, y1, x2, y2) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6b4e2a" strokeWidth="9" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b08a56" strokeWidth="5" />
    </g>
  )
  const land = { fill: '#d6e6c4', stroke: '#9bb584', strokeWidth: 1.5 }

  return (
    <svg className="graph-map" viewBox="0 0 360 240" aria-hidden="true">
      <rect x="0" y="0" width="360" height="240" rx="8" fill="#cfe3f5" />
      <rect x="10" y="8" width="340" height="52" rx="12" {...land} />
      <rect x="10" y="180" width="340" height="52" rx="12" {...land} />
      <ellipse cx="170" cy="120" rx="62" ry="32" {...land} />
      <rect x="270" y="84" width="80" height="72" rx="12" {...land} />
      {bridge(150, 58, 150, 92)}
      {bridge(192, 58, 190, 90)}
      {bridge(150, 182, 150, 149)}
      {bridge(192, 182, 190, 151)}
      {bridge(300, 58, 310, 86)}
      {bridge(300, 182, 310, 154)}
      {bridge(230, 120, 272, 120)}
      <g fontSize="10.5" fill="#4d6340" fontWeight="600">
        <text x="24" y="38">North bank</text>
        <text x="24" y="210">South bank</text>
        <text x="170" y="146" textAnchor="middle">Island</text>
        <text x="310" y="148" textAnchor="middle">East</text>
      </g>
    </svg>
  )
}

const DEGREES = { N: '3', I: '5', S: '3', E: '3' }
const ALL_BRIDGES = KONIGSBERG.edges
const AT_ISLAND = Object.fromEntries(ALL_BRIDGES.filter((e) => e.from === 'I' || e.to === 'I').map((e) => [e.id, 'active']))

// Each frame: how visible the map and the graph are, what is lit up, and one caption.
const BRIDGES = [
  {
    caption: 'In 1736, the city of Königsberg had seven bridges. Could you cross every one of them exactly once?',
    map: 1,
    graph: 0,
    edges: [],
  },
  {
    caption: 'Euler ignored the map. Only what connects to what matters. Each piece of land becomes a node.',
    map: 0.35,
    graph: 1,
    edges: [],
    nodes: { N: 'queued', I: 'queued', S: 'queued', E: 'queued' },
  },
  {
    caption: 'Each bridge becomes an edge. And that is a graph.',
    map: 0.12,
    graph: 1,
    edges: ALL_BRIDGES,
  },
  {
    caption: 'Count the edges at each node: 3, 5, 3 and 3. That count is the node’s degree.',
    map: 0,
    graph: 1,
    edges: ALL_BRIDGES,
    marks: DEGREES,
  },
  {
    caption: 'Walking through a node uses two bridges, one in and one out. So a node in the middle of a walk needs an even degree.',
    map: 0,
    graph: 1,
    edges: ALL_BRIDGES,
    marks: DEGREES,
    nodes: { I: 'active' },
    edgeStates: AT_ISLAND,
  },
  {
    caption: 'All four are odd, but only the start and the end of a walk may be. So it is impossible, and Euler proved it without trying a single route.',
    map: 0,
    graph: 1,
    edges: ALL_BRIDGES,
    marks: DEGREES,
    nodes: { N: 'bad', I: 'bad', S: 'bad', E: 'bad' },
  },
]

// The bridges of Königsberg, from map to graph to answer, in six short frames.
function KonigsbergVisual() {
  const [tick, setTick] = useLoop(BRIDGES.length, 4200)
  const frame = BRIDGES[tick]

  return (
    <div className="visual-card">
      <div className="graph-stack">
        <div style={{ opacity: frame.map }}>
          <KonigsbergMap />
        </div>
        <div style={{ opacity: frame.graph }}>
          <GraphView
            graph={KONIGSBERG}
            edges={frame.edges}
            directed={false}
            r={17}
            nodeStates={frame.nodes}
            edgeStates={frame.edgeStates}
            nodeMarks={frame.marks}
            ariaLabel="A map of Königsberg, with four pieces of land and seven bridges, turning into a graph with four nodes and seven edges. The north bank has three bridges, the island five, the south bank three and the east side three."
          />
        </div>
      </div>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={BRIDGES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ kinds of graph

// A tiny graph for the gallery.
const mini = (nodes, edges) => ({
  width: 140,
  height: 112,
  nodes: nodes.map(([id, x, y]) => ({ id: String(id), x, y, label: '' })),
  edges: edges.map(([from, to, weight]) => ({ from: String(from), to: String(to), weight })),
})

const SQUARE = [[0, 30, 28], [1, 110, 28], [2, 110, 84], [3, 30, 84]]

const KINDS = [
  {
    name: 'Undirected',
    sub: 'edges work both ways',
    graph: mini(SQUARE, [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]),
    directed: false,
    alt: 'An undirected graph: four nodes in a square, joined by plain lines, with one line across the middle.',
  },
  {
    name: 'Directed',
    sub: 'edges point one way',
    graph: mini(SQUARE, [[0, 1], [1, 2], [3, 2], [0, 3]]),
    directed: true,
    alt: 'A directed graph: four nodes in a square with arrows pointing one way along each edge.',
  },
  {
    name: 'Weighted',
    sub: 'each edge has a number',
    graph: mini([[0, 25, 88], [1, 70, 22], [2, 115, 88]], [[0, 1, 4], [1, 2, 2], [0, 2, 7]]),
    directed: false,
    alt: 'A weighted graph: three nodes in a triangle, with the edges labelled 4, 2 and 7.',
  },
  {
    name: 'Disconnected',
    sub: 'separate pieces, with no way between',
    graph: mini([[0, 22, 26], [1, 60, 56], [2, 30, 92], [3, 100, 30], [4, 118, 88]], [[0, 1], [1, 2], [3, 4]]),
    directed: false,
    states: { 0: 'active', 1: 'active', 2: 'active', 3: 'found', 4: 'found' },
    alt: 'A disconnected graph: one piece of three nodes in blue, and a separate piece of two nodes in green, with no edge between them.',
  },
  {
    name: 'Has a cycle',
    sub: 'a way back to where you started',
    graph: mini([[0, 70, 20], [1, 115, 54], [2, 98, 96], [3, 42, 96], [4, 25, 54]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]),
    directed: false,
    states: { 0: 'bad', 1: 'bad', 2: 'bad', 3: 'bad', 4: 'bad' },
    edgeStates: 'bad',
    alt: 'A graph with a cycle: five nodes in a ring, so you can go round and return to the start.',
  },
  {
    name: 'A tree',
    sub: 'in one piece, with no cycle',
    graph: mini([[0, 70, 22], [1, 35, 62], [2, 105, 62], [3, 18, 98], [4, 52, 98]], [[0, 1], [0, 2], [1, 3], [1, 4]]),
    directed: false,
    states: { 0: 'found' },
    alt: 'A tree: five nodes in one piece with four edges and no cycle.',
  },
]

// Six kinds of graph side by side.
function GraphKindsVisual() {
  return (
    <div className="visual-card">
      <div className="tree-grid">
        {KINDS.map(({ name, sub, graph, directed, states, edgeStates, alt }) => (
          <figure key={name}>
            <GraphView
              graph={graph}
              directed={directed}
              r={11}
              nodeStates={states}
              edgeStates={edgeStates === 'bad' ? Object.fromEntries(graph.edges.map((e) => [`${e.from}>${e.to}`, 'bad'])) : undefined}
              ariaLabel={alt}
            />
            <figcaption>
              {name}
              <span>{sub}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

// ------------------------------------------------ how big can it get

// n nodes on a circle with every pair joined.
function complete(n) {
  const cx = 70
  const cy = 56
  const radius = 42
  const nodes = Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return { id: String(i), x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), label: '' }
  })
  const edges = []
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) edges.push({ from: String(a), to: String(b) })
  return { width: 140, height: 112, nodes, edges }
}

const COMPLETE = [3, 4, 5, 6, 7].map((n) => ({ n, graph: complete(n) }))

// Joining every pair of nodes: the edges pile up much faster than the nodes.
function CompleteGraphsVisual() {
  return (
    <div className="visual-card">
      <div className="tree-grid">
        {COMPLETE.map(({ n, graph }) => (
          <figure key={n}>
            <GraphView
              graph={graph}
              directed={false}
              r={6}
              nodeStates={Object.fromEntries(graph.nodes.map((node) => [node.id, 'active']))}
              ariaLabel={`${n} nodes with every pair joined, which needs ${graph.edges.length} edges.`}
            />
            <figcaption>
              {n} nodes
              <span>{graph.edges.length} edges</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export { KonigsbergVisual, GraphKindsVisual, CompleteGraphsVisual }
