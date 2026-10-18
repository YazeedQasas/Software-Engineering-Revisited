import GraphView, { GraphStore } from '../../components/GraphView.jsx'
import { EXTRA, FRIENDS, TREE_PLUS, TWO_GROUPS, undirectedList, undirectedMatrix } from './graphData.js'
import { useLoop } from './loopHooks.jsx'
import { E, GraphFrames as Frames } from './GraphFrames.jsx'

const ALL = FRIENDS.edges.map((edge) => E(edge.from, edge.to))
const DEGREES = { 0: '2', 1: '3', 2: '2', 3: '2', 4: '3', 5: '2' }

// ------------------------------------------------ the opening animation

const INTRO = [
  {
    caption: 'In an undirected graph, the dots are nodes and the lines are friendships.',
    show: [],
    nodes: { 0: 'queued', 1: 'queued', 2: 'queued', 3: 'queued', 4: 'queued', 5: 'queued' },
  },
  {
    caption: 'A line joins two friends. It has no arrowhead, because friendship works both ways.',
    show: ALL,
  },
  {
    caption: 'From 0 you can go to 1…',
    edges: { [E(0, 1)]: 'active' },
    nodes: { 0: 'active', 1: 'queued' },
  },
  {
    caption: '…and from 1 straight back to 0. One line works in both directions.',
    edges: { [E(0, 1)]: 'active' },
    nodes: { 1: 'active', 0: 'queued' },
  },
  {
    caption: 'The neighbours of 1 are every node it touches: 0, 2 and 4.',
    edges: { [E(0, 1)]: 'active', [E(1, 2)]: 'active', [E(1, 4)]: 'active' },
    nodes: { 1: 'active', 0: 'queued', 2: 'queued', 4: 'queued' },
  },
  {
    caption: 'Count a node’s neighbours and you have its degree: 2, 3, 2, 2, 3, 2.',
    marks: DEGREES,
  },
  {
    caption: 'A path is a trip along the lines: 0, 1, 2, 5. You could walk it backwards just as easily.',
    edges: { [E(0, 1)]: 'found', [E(1, 2)]: 'found', [E(2, 5)]: 'found' },
    nodes: { 0: 'found', 1: 'found', 2: 'found', 5: 'found' },
  },
]

// Lines that work both ways, neighbours, degree and paths in seven short frames.
function FriendsIntroVisual() {
  return (
    <Frames
      frames={INTRO}
      graph={FRIENDS}
      ms={2800}
      ariaLabel="A graph of six friends, numbered 0 to 5. Its edges are plain lines with no arrowheads."
    />
  )
}

// ------------------------------------------------ one line, two arrows

const PAIR = {
  width: 300,
  height: 100,
  nodes: [
    { id: '0', x: 70, y: 50 },
    { id: '1', x: 230, y: 50 },
  ],
  edges: [{ from: '0', to: '1' }, { from: '1', to: '0' }],
}

const TWO_WAYS = [
  {
    caption: 'An undirected edge is one plain line between two nodes…',
    show: [E(0, 1)],
    directed: false,
  },
  {
    caption: '…which means exactly the same as two arrows, one each way.',
    show: [E(0, 1), E(1, 0)],
    directed: true,
    edges: { [E(0, 1)]: 'active', [E(1, 0)]: 'active' },
  },
]

// A plain line and a pair of opposite arrows, swapping back and forth.
function TwoWaysVisual() {
  return (
    <Frames
      frames={TWO_WAYS}
      graph={PAIR}
      ms={2800}
      r={20}
      ariaLabel="Two nodes. First they are joined by a plain line. Then the same line is shown as two arrows, one pointing each way."
    />
  )
}

// ------------------------------------------------ list and grid, in sync

