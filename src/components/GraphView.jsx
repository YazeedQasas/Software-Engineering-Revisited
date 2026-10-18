import { TONES } from './TreeView.jsx'
import './GraphView.css'

// Colour and thickness for each edge state.
const EDGE_TONES = {
  plain: { stroke: '#8d8d8a', width: 1.8 },
  active: { stroke: '#2d4f9e', width: 3.4 },
  found: { stroke: '#237a35', width: 3.4 },
  dim: { stroke: '#d6d6d4', width: 1.5 },
  bad: { stroke: '#c44a4a', width: 3.2 },
  ghost: { stroke: '#c44a4a', width: 2.2, dash: '5 4' },
  candidate: { stroke: '#d9a400', width: 3.4 },
}

// What identifies an edge in edgeStates. Give an edge an `id` when two edges
// join the same pair of nodes, otherwise they would share a key.
export const edgeKey = (edge) => edge.id ?? `${edge.from}>${edge.to}`

// Where an edge starts and ends, and the bend of its curve. `bend` is how far
// the middle of the edge is pushed sideways; 0 gives a straight line.
function geometry(a, b, r, bend) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const control = { x: (a.x + b.x) / 2 - (dy / len) * bend * 2, y: (a.y + b.y) / 2 + (dx / len) * bend * 2 }
  const toward = (from, to) => {
    const ex = to.x - from.x
    const ey = to.y - from.y
    const l = Math.hypot(ex, ey) || 1
    return { x: from.x + (ex / l) * r, y: from.y + (ey / l) * r }
  }
  return { start: toward(a, control), end: toward(b, control), control }
}

