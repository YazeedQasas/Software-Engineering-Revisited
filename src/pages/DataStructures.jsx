const outline = [
  {
    category: 'Foundation (asked about constantly)',
    items: [
      { id: 'arrays', label: 'Arrays & Dynamic Arrays', blurb: 'Indexing, insertion/deletion costs, resizing, and patterns like two pointers, sliding window, and prefix sums.' },
      { id: 'strings', label: 'Strings', blurb: 'Immutability, building strings efficiently, and common problems like anagrams, palindromes, and substring search.' },
      { id: 'hash-tables', label: 'Hash Tables (Maps & Sets)', blurb: "How hashing works, collisions (chaining vs. open addressing), load factor, and why lookups are O(1) average but O(n) worst case. The most-used tool in interview solutions." },
    ],
  },
  {
    category: 'Core Linear Structures',
    items: [
      { id: 'linked-lists', label: 'Linked Lists', blurb: 'Singly vs. doubly linked, reversal, cycle detection (fast/slow pointers), merging, and when they beat arrays.' },
      { id: 'stacks-queues', label: 'Stacks & Queues', blurb: 'LIFO vs. FIFO, implementing one with the other, monotonic stacks, and deques.' },
    ],
  },
  {
    category: 'Trees & Graphs',
    items: [
      { id: 'binary-trees', label: 'Binary Trees', blurb: 'Traversals (pre/in/post-order, level-order), recursion vs. iteration, height, and path problems.' },
      { id: 'bst', label: 'Binary Search Trees', blurb: 'The ordering property, search/insert/delete, validating a BST, and why balance matters (brief awareness of AVL/red-black trees is enough).' },
      { id: 'heaps', label: 'Heaps / Priority Queues', blurb: 'Min-heap vs. max-heap, heapify, and classic uses like top-k elements and merging sorted lists.' },
      { id: 'graphs', label: 'Graphs', blurb: 'Adjacency list vs. matrix, BFS vs. DFS, cycle detection, topological sort, and shortest paths (Dijkstra at a conceptual level).' },
    ],
  },
  {
    category: 'Good to Know (Differentiators)',
    items: [
      { id: 'tries', label: 'Tries', blurb: 'Prefix trees for autocomplete and word-search problems.' },
      { id: 'union-find', label: 'Union-Find (Disjoint Set)', blurb: 'Connected components, with path compression and union by rank.' },
    ],
  },
]

const bigORows = [
  { name: 'Array', access: 'O(1)', search: 'O(n)', insert: 'O(n)', del: 'O(n)' },
  { name: 'Linked List', access: 'O(n)', search: 'O(n)', insert: 'O(1)', del: 'O(1)' },
  { name: 'Stack', access: 'O(n)', search: 'O(n)', insert: 'O(1)', del: 'O(1)' },
  { name: 'Queue', access: 'O(n)', search: 'O(n)', insert: 'O(1)', del: 'O(1)' },
  { name: 'Hash Map', access: '—', search: 'O(1)*', insert: 'O(1)*', del: 'O(1)*' },
  { name: 'Binary Search Tree', access: 'O(log n)*', search: 'O(log n)*', insert: 'O(log n)*', del: 'O(log n)*' },
  { name: 'Balanced BST (AVL / Red-Black)', access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', del: 'O(log n)' },
  { name: 'Binary Heap', access: '—', search: 'O(n)', insert: 'O(log n)', del: 'O(log n)' },
]

function DataStructures() {
  return (
    <article className="topic-page">
      <h2>Data Structures</h2>

      <div className="callout">
        <strong>Interviewer tip:</strong> beyond knowing each structure,
        interviewers love trade-off questions like &ldquo;array vs. linked
        list?&rdquo; or &ldquo;hash map vs. BST?&rdquo; &mdash; for every
        structure, be ready to say what it&rsquo;s good at, what it&rsquo;s
        bad at, and when you&rsquo;d choose it.
      </div>

      <div className="index-card">
        <h3>Contents</h3>
        <ol>
          <li>
            <a href="#big-o">Big-O Complexity</a>
          </li>
          {outline.flatMap((group) => group.items).map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </div>

      <section id="big-o" className="notebook-section">
        <h3>Big-O Complexity</h3>
        <p>
          State the time <em>and</em> space complexity for every operation
          you mention &mdash; interviewers expect both, not just time.
        </p>

        <div className="table-wrap">
          <table className="bigo-table">
            <thead>
              <tr>
                <th>Data Structure</th>
                <th>Access</th>
                <th>Search</th>
                <th>Insertion</th>
                <th>Deletion</th>
              </tr>
            </thead>
            <tbody>
              {bigORows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td><code>{row.access}</code></td>
                  <td><code>{row.search}</code></td>
                  <td><code>{row.insert}</code></td>
                  <td><code>{row.del}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          * Average case. Hash maps degrade to <code>O(n)</code> on heavy
          collisions; unbalanced BSTs degrade to <code>O(n)</code> on sorted
          input (they become a linked list in disguise).
        </p>
        <p className="table-note">
          Space: each structure above uses <code>O(n)</code> extra space to
          hold n elements. Recursive tree operations also carry a call-stack
          cost &mdash; <code>O(log n)</code> for a balanced BST,
          <code> O(n)</code> for an unbalanced one.
        </p>

        <h4>Amortized cost</h4>
        <p>
          Not every operation costs the same every time &mdash;{' '}
          <strong>amortized analysis</strong> looks at the average cost over
          a sequence of operations, not the worst single one. Example:
          appending to a dynamic array is usually <code>O(1)</code>, but
          occasionally the array is full and has to resize into new memory,
          copying every existing element &mdash; an <code>O(n)</code> hit.
          Because that resize happens rarely (capacity doubles each time),
          the cost of copying is spread out over all the cheap appends that
          came before it, so the <strong>amortized</strong> cost per append
          still works out to <code>O(1)</code>.
        </p>
      </section>

      {outline.map((group) => (
        <div key={group.category}>
          <h3 className="notebook-category">{group.category}</h3>
          {group.items.map((item) => (
            <div key={item.id} id={item.id} className="topic-card">
              <div className="topic-card-header">
                <h4>{item.label}</h4>
                <span className="status-tag">Not started</span>
              </div>
              <p>{item.blurb}</p>
            </div>
          ))}
        </div>
      ))}
    </article>
  )
}

export default DataStructures
