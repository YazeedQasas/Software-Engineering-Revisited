import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'

// Collects the steps. Every step is a snapshot of the list, so stepping
// backwards just works. Bars keep their id when swapped, so they slide.
function makeLog(values) {
  const log = { steps: [], items: values.map((value, id) => ({ id, value })) }
  log.push = (line, note, extra = {}) => {
    log.steps.push({
      line,
      array: log.items.map((item) => ({ ...item })),
      compare: null,
      vars: {},
      note,
      ...extra,
    })
  }
  return log
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// ------------------------------------------------ brute force: every pair

const bruteCode = [
  'def pair_sum_brute(nums, target):',
  '    for i in range(len(nums)):',
  '        for j in range(i + 1, len(nums)):',
  '            if nums[i] + nums[j] == target:',
  '                return i, j',
  '    return None',
]

const SORTED = [1, 3, 4, 6, 8, 11, 15]
const pairPresets = [
  { label: 'target 14', nums: SORTED, target: 14 },
  { label: 'target 9', nums: SORTED, target: 9 },
  { label: 'target 16', nums: SORTED, target: 16 },
  { label: 'target 30: no pair', nums: SORTED, target: 30 },
]

function buildBruteSteps(_values, { nums, target }) {
  const log = makeLog(nums)
  let checks = 0
  log.push(0, `Find two numbers in the list that add up to ${target}. Brute force tries every pair, one after another.`, { vars: { target, checks } })
  for (let i = 0; i < nums.length; i++) {
    log.push(1, `i = ${i}: the first number of the pair is ${nums[i]}.`, { vars: { i, target, checks }, compare: [i, i] })
    for (let j = i + 1; j < nums.length; j++) {
      log.push(2, `j = ${j}: the second number is ${nums[j]}.`, { vars: { i, j, target, checks }, compare: [i, j] })
      checks++
      const sum = nums[i] + nums[j]
      const hit = sum === target
      log.push(3, `Is ${nums[i]} + ${nums[j]} == ${target}? ${sum} ${hit ? '== ' + target + ': yes!' : 'is not ' + target + '.'} That was check number ${checks}.`, { vars: { i, j, target, checks }, compare: hit ? null : [i, j], sortedRanges: hit ? [[i, i], [j, j]] : undefined })
      if (hit) {
        log.push(4, `Return (${i}, ${j}). It took ${plural(checks, 'check')}.`, { vars: { i, j, target, checks }, sortedRanges: [[i, i], [j, j]] })
        return log.steps
      }
    }
  }
  log.push(5, `Every pair has been tried (${checks}) and none adds up to ${target}, so return None.`, { vars: { target, checks } })
  return log.steps
}

// ------------------------------------------------------------ two pointers

const pointersCode = [
  'def pair_sum(nums, target):',
  '    left, right = 0, len(nums) - 1',
  '    while left < right:',
  '        total = nums[left] + nums[right]',
  '        if total == target:',
  '            return left, right',
  '        if total < target:',
  '            left += 1',
  '        else:',
  '            right -= 1',
  '    return None',
]

function buildPointerSteps(_values, { nums, target }) {
  const log = makeLog(nums)
  let [left, right] = [0, nums.length - 1]
  let checks = 0
  const at = (extra = {}) => ({
    pointers: [{ pos: left, label: 'left', tone: 'left' }, { pos: right, label: 'right', tone: 'right' }],
    range: left < right ? [left, right] : undefined,
    ...extra,
  })

  log.push(0, `Find two numbers that add up to ${target}. The list is sorted, so two pointers can start at the ends and close in.`, { vars: { target } })
  log.push(1, `left = 0 and right = ${right}: the smallest and the biggest number.`, at({ vars: { left, right, target } }))
  for (;;) {
    const more = left < right
    log.push(2, `Is left < right? ${left} < ${right}: ${more ? 'Yes, there are still two different numbers to try.' : 'No, the pointers have met. Every number has been ruled out.'}`, at({ vars: { left, right, target }, range: more ? [left, right] : undefined }))
    if (!more) break

    checks++
    const total = nums[left] + nums[right]
    log.push(3, `total = ${nums[left]} + ${nums[right]} = ${total}. That was check number ${checks}.`, at({ vars: { left, right, total, target }, compare: [left, right] }))
    const hit = total === target
    log.push(4, `Is total == target? ${total} ${hit ? '== ' + target + ': yes!' : 'is not ' + target + '.'}`, at({ vars: { left, right, total, target }, compare: hit ? null : [left, right], sortedRanges: hit ? [[left, left], [right, right]] : undefined }))
    if (hit) {
      log.push(5, `Return (${left}, ${right}). It took ${plural(checks, 'check')}, where brute force can need up to ${(nums.length * (nums.length - 1)) / 2}.`, at({ vars: { left, right, total, target }, sortedRanges: [[left, left], [right, right]] }))
      return log.steps
    }
    const small = total < target
    log.push(6, `Is total < target? ${total} < ${target}: ${small ? `Yes. ${nums[left]} is too small to work with any number still in play (even ${nums[right]}, the biggest), so it can be dropped.` : `No, it is too big. ${nums[right]} is too big to work with any number still in play (even ${nums[left]}, the smallest), so it can be dropped.`}`, at({ vars: { left, right, total, target }, compare: [left, right] }))
    if (small) {
      left++
      log.push(7, `left += 1: move the left pointer to ${left}.`, at({ vars: { left, right, total, target } }))
    } else {
      right--
      log.push(9, `right -= 1: move the right pointer to ${right}.`, at({ vars: { left, right, total, target } }))
    }
  }
  log.push(10, `Return None: no pair adds up to ${target}. It took ${plural(checks, 'check')}, never more than the length of the list.`, { vars: { target } })
  return log.steps
}

// ---------------------------------------------------------- sliding window

const windowCode = [
  'def best_window(nums, k):',
  '    window = sum(nums[:k])',
  '    best = window',
  '    for right in range(k, len(nums)):',
  '        window += nums[right] - nums[right - k]',
  '        best = max(best, window)',
  '    return best',
]

const windowPresets = [
  { label: '3 in a row', nums: [2, 1, 5, 1, 3, 2, 9, 1, 4], k: 3 },
  { label: '2 in a row', nums: [2, 1, 5, 1, 3, 2, 9, 1, 4], k: 2 },
  { label: '4 in a row', nums: [2, 1, 5, 1, 3, 2, 9, 1, 4], k: 4 },
  { label: 'Another list, 2 in a row', nums: [5, 1, 1, 8, 2, 2, 7], k: 2 },
]

function buildWindowSteps(_values, { nums, k }) {
  const log = makeLog(nums)
  let window = nums.slice(0, k).reduce((a, b) => a + b, 0)
  let best = window
  let bestStart = 0
  const at = (start, extra = {}) => ({
    range: [start, start + k - 1],
    sortedRanges: [[bestStart, bestStart + k - 1]],
    ...extra,
  })

  log.push(0, `Find the biggest sum of ${k} numbers in a row. Adding up ${k} numbers for every start would repeat a lot of work, so keep a window and adjust its sum instead.`, { vars: { k } })
  log.push(1, `window = ${nums.slice(0, k).join(' + ')} = ${window}: the sum of the first ${k} numbers.`, at(0, { vars: { k, window }, sortedRanges: undefined }))
  log.push(2, `best = window = ${best}: the best sum seen so far.`, at(0, { vars: { k, window, best } }))
  for (let right = k; right < nums.length; right++) {
    log.push(3, `right = ${right}: the window is about to grow by one on the right.`, at(right - k, { vars: { k, right, window, best }, pointers: [{ pos: right, label: 'right', tone: 'right' }] }))
    const [added, dropped] = [nums[right], nums[right - k]]
    const before = window
    window += added - dropped
    log.push(4, `window += nums[${right}] - nums[${right - k}]: add the new number ${added}, drop the one that left, ${dropped}. ${before} + ${added} − ${dropped} = ${window}. One addition and one subtraction, however big k is.`, at(right - k + 1, { vars: { k, right, window, best }, pointers: [{ pos: right, label: 'right', tone: 'right' }] }))
    const improved = window > best
    if (improved) [best, bestStart] = [window, right - k + 1]
    log.push(5, `best = max(best, window): ${improved ? `${window} beats the old best, so best = ${best}.` : `${window} does not beat ${best}, so best stays ${best}.`}`, at(right - k + 1, { vars: { k, right, window, best }, pointers: [{ pos: right, label: 'right', tone: 'right' }] }))
  }
  log.push(6, `Return ${best}: the best window starts at position ${bestStart} (${nums.slice(bestStart, bestStart + k).join(' + ')}). It took ${nums.length - k} slides, not ${(nums.length - k + 1) * k} additions.`, { vars: { k, best }, sortedRanges: [[bestStart, bestStart + k - 1]] })
  return log.steps
}

// -------------------------------------------------------------- cyclic sort

const cyclicCode = [
  'def missing_number(nums):',
  '    i = 0',
  '    while i < len(nums):',
  '        j = nums[i]',
  '        if j < len(nums) and nums[i] != nums[j]:',
  '            nums[i], nums[j] = nums[j], nums[i]',
  '        else:',
  '            i += 1',
  '    for i in range(len(nums)):',
  '        if nums[i] != i:',
  '            return i',
  '    return len(nums)',
]

const cyclicPresets = [
  { label: '[4, 0, 3, 1]: 2 is missing', nums: [4, 0, 3, 1] },
  { label: '[3, 0, 1]: 2 is missing', nums: [3, 0, 1] },
  { label: '[1, 2, 0]: 3 is missing', nums: [1, 2, 0] },
  { label: '[0, 2, 1, 4]: 3 is missing', nums: [0, 2, 1, 4] },
]

function buildCyclicSteps(_values, { nums }) {
  const log = makeLog(nums)
  const n = nums.length
  const value = (k) => log.items[k].value
  const home = () => {
    const ranges = []
    for (let k = 0; k < n; k++) if (value(k) === k) ranges.push([k, k])
    return ranges
  }
  const ptr = (i) => [{ pos: i, label: 'i', tone: 'left' }]
  let i = 0

  log.push(0, `The list holds the numbers 0 to ${n} with one missing. Idea: put every number at the position with its own number, then the position that holds the wrong number shows what is missing.`, { vars: { n }, sortedRanges: home() })
  log.push(1, `i = 0.`, { vars: { i }, pointers: ptr(i), sortedRanges: home() })
  for (;;) {
    const more = i < n
    log.push(2, `Is i < len(nums)? ${i} < ${n}: ${more ? 'Yes.' : 'No: every number that has a home has been sent there.'}`, { vars: { i }, pointers: more ? ptr(i) : undefined, sortedRanges: home() })
    if (!more) break
    const j = value(i)
    log.push(3, `j = nums[${i}] = ${j}: the number ${j} belongs at position ${j}.`, { vars: { i, j }, pointers: ptr(i), sortedRanges: home() })
    const fits = j < n
    const free = fits && value(i) !== value(j)
    log.push(4, `Is j < len(nums) and nums[i] != nums[j]? ${fits ? `${j} < ${n}: yes` : `${j} < ${n}: no, so ${j} has no position in this list`}${fits ? `, and position ${j} holds ${value(j)}, ${free ? 'not ' + j + ': yes, it is not in place yet' : 'which is already ' + j + ': no'}.` : '.'}`, { vars: { i, j }, pointers: ptr(i), compare: fits ? [i, j] : null, sortedRanges: home() })
    if (free) {
      ;[log.items[i], log.items[j]] = [log.items[j], log.items[i]]
      log.push(5, `Swap nums[${i}] and nums[${j}]: ${j} goes to position ${j}, where it belongs. Position ${i} now holds ${value(i)}, which is looked at next.`, { vars: { i, j }, pointers: ptr(i), compare: [i, j], swapping: true, sortedRanges: home() })
    } else {
      i++
      log.push(7, `Nothing to swap here, so move on: i = ${i}.`, { vars: { i }, pointers: i < n ? ptr(i) : undefined, sortedRanges: home() })
    }
  }
  for (let k = 0; k < n; k++) {
    log.push(8, `Now look for the position that does not hold its own number. k = ${k}.`, { vars: { i: k }, pointers: ptr(k), sortedRanges: home() })
    const wrong = value(k) !== k
    log.push(9, `Is nums[${k}] != ${k}? ${value(k)} ${wrong ? 'is not ' + k + ': yes!' : 'is ' + k + ': no, it is in place.'}`, { vars: { i: k }, pointers: ptr(k), compare: wrong ? [k, k] : null, sortedRanges: home() })
    if (wrong) {
      log.push(10, `Return ${k}: position ${k} holds ${value(k)} instead of ${k}, so ${k} is the missing number. It took one pass of swaps and one pass of checking: O(n), with no extra memory.`, { vars: { i: k }, pointers: ptr(k), sortedRanges: home() })
      return log.steps
    }
  }
  log.push(11, `Every position holds its own number, so the number that is missing is ${n}, the one that has no position. Return ${n}.`, { vars: { n }, sortedRanges: home() })
  return log.steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  brute: { label: 'Brute force: every pair', code: bruteCode, presets: pairPresets, build: buildBruteSteps },
  pointers: { label: 'Two pointers', code: pointersCode, presets: pairPresets, build: buildPointerSteps },
  window: { label: 'Sliding window', code: windowCode, presets: windowPresets, build: buildWindowSteps },
  cyclic: { label: 'Cyclic sort: the missing number', code: cyclicCode, presets: cyclicPresets, build: buildCyclicSteps },
}

function ProblemSolvingTracer() {
  const [kind, setKind] = useState('pointers')
  const { code, presets, build } = KINDS[kind]

  return (
    <>
      <div className="tracer-picker" role="group" aria-label="Technique">
        <span className="tracer-label">Technique:</span>
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

export default ProblemSolvingTracer
