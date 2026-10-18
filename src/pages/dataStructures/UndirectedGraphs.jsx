import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import UndirectedGraphTracer from './UndirectedGraphTracer.jsx'
import {
  FriendsIntroVisual,
  TwoWaysVisual,
  UndirectedStorageVisual,
  ComponentsVisual,
  CycleGrowVisual,
} from './UndirectedGraphVisuals.jsx'
import { GraphSizeVisual } from './DirectedGraphVisuals.jsx'

const difference = [
  { prop: 'An edge is drawn as', directed: 'an arrow', undirected: 'a plain line' },
  { prop: 'u – v means', directed: 'you can go from u to v', undirected: 'you can go from u to v and from v to u' },
  { prop: 'Degree', directed: 'two numbers: arrows in and arrows out', undirected: 'one number: the neighbours' },
  { prop: 'Written down', directed: 'once', undirected: 'twice, once at each end' },
  { prop: 'The grid', directed: 'any pattern', undirected: 'a mirror image across the diagonal' },
]

const words = [
  { word: 'Neighbour', means: 'A node joined to this one by a line.', example: 'the neighbours of 1 are 0, 2 and 4' },
  { word: 'Degree', means: 'How many neighbours a node has.', example: '1 has degree 3' },
  { word: 'Path', means: 'A trip along the lines.', example: '0, 1, 2, 5' },
  { word: 'Connected', means: 'You can get from any node to any other.', example: 'the friends graph is' },
  { word: 'Component', means: 'One separate piece of a graph.', example: 'two groups = two components' },
]

const questions = [
  { ask: 'Add an edge', list: 'O(1)', matrix: 'O(1)' },
  { ask: 'Is there an edge between u and v?', list: 'O(degree of u)', matrix: 'O(1)' },
  { ask: 'Who are u’s neighbours?', list: 'O(degree of u)', matrix: 'O(V)' },
  { ask: 'What is u’s degree?', list: 'O(1)', matrix: 'O(V)' },
  { ask: 'Memory', list: 'O(V + E)', matrix: 'O(V²)' },
]

const examples = [
  {
    id: 'add-edge',
    prompt: 'Adding one new undirected edge u – v to an adjacency list (two appends).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Append v to u’s list and u to v’s list. Each append is O(1), and two of them is still O(1).',
  },
  {
    id: 'symmetric',
    prompt: 'Checking that an adjacency matrix of n nodes is a mirror image, by testing matrix[u][v] == matrix[v][u] for every pair.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'There are about n × n / 2 pairs to test, and you only need a couple of variables.',
  },
  {
    id: 'degree-list',
    prompt: 'Finding the degree of a node in an adjacency list: len(adj_list[u]).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'A list knows its own length, so there is nothing to count.',
  },
  {
    id: 'degree-matrix',
    prompt: 'Finding the degree of a node in an adjacency matrix of n nodes, by counting the 1s in its row.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You have to check all n cells of the row, even though most are 0.',
  },
  {
    id: 'list-build',
    prompt: 'Building an adjacency list for a graph of n nodes and about n undirected edges, from a list of its edges.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One empty list per node, and two appends per edge. The lists hold about 2n entries in all.',
  },
  {
    id: 'remove-edge',
    prompt: 'Removing the edge u – v from adjacency lists, when u and v could each have up to n neighbours (list.remove).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'list.remove has to find the value first, which can mean reading the whole list, and it does so in both lists.',
  },
  {
    id: 'has-edge-list',
    prompt: 'Asking an adjacency list whether u and v are joined, when u could have up to n neighbours (v in adj_list[u]).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You read u’s list until you find v. In the worst case that is every node.',
  },
  {
    id: 'edges-from-matrix',
    prompt: 'Listing every edge exactly once from an adjacency matrix of n nodes, by looking at the cells above the diagonal (not counting the result).',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'You have to look at about n × n / 2 cells, even though most hold a 0.',
  },
]

