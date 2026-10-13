import { useEffect, useState } from 'react'
import BTreeView from '../../components/BTreeView.jsx'
import { BIG_TREE, fromSpec, layoutBTree, makeIds } from './btree.js'

const SMALL = [[20, 40], [[5, 10, 15], [25, 30], [45, 50, 55]]]

// A small B-tree on show, with its rules written underneath.
function BTreeAnatomyVisual() {
  const tree = layoutBTree(fromSpec(SMALL, makeIds()), { height: 120 })

  return (
    <div className="visual-card">
      <BTreeView
        tree={tree}
        states={{ n0: 'active' }}
        ariaLabel="A B-tree with the root holding 20 and 40, and three children: one holding 5, 10 and 15, one holding 25 and 30, and one holding 45, 50 and 55. The root has two keys and three children, and all three leaves are on the same level."
      />
      <ul className="visual-legend">
        <li>the keys in each box are sorted</li>
        <li>a box with <strong>k</strong> keys has <strong>k + 1</strong> children</li>
        <li>every leaf is on the same level</li>
      </ul>
    </div>
  )
}

// Each square is one read from disk.
function BTreeReadsVisual() {
  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 168"
        role="img"
        aria-label="Finding one key among a million. A balanced binary tree needs about 20 reads from disk, drawn as 20 small squares. A B-tree with up to 100 children per node needs about 3 reads, drawn as 3 large squares."
      >
        <text x="6" y="16" fontSize="11" fontWeight="600" fill="var(--text-h)">Balanced binary tree: about 20 reads</text>
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={6 + i * 16.4} y="24" width="13" height="13" rx="2" fill="#8aa8ea" stroke="#2d4f9e" strokeWidth="0.8" />
        ))}
        <text x="6" y="82" fontSize="11" fontWeight="600" fill="var(--text-h)">B-tree, up to 100 children per node: about 3 reads</text>
        {Array.from({ length: 3 }).map((_, i) => (
          <g key={i}>
            <rect x={6 + i * 56} y="92" width="48" height="40" rx="4" fill="#86d69f" stroke="#237a35" strokeWidth="1" />
            <text x={30 + i * 56} y="117" fontSize="10" fontWeight="700" textAnchor="middle" fill="#1f2023">100 keys</text>
          </g>
        ))}
        <text x="6" y="158" fontSize="10.5" fill="var(--text)">each square is one trip to disk (1,000,000 keys)</text>
      </svg>
    </div>
  )
}

const FRAMES = [
  { read: ['0'], active: '0' },
  { read: ['0', '1'], active: '1' },
  { read: ['0', '1', '3'], active: '3' },
  { read: ['0', '1', '3'], found: '3' },
]
const HOLD_TICKS = 3

// A looping animation of a search for 30: three nodes read, the rest never touched.
function BTreeSearchVisual() {
  const tree = layoutBTree(fromSpec(BIG_TREE, makeIds()))
  const [tick, setTick] = useState(0)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => setTick((t) => (t + 1) % (FRAMES.length + HOLD_TICKS)), 1100)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const frame = reduceMotion ? FRAMES[FRAMES.length - 1] : FRAMES[Math.min(tick, FRAMES.length - 1)]
  const states = {}
  const marks = {}
  frame.read.forEach((id, i) => {
    id = `n${id}`
    states[id] = 'checked'
    marks[id] = i + 1
  })
  if (frame.active) states[`n${frame.active}`] = 'active'
  if (frame.found) states[`n${frame.found}`] = 'found'

  return (
    <div className="visual-card">
      <BTreeView
        tree={tree}
        states={states}
        marks={marks}
        hot={frame.found ? { [`n${frame.found}`]: [1] } : {}}
        ariaLabel="Searching a B-tree for 30. The root holding 60 is read first, and 30 is smaller than 60, so the search goes left. The node holding 20 and 40 is read next, and 30 falls between them, so the search goes to the middle child. The leaf holding 25 and 30 is read third, and 30 is found. Five other nodes are never touched."
      />
      <ul className="visual-legend">
        <li>looking for <strong>30</strong>: 3 nodes read, 5 never touched</li>
      </ul>
    </div>
  )
}

// A leaf with one key too many, and the same tree after the split.
function BTreeSplitVisual() {
  const before = layoutBTree(fromSpec([[20, 40], [[5, 10, 12, 15], [25, 30], [45, 50, 55]]], makeIds()), { height: 100 })
  const after = layoutBTree(fromSpec([[12, 20, 40], [[5, 10], [15], [25, 30], [45, 50, 55]]], makeIds()), { height: 100 })

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <figure>
          <BTreeView
            tree={before}
            states={{ n1: 'bad' }}
            ariaLabel="Inserting 12 into the leaf holding 5, 10 and 15 gives it four keys, 5, 10, 12 and 15, which is one more than a node may hold."
          />
          <figcaption>
            Insert 12
            <span>the leaf now has 4 keys: one too many</span>
          </figcaption>
        </figure>
        <figure>
          <BTreeView
            tree={after}
            states={{ n0: 'active', n2: 'found' }}
            hot={{ n0: [0] }}
            ariaLabel="After the split, the middle key 12 has moved up into the root, which now holds 12, 20 and 40. The leaf became two: one holding 5 and 10, and a new one holding 15."
          />
          <figcaption>
            Split the leaf
            <span>the middle key, 12, moves up; the rest splits in two</span>
          </figcaption>
        </figure>
      </div>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#f2a5a5' }} /> too many keys</li>
        <li><span className="swatch" style={{ background: '#86d69f' }} /> the middle key, and the new node</li>
      </ul>
    </div>
  )
}

// Levels needed to hold a billion keys, by how many children a node can have.
function BTreeLevelsVisual() {
  const bars = [
    { label: '2 children per node (a binary tree)', levels: 30 },
    { label: '10 children per node', levels: 9 },
    { label: '100 children per node', levels: 5 },
    { label: '1,000 children per node', levels: 3 },
  ]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 176"
        role="img"
        aria-label="Levels needed to hold one billion keys. With 2 children per node, 30 levels. With 10 children per node, 9 levels. With 100, 5 levels. With 1000, 3 levels."
      >
        {bars.map(({ label, levels }, i) => {
          const y = 8 + i * 42
          return (
            <g key={label}>
              <text x="4" y={y + 10} fontSize="11" fill="var(--text-h)">{label}</text>
              <rect x="4" y={y + 16} width={levels * 9.4} height="14" rx="3" fill={i === 0 ? '#8aa8ea' : '#86d69f'} stroke={i === 0 ? '#2d4f9e' : '#237a35'} strokeWidth="0.8" />
              <text x={4 + levels * 9.4 + 6} y={y + 27} fontSize="11" fontWeight="700" fill="var(--text-h)">{levels}</text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>levels to hold 1,000,000,000 keys: every level is one more read from disk</li>
      </ul>
    </div>
  )
}

export { BTreeAnatomyVisual, BTreeReadsVisual, BTreeSearchVisual, BTreeSplitVisual, BTreeLevelsVisual }
