import { useEffect, useState } from 'react'
import TreeView, { TreeNodes } from '../../components/TreeView.jsx'
import { BFS_ORDER, DFS_ORDER, SEARCH_TREE } from './searchTree.js'

// The page's tree with its parts labelled: the root, the leaves and the levels.
function TreeVocabVisual() {
  const states = { A: 'active', E: 'found', F: 'found', G: 'found', H: 'found' }
  const levels = [26, 80, 134, 188]

  return (
    <div className="visual-card">
      <svg
        className="tree-view"
        viewBox="0 0 360 214"
        role="img"
        aria-label="A tree with eight nodes. A is the root at the top, level 0. B and C are its children at level 1. D, E, F and G are at level 2. H is at level 3. E, F, G and H have no children, so they are leaves."
      >
        <TreeNodes tree={SEARCH_TREE} states={states} />
        {levels.map((y, level) => (
          <text key={level} x="358" y={y + 4} fontSize="11" textAnchor="end" fill="var(--text)">level {level}</text>
        ))}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#8aa8ea' }} /> the root: the top node</li>
        <li><span className="swatch" style={{ background: '#86d69f' }} /> a leaf: a node with no children</li>
      </ul>
    </div>
  )
}

const HOLD_TICKS = 3

// A looping animation of the two orders: the same tree, searched breadth-first
// and depth-first. A numbered badge appears each time a node is looked at.
function TreeOrderVisual() {
  const total = BFS_ORDER.length
  const [tick, setTick] = useState(0)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => setTick((t) => (t + 1) % (total + HOLD_TICKS)), 800)
    return () => clearInterval(timer)
  }, [reduceMotion, total])

  const shown = reduceMotion ? total : Math.min(tick + 1, total)

  const draw = (sequence) => {
    const states = {}
    const order = {}
    sequence.slice(0, shown).forEach((id, i) => {
      states[id] = i === shown - 1 && shown < total ? 'active' : 'checked'
      order[id] = i + 1
    })
    return { states, order }
  }

  const bfs = draw(BFS_ORDER)
  const dfs = draw(DFS_ORDER)

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <figure>
          <TreeView
            tree={SEARCH_TREE}
            states={bfs.states}
            order={bfs.order}
            ariaLabel={`Breadth-first search of the tree visits the nodes in this order: ${BFS_ORDER.join(', ')}. One whole level at a time.`}
          />
          <figcaption>
            Breadth-first
            <span>one whole level, then the next</span>
          </figcaption>
        </figure>
        <figure>
          <TreeView
            tree={SEARCH_TREE}
            states={dfs.states}
            order={dfs.order}
            ariaLabel={`Depth-first search of the tree visits the nodes in this order: ${DFS_ORDER.join(', ')}. As deep as possible down one branch, then back up.`}
          />
          <figcaption>
            Depth-first
            <span>all the way down a branch, then back up</span>
          </figcaption>
        </figure>
      </div>
      <ul className="visual-legend">
        <li>the number on each node is the order it was looked at</li>
      </ul>
    </div>
  )
}

// A tree where every level is full, drawn small with no labels.
function bushyTree() {
  const width = 150
  const levels = 4
  const nodes = []
  const edges = []
  for (let level = 0; level < levels; level++) {
    const slots = 2 ** level
    for (let i = 0; i < slots; i++) {
      const index = slots - 1 + i
      nodes.push({ id: `n${index}`, x: ((i + 0.5) / slots) * width, y: 14 + level * 36 })
      if (index > 0) edges.push([`n${(index - 1) >> 1}`, `n${index}`])
    }
  }
  const widest = nodes.slice(2 ** (levels - 1) - 1).map((node) => node.id)
  return { tree: { nodes, edges }, widest }
}

// A long spine with one leaf hanging off each node, so it is tall and thin.
function stringyTree() {
  const spine = 6
  const nodes = []
  const edges = []
  for (let k = 0; k < spine; k++) {
    nodes.push({ id: `s${k}`, x: 34, y: 14 + k * 26 })
    if (k > 0) edges.push([`s${k - 1}`, `s${k}`])
    if (k > 0) {
      nodes.push({ id: `l${k}`, x: 66, y: 14 + k * 26 })
      edges.push([`s${k - 1}`, `l${k}`])
    }
  }
  return { tree: { nodes, edges }, longest: nodes.filter((n) => n.id.startsWith('s')).map((n) => n.id) }
}

// What the waiting list has to hold: BFS needs room for the widest level,
// DFS only for the path from the top down to where it has got to.
function TreeShapeVisual() {
  const bushy = bushyTree()
  const stringy = stringyTree()
  const mark = (ids) => Object.fromEntries(ids.map((id) => [id, 'queued']))

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 196"
        role="img"
        aria-label="Two trees. The first is wide and bushy, with four full levels, and its widest level holds 8 nodes, which is what a breadth-first search has to keep waiting at its fullest. The second is tall and thin, with a path of 6 nodes down its middle, which is what a depth-first search has to keep track of."
      >
        <g transform="translate(8 6)">
          <TreeNodes tree={bushy.tree} states={mark(bushy.widest)} r={6.5} labels={false} />
        </g>
        <g transform="translate(190 6)">
          <TreeNodes tree={stringy.tree} states={mark(stringy.longest)} r={6.5} labels={false} />
        </g>
        <text x="83" y="150" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">wide and bushy</text>
        <text x="83" y="166" fontSize="10.5" textAnchor="middle" fill="var(--text)">BFS holds a whole level: 8</text>
        <text x="257" y="170" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">tall and thin</text>
        <text x="257" y="186" fontSize="10.5" textAnchor="middle" fill="var(--text)">DFS holds a whole path: 6</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#ffe27a' }} /> what the queue or stack has to hold at its fullest</li>
      </ul>
    </div>
  )
}

export { TreeVocabVisual, TreeOrderVisual, TreeShapeVisual }
