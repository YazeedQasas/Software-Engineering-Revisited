import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import GraphTheoryTracer from './GraphTheoryTracer.jsx'
import { KonigsbergVisual, GraphKindsVisual, CompleteGraphsVisual } from './GraphTheoryVisuals.jsx'

const everywhere = [
  { thing: 'Friends on a social site', nodes: 'people', edges: 'friendships', kind: 'undirected' },
  { thing: 'A road map', nodes: 'junctions', edges: 'roads, with their lengths', kind: 'undirected, weighted' },
  { thing: 'The web', nodes: 'pages', edges: 'links', kind: 'directed' },
  { thing: 'Flights', nodes: 'airports', edges: 'flights, with their prices', kind: 'directed, weighted' },
  { thing: 'A degree plan', nodes: 'courses', edges: '“take this first”', kind: 'directed, no cycles' },
]

const growth = [
  { n: '3', undirected: '3', directed: '6' },
  { n: '5', undirected: '10', directed: '20' },
  { n: '10', undirected: '45', directed: '90' },
  { n: '100', undirected: '4,950', directed: '9,900' },
  { n: '1,000', undirected: '499,500', directed: '999,000' },
  { n: '1,000,000', undirected: 'about 500 billion', directed: 'about 1 trillion' },
]

const next = [
  { ask: 'Can I get from A to B? What is nearby?', tool: 'Search through the graph', page: 'Graph Search (BFS & DFS)' },
  { ask: 'What is the cheapest route?', tool: 'Shortest paths', page: 'Dijkstra, Bellman-Ford and A*' },
  { ask: 'How do I join everything together as cheaply as possible?', tool: 'Minimum spanning tree', page: 'Prim’s and Kruskal’s' },
]

const examples = [
  {
    id: 'pairs',
    prompt: 'Checking every possible pair of nodes in a graph of n nodes, to see which pairs are joined.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'There are about n × n / 2 pairs, so the work grows with the square of n.',
  },
  {
    id: 'degrees-edges',
    prompt: 'Counting the degree of every node from a plain list of about n edges, in a graph of n nodes (the code on this page).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One pass over the edges, adding 1 at each end. The degree table holds one number per node.',
  },
  {
    id: 'sum-degrees',
    prompt: 'Adding up the degrees of all n nodes in an adjacency list, using len() on each node’s list.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One len() per node, and len() on a list is O(1). The answer should always be twice the number of edges.',
  },
  {
    id: 'odd',
    prompt: 'Counting how many of n nodes have an odd degree, once the degrees are known (Euler’s test).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Look at each degree once. You only need a counter.',
  },
  {
    id: 'scan',
    prompt: 'Checking whether the edge u–v exists by reading through a plain list of about n edges.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The list has no structure, so in the worst case you read every edge.',
  },
  {
    id: 'complete',
    prompt: 'Writing out every edge of a graph where each of the n nodes is joined to every other node.',
    time: 'O(n²)',
    space: 'O(n²)',
    explanation: 'There are about n × n / 2 edges, and you create and store each one.',
  },
  {
    id: 'degree-matrix',
    prompt: 'Finding the degree of one node in an adjacency matrix of n nodes, by counting the 1s in its row.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You have to check all n cells of the row, even though most are 0.',
  },
  {
    id: 'connected',
    prompt: 'Checking whether a graph of n nodes and about n edges is in one piece, by searching it from one node (BFS or DFS, coming up).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'A search visits each node and edge once, and it has to remember which nodes it has already seen.',
  },
]

