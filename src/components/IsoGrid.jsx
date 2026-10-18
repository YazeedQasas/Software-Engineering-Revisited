import { IsoCube, TONES } from './IsoRow.jsx'
import './IsoRow.css'

const COS = 0.866
const SIN = 0.5
const GAP = 1.04 // tiles sit a hair apart so every edge can be seen
const ROOM = 44 // default space above the grid for a marker or a callout

// How a line between two neighbouring nodes is drawn: [colour, width].
const EDGE_TONES = {
  plain: ['#b9b9b6', 1.5],
  link: ['#5cb878', 2.6], // where a tile was reached from
  found: ['#237a35', 3.6], // the route
  active: ['#2d4f9e', 3.6], // the road being checked
}

// A grid of isometric tiles. Row r runs down and to the left, column c runs
// down and to the right, so (rows - 1, 0) is the left corner and (0, cols - 1)
// is the right corner.
//   cell(r, c) -> { tone, label?, lift?, tall? }  tone is any IsoRow tone;
//     tall draws a wall, otherwise a thin floor tile
//   room: space above the grid for a marker or callout (0 if there is none)
//   marker: [r, c] puts a pointer above that tile
//   callout: { cell: [r, c], text } puts a short note above that tile
// A grid is also a graph: every open tile is a node, and every two tiles that
// touch are joined by an edge. With graphable on, `mode` picks the drawing:
//   'tiles'  just the tiles
//   'dots'   the tiles with a node on each open tile
//   'graph'  the tiles fade away, the nodes slide into a flat lattice and the
//            edges fade in
// edge([r, c], [r2, c2]) -> 'plain' | 'link' | 'found' | 'active' colours an edge.
function IsoGrid({ rows, cols, cell, size = 21, room = ROOM, marker = null, callout = null, ariaLabel, graphable = false, mode = 'tiles', edge = null }) {
  const a = size * COS
  const b = size * SIN
  const dx = a * GAP
  const dy = b * GAP
  const floor = size * 0.2
  const wall = size * 0.48 // low enough not to hide the tiles behind it
  const margin = 10
  const nodeR = size * 0.46 // a node in the flat graph
  const dotR = size * 0.24 // the small dot sitting on a tile
  const step = 30 // distance between nodes in the flat lattice
  const ox = margin + a + (rows - 1) * dx
  const oy = margin + room + wall + b
  const width = ox + (cols - 1) * dx + a + margin
  const isoHeight = oy + (rows + cols - 2) * dy + b + 12
  const height = graphable ? Math.max(isoHeight, margin + room + (rows - 1) * step + 2 * nodeR + margin) : isoHeight
  const isoAt = (r, c) => ({ px: ox + (c - r) * dx, py: oy + (c + r) * dy })
  const flatAt = (r, c) => ({ px: (width - (cols - 1) * step) / 2 + c * step, py: margin + room + nodeR + r * step })
  const flat = graphable && mode === 'graph'
  const showNodes = graphable && mode !== 'tiles'
  const at = flat ? flatAt : isoAt
  const rise = flat ? nodeR : floor // how far above the point a marker or callout starts

  const cells = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ r, c, ...cell(r, c) })
  const open = new Set(cells.filter((x) => x.tone !== 'wall').map((x) => `${x.r},${x.c}`))

  // Back to front: tiles with a smaller r + c are further away.
  const order = cells.slice().sort((p, q) => p.r + p.c - (q.r + q.c))

  const edges = []
  if (graphable) {
    cells.forEach(({ r, c }) => {
      if (!open.has(`${r},${c}`)) return
      ;[[r, c + 1], [r + 1, c]].forEach(([r2, c2]) => {
        if (open.has(`${r2},${c2}`)) edges.push([[r, c], [r2, c2]])
      })
    })
  }

  const markerAt = marker ? at(...marker) : null
  let bubble = null
  if (callout) {
    const { px, py } = at(...callout.cell)
    const w = callout.text.length * 6 + 16
    const x = Math.min(Math.max(px - w / 2, 4), width - w - 4)
    bubble = { px, py, w, x }
  }

  return (
    <svg className="iso-grid" viewBox={`0 0 ${width.toFixed(0)} ${height.toFixed(0)}`} role="img" aria-label={ariaLabel}>
      <g className="iso-fade" style={{ opacity: flat ? 0 : 1 }}>
        {order.map(({ r, c, tone = 'plain', label, lift = 0, tall = false }) => {
          const { px, py } = isoAt(r, c)
          return (
            <IsoCube
              key={`${r},${c}`}
              px={px}
              py={py}
              s={size}
              h={tall ? wall : floor}
              tone={tone}
              label={label}
              lift={lift}
              labelSize={Math.round(size * 0.5)}
            />
          )
        })}
      </g>

      {graphable && (
        <g className="iso-fade" style={{ opacity: flat ? 1 : 0, transitionDelay: flat ? '0.7s' : '0s' }}>
          {edges.map(([from, to]) => {
            const p = flatAt(...from)
            const q = flatAt(...to)
            const [stroke, lineWidth] = EDGE_TONES[edge?.(from, to) ?? 'plain']
            return <line key={`${from}-${to}`} x1={p.px} y1={p.py} x2={q.px} y2={q.py} stroke={stroke} strokeWidth={lineWidth} strokeLinecap="round" />
          })}
        </g>
      )}

      {graphable && (
        <g className="iso-fade" style={{ opacity: showNodes ? 1 : 0 }}>
          {cells.filter(({ r, c }) => open.has(`${r},${c}`)).map(({ r, c, tone = 'plain', label }) => {
            const { px, py } = at(r, c)
            const [fill, , , outline] = TONES[tone]
            return (
              <g key={`${r},${c}`} className="iso-node" style={{ transform: `translate(${px}px, ${py - (flat ? 0 : floor)}px)` }}>
                <circle className="iso-dot" r={flat ? nodeR : dotR} style={{ r: flat ? nodeR : dotR }} fill={fill} stroke={outline} strokeWidth="1.4" />
                {label !== undefined && label !== '' && (
                  <text className="iso-fade" style={{ opacity: flat ? 1 : 0 }} y={nodeR * 0.36} fontSize={Math.round(size * 0.46)} fontWeight="700" textAnchor="middle" fill="#1f2023">{label}</text>
                )}
              </g>
            )
          })}
        </g>
      )}

      {markerAt && (
        <g className="iso-marker" style={{ transform: `translate(${markerAt.px}px, ${markerAt.py - rise - 24}px)` }}>
          <polygon points="-7,0 7,0 0,10" fill="var(--accent)" />
        </g>
      )}

      {bubble && (
        <g>
          <polygon points={`${bubble.px - 5},${bubble.py - rise - 16} ${bubble.px + 5},${bubble.py - rise - 16} ${bubble.px},${bubble.py - rise - 8}`} fill="#1f2023" />
          <rect x={bubble.x} y={bubble.py - rise - 38} width={bubble.w} height="23" rx="5" fill="#1f2023" />
          <text x={bubble.x + bubble.w / 2} y={bubble.py - rise - 22.5} fontSize="11.5" fontWeight="700" textAnchor="middle" fill="#ffffff">
            {callout.text}
          </text>
        </g>
      )}
    </svg>
  )
}

