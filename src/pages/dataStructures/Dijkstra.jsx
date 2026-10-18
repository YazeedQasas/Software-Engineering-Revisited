import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import DijkstraTracer from './DijkstraTracer.jsx'
import {
  RoundsVisual,
  CheapestVsFewestVisual,
  RelaxVisual,
  PathBackVisual,
  NegativeVisual,
  HeapWorkVisual,
} from './DijkstraVisuals.jsx'

const costs = [
  { what: 'Dijkstra with a heap, graph as an adjacency list', time: 'O((V + E) log V)', why: 'About E pushes and pops, and each one costs log V. This is the usual way to write it.' },
  { what: 'Dijkstra finding the closest node by scanning a plain list', time: 'O(V²)', why: 'V rounds, and each one reads up to V nodes to find the smallest. Simple, and fine for small or very dense graphs.' },
  { what: 'One heap push or pop', time: 'O(log V)', why: 'A heap keeps the smallest on top without sorting everything.' },
  { what: 'Looking up dist[node]', time: 'O(1)', why: 'A dictionary lookup.' },
  { what: 'Reading a route back through previous', time: 'O(V)', why: 'At most one step per node on the way.' },
  { what: 'Extra memory', time: 'O(V + E)', why: 'dist, previous and visited hold V nodes. The heap can hold up to E entries, because old ones are skipped, not removed.' },
]

const examples = [
  {
    id: 'heap',
    prompt: "Dijkstra's algorithm with a heap, on a connected graph with n nodes and about n roads, stored as an adjacency list.",
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'About n heap pushes and pops at log n each. dist, previous, visited and the heap all hold about n things.',
  },
  {
    id: 'scan',
    prompt: "Dijkstra's algorithm that finds the closest unfinished node by scanning a plain list of all n nodes every round (n nodes, about n roads).",
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'n rounds, and each one reads up to n nodes to find the smallest. The heap is what saves us here.',
  },
  {
    id: 'push',
    prompt: 'One heappush onto a heap that holds up to n entries.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The new entry moves up at most the height of the heap, and that is log n levels. No extra memory is needed.',
  },
  {
    id: 'lookup',
    prompt: 'Asking for the best distance found so far to one node: dist[node].',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'dist is a dictionary, and a dictionary lookup does not depend on its size.',
  },
  {
    id: 'stale',
    prompt: 'Skipping an out-of-date heap entry: if node in visited: continue',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'visited is a set, so the check is a single lookup. The entry has already been popped, so throwing it away costs nothing more.',
  },
  {
    id: 'path',
    prompt: 'Reading the cheapest route back from the goal to the start through previous, on a route of up to n nodes.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One step per node on the route, and the route itself is a list of up to n nodes.',
  },
  {
    id: 'bfs',
    prompt: 'Finding the route with the fewest roads on a graph of n nodes and about n roads, when every road counts the same (breadth-first search).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'If every road costs the same, Dijkstra is not needed. A plain queue does the job with no heap and no log factor.',
  },
  {
    id: 'matrix',
    prompt: "Dijkstra's algorithm with a plain scan, on a graph of n nodes stored as an adjacency matrix.",
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Each of the n rounds scans n nodes for the smallest, then reads a row of n cells to find the neighbours. n times n is n².',
  },
]

