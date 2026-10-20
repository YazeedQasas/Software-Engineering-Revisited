import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { END, WORD, buildSuffixTree, commonPrefix, edgeKey, isLeaf, leafStarts, suffixArray, treeSnapshot } from './suffixData.js'

const BLUE = '#8aa8ea'
const GREEN = '#86d69f'
const RED = '#f2a5a5'
const GREY = '#e4e4e2'

const patternPresets = [
  { label: '"ana": appears twice', pattern: 'ana' },
  { label: '"na": twice, at the end', pattern: 'na' },
  { label: '"ban": once', pattern: 'ban' },
  { label: '"nab": not there', pattern: 'nab' },
  { label: '"a": three times', pattern: 'a' },
]

const quote = (text) => `"${text}"`

// ------------------------------------------------- the suffix array, searched

const arrayCode = [
  'def find_all(s, sa, pattern):',
  '    m = len(pattern)',
  '    lo, hi = 0, len(sa)',
  '    while lo < hi:',
  '        mid = (lo + hi) // 2',
  '        if s[sa[mid]:sa[mid] + m] < pattern:',
  '            lo = mid + 1',
  '        else:',
  '            hi = mid',
  '    first = lo',
  '    hi = len(sa)',
  '    while lo < hi:',
  '        mid = (lo + hi) // 2',
  '        if s[sa[mid]:sa[mid] + m] <= pattern:',
  '            lo = mid + 1',
  '        else:',
  '            hi = mid',
  '    return sorted(sa[first:lo])',
]

const arrayLegend = [
  { color: BLUE, text: 'the row in the middle, being compared' },
  { color: GREEN, text: 'letters that match the pattern' },
  { color: RED, text: 'the first letter that differs' },
  { color: GREY, text: 'faded: already ruled out' },
]

