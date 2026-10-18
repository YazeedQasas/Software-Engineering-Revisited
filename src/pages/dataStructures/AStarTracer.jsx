import CodeTracer from '../../components/CodeTracer.jsx'
import {
  DIRECTIONS,
  MAIN_MAP,
  TRAP_MAP,
  byF,
  cellKey,
  gridRun,
  isOpen,
  isWall,
  manhattan,
  sameCell,
} from './gridAStar.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREY = '#d9d9d7'
const GREEN = '#86d69f'
const TEAL = '#9fd8e6'
const PURPLE = '#d2b4ee'
const DARK = '#6b6c70'

const presets = [
  { label: 'A* with a good guess', map: MAIN_MAP, scale: 1, intro: 'The guess h is the Manhattan distance: tiles across plus tiles up.' },
  { label: 'A guess that is too big', map: TRAP_MAP, scale: 4, intro: 'Here h is 4 times the real Manhattan distance: far too big.' },
]

const code = [
  'def a_star(grid, start, goal):',
  '    g = {start: 0}',
  '    previous = {}',
  '    visited = set()',
  '    heap = [(h(start, goal), start)]',
  '    while heap:',
  '        f, cell = heappop(heap)',
  '        if cell == goal:',
  '            return g[cell], previous',
  '        if cell in visited:',
  '            continue',
  '        visited.add(cell)',
  '        for dr, dc in ((-1, 0), (0, 1), (1, 0), (0, -1)):',
  '            nxt = (cell[0] + dr, cell[1] + dc)',
  '            if not open_cell(grid, nxt):',
  '                continue',
  '            new_g = g[cell] + 1',
  '            if new_g < g.get(nxt, inf):',
  '                g[nxt] = new_g',
  '                previous[nxt] = cell',
  '                heappush(heap, (new_g + h(nxt, goal), nxt))',
  '    return None',
]

const legend = [
  { color: BLUE, text: 'the tile being expanded' },
  { color: YELLOW, text: 'in the heap, waiting' },
  { color: GREY, text: 'visited' },
  { color: GREEN, text: 'the route found' },
  { color: TEAL, text: 'start' },
  { color: PURPLE, text: 'goal' },
  { color: DARK, text: 'wall' },
]

const at = ([r, c]) => `(${r}, ${c})`

function buildSteps(_values, preset) {
  const { map, scale } = preset
  const { goal, start } = map
  const guess = (cell) => scale * manhattan(cell, goal)
  const best = gridRun(map, 0).cost
  const steps = []
  const g = {}
  const previous = {}
  const visited = []
  const heap = []
  const state = { current: null, looking: null, route: null }

  const push = (line, note, vars = {}) => {
    const labels = {}
    Object.keys(g).forEach((key) => {
      const [r, c] = key.split(',').map(Number)
      labels[key] = String(g[key] + guess([r, c]))
    })
    const sorted = heap.slice().sort(byF)
    steps.push({
      line,
      array: [],
      compare: null,
      map,
      closed: visited.slice(),
      open: heap.map(([, cell]) => cell),
      current: state.current,
      looking: state.looking,
      route: state.route,
      labels,
      previous: { ...previous },
      legend,
      strips: [
        { name: 'Heap', items: sorted.map(([f, cell]) => `(${f}, ${at(cell)})`), next: 0, wide: true, hint: 'Entries are (f, tile). The smallest f comes out first. The number on a tile is its f.' },
        { name: 'Visited', items: visited.map(at), kind: 'seen', wide: true },
      ],
      vars,
      note,
    })
  }

  push(0, `Find the cheapest route from the teal tile to the purple tile, moving up, down, left or right. ${preset.intro}`)

  g[cellKey(start)] = 0
  push(1, 'g will hold the cost so far to each tile. We have only reached the start, at cost 0.')

  push(2, 'previous will remember which tile each tile was reached from. It is empty for now.')
  push(3, 'visited will hold the tiles we have already expanded. It is empty for now.')

  heap.push([guess(start), start])
  push(4, `Put the start on the heap with f = g + h = 0 + ${guess(start)} = ${guess(start)}.`)

  while (heap.length > 0) {
    heap.sort(byF)
    const [f, cell] = heap.shift()
    const isGoal = sameCell(cell, goal)
    const stale = visited.some((done) => sameCell(done, cell))
    state.current = stale ? null : cell
    state.looking = null
    push(6, `Take the entry with the smallest f off the heap: (${f}, ${at(cell)}).`, { f, cell: at(cell) })

    if (isGoal) {
      const route = [cell]
      while (!sameCell(route[0], start)) route.unshift(previous[cellKey(route[0])])
      state.route = route
      state.current = null
      const worse = best !== null && g[cellKey(cell)] > best
      push(7, `It is the goal! A* returns here, with cost ${g[cellKey(cell)]}.`, { f, cell: at(cell) })
      push(8, `The route is the green tiles, found by following previous back from the goal. It has ${g[cellKey(cell)]} steps.${worse ? ` But the cheapest route has only ${best}. The over-big guess hid it, and A* never looked.` : ''}`, { f, cell: at(cell) })
      return steps
    }

    if (stale) {
      push(9, `Is ${at(cell)} already visited? Yes.`, { f, cell: at(cell) })
      push(10, 'Skip it: this entry is out of date. Back to the top of the loop.', { f, cell: at(cell) })
      continue
    }

    visited.push(cell)
    push(11, `${at(cell)} is not the goal and not visited yet, so mark it visited. We are expanding it now.`, { f, cell: at(cell) })

    const blocked = DIRECTIONS.filter(({ step: [dr, dc] }) => !isOpen(map, [cell[0] + dr, cell[1] + dc]))
    if (blocked.length > 0) {
      push(14, `Some neighbours cannot be walked on, so the code skips them: ${blocked.map(({ name, step: [dr, dc] }) => {
        const tile = [cell[0] + dr, cell[1] + dc]
        return `${name} is ${isWall(map, tile) ? 'a wall' : 'off the map'}`
      }).join(', ')}.`, { cell: at(cell) })
    }

    DIRECTIONS.forEach(({ name, step: [dr, dc] }) => {
      const nxt = [cell[0] + dr, cell[1] + dc]
      if (!isOpen(map, nxt)) return
      const vars = { cell: at(cell), nxt: at(nxt) }
      state.looking = nxt
      const newG = g[cellKey(cell)] + 1
      const known = g[cellKey(nxt)]
      const better = known === undefined || newG < known
      push(17, `${name[0].toUpperCase()}${name.slice(1)}: ${at(nxt)}. Going there costs new_g = ${g[cellKey(cell)]} + 1 = ${newG}. Is that less than its cost so far (${known === undefined ? '∞' : known})? ${better ? 'Yes, it is new or cheaper.' : 'No, keep what we have.'}`, { ...vars, new_g: newG })
      if (better) {
        g[cellKey(nxt)] = newG
        previous[cellKey(nxt)] = cell
        push(18, `Update the tile's cost to ${newG}, and remember it was reached from ${at(cell)} (previous).`, { ...vars, new_g: newG })
        heap.push([newG + guess(nxt), nxt])
        push(20, `Put it on the heap with f = g + h = ${newG} + ${guess(nxt)} = ${newG + guess(nxt)}.`, { ...vars, new_g: newG })
      }
      state.looking = null
    })
  }

  state.current = null
  push(21, 'The heap is empty and the goal was never reached: there is no route.')
  return steps
}

function AStarTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildSteps} view="isogrid" />
}

export default AStarTracer
