import { useEffect, useMemo, useState } from 'react'
import IsoRow from './IsoRow.jsx'
import TreeView from './TreeView.jsx'
import BTreeView from './BTreeView.jsx'
import GraphView, { GraphStore, edgeKey } from './GraphView.jsx'
import IsoGrid, { GridViewToggle, searchCell, searchEdges } from './IsoGrid.jsx'
import FenwickView, { Bits } from './FenwickView.jsx'
import SuffixRows from './SuffixRows.jsx'
import './CodeTracer.css'

const speeds = [
  { label: 'Slow', ms: 1200 },
  { label: 'Normal', ms: 700 },
  { label: 'Fast', ms: 250 },
]

const BAR_MIN = 26
const BAR_RANGE = 104

// The first `size` items drawn as a binary tree (item i has children 2i+1 and
// 2i+2), laid out for `total` items so the shape stays put as it shrinks.
function HeapTree({ step, total }) {
  const size = step.heapSize
  const width = 360
  const rowHeight = 46
  const levels = Math.floor(Math.log2(total)) + 1
  const place = (i) => {
    const level = Math.floor(Math.log2(i + 1))
    const slots = 2 ** level
    return { x: ((i - (slots - 1) + 0.5) / slots) * width, y: 22 + level * rowHeight }
  }

  return (
    <svg
      className="tracer-tree"
      viewBox={`0 0 ${width} ${levels * rowHeight}`}
      role="img"
      aria-label={`The heap drawn as a tree: ${step.array
        .slice(0, size)
        .map((item) => item.value)
        .join(', ')}`}
    >
      {step.array.slice(0, size).map((_, i) => {
        if (i === 0) return null
        const parent = place((i - 1) >> 1)
        const child = place(i)
        return <line key={`e${i}`} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke="var(--border)" strokeWidth="1.5" />
      })}
      {step.array.slice(0, size).map((item, i) => {
        const { x, y } = place(i)
        const isKey = step.keyPos === i
        const isCompare = step.compare && step.compare.includes(i)
        let fill = 'var(--bg)'
        let stroke = 'var(--border)'
        if (isCompare) {
          fill = 'var(--accent-bg)'
          stroke = 'var(--accent)'
        }
        if (isKey || (isCompare && step.swapping)) {
          fill = 'var(--sticky)'
          stroke = 'var(--sticky-border)'
        }
        return (
          <g key={item.id}>
            <circle cx={x} cy={y} r="16" fill={fill} stroke={stroke} strokeWidth={isCompare || isKey ? 2 : 1} />
            <text x={x} y={y + 5} fontSize="14" fontWeight="600" textAnchor="middle" fill="var(--text-h)">{item.value}</text>
          </g>
        )
      })}
    </svg>
  )
}

// The list as isometric cubes: the cube being checked floats up and turns
// blue, cubes already ruled out fade, and a match turns green.
function IsoStage({ step }) {
  const values = step.array.map((item) => item.value)
  const current = step.compare ? step.compare[0] : null
  const found = step.foundAt ?? null
  const states = values.map((_, i) => {
    if (found === i) return 'found'
    if (current === i) return 'active'
    if ((step.visited ?? []).includes(i)) return 'checked'
    return 'plain'
  })
  const spot = found ?? current

  return <IsoRow values={values} states={states} lifted={spot} marker={spot} target={step.target} />
}

