import CodeTracer from '../../components/CodeTracer.jsx'
import { FOLLOWS, MUTUAL, TASKS } from './graphData.js'

const code = [
  'def build(nodes, edges):',
  '    adj_list = {node: [] for node in nodes}',
  '    matrix = [[0] * len(nodes) for _ in nodes]',
  '    for u, v in edges:',
  '        adj_list[u].append(v)',
  '        matrix[u][v] = 1',
  '    return adj_list, matrix',
]

const presets = [
  { label: 'Who follows who', graph: FOLLOWS },
  { label: 'Task order', graph: TASKS },
  { label: 'Friends (both ways)', graph: MUTUAL },
]

const copyList = (adj) => Object.fromEntries(Object.entries(adj).map(([node, list]) => [node, [...list]]))
const copyMatrix = (matrix) => matrix.map((row) => [...row])

// Adds the edges of a graph one at a time, recording a snapshot for every line.
// Each edge is written twice: into the adjacency list and into the matrix.
function buildGraphSteps(_values, preset) {
  const { graph } = preset
  const index = Object.fromEntries(graph.nodes.map((node, i) => [node.id, i]))
  const steps = []
  let adj = null
  let matrix = null
  let shown = 0
  let active = null

  const push = (line, note, vars = {}, hot = {}) => {
    steps.push({
      line,
      array: [],
      compare: null,
      graph,
      shown,
      active,
      adj: adj && copyList(adj),
      matrix: matrix && copyMatrix(matrix),
      hot,
      vars,
      note,
    })
  }

  push(0, `Write down a graph of ${graph.nodes.length} nodes and ${graph.edges.length} edges in two ways at once: a list and a grid. Nothing is drawn yet.`)

  adj = Object.fromEntries(graph.nodes.map((node) => [node.id, []]))
  push(1, 'The adjacency list starts with an empty list for every node: so far, nobody points at anybody.')

  matrix = graph.nodes.map(() => graph.nodes.map(() => 0))
  push(2, `The adjacency matrix starts as a ${graph.nodes.length} by ${graph.nodes.length} grid of zeros. Row means "from", column means "to".`)

  graph.edges.forEach(({ from: u, to: v }, i) => {
    shown = i + 1
    active = i
    push(3, `Next edge: ${u} → ${v}. It appears in the drawing, and now we have to record it.`, { u, v })

    adj[u].push(v)
    push(4, `List: add ${v} to ${u}’s list. It reads “from ${u} you can go to ${v}”.`, { u, v }, { chip: [u, adj[u].length - 1] })

    matrix[index[u]][index[v]] = 1
    const oneWay = !graph.edges.some((edge) => edge.from === v && edge.to === u)
    push(5, `Matrix: put a 1 in row ${u}, column ${v}.${oneWay ? ` Row ${v}, column ${u} stays 0, because the edge only goes one way.` : ` ${v} also points back at ${u}, so that edge gets its own 1.`}`, { u, v }, { cell: [index[u], index[v]] })
  })

  active = null
  push(6, `Done. Both are the same graph: the list holds ${graph.edges.length} entries, the grid holds ${graph.nodes.length * graph.nodes.length} cells, and only ${graph.edges.length} of those cells are 1.`)
  return steps
}

function DirectedGraphTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildGraphSteps} view="graph" />
}

export default DirectedGraphTracer
