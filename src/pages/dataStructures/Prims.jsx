import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import PrimTracer from './PrimTracer.jsx'
import { RoundsVisual, SpanningTreeVisual, CutVisual, VersusVisual, HeapWorkVisual } from './PrimVisuals.jsx'

const words = [
  { word: 'Spanning tree', meaning: 'A set of edges that joins every node with no loops. With V nodes it always has exactly V − 1 edges.' },
  { word: 'Minimum spanning tree (MST)', meaning: 'The spanning tree whose edges add up to the smallest total cost.' },
  { word: 'Candidate edge', meaning: 'An edge with one end inside the tree and one end outside. Only these can grow the tree.' },
  { word: 'Loop (cycle)', meaning: 'A path that comes back to where it started. A tree has none.' },
]

const versus = [
  { prop: 'Asks', dij: 'what is the cheapest route from the start to each node?', prim: 'what is the cheapest way to join every node?' },
  { prop: 'Heap sorted by', dij: 'total distance from the start (d + w)', prim: 'just the edge weight (w)' },
  { prop: 'Result', dij: 'a shortest-path tree', prim: 'a minimum spanning tree' },
  { prop: 'Graph', dij: 'directed or undirected', prim: 'undirected' },
  { prop: 'Negative weights', dij: 'breaks', prim: 'fine' },
  { prop: 'Time (heap)', dij: 'O((V + E) log V)', prim: 'O(E log V)' },
]

const costs = [
  { what: 'Prim with a heap, graph as an adjacency list', time: 'O(E log V)', why: 'Each edge goes on the heap at most once from each end, and a push or pop costs log V.' },
  { what: 'Prim finding the cheapest edge by scanning a plain list', time: 'O(V²)', why: 'V rounds, each scanning up to V nodes. Fine for dense graphs, where E is close to V².' },
  { what: 'Prim with an adjacency matrix', time: 'O(V²)', why: 'Finding the neighbours of a node means reading a whole row of V cells.' },
  { what: 'Checking v in in_tree', time: 'O(1)', why: 'in_tree is a set, so it is a single hash lookup.' },
  { what: 'One heap push or pop', time: 'O(log V)', why: 'The same heap as in Dijkstra.' },
  { what: 'Adding up the cost of the finished tree', time: 'O(V)', why: 'The tree has only V − 1 edges.' },
  { what: 'Extra memory', time: 'O(V + E)', why: 'in_tree and tree hold about V things. The heap can hold up to E entries, because old ones are skipped, not removed.' },
]

const examples = [
  {
    id: 'heap',
    prompt: "Prim's algorithm with a heap, on a connected graph with n nodes and about n edges, stored as an adjacency list.",
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'About n heap pushes and pops at log n each. in_tree, tree and the heap all hold about n things.',
  },
  {
    id: 'scan',
    prompt: "Prim's algorithm that finds the cheapest edge leaving the tree by scanning a plain list of all n nodes every round (n nodes).",
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'n rounds, and each one reads up to n entries to find the smallest. The heap is what saves us on sparse graphs.',
  },
  {
    id: 'matrix',
    prompt: "Prim's algorithm with a plain scan, on a graph of n nodes stored as an adjacency matrix.",
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Each of the n rounds scans n nodes for the cheapest, then reads a row of n cells to find the neighbours.',
  },
  {
    id: 'in-tree',
    prompt: 'Checking whether a node is already in the tree: v in in_tree (in_tree is a set).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'A set is a hash table, so the lookup does not depend on how many nodes are in it.',
  },
  {
    id: 'stale',
    prompt: 'Skipping an edge whose far end is already in the tree: if v in in_tree: continue',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'One set lookup. The entry has already been popped, so throwing it away costs nothing more.',
  },
  {
    id: 'push',
    prompt: 'One heappush of (weight, from, to) onto a heap that holds up to n entries.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The entry moves up at most the height of the heap, which is log n levels.',
  },
  {
    id: 'total',
    prompt: 'Adding up the costs of the n − 1 edges of a finished tree.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One addition per edge, and a single running total.',
  },
  {
    id: 'already-tree',
    prompt: "Prim's algorithm with a heap, on a graph that is already a tree: n nodes and n − 1 edges.",
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Every edge has to be kept, but each one still goes through the heap, so it is about n pushes and pops at log n each.',
  },
]