// A tree being searched, with the queue or stack of nodes still waiting. The
// node being looked at is blue, waiting nodes are yellow, nodes already looked
// at are grey and numbered in the order they were reached, and a match is green.
//
// The waiting list is a 'queue' (BFS), a 'stack' (DFS) or the 'calls' that are
// open in a recursive walk. A step with an `output` list also shows what has
// been printed so far.
//
// With no `frontier` there is no waiting list at all, just a single walk down
// the tree (searching or inserting in a search tree).
function TreeStage({ step }) {
  const kind = step.frontierKind
  const frontier = step.frontier
  const isQueue = kind === 'queue'
  const isCalls = kind === 'calls'
  const listName = isQueue ? 'Queue' : isCalls ? 'Call stack' : 'Stack'
  // Ids are what identify a node; its label can change (e.g. a search tree
  // delete copies a value into a node).
  const labelOf = (id) => step.slotLabels?.[id] ?? step.tree.nodes.find((node) => node.id === id)?.label ?? id
  const states = {}
  const order = {}
  step.order.forEach((id, i) => {
    states[id] = 'checked'
    order[id] = step.badges?.[id] ?? i + 1
  })
  Object.assign(order, step.marks)
  frontier?.forEach((id) => {
    states[id] = 'queued'
  })
  step.good?.forEach((id) => {
    states[id] = 'found'
  })
  if (step.pending) states[step.pending] = 'pending'
  if (step.current) states[step.current] = 'active'
  step.bad?.forEach((id) => {
    states[id] = 'bad'
  })
  if (step.foundAt) states[step.foundAt] = 'found'
  Object.assign(states, step.states)
  const next = isQueue ? 0 : (frontier?.length ?? 0) - 1 // the slot that comes out next

  return (
    <>
      <TreeView
        className="tracer-tree"
        tree={step.tree}
        states={states}
        order={order}
        rings={step.rings}
        hotEdges={step.hotEdges}
        ariaLabel={`A tree of ${step.tree.nodes.length} nodes. Visited so far, in order: ${step.order.map(labelOf).join(', ') || 'none'}.${frontier ? ` ${listName}: ${frontier.map(labelOf).join(', ') || 'empty'}.` : ''}`}
      />
      {step.legend ? (
        <Legend items={step.legend} />
      ) : (
        <ul className="visual-legend">
          <li><span className="swatch" style={{ background: '#8aa8ea' }} /> {isCalls ? 'the call running now' : 'looking at now'}</li>
          {frontier && <li><span className="swatch" style={{ background: '#ffe27a' }} /> {isCalls ? 'a call waiting on the stack' : 'waiting its turn'}</li>}
          {step.doneLabel !== false && <li><span className="swatch" style={{ background: '#e4e4e2' }} /> {step.doneLabel ?? (frontier && !isCalls ? 'done (numbered in order)' : 'passed (numbered in order)')}</li>}
          {(!isCalls || step.foundLabel) && <li><span className="swatch" style={{ background: '#86d69f' }} /> {step.foundLabel ?? 'the match'}</li>}
          {step.pendingLabel && <li><span className="swatch" style={{ background: '#fff3bf', border: '1px dashed #b8912a' }} /> {step.pendingLabel}</li>}
          {step.good?.length > 0 && <li><span className="swatch" style={{ background: '#86d69f' }} /> {step.goodLabel ?? 'done'}</li>}
          {step.bad?.length > 0 && <li><span className="swatch" style={{ background: '#f2a5a5' }} /> {step.badLabel ?? 'out of place'}</li>}
          {step.markLabel && <li>{step.markLabel}</li>}
        </ul>
      )}
      {frontier && (
        <>
          <div className="tracer-frontier" aria-label={listName}>
            <span className="tracer-frontier-name">{listName}</span>
            <div className="tracer-frontier-slots">
              {frontier.length === 0 && <span className="tracer-var-empty">empty</span>}
              {frontier.map((id, i) => (
                <span key={i} className={`tracer-slot${i === next ? ' next' : ''}`}>{labelOf(id)}</span>
              ))}
            </div>
          </div>
          <p className="tracer-frontier-hint">
            {isQueue && 'The left end is next out. New nodes join on the right.'}
            {kind === 'stack' && 'The right end (the top) is next out. New nodes go on top.'}
            {isCalls && 'The right end is the call running right now. A new call goes on the end and comes off when it returns.'}
          </p>
        </>
      )}
      {step.output && (
        <div className="tracer-frontier" aria-label="Output">
          <span className="tracer-frontier-name">Output</span>
          <div className="tracer-frontier-slots">
            {step.output.length === 0 && <span className="tracer-var-empty">nothing printed yet</span>}
            {step.output.map((value, i) => (
              <span key={i} className="tracer-slot out">{value}</span>
            ))}
          </div>
        </div>
      )}
      <Strips strips={step.strips} />
    </>
  )
}

