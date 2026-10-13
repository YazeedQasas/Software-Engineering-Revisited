import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { BIG_TREE, MAX_KEYS, fromSpec, isLeaf, layoutBTree, makeIds, splitNode } from './btree.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREY = '#e4e4e2'
const GREEN = '#86d69f'
const RED = '#f2a5a5'

const show = (node) => `[${node.keys.join(' ')}]`

// Describes where a key falls among a node's keys, e.g. "between 20 and 40".
function gap(keys, i) {
  if (i === 0) return `before ${keys[0]}`
  if (i === keys.length) return `after ${keys[keys.length - 1]}`
  return `between ${keys[i - 1]} and ${keys[i]}`
}

// ---------------------------------------------------------------- search

const searchCode = [
  'def search(node, key):',
  '    i = bisect_left(node.keys, key)',
  '    if i < len(node.keys) and node.keys[i] == key:',
  '        return node, i',
  '    if node.is_leaf:',
  '        return None',
  '    return search(node.children[i], key)',
]

const searchPresets = [
  { label: 'Find 30', key: 30 },
  { label: 'Find 60 (the root)', key: 60 },
  { label: 'Find 78', key: 78 },
  { label: 'Not in the tree (33)', key: 33 },
]

const searchLegend = [
  { color: BLUE, text: 'the node being read now' },
  { color: GREY, text: 'already read (numbered in order)' },
  { color: GREEN, text: 'the key that matched' },
]

// Each node visited is one read from disk. Counting them is the point.
function buildSearchSteps(_values, preset) {
  const key = preset.key
  const root = fromSpec(BIG_TREE, makeIds())
  const tree = layoutBTree(root)
  const steps = []
  const frames = []
  const order = []
  let hot = {}
  let i = null
  let reads = 0

  const push = (line, note) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    const vars = {}
    if (top) vars.node = top.keys.join(' ')
    vars.key = key
    if (i !== null) vars.i = i
    vars.reads = reads
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      frontier: frames.map((node) => node.id),
      current: top ? top.id : null,
      order: order.slice(),
      bad: [],
      fresh: [],
      hot: { ...hot },
      legend: searchLegend,
      carry: null,
      vars,
      note,
    })
  }

  const run = (node) => {
    frames.push(node)
    order.push(node.id)
    reads += 1
    i = node.keys.filter((k) => k < key).length
    push(1, `Read ${show(node)} from disk (read number ${reads}). i = bisect_left(keys, ${key}) = ${i}: ${i === 1 ? 'one key is' : `${i} keys are`} smaller than ${key}.`)

    const found = i < node.keys.length && node.keys[i] === key
    push(2, `Is i < ${node.keys.length} and keys[${i}] == ${key}? ${found ? 'Yes!' : i < node.keys.length ? `keys[${i}] is ${node.keys[i]}, not ${key}.` : `No: i has gone past the last key.`}`)
    if (found) {
      hot = { [node.id]: [i] }
      push(3, `Found ${key} in ${show(node)}. That took ${reads} ${reads === 1 ? 'read' : 'reads'}.`)
      return
    }

    if (isLeaf(node)) {
      push(4, 'Is this node a leaf? Yes: there are no children left to look in.')
      push(5, `${key} is not in the tree. Return None, after ${reads} ${reads === 1 ? 'read' : 'reads'}.`)
      return
    }
    push(4, 'Is this node a leaf? No, so the key could be in a child.')
    push(6, `${key} falls ${gap(node.keys, i)}, so it can only be in child ${i}. Search that child.`)
    run(node.children[i])
  }

  push(0, `Search for ${key}. Reading a node is one trip to disk, so count the nodes visited.`)
  run(root)
  return steps
}

// ---------------------------------------------------------------- insert

const insertCode = [
  'def insert(node, key):',
  '    if node.is_leaf:',
  '        insort(node.keys, key)',
  '    else:',
  '        i = bisect(node.keys, key)',
  '        split = insert(node.children[i], key)',
  '        if split:',
  '            median, right = split',
  '            node.keys.insert(i, median)',
  '            node.children.insert(i + 1, right)',
  '    if len(node.keys) > MAX_KEYS:',
  '        return split_node(node)',
  '    return None',
  '',
  'def add(root, key):',
  '    split = insert(root, key)',
  '    if split:',
  '        median, right = split',
  '        root = Node([median], [root, right])',
  '    return root',
]

// Two starting trees. In the first the root has room; in the second it is full.
const SMALL = [[20, 40], [[5, 10, 15], [25, 30], [45, 50, 55]]]
const FULL_ROOT = [[20, 40, 60], [[5, 10], [25, 30], [45, 50, 55], [65, 70, 75]]]

const insertPresets = [
  { label: 'Room in the leaf (28)', spec: SMALL, key: 28 },
  { label: 'Leaf splits (12)', spec: SMALL, key: 12 },
  { label: 'Split, parent has room (60)', spec: SMALL, key: 60 },
  { label: 'Splits twice: tree grows (78)', spec: FULL_ROOT, key: 78 },
]

