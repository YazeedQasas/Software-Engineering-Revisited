import TreeView, { TreeNodes } from '../../components/TreeView.jsx'
import { layoutTree } from './bst.js'
import { avlNode, balanceMarks } from './avl.js'
import { chainShape, heapShape } from './binaryTrees.js'

// A hand-built AVL-style tree laid out for TreeView, with its balance factors.
const draw = (root, options) => ({ tree: layoutTree(root, options), marks: balanceMarks(root) })

// A figure: a small tree with its balance factors written on it.
function Figure({ root, states, caption, sub, alt, options, r = 17 }) {
  const { tree, marks } = draw(root, options)
  return (
    <figure>
      <TreeView tree={tree} order={marks} states={states} r={r} ariaLabel={alt} />
      <figcaption>
        {caption}
        {sub && <span>{sub}</span>}
      </figcaption>
    </figure>
  )
}

// Gives the unlabelled shapes from the binary trees page their values.
function labelled(tree, values) {
  return { ...tree, nodes: tree.nodes.map((node, i) => ({ ...node, label: String(values[i]) })) }
}

// The same seven sorted values, inserted into a plain search tree and into an
// AVL tree. The AVL tree rotates its way back to a neat shape.
function AvlSortedVisual() {
  const avl = labelled(heapShape([0, 1, 2, 3, 4, 5, 6], { width: 150 }), [4, 2, 6, 1, 3, 5, 7])
  const chain = labelled(chainShape(7, { width: 150, stepX: 16, stepY: 22 }), [1, 2, 3, 4, 5, 6, 7])

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 196"
        role="img"
        aria-label="The values 1 to 7 inserted in that order. In a plain binary search tree every value goes to the right of the last, so the tree is a chain of height 6. In an AVL tree the same insertions are rebalanced as they happen, leaving a neat tree of height 2 with 4 at the top."
      >
        <g transform="translate(8 6)">
          <TreeNodes tree={chain} r={11} />
        </g>
        <g transform="translate(190 6)">
          <TreeNodes tree={avl} r={11} />
        </g>
        <text x="83" y="176" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">plain search tree: height 6</text>
        <text x="83" y="192" fontSize="10.5" textAnchor="middle" fill="var(--text)">searching for 7 takes 7 steps</text>
        <text x="257" y="146" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">AVL tree: height 2</text>
        <text x="257" y="162" fontSize="10.5" textAnchor="middle" fill="var(--text)">searching for 7 takes 3 steps</text>
      </svg>
      <ul className="visual-legend">
        <li>both were built by inserting 1, 2, 3, 4, 5, 6, 7 in that order</li>
      </ul>
    </div>
  )
}

// A valid AVL tree and one that has leaned too far, balance factors on each node.
function AvlBalanceVisual() {
  const valid = avlNode(30, avlNode(20), avlNode(40, null, avlNode(50)))
  const leaning = avlNode(30, avlNode(20, avlNode(10, avlNode(5))), avlNode(40))

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <Figure
          root={valid}
          options={{ minLevels: 4 }}
          caption="An AVL tree"
          sub="every number is −1, 0 or +1"
          alt="An AVL tree with root 30, children 20 and 40, and 50 below 40. The balance factors are 30: minus 1, 20: 0, 40: minus 1, 50: 0, all within the allowed range."
        />
        <Figure
          root={leaning}
          options={{ minLevels: 4 }}
          states={{ 20: 'bad', 30: 'bad' }}
          caption="Not an AVL tree"
          sub="20 and 30 are +2: too heavy on the left"
          alt="A tree that has leaned too far left: 30 at the top, 20 below it on the left, then 10 and 5 in a line. The balance factors of 20 and 30 are both plus 2, which is outside the allowed range."
        />
      </div>
      <ul className="visual-legend">
        <li>the number on each node is its balance factor: height of the left minus height of the right</li>
      </ul>
    </div>
  )
}