function GraphTheory() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Graph Theory Basics</h2>
      <p>
        Graph theory is the maths of connections: things, and the links
        between them. It is a simple idea with a surprising history, and
        everything in this section is built on it.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <KonigsbergVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Graph Theory &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A <strong>graph</strong> is <strong>nodes</strong> joined by <strong>edges</strong>.</li>
                <li>Graph theory is the study of them.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. Where it began</h4>
              <ul>
                <li>Euler, 1736: the bridges of K&ouml;nigsberg.</li>
                <li>He threw away the map and kept only the connections.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Decide what the nodes are and what an edge means.</li>
                <li>Then every problem becomes a question about the graph.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Kinds of graph</h4>
              <ul>
                <li>Undirected or directed.</li>
                <li>Weighted or not.</li>
                <li>Connected or in pieces. With or without cycles.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Degree</h4>
              <ul>
                <li>The number of edges at a node.</li>
                <li>All the degrees add up to <strong>twice</strong> the number of edges.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Size</h4>
              <ul>
                <li><code>V</code> nodes, <code>E</code> edges.</li>
                <li>Up to about <code>V&sup2; / 2</code> edges.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. A tree is a graph</h4>
              <ul>
                <li>In one piece, with no cycle.</li>
                <li>Always exactly <code>V &minus; 1</code> edges.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>The problem is about connections, routes, networks or order.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Two edges can join the same pair of nodes.</li>
                <li>Not every graph is in one piece.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Graphs Are Everywhere</h3>
        <p>
          Euler&rsquo;s trick was to ask: what are the <em>things</em>, and what
          links them? Do that and you can turn almost any situation into a
          graph:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>The real thing</th>
                <th>The nodes are</th>
                <th>The edges are</th>
                <th>The kind of graph</th>
              </tr>
            </thead>
            <tbody>
              {everywhere.map((row) => (
                <tr key={row.thing}>
                  <td><strong>{row.thing}</strong></td>
                  <td>{row.nodes}</td>
                  <td>{row.edges}</td>
                  <td>{row.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The skill is in the choice. A road map is a graph if the junctions
          are nodes. It is a very different graph if the cities are.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Kinds of Graphs</h3>
        <GraphKindsVisual />
        <p>
          <strong>Undirected</strong> edges work both ways, like a friendship.{' '}
          <strong>Directed</strong> edges point one way, like a follow.{' '}
          <strong>Weighted</strong> edges carry a number, such as a distance or
          a price.
        </p>
        <p>
          A graph is <strong>connected</strong> if you can get from any node to
          any other. If not, it falls into separate pieces (called{' '}
          <strong>components</strong>). A <strong>cycle</strong> is a way to
          leave a node and return to it. A <strong>tree</strong>, like the
          ones on the last few pages, is just a graph that is connected and has
          no cycles.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Degree: Counting Connections</h3>
        <p>
          The <strong>degree</strong> of a node is the number of edges that touch
          it. In K&ouml;nigsberg, the island has degree 5. Every edge has two
          ends, so if you add up the degrees of every node, you count each edge
          twice. The total is always <strong>2 &times; the number of
          edges</strong>. (The seven bridges give 3 + 5 + 3 + 3 = 14.)
        </p>
        <p>
          That is the whole of Euler&rsquo;s argument, and you can run it
          yourself:
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong>. The code goes through the edges and adds
          one to the degree at each end. Then it applies Euler&rsquo;s rule:{' '}
          <em>a walk over every edge exactly once is only possible if at most
          two nodes have an odd degree.</em>
        </p>
        <GraphTheoryTracer />
        <p>
          Try all three. The seven bridges fail with four odd nodes. The small
          town has exactly two, so a walk exists. In the ring every node is even,
          so you can start anywhere and finish where you began.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Where This Goes Next</h3>
        <p>
          Once something is a graph, there is a standard tool for each kind of
          question:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>You ask</th>
                <th>The tool</th>
                <th>Coming up</th>
              </tr>
            </thead>
            <tbody>
              {next.map((row) => (
                <tr key={row.ask}>
                  <td>{row.ask}</td>
                  <td>{row.tool}</td>
                  <td><strong>{row.page}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          First, though, we need to know how to store a graph in a program. That
          is the next page, starting with directed graphs.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Graph Theory in One Breath</h3>
        <div className="definition">
          A graph is a set of nodes joined by edges. Graph theory studies what
          you can say about a graph from its connections alone.
        </div>
      </section>

      <section className="notebook-section">
        <h3>How Big Can a Graph Get?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              We write <code>V</code> for the number of nodes and <code>E</code>{' '}
              for the number of edges, and the cost of graph code is usually
              given in terms of both, like <code>O(V + E)</code>.
            </p>
            <p>
              <code>E</code> can be as small as <code>V &minus; 1</code> (a tree)
              or as large as about <code>V&sup2; / 2</code>, when every pair is
              joined. Look how fast the edges pile up:
            </p>
          </div>
          <CompleteGraphsVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Nodes</th>
                <th>Most edges (undirected)</th>
                <th>Most edges (directed)</th>
              </tr>
            </thead>
            <tbody>
              {growth.map((row) => (
                <tr key={row.n}>
                  <td><strong>{row.n}</strong></td>
                  <td>{row.undirected}</td>
                  <td>{row.directed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Real graphs are nowhere near that. Most people have a few hundred
          friends, not a million. A graph with far fewer edges than the maximum
          is called <strong>sparse</strong>, and a graph close to the maximum is{' '}
          <strong>dense</strong>. Whether a graph is sparse or dense decides how
          best to store it.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Think &ldquo;Graph&rdquo; When&hellip;</h3>
        <p>
          <strong>The problem is about connections.</strong> Who knows whom,
          what links to what, which roads join which towns.
        </p>
        <p>
          <strong>You are looking for a route.</strong> The shortest, cheapest or
          any route at all.
        </p>
        <p>
          <strong>Order matters.</strong> &ldquo;Do this before that&rdquo; is
          a graph of dependencies.
        </p>
        <p>
          <strong>You are asking whether things are joined at all.</strong>{' '}
          Is the network in one piece? Which groups are cut off from each other?
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

export default GraphTheory
