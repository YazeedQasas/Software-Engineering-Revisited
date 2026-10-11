import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def insertion_sort(nums):',
  '    for i in range(1, len(nums)):',
  '        key = nums[i]',
  '        j = i - 1',
  '        while j >= 0 and nums[j] > key:',
  '            nums[j + 1] = nums[j]',
  '            j -= 1',
  '        nums[j + 1] = key',
  '    return nums',
]

const presets = [
  { label: 'Random', values: [5, 2, 4, 6, 1, 3] },
  { label: 'Backwards', values: [6, 5, 4, 3, 2, 1] },
  { label: 'Already sorted', values: [1, 2, 3, 4, 5, 6] },
  { label: 'Nearly sorted', values: [1, 2, 4, 3, 5, 6] },
]

// Runs insertion sort once and records a snapshot for every line that runs.
// The item being inserted (the key) is drawn lifted out of the list. Its
// "hole" moves left as larger items shift right, so a shift is shown as the
// key swapping places with the item beside it.
function buildInsertionSteps(values) {
  let arr = values.map((value, id) => ({ id, value }))
  const n = arr.length
  const steps = []
  let sortedUntil = 1

  const push = (line, vars, note, extra = {}) => {
    steps.push({
      line,
      array: arr.slice(),
      compare: null,
      swapping: false,
      keyPos: null,
      sortedUntil,
      vars,
      note,
      ...extra,
    })
  }

  push(1, {}, 'The first item on its own is already sorted, so start with the second item.')

  for (let i = 1; i < n; i++) {
    sortedUntil = i
    push(1, { i }, `i = ${i}: the first ${i} ${i === 1 ? 'item is' : 'items are'} sorted. Insert the next one.`)

    const key = arr[i].value
    sortedUntil = i + 1
    push(2, { i, key }, `Pick up ${key} and hold it out of the list.`, { keyPos: i })

    let j = i - 1
    push(3, { i, key, j }, `j = ${j}: start with the item just left of the held ${key}.`, { keyPos: i })

    while (j >= 0 && arr[j].value > key) {
      push(
        4,
        { i, key, j },
        `Is ${arr[j].value} > ${key}? Yes, so ${arr[j].value} has to move right.`,
        { keyPos: j + 1, compare: [j] },
      )

      arr = arr.slice()
      ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      push(
        5,
        { i, key, j },
        `Shift ${arr[j + 1].value} one slot right. The gap moves left.`,
        { keyPos: j, compare: [j + 1], swapping: true },
      )

      j -= 1
      push(6, { i, key, j }, `j = ${j}`, { keyPos: j + 1 })
    }

    push(
      4,
      { i, key, j },
      j < 0
        ? 'j is below 0: we have reached the front of the list. Stop.'
        : `Is ${arr[j].value} > ${key}? No, it is not bigger, so the gap is in the right place. Stop.`,
      { keyPos: j + 1, compare: j >= 0 ? [j] : null },
    )

    push(7, { i, key, j }, `Put ${key} down in position ${j + 1}.`)
  }

  sortedUntil = n
  push(8, {}, 'Return the sorted list.')
  return steps
}

function InsertionSortTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildInsertionSteps} />
}

export default InsertionSortTracer
