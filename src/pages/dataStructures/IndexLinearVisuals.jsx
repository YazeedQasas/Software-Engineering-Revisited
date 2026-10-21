import IndexTables from '../../components/IndexTables.jsx'
import { StepDots, useLoop } from './loopHooks.jsx'
import { BLOCK, BUCKETS, SORTED_TABLE, TABLE, denseIndex, hashBuckets, sparseIndex } from './indexData.js'

const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const BLUE = '#8aa8ea'
const GREY = '#e4e4e2'

const DENSE = denseIndex()
const slotsToMap = (slots, state, into = {}) => {
  slots.forEach((slot) => {
    into[slot] = state
  })
  return into
}
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, k) => from + k)

// ------------------------------------------------ with and without an index

const TARGET = 78
const TARGET_SLOT = TABLE.find((row) => row.id === TARGET).slot // 8
const denseEntries = (states = {}) => DENSE.map(([key, slot], i) => ({ key, ptr: `slot ${slot}`, state: states[i] }))

const FIND_FRAMES = [
  {
    caption: `A table of 12 employees, stored in the order they were added. The number on the left is the slot: where the row sits in the file. Find the employee whose id is ${TARGET}.`,
  },
  {
    rows: slotsToMap(range(0, 3), 'read'),
    caption: 'With no index, there is only one way: read the rows from the top, one by one. 41, 17, 93, 8… none of them.',
  },
  {
    rows: slotsToMap(range(0, TARGET_SLOT - 1), 'read', { [TARGET_SLOT]: 'hit' }),
    caption: `…and the ninth row is the one. That was ${TARGET_SLOT + 1} row reads. In a table of a million rows, it could be a million.`,
  },
  {
    entries: denseEntries(),
    caption: 'An index is a second, small list: every id, with the slot of its row, kept sorted by id. It is the index at the back of a book: look the word up, get the page number.',
  },
  {
    entries: denseEntries(),
    tags: { 0: ['lo'], 5: ['mid'], 11: ['hi'] },
    entryStates: { 5: 'active' },
    caption: `Binary search the index. The middle entry is 31, and ${TARGET} is bigger, so everything up to 31 can be ignored.`,
  },
  {
    entries: denseEntries(),
    tags: { 6: ['lo'], 8: ['mid'], 11: ['hi'] },
    entryStates: { 0: 'dim', 1: 'dim', 2: 'dim', 3: 'dim', 4: 'dim', 5: 'dim', 8: 'active' },
    caption: `Now the middle is 60. ${TARGET} is bigger again, so the half up to 60 is ignored too.`,
  },
  {
    entries: denseEntries(),
    tags: { 9: ['lo'], 10: ['mid'], 11: ['hi'] },
    entryStates: { 0: 'dim', 1: 'dim', 2: 'dim', 3: 'dim', 4: 'dim', 5: 'dim', 6: 'dim', 7: 'dim', 8: 'dim', 10: 'active' },
    caption: `The middle is ${TARGET}: found it. Its entry says slot ${TARGET_SLOT}.`,
  },
  {
    entries: denseEntries({ 10: 'hit' }),
    entryStates: { 10: 'hit' },
    rows: { [TARGET_SLOT]: 'hit' },
    links: [{ from: 10, to: TARGET_SLOT }],
    caption: `Jump straight to slot ${TARGET_SLOT}. That is 3 index reads and 1 row read, instead of 9 row reads. For a million rows: about 20 and 1, instead of a million.`,
  },
]

