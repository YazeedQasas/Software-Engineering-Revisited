import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { BALANCED, LOPSIDED } from './traversalTrees.js'

// The three functions differ only in where the print line sits. Lines 0 to 2
// are the same; the three actions (visit, go left, go right) are lines 3 to 5.
const KINDS = {
  pre: {
    label: 'Pre-order',
    name: 'preorder',
    actions: ['visit', 'left', 'right'],
    visitNote: (id) => `Pre-order: visit the node before its children. Print ${id}.`,
  },
  in: {
    label: 'In-order',
    name: 'inorder',
    actions: ['left', 'visit', 'right'],
    visitNote: (id) => `In-order: the whole left side is done, so now visit the node. Print ${id}.`,
  },
  post: {
    label: 'Post-order',
    name: 'postorder',
    actions: ['left', 'right', 'visit'],
    visitNote: (id) => `Post-order: both sides are done, so visit the node last. Print ${id}.`,
  },
}

function codeFor({ name, actions }) {
  const lines = {
    visit: '    print(node.value)',
    left: `    ${name}(node.left)`,
    right: `    ${name}(node.right)`,
  }
  return [`def ${name}(node):`, '    if node is None:', '        return', ...actions.map((action) => lines[action])]
}

const presets = [
  { label: 'Balanced tree', tree: BALANCED },
  { label: 'Lopsided tree', tree: LOPSIDED },
]

// Runs one traversal and records a snapshot for every line that runs. The
// "waiting list" is the call stack: a call is pushed when a function starts
// and popped when it returns. `output` is what print has shown so far.
function makeTraversalSteps(kind) {
  const { name, actions, visitNote } = KINDS[kind]

  return function buildTraversalSteps(_values, preset) {
    const tree = preset.tree
    const steps = []
    const stack = []
    const order = []
    const output = []
    let back = ''

    const push = (line, note) => {
      const top = stack.length > 0 ? stack[stack.length - 1] : null
      steps.push({
        line,
        array: [],
        compare: null,
        tree,
        frontier: stack.slice(),
        frontierKind: 'calls',
        order: order.slice(),
        output: output.slice(),
        current: top !== null && top !== 'None' ? top : null,
        pending: null,
        foundAt: null,
        vars: top === null ? {} : { node: top },
        note: back + note,
      })
      back = ''
    }

    const run = (id) => {
      if (id === null) {
        stack.push('None')
        push(1, `${name}(None) starts. Is node None? Yes: there is nothing here.`)
        push(2, 'So it returns straight away.')
        stack.pop()
        back = 'Back in the caller. '
        return
      }

      stack.push(id)
      push(1, `${name}(${id}) starts. Is node None? No, it is a real node.`)
      const [left, right] = tree.kids[id]

      actions.forEach((action, index) => {
        const line = 3 + index
        if (action === 'visit') {
          output.push(id)
          order.push(id)
          push(line, visitNote(id))
        } else {
          const child = action === 'left' ? left : right
          push(line, `Call ${name} on the ${action} child${child === null ? ', which is None' : `, ${child}`}.`)
          run(child)
        }
      })

      stack.pop()
      back = `${name}(${id}) is finished and returns. `
    }

    push(0, `Call ${name} on the root of the tree, ${tree.root}.`)
    run(tree.root)
    push(0, `The first call has returned, so every node has been visited. Output: ${output.join(' ')}.`)
    return steps
  }
}

const builders = {
  pre: makeTraversalSteps('pre'),
  in: makeTraversalSteps('in'),
  post: makeTraversalSteps('post'),
}

function TreeTraversalTracer() {
  const [kind, setKind] = useState('pre')

  return (
    <>
      <div className="tracer-picker" role="group" aria-label="Traversal order">
        <span className="tracer-label">Order:</span>
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
      <CodeTracer key={kind} code={codeFor(KINDS[kind])} presets={presets} buildSteps={builders[kind]} view="tree" />
    </>
  )
}

export default TreeTraversalTracer
