import { TONES } from './TreeView.jsx'
import './FenwickView.css'

const lowbit = (i) => i & -i

const W = 360
const SIDE = 6
const BAR = 30
const GAP = 5
const CELL = 28

// A Fenwick tree drawn the way it is stored: the array along the bottom, and
// above it one bar for every box. Box i is as wide as the part of the array it
// adds up, and ends right above position i, so the short bars sit low and the
// long ones high.
//   n: how many positions, values: the n numbers of the array,
//   tree: the stored sums (tree[i] for box i, tree[0] unused),
//   states: { box: 'plain' | 'active' | 'checked' | 'found' | 'queued' | 'bad' }
//   cells: { position: the same states } colours the array cells
function FenwickView({ n, values, tree, states = {}, cells = {}, className = '', ariaLabel }) {
  const cw = (W - 2 * SIDE) / n
  const levels = Math.floor(Math.log2(n)) + 1
  const barsTop = 3
  const cellsTop = barsTop + levels * (BAR + GAP) + 2
  const height = cellsTop + CELL + 20

  return (
    <svg
      className={`fenwick-view ${className}`.trim()}
      viewBox={`0 0 ${W} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `A Fenwick tree over ${n} numbers: ${values.join(', ')}. Box sums: ${tree.slice(1).join(', ')}.`}
    >
      {tree.slice(1).map((sum, k) => {
        const i = k + 1
        const low = lowbit(i)
        const tone = TONES[states[i] ?? 'plain']
        const x = SIDE + (i - low) * cw + 1.5
        const y = barsTop + (levels - 1 - Math.log2(low)) * (BAR + GAP)
        const w = low * cw - 3
        return (
          <g key={i} className="fenwick-bar">
            <rect x={x} y={y} width={w} height={BAR} rx="4" fill={tone.fill} stroke={tone.stroke} strokeWidth="1.2" />
            <text x={x + w - 4} y={y + 10} fontSize="8.5" textAnchor="end" fill={tone.text} opacity="0.7">{i}</text>
            <text x={x + w / 2} y={y + BAR - 8} fontSize="13" fontWeight="700" textAnchor="middle" fill={tone.text}>{sum}</text>
          </g>
        )
      })}
      {values.map((value, k) => {
        const pos = k + 1
        const tone = TONES[cells[pos] ?? 'plain']
        const x = SIDE + k * cw + 1.5
        return (
          <g key={pos} className="fenwick-bar">
            <rect x={x} y={cellsTop} width={cw - 3} height={CELL} rx="3" fill={tone.fill} stroke={tone.stroke} strokeWidth="1.2" />
            <text x={x + (cw - 3) / 2} y={cellsTop + CELL / 2 + 5} fontSize="13" fontWeight="700" textAnchor="middle" fill={tone.text}>{value}</text>
            <text x={x + (cw - 3) / 2} y={cellsTop + CELL + 14} fontSize="10" textAnchor="middle" fill="var(--text)">{pos}</text>
          </g>
        )
      })}
    </svg>
  )
}

// A number written in binary, one box per digit, with its lowest 1 picked out.
//   rows: [{ label, value, dim? }], width: how many digits to show
function Bits({ rows, width }) {
  return (
    <div className="bits" aria-label="Numbers in binary">
      {rows.map((row) => {
        const digits = row.value.toString(2).padStart(width, '0').split('')
        const lowest = row.value === 0 ? -1 : width - 1 - Math.log2(lowbit(row.value))
        return (
          <div key={row.label} className={`bits-row${row.dim ? ' dim' : ''}`}>
            <code className="bits-label">{row.label}</code>
            <span className="bits-dec">{row.value}</span>
            <span className="bits-digits" aria-label={`${row.value} in binary is ${digits.join('')}`}>
              {digits.map((d, k) => (
                <i key={k} className={`${d === '1' ? 'one' : ''}${k === lowest ? ' low' : ''}`}>{d}</i>
              ))}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { Bits }
export default FenwickView
