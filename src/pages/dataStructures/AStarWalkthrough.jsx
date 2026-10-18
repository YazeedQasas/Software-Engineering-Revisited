import { useState } from 'react'
import IsoGrid, { GridViewToggle, searchCell, searchEdges } from '../../components/IsoGrid.jsx'
import { MAIN_MAP, cellKey, gridRun, manhattan, sameCell } from './gridAStar.js'
import { StepDots } from './loopHooks.jsx'

const MAP = MAIN_MAP
const A = gridRun(MAP, 1)
const D = gridRun(MAP, 0)
const FREE = MAP.rows * MAP.cols - MAP.walls.length

const eventAt = (cell) => A.events.find((e) => sameCell(e.cell, cell))
const cellsOf = (heap) => heap.map(([, cell]) => cell)
const sortedItems = (heap) => heap.map(([f, [r, c]]) => `(${f}, (${r}, ${c}))`)

// h for every open tile.
const hLabels = Object.fromEntries(
  Array.from({ length: MAP.rows * MAP.cols }, (_, i) => [Math.floor(i / MAP.cols), i % MAP.cols])
    .filter(([r, c]) => !MAP.walls.some((w) => sameCell(w, [r, c])))
    .map((cell) => [cellKey(cell), String(manhattan(cell, MAP.goal))]),
)

// f = g + h for every tile that has a cost so far.
const fLabels = (g, only) =>
  Object.fromEntries(
    Object.entries(g)
      .filter(([key]) => !only || only.has(key))
      .map(([key, cost]) => {
        const [r, c] = key.split(',').map(Number)
        return [key, String(cost + manhattan([r, c], MAP.goal))]
      }),
  )

const dijkstraSoFar = D.events[13]
const afterStart = A.events[0]
const twoWaiting = A.events[4]
const picking = eventAt([4, 4])
const pocketDone = eventAt([6, 5])
const last = A.events[A.events.length - 1]

const beforeKeys = new Set([...picking.closed.slice(0, -1), ...cellsOf(picking.before)].map(cellKey))

// Every step: what to say, and what the world looks like while saying it.
//   grid: the props of searchCell, plus marker / callout; heap: the strip shown
//   under the picture (items and the slot that comes out next)
const STEPS = [
  {
    title: 'The map',
    text: (
      <>
        A grid of tiles. You start on the <strong>teal</strong> tile and want to reach the{' '}
        <strong>purple</strong> one. Step up, down, left or right, one tile at a time, and every step
        costs 1. The tall dark blocks are <strong>walls</strong>: you cannot walk through them. What is
        the cheapest route?
      </>
    ),
    grid: {},
  },
  {
    title: 'First, what Dijkstra would do',
    text: (
      <>
        Dijkstra spreads out like a ripple: every tile 1 step away, then 2 steps away, and so on. Here
        it has already visited {dijkstraSoFar.closed.length} tiles, in every direction, even back behind the start. By
        the end it will have visited {D.expanded.length} of the {FREE} open tiles. That is a lot of
        wasted effort.
      </>
    ),
    grid: { closed: dijkstraSoFar.closed, open: cellsOf(dijkstraSoFar.heap), current: dijkstraSoFar.cell, previous: dijkstraSoFar.previous },
  },
  {
    title: 'A* adds a guess',
    text: (
      <>
        A* gives every tile a second number: a <strong>guess</strong> of how far it still is from the
        goal. Count the tiles across and the tiles up, and ignore the walls. That is <code>h</code>.
        From the start it is 12, and at the goal it is 0. Walls can only make the real trip longer,
        never shorter, so this guess is never too big.
      </>
    ),
    grid: { labels: hLabels },
    marker: MAP.start,
  },
  {
    title: 'Cost so far + guess = f',
    text: (
      <>
        Each tile also gets <code>g</code>: the exact cost paid to reach it. The first tile after the
        start is 1 step away, so <code>g = 1</code>, and its guess is <code>h = 11</code>. Add them
        up: <code>f = g + h = 12</code>. That is the best total this route could possibly cost. A*
        judges every tile by its <code>f</code>.
      </>
    ),
    grid: { closed: afterStart.closed, open: cellsOf(afterStart.heap), labels: fLabels(afterStart.g), previous: afterStart.previous },
    callout: { cell: [6, 1], text: 'g 1 + h 11 = f 12' },
  },
  {
    title: 'Tiles wait in the heap',
    text: (
      <>
        Tiles that have been found but not visited yet wait in a list called the <strong>heap</strong>
        , each with its <code>f</code>. Here two tiles are waiting (yellow). The heap always hands
        back the one with the smallest <code>f</code>.
      </>
    ),
    grid: { closed: twoWaiting.closed, open: cellsOf(twoWaiting.heap), labels: fLabels(twoWaiting.g), previous: twoWaiting.previous },
    heap: { items: sortedItems(twoWaiting.heap), next: 0 },
  },
  {
    title: 'Take the smallest f',
    text: (
      <>
        Three tiles are waiting now, and they all tie at <code>f = 12</code>. A* takes one of them (the
        blue tile) and visits it. This is the same &ldquo;closest first&rdquo; idea as Dijkstra, except
        that &ldquo;closest&rdquo; now includes the guess.
      </>
    ),
    grid: {
      closed: picking.closed.slice(0, -1),
      open: cellsOf(picking.before.slice(1)),
      current: picking.cell,
      labels: fLabels(picking.g, beforeKeys),
      previous: picking.previous,
    },
    heap: { items: sortedItems(picking.before), next: 0 },
  },
  {
    title: 'Look at its neighbours',
    text: (
      <>
        Now check the tiles around the blue one. A wall? Skip it. Already visited? Skip it. Otherwise
        work out its <code>g</code> and <code>f</code> and put it on the heap. Here one neighbour is a
        wall, one was visited already, and two are new. One of them is 7 steps from the start with a
        guess of 7 more, so its <code>f</code> is 14.
      </>
    ),
    grid: { closed: picking.closed, open: cellsOf(picking.heap), current: picking.cell, labels: fLabels(picking.g), previous: picking.previous },
    callout: { cell: [4, 3], text: 'g 7 + h 7 = f 14' },
    heap: { items: sortedItems(picking.heap), next: 0 },
  },
  {
    title: 'A dead end costs time, not correctness',
    text: (
      <>
        The tiles near the goal look great: they are close to G. But walls close off the top of this
        pocket, so it is a dead end. Their <code>f</code> stays at 12, so A* visits all of them anyway.
        Then the smallest <code>f</code> left on the heap is 14: the tile it left behind. The guess
        steered A* wrong for a moment, but <code>f</code> was only ever a lower bound, so A* backs out
        and carries on.
      </>
    ),
    grid: { closed: pocketDone.closed, open: cellsOf(pocketDone.heap), labels: fLabels(pocketDone.g), previous: pocketDone.previous },
    marker: [4, 3],
    heap: { items: sortedItems(pocketDone.heap), next: 0 },
  },
  {
    title: 'Reaching the goal',
    text: (
      <>
        When the goal itself is the smallest <code>f</code> on the heap, we stop: nothing waiting can
        be cheaper. Follow <code>previous</code> back from G to S and you get the green route:{' '}
        {A.cost} steps (the numbers are the cost so far). A* visited {A.expanded.length} tiles.
        Dijkstra visited {D.expanded.length}.
      </>
    ),
    grid: {
      closed: last.closed,
      route: A.route,
      labels: Object.fromEntries(A.route.map((cell) => [cellKey(cell), String(last.g[cellKey(cell)])])),
    },
  },
]

