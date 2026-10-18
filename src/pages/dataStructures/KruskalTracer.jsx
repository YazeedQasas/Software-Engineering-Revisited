import CodeTracer from '../../components/CodeTracer.jsx'
import { edgeKey } from '../../components/GraphView.jsx'
import { ISLANDS, PRIM_GRAPH, kruskalRun } from './graphData.js'

const BLUE = '#8aa8ea'
const GREEN = '#86d69f'
const RED = '#c44a4a'
const GROUP_A = '#bcd2f7'
const GROUP_B = '#fbd0a5'

const presets = [
  { label: 'Seven towns', graph: PRIM_GRAPH },
  { label: 'Two separate groups', graph: ISLANDS },
]

const code = [
  'def find(parent, x):',
  '    while parent[x] != x:',
  '        parent[x] = parent[parent[x]]',
  '        x = parent[x]',
  '    return x',
  '',
  'def kruskal(nodes, edges):',
  '    parent = {node: node for node in nodes}',
  '    tree = []',
  '    for w, u, v in sorted(edges):',
  '        root_u = find(parent, u)',
  '        root_v = find(parent, v)',
  '        if root_u != root_v:',
  '            parent[root_u] = root_v',
  '            tree.append((u, v, w))',
  '            if len(tree) == len(nodes) - 1:',
  '                break',
  '    return tree',
]

const legend = [
  { color: GROUP_A, text: 'one group of joined nodes' },
  { color: GROUP_B, text: 'another group (white: still alone)' },
  { color: GREEN, text: 'a green edge is kept' },
  { color: BLUE, text: 'the edge being looked at' },
  { color: RED, text: 'red: both ends already in one group, so it would close a loop' },
]

const cable = ({ from, to, weight }) => `${from}–${to} (${weight})`
const groupText = (group) => `{${group.join(', ')}}`

function buildSteps(_values, preset) {
  const { graph } = preset
  const run = kruskalRun(graph)
  const steps = []
  const edgeIndex = (edge) => run.sorted.indexOf(edge)

  // What is on show: the groups and colours, the edges kept so far, the edges
  // already thrown away, and the edge being looked at.
  const push = (line, note, view, vars = {}) => {
    const { groups, colours, tree, rejected, current, outcome, marks } = view
    const nodeStates = {}
    Object.entries(colours).forEach(([id, tone]) => {
      nodeStates[id] = tone
    })
    const edgeStates = {}
    rejected.forEach((edge) => {
      edgeStates[edgeKey(edge)] = 'dim'
    })
    tree.forEach((edge) => {
      edgeStates[edgeKey(edge)] = 'found'
    })
    if (current) edgeStates[edgeKey(current)] = outcome === 'skip' ? 'bad' : 'active'

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
        { name: 'Sorted edges', items: run.sorted.map(cable), next: current ? edgeIndex(current) : -1, wide: true, hint: 'Cheapest first. The highlighted one is being looked at.' },
        { name: 'Groups', items: groups.map(groupText), kind: 'seen', wide: true, hint: 'Nodes that are not listed are still alone.' },
        { name: 'Edges kept', items: tree.map(cable), kind: 'out', wide: true },
      ],
      vars: { ...vars, kept: tree.length },
      note,
    })
  }

  const blank = { groups: [], colours: {}, tree: [], rejected: [], current: null, outcome: null, marks: {} }

  push(0, 'find follows parent pointers up from a node until it reaches the top of its group (the root). Two nodes are in the same group exactly when they have the same root.', blank)
  push(7, 'parent says who each node points to. At the start every node points to itself, so every node is alone in a group of its own.', blank)
  push(8, 'tree will hold the edges we keep. It is empty for now.', blank)

  let before = blank
  run.rounds.forEach((round, i) => {
    const { edge, rootU, rootV, kept } = round
    const { from: u, to: v, weight: w } = edge
    const base = { ...before, current: edge, outcome: null, marks: {} }
    const vars = { w, u, v }

    push(9, i === 0
      ? `sorted(edges) puts the cheapest edge first, and the loop takes them in that order. The first is ${cable(edge)}.`
      : `Next cheapest edge: ${cable(edge)}.`, base, vars)

    push(10, `find(parent, ${u}) follows pointers up from ${u} to the top of its group. root_u = ${rootU}.`, { ...base, marks: { [u]: rootU } }, { ...vars, root_u: rootU })
    push(11, `find(parent, ${v}) does the same for ${v}. root_v = ${rootV}.`, { ...base, marks: { [u]: rootU, [v]: rootV } }, { ...vars, root_u: rootU, root_v: rootV })

    const decided = { ...base, marks: { [u]: rootU, [v]: rootV } }
    const roots = { ...vars, root_u: rootU, root_v: rootV }
    if (!kept) {
      push(12, `Is ${rootU} different from ${rootV}? No: ${u} and ${v} are already in the same group, so ${cable(edge)} would close a loop. Skip it.`, { ...decided, outcome: 'skip' }, roots)
      before = { ...before, rejected: [...before.rejected, edge] }
      return
    }

    push(12, `Is ${rootU} different from ${rootV}? Yes: ${u} and ${v} are in different groups, so this edge joins them.`, decided, roots)
    const after = { groups: round.groups, colours: round.colours, tree: round.tree, rejected: before.rejected, current: edge, outcome: null, marks: {} }
    push(13, `Join the groups: ${rootU} now points to ${rootV}. The two groups become one.`, after, roots)
    push(14, `Keep the edge ${cable(edge)}. It turns green. The tree has cost ${round.total} so far.`, after, roots)
    if (round.tree.length === graph.nodes.length - 1) {
      push(15, `The tree has ${round.tree.length} edges, which is one fewer than the ${graph.nodes.length} nodes, so every node is joined.`, after, roots)
      push(16, `Stop early. The remaining ${run.sorted.length - 1 - i} edges are never even looked at.`, after, roots)
    }
    before = { groups: round.groups, colours: round.colours, tree: round.tree, rejected: before.rejected, current: null, outcome: null, marks: {} }
  })

  const done = run.tree.length === graph.nodes.length - 1
  push(17, done
    ? `Return the tree: ${run.tree.length} edges join all ${graph.nodes.length} nodes, with a total cost of ${run.total}. No other way of joining them costs less.`
    : `Every edge has been looked at, but only ${run.tree.length} were kept (total cost ${run.total}). The graph is in separate pieces, so the result is a spanning forest: the cheapest tree for each piece.`, { ...before, current: null }, {})
  return steps
}

function KruskalTracer() {
  return <CodeTracer code={code} presets={presets} buildSteps={buildSteps} view="graph" />
}

export default KruskalTracer
