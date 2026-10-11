import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def selection_sort(nums):',
  '    n = len(nums)',
  '    for i in range(n - 1):',
  '        smallest = i',
  '        for j in range(i + 1, n):',
  '            if nums[j] < nums[smallest]:',
  '                smallest = j',
  '        if smallest != i:',
  '            nums[i], nums[smallest] = nums[smallest], nums[i]',
  '    return nums',
]

const presets = [
  { label: 'Random', values: [4, 6, 2, 5, 1, 3] },
  { label: 'Backwards', values: [6, 5, 4, 3, 2, 1] },
  { label: 'Already sorted', values: [1, 2, 3, 4, 5, 6] },
  { label: 'Nearly sorted', values: [1, 2, 4, 3, 5, 6] },
]

// Runs selection sort once and records a snapshot for every line that runs.
// The raised bar (keyPos) marks the smallest item found so far in this pass.
function buildSelectionSteps(values) {
  let arr = values.map((value, id) => ({ id, value }))
  const n = arr.length
  const steps = []
  let sortedUntil = 0

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

  push(1, { n }, `n = ${n}: the list has ${n} items.`)

  for (let i = 0; i < n - 1; i++) {
    sortedUntil = i
    push(2, { n, i }, `Pass ${i + 1}: find the smallest item in positions ${i} to ${n - 1}.`)

    let smallest = i
    push(3, { n, i, smallest }, `Assume position ${i} (${arr[i].value}) is the smallest so far.`, { keyPos: smallest })

    for (let j = i + 1; j < n; j++) {
      push(4, { n, i, smallest, j }, `j = ${j}: look at position ${j} (${arr[j].value}).`, {
        keyPos: smallest,
        compare: [j],
      })

      const isSmaller = arr[j].value < arr[smallest].value
      push(
        5,
        { n, i, smallest, j },
        `Is ${arr[j].value} < ${arr[smallest].value}? ${isSmaller ? 'Yes, a new smallest.' : 'No, keep the current smallest.'}`,
        { keyPos: smallest, compare: [j] },
      )

      if (isSmaller) {
        smallest = j
        push(6, { n, i, smallest, j }, `smallest = ${j}: remember where the new smallest is.`, {
          keyPos: smallest,
          compare: [j],
        })
      }
    }

    const needsSwap = smallest !== i
    push(
      7,
      { n, i, smallest },
      needsSwap
        ? `The smallest is ${arr[smallest].value}, at position ${smallest}, not position ${i}. Swap needed.`
        : `The smallest, ${arr[smallest].value}, is already at position ${i}. No swap needed.`,
      { keyPos: smallest },
    )

    if (needsSwap) {
      arr = arr.slice()
      ;[arr[i], arr[smallest]] = [arr[smallest], arr[i]]
      push(
        8,
        { n, i, smallest },
        `Swap: ${arr[i].value} goes to position ${i} and is locked in.`,
        { compare: [i, smallest], swapping: true },
      )
    }
  }

  sortedUntil = n
  push(9, { n }, 'Return the sorted list.')
  return steps
}

function SelectionSortTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildSelectionSteps} />
}

export default SelectionSortTracer
