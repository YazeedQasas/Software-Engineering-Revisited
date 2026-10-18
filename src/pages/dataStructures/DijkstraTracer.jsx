import CodeTracer from '../../components/CodeTracer.jsx'
import { edgeKey } from '../../components/GraphView.jsx'
import { ROUTES, ISLANDS, edgeBetween, weightedList } from './graphData.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const INK = '#1f2023'

const presets = [
  { label: 'Start at A', graph: ROUTES, start: 'A' },
  { label: 'Start at D (the middle)', graph: ROUTES, start: 'D' },
  { label: 'Two separate groups', graph: ISLANDS, start: 'A' },
]

const code = [
  'def dijkstra(graph, start):',
  '    dist = {node: inf for node in graph}',
  '    dist[start] = 0',
  '    previous = {}',
  '    visited = set()',
  '    heap = [(0, start)]',
  '    while heap:',
  '        d, node = heappop(heap)',
  '        if node in visited:',
  '            continue',
  '        visited.add(node)',
  '        for neighbour, weight in graph[node]:',
  '            new_d = d + weight',
  '            if new_d < dist[neighbour]:',
  '                dist[neighbour] = new_d',
  '                previous[neighbour] = node',
  '                heappush(heap, (new_d, neighbour))',
  '    return dist, previous',
]

const legend = [
  { color: BLUE, text: 'the node being finished' },
  { color: YELLOW, text: 'reached, distance not final' },
  { color: GREEN, text: 'finished: distance locked in' },
  { color: INK, text: 'the number on a node: its best distance so far' },
]

const show = (d) => (d === Infinity ? '∞' : String(d))

function buildSteps(_values, preset) {
  const { graph, start } = preset
  const adj = weightedList(graph)
  const steps = []
  const dist = {}
  const previous = {}
  const visited = []
  const heap = []
  const state = { current: null, looking: null }

  const push = (line, note, vars = {}) => {
    const nodeStates = {}
    const marks = {}
    graph.nodes.forEach(({ id }) => {
      if (dist[id] === undefined || dist[id] === Infinity) return
      marks[id] = String(dist[id])
      nodeStates[id] = visited.includes(id) ? 'found' : 'queued'
    })
    if (state.looking) nodeStates[state.looking] = 'pending'
    if (state.current) nodeStates[state.current] = 'active'

    const edgeStates = {}
    Object.entries(previous).forEach(([to, from]) => {
      edgeStates[edgeKey(edgeBetween(graph, from, to))] = 'found'
    })
    if (state.current && state.looking) {
      edgeStates[edgeKey(edgeBetween(graph, state.current, state.looking))] = 'active'
    }

    const sorted = heap.slice().sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1))
    steps.push({
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
      strips: [
        { name: 'Heap', items: sorted.map(([d, id]) => `(${d}, ${id})`), next: 0, wide: true, hint: 'Entries are (distance, node). The smallest distance comes out first.' },
        { name: 'Distance', items: graph.nodes.filter(({ id }) => dist[id] !== undefined).map(({ id }) => `${id} = ${show(dist[id])}`), kind: 'seen', wide: true, hint: 'Best distance found so far. ∞ means no way found yet.' },
        { name: 'Visited', items: visited.slice(), kind: 'out' },
      ],
      vars,
      note,
    })
  }

  push(0, `Find the cheapest route from ${start} to every other node. The numbers on the roads are what each one costs.`)

  graph.nodes.forEach(({ id }) => {
    dist[id] = Infinity
  })
  push(1, 'Give every node a distance of ∞. We have not found a way to reach any of them yet.')

  dist[start] = 0
  push(2, `${start} costs 0 to reach, because we are already there.`, { start })

  push(3, 'previous will remember, for each node, which node we came from. It is empty for now.')
  push(4, 'visited will hold the nodes whose distance is final. It is empty for now.')

  heap.push([0, start])
  push(5, `Put (0, ${start}) on the heap. The heap always hands back the entry with the smallest distance first.`, { start })

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1))
    const [d, node] = heap.shift()
    const stale = visited.includes(node)
    state.current = stale ? null : node
    state.looking = null
    push(7, `Take the smallest entry off the heap: (${d}, ${node}).`, { d, node })

    push(8, `Is ${node} already in visited? ${stale ? 'Yes.' : 'No, so this is the first time we have it.'}`, { d, node })
    if (stale) {
      push(9, `Skip it. This entry is out of date: ${node} was finished earlier by a cheaper entry. Back to the top of the loop.`, { d, node })
      continue
    }

    visited.push(node)
    push(10, `${node} is finished. Its distance ${d} is now final, because no unfinished node is closer.`, { d, node })

    adj[node].forEach(([neighbour, weight]) => {
      state.looking = neighbour
      const newD = d + weight
      const vars = { d, node, neighbour, weight, new_d: newD }
      push(12, `Look at the road from ${node} to ${neighbour} (cost ${weight}). Going to ${neighbour} through ${node} would cost ${d} + ${weight} = ${newD}.`, vars)

      const better = newD < dist[neighbour]
      const before = show(dist[neighbour])
      push(13, `Is ${newD} less than ${neighbour}'s best so far (${before})? ${better ? 'Yes, this way is cheaper.' : 'No, so keep what we have.'}`, vars)
      if (better) {
        dist[neighbour] = newD
        push(14, `Update ${neighbour}'s distance to ${newD}.`, vars)
        previous[neighbour] = node
        push(15, `Remember that ${neighbour} was reached from ${node}. The road between them turns green${before === '∞' ? '' : ', and the old way in goes back to grey'}.`, vars)
        heap.push([newD, neighbour])
        push(16, `Put (${newD}, ${neighbour}) on the heap, so ${neighbour} gets its turn.`, vars)
      }
    })
    state.looking = null
  }

  state.current = null
  const finished = visited.length
  push(17, finished === graph.nodes.length
    ? `The heap is empty. Every node is finished. Follow the green roads back from any node to reach ${start} the cheapest way.`
    : `The heap is empty. ${finished} of the ${graph.nodes.length} nodes were reached. The rest still say ∞: no road leads to them from ${start}.`)
  return steps
}

function DijkstraTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildSteps} view="graph" />
}

export default DijkstraTracer
