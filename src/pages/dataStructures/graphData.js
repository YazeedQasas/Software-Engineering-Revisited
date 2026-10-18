// The graph used on the Directed Graphs page: six people, and who follows whom.
//
//        0 ────▶ 1 ◀────▶ 2
//        │       │        ▲
//        ▼       ▼        │
//        3 ────▶ 4 ────▶ 5
//
// (1 and 2 follow each other, so there is an edge each way between them.)

export const FOLLOWS = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 60, y: 56 },
    { id: '1', x: 180, y: 40 },
    { id: '2', x: 300, y: 64 },
    { id: '3', x: 78, y: 170 },
    { id: '4', x: 196, y: 186 },
    { id: '5', x: 312, y: 168 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '1' },
    { from: '0', to: '3' },
    { from: '3', to: '4' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '2' },
  ],
}

// { '0': ['1', '3'], ... } for the first `count` edges.
export function adjacencyList(graph, count = graph.edges.length) {
  const adj = Object.fromEntries(graph.nodes.map((node) => [node.id, []]))
  graph.edges.slice(0, count).forEach(({ from, to }) => adj[from].push(to))
  return adj
}

// matrix[row][column] is 1 when there is an edge from row to column.
export function adjacencyMatrix(graph, count = graph.edges.length) {
  const index = Object.fromEntries(graph.nodes.map((node, i) => [node.id, i]))
  const matrix = graph.nodes.map(() => graph.nodes.map(() => 0))
  graph.edges.slice(0, count).forEach(({ from, to }) => {
    matrix[index[from]][index[to]] = 1
  })
  return matrix
}

// ---------------------------------------------- undirected graphs

// Six people and who is friends with whom. Friendship works both ways, so each
// edge is a plain line; it is stored once here as { from, to } but means both.
//
//        0 ────── 1 ────── 2
//        │        │        │
//        3 ────── 4 ────── 5
export const FRIENDS = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 60, y: 56 },
    { id: '1', x: 180, y: 40 },
    { id: '2', x: 300, y: 64 },
    { id: '3', x: 78, y: 170 },
    { id: '4', x: 196, y: 186 },
    { id: '5', x: 312, y: 168 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '0', to: '3' },
    { from: '3', to: '4' },
    { from: '1', to: '4' },
    { from: '2', to: '5' },
    { from: '4', to: '5' },
  ],
}

// Six towns on a ring road, with one road cutting across.
export const ROADS = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 180, y: 28 },
    { id: '1', x: 300, y: 86 },
    { id: '2', x: 300, y: 170 },
    { id: '3', x: 180, y: 204 },
    { id: '4', x: 60, y: 170 },
    { id: '5', x: 60, y: 86 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '0' },
    { from: '0', to: '3' },
  ],
}

// Two groups of friends who do not know each other: two components.
export const TWO_GROUPS = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 56, y: 60 },
    { id: '1', x: 150, y: 44 },
    { id: '2', x: 104, y: 166 },
    { id: '3', x: 250, y: 66 },
    { id: '4', x: 320, y: 120 },
    { id: '5', x: 262, y: 188 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
  ],
}

// A tree of five nodes. Adding the edge 2 - 4 (EXTRA) makes a cycle:
// 0 - 1 - 4 - 2 - 0.
export const TREE_PLUS = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 180, y: 34 },
    { id: '1', x: 100, y: 112 },
    { id: '2', x: 260, y: 112 },
    { id: '3', x: 50, y: 194 },
    { id: '4', x: 150, y: 194 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
  ],
}
export const EXTRA = { from: '2', to: '4' }

// ---------------------------------------------- searching a graph

// A graph with cycles, for breadth-first and depth-first search. Searching
// from 0, breadth-first goes 0 1 2 3 4 5 6 (row by row) and depth-first goes
// 0 1 4 5 2 6 3 (down the left side, along the bottom, then back).
//
//              0
//           /  |  \
//          1   2   3
//          |   |   |
//          4 - 5 - 6
export const SEARCH = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 180, y: 30 },
    { id: '1', x: 62, y: 104 },
    { id: '2', x: 180, y: 104 },
    { id: '3', x: 298, y: 104 },
    { id: '4', x: 62, y: 192 },
    { id: '5', x: 180, y: 192 },
    { id: '6', x: 298, y: 192 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '0', to: '3' },
    { from: '1', to: '4' },
    { from: '2', to: '5' },
    { from: '3', to: '6' },
    { from: '4', to: '5' },
    { from: '5', to: '6' },
  ],
}

