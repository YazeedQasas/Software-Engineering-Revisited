import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import GraphSearchTracer from './GraphSearchTracer.jsx'
import { SearchRaceVisual, ForgetVisual, FewestStepsVisual, SearchWorkVisual } from './GraphSearchVisuals.jsx'

const compare = [
  { prop: 'Picture', bfs: 'a ripple spreading out', dfs: 'a dive down one path, then back up' },
  { prop: 'Visits first', bfs: 'the nearest nodes', dfs: 'the deepest nodes' },
  { prop: 'Waiting nodes live in', bfs: 'a queue', dfs: 'a stack (or the call stack)' },
  { prop: 'Fewest edges to a node', bfs: 'finds it', dfs: 'does not promise to' },
  { prop: 'Uses most memory when', bfs: 'the graph is wide', dfs: 'the graph is deep' },
  { prop: 'Good for', bfs: 'shortest routes, nearest things', dfs: 'exploring everything, cycles, mazes, ordering tasks' },
]

const costs = [
  { what: 'A search, with an adjacency list', time: 'O(V + E)', why: 'Every node is taken once and every edge is looked at from each end.' },
  { what: 'A search, with an adjacency matrix', time: 'O(V²)', why: 'To find a node’s neighbours you must read its whole row of V cells.' },
  { what: 'Checking "is it visited?" in a set', time: 'O(1) avg', why: 'A hash lookup. This is why visited should be a set.' },
  { what: 'Checking "is it visited?" in a list', time: 'O(V)', why: 'Reads the whole list. Every check gets slower and the whole search drifts towards O(V²).' },
  { what: 'Taking from a deque / list.pop(0)', time: 'O(1) / O(V)', why: 'Use collections.deque for the queue. Popping the front of a plain list shifts everything.' },
  { what: 'Extra memory', time: 'O(V)', why: 'The visited set, plus the queue or stack.' },
]

const examples = [
  {
    id: 'bfs',
    prompt: 'Breadth-first search of a connected graph with n nodes and about n edges, stored as an adjacency list.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each node is taken from the queue once and each edge is looked at twice, so the work is V + E. The visited set and the queue hold up to n nodes.',
  },
  {
    id: 'dfs',
    prompt: 'Recursive depth-first search of a connected graph with n nodes and about n edges, stored as an adjacency list (worst case, a long thin graph).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'The same V + E work. A long chain makes the recursion n calls deep, and the visited set holds n nodes.',
  },
  {
    id: 'set',
    prompt: 'Asking whether a node is in the visited set: neighbour in visited.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'A set is a hash table, so the lookup does not depend on how many nodes are in it.',
  },
  {
    id: 'list-visited',
    prompt: 'A breadth-first search of a graph with n nodes and about n edges that keeps visited as a plain list (neighbour in visited).',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'About n checks, and each one may read a list of up to n nodes.',
  },
  {
    id: 'list-queue',
    prompt: 'A breadth-first search of a graph with n nodes and about n edges that uses a plain list as the queue, taking from the front with pop(0).',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Each pop(0) shifts the whole list along, which is O(n), and it happens n times. A deque makes it O(n).',
  },
  {
    id: 'shortest',
    prompt: 'Finding the path with the fewest edges between two nodes of a graph with n nodes and about n edges, using breadth-first search.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'It is just a breadth-first search that remembers who found each node, then follows those links back.',
  },
  {
    id: 'components',
    prompt: 'Counting the separate pieces of a graph with n nodes and about n edges, by starting a search from every node that is not visited yet.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'The visited set is shared, so no node or edge is searched twice. Altogether it is one search’s worth of work.',
  },
  {
    id: 'matrix',
    prompt: 'Breadth-first search of a graph with n nodes stored as an adjacency matrix.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Finding a node’s neighbours means reading its whole row of n cells, and that happens for every node.',
  },
]

