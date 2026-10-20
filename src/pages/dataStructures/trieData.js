// A tiny trie for the Trie page: build one, grow it, and lay it out for
// TreeView. Used by the tracer and by the visuals.

// The words in the tracer's trie and in the autocomplete animation.
//
//          •
//        /   \
//       c     d
//       |     |
//       a     o
//     / | \    \ \
//    p  r  t    g t
//       |
//       t
export const BASE_WORDS = ['cap', 'car', 'cart', 'cat', 'dog', 'dot']

// A node's id is '~' plus the letters on the path to it, so it never changes
// and is never empty (the root is '~').
export function makeNode(prefix, ch) {
  return { id: `~${prefix}`, ch, kids: {}, end: false }
}

export function buildRoot() {
  return makeNode('', '•')
}

export function insertWord(root, word) {
  let node = root
  for (const ch of word) {
    if (!node.kids[ch]) node.kids[ch] = makeNode(node.id.slice(1) + ch, ch)
    node = node.kids[ch]
  }
  node.end = true
  return root
}

export function buildTrie(words) {
  const root = buildRoot()
  words.forEach((word) => insertWord(root, word))
  return root
}

// The children of a node, in alphabetical order.
export function kidsOf(node) {
  return Object.keys(node.kids)
    .sort()
    .map((ch) => node.kids[ch])
}

// The node at the end of `text`, or null if the path breaks.
export function nodeAt(root, text) {
  let node = root
  for (const ch of text) {
    node = node.kids[ch]
    if (!node) return null
  }
  return node
}

// Every node below `node` (and `node` itself), top to bottom.
export function nodesBelow(node) {
  return [node, ...kidsOf(node).flatMap(nodesBelow)]
}

// Every word that ends at or below `node`, alphabetically.
export function wordsBelow(node, path) {
  return [...(node.end ? [path] : []), ...kidsOf(node).flatMap((kid) => wordsBelow(kid, path + kid.ch))]
}

export const countNodes = (root) => nodesBelow(root).length

// Fixed positions for every node of `full`, so a smaller trie drawn with the
// same layout does not move when nodes are added. Leaves are spread evenly;
// each parent sits above the middle of its children.
export function layoutPositions(full, { width = 360, top = 26, gap = 54, margin = 28 } = {}) {
  const pos = {}
  let leaves = 0
  let deepest = 0
  const slotOf = {}

  const place = (node, depth) => {
    deepest = Math.max(deepest, depth)
    const kids = kidsOf(node)
    if (kids.length === 0) {
      slotOf[node.id] = leaves++
    } else {
      kids.forEach((kid) => place(kid, depth + 1))
      slotOf[node.id] = (slotOf[kids[0].id] + slotOf[kids[kids.length - 1].id]) / 2
    }
    pos[node.id] = { y: top + depth * gap }
  }
  place(full, 0)

  const step = leaves > 1 ? (width - 2 * margin) / (leaves - 1) : 0
  Object.keys(pos).forEach((id) => {
    pos[id].x = leaves > 1 ? margin + slotOf[id] * step : width / 2
  })
  return { width, height: top + deepest * gap + 28, pos }
}

// `root` drawn with a layout: the tree for TreeView, and the ids of the nodes
// where a word ends (they get a ring).
export function snapshot(root, layout) {
  const nodes = []
  const edges = []
  const rings = []
  const walk = (node) => {
    const { x, y } = layout.pos[node.id]
    nodes.push({ id: node.id, label: node.ch, x, y })
    if (node.end) rings.push(node.id)
    kidsOf(node).forEach((kid) => {
      edges.push([node.id, kid.id])
      walk(kid)
    })
  }
  walk(root)
  return { tree: { width: layout.width, height: layout.height, nodes, edges }, rings }
}
