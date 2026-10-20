import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { BASE_WORDS, buildTrie, kidsOf, layoutPositions, snapshot } from './trieData.js'

const name = (root, node) => (node === root ? 'the root' : `'${node.ch}'`)
const listOf = (words) => `[${words.map((word) => `'${word}'`).join(', ')}]`

// ---------------------------------------------------------------- insert

const insertCode = [
  'def insert(root, word):',
  '    node = root',
  '    for ch in word:',
  '        if ch not in node.children:',
  '            node.children[ch] = TrieNode()',
  '        node = node.children[ch]',
  '    node.is_end = True',
]

const insertPresets = [
  { label: 'Insert "cab" (one new node)', word: 'cab' },
  { label: 'Insert "cow" (a new branch)', word: 'cow' },
  { label: 'Insert "do" (a prefix of "dog")', word: 'do' },
  { label: 'Insert "cat" (already there)', word: 'cat' },
]

function buildInsertSteps(_values, preset) {
  const word = preset.word
  const root = buildTrie(BASE_WORDS)
  const layout = layoutPositions(buildTrie([...BASE_WORDS, word]))
  const steps = []
  const order = []
  let node = null
  let ch = '-'

  const push = (line, note, extra = {}) => {
    const { tree, rings } = snapshot(root, layout)
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      rings,
      order: order.slice(),
      current: node ? node.id : null,
      pending: null,
      foundAt: null,
      foundLabel: 'just added',
      markLabel: 'double ring: a word ends here',
      vars: { word, ch, node: node ? node.ch : '-' },
      note,
      ...extra,
    })
  }

  push(0, `Insert "${word}": walk down one letter at a time, making any node that is missing, then mark the last node as the end of a word.`)
  node = root
  order.push(node.id)
  push(1, 'Start at the root. It stands for the empty prefix: no letters yet.')

  for (const letter of word) {
    ch = letter
    push(2, `ch = '${ch}': the next letter of the word.`)
    const exists = node.kids[ch] !== undefined
    push(
      3,
      `Is '${ch}' already a child of ${name(root, node)}? ${exists ? 'Yes: this path already exists, so reuse it.' : 'No: no word so far goes this way.'}`,
    )
    if (!exists) {
      const added = { id: `${node.id}${ch}`, ch, kids: {}, end: false }
      node.kids[ch] = added
      push(4, `Make a new node for '${ch}' and hang it below ${name(root, node)}.`, { foundAt: added.id })
    }
    node = node.kids[ch]
    order.push(node.id)
    push(5, `Move down to '${ch}'.`)
  }

  push(2, 'No letters left, so the loop ends. We are at the node for the last letter.')
  const already = node.end
  node.end = true
  push(
    6,
    already
      ? `This node was already marked as the end of "${word}", so nothing changes. Inserting a word twice is harmless.`
      : `Mark it: a word now ends here (the double ring). Without this, "${word}" would just be a path, not a word.`,
    { foundAt: already ? null : node.id },
  )
  return steps
}

// ---------------------------------------------------------------- search

const searchCode = [
  'def search(root, word):',
  '    node = root',
  '    for ch in word:',
  '        if ch not in node.children:',
  '            return False',
  '        node = node.children[ch]',
  '    return node.is_end',
]

const searchPresets = [
  { label: 'Find "cat"', word: 'cat' },
  { label: 'Find "car" (a word inside another)', word: 'car' },
  { label: 'Find "ca" (only a prefix)', word: 'ca' },
  { label: 'Find "cow" (path breaks)', word: 'cow' },
]

function buildSearchSteps(_values, preset) {
  const word = preset.word
  const root = buildTrie(BASE_WORDS)
  const layout = layoutPositions(root)
  const steps = []
  const order = []
  let node = null
  let ch = '-'

  const push = (line, note, extra = {}) => {
    const { tree, rings } = snapshot(root, layout)
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      rings,
      order: order.slice(),
      current: node ? node.id : null,
      pending: null,
      foundAt: null,
      foundLabel: 'a word ends here',
      badLabel: 'no way forward',
      markLabel: 'double ring: a word ends here',
      vars: { word, ch, node: node ? node.ch : '-' },
      note,
      ...extra,
    })
  }

  push(0, `Search for "${word}": follow its letters down from the root. If the path breaks, it is not here. If it holds, check that a word really ends at the last node.`)
  node = root
  order.push(node.id)
  push(1, 'Start at the root.')

  for (const letter of word) {
    ch = letter
    push(2, `ch = '${ch}': the next letter to follow.`)
    const exists = node.kids[ch] !== undefined
    push(3, `Is '${ch}' missing from the children of ${name(root, node)}? ${exists ? 'No, there is a child for it.' : 'Yes: no word goes this way.'}`)
    if (!exists) {
      push(4, `Return False. "${word}" is not in the trie, and we found out after only ${order.length - 1} ${order.length === 2 ? 'step' : 'steps'}, without looking at any other word.`, { bad: [node.id] })
      return steps
    }
    node = node.kids[ch]
    order.push(node.id)
    push(5, `Move down to '${ch}'.`)
  }

  push(2, 'No letters left. Every letter had a node, so the whole path exists.')
  push(
    6,
    node.end
      ? `Return node.is_end, which is True: a word ends here, so "${word}" is in the trie.`
      : `Return node.is_end, which is False. The path to "${word}" exists, but only as the start of longer words. No word ends here.`,
    node.end ? { foundAt: node.id } : { bad: [node.id] },
  )
  return steps
}

