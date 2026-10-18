import GraphView from '../../components/GraphView.jsx'
import { StepDots, useLoop } from './loopHooks.jsx'

// The key of the edge from `from` to `to`, as GraphView's edgeStates uses it.
export const E = (from, to) => `${from}>${to}`

// A looping animation made of frames: a graph, a one-line caption and step
// dots to jump between frames. Each frame says:
//   caption, show (keys of the edges to draw; all of them if left out),
//   extra (edges that are not in the graph, e.g. a ghost edge), directed,
//   nodes / edges (states), marks (badges on nodes).
// legend: optional [{ color, text }] shown under the graph.
export function GraphFrames({ frames, graph, ms, ariaLabel, r = 18, legend }) {
  const [tick, setTick] = useLoop(frames.length, ms)
  const frame = frames[tick]
  const shown = frame.show ?? graph.edges.map((edge) => E(edge.from, edge.to))
  const edges = [...graph.edges.filter((edge) => shown.includes(E(edge.from, edge.to))), ...(frame.extra ?? [])]

  return (
    <div className="visual-card">
      <GraphView
        graph={graph}
        edges={edges}
        directed={frame.directed ?? false}
        r={r}
        nodeStates={frame.nodes}
        edgeStates={frame.edges}
        nodeMarks={frame.marks}
        ariaLabel={ariaLabel}
      />
      {legend && (
        <ul className="visual-legend">
          {legend.map((item) => (
            <li key={item.text}><span className="swatch" style={{ background: item.color }} /> {item.text}</li>
          ))}
        </ul>
      )}
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={frames.length} tick={tick} onPick={setTick} />
    </div>
  )
}
