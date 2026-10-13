import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'

// The sift_down function is shared by pop and build. It sits at a different
// place in each listing, so its lines are numbered from `base`.
const siftDownCode = [
  'def sift_down(heap, i):',
  '    size = len(heap)',
  '    while True:',
  '        child = 2 * i + 1',
  '        if child >= size:',
  '            break',
  '        if child + 1 < size and heap[child + 1] < heap[child]:',
  '            child += 1',
  '        if heap[i] <= heap[child]:',
  '            break',
  '        heap[i], heap[child] = heap[child], heap[i]',
  '        i = child',
]

// Gives every item its own id, so bars slide when items swap.
function makeContext(values) {
  const ctx = { arr: values.map((value, id) => ({ id, value })), steps: [], nextId: values.length }
  ctx.push = (line, vars, note, extra = {}) => {
    ctx.steps.push({
      line,
      array: ctx.arr.slice(),
      compare: null,
      swapping: false,
      keyPos: null,
      heapSize: ctx.arr.length,
      vars,
      note,
      ...extra,
    })
  }
  return ctx
}

// Sinks the item at position `start` until both its children are bigger.
function siftDown(ctx, start, base) {
  const { arr, push } = ctx
  let i = start
  const size = arr.length
  push(base + 1, { i, size }, `size = ${size}: the heap has ${size} ${size === 1 ? 'item' : 'items'}.`, { keyPos: i })

  for (;;) {
    let child = 2 * i + 1
    push(base + 3, { i, size, child }, `The left child of position ${i} is position 2 × ${i} + 1 = ${child}.`, { keyPos: i })

    const noChildren = child >= size
    push(
      base + 4,
      { i, size, child },
      noChildren
        ? `Position ${child} is outside the heap (size ${size}), so position ${i} has no children.`
        : `Position ${child} is inside the heap, so position ${i} has at least one child.`,
      { keyPos: i },
    )
    if (noChildren) {
      push(base + 5, { i, size }, `Nothing below to compare with, so ${ctx.arr[i].value} is in place. Stop.`, { keyPos: i })
      return
    }

    if (child + 1 < size) {
      const left = ctx.arr[child].value
      const right = ctx.arr[child + 1].value
      const rightSmaller = right < left
      push(
        base + 6,
        { i, size, child },
        `There is a second child. Is ${right} < ${left}? ${rightSmaller ? 'Yes, the right child is smaller.' : 'No, the left child is the smaller one.'}`,
        { keyPos: i, compare: [child, child + 1] },
      )
      if (rightSmaller) {
        child += 1
        push(base + 7, { i, size, child }, `Use the smaller child, at position ${child}.`, { keyPos: i, compare: [child] })
      }
    } else {
      push(base + 6, { i, size, child }, 'There is only one child, so it is the one to compare with.', { keyPos: i, compare: [child] })
    }

    const here = ctx.arr[i].value
    const there = ctx.arr[child].value
    const inPlace = here <= there
    push(
      base + 8,
      { i, size, child },
      `Is ${here} <= ${there}? ${inPlace ? 'Yes, the parent is no bigger than its smaller child. Stop.' : 'No, the child is smaller, so the parent has to sink.'}`,
      { keyPos: i, compare: [i, child] },
    )
    if (inPlace) {
      push(base + 9, { i, size, child }, 'The heap rule holds again. Stop.', { keyPos: i })
      return
    }

    ctx.arr = ctx.arr.slice()
    ;[ctx.arr[i], ctx.arr[child]] = [ctx.arr[child], ctx.arr[i]]
    push(base + 10, { i, size, child }, `Swap them: ${ctx.arr[i].value} moves up and ${ctx.arr[child].value} sinks down.`, {
      keyPos: child,
      compare: [i, child],
      swapping: true,
    })
    i = child
    push(base + 11, { i, size }, `i = ${i}: keep checking from the item's new position.`, { keyPos: i })
  }
}

// ------------------------------------------------------------------ push

const pushCode = [
  'def push(heap, x):',
  '    heap.append(x)',
  '    i = len(heap) - 1',
  '    while i > 0:',
  '        parent = (i - 1) // 2',
  '        if heap[parent] <= heap[i]:',
  '            break',
  '        heap[parent], heap[i] = heap[i], heap[parent]',
  '        i = parent',
]

const pushPresets = [
  { label: 'Push 10 (stays at the bottom)', values: [2, 5, 3, 8, 9, 6, 7], item: 10 },
  { label: 'Push 4 (rises part way)', values: [2, 5, 3, 8, 9, 6, 7], item: 4 },
  { label: 'Push 1 (rises to the top)', values: [2, 5, 3, 8, 9, 6, 7], item: 1 },
]

