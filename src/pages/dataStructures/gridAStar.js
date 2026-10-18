// The worlds used on the A* page: grids of tiles with walls. Cells are
// [row, col]. Row 0 is at the top of the picture's diamond, row 6 at the bottom
// left; S is the left corner and G the right corner.

// The main map. The cheapest way is 14 steps (the straight-line trip is only
// 12, but walls are in the way). Heading for G along the bottom leads into a
// dead-end pocket that A* briefly explores.
//
//      col: 0 1 2 3 4 5 6
//   row 0:  . . . . . . G
//   row 1:  . . . . . . .
//   row 2:  . . . . . . .
//   row 3:  . . . . # # #
//   row 4:  . . . . . . #
//   row 5:  # # # # . . #
//   row 6:  S . . . . . #
export const MAIN_MAP = {
  rows: 7,
  cols: 7,
  start: [6, 0],
  goal: [0, 6],
  walls: [[5, 0], [5, 1], [5, 2], [5, 3], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6], [6, 6]],
}

// A map for "never overestimate": the cheapest way is 12 steps along the
// bottom and up the right side. A guess that is far too big makes the search
// charge up the left side instead, and it comes back with a 20-step route.
export const TRAP_MAP = {
  rows: 7,
  cols: 7,
  start: [6, 0],
  goal: [0, 6],
  walls: [[0, 3], [1, 3], [2, 3], [3, 3], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]],
}

export const cellKey = ([r, c]) => `${r},${c}`
export const sameCell = (p, q) => p[0] === q[0] && p[1] === q[1]

// The guess: tiles across plus tiles up, ignoring walls.
export const manhattan = (cell, goal) => Math.abs(cell[0] - goal[0]) + Math.abs(cell[1] - goal[1])

export const isWall = (map, cell) => map.walls.some((wall) => sameCell(wall, cell))
export const inside = (map, [r, c]) => r >= 0 && c >= 0 && r < map.rows && c < map.cols
export const isOpen = (map, cell) => inside(map, cell) && !isWall(map, cell)

// Up, right, down, left - the order the code tries them in.
export const DIRECTIONS = [
  { name: 'up', step: [-1, 0] },
  { name: 'right', step: [0, 1] },
  { name: 'down', step: [1, 0] },
  { name: 'left', step: [0, -1] },
]

// The heap order: smallest f first, then by cell, like Python's (f, cell) tuples.
export const byF = (p, q) => p[0] - q[0] || p[1][0] - q[1][0] || p[1][1] - q[1][1]

// A* on a grid. `scale` multiplies the guess: 1 is the honest Manhattan
// distance, 0 is no guess at all (Dijkstra), 4 is a guess that is far too big.
// One event per tile expanded, plus a last one for the goal.
//   event: { cell, f, before (heap as it was when this tile came off it),
//            heap (heap after it was expanded), closed, g, previous, pushed, goal }
export function gridRun(map, scale = 1) {
  const guess = (cell) => scale * manhattan(cell, map.goal)
  const g = { [cellKey(map.start)]: 0 }
  const previous = {}
  const closed = []
  const heap = [[guess(map.start), map.start]]
  const events = []
  let route = []

  while (heap.length) {
    heap.sort(byF)
    const before = heap.map(([f, cell]) => [f, cell])
    const [f, cell] = heap.shift()
    if (sameCell(cell, map.goal)) {
      route = [cell]
      while (!sameCell(route[0], map.start)) route.unshift(previous[cellKey(route[0])])
      events.push({ cell, f, before, heap: heap.map(([hf, hc]) => [hf, hc]), closed: closed.slice(), g: { ...g }, previous: { ...previous }, pushed: [], goal: true })
      break
    }
    if (closed.some((done) => sameCell(done, cell))) continue
    closed.push(cell)
    const pushed = []
    DIRECTIONS.forEach(({ step: [dr, dc] }) => {
      const next = [cell[0] + dr, cell[1] + dc]
      if (!isOpen(map, next)) return
      const newG = g[cellKey(cell)] + 1
      if (newG < (g[cellKey(next)] ?? Infinity)) {
        g[cellKey(next)] = newG
        previous[cellKey(next)] = cell
        heap.push([newG + guess(next), next])
        pushed.push(next)
      }
    })
    events.push({ cell, f, before, heap: heap.map(([hf, hc]) => [hf, hc]), closed: closed.slice(), g: { ...g }, previous: { ...previous }, pushed, goal: false })
  }

  return { events, route, cost: route.length ? route.length - 1 : null, expanded: closed }
}
