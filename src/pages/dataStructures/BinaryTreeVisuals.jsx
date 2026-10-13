import TreeView, { TreeNodes } from '../../components/TreeView.jsx'
import { chainShape, heapShape } from './binaryTrees.js'

// The five named shapes of binary tree, drawn small. Node i of the array
// layout has children 2i + 1 and 2i + 2 (see heapShape).
const SHAPES = [
  {
    name: 'Full',
    sub: 'every node has 0 or 2 children',
    tree: heapShape([0, 1, 2, 5, 6]),
    alt: 'A full tree with 5 nodes: the root has two children, the left one is a leaf, and the right one has two leaves.',
  },
  {
    name: 'Perfect',
    sub: 'every level completely full',
    tree: heapShape([0, 1, 2, 3, 4, 5, 6]),
    alt: 'A perfect tree with 7 nodes: three completely full levels.',
  },
  {
    name: 'Complete',
    sub: 'full except the last level, filled from the left',
    tree: heapShape([0, 1, 2, 3, 4, 5]),
    alt: 'A complete tree with 6 nodes: the first two levels are full and the last level is filled from the left.',
  },
  {
    name: 'Balanced',
    sub: 'both sides of every node are about as tall',
    tree: heapShape([0, 1, 2, 3, 6]),
    alt: 'A balanced tree with 5 nodes: the root has two children, the left has a left child and the right has a right child.',
  },
  {
    name: 'Skewed',
    sub: 'every node has one child, so it is a list',
    tree: chainShape(5),
    alt: 'A skewed tree with 5 nodes: a single chain, each node with only one child.',
  },
]

// A gallery of the five shapes side by side.
function TreeShapesVisual() {
  return (
    <div className="visual-card">
      <div className="tree-grid">
        {SHAPES.map(({ name, sub, tree, alt }) => (
          <figure key={name}>
            <TreeView tree={tree} r={8.5} labels={false} ariaLabel={alt} />
            <figcaption>
              {name}
              <span>{sub}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

const LEVEL_TONE = ['active', 'queued', 'found']
const LEVEL_FILL = ['#8aa8ea', '#ffe27a', '#86d69f']

// A six-node tree and the same tree stored in a plain list: each node's
// position in the list is its badge, and each level gets a colour.
function ArrayTreeVisual() {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']
  const r = 15
  const nodes = []
  const edges = []
  const states = {}
  const order = {}
  letters.forEach((letter, i) => {
    const level = Math.floor(Math.log2(i + 1))
    const slots = 2 ** level
    nodes.push({ id: letter, x: ((i - (slots - 1) + 0.5) / slots) * 340, y: 24 + level * 46 })
    if (i > 0) edges.push([letters[(i - 1) >> 1], letter])
    states[letter] = LEVEL_TONE[level]
    order[letter] = i
  })
  const cell = 44
  const left = (340 - letters.length * cell) / 2

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 212"
        role="img"
        aria-label="A tree of six nodes, A to F, above the same six values stored in a list at positions 0 to 5. A is the root at position 0. B and C, its children, are at positions 1 and 2. D and E, the children of B, are at positions 3 and 4, and F, a child of C, is at position 5."
      >
        <TreeNodes tree={{ nodes, edges }} states={states} order={order} r={r} />
        {letters.map((letter, i) => {
          const level = Math.floor(Math.log2(i + 1))
          return (
            <g key={letter}>
              <rect x={left + i * cell} y="150" width={cell} height="34" fill={LEVEL_FILL[level]} stroke="#1f2023" strokeWidth="1" />
              <text x={left + i * cell + cell / 2} y="172" fontSize="14" fontWeight="700" textAnchor="middle" fill="#1f2023">{letter}</text>
              <text x={left + i * cell + cell / 2} y="200" fontSize="11" textAnchor="middle" fill="var(--text)">{i}</text>
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>the number on each node is its position in the list</li>
        <li>children of position <code>i</code> sit at <code>2i + 1</code> and <code>2i + 2</code></li>
      </ul>
    </div>
  )
}

// The same seven nodes arranged two ways. What matters is how many nodes sit
// on the longest way down, because that is how far most operations travel.
function TreeHeightVisual() {
  const balanced = heapShape([0, 1, 2, 3, 4, 5, 6], { width: 150 })
  const chain = chainShape(7, { width: 150, stepX: 17, stepY: 20 })
  const mark = (ids) => Object.fromEntries(ids.map((id) => [id, 'queued']))

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 196"
        role="img"
        aria-label="The same seven nodes arranged two ways. As a balanced tree it is three levels, so any node is at most 3 nodes down from the top, which is a height of 2. As a skewed chain it is seven levels, so the last node is 7 nodes down, which is a height of 6."
      >
        <g transform="translate(8 6)">
          <TreeNodes tree={balanced} states={mark(['h0', 'h1', 'h3'])} r={7.5} labels={false} />
        </g>
        <g transform="translate(190 6)">
          <TreeNodes tree={chain} states={mark(chain.nodes.map((node) => node.id))} r={7.5} labels={false} />
        </g>
        <text x="83" y="150" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">7 nodes, height 2</text>
        <text x="83" y="166" fontSize="10.5" textAnchor="middle" fill="var(--text)">3 nodes on the way down</text>
        <text x="257" y="170" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">7 nodes, height 6</text>
        <text x="257" y="186" fontSize="10.5" textAnchor="middle" fill="var(--text)">7 nodes on the way down</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#ffe27a' }} /> the longest way down from the root</li>
      </ul>
    </div>
  )
}

export { TreeShapesVisual, ArrayTreeVisual, TreeHeightVisual }
