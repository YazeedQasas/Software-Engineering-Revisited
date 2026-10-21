import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { TABLE, bplusTree, linkKey } from './indexData.js'

const BLUE = '#8aa8ea'
const GREEN = '#86d69f'
const GREY = '#e4e4e2'

const legend = [
  { color: BLUE, text: 'the page being read' },
  { color: GREY, text: 'a page read earlier (numbered in order)' },
  { color: GREEN, text: 'a key that matched' },
  { color: '#2d4f9e', text: 'thick arrow: a link followed' },
]

const show = (node) => `[${node.keys.join(' ')}]`
const rowText = (slot) => `${TABLE[slot].id} ${TABLE[slot].name}`
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const bisectLeft = (keys, key) => keys.filter((k) => k < key).length
const bisectRight = (keys, key) => keys.filter((k) => k <= key).length

// Collects the steps. Every step is a snapshot of the tree with its colours,
// so stepping backwards just works.
function makeLog(bp) {
  const log = { steps: [], states: {}, marks: {}, hot: {}, hotLinks: [], reads: { pages: 0, rows: 0 }, found: [] }
  log.read = (node) => {
    Object.keys(log.states).forEach((id) => {
      if (log.states[id] === 'active') log.states[id] = 'checked'
    })
    log.reads.pages++
    log.marks[node.id] = log.reads.pages
    log.states[node.id] = 'active'
  }
  log.push = (line, note, vars = {}) => {
    const strips = [{ name: 'Reads so far', items: [`pages ${log.reads.pages}`, `table rows ${log.reads.rows}`], kind: 'seen', wide: true }]
    if (log.found.length > 0) strips.push({ name: 'Rows found', items: log.found.slice(), kind: 'out', wide: true })
    log.steps.push({
      line,
      array: [],
      compare: null,
      vars,
      note,
      tree: bp.tree,
      states: { ...log.states },
      marks: { ...log.marks },
      hot: Object.fromEntries(Object.entries(log.hot).map(([id, list]) => [id, list.slice()])),
      hotLinks: log.hotLinks.slice(),
      legend,
      strips,
    })
  }
  return log
}

// ------------------------------------------------------- find_leaf (shared)

const findLeafCode = [
  'def find_leaf(root, key):',
  '    node = root',
  '    while not node.is_leaf:',
  '        i = bisect_right(node.keys, key)',
  '        node = node.children[i]',
  '    return node',
]

// Lines 0 to 5: walk down from the root to the one leaf that could hold key.
function descend(log, bp, key, vars) {
  let node = bp.root
  log.read(node)
  const say = (line, note) => log.push(line, note, { ...vars, node: show(node) })

  say(0, `find_leaf(root, ${key}) walks down from the root to the one leaf that could hold ${key}. Every page it visits is one page read from disk.`)
  say(1, `node = root: read the root page, ${show(node)}. That is page read number 1.`)
  for (;;) {
    const leaf = node.children.length === 0
    say(2, `Is ${show(node)} a leaf? ${leaf ? 'Yes: this is the page that would hold the key.' : 'No: it only holds signposts, so keep going down.'}`)
    if (leaf) break

    const i = bisectRight(node.keys, key)
    const where = i === 0
      ? `${key} is smaller than ${node.keys[0]}, so take the leftmost branch (0).`
      : i === node.keys.length
        ? `${key} is ${node.keys[node.keys.length - 1]} or bigger, so take the rightmost branch (${i}).`
        : `${key} is at least ${node.keys[i - 1]} but less than ${node.keys[i]}, so take branch ${i}.`
    log.push(3, `i = bisect_right(node.keys, key): where does ${key} fall among the signposts ${show(node)}? ${where}`, { ...vars, node: show(node), i })

    const child = node.children[i]
    log.states[node.id] = 'checked'
    log.read(child)
    log.states[node.id] = 'checked'
    node = child
    log.push(4, `node = node.children[${i}]: follow that branch down and read the page at the end of it, ${show(node)}. Page read number ${log.reads.pages}.`, { ...vars, node: show(node), i })
  }
  say(5, `Return this leaf, ${show(node)}.`)
  return node
}

// ----------------------------------------------------------------- lookup

const lookupCode = [
  ...findLeafCode,
  'def lookup(root, table, key):',
  '    leaf = find_leaf(root, key)',
  '    i = bisect_left(leaf.keys, key)',
  '    if i < len(leaf.keys) and leaf.keys[i] == key:',
  '        return table[leaf.slots[i]]',
  '    return None',
]

const lookupPresets = [
  { label: 'id 78', key: 78 },
  { label: 'id 3: the smallest', key: 3 },
  { label: 'id 52', key: 52 },
  { label: 'id 50: not there', key: 50 },
  { label: 'id 99: bigger than all', key: 99 },
]

