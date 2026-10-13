import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import BinaryTreeTracer from './BinaryTreeTracer.jsx'
import { TreeShapesVisual, ArrayTreeVisual, TreeHeightVisual } from './BinaryTreeVisuals.jsx'

const shapes = [
  { name: 'Full', rule: 'Every node has either 0 or 2 children, never exactly 1.', note: 'No node is left half-finished. A full tree always has one more leaf than it has inner nodes.' },
  { name: 'Perfect', rule: 'Every inner node has 2 children and all the leaves are on the same level.', note: 'The tree is a neat triangle, completely filled in. Its size is always 1, 3, 7, 15, 31, …' },
  { name: 'Complete', rule: 'Every level is full except maybe the last, which is filled from the left.', note: 'No gaps. This is the shape that fits in a plain list, and the shape of a heap.' },
  { name: 'Balanced', rule: 'For every node, the left and right sides differ in height by at most 1.', note: 'Nothing is stretched out. This is what keeps search fast in the trees to come.' },
  { name: 'Skewed', rule: 'Every node has only one child, always on the same side.', note: 'It has turned into a linked list. The worst case for everything in this page.' },
]

const growth = [
  { height: '0', most: '1', formula: '2¹ − 1' },
  { height: '1', most: '3', formula: '2² − 1' },
  { height: '2', most: '7', formula: '2³ − 1' },
  { height: '3', most: '15', formula: '2⁴ − 1' },
  { height: '10', most: '2,047', formula: '2¹¹ − 1' },
  { height: '20', most: '2,097,151', formula: '2²¹ − 1' },
  { height: '30', most: '2,147,483,647', formula: '2³¹ − 1' },
]

const operations = [
  { op: 'Read the root, or step from a node to its child', time: 'O(1)', why: 'You are already holding the node, and the child is one link away.' },
  { op: 'Search for a value', time: 'O(n)', why: 'Nothing says where a value is, so you may have to visit every node.' },
  { op: 'Add a node in the next free spot (linked nodes)', time: 'O(n)', why: 'You have to scan level by level to find the first gap.' },
  { op: 'Add a node in the next free spot (list form)', time: 'O(1) avg', why: 'The next free spot is simply the end of the list.' },
  { op: 'Find the height, count the nodes, copy the tree', time: 'O(n)', why: 'Each one needs a look at every node, just like a traversal.' },
  { op: 'Delete a value', time: 'O(n)', why: 'Finding it is the slow part, since the tree is not ordered.' },
]

const properties = [
  { prop: 'Children per node', value: 'at most 2', why: 'Called left and right. Either can be missing.' },
  { prop: 'Left and right matter', value: 'Yes', why: 'Swapping them gives a different tree, with a different traversal order.' },
  { prop: 'Order of the values', value: 'none', why: 'Any value can sit anywhere. Order comes from extra rules, such as in a search tree.' },
  { prop: 'Height', value: 'log₂ n up to n − 1', why: 'Perfectly balanced at best, a single chain at worst.' },
  { prop: 'Space for n nodes', value: 'O(n)', why: 'One value, plus two links in the linked form.' },
]

const builtins = [
  { op: 'node.left  (linked form)', time: 'O(1)', why: 'Following a link is one step.' },
  { op: 'tree[2 * i + 1]  (list form)', time: 'O(1)', why: 'The child’s position is arithmetic, so it is a plain list lookup.' },
  { op: 'tree.append(x)  (list form)', time: 'O(1) avg', why: 'Adds the next node at the next free position.' },
  { op: 'heapq.heappush(heap, x)', time: 'O(log n)', why: 'Python’s heapq is a complete binary tree stored in a list. A push bubbles up at most one level at a time, so at most height steps.' },
]

