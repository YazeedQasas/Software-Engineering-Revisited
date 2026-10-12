import CodeTracer from '../../components/CodeTracer.jsx'

const code = [
  'def linear_search(nums, target):',
  '    for i in range(len(nums)):',
  '        if nums[i] == target:',
  '            return i',
  '    return -1',
]

const list = [4, 9, 2, 7, 5, 8, 1, 6]

const presets = [
  { label: 'Found in the middle', values: list, target: 7 },
  { label: 'First item (best case)', values: list, target: 4 },
  { label: 'Last item (worst case)', values: list, target: 6 },
  { label: 'Not in the list', values: list, target: 3 },
  { label: 'Duplicates', values: [5, 7, 2, 7, 9, 7, 1, 3], target: 7 },
]

// Runs linear search once and records a snapshot for every line that runs.
// `visited` lists the positions already ruled out, shown as faded cubes.
function buildLinearSteps(values, preset) {
  const arr = values.map((value, id) => ({ id, value }))
  const target = preset.target
  const n = arr.length
  const steps = []
  const visited = []

  const push = (line, vars, note, extra = {}) => {
    steps.push({
      line,
      array: arr,
      compare: null,
      visited: visited.slice(),
      foundAt: null,
      target,
      vars,
      note,
      ...extra,
    })
  }

  push(0, { target }, `Search for ${target} in the list, one item at a time, starting at the front.`)

  for (let i = 0; i < n; i++) {
    push(1, { i, target }, `i = ${i}: look at position ${i}.`, { compare: [i] })

    const match = arr[i].value === target
    push(2, { i, target }, `Is ${arr[i].value} == ${target}? ${match ? 'Yes!' : 'No, rule it out and move on.'}`, { compare: [i] })

    if (match) {
      push(3, { i, target }, `Found ${target} at position ${i}. Return ${i} and stop. After ${i + 1} ${i === 0 ? 'check' : 'checks'}.`, { foundAt: i })
      return steps
    }
    visited.push(i)
  }

  push(4, { target }, `Checked all ${n} items and ${target} is not there. Return -1.`)
  return steps
}

function LinearSearchTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildLinearSteps} view="iso" />
}

export default LinearSearchTracer
