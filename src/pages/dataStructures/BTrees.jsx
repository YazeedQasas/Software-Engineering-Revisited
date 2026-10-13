import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import BTreeTracer from './BTreeTracer.jsx'
import {
  BTreeAnatomyVisual,
  BTreeReadsVisual,
  BTreeSearchVisual,
  BTreeSplitVisual,
  BTreeLevelsVisual,
} from './BTreeVisuals.jsx'

const rules = [
  { rule: 'Keys per node', say: 'At most m − 1 keys.', here: 'at most 3' },
  { rule: 'Not too empty', say: 'Every node except the root has at least ⌈m / 2⌉ − 1 keys.', here: 'at least 1' },
  { rule: 'Sorted inside', say: 'The keys in a node are kept in order.', here: '20 40' },
  { rule: 'Children', say: 'A node with k keys has k + 1 children (unless it is a leaf). Child i holds the keys between key i − 1 and key i.', here: '2 keys → 3 children' },
  { rule: 'Same depth', say: 'All the leaves are on the same level.', here: 'never lopsided' },
]

const deleteCases = [
  { case: 'The leaf can spare a key', how: 'Just remove the key.', why: 'The leaf still has at least the minimum number left.' },
  { case: 'The key is in an inner node', how: 'Swap it with the next key up or down, which lives in a leaf, and delete it from there.', why: 'Like a search tree: the neighbouring key keeps the order intact.' },
  { case: 'The leaf would be too empty, but a sibling has a spare key', how: 'Borrow: move a key from the sibling up into the parent, and one from the parent down into the leaf.', why: 'No node is created or destroyed, and the order is preserved.' },
  { case: 'The leaf would be too empty, and no sibling has a spare', how: 'Merge the leaf with a sibling, pulling the parent’s separating key down between them.', why: 'The parent has lost a key, so it may now be too empty and need the same fix, all the way up. If the root runs out of keys, the tree gets one level shorter.' },
]

const levels = [
  { children: '2 (a binary tree)', million: '20', billion: '30' },
  { children: '10', million: '6', billion: '9' },
  { children: '100', million: '3', billion: '5' },
  { children: '1,000', million: '2', billion: '3' },
]

const operations = [
  { op: 'Search', time: 'O(log n)', why: 'One node per level, so about logₘ n disk reads. Looking inside a node adds a small, fixed amount of work.' },
  { op: 'Insert', time: 'O(log n)', why: 'A search to the leaf, then splits on the way back up. Each split is a fixed amount of work.' },
  { op: 'Delete', time: 'O(log n)', why: 'A search, then a borrow or a merge at each level on the way up at worst.' },
  { op: 'Smallest or largest', time: 'O(log n)', why: 'Go down the leftmost (or rightmost) child at each level.' },
  { op: 'All keys, in sorted order', time: 'O(n)', why: 'An in-order walk: key, child, key, child, … and every key is visited once.' },
  { op: 'Everything between a and b', time: 'O(log n + k)', why: 'Search for a, then walk on in order past the k results. This is where B-trees shine over hash tables.' },
]

const properties = [
  { prop: 'Height', value: 'about logₘ n', why: 'With m children per node, each level multiplies the reach by about m. At worst log base m / 2.' },
  { prop: 'Space', value: 'O(n)', why: 'Every node is at least about half full, so at most half the space is empty.' },
  { prop: 'Balance', value: 'always perfect', why: 'All leaves are on the same level. The tree only ever grows or shrinks at the root.' },
  { prop: 'Rotations', value: 'none', why: 'Splits and merges keep the shape. There is nothing to rotate.' },
  { prop: 'Best node size', value: 'one disk block', why: 'Reading a whole block costs the same as reading one byte, so fill it with keys.' },
]

const compare = [
  { name: 'AVL tree', keys: '1', balance: 'rotations', best: 'Data that fits in memory' },
  { name: 'B-tree', keys: 'many (50 to 1,000+)', balance: 'splits and merges', best: 'Data on disk, or too big for memory' },
  { name: 'B+ tree', keys: 'many, but only in the leaves', balance: 'splits and merges', best: 'Databases: the leaves are linked, so range scans are fast' },
]

