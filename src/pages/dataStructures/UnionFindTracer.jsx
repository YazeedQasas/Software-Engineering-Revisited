import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { applyUnions, copySets, forestSnapshot, groupStates, groupsOf, nodeId } from './ufData.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'

const N = 8
const ROWS = 5

const findLegend = [
  { color: BLUE, text: 'x: where we are' },
  { color: '#fff3bf', text: 'x’s parent' },
  { color: YELLOW, text: 'x’s new parent, after a shortcut' },
  { color: GREEN, text: 'the root' },
]

const unionLegend = [
  ...findLegend,
  { color: '#bcd2f7', text: 'same colour: same group' },
]

const groupText = (parent) => groupsOf(parent).map((members) => `{${members.join(', ')}}`).join(' ')

// Collects the steps. Every step is a snapshot of the forest, so stepping
// backwards just works.
function makeLog(sets, { showSize, groups, legend }) {
  const log = { steps: [], sets }
  log.push = (line, note, { vars = {}, states = {} } = {}) => {
    const { parent, size } = log.sets
    log.steps.push({
      line,
      array: [],
      compare: null,
      tree: forestSnapshot(parent, { size: showSize ? size : null, rows: ROWS }),
      order: [],
      doneLabel: false,
      states: { ...(groups ? groupStates(parent) : {}), ...states },
      legend,
      strips: [
        {
          name: 'parent',
          items: parent.slice(),
          kind: 'seen',
          hint: 'The slots are parent[0], parent[1], … parent[7], from left to right. A slot that holds its own position is a root.',
        },
      ],
      vars,
      note,
    })
  }
  return log
}

// ------------------------------------------------------------------ find

const findCode = [
  'def find(parent, x):',
  '    while parent[x] != x:',
  '        parent[x] = parent[parent[x]]',
  '        x = parent[x]',
  '    return x',
]

// Lines 0 to 4 of find, for both the find tracer and the union one.
function runFind(log, start, vars = {}) {
  const { parent } = log.sets
  let x = start
  let hops = 0
  const say = (line, note, states = {}) => log.push(line, note, { vars: { ...vars, x }, states })
  const here = (extra = {}) => ({ [nodeId(x)]: 'active', ...extra })

  say(0, `find(parent, ${start}) climbs the pointers from ${start} until it reaches a root.`, here())
  for (;;) {
    const p = parent[x]
    const root = p === x
    say(
      1,
      `Is parent[${x}] != ${x}? parent[${x}] is ${p}: ${root ? `${x} points at itself, so it is a root. Stop.` : `${x} points at ${p}, so it is not a root. Keep climbing.`}`,
      root ? { [nodeId(x)]: 'found' } : here({ [nodeId(p)]: 'pending' }),
    )
    if (root) break

    const grand = parent[p]
    parent[x] = grand
    say(
      2,
      grand === p
        ? `Shortcut: parent[${x}] = parent[parent[${x}]] = parent[${p}] = ${grand}. ${p} is already the root, so ${x} already points as high as it can go. Nothing changes.`
        : `Shortcut: parent[${x}] = parent[parent[${x}]] = parent[${p}] = ${grand}. ${x} skips its parent ${p} and points straight at its grandparent ${grand}.`,
      here(grand === p ? {} : { [nodeId(grand)]: 'queued' }),
    )

    hops++
    x = parent[x]
    say(3, `x = parent[x]: move up to ${x}.`, here())
  }
  say(4, `Return ${x}: the root of ${start}'s group. It took ${hops} ${hops === 1 ? 'hop' : 'hops'} up.`, { [nodeId(x)]: 'found' })
  return x
}

// 0 <- 1 <- 2 <- 3 <- 4 is a chain, and 5 is the root of a small group.
const chain = { parent: [0, 0, 1, 2, 3, 5, 5, 5], size: [5, 1, 1, 1, 1, 3, 1, 1] }

const findPresets = [
  { label: 'find(4): a long chain', x: 4 },
  { label: 'find(3): a shorter one', x: 3 },
  { label: 'find(7): right under a root', x: 7 },
  { label: 'find(0): already a root', x: 0 },
]

function buildFindSteps(_values, { x }) {
  const log = makeLog(copySets(chain), { showSize: false, groups: false, legend: findLegend })
  runFind(log, x)
  return log.steps
}

// ----------------------------------------------------------------- union

const unionCode = [
  ...findCode,
  'def union(parent, size, a, b):',
  '    root_a = find(parent, a)',
  '    root_b = find(parent, b)',
  '    if root_a == root_b:',
  '        return False',
  '    if size[root_a] < size[root_b]:',
  '        root_a, root_b = root_b, root_a',
  '    parent[root_b] = root_a',
  '    size[root_a] += size[root_b]',
  '    return True',
]

