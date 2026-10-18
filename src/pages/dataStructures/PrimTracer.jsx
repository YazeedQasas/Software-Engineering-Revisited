import CodeTracer from '../../components/CodeTracer.jsx'
import { edgeKey } from '../../components/GraphView.jsx'
import { ISLANDS, PRIM_GRAPH, crossingEdges, edgeBetween, weightedList } from './graphData.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const GOLD = '#d9a400'
const RED = '#c44a4a'

const presets = [
  { label: 'Start at A', graph: PRIM_GRAPH, start: 'A' },
  { label: 'Start at D (the same tree)', graph: PRIM_GRAPH, start: 'D' },
  { label: 'Two separate groups', graph: ISLANDS, start: 'A' },
]

const code = [
  'def prim(graph, start):',
  '    in_tree = {start}',
  '    tree = []',
  '    heap = [(w, start, v) for v, w in graph[start]]',
  '    heapify(heap)',
  '    while heap:',
  '        w, u, v = heappop(heap)',
  '        if v in in_tree:',
  '            continue',
  '        in_tree.add(v)',
  '        tree.append((u, v, w))',
  '        for nxt, nw in graph[v]:',
  '            if nxt not in in_tree:',
  '                heappush(heap, (nw, v, nxt))',
  '    return tree',
]

const legend = [
  { color: GREEN, text: 'in the tree' },
  { color: YELLOW, text: 'one edge away from the tree' },
  { color: BLUE, text: 'the node being added' },
  { color: GOLD, text: 'a gold edge leaves the tree: a candidate' },
  { color: RED, text: 'a red edge would close a loop' },
]

const byEntry = (a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1) || (a[2] < b[2] ? -1 : 1)
const cable = ({ from, to, weight }) => `${from}–${to} (${weight})`

function buildSteps(_values, preset) {
  const { graph, start } = preset
  const adj = weightedList(graph)
  const steps = []
  const inTree = []
  const treeEdges = []
  const heap = []
  const state = { popped: null, adding: null, looking: null, skipping: false }

  const push = (line, note, vars = {}) => {
    const nodeStates = {}
    const edgeStates = {}
    const candidates = crossingEdges(graph, inTree)
    candidates.forEach((edge) => {
      edgeStates[edgeKey(edge)] = 'candidate'
      nodeStates[inTree.includes(edge.from) ? edge.to : edge.from] = 'queued'
    })
    inTree.forEach((id) => {
      nodeStates[id] = 'found'
    })
    treeEdges.forEach((edge) => {
      edgeStates[edgeKey(edge)] = 'found'
    })
    if (state.popped) {
      const edge = edgeBetween(graph, state.popped[0], state.popped[1])
      edgeStates[edgeKey(edge)] = state.skipping ? 'bad' : 'active'
    }
    if (state.looking) nodeStates[state.looking] = 'pending'
    if (state.adding) nodeStates[state.adding] = 'active'

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
      legend,
      strips: [
        { name: 'Heap', items: heap.slice().sort(byEntry).map(([w, u, v]) => `(${w}, ${u}, ${v})`), next: 0, wide: true, hint: 'Entries are (weight, from, to). The cheapest comes out first.' },
        { name: 'In tree', items: inTree.slice(), kind: 'out' },
        { name: 'Edges chosen', items: treeEdges.map(cable), kind: 'seen', wide: true },
      ],
      vars: { ...vars, total: treeEdges.reduce((sum, e) => sum + e.weight, 0) },
      note,
    })
  }

  push(0, `Join every node with the cheapest set of edges: grow a tree outwards from ${start}, one edge at a time. The numbers on the edges are their costs.`)

  inTree.push(start)
  push(1, `in_tree holds the nodes already joined up. We start with just ${start}.`, { start })

  push(2, 'tree will hold the edges we choose. It is empty for now.')

  adj[start].forEach(([to, weight]) => heap.push([weight, start, to]))
  push(3, `Put every edge out of ${start} on the heap as (weight, from, to). They are the gold edges.`, { start })

  heap.sort(byEntry)
  push(4, 'heapify arranges the list as a heap, so the cheapest edge is always first.')

  while (heap.length > 0) {
    heap.sort(byEntry)
    const [w, u, v] = heap.shift()
    state.popped = [u, v]
    state.skipping = inTree.includes(v)
    push(6, `Take the cheapest edge off the heap: ${u}–${v}, cost ${w}.`, { w, u, v })

    if (state.skipping) {
      push(7, `Is ${v} already in the tree? Yes. Adding ${u}–${v} would close a loop (or this entry is out of date), so we do not want it.`, { w, u, v })
      push(8, 'Skip it. Back to the top of the loop.', { w, u, v })
      state.popped = null
      state.skipping = false
      continue
    }

    inTree.push(v)
    state.adding = v
    push(9, `${v} is new, so it joins the tree.`, { w, u, v })

    treeEdges.push({ from: u, to: v, weight: w })
    push(10, `Keep the edge ${u}–${v}. It turns green. The tree has cost ${treeEdges.reduce((sum, e) => sum + e.weight, 0)} so far.`, { w, u, v })
    state.popped = null
    state.adding = null

    adj[v].forEach(([nxt, nw]) => {
      state.looking = nxt
      if (inTree.includes(nxt)) {
        push(12, `Look at ${nxt} (cost ${nw}): it is already in the tree, so that edge is no use. Skip it.`, { v, nxt, nw })
      } else {
        heap.push([nw, v, nxt])
        push(13, `${nxt} is not in the tree yet. Put the edge ${v}–${nxt} (cost ${nw}) on the heap as a new candidate.`, { v, nxt, nw })
      }
      state.looking = null
    })
  }

  const total = treeEdges.reduce((sum, e) => sum + e.weight, 0)
  push(14, inTree.length === graph.nodes.length
    ? `The heap is empty. All ${inTree.length} nodes are joined by ${treeEdges.length} edges, with a total cost of ${total}. No other way of joining them costs less.`
    : `The heap is empty. Only ${inTree.length} of the ${graph.nodes.length} nodes were reached (total cost ${total}): the others are in a separate piece that no edge connects to ${start}.`)
  return steps
}

function PrimTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildSteps} view="graph" />
}

export default PrimTracer