function UndirectedGraphs() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Undirected Graphs</h2>
      <p>
        In an <strong>undirected</strong> graph, a line between two nodes works
        both ways. It is the graph to use for friendships, two-way roads and
        computer networks: anything where &ldquo;A is joined to B&rdquo; also
        means &ldquo;B is joined to A&rdquo;.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <FriendsIntroVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Undirected Graphs &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li><strong>Nodes</strong> joined by plain <strong>lines</strong>.</li>
                <li>Every line works both ways.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Two-way relationships: friends, roads, cables, neighbours.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>A line is the same as <strong>two arrows</strong>, one each way.</li>
                <li>So write every edge down at <strong>both ends</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it is stored</h4>
              <ul>
                <li><strong>List:</strong> each node lists its neighbours.</li>
                <li><strong>Grid:</strong> a mirror image across the diagonal.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Words to know</h4>
              <ul>
                <li>Neighbour, degree, path.</li>
                <li>Connected, or in separate <strong>components</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>List: <code>O(V + E)</code> memory.</li>
                <li>Grid: <code>O(V&sup2;)</code> memory.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Every edge takes twice the room.</li>
                <li>Removing an edge means fixing two places.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>The link goes both ways. Use the <strong>list</strong> for most graphs.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Forgetting the second half of <code>add_edge</code>.</li>
                <li>Counting each edge twice when you list them.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Line Is Two Arrows</h3>
        <p>
          Here is the one idea to hold on to. A plain line between two nodes
          means exactly the same as two arrows pointing opposite ways:
        </p>
        <TwoWaysVisual />
        <p>
          That is how a program stores an undirected graph: take the directed
          graph from the last page and write down <em>both</em> arrows for every
          edge. Here is how the two kinds compare:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Directed</th>
                <th>Undirected</th>
              </tr>
            </thead>
            <tbody>
              {difference.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.directed}</td>
                  <td>{row.undirected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Words to Know</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>What it means</th>
                <th>In the friends graph</th>
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
          Watch each line light up. It lights up <strong>twice</strong> in the
          list (once at each end) and <strong>twice</strong> in the grid (once on
          each side of the shaded diagonal):
        </p>
        <UndirectedStorageVisual />
        <div className="code-block">
          <code>{`# adjacency list: a dict of lists
graph = {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1, 5],
    3: [0, 4],
    4: [3, 1, 5],
    5: [2, 4],
}

# adjacency matrix: the same either side of the diagonal
matrix = [
    [0, 1, 0, 1, 0, 0],
    [1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 0],
]

def add_edge(graph, u, v):
    graph[u].append(v)      # u knows about v
    graph[v].append(u)      # and v knows about u`}</code>
        </div>
        <p>
          The one thing to remember is the last line of{' '}
          <code>add_edge</code>. Leave it out and you have quietly built a
          directed graph.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong>. Each edge appears as a plain line, then is
          written into the list twice and into the grid twice.
        </p>
        <UndirectedGraphTracer />
        <p>
          Notice how the grid fills in as a mirror image, and how the list ends
          up with exactly twice as many entries as there are edges. Try{' '}
          <strong>Two separate groups</strong> too: the graph is not in one
          piece, and nothing in the list or the grid connects the two halves.
        </p>
      </section>

      <section className="notebook-section">
        <h3>In One Piece, or Not</h3>
        <ComponentsVisual />
        <p>
          A graph is <strong>connected</strong> when you can get from any node
          to any other. If it is not, it falls into separate pieces, and each
          piece is a <strong>component</strong>. Checking this is one of the
          first jobs of a graph search, which is coming up.
        </p>
      </section>

      <section className="notebook-section">
        <h3>One Edge Too Many</h3>
        <CycleGrowVisual />
        <p>
          A tree is the thinnest graph that is still in one piece. It has
          exactly <code>V &minus; 1</code> edges, and it has no cycle. Add any
          single edge and you create exactly one cycle. Remove any single edge
          and the tree falls into two pieces. This idea is what the last
          pages of this section, on spanning trees, are built on.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Undirected Graphs in One Breath</h3>
        <div className="definition">
          An undirected graph is a set of nodes joined by two-way lines, usually
          stored by listing, for each node, all of its neighbours, so every edge
          is written down at both ends.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Same story as before, with one twist. The grid always needs{' '}
              <code>V &times; V</code> cells. The list needs one entry per node
              plus <strong>two</strong> per edge, because every edge is written
              at both ends.
            </p>
            <p>
              For a spread-out graph the list is still far smaller. It only
              catches up with the grid when almost every pair is joined.
            </p>
          </div>
          <GraphSizeVisual
            scenes={[
              { title: 'A spread-out graph: 100 nodes, 150 edges', matrix: 10000, list: 400 },
              { title: 'A crowded graph: 100 nodes, 4,950 edges', matrix: 10000, list: 10000 },
            ]}
            note="entries written down. The list needs one per node plus two per edge; the grid needs one per pair of nodes."
            alt="How many entries each way of storing an undirected graph needs. For 100 nodes and 150 edges, the grid needs 10,000 cells but the list only about 400 entries. For 100 nodes and 4,950 edges, where every pair is joined, the grid and the list both need about 10,000."
          />
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
          There is one thing easier than for directed graphs. &ldquo;Who is
          joined to v?&rdquo; is just v&rsquo;s own list. There is no slow
          question where you have to search every list.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>The link goes both ways.</strong> Friendships, two-way roads,
          cables between computers, pieces that touch.
        </p>
        <p>
          <strong>You want to know what is connected.</strong> Is everything in
          one piece? Which groups are cut off?
        </p>
        <p>
          <strong>Use a list for almost everything.</strong> Most real graphs
          are spread out, so the list is smaller and quicker to go through.
        </p>
        <p>
          <strong>If a link has a direction, use a directed graph instead.</strong>{' '}
          Following someone is not the same as being followed back.
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

export default UndirectedGraphs
