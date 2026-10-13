// A tiny binary search tree for the Binary Search Trees page: enough to build
// one, change it, and lay it out for TreeView.

// A node's id never changes (it is the value it was created with), but its
// value can: deleting a node with two children copies a value into it.
export function makeNode(value, left = null, right = null) {
  return { id: String(value), value, left, right }
}

export function insertValue(root, value) {
  if (root === null) return makeNode(value)
  let node = root
  for (;;) {
    if (value < node.value) {
      if (node.left === null) {
        node.left = makeNode(value)
        return root
      }
      node = node.left
    } else {
      if (node.right === null) {
        node.right = makeNode(value)
        return root
      }
      node = node.right
    }
  }
}

export function buildTree(values) {
  return values.reduce((root, value) => insertValue(root, value), null)
}

//            8
//          /   \
//         3     10
//        / \      \
//       1   6      14
//          / \    /
//         4   7  13
export const BASE_VALUES = [8, 3, 10, 1, 6, 14, 4, 7, 13]

// Lays the tree out in fixed slots: a node at depth d, slot s always sits at
// x = (s + 0.5) / 2^d of the width. So nothing moves when a node is added,
// as long as the tree stays three levels below the root (4 rows).
export function layoutTree(root, { width = 360, top = 26, gap = 54, minLevels = 1 } = {}) {
  const nodes = []
  const edges = []
  const kids = {}
  let deepest = minLevels - 1

  const place = (node, depth, slot) => {
    deepest = Math.max(deepest, depth)
    nodes.push({ id: node.id, label: String(node.value), x: ((slot + 0.5) / 2 ** depth) * width, y: top + depth * gap })
    kids[node.id] = [node.left ? node.left.id : null, node.right ? node.right.id : null]
    if (node.left) {
      edges.push([node.id, node.left.id])
      place(node.left, depth + 1, slot * 2)
    }
    if (node.right) {
      edges.push([node.id, node.right.id])
      place(node.right, depth + 1, slot * 2 + 1)
    }
  }
  if (root) place(root, 0, 0)

  return { width, height: top + deepest * gap + 28, root: root ? root.id : null, nodes, edges, kids }
}
