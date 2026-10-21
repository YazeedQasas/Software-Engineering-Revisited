import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { BLOCK, SORTED_TABLE, TABLE, denseIndex, sparseIndex } from './indexData.js'

const BLUE = '#8aa8ea'
const GREEN = '#86d69f'
const GREY = '#e4e4e2'

const scanLegend = [
  { color: BLUE, text: 'the row being read' },
  { color: GREY, text: 'read: not a match' },
  { color: GREEN, text: 'the match' },
]

const denseLegend = [
  { color: BLUE, text: 'the index entry being read' },
  { color: GREEN, text: 'the match' },
  { color: '#dcdcd9', text: 'faded: ruled out' },
]

const sparseLegend = [
  { color: BLUE, text: 'the index entry being read' },
  { color: GREY, text: 'the best block so far' },
  { color: GREEN, text: 'the block chosen, and the row found' },
  { color: '#dcdcd9', text: 'faded: ruled out' },
]

// Collects the steps. Every step is a snapshot of the table and the index with
// their colours, so stepping backwards just works.
function makeLog({ rows, entries = null, blockSize = 0, legend }) {
  const log = { steps: [], rowState: {}, entryState: {}, tags: {}, links: [], reads: { index: 0, table: 0 }, rows, entries }
  log.push = (line, note, vars = {}) => {
    const { index, table } = log.reads
    const items = []
    if (entries) items.push(`index ${index}`)
    items.push(`${entries ? 'table ' : 'rows '}${table}`)
    log.steps.push({
      line,
      array: [],
      compare: null,
      vars,
      note,
      idx: {
        rows: rows.map((row) => ({ ...row, state: log.rowState[row.slot] })),
        entries: entries ? entries.map((entry, i) => ({ ...entry, state: log.entryState[i] })) : null,
        blockSize,
        tags: { ...log.tags },
        links: log.links.slice(),
        indexTitle: blockSize ? 'Sparse index' : 'Index',
      },
      legend,
      strips: [{ name: 'Reads so far', items, kind: 'seen', wide: true }],
    })
  }
  return log
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// ------------------------------------------------------- no index: scan

const scanCode = [
  'def scan(table, target):',
  '    for slot, row in enumerate(table):',
  '        if row.id == target:',
  '            return slot',
  '    return None',
]

const scanPresets = [
  { label: 'id 78: the 9th row', target: 78 },
  { label: 'id 41: the first row', target: 41 },
  { label: 'id 50: not there', target: 50 },
]

function buildScanSteps(_values, { target }) {
  const log = makeLog({ rows: TABLE, legend: scanLegend })
  log.push(0, `Find the employee whose id is ${target}. With no index, the only way is to read the rows one at a time, from the top of the table.`, { target })
  for (const row of TABLE) {
    log.rowState[row.slot] = 'active'
    log.reads.table++
    log.push(1, `slot = ${row.slot}: read the row in slot ${row.slot}. Its id is ${row.id} (${row.name}). That is one row read.`, { target, slot: row.slot })
    const hit = row.id === target
    log.push(2, `Is row.id == target? ${row.id} == ${target}: ${hit ? 'Yes!' : 'No.'}`, { target, slot: row.slot })
    if (hit) {
      log.rowState[row.slot] = 'hit'
      log.push(3, `Return ${row.slot}. It took ${plural(log.reads.table, 'row read')}. In a table of a million rows, it could take a million.`, { target, slot: row.slot })
      return log.steps
    }
    log.rowState[row.slot] = 'read'
  }
  log.push(4, `Every row has been read and none matched, so return None. That was all ${TABLE.length} rows for nothing.`, { target })
  return log.steps
}

// -------------------------------------------- a dense sorted index, searched

const denseCode = [
  'def lookup(index, table, target):',
  '    lo, hi = 0, len(index) - 1',
  '    while lo <= hi:',
  '        mid = (lo + hi) // 2',
  '        key, slot = index[mid]',
  '        if key == target:',
  '            return table[slot]',
  '        if key < target:',
  '            lo = mid + 1',
  '        else:',
  '            hi = mid - 1',
  '    return None',
]

const densePresets = [
  { label: 'id 78', target: 78 },
  { label: 'id 3: the smallest', target: 3 },
  { label: 'id 93: the largest', target: 93 },
  { label: 'id 50: not there', target: 50 },
]

function buildDenseSteps(_values, { target }) {
  const index = denseIndex()
  const n = index.length
  const log = makeLog({
    rows: TABLE,
    entries: index.map(([key, slot]) => ({ key, ptr: `slot ${slot}` })),
    legend: denseLegend,
  })
  let lo = 0
  let hi = n - 1
  let mid = null

  const say = (line, note, extra = {}) => {
    index.forEach((_, i) => {
      log.entryState[i] = i < lo || i > hi ? 'dim' : undefined
    })
    if (mid !== null) log.entryState[mid] = extra.entry ?? 'active'
    const tags = {}
    const tag = (at, name) => {
      if (at >= 0 && at <= n) (tags[at] ??= []).push(name)
    }
    tag(lo, 'lo')
    if (mid !== null) tag(mid, 'mid')
    tag(hi, 'hi')
    log.tags = tags
    const vars = { target, lo, hi }
    if (mid !== null) vars.mid = mid
    if (extra.key !== undefined) vars.key = extra.key
    if (extra.slot !== undefined) vars.slot = extra.slot
    log.push(line, note, vars)
  }

  say(0, `Find the employee whose id is ${target}. index is a second list: every id with the slot of its row, sorted by id. table is the rows on disk.`)
  say(1, `lo, hi = 0, ${n - 1}. Every entry of the index is still possible.`)

  for (;;) {
    const more = lo <= hi
    say(2, `Is lo <= hi? ${lo} <= ${hi}: ${more ? 'Yes, some entries are still possible.' : 'No, there is nothing left to look at.'}`)
    if (!more) break

    mid = (lo + hi) >> 1
    say(3, `mid = (${lo} + ${hi}) // 2 = ${mid}: the entry in the middle of what is left.`)

    const [key, slot] = index[mid]
    log.reads.index++
    say(4, `Read index entry ${mid}: key = ${key}, slot = ${slot}. That is one index read.`, { key, slot })

    if (key === target) {
      say(5, `Is key == target? ${key} == ${target}: Yes!`, { key, slot, entry: 'hit' })
      log.links = [{ from: mid, to: slot }]
      log.rowState[slot] = 'hit'
      log.reads.table++
      say(6, `Return table[${slot}]: jump straight to slot ${slot} and read that one row (${TABLE[slot].name}). Nothing else in the table is touched. ${plural(log.reads.index, 'index read')} and 1 row read in all.`, { key, slot, entry: 'hit' })
      return log.steps
    }
    say(5, `Is key == target? ${key} == ${target}: No.`, { key, slot })

    const less = key < target
    say(7, `Is key < target? ${key} < ${target}: ${less ? `Yes, so ${target} must be further down the list.` : `No, so ${target} must be further up the list.`}`, { key, slot })
    if (less) {
      lo = mid + 1
      say(8, `lo = mid + 1 = ${lo}. Rule out entry ${mid} and everything above it.`, { key, slot, entry: 'dim' })
    } else {
      hi = mid - 1
      say(10, `hi = mid - 1 = ${hi}. Rule out entry ${mid} and everything below it.`, { key, slot, entry: 'dim' })
    }
    mid = null
  }
  say(11, `Return None: ${target} is not in the index. The table was never read at all: ${plural(log.reads.index, 'index read')}, no row reads.`)
  return log.steps
}

// ------------------------------------------------- a sparse index, searched

const sparseCode = [
  'def lookup_sparse(index, blocks, target):',
  '    lo, hi = 0, len(index) - 1',
  '    found = -1',
  '    while lo <= hi:',
  '        mid = (lo + hi) // 2',
  '        if index[mid] <= target:',
  '            found = mid',
  '            lo = mid + 1',
  '        else:',
  '            hi = mid - 1',
  '    if found == -1:',
  '        return None',
  '    for row in blocks[found]:',
  '        if row.id == target:',
  '            return row',
  '    return None',
]

const sparsePresets = [
  { label: 'id 78', target: 78 },
  { label: 'id 17: first in its block', target: 17 },
  { label: 'id 50: not there', target: 50 },
  { label: 'id 1: smaller than all', target: 1 },
]

function buildSparseSteps(_values, { target }) {
  const index = sparseIndex()
  const n = index.length
  const blockOf = (k) => SORTED_TABLE.slice(k * BLOCK, k * BLOCK + BLOCK)
  const log = makeLog({
    rows: SORTED_TABLE,
    entries: index.map((key, k) => ({ key, ptr: `block ${k}` })),
    blockSize: BLOCK,
    legend: sparseLegend,
  })
  let lo = 0
  let hi = n - 1
  let mid = null
  let found = -1

  const say = (line, note, extra = {}) => {
    index.forEach((_, i) => {
      log.entryState[i] = i < lo || i > hi ? 'dim' : undefined
    })
    if (found !== -1) log.entryState[found] = extra.settled ? 'hit' : 'read'
    if (mid !== null) log.entryState[mid] = 'active'
    const tags = {}
    const tag = (at, name) => {
      if (at >= 0 && at <= n) (tags[at] ??= []).push(name)
    }
    if (!extra.settled) {
      tag(lo, 'lo')
      if (mid !== null) tag(mid, 'mid')
      tag(hi, 'hi')
    }
    log.tags = tags
    const vars = { target, lo, hi, found }
    if (mid !== null) vars.mid = mid
    if (extra.id !== undefined) vars['row.id'] = extra.id
    log.push(line, note, vars)
  }

  say(0, `Find the employee whose id is ${target}. The table is kept sorted by id, in blocks of ${BLOCK} rows. The sparse index holds only the first id of each block, so it is ${BLOCK} times smaller than a full index.`)
  say(1, `lo, hi = 0, ${n - 1}: every block is still possible.`)
  say(2, `found = -1: no block chosen yet.`)

  for (;;) {
    const more = lo <= hi
    say(3, `Is lo <= hi? ${lo} <= ${hi}: ${more ? 'Yes.' : 'No, the search of the index is over.'}`)
    if (!more) break
    mid = (lo + hi) >> 1
    say(4, `mid = (${lo} + ${hi}) // 2 = ${mid}.`)
    log.reads.index++
    const small = index[mid] <= target
    say(5, `Is index[${mid}] <= target? ${index[mid]} <= ${target}: ${small ? `Yes: block ${mid} starts at or before ${target}, so it could hold ${target}, or a later block could.` : `No: block ${mid} starts after ${target}, so ${target} cannot be in it or in any block below it.`}`)
    if (small) {
      found = mid
      say(6, `found = ${mid}: the best block so far.`)
      lo = mid + 1
      say(7, `lo = mid + 1 = ${lo}: look for a later block that still starts at or before ${target}.`)
    } else {
      hi = mid - 1
      say(9, `hi = mid - 1 = ${hi}.`)
    }
    mid = null
  }

  say(10, `Is found == -1? found = ${found}: ${found === -1 ? 'Yes, every block starts after the target.' : 'No, a block was picked.'}`, { settled: found !== -1 })
  if (found === -1) {
    say(11, `Return None: ${target} is smaller than the first id of the first block, so it cannot be in the table.`)
    return log.steps
  }

  const start = found * BLOCK
  const block = blockOf(found)
  SORTED_TABLE.forEach((row) => {
    log.rowState[row.slot] = row.slot >= start && row.slot < start + block.length ? undefined : 'dim'
  })
  log.links = [{ from: found, to: start }]
  log.reads.table++
  say(12, `Block ${found} is the only block that can hold ${target}. Read it from disk: one block read, which brings in all ${block.length} of its rows. Now look through them.`, { settled: true })

  for (const row of block) {
    log.rowState[row.slot] = 'active'
    say(12, `Next row of the block: id ${row.id}.`, { settled: true, id: row.id })
    const hit = row.id === target
    say(13, `Is row.id == target? ${row.id} == ${target}: ${hit ? 'Yes!' : 'No.'}`, { settled: true, id: row.id })
    if (hit) {
      log.rowState[row.slot] = 'hit'
      say(14, `Return the row (${row.name}). ${plural(log.reads.index, 'index read')} and 1 block read in all.`, { settled: true, id: row.id })
      return log.steps
    }
    log.rowState[row.slot] = 'read'
  }
  say(15, `The block has no row with id ${target}, so return None. Only one block was read.`, { settled: true })
  return log.steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  scan: { label: 'No index: scan the table', code: scanCode, presets: scanPresets, build: buildScanSteps },
  dense: { label: 'Sorted index: binary search', code: denseCode, presets: densePresets, build: buildDenseSteps },
  sparse: { label: 'Sparse index: find the block', code: sparseCode, presets: sparsePresets, build: buildSparseSteps },
}

function IndexLinearTracer() {
  const [kind, setKind] = useState('dense')
  const { code, presets, build } = KINDS[kind]

  return (
    <>
      <div className="tracer-picker" role="group" aria-label="Way of finding a row">
        <span className="tracer-label">Way of finding a row:</span>
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
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view="index" />
    </>
  )
}

export default IndexLinearTracer
