import './SuffixRows.css'

const CW = 22 // width of one letter
const RH = 28 // height of one row
const GUT = 34 // room for the number on the left
const HEAD = 46 // height of the word shown above the rows

// The suffixes of a word, one per row. A row is keyed by where its suffix
// starts, so when the list is re-ordered every row slides to its new place.
//   rows: [{ key, text, hidden?, dim?, state?, hot?, miss?, idxHot? }] in the
//     order they are shown. key is where the suffix starts (shown on the left),
//     hot is how many letters, from the left, are drawn green (e.g. the part
//     that matches a pattern), miss is the position of one letter drawn red,
//     state is 'active' (blue number) or 'found' (green number),
//     dim fades the row, hidden hides it, idxHot colours the number.
//   header: the whole word, drawn above with its positions.
//   mode: 'stair' puts each suffix under the letters of the word it comes
//     from, 'left' lines them all up on the left.
//   tags: { rowNumber: ['lo', 'hi'] } small labels beside a row. A number past
//     the last row draws an empty "end" row to hold them.
function SuffixRows({ rows, header, mode = 'left', tags = {}, ariaLabel }) {
  const maxLen = Math.max(header?.length ?? 0, ...rows.map((row) => row.text.length))
  const head = header ? HEAD : 0
  const endTags = tags[rows.length]
  const count = rows.length + (endTags ? 1 : 0)
  const tagLeft = GUT + maxLen * CW + 14

  return (
    <div
      className="sfx"
      role="img"
      aria-label={ariaLabel ?? `The suffixes: ${rows.map((row) => row.text).join(', ')}.`}
      style={{ height: head + count * RH + 4, width: tagLeft + 96 }}
    >
      {header && (
        <div className="sfx-header" style={{ left: GUT, height: head - 6 }}>
          {header.split('').map((ch, k) => (
            <span key={k} className="sfx-ch head">
              {ch}
              <i>{k}</i>
            </span>
          ))}
        </div>
      )}
      {rows.map((row, idx) => (
        <div
          key={row.key}
          className={`sfx-row${row.state ? ` ${row.state}` : ''}${row.idxHot ? ' idx-hot' : ''}`}
          style={{ transform: `translateY(${head + idx * RH}px)`, opacity: row.hidden ? 0 : row.dim ? 0.38 : 1 }}
        >
          <span className="sfx-idx">{row.key}</span>
          <span className="sfx-text" style={{ transform: `translateX(${mode === 'stair' ? row.key * CW : 0}px)` }}>
            {row.text.split('').map((ch, k) => (
              <span key={k} className={`sfx-ch${k < (row.hot ?? 0) ? ' hit' : ''}${k === row.miss ? ' miss' : ''}`}>{ch}</span>
            ))}
          </span>
        </div>
      ))}
      {endTags && <div className="sfx-end" style={{ top: head + rows.length * RH, left: GUT, width: maxLen * CW }}>end</div>}
      {Object.entries(tags).map(([at, list]) => (
        <div key={at} className="sfx-tags" style={{ top: head + Number(at) * RH, left: tagLeft }}>
          {list.map((tag) => (
            <span key={tag} className={`sfx-tag tag-${tag.split(' ')[0]}`}>{tag}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default SuffixRows
