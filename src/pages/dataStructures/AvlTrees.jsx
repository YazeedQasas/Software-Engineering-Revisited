import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import AvlTreeTracer from './AvlTreeTracer.jsx'
import {
  AvlSortedVisual,
  AvlBalanceVisual,
  AvlRotationVisual,
  AvlDoubleRotationVisual,
  AvlThinVisual,
} from './AvlTreeVisuals.jsx'

const cases = [
  { name: 'Left-left', where: 'the new value went into the left side of the left child', shape: 'a straight line down the left', fix: 'rotate right around the unbalanced node' },
  { name: 'Right-right', where: 'the new value went into the right side of the right child', shape: 'a straight line down the right', fix: 'rotate left around the unbalanced node' },
  { name: 'Left-right', where: 'the new value went into the right side of the left child', shape: 'a bend: left, then right', fix: 'rotate left around the child, then rotate right around the node' },
  { name: 'Right-left', where: 'the new value went into the left side of the right child', shape: 'a bend: right, then left', fix: 'rotate right around the child, then rotate left around the node' },
]

const thinnest = [
  { height: '0', fewest: '1' },
  { height: '1', fewest: '2' },
  { height: '2', fewest: '4' },
  { height: '3', fewest: '7' },
  { height: '4', fewest: '12' },
  { height: '5', fewest: '20' },
  { height: '6', fewest: '33' },
  { height: '10', fewest: '232' },
  { height: '20', fewest: '28,656' },
  { height: '30', fewest: '3,524,577' },
]

const operations = [
  { op: 'Search', time: 'O(log n)', why: 'The same walk as in any search tree, but the height is now guaranteed to be small.' },
  { op: 'Insert', time: 'O(log n)', why: 'One walk down, then one walk back up fixing heights. At most one rotation (single or double) is ever needed.' },
  { op: 'Delete', time: 'O(log n)', why: 'One walk down and back up. Unlike insert, it can need a rotation at every level on the way up.' },
  { op: 'One rotation', time: 'O(1)', why: 'It only changes a few pointers and two heights. No other node is touched.' },
  { op: 'Smallest, largest or the next value', time: 'O(log n)', why: 'Keep going left, right, or find the successor, as in any search tree.' },
  { op: 'All values, in sorted order', time: 'O(n)', why: 'An in-order traversal, exactly as before.' },
]

const properties = [
  { prop: 'Height', value: '≤ 1.44 log₂ n', why: 'A tree this lopsided still has to hold many nodes, so it cannot be tall. See the table above.' },
  { prop: 'Space', value: 'O(n)', why: 'One node per value, plus a small height (or balance factor) stored in each.' },
  { prop: 'Worst-case search', value: 'O(log n)', why: 'Guaranteed whatever order the values arrive in, unlike a plain search tree.' },
  { prop: 'Rotations per insert', value: 'at most 1', why: 'Fixing the lowest unbalanced node fixes every node above it too.' },
  { prop: 'Balance rule', value: 'strict', why: 'Left and right heights may differ by at most 1 at every node.' },
]

const compare = [
  { name: 'Plain search tree', search: 'O(n)', insert: 'O(n)', balance: 'none', note: 'Simplest. Sorted input makes it a chain.' },
  { name: 'AVL tree', search: 'O(log n)', insert: 'O(log n)', balance: 'strict (±1)', note: 'Shortest trees, so the fastest searches. More rotations on insert and delete.' },
  { name: 'Red-black tree', search: 'O(log n)', insert: 'O(log n)', balance: 'looser (up to 2×)', note: 'Fewer rotations on insert and delete. Used in many language libraries.' },
]

const builtins = [
  { op: 'bisect.insort(sorted_list, x)', time: 'O(n)', why: 'What you can use instead of an AVL tree for a few inserts, but each one shifts items along.' },
  { op: 'sorted(items)', time: 'O(n log n)', why: 'Sort once if the data never changes.' },
  { op: 'my_dict[key]  /  x in my_set', time: 'O(1) avg', why: 'Faster than any tree, if you do not need the order.' },
]

