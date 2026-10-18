import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import AStarTracer from './AStarTracer.jsx'
import AStarWalkthrough from './AStarWalkthrough.jsx'
import { RaceVisual, GridToGraphVisual, OverestimateVisual, WorkVisual } from './AStarVisuals.jsx'

const guesses = [
  { where: 'A map where you can drive in any direction', h: 'the straight-line distance to the goal', why: 'No road can be shorter than a straight line.' },
  { where: 'A grid where you move up, down, left, right', h: '|dx| + |dy| (the Manhattan distance)', why: 'You need at least that many steps, and walls only make it longer.' },
  { where: 'A grid where you can also move diagonally', h: 'the larger of |dx| and |dy|', why: 'Each diagonal step covers one column and one row at once.' },
  { where: 'You have no idea', h: '0', why: 'Safe, but a guess of 0 makes A* behave exactly like Dijkstra.' },
]

const mapping = [
  { tiles: 'A open tile', graph: 'A node (a dot)' },
  { tiles: 'A wall', graph: 'No node at all' },
  { tiles: 'Two tiles that touch', graph: 'An edge (a line) between two nodes' },
  { tiles: 'One step costs 1', graph: 'Every edge has weight 1' },
  { tiles: 'Manhattan distance to G', graph: 'A guess h worked out from where each node sits' },
  { tiles: 'The route of tiles', graph: 'A path of edges from S to G' },
]

const versus = [
  { prop: 'Finds', dij: 'the cheapest cost to every node', astar: 'the cheapest route to one goal' },
  { prop: 'Heap sorted by', dij: 'g (cost so far)', astar: 'g + h (cost so far + guess)' },
  { prop: 'Stops when', dij: 'the heap is empty', astar: 'the goal comes off the heap' },
  { prop: 'Needs', dij: 'just the graph', astar: 'the graph and a guess h' },
  { prop: 'Cheapest route guaranteed', dij: 'yes', astar: 'yes, if h never overestimates' },
  { prop: 'Worst case', dij: 'O((V + E) log V)', astar: 'the same' },
]

const costs = [
  { what: 'A*, worst case (a useless guess)', time: 'O((V + E) log V)', why: 'It degrades to Dijkstra: every tile may be visited.' },
  { what: 'A*, with a good guess', time: 'far less in practice', why: 'Tiles that point away from the goal have a big f and never come off the heap.' },
  { what: 'A* with a guess of 0', time: 'O((V + E) log V)', why: 'It is Dijkstra, except that it stops at the goal.' },
  { what: 'Working out h for one tile', time: 'O(1)', why: 'Manhattan distance is two subtractions and an addition.' },
  { what: 'One heap push or pop', time: 'O(log V)', why: 'The same heap as in Dijkstra.' },
  { what: 'Extra memory', time: 'O(V + E)', why: 'It keeps the heap, g, previous and visited. On a huge map the heap is the main limit.' },
]

const examples = [
  {
    id: 'worst',
    prompt: 'A* with a heap on a grid of n tiles, each touching up to 4 others, in the worst case (the guess does not help).',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'The worst case is Dijkstra: about n pushes and pops at log n each. g, previous, visited and the heap hold about n things.',
  },
  {
    id: 'zero',
    prompt: 'A* with h = 0 for every tile, on a grid of n tiles.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'With no guess, f = g and A* is just Dijkstra that stops at the goal.',
  },
  {
    id: 'compute',
    prompt: 'Working out the Manhattan guess for one tile: abs(r - goal_r) + abs(c - goal_c)',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Two subtractions and an addition, whatever the size of the map.',
  },
  {
    id: 'neighbours',
    prompt: 'Checking the four neighbours of one tile (up, right, down, left) in the loop.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'There are always exactly four, however big the grid is.',
  },
  {
    id: 'lookup',
    prompt: 'Looking up the cost so far of a tile in a dictionary: g.get(nxt, inf)',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'A dictionary lookup does not depend on how many entries it holds.',
  },
  {
    id: 'push',
    prompt: 'One heappush of (f, tile) onto a heap that holds up to n entries.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The entry moves up at most the height of the heap, which is log n levels.',
  },
  {
    id: 'scan',
    prompt: 'A* that finds the smallest f by scanning a plain list of up to n waiting tiles every round (a grid of n tiles).',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Up to n rounds, each reading up to n entries. A heap brings this down to n log n.',
  },
  {
    id: 'path',
    prompt: 'Reading the route back from the goal to the start through previous, on a route of up to n tiles.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One step per tile on the route, and the route is a list of up to n tiles.',
  },
]

