import { useState } from 'react'
import CodeTracer from '../../components/CodeTracer.jsx'
import { edgeKey } from '../../components/GraphView.jsx'
import { SEARCH, TWO_GROUPS, edgeBetween, undirectedList } from './graphData.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREY = '#e4e4e2'
const GREEN = '#86d69f'

const presets = [
  { label: 'Start at 0', graph: SEARCH, start: '0' },
  { label: 'Start at 5 (the middle)', graph: SEARCH, start: '5' },
  { label: 'Two separate groups', graph: TWO_GROUPS, start: '0' },
]

// The picture is the same for both searches: the node being visited is blue,
// nodes waiting are yellow, finished nodes are grey and numbered in the order
// they were visited, the neighbour being checked is dashed, and the edges that
// found a new node turn green (together they draw the search tree).
function makeSnapshot(graph, state, legend) {
  return (line, note, vars = {}) => {
    const nodeStates = {}
    const marks = {}
    state.order.forEach((id, i) => {
      nodeStates[id] = 'checked'
      marks[id] = String(i + 1)
    })
    state.waiting.forEach((id) => {
      nodeStates[id] = 'queued'
    })
    if (state.looking) nodeStates[state.looking] = 'pending'
    if (state.current) nodeStates[state.current] = 'active'

    const edgeStates = {}
    state.found.forEach((edge) => {
      edgeStates[edgeKey(edge)] = 'found'
    })
    if (state.current && state.looking) {
      const edge = edgeBetween(graph, state.current, state.looking)
      if (edge) edgeStates[edgeKey(edge)] = 'active'
    }

    return {
      line,
      array: [],
      compare: null,
      graph,
      shown: graph.edges.length,
      active: null,
      directed: false,
      nodeStates,
      edgeStates,
      marks,
      legend,
      strips: state.strips(),
      vars,
      note,
    }
  }
}

// ---------------------------------------------------------------- BFS

const bfsCode = [
  'def bfs(graph, start):',
  '    visited = {start}',
  '    queue = deque([start])',
  '    while queue:',
  '        node = queue.popleft()',
  '        print(node)',
  '        for neighbour in graph[node]:',
  '            if neighbour not in visited:',
  '                visited.add(neighbour)',
  '                queue.append(neighbour)',
]

const bfsLegend = [
  { color: BLUE, text: 'the node being visited' },
  { color: YELLOW, text: 'waiting in the queue' },
  { color: GREY, text: 'visited (numbered in order)' },
  { color: GREEN, text: 'an edge that found a new node' },
]

function buildBfsSteps(_values, preset) {
  const { graph, start } = preset
  const adj = undirectedList(graph)
  const steps = []
  const visited = []
  const queue = []
  const state = {
    order: [],
    waiting: queue,
    current: null,
    looking: null,
    found: [],
    strips: () => [
      { name: 'Queue', items: queue.slice(), next: 0, hint: 'The left end comes out next. New nodes join on the right.' },
      { name: 'Visited', items: visited.slice(), kind: 'seen' },
    ],
  }
  const snap = makeSnapshot(graph, state, bfsLegend)
  const push = (line, note, vars) => steps.push(snap(line, note, vars))

  push(0, `Search this graph from node ${start}, one ring at a time: everything 1 step away, then 2 steps away, and so on.`)

  visited.push(start)
  push(1, `Mark ${start} as visited straight away, so it can never be added again.`, { start })

  queue.push(start)
  push(2, `Put ${start} in the queue. The queue holds the nodes we have found but not yet visited.`, { start })

  while (queue.length > 0) {
    const node = queue.shift()
    state.current = node
    state.looking = null
    push(4, `Take ${node} from the front of the queue: the node that has been waiting longest.`, { node })

    state.order.push(node)
    push(5, `Visit ${node}. It is number ${state.order.length}.`, { node })

    adj[node].forEach((neighbour) => {
      state.looking = neighbour
      const seen = visited.includes(neighbour)
      push(7, `Look at neighbour ${neighbour}. Is it not visited yet? ${seen ? 'It is already marked, so skip it.' : 'Correct, it is new.'}`, { node, neighbour })
      if (!seen) {
        visited.push(neighbour)
        state.found.push(edgeBetween(graph, node, neighbour))
        push(8, `Mark ${neighbour} as visited now, the moment it is found. The edge that found it turns green.`, { node, neighbour })
        queue.push(neighbour)
        push(9, `Add ${neighbour} to the back of the queue, to be visited later.`, { node, neighbour })
      }
    })
    state.looking = null
  }

  state.current = null
  const reached = state.order.length
  push(3, reached === graph.nodes.length
    ? `The queue is empty. Every node has been visited, in ${reached} steps.`
    : `The queue is empty. Only ${reached} of the ${graph.nodes.length} nodes were reached: the others are in a different piece that no edge connects to ${start}.`)
  return steps
}