const builtins = [
  { op: 'CREATE INDEX ...  (sqlite3)', time: 'O(log n)', why: 'SQLite stores every index as a B-tree. Python’s built-in sqlite3 module gives you one.' },
  { op: 'bisect.bisect_left(sorted_list, x)', time: 'O(log n)', why: 'The in-memory stand-in: binary search on a sorted list.' },
  { op: 'x in my_set  /  my_dict[x]', time: 'O(1) avg', why: 'Faster still, if you do not need order or range queries.' },
]

const examples = [
  {
    id: 'search',
    prompt: 'Searching a B-tree of n keys with a loop, in the number of comparisons (worst case).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The height is about log n. At each level you search a small, fixed-size node, so the total is O(log n) comparisons. A loop needs only a pointer.',
  },
  {
    id: 'insert',
    prompt: 'Inserting one key into a B-tree of n keys with the recursive code on this page, including any splits.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'One walk down and back up a tree about log n tall, with one call open per level. Each split is a fixed amount of work.',
  },
  {
    id: 'split',
    prompt: 'Splitting one full node of a B-tree whose nodes hold at most a fixed number of keys.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The node never holds more than that fixed number of keys, so moving them into a new node takes a fixed amount of work whatever n is.',
  },
  {
    id: 'build-sorted',
    prompt: 'Building a B-tree by inserting n keys that are already sorted, one at a time.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Each insert costs O(log n), since a B-tree stays perfectly balanced whatever order the keys arrive in. The tree holds all n keys.',
  },
  {
    id: 'inorder',
    prompt: 'Printing all n keys of a B-tree in sorted order with a recursive in-order walk (not counting the output).',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Every key is visited once, and the recursion is only as deep as the tree is tall.',
  },
  {
    id: 'delete',
    prompt: 'Deleting a key from a B-tree of n keys, including every borrow or merge needed on the way up.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'There may be a fix at each of the log n levels, each a fixed amount of work.',
  },
  {
    id: 'min',
    prompt: 'Finding the smallest key in a B-tree of n keys.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Keep following the first child until you reach a leaf. That is one path down the tree.',
  },
  {
    id: 'scan',
    prompt: 'For comparison: finding a key by reading through an unsorted file of n records from the start.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'This is what an index replaces. With no structure to lean on, every record may have to be read.',
  },
]

