import { useEffect, useState } from 'react'
import TreeView, { TreeNodes } from '../../components/TreeView.jsx'
import { BALANCED, shrink, walk } from './traversalTrees.js'

const PRE = '#8aa8ea'
const IN = '#ffe27a'
const POST = '#86d69f'

// One node with its two subtrees as triangles, and the three moments at which
// the node can be visited: before the subtrees, between them, or after both.
function TraversalMomentsVisual() {
  const marker = (x, y, n, fill) => (
    <g>
      <circle cx={x} cy={y} r="10" fill={fill} stroke="#1f2023" strokeWidth="1" />
      <text x={x} y={y + 4} fontSize="12" fontWeight="700" textAnchor="middle" fill="#1f2023">{n}</text>
    </g>
  )

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 196"
        role="img"
        aria-label="A node with its left subtree and right subtree drawn below it as two triangles. Three numbered markers show when the node can be visited: marker 1 on its left, before going into either subtree, is pre-order. Marker 2 underneath, between the two subtrees, is in-order. Marker 3 on its right, after both subtrees, is post-order."
      >
        <line x1="170" y1="40" x2="95" y2="92" stroke="#c4c4c2" strokeWidth="1.5" />
        <line x1="170" y1="40" x2="245" y2="92" stroke="#c4c4c2" strokeWidth="1.5" />
        <polygon points="95,92 45,158 145,158" fill="var(--bg)" stroke="#b9b9b6" strokeWidth="1.5" />
        <polygon points="245,92 195,158 295,158" fill="var(--bg)" stroke="#b9b9b6" strokeWidth="1.5" />
        <text x="95" y="146" fontSize="11" textAnchor="middle" fill="var(--text)">left subtree</text>
        <text x="245" y="146" fontSize="11" textAnchor="middle" fill="var(--text)">right subtree</text>
        <circle cx="170" cy="30" r="17" fill="var(--bg)" stroke="#b9b9b6" strokeWidth="1.5" />
        <text x="170" y="35" fontSize="14" fontWeight="700" textAnchor="middle" fill="var(--text-h)">node</text>
        {marker(128, 30, 1, PRE)}
        {marker(170, 70, 2, IN)}
        {marker(212, 30, 3, POST)}
        <text x="170" y="184" fontSize="11" textAnchor="middle" fill="var(--text)">left always comes before right</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: PRE }} /> 1: before the subtrees (pre-order)</li>
        <li><span className="swatch" style={{ background: IN }} /> 2: between them (in-order)</li>
        <li><span className="swatch" style={{ background: POST }} /> 3: after both (post-order)</li>
      </ul>
    </div>
  )
}

const HOLD_TICKS = 3
const COMPACT = shrink(BALANCED, 0.62)
const WALKS = [
  { kind: 'pre', title: 'Pre-order', sub: 'node, left, right', order: walk(BALANCED, 'pre') },
  { kind: 'in', title: 'In-order', sub: 'left, node, right', order: walk(BALANCED, 'in') },
  { kind: 'post', title: 'Post-order', sub: 'left, right, node', order: walk(BALANCED, 'post') },
]

// A looping animation of the three orders on the same tree. A numbered badge
// appears each time a node is visited.
function TraversalOrderVisual() {
  const total = BALANCED.nodes.length
  const [tick, setTick] = useState(0)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => setTick((t) => (t + 1) % (total + HOLD_TICKS)), 800)
    return () => clearInterval(timer)
  }, [reduceMotion, total])

  const shown = reduceMotion ? total : Math.min(tick + 1, total)

  return (
    <div className="visual-card">
      <div className="tree-trio">
        {WALKS.map(({ kind, title, sub, order }) => {
          const states = {}
          const badges = {}
          order.slice(0, shown).forEach((id, i) => {
            states[id] = i === shown - 1 && shown < total ? 'active' : 'checked'
            badges[id] = i + 1
          })
          return (
            <figure key={kind}>
              <TreeView
                tree={COMPACT}
                states={states}
                order={badges}
                r={15}
                ariaLabel={`${title} visits the nodes in this order: ${order.join(', ')}.`}
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
        <li>the number on each node is the order it was visited</li>
      </ul>
    </div>
  )
}

// A full tree four levels deep, drawn small with no labels.
function fullTree() {
  const width = 150
  const nodes = []
  const edges = []
  for (let level = 0; level < 4; level++) {
    const slots = 2 ** level
    for (let i = 0; i < slots; i++) {
      const index = slots - 1 + i
      nodes.push({ id: `n${index}`, x: ((i + 0.5) / slots) * width, y: 14 + level * 36 })
      if (index > 0) edges.push([`n${(index - 1) >> 1}`, `n${index}`])
    }
  }
  // The way down the left edge: 0, 1, 3, 7
  return { tree: { nodes, edges }, deepest: ['n0', 'n1', 'n3', 'n7'] }
}

// A chain where every node has just one child.
function chainTree() {
  const length = 8
  const nodes = []
  const edges = []
  for (let k = 0; k < length; k++) {
    nodes.push({ id: `c${k}`, x: 90 - k * 7, y: 14 + k * 20 })
    if (k > 0) edges.push([`c${k - 1}`, `c${k}`])
  }
  return { tree: { nodes, edges }, deepest: nodes.map((node) => node.id) }
}

// Recursion keeps one call open for every node on the way down, so what
// matters is how deep the tree is, not how many nodes it has.
function TraversalDepthVisual() {
  const full = fullTree()
  const chain = chainTree()
  const mark = (ids) => Object.fromEntries(ids.map((id) => [id, 'queued']))

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 196"
        role="img"
        aria-label="Two trees. The first has 15 nodes but is only four levels deep, so a recursive walk never has more than 4 calls open at once. The second is a chain of 8 nodes, each with one child, so a recursive walk ends up with all 8 calls open at once."
      >
        <g transform="translate(8 6)">
          <TreeNodes tree={full.tree} states={mark(full.deepest)} r={6.5} labels={false} />
        </g>
        <g transform="translate(190 6)">
          <TreeNodes tree={chain.tree} states={mark(chain.deepest)} r={6.5} labels={false} />
        </g>
        <text x="83" y="150" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">15 nodes, 4 levels</text>
        <text x="83" y="166" fontSize="10.5" textAnchor="middle" fill="var(--text)">at most 4 calls open</text>
        <text x="257" y="170" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">8 nodes, 8 levels</text>
        <text x="257" y="186" fontSize="10.5" textAnchor="middle" fill="var(--text)">8 calls open at once</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#ffe27a' }} /> calls waiting on the call stack at the deepest point</li>
      </ul>
    </div>
  )
}

export { TraversalMomentsVisual, TraversalOrderVisual, TraversalDepthVisual }
