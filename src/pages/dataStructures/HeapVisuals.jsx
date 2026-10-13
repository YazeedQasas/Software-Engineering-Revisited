import TreeView, { TreeNodes } from '../../components/TreeView.jsx'
import { heapShape } from './binaryTrees.js'

// A heap's values laid out as a tree, position i with its children at 2i + 1 and 2i + 2.
function heapTree(values, options) {
  const shape = heapShape(values.map((_, i) => i), options)
  return { ...shape, nodes: shape.nodes.map((node, i) => ({ ...node, label: String(values[i]) })) }
}

function ArrayRow({ values }) {
  return (
    <div className="cell-row" aria-hidden="true">
      {values.map((value, i) => (
        <span key={i}>
          {value}
          <i>{i}</i>
        </span>
      ))}
    </div>
  )
}

const MIN_HEAP = [1, 3, 2, 7, 4, 5, 6]
const MAX_HEAP = [7, 4, 6, 1, 3, 2, 5]

// The same seven numbers arranged as a min-heap and as a max-heap, each also
// shown as the plain list it is stored in.
function HeapRuleVisual() {
  const options = { width: 300, height: 110, gap: 32, top: 18 }

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <figure>
          <TreeView
            tree={heapTree(MIN_HEAP, options)}
            states={{ h0: 'active' }}
            r={15}
            ariaLabel="A min-heap holding 1, 3, 2, 7, 4, 5, 6. The smallest, 1, is at the top. Every parent is smaller than its children: 1 is below both 3 and 2, 3 is below 7 and 4, and 2 is below 5 and 6."
          />
          <ArrayRow values={MIN_HEAP} />
          <figcaption>
            Min-heap
            <span>every parent is smaller than its children, so the smallest is on top</span>
          </figcaption>
        </figure>
        <figure>
          <TreeView
            tree={heapTree(MAX_HEAP, options)}
            states={{ h0: 'active' }}
            r={15}
            ariaLabel="A max-heap holding 7, 4, 6, 1, 3, 2, 5. The largest, 7, is at the top. Every parent is larger than its children: 7 is above 4 and 6, 4 is above 1 and 3, and 6 is above 2 and 5."
          />
          <ArrayRow values={MAX_HEAP} />
          <figcaption>
            Max-heap
            <span>every parent is larger than its children, so the largest is on top</span>
          </figcaption>
        </figure>
      </div>
      <ul className="visual-legend">
        <li>the same seven numbers, and under each tree the plain list it is stored in</li>
        <li>siblings are in no particular order: 3 and 2 are the wrong way round for a sorted list</li>
      </ul>
    </div>
  )
}

// Why building a heap is O(n): most nodes are near the bottom and barely move.
function HeapifyCostVisual() {
  const shape = heapShape([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], { width: 150, gap: 30, top: 14, height: 140 })
  const states = {}
  shape.nodes.forEach((node, i) => {
    const level = Math.floor(Math.log2(i + 1))
    states[node.id] = ['active', 'queued', 'found', 'plain'][level]
  })
  const rows = [
    { count: 1, moves: 3 },
    { count: 2, moves: 2 },
    { count: 4, moves: 1 },
    { count: 8, moves: 0 },
  ]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 176"
        role="img"
        aria-label="A heap of 15 nodes in four levels. The one node at the top might sink 3 levels, the 2 below it 2 levels, the 4 below them 1 level, and the 8 leaves at the bottom 0 levels. In total at most 3 plus 4 plus 4 plus 0, which is 11 moves, far fewer than 15 times 3."
      >
        <g transform="translate(6 6)">
          <TreeNodes tree={shape} states={states} r={8} labels={false} />
        </g>
        {rows.map(({ count, moves }, level) => (
          <text key={level} x="172" y={24 + level * 30} fontSize="11.5" fill="var(--text-h)">
            {count} {count === 1 ? 'node' : 'nodes'} &times; up to {moves} {moves === 1 ? 'move' : 'moves'} = {count * moves}
          </text>
        ))}
        <line x1="172" y1="124" x2="330" y2="124" stroke="var(--border)" strokeWidth="1" />
        <text x="172" y="142" fontSize="12" fontWeight="700" fill="var(--text-h)">at most 11 moves in all</text>
        <text x="172" y="159" fontSize="10.5" fill="var(--text)">not 15 &times; 3 = 45</text>
      </svg>
      <ul className="visual-legend">
        <li>a node can sink at most as far as the bottom, and half the nodes are already there</li>
      </ul>
    </div>
  )
}

export { HeapRuleVisual, HeapifyCostVisual }