const examples = [
  {
    id: 'search',
    prompt: 'Searching an AVL tree of n nodes for a value, with a loop (worst case).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The height is guaranteed to be about log n, and a loop only needs a pointer.',
  },
  {
    id: 'insert',
    prompt: 'Inserting one value into an AVL tree of n nodes with the recursive code on this page, including any rotation.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'One walk down and back up a tree about log n tall, with one call open per level, and a rotation costs only O(1).',
  },
  {
    id: 'rotation',
    prompt: 'Performing a single rotation on a node of an AVL tree of n nodes.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'A rotation just re-points two or three links and updates two heights. The size of the tree does not matter.',
  },
  {
    id: 'build-sorted',
    prompt: 'Building an AVL tree by inserting n already-sorted values one at a time, for comparison with a plain search tree.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Each of the n inserts costs O(log n), because the tree rebalances itself. A plain search tree would take O(n²) on the same input.',
  },
  {
    id: 'delete',
    prompt: 'Deleting a value from an AVL tree of n nodes, including all the rotations needed on the way back up.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'There may be a rotation at each of the log n levels, but each rotation is O(1), so the total stays O(log n).',
  },
  {
    id: 'check',
    prompt: 'Checking that a balanced binary tree of n nodes is a valid AVL tree by computing the height of every node, with recursion.',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Every node is visited once, and the recursion is as deep as the tree is tall.',
  },
  {
    id: 'min',
    prompt: 'Finding the smallest value in an AVL tree of n nodes.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Keep going left. The path is no longer than the height, which is about log n.',
  },
  {
    id: 'inorder',
    prompt: 'Printing all n values of an AVL tree in sorted order with a recursive in-order traversal (not counting the output).',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Every node is visited once. The recursion is only as deep as the tree, which an AVL tree keeps at about log n.',
  },
]

