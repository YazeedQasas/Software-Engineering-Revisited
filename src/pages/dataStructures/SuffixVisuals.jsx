import SuffixRows from '../../components/SuffixRows.jsx'
import TreeView from '../../components/TreeView.jsx'
import { StepDots, useLoop } from './loopHooks.jsx'
import { END, WORD, lcpArray, leafStarts, nodesOf, squash, suffixArray, suffixTrie, treeSnapshot } from './suffixData.js'

const YELLOW = '#ffe27a'
const GREEN = '#86d69f'

const SA = suffixArray(WORD)
const LCP = lcpArray(WORD, SA)
const quote = (text) => `"${text}"`

// ------------------------------------------------ cutting, sliding, sorting

const NATURAL = WORD.split('').map((_, i) => i)
const PATTERN = 'ana'

const CUT_FRAMES = [
  {
    hidden: true,
    mode: 'stair',
    order: NATURAL,
    caption: 'A suffix is the end of a word: whatever is left after cutting some letters off the front. Here is the word banana, with the place of each letter.',
  },
  {
    mode: 'stair',
    order: NATURAL,
    caption: 'Cut off one letter at a time: banana, anana, nana, ana, na, a. Six suffixes. Each is named by where it starts, 0 to 5.',
  },
  {
    mode: 'left',
    order: NATURAL,
    caption: 'Slide them all to the left so they line up.',
  },
  {
    mode: 'left',
    order: SA,
    caption: 'Now sort them, like words in a dictionary: a, ana, anana, banana, na, nana.',
  },
  {
    mode: 'left',
    order: SA,
    idxHot: true,
    caption: `Read the numbers on the left from the top: ${SA.join(', ')}. That list of numbers is the suffix array. It is all you need to keep, because a number says where a suffix starts.`,
  },
  {
    mode: 'left',
    order: SA,
    match: PATTERN,
    caption: `Where does ${quote(PATTERN)} appear in banana? Wherever a suffix starts with it. In sorted order those suffixes sit side by side: starts ${SA.filter((i) => WORD.slice(i).startsWith(PATTERN)).sort((a, b) => a - b).join(' and ')}.`,
  },
]

