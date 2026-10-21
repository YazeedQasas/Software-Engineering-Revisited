import './IndexTables.css'

const RH = 26 // height of one row
const HEAD = 24 // room for the titles
const BLOCK_GAP = 10 // extra space between blocks of the table
const INDEX_W = 112
const TAG_W = 64
const LINK_W = 52
const TABLE_W = 156

// A table of rows, and an index beside it: a list of keys, each with where its
// row (or block of rows) lives.
//   rows: [{ slot, id, name, state?, hidden? }] in the order they sit on disk
//   blockSize: when set, the rows are drawn in blocks of this many
//   entries: [{ key, ptr, state?, hidden? }] the index, top to bottom, or null
//     for no index at all. Each entry is keyed, so when the list changes order
//     the entries slide to their new places.
//   state is one of 'read' (grey), 'active' (blue), 'hit' (green), 'range'
//     (yellow) or 'dim' (faded).
//   tags: { entryNumber: ['lo', 'mid'] } small labels beside an entry. A number
//     past the last entry draws an empty "end" slot to hold them.
//   links: [{ from: entryNumber, to: rowNumber }] lines from an entry to a row.
function IndexTables({ rows, blockSize = 0, entries = null, indexTitle = 'Index', tableTitle = 'Table (on disk)', tags = {}, links = [], ariaLabel }) {
  const rowTop = (i) => HEAD + i * RH + (blockSize ? Math.floor(i / blockSize) * BLOCK_GAP : 0)
  const entryTop = (i) => HEAD + i * RH
  const tableX = entries ? INDEX_W + TAG_W + LINK_W : 0
  const endTags = entries && tags[entries.length]
  const entryCount = entries ? entries.length + (endTags ? 1 : 0) : 0
  const height = Math.max(rowTop(rows.length - 1) + RH, entries ? entryTop(entryCount - 1) + RH : 0) + 4
  const linkX = INDEX_W
  const linkW = TAG_W + LINK_W

  return (
    <div
      className="ix"
      role="img"
      aria-label={ariaLabel ?? `A table of ${rows.length} rows${entries ? ` and an index of ${entries.length} entries` : ' with no index'}.`}
      style={{ width: tableX + TABLE_W, height }}
    >
      {entries && <div className="ix-title" style={{ left: 0 }}>{indexTitle}</div>}
      <div className="ix-title" style={{ left: tableX }}>{tableTitle}</div>

      {entries?.map((entry, i) => (
        <div
          key={entry.key}
          className={`ix-item ix-entry${entry.state ? ` ${entry.state}` : ''}`}
          style={{ transform: `translateY(${entryTop(i)}px)`, width: INDEX_W - 4, opacity: entry.hidden ? 0 : undefined }}
        >
          <span className="ix-key">{entry.key}</span>
          <span className="ix-arrow">→</span>
          <span className="ix-ptr">{entry.ptr}</span>
        </div>
      ))}
      {endTags && <div className="ix-end" style={{ top: entryTop(entries.length), width: INDEX_W - 4 }}>end</div>}
      {Object.entries(tags).map(([at, list]) => (
        <div key={at} className="ix-tags" style={{ top: entryTop(Number(at)), left: INDEX_W }}>
          {list.map((tag) => (
            <span key={tag} className={`ix-tag tag-${tag.split(" ")[0]}`}>{tag}</span>
          ))}
        </div>
      ))}

      {entries && links.length > 0 && (
        <svg className="ix-links" style={{ left: linkX, width: linkW, height }} viewBox={`0 0 ${linkW} ${height}`} aria-hidden="true">
          {links.map(({ from, to }) => {
            const [y1, y2] = [entryTop(from) + RH / 2, rowTop(to) + RH / 2]
            return (
              <g key={`${from}-${to}`}>
                <path d={`M0,${y1} C${linkW / 2},${y1} ${linkW / 2},${y2} ${linkW - 5},${y2}`} fill="none" stroke="#237a35" strokeWidth="2" />
                <polygon points={`${linkW},${y2} ${linkW - 7},${y2 - 4} ${linkW - 7},${y2 + 4}`} fill="#237a35" />
              </g>
            )
          })}
        </svg>
      )}

      {rows.map((row, i) => (
        <div
          key={row.slot}
          className={`ix-item ix-row${row.state ? ` ${row.state}` : ''}`}
          style={{ transform: `translateY(${rowTop(i)}px)`, left: tableX, width: TABLE_W - 4, opacity: row.hidden ? 0 : undefined }}
        >
          <span className="ix-slot">{row.slot}</span>
          <span className="ix-id">{row.id}</span>
          <span className="ix-name">{row.name}</span>
        </div>
      ))}
    </div>
  )
}

export default IndexTables