function runUnion(log, a, b, intro) {
  const { parent, size } = log.sets
  const vars = (extra = {}) => ({ a, b, ...extra })
  const ends = { [nodeId(a)]: 'active', [nodeId(b)]: 'active' }

  log.push(5, `${intro}union(parent, size, ${a}, ${b}) joins the groups of ${a} and ${b}, unless they are the same group already.`, { vars: vars(), states: ends })

  log.push(6, `First, find the root of ${a}'s group.`, { vars: vars(), states: ends })
  let rootA = runFind(log, a, vars())
  log.push(6, `Back in union: root_a = ${rootA}.`, { vars: vars({ root_a: rootA }), states: { ...ends, [nodeId(rootA)]: 'found' } })

  log.push(7, `Then the root of ${b}'s group.`, { vars: vars({ root_a: rootA }), states: { ...ends, [nodeId(rootA)]: 'found' } })
  let rootB = runFind(log, b, vars({ root_a: rootA }))
  const roots = () => ({ [nodeId(rootA)]: 'found', [nodeId(rootB)]: 'found' })
  log.push(7, `Back in union: root_b = ${rootB}.`, { vars: vars({ root_a: rootA, root_b: rootB }), states: roots() })

  const same = rootA === rootB
  log.push(8, `Is root_a == root_b? ${rootA} == ${rootB}: ${same ? 'Yes. They share a root, so they are in the same group already.' : 'No. They are in different groups, so there is something to join.'}`, { vars: vars({ root_a: rootA, root_b: rootB }), states: roots() })
  if (same) {
    log.push(9, `Return False: nothing changed. This is also how you spot a connection that would close a loop.`, { vars: vars({ root_a: rootA, root_b: rootB }), states: roots() })
    return false
  }

  const swap = size[rootA] < size[rootB]
  log.push(10, `Is size[root_a] < size[root_b]? size[${rootA}] is ${size[rootA]} and size[${rootB}] is ${size[rootB]}: ${swap ? `Yes, ${rootA}'s group is the smaller one.` : `No, ${rootA}'s group is the bigger one (or the same size).`}`, { vars: vars({ root_a: rootA, root_b: rootB }), states: roots() })
  if (swap) {
    ;[rootA, rootB] = [rootB, rootA]
    log.push(11, `Swap them, so root_a is always the root of the bigger group: root_a = ${rootA}, root_b = ${rootB}.`, { vars: vars({ root_a: rootA, root_b: rootB }), states: roots() })
  }

  parent[rootB] = rootA
  log.push(12, `Point the smaller group's root at the bigger group's root: parent[${rootB}] = ${rootA}. Keeping the tall trees on top keeps the trees short.`, { vars: vars({ root_a: rootA, root_b: rootB }), states: { [nodeId(rootA)]: 'found', [nodeId(rootB)]: 'queued' } })

  size[rootA] += size[rootB]
  log.push(13, `The joined group has everyone from both: size[${rootA}] = ${size[rootA]}. Only roots keep a size.`, { vars: vars({ root_a: rootA, root_b: rootB }), states: { [nodeId(rootA)]: 'found' } })
  log.push(14, `Return True. The groups are now ${groupText(parent)}.`, { vars: vars({ root_a: rootA, root_b: rootB }), states: { [nodeId(rootA)]: 'found' } })
  return true
}

const S1 = [[0, 1], [2, 3], [4, 5]] // {0, 1} {2, 3} {4, 5} {6} {7}

const unionPresets = [
  { label: 'union(1, 3): two groups of 2', start: S1, calls: [[1, 3]] },
  { label: 'union(6, 4): a lone one joins a group', start: S1, calls: [[6, 4]] },
  { label: 'union(0, 1): already together', start: S1, calls: [[0, 1]] },
  { label: 'Four unions in a row', start: [], calls: [[0, 1], [2, 3], [1, 3], [0, 2]] },
]

function buildUnionSteps(_values, { start, calls }) {
  const log = makeLog(applyUnions(N, start), { showSize: true, groups: true, legend: unionLegend })
  calls.forEach(([a, b], k) => {
    runUnion(log, a, b, calls.length > 1 ? `Call ${k + 1} of ${calls.length}: ` : '')
  })
  return log.steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  find: { label: 'Find (the root of a group)', code: findCode, presets: findPresets, build: buildFindSteps },
  union: { label: 'Union (join two groups)', code: unionCode, presets: unionPresets, build: buildUnionSteps },
}

function UnionFindTracer() {
  const [kind, setKind] = useState('find')
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
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view="tree" />
    </>
  )
}

export default UnionFindTracer
