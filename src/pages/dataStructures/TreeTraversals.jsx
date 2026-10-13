import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import TreeTraversalTracer from './TreeTraversalTracer.jsx'
import { TraversalMomentsVisual, TraversalOrderVisual, TraversalDepthVisual } from './TreeTraversalVisuals.jsx'
import { BALANCED, walk } from './traversalTrees.js'

const orders = [
  { name: 'Pre-order', rule: 'node, left, right', mnemonic: 'the node comes before its subtrees', output: walk(BALANCED, 'pre').join(' ') },
  { name: 'In-order', rule: 'left, node, right', mnemonic: 'the node comes in between', output: walk(BALANCED, 'in').join(' ') },
  { name: 'Post-order', rule: 'left, right, node', mnemonic: 'the node comes after its subtrees', output: walk(BALANCED, 'post').join(' ') },
]

const uses = [
  { name: 'Pre-order', use: 'Copying a tree, saving it to a file, printing a folder structure', why: 'A parent always appears before its children, so you can rebuild the tree by reading the output in order.' },
  { name: 'In-order', use: 'Reading a binary search tree in sorted order', why: 'Everything smaller is on the left and everything larger on the right, so left, node, right comes out ascending.' },
  { name: 'Post-order', use: 'Deleting a tree, adding up folder sizes, evaluating an expression', why: 'You need the answer from both children before you can finish the parent.' },
]

const properties = [
  { prop: 'Time', value: 'O(n)', why: 'Every node is visited once, and every edge is crossed twice: down, then back up.' },
  { prop: 'Extra space', value: 'O(h)', why: 'One open call per level on the way down, where h is the height of the tree.' },
  { prop: 'Balanced tree', value: 'h ≈ log n', why: 'The stack is shallow: a million nodes need only about 20 calls open at once.' },
  { prop: 'Lopsided tree', value: 'h up to n', why: 'A chain of n nodes needs n calls open at once.' },
  { prop: 'Recursion limit', value: '≈ 1,000 calls in Python', why: 'A very deep tree needs an explicit stack instead.' },
  { prop: 'Output list', value: 'O(n)', why: 'If you collect the values rather than print them, the list holds all n.' },
]

const builtins = [
  { op: 'result.append(node.value)  (one shared list)', time: 'O(1) avg', why: 'Adds to the end. Recommended: every call writes into the same list.' },
  { op: 'return left + [node.value] + right', time: 'O(n) per call', why: 'Builds a brand-new list at every node. Total O(n log n) for a balanced tree and O(n²) for a chain.' },
  { op: 'stack.append(node)  and  stack.pop()', time: 'O(1) avg', why: 'The stack for the loop version of a traversal: constant work at the end of a list.' },
  { op: 'result.insert(0, x)', time: 'O(n)', why: 'Adds at the front, shifting everything else along. Avoid it to reverse an order.' },
]

const examples = [
  {
    id: 'inorder-balanced',
    prompt: 'Recursive in-order traversal printing every value of a balanced binary tree with n nodes (not counting the output).',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Each node is visited once. The call stack only goes as deep as the tree is tall, which is about log n when it is balanced.',
  },
  {
    id: 'preorder-chain',
    prompt: 'Recursive pre-order traversal of a tree with n nodes where every node has only a left child (a chain), not counting the output.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Still n nodes to visit, but the tree is n levels tall, so n calls are open at the deepest point.',
  },
  {
    id: 'collect',
    prompt: 'Post-order traversal of a balanced tree with n nodes that appends each value to one shared result list, counting the list.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each append is O(1) and each node is visited once. The result list ends up holding all n values.',
  },
  {
    id: 'concat',
    prompt: 'In-order traversal of a balanced tree with n nodes written as return left + [node.value] + right, so each call builds a new list.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Every level of the tree copies about n values into new lists, and there are log n levels. The biggest list holds all n.',
  },
  {
    id: 'bst-sort',
    prompt: 'Sorting n values by inserting them into a balanced binary search tree, then reading it in-order.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'n inserts of O(log n) each, then an O(n) in-order walk. The tree stores all n values.',
  },
  {
    id: 'level-order',
    prompt: 'Level-order (breadth-first) traversal of a complete binary tree with n nodes, for comparison.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Every node is visited once, but the queue has to hold a whole level, and the bottom level of a complete tree is about half the nodes.',
  },
  {
    id: 'delete',
    prompt: 'Deleting a balanced tree of n nodes with a post-order walk that frees the children before each parent.',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'One visit per node, and the recursion is only as deep as the tree is tall.',
  },
  {
    id: 'expression',
    prompt: 'Evaluating an expression tree of n nodes (numbers at the leaves, operators inside) with a post-order walk, balanced.',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Each node is combined once, after both of its operands are ready, and the calls only go as deep as the tree.',
  },
]

