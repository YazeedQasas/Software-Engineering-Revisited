import CodeTracer from '../../components/CodeTracer.jsx'
import { CHILDREN, SEARCH_TREE } from './searchTree.js'

const bfsCode = [
  'def bfs(tree, start, target):',
  '    queue = deque([start])',
  '    while queue:',
  '        node = queue.popleft()',
  '        if node == target:',
  '            return node',
  '        for child in tree[node]:',
  '            queue.append(child)',
  '    return None',
]

const dfsCode = [
  'def dfs(tree, start, target):',
  '    stack = [start]',
  '    while stack:',
  '        node = stack.pop()',
  '        if node == target:',
  '            return node',
  '        for child in reversed(tree[node]):',
  '            stack.append(child)',
  '    return None',
]

const presets = [
  { label: 'Find C', target: 'C' },
  { label: 'Find F', target: 'F' },
  { label: 'Find H', target: 'H' },
  { label: 'Find A (the root)', target: 'A' },
  { label: 'Not in the tree', target: 'Z' },
]

// BFS and DFS are the same loop. The only differences are which end of the
// waiting list the next node is taken from, and the order children are added.
// `kind` is 'queue' (BFS) or 'stack' (DFS). Records a snapshot for every line.
function makeTreeSteps(kind) {
  const isQueue = kind === 'queue'

  return function buildTreeSteps(_values, preset) {
    const target = preset.target
    const steps = []
    const frontier = []
    const order = []
    let node = null
    let child = null

    const push = (line, note, extra = {}) => {
      const vars = {}
      if (node !== null) vars.node = node
      if (child !== null) vars.child = child
      vars.target = target
      steps.push({
        line,
        array: [],
        compare: null,
        tree: SEARCH_TREE,
        frontier: frontier.slice(),
        frontierKind: kind,
        order: order.slice(),
        current: node,
        pending: null,
        foundAt: null,
        target,
        vars,
        note,
        ...extra,
      })
    }

    push(
      0,
      isQueue
        ? `Search for ${target} one level at a time. A queue keeps track of which nodes are waiting to be looked at.`
        : `Search for ${target} by going as deep as possible first. A stack keeps track of which nodes are waiting to be looked at.`,
    )

    frontier.push('A')
    push(1, `Put the starting node, A, into the ${kind}. It is the only one waiting.`)

    while (frontier.length > 0) {
      node = null
      child = null
      push(2, `Is the ${kind} empty? No, ${frontier.length} ${frontier.length === 1 ? 'node is' : 'nodes are'} waiting.`)

      node = isQueue ? frontier.shift() : frontier.pop()
      order.push(node)
      push(
        3,
        isQueue
          ? `Take ${node} from the front of the queue: the node that has been waiting longest.`
          : `Take ${node} from the top of the stack: the node that was added most recently.`,
      )

      const match = node === target
      push(4, `Is ${node} == ${target}? ${match ? 'Yes!' : 'No.'}`)

      if (match) {
        push(5, `Found ${target}. Return it and stop. ${order.length} ${order.length === 1 ? 'node was' : 'nodes were'} looked at.`, { foundAt: node })
        return steps
      }

      const kids = CHILDREN[node]
      const visiting = isQueue ? kids : kids.slice().reverse()

      if (kids.length === 0) {
        push(6, `${node} has no children, so there is nothing to add.`)
      } else {
        visiting.forEach((next, index) => {
          child = next
          let note = `child = ${next}.`
          if (index === 0) {
            if (isQueue) note = `Go through the children of ${node}, left to right. First: ${next}.`
            else if (kids.length > 1) note = `The children of ${node} are ${kids.join(' and ')}. reversed() goes through them backwards, so ${next} is pushed first and ${kids[0]} ends up on top.`
            else note = `Go through the children of ${node}. First: ${next}.`
          }
          push(6, note, { pending: next })
          frontier.push(next)
          push(7, isQueue ? `Add ${next} to the back of the queue.` : `Push ${next} on top of the stack.`)
        })
      }
      child = null
    }

    node = null
    push(2, `The ${kind} is empty: there is nowhere left to look.`)
    push(8, `Looked at all ${order.length} nodes and ${target} is not there. Return None.`)
    return steps
  }
}

const buildBfsSteps = makeTreeSteps('queue')
const buildDfsSteps = makeTreeSteps('stack')

function BfsTracer() {
  return <CodeTracer code={bfsCode} presets={presets} buildSteps={buildBfsSteps} view="tree" />
}

function DfsTracer() {
  return <CodeTracer code={dfsCode} presets={presets} buildSteps={buildDfsSteps} view="tree" />
}

export { BfsTracer, DfsTracer }
