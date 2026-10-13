import './TreeView.css'

// Fill, outline and text colour for each node state.
const TONES = {
  plain: { fill: 'var(--bg)', stroke: '#b9b9b6', text: 'var(--text-h)' },
  active: { fill: '#8aa8ea', stroke: '#2d4f9e', text: '#1f2023' },
  checked: { fill: '#e4e4e2', stroke: '#bdbdba', text: '#6b6c70' },
  found: { fill: '#86d69f', stroke: '#237a35', text: '#1f2023' },
  queued: { fill: '#ffe27a', stroke: '#b8912a', text: '#1f2023' },
  pending: { fill: '#fff3bf', stroke: '#b8912a', text: '#1f2023', dash: '3 2' },
  bad: { fill: '#f2a5a5', stroke: '#c44a4a', text: '#1f2023' },
}

// The edges and nodes of a tree as SVG, so several trees can share one <svg>.
//   tree: { nodes: [{ id, x, y, label? }], edges: [[parentId, childId]] }
//   states: { id: 'plain' | 'active' | 'checked' | 'found' | 'queued' | 'pending' | 'bad' }
//   order: { id: number } draws a small numbered badge on that node
function TreeNodes({ tree, states = {}, order = {}, r = 17, labels = true }) {
  const byId = Object.fromEntries(tree.nodes.map((node) => [node.id, node]))

  return (
    <g>
      {tree.edges.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={byId[from].x}
          y1={byId[from].y}
          x2={byId[to].x}
          y2={byId[to].y}
          stroke="#c4c4c2"
          strokeWidth={Math.max(1, r * 0.09)}
        />
      ))}
      {tree.nodes.map((node) => {
        const tone = TONES[states[node.id] ?? 'plain']
        const badge = order[node.id]
        return (
          <g key={node.id} className="tree-node">
            <circle
              cx={node.x}
              cy={node.y}
              r={r}
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth={Math.max(1, r * 0.09)}
              strokeDasharray={tone.dash}
            />
            {labels && (
              <text x={node.x} y={node.y + r * 0.32} fontSize={r * 0.85} fontWeight="700" textAnchor="middle" fill={tone.text}>
                {node.label ?? node.id}
              </text>
            )}
            {badge !== undefined && (
              <g>
                <circle cx={node.x + r * 0.85} cy={node.y - r * 0.85} r={r * 0.5} fill="#1f2023" />
                <text x={node.x + r * 0.85} y={node.y - r * 0.85 + r * 0.19} fontSize={r * 0.55} fontWeight="700" textAnchor="middle" fill="#ffffff">
                  {badge}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </g>
  )
}

// A whole tree drawn in its own <svg>, sized by tree.width and tree.height.
function TreeView({ tree, ariaLabel, className = '', ...rest }) {
  return (
    <svg
      className={`tree-view ${className}`.trim()}
      viewBox={`0 0 ${tree.width} ${tree.height}`}
      role="img"
      aria-label={ariaLabel ?? `A tree with ${tree.nodes.length} nodes`}
    >
      <TreeNodes tree={tree} {...rest} />
    </svg>
  )
}

export { TreeNodes, TONES }
export default TreeView
