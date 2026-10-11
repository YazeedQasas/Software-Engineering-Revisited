import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def quick_sort(nums, lo, hi):',
  '    if lo >= hi:',
  '        return',
  '    p = partition(nums, lo, hi)',
  '    quick_sort(nums, lo, p - 1)',
  '    quick_sort(nums, p + 1, hi)',
  '',
  'def partition(nums, lo, hi):',
  '    pivot = nums[hi]',
  '    left = lo',
  '    right = hi - 1',
  '    while True:',
  '        while left <= right and nums[left] < pivot:',
  '            left += 1',
  '        while left <= right and nums[right] >= pivot:',
  '            right -= 1',
  '        if left >= right:',
  '            break',
  '        nums[left], nums[right] = nums[right], nums[left]',
  '        left += 1',
  '        right -= 1',
  '    nums[left], nums[hi] = nums[hi], nums[left]',
  '    return left',
  '',
  'quick_sort(nums, 0, len(nums) - 1)',
]

const presets = [
  { label: 'Example from my notes', values: [3, 7, 1, 8, 2, 5, 9, 4, 6] },
  { label: 'Random', values: [4, 6, 2, 5, 1, 3] },
  { label: 'Already sorted', values: [1, 2, 3, 4, 5, 6] },
  { label: 'Backwards', values: [6, 5, 4, 3, 2, 1] },
  { label: 'Duplicates', values: [3, 1, 3, 2, 3, 1] },
]

