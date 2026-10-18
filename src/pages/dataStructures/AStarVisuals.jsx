import IsoGrid, { searchCell, searchEdges } from '../../components/IsoGrid.jsx'
import { MAIN_MAP, TRAP_MAP, cellKey, gridRun, isWall, manhattan } from './gridAStar.js'
import { StepDots, reducedMotion, useLoop } from './loopHooks.jsx'

const GREY = '#d9d9d7'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'

const HOLD = 6

// One search, drawn after its first `tick + 1` expansions. Once every tile it
// needs has been expanded, the route it found turns green.
function RunPanel({ map, run, tick, title, sub }) {
  const total = run.events.length - 1 // the last event is the goal coming off the heap
  const done = tick >= total
  const shown = Math.min(tick + 1, total)
  const event = run.events[shown - 1]
  const cell = searchCell({
    map,
    closed: event.closed,
    open: event.heap.map(([, c]) => c),
    current: done ? null : event.cell,
    route: done ? run.route : null,
  })

  return (
    <figure>
      <IsoGrid
        rows={map.rows}
        cols={map.cols}
        cell={cell}
        room={4}
        ariaLabel={`${title}: ${run.expanded.length} tiles visited. The route it finds has ${run.cost} steps.`}
      />
      <figcaption>
        {title}
        <span>{sub}</span>
      </figcaption>
    </figure>
  )
}

// ------------------------------------------------ the race

const DIJKSTRA = gridRun(MAIN_MAP, 0)
const ASTAR = gridRun(MAIN_MAP, 1)

// Dijkstra and A* side by side on the same map, a tile at a time.
function RaceVisual() {
  const [tick] = useLoop(DIJKSTRA.events.length + HOLD, 230)
  const t = reducedMotion() ? 99 : tick

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <RunPanel map={MAIN_MAP} run={DIJKSTRA} tick={t} title="Dijkstra" sub={`no guess: visits ${DIJKSTRA.expanded.length} tiles`} />
        <RunPanel map={MAIN_MAP} run={ASTAR} tick={t} title="A*" sub={`with a guess: visits only ${ASTAR.expanded.length} tiles`} />
      </div>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#8aa8ea' }} /> the tile being visited</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> waiting in the heap</li>
        <li><span className="swatch" style={{ background: GREY }} /> visited</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the route</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ tiles to a graph

const FINAL = ASTAR.events[ASTAR.events.length - 1]
const hOnEveryNode = Object.fromEntries(
  Array.from({ length: MAIN_MAP.rows * MAIN_MAP.cols }, (_, i) => [Math.floor(i / MAIN_MAP.cols), i % MAIN_MAP.cols])
    .filter((cell) => !isWall(MAIN_MAP, cell))
    .map((cell) => [cellKey(cell), String(manhattan(cell, MAIN_MAP.goal))]),
)

const MORPH = [
  { mode: 'tiles', grid: {}, caption: 'The map from the walkthrough: a grid of tiles with walls.' },
  { mode: 'dots', grid: {}, caption: 'Put a dot on every open tile. Walls get no dot, because nobody can stand on a wall.' },
  { mode: 'graph', grid: {}, caption: 'Spread the dots out and join every two tiles that touch (up, down, left or right) with a line. Each step costs 1, so every line costs 1.' },
  { mode: 'graph', grid: { labels: hOnEveryNode }, caption: 'The tiles are gone and only dots and lines are left: a graph. A* never needed the tiles. Its guess h still works: count the rows and columns between a dot and G.' },
  {
    mode: 'graph',
    grid: { route: ASTAR.route, labels: Object.fromEntries(ASTAR.route.map((cell) => [cellKey(cell), String(FINAL.g[cellKey(cell)])])) },
    caption: `A* finds the same cheapest route as before: a path of ${ASTAR.cost} lines from S to G (the numbers are the cost so far).`,
  },
]

// The grid from the walkthrough turning into a graph.
function GridToGraphVisual() {
  const [tick, setTick] = useLoop(MORPH.length, 4800)
  const frame = MORPH[tick]

  return (
    <div className="visual-card">
      <IsoGrid
        rows={MAIN_MAP.rows}
        cols={MAIN_MAP.cols}
        cell={searchCell({ map: MAIN_MAP, ...frame.grid })}
        room={6}
        graphable
        mode={frame.mode}
        edge={searchEdges({ route: frame.grid.route })}
        ariaLabel="A grid of tiles with walls turning into a graph: each open tile becomes a dot, touching tiles are joined by lines, and the tiles fade away. A* finds the same 14-step route on the graph."
      />
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={MORPH.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ a guess that is too big

const HONEST = gridRun(TRAP_MAP, 1)
const TOO_BIG = gridRun(TRAP_MAP, 4)

// The same search with an honest guess and with a guess four times too big.
function OverestimateVisual() {
  const [tick] = useLoop(Math.max(HONEST.events.length, TOO_BIG.events.length) + HOLD, 260)
  const t = reducedMotion() ? 99 : tick

  return (
    <div className="visual-card">
      <div className="tree-pair">
        <RunPanel map={TRAP_MAP} run={HONEST} tick={t} title="An honest guess" sub={`finds ${HONEST.cost} steps, the cheapest route`} />
        <RunPanel map={TRAP_MAP} run={TOO_BIG} tick={t} title="A guess 4 times too big" sub={`rushes ahead and finds ${TOO_BIG.cost} steps`} />
      </div>
      <ul className="visual-legend">
        <li>the big guess charges up the left side towards G, because every step there looks like progress. It never checks the way along the bottom.</li>
      </ul>
    </div>
  )
}

// ------------------------------------------------ cost

// How many tiles each search had to visit on the main map.
function WorkVisual() {
  const free = MAIN_MAP.rows * MAIN_MAP.cols - MAIN_MAP.walls.length
  const rows = [
    { label: `Open tiles on the map: ${free}`, value: free, color: GREY, stroke: '#9d9d9b' },
    { label: `Dijkstra (no guess) visited: ${DIJKSTRA.expanded.length}`, value: DIJKSTRA.expanded.length, color: YELLOW, stroke: '#b8912a' },
    { label: `A* (Manhattan guess) visited: ${ASTAR.expanded.length}`, value: ASTAR.expanded.length, color: GREEN, stroke: '#237a35' },
  ]
  const scale = 300 / free

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label={`Of the ${free} open tiles on this map, Dijkstra visited ${DIJKSTRA.expanded.length} before reaching the goal and A* with a Manhattan guess visited only ${ASTAR.expanded.length}.`}
      >
        {rows.map(({ label, value, color, stroke }, i) => {
          const y = 6 + i * 48
          return (
            <g key={label}>
              <text x="4" y={y + 12} fontSize="11.5" fill="var(--text-h)">{label}</text>
              <rect x="4" y={y + 18} width={value * scale} height="16" rx="3" fill={color} stroke={stroke} strokeWidth="0.8" />
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>the worst case is the same as Dijkstra&rsquo;s, <code>O((V + E) log V)</code>, but a good guess skips most of the map</li>
      </ul>
    </div>
  )
}

export { RaceVisual, GridToGraphVisual, OverestimateVisual, WorkVisual }
