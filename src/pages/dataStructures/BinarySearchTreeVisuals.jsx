import { useEffect, useState } from 'react'
import TreeView, { TreeNodes } from '../../components/TreeView.jsx'
import { BASE_VALUES, buildTree, layoutTree, makeNode } from './bst.js'
import { chainShape, heapShape } from './binaryTrees.js'

const BASE = layoutTree(buildTree(BASE_VALUES), { minLevels: 4 })

// The page's tree with the root's two sides coloured: everything on the left
// is smaller than 8 and everything on the right is larger.
function BstRuleVisual() {
  const states = { 8: 'active' }
  ;['3', '1', '6', '4', '7'].forEach((id) => { states[id] = 'queued' })
  ;['10', '14', '13'].forEach((id) => { states[id] = 'found' })

  return (
    <div className="visual-card">
      <TreeView
        tree={BASE}
        states={states}
        ariaLabel="A binary search tree with root 8. Everything in the left subtree, 3, 1, 6, 4 and 7, is smaller than 8. Everything in the right subtree, 10, 14 and 13, is larger than 8. The same rule holds again at every other node."
      />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#8aa8ea' }} /> a node: 8</li>
        <li><span className="swatch" style={{ background: '#ffe27a' }} /> all smaller than 8</li>
        <li><span className="swatch" style={{ background: '#86d69f' }} /> all larger than 8</li>
      </ul>
    </div>
  )
}

const VALID = layoutTree(makeNode(8, makeNode(3, makeNode(1), makeNode(6)), makeNode(10)))
const INVALID = layoutTree(makeNode(8, makeNode(3, makeNode(1), makeNode(9)), makeNode(10)))

// The classic mistake: checking only parent against child. 9 is fine next to
// its parent 3, but it is on the left of 8 and is bigger than 8.
function BstTrapVisual() {
  return (
    <div className="visual-card">
      <div className="tree-pair">
        <figure>
          <TreeView
            tree={VALID}
            ariaLabel="A valid search tree: 8 at the top, 3 and 10 below it, and 1 and 6 below 3. Everything on the left of 8 is smaller than 8."
          />
          <figcaption>
            A search tree
            <span>every node is on the correct side of every node above it</span>
          </figcaption>
        </figure>
        <figure>
          <TreeView
            tree={INVALID}
            states={{ 8: 'active', 9: 'bad' }}
            ariaLabel="Not a search tree: 9 is the right child of 3, which looks fine, but 9 is on the left side of 8 and is bigger than 8."
          />
          <figcaption>
            Not a search tree
            <span>9 is bigger than its parent 3, but it is on the left of 8</span>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

// Looking for 6, frame by frame. A faded node is ruled out, and so is the
// whole side of the tree that was skipped.
const FRAMES = [
  { active: '8', out: [] },
  { active: '3', out: ['8', '10', '14', '13'] },
  { active: '6', out: ['8', '10', '14', '13', '3', '1'] },
  { found: '6', out: ['8', '10', '14', '13', '3', '1'] },
]
const HOLD_TICKS = 3

// A looping animation of the idea: each comparison throws away a whole side.
function BstSearchVisual() {
  const [tick, setTick] = useState(0)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => setTick((t) => (t + 1) % (FRAMES.length + HOLD_TICKS)), 1000)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const frame = reduceMotion ? FRAMES[FRAMES.length - 1] : FRAMES[Math.min(tick, FRAMES.length - 1)]
  const states = {}
  frame.out.forEach((id) => { states[id] = 'checked' })
  if (frame.active) states[frame.active] = 'active'
  if (frame.found) states[frame.found] = 'found'

  return (
    <div className="visual-card">
      <TreeView
        tree={BASE}
        states={states}
        ariaLabel="Searching the tree for 6. 8 is checked first, and 6 is smaller, so the whole right side fades out. Then 3 is checked, and 6 is larger, so the left side of 3 fades out. Then 6 is checked and it matches."
      />
      <ul className="visual-legend">
        <li>looking for <strong>6</strong>: three comparisons, and most of the tree never touched</li>
      </ul>
    </div>
  )
}

// The same seven values stored two ways, with labels added to the unlabelled
// shapes from the binary trees page.
function labelled(tree, values) {
  return { ...tree, nodes: tree.nodes.map((node, i) => ({ ...node, label: String(values[i]) })) }
}

// Insertion order decides the shape. Searching for 7 shows what that costs.
function BstOrderVisual() {
  const balanced = labelled(heapShape([0, 1, 2, 3, 4, 5, 6], { width: 150 }), [4, 2, 6, 1, 3, 5, 7])
  const chain = labelled(chainShape(7, { width: 150, stepX: 16, stepY: 22 }), [1, 2, 3, 4, 5, 6, 7])
  const mark = (ids) => Object.fromEntries(ids.map((id) => [id, 'queued']))

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 196"
        role="img"
        aria-label="Two search trees holding the same seven values, 1 to 7. Inserted in the order 4, 2, 6, 1, 3, 5, 7, the tree is balanced and finding 7 takes 3 comparisons. Inserted in the order 1, 2, 3, 4, 5, 6, 7, every value goes to the right of the last, so the tree is a chain and finding 7 takes 7 comparisons."
      >
        <g transform="translate(8 6)">
          <TreeNodes tree={balanced} states={mark(['h0', 'h2', 'h6'])} r={11} />
        </g>
        <g transform="translate(190 6)">
          <TreeNodes tree={chain} states={mark(chain.nodes.map((node) => node.id))} r={11} />
        </g>
        <text x="83" y="146" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">inserted 4 2 6 1 3 5 7</text>
        <text x="83" y="162" fontSize="10.5" textAnchor="middle" fill="var(--text)">finding 7: 3 comparisons</text>
        <text x="257" y="176" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--text-h)">inserted 1 2 3 4 5 6 7</text>
        <text x="257" y="192" fontSize="10.5" textAnchor="middle" fill="var(--text)">finding 7: 7 comparisons</text>
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#ffe27a' }} /> the nodes compared while searching for 7</li>
      </ul>
    </div>
  )
}

export { BstRuleVisual, BstTrapVisual, BstSearchVisual, BstOrderVisual }