function GraphSearch() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Graph Search Algorithms (BFS &amp; DFS)</h2>
      <p>
        Searching a graph means visiting its nodes by following edges. There
        are two classic ways, and they are the same two you met on trees:{' '}
        <strong>breadth-first</strong> spreads out like a ripple, and{' '}
        <strong>depth-first</strong> dives deep and backs up. There is just one
        new rule, because graphs can loop: <strong>remember where you have
        been</strong>.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <SearchRaceVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Graph Search &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What they are</h4>
              <ul>
                <li><strong>BFS:</strong> nearest first, in rings.</li>
                <li><strong>DFS:</strong> as deep as possible, then back up.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem they solve</h4>
              <ul>
                <li>&ldquo;What can I reach from here?&rdquo;</li>
                <li>&ldquo;Is there a way from A to B?&rdquo;</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Keep a list of nodes waiting to be visited.</li>
                <li>Take one, visit it, add its neighbours.</li>
                <li>A <strong>visited set</strong> stops loops.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The only difference</h4>
              <ul>
                <li>BFS takes from a <strong>queue</strong>: oldest first.</li>
                <li>DFS takes from a <strong>stack</strong>: newest first.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. A free bonus</h4>
              <ul>
                <li>BFS finds the route with the <strong>fewest edges</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(V + E)</code>.</li>
                <li>Memory: <code>O(V)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>BFS can use a lot of memory on wide graphs.</li>
                <li>DFS can use a lot on deep ones, and may go the long way round.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use them when</h4>
              <ul>
                <li><strong>BFS:</strong> nearest, fewest steps.</li>
                <li><strong>DFS:</strong> explore everything, cycles, mazes.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Forgetting the visited set: infinite loop.</li>
                <li>Visited as a list: slow. Use a <code>set</code>.</li>
                <li>A search only reaches its own piece of the graph.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why Remember Where You Have Been?</h3>
        <p>
          On a tree you can never come back to a node you have already seen, so
          searching it is simple. A graph can have cycles, and a search with no
          memory will walk round one for ever:
        </p>
        <ForgetVisual />
        <p>
          The fix is a <strong>visited set</strong>. Mark every node the moment
          you find it, and skip any node that is already marked. Everything else
          on this page is about <em>how</em> to choose the next node to visit.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Two Searches</h3>
        <p>
          Both keep a list of nodes that are found but not yet visited. They
          differ only in which one they take next:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Breadth-first (BFS)</th>
                <th>Depth-first (DFS)</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.bfs}</td>
                  <td>{row.dfs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A <strong>queue</strong> hands back the oldest waiting node, so
          everything near the start is visited before anything further away: a
          ripple. A <strong>stack</strong> hands back the newest, so the search
          keeps diving into whatever it just found. In recursion, the call stack
          is that stack.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Pick a search and press <strong>Play</strong>. The blue node is being
          visited, and the dashed one is the neighbour being checked. Yellow
          nodes are waiting, grey ones are done and numbered in order, and a
          green line is an edge that found a brand-new node. Underneath you can
          watch the queue (or the call stack) and the visited set.
        </p>
        <GraphSearchTracer />
        <p>
          Run both from node 0 and compare the green lines. Breadth-first draws a
          short, bushy tree, and depth-first draws a long, stringy one. Then try{' '}
          <strong>Two separate groups</strong>: the search visits only the
          nodes it can reach and stops. To cover a whole graph that is in
          pieces, you start a new search from every node that is still unvisited.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Bonus: Fewest Steps</h3>
        <p>
          Breadth-first search has a gift. Because it visits nodes in rings,
          the first time it reaches a node is by the route with the fewest
          edges. Remember who found each node, and you can walk back to the
          start:
        </p>
        <FewestStepsVisual />
        <p>
          This is how &ldquo;six degrees of separation&rdquo; is found, and how a
          maze solver finds its shortest way out. Depth-first search makes no
          such promise: it may find a path, but not the shortest.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Graph Search in One Breath</h3>
        <div className="definition">
          Graph search visits every node reachable from a start by repeatedly
          taking a waiting node and adding its unvisited neighbours, using a
          visited set to avoid loops. A queue makes it breadth-first and a stack
          makes it depth-first.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Each node is taken from the list once. Each edge is looked at when
              we stand on a node at either end of it. So the work is the nodes
              plus the edges:
            </p>
            <p>
              <code>O(V + E)</code> for both searches. And memory is{' '}
              <code>O(V)</code> for the visited set and the waiting list.
            </p>
          </div>
          <SearchWorkVisual />
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
          One practical limit: Python stops a recursive function at about 1,000
          calls. For a very deep graph, write depth-first search with your own
          stack (a list) instead of recursion.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for Them When&hellip;</h3>
        <p>
          <strong>You want the fewest steps (BFS).</strong> Shortest route in a
          maze, the nearest connection, how many hops between two people.
        </p>
        <p>
          <strong>You want to explore everything (DFS).</strong> Finding every
          piece of a graph, spotting a cycle, solving a maze by trying every
          path, or putting tasks in a valid order.
        </p>
        <p>
          <strong>You only need to know if something is reachable.</strong>{' '}
          Either one works. Pick whichever is easier to write.
        </p>
        <p>
          <strong>The edges have costs.</strong> BFS counts edges, not their
          weights, so it cannot find the cheapest route. That needs the
          algorithms coming up next, starting with Dijkstra&rsquo;s.
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

export default GraphSearch