// The edge between two nodes, whichever way round it was written.
export function edgeBetween(graph, a, b) {
  return graph.edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a))
}

// The order breadth-first search visits nodes in, and which node found each
// one ({ node: parent }). Neighbours are taken in adjacency-list order.
export function bfsFrom(graph, start) {
  const adj = undirectedList(graph)
  const seen = new Set([start])
  const queue = [start]
  const order = []
  const parent = {}
  while (queue.length) {
    const node = queue.shift()
    order.push(node)
    adj[node].forEach((next) => {
      if (!seen.has(next)) {
        seen.add(next)
        parent[next] = node
        queue.push(next)
      }
    })
  }
  return { order, parent }
}

// The same for depth-first search.
export function dfsFrom(graph, start) {
  const adj = undirectedList(graph)
  const seen = new Set()
  const order = []
  const parent = {}
  const visit = (node) => {
    seen.add(node)
    order.push(node)
    adj[node].forEach((next) => {
      if (!seen.has(next)) {
        parent[next] = node
        visit(next)
      }
    })
  }
  visit(start)
  return { order, parent }
}

// ---------------------------------------------- shortest paths (weighted)

// Six towns and the roads between them, each road with a cost (minutes). Used
// for Dijkstra's algorithm. From A the cheapest route to F is
// A, C, B, D, E, F (cost 13, five roads) - not the one with the fewest roads
// (A, B, D, F, cost 15, three roads).
//
//              B ──5── D
//           4 ╱ │ ╲   ╱ │ ╲ 6
//           A   1   8   2   F
//           2 ╲ │ ╱   ╲ │ ╱ 3
//              C ─10── E
export const ROUTES = {
  width: 360,
  height: 230,
  nodes: [
    { id: 'A', x: 46, y: 115 },
    { id: 'B', x: 150, y: 46 },
    { id: 'C', x: 150, y: 184 },
    { id: 'D', x: 255, y: 46 },
    { id: 'E', x: 255, y: 184 },
    { id: 'F', x: 330, y: 115 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 },
  ],
}

// Two groups of towns with no road between them, so from A nothing in the
// second group can ever be reached.
export const ISLANDS = {
  width: 360,
  height: 230,
  nodes: [
    { id: 'A', x: 56, y: 60 },
    { id: 'B', x: 150, y: 44 },
    { id: 'C', x: 104, y: 166 },
    { id: 'D', x: 250, y: 66 },
    { id: 'E', x: 320, y: 120 },
    { id: 'F', x: 262, y: 188 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 3 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'A', to: 'C', weight: 6 },
    { from: 'D', to: 'E', weight: 4 },
    { from: 'E', to: 'F', weight: 1 },
  ],
}

// One-way roads with a negative cost (a toll refund, say). Dijkstra locks A in
// at 2, then finds S -> B -> A costs only 1, but A is already locked and T never
// hears about it. The true cheapest S to T is S, B, A, T = 2.
export const NEGATIVE = {
  width: 360,
  height: 230,
  nodes: [
    { id: 'S', x: 46, y: 115 },
    { id: 'A', x: 170, y: 44 },
    { id: 'B', x: 170, y: 186 },
    { id: 'T', x: 314, y: 115 },
  ],
  edges: [
    { from: 'S', to: 'A', weight: 2 },
    { from: 'S', to: 'B', weight: 3 },
    { from: 'B', to: 'A', weight: -2 },
    { from: 'A', to: 'T', weight: 1 },
  ],
}

// { A: [['B', 4], ['C', 2]], ... } both ways along every edge.
export function weightedList(graph) {
  const adj = Object.fromEntries(graph.nodes.map((node) => [node.id, []]))
  graph.edges.forEach(({ from, to, weight }) => {
    adj[from].push([to, weight])
    adj[to].push([from, weight])
  })
  return adj
}

