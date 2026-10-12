import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def binary_search(nums, target):',
  '    low = 0',
  '    high = len(nums) - 1',
  '    while low <= high:',
  '        mid = (low + high) // 2',
  '        if nums[mid] == target:',
  '            return mid',
  '        elif nums[mid] < target:',
  '            low = mid + 1',
  '        else:',
  '            high = mid - 1',
  '    return -1',
]

// The linear search list, sorted, so the two pages can be compared.
const list = [1, 2, 4, 5, 6, 7, 8, 9]

const presets = [
  { label: 'Found in the middle', values: list, target: 7 },
  { label: 'Right in the centre (best case)', values: list, target: 5 },
  { label: 'First item', values: list, target: 1 },
  { label: 'Last item (worst case)', values: list, target: 9 },
  { label: 'Not in the list', values: list, target: 3 },
  { label: 'Duplicates', values: [1, 3, 7, 7, 7, 7, 8, 9], target: 7 },
]

// Runs binary search once and records a snapshot for every line that runs.
// `visited` lists the positions outside [low, high]: the part already thrown
// away, shown as faded cubes, so what is left is the part still in play.
function buildBinarySteps(values, preset) {
  const arr = values.map((value, id) => ({ id, value }))
  const target = preset.target
  const n = arr.length
  const steps = []
  let low = 0
  let high = n - 1
  let mid = null
  let checks = 0

  const push = (line, note, extra = {}) => {
    const visited = []
    for (let i = 0; i < n; i++) {
      if (i < low || i > high) visited.push(i)
    }
    const vars = { low, high }
    if (mid !== null) vars.mid = mid
    vars.target = target
    steps.push({
      line,
      array: arr,
      compare: null,
      visited,
      foundAt: null,
      target,
      vars,
      note,
      ...extra,
    })
  }

  push(0, `Search for ${target} in a sorted list by always looking at the middle first.`)
  push(1, 'low is the first position still in play: 0.')
  push(2, `high is the last position still in play: ${high}. Every item starts in play.`)

  while (low <= high) {
    mid = null
    push(3, `Is low <= high? ${low} <= ${high} is true, so there is still something to look at.`)

    mid = Math.floor((low + high) / 2)
    push(4, `mid = (${low} + ${high}) // 2 = ${mid}. Look at the middle of what is left.`, { compare: [mid] })

    checks += 1
    const value = arr[mid].value
    const match = value === target
    push(5, `Is ${value} == ${target}? ${match ? 'Yes!' : 'No.'}`, { compare: [mid] })

    if (match) {
      push(6, `Found ${target} at position ${mid}. Return ${mid} and stop. After ${checks} ${checks === 1 ? 'check' : 'checks'}.`, { foundAt: mid })
      return steps
    }

    const tooSmall = value < target
    push(7, `Is ${value} < ${target}? ${tooSmall ? `Yes, so ${target} must be to the right.` : `No, so ${target} must be to the left.`}`, { compare: [mid] })

    if (tooSmall) {
      low = mid + 1
      push(8, `${value} and everything left of it is too small. Throw that half away: low = ${low}.`)
    } else {
      push(9, `${value} is too big, so take the else branch.`, { compare: [mid] })
      high = mid - 1
      push(10, `${value} and everything right of it is too big. Throw that half away: high = ${high}.`)
    }
  }

  mid = null
  push(3, `Is low <= high? ${low} <= ${high} is false: nothing is left in play.`)
  push(11, `Every item was ruled out in ${checks} ${checks === 1 ? 'check' : 'checks'} and ${target} is not there. Return -1.`)
  return steps
}

function BinarySearchTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildBinarySteps} view="iso" />
}

export default BinarySearchTracer
