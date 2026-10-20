// A tiny segment tree for the Segment Trees page: build one over an array,
// ask it for the nodes a range query uses, and lay it out for TreeView.
// Used by the tracer and by the visuals.

// The array used on the page.
//
//   position:  0  1  2  3  4  5  6  7
//   value:     2  5  1  4  9  3  7  6
export const BASE = [2, 5, 1, 4, 9, 3, 7, 6]

export const add = (a, b) => a + b
export const smaller = (a, b) => Math.min(a, b)

// A node covers positions lo..hi of the array. Its index is the heap-style
// number the Python uses (the root is 1, the children of k are 2k and 2k+1),
// and its id is that number with an 'n' in front. `sum` is null until it has
// been worked out.
export function makeSeg(nums, index = 1, lo = 0, hi = nums.length - 1) {
  const node = { id: `n${index}`, index, lo, hi, sum: null, left: null, right: null }
  if (lo < hi) {
    const mid = (lo + hi) >> 1
    node.left = makeSeg(nums, 2 * index, lo, mid)
    node.right = makeSeg(nums, 2 * index + 1, mid + 1, hi)
  }
  return node
}

// Works out every node's value, bottom up, with `combine` (add for sums).
export function fillSeg(node, nums, combine = add) {
  if (node.lo === node.hi) {
    node.sum = nums[node.lo]
  } else {
    fillSeg(node.left, nums, combine)
    fillSeg(node.right, nums, combine)
    node.sum = combine(node.left.sum, node.right.sum)
  }
  return node
}

export function buildSeg(nums, combine = add) {
  return fillSeg(makeSeg(nums), nums, combine)
}

// Every node, top to bottom, left to right within a level's subtree.
export const nodesOf = (node) => (node ? [node, ...nodesOf(node.left), ...nodesOf(node.right)] : [])

export const isLeaf = (node) => node.lo === node.hi

// How far this node is above the bottom of its own branch (a leaf is 0).
export const heightOf = (node) => (isLeaf(node) ? 0 : 1 + Math.max(heightOf(node.left), heightOf(node.right)))

export const rangeText = (node) => (isLeaf(node) ? `${node.lo}` : `${node.lo}–${node.hi}`)

// The nodes a range query meets: `full` ones lie completely inside the range
// (their stored value is used), `partial` ones overlap it (so both children are
// asked) and `none` ones lie completely outside (ignored). Left to right.
export function decompose(node, left, right) {
  const out = { full: [], partial: [], none: [] }
  const visit = (n) => {
    if (right < n.lo || n.hi < left) {
      out.none.push(n)
    } else if (left <= n.lo && n.hi <= right) {
      out.full.push(n)
    } else {
      out.partial.push(n)
      visit(n.left)
      visit(n.right)
    }
  }
  visit(node)
  return out
}

// Fixed positions for every node, so the tree does not move while its numbers
// change. Leaves are spread evenly; each parent sits above the middle of its
// children.
export function layoutSeg(root, { width = 360, top = 26, gap = 54, margin = 24 } = {}) {
  const slotOf = {}
  const pos = {}
  let leaves = 0
  let deepest = 0

  const place = (node, depth) => {
    deepest = Math.max(deepest, depth)
    if (isLeaf(node)) {
      slotOf[node.id] = leaves++
    } else {
      place(node.left, depth + 1)
      place(node.right, depth + 1)
      slotOf[node.id] = (slotOf[node.left.id] + slotOf[node.right.id]) / 2
    }
    pos[node.id] = { y: top + depth * gap }
  }
  place(root, 0)

  const step = leaves > 1 ? (width - 2 * margin) / (leaves - 1) : 0
  Object.keys(pos).forEach((id) => {
    pos[id].x = leaves > 1 ? margin + slotOf[id] * step : width / 2
  })
  return { width, height: top + deepest * gap + 40, pos }
}

// The tree as TreeView draws it. A node whose value is not known yet is empty.
// `show` can hide a node's value on purpose (it gets the same empty circle).
export function snapshotSeg(root, layout, { show = () => true } = {}) {
  const nodes = []
  const edges = []
  const walk = (node) => {
    const { x, y } = layout.pos[node.id]
    nodes.push({
      id: node.id,
      label: node.sum === null || !show(node) ? '' : String(node.sum),
      sub: isLeaf(node) ? `[${node.lo}]` : rangeText(node),
      x,
      y,
    })
    ;[node.left, node.right].forEach((kid) => {
      if (kid) {
        edges.push([node.id, kid.id])
        walk(kid)
      }
    })
  }
  walk(root)
  return { width: layout.width, height: layout.height, nodes, edges }
}
