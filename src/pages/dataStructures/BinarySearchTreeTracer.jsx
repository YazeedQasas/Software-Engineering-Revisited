import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { BASE_VALUES, buildTree, layoutTree } from './bst.js'

// Always draw four rows so the picture does not change size as the tree grows.
const layout = (root) => layoutTree(root, { minLevels: 4 })
const labelled = (node) => (node ? node.value : 'None')

// ---------------------------------------------------------------- search

const searchCode = [
  'def search(root, target):',
  '    node = root',
  '    while node is not None:',
  '        if target == node.value:',
  '            return node',
  '        elif target < node.value:',
  '            node = node.left',
  '        else:',
  '            node = node.right',
  '    return None',
]

const searchPresets = [
  { label: 'Find 6', target: 6 },
  { label: 'Find 13 (deep)', target: 13 },
  { label: 'Find 8 (the root)', target: 8 },
  { label: 'Not in the tree (5)', target: 5 },
]

function buildSearchSteps(_values, preset) {
  const target = preset.target
  const root = buildTree(BASE_VALUES)
  const tree = layout(root)
  const steps = []
  const order = []
  let node = root

  const push = (line, note, extra = {}) => {
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      order: order.slice(),
      current: node ? node.id : null,
      pending: null,
      foundAt: null,
      vars: { node: labelled(node), target },
      note,
      ...extra,
    })
  }

  push(0, `Search for ${target}. At every node, compare and go left or right.`)
  push(1, 'Start at the root.')

  while (node !== null) {
    push(2, `Is node None? No, ${node.value} is a real node.`)
    order.push(node.id)
    const match = target === node.value
    push(3, `Is ${target} == ${node.value}? ${match ? 'Yes!' : 'No.'}`)

    if (match) {
      push(4, `Found ${target}. Return it. That took ${order.length} ${order.length === 1 ? 'comparison' : 'comparisons'}.`, { foundAt: node.id })
      return steps
    }

    const smaller = target < node.value
    push(5, `Is ${target} < ${node.value}? ${smaller ? `Yes: ${target} can only be in the left subtree, because everything on the right is bigger than ${node.value}.` : 'No.'}`)
    if (smaller) {
      node = node.left
      push(6, node ? `Move to the left child, ${node.value}.` : 'There is no left child, so move to None.')
    } else {
      push(7, `So ${target} can only be in the right subtree, because everything on the left is smaller than ${node.value}.`)
      node = node.right
      push(8, node ? `Move to the right child, ${node.value}.` : 'There is no right child, so move to None.')
    }
  }

  push(2, 'Is node None? Yes: we have walked off the bottom of the tree.')
  push(9, `${target} would have to be at exactly this empty spot, and nothing is there. It is not in the tree. Return None.`)
  return steps
}

// ---------------------------------------------------------------- insert

const insertCode = [
  'def insert(root, value):',
  '    if root is None:',
  '        return Node(value)',
  '    node = root',
  '    while True:',
  '        if value < node.value:',
  '            if node.left is None:',
  '                node.left = Node(value)',
  '                return root',
  '            node = node.left',
  '        else:',
  '            if node.right is None:',
  '                node.right = Node(value)',
  '                return root',
  '            node = node.right',
]

const insertPresets = [
  { label: 'Insert 9', value: 9 },
  { label: 'Insert 2', value: 2 },
  { label: 'Insert 15', value: 15 },
]

function buildInsertSteps(_values, preset) {
  const value = preset.value
  const root = buildTree(BASE_VALUES)
  let tree = layout(root)
  const steps = []
  const order = []
  let node = null

  const push = (line, note, extra = {}) => {
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      order: order.slice(),
      current: node ? node.id : null,
      pending: null,
      foundAt: null,
      foundLabel: 'the new node',
      vars: { node: node ? node.value : '-', value },
      note,
      ...extra,
    })
  }

  push(0, `Insert ${value}: find the spot where it belongs, then hang it there as a new leaf.`)
  push(1, 'Is the tree empty? No, it has a root.')
  node = root
  push(3, 'Start at the root.')

  for (;;) {
    order.push(node.id)
    const smaller = value < node.value
    push(5, `Is ${value} < ${node.value}? ${smaller ? 'Yes, so it belongs on the left.' : 'No, so it belongs on the right.'}`)

    if (smaller) {
      const free = node.left === null
      push(6, `Is there a left child? ${free ? 'No: that spot is free.' : `Yes, ${node.left.value}, so keep going.`}`)
      if (free) {
        const added = { id: String(value), value, left: null, right: null }
        node.left = added
        tree = layout(root)
        push(7, `Attach ${value} as the left child of ${node.value}.`, { foundAt: added.id })
        push(8, `Return the root. ${value} is in the tree, and every other node stayed where it was.`, { foundAt: added.id })
        return steps
      }
      node = node.left
      push(9, `Move down to the left child, ${node.value}.`)
    } else {
      push(10, 'Not smaller, so take the else branch.')
      const free = node.right === null
      push(11, `Is there a right child? ${free ? 'No: that spot is free.' : `Yes, ${node.right.value}, so keep going.`}`)
      if (free) {
        const added = { id: String(value), value, left: null, right: null }
        node.right = added
        tree = layout(root)
        push(12, `Attach ${value} as the right child of ${node.value}.`, { foundAt: added.id })
        push(13, `Return the root. ${value} is in the tree, and every other node stayed where it was.`, { foundAt: added.id })
        return steps
      }
      node = node.right
      push(14, `Move down to the right child, ${node.value}.`)
    }
  }
}

// ---------------------------------------------------------------- delete

