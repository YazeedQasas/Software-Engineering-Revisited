// The "count islands" algorithm, recorded as a list of steps, for the
// IslandCounter step-through. This file has no UI code in it: buildSteps runs the
// algorithm once, and replay works out what the picture looks like after any
// number of steps.

// 1 is land and 0 is water. The expected answer is 4 islands.
export const DEFAULT_GRID = [
  [1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 1, 1, 0, 1],
]

// The order the flood fill tries a cell's four neighbours: down, up, right, left.
const NEIGHBOURS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

// Runs the algorithm once and records every event:
//   { type: 'water', r, c }           a scan step: water, skipped
//   { type: 'seen',  r, c, island }   a scan step: land already in an island, skipped
//   { type: 'new',   r, c, island }   a scan step: unseen land, so a new island starts here
//   { type: 'visit', r, c, island }   the flood fill reached this cell
// Every cell gets exactly one scan step (water, seen or new), in row order, left to
// right. Every land cell is reached exactly once, as 'new' or as 'visit'.
export function buildSteps(grid) {
  const steps = []
  const island = grid.map((row) => row.map(() => 0)) // 0 = not in an island yet
  let count = 0

  // Recursive depth-first flood fill. It stops at the edges, at water and at
  // cells that already belong to an island.
  const fill = (r, c) => {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[r].length) return
    if (grid[r][c] !== 1 || island[r][c] !== 0) return
    island[r][c] = count
    steps.push({ type: 'visit', r, c, island: count })
    NEIGHBOURS.forEach(([dr, dc]) => fill(r + dr, c + dc))
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== 1) {
        steps.push({ type: 'water', r, c })
      } else if (island[r][c] !== 0) {
        steps.push({ type: 'seen', r, c, island: island[r][c] })
      } else {
        count++
        island[r][c] = count
        steps.push({ type: 'new', r, c, island: count })
        NEIGHBOURS.forEach(([dr, dc]) => fill(r + dr, c + dc))
      }
    }
  }
  return steps
}

const plural = (n) => `${n} ${n === 1 ? 'island' : 'islands'}`

// The one-line message for a step. The last step also says how many islands there were.
export function describe(step, { last = false, total = 0 } = {}) {
  const at = `(${step.r},${step.c})`
  let text
  if (step.type === 'water') text = `Scan ${at}: water, skip.`
  else if (step.type === 'seen') text = `Scan ${at}: land, but already part of island #${step.island}, skip.`
  else if (step.type === 'new') text = `Scan ${at}: unseen land! New island #${step.island}. Start flood fill.`
  else text = `Fill spreads to neighbor ${at}, joins island #${step.island}.`
  return last ? `${text} Done: ${plural(total)}.` : text
}

export const START_MESSAGE = 'Press Next step (or Play) to start scanning the grid, row by row, left to right.'

// What the picture looks like after steps[0..index] have happened (index -1 means
// none yet). Nothing is stored between calls: the picture is always worked out from
// the steps.
//   cells: for every cell, { land, island } where island is the number of the island
//          it has been put in (0 if it has not been reached yet)
//   current: [r, c] of the cell the latest step is about, or null
//   count: how many islands have been found so far
//   message: the one-line message for the latest step
export function replay(grid, steps, index) {
  const cells = grid.map((row) => row.map((value) => ({ land: value === 1, island: 0 })))
  let count = 0
  const upTo = Math.min(index, steps.length - 1)
  for (let i = 0; i <= upTo; i++) {
    const step = steps[i]
    if (step.type === 'new' || step.type === 'visit') cells[step.r][step.c].island = step.island
    if (step.type === 'new') count++
  }
  const step = upTo >= 0 ? steps[upTo] : null
  return {
    cells,
    current: step ? [step.r, step.c] : null,
    count,
    message: step ? describe(step, { last: upTo === steps.length - 1, total: count }) : steps.length === 0 ? 'Nothing to scan: the grid is empty. Done: 0 islands.' : START_MESSAGE,
  }
}
