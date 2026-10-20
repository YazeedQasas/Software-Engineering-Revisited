import TreeView from '../../components/TreeView.jsx'
import {
  BASE_WORDS,
  buildRoot,
  buildTrie,
  countNodes,
  insertWord,
  layoutPositions,
  nodeAt,
  nodesBelow,
  snapshot,
  wordsBelow,
} from './trieData.js'
import { StepDots, useLoop } from './loopHooks.jsx'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const GREY = '#e4e4e2'

const ringLegend = <li>double ring: a word ends here</li>

// ------------------------------------------------ building one up

const BUILD_WORDS = ['cat', 'car', 'cap', 'dog', 'do']
const BUILD_FULL = buildTrie(BUILD_WORDS)
const BUILD_LAYOUT = layoutPositions(BUILD_FULL)
const LETTERS = BUILD_WORDS.join('').length
const NODES = countNodes(BUILD_FULL) - 1 // the root is not a letter

const spell = (letters) => letters.map((ch) => `'${ch}'`).join(', ')

// What inserting `word` into `root` does: which letters reuse a node, which
// need a new one. It also performs the insert.
function insertFrame(root, word) {
  const states = {}
  const reused = []
  const fresh = []
  let prefix = ''
  for (const ch of word) {
    prefix += ch
    const there = nodeAt(root, prefix) !== null
    ;(there ? reused : fresh).push(ch)
    states[`~${prefix}`] = there ? 'active' : 'found'
  }
  insertWord(root, word)
  let caption
  if (fresh.length === 0) {
    caption = `"${word}": every letter already has a node, so nothing new is built. Only the ring changes: "${word}" is now marked as a word.`
  } else if (reused.length === 0) {
    caption = `"${word}": nothing on this path yet, so make a node for each letter: ${spell(fresh)}. A ring on the last one marks the end of the word.`
  } else {
    caption = `"${word}": ${spell(reused)} ${reused.length === 1 ? 'is' : 'are'} already there, so reuse ${reused.length === 1 ? 'it' : 'them'}. Only ${spell(fresh)} ${fresh.length === 1 ? 'is' : 'are'} new.`
  }
  return { states, caption }
}

// One frame before the first word, one for each word, one at the end.
const BUILD_FRAMES = (() => {
  const root = buildRoot()
  const frames = [
    {
      index: -1,
      ...snapshot(root, BUILD_LAYOUT),
      states: {},
      caption: `We will add ${BUILD_WORDS.length} words to an empty trie, one at a time. A trie has one node per letter, and words that start the same way share their first nodes.`,
    },
  ]
  BUILD_WORDS.forEach((word, index) => {
    const { states, caption } = insertFrame(root, word)
    frames.push({ index, ...snapshot(root, BUILD_LAYOUT), states, caption })
  })
  frames.push({
    index: BUILD_WORDS.length,
    ...snapshot(root, BUILD_LAYOUT),
    states: {},
    caption: `Done. ${LETTERS} letters went in, but the trie has only ${NODES} nodes (plus the root), because "c-a" and "d-o" are stored once and shared.`,
  })
  return frames
})()

