// Suffix arrays and suffix trees for the Suffix Trees and Arrays page: the
// suffixes of a word, their sorted order, the longest-common-prefix list, a
// suffix trie and the suffix tree made by squashing it, and a layout for
// TreeView. Used by the tracers and by the visuals.

export const WORD = 'banana'

// $ marks the end of the word in the tree, so that no suffix is the start of
// another suffix (so every suffix ends at a leaf).
export const END = '$'

export const suffixesOf = (s) => Array.from({ length: s.length }, (_, i) => s.slice(i))

// Where each suffix starts, in the order the suffixes would sit in a dictionary.
export function suffixArray(s) {
  const order = Array.from({ length: s.length }, (_, i) => i)
  return order.sort((a, b) => {
    const [x, y] = [s.slice(a), s.slice(b)]
    return x < y ? -1 : x > y ? 1 : 0
  })
}

export function commonPrefix(a, b) {
  let k = 0
  while (k < a.length && k < b.length && a[k] === b[k]) k++
  return k
}

// lcp[k] is how many letters suffix sa[k] shares with the one before it.
export const lcpArray = (s, sa) => sa.map((start, k) => (k === 0 ? 0 : commonPrefix(s.slice(sa[k - 1]), s.slice(start))))

export const distinctSubstrings = (s, lcp) => (s.length * (s.length + 1)) / 2 - lcp.reduce((a, b) => a + b, 0)

// ----------------------------------------------------------- tries and trees

// A node: { id, label, kids, start }. `label` is the text on the edge from its
// parent, and `start` (leaves only) is where its suffix starts in the word.
// Children are kept in alphabetical order, $ first.
const byLabel = (a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0)

// Every suffix of s put into a trie, one letter per edge. s should end in $.
export function suffixTrie(s) {
  let counter = 0
  const make = (label) => ({ id: `t${counter++}`, label, kids: [], start: null })
  const root = make('')
  for (let i = 0; i < s.length; i++) {
    let node = root
    for (const ch of s.slice(i)) {
      let next = node.kids.find((k) => k.label === ch)
      if (!next) {
        next = make(ch)
        node.kids.push(next)
      }
      node = next
    }
    node.start = i
  }
  // Number the nodes again in reading order, so that ids do not depend on the
  // order the suffixes were put in.
  const sortAll = (node) => {
    node.kids.sort(byLabel)
    node.kids.forEach(sortAll)
  }
  sortAll(root)
  counter = 0
  const renumber = (node) => {
    node.id = `t${counter++}`
    node.kids.forEach(renumber)
  }
  renumber(root)
  return root
}

// The suffix tree: the same trie, with every chain of single-child nodes
// squashed into one edge that carries all of their letters.
export function squash(trie) {
  let counter = 0
  const walk = (node, label) => {
    let current = node
    let text = label
    while (current.kids.length === 1) {
      current = current.kids[0]
      text += current.label
    }
    const copy = { id: `s${counter++}`, label: text, kids: [], start: current.start }
    current.kids.forEach((kid) => copy.kids.push(walk(kid, kid.label)))
    return copy
  }
  // the root keeps its own (empty) label and is never merged downwards
  const root = { id: `s${counter++}`, label: '', kids: [], start: null }
  trie.kids.forEach((kid) => root.kids.push(walk(kid, kid.label)))
  return root
}

export const buildSuffixTree = (s) => squash(suffixTrie(s))

export const isLeaf = (node) => node.kids.length === 0

export const nodesOf = (node) => [node, ...node.kids.flatMap(nodesOf)]

// Where the suffixes below a node start, left to right.
export const leafStarts = (node) => (isLeaf(node) ? [node.start] : node.kids.flatMap(leafStarts))

// ------------------------------------------------------------------- layout

// A tree drawn for TreeView: every edge carries its text as a third item. A
// leaf shows where its suffix starts, other nodes are empty circles. Leaves are
// spread evenly, each parent sits above the middle of its first and last child.
//   rows: how many levels tall to make the picture (so it does not change
//   height from one frame to the next).
export function treeSnapshot(root, { rows, width = 440, top = 24, gap = 56, margin = 28 } = {}) {
  const slotOf = {}
  const depthOf = {}
  let leaves = 0
  let deepest = 0
  const place = (node, depth) => {
    deepest = Math.max(deepest, depth)
    depthOf[node.id] = depth
    if (isLeaf(node)) {
      slotOf[node.id] = leaves++
    } else {
      node.kids.forEach((k) => place(k, depth + 1))
      slotOf[node.id] = (slotOf[node.kids[0].id] + slotOf[node.kids[node.kids.length - 1].id]) / 2
    }
  }
  place(root, 0)

  const step = leaves > 1 ? (width - 2 * margin) / (leaves - 1) : 0
  const nodes = []
  const edges = []
  const walk = (node) => {
    nodes.push({
      id: node.id,
      label: isLeaf(node) ? String(node.start) : '',
      x: leaves > 1 ? margin + slotOf[node.id] * step : width / 2,
      y: top + depthOf[node.id] * gap,
    })
    node.kids.forEach((k) => {
      edges.push([node.id, k.id, k.label])
      walk(k)
    })
  }
  walk(root)
  return { width, height: top + ((rows ?? deepest + 1) - 1) * gap + 30, nodes, edges }
}

export const edgeKey = (from, to) => `${from}-${to}`