const insertLegend = [
  { color: BLUE, text: 'the node being worked on' },
  { color: YELLOW, text: 'a node waiting for the call below it' },
  { color: RED, text: 'too many keys' },
  { color: GREEN, text: 'the new key / the new node' },
]

function buildInsertSteps(_values, preset) {
  const key = preset.key
  const nextId = makeIds()
  let root = fromSpec(preset.spec, nextId)
  const steps = []
  const frames = [] // one per open call: { node, i }
  let bad = []
  let fresh = []
  let carry = null

  const push = (line, note, extra = {}) => {
    const top = frames.length > 0 ? frames[frames.length - 1] : null
    const vars = {}
    if (top) {
      vars.node = top.node.keys.join(' ')
      if (top.i !== undefined) vars.i = top.i
    }
    vars.key = key
    steps.push({
      line,
      array: [],
      compare: null,
      tree: layoutBTree(root),
      frontier: frames.map((frame) => frame.node.id),
      current: top ? top.node.id : null,
      order: [],
      bad: bad.slice(),
      fresh: fresh.slice(),
      hot: {},
      legend: insertLegend,
      carry,
      vars,
      note,
      ...extra,
    })
  }

  // Returns { median, right } if this node had to split, otherwise null.
  const run = (node) => {
    const frame = { node }
    frames.push(frame)
    let split = null

    if (isLeaf(node)) {
      push(1, `${show(node)} is a leaf, so ${key} belongs right here.`)
      node.keys.push(key)
      node.keys.sort((a, b) => a - b)
      push(2, `Slot ${key} in among the keys, keeping them sorted: ${show(node)}.`, { hot: { [node.id]: [node.keys.indexOf(key)] } })
    } else {
      push(1, `${show(node)} is not a leaf, so ${key} belongs somewhere below it.`)
      frame.i = node.keys.filter((k) => k < key).length
      push(4, `i = bisect(keys, ${key}) = ${frame.i}: ${key} falls ${gap(node.keys, frame.i)}, so it goes under child ${frame.i}.`)
      push(5, `Insert into child ${frame.i}, and find out whether that child had to split.`)
      split = run(node.children[frame.i])
      push(5, split
        ? `Back in ${show(node)}. The child split, so it handed up the middle key ${split.median} and a new node ${show(split.right)}.`
        : `Back in ${show(node)}. The child did not split.`)
      push(6, `Did the child split? ${split ? 'Yes, so this node has to take in the middle key and the new node.' : 'No, so there is nothing more to do here.'}`)
      if (split) {
        push(7, `Unpack it: median = ${split.median}, right = the new node ${show(split.right)}.`)
        node.keys.splice(frame.i, 0, split.median)
        push(8, `Add ${split.median} to this node’s keys, at position ${frame.i}: ${show(node)}.`, { hot: { [node.id]: [frame.i] } })
        node.children.splice(frame.i + 1, 0, split.right)
        carry = null
        fresh = [split.right.id]
        push(9, `Hang the new node just to the right of the child that split. The tree is joined up again.`)
        fresh = []
      }
    }

    const over = node.keys.length > MAX_KEYS
    bad = over ? [node.id] : []
    push(10, `Are there more than ${MAX_KEYS} keys? ${show(node)} has ${node.keys.length}: ${over ? 'yes, one too many, so it must split.' : 'no, it still fits.'}`)

    if (over) {
      const result = splitNode(node, nextId)
      bad = []
      carry = `the middle key ${result.median} and a new node ${show(result.right)}`
      push(11, `Split: the middle key, ${result.median}, moves up. The keys before it stay here as ${show(node)}, and the keys after it go into a new node ${show(result.right)}. Return both to the caller.`)
      frames.pop()
      return result
    }

    push(12, 'It fits, so no split. Return None.')
    frames.pop()
    return null
  }

  push(14, `Insert ${key}. Put it in a leaf, and split any node that ends up with too many keys.`)
  push(15, 'Call insert on the root. It works its way down to a leaf and splits on the way back up.')
  const split = run(root)
  push(16, `Did the root itself split? ${split ? 'Yes: the tree has no room at the top, so it must grow.' : 'No, so the tree stays the same height.'}`)
  if (split) {
    push(17, `Unpack it: median = ${split.median}, right = the new node ${show(split.right)}.`)
    root = { id: nextId(), keys: [split.median], children: [root, split.right] }
    carry = null
    fresh = [root.id]
    push(18, `Make a brand new root holding just ${split.median}, with the old root and the new node as its two children. The tree grows one level taller, at the top, so every leaf stays on the same level.`)
    fresh = []
  }
  push(19, `Return the root. ${key} is in the tree, and every node has between 1 and ${MAX_KEYS} keys.`)
  return steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  search: { label: 'Search', code: searchCode, presets: searchPresets, build: buildSearchSteps },
  insert: { label: 'Insert', code: insertCode, presets: insertPresets, build: buildInsertSteps },
}

function BTreeTracer() {
  const [kind, setKind] = useState('search')
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
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view="btree" />
    </>
  )
}

export default BTreeTracer
