import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def merge_sort(nums, lo, hi):',
  '    if lo >= hi:',
  '        return',
  '    mid = (lo + hi) // 2',
  '    merge_sort(nums, lo, mid)',
  '    merge_sort(nums, mid + 1, hi)',
  '    merge(nums, lo, mid, hi)',
  '',
  'def merge(nums, lo, mid, hi):',
  '    left = nums[lo:mid + 1]',
  '    right = nums[mid + 1:hi + 1]',
  '    i = j = 0',
  '    for k in range(lo, hi + 1):',
  '        if j >= len(right) or (i < len(left) and left[i] <= right[j]):',
  '            nums[k] = left[i]',
  '            i += 1',
  '        else:',
  '            nums[k] = right[j]',
  '            j += 1',
  '',
  'merge_sort(nums, 0, len(nums) - 1)',
]

const presets = [
  { label: 'Random', values: [5, 2, 4, 6, 1, 3] },
  { label: 'Backwards', values: [6, 5, 4, 3, 2, 1] },
  { label: 'Already sorted', values: [1, 2, 3, 4, 5, 6] },
  { label: 'Nearly sorted', values: [1, 2, 4, 3, 5, 6] },
]

const show = (items) => `[${items.map((item) => item.value).join(', ')}]`

// Runs merge sort once and records a snapshot for every line that runs.
// While merging, the bars in the piece being merged are laid out as: items
// already placed, then what is left of the left half, then what is left of
// the right half. Taking from the left needs no move; taking from the right
// slides that bar left to position k, past the left half's leftovers.
function buildMergeSteps(values) {
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
      vars,
      note,
      ...extra,
    })
  }

  const merge = (lo, mid, hi) => {
    const left = arr.slice(lo, mid + 1)
    const right = arr.slice(mid + 1, hi + 1)
    const range = [lo, hi]
    const base = { lo, mid, hi }

    push(9, base, `Copy the left half: ${show(left)}.`, { range })
    push(10, { ...base, left: show(left) }, `Copy the right half: ${show(right)}.`, { range })

    let i = 0
    let j = 0
    push(11, { ...base, i, j }, 'Two markers, one for each half. Both start at the front.', { range })

    for (let k = lo; k <= hi; k++) {
      const vars = { k, i, j }
      push(12, vars, `k = ${k}: choose the item that goes in position ${k}.`, {
        range,
        sortedRanges: [...sortedRanges, [lo, k - 1]].filter(([from, to]) => to >= from),
      })

      const leftHead = i < left.length ? left[i] : null
      const rightHead = j < right.length ? right[j] : null
      const takeLeft = rightHead === null || (leftHead !== null && leftHead.value <= rightHead.value)

      const comparePositions = []
      if (leftHead) comparePositions.push(k)
      if (rightHead) comparePositions.push(k + (left.length - i))

      let note
      if (rightHead === null) note = 'The right half is used up, so take from the left.'
      else if (leftHead === null) note = 'The left half is used up, so take from the right.'
      else
        note = `Is ${leftHead.value} <= ${rightHead.value}? ${takeLeft ? 'Yes, take from the left.' : 'No, take from the right.'}`
      push(13, vars, note, {
        range,
        compare: comparePositions,
        sortedRanges: [...sortedRanges, [lo, k - 1]].filter(([from, to]) => to >= from),
      })

      if (takeLeft) {
        push(14, vars, `Put ${leftHead.value} in position ${k}. It was already there, so nothing moves.`, {
          range,
          compare: [k],
          swapping: true,
          sortedRanges: [...sortedRanges, [lo, k - 1]].filter(([from, to]) => to >= from),
        })
        i += 1
        push(15, { k, i, j }, `i = ${i}`, { range, sortedRanges: [...sortedRanges, [lo, k]] })
      } else {
        const from = k + (left.length - i)
        arr = arr.slice()
        const [item] = arr.splice(from, 1)
        arr.splice(k, 0, item)
        push(17, vars, `Put ${item.value} in position ${k}: it slides left past the leftover items.`, {
          range,
          compare: [k],
          swapping: true,
          sortedRanges: [...sortedRanges, [lo, k - 1]].filter(([a, b]) => b >= a),
        })
        j += 1
        push(18, { k, i, j }, `j = ${j}`, { range, sortedRanges: [...sortedRanges, [lo, k]] })
      }
    }

    sortedRanges = sortedRanges.filter(([from, to]) => !(from >= lo && to <= hi))
    sortedRanges.push([lo, hi])
  }

  const sort = (lo, hi) => {
    push(1, { lo, hi }, `merge_sort(${lo}, ${hi}): does this piece have 0 or 1 items?`, { range: [lo, hi] })

    if (lo >= hi) {
      sortedRanges.push([lo, hi])
      push(2, { lo, hi }, 'Just one item, so it is already sorted. Go back up.', { range: [lo, hi] })
      return
    }

    const mid = Math.floor((lo + hi) / 2)
    push(3, { lo, hi, mid }, `Split in the middle: left is ${lo}..${mid}, right is ${mid + 1}..${hi}.`, { range: [lo, hi] })
    push(4, { lo, hi, mid }, 'Sort the left half first.', { range: [lo, mid] })
    sort(lo, mid)
    push(5, { lo, hi, mid }, 'Left half is done. Now sort the right half.', { range: [mid + 1, hi] })
    sort(mid + 1, hi)
    push(6, { lo, hi, mid }, 'Both halves are sorted. Merge them into one sorted piece.', { range: [lo, hi] })
    merge(lo, mid, hi)
  }

  push(20, {}, `Start: sort positions 0 to ${n - 1}.`)
  sort(0, n - 1)
  push(20, {}, 'Done: the whole list is sorted.')
  return steps
}

function MergeSortTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildMergeSteps} />
}

export default MergeSortTracer