// Dijkstra's algorithm, one round per node it finishes (stale heap entries are
// skipped, as in the Python on the page). Each round records what that node
// improved and a copy of everything as it stood afterwards.
//   rounds: [{ node, d, updates: [{ to, was, now }], dist, previous, done }]
//   pushes / pops: how many times the heap was used
export function dijkstraRounds(graph, start) {
  const adj = weightedList(graph)
  const dist = Object.fromEntries(graph.nodes.map((node) => [node.id, Infinity]))
  dist[start] = 0
  const previous = {}
  const done = []
  const heap = [[0, start]]
  const rounds = []
  let pushes = 1
  let pops = 0
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1))
    const [d, node] = heap.shift()
    pops += 1
    if (done.includes(node)) continue
    done.push(node)
    const updates = []
    adj[node].forEach(([to, weight]) => {
      if (d + weight < dist[to]) {
        updates.push({ to, was: dist[to], now: d + weight })
        dist[to] = d + weight
        previous[to] = node
        heap.push([d + weight, to])
        pushes += 1
      }
    })
    rounds.push({ node, d, updates, dist: { ...dist }, previous: { ...previous }, done: [...done] })
  }
  return { rounds, dist, previous, pushes, pops }
}

// ---------------------------------------------- Bellman-Ford

// One-way roads, one of them negative (C -> B refunds 2). The edges are listed
// in an unlucky order on purpose: Bellman-Ford checks them in this order every
// pass, so the news from A needs all four passes to reach E. From A the
// cheapest costs are B 3 (A, C, B), C 5, D 6 (A, C, B, D), E 8.
//
//         4       3       2
//      A ───▶ B ───▶ D ───▶ E
//      │      ▲
//    5 │      │ -2
//      ▼      │
//      C ─────┘
export const BELLMAN = {
  width: 360,
  height: 230,
  nodes: [
    { id: 'A', x: 46, y: 115 },
    { id: 'B', x: 150, y: 46 },
    { id: 'C', x: 150, y: 184 },
    { id: 'D', x: 258, y: 46 },
    { id: 'E', x: 320, y: 140 },
  ],
  edges: [
    { from: 'D', to: 'E', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'B', weight: -2 },
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 5 },
  ],
}

// The same graph with the edges in a lucky order (the order of the cheapest
// routes), so one pass is enough.
export const BELLMAN_LUCKY = {
  ...BELLMAN,
  edges: [
    { from: 'A', to: 'C', weight: 5 },
    { from: 'C', to: 'B', weight: -2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'A', to: 'B', weight: 4 },
  ],
}

// B -> C -> D -> B costs 2 + (-4) + 1 = -1 each lap, so going round again
// always makes things cheaper: a negative cycle.
export const NEG_CYCLE = {
  width: 360,
  height: 230,
  nodes: [
    { id: 'A', x: 46, y: 115 },
    { id: 'B', x: 150, y: 56 },
    { id: 'C', x: 280, y: 56 },
    { id: 'D', x: 215, y: 180 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: -4 },
    { from: 'D', to: 'B', weight: 1 },
  ],
}

// Bellman-Ford, one record per pass over all the edges (in the order listed).
// `count` passes are run (V - 1 by default; pass V to see whether pass V still
// improves something, which means a negative cycle).
//   passes: [{ changes: [{ edge, was, now }], dist, previous }]
export function bellmanFordPasses(graph, start, count = graph.nodes.length - 1) {
  const dist = Object.fromEntries(graph.nodes.map((node) => [node.id, Infinity]))
  dist[start] = 0
  const previous = {}
  const passes = []
  for (let p = 0; p < count; p++) {
    const changes = []
    graph.edges.forEach((edge) => {
      if (dist[edge.from] + edge.weight < dist[edge.to]) {
        changes.push({ edge, was: dist[edge.to], now: dist[edge.from] + edge.weight })
        dist[edge.to] = dist[edge.from] + edge.weight
        previous[edge.to] = edge.from
      }
    })
    passes.push({ changes, dist: { ...dist }, previous: { ...previous } })
  }
  return { passes, dist, previous }
}

// ---------------------------------------------- minimum spanning trees

