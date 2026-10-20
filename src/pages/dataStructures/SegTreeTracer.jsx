import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { BASE, buildSeg, layoutSeg, makeSeg, rangeText, snapshotSeg } from './segData.js'

const where = (node) => (node.lo === node.hi ? `position ${node.lo}` : `positions ${node.lo} to ${node.hi}`)

// ----------------------------------------------------------------- build

const buildCode = [
  'def build(nums, tree, node, lo, hi):',
  '    if lo == hi:',
  '        tree[node] = nums[lo]',
  '        return',
  '    mid = (lo + hi) // 2',
  '    build(nums, tree, 2 * node, lo, mid)',
  '    build(nums, tree, 2 * node + 1, mid + 1, hi)',
  '    tree[node] = tree[2 * node] + tree[2 * node + 1]',
]

const buildPresets = [
  { label: 'Eight numbers', values: BASE },
  { label: 'Six numbers (not a power of 2)', values: [4, 1, 6, 2, 8, 3] },
]

function buildBuildSteps(values) {
  const root = makeSeg(values)
  const layout = layoutSeg(root)
  const steps = []
  const frames = []
  const done = []

  const push = (line, note, extra = {}) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    steps.push({
      line,
      array: [],
      compare: null,
      tree: snapshotSeg(root, layout),
      frontier: frames.map((n) => n.id),
      frontierKind: 'calls',
      slotLabels: Object.fromEntries(frames.map((n) => [n.id, rangeText(n)])),
      order: [],
      doneLabel: false,
      good: done.slice(),
      goodLabel: 'sum worked out',
      current: top ? top.id : null,
      pending: null,
      foundAt: null,
      vars: top ? { node: top.index, lo: top.lo, hi: top.hi } : { n: values.length },
      note,
      ...extra,
    })
  }

  const run = (n) => {
    frames.push(n)
    push(0, `build starts on node ${n.index}, which covers ${where(n)}.`)
    const leaf = n.lo === n.hi
    push(1, `Is lo == hi? ${leaf ? `Yes: ${n.lo} == ${n.hi}, so this node covers a single position.` : `No: ${n.lo} != ${n.hi}, so it covers several positions and needs children.`}`)
    if (leaf) {
      n.sum = values[n.lo]
      push(2, `A single position has nothing to add up. Store the number itself: tree[${n.index}] = nums[${n.lo}] = ${n.sum}.`)
      done.push(n.id)
      push(3, 'Return to the caller.')
      frames.pop()
      return
    }
    const mid = (n.lo + n.hi) >> 1
    push(4, `mid = (${n.lo} + ${n.hi}) // 2 = ${mid}. The left child takes ${n.lo} to ${mid}, the right child takes ${mid + 1} to ${n.hi}.`)
    push(5, `Build the left child, node ${2 * n.index}, first.`)
    run(n.left)
    push(6, `Back on node ${n.index}. Now build the right child, node ${2 * n.index + 1}.`)
    run(n.right)
    n.sum = n.left.sum + n.right.sum
    push(7, `Both children are ready. Store their sum: tree[${n.index}] = ${n.left.sum} + ${n.right.sum} = ${n.sum}.`)
    done.push(n.id)
    frames.pop()
    push(7, `Node ${n.index} (${where(n)}) is finished. It will never need recalculating unless a number inside its range changes.`, { current: null })
  }

  push(0, `Build a tree over ${values.length} numbers. Every node will hold the sum of a range of them. The empty circles are nodes whose sum is not known yet.`, { frontier: [], slotLabels: {}, current: null })
  run(root)
  return steps
}

// ----------------------------------------------------------------- query

const queryCode = [
  'def query(tree, node, lo, hi, left, right):',
  '    if right < lo or hi < left:',
  '        return 0',
  '    if left <= lo and hi <= right:',
  '        return tree[node]',
  '    mid = (lo + hi) // 2',
  '    left_sum = query(tree, 2 * node, lo, mid, left, right)',
  '    right_sum = query(tree, 2 * node + 1, mid + 1, hi, left, right)',
  '    return left_sum + right_sum',
]