// Runs quick sort once (last item as the pivot, two pointers walking toward
// each other) and records a snapshot for every line that runs. The raised
// bar is the pivot, the two markers under the bars are the pointers, and
// green bars are already in their final place.
function buildQuickSteps(values) {
  let arr = values.map((value, id) => ({ id, value }))
  const n = arr.length
  const steps = []
  let sortedRanges = []

  const push = (line, vars, note, extra = {}) => {
    steps.push({
      line,
      array: arr.slice(),
      compare: null,
      swapping: false,
      keyPos: null,
      sortedRanges: sortedRanges.slice(),
      range: null,
      pointers: null,
      vars,
      note,
      ...extra,
    })
  }

  const partition = (lo, hi) => {
    const range = [lo, hi]
    const pivot = arr[hi].value
    let pivotPos = hi
    const marks = (left, right) => [
      { pos: left, label: 'left', tone: 'left' },
      { pos: right, label: 'right', tone: 'right' },
    ]

    push(8, { lo, hi, pivot }, `The pivot is the last item in this piece: ${pivot}.`, { range, keyPos: pivotPos })

    let left = lo
    push(9, { pivot, left }, `left starts at the front of this piece, position ${left}. It looks for something that is ${pivot} or more.`, {
      range,
      keyPos: pivotPos,
      pointers: marks(left, hi - 1),
    })

    let right = hi - 1
    push(10, { pivot, left, right }, `right starts just before the pivot, position ${right}. It looks for something smaller than ${pivot}.`, {
      range,
      keyPos: pivotPos,
      pointers: marks(left, right),
    })

    while (true) {
      while (left <= right) {
        const value = arr[left].value
        const keepGoing = value < pivot
        push(12, { pivot, left, right }, `Is ${value} < ${pivot}? ${keepGoing ? 'Yes, it is on the correct side already. Move left on.' : `No, it is ${pivot} or more, so left stops here.`}`, {
          range,
          keyPos: pivotPos,
          compare: [left],
          pointers: marks(left, right),
        })
        if (!keepGoing) break
        left += 1
        push(13, { pivot, left, right }, `left = ${left}`, { range, keyPos: pivotPos, pointers: marks(left, right) })
      }
      if (left > right) {
        push(12, { pivot, left, right }, 'left has passed right, so there is nothing more to check on this side.', {
          range,
          keyPos: pivotPos,
          pointers: marks(left, right),
        })
      }

      while (left <= right) {
        const value = arr[right].value
        const keepGoing = value >= pivot
        push(14, { pivot, left, right }, `Is ${value} >= ${pivot}? ${keepGoing ? 'Yes, it is on the correct side already. Move right back.' : `No, it is smaller than ${pivot}, so right stops here.`}`, {
          range,
          keyPos: pivotPos,
          compare: [right],
          pointers: marks(left, right),
        })
        if (!keepGoing) break
        right -= 1
        push(15, { pivot, left, right }, `right = ${right}`, { range, keyPos: pivotPos, pointers: marks(left, right) })
      }
      if (left > right) {
        push(14, { pivot, left, right }, 'right has passed left, so the pointers have crossed.', {
          range,
          keyPos: pivotPos,
          pointers: marks(left, right),
        })
      }

      const met = left >= right
      push(16, { pivot, left, right }, met ? 'The pointers have met or crossed: every item left of them is smaller than the pivot, and the rest are not.' : `left (${arr[left].value}) is on the wrong side and so is right (${arr[right].value}). Swap them.`, {
        range,
        keyPos: pivotPos,
        pointers: marks(left, right),
      })
      if (met) {
        push(17, { pivot, left, right }, 'Stop scanning.', { range, keyPos: pivotPos, pointers: marks(left, right) })
        break
      }

      arr = arr.slice()
      ;[arr[left], arr[right]] = [arr[right], arr[left]]
      push(18, { pivot, left, right }, 'Swapped: the small item is now on the left and the big item on the right.', {
        range,
        keyPos: pivotPos,
        compare: [left, right],
        swapping: true,
        pointers: marks(left, right),
      })
      left += 1
      push(19, { pivot, left, right }, `left = ${left}`, { range, keyPos: pivotPos, pointers: marks(left, right) })
      right -= 1
      push(20, { pivot, left, right }, `right = ${right}`, { range, keyPos: pivotPos, pointers: marks(left, right) })
    }

    push(21, { pivot, left }, left === hi
      ? `left is already at the pivot's position ${hi}, so the pivot stays where it is.`
      : `Swap the first item of the right side (${arr[left].value}) with the pivot, so the pivot sits between the two sides.`, {
      range,
      keyPos: pivotPos,
      compare: left === hi ? [hi] : [left, hi],
      swapping: true,
      pointers: marks(left, right),
    })
    arr = arr.slice()
    ;[arr[left], arr[hi]] = [arr[hi], arr[left]]
    pivotPos = left
    sortedRanges.push([left, left])
    push(22, { pivot, p: left }, `Partition done: ${pivot} is now in its final place, position ${left}.`, { range })
    return left
  }

  const sort = (lo, hi) => {
    const range = lo <= hi ? [lo, hi] : null
    push(1, { lo, hi }, `quick_sort(${lo}, ${hi}): does this piece have 0 or 1 items?`, { range })

    if (lo >= hi) {
      if (lo === hi) sortedRanges.push([lo, lo])
      push(2, { lo, hi }, lo === hi ? 'One item, so it is already in place. Go back up.' : 'Nothing here. Go back up.', { range })
      return
    }

    push(3, { lo, hi }, 'Partition: choose a pivot and sort the other items to either side of it.', { range })
    const p = partition(lo, hi)
    push(4, { lo, hi, p }, 'Now sort everything to the left of the pivot.', { range: p - 1 >= lo ? [lo, p - 1] : null })
    sort(lo, p - 1)
    push(5, { lo, hi, p }, 'Left side done. Now sort everything to the right of the pivot.', { range: hi >= p + 1 ? [p + 1, hi] : null })
    sort(p + 1, hi)
  }

  push(24, {}, `Start: sort positions 0 to ${n - 1}.`)
  sort(0, n - 1)
  sortedRanges = [[0, n - 1]]
  push(24, {}, 'Done: every item is in its final place.')
  return steps
}

function QuickSortTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildQuickSteps} />
}

export default QuickSortTracer