function buildLookupSteps(_values, { key }) {
  const bp = bplusTree()
  const log = makeLog(bp)
  log.push(6, `Find the employee whose id is ${key}. The index is a B+ tree: every key is in a leaf, next to the slot of its row. The pages above only hold signposts.`, { key })
  log.push(7, `First, find the leaf that would hold ${key}.`, { key })
  const leaf = descend(log, bp, key, { key })
  log.push(7, `Back in lookup: leaf = ${show(leaf)}.`, { key, leaf: show(leaf) })

  const i = bisectLeft(leaf.keys, key)
  log.push(8, `i = bisect_left(leaf.keys, key): the position of ${key} inside the leaf (binary search within one page) = ${i}.`, { key, i })
  const hit = i < leaf.keys.length && leaf.keys[i] === key
  log.push(9, `Is ${i} < ${leaf.keys.length} and leaf.keys[${i}] == ${key}? ${hit ? `Yes: the leaf holds ${key}.` : i < leaf.keys.length ? `No: leaf.keys[${i}] is ${leaf.keys[i]}.` : `No: ${key} is bigger than everything in the leaf.`}`, { key, i })
  if (hit) {
    const slot = leaf.slots[i]
    log.states[leaf.id] = 'found'
    log.hot[leaf.id] = [i]
    log.reads.rows++
    log.found.push(rowText(slot))
    log.push(10, `Return table[leaf.slots[${i}]]: the leaf says slot ${slot}. Read that row from the table: ${TABLE[slot].name}. ${plural(log.reads.pages, 'page read')} for the index and 1 for the row, however big the table is.`, { key, i, slot })
  } else {
    log.states[leaf.id] = 'bad'
    log.push(11, `Return None: ${key} is not in the index. The table was never read at all: ${plural(log.reads.pages, 'page read')}, no row reads.`, { key })
  }
  return log.steps
}

// ------------------------------------------------------------ range_scan

const rangeCode = [
  ...findLeafCode,
  'def range_scan(root, table, low, high):',
  '    leaf = find_leaf(root, low)',
  '    rows = []',
  '    while leaf is not None:',
  '        for key, slot in zip(leaf.keys, leaf.slots):',
  '            if key > high:',
  '                return rows',
  '            if key >= low:',
  '                rows.append(table[slot])',
  '        leaf = leaf.next',
  '    return rows',
]

const rangePresets = [
  { label: 'ids 25 to 66', low: 25, high: 66 },
  { label: 'ids 14 to 17: one leaf', low: 14, high: 17 },
  { label: 'ids 60 to 100: to the end', low: 60, high: 100 },
  { label: 'ids 5 to 7: none', low: 5, high: 7 },
]

function buildRangeSteps(_values, { low, high }) {
  const bp = bplusTree()
  const log = makeLog(bp)
  const vars = { low, high }
  log.push(6, `Find every employee with an id from ${low} to ${high}. Walk down the tree once, to ${low}, then follow the links between the leaves.`, vars)
  log.push(7, `First, find the leaf that would hold ${low}, the low end of the range.`, vars)
  let leaf = descend(log, bp, low, vars)
  log.push(7, `Back in range_scan: leaf = ${show(leaf)}.`, { ...vars, leaf: show(leaf) })
  log.push(8, `rows = []: nothing collected yet.`, vars)

  const finish = (line, note) => log.push(line, note, vars)
  for (;;) {
    log.push(9, `Is leaf not None? ${leaf ? `Yes: the leaf ${show(leaf)} is here to be read.` : 'No: there is no leaf to the right, so we are at the end of the index.'}`, vars)
    if (!leaf) break

    for (let p = 0; p < leaf.keys.length; p++) {
      const [key, slot] = [leaf.keys[p], leaf.slots[p]]
      const v = { ...vars, key, slot }
      log.push(10, `Next entry in this leaf: key = ${key}, slot = ${slot}.`, v)
      const past = key > high
      log.push(11, `Is key > high? ${key} > ${high}: ${past ? 'Yes: we have gone past the end of the range.' : 'No, still inside the range, or below it.'}`, v)
      if (past) {
        log.states[leaf.id] = 'bad'
        finish(12, `Return rows: ${log.found.length === 0 ? 'nothing was in the range' : `${log.found.length} ${log.found.length === 1 ? 'row' : 'rows'}`}. Only the first lookup walked down the tree; the rest of the way followed links. ${plural(log.reads.pages, 'page read')}, ${plural(log.reads.rows, 'row read')}.`)
        return log.steps
      }
      const inside = key >= low
      log.push(13, `Is key >= low? ${key} >= ${low}: ${inside ? 'Yes, it is in the range.' : 'No, it is below the range: skip it.'}`, v)
      if (inside) {
        log.hot[leaf.id] = [...(log.hot[leaf.id] ?? []), p]
        log.states[leaf.id] = 'found'
        log.reads.rows++
        log.found.push(rowText(slot))
        log.push(14, `Add the row in slot ${slot} to the result: ${TABLE[slot].name}. One row read from the table.`, v)
      }
    }

    const next = leaf.next
    log.push(15, next ? `The leaf is finished. leaf = leaf.next: follow the link to the leaf on the right, ${show(next)}, instead of going back up the tree.` : 'The leaf is finished. It has no link to the right: it is the last leaf.', vars)
    if (next) {
      log.hotLinks.push(linkKey(leaf.id, next.id))
      log.read(next)
      if (log.states[leaf.id] !== 'found') log.states[leaf.id] = 'checked'
      log.push(15, `Read the next leaf. Page read number ${log.reads.pages}.`, { ...vars, leaf: show(next) })
    }
    leaf = next
  }
  finish(16, `Return rows: ${log.found.length} ${log.found.length === 1 ? 'row' : 'rows'}, to the end of the index. ${plural(log.reads.pages, 'page read')}, ${plural(log.reads.rows, 'row read')}.`)
  return log.steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  lookup: { label: 'Lookup: one row', code: lookupCode, presets: lookupPresets, build: buildLookupSteps },
  range: { label: 'Range scan: many rows', code: rangeCode, presets: rangePresets, build: buildRangeSteps },
}

function IndexTreeTracer() {
  const [kind, setKind] = useState('lookup')
  const { code, presets, build } = KINDS[kind]

  return (
    <>
      <div className="tracer-picker" role="group" aria-label="Query">
        <span className="tracer-label">Query:</span>
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
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view="bplus" />
    </>
  )
}

export default IndexTreeTracer