function TreeTraversals() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Tree Data Structures</p>
      <h2>Tree Traversals (In / Pre / Post-Order)</h2>
      <p>
        On the last page we searched a tree for a value. A{' '}
        <strong>traversal</strong> is the same walk with a different goal:
        visit every node exactly once, in a well-defined order, and do
        something with each one (print it, add it up, copy it, delete it).
        The order is the whole point. Three orders show up everywhere, and
        they differ only in <em>when</em> you say hello to a node: before its
        children, between them, or after them.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Tree Traversals &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What they are</h4>
              <ul>
                <li>Three ways to visit every node of a binary tree, all depth-first.</li>
                <li><strong>Pre-order:</strong> node, left, right.</li>
                <li><strong>In-order:</strong> left, node, right.</li>
                <li><strong>Post-order:</strong> left, right, node.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem they solve</h4>
              <ul>
                <li>&ldquo;Do something to every node&rdquo;, such as print, copy, count or delete.</li>
                <li>The order matters: some jobs need parents first, some need children first, and a search tree needs left-to-right.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Every node is a root of its own smaller tree.</li>
                <li>Walk the left subtree, walk the right subtree, and visit the node at one of three moments.</li>
                <li>The only thing that changes is <strong>where the visit line sits</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How they work</h4>
              <ul>
                <li>If the node is <code>None</code>, return.</li>
                <li>Otherwise do three things in the right order: visit, go left, go right.</li>
                <li>Left always comes before right.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li>No best or worst case: every node is visited whatever the shape.</li>
                <li>A full traversal always takes <code>n</code> visits.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(n)</code>.</li>
                <li>Space: <code>O(h)</code> for the call stack: <code>O(log n)</code> balanced, <code>O(n)</code> for a chain.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Nothing is skipped, so a traversal is never faster than <code>O(n)</code>.</li>
                <li>Recursion is short but limited by the call stack depth.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use them when</h4>
              <ul>
                <li><strong>Pre:</strong> copy or save a tree, parents first.</li>
                <li><strong>In:</strong> read a BST in sorted order.</li>
                <li><strong>Post:</strong> delete a tree or combine children into their parent.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Forgetting the <code>None</code> check: it crashes on every leaf.</li>
                <li>In-order is only sorted for a <strong>binary search tree</strong>.</li>
                <li>Building new lists inside the recursion makes it slower than <code>O(n)</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>First, a Binary Tree</h3>
        <p>
          The trees on the last page could have any number of children. All
          three traversals need a tree where every node has <strong>at most
          two</strong>, called its <strong>left</strong> child and{' '}
          <strong>right</strong> child, either of which can be missing. That
          is a <strong>binary tree</strong>. Left and right are not
          interchangeable: swapping them changes the order of the output.
        </p>
        <p>In Python, each node is a small object holding its value and its two children:</p>
        <div className="code-block">
          <code>{`class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left        # None means "no left child"
        self.right = right

#        4
#      /   \\
#     2     6
#    / \\   / \\
#   1   3 5   7
tree = Node(4,
            Node(2, Node(1), Node(3)),
            Node(6, Node(5), Node(7)))`}</code>
        </div>
        <p>
          The values here are chosen so that everything to the left of a
          node is smaller and everything to the right is larger. That kind
          of tree is a <strong>binary search tree</strong>, and we will meet
          it properly soon. Keep it in mind for the in-order walk.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Idea: When Do You Visit the Node?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Every node is the top of its own little tree: a node, a left
              subtree and a right subtree. To traverse it you have three
              jobs: <strong>visit the node</strong>, <strong>traverse the
              left subtree</strong> and <strong>traverse the right
              subtree</strong>. The subtrees are done by calling the very
              same function again, which is why this is naturally recursive.
            </p>
            <p>
              The only real choice is when to visit the node. Do it first
              and you get <strong>pre</strong>-order. Do it between the two
              subtrees and you get <strong>in</strong>-order. Do it last and
              you get <strong>post</strong>-order. The word tells you where
              the node sits relative to its children.
            </p>
          </div>
          <TraversalMomentsVisual />
        </div>
        <p>
          Here is that choice on a real tree. All three start at the root and
          keep to the left whenever they can, so they walk the same route
          around the tree. They simply write a node down at a different
          moment on that walk.
        </p>
        <TraversalOrderVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Rule</th>
                <th>Easy way to remember</th>
                <th>Output on this tree</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.rule}</td>
                  <td>{row.mnemonic}</td>
                  <td><code>{row.output}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Notice that in-order printed <code>1 2 3 4 5 6 7</code>: sorted. That
          is not a coincidence, and it is the best-known trick in this
          topic. Also notice that the depth-first search from the last page
          was a pre-order walk: it took each node before its children.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Code: Three Lines in a Different Order</h3>
        <p>
          All three functions are the same function. Here it is once, with
          the three places the visit can go:
        </p>
        <div className="code-block">
          <code>{`def traverse(node):
    if node is None:               # nothing here: stop
        return
    # PRE-ORDER:  visit the node here
    traverse(node.left)
    # IN-ORDER:   visit the node here
    traverse(node.right)
    # POST-ORDER: visit the node here`}</code>
        </div>
        <p>
          The <code>if node is None</code> line is the <strong>base
          case</strong>. It is what stops the recursion: every branch ends at
          a missing child, and when a call reaches one it returns to the
          caller, which carries on with its next line.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Pick an order, then press <strong>Play</strong>. The highlighted
          line is the one running right now. The tree shows the blue node,
          whose call is running, and yellow nodes whose calls are waiting
          for a child to finish. Grey numbered nodes have been visited. Under
          the tree, the <strong>call stack</strong> grows each time a
          function calls itself and shrinks each time one returns, and{' '}
          <strong>Output</strong> shows what <code>print</code> has written so
          far. You can pause, step forward or back one line at a time, drag
          the slider to jump around, and change the speed.
        </p>
        <TreeTraversalTracer />
        <p>
          Switch between the three orders on the same tree and watch what
          stays the same: the route, and the way the call stack rises and
          falls. Only the moment a number lands in the output changes. In
          pre-order it is on the way down, in in-order it is when you come
          back up from the left, and in post-order it is on the way back up
          for the last time. Then try the <strong>Lopsided tree</strong>: a
          missing child is just a call that returns at once, and in-order is
          still sorted.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Tree Traversals in One Breath</h3>
        <div className="definition">
          A tree traversal visits every node of a binary tree exactly once by
          recursively walking the left and right subtrees. Pre-order visits a
          node before its subtrees, in-order between them, and post-order
          after both.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. Each node is visited once,
              and a visit is a constant amount of work, so the time is{' '}
              <code>O(n)</code>. All three orders cost the same, and so does
              every shape of tree: there is no lucky case, because nothing
              is skipped.
            </p>
            <p>
              The memory is the interesting part. Each time the function
              calls itself, the caller has to wait on the call stack for the
              callee to finish. The most calls ever open at once is the{' '}
              <em>height</em> of the tree, so the space is <code>O(h)</code>.
              A balanced tree of a million nodes is only about 20 deep. A
              chain of a thousand nodes is a thousand deep.
            </p>
          </div>
          <TraversalDepthVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td><code>{row.value}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          How you collect the results matters as much as the walk. A
          tempting way to write it quietly breaks the <code>O(n)</code>:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {builtins.map((row) => (
                <tr key={row.op}>
                  <td><code>{row.op}</code></td>
                  <td><code>{row.time}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          If recursion is too deep for a tree, any traversal can be written
          as a loop with an explicit stack of your own. It visits the same
          nodes in the same order and uses the same <code>O(h)</code> space,
          but it does not hit Python&rsquo;s recursion limit.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for Them When&hellip;</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Typical use</th>
                <th>Why it fits</th>
              </tr>
            </thead>
            <tbody>
              {uses.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.use}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>You want sorted output from a search tree (in-order).</strong>{' '}
          In a binary search tree the left side is smaller and the right side
          is larger, so visiting left, node, right yields the values in
          ascending order, with no sorting step at all.
        </p>
        <p>
          <strong>Parents must come before children (pre-order).</strong>{' '}
          Writing a tree to a file in pre-order means that when you read it
          back, each node appears after its parent and can be attached to it.
          A listing of a folder and everything inside it is also pre-order.
        </p>
        <p>
          <strong>A parent depends on its children (post-order).</strong>{' '}
          To delete a tree you must free the children before the parent. To
          total a folder&rsquo;s size you need each subfolder&rsquo;s size
          first. An expression tree such as <code>(2 + 3) * 4</code> holds
          numbers at the leaves and operators inside; walking it post-order
          gives <code>2 3 + 4 *</code>, which is exactly the order a
          calculator needs to evaluate it.
        </p>
        <p>
          <strong>You want to go level by level.</strong> None of these
          three does that. That is breadth-first (level-order) from the last
          page, which uses a queue.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Test Yourself</h3>
        <p>Guess the time (and space) complexity before revealing the answer.</p>
        <ComplexityQuiz examples={examples} />
      </section>
    </article>
  )
}

export default TreeTraversals
