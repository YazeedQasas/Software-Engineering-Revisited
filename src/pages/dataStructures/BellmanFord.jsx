import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import BellmanFordTracer from './BellmanFordTracer.jsx'
import { PassesVisual, WorksVisual, NegativeCycleVisual, PassesWorkVisual } from './BellmanFordVisuals.jsx'

const versus = [
  { prop: 'Idea', dij: 'finish the closest node, never go back', bf: 'check every edge, over and over' },
  { prop: 'Negative weights', dij: 'breaks', bf: 'works' },
  { prop: 'Negative cycles', dij: 'cannot spot them', bf: 'spots them' },
  { prop: 'Data structure', dij: 'a heap', bf: 'just a list of edges' },
  { prop: 'Time', dij: 'O((V + E) log V)', bf: 'O(V × E)' },
  { prop: 'Use it when', dij: 'weights are 0 or more', bf: 'weights might be negative' },
]

const costs = [
  { what: 'Bellman-Ford, graph as a list of edges', time: 'O(V × E)', why: 'V − 1 passes, and each pass checks all E edges.' },
  { what: 'One pass over all the edges', time: 'O(E)', why: 'Each edge is checked once.' },
  { what: 'The extra check for a negative cycle', time: 'O(E)', why: 'One more pass, so it never changes the big picture.' },
  { what: 'Relaxing one edge', time: 'O(1)', why: 'One addition and one comparison.' },
  { what: 'Best case, with an early stop', time: 'O(E)', why: 'If a whole pass changes nothing, stop. A lucky edge order can finish after about two passes.' },
  { what: 'Extra memory', time: 'O(V)', why: 'dist and previous hold one entry per node. The edge list is the input itself.' },
]

const examples = [
  {
    id: 'full',
    prompt: 'Bellman-Ford on a graph with n nodes and about n edges, with no early stop.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'n − 1 passes, and each one checks about n edges: n times n. dist and previous hold n entries.',
  },
  {
    id: 'pass',
    prompt: 'One pass of Bellman-Ford over a graph with n edges.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every edge is checked once, and the check needs only a few variables.',
  },
  {
    id: 'cycle',
    prompt: 'The final extra pass that checks for a negative cycle, on a graph with n edges.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'It is one more pass over the n edges. It only compares, so it needs no extra memory.',
  },
  {
    id: 'relax',
    prompt: 'Relaxing one edge: if dist[u] + w < dist[v]: dist[v] = dist[u] + w',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'One addition, one comparison and one assignment, whatever the size of the graph.',
  },
  {
    id: 'early',
    prompt: 'Bellman-Ford with an early stop, on a graph with n edges where the edges happen to be listed in the best order, so the first pass settles everything.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Pass 1 does the work, pass 2 changes nothing, and we stop. Two passes over n edges is still O(n).',
  },
  {
    id: 'dijkstra',
    prompt: "Dijkstra's algorithm with a heap on the same graph (n nodes, about n edges, no negative weights).",
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'This is why Dijkstra is the first choice when it is allowed to be used. Bellman-Ford pays for being able to handle negative weights.',
  },
  {
    id: 'path',
    prompt: 'Reading the cheapest route back from the goal to the start through previous, on a route of up to n nodes.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One step per node on the route, and the route itself is a list of up to n nodes.',
  },
  {
    id: 'chain',
    prompt: 'Bellman-Ford with no early stop on a chain of n nodes joined by n − 1 edges.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Fewer edges does not help: n − 1 passes of n − 1 edges each is still about n × n.',
  },
]