function AvlTrees() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Tree Data Structures</p>
      <h2>AVL Trees</h2>
      <p>
        A search tree is only fast when it is short. But the last page
        ended on a warning: insert 1, 2, 3, 4, 5, 6, 7 in that order and a
        plain search tree becomes a chain, as slow as a linked list. An{' '}
        <strong>AVL tree</strong> fixes that by never letting the tree lean.
        After every insert or delete it checks whether any node has become
        lopsided, and if so, it reshapes the tree with a small move called a{' '}
        <strong>rotation</strong>. It is named after its inventors,
        Adelson-Velsky and Landis, and was the first self-balancing tree ever
        invented, in 1962.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">AVL Trees &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A binary search tree that keeps itself <strong>balanced</strong>.</li>
                <li>At every node, the left and right sides differ in height by at most 1.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>A plain search tree can degrade into a chain: <code>O(n)</code>.</li>
                <li>The order the data arrives in should not decide how fast it is.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Track a <strong>balance factor</strong> for each node: left height minus right height.</li>
                <li>If one ever reaches <code>+2</code> or <code>&minus;2</code>, <strong>rotate</strong> to fix it.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Insert as in a search tree.</li>
                <li>Walking back up, recompute each height and balance factor.</li>
                <li>At the first unbalanced node, apply one of four fixes: left-left, right-right, left-right, right-left.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li><strong>Best:</strong> the value is at the root: 1 comparison.</li>
                <li><strong>Worst:</strong> <code>O(log n)</code>. This is guaranteed, not just likely.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Search, insert, delete: <code>O(log n)</code>.</li>
                <li>A rotation: <code>O(1)</code>.</li>
                <li>Space: <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>More code and a stored height on every node.</li>
                <li>Extra work on every insert and delete to keep the shape.</li>
                <li>Red-black trees rotate less, for slightly taller trees.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You search far more often than you change the data.</li>
                <li>You need a guaranteed worst case, whatever order the data comes in.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>A rotation must keep the search-tree order intact.</li>
                <li>A bend needs <strong>two</strong> rotations, not one.</li>
                <li>Delete can rotate at every level on the way up, but insert never more than once.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Problem: Trees That Lean</h3>
        <p>
          A search tree is fast because each comparison throws half the tree
          away. That only works if the tree is bushy. Feed it values that
          arrive in order and every new value goes on the same side of the
          last, so the tree grows into a single stalk. Here are the same seven
          sorted values going into a plain search tree and into an AVL tree:
        </p>
        <AvlSortedVisual />
        <p>
          The AVL tree is not given any special treatment: it uses the same
          values in the same order. The difference is that it notices when a
          part of the tree starts to lean and straightens it up before it can
          grow worse. The price is a little extra work per insert. The
          reward is that the tree can never be taller than about{' '}
          <code>1.44 log&#8322; n</code>, so every search is{' '}
          <code>O(log n)</code>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Balance Factor</h3>
        <p>
          How do we know when a tree is leaning? Give every node a number: the{' '}
          <strong>balance factor</strong>, which is the height of its left
          side minus the height of its right side. (Heights count steps down,
          as on the Binary Trees page: an empty tree is <code>-1</code>, a
          single node <code>0</code>.) A positive number means the node leans
          left, a negative number means it leans right, and zero means it is
          level.
        </p>
        <p>
          The AVL rule is simple: <strong>every node&rsquo;s balance factor
          must be &minus;1, 0 or +1</strong>. A little lean is fine. A lean
          of two is not.
        </p>
        <AvlBalanceVisual />
        <p>
          In the second tree, 20 has a left side of height 1 (the 10 and 5
          below it) and no right side at all, so its balance factor is
          1 &minus; (&minus;1) = +2. The node at the top, 30, is off by two as
          well, but that is only because 20 below it is. The lowest unbalanced
          node is the one to fix.
        </p>
        <p>
          Each node stores its height so that finding a balance factor is
          quick. After any change you just recompute the height of the nodes
          on the way back up:
        </p>
        <div className="code-block">
          <code>{`def height(node):
    return node.height if node else -1     # an empty tree has height -1

def update_height(node):
    node.height = 1 + max(height(node.left), height(node.right))

def balance_factor(node):
    return height(node.left) - height(node.right)`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Fix: Rotations</h3>
        <p>
          A <strong>rotation</strong> changes the shape of a small part of
          the tree without breaking the search-tree order. Imagine grabbing
          the middle node of a three-node line and lifting it up, so the top
          node swings down to the other side. The three values stay in the
          same left-to-right order, so every search still works, but the tree
          is now level.
        </p>
        <AvlRotationVisual />
        <p>
          In the top row, 30, 20 and 10 form a straight line leaning left, so
          30 has a balance factor of +2. A <strong>right rotation</strong>{' '}
          around 30 lifts 20 to the top and lets 30 drop down on its right.
          The bottom row is the mirror image: a line leaning right is fixed
          by a <strong>left rotation</strong>.
        </p>
        <p>
          In a real tree those nodes have other subtrees hanging off them. One
          of them needs a new home: when 20 moves up, the subtree that was on
          20&rsquo;s right (everything between 20 and 30) becomes 30&rsquo;s
          new left child. It fits, because those values are bigger than 20 and
          smaller than 30, which is exactly what belongs to the left of 30.
        </p>
        <div className="code-block">
          <code>{`def rotate_right(z):
    y = z.left            # y moves up
    z.left = y.right      # y's right subtree becomes z's left
    y.right = z           # z drops down to y's right
    update_height(z)      # z is lower now, so fix its height first
    update_height(y)
    return y              # y is the new top of this part

def rotate_left(z):       # the mirror image
    y = z.right
    z.right = y.left
    y.left = z
    update_height(z)
    update_height(y)
    return y`}</code>
        </div>
        <p>
          Three pointer changes and two height updates, no loops, no matter
          how big the tree: a rotation is <code>O(1)</code>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Four Cases, Two Fixes</h3>
        <p>
          Whether a rotation is enough depends on <em>where</em> the new value
          went in. If it went down in a straight line, one rotation fixes it.
          If the path bends, one rotation would only swap one lean for
          another, so you first straighten the bend with a rotation on the
          child, then do the usual one:
        </p>
        <AvlDoubleRotationVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Where the new value went</th>
                <th>The path looks like</th>
                <th>The fix</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.where}</td>
                  <td>{row.shape}</td>
                  <td>{row.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          You never have to remember these by heart: the code decides by
          comparing the new value with the child (<code>value &gt; node.left.value</code>
          means it went into the right side of the left child, so it is a
          bend).
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Each choice below starts from a small AVL tree and inserts one
          value. Press <strong>Play</strong> and the highlighted line is the
          one running now. Every node carries its balance factor, refreshed
          when the code reaches that node on the way back up (until then it
          may be out of date). The blue node is the call that is running,
          yellow nodes are calls still waiting, and a node that turns red is
          out of balance. When the code rotates, the green node is the new
          top of the rotated part. You can pause, step forward or back one
          line at a time, and drag the slider to jump around.
        </p>
        <AvlTreeTracer />
        <p>
          Start with <strong>No rotation needed</strong>: the new node is
          added, the balance factors on the way up change, but none leaves the
          range. Then try <strong>Left-left</strong> and watch 20 turn red at
          +2 and a single right rotation straighten it. <strong>Left-right</strong>{' '}
          is the interesting one: the first rotation seems to make things no
          better (30 stays red), and only the second one fixes it. In every
          case notice that once the rotation is done, the tree above it
          needs no further changes: the rotated part is exactly as tall as it
          was before the insert.
        </p>
      </section>

      <section className="notebook-section">
        <h3>AVL Trees in One Breath</h3>
        <div className="definition">
          An AVL tree is a binary search tree in which the heights of the two
          sides of every node differ by at most one, kept true after every
          insert and delete by rotating the unbalanced part back into shape.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. Search, insert and delete each
              follow one path down the tree (and insert and delete walk back
              up it), so each costs <code>O(h)</code>. The whole point of an
              AVL tree is that <code>h</code> can never get large, so that
              becomes <code>O(log n)</code> always, not just on friendly
              data.
            </p>
            <p>
              Why is the height guaranteed? Ask the opposite question: what is
              the <em>fewest</em> nodes an AVL tree of height <code>h</code>{' '}
              can have? Make it lean as far as the rule allows at every node:
              a root with a thinnest tree of height <code>h&minus;1</code> on
              one side and a thinnest tree of height <code>h&minus;2</code>{' '}
              on the other. Each size is the sum of the previous two, plus
              one, so it grows exponentially.
            </p>
          </div>
          <AvlThinVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Height</th>
                <th>Fewest nodes an AVL tree of that height can have</th>
              </tr>
            </thead>
            <tbody>
              {thinnest.map((row) => (
                <tr key={row.height}>
                  <td><strong>{row.height}</strong></td>
                  <td>{row.fewest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Turn it around: a tree of height 30 must hold over three million
          nodes, so a tree with fewer than that cannot be that tall. The
          thinnest AVL trees grow by about 1.62 times for each extra level
          (the golden ratio), which gives a height of at most about{' '}
          <code>1.44 log&#8322; n</code>. That is only 44% taller than a
          perfectly packed tree, in the worst case.
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
              {operations.map((row) => (
                <tr key={row.op}>
                  <td><strong>{row.op}</strong></td>
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
          AVL is one of a family of self-balancing trees. Here is how it
          compares with a plain search tree and its best-known relative, the
          red-black tree:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Tree</th>
                <th>Search (worst)</th>
                <th>Insert (worst)</th>
                <th>Balance</th>
                <th>Worth knowing</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td><code>{row.search}</code></td>
                  <td><code>{row.insert}</code></td>
                  <td>{row.balance}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Python has no built-in AVL tree, so what you reach for in practice is
          one of these:
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
          <strong>You look things up much more often than you change them.</strong>{' '}
          Because it is kept strictly balanced, an AVL tree is the shortest
          kind of search tree, so its searches are the fastest. Dictionaries
          and indexes that are read all day and updated occasionally suit it.
        </p>
        <p>
          <strong>You need a worst-case guarantee.</strong> A plain search
          tree is fast on random data and terrible on sorted data. When you
          cannot control the order the data arrives in, or a slow lookup would
          be a real problem, the guarantee is worth the extra code.
        </p>
        <p>
          <strong>You need the data in order as well.</strong> Like any search
          tree, an AVL tree gives you sorted traversal, the smallest and
          largest values, and &ldquo;the next value up&rdquo;, which a hash
          table cannot.
        </p>
        <p>
          <strong>Think twice if inserts and deletes dominate.</strong> The
          strict rule means more rotations. A red-black tree relaxes the rule
          a little, fixes things with fewer rotations, and ends up a bit
          taller, which is why many standard libraries prefer it.
        </p>
        <p>
          <strong>Skip it when something simpler fits.</strong> For plain
          lookups, use a dict. For data that is loaded once, use a sorted list
          with <code>bisect</code>. And for data too big for memory, the next
          topic, the B-tree, is the one built for disks.
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

export default AvlTrees