function AStar() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Graph Data Structures</p>
      <h2>A* Algorithm</h2>
      <p>
        Dijkstra&rsquo;s algorithm spreads out in every direction, like a
        ripple, even away from where you want to go. If you only need the route
        to <em>one</em> place, that is a waste. <strong>A*</strong> (say
        &ldquo;A-star&rdquo;) is Dijkstra with a{' '}
        <strong>guess</strong>: a rough idea of how far is left, so it heads
        the right way. We will watch it work on a grid of tiles, because that
        is where it is used most: maps and games.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <RaceVisual />
      </section>

      <section className="notebook-section">
        <h3>A* Step by Step</h3>
        <p>
          Press <strong>Next step</strong> to walk through it. Each step adds
          one idea, and every picture comes from a real run of the algorithm.
          The <strong>A graph</strong> button redraws any step as dots and
          lines; there is more on that just below.
        </p>
        <AStarWalkthrough />
      </section>

      <section className="notebook-section">
        <h3>The Same Map as a Graph</h3>
        <p>
          A grid is really a graph in disguise. Make every open tile a node,
          and join every two tiles that touch with an edge, and you have a
          graph that A* can search just as well:
        </p>
        <GridToGraphVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>On the grid</th>
                <th>In the graph</th>
              </tr>
            </thead>
            <tbody>
              {mapping.map((row) => (
                <tr key={row.tiles}>
                  <td><strong>{row.tiles}</strong></td>
                  <td>{row.graph}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Try the <strong>A graph</strong> button above, and in the tracer
          further down. It draws the very same search with dots and lines. The
          light green lines show where each node was reached from (that is{' '}
          <code>previous</code>), and the dark green ones are the final route.
        </p>
        <p>
          On a real road map the graph is not a neat lattice. Nodes are
          junctions, edges are roads with their own lengths (not always 1),
          and the guess <code>h</code> is the straight-line distance between a
          node and the goal, worked out from where each node sits. Everything
          else about A* stays the same.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything on this page. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">A* &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>Dijkstra plus a <strong>guess</strong> of the distance left.</li>
                <li>Finds the cheapest route from a start to <strong>one goal</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Dijkstra wastes time on places that lead away from the goal.</li>
                <li>Maps, games, robots, puzzles.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li><code>g</code> = cost so far.</li>
                <li><code>h</code> = guess of cost left.</li>
                <li>Always visit the tile with the smallest <code>f = g + h</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The one rule</h4>
              <ul>
                <li><code>h</code> must <strong>never be bigger</strong> than the real cost left.</li>
                <li>Too big: the best route can be skipped.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Two differences from Dijkstra</h4>
              <ul>
                <li>Heap sorted by <code>g + h</code>, not <code>g</code>.</li>
                <li>Stops as soon as the goal comes off the heap.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Worst case: <code>O((V + E) log V)</code>, same as Dijkstra.</li>
                <li>With a good guess: far fewer tiles.</li>
                <li>Memory: <code>O(V + E)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>You must come up with a good guess.</li>
                <li>It finds one goal, not every node.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>One start, one goal, and you can estimate the distance left.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>A guess that overestimates: wrong answers.</li>
                <li>A guess of 0: just Dijkstra.</li>
                <li>Big maps: the heap can use lots of memory.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Set up.</strong> Put the start on the heap with <code>f = 0 + h(start)</code>.</li>
          <li><strong>Pick.</strong> Take the tile with the smallest <code>f</code>. If it is the goal, <strong>stop</strong>: you have the cheapest route.</li>
          <li><strong>Expand.</strong> For each neighbour that is not a wall, if its new cost <code>g</code> is cheaper, update it and put it on the heap with <code>f = g + h</code>.</li>
          <li><strong>Repeat</strong> until the goal comes off the heap, or the heap runs out (no route).</li>
        </ol>
        <p>
          Everything else, the heap, <code>previous</code>, updating a cost when
          you find a cheaper way, is the same as Dijkstra.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Choosing a Guess</h3>
        <p>
          The guess comes from what you know about the problem. On a grid you
          can count the tiles; on a map you can measure a straight line:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Where</th>
                <th>Guess h</th>
                <th>Why it is safe</th>
              </tr>
            </thead>
            <tbody>
              {guesses.map((row) => (
                <tr key={row.where}>
                  <td><strong>{row.where}</strong></td>
                  <td>{row.h}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The closer <code>h</code> is to the truth (without going over), the
          fewer tiles A* needs to visit.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The One Rule: Never Overestimate</h3>
        <p>
          The guess may be too small, but it must <strong>never be too
          big</strong>. Watch the same search with an honest guess and with a
          guess four times too big:
        </p>
        <OverestimateVisual />
        <p>
          A guess that never overestimates is called <strong>admissible</strong>.
          Manhattan distance on a grid and a straight line on a map are both
          admissible. They also never drop by more than one road&rsquo;s cost
          per step (that is called <strong>consistent</strong>), which is what
          lets the code skip tiles it has already visited.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong> to run the real code on the same map. The
          number on each tile is its <code>f</code>, the heap is listed
          underneath, and a pointer floats over the neighbour being checked.
          Then try <strong>A guess that is too big</strong>: it runs on a
          different map and comes back with a longer route.
        </p>
        <p>The map is a list of strings (<code>#</code> is a wall), plus two small helper functions:</p>
        <div className="code-block">
          <code>{`from heapq import heappush, heappop
inf = float('inf')

grid = [
    "......G",
    ".......",
    ".......",
    "....###",
    "......#",
    "####..#",
    "S.....#",
]
start, goal = (6, 0), (0, 6)

def h(cell, goal):  # the guess: tiles across + tiles up
    return abs(cell[0] - goal[0]) + abs(cell[1] - goal[1])

def open_cell(grid, cell):  # on the map, and not a wall
    r, c = cell
    return 0 <= r < len(grid) and 0 <= c < len(grid[0]) and grid[r][c] != '#'`}</code>
        </div>
        <AStarTracer />
        <p>
          Compare it with the Dijkstra tracer. The only changes are the heap
          key (<code>new_g + h(nxt, goal)</code>) and the goal check as soon as
          a tile comes off the heap.
        </p>
      </section>

      <section className="notebook-section">
        <h3>A* in One Breath</h3>
        <div className="definition">
          A* finds the cheapest route from a start to a goal by always
          visiting the node with the smallest <code>g + h</code>: the cost so
          far plus a guess of the cost left. If the guess never overestimates,
          the first time the goal comes off the heap its route is the cheapest.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              In the worst case A* does what Dijkstra does. But a good guess
              keeps whole parts of the map off the heap:
            </p>
            <p>
              <code>O((V + E) log V)</code> time at worst, and{' '}
              <code>O(V + E)</code> memory. On a grid, V is the number of tiles
              and E is about twice that.
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
        <h3>A* or Dijkstra?</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Dijkstra</th>
                <th>A*</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.dij}</td>
                  <td>{row.astar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You have one start and one goal.</strong> A route on a map, a
          character walking across a game level, a robot crossing a room.
        </p>
        <p>
          <strong>You can estimate how far is left.</strong> Coordinates give
          you a straight line or a tile count for free.
        </p>
        <p>
          <strong>You need the route to many places.</strong> Use Dijkstra:
          there is no single goal for a guess to point at.
        </p>
        <p>
          <strong>Some roads cost less than zero.</strong> Use Bellman-Ford.
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

export default AStar