// A trie growing word by word.
function BuildVisual() {
  const [tick, setTick] = useLoop(BUILD_FRAMES.length, 4200)
  const frame = BUILD_FRAMES[tick]

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={frame.tree}
        states={frame.states}
        rings={frame.rings}
        ariaLabel={`A trie built from the words ${BUILD_WORDS.join(', ')}. Each node is one letter, and words that start the same share their first nodes. It ends with ${NODES} letter nodes for ${LETTERS} letters.`}
      />
      <ul className="kr-chips" aria-label="The words, in the order they go in">
        {BUILD_WORDS.map((word, i) => (
          <li key={word} className={`kr-chip ${i < frame.index ? 'kept' : i === frame.index ? 'now' : ''}`} style={{ listStyle: 'none' }}>{word}</li>
        ))}
      </ul>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> a new node</li>
        <li><span className="swatch" style={{ background: BLUE }} /> already there: reused</li>
        {ringLegend}
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={BUILD_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ where a word ends

const END_LAYOUT = layoutPositions(buildTrie(['do', 'dog']))

// "dog" alone, against "do" and "dog": the shape is the same, only a ring differs.
function EndMarkVisual() {
  const panels = [
    { words: ['dog'], title: 'Stored: dog', sub: 'is "do" a word? No' },
    { words: ['do', 'dog'], title: 'Stored: do, dog', sub: 'is "do" a word? Yes' },
  ]

  return (
    <div className="visual-card">
      <div className="tree-pair">
        {panels.map(({ words, title, sub }) => {
          const { tree, rings } = snapshot(buildTrie(words), END_LAYOUT)
          return (
            <figure key={title}>
              <TreeView
                tree={tree}
                rings={rings}
                states={{ '~do': 'active' }}
                r={15}
                ariaLabel={`${title}. The nodes d, o and g form the same path in both tries. ${words.includes('do') ? 'The node o has a double ring, so "do" is a word.' : 'Only g has a double ring, so "do" is only the start of "dog".'}`}
              />
              <figcaption>
                {title}
                <span>{sub}</span>
              </figcaption>
            </figure>
          )
        })}
      </div>
      <ul className="visual-legend">
        <li>the two shapes are identical. Only the ring on <strong>o</strong> says whether &ldquo;do&rdquo; is a word.</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ autocomplete

const AUTO = buildTrie(BASE_WORDS)
const AUTO_LAYOUT = layoutPositions(AUTO)
const { tree: AUTO_TREE, rings: AUTO_RINGS } = snapshot(AUTO, AUTO_LAYOUT)

const TYPED = [
  { typed: '', caption: 'Nothing typed yet. Every word in the trie is still possible.' },
  { typed: 'c', caption: 'Typed c: one step down. Everything under c is still possible (yellow). The d branch is ruled out without looking at a single node in it.' },
  { typed: 'ca', caption: 'Typed ca: two steps down from the root. The walk is over. Now collect every word below this node: those are the suggestions.' },
  { typed: 'car', caption: 'Typed car: three steps. Only "car" and "cart" are left below. ("car" is a word, and also the start of "cart".)' },
  { typed: 'cx', caption: 'Typed cx: c has no child x, so the walk stops. Nothing starts with "cx", and we found out without checking any word.' },
]

function typedFrame({ typed, caption }) {
  const node = nodeAt(AUTO, typed)
  const states = {}
  nodesBelow(AUTO).forEach((n) => {
    states[n.id] = 'checked'
  })
  let words = []
  if (node) {
    nodesBelow(node).forEach((n) => {
      states[n.id] = n.end ? 'found' : 'queued'
    })
    words = wordsBelow(node, typed)
  }
  // the walk: every prefix that exists is blue, and the one that breaks is red
  for (let k = 0; k <= typed.length; k++) {
    const prefix = typed.slice(0, k)
    if (nodeAt(AUTO, prefix)) {
      states[`~${prefix}`] = 'active'
    } else {
      states[`~${typed.slice(0, k - 1)}`] = 'bad'
      break
    }
  }
  return { typed, caption, states, words }
}

const TYPED_FRAMES = TYPED.map(typedFrame)

// Typing a prefix: walk down its letters, then collect everything below.
function AutocompleteVisual() {
  const [tick, setTick] = useLoop(TYPED_FRAMES.length, 4600)
  const frame = TYPED_FRAMES[tick]

  return (
    <div className="visual-card">
      <div className="trie-typed" aria-label={`Typed so far: ${frame.typed || 'nothing'}`}>
        <span className="trie-typed-label">typed:</span>
        <span className="trie-typed-text">{frame.typed}</span>
        <span className="trie-caret" aria-hidden="true" />
      </div>
      <TreeView
        className="trie-view"
        tree={AUTO_TREE}
        states={frame.states}
        rings={AUTO_RINGS}
        ariaLabel={`A trie of the words ${BASE_WORDS.join(', ')}. The prefix typed is ${frame.typed || 'empty'}. ${frame.words.length > 0 ? `The words below it are ${frame.words.join(', ')}.` : 'No word starts with it.'}`}
      />
      <ul className="kr-chips" aria-label="Suggestions">
        {frame.words.length === 0 && <li className="kr-chip unseen" style={{ listStyle: 'none' }}>no suggestions</li>}
        {frame.words.map((word) => (
          <li key={word} className="kr-chip kept" style={{ listStyle: 'none' }}>{word}</li>
        ))}
      </ul>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: BLUE }} /> the walk down the typed letters</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> still possible</li>
        <li><span className="swatch" style={{ background: GREEN }} /> a word to suggest</li>
        <li><span className="swatch" style={{ background: GREY }} /> ruled out</li>
        {ringLegend}
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={TYPED_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ cost

const COST_WORDS = ['car', 'card', 'care', 'cart', 'cat', 'cap', 'dog', 'dot', 'do']
const COST_LETTERS = COST_WORDS.join('').length
const COST_NODES = countNodes(buildTrie(COST_WORDS)) - 1
const LOOKUP = 'cart'

// Counted from a real list of words and the trie built from them.
function WorkVisual() {
  const n = COST_WORDS.length
  const rows = [
    { head: 'Memory' },
    { label: `Letters in the word list: ${COST_LETTERS}`, value: COST_LETTERS, color: YELLOW, stroke: '#b8912a' },
    { label: `Nodes in the trie: ${COST_NODES}`, value: COST_NODES, color: GREEN, stroke: '#237a35' },
    { head: `Looking up "${LOOKUP}"` },
    { label: `Words a list may have to check: ${n}`, value: n, color: YELLOW, stroke: '#b8912a' },
    { label: `Steps in the trie: ${LOOKUP.length} (one per letter)`, value: LOOKUP.length, color: GREEN, stroke: '#237a35' },
  ]
  const scale = 300 / COST_LETTERS
  let y = 4

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 230"
        role="img"
        aria-label={`For ${n} words, a plain list holds ${COST_LETTERS} letters while the trie needs only ${COST_NODES} nodes. Looking up "${LOOKUP}" may check up to ${n} words in a list, but takes ${LOOKUP.length} steps in the trie, one per letter.`}
      >
        {rows.map((row) => {
          if (row.head) {
            const top = y
            y += 20
            return <text key={row.head} x="4" y={top + 13} fontSize="13" fontWeight="700" fill="var(--text-h)">{row.head}</text>
          }
          const top = y
          y += 46
          return (
            <g key={row.label}>
              <text x="4" y={top + 12} fontSize="11.5" fill="var(--text-h)">{row.label}</text>
              <rect x="4" y={top + 18} width={row.value * scale} height="16" rx="3" fill={row.color} stroke={row.stroke} strokeWidth="0.8" />
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>add a million more words and the list gets a million times longer to check. The trie still takes 4 steps for &ldquo;cart&rdquo;.</li>
      </ul>
    </div>
  )
}

export { BuildVisual, EndMarkVisual, AutocompleteVisual, WorkVisual }
