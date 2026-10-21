import BTreeView from '../../components/BTreeView.jsx'
import { StepDots, useLoop } from './loopHooks.jsx'
import { TABLE, bplusTree, linkKey } from './indexData.js'

const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const BLUE = '#8aa8ea'
const GREY = '#e4e4e2'
const RED = '#f2a5a5'

const nodeWith = (bp, keys) => bp.byId && Object.values(bp.byId).find((node) => node.keys.join() === keys.join())
const idOf = (bp, keys) => nodeWith(bp, keys).id

// The table's twelve rows as a row of cells; `hot` slots are green.
function TableCells({ hot = [] }) {
  return (
    <div className="cell-row" role="img" aria-label={`The table: ${TABLE.map((row) => `slot ${row.slot} holds id ${row.id}`).join(', ')}.`}>
      <code className="cell-name">table</code>
      {TABLE.map((row) => (
        <span key={row.slot} style={hot.includes(row.slot) ? { background: GREEN } : undefined}>
          {row.id}
          <i>{row.slot}</i>
        </span>
      ))}
    </div>
  )
}

// ------------------------------------------------ one lookup, top to bottom

const LOOKUP = bplusTree()
const ROOT = idOf(LOOKUP, [41])
const MIDDLE = idOf(LOOKUP, [60, 78])
const LEAF = idOf(LOOKUP, [78, 93])
const TARGET = 78
const TARGET_SLOT = TABLE.find((row) => row.id === TARGET).slot

const LOOKUP_FRAMES = [
  {
    caption: 'The same twelve employees, but now the index is a tree. Each box is one page of the index on disk. The small numbers under the keys in the bottom row are the slots of the rows in the table.',
  },
  {
    states: { [ROOT]: 'active' },
    marks: { [ROOT]: 1 },
    caption: `Find id ${TARGET}. Read the root page: it only holds signposts. ${TARGET} is 41 or more, so go down the right-hand branch.`,
  },
  {
    states: { [ROOT]: 'checked', [MIDDLE]: 'active' },
    marks: { [ROOT]: 1, [MIDDLE]: 2 },
    caption: `Second page: the signposts are 60 and ${TARGET}. ${TARGET} is at least ${TARGET}, so take the branch to the right of it.`,
  },
  {
    states: { [ROOT]: 'checked', [MIDDLE]: 'checked', [LEAF]: 'found' },
    marks: { [ROOT]: 1, [MIDDLE]: 2, [LEAF]: 3 },
    hot: { [LEAF]: [0] },
    caption: `Third page, a leaf: here is ${TARGET}, and its slot is ${TARGET_SLOT}. Three page reads to find where the row lives.`,
  },
  {
    states: { [ROOT]: 'checked', [MIDDLE]: 'checked', [LEAF]: 'found' },
    marks: { [ROOT]: 1, [MIDDLE]: 2, [LEAF]: 3 },
    hot: { [LEAF]: [0] },
    table: [TARGET_SLOT],
    caption: `One more read gets the row from slot ${TARGET_SLOT}: Ivy. Four reads in all. With 100 keys in every page, even a table of a million rows needs only three levels.`,
  },
]

