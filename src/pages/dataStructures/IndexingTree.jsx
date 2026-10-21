import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import IndexTreeTracer from './IndexTreeTracer.jsx'
import { LookupVisual, RangeVisual, SplitVisual, WorkVisual } from './IndexTreeVisuals.jsx'
import { levelsFor } from './indexData.js'

const comma = (n) => n.toLocaleString('en-US')

// Page reads to find a key, for tables of different sizes.
const levels = [1000, 1000000, 1000000000].map((rows) => ({
  rows: comma(rows),
  binary: Math.ceil(Math.log2(rows)),
  b100: levelsFor(rows, 100),
  b500: levelsFor(rows, 500),
}))

const kinds = [
  { prop: 'Where the keys are', btree: 'in every page, top to bottom', bplus: 'every key is in a leaf; the pages above hold only signposts (copies of keys)' },
  { prop: 'Links to the rows', btree: 'in every page', bplus: 'only in the leaves' },
  { prop: 'Keys per upper page', btree: 'fewer, because each carries a row link', bplus: 'more, so the tree is a little shallower' },
  { prop: 'Leaves joined together', btree: 'no', bplus: 'yes, left to right' },
  { prop: 'A range of keys', btree: 'climb up and down the tree', bplus: 'find the start, then follow the links' },
  { prop: 'A lookup', btree: 'can stop early, at an upper page', bplus: 'always goes to a leaf, so it always takes the same number of steps' },
]

const versus = [
  { prop: 'Find one row', scan: 'O(n)', sorted: 'O(log n), over many pages', hash: 'O(1) on average', tree: 'O(log n): about 3 or 4 page reads' },
  { prop: 'Rows between a and b', scan: 'O(n)', sorted: 'O(log n + k)', hash: 'not possible', tree: 'O(log n + k): follow the leaf links' },
  { prop: 'Rows in sorted order', scan: 'sort: O(n log n)', sorted: 'read the list', hash: 'not possible', tree: 'O(n): walk the leaves' },
  { prop: 'Add a row', scan: 'O(1)', sorted: 'O(n): entries shift', hash: 'O(1) on average', tree: 'O(log n): at most one split per level' },
  { prop: 'Stays fast as it grows', scan: 'no', sorted: 'inserts get slower', hash: 'yes (it resizes now and then)', tree: 'yes: always balanced' },
  { prop: 'Best when', scan: 'tiny tables', sorted: 'rarely-changing data', hash: 'exact-match lookups only', tree: 'almost everything else: it is the default' },
]

const costs = [
  { what: 'Find one key', time: 'O(log n)', why: 'One page per level, and about logₘ n levels when each page branches m ways. Searching inside a page is a binary search over a fixed-size page, which counts as constant.' },
  { what: 'Rows between a and b (k of them)', time: 'O(log n + k)', why: 'One walk down to a, then a step along the leaf links for each of the k results.' },
  { what: 'Add or delete a key', time: 'O(log n)', why: 'A walk down, a change in the leaf, and a split or merge at each level on the way back up if a page overflows or empties.' },
  { what: 'All keys in order', time: 'O(n)', why: 'Start at the first leaf and follow the links to the end.' },
  { what: 'Build by adding n keys one at a time', time: 'O(n log n)', why: 'n inserts of O(log n) each.' },
  { what: 'Build from keys that are already sorted (bulk load)', time: 'O(n)', why: 'Fill the leaves left to right, then build each level above from the one below. Databases do this for CREATE INDEX.' },
  { what: 'Memory', time: 'O(n)', why: 'Every page is at least about half full, so the tree is at most about twice the size of the keys.' },
  { what: 'The price on every write', time: '+ O(log n) per index', why: 'Each insert, update or delete on the table also changes every index on it.' },
]

