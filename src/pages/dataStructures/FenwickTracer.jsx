import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { BASE, bitLength, coverOf, coverText, fenTree, lowbit, sumTo, updatePath } from './fenData.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const RED = '#f2a5a5'
const GREY = '#e4e4e2'

const sign = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`)

// Collects the steps. Every step is a snapshot of the numbers, the stored sums
// and the colours at that moment, so stepping backwards just works.
function makeLog(values, tree, legend) {
  const log = { steps: [], values, tree, states: {}, cells: {}, legend }
  log.push = (line, note, extra = {}) => {
    log.steps.push({
      line,
      array: [],
      compare: null,
      vars: extra.vars ?? {},
      note,
      fen: {
        n: log.values.length,
        values: log.values.slice(),
        tree: log.tree.slice(),
        states: { ...log.states },
        cells: { ...log.cells },
      },
      bits: extra.bits ?? null,
      bitsWidth: bitLength(2 * log.values.length),
      strips: extra.strips,
      legend: log.legend,
    })
  }
  return log
}

const readLegend = [
  { color: BLUE, text: 'the box being read' },
  { color: GREEN, text: 'added to the total' },
  { color: YELLOW, text: 'the next box' },
]

// ------------------------------------------------------ prefix_sum (the walk)

const prefixCode = [
  'def prefix_sum(tree, i):',
  '    total = 0',
  '    while i > 0:',
  '        total += tree[i]',
  '        i -= i & -i',
  '    return total',
]

// Lines 1 to 5 of prefix_sum, for both the prefix tracer and the range one.
// `tone` is how the boxes it reads are coloured: 'found' (added) or 'bad'
// (to be taken away again, in a range sum).
function walkPrefix(log, upto, tone, vars = {}) {
  const { tree, states, cells } = log
  const added = []
  let i = upto
  let total = 0
  const say = (line, note, extra = {}) =>
    log.push(line, note, {
      vars: { ...vars, i, total },
      strips: [{ name: 'Sums read so far', items: added.slice(), kind: tone === 'found' ? 'out' : 'seen' }],
      ...extra,
    })

  say(1, `total starts at 0.`)
  for (;;) {
    const more = i > 0
    if (more) states[i] = 'active'
    say(2, `Is i > 0? ${i} > 0: ${more ? 'Yes, there are still positions to add up.' : 'No, nothing is left. Stop.'}`, { bits: [{ label: 'i', value: i }] })
    if (!more) break

    const before = total
    const shared = tone === 'bad' && states[i] === 'found'
    total += tree[i]
    added.push(tree[i])
    const { from, to } = coverOf(i)
    for (let p = from; p <= to; p++) cells[p] = tone
    states[i] = shared ? 'checked' : tone
    say(
      3,
      `Box ${i} adds up ${coverText(i)}. Add its stored sum: total = ${before} + ${tree[i]} = ${total}.${shared ? ` Box ${i} was also added by the first call, so it cancels out.` : ''}`,
    )

    const low = lowbit(i)
    const next = i - low
    if (next > 0) states[next] = 'queued'
    i = next
    say(
      4,
      `i & -i is the lowest 1 of ${i + low} in binary, which is worth ${low}. Remove it: i = ${i + low} − ${low} = ${i}. ${i > 0 ? `Box ${i} is next.` : 'No positions are left.'}`,
      { bits: [{ label: 'old i', value: i + low }, { label: 'i & -i', value: low }, { label: 'new i', value: i }] },
    )
  }
  say(5, `Return ${total}.`)
  return { total, boxes: added.length }
}

const prefixPresets = [
  { label: 'First 7 numbers', upto: 7 },
  { label: 'First 8 numbers', upto: 8 },
  { label: 'First 5 numbers', upto: 5 },
  { label: 'First 3 numbers', upto: 3 },
]

function buildPrefixSteps(_values, { upto }) {
  const log = makeLog(BASE.slice(), fenTree(BASE), readLegend)
  log.push(0, `Add up the first ${upto} numbers. Start at box ${upto}, the box that ends exactly at position ${upto}, and read boxes while moving left.`, { vars: { i: upto }, bits: [{ label: 'i', value: upto }] })
  const { total, boxes } = walkPrefix(log, upto, 'found')
  const expected = sumTo(BASE, upto)
  log.push(5, `The answer is ${total}${total === expected ? `, the same as adding the first ${upto} numbers one by one` : ''}. It read ${boxes} ${boxes === 1 ? 'box' : 'boxes'}, not ${upto} separate ${upto === 1 ? 'number' : 'numbers'}.`, { vars: { total } })
  return log.steps
}

// ---------------------------------------------------------------- update

const updateCode = [
  'def update(tree, i, delta):',
  '    n = len(tree) - 1',
  '    while i <= n:',
  '        tree[i] += delta',
  '        i += i & -i',
]

const updatePresets = [
  { label: 'Add 5 to position 3', i: 3, delta: 5 },
  { label: 'Add 1 to position 1', i: 1, delta: 1 },
  { label: 'Subtract 3 from position 6', i: 6, delta: -3 },
  { label: 'Add 4 to position 8', i: 8, delta: 4 },
]

function buildUpdateSteps(_values, preset) {
  const { i: pos, delta } = preset
  const n = BASE.length
  const log = makeLog(BASE.slice(), fenTree(BASE), [
    { color: RED, text: 'out of date' },
    { color: BLUE, text: 'the box being fixed' },
    { color: GREEN, text: 'new sum stored' },
  ])
  const path = updatePath(pos, n)
  path.forEach((b) => {
    log.states[b] = 'bad'
  })

  let i = pos
  const vars = () => ({ i, delta, n })
  log.push(0, `${delta < 0 ? `Subtract ${-delta} from` : `Add ${delta} to`} position ${pos}. Every box that adds up position ${pos} is now wrong: ${path.length === 1 ? `only box ${path[0]}` : `boxes ${path.slice(0, -1).join(', ')} and ${path[path.length - 1]}`} (red).`, { vars: vars(), bits: [{ label: 'i', value: i }] })
  log.push(1, `The tree has n = ${n} boxes, numbered 1 to ${n}. Box 0 does not exist.`, { vars: vars() })

  for (;;) {
    const more = i <= n
    if (more) log.states[i] = 'active'
    log.push(2, `Is i <= n? ${i} <= ${n}: ${more ? `Yes, box ${i} exists.` : `No, there is no box ${i}. Stop.`}`, { vars: vars(), bits: [{ label: 'i', value: i }] })
    if (!more) break

    const old = log.tree[i]
    log.tree[i] += delta
    if (i === pos) {
      log.values[pos - 1] += delta
      log.cells[pos] = 'found'
    }
    log.states[i] = 'found'
    log.push(3, `Box ${i} adds up ${coverText(i)}, which includes position ${pos}. tree[${i}] = ${old} ${sign(delta)} = ${log.tree[i]}.`, { vars: vars() })

    const low = lowbit(i)
    i += low
    log.push(
      4,
      `i & -i is the lowest 1 of ${i - low} in binary, worth ${low}. Add it: i = ${i - low} + ${low} = ${i}. ${i <= n ? `Box ${i} is next: it also adds up position ${pos}.` : `That is past the last box (${n}), so we are done.`}`,
      { vars: vars(), bits: [{ label: 'old i', value: i - low }, { label: 'i & -i', value: low }, { label: 'new i', value: i }] },
    )
  }
  log.push(2, `Done. ${path.length} of the ${n} boxes were rewritten. The rest were never touched, and the array below the boxes is only there for the picture: a Fenwick tree does not keep it.`, { vars: vars() })
  return log.steps
}

// ----------------------------------------------------------- range_sum

const rangeCode = [
  ...prefixCode,
  'def range_sum(tree, left, right):',
  '    upto_right = prefix_sum(tree, right)',
  '    upto_before = prefix_sum(tree, left - 1)',
  '    return upto_right - upto_before',
]

const rangePresets = [
  { label: 'Positions 3 to 6', left: 3, right: 6 },
  { label: 'Positions 5 to 7', left: 5, right: 7 },
  { label: 'Positions 1 to 4', left: 1, right: 4 },
  { label: 'Just position 2', left: 2, right: 2 },
]

function buildRangeSteps(_values, { left, right }) {
  const log = makeLog(BASE.slice(), fenTree(BASE), [
    { color: BLUE, text: 'the box being read' },
    { color: GREEN, text: 'added (the first call)' },
    { color: RED, text: 'taken away (the second call)' },
    { color: GREY, text: 'added, then taken away: cancels out' },
  ])
  const vars = (extra = {}) => ({ left, right, ...extra })
  log.push(6, `Add up positions ${left} to ${right}. The tree only knows sums that start at position 1, so ask two questions and subtract: the first ${right} numbers, minus the first ${left - 1}.`, { vars: vars() })

  log.push(7, `First call: prefix_sum(tree, ${right}) is the sum of the first ${right} numbers.`, { vars: vars() })
  const first = walkPrefix(log, right, 'found', vars())
  log.push(7, `Back in range_sum: upto_right = ${first.total}. That includes ${left > 1 ? `${left - 1} ${left === 2 ? 'position' : 'positions'} we do not want` : 'every position we want'}.`, { vars: vars({ upto_right: first.total }) })

  log.push(8, `Second call: prefix_sum(tree, ${left - 1}) is the sum of the first ${left - 1} ${left - 1 === 1 ? 'number' : 'numbers'}${left === 1 ? ', which is nothing at all' : ''}.`, { vars: vars({ upto_right: first.total }) })
  const second = walkPrefix(log, left - 1, 'bad', vars({ upto_right: first.total }))
  log.push(8, `Back in range_sum: upto_before = ${second.total}.`, { vars: vars({ upto_right: first.total, upto_before: second.total }) })

  const answer = first.total - second.total
  const expected = sumTo(BASE, right) - sumTo(BASE, left - 1)
  log.push(9, `Return ${first.total} − ${second.total} = ${answer}${answer === expected ? `, the same as adding positions ${left} to ${right} one by one` : ''}. Two short walks, however long the range is.`, { vars: vars({ upto_right: first.total, upto_before: second.total }) })
  return log.steps
}

// ----------------------------------------------------------------- build

const buildCode = [
  'def build(nums):',
  '    n = len(nums)',
  '    tree = [0] * (n + 1)',
  '    for i in range(1, n + 1):',
  '        tree[i] += nums[i - 1]',
  '        j = i + (i & -i)',
  '        if j <= n:',
  '            tree[j] += tree[i]',
  '    return tree',
]

const buildPresets = [
  { label: 'Eight numbers', values: BASE },
  { label: 'Six numbers (not a power of 2)', values: [4, 1, 6, 2, 8, 3] },
]

function buildBuildSteps(values) {
  const n = values.length
  const log = makeLog(values.slice(), Array(n + 1).fill(0), [
    { color: BLUE, text: 'the box being finished' },
    { color: YELLOW, text: 'the box above it' },
    { color: GREEN, text: 'box that just received a sum' },
    { color: GREY, text: 'finished' },
  ])
  const vars = (extra = {}) => ({ n, ...extra })

  log.push(0, `Build a Fenwick tree over ${n} numbers. Every box ends up holding the sum of the positions under it. The trick: each finished box hands its sum to the one box above it, so nothing is ever added up twice.`, { vars: vars() })
  log.push(1, `n = ${n}.`, { vars: vars() })
  log.push(2, `Make ${n + 1} slots, all 0. Slot 0 is never used; boxes are numbered 1 to ${n}. Every box starts empty.`, { vars: vars() })

  for (let i = 1; i <= n; i++) {
    log.states[i] = 'active'
    log.cells[i] = 'active'
    log.push(3, `i = ${i}: time to finish box ${i}.`, { vars: vars({ i }) })

    const carried = log.tree[i]
    log.tree[i] += values[i - 1]
    log.push(
      4,
      carried > 0
        ? `Box ${i} already holds ${carried}, handed up by the boxes under it. Add position ${i}'s own number: ${carried} + ${values[i - 1]} = ${log.tree[i]}. Box ${i} is complete: it adds up ${coverText(i)}.`
        : `Nothing has been handed up to box ${i}. It just takes position ${i}'s own number: tree[${i}] = ${values[i - 1]}. Box ${i} is complete: it adds up ${coverText(i)}.`,
      { vars: vars({ i }) },
    )

    const low = lowbit(i)
    const j = i + low
    if (j <= n) log.states[j] = 'queued'
    log.push(5, `j = ${i} + ${low} = ${j}. That is the next box to the right that also adds up position ${i}.`, {
      vars: vars({ i, j }),
      bits: [{ label: 'i', value: i }, { label: 'i & -i', value: low }, { label: 'j', value: j }],
    })

    if (j <= n) {
      log.push(6, `Is j <= n? ${j} <= ${n}: Yes, box ${j} exists.`, { vars: vars({ i, j }) })
      const old = log.tree[j]
      log.tree[j] += log.tree[i]
      log.states[j] = 'found'
      log.push(7, `Hand box ${i}'s finished sum up: tree[${j}] = ${old} + ${log.tree[i]} = ${log.tree[j]}. Box ${j} will add its own number when its turn comes.`, { vars: vars({ i, j }) })
    } else {
      log.push(6, `Is j <= n? ${j} <= ${n}: No. There is no box ${j}, so box ${i} has nothing above it to hand a sum to.`, { vars: vars({ i, j }) })
    }
    log.states[i] = 'checked'
    log.cells[i] = 'checked'
    if (j <= n) log.states[j] = 'plain'
  }
  Object.keys(log.states).forEach((key) => {
    log.states[key] = 'plain'
  })
  log.push(8, `Done: every box holds the sum of the positions under it. Each number was added a few times at most, so building took about n steps, not n × log n.`, { vars: vars() })
  return log.steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  query: { label: 'Sum of the first i (prefix_sum)', code: prefixCode, presets: prefixPresets, build: buildPrefixSteps },
  update: { label: 'Update (add to a number)', code: updateCode, presets: updatePresets, build: buildUpdateSteps },
  range: { label: 'Sum of a range (range_sum)', code: rangeCode, presets: rangePresets, build: buildRangeSteps },
  build: { label: 'Build', code: buildCode, presets: buildPresets, build: buildBuildSteps },
}

function FenwickTracer() {
  const [kind, setKind] = useState('query')
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
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view="fenwick" />
    </>
  )
}

export default FenwickTracer
