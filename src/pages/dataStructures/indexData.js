// The employee table and its indexes, for the two Indexing pages: the rows in
// the order they were added, a sorted ("dense") index, a sparse index over a
// table kept in sorted blocks, a hash index, and a B+ tree. Used by the
// tracers and by the visuals.

import { fromSpec, layoutBTree, makeIds } from './btree.js'

// The table on disk, in the order the rows were added. Every row has a slot
// (its place in the file).
//
//   slot:  0   1   2   3  4   5   6   7  8   9   10  11
//   id:    41  17  93  8  66  25  52  3  78  31  60  14
const IDS = [41, 17, 93, 8, 66, 25, 52, 3, 78, 31, 60, 14]
const NAMES = { 41: 'Ada', 17: 'Ben', 93: 'Cai', 8: 'Dee', 66: 'Eli', 25: 'Fay', 52: 'Gus', 3: 'Hal', 78: 'Ivy', 31: 'Jon', 60: 'Kay', 14: 'Lou' }

export const nameOf = (id) => NAMES[id]
export const makeRows = (ids) => ids.map((id, slot) => ({ slot, id, name: NAMES[id] }))

export const TABLE = makeRows(IDS)
export const SLOT_OF = Object.fromEntries(IDS.map((id, slot) => [id, slot]))

// The same rows, kept in order of id (a "sorted file"), in blocks of three.
export const SORTED_IDS = IDS.slice().sort((a, b) => a - b)
export const SORTED_TABLE = makeRows(SORTED_IDS)
export const BLOCK = 3

// A dense index: one (key, slot) entry for every row, sorted by key.
export const denseIndex = (rows = TABLE) => rows.map((row) => [row.id, row.slot]).sort((a, b) => a[0] - b[0])

// A sparse index: only the first key of every block of the sorted file.
export const sparseIndex = (rows = SORTED_TABLE, block = BLOCK) => rows.filter((_, k) => k % block === 0).map((row) => row.id)

// A hash index spreads the keys over a few buckets with key % BUCKETS.
export const BUCKETS = 5
export const hashBuckets = (ids = IDS) => {
  const buckets = Array.from({ length: BUCKETS }, () => [])
  ids.forEach((id) => buckets[id % BUCKETS].push(id))
  return buckets
}

// How many page reads to find a key when every page holds `fanout` keys.
export const levelsFor = (rows, fanout) => Math.max(1, Math.ceil(Math.log(rows) / Math.log(fanout) - 1e-9))

// ----------------------------------------------------------------- B+ tree

// A B+ tree over the same twelve ids, with at most three keys in a page:
//
//                        [ 41 ]
//               /                   \
//         [ 14 25 ]               [ 60 78 ]
//        /    |    \             /    |    \
//   [3 8] [14 17] [25 31]   [41 52] [60 66] [78 93]
//
// Every key is in a leaf, next to the slot of its row. The keys in the pages
// above are only signposts: each one is the smallest key of the subtree on its
// right. The leaves are linked from left to right.
export const BPLUS_SPEC = [[41], [
  [[14, 25], [[3, 8], [14, 17], [25, 31]]],
  [[60, 78], [[41, 52], [60, 66], [78, 93]]],
]]

// Builds a B+ tree from a nested description (see btree.js), with each leaf
// holding the slot of every key and a link to the leaf on its right.
//   withSlots: draw the table slot under each key of a leaf.
export function bplusTree(spec = BPLUS_SPEC, { withSlots = true, height = 188 } = {}) {
  const root = fromSpec(spec, makeIds())
  const layout = layoutBTree(root, { height })
  const byId = {}
  const leaves = []
  const walk = (node) => {
    byId[node.id] = node
    if (node.children.length === 0) leaves.push(node)
    node.children.forEach(walk)
  }
  walk(root)
  leaves.forEach((leaf, k) => {
    leaf.slots = leaf.keys.map((key) => SLOT_OF[key] ?? null)
    leaf.next = leaves[k + 1] ?? null
  })

  const tree = {
    ...layout,
    links: leaves.slice(0, -1).map((leaf, k) => [leaf.id, leaves[k + 1].id]),
    nodes: layout.nodes.map((node) => ({ ...node, ptrs: withSlots && byId[node.id].children.length === 0 ? byId[node.id].slots : undefined })),
  }
  return { root, tree, leaves, byId }
}

export const linkKey = (from, to) => `${from}-${to}`