// Seven towns to join with cable, and what each possible cable would cost.
// All the costs are different, so the cheapest way to connect everything (the
// minimum spanning tree) is unique: A-G, G-B, B-C, C-D, D-E, E-F = 23. It is a
// long chain. Dijkstra's shortest-path tree from A is a star around G that
// costs 50, because it cares about each town's distance from A, not the total.
//
// A to F form a ring (A-B, B-C, C-D, D-E, E-F, F-A) and G in the middle is
// joined to all six.
export const PRIM_GRAPH = {
  width: 360,
  height: 232,
  nodes: [
    { id: 'A', x: 56, y: 72 },
    { id: 'B', x: 180, y: 34 },
    { id: 'C', x: 304, y: 72 },
    { id: 'D', x: 304, y: 160 },
    { id: 'E', x: 180, y: 198 },
    { id: 'F', x: 56, y: 160 },
    { id: 'G', x: 180, y: 116 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 6 },
    { from: 'B', to: 'C', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'D', to: 'E', weight: 1 },
    { from: 'E', to: 'F', weight: 2 },
    { from: 'F', to: 'A', weight: 12 },
    { from: 'G', to: 'A', weight: 4 },
    { from: 'G', to: 'B', weight: 3 },
    { from: 'G', to: 'C', weight: 7 },
    { from: 'G', to: 'D', weight: 11 },
    { from: 'G', to: 'E', weight: 10 },
    { from: 'G', to: 'F', weight: 9 },
  ],
}

// The edges with exactly one end inside `inTree` (a list of node ids): the
// only edges that can grow the tree.
export function crossingEdges(graph, inTree) {
  return graph.edges.filter((edge) => inTree.includes(edge.from) !== inTree.includes(edge.to))
}

// Prim's algorithm as in the Python on the page (a heap of (weight, from, to),
// stale entries skipped). One round per node added to the tree.
//   rounds: [{ edge: { from, to, weight }, node, before: crossing edges when it
//   was chosen, skipped: stale entries thrown away on the way, tree: node ids
//   after, treeEdges: the edges chosen so far, total }]
//   pushes / pops: how many times the heap was used
export function primRounds(graph, start) {
  const adj = weightedList(graph)
  const inTree = [start]
  const treeEdges = []
  const rounds = []
  const heap = adj[start].map(([to, weight]) => [weight, start, to])
  let pushes = heap.length
  let pops = 0
  let skipped = []
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1) || (a[2] < b[2] ? -1 : 1))
    const before = crossingEdges(graph, inTree)
    const [weight, from, to] = heap.shift()
    pops += 1
    if (inTree.includes(to)) {
      skipped.push({ from, to, weight })
      continue
    }
    inTree.push(to)
    const edge = { from, to, weight }
    treeEdges.push(edge)
    rounds.push({
      edge,
      node: to,
      before,
      skipped,
      tree: [...inTree],
      treeEdges: [...treeEdges],
      total: treeEdges.reduce((sum, e) => sum + e.weight, 0),
    })
    skipped = []
    adj[to].forEach(([next, w]) => {
      if (!inTree.includes(next)) {
        heap.push([w, to, next])
        pushes += 1
      }
    })
  }
  return { rounds, tree: inTree, treeEdges, total: treeEdges.reduce((sum, e) => sum + e.weight, 0), pushes, pops }
}

// Kruskal's algorithm as in the Python on the page: sort every edge, then keep
// an edge unless both its ends are already in the same group (Union-Find with
// path halving, joining the first end's root under the second's). Stops as soon
// as it has V - 1 edges. One round per edge looked at.
//   sorted: all the edges, cheapest first
//   rounds: [{ edge, rootU, rootV, kept, parent (copy), groups (lists of node
//   ids, groups of one left out), colours ({ node: 'grp1'... } for nodes in a
//   group), tree (edges kept so far), total }]
export function kruskalRun(graph) {
  const sorted = graph.edges
    .slice()
    .sort((a, b) => a.weight - b.weight || (a.from < b.from ? -1 : a.from > b.from ? 1 : 0) || (a.to < b.to ? -1 : 1))
  const parent = Object.fromEntries(graph.nodes.map((node) => [node.id, node.id]))
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]
      x = parent[x]
    }
    return x
  }
  const colourOf = {} // root-independent: a node's group colour, kept stable
  let nextColour = 0
  const tree = []
  const rounds = []
  for (const edge of sorted) {
    const rootU = find(edge.from)
    const rootV = find(edge.to)
    const kept = rootU !== rootV
    if (kept) {
      const members = (root) => graph.nodes.map((n) => n.id).filter((id) => find(id) === root)
      const left = members(rootU)
      const right = members(rootV)
      const coloured = [...left, ...right].find((id) => colourOf[id])
      let colour = coloured ? colourOf[coloured] : `grp${(nextColour++ % 4) + 1}`
      if (left.length > 1 && right.length > 1) {
        const bigger = left.length >= right.length ? left : right
        colour = colourOf[bigger[0]]
      }
      parent[rootU] = rootV
      ;[...left, ...right].forEach((id) => {
        colourOf[id] = colour
      })
      tree.push(edge)
    }
    const groups = {}
    graph.nodes.forEach(({ id }) => {
      ;(groups[find(id)] ||= []).push(id)
    })
    rounds.push({
      edge,
      rootU,
      rootV,
      kept,
      parent: { ...parent },
      groups: Object.values(groups).filter((g) => g.length > 1),
      colours: { ...colourOf },
      tree: [...tree],
      total: tree.reduce((sum, e) => sum + e.weight, 0),
    })
    if (tree.length === graph.nodes.length - 1) break
  }
  return { sorted, rounds, tree, total: tree.reduce((sum, e) => sum + e.weight, 0) }
}

