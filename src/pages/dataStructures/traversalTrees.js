// The binary trees used on the Tree Traversals page. Every value is unique and
// each tree is a binary search tree, so an in-order walk prints 1, 2, 3, ...
//
//   Balanced           Lopsided
//
//        4                  5
//      /   \              /   \
//     2     6            2     8
//    / \   / \          / \     \
//   1   3 5   7        1   4     9
//                          /
//                         3

export function makeTree(width, height, specs) {
  const nodes = []
  const edges = []
  const kids = {}
  specs.forEach(({ id, x, y, left = null, right = null }) => {
    nodes.push({ id, x, y })
    kids[id] = [left, right]
    if (left) edges.push([id, left])
    if (right) edges.push([id, right])
  })
  return { width, height, root: specs[0].id, nodes, edges, kids }
}

export const BALANCED = makeTree(360, 170, [
  { id: '4', x: 180, y: 26, left: '2', right: '6' },
  { id: '2', x: 105, y: 80, left: '1', right: '3' },
  { id: '6', x: 255, y: 80, left: '5', right: '7' },
  { id: '1', x: 65, y: 134 },
  { id: '3', x: 145, y: 134 },
  { id: '5', x: 215, y: 134 },
  { id: '7', x: 295, y: 134 },
])

export const LOPSIDED = makeTree(360, 214, [
  { id: '5', x: 180, y: 26, left: '2', right: '8' },
  { id: '2', x: 105, y: 80, left: '1', right: '4' },
  { id: '8', x: 255, y: 80, right: '9' },
  { id: '1', x: 65, y: 134 },
  { id: '4', x: 145, y: 134, left: '3' },
  { id: '9', x: 295, y: 134 },
  { id: '3', x: 115, y: 188 },
])

// The same tree scaled down so three of them fit side by side.
export function shrink(tree, factor) {
  return {
    ...tree,
    width: tree.width * factor,
    height: tree.height * factor,
    nodes: tree.nodes.map((node) => ({ ...node, x: node.x * factor, y: node.y * factor })),
  }
}

// The order each traversal visits the nodes in.
export function walk(tree, kind, id = tree.root) {
  if (id === null) return []
  const [left, right] = tree.kids[id]
  const l = walk(tree, kind, left)
  const r = walk(tree, kind, right)
  if (kind === 'pre') return [id, ...l, ...r]
  if (kind === 'in') return [...l, id, ...r]
  return [...l, ...r, id]
}
