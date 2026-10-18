import CodeTracer from '../../components/CodeTracer.jsx'
import { KONIGSBERG, RING, SMALL_TOWN } from './graphData.js'

const code = [
  'def degrees(nodes, edges):',
  '    degree = {node: 0 for node in nodes}',
  '    for u, v in edges:',
  '        degree[u] += 1',
  '        degree[v] += 1',
  '    return degree',
  '',
  'def can_walk_every_edge_once(degree):',
  '    odd = [n for n in degree if degree[n] % 2 == 1]',
  '    return len(odd) in (0, 2)',
]

const presets = [
  { label: 'The seven bridges', graph: KONIGSBERG, what: 'bridges, and the nodes are pieces of land' },
  { label: 'A small town', graph: SMALL_TOWN, what: 'roads, and the nodes are junctions' },
  { label: 'A ring of five', graph: RING, what: 'roads, and the nodes are junctions' },
]

const BLUE = '#8aa8ea'
const RED = '#f2a5a5'

// Counts the edges at every node (its degree) and then applies Euler's rule.
// The whole graph is drawn from the start; the edge being counted is lit up.
function buildDegreeSteps(_values, preset) {
  const { graph, what } = preset
  const steps = []
  const degree = Object.fromEntries(graph.nodes.map((node) => [node.id, 0]))
  let started = false
  let active = null
  let nodeStates = {}
  let legend = [{ color: BLUE, text: 'the edge being counted: both its ends' }]

  const push = (line, note, vars = {}, hotNode = null) => {
    steps.push({
      line,
      array: [],
      compare: null,
      graph,
      shown: graph.edges.length,
      active,
      directed: false,
      nodeStates,
      legend,
      marks: started ? Object.fromEntries(graph.nodes.map((node) => [node.id, String(degree[node.id])])) : undefined,
      chips: started ? graph.nodes.map((node) => ({ label: node.id, value: degree[node.id], hot: node.id === hotNode })) : undefined,
      vars,
      note,
    })
  }

  push(0, `How many edges touch each node? That count is the node’s degree. Here the edges are ${what}.`)

  started = true
  push(1, 'Start every node at a degree of 0.')

  graph.edges.forEach(({ from: u, to: v }, i) => {
    active = i
    push(2, `Next edge: ${u} – ${v}. It touches both ${u} and ${v}.`, { u, v })
    degree[u] += 1
    push(3, `${u} has one more edge: its degree is now ${degree[u]}.`, { u, v }, u)
    degree[v] += 1
    push(4, `${v} has one more edge too: its degree is now ${degree[v]}.`, { u, v }, v)
  })

  active = null
  const total = Object.values(degree).reduce((sum, d) => sum + d, 0)
  push(5, `Every edge was counted at both of its ends, so the degrees add up to ${total}, which is 2 × ${graph.edges.length} edges. That is true for every graph.`, { total })

  push(7, 'Euler’s rule: you can walk over every edge exactly once only if at most two nodes have an odd degree. (The graph also has to be in one piece.)')

  const odd = graph.nodes.filter((node) => degree[node.id] % 2 === 1).map((node) => node.id)
  nodeStates = Object.fromEntries(odd.map((id) => [id, 'bad']))
  legend = [{ color: RED, text: 'odd degree' }]
  push(8, odd.length === 0 ? 'Odd degrees: none. Every node has an even number of edges.' : `Odd degrees: ${odd.join(', ')}.`, { odd: `[${odd.join(', ')}]` })

  const ok = odd.length === 0 || odd.length === 2
  const why = ok
    ? odd.length === 0
      ? `${odd.length} is allowed. Start anywhere, cross every edge once, and you finish where you began.`
      : `${odd.length} is allowed. Start at one odd node, cross every edge once, and finish at the other.`
    : `${odd.length} is not 0 or 2, so no such walk exists. This is exactly how Euler solved the bridges, without trying a single route.`
  push(9, `len(odd) is ${odd.length}. ${why}`, { result: ok })
  return steps
}

function GraphTheoryTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildDegreeSteps} view="graph" />
}

export default GraphTheoryTracer