const deleteCode = [
  'def delete(node, value):',
  '    if node is None:',
  '        return None',
  '    if value < node.value:',
  '        node.left = delete(node.left, value)',
  '    elif value > node.value:',
  '        node.right = delete(node.right, value)',
  '    else:',
  '        if node.left is None:',
  '            return node.right',
  '        if node.right is None:',
  '            return node.left',
  '        successor = node.right',
  '        while successor.left is not None:',
  '            successor = successor.left',
  '        node.value = successor.value',
  '        node.right = delete(node.right, successor.value)',
  '    return node',
]

const deletePresets = [
  { label: 'A leaf (7)', value: 7 },
  { label: 'One child (10)', value: 10 },
  { label: 'Two children (3)', value: 3 },
  { label: 'Two children: the root (8)', value: 8 },
  { label: 'Not in the tree (5)', value: 5 },
]

function buildDeleteSteps(_values, preset) {
  let root = buildTree(BASE_VALUES)
  const steps = []
  const frames = [] // one per open call: { n: the node (or null), val: the value it was asked to delete }

  const push = (line, note, extra = {}) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    steps.push({
      line,
      array: [],
      compare: null,
      tree: layout(root),
      frontier: frames.map((frame) => (frame.n ? frame.n.id : 'None')),
      frontierKind: 'calls',
      order: [],
      current: top && top.n ? top.n.id : null,
      pending: null,
      foundAt: null,
      foundLabel: 'the node being deleted',
      pendingLabel: 'the successor',
      vars: top ? { node: labelled(top.n), value: top.val } : {},
      note,
      ...extra,
    })
  }

  // Returns the root of this subtree once `val` has been removed from it.
  const run = (n, val) => {
    const frame = { n, val }
    frames.push(frame)

    if (n === null) {
      push(1, `delete(None) starts. Is node None? Yes: we walked off the tree, so ${val} was never in it.`)
      push(2, 'Return None: nothing to change.')
      frames.pop()
      return null
    }

    push(1, `delete(${n.value}) starts. Is node None? No.`)
    const smaller = val < n.value
    push(3, `Is ${val} < ${n.value}? ${smaller ? 'Yes, so it is in the left subtree.' : 'No.'}`)

    if (smaller) {
      push(4, `Delete from the left subtree and keep whatever comes back as the new left child.`)
      n.left = run(n.left, val)
      push(4, `Back here. The left child is now ${n.left ? n.left.value : 'None'}.`)
    } else {
      const bigger = val > n.value
      push(5, `Is ${val} > ${n.value}? ${bigger ? 'Yes, so it is in the right subtree.' : `No, so ${val} == ${n.value}: this is the node to delete.`}`)
      if (bigger) {
        push(6, `Delete from the right subtree and keep whatever comes back as the new right child.`)
        n.right = run(n.right, val)
        push(6, `Back here. The right child is now ${n.right ? n.right.value : 'None'}.`)
      } else {
        const mark = { foundAt: n.id }
        push(7, `Found it. ${n.value} is the node to remove, and how we remove it depends on its children.`, mark)
        push(8, `Does it have no left child? ${n.left === null ? 'Yes.' : 'No.'}`, mark)
        if (n.left === null) {
          push(9, n.right ? `So its right subtree (${n.right.value}) simply takes its place. Return it to the caller.` : 'It has no children at all, so it is a leaf. Return None and it vanishes.', mark)
          frames.pop()
          return n.right
        }
        push(10, `Does it have no right child? ${n.right === null ? 'Yes.' : 'No.'}`, mark)
        if (n.right === null) {
          push(11, `So its left subtree (${n.left.value}) simply takes its place. Return it to the caller.`, mark)
          frames.pop()
          return n.left
        }

        let successor = n.right
        push(12, `It has two children, so we cannot just remove it. Instead find its successor: the smallest value in the right subtree. Start at ${successor.value}.`, { ...mark, pending: successor.id })
        for (;;) {
          const more = successor.left !== null
          push(13, `Does ${successor.value} have a left child? ${more ? 'Yes, so something smaller exists. Keep going left.' : `No, so ${successor.value} is the smallest value on that side.`}`, { ...mark, pending: successor.id })
          if (!more) break
          successor = successor.left
          push(14, `successor is now ${successor.value}.`, { ...mark, pending: successor.id })
        }

        const old = n.value
        n.value = successor.value
        push(15, `Copy the successor’s value into this node. It held ${old}; now it holds ${n.value}. The tree is still in order, because ${n.value} is the next value up after ${old}.`, { ...mark, pending: successor.id })
        push(16, `${n.value} now appears twice. Delete the original from the right subtree.`, mark)
        n.right = run(n.right, successor.value)
        push(16, `Back here. The right child is now ${n.right ? n.right.value : 'None'}.`, mark)
      }
    }

    push(17, `Return this node (${n.value}) to the caller, so it stays linked in.`)
    frames.pop()
    return n
  }

  push(0, `Delete ${preset.value} from the tree by asking for the tree back with it removed.`)
  root = run(root, preset.value)
  push(0, root ? `The call on the root has returned, and the tree is back in one piece.` : 'The tree is now empty.')
  return steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  search: { label: 'Search', code: searchCode, presets: searchPresets, build: buildSearchSteps },
  insert: { label: 'Insert', code: insertCode, presets: insertPresets, build: buildInsertSteps },
  delete: { label: 'Delete', code: deleteCode, presets: deletePresets, build: buildDeleteSteps },
}

function BinarySearchTreeTracer() {
  const [kind, setKind] = useState('search')
  const { code, presets, build } = KINDS[kind]

  return (
    <>
      <div className="tracer-picker" role="group" aria-label="Operation">
        <span className="tracer-label">Operation:</span>
        {Object.entries(KINDS).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className={`tracer-chip${key === kind ? ' active' : ''}`}
            onClick={() => setKind(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view="tree" />
    </>
  )
}

export default BinarySearchTreeTracer
