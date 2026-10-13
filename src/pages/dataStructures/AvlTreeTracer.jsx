import CodeTracer from '../../components/CodeTracer.jsx'
import { layoutTree } from './bst.js'
import {
  avlNode,
  balance,
  balanceMarks,
  buildAvl,
  formatBalance,
  height,
  rotateLeft,
  rotateRight,
  updateHeight,
} from './avl.js'

// Always draw four rows so the picture does not change size.
const layout = (root) => layoutTree(root, { minLevels: 4 })

const code = [
  'def insert(node, value):',
  '    if node is None:',
  '        return Node(value)',
  '    if value < node.value:',
  '        node.left = insert(node.left, value)',
  '    else:',
  '        node.right = insert(node.right, value)',
  '    update_height(node)',
  '    balance = height(node.left) - height(node.right)',
  '    if balance > 1:                    # left-heavy',
  '        if value > node.left.value:',
  '            node.left = rotate_left(node.left)',
  '        return rotate_right(node)',
  '    if balance < -1:                   # right-heavy',
  '        if value < node.right.value:',
  '            node.right = rotate_right(node.right)',
  '        return rotate_left(node)',
  '    return node',
]

// Each preset starts from a small AVL tree and inserts one value.
const presets = [
  { label: 'No rotation needed (10)', base: [30, 20, 40, 50], value: 10 },
  { label: 'Left-left (5)', base: [30, 20, 40, 10], value: 5 },
  { label: 'Right-right (60)', base: [30, 20, 40, 50], value: 60 },
  { label: 'Left-right (20)', base: [40, 30, 50, 10], value: 20 },
  { label: 'Right-left (55)', base: [30, 20, 50, 60], value: 55 },
]

const signed = (b) => (b > 0 ? `+${b}` : String(b))

