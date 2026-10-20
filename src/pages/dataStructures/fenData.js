// A tiny Fenwick tree for the Fenwick Trees page: the stored sums, the
// "lowest 1-bit" arithmetic they depend on, the walks a question or a change
// makes, and the tree that is hiding in the array (for TreeView).
// Used by the tracer and by the visuals.

// The array used on the page (the same one as the Segment Trees page).
// A Fenwick tree counts positions from 1, so on this page:
//
//   position:  1  2  3  4  5  6  7  8
//   value:     2  5  1  4  9  3  7  6
export const BASE = [2, 5, 1, 4, 9, 3, 7, 6]

// The lowest 1-bit of i, as a number: 6 (110) gives 2 (010).
export const lowbit = (i) => i & -i

// How many binary digits it takes to write n.
export const bitLength = (n) => n.toString(2).length

// Box i adds up the lowbit(i) positions that end at i.
export const coverOf = (i) => ({ from: i - lowbit(i) + 1, to: i })

export const coverText = (i) => {
  const { from, to } = coverOf(i)
  return from === to ? `position ${to}` : `positions ${from} to ${to}`
}

// The stored sums, index 0 unused (a Fenwick tree starts at 1). Worked out
// straight from the definition, not with the O(n) trick the page teaches, so
// the two can be checked against each other.
export function fenTree(nums) {
  const tree = [0]
  for (let i = 1; i <= nums.length; i++) {
    const { from, to } = coverOf(i)
    tree.push(nums.slice(from - 1, to).reduce((a, b) => a + b, 0))
  }
  return tree
}

// The boxes a "sum of the first i numbers" question reads: i, then i with its
// lowest 1-bit removed, and so on down to 0.
export function queryPath(i) {
  const out = []
  for (; i > 0; i -= lowbit(i)) out.push(i)
  return out
}

// The boxes a change at position i must fix: i, then i plus its lowest 1-bit,
// and so on until the number passes n.
export function updatePath(i, n) {
  const out = []
  for (; i <= n; i += lowbit(i)) out.push(i)
  return out
}

export const sumTo = (nums, i) => nums.slice(0, i).reduce((a, b) => a + b, 0)

// ---------------------------------------------------------------- the tree

// Box i hands its change up to box i + lowbit(i); that is its parent. Boxes
// whose parent would be past n are roots (for 8 boxes there is only one: 8).
export function fenForest(n) {
  const kids = {}
  const roots = []
  for (let i = 1; i <= n; i++) {
    const parent = i + lowbit(i)
    if (parent <= n) (kids[parent] ??= []).push(i)
    else roots.push(i)
  }
  return { kids, roots }
}

// Fixed positions for every node, leaves spread evenly, each parent above the
// middle of its first and last child, like layoutSeg on the Segment Trees page.
export function layoutFen(n, { width = 360, top = 26, gap = 54, margin = 24 } = {}) {
  const { kids, roots } = fenForest(n)
  const slotOf = {}
  const depthOf = {}
  let leaves = 0
  let deepest = 0

  const place = (i, depth) => {
    deepest = Math.max(deepest, depth)
    depthOf[i] = depth
    const below = kids[i] ?? []
    if (below.length === 0) {
      slotOf[i] = leaves++
    } else {
      below.forEach((k) => place(k, depth + 1))
      slotOf[i] = (slotOf[below[0]] + slotOf[below[below.length - 1]]) / 2
    }
  }
  roots.forEach((r) => place(r, 0))

  const step = leaves > 1 ? (width - 2 * margin) / (leaves - 1) : 0
  const pos = {}
  Object.keys(slotOf).forEach((i) => {
    pos[i] = { x: leaves > 1 ? margin + slotOf[i] * step : width / 2, y: top + depthOf[i] * gap }
  })
  return { width, height: top + deepest * gap + 40, pos }
}

// The tree as TreeView draws it: the label is the box number, and the small
// caption under it says which positions that box adds up.
export function fenSnapshot(n, layout) {
  const { kids } = fenForest(n)
  const nodes = []
  const edges = []
  Object.keys(layout.pos).forEach((key) => {
    const i = Number(key)
    const { from, to } = coverOf(i)
    nodes.push({ id: `b${i}`, label: String(i), sub: from === to ? `[${to}]` : `${from}–${to}`, ...layout.pos[i] })
    ;(kids[i] ?? []).forEach((k) => edges.push([`b${i}`, `b${k}`]))
  })
  return { width: layout.width, height: layout.height, nodes, edges }
}