function BTrees() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Tree Data Structures</p>
      <h2>B-Trees</h2>
      <p>
        Every tree so far has kept one key in each node. That is fine in
        memory, where following a pointer is nearly free. But a database or
        a file system lives on a disk, where reaching a new location is
        thousands of times slower than reading the next few bytes once you
        are there. A <strong>B-tree</strong> is built for that world: it
        packs <em>many</em> keys into each node, so the tree is very wide and
        very short, and a search needs only a handful of trips to disk.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">B-Trees &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A balanced search tree whose nodes each hold <strong>many sorted keys</strong> and have many children.</li>
                <li>All leaves are on the same level.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>On disk, each node you visit is a slow trip.</li>
                <li>A binary tree of a million keys is about 20 levels deep: 20 trips. A B-tree is about 3.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Make each node as big as a disk block and fill it with keys.</li>
                <li>Fewer, fatter levels means fewer trips.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li><strong>Search:</strong> find the gap between keys the target falls in, then follow that child.</li>
                <li><strong>Insert:</strong> add to a leaf. Too many keys? <strong>Split</strong> it and send the middle key up.</li>
                <li><strong>Delete:</strong> borrow from a sibling, or merge with one.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li><strong>Best:</strong> the key is in the root: 1 read.</li>
                <li><strong>Worst:</strong> a leaf, or missing: one read per level.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Search, insert, delete: <code>O(log n)</code>.</li>
                <li>Disk reads: about <code>log&#8344; n</code>, tiny for large <code>m</code>.</li>
                <li>Space: <code>O(n)</code>, at least half full.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>More complicated code than a simple search tree.</li>
                <li>Searching inside a big node is extra work, which only pays off when the reads are slow.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>The data lives on disk or is too big for memory: databases, file systems.</li>
                <li>You need sorted order and range queries.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>It grows at the <strong>top</strong>, not the bottom.</li>
                <li>A key that moves up in a split is <strong>removed</strong> from the child.</li>
                <li>Textbooks disagree on &ldquo;order&rdquo;. Check what <code>m</code> means.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Problem: Slow Storage</h3>
        <p>
          Memory is fast to jump around in. A disk is not: finding the right
          spot takes a long time, but once you are there, reading a whole
          block of data (a few kilobytes) costs about the same as reading a
          single byte. So the cost of a disk search is not the number of
          comparisons. It is the <strong>number of blocks you read</strong>.
        </p>
        <p>
          Think what that means for the trees so far. A balanced binary
          search tree of a million keys is about 20 levels deep, and each
          node is a separate trip to disk. We are reading a whole block just
          to look at one key. That is wasteful. A better idea is to make each
          node <em>as big as a block</em> and put a hundred keys in it, so that
          every read does a hundred keys&rsquo; worth of work:
        </p>
        <BTreeReadsVisual />
      </section>

      <section className="notebook-section">
        <h3>What Is a B-Tree?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Look at the picture. It is a search tree again, but a node can
              hold several keys, and its children sit in the gaps between
              them. In the root, 20 and 40 split the world into three: keys
              below 20 go to the first child, keys between 20 and 40 go to
              the second, and keys above 40 go to the third.
            </p>
            <p>
              That is the binary search tree rule, stretched. A node with{' '}
              <code>k</code> keys has <code>k + 1</code> children, and each
              child covers the range between two neighbouring keys. Search
              works the same way too: find the gap the target falls in, then
              follow that child.
            </p>
          </div>
          <BTreeAnatomyVisual />
        </div>
        <p>
          How many keys? A B-tree is described by its <strong>order</strong>,{' '}
          <code>m</code>: the most children a node can have. (Be careful:
          some books define the order differently. Always check.) Here we
          use <code>m = 4</code> so the pictures are small. Real B-trees use
          hundreds. The rules:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>What it says</th>
                <th>With m = 4</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((row) => (
                <tr key={row.rule}>
                  <td><strong>{row.rule}</strong></td>
                  <td>{row.say}</td>
                  <td>{row.here}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The last two rules do the heavy lifting. Because every leaf is on
          the same level, the tree is <em>perfectly</em> balanced, always.
          And because every node (except the root) is at least about half
          full, the tree cannot be thin and tall. A B-tree never needs a
          rotation: you will see in a moment how it keeps its shape instead.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Searching: Few Reads, Many Keys</h3>
        <p>
          Searching is the search-tree walk with one change. At each node you
          look through its keys (a short, sorted list, so a quick scan or a
          binary search) to find where the target fits, and either you find
          it, or you follow the child in that gap. Watch a search for 30:
        </p>
        <BTreeSearchVisual />
        <p>
          Only three nodes were read: the root, one in the middle, and one
          leaf. In a real B-tree each of those is one disk block holding
          hundreds of keys, and the other branches are never touched.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Inserting: Split, and Grow at the Top</h3>
        <p>
          Insert starts like search: walk down to the leaf where the key
          belongs, and slot it in among the sorted keys. If the leaf still
          fits, you are done, and nothing else in the tree changes.
        </p>
        <p>
          If the leaf now has too many keys, it <strong>splits</strong>. The
          middle key moves up into the parent, the keys before it stay, and
          the keys after it move into a new node. That is the heart of the
          B-tree:
        </p>
        <BTreeSplitVisual />
        <p>
          The parent has gained a key and a child, which may push it over the
          limit too. If so, it splits in the same way, and the middle key
          moves up again. The splitting can climb all the way to the root. If
          the <em>root</em> splits, there is no parent to take the middle key,
          so a brand-new root is created holding just that key. This is the
          only way a B-tree gets taller, and it happens at the{' '}
          <strong>top</strong>. That is why all the leaves always stay on the
          same level: a lopsided B-tree cannot happen.
        </p>
        <div className="code-block">
          <code>{`def split_node(node):
    mid = len(node.keys) // 2
    median = node.keys[mid]
    right = Node(node.keys[mid + 1:], node.children[mid + 1:])
    node.keys = node.keys[:mid]              # the left half stays
    node.children = node.children[:mid + 1]
    return median, right                     # the middle key goes up`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Deleting: Borrow or Merge</h3>
        <p>
          Delete is the mirror image. Instead of a node getting too full, it
          can get too empty (below the minimum). The tree repairs itself by
          borrowing a key from a neighbour, or by merging two neighbours back
          into one. There are four cases:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Situation</th>
                <th>What to do</th>
                <th>Why it works</th>
              </tr>
            </thead>
            <tbody>
              {deleteCases.map((row) => (
                <tr key={row.case}>
                  <td><strong>{row.case}</strong></td>
                  <td>{row.how}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A merge is the opposite of a split, and the tree can shrink at the
          top just as it grew there. The code is longer than for insert, so
          this page traces search and insert, and the delete cases above
          follow the same ideas.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Pick an operation, then press <strong>Play</strong>. The highlighted
          line is the one running now, and the tree is shown alongside with
          the <strong>call stack</strong> underneath. These trees hold at most
          3 keys per node so they stay readable. In <strong>Search</strong>,
          grey numbered nodes are the ones already read from disk, and the
          matching key turns green. In <strong>Insert</strong>, the blue node
          is the one being worked on, a node with too many keys turns red,
          and when a node splits, the middle key and the new node are
          shown in the yellow box as they are passed up to the caller.
        </p>
        <BTreeTracer />
        <p>
          In <strong>Search</strong>, compare <strong>Find 60</strong> (found
          in the root, one read) with <strong>Find 78</strong> and{' '}
          <strong>Not in the tree (33)</strong>, which both go to the bottom.
          In <strong>Insert</strong>, try them in order: <strong>Room in the
          leaf</strong> changes one box and nothing else. <strong>Leaf
          splits</strong> sends a key up. And <strong>Splits twice</strong>{' '}
          is the big one: the leaf splits, which overfills the root, which
          splits too, and a new root appears on top. The tree has grown a
          level, and every leaf is still on the same level.
        </p>
      </section>

      <section className="notebook-section">
        <h3>B-Trees in One Breath</h3>
        <div className="definition">
          A B-tree is a balanced search tree whose nodes each hold many sorted
          keys and have many children, with every leaf on the same level,
          kept that way by splitting nodes that get too full and merging ones
          that get too empty. It is designed to minimise reads from disk.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. Search, insert and delete each
              follow one path from the root to a leaf, so each costs the{' '}
              <strong>height</strong> of the tree. For a binary tree, the
              height is about <code>log&#8322; n</code>. For a B-tree whose
              nodes have <code>m</code> children, each level multiplies the
              reach by about <code>m</code>, so the height is about{' '}
              <code>log&#8344; n</code>.
            </p>
            <p>
              In big-O terms that is still <code>O(log n)</code>, because a
              logarithm to a different base only differs by a constant. But
              that constant is the whole point. A billion keys need 30 levels
              as a binary tree and 3 as a 1,000-way B-tree. When each level
              is a slow trip to disk, that is a tenfold speed-up.
            </p>
          </div>
          <BTreeLevelsVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Children per node</th>
                <th>Levels for a million keys</th>
                <th>Levels for a billion keys</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((row) => (
                <tr key={row.children}>
                  <td><strong>{row.children}</strong></td>
                  <td>{row.million}</td>
                  <td>{row.billion}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          You will often hear about a close relative, the{' '}
          <strong>B+ tree</strong>, which is what most databases actually use.
          It keeps every key in the leaves (the inner nodes hold only
          signposts), and links the leaves together in a chain, so reading a
          range of keys is a single walk along the bottom:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Tree</th>
                <th>Keys per node</th>
                <th>Keeps its shape by</th>
                <th>Best for</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.keys}</td>
                  <td>{row.balance}</td>
                  <td>{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Python has no B-tree type, but you use one whenever you add an
          index to a database table:
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
          <strong>The data lives on disk, or is too big for memory.</strong>{' '}
          This is what B-trees are for. Database indexes, file system
          directories and key-value stores are all built on B-trees or close
          relatives, because they turn a million-record lookup into a few
          block reads.
        </p>
        <p>
          <strong>You need order, not only a match.</strong> A B-tree keeps
          keys sorted, so it answers &ldquo;everything between a and b&rdquo;,
          &ldquo;the next key&rdquo; and sorted output efficiently. A hash
          index cannot.
        </p>
        <p>
          <strong>You cannot control the order the data arrives in.</strong>{' '}
          The tree stays perfectly balanced whatever you insert, with
          no worst case to worry about.
        </p>
        <p>
          <strong>Skip it when everything fits in memory.</strong> Without a
          slow disk, there is no gain from fat nodes, and the extra code is
          not worth it. An AVL tree, a sorted list with{' '}
          <code>bisect</code>, or a dict is simpler and as fast. And you will
          almost never write one yourself: use a database.
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

export default BTrees
