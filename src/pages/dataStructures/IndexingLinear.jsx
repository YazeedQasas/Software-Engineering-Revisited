import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import IndexLinearTracer from './IndexLinearTracer.jsx'
import { FindVisual, SparseVisual, HashVisual, InsertVisual, WorkVisual } from './IndexLinearVisuals.jsx'

const versus = [
  { prop: 'Find one row by id', none: 'O(n): read every row', dense: 'O(log n): binary search', sparse: 'O(log n), then look through one block', hash: 'O(1) on average' },
  { prop: 'Rows between two ids', none: 'O(n)', dense: 'O(log n + k): find the start, read on', sparse: 'O(log n + k)', hash: 'not possible: O(n)' },
  { prop: 'Rows in sorted order', none: 'sort them: O(n log n)', dense: 'read the index in order', sparse: 'the table is already sorted', hash: 'not possible' },
  { prop: 'Add a row', none: 'O(1): write at the end', dense: 'O(n): later entries move down', sparse: 'O(n): rows move to keep order', hash: 'O(1) on average' },
  { prop: 'Extra memory', none: 'none', dense: 'one entry per row', sparse: 'one entry per block', hash: 'one entry per row, plus spare buckets' },
  { prop: 'Needs', none: 'nothing', dense: 'nothing', sparse: 'the table kept sorted by the key', hash: 'nothing' },
  { prop: 'Best when', none: 'tiny tables, or you read everything anyway', dense: 'many lookups and ranges, few changes', sparse: 'big files that are kept sorted', hash: 'exact-match lookups only' },
]

const costs = [
  { what: 'Find a row with no index (a full table scan)', time: 'O(n)', why: 'In the worst case every row is read, one after another.' },
  { what: 'Find a row with a dense sorted index', time: 'O(log n)', why: 'Binary search halves the index each step, then one jump to the row.' },
  { what: 'Find a row with a sparse index', time: 'O(log n)', why: 'Binary search over the (smaller) index, then one block is read and looked through. A bigger block makes a smaller index but a longer look inside.' },
  { what: 'Find a row with a hash index', time: 'O(1) average', why: 'One calculation picks the bucket. It can degrade to O(n) if nearly everything lands in the same bucket.' },
  { what: 'Add a row to a sorted index', time: 'O(n)', why: 'Entries after the new one move down to make room, about half of them on average.' },
  { what: 'Build a sorted index', time: 'O(n log n)', why: 'It is one sort of n entries.' },
  { what: 'Memory', time: 'O(n)', why: 'A dense or hash index has an entry per row. A sparse one has only n divided by the block size.' },
  { what: 'The price on every write', time: '× the indexes', why: 'Each insert, update or delete has to change every index on the table, not just the table.' },
]

const examples = [
  {
    id: 'scan',
    prompt: 'Finding the row with a given id in a table of n rows with no index: a full table scan.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'In the worst case every row is read once. Nothing is stored.',
  },
  {
    id: 'dense',
    prompt: 'Finding a row through a sorted index of n entries with binary search, then jumping to its slot.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The index is halved at every step, and the jump to the row is one more read. Only a few variables are kept.',
  },
  {
    id: 'hash',
    prompt: 'Finding a row through a hash index: hash_index[id]',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'One calculation picks the bucket, so on average one lookup. It cannot answer a range question, though.',
  },
  {
    id: 'insert',
    prompt: 'Adding one entry to a sorted list index of n entries, which makes every later entry move down by one.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'About half the list moves on average, which is still proportional to n.',
  },
  {
    id: 'build',
    prompt: 'Building a sorted index for a table of n rows: sorted((row.id, slot) for slot, row in enumerate(table))',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'One sort of n entries, and the index holds an entry for every row.',
  },
  {
    id: 'range-start',
    prompt: 'Finding where a range of ids starts in a sorted index of n entries (the first entry that is at least the low end).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'It is a binary search. Reading the matches after that costs one step per match.',
  },
  {
    id: 'hash-range',
    prompt: 'Finding every row with an id between a and b when all you have is a hash index of n entries.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'A hash scatters neighbouring ids across buckets, so nothing says where the range is. Every entry has to be checked.',
  },
  {
    id: 'build-hash',
    prompt: 'Building a hash index for a table of n rows: {row.id: slot for slot, row in enumerate(table)}',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One pass over the rows, with an average O(1) insert each. The index holds an entry per row.',
  },
]