// The colour key under a picture: [{ color, text }].
function Legend({ items }) {
  return (
    <ul className="visual-legend">
      {items.map((item) => (
        <li key={item.text}><span className="swatch" style={{ background: item.color }} /> {item.text}</li>
      ))}
    </ul>
  )
}

// Rows of slots: [{ name, items, next?, kind?, wide?, hint? }].
function Strips({ strips }) {
  return strips?.map((strip) => (
    <div key={strip.name}>
      <div className="tracer-frontier" aria-label={strip.name}>
        <span className="tracer-frontier-name">{strip.name}</span>
        <div className="tracer-frontier-slots">
          {strip.items.length === 0 && <span className="tracer-var-empty">empty</span>}
          {strip.items.map((item, i) => (
            <span key={i} className={`tracer-slot${strip.kind ? ` ${strip.kind}` : ''}${strip.wide ? ' wide' : ''}${i === strip.next ? ' next' : ''}`}>{item}</span>
          ))}
        </div>
      </div>
      {strip.hint && <p className="tracer-frontier-hint">{strip.hint}</p>}
    </div>
  ))
}

// A grid world of isometric tiles being searched (see IsoGrid), with the
// usual rows of slots underneath.
//   map: { rows, cols, start, goal, walls }, closed: tiles already expanded,
//   open: tiles waiting in the heap, current: the tile being expanded,
//   looking: the tile being checked (a pointer floats over it), route: tiles
//   on the finished route, labels: { 'row,col': text } for the tiles,
//   previous: { 'row,col': [row, col] } where each tile was reached from,
//   strips and legend as for the graph view. A switch above the picture draws
//   the same map as a graph: a dot per open tile, a line between touching tiles.
function GridStage({ step }) {
  const { map, closed, open, current, looking, route, labels, previous } = step
  const [view, setView] = useState('tiles')
  const graph = view === 'graph'

  return (
    <>
      <GridViewToggle value={view} onChange={setView} />
      <IsoGrid
        rows={map.rows}
        cols={map.cols}
        cell={searchCell({ map, closed, open, current, route, labels })}
        marker={looking}
        graphable
        mode={view}
        edge={searchEdges({ previous, route, current, looking })}
        ariaLabel={`A ${map.rows} by ${map.cols} grid of tiles, drawn as ${graph ? 'a graph of dots and lines' : 'isometric tiles'}, with ${map.walls.length} walls. ${closed.length} tiles expanded, ${open.length} waiting in the heap.${route ? ` The route found is ${route.length - 1} steps long.` : ''}`}
      />
      <Legend items={graph ? [...step.legend.filter((item) => item.text !== 'wall'), { color: '#5cb878', text: 'green line: where a tile was reached from' }] : step.legend} />
      <Strips strips={step.strips} />
    </>
  )
}

