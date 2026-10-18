import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import DirectedGraphTracer from './DirectedGraphTracer.jsx'
import {
  GraphIntroVisual,
  GraphStorageVisual,
  GraphLoopsVisual,
  GraphSizeVisual,
} from './DirectedGraphVisuals.jsx'

const words = [
  { word: 'Node', means: 'A thing in the graph. Also called a vertex.', example: '0, 1, 2, 3, 4, 5' },
  { word: 'Edge', means: 'An arrow from one node to another.', example: '0 → 1' },
  { word: 'Directed', means: 'Every edge points one way. 0 → 1 does not give you 1 → 0.', example: '1 → 4, but not 4 → 1' },
  { word: 'Neighbour', means: 'A node you can reach in one step along an arrow.', example: 'the neighbours of 0 are 1 and 3' },
  { word: 'Out-degree', means: 'How many arrows leave a node.', example: '0 has 2' },
  { word: 'In-degree', means: 'How many arrows arrive at a node.', example: '1 has 2 (from 0 and from 2)' },
  { word: 'Path', means: 'A trip along arrows, always the way they point.', example: '0, 1, 4, 5' },
  { word: 'Cycle', means: 'A path that ends where it began.', example: '1, 4, 5, 2, 1' },
]

const questions = [
  { ask: 'Add an edge', list: 'O(1)', matrix: 'O(1)' },
  { ask: 'Is there an edge from u to v?', list: 'O(out-degree of u)', matrix: 'O(1)' },
  { ask: 'Who does u point at?', list: 'O(out-degree of u)', matrix: 'O(V)' },
  { ask: 'Who points at v?', list: 'O(V + E)', matrix: 'O(V)' },
  { ask: 'Memory', list: 'O(V + E)', matrix: 'O(V²)' },
]

const examples = [
  {
    id: 'matrix-build',
    prompt: 'Creating an adjacency matrix for a graph of n nodes: an n × n grid of zeros.',
    time: 'O(n²)',
    space: 'O(n²)',
    explanation: 'The grid has n rows of n cells, and every cell has to be created.',
  },
  {
    id: 'list-build',
    prompt: 'Building an adjacency list for a graph of n nodes and about n edges, from a list of its edges.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One empty list per node, and one append per edge. Each append is O(1).',
  },
  {
    id: 'matrix-has-edge',
    prompt: 'Asking an adjacency matrix whether there is an edge from u to v.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Look at one cell: matrix[u][v]. The size of the graph does not matter.',
  },
  {
    id: 'list-has-edge',
    prompt: 'Asking an adjacency list whether there is an edge from u to v, when u could point at up to n nodes (v in adj_list[u]).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You have to read u’s list until you find v. In the worst case that is every node.',
  },
  {
    id: 'list-add',
    prompt: 'Adding one new edge u → v to an adjacency list.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Append v to u’s list. Appending to the end of a list is O(1).',
  },
  {
    id: 'matrix-neighbours',
    prompt: 'Finding everything node u points at in an adjacency matrix of n nodes, by reading row u (not counting the result).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You have to check every cell in the row, even though most are 0.',
  },
  {
    id: 'list-in',
    prompt: 'Finding everything that points at node v in an adjacency list of n nodes and about n edges.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Lists only store where arrows go from. To find arrows that arrive, you have to look through every list.',
  },
  {
    id: 'matrix-count',
    prompt: 'Counting every edge in an adjacency matrix of n nodes.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'The only way is to look at every cell, and there are n × n of them.',
  },
]

