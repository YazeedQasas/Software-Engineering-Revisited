import GraphView, { edgeKey } from '../../components/GraphView.jsx'
import { NEGATIVE, ROUTES, bfsFrom, dijkstraRounds, edgeBetween } from './graphData.js'
import { E, GraphFrames } from './GraphFrames.jsx'
import { reducedMotion, useLoop } from './loopHooks.jsx'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const INK = '#1f2023'

const RUN = dijkstraRounds(ROUTES, 'A')
const ALL_DIM = Object.fromEntries(ROUTES.edges.map((edge) => [E(edge.from, edge.to), 'dim']))

// "B, C and D" from ['B', 'C', 'D'].
const joined = (parts) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`)

// The route from the start to `node`, following who-found-who back.
function routeTo(parent, start, node) {
  const route = [node]
  while (route[0] !== start) route.unshift(parent[route[0]])
  return route
}

const routeCost = (graph, route) =>
  route.slice(1).reduce((sum, node, i) => sum + edgeBetween(graph, route[i], node).weight, 0)

// The edges of `previous` (node -> where it came from), all marked 'found'.
const treeEdges = (graph, previous) =>
  Object.fromEntries(Object.entries(previous).map(([to, from]) => [edgeKey(edgeBetween(graph, from, to)), 'found']))

// ------------------------------------------------ the whole run

// One frame at the start, then one per node Dijkstra finishes, then the answer.
const ROUNDS = [
  { caption: 'Start at A. A costs 0 to reach. Every other node is ∞: no way found yet.', nodes: { A: 'active' }, marks: { A: '0' } },
  ...RUN.rounds.map(({ node, d, updates, dist, previous, done }) => {
    const nodes = {}
    const marks = {}
    Object.entries(dist).forEach(([id, value]) => {
      if (value === Infinity) return
      marks[id] = String(value)
      nodes[id] = done.includes(id) ? 'found' : 'queued'
    })
    nodes[node] = 'active'
    const edges = treeEdges(ROUTES, previous)
    updates.forEach(({ to }) => {
      edges[edgeKey(edgeBetween(ROUTES, node, to))] = 'active'
    })
    const gave = updates.map(({ to, was, now }) => (was === Infinity ? `${to} = ${now}` : `${to} drops from ${was} to ${now}`))
    return {
      caption: `Finish ${node} at ${d}: the closest node still open. ${updates.length ? `Its roads give ${joined(gave)}.` : 'Nothing left for it to improve.'}`,
      nodes,
      marks,
      edges,
    }
  }),
  {
    caption: 'Done. The green roads are the cheapest routes from A, and the numbers are what they cost.',
    nodes: Object.fromEntries(ROUTES.nodes.map(({ id }) => [id, 'found'])),
    marks: Object.fromEntries(Object.entries(RUN.dist).map(([id, value]) => [id, String(value)])),
    edges: treeEdges(ROUTES, RUN.previous),
  },
]

const ROUNDS_LEGEND = [
  { color: BLUE, text: 'the node being finished' },
  { color: YELLOW, text: 'reached, distance not final' },
  { color: GREEN, text: 'finished: distance locked in' },
  { color: INK, text: 'the number on a node: its best distance so far' },
]

// Dijkstra from A, one finished node at a time.
function RoundsVisual() {
  return (
    <GraphFrames
      frames={ROUNDS}
      graph={ROUTES}
      ms={4200}
      legend={ROUNDS_LEGEND}
      ariaLabel="Dijkstra's algorithm on six towns joined by roads with costs. Starting at A it finishes the closest open node each time, in the order A, C, B, D, E, F, and ends with the cheapest cost to every town: A 0, B 3, C 2, D 8, E 10, F 13."
    />
  )
}

// ------------------------------------------------ cheapest vs fewest

const FEWEST = routeTo(bfsFrom(ROUTES, 'A').parent, 'A', 'F')
const CHEAPEST = routeTo(RUN.previous, 'A', 'F')
const HOLD = 3

// A route drawn up to its first `count` towns.
function routePicture(route, count) {
  const nodeStates = {}
  const edgeStates = {}
  route.slice(0, count).forEach((node, i) => {
    nodeStates[node] = 'found'
    if (i > 0) edgeStates[edgeKey(edgeBetween(ROUTES, route[i - 1], node))] = 'found'
  })
  return { nodeStates, edgeStates }
}

// The route with the fewest roads next to the route that costs least.
function CheapestVsFewestVisual() {
  const longest = Math.max(FEWEST.length, CHEAPEST.length)
  const [tick] = useLoop(longest + HOLD, 900)
  const step = reducedMotion() ? longest : tick + 1
  const panels = [
    { title: 'Fewest roads', sub: `breadth-first: ${FEWEST.length - 1} roads, but it costs ${routeCost(ROUTES, FEWEST)}`, route: FEWEST },
    { title: 'Cheapest', sub: `Dijkstra: ${CHEAPEST.length - 1} roads, but it costs only ${routeCost(ROUTES, CHEAPEST)}`, route: CHEAPEST },
  ]

  return (
    <div className="visual-card">
      <div className="tree-pair">
        {panels.map(({ title, sub, route }) => {
          const { nodeStates, edgeStates } = routePicture(route, Math.min(step, route.length))
          return (
            <figure key={title}>
              <GraphView
                graph={ROUTES}
                directed={false}
                r={15}
                nodeStates={nodeStates}
                edgeStates={edgeStates}
                ariaLabel={`${title}: the route ${route.join(', ')} from A to F. ${sub}.`}
              />
              <figcaption>
                {title}
                <span>{sub}</span>
              </figcaption>
            </figure>
          )
        })}
      </div>
      <ul className="visual-legend">
        <li>the numbers on the roads are what each one costs. Both routes go from A to F.</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ relaxing a road

const RELAX_NODES = { A: 'found', B: 'queued', C: 'queued' }
const RELAX = [
  {
    caption: 'A is finished at 0. Its roads gave B a distance of 4 and C a distance of 2.',
    nodes: RELAX_NODES,
    marks: { A: '0', B: '4', C: '2' },
    edges: { ...ALL_DIM, [E('A', 'B')]: 'found', [E('A', 'C')]: 'found' },
  },
  {
    caption: 'C is the closest open node, so finish it. Now look down its road to B, which costs 1.',
    nodes: { A: 'found', B: 'pending', C: 'active' },
    marks: { A: '0', B: '4', C: '2' },
    edges: { ...ALL_DIM, [E('A', 'B')]: 'found', [E('A', 'C')]: 'found', [E('B', 'C')]: 'active' },
  },
  {
    caption: 'Getting to B through C costs 2 + 1 = 3. B says 4 right now. 3 is cheaper!',
    nodes: { A: 'found', B: 'pending', C: 'active' },
    marks: { A: '0', B: '4', C: '2' },
    edges: { ...ALL_DIM, [E('A', 'B')]: 'found', [E('A', 'C')]: 'found', [E('B', 'C')]: 'active' },
  },
  {
    caption: 'So B drops to 3, and B now remembers it came from C, not A. Finding a cheaper way like this is called relaxing the road.',
    nodes: { A: 'found', B: 'queued', C: 'found' },
    marks: { A: '0', B: '3', C: '2' },
    edges: { ...ALL_DIM, [E('A', 'C')]: 'found', [E('B', 'C')]: 'found' },
  },
]

// The one trick: if going through this node is cheaper, take it.
function RelaxVisual() {
  return (
    <GraphFrames
      frames={RELAX}
      graph={ROUTES}
      ms={3600}
      legend={ROUNDS_LEGEND}
      ariaLabel="Relaxing a road. B first has distance 4, straight from A. Then C is finished at 2, and going through C to B costs 2 plus 1, which is 3. That is cheaper, so B is updated to 3 and now comes from C."
    />
  )
}

// ------------------------------------------------ reading the route back

const BACK = [...routeTo(RUN.previous, 'A', 'F')].reverse() // F, E, D, B, C, A
const FINAL_MARKS = Object.fromEntries(Object.entries(RUN.dist).map(([id, value]) => [id, String(value)]))

const PATH_BACK = [
  {
    caption: 'Dijkstra ends with every node’s cheapest cost, and the road each one was reached by: the green roads.',
    nodes: Object.fromEntries(ROUTES.nodes.map(({ id }) => [id, 'found'])),
    marks: FINAL_MARKS,
    edges: treeEdges(ROUTES, RUN.previous),
  },
  ...BACK.slice(1).map((from, i) => {
    const walked = BACK.slice(0, i + 2)
    const nodes = Object.fromEntries(walked.map((id) => [id, 'queued']))
    nodes[from] = 'active'
    const edges = { ...ALL_DIM }
    walked.slice(1).forEach((id, k) => {
      edges[edgeKey(edgeBetween(ROUTES, walked[k], id))] = 'active'
    })
    return {
      caption: i === 0
        ? `Want the route to F? Start at F and ask where it came from: ${from}.`
        : from === 'A'
          ? `${BACK[i]} came from A. A is the start, so stop.`
          : `${BACK[i]} came from ${from}.`,
      nodes,
      marks: Object.fromEntries(walked.map((id) => [id, FINAL_MARKS[id]])),
      edges,
    }
  }),
  {
    caption: `Now read it backwards: ${joined([...BACK].reverse())}. That route costs ${RUN.dist.F}.`,
    nodes: Object.fromEntries(BACK.map((id) => [id, 'found'])),
    marks: Object.fromEntries(BACK.map((id) => [id, FINAL_MARKS[id]])),
    edges: Object.fromEntries(BACK.slice(1).map((id, k) => [edgeKey(edgeBetween(ROUTES, BACK[k], id)), 'found'])),
  },
]

// Following "came from" back to the start, then reversing it.
function PathBackVisual() {
  return (
    <GraphFrames
      frames={PATH_BACK}
      graph={ROUTES}
      ms={3000}
      ariaLabel="Reading the cheapest route to F by following where each node came from: F from E, E from D, D from B, B from C, C from A. Read backwards the route is A, C, B, D, E, F, and it costs 13."
    />
  )
}

// ------------------------------------------------ negative roads

const NEG_ALL = NEGATIVE.edges.map((edge) => E(edge.from, edge.to))
const NEG_PLAIN = Object.fromEntries(NEG_ALL.map((key) => [key, 'dim']))

const NEG_FRAMES = [
  {
    caption: 'One-way roads again, but one has a negative cost: B to A takes you back 2.',
    directed: true,
    edges: { [E('B', 'A')]: 'active' },
  },
  {
    caption: 'Dijkstra finishes S, then A (cost 2, the closest). A is locked in at 2, so T gets 2 + 1 = 3.',
    directed: true,
    nodes: { S: 'found', A: 'found', B: 'queued', T: 'queued' },
    marks: { S: '0', A: '2', B: '3', T: '3' },
    edges: { ...NEG_PLAIN, [E('S', 'A')]: 'found', [E('S', 'B')]: 'found', [E('A', 'T')]: 'found' },
  },
  {
    caption: 'Next it finishes B (3) and looks down B to A: 3 + (−2) = 1. That beats the 2 we locked in!',
    directed: true,
    nodes: { S: 'found', A: 'pending', B: 'active', T: 'queued' },
    marks: { S: '0', A: '2', B: '3', T: '3' },
    edges: { ...NEG_PLAIN, [E('S', 'A')]: 'found', [E('S', 'B')]: 'found', [E('A', 'T')]: 'found', [E('B', 'A')]: 'active' },
  },
  {
    caption: 'But A was finished long ago, so the news never reaches T. Dijkstra says T costs 3.',
    directed: true,
    nodes: { S: 'found', A: 'found', B: 'found', T: 'bad' },
    marks: { S: '0', A: '1', B: '3', T: '3' },
    edges: { ...NEG_PLAIN, [E('S', 'B')]: 'found', [E('B', 'A')]: 'found', [E('A', 'T')]: 'found' },
  },
  {
    caption: 'The real cheapest way is S, B, A, T = 3 − 2 + 1 = 2. A wrong answer, so Dijkstra needs roads that never cost less than 0.',
    directed: true,
    nodes: { S: 'found', A: 'found', B: 'found', T: 'found' },
    marks: { S: '0', A: '1', B: '3', T: '2' },
    edges: { ...NEG_PLAIN, [E('S', 'B')]: 'found', [E('B', 'A')]: 'found', [E('A', 'T')]: 'found' },
  },
]

// Why one negative road breaks it: a node is locked in too early.
function NegativeVisual() {
  return (
    <GraphFrames
      frames={NEG_FRAMES}
      graph={NEGATIVE}
      ms={4200}
      ariaLabel="A graph of one-way roads with one negative road, B to A, costing minus 2. Dijkstra locks in A at 2 before it sees that going through B makes A cost 1, so it reports 3 for T when the real cheapest cost is 2."
    />
  )
}

// ------------------------------------------------ cost

// The work Dijkstra does on the graph above, counted from a real run.
function HeapWorkVisual() {
  const v = ROUTES.nodes.length
  const e = ROUTES.edges.length
  const rows = [
    { label: `Roads looked at: each from both ends = 2E = ${2 * e}`, value: 2 * e, color: YELLOW, stroke: '#b8912a' },
    { label: `Heap pushes: ${RUN.pushes}`, value: RUN.pushes, color: BLUE, stroke: '#2d4f9e' },
    { label: `Heap pops: ${RUN.pops}`, value: RUN.pops, color: GREEN, stroke: '#237a35' },
  ]
  const scale = 300 / (2 * e)

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label={`The work of Dijkstra's algorithm on these ${v} towns and ${e} roads: ${2 * e} road looks, ${RUN.pushes} heap pushes and ${RUN.pops} heap pops.`}
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
        <li>every push and pop costs <code>O(log V)</code>, and there are about E of each: <code>O((V + E) log V)</code></li>
      </ul>
    </div>
  )
}

export { RoundsVisual, CheapestVsFewestVisual, RelaxVisual, PathBackVisual, NegativeVisual, HeapWorkVisual }
