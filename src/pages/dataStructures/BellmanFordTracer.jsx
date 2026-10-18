import CodeTracer from '../../components/CodeTracer.jsx'
import { edgeKey } from '../../components/GraphView.jsx'
import { BELLMAN, BELLMAN_LUCKY, NEG_CYCLE } from './graphData.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const RED = '#f2a5a5'
const INK = '#1f2023'

const presets = [
  { label: 'Edges in an unlucky order', graph: BELLMAN, start: 'A' },
  { label: 'Edges in a lucky order', graph: BELLMAN_LUCKY, start: 'A' },
  { label: 'A negative cycle', graph: NEG_CYCLE, start: 'A' },
]

const code = [
  'def bellman_ford(nodes, edges, start):',
  '    dist = {node: inf for node in nodes}',
  '    dist[start] = 0',
  '    previous = {}',
  '    for _ in range(len(nodes) - 1):',
  '        for u, v, w in edges:',
  '            if dist[u] + w < dist[v]:',
  '                dist[v] = dist[u] + w',
  '                previous[v] = u',
  '    for u, v, w in edges:',
  '        if dist[u] + w < dist[v]:',
  '            return None  # negative cycle',
  '    return dist, previous',
]

const legend = [
  { color: BLUE, text: 'u: where the edge starts' },
  { color: '#fff3bf', text: 'v: where it points' },
  { color: YELLOW, text: 'has a distance, may still drop' },
  { color: GREEN, text: 'done: the final answer' },
  { color: RED, text: 'caught in a negative cycle' },
  { color: INK, text: 'the number on a node: its best distance so far' },
]

const show = (d) => (d === Infinity ? '∞' : String(d))
const label = (edge) => `${edge.from}→${edge.to} (${edge.weight})`

function buildSteps(_values, preset) {
  const { graph, start } = preset
  const { edges } = graph
  const passesToRun = graph.nodes.length - 1
  const steps = []
  const dist = {}
  const previous = {}
  const state = { edge: null, index: -1, outcome: null } // outcome: 'cycle' | 'done' | null

  const push = (line, note, vars = {}) => {
    const nodeStates = {}
    const marks = {}
    graph.nodes.forEach(({ id }) => {
      if (dist[id] === undefined || dist[id] === Infinity) return
      marks[id] = String(dist[id])
      nodeStates[id] = state.outcome === 'done' ? 'found' : 'queued'
    })
    const edgeStates = {}
    Object.entries(previous).forEach(([to, from]) => {
      edgeStates[edgeKey(edges.find((e) => e.from === from && e.to === to))] = 'found'
    })
    if (state.edge) {
      edgeStates[edgeKey(state.edge)] = state.outcome === 'cycle' ? 'bad' : 'active'
      nodeStates[state.edge.from] = state.outcome === 'cycle' ? 'bad' : 'active'
      nodeStates[state.edge.to] = state.outcome === 'cycle' ? 'bad' : 'pending'
    }
    steps.push({
      line,
      array: [],
      compare: null,
      graph,
      shown: edges.length,
      active: null,
      directed: true,
      nodeStates,
      edgeStates,
      marks,
      legend,
      strips: [
        { name: 'Edges', items: edges.map(label), next: state.index, wide: true, hint: 'Checked in this order, every pass.' },
        { name: 'Distance', items: graph.nodes.filter(({ id }) => dist[id] !== undefined).map(({ id }) => `${id} = ${show(dist[id])}`), kind: 'seen', wide: true, hint: 'Best distance found so far. ∞ means no way found yet.' },
      ],
      vars,
      note,
    })
  }

  push(0, `Find the cheapest cost from ${start} to every node. Some roads here have a negative cost, which Dijkstra could not handle.`)

  graph.nodes.forEach(({ id }) => {
    dist[id] = Infinity
  })
  push(1, 'Give every node a distance of ∞: no way found yet.')

  dist[start] = 0
  push(2, `${start} costs 0 to reach, because we are already there.`, { start })

  push(3, 'previous will remember where each node was reached from. It is empty for now.')

  for (let pass = 1; pass <= passesToRun; pass++) {
    state.edge = null
    state.index = -1
    push(4, `Pass ${pass} of ${passesToRun}: go through every edge once, in the order listed.`, { pass })

    edges.forEach((edge, index) => {
      state.edge = edge
      state.index = index
      const { from: u, to: v, weight: w } = edge
      const vars = { pass, u, v, w }
      if (dist[u] === Infinity) {
        push(6, `Edge ${label(edge)}: ${u} is still ∞, so there is nothing to add the cost to. Skip it.`, vars)
        return
      }
      const total = dist[u] + w
      const better = total < dist[v]
      push(6, `Edge ${label(edge)}: dist[${u}] + ${w} = ${dist[u]} + ${w} = ${total}. Is that less than ${v}'s ${show(dist[v])}? ${better ? 'Yes, this way is cheaper.' : 'No, keep what we have.'}`, vars)
      if (better) {
        const before = dist[v]
        dist[v] = total
        push(7, `Update ${v}'s distance to ${total}.`, vars)
        previous[v] = u
        push(8, `Remember that ${v} was reached from ${u}. The road turns green${before === Infinity ? '' : ', and the old way in goes back to grey'}.`, vars)
      }
    })
  }

  state.edge = null
  state.index = -1
  push(9, `${passesToRun} passes are done, which should be enough. One more pass, only to check: if anything can still improve, there is a negative cycle.`)

  for (let index = 0; index < edges.length; index++) {
    const edge = edges[index]
    state.edge = edge
    state.index = index
    const { from: u, to: v, weight: w } = edge
    const vars = { u, v, w }
    const total = dist[u] + w
    if (total < dist[v]) {
      state.outcome = 'cycle'
      push(10, `Edge ${label(edge)}: ${dist[u]} + ${w} = ${total}, which is less than ${v}'s ${show(dist[v])}. It should be impossible to improve after enough passes!`, vars)
      push(11, 'A negative cycle: going round it makes the cost smaller every lap, so there is no cheapest route. Return None.', vars)
      return steps
    }
    push(10, `Edge ${label(edge)}: ${show(total)} is not less than ${v}'s ${show(dist[v])}. Fine.`, vars)
  }

  state.edge = null
  state.index = -1
  state.outcome = 'done'
  push(12, 'No edge can improve anything, so there is no negative cycle. These distances are the cheapest costs. Follow the green roads back from any node to reach the start.')
  return steps
}

function BellmanFordTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildSteps} view="graph" />
}

export default BellmanFordTracer