// The two single rotations, before and after.
function AvlRotationVisual() {
  const options = { minLevels: 3 }
  const done = avlNode(20, avlNode(10), avlNode(30))

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <Figure
          root={avlNode(30, avlNode(20, avlNode(10)))}
          options={options}
          states={{ 30: 'bad' }}
          caption="Left-left"
          sub="30 leans left in a straight line"
          alt="A chain leaning left: 30 at the top, 20 below it on the left, 10 below that on the left. 30 has a balance factor of plus 2."
        />
        <Figure
          root={done}
          options={options}
          states={{ 20: 'found' }}
          caption="Rotate right around 30"
          sub="20 moves up, 30 drops to its right"
          alt="After rotating right around 30: 20 is at the top with 10 on its left and 30 on its right. All balance factors are 0."
        />
        <Figure
          root={avlNode(10, null, avlNode(20, null, avlNode(30)))}
          options={options}
          states={{ 10: 'bad' }}
          caption="Right-right"
          sub="10 leans right in a straight line"
          alt="A chain leaning right: 10 at the top, 20 below it on the right, 30 below that on the right. 10 has a balance factor of minus 2."
        />
        <Figure
          root={done}
          options={options}
          states={{ 20: 'found' }}
          caption="Rotate left around 10"
          sub="20 moves up, 10 drops to its left"
          alt="After rotating left around 10: 20 is at the top with 10 on its left and 30 on its right. All balance factors are 0."
        />
      </div>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#f2a5a5' }} /> out of balance</li>
        <li><span className="swatch" style={{ background: '#86d69f' }} /> the new top of the rotated part</li>
      </ul>
    </div>
  )
}

// A bend needs two rotations: first straighten it, then rotate as before.
function AvlDoubleRotationVisual() {
  const options = { width: 240, minLevels: 3 }

  return (
    <div className="visual-card">
      <div className="tree-trio">
        <Figure
          root={avlNode(30, avlNode(10, null, avlNode(20)))}
          options={options}
          states={{ 30: 'bad' }}
          caption="Left-right"
          sub="the path bends: left, then right"
          alt="A bent tree: 30 at the top, 10 below it on the left, and 20 below 10 on the right. 30 has a balance factor of plus 2."
        />
        <Figure
          root={avlNode(30, avlNode(20, avlNode(10)))}
          options={options}
          states={{ 30: 'bad', 20: 'found' }}
          caption="Rotate left around 10"
          sub="the bend becomes a straight line"
          alt="After rotating left around 10: 30 at the top, 20 below on the left, 10 below that on the left. Now it is a straight line leaning left."
        />
        <Figure
          root={avlNode(20, avlNode(10), avlNode(30))}
          options={options}
          states={{ 20: 'found' }}
          caption="Rotate right around 30"
          sub="now the single rotation works"
          alt="After rotating right around 30: 20 at the top with 10 on its left and 30 on its right. All balance factors are 0."
        />
      </div>
      <ul className="visual-legend">
        <li>the mirror image (right-left) works the same way with left and right swapped</li>
      </ul>
    </div>
  )
}

// The thinnest AVL tree of each height: a tree that leans as much as the rule
// allows at every node. It has the fewest nodes any AVL tree of that height can have.
function AvlThinVisual() {
  const shapes = [
    { height: 1, nodes: 2, indices: [0, 1] },
    { height: 2, nodes: 4, indices: [0, 1, 2, 3] },
    { height: 3, nodes: 7, indices: [0, 1, 2, 3, 4, 5, 7] },
  ]

  return (
    <div className="visual-card">
      <div className="tree-trio">
        {shapes.map(({ height, nodes, indices }) => (
          <figure key={height}>
            <TreeView
              tree={heapShape(indices, { width: 200, height: 130 })}
              r={9}
              labels={false}
              ariaLabel={`The thinnest AVL tree of height ${height}, with ${nodes} nodes.`}
            />
            <figcaption>
              Height {height}
              <span>at least {nodes} nodes</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ul className="visual-legend">
        <li>each is a new root with the previous thinnest tree on one side and the one before that on the other, so the sizes grow like 2, 4, 7, 12, 20, 33&hellip;</li>
      </ul>
    </div>
  )
}

export { AvlSortedVisual, AvlBalanceVisual, AvlRotationVisual, AvlDoubleRotationVisual, AvlThinVisual }
