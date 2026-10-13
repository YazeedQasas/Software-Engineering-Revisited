import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import BinarySearchTreeTracer from './BinarySearchTreeTracer.jsx'
import { BstRuleVisual, BstTrapVisual, BstSearchVisual, BstOrderVisual } from './BinarySearchTreeVisuals.jsx'

const deleteCases = [
  { case: 'A leaf', example: '7', how: 'Just cut it off: its parent’s link becomes None.', why: 'Nothing hangs below it, so nothing else is affected.' },
  { case: 'One child', example: '10', how: 'Replace the node with its only child (and everything below that child).', why: 'The child’s whole subtree was already on the correct side of everything above, so it can slide up one place.' },
  { case: 'Two children', example: '3', how: 'Find the successor (the smallest value in the right subtree), copy it into this node, then delete the original from the right subtree.', why: 'The successor is the next value up, so it is bigger than everything on the left and no bigger than anything on the right. The order survives.' },
]

const operations = [
  { op: 'Search', balanced: 'O(log n)', skewed: 'O(n)', why: 'Each comparison drops one side of the tree, so you walk one path from the root.' },
  { op: 'Insert', balanced: 'O(log n)', skewed: 'O(n)', why: 'A search that ends by hanging the new value on the empty spot it ran into.' },
  { op: 'Delete', balanced: 'O(log n)', skewed: 'O(n)', why: 'Find the node, then at most one more walk down to find a successor.' },
  { op: 'Smallest or largest', balanced: 'O(log n)', skewed: 'O(n)', why: 'Keep going left (or right) until you cannot.' },
  { op: 'All values, in sorted order', balanced: 'O(n)', skewed: 'O(n)', why: 'An in-order traversal: it visits every node once and needs no sorting step.' },
]

const compare = [
  { name: 'Unsorted list', search: 'O(n)', insert: 'O(1)', remove: 'O(n)', order: 'No' },
  { name: 'Sorted list (with bisect)', search: 'O(log n)', insert: 'O(n)', remove: 'O(n)', order: 'Yes' },
  { name: 'Hash table (dict, set)', search: 'O(1) avg', insert: 'O(1) avg', remove: 'O(1) avg', order: 'No' },
  { name: 'Balanced search tree', search: 'O(log n)', insert: 'O(log n)', remove: 'O(log n)', order: 'Yes' },
  { name: 'Skewed search tree', search: 'O(n)', insert: 'O(n)', remove: 'O(n)', order: 'Yes' },
]

const properties = [
  { prop: 'Space for n values', value: 'O(n)', why: 'One node per value.' },
  { prop: 'Extra space while working', value: 'O(1) or O(h)', why: 'A loop needs only a pointer. Recursion keeps one call open per level.' },
  { prop: 'Height', value: 'log₂ n up to n − 1', why: 'It depends on the order the values were inserted in.' },
  { prop: 'In-order traversal', value: 'sorted', why: 'Left, node, right gives smallest to largest.' },
  { prop: 'Duplicates', value: 'usually none', why: 'The rule says smaller on the left and larger on the right, so equal values need a decision. Many trees just reject them.' },
]

const builtins = [
  { op: 'bisect.insort(sorted_list, x)', time: 'O(n)', why: 'Finding the spot is O(log n), but sliding the other items along is O(n). A balanced tree beats it for many inserts.' },
  { op: 'x in sorted_list  (even if sorted)', time: 'O(n)', why: 'Does not know the list is sorted. Use bisect to search it in O(log n).' },
  { op: 'x in my_set  /  my_dict[x]', time: 'O(1) avg', why: 'Faster than a tree for plain lookups, but has no sorted order.' },
  { op: 'sorted(my_set)', time: 'O(n log n)', why: 'What you must do to get a hash table’s items in order. A search tree is already in order.' },
]