// Inserts one value into an AVL tree and records a snapshot for every line.
// The balance factor of each node is shown on it; it is refreshed when the
// code reaches the node on the way back up, so until then it can be stale.
function buildAvlSteps(_values, preset) {
  const value = preset.value
  let root = buildAvl(preset.base)
  const marks = balanceMarks(root)
  const steps = []
  const frames = [] // one per open call: { n, bal }
  let bad = []

  // Hang `node` where `parent`'s `side` pointer was, so the picture is right
  // as soon as a new node or a rotation happens.
  const link = (parent, side, node) => {
    if (parent === null) root = node
    else parent[side] = node
  }

  const push = (line, note, extra = {}) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    const vars = {}
    if (top && top.n) {
      vars.node = top.n.value
      if (top.bal !== undefined) vars.balance = top.bal
    }
    vars.value = value
    steps.push({
      line,
      array: [],
      compare: null,
      tree: layout(root),
      frontier: frames.map((frame) => (frame.n ? frame.n.id : 'None')),
      frontierKind: 'calls',
      order: [],
      marks: { ...marks },
      markLabel: 'the number on each node is its balance factor',
      bad: bad.slice(),
      badLabel: 'out of balance',
      foundLabel: 'top of the rotated part',
      current: top && top.n ? top.n.id : null,
      pending: null,
      foundAt: null,
      vars,
      note,
      ...extra,
    })
  }

  const refresh = (...nodes) => {
    nodes.forEach((node) => {
      marks[node.id] = formatBalance(node)
    })
  }

  const run = (n, parent, side) => {
    const frame = { n }
    frames.push(frame)

    if (n === null) {
      push(1, `insert(None) starts. Is node None? Yes: this empty spot is exactly where ${value} belongs.`)
      const added = avlNode(value)
      link(parent, side, added)
      marks[added.id] = '0'
      push(2, `Create a new node for ${value} and return it. Its balance factor is 0: it is a leaf, so both sides are empty.`, { foundAt: added.id, foundLabel: 'the new node' })
      frames.pop()
      return added
    }

    push(1, `insert(${n.value}) starts. Is node None? No.`)
    const smaller = value < n.value
    push(3, `Is ${value} < ${n.value}? ${smaller ? 'Yes, so go left.' : 'No, so go right.'}`)
    if (smaller) {
      push(4, `Insert into the left subtree and keep whatever comes back as the new left child.`)
      n.left = run(n.left, n, 'left')
      push(4, `Back here, with the new value somewhere below. The left child is ${n.left.value}.`)
    } else {
      push(5, 'Not smaller, so take the else branch.')
      push(6, `Insert into the right subtree and keep whatever comes back as the new right child.`)
      n.right = run(n.right, n, 'right')
      push(6, `Back here, with the new value somewhere below. The right child is ${n.right.value}.`)
    }

    updateHeight(n)
    push(7, `Recalculate ${n.value}’s height: one more than its taller side. It is now ${n.h}.`)

    const bal = balance(n)
    frame.bal = bal
    refresh(n)
    const outOfBalance = Math.abs(bal) > 1
    if (outOfBalance) bad = [n.id]
    push(8, `balance = height(left) − height(right) = ${height(n.left)} − ${height(n.right)} = ${signed(bal)}. ${outOfBalance ? `That is outside −1 to +1: ${n.value} is out of balance.` : 'That is within −1 to +1, so this node is fine.'}`)

    if (bal > 1) {
      push(9, `Is balance > 1? Yes: the left side is two taller than the right.`)
      const inner = value > n.left.value
      push(10, `Is ${value} > ${n.left.value}? ${inner ? `Yes: ${value} went into the right side of ${n.left.value}, so the path bends (left, then right). A single rotation would not fix a bend, so rotate the child first.` : `No: ${value} went into the left side of ${n.left.value}, so the path is a straight line down the left.`}`)
      if (inner) {
        const child = n.left
        n.left = rotateLeft(child)
        refresh(child, n.left)
        push(11, `Rotate left around ${child.value}: its right child ${n.left.value} moves up and ${child.value} drops down to its left. The bend is now a straight line.`, { foundAt: n.left.id })
      }
      const old = n
      const top = rotateRight(old)
      link(parent, side, top)
      refresh(old, top)
      bad = []
      push(12, `Rotate right around ${old.value}: its left child ${top.value} moves up and ${old.value} drops down to its right. Every node is back within −1 to +1.`, { foundAt: top.id })
      frames.pop()
      return top
    }

    push(9, `Is balance > 1? No.`)

    if (bal < -1) {
      push(13, `Is balance < −1? Yes: the right side is two taller than the left.`)
      const inner = value < n.right.value
      push(14, `Is ${value} < ${n.right.value}? ${inner ? `Yes: ${value} went into the left side of ${n.right.value}, so the path bends (right, then left). Rotate the child first.` : `No: ${value} went into the right side of ${n.right.value}, so the path is a straight line down the right.`}`)
      if (inner) {
        const child = n.right
        n.right = rotateRight(child)
        refresh(child, n.right)
        push(15, `Rotate right around ${child.value}: its left child ${n.right.value} moves up and ${child.value} drops down to its right. The bend is now a straight line.`, { foundAt: n.right.id })
      }
      const old = n
      const top = rotateLeft(old)
      link(parent, side, top)
      refresh(old, top)
      bad = []
      push(16, `Rotate left around ${old.value}: its right child ${top.value} moves up and ${old.value} drops down to its left. Every node is back within −1 to +1.`, { foundAt: top.id })
      frames.pop()
      return top
    }

    push(13, `Is balance < −1? No.`)
    push(17, `Balance is fine, so return this node unchanged.`)
    frames.pop()
    return n
  }

  push(0, `Insert ${value} into this AVL tree. Every node shows its balance factor. The rule: it must stay between −1 and +1.`)
  root = run(root, null, null)
  push(0, `The call on the root has returned. Every balance factor is between −1 and +1, so the tree is still an AVL tree.`)
  return steps
}

function AvlTreeTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildAvlSteps} view="tree" />
}

export default AvlTreeTracer