const queryPresets = [
  { label: 'Positions 2 to 6', left: 2, right: 6 },
  { label: 'Positions 1 to 4', left: 1, right: 4 },
  { label: 'The whole array (0 to 7)', left: 0, right: 7 },
  { label: 'Just position 5', left: 5, right: 5 },
]

function buildQuerySteps(_values, preset) {
  const { left, right } = preset
  const root = buildSeg(BASE)
  const layout = layoutSeg(root)
  const tree = snapshotSeg(root, layout)
  const steps = []
  const frames = [] // one per open call: { n, leftSum, rightSum }
  const used = []
  const skipped = []
  const picked = []

  const push = (line, note, extra = {}) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    const vars = top
      ? { node: top.n.index, lo: top.n.lo, hi: top.n.hi }
      : { left, right }
    if (top && top.leftSum !== undefined) vars.left_sum = top.leftSum
    if (top && top.rightSum !== undefined) vars.right_sum = top.rightSum
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      frontier: frames.map((f) => f.n.id),
      frontierKind: 'calls',
      slotLabels: Object.fromEntries(frames.map((f) => [f.n.id, rangeText(f.n)])),
      order: [],
      doneLabel: false,
      good: used.slice(),
      goodLabel: 'inside the range: its stored sum is used',
      bad: skipped.slice(),
      badLabel: 'outside the range: ignored',
      output: picked.slice(),
      current: top ? top.n.id : null,
      pending: null,
      foundAt: null,
      vars,
      note,
      ...extra,
    })
  }

  // Returns the sum of the positions of this node that lie inside the query.
  const run = (n) => {
    const frame = { n }
    frames.push(frame)
    push(0, `query starts on node ${n.index}, which covers ${where(n)}.`)

    const outside = right < n.lo || n.hi < left
    push(1, `Is the range completely outside this node? ${right} < ${n.lo} or ${n.hi} < ${left}: ${outside ? 'Yes, they do not overlap at all.' : 'No, they overlap.'}`)
    if (outside) {
      skipped.push(n.id)
      push(2, `Nothing here is wanted. Return 0 without looking any deeper.`)
      frames.pop()
      return 0
    }

    const inside = left <= n.lo && n.hi <= right
    push(3, `Is this node completely inside the range? ${left} <= ${n.lo} and ${n.hi} <= ${right}: ${inside ? 'Yes!' : 'No, only part of it is wanted.'}`)
    if (inside) {
      used.push(n.id)
      picked.push(n.sum)
      push(4, `Every position here is wanted, and the node already stores their sum. Return tree[${n.index}] = ${n.sum} without looking at its children.`)
      frames.pop()
      return n.sum
    }

    const mid = (n.lo + n.hi) >> 1
    push(5, `Only part of it is wanted, so ask the children. mid = (${n.lo} + ${n.hi}) // 2 = ${mid}.`)
    push(6, `Ask the left child (node ${2 * n.index}, ${where(n.left)}) for its part.`)
    frame.leftSum = run(n.left)
    push(6, `Back on node ${n.index}: left_sum = ${frame.leftSum}.`)
    push(7, `Ask the right child (node ${2 * n.index + 1}, ${where(n.right)}) for its part.`)
    frame.rightSum = run(n.right)
    push(7, `Back on node ${n.index}: right_sum = ${frame.rightSum}.`)
    push(8, `Return ${frame.leftSum} + ${frame.rightSum} = ${frame.leftSum + frame.rightSum}.`)
    frames.pop()
    return frame.leftSum + frame.rightSum
  }

  push(0, `Add up positions ${left} to ${right}. Start at the root, which covers everything. Each node is outside, inside or partly inside the range.`, { frontier: [], slotLabels: {}, current: null })
  const total = run(root)
  const expected = BASE.slice(left, right + 1).reduce((a, b) => a + b, 0)
  push(0, `The answer is ${total}${total === expected ? `, the same as adding positions ${left} to ${right} one by one` : ''}. It used ${used.length} stored ${used.length === 1 ? 'sum' : 'sums'}, not ${right - left + 1} separate ${right === left ? 'number' : 'numbers'}.`, { frontier: [], slotLabels: {}, current: null })
  return steps
}