function Prims() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Prim&rsquo;s Algorithm</h2>
      <p>
        Imagine you must join seven towns with cable, and each possible cable
        costs something different. Which cables give you a connected network
        for the <strong>smallest total cost</strong>? That is called a{' '}
        <strong>minimum spanning tree</strong>, and <strong>Prim&rsquo;s
        algorithm</strong> builds one with a simple habit: start anywhere, then
        keep adding the cheapest cable that reaches a new town.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <RoundsVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Prim&rsquo;s Algorithm &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>The cheapest set of edges that joins <strong>every node</strong>, with no loops.</li>
                <li>Grows a single tree from a start node.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;What is the cheapest way to connect everything?&rdquo;</li>
                <li>Cables, pipes, roads, networks.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>The tree starts as one node.</li>
                <li>Take the <strong>cheapest edge leaving the tree</strong>. Its far end joins.</li>
                <li>Repeat until every node is in.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Why it is safe</h4>
              <ul>
                <li>The finished tree must cross from inside to outside somewhere.</li>
                <li>The cheapest crossing edge can never be a mistake.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. A free bonus</h4>
              <ul>
                <li>If all costs are different, any start node gives the <strong>same</strong> tree.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(E log V)</code> with a heap.</li>
                <li>Memory: <code>O(V + E)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Undirected graphs only.</li>
                <li>Not shortest routes: it only minimises the total.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You must connect everything as cheaply as possible.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Mixing it up with Dijkstra: Prim compares edge weights, not distances.</li>
                <li>A graph in pieces: Prim only reaches the start&rsquo;s piece.</li>
                <li>Forgetting to skip edges whose far end is already in.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>What Is a Spanning Tree?</h3>
        <p>
          Many different sets of edges join all the nodes. Some cost a lot, and
          one costs the least:
        </p>
        <SpanningTreeVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>What it means</th>
              </tr>
            </thead>
            <tbody>
              {words.map((row) => (
                <tr key={row.word}>
                  <td><strong>{row.word}</strong></td>
                  <td>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Set up.</strong> Pick any start node. It is the whole tree so far.</li>
          <li><strong>Pick.</strong> Look at every edge with one end in the tree and one end outside. Take the cheapest.</li>
          <li><strong>Grow.</strong> Add that edge, and the node at its far end, to the tree.</li>
          <li><strong>Repeat</strong> until every node is in the tree.</li>
        </ol>
        <p>
          A heap makes step 2 fast: it always hands back the cheapest edge
          waiting.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Why the Cheapest Edge Is Safe</h3>
        <p>
          Taking the cheapest edge each time is a <strong>greedy</strong>{' '}
          choice, and greedy often goes wrong. Here it cannot, and this is why:
        </p>
        <CutVisual />
        <p>
          Whatever tree we finish with has to reach the outside nodes through
          one of the candidate edges. If it used a dearer one, swapping in the
          cheapest would only make it cheaper.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong>. Green nodes and edges are in the tree,
          gold edges are the candidates, and the heap underneath always puts
          the cheapest candidate first. The graph is stored the same way as
          for Dijkstra, as <code>(neighbour, cost)</code> pairs:
        </p>
        <div className="code-block">
          <code>{`from heapq import heapify, heappush, heappop

graph = {
    'A': [('B', 6), ('F', 12), ('G', 4)],
    'B': [('A', 6), ('C', 5), ('G', 3)],
    'C': [('B', 5), ('D', 8), ('G', 7)],
    'D': [('C', 8), ('E', 1), ('G', 11)],
    'E': [('D', 1), ('F', 2), ('G', 10)],
    'F': [('E', 2), ('A', 12), ('G', 9)],
    'G': [('A', 4), ('B', 3), ('C', 7),
          ('D', 11), ('E', 10), ('F', 9)],
}`}</code>
        </div>
        <PrimTracer />
        <p>
          Watch for the red edges. When <code>A–B (6)</code> comes off the
          heap, both A and B are already in the tree, so adding it would close
          a loop and the code skips it. Then try{' '}
          <strong>Start at D</strong>: the edges are picked in a different
          order, but the finished tree is the same, and so is its cost. And{' '}
          <strong>Two separate groups</strong> shows what happens when the graph
          is in pieces: Prim only reaches its own piece.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Prim or Dijkstra?</h3>
        <p>
          The code looks almost the same as Dijkstra&rsquo;s, which is why they
          are easy to mix up. The difference is what goes in the heap: Dijkstra
          uses the <em>total distance from the start</em>, Prim uses just the{' '}
          <em>edge weight</em>. That small change builds a very different tree:
        </p>
        <VersusVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Dijkstra</th>
                <th>Prim</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.dij}</td>
                  <td>{row.prim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Prim&rsquo;s in One Breath</h3>
        <div className="definition">
          Prim&rsquo;s algorithm builds a minimum spanning tree by growing one
          tree from a start node. It repeatedly takes the cheapest edge that
          leaves the tree, using a heap, and adds that edge and the node at its
          far end.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Every edge goes on the heap at most once from each end, and each
              push or pop costs <code>log V</code>:
            </p>
            <p>
              <code>O(E log V)</code> time, and <code>O(V + E)</code> memory.
            </p>
          </div>
          <HeapWorkVisual />
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
        <p>
          With a fancier heap (a Fibonacci heap) it drops to{' '}
          <code>O(E + V log V)</code>, but the plain heap above is what almost
          everyone uses.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You must connect everything as cheaply as you can.</strong>{' '}
          Laying cable, pipes or roads between places, wiring a circuit board,
          designing a network.
        </p>
        <p>
          <strong>You want groups.</strong> Stop Prim early, or cut the dearest
          edges from the finished tree, and what is left falls into clusters of
          close-together nodes.
        </p>
        <p>
          <strong>You want the cheapest route from one place to others.</strong>{' '}
          That is a different question. Use Dijkstra.
        </p>
        <p>
          <strong>Your graph is sparse and given as a list of edges.</strong>{' '}
          Kruskal&rsquo;s algorithm, coming up next, builds the same tree a
          different way and can be simpler there.
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

export default Prims