const examples = [
  {
    id: 'count',
    prompt: 'Counting all the nodes of a balanced binary tree with n nodes using recursion.',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Every node is counted once. The recursion only goes as deep as the tree is tall, and a balanced tree is about log n tall.',
  },
  {
    id: 'height-chain',
    prompt: 'Finding the height of a skewed binary tree with n nodes (a chain) with the recursive height function.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'It still visits each node once, but the chain is n deep, so n calls are waiting on the call stack at the bottom.',
  },
  {
    id: 'search-unordered',
    prompt: 'Searching an ordinary, unordered binary tree of n nodes for a value, level by level with a queue (a complete tree).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'No ordering means no shortcuts, so every node may be checked. The queue holds a whole level, about half the nodes at the bottom.',
  },
  {
    id: 'root',
    prompt: 'Reading the value stored at the root of a binary tree with n nodes.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The root is the one node you always start with. No walking needed.',
  },
  {
    id: 'array-child',
    prompt: 'Finding the left child of the node at position i when a binary tree is stored in a list.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'It is at position 2i + 1. One bit of arithmetic and one list lookup.',
  },
  {
    id: 'array-skewed',
    prompt: 'Storing a skewed tree of n nodes (a chain) in the list form, where every missing child still takes up a slot.',
    time: 'O(2ⁿ)',
    space: 'O(2ⁿ)',
    explanation: 'Each level down doubles the positions the list must reserve, so the list needs about 2ⁿ slots to hold just n nodes. The list form only suits trees that are nearly complete.',
  },
  {
    id: 'path-balanced',
    prompt: 'Walking from the root down to one particular leaf of a balanced binary tree with n nodes.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The path is only as long as the tree is tall, which is about log n when it is balanced. Following links takes no extra space.',
  },
  {
    id: 'insert-open',
    prompt: 'Adding a node in the first free spot of a linked binary tree of n nodes (found by scanning level by level).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'In the worst case the scan passes every node before it finds the gap, and the queue it uses holds up to a whole level.',
  },
]