// A graph being built edge by edge, with the same graph written down as an
// adjacency list and as an adjacency matrix. Only the first `shown` edges are
// drawn; the one at `active` is the edge being added right now.
//   graph, shown, active (index or null), adj ({ node: [neighbours] } or null
//   before it exists), matrix (rows of 0 / 1 or null), hot: { cell: [row, col],
//   chip: [node, position] } the entries that just changed.
// Optional: leave adj and matrix out to skip the list and grid, directed:
//   false for lines instead of arrows, nodeStates: { id: state } to colour
//   nodes yourself, edgeStates: { edgeKey: state } likewise for edges, marks:
//   { id: text } a badge on each node, chips: [{ label, value, hot }] a
//   labelled row of values, strips: [{ name, items, next?, kind?, hint? }]
//   rows of slots such as a queue (next is the slot that comes out first) or a
//   visited set (kind: 'seen' for grey slots, 'out' for green ones, wide: true
//   for slots that hold more than a character or two), legend: [{ color, text }].
//   Edges with a `weight` are drawn with their cost.
function GraphStage({ step }) {
  const { graph, shown, active, adj, matrix, hot = {} } = step
  const edgeStates = {}
  const nodeStates = {}
  if (active !== null) {
    const edge = graph.edges[active]
    edgeStates[edgeKey(edge)] = 'active'
    nodeStates[edge.from] = 'active'
    nodeStates[edge.to] = step.directed === false ? 'active' : 'queued'
  }
  Object.assign(nodeStates, step.nodeStates)
  Object.assign(edgeStates, step.edgeStates)
  const legend = step.legend ?? [
    { color: '#8aa8ea', text: 'u: where the edge starts' },
    { color: '#ffe27a', text: 'v: where it points' },
  ]

  return (
    <>
      <GraphView
        className="tracer-graph"
        graph={graph}
        edges={graph.edges.slice(0, shown)}
        directed={step.directed !== false}
        nodeStates={nodeStates}
        edgeStates={edgeStates}
        nodeMarks={step.marks}
        ariaLabel={`A ${step.directed === false ? 'graph' : 'directed graph'} with ${graph.nodes.length} nodes and ${shown} of its ${graph.edges.length} edges drawn so far.`}
      />
      <Legend items={legend} />
      <Strips strips={step.strips} />
      {step.chips && (
        <div className="graph-chips">
          {step.chips.map((chip) => (
            <span key={chip.label} className={`graph-chip wide${chip.hot ? ' hot' : ''}`}><i>{chip.label}</i>{chip.value}</span>
          ))}
        </div>
      )}
      {(adj !== undefined || matrix !== undefined) && <GraphStore graph={graph} adj={adj} matrix={matrix} hot={hot} diagonal={step.directed === false} />}
    </>
  )
}

// A B-tree: boxes of several keys, with the open calls of a recursive search
// or insert listed underneath.
//   tree: as drawn by BTreeView, frontier: ids of the open calls (the running
//   call last), current / bad / fresh: ids drawn blue / red / green, order:
//   ids of nodes already read (numbered), hot: { id: [key positions] } shown
//   green, legend: [{ color, text }] for the key, carry: text for something
//   being handed back up to the caller.
function BTreeStage({ step }) {
  const labelOf = (id) => {
    const node = step.tree.nodes.find((n) => n.id === id)
    return node ? node.keys.join(' ') : id
  }
  const states = {}
  const marks = {}
  step.frontier.forEach((id) => {
    states[id] = 'queued'
  })
  step.order.forEach((id, i) => {
    states[id] = 'checked'
    marks[id] = i + 1
  })
  if (step.current) states[step.current] = 'active'
  step.bad?.forEach((id) => {
    states[id] = 'bad'
  })
  step.fresh?.forEach((id) => {
    states[id] = 'found'
  })

  return (
    <>
      <BTreeView
        className="tracer-tree tracer-btree"
        tree={step.tree}
        states={states}
        marks={marks}
        hot={step.hot}
        ariaLabel={`A B-tree with ${step.tree.nodes.length} nodes: ${step.tree.nodes.map((n) => `[${n.keys.join(' ')}]`).join(' ')}. Open calls: ${step.frontier.map(labelOf).join(', ') || 'none'}.`}
      />
      <ul className="visual-legend">
        {step.legend.map((item) => (
          <li key={item.text}><span className="swatch" style={{ background: item.color }} /> {item.text}</li>
        ))}
      </ul>
      <div className="tracer-frontier" aria-label="Call stack">
        <span className="tracer-frontier-name">Call stack</span>
        <div className="tracer-frontier-slots">
          {step.frontier.length === 0 && <span className="tracer-var-empty">empty</span>}
          {step.frontier.map((id, i) => (
            <span key={i} className={`tracer-slot wide${i === step.frontier.length - 1 ? ' next' : ''}`}>{labelOf(id)}</span>
          ))}
        </div>
      </div>
      <p className="tracer-frontier-hint">
        Each slot is a node being worked on. The right end is the call running right now.
      </p>
      {step.carry && <p className="tracer-carry"><strong>Handed up to the caller:</strong> {step.carry}</p>}
    </>
  )
}

