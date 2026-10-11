import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def bubble_sort(nums):',
  '    n = len(nums)',
  '    for end in range(n - 1, 0, -1):',
  '        swapped = False',
  '        for i in range(end):',
  '            if nums[i] > nums[i + 1]:',
  '                nums[i], nums[i + 1] = nums[i + 1], nums[i]',
  '                swapped = True',
  '        if not swapped:',
  '            break',
  '    return nums',
]

const presets = [
  { label: 'Random', values: [5, 1, 4, 2, 6, 3] },
  { label: 'Backwards', values: [6, 5, 4, 3, 2, 1] },
  { label: 'Already sorted', values: [1, 2, 3, 4, 5, 6] },
  { label: 'One turtle', values: [2, 3, 4, 5, 6, 1] },
]

// Runs bubble sort once and records a snapshot for every line that executes,
// so the tracer can replay it forwards and backwards.
function buildBubbleSteps(values) {
  let arr = values.map((value, id) => ({ id, value }))
  const n = arr.length
  const steps = []
  let sortedFrom = n

  const push = (line, vars, note, extra = {}) => {
    steps.push({
      line,
      array: arr.slice(),
      compare: null,
      swapping: false,
      sortedFrom,
      vars,
      note,
      ...extra,
    })
  }

  push(1, { n }, `n = ${n}: the list has ${n} items.`)

  let finished = false
  for (let end = n - 1; end >= 1 && !finished; end--) {
    push(
      2,
      { n, end },
      `Pass ${n - end}: compare neighbors up to index ${end}.${end < n - 1 ? ' Everything after that is already in its final place.' : ''}`,
    )

    let swapped = false
    push(3, { n, end, swapped }, 'Start the pass assuming nothing needs swapping.')

    for (let i = 0; i < end; i++) {
      const pair = [i, i + 1]
      push(4, { n, end, i, swapped }, `i = ${i}: look at positions ${i} and ${i + 1}.`, { compare: pair })

      const left = arr[i].value
      const right = arr[i + 1].value
      const outOfOrder = left > right
      push(
        5,
        { n, end, i, swapped },
        `Is ${left} > ${right}? ${outOfOrder ? 'Yes, they are out of order.' : 'No, they are already in order.'}`,
        { compare: pair },
      )

      if (outOfOrder) {
        arr = arr.slice()
        ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
        push(
          6,
          { n, end, i, swapped },
          `Swap them: ${right} moves left and ${left} moves right.`,
          { compare: pair, swapping: true },
        )
        swapped = true
        push(7, { n, end, i, swapped }, 'Remember that a swap happened this pass.', { compare: pair })
      }
    }

    sortedFrom = end
    if (swapped) {
      push(
        8,
        { n, end, swapped },
        end === 1
          ? 'A swap happened, but that was the last pass.'
          : `Position ${end} is now locked in. A swap happened, so another pass is needed.`,
      )
    } else {
      push(8, { n, end, swapped }, 'No swaps this pass, so every neighbor is in order.')
      sortedFrom = 0
      push(9, { n, end, swapped }, 'Break: the list is sorted, so stop early.')
      finished = true
    }
  }

  sortedFrom = 0
  push(10, { n }, 'Return the sorted list.')
  return steps
}

function BubbleSortTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildBubbleSteps} />
}

export default BubbleSortTracer
