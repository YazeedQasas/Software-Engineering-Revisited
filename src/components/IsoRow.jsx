import './IsoRow.css'

const COS = 0.866
const SIN = 0.5

// Face colors for each cube state: [top, left side, right side, outline].
const TONES = {
  plain: ['#ffffff', '#e6e6e4', '#d4d4d2', '#c4c4c2'],
  active: ['#8aa8ea', '#5b7fd3', '#3a63c4', '#2d4f9e'],
  checked: ['#f1f1f0', '#dededc', '#d0d0ce', '#c9c9c7'],
  found: ['#86d69f', '#4cbc6e', '#2f9e44', '#237a35'],
  target: ['#ffe27a', '#ebc650', '#d3ab32', '#b8912a'],
}

// One isometric cube. (px, py) is the centre of its footprint on the ground;
// the cube rises by `h`. `lift` floats the whole cube upwards.
function IsoCube({ px, py, s, h, tone = 'plain', label, lift = 0, labelSize = 13 }) {
  const a = s * COS
  const b = s * SIN
  const [top, left, right, edge] = TONES[tone]
  const pts = (list) => list.map(([x, y]) => `${(px + x).toFixed(1)},${(py + y).toFixed(1)}`).join(' ')

  return (
    <g className="iso-cube" style={{ transform: `translateY(${-lift}px)` }}>
      <g className={tone === 'found' ? 'iso-pop' : undefined}>
        <polygon className="iso-face" points={pts([[-a, -h], [0, b - h], [0, b], [-a, 0]])} fill={left} stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
        <polygon className="iso-face" points={pts([[0, b - h], [a, -h], [a, 0], [0, b]])} fill={right} stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
        <polygon className="iso-face" points={pts([[0, -b - h], [a, -h], [0, b - h], [-a, -h]])} fill={top} stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
        {label !== undefined && (
          <g transform={`translate(${px} ${py - h}) matrix(${COS} ${SIN} ${-COS} ${SIN} 0 0)`}>
            <text x="0" y={labelSize * 0.35} fontSize={labelSize} fontWeight="700" textAnchor="middle" fill="#1f2023">{label}</text>
          </g>
        )}
      </g>
    </g>
  )
}

// A row of isometric cubes running down and to the right, with an optional
// floating marker above one cube and an optional "looking for" cube.
//   states: one of 'plain' | 'active' | 'checked' | 'found' per cube
//   lifted / marker: index of the cube to raise / to point at (or null)
//   target: value of the cube being searched for (or undefined)
function IsoRow({ values, states, lifted = null, marker = null, target, size = 26, showIndex = true, ariaLabel }) {
  const n = values.length
  const s = size
  const h = s * 0.62
  const gap = s * 1.25
  const a = s * COS
  const margin = 12
  const markerRoom = 34
  const ox = margin + a
  const oy = margin + markerRoom + s * SIN
  const at = (i) => ({ px: ox + i * gap * COS, py: oy + i * gap * SIN })

  const width = Math.max(ox + (n - 1) * gap * COS + a + margin, 300)
  const height = oy + (n - 1) * gap * SIN + s * SIN + (showIndex ? 20 : 8)
  const markerPos = marker !== null ? at(marker) : null
  const markerLift = lifted === marker && lifted !== null ? s * 0.5 : 0
  const targetSpot = { px: width - margin - a - 8, py: margin + markerRoom + s * SIN }

  return (
    <svg
      className="iso-row"
      viewBox={`0 0 ${width.toFixed(0)} ${height.toFixed(0)}`}
      role="img"
      aria-label={ariaLabel ?? `A row of ${n} cubes holding ${values.join(', ')}`}
    >
      {values.map((value, i) => {
        const { px, py } = at(i)
        return (
          <g key={i}>
            <IsoCube
              px={px}
              py={py}
              s={s}
              h={h}
              tone={states[i]}
              label={value}
              lift={lifted === i ? s * 0.5 : 0}
              labelSize={Math.round(s * 0.55)}
            />
            {showIndex && (
              <text x={px} y={py + s * SIN + 15} fontSize="10" textAnchor="middle" fill="var(--text)">{i}</text>
            )}
          </g>
        )
      })}

      {markerPos && (
        <g className="iso-marker" style={{ transform: `translate(${markerPos.px}px, ${markerPos.py - h - 24 - markerLift}px)` }}>
          <polygon points="-7,0 7,0 0,10" fill="var(--accent)" />
        </g>
      )}

      {target !== undefined && (
        <g>
          <IsoCube px={targetSpot.px} py={targetSpot.py} s={s} h={h} tone="target" label={target} labelSize={Math.round(s * 0.55)} />
          <text x={targetSpot.px} y={targetSpot.py + s * SIN + 15} fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--text-h)">looking for</text>
        </g>
      )}
    </svg>
  )
}

export { IsoCube }
export default IsoRow