// Finding one row with no index, and then with a sorted index.
function FindVisual() {
  const [tick, setTick] = useLoop(FIND_FRAMES.length, 5000)
  const frame = FIND_FRAMES[tick]
  const entries = frame.entries?.map((entry, i) => ({ ...entry, state: frame.entryStates?.[i] ?? entry.state }))

  return (
    <div className="visual-card">
      <IndexTables
        rows={TABLE.map((row) => ({ ...row, state: frame.rows?.[row.slot] }))}
        entries={entries ?? null}
        tags={frame.tags}
        links={frame.links}
        ariaLabel={`A table of 12 employees${entries ? ' with a sorted index beside it' : ' with no index'}. Looking for id ${TARGET}.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREY }} /> a row read: not a match</li>
        <li><span className="swatch" style={{ background: BLUE }} /> the index entry in the middle</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the match</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={FIND_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ a sparse index

const SPARSE = sparseIndex()
const SPARSE_TARGET = 78
const SPARSE_BLOCK = Math.floor(SORTED_TABLE.findIndex((row) => row.id === SPARSE_TARGET) / BLOCK) // 3
const sparseEntries = (states = {}) => SPARSE.map((key, k) => ({ key, ptr: `block ${k}`, state: states[k] }))
const blockRows = (k) => range(k * BLOCK, k * BLOCK + BLOCK - 1)

const SPARSE_FRAMES = [
  {
    entries: sparseEntries(),
    caption: `The table is now kept sorted by id, in blocks of ${BLOCK} rows (a block is what the disk reads in one go). The sparse index keeps only the first id of each block: ${SPARSE.join(', ')}. It has ${BLOCK} times fewer entries.`,
  },
  {
    entries: sparseEntries({ 0: 'read', 1: 'read', 2: 'read', [SPARSE_BLOCK]: 'hit' }),
    rows: slotsToMap(range(0, SPARSE_BLOCK * BLOCK - 1), 'dim'),
    links: [{ from: SPARSE_BLOCK, to: SPARSE_BLOCK * BLOCK }],
    caption: `Find ${SPARSE_TARGET}: the last block that starts at or before ${SPARSE_TARGET} is the one starting at ${SPARSE[SPARSE_BLOCK]}, block ${SPARSE_BLOCK}. No other block can hold it.`,
  },
  {
    entries: sparseEntries({ [SPARSE_BLOCK]: 'hit' }),
    rows: { ...slotsToMap(range(0, SPARSE_BLOCK * BLOCK - 1), 'dim'), 9: 'read', 10: 'hit' },
    links: [{ from: SPARSE_BLOCK, to: SPARSE_BLOCK * BLOCK }],
    caption: `Read that one block, and look through its rows: ${blockRows(SPARSE_BLOCK).map((s) => SORTED_TABLE[s].id).join(', ')}. There it is: ${SPARSE_TARGET}.`,
  },
  {
    entries: sparseEntries({ [SPARSE_BLOCK]: 'hit' }),
    rows: { ...slotsToMap(range(0, SPARSE_BLOCK * BLOCK - 1), 'dim'), 10: 'hit' },
    caption: 'A sparse index is small, so it is cheap to keep and often fits in memory. The price: the table itself has to be kept in sorted order, and the final step is a look through a whole block.',
  },
]

// A sparse index: one entry per block, not per row.
function SparseVisual() {
  const [tick, setTick] = useLoop(SPARSE_FRAMES.length, 5200)
  const frame = SPARSE_FRAMES[tick]

  return (
    <div className="visual-card">
      <IndexTables
        rows={SORTED_TABLE.map((row) => ({ ...row, state: frame.rows?.[row.slot] }))}
        blockSize={BLOCK}
        entries={frame.entries}
        indexTitle="Sparse index"
        links={frame.links}
        ariaLabel={`A table of 12 employees sorted by id, in blocks of ${BLOCK}, with a sparse index of ${SPARSE.length} entries: ${SPARSE.join(', ')}.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> the block (and row) chosen</li>
        <li><span className="swatch" style={{ background: GREY }} /> an entry or row passed over</li>
        <li>the gaps in the table separate the blocks</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={SPARSE_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ hash against sorted

const BUCKET_LISTS = hashBuckets()
const SORTED_KEYS = DENSE.map(([key]) => key)
const [FROM, TO] = [25, 60]
const inRange = (key) => key >= FROM && key <= TO
const HASH_TARGET = 78

const HASH_FRAMES = [
  {
    chip: (key) => (key === HASH_TARGET ? 'hit' : undefined),
    bucket: HASH_TARGET % BUCKETS,
    caption: `A hash index spreads the ids over buckets with a calculation: ${HASH_TARGET} % ${BUCKETS} = ${HASH_TARGET % BUCKETS}. To find id ${HASH_TARGET}, go to bucket ${HASH_TARGET % BUCKETS} and look there. One calculation, one bucket: very fast.`,
  },
  {
    sorted: (key) => (inRange(key) ? 'range' : undefined),
    caption: `Now ask for every id from ${FROM} to ${TO}. In the sorted index they sit in one unbroken run: find ${FROM}, then read on until ${TO}.`,
  },
  {
    sorted: (key) => (inRange(key) ? 'range' : undefined),
    chip: (key) => (inRange(key) ? 'range' : undefined),
    caption: `In the hash index the same ids are scattered over buckets 0, 1 and 2, and nothing says which ones. To be sure of finding them all, every bucket has to be opened. A hash index cannot do ranges, or sorted order.`,
  },
]

// The same keys in a sorted index and in a hash index.
function HashVisual() {
  const [tick, setTick] = useLoop(HASH_FRAMES.length, 5200)
  const frame = HASH_FRAMES[tick]

  return (
    <div className="visual-card">
      <p className="ix-label">Sorted index</p>
      <div className="ix-chips" role="img" aria-label={`The sorted index: ${SORTED_KEYS.join(', ')}.`}>
        {SORTED_KEYS.map((key) => (
          <span key={key} className={`ix-chip ${frame.sorted?.(key) ?? ''}`}>{key}</span>
        ))}
      </div>
      <p className="ix-label">Hash index (id % {BUCKETS})</p>
      <div className="ix-buckets" role="img" aria-label={`The hash index: ${BUCKET_LISTS.map((list, b) => `bucket ${b} holds ${list.join(', ')}`).join('; ')}.`}>
        {BUCKET_LISTS.map((list, b) => (
          <div key={b} className={`ix-bucket${frame.bucket === b ? ' on' : ''}`}>
            <span className="ix-bucket-name">bucket {b}</span>
            {list.map((key) => (
              <span key={key} className={`ix-chip ${frame.chip?.(key) ?? ''}`}>{key}</span>
            ))}
          </div>
        ))}
      </div>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> the id looked for</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> the ids from {FROM} to {TO}</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={HASH_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ what an insert costs

const NEW_ID = 20
const NEW_ROW = { slot: TABLE.length, id: NEW_ID, name: 'Mia' }
const ROWS_AFTER = [...TABLE, NEW_ROW]
const AT = DENSE.findIndex(([key]) => key > NEW_ID) // where 20 belongs: 4
const AFTER_ENTRIES = [...DENSE.slice(0, AT), [NEW_ID, NEW_ROW.slot], ...DENSE.slice(AT)]
const MOVED = DENSE.length - AT

const INSERT_FRAMES = [
  {
    rows: { [NEW_ROW.slot]: 'hidden' },
    caption: `A new employee arrives: id ${NEW_ID}.`,
  },
  {
    rows: { [NEW_ROW.slot]: 'hit' },
    caption: `The table is easy to change: write the new row at the end, in slot ${NEW_ROW.slot}.`,
  },
  {
    rows: { [NEW_ROW.slot]: 'hit' },
    tags: { [AT]: [`${NEW_ID} goes here`] },
    caption: `But the index has to stay sorted, and ${NEW_ID} belongs between ${DENSE[AT - 1][0]} and ${DENSE[AT][0]}, in the middle of the list.`,
  },
  {
    after: true,
    rows: { [NEW_ROW.slot]: 'hit' },
    caption: `Every entry after it has to move down one place: ${MOVED} of them here. In an index of a million entries, an insert moves about half a million.`,
  },
  {
    after: true,
    rows: {},
    caption: 'That is the weakness of a sorted list: it is quick to read and slow to change. The next page fixes it with a tree.',
  },
]

// Adding a row means moving part of the index.
function InsertVisual() {
  const [tick, setTick] = useLoop(INSERT_FRAMES.length, 5000)
  const frame = INSERT_FRAMES[tick]
  const source = frame.after ? AFTER_ENTRIES : DENSE
  const entries = source.map(([key, slot], i) => {
    const moved = frame.after && i > AT && tick === 3
    const fresh = frame.after && key === NEW_ID && tick === 3
    return { key, ptr: `slot ${slot}`, state: fresh ? 'hit' : moved ? 'range' : undefined }
  })
  const rows = ROWS_AFTER.map((row) => {
    const state = frame.rows[row.slot]
    return { ...row, hidden: state === 'hidden', state: state === 'hidden' ? undefined : state }
  })

  return (
    <div className="visual-card">
      <IndexTables
        rows={rows}
        entries={entries}
        tags={frame.tags}
        ariaLabel={`Adding employee ${NEW_ID} to the table and to the sorted index.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> new</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> moved down to make room</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={INSERT_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ cost

const ROWS = 1000000

// Reads to find one row in a million. The bars are on a log scale, because the
// answers are far apart.
function WorkVisual() {
  const rows = [
    { label: 'No index: read up to 1,000,000 rows', value: ROWS, color: YELLOW, stroke: '#b8912a' },
    { label: 'Sparse index (100 rows a block): about 14 + 1 block', value: 15, color: GREEN, stroke: '#237a35' },
    { label: 'Sorted index: about 20 index reads + 1 row', value: 21, color: GREEN, stroke: '#237a35' },
    { label: 'Hash index: 1 bucket + 1 row (but no ranges)', value: 2, color: GREEN, stroke: '#237a35' },
  ]
  const x0 = 6
  const span = 320
  const at = (v) => x0 + (Math.log10(v) / 6) * span
  const ticks = [1, 100, 10000, 1000000]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 238"
        role="img"
        aria-label="Finding one row in a table of a million rows takes up to a million reads with no index, about 15 with a sparse index, about 21 with a sorted index and about 2 with a hash index. The bars are on a log scale."
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={at(t)} x2={at(t)} y1="4" y2="198" stroke="var(--border)" strokeWidth="1" />
            <text x={at(t)} y="214" fontSize="10" textAnchor={t === 1 ? 'start' : t === ROWS ? 'end' : 'middle'} fill="var(--text)">{t.toLocaleString('en-US')}</text>
          </g>
        ))}
        {rows.map(({ label, value, color, stroke }, i) => {
          const y = 6 + i * 48
          return (
            <g key={label}>
              <text x={x0} y={y + 12} fontSize="10.5" fill="var(--text-h)">{label}</text>
              <rect x={x0} y={y + 18} width={Math.max(at(value) - x0, 4)} height="16" rx="3" fill={color} stroke={stroke} strokeWidth="0.8" />
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>each step to the right is ×100: the bars are on a <em>log scale</em>, so the short bars are really tiny.</li>
      </ul>
    </div>
  )
}

export { FindVisual, SparseVisual, HashVisual, InsertVisual, WorkVisual }