const examples = [
  {
    id: 'search-balanced',
    prompt: 'Searching a balanced binary search tree of n nodes for a value, with a loop.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Each comparison discards one side, so you walk down one path of about log n levels. A loop needs only a pointer.',
  },
  {
    id: 'search-skewed',
    prompt: 'Searching a binary search tree of n nodes that was built by inserting already-sorted values, with a loop (worst case).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Sorted inserts make every value go right of the last, so the tree is a chain. The search has to walk the whole chain.',
  },
  {
    id: 'build-random',
    prompt: 'Building a binary search tree by inserting n values in random order, one at a time (average case).',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Random order tends to give a reasonably balanced tree, so each of the n inserts costs about log n. The tree holds n nodes.',
  },
  {
    id: 'build-sorted',
    prompt: 'Building a binary search tree by inserting n values that are already sorted, one at a time.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'The tree grows into a chain, so the k-th insert walks k nodes. Add 1 + 2 + … + n and you get about n² / 2.',
  },
  {
    id: 'min',
    prompt: 'Finding the smallest value in a balanced binary search tree of n nodes.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Keep going left until there is no left child. That is one path down, about log n steps.',
  },
  {
    id: 'inorder',
    prompt: 'Printing all n values of a balanced binary search tree in sorted order with a recursive in-order traversal (not counting the output).',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Every node is visited once, and the recursion is only as deep as the tree is tall. No sorting step is needed.',
  },
  {
    id: 'delete-two',
    prompt: 'Deleting a node with two children from a balanced binary search tree of n nodes, using the recursive code on this page.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'Finding the node, finding its successor and deleting the successor are each one walk down the tree. The recursion keeps a call open per level.',
  },
  {
    id: 'insort',
    prompt: 'Inserting one value into a sorted Python list of n items with bisect.insort, for comparison.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The spot is found in O(log n), but every item after it has to shift along by one. A tree avoids that shifting.',
  },
]