// A graph: round nodes joined by edges. A lone edge is straight. When several
// edges join the same two nodes (two arrows pointing at each other, or two
// bridges over the same river) they fan out so every one can be seen.
//   graph: { width, height, nodes: [{ id, x, y, label? }], edges: [{ from, to, weight?, id? }] }
//   edges: which edges to draw (defaults to all of graph.edges); may include
//     extra ones such as a 'ghost' edge that does not exist
//   directed: draw arrowheads
//   nodeStates: { id: any state from TreeView }  edgeStates: { edgeKey: state }
//   nodeMarks: { id: text } a small badge on a node, e.g. its degree
function GraphView({ graph, edges = graph.edges, directed = true, nodeStates = {}, edgeStates = {}, nodeMarks = {}, r = 18, ariaLabel, className = '' }) {
  const byId = Object.fromEntries(graph.nodes.map((node) => [node.id, node]))
  const arrow = r * 0.55

  // Edges between the same two nodes, whichever way round they point.
  const groups = {}
  edges.forEach((edge) => {
    const pair = [edge.from, edge.to].sort().join('|')
    ;(groups[pair] ||= []).push(edge)
  })

  return (
    <svg
      className={`graph-view ${className}`.trim()}
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      role="img"
      aria-label={ariaLabel ?? `A graph with ${graph.nodes.length} nodes and ${edges.length} edges`}
    >
      {edges.map((edge) => {
        const key = edgeKey(edge)
        const tone = EDGE_TONES[edgeStates[key] ?? 'plain']
        const group = groups[[edge.from, edge.to].sort().join('|')]
        // Spread the group evenly either side of the straight line. The sign
        // makes an edge pointing the other way bend to the opposite side.
        const side = edge.from < edge.to ? 1 : -1
        const bend = (group.indexOf(edge) - (group.length - 1) / 2) * 2 * (r * 0.55) * side
        const { start, end, control } = geometry(byId[edge.from], byId[edge.to], r, bend)

        // The arrowhead points along the last part of the curve.
        const dx = end.x - control.x
        const dy = end.y - control.y
        const len = Math.hypot(dx, dy) || 1
        const ux = dx / len
        const uy = dy / len
        const back = { x: end.x - ux * arrow, y: end.y - uy * arrow }
        const stop = directed ? back : end
        const mid = { x: 0.25 * start.x + 0.5 * control.x + 0.25 * end.x, y: 0.25 * start.y + 0.5 * control.y + 0.25 * end.y }

        return (
          <g key={key} className="graph-edge">
            <path
              d={`M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${stop.x.toFixed(1)} ${stop.y.toFixed(1)}`}
              fill="none"
              stroke={tone.stroke}
              strokeWidth={tone.width}
              strokeDasharray={tone.dash}
              strokeLinecap="round"
            />
            {directed && (
              <polygon
                points={`${end.x.toFixed(1)},${end.y.toFixed(1)} ${(back.x - uy * arrow * 0.55).toFixed(1)},${(back.y + ux * arrow * 0.55).toFixed(1)} ${(back.x + uy * arrow * 0.55).toFixed(1)},${(back.y - ux * arrow * 0.55).toFixed(1)}`}
                fill={tone.stroke}
              />
            )}
            {edge.weight !== undefined && (
              <text x={mid.x} y={mid.y + 4} fontSize="12" fontWeight="700" textAnchor="middle" fill="var(--text-h)" stroke="var(--bg)" strokeWidth="4" paintOrder="stroke">
                {edge.weight}
              </text>
            )}
          </g>
        )
      })}
      {graph.nodes.map((node) => {
        const tone = TONES[nodeStates[node.id] ?? 'plain']
        const mark = nodeMarks[node.id]
        return (
          <g key={node.id} className="graph-node">
            <circle cx={node.x} cy={node.y} r={r} fill={tone.fill} stroke={tone.stroke} strokeWidth="1.6" />
            <text x={node.x} y={node.y + r * 0.34} fontSize={r * 0.95} fontWeight="700" textAnchor="middle" fill={tone.text}>
              {node.label ?? node.id}
            </text>
            {mark !== undefined && (
              <g>
                <circle cx={node.x + r * 0.85} cy={node.y - r * 0.85} r={r * 0.52} fill="#1f2023" />
                <text x={node.x + r * 0.85} y={node.y - r * 0.85 + r * 0.2} fontSize={r * 0.62} fontWeight="700" textAnchor="middle" fill="#ffffff">
                  {mark}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// The same graph written down two ways: an adjacency list (for each node, the
// nodes it points at) and an adjacency matrix (a grid where row r, column c is
// 1 when there is an edge from r to c). Pass null for either to show it as
// "not created yet". hot marks the entries that just changed:
//   { chip: [node, position in its list], cell: [row, column] }
// or, to mark several at once (an undirected edge is written down twice):
//   { chips: [[node, position], ...], cells: [[row, column], ...] }
// diagonal shades the cells where row = column, the mirror line of a matrix
// that is the same either side of it.
function GraphStore({ graph, adj, matrix, hot = {}, diagonal = false }) {
  const chips = hot.chips ?? (hot.chip ? [hot.chip] : [])
  const cells = hot.cells ?? (hot.cell ? [hot.cell] : [])
  const chipIsHot = (node, i) => chips.some(([n, k]) => n === node && k === i)
  const cellIsHot = (r, c) => cells.some(([row, col]) => row === r && col === c)

  return (
    <div className="graph-store">
      <div>
        <h5>Adjacency list</h5>
        {adj ? (
          <div className="graph-list">
            {graph.nodes.map((node) => (
              <div key={node.id} className="graph-list-row">
                <b>{node.id}</b>
                <span>&rarr;</span>
                {adj[node.id].length === 0 && <span className="graph-empty">nothing yet</span>}
                {adj[node.id].map((to, i) => (
                  <span key={i} className={`graph-chip${chipIsHot(node.id, i) ? ' hot' : ''}`}>{to}</span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <span className="graph-empty">not created yet</span>
        )}
      </div>
      <div>
        <h5>Adjacency matrix</h5>
        {matrix ? (
          <table className="graph-matrix">
            <thead>
              <tr>
                <th />
                {graph.nodes.map((node) => <th key={node.id}>{node.id}</th>)}
              </tr>
            </thead>
            <tbody>
              {graph.nodes.map((node, r) => (
                <tr key={node.id}>
                  <th>{node.id}</th>
                  {matrix[r].map((cell, c) => (
                    <td key={c} className={[cellIsHot(r, c) ? 'hot' : cell ? 'on' : '', diagonal && r === c ? 'diag' : ''].filter(Boolean).join(' ')}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span className="graph-empty">not created yet</span>
        )}
      </div>
    </div>
  )
}

export { GraphStore }
export default GraphView