// ---------------------------------------------------------------- update

const updateCode = [
  'def update(tree, node, lo, hi, i, value):',
  '    if lo == hi:',
  '        tree[node] = value',
  '        return',
  '    mid = (lo + hi) // 2',
  '    if i <= mid:',
  '        update(tree, 2 * node, lo, mid, i, value)',
  '    else:',
  '        update(tree, 2 * node + 1, mid + 1, hi, i, value)',
  '    tree[node] = tree[2 * node] + tree[2 * node + 1]',
]

const updatePresets = [
  { label: 'Set position 4 to 1', i: 4, value: 1 },
  { label: 'Set position 0 to 10', i: 0, value: 10 },
  { label: 'Set position 7 to 0', i: 7, value: 0 },
]

function buildUpdateSteps(_values, preset) {
  const { i, value } = preset
  const root = buildSeg(BASE)
  const layout = layoutSeg(root)
  const steps = []
  const frames = []
  const fixed = []

  const push = (line, note, extra = {}) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    steps.push({
      line,
      array: [],
      compare: null,
      tree: snapshotSeg(root, layout),
      frontier: frames.map((n) => n.id),
      frontierKind: 'calls',
      slotLabels: Object.fromEntries(frames.map((n) => [n.id, rangeText(n)])),
      order: [],
      doneLabel: false,
      good: fixed.slice(),
      goodLabel: 'new sum stored',
      current: top ? top.id : null,
      pending: null,
      foundAt: null,
      vars: top ? { node: top.index, lo: top.lo, hi: top.hi, i, value } : { i, value },
      note,
      ...extra,
    })
  }

  const run = (n) => {
    frames.push(n)
    push(0, `update starts on node ${n.index}, which covers ${where(n)}. Position ${i} is inside it.`)
    const leaf = n.lo === n.hi
    push(1, `Is lo == hi? ${leaf ? 'Yes: this is the leaf for the position we want.' : 'No: keep going down.'}`)
    if (leaf) {
      const old = n.sum
      n.sum = value
      fixed.push(n.id)
      push(2, `Overwrite the leaf: tree[${n.index}] = ${value} (it was ${old}). Every node above it that covers position ${i} is now out of date.`)
      push(3, 'Return, so each node above can fix its sum on the way back up.')
      frames.pop()
      return
    }
    const mid = (n.lo + n.hi) >> 1
    push(4, `mid = (${n.lo} + ${n.hi}) // 2 = ${mid}.`)
    const goLeft = i <= mid
    push(5, `Is ${i} <= ${mid}? ${goLeft ? `Yes: position ${i} is in the left half.` : `No: position ${i} is in the right half.`}`)
    if (goLeft) {
      push(6, `Update the left child, node ${2 * n.index}. The right child is not touched at all.`)
      run(n.left)
    } else {
      push(8, `Update the right child, node ${2 * n.index + 1}. The left child is not touched at all.`)
      run(n.right)
    }
    const old = n.sum
    n.sum = n.left.sum + n.right.sum
    fixed.push(n.id)
    push(9, `Back on node ${n.index}: recalculate tree[${n.index}] = ${n.left.sum} + ${n.right.sum} = ${n.sum} (it was ${old}).`)
    frames.pop()
  }

  push(0, `Change the number at position ${i} to ${value}. Only the nodes that cover position ${i} can be wrong afterwards: one on each level, from the leaf up to the root.`, { frontier: [], slotLabels: {}, current: null })
  run(root)
  push(9, `Done. ${fixed.length} of the ${Object.keys(layout.pos).length} nodes were rewritten, one per level. The rest of the tree was never visited.`, { frontier: [], slotLabels: {}, current: null })
  return steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  build: { label: 'Build', code: buildCode, presets: buildPresets, build: buildBuildSteps },
  query: { label: 'Query (sum of a range)', code: queryCode, presets: queryPresets, build: buildQuerySteps },
  update: { label: 'Update (change a number)', code: updateCode, presets: updatePresets, build: buildUpdateSteps },
}

function SegTreeTracer() {
  const [kind, setKind] = useState('query')
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

export default SegTreeTracer