const examples = [
  {
    id: 'find',
    prompt: 'Finding one key in a B+ tree that holds n keys.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'One page per level, and the number of levels grows like log n. Walking down needs only a few variables.',
  },
  {
    id: 'range',
    prompt: 'Reading all n keys of a B+ tree in sorted order, by starting at the first leaf and following the links.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every key is visited once, and each step is one move along the leaf. Nothing is stored.',
  },
  {
    id: 'insert',
    prompt: 'Inserting one key into a B+ tree of n keys, remembering the path from the root so that full pages can be split on the way back up.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'A walk down and at most one split per level on the way up. The path from the root is kept in memory, and it is as long as the tree is tall.',
  },
  {
    id: 'scan',
    prompt: 'Finding one row in a table of n rows that has no index: a full table scan.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'In the worst case every row is read once. Nothing is stored.',
  },
  {
    id: 'bulk',
    prompt: 'Building a B+ tree from n keys that are already sorted, by filling leaves left to right and then building the levels above them.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Every key is placed once, and each level above is much smaller than the one below. The tree itself holds n keys.',
  },
  {
    id: 'one-by-one',
    prompt: 'Building a B+ tree by inserting n keys one at a time.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'n inserts, each O(log n), and the finished tree holds all n keys.',
  },
  {
    id: 'in-page',
    prompt: 'Searching inside one page of a B+ tree for a key, with binary search, when every page holds at most 500 keys.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The page has a fixed maximum size, so the search takes at most about 9 steps whatever the size of the table. That is a constant.',
  },
  {
    id: 'hash-range',
    prompt: 'Finding every row with an id between a and b using a hash index of n entries.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'A hash scatters neighbouring keys, so every entry has to be checked. A B+ tree answers the same question in O(log n + k).',
  },
]