function Dijkstra() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Dijkstra&rsquo;s Algorithm</h2>
      <p>
        Breadth-first search finds the route with the fewest roads. But roads
        are not all the same: some are long, some are slow, some have tolls.{' '}
        <strong>Dijkstra&rsquo;s algorithm</strong> finds the{' '}
        <strong>cheapest</strong> route from one node to every other node. It
        does it with one simple habit: <strong>always finish the closest node
        first</strong>.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <RoundsVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Dijkstra&rsquo;s Algorithm &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>The <strong>cheapest</strong> route from one start node to every other node.</li>
                <li>Roads (edges) have a cost, called a <strong>weight</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;What is the quickest way from here to there?&rdquo;</li>
                <li>Maps, flights, network routing.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Keep a best-known cost for every node. Start: 0 for the start, <code>∞</code> for the rest.</li>
                <li>Finish the closest open node. Its cost is now final.</li>
                <li>Check its roads for cheaper ways. Repeat.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The one trick</h4>
              <ul>
                <li><strong>Relaxing</strong> a road: if going through this node is cheaper, take it.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. A free bonus</h4>
              <ul>
                <li><code>previous</code> remembers where each node came from, so you can read the route itself.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O((V + E) log V)</code> with a heap.</li>
                <li>Memory: <code>O(V + E)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>No negative weights, ever.</li>
                <li>It works out every node, even if you want just one.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Roads have different costs, all zero or more.</li>
                <li>If every road counts the same, plain BFS is enough.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>A negative weight: wrong answers.</li>
                <li>A node still at <code>∞</code> at the end: it cannot be reached.</li>
                <li>A scanned list instead of a heap: slow.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Cheapest Is Not the Same as Fewest</h3>
        <p>
          Breadth-first search counts roads, not costs. On a map with costs,
          the route with the fewest roads can be the more expensive one:
        </p>
        <CheapestVsFewestVisual />
        <p>
          The cheapest route here uses <em>more</em> roads, but they are short
          ones. To find it, the search has to add up the costs as it goes.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Set up.</strong> The start costs 0. Every other node costs <code>∞</code> (no way found yet).</li>
          <li><strong>Pick.</strong> Take the open node with the smallest cost. Nothing else can reach it more cheaply, so its cost is <strong>final</strong>.</li>
          <li><strong>Relax.</strong> For each road out of it, check whether going that way is cheaper than what the neighbour already has. If so, update it.</li>
          <li><strong>Repeat</strong> until no open nodes are left.</li>
        </ol>
        <p>
          Why is step 2 safe? Any other way to reach that node must first pass
          through some other open node, which is already at least as far away.
          And since a road never costs less than 0, going further can only add
          to the total.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The One Trick: Relaxing a Road</h3>
        <p>
          A node&rsquo;s cost can change more than once. The first way we find
          is not always the best:
        </p>
        <RelaxVisual />
        <p>
          That is all &ldquo;relaxing&rdquo; means: you found a cheaper way, so
          you update the cost and remember where it came from.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong>. The number on each node is its best
          distance so far. Yellow nodes are reached but not final, green ones
          are finished, and green roads are the cheapest way found into each
          node. Underneath you can watch the heap, the distances and the
          visited set.
        </p>
        <p>The graph is stored as a dictionary of lists, and each list holds <code>(neighbour, cost)</code> pairs:</p>
        <div className="code-block">
          <code>{`from heapq import heappush, heappop
inf = float('inf')

graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('C', 1), ('D', 5)],
    'C': [('A', 2), ('B', 1), ('D', 8), ('E', 10)],
    'D': [('B', 5), ('C', 8), ('E', 2), ('F', 6)],
    'E': [('C', 10), ('D', 2), ('F', 3)],
    'F': [('D', 6), ('E', 3)],
}`}</code>
        </div>
        <DijkstraTracer />
        <p>
          Look for the entries marked <em>out of date</em>. The heap cannot
          remove an entry from the middle, so when B&rsquo;s cost drops from 4
          to 3, the old <code>(4, B)</code> stays in the heap. When it finally
          comes out, <code>visited</code> tells us B is already done, and we
          skip it. Then try <strong>Two separate groups</strong>: the nodes
          with no road to the start are never reached, and stay at{' '}
          <code>∞</code>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reading the Route</h3>
        <p>
          The costs tell you <em>how far</em>. To get the route itself, follow{' '}
          <code>previous</code> back from the goal, then flip it:
        </p>
        <PathBackVisual />
        <div className="code-block">
          <code>{`def route_to(previous, start, goal):
    route = [goal]
    while route[-1] != start:
        route.append(previous[route[-1]])
    route.reverse()
    return route`}</code>
        </div>
        <p>
          If the goal is not in <code>previous</code>, nothing led to it, so
          there is no route at all.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The One Rule: No Negative Weights</h3>
        <p>
          Dijkstra locks a node in as soon as it is the closest. That is only
          safe if going further can never make a total smaller. A negative road
          breaks that promise:
        </p>
        <NegativeVisual />
        <p>
          Real roads rarely cost less than nothing, so this is usually fine.
          When negative weights are possible (profits, refunds, trading
          rates), you need the next algorithm: <strong>Bellman-Ford</strong>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Dijkstra in One Breath</h3>
        <div className="definition">
          Dijkstra&rsquo;s algorithm finds the cheapest route from one start
          node to every other node in a graph with no negative weights. It
          keeps a best-known cost for every node, repeatedly finishes the open
          node with the smallest cost (using a heap), and checks whether its
          roads give its neighbours a cheaper way in.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Every road gets looked at, and every cheaper way found goes onto
              the heap and later comes off it. A heap push or pop costs{' '}
              <code>log V</code>:
            </p>
            <p>
              <code>O((V + E) log V)</code> time, and <code>O(V + E)</code>{' '}
              memory.
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
          With fancier heaps (a Fibonacci heap) it can drop to{' '}
          <code>O(E + V log V)</code>, but the plain heap above is what almost
          everyone uses.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>Roads have different costs.</strong> Distance, time, price,
          effort: maps, flights, delivery routes, game movement.
        </p>
        <p>
          <strong>You want the cheapest route to many places.</strong> One run
          answers &ldquo;how far to everywhere?&rdquo;.
        </p>
        <p>
          <strong>Every road costs the same.</strong> Use breadth-first
          search. It is simpler and faster.
        </p>
        <p>
          <strong>Some roads cost less than zero.</strong> Use Bellman-Ford.
        </p>
        <p>
          <strong>You only want one goal, and you can guess how far it is.</strong>{' '}
          A* is Dijkstra with a good guess, so it searches less. It is coming up
          soon.
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

export default Dijkstra