function buildPushSteps(values, preset) {
  const ctx = makeContext(values)
  const x = preset.item

  ctx.push(0, { x }, `Push ${x} onto the heap. Add it at the end, then let it float up to where it belongs.`)

  ctx.arr = [...ctx.arr, { id: ctx.nextId, value: x }]
  let i = ctx.arr.length - 1
  ctx.push(1, { x }, `Add ${x} at the end of the list. That is the next free spot in the tree, so the shape stays complete, but ${x} may be smaller than its parent.`, { keyPos: i })
  ctx.push(2, { x, i }, `i = ${i}: the position of the new item.`, { keyPos: i })

  while (i > 0) {
    ctx.push(3, { x, i }, `Is i > 0? Yes: position ${i} is not the top, so it has a parent.`, { keyPos: i })
    const parent = (i - 1) >> 1
    ctx.push(4, { x, i, parent }, `parent = (${i} − 1) // 2 = ${parent}.`, { keyPos: i, compare: [i, parent] })
    const here = ctx.arr[i].value
    const above = ctx.arr[parent].value
    const fine = above <= here
    ctx.push(5, { x, i, parent }, `Is ${above} <= ${here}? ${fine ? 'Yes, the parent is no bigger. The heap rule holds.' : `No, the parent is bigger, so ${here} must move above it.`}`, { keyPos: i, compare: [i, parent] })
    if (fine) {
      ctx.push(6, { x, i, parent }, 'Stop: the item is where it belongs.', { keyPos: i })
      return ctx.steps
    }
    ctx.arr = ctx.arr.slice()
    ;[ctx.arr[parent], ctx.arr[i]] = [ctx.arr[i], ctx.arr[parent]]
    ctx.push(7, { x, i, parent }, `Swap them: ${ctx.arr[parent].value} moves up and ${ctx.arr[i].value} drops down.`, { keyPos: parent, compare: [i, parent], swapping: true })
    i = parent
    ctx.push(8, { x, i }, `i = ${i}: keep checking from the new position.`, { keyPos: i })
  }
  ctx.push(3, { x, i }, 'Is i > 0? No: it has reached the top of the heap, so there is nothing above it. Stop.', { keyPos: 0 })
  return ctx.steps
}

// ------------------------------------------------------------------- pop

const popCode = [
  'def pop(heap):',
  '    smallest = heap[0]',
  '    heap[0] = heap[-1]',
  '    heap.pop()',
  '    sift_down(heap, 0)',
  '    return smallest',
  '',
  ...siftDownCode,
]

const popPresets = [
  { label: 'A small heap', values: [1, 3, 2, 7, 4, 5, 6] },
  { label: 'Already sorted', values: [1, 2, 3, 4, 5, 6, 7] },
  { label: 'Duplicates', values: [2, 2, 3, 2, 5, 3, 4] },
  { label: 'Just two items', values: [1, 2] },
]

function buildPopSteps(values) {
  const ctx = makeContext(values)
  const smallest = ctx.arr[0].value

  ctx.push(0, { n: ctx.arr.length }, 'Pop the smallest item. It is always at the top, but taking it out leaves a hole to fill.')
  ctx.push(1, { smallest }, `smallest = ${smallest}: save the top item, which is the one we will return.`, { keyPos: 0 })

  const last = ctx.arr[ctx.arr.length - 1]
  ctx.arr = [last, ...ctx.arr.slice(1, -1)]
  ctx.push(2, { smallest }, `Copy the last item, ${last.value}, into the top. Using the last item keeps the tree complete, but ${last.value} is probably too big to be on top.`, { keyPos: 0 })
  ctx.push(3, { smallest }, `heap.pop() removes the now-duplicated last slot, so the heap has ${ctx.arr.length} ${ctx.arr.length === 1 ? 'item' : 'items'}.`, { keyPos: 0 })
  ctx.push(4, { smallest }, `Call sift_down on position 0: let ${last.value} sink until both its children are bigger.`, { keyPos: 0 })
  siftDown(ctx, 0, 7)
  ctx.push(5, { smallest }, `Return ${smallest}. The heap rule holds again, with the next smallest item now on top.`)
  return ctx.steps
}

// ----------------------------------------------------------------- build

const buildCode = [
  'def heapify(heap):',
  '    for i in range(len(heap) // 2 - 1, -1, -1):',
  '        sift_down(heap, i)',
  '',
  ...siftDownCode,
]

const buildPresets = [
  { label: 'Random', values: [5, 3, 8, 1, 9, 2, 7] },
  { label: 'Backwards', values: [7, 6, 5, 4, 3, 2, 1] },
  { label: 'Already a heap', values: [1, 2, 3, 4, 5, 6, 7] },
  { label: 'Duplicates', values: [3, 1, 3, 2, 3, 1, 2] },
]

function buildBuildSteps(values) {
  const ctx = makeContext(values)
  const n = ctx.arr.length

  ctx.push(0, { n }, 'Turn an unsorted list into a heap, in place. The second half of the list is all leaves, and a leaf is already a tiny heap, so start at the last parent and work back to the top.')
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    ctx.push(1, { n, i }, `Position ${i} is a parent with at least one child. Fix the heap below it.`, { keyPos: i })
    ctx.push(2, { n, i }, `sift_down(heap, ${i}): let ${ctx.arr[i].value} sink until both its children are bigger.`, { keyPos: i })
    siftDown(ctx, i, 4)
  }
  ctx.push(1, { n }, 'Done: every parent is no bigger than its children, so the smallest item is at position 0.')
  return ctx.steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  push: { label: 'Push', code: pushCode, presets: pushPresets, build: buildPushSteps },
  pop: { label: 'Pop', code: popCode, presets: popPresets, build: buildPopSteps },
  build: { label: 'Build (heapify)', code: buildCode, presets: buildPresets, build: buildBuildSteps },
}

function HeapTracer() {
  const [kind, setKind] = useState('push')
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
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} />
    </>
  )
}

export default HeapTracer
