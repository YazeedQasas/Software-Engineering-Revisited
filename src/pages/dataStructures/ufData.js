// A tiny disjoint set (Union-Find) for the Disjoint Sets page: the same find and
// union as the Python on the page, plus the picture of a forest of trees for
// TreeView. Used by the tracer and by the visuals.
//
// Things are numbered 0 to n - 1. parent[x] is who x points to (a root points
// at itself) and size[r] is how many things are in the group whose root is r
// (only meaningful for roots).

export const nodeId = (x) => `n${x}`

export function makeSets(n) {
  return { parent: Array.from({ length: n }, (_, i) => i), size: Array(n).fill(1) }
}

export const copySets = (sets) => ({ parent: sets.parent.slice(), size: sets.size.slice() })

// Follow the pointers up to the root, changing nothing.
export function rootOf(parent, x) {
  while (parent[x] !== x) x = parent[x]
  return x
}

// How many hops from x to its root.
export function depthOf(parent, x) {
  let hops = 0
  while (parent[x] !== x) {
    x = parent[x]
    hops++
  }
  return hops
}

export const heightOf = (parent) => Math.max(...parent.map((_, x) => depthOf(parent, x)))

// The real thing: find with path halving, and union by size.
export function find(parent, x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]]
    x = parent[x]
  }
  return x
}

export function union(sets, a, b) {
  let rootA = find(sets.parent, a)
  let rootB = find(sets.parent, b)
  if (rootA === rootB) return false
  if (sets.size[rootA] < sets.size[rootB]) [rootA, rootB] = [rootB, rootA]
  sets.parent[rootB] = rootA
  sets.size[rootA] += sets.size[rootB]
  return true
}

// A set of n things after joining the given pairs, in order.
export function applyUnions(n, pairs) {
  const sets = makeSets(n)
  pairs.forEach(([a, b]) => union(sets, a, b))
  return sets
}

// Every group, each sorted, the groups ordered by their smallest member.
export function groupsOf(parent) {
  const byRoot = {}
  parent.forEach((_, x) => {
    ;(byRoot[rootOf(parent, x)] ??= []).push(x)
  })
  return Object.values(byRoot).sort((a, b) => a[0] - b[0])
}

// One colour for each group with more than one thing in it, so you can see the
// groups at a glance. Things alone in a group are left plain.
export function groupStates(parent) {
  const states = {}
  groupsOf(parent)
    .filter((members) => members.length > 1)
    .forEach((members, k) => {
      members.forEach((x) => {
        states[nodeId(x)] = `grp${(k % 4) + 1}`
      })
    })
  return states
}

export const listText = (members) =>
  members.length <= 2 ? members.join(' and ') : `${members.slice(0, -1).join(', ')} and ${members[members.length - 1]}`

// ---------------------------------------------------------------- the forest

// The forest as TreeView draws it: every group is a tree with its root on top.
// Spacing depends only on n, so trees do not jump about as they change, and
// `rows` fixes the height so the picture does not grow and shrink.
//   size: when given, each root shows its group size under it.
export function forestSnapshot(parent, { size = null, rows, width = 360, top = 26, gap = 54, margin = 24 } = {}) {
  const n = parent.length
  const kids = parent.map(() => [])
  const roots = []
  parent.forEach((p, x) => {
    if (p === x) roots.push(x)
    else kids[p].push(x)
  })

  const slotOf = []
  const depthOf_ = []
  let leaves = 0
  let deepest = 0
  const place = (x, depth) => {
    deepest = Math.max(deepest, depth)
    depthOf_[x] = depth
    if (kids[x].length === 0) {
      slotOf[x] = leaves++
    } else {
      kids[x].forEach((k) => place(k, depth + 1))
      slotOf[x] = (slotOf[kids[x][0]] + slotOf[kids[x][kids[x].length - 1]]) / 2
    }
  }
  roots.forEach((r) => place(r, 0))

  const step = Math.min(60, (width - 2 * margin) / Math.max(n - 1, 1))
  const left = (width - (leaves - 1) * step) / 2
  const levels = rows ?? deepest + 1

  const nodes = parent.map((_, x) => ({
    id: nodeId(x),
    label: String(x),
    ...(size && parent[x] === x ? { sub: `size ${size[x]}` } : {}),
    x: left + slotOf[x] * step,
    y: top + depthOf_[x] * gap,
  }))
  const edges = []
  parent.forEach((p, x) => {
    if (p !== x) edges.push([nodeId(p), nodeId(x)])
  })
  return { width, height: top + (levels - 1) * gap + 40, nodes, edges }
}