function IndexingTree() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Indexing</p>
      <h2>Indexing: Tree-Based</h2>
      <p>
        A sorted list is a fine index until the data starts to change: every
        insert moves half the list, and even a lookup jumps to about twenty
        places spread across the disk. A <strong>tree-based index</strong> keeps
        the same sorted keys, but in a <strong>balanced tree of pages</strong>:
        each page holds hundreds of keys, so a table of a million rows is only
        three levels deep. It is the index that almost every database builds
        when you say <code>CREATE INDEX</code>.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <LookupVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Indexing: Tree-Based &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A sorted index stored as a <strong>balanced tree of pages</strong>, usually a <strong>B+ tree</strong>.</li>
                <li>Each page holds many keys.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>A sorted list is slow to <strong>change</strong> and its lookups jump all over the disk.</li>
                <li>The tree keeps lookups <em>and</em> changes at <code>O(log n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Cut the sorted keys into pages.</li>
                <li>Index the pages. Index <em>that</em>. Repeat to a single root.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Looking up a key</h4>
              <ul>
                <li>Root, then down: pick the branch by the signposts.</li>
                <li>One <strong>page read</strong> per level, about 3 or 4 in all.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. B+ tree</h4>
              <ul>
                <li>Every key is in a <strong>leaf</strong>, beside its row&rsquo;s slot.</li>
                <li>Upper pages hold signposts only.</li>
                <li>Leaves are <strong>linked</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Ranges and order</h4>
              <ul>
                <li>Find the start once.</li>
                <li>Follow the leaf links: <code>O(log n + k)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Changing it</h4>
              <ul>
                <li>Add to the leaf.</li>
                <li>Full? <strong>Split</strong> it, copy a signpost up. Repeat upwards if needed.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. What you trade away</h4>
              <ul>
                <li>Every write pays for every index.</li>
                <li>Extra space.</li>
                <li>Slower than a hash for an exact match.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Indexes that are never used.</li>
                <li>Queries that <strong>cannot</strong> use the index: <code>LIKE '%x'</code>, or a function on the column.</li>
                <li>Tiny tables: a scan is fine.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Cut the sorted index into pages.</strong> Each page, called a <em>leaf</em>, holds a few hundred keys in order, each with the slot of its row.</li>
          <li><strong>Index the pages.</strong> Make a small page on top that holds the first key of each leaf. These keys are <em>signposts</em>: they say which leaf to go to.</li>
          <li><strong>Repeat.</strong> If there are too many signposts for one page, cut them into pages and put another layer on top. Keep going until there is a single page, the <em>root</em>.</li>
          <li><strong>Look up a key.</strong> Start at the root, use its signposts to pick a branch, and go down one level at a time until you reach a leaf. Read the slot there, and jump to the row.</li>
        </ol>
        <p>
          If you read about sparse indexes on the Linear page, this is a{' '}
          <em>sparse index of a sparse index of a sparse index</em>, stacked
          until it is one page. The B-Trees page showed how such a tree keeps
          itself balanced. This page is about <strong>what a database does with
          it</strong>.
        </p>
        <div className="code-block">
          <code>{`class Page:
    def __init__(self, keys, children=None):
        self.keys = keys                  # sorted
        self.children = children or []    # empty in a leaf
        self.slots = []                   # leaves only: the table slot of each key
        self.next = None                  # leaves only: the leaf on the right

    @property
    def is_leaf(self):
        return not self.children`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why Not Just a Sorted List?</h3>
        <p>
          Two reasons. First, <strong>changes</strong>: adding a key to a sorted
          list moves every later entry (<code>O(n)</code>), while adding it to
          one leaf of a tree touches one page. Second, <strong>reads</strong>:
          binary search on a list of a million entries makes about 20 jumps, each
          to a different place on the disk. A page holding 100 keys cuts that
          to 3 page reads, and the pages near the top are read so often that
          they stay in memory.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Rows in the table</th>
                <th>Binary search of a sorted list</th>
                <th>B+ tree, 100 keys a page</th>
                <th>B+ tree, 500 keys a page</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((row) => (
                <tr key={row.rows}>
                  <td><strong>{row.rows}</strong></td>
                  <td>{row.binary} reads</td>
                  <td>{row.b100} page reads</td>
                  <td>{row.b500} page reads</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>B+ Tree, Not B-Tree</h3>
        <p>
          Databases rarely use the plain B-tree from the B-Trees page. They use a
          small variation, the <strong>B+ tree</strong>, which keeps{' '}
          <em>every key in the leaves</em> and joins the leaves in a chain. The
          upper pages hold only signposts. Look at the pictures: the little
          arrows under the keys of a leaf are the slots of the rows, and the
          dashed arrows join each leaf to the next.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>B-tree</th>
                <th>B+ tree</th>
              </tr>
            </thead>
            <tbody>
              {kinds.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.btree}</td>
                  <td>{row.bplus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Ranges: Walk Down Once, Then Along</h3>
        <p>
          The links are what make a B+ tree good at the question a hash index
          cannot answer: <em>everything between a and b</em>, or everything{' '}
          <em>in order</em>.
        </p>
        <RangeVisual />
      </section>

      <section className="notebook-section">
        <h3>Changing It: Splitting a Page</h3>
        <p>
          A sorted list pays for every insert. A tree pays only for the page it
          touches. And when that page is full, it <strong>splits</strong>:
        </p>
        <SplitVisual />
        <p>
          The same idea in reverse handles deletes: a page that becomes too empty
          borrows a key from its neighbour or merges with it. The tree needs no
          rotations and never becomes lopsided.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          The same twelve employees, indexed by a B+ tree. Press{' '}
          <strong>Play</strong> and watch the code, the pages and the read counter
          together. Each number on a page is the order in which it was read, and
          the slot under each leaf key is where that row lives in the table:
        </p>
        <IndexTreeTracer />
        <p>
          In <strong>Lookup</strong>, <strong>id 78</strong> takes three page
          reads and one row read. <strong>id 50</strong> is not there: the leaf is
          read and it says no, so the table is never touched. In{' '}
          <strong>Range scan</strong>, <strong>ids 25 to 66</strong> walk down
          once (three pages), then follow links: watch the thick arrows. And{' '}
          <strong>ids 60 to 100</strong> run off the end of the last leaf.
        </p>
      </section>

      <section className="notebook-section">
        <h3>In a Real Database</h3>
        <p>
          You never build the tree yourself. You ask for an index, and the
          database builds and maintains it. Python&rsquo;s built-in{' '}
          <code>sqlite3</code> module lets you see the difference, using{' '}
          <code>EXPLAIN QUERY PLAN</code> to ask how a query will run:
        </p>
        <div className="code-block">
          <code>{`import sqlite3
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER)")
# ... 100,000 rows added ...

def plan(sql, *args):
    for row in db.execute("EXPLAIN QUERY PLAN " + sql, args):
        print(row[3])

plan("SELECT * FROM employees WHERE name = ?", "person42")
# SCAN employees                     <- reads every row

db.execute("CREATE INDEX idx_name ON employees (name)")
plan("SELECT * FROM employees WHERE name = ?", "person42")
# SEARCH employees USING INDEX idx_name (name=?)

db.execute("CREATE INDEX idx_salary ON employees (salary)")
plan("SELECT * FROM employees WHERE salary BETWEEN ? AND ?", 50000, 60000)
# SEARCH employees USING INDEX idx_salary (salary>? AND salary<?)

plan("SELECT * FROM employees ORDER BY salary")
# SCAN employees USING INDEX idx_salary     <- no sorting needed: the index is in order

plan("SELECT * FROM employees WHERE name LIKE ?", "%42")
# SCAN employees                     <- a leading % cannot use the index`}</code>
        </div>
        <p>
          That last line is the one to remember. An index is a <em>sorted</em>{' '}
          list, so it can only help a question that starts at the front of the key.
          &ldquo;Names that start with <code>per</code>&rdquo; can use it;
          &ldquo;names that end with <code>42</code>&rdquo; cannot, and neither can a
          query that wraps the column in a function, such as{' '}
          <code>WHERE salary + 0 = 50000</code>. (The primary key is special: in
          SQLite the table <em>is</em> a tree keyed by its id, so it needs no
          separate index.)
        </p>
        <p>
          One more idea: an index can cover <em>several columns</em>, such as{' '}
          <code>(city, name)</code>. It is sorted by city first, then by name
          inside each city, so it helps a question about city, or city and name,
          but not name alone. Order matters for the same reason as before.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Which Index?</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>No index</th>
                <th>Sorted list</th>
                <th>Hash</th>
                <th>B+ tree</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.scan}</td>
                  <td>{row.sorted}</td>
                  <td>{row.hash}</td>
                  <td>{row.tree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Tree-Based Index in One Breath</h3>
        <div className="definition">
          A tree-based index keeps the sorted keys of a table in a balanced tree
          of disk-sized pages, usually a B+ tree: every key sits in a leaf next
          to the location of its row, the pages above hold signposts, and the
          leaves are linked in order. Lookups take one page read per level, which
          is only a handful, ranges follow the links, and inserts split a page at
          most once per level, so everything stays at O(log n).
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A scan pays for every row. A sorted list pays for about 20 jumps.
              The tree pays for its <em>height</em>, which grows so slowly that a
              billion rows still fit in four or five levels.
            </p>
            <p>
              <code>O(log n)</code> to find, add or delete, <code>O(log n + k)</code>{' '}
              for a range, and <code>O(n)</code> memory.
            </p>
          </div>
          <WorkVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>What</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((row) => (
                <tr key={row.what}>
                  <td><strong>{row.what}</strong></td>
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
          <strong>You search a big table by a column, again and again.</strong>{' '}
          Users by email, orders by date, products by name.
        </p>
        <p>
          <strong>You need ranges, ordering or &ldquo;the newest 10&rdquo;.</strong>{' '}
          The leaves are already in order.
        </p>
        <p>
          <strong>The data changes as well as being read.</strong> This is where a
          tree beats a sorted list.
        </p>
        <p>
          <strong>You only ever ask &ldquo;equals&rdquo; and nothing else.</strong>{' '}
          A hash index can be a little faster, where the database offers one.
        </p>
        <p>
          <strong>The table is tiny, or you read most of it anyway.</strong> Skip
          the index. A scan is simpler and just as quick.
        </p>
        <p>
          <strong>The column is written far more than it is searched.</strong>{' '}
          Every index slows every write, so index what you search.
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

export default IndexingTree