function BellmanFord() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>Bellman-Ford Algorithm</h2>
      <p>
        Dijkstra&rsquo;s algorithm is fast, but it has one rule: no negative
        weights. <strong>Bellman-Ford</strong> finds the cheapest route even
        when some roads have a negative cost. Its idea is almost too simple:{' '}
        <strong>check every edge, and do it over and over until nothing gets
        cheaper</strong>.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <PassesVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Bellman-Ford &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>The cheapest route from one start node to every other node.</li>
                <li>Negative weights are allowed.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Dijkstra goes wrong with a negative road.</li>
                <li>Bellman-Ford does not.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Start: 0 for the start node, <code>∞</code> for the rest.</li>
                <li>Go through <strong>every edge</strong>, relaxing each one. That is one <strong>pass</strong>.</li>
                <li>Do <strong>V &minus; 1</strong> passes.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Why V &minus; 1?</h4>
              <ul>
                <li>A cheapest route never needs more than V &minus; 1 roads.</li>
                <li>Each pass makes routes one road longer correct.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. A free bonus</h4>
              <ul>
                <li>One extra pass: if something still improves, there is a <strong>negative cycle</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(V × E)</code>.</li>
                <li>Memory: <code>O(V)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Much slower than Dijkstra.</li>
                <li>With a negative cycle there is no answer, only a warning.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Weights might be negative.</li>
                <li>You need to catch negative cycles.</li>
                <li>Otherwise prefer Dijkstra.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Roads that work both ways: a negative undirected edge is already a negative cycle.</li>
                <li>Forgetting the extra check pass.</li>
                <li>Using it when Dijkstra would do.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Graph That Broke Dijkstra</h3>
        <p>
          Dijkstra locks a node in the moment it is the closest, and never
          looks back. A negative road can make that a mistake. Bellman-Ford
          locks nothing in, so it can fix itself:
        </p>
        <WorksVisual />
      </section>

      <section className="notebook-section">
        <h3>The Idea in Three Steps</h3>
        <ol>
          <li><strong>Set up.</strong> The start costs 0. Every other node costs <code>∞</code>.</li>
          <li><strong>Sweep.</strong> Go through <em>every</em> edge, in any order, and relax it: if the road gives its end a cheaper cost, update it. That is one pass. Do <strong>V &minus; 1</strong> passes.</li>
          <li><strong>Check.</strong> Do one more pass. If anything still gets cheaper, there is a negative cycle.</li>
        </ol>
        <p>
          &ldquo;Relax&rdquo; means the same as it did for Dijkstra: found a
          cheaper way, so take it.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Why V &minus; 1 Passes?</h3>
        <p>
          A cheapest route never visits a node twice, so it has at most{' '}
          <strong>V &minus; 1</strong> roads. Now watch the animation at the top
          again:
        </p>
        <ul>
          <li>After pass 1, every cheapest route of <strong>1 road</strong> is correct.</li>
          <li>After pass 2, every cheapest route of up to <strong>2 roads</strong> is correct.</li>
          <li>After pass k, routes of up to <strong>k roads</strong> are correct.</li>
        </ul>
        <p>
          So V &minus; 1 passes cover every possible route. The order the edges
          are checked in only decides how <em>quickly</em> the news spreads.
          With an unlucky order, news moves one road per pass, which is the
          worst case.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong>. The graph is stored as a plain list of
          edges, <code>(from, to, cost)</code>, and the edge being checked is
          blue with a dashed end. Watch how the order matters: with the
          unlucky order, E does not get its final cost until pass 4. With the
          lucky order, everything is settled in pass 1 and the other passes do
          nothing.
        </p>
        <div className="code-block">
          <code>{`inf = float('inf')

nodes = ['A', 'B', 'C', 'D', 'E']
edges = [
    ('D', 'E', 2),
    ('B', 'D', 3),
    ('C', 'B', -2),
    ('A', 'B', 4),
    ('A', 'C', 5),
]`}</code>
        </div>
        <BellmanFordTracer />
        <p>
          Then try <strong>A negative cycle</strong>. After the three normal
          passes, the check pass still finds an improvement, and the function
          returns <code>None</code>.
        </p>
        <p>
          A simple speed-up: keep a flag, and if a whole pass changes nothing,
          stop early. Nothing can change after that.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Negative Cycles</h3>
        <p>
          A <strong>negative cycle</strong> is a loop whose roads add up to less
          than zero. Go round it again and the trip gets cheaper, so there is
          no &ldquo;cheapest&rdquo; route at all:
        </p>
        <NegativeCycleVisual />
        <p>
          This is why the extra pass matters. If routes can only need V &minus; 1
          roads, a pass after that must change nothing. If it does, a loop is
          feeding it. Bellman-Ford is the standard way to catch this, for
          example to spot a currency-exchange loop that makes free money.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reading the Route</h3>
        <p>
          Exactly as with Dijkstra: follow <code>previous</code> back from the
          goal to the start, then reverse it. The green roads in the tracer
          show the same thing.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Bellman-Ford in One Breath</h3>
        <div className="definition">
          Bellman-Ford finds the cheapest route from one start node to every
          other node, even with negative weights. It relaxes every edge in
          turn, V &minus; 1 times over, and then does one more pass to catch a
          negative cycle.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              V &minus; 1 passes, and each pass checks all E edges, plus one
              more pass to check for a negative cycle:
            </p>
            <p>
              <code>O(V × E)</code> time, and <code>O(V)</code> memory.
            </p>
          </div>
          <PassesWorkVisual />
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
        <h3>Bellman-Ford or Dijkstra?</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Dijkstra</th>
                <th>Bellman-Ford</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.dij}</td>
                  <td>{row.bf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>Some roads cost less than zero.</strong> Refunds, profits,
          exchange rates (taken as logs), energy that can be gained back.
        </p>
        <p>
          <strong>You need to detect a negative cycle.</strong> Something that
          loops and keeps getting cheaper is usually a bug or an opportunity.
        </p>
        <p>
          <strong>You are not sure the weights are safe.</strong> It is slower,
          but it will not give a wrong answer.
        </p>
        <p>
          <strong>All weights are 0 or more.</strong> Use Dijkstra. It does the
          same job much faster.
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

export default BellmanFord