function buildArraySteps(_values, { pattern }) {
  const s = WORD
  const sa = suffixArray(s)
  const n = s.length
  const m = pattern.length
  const part = (k) => s.slice(sa[k], sa[k] + m)
  const steps = []
  let lo = 0
  let hi = n
  let mid = null
  let first = null
  let done = null // [from, to] once the answer is known

  const push = (line, note) => {
    const rows = sa.map((start, k) => {
      const text = s.slice(start)
      const row = { key: start, text }
      if (done) {
        if (k >= done[0] && k < done[1]) {
          row.state = 'found'
          row.hot = Math.min(m, text.length)
        } else {
          row.dim = true
        }
      } else {
        if (k < lo || k >= hi) row.dim = true
        if (k === mid) {
          const common = commonPrefix(text, pattern)
          row.state = 'active'
          row.hot = common
          row.miss = common < m && common < text.length ? common : null
          row.dim = false
        }
      }
      return row
    })
    const tags = {}
    const tag = (at, name) => {
      ;(tags[at] ??= []).push(name)
    }
    if (!done) {
      tag(lo, 'lo')
      if (mid !== null) tag(mid, 'mid')
      tag(hi, 'hi')
    }
    if (first !== null) tag(first, 'first')
    if (done) tag(done[1], 'lo')

    const vars = { lo, hi }
    if (mid !== null) {
      vars.mid = mid
      vars.part = quote(part(mid))
    }
    if (first !== null) vars.first = first
    steps.push({
      line,
      array: [],
      compare: null,
      vars,
      note,
      sfx: { rows, tags, header: s, mode: 'left' },
      legend: arrayLegend,
      strips: [
        { name: 'pattern', items: pattern.split(''), kind: 'out' },
        { name: 'sa', items: sa.slice(), kind: 'seen', hint: 'sa is the column of numbers on the left of the rows, from top to bottom.' },
      ],
    })
  }

  push(0, `Find every place where ${quote(pattern)} appears in ${quote(s)}. sa is the suffix array: the starting places of the suffixes, in dictionary order. The rows show those suffixes.`)
  push(1, `m = len(pattern) = ${m}. Only the first ${m} letters of a suffix matter, because a match is a suffix that starts with the pattern.`)
  push(2, `lo, hi = 0, ${n}. Rows lo up to (but not including) hi are the ones still possible. At first that is every row.`)

  // One binary search: the first row that is not before the matches, or the
  // first row that is after them.
  const search = (lines, strict) => {
    const [whileLine, midLine, ifLine, loLine, hiLine] = lines
    for (;;) {
      const more = lo < hi
      push(whileLine, `Is lo < hi? ${lo} < ${hi}: ${more ? 'Yes, some rows are still possible.' : `No, no rows are left to look at. The answer is lo = ${lo}.`}`)
      if (!more) break

      mid = (lo + hi) >> 1
      push(midLine, `mid = (${lo} + ${hi}) // 2 = ${mid}: the row in the middle. sa[${mid}] = ${sa[mid]}, so this is the suffix that starts at ${sa[mid]}: ${quote(s.slice(sa[mid]))}.`)

      const text = part(mid)
      const before = strict ? text < pattern : text <= pattern
      const common = commonPrefix(s.slice(sa[mid]), pattern)
      push(
        ifLine,
        `${m === 1 ? 'Its first letter is' : `Its first ${m} letters are`} ${quote(text)}${s.length - sa[mid] < m ? ` (the suffix has only ${s.length - sa[mid]} ${s.length - sa[mid] === 1 ? 'letter' : 'letters'})` : ''}. Is ${quote(text)} ${strict ? '<' : '<='} ${quote(pattern)}? ${
          before
            ? strict
              ? 'Yes: it sorts before the pattern, so it comes before every match. The first match is further down.'
              : `Yes: it is ${common === m ? 'a match' : 'before the pattern'}, so the matches end further down.`
            : strict
              ? 'No: it is the pattern or sorts after it. The first match is here or further up.'
              : 'No: it sorts after the pattern, so it comes after every match. The matches end here or further up.'
        }`,
      )
      if (before) {
        lo = mid + 1
        push(loLine, `lo = mid + 1 = ${lo}. Row ${mid} and everything above it can be ruled out.`)
      } else {
        hi = mid
        push(hiLine, `hi = mid = ${hi}. Row ${mid} and everything below it can be ruled out${strict ? ' (row ' + mid + ' itself stays possible: it might be the first match)' : ''}.`)
      }
      mid = null
    }
  }

  search([3, 4, 5, 6, 8], true)
  first = lo
  const hit = lo < n && part(lo) === pattern
  push(9, `first = lo = ${lo}. ${hit ? `Row ${lo} is ${quote(s.slice(sa[lo]))}, which does start with ${quote(pattern)}: the first match.` : `${lo < n ? `Row ${lo} is ${quote(s.slice(sa[lo]))}, which does not start with ${quote(pattern)}.` : 'That is past the last row.'} So there are no matches.`}`)
  hi = n
  push(10, `hi = len(sa) = ${n}. Now look for the end of the matches. lo stays at ${lo}, because nothing above the first match can be a match.`)
  search([11, 12, 13, 14, 16], false)

  done = [first, lo]
  const found = sa.slice(first, lo)
  push(
    17,
    found.length > 0
      ? `sa[${first}:${lo}] = [${found.join(', ')}]. Those rows are all the matches, side by side. Sorted: [${found.slice().sort((a, b) => a - b).join(', ')}]. ${quote(pattern)} starts at ${found.length === 1 ? 'position' : 'positions'} ${found.slice().sort((a, b) => a - b).join(', ')}.`
      : `sa[${first}:${lo}] is empty, because first and lo are the same row. ${quote(pattern)} does not appear in ${quote(s)}.`,
  )
  return steps
}

// ------------------------------------------------- the suffix tree, searched

const treeCode = [
  'def search(root, pattern):',
  '    node = root',
  '    i = 0',
  '    while i < len(pattern):',
  '        first = pattern[i]',
  '        if first not in node.edges:',
  '            return None',
  '        label, child = node.edges[first]',
  '        part = pattern[i:i + len(label)]',
  '        if not label.startswith(part):',
  '            return None',
  '        i += len(label)',
  '        node = child',
  '    return node',
]

const treeLegend = [
  { color: BLUE, text: 'the node we are at' },
  { color: GREY, text: 'passed' },
  { color: GREEN, text: 'a leaf below: a place the pattern occurs' },
  { color: RED, text: 'where the search failed' },
  { color: '#2d4f9e', text: 'thick line: the edges followed' },
]

