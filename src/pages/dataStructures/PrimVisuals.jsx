import GraphView, { edgeKey } from '../../components/GraphView.jsx'
import { PRIM_GRAPH, bfsFrom, crossingEdges, dijkstraRounds, edgeBetween, primRounds } from './graphData.js'
import { GraphFrames } from './GraphFrames.jsx'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const GOLD = '#d9a400'

const G = PRIM_GRAPH
const RUN = primRounds(G, 'A')

const cable = ({ from, to, weight }) => `${from}–${to} (${weight})`
const keyOf = ({ from, to }) => edgeKey(edgeBetween(G, from, to))
const allNodes = (state) => Object.fromEntries(G.nodes.map(({ id }) => [id, state]))
const markEdges = (edges, state, into = {}) => {
  edges.forEach((edge) => {
    into[keyOf(edge)] = state
  })
  return into
}

// "A–G (4), A–B (6) and A–F (12)".
const joined = (parts) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`)

// How the tree looks with `tree` nodes and `treeEdges` chosen: candidates
// (every edge leaving the tree) are gold, and the nodes at their far ends are
// yellow.
function treePicture(tree, treeEdges, chosen) {
  const candidates = crossingEdges(G, tree)
  const nodes = {}
  candidates.forEach((edge) => {
    nodes[tree.includes(edge.from) ? edge.to : edge.from] = 'queued'
  })
  tree.forEach((id) => {
    nodes[id] = 'found'
  })
  const edges = markEdges(candidates, 'candidate')
  markEdges(treeEdges, 'found', edges)
  if (chosen) {
    markEdges([chosen.edge], 'active', edges)
    nodes[chosen.node] = 'active'
  }
  return { nodes, edges, candidates }
}

const LEGEND = [
  { color: GREEN, text: 'in the tree' },
  { color: GOLD, text: 'an edge leaving the tree: a candidate' },
  { color: BLUE, text: 'the edge chosen, and the node it adds' },
]

// ------------------------------------------------ the whole run

const ROUNDS = [
  {
    caption: 'Start with just A. Prim grows a tree outwards from it, one edge at a time.',
    directed: false,
    ...(() => {
      const { nodes, edges } = treePicture(['A'], [])
      return { nodes, edges }
    })(),
  },
  ...RUN.rounds.map((round, i) => {
    const before = i === 0 ? ['A'] : RUN.rounds[i - 1].tree
    const beforeEdges = i === 0 ? [] : RUN.rounds[i - 1].treeEdges
    const { nodes, edges, candidates } = treePicture(before, beforeEdges, round)
    const list = candidates.slice().sort((a, b) => a.weight - b.weight).map(cable)
    return {
      caption: `Edges leaving the tree: ${joined(list)}. The cheapest is ${cable(round.edge)}, so ${round.node} joins the tree.`,
      directed: false,
      nodes,
      edges,
    }
  }),
  {
    caption: `Done. ${RUN.treeEdges.length} edges join all ${G.nodes.length} nodes, and the total cost is ${RUN.total}.`,
    directed: false,
    nodes: allNodes('found'),
    edges: markEdges(RUN.treeEdges, 'found'),
  },
]

// Prim from A, one edge at a time.
function RoundsVisual() {
  return (
    <GraphFrames
      frames={ROUNDS}
      graph={G}
      ms={4400}
      legend={LEGEND}
      ariaLabel="Prim's algorithm on seven towns, A to G, joined by cables with costs. Starting at A it keeps adding the cheapest edge that leaves the tree: A to G (4), G to B (3), B to C (5), C to D (8), D to E (1) and E to F (2). The total cost is 23."
    />
  )
}

// ------------------------------------------------ what is a spanning tree?

const BFS = bfsFrom(G, 'A')
const BFS_EDGES = Object.entries(BFS.parent).map(([to, from]) => edgeBetween(G, from, to))
const BFS_COST = BFS_EDGES.reduce((sum, e) => sum + e.weight, 0)
const dimAll = Object.fromEntries(G.edges.map((e) => [edgeKey(e), 'dim']))
const triangle = [edgeBetween(G, 'A', 'G'), edgeBetween(G, 'G', 'B'), edgeBetween(G, 'A', 'B')]

const SPANNING = [
  {
    caption: `Seven nodes and ${G.edges.length} possible edges. We only want enough edges to join everything up.`,
  },
  {
    caption: `A spanning tree: every node is joined, there are no loops, and there are exactly ${G.nodes.length - 1} edges (one fewer than the nodes). This one costs ${BFS_COST}.`,
    nodes: allNodes('found'),
    edges: markEdges(BFS_EDGES, 'found', { ...dimAll }),
  },
  {
    caption: `Another spanning tree, and there are many more. The cheapest one is called the minimum spanning tree, and it costs only ${RUN.total}.`,
    nodes: allNodes('found'),
    edges: markEdges(RUN.treeEdges, 'found', { ...dimAll }),
  },
  {
    caption: 'Add any extra edge, like A–B, and a loop appears (A, G, B). That is why a spanning tree has exactly one fewer edge than nodes.',
    nodes: allNodes('found'),
    edges: markEdges(triangle, 'bad', markEdges(RUN.treeEdges, 'found', { ...dimAll })),
  },
]

// A spanning tree, and the cheapest one.
function SpanningTreeVisual() {
  return (
    <GraphFrames
      frames={SPANNING}
      graph={G}
      ms={4400}
      ariaLabel={`A graph of seven nodes. One spanning tree joins them all with six edges and costs ${BFS_COST}. The minimum spanning tree costs ${RUN.total}. Adding an extra edge makes a loop.`}
    />
  )
}

// ------------------------------------------------ why the cheapest edge is safe

const CUT_TREE = ['A', 'G', 'B']
const CUT_EDGES = [edgeBetween(G, 'A', 'G'), edgeBetween(G, 'G', 'B')]
const cut = treePicture(CUT_TREE, CUT_EDGES)
const cheapest = cut.candidates.reduce((best, edge) => (edge.weight < best.weight ? edge : best))

const CUT = [
  {
    caption: 'Say A, G and B are already in the tree. Every other node is still outside.',
    nodes: Object.fromEntries(CUT_TREE.map((id) => [id, 'found'])),
    edges: markEdges(CUT_EDGES, 'found'),
  },
  {
    caption: 'Any edge between the tree and the outside can grow it. These gold ones are the candidates. To reach the rest, the finished tree must use at least one of them.',
    nodes: cut.nodes,
    edges: cut.edges,
  },
  {
    caption: `The cheapest candidate is ${cable(cheapest)}. Every other candidate costs more, so choosing it can never be a mistake.`,
    nodes: { ...cut.nodes, [cheapest.to]: 'active' },
    edges: { ...cut.edges, [keyOf(cheapest)]: 'active' },
  },
  {
    caption: 'An edge with both ends already in the tree, like A–B, would only close a loop. It is no use, so Prim never takes it.',
    nodes: cut.nodes,
    edges: { ...cut.edges, [keyOf({ from: 'A', to: 'B' })]: 'bad' },
  },
]

// The rule that makes the greedy choice safe.
function CutVisual() {
  return (
    <GraphFrames
      frames={CUT}
      graph={G}
      ms={4600}
      legend={LEGEND}
      ariaLabel="With A, G and B in the tree, the edges leaving the tree are A to F (12), G to C (7), G to D (11), G to E (10), G to F (9) and B to C (5). The cheapest, B to C, is always safe to add. The edge A to B has both ends in the tree, so it would only make a loop."
    />
  )
}

// ------------------------------------------------ Prim or Dijkstra?

const SHORTEST = dijkstraRounds(G, 'A')
const SHORTEST_EDGES = Object.entries(SHORTEST.previous).map(([to, from]) => edgeBetween(G, from, to))
const SHORTEST_COST = SHORTEST_EDGES.reduce((sum, e) => sum + e.weight, 0)

// The tree Dijkstra builds next to the tree Prim builds, from the same start.
function VersusVisual() {
  const panels = [
    { title: 'Dijkstra from A', sub: `shortest route to every node: edges add up to ${SHORTEST_COST}`, edges: SHORTEST_EDGES },
    { title: 'Prim from A', sub: `cheapest way to join every node: edges add up to ${RUN.total}`, edges: RUN.treeEdges },
  ]

  return (
    <div className="visual-card">
      <div className="tree-pair">
        {panels.map(({ title, sub, edges }) => (
          <figure key={title}>
            <GraphView
              graph={G}
              directed={false}
              r={15}
              nodeStates={allNodes('found')}
              edgeStates={markEdges(edges, 'found', { ...dimAll })}
              ariaLabel={`${title}: the tree uses the edges ${edges.map(cable).join(', ')}, adding up to ${edges.reduce((sum, e) => sum + e.weight, 0)}.`}
            />
            <figcaption>
              {title}
              <span>{sub}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ul className="visual-legend">
        <li>the green edges are the tree each one builds. Dijkstra keeps every node close to A. Prim only cares about the total.</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ cost

// The work Prim does on the graph above, counted from a real run.
function HeapWorkVisual() {
  const v = G.nodes.length
  const e = G.edges.length
  const rows = [
    { label: `Edges looked at: each from both ends = 2E = ${2 * e}`, value: 2 * e, color: YELLOW, stroke: '#b8912a' },
    { label: `Heap pushes: ${RUN.pushes}`, value: RUN.pushes, color: BLUE, stroke: '#2d4f9e' },
    { label: `Heap pops: ${RUN.pops}`, value: RUN.pops, color: GREEN, stroke: '#237a35' },
  ]
  const scale = 300 / (2 * e)

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label={`The work of Prim's algorithm on these ${v} nodes and ${e} edges: ${2 * e} edge looks, ${RUN.pushes} heap pushes and ${RUN.pops} heap pops.`}
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
        <li>every push and pop costs <code>O(log V)</code>, and there are at most E of each: <code>O(E log V)</code></li>
      </ul>
    </div>
  )
}

export { RoundsVisual, SpanningTreeVisual, CutVisual, VersusVisual, HeapWorkVisual }