// A B+ tree lookup, one page at a time.
function LookupVisual() {
  const [tick, setTick] = useLoop(LOOKUP_FRAMES.length, 5200)
  const frame = LOOKUP_FRAMES[tick]

  return (
    <div className="visual-card">
      <BTreeView
        className="trie-view"
        tree={LOOKUP.tree}
        states={frame.states}
        marks={frame.marks}
        hot={frame.hot}
        ariaLabel={`A B+ tree of twelve ids in three levels. Looking for ${TARGET} reads the root, then the page holding 60 and 78, then the leaf holding 78 and 93, and finds slot ${TARGET_SLOT}.`}
      />
      <TableCells hot={frame.table} />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREY }} /> pages read (numbered in order)</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the key found</li>
        <li>dashed arrows join each leaf to the next one</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={LOOKUP_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ a range, along the leaves

const [LOW, HIGH] = [25, 66]
const PATH = [ROOT, idOf(LOOKUP, [14, 25]), idOf(LOOKUP, [25, 31])]
const L1 = idOf(LOOKUP, [25, 31])
const L2 = idOf(LOOKUP, [41, 52])
const L3 = idOf(LOOKUP, [60, 66])
const L4 = idOf(LOOKUP, [78, 93])
const passed = (ids, state = 'checked') => Object.fromEntries(ids.map((id) => [id, state]))

const RANGE_FRAMES = [
  {
    caption: `Now every employee with an id from ${LOW} to ${HIGH}. Walk down the tree once, to ${LOW}.`,
  },
  {
    states: { ...passed(PATH.slice(0, 2)), [L1]: 'active' },
    marks: { [PATH[0]]: 1, [PATH[1]]: 2, [L1]: 3 },
    caption: `Three page reads take us to the leaf that holds ${LOW}. From here on, the tree above is not needed again.`,
  },
  {
    states: { ...passed(PATH.slice(0, 2)), [L1]: 'found' },
    marks: { [PATH[0]]: 1, [PATH[1]]: 2, [L1]: 3 },
    hot: { [L1]: [0, 1] },
    caption: '25 and 31 are in the range: take them.',
  },
  {
    states: { ...passed(PATH.slice(0, 2)), [L1]: 'found', [L2]: 'found' },
    marks: { [PATH[0]]: 1, [PATH[1]]: 2, [L1]: 3, [L2]: 4 },
    hot: { [L1]: [0, 1], [L2]: [0, 1] },
    links: [linkKey(L1, L2)],
    caption: 'Follow the link to the next leaf, with no climbing back up: 41 and 52 are in the range too.',
  },
  {
    states: { ...passed(PATH.slice(0, 2)), [L1]: 'found', [L2]: 'found', [L3]: 'found' },
    marks: { [PATH[0]]: 1, [PATH[1]]: 2, [L1]: 3, [L2]: 4, [L3]: 5 },
    hot: { [L1]: [0, 1], [L2]: [0, 1], [L3]: [0, 1] },
    links: [linkKey(L1, L2), linkKey(L2, L3)],
    caption: `One more link: 60 and 66 are in the range. 66 is the last one allowed.`,
  },
  {
    states: { ...passed(PATH.slice(0, 2)), [L1]: 'found', [L2]: 'found', [L3]: 'found', [L4]: 'bad' },
    marks: { [PATH[0]]: 1, [PATH[1]]: 2, [L1]: 3, [L2]: 4, [L3]: 5, [L4]: 6 },
    hot: { [L1]: [0, 1], [L2]: [0, 1], [L3]: [0, 1] },
    links: [linkKey(L1, L2), linkKey(L2, L3), linkKey(L3, L4)],
    caption: `The next leaf starts with 78, which is past ${HIGH}: stop. Six keys found, in sorted order, with one walk down and three links. A hash index cannot do this at all.`,
  },
]

// A range query: walk down once, then follow the links between the leaves.
function RangeVisual() {
  const [tick, setTick] = useLoop(RANGE_FRAMES.length, 5200)
  const frame = RANGE_FRAMES[tick]

  return (
    <div className="visual-card">
      <BTreeView
        className="trie-view"
        tree={LOOKUP.tree}
        states={frame.states}
        marks={frame.marks}
        hot={frame.hot}
        hotLinks={frame.links}
        ariaLabel={`Reading every id from ${LOW} to ${HIGH} from a B+ tree: walk down to the leaf holding ${LOW}, then follow the links between leaves until an id past ${HIGH}.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> a leaf with keys in the range</li>
        <li><span className="swatch" style={{ background: RED }} /> the leaf where the range ends</li>
        <li>thick arrow: a link followed</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={RANGE_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ a page that splits

// Three keys to a page, so the pictures stay readable. Real pages hold hundreds.
const SPLIT_BEFORE = [[41, 66], [[3, 8, 14], [41, 52, 60], [66, 78, 93]]]
const SPLIT_FULL = [[41, 66], [[3, 8, 14], [41, 52, 55, 60], [66, 78, 93]]]
const SPLIT_AFTER = [[41, 55, 66], [[3, 8, 14], [41, 52], [55, 60], [66, 78, 93]]]
const treeOf = (spec) => bplusTree(spec, { withSlots: false, height: 130 })
const [BEFORE, FULL, AFTER] = [treeOf(SPLIT_BEFORE), treeOf(SPLIT_FULL), treeOf(SPLIT_AFTER)]

const SPLIT_FRAMES = [
  {
    bp: BEFORE,
    caption: 'A small tree: a page holds at most 3 keys. Insert the id 55.',
  },
  {
    bp: BEFORE,
    states: { [idOf(BEFORE, [41, 52, 60])]: 'active' },
    caption: 'Walk down as for a lookup. 55 belongs in the leaf [41 52 60], between 52 and 60.',
  },
  {
    bp: FULL,
    states: { [idOf(FULL, [41, 52, 55, 60])]: 'bad' },
    caption: 'Put 55 in: the leaf now has 4 keys, but a page holds at most 3. It has overflowed.',
  },
  {
    bp: AFTER,
    states: { [idOf(AFTER, [41, 52])]: 'found', [idOf(AFTER, [55, 60])]: 'found', [idOf(AFTER, [41, 55, 66])]: 'active' },
    caption: 'Split it in two: [41 52] stays and [55 60] is a new page. Copy the first key of the new page, 55, up into the parent as a signpost, and link the new leaf in.',
  },
  {
    bp: AFTER,
    caption: 'If the parent overflows, it splits the same way, and so on up. If the root splits, the tree grows one level taller at the top, so every leaf stays at the same depth: the tree is always balanced.',
  },
]

// Inserting into a full leaf.
function SplitVisual() {
  const [tick, setTick] = useLoop(SPLIT_FRAMES.length, 5200)
  const frame = SPLIT_FRAMES[tick]

  return (
    <div className="visual-card">
      <BTreeView
        className="trie-view"
        tree={frame.bp.tree}
        states={frame.states}
        ariaLabel="Inserting the id 55 into a B+ tree whose leaf [41 52 60] is full: the leaf splits into [41 52] and [55 60], and 55 is copied up into the parent."
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: BLUE }} /> the page being worked on</li>
        <li><span className="swatch" style={{ background: RED }} /> overflowing</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the two pages after the split</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={SPLIT_FRAMES.length} tick={tick} onPick={setTick} />
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
    { label: 'Sorted list index: about 20 reads, spread over the disk', value: 20, color: GREEN, stroke: '#237a35' },
    { label: 'B+ tree, 100 keys a page: 3 page reads', value: 3, color: GREEN, stroke: '#237a35' },
    { label: 'Same, with the top pages kept in memory: about 1 disk read', value: 1, color: GREEN, stroke: '#237a35' },
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
        aria-label="Finding one row in a table of a million rows takes up to a million reads with no index, about 20 with a sorted list index, 3 page reads with a B+ tree of 100 keys a page, and about 1 disk read once the top pages are kept in memory. The bars are on a log scale."
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

export { LookupVisual, RangeVisual, SplitVisual, WorkVisual }