function BinarySearchTrees() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Tree Data Structures</p>
      <h2>Binary Search Trees</h2>
      <p>
        Binary search is fast, but it needs a sorted list, and a sorted list
        is slow to change: every insert or delete shifts everything after
        it. A <strong>binary search tree</strong> (BST) keeps the data sorted
        in a different way. It is a binary tree with one extra rule that
        puts every smaller value on the left and every larger value on the
        right. That lets you search the way binary search does, by throwing
        half away at every step, while inserting and deleting stay cheap.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Binary Search Trees &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A binary tree where, for <strong>every</strong> node, everything on its left is smaller and everything on its right is larger.</li>
                <li>Also called an <strong>ordered</strong> or <strong>sorted</strong> binary tree.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>A sorted list searches fast but is slow to insert into and delete from.</li>
                <li>A hash table is fast but keeps no order.</li>
                <li>A BST does all three, in <code>O(log n)</code>, if it stays balanced.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>At each node, one comparison tells you which side the value must be on.</li>
                <li>The other side can be ignored completely, like binary search.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li><strong>Search:</strong> compare, go left or right, repeat.</li>
                <li><strong>Insert:</strong> search, then hang the new value on the empty spot you reach.</li>
                <li><strong>Delete:</strong> a leaf is cut off, a one-child node is bypassed, a two-child node is replaced by its successor.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li><strong>Best:</strong> the value is at the root: 1 comparison.</li>
                <li><strong>Average:</strong> <code>O(log n)</code> on a reasonably balanced tree.</li>
                <li><strong>Worst:</strong> <code>O(n)</code> when the tree is a chain.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Search, insert, delete: <code>O(h)</code>, the height.</li>
                <li>Space: <code>O(n)</code> for the tree.</li>
                <li>All values in order: <code>O(n)</code>, by in-order traversal.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Nothing keeps it balanced. Sorted inserts turn it into a list.</li>
                <li>A hash table is faster for plain lookups.</li>
                <li>Each node carries two pointers, so it uses more memory than a list.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You need to search, insert and delete often, <strong>and</strong> want the data in order.</li>
                <li>You need the smallest, largest, next-larger or closest value.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>The rule applies to <strong>every</strong> ancestor, not just the parent.</li>
                <li>Inserting in sorted order is the worst case.</li>
                <li>Duplicates need a decision, since the rule says smaller or larger.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The One Rule</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Take any node. Everything in its <strong>left subtree</strong>{' '}
              is smaller than it, and everything in its{' '}
              <strong>right subtree</strong> is larger. That is the only rule,
              and it applies to every node in the tree.
            </p>
            <p>
              Look at the root, 8. The five values on its left (3, 1, 6, 4
              and 7) are all smaller than 8, and the three on its right (10,
              14 and 13) are all larger. The same rule holds again inside
              each side: at 3, the 1 is on the left and 6, 4 and 7 are on
              the right. Because the rule repeats at every level, a BST is
              built out of smaller BSTs.
            </p>
          </div>
          <BstRuleVisual />
        </div>
        <p>
          There is one trap that catches nearly everyone. It is not enough
          for each value to fit with its parent. It has to fit with{' '}
          <em>every ancestor above it</em>:
        </p>
        <BstTrapVisual />
        <p>
          In the second tree, 9 is a fine right child for 3, since 9 is
          bigger than 3. But 9 sits on the <em>left</em> of 8, and 9 is
          bigger than 8. A search for 9 would start at the root, see that 9
          is bigger than 8, go right, and never find it. One misplaced value
          breaks the promise that lets you skip half the tree.
        </p>
        <p>
          A useful side effect: if you read the tree{' '}
          <strong>in-order</strong> (left, node, right) you get the values
          sorted. For the first tree that is{' '}
          <code>1 3 4 6 7 8 10 13 14</code>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Searching: Binary Search, Drawn as a Tree</h3>
        <p>
          Searching is exactly the binary search you already know. Start at
          the root and compare. If the value matches, you are done. If your
          value is smaller, it can only be on the left, so ignore the whole
          right side. If it is larger, ignore the whole left side. Then repeat
          at the next node down. Watch a search for 6: after the first
          comparison most of the tree has been ruled out.
        </p>
        <BstSearchVisual />
        <p>
          If you run off the bottom of the tree, the value is not there, and
          the empty spot you stopped at is exactly where it <em>would</em> be.
          That fact makes insert almost free, as you will see in a moment.
        </p>
        <p>
          The smallest and largest values need no comparing at all. The
          smallest is the leftmost node and the largest is the rightmost:
        </p>
        <div className="code-block">
          <code>{`def find_min(node):
    while node.left is not None:    # keep going left
        node = node.left
    return node.value

def find_max(node):
    while node.right is not None:   # keep going right
        node = node.right
    return node.value`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Inserting and Deleting</h3>
        <p>
          <strong>Insert</strong> is a search that never finds anything. Walk
          down comparing as usual, and when you reach an empty spot, put the
          new value there as a leaf. The old nodes never move, which is why
          inserting is so much cheaper than shifting a sorted list. (If the
          value is equal to a node, this code sends it to the right. Real
          code often rejects duplicates instead.)
        </p>
        <p>
          <strong>Delete</strong> is the trickiest of the three, because
          removing a node must not break the rule. There are three cases,
          depending on how many children the node has:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>The node has</th>
                <th>Example</th>
                <th>What to do</th>
                <th>Why it works</th>
              </tr>
            </thead>
            <tbody>
              {deleteCases.map((row) => (
                <tr key={row.case}>
                  <td><strong>{row.case}</strong></td>
                  <td><code>{row.example}</code></td>
                  <td>{row.how}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The third case is the clever one. You cannot simply remove a node
          with two children, because two subtrees would be left hanging with
          one spot to fill. So find the node&rsquo;s{' '}
          <strong>successor</strong>: the next larger value in the tree,
          which is the smallest value in its right subtree (go right once,
          then left as far as you can). Copy that value into the node, then
          delete the original, which is easy because it has no left child.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Pick an operation, then press <strong>Play</strong>. The highlighted
          line is the one running now, and the tree is shown alongside. In
          <strong> Search</strong> and <strong>Insert</strong>, the blue
          node is the one being compared, and grey numbered nodes are the
          ones already passed. In <strong>Delete</strong>, the code is
          recursive, so the <strong>call stack</strong> is shown too.
          Yellow nodes have a call waiting, green is the node being deleted,
          and the dashed node is the successor being hunted for.
        </p>
        <BinarySearchTreeTracer />
        <p>
          In <strong>Search</strong>, try <strong>Not in the tree (5)</strong>:
          it follows 8, 3, 6 and 4, then falls off the bottom at the empty
          spot where 5 would go. In <strong>Insert</strong>, notice that the
          green new node appears at exactly that kind of spot and nothing
          else in the tree moves. In <strong>Delete</strong>, step through
          the three kinds: a leaf just vanishes, a one-child node is
          bypassed, and with <strong>Two children (3)</strong> you can see
          the successor, 4, found by going right and then left, copied up
          into 3&rsquo;s place, and the original removed.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Binary Search Trees in One Breath</h3>
        <div className="definition">
          A binary search tree is a binary tree in which every node is larger
          than everything in its left subtree and smaller than everything in
          its right subtree, so search, insert and delete each follow a
          single path from the root down.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. Each of search, insert and
              delete walks down a single path from the root, doing a constant
              amount of work per node. So the cost is the length of that
              path, which is at most the <strong>height</strong> of the tree:{' '}
              <code>O(h)</code>.
            </p>
            <p>
              And the height depends on <em>the order the values arrive
              in</em>. Insert 4, 2, 6, 1, 3, 5, 7 and you get a neat, short
              tree. Insert 1, 2, 3, 4, 5, 6, 7 and every value goes to the
              right of the last, giving a chain: a linked list with extra
              steps. Same values, same rule, but <code>O(log n)</code> in
              one and <code>O(n)</code> in the other. Real data is often
              partly sorted, so this is a real risk. Trees that fix it by
              rebalancing themselves are the next topics.
            </p>
          </div>
          <BstOrderVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Balanced tree</th>
                <th>Skewed tree</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((row) => (
                <tr key={row.op}>
                  <td><strong>{row.op}</strong></td>
                  <td><code>{row.balanced}</code></td>
                  <td><code>{row.skewed}</code></td>
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
          Here is how a search tree stacks up against the other ways of
          storing values you have met:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Structure</th>
                <th>Search</th>
                <th>Insert</th>
                <th>Delete</th>
                <th>Kept in order?</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td><code>{row.search}</code></td>
                  <td><code>{row.insert}</code></td>
                  <td><code>{row.remove}</code></td>
                  <td>{row.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Python has no built-in search tree, so these are the tools you
          actually have:
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
          <strong>The data changes and has to stay in order.</strong> This
          is its sweet spot. A sorted list gives fast search but slow
          changes, a hash table gives fast changes but no order, and a
          balanced search tree is fast at all three.
        </p>
        <p>
          <strong>You ask about neighbours, not just matches.</strong>{' '}
          &ldquo;The smallest value over 50&rdquo;, &ldquo;the largest value
          under 50&rdquo;, &ldquo;everything between 20 and 30&rdquo;. A
          sorted structure answers these by walking one path, while a hash
          table has to look at everything.
        </p>
        <p>
          <strong>You need the data out in order, repeatedly.</strong> An
          in-order traversal hands the values back sorted in{' '}
          <code>O(n)</code> with no sorting step at all.
        </p>
        <p>
          <strong>Skip it for plain lookups by key.</strong> If you only ever
          ask &ldquo;is x here?&rdquo; or &ldquo;what goes with key
          x?&rdquo;, a dict or set is simpler and faster. And if the data
          never changes after you load it, a sorted list with{' '}
          <code>bisect</code> is simpler still.
        </p>
        <p>
          <strong>Be careful with raw search trees.</strong> A plain BST is
          only as good as the order its data arrives in. If the input might
          be sorted or nearly sorted, use a self-balancing tree, which
          is the next topic.
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

export default BinarySearchTrees
