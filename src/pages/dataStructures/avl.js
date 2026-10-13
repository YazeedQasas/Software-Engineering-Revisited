// A small AVL tree for the AVL Trees page. Nodes are the same shape as in
// bst.js (id, value, left, right) with a stored height h. The height of an
// empty tree is -1 and a lone node is 0, as on the Binary Trees page.

export const height = (node) => (node ? node.h : -1)

// Balance factor: height of the left side minus height of the right side.
export const balance = (node) => height(node.left) - height(node.right)

export function updateHeight(node) {
  node.h = 1 + Math.max(height(node.left), height(node.right))
}

export function avlNode(value, left = null, right = null) {
  const node = { id: String(value), value, left, right, h: 0 }
  updateHeight(node)
  return node
}

// Gives every node in a hand-built tree its correct height.
export function withHeights(node) {
  if (node) {
    withHeights(node.left)
    withHeights(node.right)
    updateHeight(node)
  }
  return node
}

export function rotateRight(z) {
  const y = z.left
  z.left = y.right
  y.right = z
  updateHeight(z)
  updateHeight(y)
  return y
}

export function rotateLeft(z) {
  const y = z.right
  z.right = y.left
  y.left = z
  updateHeight(z)
  updateHeight(y)
  return y
}

// Inserts a value and rebalances on the way back up. Returns the new root.
export function avlInsert(node, value) {
  if (node === null) return avlNode(value)
  if (value < node.value) node.left = avlInsert(node.left, value)
  else node.right = avlInsert(node.right, value)
  updateHeight(node)
  const b = balance(node)
  if (b > 1) {
    if (value > node.left.value) node.left = rotateLeft(node.left)
    return rotateRight(node)
  }
  if (b < -1) {
    if (value < node.right.value) node.right = rotateRight(node.right)
    return rotateLeft(node)
  }
  return node
}

export function buildAvl(values) {
  return values.reduce((root, value) => avlInsert(root, value), null)
}

// A balance factor as it is written on a node: +1, 0, -1, ...
export const formatBalance = (node) => {
  const b = balance(node)
  return b > 0 ? `+${b}` : String(b)
}

// { id: '+1' } for every node in the tree.
export function balanceMarks(root) {
  const marks = {}
  const walk = (node) => {
    if (node) {
      marks[node.id] = formatBalance(node)
      walk(node.left)
      walk(node.right)
    }
  }
  walk(root)
  return marks
}