// ---------------------------------------------------------------- DFS

const dfsCode = [
  'def dfs(graph, node, visited):',
  '    visited.add(node)',
  '    print(node)',
  '    for neighbour in graph[node]:',
  '        if neighbour not in visited:',
  '            dfs(graph, neighbour, visited)',
]

const dfsLegend = [
  { color: BLUE, text: 'the node being visited' },
  { color: YELLOW, text: 'a call waiting for the one above it' },
  { color: GREY, text: 'visited (numbered in order)' },
  { color: GREEN, text: 'an edge that found a new node' },
]

function buildDfsSteps(_values, preset) {
  const { graph, start } = preset
  const adj = undirectedList(graph)
  const steps = []
  const visited = []
  const frames = []
  let back = ''
  const state = {
    order: [],
    waiting: frames,
    current: null,
    looking: null,
    found: [],
    strips: () => [
      { name: 'Call stack', items: frames.slice(), next: frames.length - 1, hint: 'The right end is the call running now. Each deeper call goes on the end.' },
      { name: 'Visited', items: visited.slice(), kind: 'seen' },
    ],
  }
  const snap = makeSnapshot(graph, state, dfsLegend)
  const push = (line, note, vars) => {
    steps.push(snap(line, back + note, vars))
    back = ''
  }

  const run = (node) => {
    frames.push(node)
    state.current = node
    state.looking = null
    visited.push(node)
    push(1, `Mark ${node} as visited.`, { node })

    state.order.push(node)
    push(2, `Visit ${node}. It is number ${state.order.length}.`, { node })

    adj[node].forEach((neighbour) => {
      state.current = node
      state.looking = neighbour
      const seen = visited.includes(neighbour)
      push(4, `Look at neighbour ${neighbour}. Is it not visited yet? ${seen ? 'It is already visited, so skip it.' : 'Correct, it is new.'}`, { node, neighbour })
      if (!seen) {
        state.found.push(edgeBetween(graph, node, neighbour))
        push(5, `Go deeper: call dfs on ${neighbour}. It goes on top of the call stack, and the edge turns green.`, { node, neighbour })
        run(neighbour)
        back = `Back in ${node}, with ${neighbour} and everything beyond it finished. `
      }
    })

    state.looking = null
    frames.pop()
    state.current = frames.length > 0 ? frames[frames.length - 1] : null
  }

  push(0, `Search from node ${start} by going as deep as possible down one path, then backing up to try the next. The call stack remembers the way back.`, { start })
  run(start)
  const reached = state.order.length
  push(0, reached === graph.nodes.length
    ? `The first call has returned. Every node has been visited, in ${reached} steps.`
    : `The first call has returned. Only ${reached} of the ${graph.nodes.length} nodes were reached: the others are in a different piece that no edge connects to ${start}.`)
  return steps
}

// ---------------------------------------------------------------- picker

const KINDS = {
  bfs: { label: 'Breadth-first (BFS)', code: bfsCode, build: buildBfsSteps },
  dfs: { label: 'Depth-first (DFS)', code: dfsCode, build: buildDfsSteps },
}

function GraphSearchTracer() {
  const [kind, setKind] = useState('bfs')
  const { code, build } = KINDS[kind]

  return (
    <>
      <div className="tracer-picker" role="group" aria-label="Search">
        <span className="tracer-label">Search:</span>
        {Object.entries(KINDS).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className={`tracer-chip${key === kind ? ' active' : ''}`}
            onClick={() => setKind(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <CodeTracer key={kind} code={code} presets={presets} buildSteps={build} view="graph" />
    </>
  )
}

export default GraphSearchTracer