function buildTreeSteps(_values, { pattern }) {
  const text = WORD + END
  const root = buildSuffixTree(text)
  const tree = treeSnapshot(root, { rows: 4 })
  const m = pattern.length
  const steps = []

  let node = root
  let i = 0
  const passed = []
  const hot = []
  let bad = null
  let answer = null

  const push = (line, note, vars = {}) => {
    const states = {}
    passed.forEach((id) => {
      states[id] = 'checked'
    })
    if (answer) {
      const walk = (n) => (isLeaf(n) ? [n] : n.kids.flatMap(walk))
      walk(answer).forEach((leaf) => {
        states[leaf.id] = 'found'
      })
    }
    states[node.id] = answer && isLeaf(node) ? 'found' : 'active'
    if (bad) states[bad] = 'bad'
    const done = Math.min(i, m)
    steps.push({
      line,
      array: [],
      compare: null,
      tree,
      order: [],
      doneLabel: false,
      states,
      hotEdges: hot.slice(),
      legend: treeLegend,
      strips: [
        { name: 'matched', items: pattern.slice(0, done).split(''), kind: 'out' },
        { name: 'still to match', items: pattern.slice(done).split('') },
      ],
      vars: { i, ...vars },
      note,
    })
  }

  push(0, `Look for ${quote(pattern)} in the suffix tree of ${quote(text)}. Every edge carries some letters. We follow the pattern down the tree, edge by edge, until the pattern is used up. The numbers on the leaves say where each suffix starts.`)
  push(1, `Start at the root.`)
  push(2, `i = 0: how many letters of the pattern have been matched so far.`)

  for (;;) {
    const more = i < m
    push(3, `Is i < len(pattern)? ${i} < ${m}: ${more ? 'Yes, there are letters left to match.' : 'No, every letter of the pattern has been matched.'}`)
    if (!more) break

    const letter = pattern[i]
    push(4, `The next letter to match is pattern[${i}] = ${quote(letter)}.`, { first: quote(letter) })

    const kid = node.kids.find((k) => k.label[0] === letter)
    push(5, `Does this node have an edge that starts with ${quote(letter)}? ${kid ? 'Yes.' : 'No.'}`, { first: quote(letter) })
    if (!kid) {
      bad = node.id
      push(6, `There is no way to continue, so the pattern is not in the text. Return None.`, { first: quote(letter) })
      return steps
    }

    hot.push(edgeKey(node.id, kid.id))
    const label = kid.label
    push(7, `Take that edge. Its label is ${quote(label)} and it leads to a ${isLeaf(kid) ? 'leaf' : 'node'}.`, { first: quote(letter), label: quote(label) })

    const part = pattern.slice(i, i + label.length)
    push(8, `part = pattern[${i}:${i + label.length}] = ${quote(part)}: the next ${label.length} letters of the pattern${part.length < label.length ? ', or what is left of it (the pattern ends inside this edge)' : ''}.`, { first: quote(letter), label: quote(label), part: quote(part) })

    const ok = label.startsWith(part)
    push(9, `Does ${quote(label)} start with ${quote(part)}? ${ok ? 'Yes, the edge agrees with the pattern.' : 'No, the edge spells something different.'}`, { first: quote(letter), label: quote(label), part: quote(part) })
    if (!ok) {
      bad = kid.id
      passed.push(node.id)
      node = kid
      push(10, `The edge disagrees with the pattern after ${commonPrefix(label, part)} ${commonPrefix(label, part) === 1 ? 'letter' : 'letters'}, so the pattern is not in the text. Return None.`, { first: quote(letter), label: quote(label), part: quote(part) })
      return steps
    }

    i += label.length
    push(11, `i += len(label): i = ${i}${i > m ? `. That is more than the ${m} letters of the pattern: it ended inside the edge, and that still counts as matched` : ''}.`, { first: quote(letter), label: quote(label), part: quote(part) })

    passed.push(node.id)
    node = kid
    push(12, `node = child: move to the end of the edge.`, { first: quote(letter) })
  }

  answer = node
  const starts = leafStarts(node).slice().sort((a, b) => a - b)
  push(13, `The whole pattern is matched. Every leaf below this node is a suffix that starts with ${quote(pattern)}, and the leaves say where: ${starts.join(', ')}. ${quote(pattern)} appears ${starts.length === 1 ? 'once' : `${starts.length} times`}.`)
  return steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  array: { label: 'Suffix array: binary search', code: arrayCode, presets: patternPresets, build: buildArraySteps, view: 'suffix' },
  tree: { label: 'Suffix tree: walk down', code: treeCode, presets: patternPresets, build: buildTreeSteps, view: 'tree' },
}

function SuffixTracer() {
  const [kind, setKind] = useState('array')
  const { code, presets, build, view } = KINDS[kind]

  return (
    <>
      <div className="tracer-picker" role="group" aria-label="Structure">
        <span className="tracer-label">Structure:</span>
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
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view={view} />
    </>
  )
}

export default SuffixTracer