function BinaryTrees() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Tree Data Structures</p>
      <h2>Binary Trees</h2>
      <p>
        Think back to binary search. Every check split the list in two:
        look in the left half or the right half. Draw every choice you could
        ever make and you get a tree where each node has two ways onward.
        That is a <strong>binary tree</strong>: a tree in which every node
        has at most two children. It is the shape underneath search trees,
        heaps, expression trees and more, so it pays to understand it well
        before the trees that build on it.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Binary Trees &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A tree where every node has <strong>at most two</strong> children: a left and a right.</li>
                <li>Either child can be missing (<code>None</code>).</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Data that splits into two at each step: yes or no, smaller or larger, left or right.</li>
                <li>A fixed, simple shape that is easy to store and to code.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Each node is the root of two smaller binary trees.</li>
                <li>So almost every job is the same: do one thing here, then repeat on the left and on the right.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it is stored</h4>
              <ul>
                <li><strong>Linked:</strong> a node object with <code>value</code>, <code>left</code> and <code>right</code>.</li>
                <li><strong>List:</strong> children of position <code>i</code> are at <code>2i + 1</code> and <code>2i + 2</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. The shapes</h4>
              <ul>
                <li><strong>Full</strong>, <strong>perfect</strong>, <strong>complete</strong>, <strong>balanced</strong>, <strong>skewed</strong>.</li>
                <li>Height runs from <code>log&#8322; n</code> (balanced) to <code>n &minus; 1</code> (a chain).</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Most operations cost <code>O(h)</code>, the height.</li>
                <li>Balanced: <code>O(log n)</code>. Skewed: <code>O(n)</code>.</li>
                <li>Visiting every node: <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>A plain binary tree has no order, so searching it is <code>O(n)</code>.</li>
                <li>The shape can go wrong and quietly become a list.</li>
                <li>The list form wastes space on sparse trees.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Every decision has two outcomes.</li>
                <li>You are building a search tree, a heap or an expression tree.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>A binary tree is <strong>not</strong> automatically a search tree.</li>
                <li>Height counts steps (edges), so a single node has height <code>0</code>.</li>
                <li>Balanced does not mean perfect or complete.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>What Makes a Tree Binary?</h3>
        <p>
          One rule: <strong>no node has more than two children</strong>. A
          node can have none (a leaf), one, or two. Those two have names,{' '}
          <strong>left</strong> and <strong>right</strong>, and the names
          matter. A node with only a left child and a node with only a
          right child are different trees. If you mirrored a tree, you
          would get a different tree, and its traversals would come out in a
          different order.
        </p>
        <p>
          Every node is also the top of two smaller binary trees, its{' '}
          <strong>left subtree</strong> and <strong>right subtree</strong>,
          and either one can be empty. That is why binary trees and
          recursion fit together so well: a job on a tree is one step here
          plus the same job on two smaller trees. You saw that with the
          traversals on the last page, and you will see it again below.
        </p>
        <p>
          The tree has no rule about the values themselves. A bigger value
          might sit above, below or beside a smaller one. When we add rules
          about order, we get a search tree or a heap. A plain binary tree is
          just the shape.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Shapes of a Binary Tree</h3>
        <p>
          The same number of nodes can be arranged in many ways, and people
          have given names to the shapes that come up most. You will see
          these words again, so it is worth learning them now.
        </p>
        <TreeShapesVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Shape</th>
                <th>The rule</th>
                <th>Worth knowing</th>
              </tr>
            </thead>
            <tbody>
              {shapes.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.rule}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The shapes overlap. Every perfect tree is also full, complete and
          balanced, and every complete tree is balanced. The reverse is not
          true: the balanced example above is neither full nor complete.
          The one to keep an eye on is the last, because a skewed tree is
          what a binary tree turns into when nothing keeps it in shape.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Doubling Trick</h3>
        <p>
          Here is the fact that makes binary trees powerful. Each level can
          hold <strong>twice as many nodes</strong> as the one above: 1 at
          the root, up to 2 on the next level, then 4, 8, 16, and so on. So
          a tree of height <code>h</code> holds at most{' '}
          <code>2<sup>h+1</sup> &minus; 1</code> nodes. The height grows by
          one each time the size doubles.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Height</th>
                <th>Most nodes it can hold</th>
                <th>Formula</th>
              </tr>
            </thead>
            <tbody>
              {growth.map((row) => (
                <tr key={row.height}>
                  <td><strong>{row.height}</strong></td>
                  <td>{row.most}</td>
                  <td><code>{row.formula}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Turn it around: <code>n</code> nodes can be packed into a tree of
          height about <code>log&#8322; n</code>. Two billion nodes fit in 30
          levels. That is the same logarithm you met in binary search, and
          it is why a balanced tree is so quick to travel down. The catch is
          the other direction. The <em>same</em> n nodes can also be strung
          into a chain of height <code>n &minus; 1</code>. So the height of a
          binary tree with n nodes is somewhere between{' '}
          <code>log&#8322; n</code> and <code>n &minus; 1</code>, and the
          shape decides which.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Two Ways to Store One</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              The usual way is <strong>linked nodes</strong>: each node is a
              small object holding a value and a link to each child (the{' '}
              <code>Node</code> class from the last page). It copes with any
              shape and grows one node at a time.
            </p>
            <p>
              The other way is a plain <strong>list</strong>. Number the
              nodes level by level, left to right, starting at 0, and put
              each node at its own number. Then no links are needed: the
              children of position <code>i</code> are at{' '}
              <code>2i + 1</code> and <code>2i + 2</code>, and its parent is
              at <code>(i &minus; 1) // 2</code>. It is compact and quick,
              and it is exactly how heap sort kept its tree inside a list.
            </p>
          </div>
          <ArrayTreeVisual />
        </div>
        <div className="code-block">
          <code>{`# list form of the tree above
tree = ['A', 'B', 'C', 'D', 'E', 'F']

i = 1                    # the node 'B'
tree[2 * i + 1]          # 'D'  -> its left child
tree[2 * i + 2]          # 'E'  -> its right child
tree[(i - 1) // 2]       # 'A'  -> its parent`}</code>
        </div>
        <p>
          The list form has one weakness: every missing child still takes up
          a position. A complete tree has no gaps, so nothing is wasted. A
          skewed one is almost all gaps. A chain of only 30 nodes would need
          a list with hundreds of millions of positions to hold them. So the
          list form is for complete trees, and linked nodes are for the
          rest.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself: Finding the Height</h3>
        <p>
          Here is a short recursive function on a binary tree. The height of
          a tree is one more than the taller of its two sides, and the height
          of an empty tree is <code>-1</code>, so that a lone node comes out
          at <code>0</code>. Press <strong>Play</strong> and the highlighted
          line is the one running now. The blue node is the call that is
          running, yellow nodes have a call waiting for an answer, and when a
          node works out its height, the answer is written on it in a grey
          circle. The <strong>call stack</strong> below the tree shows the
          calls that are open.
        </p>
        <BinaryTreeTracer />
        <p>
          Watch how the answers flow upward: the leaves answer first, and
          each parent combines its two children&rsquo;s answers into its own.
          Try the three trees. The <strong>balanced tree</strong> comes out
          at 2 and the call stack stays shallow, about as deep as the tree
          is tall.
          The <strong>chain</strong> has fewer nodes but a height of 4, and
          its call stack grows to the full length of the chain before the
          first answer comes back. Same function, same <code>O(n)</code>{' '}
          time, but very different memory.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Binary Trees in One Breath</h3>
        <div className="definition">
          A binary tree is a tree in which every node has at most two
          children, a left and a right, either of which may be missing.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. A plain binary tree has no
              order, so there is nothing to narrow a search with. Anything
              that has to look at every node (searching, counting, copying,
              finding the height) costs <code>O(n)</code>. That is the same
              as a plain list.
            </p>
            <p>
              What a binary tree gives you is the <em>shape</em>. Anything
              that goes down one path, from the root to a node, costs{' '}
              <code>O(h)</code>, the height. Here are the same seven nodes
              arranged two ways. Balanced, the longest way down is 3 nodes.
              As a chain, it is 7. The shape decides whether{' '}
              <code>O(h)</code> means <code>O(log n)</code> or{' '}
              <code>O(n)</code>, and that is the whole reason the later trees
              care so much about staying balanced.
            </p>
          </div>
          <TreeHeightVisual />
        </div>
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
              {operations.map((row) => (
                <tr key={row.op}>
                  <td>{row.op}</td>
                  <td><code>{row.time}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          Python has no built-in binary tree type; you write the{' '}
          <code>Node</code> class yourself. The nearest thing it ships is{' '}
          <code>heapq</code>, which is a binary tree in list form:
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
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>Every step is a choice between two.</strong> A yes/no
          question game, a decision tree, the brackets of a tournament where
          every match has two players: these are binary trees by nature.
        </p>
        <p>
          <strong>You are building something on top of it.</strong> A binary
          search tree adds an order rule, a heap adds a parent-versus-child
          rule, and an AVL tree adds a balance rule. Each one is a binary
          tree plus a promise, and each promise buys back the speed that a
          plain binary tree lacks.
        </p>
        <p>
          <strong>The data is an expression or a hierarchy of operations.</strong>{' '}
          <code>(2 + 3) * 4</code> becomes a tree with the operator at the
          top and two operands below. Compilers and calculators work this way,
          and a post-order walk evaluates it.
        </p>
        <p>
          <strong>You need compact codes.</strong> Huffman coding, which
          powers file compression, builds a binary tree where the path to
          each letter (left is 0, right is 1) is its code.
        </p>
        <p>
          <strong>Skip it when a simpler tool does the job.</strong> To find
          a value by key, a dict does it in <code>O(1)</code>. To keep items
          in order that you only append to, a list is enough. A plain,
          unordered binary tree on its own rarely beats those.
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

export default BinaryTrees