// ----------------------------------------------------------- starts with

const startsCode = [
  'def starts_with(root, prefix):',
  '    node = root',
  '    for ch in prefix:',
  '        if ch not in node.children:',
  '            return []',
  '        node = node.children[ch]',
  '    words = []',
  '    collect(node, prefix, words)',
  '    return words',
  '',
  'def collect(node, path, words):',
  '    if node.is_end:',
  '        words.append(path)',
  '    for ch in sorted(node.children):',
  '        collect(node.children[ch], path + ch, words)',
]

const startsPresets = [
  { label: 'Prefix "ca"', prefix: 'ca' },
  { label: 'Prefix "car"', prefix: 'car' },
  { label: 'Prefix "do"', prefix: 'do' },
  { label: 'Prefix "cx" (no match)', prefix: 'cx' },
]

function buildStartsSteps(_values, preset) {
  const prefix = preset.prefix
  const root = buildTrie(BASE_WORDS)
  const layout = layoutPositions(root)
  const steps = []
  const order = []
  const frames = [] // one per open collect call: { node, path }
  let words = null
  let node = null
  let ch = '-'

  const push = (line, note, extra = {}) => {
    const { tree, rings } = snapshot(root, layout)
    const open = frames.length > 0
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      rings,
      order: order.slice(),
      ...(open ? { frontier: frames.map((frame) => frame.node.id), frontierKind: 'calls' } : {}),
      ...(words ? { output: words.slice() } : {}),
      current: open ? frames[frames.length - 1].node.id : node ? node.id : null,
      pending: null,
      foundAt: null,
      foundLabel: 'a word that ends here',
      badLabel: 'no way forward',
      markLabel: 'double ring: a word ends here',
      vars: open
        ? { prefix, path: frames[frames.length - 1].path, words: listOf(words) }
        : { prefix, ch, node: node ? node.ch : '-' },
      note,
      ...extra,
    })
  }

  push(0, `Find every word that starts with "${prefix}". First walk down the prefix, then collect all the words below where we land.`)
  node = root
  order.push(node.id)
  push(1, 'Start at the root.')

  for (const letter of prefix) {
    ch = letter
    push(2, `ch = '${ch}': the next letter of the prefix.`)
    const exists = node.kids[ch] !== undefined
    push(3, `Is '${ch}' missing from the children of ${name(root, node)}? ${exists ? 'No, there is a child for it.' : 'Yes: no word starts with this prefix.'}`)
    if (!exists) {
      push(4, `Return an empty list. Nothing starts with "${prefix}", and we only had to look at ${order.length - 1} ${order.length === 2 ? 'node' : 'nodes'} to know.`, { bad: [node.id] })
      return steps
    }
    node = node.kids[ch]
    order.push(node.id)
    push(5, `Move down to '${ch}'.`)
  }

  push(2, `The whole prefix is matched. We are on the node for "${prefix}". Every word that starts with it is somewhere below this node.`)
  words = []
  push(6, 'words = []: an empty list for the answers.')
  push(7, `Call collect on this node, with path = "${prefix}". It will visit every node below, in alphabetical order, and add the words it finds.`)

  const collect = (n, path) => {
    frames.push({ node: n, path })
    if (!order.includes(n.id)) order.push(n.id)
    push(10, `collect starts on ${name(root, n)}, with path = "${path}".`)
    push(11, `Does a word end here (is_end)? ${n.end ? 'Yes.' : 'No, "' + path + '" is only the start of longer words.'}`)
    if (n.end) {
      words.push(path)
      push(12, `Add "${path}" to words.`, { foundAt: n.id })
    }
    kidsOf(n).forEach((kid) => {
      push(13, `Next child letter, in alphabetical order: '${kid.ch}'.`)
      push(14, `Recurse into '${kid.ch}'. The path grows to "${path + kid.ch}".`)
      collect(kid, path + kid.ch)
    })
    push(13, kidsOf(n).length === 0 ? `${name(root, n)} has no children, so the loop does nothing. Return to the caller.` : `No more children. Return to the caller.`)
    frames.pop()
  }
  collect(node, prefix)

  push(8, words.length === 0 ? 'Return words: it is empty.' : `Return ${listOf(words)}. We never looked at any branch outside "${prefix}".`)
  return steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  insert: { label: 'Insert', code: insertCode, presets: insertPresets, build: buildInsertSteps },
  search: { label: 'Search', code: searchCode, presets: searchPresets, build: buildSearchSteps },
  starts: { label: 'Starts with', code: startsCode, presets: startsPresets, build: buildStartsSteps },
}

function TrieTracer() {
  const [kind, setKind] = useState('insert')
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

export default TrieTracer