// A word cut into suffixes, slid together and sorted.
function SuffixesVisual() {
  const [tick, setTick] = useLoop(CUT_FRAMES.length, 5200)
  const frame = CUT_FRAMES[tick]
  const rows = frame.order.map((i) => {
    const text = WORD.slice(i)
    const match = frame.match && text.startsWith(frame.match)
    return {
      key: i,
      text,
      hidden: frame.hidden,
      dim: frame.match ? !match : false,
      hot: match ? frame.match.length : 0,
      idxHot: frame.idxHot || match,
    }
  })

  return (
    <div className="visual-card">
      <SuffixRows
        rows={rows}
        header={WORD}
        mode={frame.mode}
        ariaLabel={`The suffixes of ${WORD}${frame.order === SA ? ', sorted' : ''}: ${frame.order.map((i) => `${WORD.slice(i)} starting at ${i}`).join(', ')}.`}
      />
      <ul className="visual-legend">
        <li>the number on the left is where the suffix starts in the word</li>
        {frame.match && <li><span className="swatch" style={{ background: GREEN }} /> the part that matches {quote(frame.match)}</li>}
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={CUT_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ trie of suffixes -> tree

const TEXT = WORD + END
const TRIE = suffixTrie(TEXT)
const TREE = squash(TRIE)
const TRIE_NODES = nodesOf(TRIE)
const TREE_NODES = nodesOf(TREE)
const CHAIN_IDS = TRIE_NODES.filter((n) => n !== TRIE && n.kids.length === 1).map((n) => n.id)
const LEAVES = leafStarts(TREE)

// Both pictures are the same height, so the page does not jump between them.
const TRIE_VIEW = treeSnapshot(TRIE, { rows: 8, gap: 43 })
const TREE_VIEW = treeSnapshot(TREE, { rows: 4, gap: 100 })

const TREE_FRAMES = [
  {
    view: TRIE_VIEW,
    r: 11,
    caption: `Put every suffix of ${TEXT} into a trie, one letter per edge (the Trie page). The $ marks the end of the word. Seven suffixes make ${TRIE_NODES.length} nodes: a lot for six letters.`,
  },
  {
    view: TRIE_VIEW,
    r: 11,
    states: Object.fromEntries(CHAIN_IDS.map((id) => [id, 'queued'])),
    caption: `Look at the yellow nodes: ${CHAIN_IDS.length} of them have just one child. They only pass the path along.`,
  },
  {
    view: TREE_VIEW,
    r: 14,
    caption: `Squash every chain into one edge that carries all of its letters. That is the suffix tree: ${TREE_NODES.length} nodes instead of ${TRIE_NODES.length}.`,
  },
  {
    view: TREE_VIEW,
    r: 14,
    leaves: true,
    caption: `Every leaf is one suffix, and its number says where that suffix starts. Follow the letters from the root to a leaf and you spell the suffix: banana$ for leaf 0.`,
  },
  {
    view: TREE_VIEW,
    r: 14,
    leaves: true,
    cells: true,
    caption: `Read the leaves from left to right: ${LEAVES.join(', ')}. That is the suffix array again (the 6 is the empty suffix, just $). The tree and the array are the same sorted suffixes, written two ways.`,
  },
]

// The trie of all suffixes, squashed into a suffix tree.
function TrieToTreeVisual() {
  const [tick, setTick] = useLoop(TREE_FRAMES.length, 5200)
  const frame = TREE_FRAMES[tick]
  const states = { ...frame.states }
  if (frame.leaves) {
    ;(frame.view === TREE_VIEW ? TREE_NODES : TRIE_NODES)
      .filter((n) => n.kids.length === 0)
      .forEach((n) => {
        states[n.id] = 'found'
      })
  }

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={frame.view}
        states={states}
        r={frame.r}
        ariaLabel={`${frame.view === TRIE_VIEW ? `A trie of all the suffixes of ${TEXT}, with ${TRIE_NODES.length} nodes` : `The suffix tree of ${TEXT}, with ${TREE_NODES.length} nodes`}. The leaves, from left to right, are ${LEAVES.join(', ')}.`}
      />
      {frame.cells && (
        <div className="cell-row" role="img" aria-label={`The leaves read left to right: ${LEAVES.join(', ')}.`}>
          <code className="cell-name">leaves</code>
          {LEAVES.map((start, k) => (
            <span key={k} style={{ background: GREEN }}>{start}</span>
          ))}
        </div>
      )}
      <ul className="visual-legend">
        {frame.states && <li><span className="swatch" style={{ background: YELLOW }} /> a node with only one child</li>}
        {frame.leaves && <li><span className="swatch" style={{ background: GREEN }} /> a leaf: the number is where its suffix starts</li>}
        <li>the letters on an edge are what you read going down</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={TREE_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ neighbours share a prefix

const BEST = LCP.indexOf(Math.max(...LCP))

const LCP_FRAMES = [
  {
    upTo: 0,
    caption: 'Back to the sorted suffixes. Look at neighbours: how many letters do two of them share at the start?',
  },
  ...LCP.slice(1).map((value, k) => {
    const row = k + 1
    const [above, below] = [WORD.slice(SA[row - 1]), WORD.slice(SA[row])]
    return {
      upTo: row,
      pair: row,
      caption: value === 0
        ? `${above} and ${below} share nothing: they start with different letters.`
        : `${above} and ${below} share ${value} ${value === 1 ? 'letter' : 'letters'}: ${quote(below.slice(0, value))}.`,
    }
  }),
  {
    upTo: LCP.length - 1,
    pair: BEST,
    caption: `The biggest number is ${LCP[BEST]}: ${quote(WORD.slice(SA[BEST]).slice(0, LCP[BEST]))} is the longest piece of banana that appears twice. A piece that appears twice starts two suffixes, and those have to sit next to each other.`,
  },
]

// The longest common prefix of each pair of neighbours.
function LcpVisual() {
  const [tick, setTick] = useLoop(LCP_FRAMES.length, 4800)
  const frame = LCP_FRAMES[tick]
  const rows = SA.map((start, k) => {
    const inPair = frame.pair !== undefined && (k === frame.pair || k === frame.pair - 1)
    return {
      key: start,
      text: WORD.slice(start),
      dim: frame.pair !== undefined && !inPair,
      hot: inPair ? LCP[frame.pair] : 0,
    }
  })
  const tags = {}
  LCP.forEach((value, k) => {
    if (k > 0 && k <= frame.upTo) tags[k] = [`lcp ${value}`]
  })

  return (
    <div className="visual-card">
      <SuffixRows
        rows={rows}
        tags={tags}
        ariaLabel={`The sorted suffixes of ${WORD}, with how many letters each shares with the one above: ${LCP.slice(1).join(', ')}.`}
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> the letters two neighbours share</li>
        <li>lcp: the longest common prefix with the row above</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={LCP_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ cost

const TEXT_LENGTH = 1000000
const PATTERN_LENGTH = 10

// Work to look for a 10-letter word in a million letters. The bars are on a
// log scale, because the answers are far apart.
function WorkVisual() {
  const rows = [
    { label: 'Scan the text, checking every position: up to 1,000,000 checks', value: TEXT_LENGTH, color: YELLOW, stroke: '#b8912a' },
    { label: 'Suffix array: about 20 comparisons × 10 letters = 200', value: 20 * PATTERN_LENGTH, color: GREEN, stroke: '#237a35' },
    { label: 'Suffix tree: one step per letter of the pattern = 10', value: PATTERN_LENGTH, color: GREEN, stroke: '#237a35' },
  ]
  const x0 = 6
  const span = 320
  const at = (v) => x0 + (Math.log10(v) / 6) * span
  const ticks = [1, 100, 10000, 1000000]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 190"
        role="img"
        aria-label="Looking for a word of 10 letters in a text of a million letters takes up to a million checks by scanning, about 200 letter comparisons with a suffix array, and 10 steps with a suffix tree. The bars are on a log scale."
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={at(t)} x2={at(t)} y1="4" y2="150" stroke="var(--border)" strokeWidth="1" />
            <text x={at(t)} y="166" fontSize="10" textAnchor={t === 1 ? 'start' : t === TEXT_LENGTH ? 'end' : 'middle'} fill="var(--text)">{t.toLocaleString('en-US')}</text>
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

export { SuffixesVisual, TrieToTreeVisual, LcpVisual, WorkVisual }