const LEGEND = [
  { color: '#9fd8e6', text: 'start' },
  { color: '#d2b4ee', text: 'goal' },
  { color: '#6b6c70', text: 'wall' },
  { color: '#8aa8ea', text: 'being visited' },
  { color: '#ffe27a', text: 'waiting in the heap' },
  { color: '#d9d9d7', text: 'visited' },
  { color: '#86d69f', text: 'the route' },
]

// A* explained one idea at a time, on a grid of isometric tiles. Every scene
// is read from a real run of the algorithm.
function AStarWalkthrough() {
  const [index, setIndex] = useState(0)
  const [view, setView] = useState('tiles')
  const step = STEPS[index]
  const cell = searchCell({ map: MAP, ...step.grid })
  const graph = view === 'graph'
  const legend = graph
    ? [...LEGEND.filter((item) => item.text !== 'wall'), { color: '#5cb878', text: 'green line: where a tile was reached from' }]
    : LEGEND

  return (
    <div className="visual-card">
      <div className="walk-head">
        <span className="walk-count">Step {index + 1} of {STEPS.length}</span>
        <h4 className="walk-title">{step.title}</h4>
      </div>

      <GridViewToggle value={view} onChange={setView} />
      <IsoGrid
        rows={MAP.rows}
        cols={MAP.cols}
        cell={cell}
        marker={step.marker ?? null}
        callout={step.callout ?? null}
        graphable
        mode={view}
        edge={searchEdges({ previous: step.grid.previous, route: step.grid.route, current: step.grid.current })}
        ariaLabel={`Step ${index + 1} of ${STEPS.length}: ${step.title}. A ${MAP.rows} by ${MAP.cols} grid drawn as ${graph ? 'a graph of dots and lines' : 'isometric tiles'}, with a start on the left and a goal on the right.`}
      />
      <ul className="visual-legend">
        {legend.map((item) => (
          <li key={item.text}><span className="swatch" style={{ background: item.color }} /> {item.text}</li>
        ))}
      </ul>

      {step.heap && (
        <div className="tracer-frontier" aria-label="Heap">
          <span className="tracer-frontier-name">Heap</span>
          <div className="tracer-frontier-slots">
            {step.heap.items.map((item, i) => (
              <span key={i} className={`tracer-slot wide${i === step.heap.next ? ' next' : ''}`}>{item}</span>
            ))}
          </div>
        </div>
      )}

      <p className="walk-text" aria-live="polite">{step.text}</p>

      <div className="walk-nav">
        <button type="button" className="tracer-btn" onClick={() => setIndex(index - 1)} disabled={index === 0}>
          Back
        </button>
        <button type="button" className="tracer-btn primary" onClick={() => setIndex(index + 1)} disabled={index === STEPS.length - 1}>
          Next step
        </button>
        <StepDots count={STEPS.length} tick={index} onPick={setIndex} />
      </div>
    </div>
  )
}

export default AStarWalkthrough
