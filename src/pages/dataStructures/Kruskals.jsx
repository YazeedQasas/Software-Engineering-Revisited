import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import KruskalTracer from './KruskalTracer.jsx'
import { RoundsVisual, LoopTestVisual, VersusVisual, WorkVisual } from './KruskalVisuals.jsx'

const versus = [
  { prop: 'Starts from', prim: 'one node', kruskal: 'all the edges, sorted' },
  { prop: 'How it grows', prim: 'one tree, outwards', kruskal: 'many small groups that merge' },
  { prop: 'Each step', prim: 'take the cheapest edge leaving the tree', kruskal: 'take the next cheapest edge that does not close a loop' },
  { prop: 'Needs', prim: 'a heap and neighbour lists', kruskal: 'a sorted edge list and Union-Find' },
  { prop: 'Graph in pieces', prim: 'reaches only the start’s piece', kruskal: 'gives a tree for every piece (a spanning forest)' },
  { prop: 'Time', prim: 'O(E log V) with a heap', kruskal: 'O(E log E), which is O(E log V)' },
  { prop: 'Often better for', prim: 'dense graphs', kruskal: 'sparse graphs, or edges given as a list' },
]

const costs = [
  { what: 'Kruskal, with sorting and Union-Find', time: 'O(E log E)', why: 'Sorting the edges is the big cost. And since E is at most V², log E is at most 2 log V, so this is the same as O(E log V).' },
  { what: 'Sorting all E edges', time: 'O(E log E)', why: 'The same as sorting any list of E things.' },
  { what: 'The loop over the sorted edges', time: 'O(E × α(V))', why: 'Two finds per edge. With path halving, each find is almost O(1) (α is the inverse Ackermann function, which stays below 5 for any real graph).' },
  { what: 'A find with no shortcuts, on a long chain', time: 'O(V)', why: 'Without path halving or joining the smaller group under the bigger, the pointers can form a chain as long as the graph.' },
  { what: 'Adding up the cost of the finished tree', time: 'O(V)', why: 'The tree has only V − 1 edges.' },
  { what: 'Extra memory', time: 'O(V + E)', why: 'parent and tree hold about V things, and sorted() makes a copy of the E edges.' },
]

const examples = [
  {
    id: 'whole',
    prompt: "Kruskal's algorithm with sorting and Union-Find, on a connected graph with n nodes and about n edges.",
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Sorting about n edges costs n log n, and the loop after it is almost free. parent, tree and the sorted copy all hold about n things.',
  },
  {
    id: 'sort',
    prompt: 'Sorting a list of n edges by weight: sorted(edges)',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'A comparison sort needs about n log n steps, and sorted() builds a new list of n edges.',
  },
  {
    id: 'compare',
    prompt: 'Comparing two roads that have already been found: if root_u != root_v',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'It is one comparison of two values.',
  },
  {
    id: 'chain',
    prompt: 'One find on a Union-Find with no shortcuts, where the parent pointers form a single chain of n nodes.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'It has to follow every pointer along the chain to reach the top. It only needs a variable to hold where it is now.',
  },
  {
    id: 'loop',
    prompt: 'Just the loop over n sorted edges, if every find takes O(1).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One pass over the edges, with a constant amount of work for each.',
  },
  {
    id: 'total',
    prompt: 'Adding up the costs of the n − 1 edges of a finished tree.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One addition per edge, and a single running total.',
  },
  {
    id: 'append',
    prompt: 'Keeping an edge: tree.append((u, v, w))',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Adding to the end of a Python list takes constant time on average.',
  },
  {
    id: 'already-tree',
    prompt: "Kruskal's algorithm on a graph that is already a tree: n nodes and n − 1 edges.",
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Every edge is kept, but they still have to be sorted first, which costs n log n.',
  },
]

