import CodeTracer from '../../components/CodeTracer.jsx'
import { BALANCED, LOPSIDED } from './traversalTrees.js'
import { CHAIN } from './binaryTrees.js'

const code = [
  'def height(node):',
  '    if node is None:',
  '        return -1',
  '    left = height(node.left)',
  '    right = height(node.right)',
  '    return 1 + max(left, right)',
]

const presets = [
  { label: 'Balanced tree', tree: BALANCED },
  { label: 'Lopsided tree', tree: LOPSIDED },
  { label: 'A chain', tree: CHAIN },
]

// Runs height() once and records a snapshot for every line that runs. Each
// open call has its own `left` and `right`, kept in `frames`. A node gets its
// answer written on it as soon as its call works it out.
function buildHeightSteps(_values, preset) {
  const tree = preset.tree
  const steps = []
  const frames = []
  const done = []
  const badges = {}

  const push = (line, note) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    const vars = {}
    if (top) {
      vars.node = top.id ?? 'None'
      if (top.left !== undefined) vars.left = top.left
      if (top.right !== undefined) vars.right = top.right
    }
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      frontier: frames.map((frame) => frame.id ?? 'None'),
      frontierKind: 'calls',
      order: done.slice(),
      badges: { ...badges },
      doneLabel: 'answered (the number is its height)',
      current: top ? top.id : null,
      pending: null,
      foundAt: null,
      vars,
      note,
    })
  }

  const run = (id) => {
    const frame = { id }
    frames.push(frame)

    if (id === null) {
      push(1, 'height(None) starts. Is node None? Yes: there is no tree here at all.')
      push(2, 'Return -1. An empty tree is one step shorter than a single node, whose height is 0.')
      frames.pop()
      return -1
    }

    const [leftId, rightId] = tree.kids[id]
    push(1, `height(${id}) starts. Is node None? No, it is a real node.`)
    push(3, `Ask for the height of the left child${leftId === null ? ', which is None' : `, ${leftId}`}.`)
    frame.left = run(leftId)
    push(3, `The left side came back with ${frame.left}, so left = ${frame.left}.`)
    push(4, `Ask for the height of the right child${rightId === null ? ', which is None' : `, ${rightId}`}.`)
    frame.right = run(rightId)
    push(4, `The right side came back with ${frame.right}, so right = ${frame.right}.`)

    const result = 1 + Math.max(frame.left, frame.right)
    done.push(id)
    badges[id] = result
    push(5, `1 + max(${frame.left}, ${frame.right}) = ${result}. Return ${result}: the height of the tree that starts at ${id}.`)
    frames.pop()
    return result
  }

  push(0, `Find the height of the whole tree by asking for the height of the root, ${tree.root}.`)
  const height = run(tree.root)
  push(0, `The call on the root returned ${height}. The tree is ${height} ${height === 1 ? 'step' : 'steps'} tall.`)
  return steps
}

function BinaryTreeTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildHeightSteps} view="tree" />
}

export default BinaryTreeTracer
