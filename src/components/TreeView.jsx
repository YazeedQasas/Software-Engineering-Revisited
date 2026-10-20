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
  // groups of nodes that are already joined (Kruskal's algorithm)
  grp1: { fill: '#bcd2f7', stroke: '#3f6fbf', text: '#1f2023' },
  grp2: { fill: '#fbd0a5', stroke: '#c26a1a', text: '#1f2023' },
  grp3: { fill: '#e1c7f2', stroke: '#8a4fb5', text: '#1f2023' },
  grp4: { fill: '#bfe8e0', stroke: '#2a8f7e', text: '#1f2023' },
}

// The edges and nodes of a tree as SVG, so several trees can share one <svg>.
//   tree: { nodes: [{ id, x, y, label?, sub? }], edges: [[parentId, childId]] }
//   (sub is a small caption under the node, e.g. the range of an array it covers)
//   states: { id: 'plain' | 'active' | 'checked' | 'found' | 'queued' | 'pending' | 'bad' }
//   order: { id: number } draws a small numbered badge on that node
//   rings: ids that get a second, outer ring (e.g. a word ends at this trie node)
//   An edge can carry text as a third item: [parentId, childId, 'na'] (e.g. the
//   letters on an edge of a suffix tree). hotEdges: 'parentId-childId' keys of
//   edges to draw thick and blue (e.g. the edge a search is following).
function TreeNodes({ tree, states = {}, order = {}, rings = [], hotEdges = [], r = 17, labels = true }) {
  const byId = Object.fromEntries(tree.nodes.map((node) => [node.id, node]))

  return (
    <g>
      {tree.edges.map(([from, to]) => {
        const hot = hotEdges.includes(`${from}-${to}`)
        return (
          <line
            key={`${from}-${to}`}
            x1={byId[from].x}
            y1={byId[from].y}
            x2={byId[to].x}
            y2={byId[to].y}
            stroke={hot ? '#2d4f9e' : '#c4c4c2'}
            strokeWidth={Math.max(1, r * (hot ? 0.22 : 0.09))}
          />
        )
      })}
      {tree.edges.map(([from, to, text]) =>
        text === undefined ? null : (
          <text
            key={`t${from}-${to}`}
            x={(byId[from].x + byId[to].x) / 2}
            y={(byId[from].y + byId[to].y) / 2 + r * 0.25}
            fontSize={Math.max(12, r * 0.85)}
            fontWeight="600"
            textAnchor="middle"
            fill="var(--text-h)"
            stroke="var(--code-bg, #fff)"
            strokeWidth={Math.max(3, r * 0.25)}
            paintOrder="stroke"
            style={{ fontFamily: 'var(--mono)' }}
          >
            {text}
          </text>
        ),
      )}
      {tree.nodes.map((node) => {
        const tone = TONES[states[node.id] ?? 'plain']
        const badge = order[node.id]
        return (
          <g key={node.id} className="tree-node">
            {rings.includes(node.id) && (
              <circle cx={node.x} cy={node.y} r={r + Math.max(3, r * 0.24)} fill="none" stroke="#6b6c70" strokeWidth={Math.max(1, r * 0.09)} />
            )}
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
            {node.sub !== undefined && (
              <text
                x={node.x}
                y={node.y + r + r * 0.62}
                fontSize={r * 0.58}
                textAnchor="middle"
                fill="var(--text)"
                stroke="var(--code-bg, #fff)"
                strokeWidth={r * 0.3}
                paintOrder="stroke"
              >
                {node.sub}
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
