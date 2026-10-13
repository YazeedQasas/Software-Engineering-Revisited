// A tiny B-tree for the B-Trees page: building one from a nested description
// and laying it out for BTreeView. Every node has an id that never changes, a
// sorted list of keys and (unless it is a leaf) one more child than keys.
//
// The page uses nodes of at most 3 keys (up to 4 children) so the pictures
// stay readable. Real B-trees hold hundreds of keys per node.

export const MAX_KEYS = 3

export function makeIds() {
  let n = 0
  return () => `n${n++}`
}

export const isLeaf = (node) => node.children.length === 0

// spec: a leaf is just its keys, e.g. [5, 10]. A node with children is
// [keys, [childSpec, ...]], e.g. [[20, 40], [[5, 10], [25, 30], [45, 50]]].
export function fromSpec(spec, nextId) {
  const leaf = typeof spec[0] === 'number'
  const keys = leaf ? spec : spec[0]
  const kids = leaf ? [] : spec[1]
  const id = nextId()
  return { id, keys: [...keys], children: kids.map((kid) => fromSpec(kid, nextId)) }
}

// The tree used by most of the page:
//
//                 [ 60 ]
//             /           \
//        [ 20 40 ]        [ 75 ]
//        /  |   \         /    \
//   [5 10][25 30][45 50 55]  [65 70][78]
export const BIG_TREE = [[60], [
  [[20, 40], [[5, 10], [25, 30], [45, 50, 55]]],
  [[75], [[65, 70], [78]]],
]]

// Lays the tree out left to right: leaves are spaced evenly and every parent
// sits centred over its children. `cell` must match BTreeView.
export function layoutBTree(root, { cell = 24, pad = 10, gap = 14, rowGap = 62, top = 12, nodeH = 28, width = 380, height = 188 } = {}) {
  const nodes = []
  const edges = []
  let cursor = 0

  const place = (node, depth) => {
    const w = Math.max(1, node.keys.length) * cell + pad
    let x
    let placed = []
    if (isLeaf(node)) {
      x = cursor
      cursor += w + gap
    } else {
      placed = node.children.map((child) => place(child, depth + 1))
      const first = placed[0]
      const last = placed[placed.length - 1]
      x = (first.x + last.x + last.w) / 2 - w / 2
    }
    const entry = { id: node.id, keys: node.keys.slice(), x, y: top + depth * rowGap, w, h: nodeH }
    nodes.push(entry)
    placed.forEach((child, slot) => edges.push([node.id, child.id, slot]))
    return entry
  }
  place(root, 0)

  const left = Math.min(...nodes.map((node) => node.x))
  const right = Math.max(...nodes.map((node) => node.x + node.w))
  const margin = 8
  const total = right - left
  const viewWidth = Math.max(width, total + margin * 2)
  const shift = (viewWidth - total) / 2 - left
  nodes.forEach((node) => {
    node.x += shift
  })

  return { width: viewWidth, height, pad, nodes, edges }
}

// Splits a node holding too many keys: the middle key moves up, the keys
// before it stay, the keys after it move to a new node on the right.
export function splitNode(node, nextId) {
  const mid = Math.floor(node.keys.length / 2)
  const median = node.keys[mid]
  const right = {
    id: nextId(),
    keys: node.keys.slice(mid + 1),
    children: node.children.slice(mid + 1),
  }
  node.keys = node.keys.slice(0, mid)
  node.children = node.children.slice(0, mid + 1)
  return { median, right }
}