function DirectedGraphs() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Directed Graphs</h2>
      <p>
        A graph is a bunch of dots joined by lines. It is how we describe
        anything that is connected: people who follow each other, web pages
        that link to each other, tasks that must happen in order. In a{' '}
        <strong>directed</strong> graph, every line is an arrow that points one
        way.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <GraphIntroVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Directed Graphs &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li><strong>Nodes</strong> joined by <strong>edges</strong>.</li>
                <li>Each edge is an arrow with one direction.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Things that point at other things: follows, links, one-way streets, &ldquo;do this before that&rdquo;.</li>
                <li>A list or a tree cannot show these.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>For each node, write down where its arrows go.</li>
                <li>That is all a graph really is.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it is stored</h4>
              <ul>
                <li><strong>Adjacency list:</strong> each node, and the nodes it points to.</li>
                <li><strong>Adjacency matrix:</strong> a grid of 0s and 1s.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Words to know</h4>
              <ul>
                <li><strong>Path:</strong> a trip along the arrows.</li>
                <li><strong>Cycle:</strong> a path that returns to its start.</li>
                <li>Out-degree and in-degree count arrows leaving and arriving.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li><code>V</code> nodes, <code>E</code> edges.</li>
                <li>List: <code>O(V + E)</code> memory.</li>
                <li>Matrix: <code>O(V&sup2;)</code> memory.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>List: small, but &ldquo;is there an edge?&rdquo; means reading a list.</li>
                <li>Matrix: instant answers, but huge for big graphs.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Almost always the <strong>list</strong>.</li>
                <li>The matrix only for small or very crowded graphs.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Direction matters: <code>0 &rarr; 1</code> is not <code>1 &rarr; 0</code>.</li>
                <li>&ldquo;Who points at me?&rdquo; is slow in a list.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Words to Know</h3>
        <p>
          Here they are, using the graph from the animation:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>What it means</th>
                <th>In the graph</th>
              </tr>
            </thead>
            <tbody>
              {words.map((row) => (
                <tr key={row.word}>
                  <td><strong>{row.word}</strong></td>
                  <td>{row.means}</td>
                  <td>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Two Ways to Write It Down</h3>
        <p>
          A computer cannot look at a drawing. It needs the graph as data. Watch
          each edge light up in the drawing, in the <strong>list</strong>, and
          in the <strong>grid</strong>:
        </p>
        <GraphStorageVisual />
        <p>
          The <strong>adjacency list</strong> gives each node a list of the
          nodes it points at. The <strong>adjacency matrix</strong> is a grid:
          row = &ldquo;from&rdquo;, column = &ldquo;to&rdquo;, and a 1 means
          there is an arrow. Same graph, two shapes.
        </p>
        <div className="code-block">
          <code>{`# adjacency list: a dict of lists
graph = {
    0: [1, 3],
    1: [2, 4],
    2: [1],
    3: [4],
    4: [5],
    5: [2],
}

# adjacency matrix: row = from, column = to
matrix = [
    [0, 1, 0, 1, 0, 0],    # 0 points at 1 and 3
    [0, 0, 1, 0, 1, 0],    # 1 points at 2 and 4
    [0, 1, 0, 0, 0, 0],    # 2 points at 1
    [0, 0, 0, 0, 1, 0],    # 3 points at 4
    [0, 0, 0, 0, 0, 1],    # 4 points at 5
    [0, 0, 1, 0, 0, 0],    # 5 points at 2
]`}</code>
        </div>
        <p>
          There is also a third way: just a list of pairs,{' '}
          <code>[(0, 1), (0, 3), (1, 2), &hellip;]</code>. It is the simplest, and
          handy when you only need to go through every edge once.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          This code writes a graph down both ways at once. Press{' '}
          <strong>Play</strong> and watch each edge appear in the drawing, then
          land in the list and in the grid. The blue node is where the edge
          starts, and the yellow one is where it points.
        </p>
        <DirectedGraphTracer />
        <p>
          Look at the grid after <strong>Who follows who</strong>: only 8 of the
          36 cells are 1. Most of the grid is empty. Now try{' '}
          <strong>Friends (both ways)</strong>: each friendship needs two edges,
          so you get two entries.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Loops and Order</h3>
        <p>
          Because arrows only go one way, a directed graph can loop back on
          itself. That is a <strong>cycle</strong>. A graph with no cycle at all
          is called a <strong>DAG</strong> (directed acyclic graph), and it
          is exactly the shape of anything with &ldquo;do this before
          that&rdquo;: school course prerequisites, steps in a recipe, a build
          system compiling files in the right order.
        </p>
        <GraphLoopsVisual />
      </section>

      <section className="notebook-section">
        <h3>Directed Graphs in One Breath</h3>
        <div className="definition">
          A directed graph is a set of nodes joined by one-way edges, usually
          stored by listing, for each node, the nodes it points at.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Let <code>V</code> be the number of nodes and <code>E</code> the
              number of edges.
            </p>
            <p>
              The grid always has <code>V &times; V</code> cells, even if
              almost all are 0. The list only stores real edges. For a
              spread-out graph, like most real ones, the list is
              far smaller. Only when almost everyone points at everyone do they
              come out about equal.
            </p>
          </div>
          <GraphSizeVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Adjacency list</th>
                <th>Adjacency matrix</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((row) => (
                <tr key={row.ask}>
                  <td><strong>{row.ask}</strong></td>
                  <td><code>{row.list}</code></td>
                  <td><code>{row.matrix}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The list wins on memory and on &ldquo;who does u point at?&rdquo;. The
          matrix wins on &ldquo;is there an edge from u to v?&rdquo;. Python has
          no built-in graph type, but a <code>dict</code> of lists is a perfectly
          good adjacency list, and <code>v in graph[u]</code> checks an edge.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>Things point at other things.</strong> Who follows whom, which
          page links to which, one-way streets, flights.
        </p>
        <p>
          <strong>Order matters.</strong> &ldquo;This must happen before
          that&rdquo; is a directed graph with no cycles.
        </p>
        <p>
          <strong>Use a list for almost everything.</strong> Real graphs are
          spread out, so the list is smaller and faster to go through.
        </p>
        <p>
          <strong>Use a matrix for small or crowded graphs.</strong> If you
          need an instant &ldquo;is there an edge?&rdquo; answer, or nearly
          every pair is connected, the grid is simple and quick.
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

export default DirectedGraphs
