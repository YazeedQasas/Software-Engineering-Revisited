// Trees and tree shapes for the Binary Trees page.
import { makeTree } from './traversalTrees.js'

// Every node has only a left child, so the tree is really a linked list.
//
//         5
//        /
//       4
//      /
//     3 ... down to 1
export const CHAIN = makeTree(360, 228, [
  { id: '5', x: 250, y: 26, left: '4' },
  { id: '4', x: 214, y: 70, left: '3' },
  { id: '3', x: 178, y: 114, left: '2' },
  { id: '2', x: 142, y: 158, left: '1' },
  { id: '1', x: 106, y: 202 },
])

// A small unlabelled tree laid out by position in an array: node i has its
// children at 2i + 1 and 2i + 2. `indices` lists which of those slots are used.
export function heapShape(indices, { width = 120, height = 100, top = 14, gap = 30 } = {}) {
  const used = new Set(indices)
  const nodes = []
  const edges = []
  indices.forEach((i) => {
    const level = Math.floor(Math.log2(i + 1))
    const slots = 2 ** level
    nodes.push({ id: `h${i}`, x: ((i - (slots - 1) + 0.5) / slots) * width, y: top + level * gap })
    const parent = (i - 1) >> 1
    if (i > 0 && used.has(parent)) edges.push([`h${parent}`, `h${i}`])
  })
  return { width, height, nodes, edges }
}

// A long thin tree drawn small: each node hangs down and to the right.
export function chainShape(length, { width = 120, height = 100, top = 12, stepX = 18, stepY = 19 } = {}) {
  const nodes = []
  const edges = []
  for (let k = 0; k < length; k++) {
    nodes.push({ id: `c${k}`, x: 22 + k * stepX, y: top + k * stepY })
    if (k > 0) edges.push([`c${k - 1}`, `c${k}`])
  }
  return { width, height, nodes, edges }
}