function Kruskals() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Kruskal&rsquo;s Algorithm</h2>
      <p>
        Prim&rsquo;s algorithm grew a single tree outwards. <strong>Kruskal&rsquo;s
        algorithm</strong> builds the same kind of answer, the cheapest set of
        edges joining every node, in a different way:{' '}
        <strong>sort all the edges, cheapest first, and keep each one unless it
        would close a loop</strong>.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <RoundsVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Kruskal&rsquo;s Algorithm &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>The cheapest set of edges that joins <strong>every node</strong>, with no loops: a minimum spanning tree.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;What is the cheapest way to connect everything?&rdquo;</li>
                <li>The same question as Prim&rsquo;s.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li><strong>Sort</strong> every edge, cheapest first.</li>
                <li>Go down the list. <strong>Keep</strong> an edge unless both its ends are already joined.</li>
                <li>Stop when you have <strong>V &minus; 1</strong> edges.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The loop test</h4>
              <ul>
                <li>Same group: it would close a loop, so skip.</li>
                <li>Different groups: it joins them, so keep.</li>
                <li>Groups are tracked with <strong>Union-Find</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. A free bonus</h4>
              <ul>
                <li>A graph in pieces gives a tree for each piece: a <strong>spanning forest</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(E log E)</code>, mostly the sort.</li>
                <li>Memory: <code>O(V + E)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Must sort every edge first.</li>
                <li>Undirected graphs only.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>The graph is sparse, or the edges come as a plain list.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Forgetting the loop test: you get a graph with loops, not a tree.</li>
                <li>Putting the weight last in the tuple: sorting no longer sorts by cost.</li>
                <li>Mixing it up with Prim: Kruskal grows many groups, Prim grows one tree.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Sort.</strong> Put every edge in order, cheapest first.</li>
          <li><strong>Look.</strong> Take the next edge in the list.</li>
          <li><strong>Decide.</strong> If its two ends are in <em>different</em> groups, keep it and join the groups. If they are in the <em>same</em> group, skip it.</li>
          <li><strong>Stop</strong> when you have kept V &minus; 1 edges, or when the list runs out.</li>
        </ol>
        <p>
          At the start every node is a group of one. Each edge you keep joins two
          groups into one, so after V &minus; 1 kept edges there is a single
          group, and that is the whole graph.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Loop Test</h3>
        <p>
          The only clever part is deciding whether an edge would close a loop.
          That turns out to be one question: <strong>are its two ends already in
          the same group?</strong>
        </p>
        <LoopTestVisual />
        <p>
          The code keeps track of the groups with a structure called{' '}
          <strong>Union-Find</strong>. Every node has a <code>parent</code>{' '}
          pointer, and following the pointers up leads to the group&rsquo;s{' '}
          <strong>root</strong>. <code>find</code> goes up to the root, and
          joining two groups is just pointing one root at the other. Two nodes
          are in the same group exactly when they have the same root. Union-Find
          gets a page of its own later on.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong>. Node colours show the groups, the sorted
          list is underneath with the edge being looked at highlighted, and
          after each <code>find</code> a small badge on the node shows its root.
          The edges are tuples with the weight first, so{' '}
          <code>sorted(edges)</code> sorts them by cost:
        </p>
        <div className="code-block">
          <code>{`nodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
edges = [
    (6, 'A', 'B'), (5, 'B', 'C'), (8, 'C', 'D'),
    (1, 'D', 'E'), (2, 'E', 'F'), (12, 'F', 'A'),
    (4, 'G', 'A'), (3, 'G', 'B'), (7, 'G', 'C'),
    (11, 'G', 'D'), (10, 'G', 'E'), (9, 'G', 'F'),
]`}</code>
        </div>
        <KruskalTracer />
        <p>
          Watch for the red edges: <code>A–B (6)</code> and <code>G–C (7)</code>{' '}
          are skipped because their ends already have the same root. After{' '}
          <code>C–D (8)</code> the tree has 6 edges, and the code stops without
          even looking at the last four. Then try{' '}
          <strong>Two separate groups</strong>: every edge is looked at, but
          only 4 are kept for 6 nodes, because the graph is in two pieces. Prim
          could only reach one of them; Kruskal gives a tree for each.
        </p>
        <p>
          <code>find</code> has one small trick,{' '}
          <code>parent[x] = parent[parent[x]]</code>: as it climbs, it skips each
          node ahead to its grandparent, which keeps the pointer chains short.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Kruskal or Prim?</h3>
        <p>
          Both build a minimum spanning tree, and if all the costs are
          different they build <em>exactly the same one</em>. What differs is
          how it grows:
        </p>
        <VersusVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Prim</th>
                <th>Kruskal</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.prim}</td>
                  <td>{row.kruskal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Kruskal&rsquo;s in One Breath</h3>
        <div className="definition">
          Kruskal&rsquo;s algorithm builds a minimum spanning tree by sorting
          all the edges from cheapest to dearest and keeping each one unless its
          two ends are already in the same group, which is tracked with
          Union-Find. It stops once it has V &minus; 1 edges.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Almost all of the work is the sort. After that, each edge needs two
              quick <code>find</code> calls:
            </p>
            <p>
              <code>O(E log E)</code> time, which is the same as{' '}
              <code>O(E log V)</code>, and <code>O(V + E)</code> memory.
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
          <strong>You must connect everything as cheaply as you can</strong>, and
          the graph is sparse or the edges arrive as a plain list. Laying cable,
          pipes or roads, wiring a circuit board, designing a network.
        </p>
        <p>
          <strong>The graph may be in pieces.</strong> Kruskal gives you the
          cheapest tree for every piece.
        </p>
        <p>
          <strong>You want clusters.</strong> Stop Kruskal early, before the last
          few edges, and the groups you are left with are clusters of
          close-together nodes. That is a common way to group data.
        </p>
        <p>
          <strong>The graph is dense (E close to V²).</strong> Prim with an
          adjacency matrix, <code>O(V²)</code>, can be the better choice.
        </p>
        <p>
          <strong>You want the cheapest route from one place to others.</strong>{' '}
          That is a different question. Use Dijkstra.
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

export default Kruskals
