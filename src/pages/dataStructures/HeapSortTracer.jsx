import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def heap_sort(nums):',
  '    n = len(nums)',
  '    for start in range(n // 2 - 1, -1, -1):',
  '        sift_down(nums, start, n)',
  '    for end in range(n - 1, 0, -1):',
  '        nums[0], nums[end] = nums[end], nums[0]',
  '        sift_down(nums, 0, end)',
  '',
  'def sift_down(nums, root, size):',
  '    while True:',
  '        child = 2 * root + 1',
  '        if child >= size:',
  '            break',
  '        if child + 1 < size and nums[child + 1] > nums[child]:',
  '            child += 1',
  '        if nums[root] >= nums[child]:',
  '            break',
  '        nums[root], nums[child] = nums[child], nums[root]',
  '        root = child',
]

const presets = [
  { label: 'Random', values: [5, 3, 8, 1, 9, 2, 7] },
  { label: 'Already sorted', values: [1, 2, 3, 4, 5, 6, 7] },
  { label: 'Backwards', values: [7, 6, 5, 4, 3, 2, 1] },
  { label: 'Duplicates', values: [3, 1, 3, 2, 3, 1, 2] },
]

// Runs heap sort once (a max-heap stored in the array itself) and records a
// snapshot for every line that runs. The first `heapSize` items are the heap
// (also drawn as a tree); green bars on the right are already sorted.
function buildHeapSteps(values) {
  let arr = values.map((value, id) => ({ id, value }))
  const n = arr.length
  const steps = []
  let heapSize = n
  let sortedFrom = n

  const push = (line, vars, note, extra = {}) => {
    steps.push({
      line,
      array: arr.slice(),
      compare: null,
      swapping: false,
      keyPos: null,
      sortedFrom,
      heapSize,
      vars,
      note,
      ...extra,
    })
  }

  const siftDown = (startRoot, size) => {
    let root = startRoot
    for (;;) {
      let child = 2 * root + 1
      push(10, { root, size, child }, `The left child of position ${root} is position 2 × ${root} + 1 = ${child}.`, { keyPos: root })

      const noChildren = child >= size
      push(
        11,
        { root, size, child },
        noChildren
          ? `Position ${child} is outside the heap (size ${size}), so position ${root} has no children.`
          : `Position ${child} is inside the heap, so position ${root} has at least one child.`,
        { keyPos: root },
      )
      if (noChildren) {
        push(12, { root, size }, `Nothing below position ${root} to compare with, so it is in place. Stop.`, { keyPos: root })
        return
      }

      if (child + 1 < size) {
        const right = arr[child + 1].value
        const left = arr[child].value
        const rightBigger = right > left
        push(
          13,
          { root, size, child },
          `There is a second child. Is ${right} > ${left}? ${rightBigger ? 'Yes, the right child is bigger.' : 'No, the left child is the bigger one.'}`,
          { keyPos: root, compare: [child, child + 1] },
        )
        if (rightBigger) {
          child += 1
          push(14, { root, size, child }, `Use the bigger child, at position ${child}.`, { keyPos: root, compare: [child] })
        }
      } else {
        push(13, { root, size, child }, 'There is only one child, so it is the one to compare with.', { keyPos: root, compare: [child] })
      }

      const rootValue = arr[root].value
      const childValue = arr[child].value
      const inPlace = rootValue >= childValue
      push(
        15,
        { root, size, child },
        `Is ${rootValue} >= ${childValue}? ${inPlace ? 'Yes, the parent is already bigger than its children. Stop.' : 'No, the child is bigger, so the parent has to move down.'}`,
        { keyPos: root, compare: [root, child] },
      )
      if (inPlace) {
        push(16, { root, size, child }, 'The heap is correct again. Stop.', { keyPos: root })
        return
      }

      arr = arr.slice()
      ;[arr[root], arr[child]] = [arr[child], arr[root]]
      push(17, { root, size, child }, `Swap them: ${arr[root].value} moves up and ${arr[child].value} moves down.`, {
        keyPos: child,
        compare: [root, child],
        swapping: true,
      })
      root = child
      push(18, { root, size }, `root = ${root}: keep checking from the item's new position.`, { keyPos: root })
    }
  }

  push(1, { n }, `n = ${n}: the list has ${n} items.`)

  for (let start = Math.floor(n / 2) - 1; start >= 0; start--) {
    push(2, { n, start }, `Build the heap. Position ${start} is a parent with at least one child. Fix the heap below it.`, { keyPos: start })
    push(3, { n, start }, `sift_down(${start}): push ${arr[start].value} down until it is bigger than its children.`, { keyPos: start })
    siftDown(start, n)
  }
  push(4, { n }, 'The heap is built: the biggest item is at position 0, and every parent is at least as big as its children.', { heapSize: n })

  for (let end = n - 1; end > 0; end--) {
    heapSize = end + 1
    push(4, { n, end }, `end = ${end}: swap the biggest item (position 0) with the last item of the heap (position ${end}).`, {
      compare: [0, end],
    })
    arr = arr.slice()
    ;[arr[0], arr[end]] = [arr[end], arr[0]]
    sortedFrom = end
    heapSize = end
    push(5, { n, end }, `${arr[end].value} is the biggest left, so it goes at position ${end}. It is locked in, and the heap now has ${end} items.`, {
      compare: [0, end],
      swapping: true,
      heapSize: end + 1,
    })
    push(6, { n, end }, `The new top, ${arr[0].value}, may be too small for the top. Fix the heap.`, { keyPos: 0 })
    siftDown(0, end)
  }

  heapSize = 0
  sortedFrom = 0
  push(6, { n }, 'Done: every item is in its sorted place.')
  return steps
}

function HeapSortTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildHeapSteps} />
}

export default HeapSortTracer