function IndexingLinear() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Indexing</p>
      <h2>Indexing: Linear</h2>
      <p>
        Here is a question a program asks thousands of times:{' '}
        <em>find the employee whose id is 78.</em> In a table of a million rows,
        reading every row until you meet it takes far too long. An{' '}
        <strong>index</strong> is a second, much smaller structure kept beside
        the table that says <strong>where each row lives</strong>, like the index
        at the back of a book. A <strong>linear index</strong> is the simplest
        kind: a flat list, either sorted or hashed.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <FindVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Indexing: Linear &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A second, smaller <strong>list</strong> beside the table.</li>
                <li>Each entry: a <strong>key</strong> and where its row lives (its <strong>slot</strong>).</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;Find the row with this id.&rdquo; &ldquo;Find the rows between a and b.&rdquo;</li>
                <li>Without an index, every row is read: a <strong>full table scan</strong>, <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Look the key up in the index.</li>
                <li>Then <strong>jump straight</strong> to the row.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Dense sorted index</h4>
              <ul>
                <li>One entry per row, sorted by key.</li>
                <li>Binary search: <code>O(log n)</code>.</li>
                <li>Ranges: find the start, read on.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Sparse index</h4>
              <ul>
                <li>One entry per <strong>block</strong> of a table kept sorted.</li>
                <li>Search the index, then look through one block.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Hash index</h4>
              <ul>
                <li>Key &rarr; bucket, by a calculation.</li>
                <li><code>O(1)</code> for &ldquo;equals&rdquo;. No ranges, no order.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Costs at a glance</h4>
              <ul>
                <li>Find: <code>O(log n)</code> (hash <code>O(1)</code>).</li>
                <li>Add to a sorted list: <code>O(n)</code>.</li>
                <li>Memory: <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. What you trade away</h4>
              <ul>
                <li>Extra space.</li>
                <li>Every write must <strong>update every index</strong>.</li>
                <li>A sorted list is slow to change.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Indexing a column nobody searches.</li>
                <li>A hash index for a range question.</li>
                <li>A sparse index needs the table <strong>sorted</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Leave the table alone.</strong> The rows stay in the order they were added. A row&rsquo;s <strong>slot</strong> is its place in the file: slot 0, slot 1, and so on.</li>
          <li><strong>Build a small list.</strong> One entry per row: the row&rsquo;s key (here, the id) and its slot.</li>
          <li><strong>Sort it by key.</strong> Now the keys are in order, even though the rows are not.</li>
          <li><strong>Search the index, not the table.</strong> Binary-search the sorted list for the key, read the slot it holds, and jump straight to that row.</li>
        </ol>
        <p>
          Two things are worth noticing. The index is much cheaper to search than
          the table, because each entry is tiny and the list is sorted. And the
          index does not replace the table: it only <em>points</em> into it. The
          row itself is still read from the table, once.
        </p>
        <div className="code-block">
          <code>{`from collections import namedtuple
Row = namedtuple("Row", ["id", "name"])

table = [Row(41, "Ada"), Row(17, "Ben"), Row(93, "Cai"), Row(8, "Dee"),
         Row(66, "Eli"), Row(25, "Fay"), Row(52, "Gus"), Row(3, "Hal"),
         Row(78, "Ivy"), Row(31, "Jon"), Row(60, "Kay"), Row(14, "Lou")]

# one (id, slot) entry for every row, sorted by id
index = sorted((row.id, slot) for slot, row in enumerate(table))
# [(3, 7), (8, 3), (14, 11), (17, 1), (25, 5), (31, 9), (41, 0), (52, 6),
#  (60, 10), (66, 4), (78, 8), (93, 2)]`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Kind 1: The Sorted (Dense) Index</h3>
        <p>
          This is the index you have just seen: an entry for <em>every</em> row,
          sorted by key. It gives you exact lookups in <code>O(log n)</code>, and
          it gives you something a scan cannot: <strong>ranges and order</strong>.
          To get every row with an id from 25 to 60, binary-search for 25 and read
          on down the index until you pass 60. The matches are in one unbroken
          run. (Python&rsquo;s <code>bisect</code> module does the binary search
          for you.)
        </p>
        <p>
          The weakness is on the other side: a sorted list is slow to change. More
          on that in a moment.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Kind 2: The Sparse Index</h3>
        <p>
          An index with an entry for every row can still be big. If the table
          itself is kept sorted by key, and read from disk in <strong>blocks</strong>{' '}
          of several rows, there is a cheaper trick: index only the{' '}
          <em>first key of each block</em>.
        </p>
        <SparseVisual />
        <div className="code-block">
          <code>{`table_sorted = sorted(table)       # rows in order of id
blocks = [table_sorted[i:i + 3] for i in range(0, len(table_sorted), 3)]
index = [block[0].id for block in blocks]       # [3, 17, 41, 66]`}</code>
        </div>
        <p>
          With blocks of 100 rows, the index is 100 times smaller than a dense one,
          so it is far more likely to fit in memory. The price is that the table
          must be kept in sorted order, and the last step is a look through a
          block. The tracer below runs both.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Kind 3: The Hash Index</h3>
        <p>
          A hash index is the same idea as a Python dictionary: a calculation turns
          the key into a bucket, and the bucket holds the slot. For &ldquo;find the
          row with this id&rdquo;, nothing is faster. For anything involving
          order, nothing is worse:
        </p>
        <HashVisual />
        <div className="code-block">
          <code>{`hash_index = {row.id: slot for slot, row in enumerate(table)}

hash_index[78]         # 8
hash_index.get(50)     # None`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Price of an Index</h3>
        <p>
          An index is not free. It takes space, and, more importantly, every time
          the table changes, <strong>every index on it has to change too</strong>.
          For a table, adding a row is easy: write it at the end. For a sorted
          index, it means making room:
        </p>
        <InsertVisual />
        <p>
          So an index is a bet: it pays off for columns you <em>search</em> often
          and loses for columns you only write. That is why databases do not index
          every column.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Same twelve employees as in the pictures. Press <strong>Play</strong>{' '}
          and watch the code, the index and the table change together. The bar
          under the picture counts the reads, which is what an index is really
          saving. Here is the table the tracer uses:
        </p>
        <div className="code-block">
          <code>{`table = [Row(41, "Ada"), Row(17, "Ben"), Row(93, "Cai"), Row(8, "Dee"),
         Row(66, "Eli"), Row(25, "Fay"), Row(52, "Gus"), Row(3, "Hal"),
         Row(78, "Ivy"), Row(31, "Jon"), Row(60, "Kay"), Row(14, "Lou")]`}</code>
        </div>
        <IndexLinearTracer />
        <p>
          In <strong>No index</strong>, try <strong>id 78</strong>: nine row reads
          for one row. In <strong>Sorted index</strong>, <strong>id 78</strong>{' '}
          takes three index reads and one row read, and{' '}
          <strong>id 50</strong> shows the best part of a miss: the search ends
          without the table ever being touched. In <strong>Sparse index</strong>,
          watch <strong>id 78</strong> pick block 3 with three reads of a four-entry
          index, then look through a block of three rows.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Which One?</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>No index</th>
                <th>Sorted (dense)</th>
                <th>Sparse</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.none}</td>
                  <td>{row.dense}</td>
                  <td>{row.sparse}</td>
                  <td>{row.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Linear Index in One Breath</h3>
        <div className="definition">
          A linear index is a flat list kept beside a table that maps each key to
          where its row is stored. Sorted, it lets you find a key with binary
          search; sparse, it keeps one entry per block; hashed, it finds an exact
          key in constant time. In every form it replaces reading every row with a
          search of a much smaller list followed by a single jump.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A scan pays for every row. An index pays for the size of the{' '}
              <em>index</em>, searched cleverly: about 20 reads for a million rows,
              not a million.
            </p>
            <p>
              <code>O(log n)</code> to find, <code>O(n)</code> to add to a sorted
              list, and an extra <code>O(n)</code> of memory.
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
          <strong>You look rows up by a column far more often than you change
          them.</strong> Users by id, orders by date, products by name.
        </p>
        <p>
          <strong>You need ranges or order.</strong> Use a sorted index. A hash
          index cannot do either.
        </p>
        <p>
          <strong>You only ever ask &ldquo;equals&rdquo;.</strong> A hash index is
          the fastest.
        </p>
        <p>
          <strong>The table is huge and kept sorted.</strong> A sparse index keeps
          the index small enough to live in memory.
        </p>
        <p>
          <strong>The table is tiny, or you read every row anyway.</strong> Skip
          it. A scan of a few hundred rows is already fast.
        </p>
        <p>
          <strong>The data changes constantly.</strong> A flat sorted list is slow
          to update. That is the problem tree-based indexes solve, and the next
          page is about them.
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

export default IndexingLinear