// The Tiles / Graph switch shown above a grid.
export function GridViewToggle({ value, onChange }) {
  return (
    <div className="grid-view-toggle" role="group" aria-label="Show the map as">
      <span className="tracer-label">Show the map as:</span>
      {[['tiles', 'Tiles'], ['graph', 'A graph']].map(([key, label]) => (
        <button key={key} type="button" className={`tracer-chip${value === key ? ' active' : ''}`} onClick={() => onChange(key)}>
          {label}
        </button>
      ))}
    </div>
  )
}

// Which edges to colour on the graph drawing of a search:
//   previous: { 'r,c': [r, c] } where each tile was reached from (light green),
//   route: tiles from start to goal (dark green), current / looking: the road
//   being checked (blue)
export function searchEdges({ previous = {}, route = null, current = null, looking = null }) {
  const same = (p, q) => p && q && p[0] === q[0] && p[1] === q[1]
  const key = ([r, c]) => `${r},${c}`
  const joins = (p, q, x, y) => (same(p, x) && same(q, y)) || (same(p, y) && same(q, x))
  return (p, q) => {
    if (route?.some((tile, i) => i > 0 && joins(route[i - 1], tile, p, q))) return 'found'
    if (current && looking && joins(current, looking, p, q)) return 'active'
    if (same(previous[key(q)], p) || same(previous[key(p)], q)) return 'link'
    return 'plain'
  }
}

// The usual colours for a grid being searched, as a `cell` function for IsoGrid:
// walls are tall and dark, the route is green, the tile being expanded is blue
// and floats up, expanded tiles are grey, tiles waiting in the heap are yellow,
// and the start and goal are teal and purple.
//   map: { rows, cols, start, goal, walls }, closed / open: lists of [r, c],
//   current: [r, c] or null, route: list of [r, c] or null,
//   labels: { 'r,c': text } shown on the tiles (S and G by default)
export function searchCell({ map, closed = [], open = [], current = null, route = null, labels = {} }) {
  const has = (list, r, c) => list?.some((cell) => cell[0] === r && cell[1] === c)
  const same = (cell, r, c) => cell && cell[0] === r && cell[1] === c

  return (r, c) => {
    const label = labels[`${r},${c}`]
    if (has(map.walls, r, c)) return { tone: 'wall', tall: true }
    if (has(route, r, c)) return { tone: 'found', label: label ?? (same(map.start, r, c) ? 'S' : same(map.goal, r, c) ? 'G' : undefined) }
    if (same(current, r, c)) return { tone: 'active', label, lift: 5 }
    if (same(map.start, r, c)) return { tone: 'start', label: label ?? 'S' }
    if (same(map.goal, r, c)) return { tone: 'goal', label: label ?? 'G' }
    if (has(closed, r, c)) return { tone: 'closed', label }
    if (has(open, r, c)) return { tone: 'target', label }
    return { tone: 'plain', label }
  }
}

export default IsoGrid
