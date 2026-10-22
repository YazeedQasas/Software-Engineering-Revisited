import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_GRID, buildSteps, describe, replay } from './islandSteps.js'

const SCAN = ['water', 'seen', 'new']
const REACHED = ['new', 'visit']
const islandsIn = (grid) => buildSteps(grid).filter((s) => s.type === 'new').length
const key = (s) => `${s.r},${s.c}`

// How many times each cell appears among the steps whose type is in `types`.
function countByCell(steps, types) {
  const counts = {}
  steps.filter((s) => types.includes(s.type)).forEach((s) => {
    counts[key(s)] = (counts[key(s)] ?? 0) + 1
  })
  return counts
}

test('the default grid has 4 islands', () => {
  assert.equal(islandsIn(DEFAULT_GRID), 4)
  const steps = buildSteps(DEFAULT_GRID)
  assert.deepEqual(steps.filter((s) => s.type === 'new').map((s) => [s.r, s.c, s.island]), [[0, 0, 1], [0, 4, 2], [2, 2, 3], [3, 4, 4]])
})

test('every land cell appears exactly once as "new" or "visit", and water never does', () => {
  const steps = buildSteps(DEFAULT_GRID)
  const reached = countByCell(steps, REACHED)
  DEFAULT_GRID.forEach((row, r) =>
    row.forEach((value, c) => {
      assert.equal(reached[`${r},${c}`] ?? 0, value === 1 ? 1 : 0, `cell (${r},${c})`)
    }),
  )
})

test('every cell appears exactly once as a scan step ("water", "seen" or "new")', () => {
  const steps = buildSteps(DEFAULT_GRID)
  const scanned = countByCell(steps, SCAN)
  DEFAULT_GRID.forEach((row, r) => row.forEach((_, c) => assert.equal(scanned[`${r},${c}`], 1, `cell (${r},${c})`)))
})

test('the scan goes row by row, left to right', () => {
  const scan = buildSteps(DEFAULT_GRID).filter((s) => SCAN.includes(s.type)).map(key)
  const expected = DEFAULT_GRID.flatMap((row, r) => row.map((_, c) => `${r},${c}`))
  assert.deepEqual(scan, expected)
})

test('the flood fill tries down, up, right, then left', () => {
  // On a 2 x 2 block of land, from (0,0): down to (1,0); from there up is seen, right is
  // (1,1); from there up is (0,1).
  const visits = buildSteps([[1, 1], [1, 1]]).filter((s) => s.type === 'visit').map(key)
  assert.deepEqual(visits, ['1,0', '1,1', '0,1'])
})

test('a visited cell is later scanned as "seen", with the island that reached it', () => {
  const steps = buildSteps(DEFAULT_GRID)
  const seen = steps.find((s) => s.type === 'seen' && s.r === 1 && s.c === 4)
  assert.deepEqual(seen, { type: 'seen', r: 1, c: 4, island: 2 })
})

test('an empty grid has no steps and no islands', () => {
  assert.deepEqual(buildSteps([]), [])
  assert.deepEqual(buildSteps([[]]), [])
  assert.equal(islandsIn([]), 0)
})

test('a grid of only water has 0 islands', () => {
  const grid = [[0, 0, 0], [0, 0, 0]]
  const steps = buildSteps(grid)
  assert.equal(islandsIn(grid), 0)
  assert.equal(steps.length, 6)
  assert.ok(steps.every((s) => s.type === 'water'))
})

test('a grid of only land is 1 island', () => {
  const grid = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
  const steps = buildSteps(grid)
  assert.equal(islandsIn(grid), 1)
  assert.equal(steps.filter((s) => s.type === 'visit').length, 8)
  assert.ok(steps.every((s) => s.island === undefined || s.island === 1))
})

test('cells that only touch diagonally are separate islands', () => {
  assert.equal(islandsIn([[1, 0], [0, 1]]), 2)
  assert.equal(islandsIn([[0, 1], [1, 0]]), 2)
  assert.equal(islandsIn([[1, 0, 0], [0, 1, 0], [0, 0, 1]]), 3)
})

test('a single cell, and a single row, work', () => {
  assert.equal(islandsIn([[1]]), 1)
  assert.equal(islandsIn([[0]]), 0)
  assert.equal(islandsIn([[1, 0, 1, 1, 0, 1]]), 3)
})

test('a grid whose rows have different lengths does not crash', () => {
  assert.equal(islandsIn([[1, 1, 1], [1], [1, 0, 1, 1]]), 2)
})

test('buildSteps does not change the grid it is given', () => {
  const copy = DEFAULT_GRID.map((row) => row.slice())
  buildSteps(DEFAULT_GRID)
  assert.deepEqual(DEFAULT_GRID, copy)
})

test('replay: nothing has happened before the first step', () => {
  const steps = buildSteps(DEFAULT_GRID)
  const state = replay(DEFAULT_GRID, steps, -1)
  assert.equal(state.count, 0)
  assert.equal(state.current, null)
  assert.ok(state.cells.flat().every((cell) => cell.island === 0))
})

test('replay: the counter, colours and current cell come from the steps so far', () => {
  const steps = buildSteps(DEFAULT_GRID)
  const index = steps.findIndex((s) => s.type === 'new' && s.island === 3)
  const state = replay(DEFAULT_GRID, steps, index)
  assert.equal(state.count, 3)
  assert.deepEqual(state.current, [2, 2])
  assert.equal(state.cells[2][2].island, 3)
  assert.equal(state.cells[3][2].island, 0) // not reached yet
  assert.equal(state.message, 'Scan (2,2): unseen land! New island #3. Start flood fill.')
})

test('replay: the last step says how many islands there were', () => {
  const steps = buildSteps(DEFAULT_GRID)
  const state = replay(DEFAULT_GRID, steps, steps.length - 1)
  assert.equal(state.count, 4)
  assert.ok(state.message.endsWith('Done: 4 islands.'))
  assert.ok(replay([[1]], buildSteps([[1]]), 0).message.endsWith('Done: 1 island.'))
  assert.equal(replay([], [], -1).message, 'Nothing to scan: the grid is empty. Done: 0 islands.')
})

test('the messages match the wording in the spec', () => {
  assert.equal(describe({ type: 'water', r: 1, c: 2 }), 'Scan (1,2): water, skip.')
  assert.equal(describe({ type: 'seen', r: 1, c: 4, island: 2 }), 'Scan (1,4): land, but already part of island #2, skip.')
  assert.equal(describe({ type: 'visit', r: 3, c: 2, island: 3 }), 'Fill spreads to neighbor (3,2), joins island #3.')
})
