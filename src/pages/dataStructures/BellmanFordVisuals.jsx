import { edgeKey } from '../../components/GraphView.jsx'
import { BELLMAN, NEG_CYCLE, NEGATIVE, bellmanFordPasses } from './graphData.js'
import { E, GraphFrames } from './GraphFrames.jsx'

const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const INK = '#1f2023'

// "B, C and D" from ['B', 'C', 'D'].
const joined = (parts) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`)

const finite = (dist) => Object.entries(dist).filter(([, value]) => value !== Infinity)

// The edges of `previous` (node -> where it came from), all marked 'found'.
const treeEdges = (graph, previous) =>
  Object.fromEntries(
    Object.entries(previous).map(([to, from]) => [edgeKey(graph.edges.find((e) => e.from === from && e.to === to)), 'found']),
  )

const describe = ({ edge, was, now }) => (was === Infinity ? `${edge.to} = ${now}` : `${edge.to} drops from ${was} to ${now}`)

// ------------------------------------------------ the passes

const RUN = bellmanFordPasses(BELLMAN, 'A')
const LEGEND = [
  { color: GREEN, text: 'already its cheapest cost' },
  { color: YELLOW, text: 'a way found, but a cheaper one may exist' },
  { color: INK, text: 'the number on a node: its best distance so far' },
]

const PASSES = [
  {
    caption: `Start: A = 0, everything else ∞. Bellman-Ford will go over every edge, in this order: ${BELLMAN.edges.map((e) => `${e.from}→${e.to}`).join(', ')}.`,
    directed: true,
    nodes: { A: 'active' },
    marks: { A: '0' },
  },
  ...RUN.passes.map(({ changes, dist, previous }, i) => {
    const edges = treeEdges(BELLMAN, previous)
    changes.forEach(({ edge }) => {
      edges[edgeKey(edge)] = 'active'
    })
    return {
      caption: `Pass ${i + 1}: ${changes.length ? `${joined(changes.map(describe))}.` : 'nothing changes.'}${i === 0 ? ' Only the roads out of A can help so far.' : ''}`,
      directed: true,
      nodes: Object.fromEntries(finite(dist).map(([id, value]) => [id, value === RUN.dist[id] ? 'found' : 'queued'])),
      marks: Object.fromEntries(finite(dist).map(([id, value]) => [id, String(value)])),
      edges,
    }
  }),
  {
    caption: 'Four passes (one fewer than the five nodes) and every node has its cheapest cost. The green roads show the routes.',
    directed: true,
    nodes: Object.fromEntries(BELLMAN.nodes.map(({ id }) => [id, 'found'])),
    marks: Object.fromEntries(finite(RUN.dist).map(([id, value]) => [id, String(value)])),
    edges: treeEdges(BELLMAN, RUN.previous),
  },
]

// Sweep over every edge, again and again, until the answers settle.
function PassesVisual() {
  return (
    <GraphFrames
      frames={PASSES}
      graph={BELLMAN}
      ms={4600}
      legend={LEGEND}
      ariaLabel="Bellman-Ford on five nodes with one negative road. Each pass goes over every edge once. After four passes the cheapest costs from A are B 3, C 5, D 6 and E 8."
    />
  )
}

// ------------------------------------------------ the graph that broke Dijkstra

const NEG_PLAIN = Object.fromEntries(NEGATIVE.edges.map((edge) => [E(edge.from, edge.to), 'dim']))

const WORKS = [
  {
    caption: 'The graph that broke Dijkstra. Bellman-Ford does not pick favourites: it just checks every edge, in order. S→A, S→B, B→A, A→T.',
    directed: true,
    nodes: { S: 'active' },
    marks: { S: '0' },
    edges: { [E('B', 'A')]: 'active' },
  },
  {
    caption: 'S→A: 0 + 2 = 2, so A = 2. S→B: 0 + 3 = 3, so B = 3.',
    directed: true,
    nodes: { S: 'found', A: 'queued', B: 'queued' },
    marks: { S: '0', A: '2', B: '3' },
    edges: { ...NEG_PLAIN, [E('S', 'A')]: 'found', [E('S', 'B')]: 'found' },
  },
  {
    caption: 'B→A costs −2: 3 − 2 = 1, which beats 2. A is updated. Nothing was ever locked in, so A is free to change.',
    directed: true,
    nodes: { S: 'found', A: 'queued', B: 'queued' },
    marks: { S: '0', A: '1', B: '3' },
    edges: { ...NEG_PLAIN, [E('S', 'B')]: 'found', [E('B', 'A')]: 'found' },
  },
  {
    caption: 'A→T: 1 + 1 = 2. T = 2, the right answer. (Dijkstra said 3.)',
    directed: true,
    nodes: { S: 'found', A: 'found', B: 'found', T: 'found' },
    marks: { S: '0', A: '1', B: '3', T: '2' },
    edges: { ...NEG_PLAIN, [E('S', 'B')]: 'found', [E('B', 'A')]: 'found', [E('A', 'T')]: 'found' },
  },
]

// The same graph as on the Dijkstra page, now solved correctly.
function WorksVisual() {
  return (
    <GraphFrames
      frames={WORKS}
      graph={NEGATIVE}
      ms={4200}
      ariaLabel="Bellman-Ford on the graph with a negative road B to A of minus 2. It checks S to A, S to B, B to A and A to T in order, ends with A = 1 and T = 2, and gets the right answer."
    />
  )
}

// ------------------------------------------------ a negative cycle

const CYCLE_RUN = bellmanFordPasses(NEG_CYCLE, 'A', NEG_CYCLE.nodes.length)
const CYCLE_EDGES = [E('B', 'C'), E('C', 'D'), E('D', 'B')]
const LAST = CYCLE_RUN.passes.length - 1

const CYCLE = [
  {
    caption: 'This loop costs 2 + (−4) + 1 = −1 every time round. Each lap makes the trip cheaper, for ever.',
    directed: true,
    nodes: { B: 'bad', C: 'bad', D: 'bad' },
    edges: Object.fromEntries(CYCLE_EDGES.map((key) => [key, 'bad'])),
  },
  ...CYCLE_RUN.passes.map(({ changes, dist }, i) => {
    const last = i === LAST
    const edges = {}
    changes.forEach(({ edge }) => {
      edges[edgeKey(edge)] = last ? 'bad' : 'active'
    })
    return {
      caption: last
        ? 'Pass 4 is the extra check. Three passes should be enough, but B, C and D still drop. That can only be a negative cycle.'
        : `Pass ${i + 1}: B, C and D all drop again. Each pass takes one more lap.`,
      directed: true,
      nodes: Object.fromEntries(finite(dist).map(([id]) => [id, last && id !== 'A' ? 'bad' : 'queued'])),
      marks: Object.fromEntries(finite(dist).map(([id, value]) => [id, String(value)])),
      edges,
    }
  }),
]

// Passes that never settle: the sign of a negative cycle.
function NegativeCycleVisual() {
  return (
    <GraphFrames
      frames={CYCLE}
      graph={NEG_CYCLE}
      ms={3800}
      ariaLabel="A loop B to C to D to B whose roads cost 2, minus 4 and 1, so each lap costs minus 1. Every pass of Bellman-Ford makes the distances smaller again, and the extra check pass still improves them, which reveals the negative cycle."
    />
  )
}

// ------------------------------------------------ cost

// Which edges did something in each pass? A grid of passes by edges.
function PassesWorkVisual() {
  const { passes } = RUN
  const edges = BELLMAN.edges
  const cellW = 52
  const cellH = 26
  const left = 62
  const rows = passes.length + 1
  const height = 24 + rows * (cellH + 6)

  return (
    <div className="visual-card">
      <svg
        viewBox={`0 0 ${left + edges.length * (cellW + 4)} ${height}`}
        role="img"
        aria-label={`Every pass checks every edge: ${passes.length} passes of ${edges.length} edges, plus one more pass to check for negative cycles. Only ${passes.reduce((n, p) => n + p.changes.length, 0)} of the ${(passes.length + 1) * edges.length} checks changed anything.`}
      >
        {edges.map((edge, c) => (
          <text key={edgeKey(edge)} x={left + c * (cellW + 4) + cellW / 2} y="14" fontSize="11" fontWeight="700" textAnchor="middle" fill="var(--text-h)">
            {edge.from}→{edge.to}
          </text>
        ))}
        {Array.from({ length: rows }).map((_, r) => {
          const y = 24 + r * (cellH + 6)
          const isCheck = r === passes.length
          return (
            <g key={r}>
              <text x="4" y={y + cellH / 2 + 4} fontSize="11.5" fill="var(--text-h)">{isCheck ? 'Check' : `Pass ${r + 1}`}</text>
              {edges.map((edge, c) => {
                const change = isCheck ? null : passes[r].changes.find((ch) => ch.edge === edge)
                return (
                  <g key={edgeKey(edge)}>
                    <rect
                      x={left + c * (cellW + 4)}
                      y={y}
                      width={cellW}
                      height={cellH}
                      rx="4"
                      fill={change ? GREEN : isCheck ? '#f3f3f1' : '#e4e4e2'}
                      stroke={change ? '#237a35' : '#bdbdba'}
                      strokeWidth="0.9"
                    />
                    {change && (
                      <text x={left + c * (cellW + 4) + cellW / 2} y={y + cellH / 2 + 4} fontSize="11" fontWeight="700" textAnchor="middle" fill={INK}>
                        {edge.to} = {change.now}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: GREEN }} /> this edge improved something</li>
        <li><span className="swatch" style={{ background: '#e4e4e2' }} /> checked, nothing changed</li>
        <li>so most of the work is checking: <code>(V − 1) × E</code> checks, plus E more</li>
      </ul>
    </div>
  )
}

export { PassesVisual, WorksVisual, NegativeCycleVisual, PassesWorkVisual }