// A Fenwick tree as bars above the array it adds up (see FenwickView).
//   fen: { n, values, tree, states, cells } as for FenwickView,
//   legend: [{ color, text }], bits: [{ label, value, dim? }] numbers shown in
//   binary under the picture (bitsWidth: how many digits), strips: rows of slots
//   as for the graph view (e.g. the sums added so far).
function FenwickStage({ step }) {
  const { n, values, tree, states, cells } = step.fen

  return (
    <>
      <FenwickView n={n} values={values} tree={tree} states={states} cells={cells} />
      {step.legend && <Legend items={step.legend} />}
      {step.bits && <Bits rows={step.bits} width={step.bitsWidth} />}
      <Strips strips={step.strips} />
    </>
  )
}

// The sorted suffixes of a word, one per row (see SuffixRows).
//   sfx: { rows, tags, header, mode } as for SuffixRows, legend: [{ color, text }],
//   strips: rows of slots as for the graph view.
function SuffixStage({ step }) {
  const { rows, tags, header, mode } = step.sfx

  return (
    <>
      <SuffixRows rows={rows} tags={tags} header={header} mode={mode} />
      {step.legend && <Legend items={step.legend} />}
      <Strips strips={step.strips} />
    </>
  )
}

// Plays a precomputed list of steps: the line of code that is running on one
// side, and the list (as bars) with its variables on the other.
//
// step = {
//   line: index into `code`,
//   array: [{ id, value }] in current order (id never changes, so bars slide),
//   compare: [i, j] | null, swapping: boolean,
//   sortedFrom: bars at this position or later are locked in (right side),
//   sortedUntil: bars before this position are locked in (left side),
//   keyPos: position of a bar being held out of the list, drawn lifted,
//   sortedRanges: [[from, to], ...] blocks that are sorted, drawn green,
//   range: [from, to] the part being worked on; bars outside it are dimmed,
//   pointers: [{ pos, label, tone: 'left' | 'right' }] markers drawn under the bars,
//   heapSize: when set, the first heapSize items are also drawn as a binary tree,
//   (iso view) visited: indices already checked, foundAt: index of the match,
//   target: the value being looked for,
//   (tree view) tree: { width, height, nodes, edges } as drawn by TreeView,
//     frontier: ids waiting in the queue or stack (next out first for a queue,
//     last for a stack) or open calls (the running call last),
//     frontierKind: 'queue' | 'stack' | 'calls', order: ids looked at
//     so far, current: id being looked at, pending: id about to be added,
//     foundAt: id of the match, output: values printed so far (optional),
//     badges: { id: text } shown on the nodes in `order` instead of their
//     position in it, doneLabel: legend text for those nodes (optional, false
//     leaves it out),
//     foundLabel / pendingLabel: legend text for the green / dashed node,
//     marks: { id: text } a small badge on any node (e.g. its balance factor),
//     markLabel: legend text for them, bad: ids drawn red (e.g. out of
//     balance), badLabel: legend text for those, rings: ids drawn with a
//     second outer ring (e.g. where a word ends in a trie), good: ids drawn
//     green (goodLabel: legend text; unlike foundAt there can be several),
//     slotLabels: { id: text } to show in the waiting list instead of a
//     node's label, states: { id: state } to colour nodes yourself (applied
//     last, any state TreeView knows, e.g. 'grp1'), legend: [{ color, text }]
//     to replace the colour key, strips: rows of slots under the tree (as for
//     the graph view), hotEdges: ['parentId-childId'] edges drawn thick (an
//     edge in tree.edges can carry text as a third item, e.g. letters),
//     leave `frontier` out for a single walk down with no waiting list,
//     (array can be left empty),
//   vars: { name: value }, note: string
// }
// `view` is 'bars' (default), 'iso' (a row of isometric cubes, for searching)
// 'tree' (a tree with its queue or stack, for BFS and DFS) or 'btree' (boxes
// of several keys, for B-trees; see BTreeStage for its step fields) or 'graph'
// (a graph drawn beside its adjacency list and matrix; see GraphStage) or
// 'isogrid' (isometric tiles being searched; see GridStage) or 'fenwick' (a
// Fenwick tree as bars over its array; see FenwickStage) or 'suffix' (the
// sorted suffixes of a word, one per row; see SuffixStage).
// buildSteps(values, preset) receives the chosen preset too, e.g. for a target.
function CodeTracer({ code, presets, buildSteps, view = 'bars' }) {
  const [presetIndex, setPresetIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)

  const steps = useMemo(
    () => buildSteps(presets[presetIndex].values, presets[presetIndex]),
    [buildSteps, presets, presetIndex],
  )
  const last = steps.length - 1
  const step = steps[stepIndex]
  const speed = speeds[speedIndex]
  const isPlaying = playing && stepIndex < last

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = setTimeout(
      () => setStepIndex((i) => Math.min(i + 1, last)),
      speed.ms,
    )
    return () => clearTimeout(timer)
  }, [isPlaying, stepIndex, last, speed.ms])

  const choosePreset = (index) => {
    setPresetIndex(index)
    setStepIndex(0)
    setPlaying(false)
  }

  const togglePlay = () => {
    if (stepIndex >= last) {
      setStepIndex(0)
      setPlaying(true)
    } else {
      setPlaying((p) => !p)
    }
  }

  const stepBy = (delta) => {
    setPlaying(false)
    setStepIndex((i) => Math.max(0, Math.min(last, i + delta)))
  }

  const reset = () => {
    setPlaying(false)
    setStepIndex(0)
  }

  // Sized over every step, so a value added later (a heap push) still fits.
  const maxValue = Math.max(...steps.flatMap((s) => s.array.map((item) => item.value)))
  const count = step.array.length
  const barWidth = count > 7 ? 34 : 44
  const barGap = count > 7 ? 8 : 10
  const hasPointers = steps.some((s) => s.pointers)
  const pointers = (step.pointers ?? []).filter((p) => p.pos >= 0 && p.pos < count)
  const bars = step.array
    .map((item, pos) => ({ ...item, pos }))
    .sort((a, b) => a.id - b.id)
  const width = count * (barWidth + barGap) - barGap
  const transitionMs = Math.min(380, speed.ms * 0.6)
  const varEntries = Object.entries(step.vars)

  return (
    <div className="tracer">
      <div className="tracer-presets" role="group" aria-label="Starting list">
        <span className="tracer-label">Start with:</span>
        {presets.map((preset, index) => (
          <button
            key={preset.label}
            type="button"
            className={`tracer-chip${index === presetIndex ? ' active' : ''}`}
            onClick={() => choosePreset(index)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="tracer-body">
        <div className="tracer-code" aria-label="Code being traced">
          {code.map((text, index) => (
            <div
              key={index}
              className={`tracer-line${index === step.line ? ' active' : ''}`}
              aria-current={index === step.line ? 'step' : undefined}
            >
              <span className="tracer-ln">{index + 1}</span>
              <span className="tracer-src">{text}</span>
            </div>
          ))}
        </div>

        <div className="tracer-stage">
          {view === 'iso' ? (
            <IsoStage step={step} />
          ) : view === 'tree' ? (
            <TreeStage step={step} />
          ) : view === 'btree' ? (
            <BTreeStage step={step} />
          ) : view === 'graph' ? (
            <GraphStage step={step} />
          ) : view === 'isogrid' ? (
            <GridStage step={step} />
          ) : view === 'fenwick' ? (
            <FenwickStage step={step} />
          ) : view === 'suffix' ? (
            <SuffixStage step={step} />
          ) : (
            <div
              className="tracer-bars"
              style={{ width, height: hasPointers ? 214 : 178, '--move-ms': `${transitionMs}ms` }}
            >
              {bars.map((bar) => {
                const isKey = step.keyPos === bar.pos
                const isCompare = step.compare && step.compare.includes(bar.pos)
                const isSorted =
                  bar.pos >= (step.sortedFrom ?? Infinity) ||
                  (bar.pos < (step.sortedUntil ?? 0) && !isKey) ||
                  (step.sortedRanges ?? []).some(([from, to]) => bar.pos >= from && bar.pos <= to)
                const isDim = step.range && (bar.pos < step.range[0] || bar.pos > step.range[1])
                let state = ''
                if (isKey) state = ' holding'
                else if (isCompare) state = step.swapping ? ' swapping' : ' comparing'
                else if (isSorted) state = ' sorted'
                const height = BAR_MIN + (bar.value / maxValue) * BAR_RANGE
                const lift = isKey ? -14 : 0
                return (
                  <div
                    key={bar.id}
                    className={`tracer-bar${state}${isDim ? ' dim' : ''}`}
                    style={{
                      height,
                      width: barWidth,
                      transform: `translate(${bar.pos * (barWidth + barGap)}px, ${lift}px)`,
                    }}
                  >
                    {bar.value}
                  </div>
                )
              })}
              {step.array.map((_, pos) => (
                <span
                  key={pos}
                  className="tracer-index"
                  style={{ width: barWidth, transform: `translateX(${pos * (barWidth + barGap)}px)` }}
                >
                  {pos}
                </span>
              ))}
              {pointers.map((pointer) => (
                <span
                  key={pointer.tone}
                  className={`tracer-pointer ${pointer.tone}`}
                  style={{ width: barWidth, transform: `translateX(${pointer.pos * (barWidth + barGap)}px)` }}
                >
                  &#9650; {pointer.label}
                </span>
              ))}
            </div>
          )}

          {step.heapSize !== undefined && <HeapTree step={step} total={count} />}

          <div className="tracer-vars" aria-label="Variables">
            {varEntries.length === 0 && <span className="tracer-var-empty">no variables yet</span>}
            {varEntries.map(([name, value]) => (
              <span key={name} className="tracer-var">
                <code>{name}</code> = <strong>{String(value)}</strong>
              </span>
            ))}
          </div>

          <p className="tracer-note" aria-live="polite">{step.note}</p>
        </div>
      </div>

      <div className="tracer-controls">
        <button type="button" className="tracer-btn primary" onClick={togglePlay}>
          {isPlaying ? 'Pause' : stepIndex >= last ? 'Replay' : 'Play'}
        </button>
        <button type="button" className="tracer-btn" onClick={() => stepBy(-1)} disabled={stepIndex === 0}>
          Back
        </button>
        <button type="button" className="tracer-btn" onClick={() => stepBy(1)} disabled={stepIndex >= last}>
          Step
        </button>
        <button type="button" className="tracer-btn" onClick={reset} disabled={stepIndex === 0}>
          Reset
        </button>
        <input
          className="tracer-scrub"
          type="range"
          min="0"
          max={last}
          value={stepIndex}
          aria-label="Step"
          onChange={(event) => {
            setPlaying(false)
            setStepIndex(Number(event.target.value))
          }}
        />
        <span className="tracer-count">
          {stepIndex + 1} / {steps.length}
        </span>
        <label className="tracer-speed">
          Speed
          <select value={speedIndex} onChange={(event) => setSpeedIndex(Number(event.target.value))}>
            {speeds.map((s, index) => (
              <option key={s.label} value={index}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export default CodeTracer