// The Seven Bridges of Königsberg (1736). Four pieces of land, seven bridges:
// two between the north bank and the island, two between the south bank and
// the island, and one each from the east side to the north bank, the south
// bank and the island. The positions match the map drawn on the Graph Theory
// page, so the land can turn into the nodes.
export const KONIGSBERG = {
  width: 360,
  height: 240,
  nodes: [
    { id: 'N', x: 180, y: 34 },
    { id: 'I', x: 170, y: 120 },
    { id: 'S', x: 180, y: 206 },
    { id: 'E', x: 310, y: 120 },
  ],
  edges: [
    { id: 'b1', from: 'N', to: 'I' },
    { id: 'b2', from: 'N', to: 'I' },
    { id: 'b3', from: 'S', to: 'I' },
    { id: 'b4', from: 'S', to: 'I' },
    { id: 'b5', from: 'N', to: 'E' },
    { id: 'b6', from: 'S', to: 'E' },
    { id: 'b7', from: 'I', to: 'E' },
  ],
}

// A small town where a walk over every road exactly once does exist: start at
// 0 and end at 1 (0, 1, 2, 3, 1).
export const SMALL_TOWN = {
  width: 360,
  height: 240,
  nodes: [
    { id: '0', x: 60, y: 120 },
    { id: '1', x: 160, y: 120 },
    { id: '2', x: 260, y: 56 },
    { id: '3', x: 260, y: 184 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '1' },
  ],
}

// A ring of five: every node has exactly two roads, so you can walk the whole
// ring and end up back where you started.
export const RING = {
  width: 360,
  height: 240,
  nodes: [
    { id: '0', x: 180, y: 30 },
    { id: '1', x: 290, y: 108 },
    { id: '2', x: 248, y: 206 },
    { id: '3', x: 112, y: 206 },
    { id: '4', x: 70, y: 108 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '0' },
  ],
}

// The same two forms for an undirected graph: every edge is written down at
// both ends, so each edge adds two entries to the list and two 1s to the grid.
export function undirectedList(graph) {
  const adj = Object.fromEntries(graph.nodes.map((node) => [node.id, []]))
  graph.edges.forEach(({ from, to }) => {
    adj[from].push(to)
    adj[to].push(from)
  })
  return adj
}

export function undirectedMatrix(graph) {
  const index = Object.fromEntries(graph.nodes.map((node, i) => [node.id, i]))
  const matrix = graph.nodes.map(() => graph.nodes.map(() => 0))
  graph.edges.forEach(({ from, to }) => {
    matrix[index[from]][index[to]] = 1
    matrix[index[to]][index[from]] = 1
  })
  return matrix
}

// A second small graph for the tracer's other presets.
export const TASKS = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 56, y: 116 },
    { id: '1', x: 162, y: 46 },
    { id: '2', x: 162, y: 186 },
    { id: '3', x: 270, y: 116 },
    { id: '4', x: 330, y: 46 },
    { id: '5', x: 330, y: 186 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '3', to: '5' },
  ],
}

// Three pairs of friends who follow each other, so every edge has a partner.
export const MUTUAL = {
  width: 360,
  height: 230,
  nodes: [
    { id: '0', x: 60, y: 60 },
    { id: '1', x: 180, y: 40 },
    { id: '2', x: 300, y: 60 },
    { id: '3', x: 60, y: 170 },
    { id: '4', x: 180, y: 190 },
    { id: '5', x: 300, y: 170 },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '0' },
    { from: '1', to: '2' },
    { from: '2', to: '1' },
    { from: '0', to: '3' },
    { from: '3', to: '0' },
    { from: '4', to: '5' },
    { from: '5', to: '4' },
  ],
}