// The friends graph, with the list and the grid beside it. Each edge lights
// up in two places in each, because it is written down at both ends.
function UndirectedStorageVisual() {
  const edges = FRIENDS.edges
  const [tick] = useLoop(edges.length + 1, 1500)
  const active = tick < edges.length ? tick : null
  const adj = undirectedList(FRIENDS)
  const matrix = undirectedMatrix(FRIENDS)

  let hot = {}
  const edgeStates = {}
  const nodeStates = {}
  if (active !== null) {
    const { from, to } = edges[active]
    edgeStates[E(from, to)] = 'active'
    nodeStates[from] = 'active'
    nodeStates[to] = 'active'
    hot = {
      chips: [[from, adj[from].indexOf(to)], [to, adj[to].indexOf(from)]],
      cells: [[Number(from), Number(to)], [Number(to), Number(from)]],
    }
  }

  return (
    <div className="visual-card">
      <div className="graph-split">
        <GraphView
          graph={FRIENDS}
          directed={false}
          nodeStates={nodeStates}
          edgeStates={edgeStates}
          ariaLabel="The graph of six friends. Each edge lights up in turn, and the same edge lights up twice in the list and twice in the grid beside it."
        />
        <GraphStore graph={FRIENDS} adj={adj} matrix={matrix} hot={hot} diagonal />
      </div>
      <ul className="visual-legend">
        <li>each line lights up <strong>twice</strong> in the list and <strong>twice</strong> in the grid. The shaded diagonal is a mirror.</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ in pieces

const GROUP_A = { 0: 'active', 1: 'active', 2: 'active' }
const GROUP_B = { 3: 'found', 4: 'found', 5: 'found' }

const PIECES = [
  {
    caption: 'This graph has two groups, and no line joins them.',
    nodes: { ...GROUP_A, ...GROUP_B },
  },
  {
    caption: 'From 0 you can reach everyone in its own group…',
    nodes: { 0: 'found', 1: 'found', 2: 'found' },
    edges: { [E(0, 1)]: 'found', [E(1, 2)]: 'found', [E(2, 0)]: 'found' },
  },
  {
    caption: '…but there is no way across to the other group. Each group is called a component.',
    nodes: { ...GROUP_A, ...GROUP_B },
    extra: [{ from: '2', to: '3' }],
    edges: { [E(2, 3)]: 'ghost' },
  },
]

// A graph that falls into two separate pieces.
function ComponentsVisual() {
  return (
    <Frames
      frames={PIECES}
      graph={TWO_GROUPS}
      ms={3200}
      ariaLabel="A graph of six nodes in two separate groups: 0, 1 and 2 form a triangle, and 3, 4 and 5 form a line. No edge joins the two groups."
    />
  )
}

// ------------------------------------------------ one edge too many

const CYCLE_EDGES = { [E(0, 1)]: 'bad', [E(1, 4)]: 'bad', [E(2, 4)]: 'bad', [E(0, 2)]: 'bad' }
const TREE_ONLY = TREE_PLUS.edges.map((edge) => E(edge.from, edge.to))

const GROW = [
  {
    caption: 'A tree: in one piece, with no cycle. Five nodes, four edges.',
    show: TREE_ONLY,
    nodes: { 0: 'found' },
  },
  {
    caption: 'Now add one more line, between 2 and 4…',
    show: TREE_ONLY,
    extra: [EXTRA],
    edges: { [E(2, 4)]: 'active' },
    nodes: { 2: 'active', 4: 'active' },
  },
  {
    caption: '…and you have made a cycle: 0, 1, 4, 2 and back to 0. One extra line in a tree always makes exactly one.',
    show: TREE_ONLY,
    extra: [EXTRA],
    edges: CYCLE_EDGES,
    nodes: { 0: 'bad', 1: 'bad', 4: 'bad', 2: 'bad' },
  },
]

// A tree gets one extra edge and grows a cycle.
function CycleGrowVisual() {
  return (
    <Frames
      frames={GROW}
      graph={TREE_PLUS}
      ms={3200}
      ariaLabel="A tree of five nodes, then the same tree with one extra line between nodes 2 and 4, which creates a cycle through 0, 1, 4 and 2."
    />
  )
}

export { FriendsIntroVisual, TwoWaysVisual, UndirectedStorageVisual, ComponentsVisual, CycleGrowVisual }
