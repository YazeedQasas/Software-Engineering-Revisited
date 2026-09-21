import bigOChart from '../assets/image.png'

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
        <div className="pinned-photo">
          <img
            src={bigOChart}
            alt="Hand-drawn graph of time vs. input size (n) comparing Big-O growth curves, from best to worst: O(1), O(log n), O(√n), O(n), O(n log n), O(n²), O(2^n), O(n!)"
          />
        </div>
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
