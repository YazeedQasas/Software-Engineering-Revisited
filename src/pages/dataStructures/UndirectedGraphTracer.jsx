import CodeTracer from '../../components/CodeTracer.jsx'
import { FRIENDS, ROADS, TWO_GROUPS } from './graphData.js'

const code = [
  'def build(nodes, edges):',
  '    adj_list = {node: [] for node in nodes}',
  '    matrix = [[0] * len(nodes) for _ in nodes]',
  '    for u, v in edges:',
  '        adj_list[u].append(v)',
  '        adj_list[v].append(u)',
  '        matrix[u][v] = 1',
  '        matrix[v][u] = 1',
  '    return adj_list, matrix',
]

const presets = [
  { label: 'Friends', graph: FRIENDS },
  { label: 'Roads between towns', graph: ROADS },
  { label: 'Two separate groups', graph: TWO_GROUPS },
]

const copyList = (adj) => Object.fromEntries(Object.entries(adj).map(([node, list]) => [node, [...list]]))
const copyMatrix = (matrix) => matrix.map((row) => [...row])

const legend = [{ color: '#8aa8ea', text: 'the two ends of the edge being added' }]

// Adds the edges of an undirected graph one at a time. Because an edge works
// both ways, each one is written down twice: at both ends in the list, and in
// two mirrored cells of the grid.
function buildUndirectedSteps(_values, preset) {
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
      directed: false,
      legend,
      adj: adj && copyList(adj),
      matrix: matrix && copyMatrix(matrix),
      hot,
      vars,
      note,
    })
  }

  push(0, `Write down a graph of ${graph.nodes.length} nodes and ${graph.edges.length} edges, as a list and as a grid. The edges have no direction, so each one has to be written down twice.`)

  adj = Object.fromEntries(graph.nodes.map((node) => [node.id, []]))
  push(1, 'The adjacency list starts with an empty list for every node.')

  matrix = graph.nodes.map(() => graph.nodes.map(() => 0))
  push(2, `The adjacency matrix starts as a ${graph.nodes.length} by ${graph.nodes.length} grid of zeros. The shaded diagonal is the mirror line: row = column.`)

  graph.edges.forEach(({ from: u, to: v }, i) => {
    shown = i + 1
    active = i
    push(3, `Next edge: ${u} – ${v}. It appears in the drawing as a plain line, with no arrowhead.`, { u, v })

    adj[u].push(v)
    push(4, `List: add ${v} to ${u}’s list. ${u} now knows about ${v}.`, { u, v }, { chips: [[u, adj[u].length - 1]] })

    adj[v].push(u)
    push(5, `List: add ${u} to ${v}’s list too. The edge works both ways, so ${v} has to know about ${u}.`, { u, v }, { chips: [[v, adj[v].length - 1]] })

    matrix[index[u]][index[v]] = 1
    push(6, `Matrix: put a 1 in row ${u}, column ${v}.`, { u, v }, { cells: [[index[u], index[v]]] })

    matrix[index[v]][index[u]] = 1
    push(7, `Matrix: and a 1 in row ${v}, column ${u}, the mirror cell on the other side of the diagonal.`, { u, v }, { cells: [[index[v], index[u]]] })
  })

  active = null
  const entries = graph.nodes.reduce((sum, node) => sum + adj[node.id].length, 0)
  push(8, `Done. The ${graph.edges.length} edges became ${entries} entries in the list and ${entries} 1s in the grid, which is twice as many. The grid is a mirror image of itself across the diagonal.`)
  return steps
}

function UndirectedGraphTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildUndirectedSteps} view="graph" />
}

export default UndirectedGraphTracer
