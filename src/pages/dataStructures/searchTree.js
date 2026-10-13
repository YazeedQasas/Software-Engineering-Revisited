// The tree used on the Tree Search page, by the tracers and by the visuals.
//
//           A
//         /   \
//        B     C
//       / \   / \
//      D   E F   G
//      |
//      H

export const CHILDREN = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F', 'G'],
  D: ['H'],
  E: [],
  F: [],
  G: [],
  H: [],
}

export const SEARCH_TREE = {
  width: 360,
  height: 214,
  nodes: [
    { id: 'A', x: 180, y: 26 },
    { id: 'B', x: 105, y: 80 },
    { id: 'C', x: 255, y: 80 },
    { id: 'D', x: 65, y: 134 },
    { id: 'E', x: 145, y: 134 },
    { id: 'F', x: 215, y: 134 },
    { id: 'G', x: 295, y: 134 },
    { id: 'H', x: 65, y: 188 },
  ],
  edges: [
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'D'],
    ['B', 'E'],
    ['C', 'F'],
    ['C', 'G'],
    ['D', 'H'],
  ],
}

// The order each search looks at the nodes in (children go left to right).
function bfsOrder(start = 'A') {
  const queue = [start]
  const order = []
  while (queue.length) {
    const node = queue.shift()
    order.push(node)
    queue.push(...CHILDREN[node])
  }
  return order
}

function dfsOrder(start = 'A') {
  const stack = [start]
  const order = []
  while (stack.length) {
    const node = stack.pop()
    order.push(node)
    stack.push(...CHILDREN[node].slice().reverse())
  }
  return order
}

export const BFS_ORDER = bfsOrder()
export const DFS_ORDER = dfsOrder()
