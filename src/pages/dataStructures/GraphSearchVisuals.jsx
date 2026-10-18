import GraphView, { edgeKey } from '../../components/GraphView.jsx'
import { SEARCH, bfsFrom, dfsFrom, edgeBetween } from './graphData.js'
import { E, GraphFrames } from './GraphFrames.jsx'
import { reducedMotion, useLoop } from './loopHooks.jsx'

// ------------------------------------------------ the race

const BFS = bfsFrom(SEARCH, '0')
const DFS = dfsFrom(SEARCH, '0')
const HOLD = 3

// One search, drawn after its first `count` visits: visited nodes are grey and
// numbered, the newest is blue, and the edge that found each node is green.
function searchPicture({ order, parent }, count) {
  const nodeStates = {}
  const marks = {}
  const edgeStates = {}
  order.slice(0, count).forEach((id, i) => {
    nodeStates[id] = i === count - 1 && count < order.length ? 'active' : 'checked'
    marks[id] = String(i + 1)
    if (parent[id] !== undefined) edgeStates[edgeKey(edgeBetween(SEARCH, parent[id], id))] = 'found'
  })
  return { nodeStates, marks, edgeStates }
}

// Breadth-first and depth-first search side by side, from the same start.
function SearchRaceVisual() {
  const total = SEARCH.nodes.length
  const [tick] = useLoop(total + HOLD, 1100)
  const count = reducedMotion() ? total : Math.min(tick + 1, total)
  const panels = [
    { title: 'Breadth-first', sub: 'a ripple: everything 1 step away, then 2, then 3', search: BFS, alt: `Breadth-first search from node 0 visits the nodes in this order: ${BFS.order.join(', ')}. It goes row by row.` },
    { title: 'Depth-first', sub: 'a dive: as deep as possible, then back up', search: DFS, alt: `Depth-first search from node 0 visits the nodes in this order: ${DFS.order.join(', ')}. It goes deep down one path before trying another.` },
  ]

  return (
    <div className="visual-card">
      <div className="tree-pair">
        {panels.map(({ title, sub, search, alt }) => {
          const { nodeStates, marks, edgeStates } = searchPicture(search, count)
          return (
            <figure key={title}>
              <GraphView graph={SEARCH} directed={false} r={15} nodeStates={nodeStates} nodeMarks={marks} edgeStates={edgeStates} ariaLabel={alt} />
              <figcaption>
                {title}
                <span>{sub}</span>
              </figcaption>
            </figure>
          )
        })}
      </div>
      <ul className="visual-legend">
        <li>the number on each node is the order it was visited. Green lines are the ones that found a new node.</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ why remember?

const RING = {
  width: 300,
  height: 190,
  nodes: [
    { id: '0', x: 70, y: 46 },
    { id: '1', x: 230, y: 46 },
    { id: '2', x: 230, y: 144 },
    { id: '3', x: 70, y: 144 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '0' },
  ],
}

const FORGET = [
  { caption: 'A graph with a cycle: 0, 1, 2, 3 and back to 0.' },
  {
    caption: 'Without a visited set: from 0 go to 1…',
    edges: { [E(0, 1)]: 'bad' },
    nodes: { 0: 'bad', 1: 'bad' },
  },
  {
    caption: '…then to 2, then to 3…',
    edges: { [E(0, 1)]: 'bad', [E(1, 2)]: 'bad', [E(2, 3)]: 'bad' },
    nodes: { 0: 'bad', 1: 'bad', 2: 'bad', 3: 'bad' },
  },
  {
    caption: '…and back to 0. The search has no idea it has been here, so it goes round again, forever.',
    edges: { [E(0, 1)]: 'bad', [E(1, 2)]: 'bad', [E(2, 3)]: 'bad', [E(3, 0)]: 'bad' },
    nodes: { 0: 'bad', 1: 'bad', 2: 'bad', 3: 'bad' },
  },
  {
    caption: 'With a visited set: at 3, the neighbour 0 is already marked, so skip it. The search ends.',
    edges: { [E(3, 0)]: 'ghost' },
    nodes: { 0: 'checked', 1: 'checked', 2: 'checked', 3: 'active' },
    marks: { 0: '1', 1: '2', 2: '3', 3: '4' },
  },
]

// A search that cannot remember where it has been loops for ever.
function ForgetVisual() {
  return (
    <GraphFrames
      frames={FORGET}
      graph={RING}
      ms={3000}
      ariaLabel="Four nodes in a ring, 0, 1, 2 and 3. A search with no memory goes round the ring for ever. A search that marks the nodes it has visited stops when it gets back to one it has already seen."
    />
  )
}

// ------------------------------------------------ fewest steps

const LEVELS = [
  {
    caption: 'Breadth-first search from 0…',
    nodes: { 0: 'active' },
    marks: { 0: '0' },
  },
  {
    caption: '…reaches everything 1 step away first…',
    nodes: { 0: 'active', 1: 'queued', 2: 'queued', 3: 'queued' },
    marks: { 0: '0', 1: '1', 2: '1', 3: '1' },
  },
  {
    caption: '…then everything 2 steps away. No node is reached by a longer way than it needs.',
    nodes: { 0: 'active', 1: 'queued', 2: 'queued', 3: 'queued', 4: 'found', 5: 'found', 6: 'found' },
    marks: { 0: '0', 1: '1', 2: '1', 3: '1', 4: '2', 5: '2', 6: '2' },
  },
  {
    caption: 'Every node remembers who found it. Follow that back from 6 and you have a shortest path: 0, 3, 6.',
    nodes: { 0: 'found', 3: 'found', 6: 'found' },
    edges: { [E(0, 3)]: 'found', [E(3, 6)]: 'found' },
    marks: { 0: '0', 3: '1', 6: '2' },
  },
]

// Breadth-first search finds the route with the fewest edges.
function FewestStepsVisual() {
  return (
    <GraphFrames
      frames={LEVELS}
      graph={SEARCH}
      ms={3200}
      r={17}
      ariaLabel="Breadth-first search from node 0 reaches nodes 1, 2 and 3 in one step, then 4, 5 and 6 in two steps. Following the nodes that found each other back from 6 gives the shortest path 0, 3, 6."
    />
  )
}

// ------------------------------------------------ cost

// The work a search does on the graph above: every node goes through the
// list once, and every edge is looked at from both of its ends.
function SearchWorkVisual() {
  const v = SEARCH.nodes.length
  const e = SEARCH.edges.length
  const rows = [
    { label: `Nodes taken from the list: V = ${v}`, value: v, color: '#8aa8ea', stroke: '#2d4f9e' },
    { label: `Edge looks: each edge from both ends = 2E = ${2 * e}`, value: 2 * e, color: '#ffe27a', stroke: '#b8912a' },
    { label: `Total work: V + 2E = ${v + 2 * e}`, value: v + 2 * e, color: '#86d69f', stroke: '#237a35' },
  ]
  const scale = 300 / (v + 2 * e)

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label={`The work of a search on this graph of ${v} nodes and ${e} edges: ${v} nodes taken from the list, ${2 * e} edge looks because each edge is seen from both ends, so ${v + 2 * e} in all.`}
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
        <li>so the cost grows with the nodes <strong>plus</strong> the edges: <code>O(V + E)</code></li>
      </ul>
    </div>
  )
}

export { SearchRaceVisual, ForgetVisual, FewestStepsVisual, SearchWorkVisual }
