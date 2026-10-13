import { TONES } from './TreeView.jsx'
import './TreeView.css'

const CELL = 24 // must match the cell width the tree was laid out with (btree.js)

// A B-tree: every node is a box holding several sorted keys, with a child
// hanging below each gap between keys (and one at each end).
//   tree: { width, height, nodes: [{ id, keys, x, y, w, h }], edges: [[parentId, childId, slot]] }
//   states: { id: 'plain' | 'active' | 'checked' | 'found' | 'queued' | 'bad' }
//   marks: { id: text } a small badge on the top-right of a node
//   hot: { id: [key positions] } keys drawn green, e.g. the one that matched
function BTreeView({ tree, states = {}, marks = {}, hot = {}, ariaLabel, className = '' }) {
  const byId = Object.fromEntries(tree.nodes.map((node) => [node.id, node]))
  const pad = tree.pad ?? 10

  return (
    <svg
      className={`tree-view ${className}`.trim()}
      viewBox={`0 0 ${tree.width} ${tree.height}`}
      role="img"
      aria-label={ariaLabel ?? `A B-tree with ${tree.nodes.length} nodes`}
    >
      {tree.edges.map(([from, to, slot]) => {
        const parent = byId[from]
        const child = byId[to]
        return (
          <line
            key={`${from}-${to}`}
            x1={parent.x + pad / 2 + slot * CELL}
            y1={parent.y + parent.h}
            x2={child.x + child.w / 2}
            y2={child.y}
            stroke="#c4c4c2"
            strokeWidth="1.5"
          />
        )
      })}
      {tree.nodes.map((node) => {
        const tone = TONES[states[node.id] ?? 'plain']
        const cells = Math.max(1, node.keys.length)
        const badge = marks[node.id]
        return (
          <g key={node.id} className="tree-node">
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="5" fill={tone.fill} stroke={tone.stroke} strokeWidth="1.2" />
            {node.keys.map((key, i) => {
              const cx = node.x + pad / 2 + i * CELL
              return (
                <g key={i}>
                  {hot[node.id]?.includes(i) && (
                    <rect x={cx} y={node.y + 2} width={CELL} height={node.h - 4} rx="3" fill="#86d69f" stroke="#237a35" strokeWidth="1" />
                  )}
                  <text x={cx + CELL / 2} y={node.y + node.h / 2 + 5} fontSize="13" fontWeight="700" textAnchor="middle" fill={hot[node.id]?.includes(i) ? '#1f2023' : tone.text}>
                    {key}
                  </text>
                  {i > 0 && !hot[node.id]?.includes(i) && !hot[node.id]?.includes(i - 1) && (
                    <line x1={cx} y1={node.y + 5} x2={cx} y2={node.y + node.h - 5} stroke={tone.stroke} strokeWidth="0.8" />
                  )}
                </g>
              )
            })}
            {node.keys.length === 0 && cells === 1 && (
              <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 5} fontSize="12" textAnchor="middle" fill={tone.text}>-</text>
            )}
            {badge !== undefined && (
              <g>
                <circle cx={node.x + node.w - 2} cy={node.y - 2} r="8.5" fill="#1f2023" />
                <text x={node.x + node.w - 2} y={node.y + 1.5} fontSize="9.5" fontWeight="700" textAnchor="middle" fill="#ffffff">{badge}</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default BTreeView
