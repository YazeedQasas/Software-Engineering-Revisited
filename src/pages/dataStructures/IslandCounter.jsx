import { useEffect, useMemo, useState } from 'react'
import '../../components/CodeTracer.css' // the .tracer-btn buttons
import './IslandCounter.css'
import { DEFAULT_GRID, START_MESSAGE, buildSteps, describe, replay } from './islandSteps.js'

const PLAY_MS = 600

// Water is blue-ish, land that has not been reached is grey, and every island gets
// its own colour once the flood fill has reached it.
const WATER = '#cfe3f7'
const UNSEEN_LAND = '#d4d4d2'
const ISLAND_COLOURS = ['#86d69f', '#ffe27a', '#e1c7f2', '#fbd0a5', '#bfe8e0', '#f2a5a5', '#bcd2f7', '#d9e98a']
const colourOf = (island) => ISLAND_COLOURS[(island - 1) % ISLAND_COLOURS.length]

// A step-through of the "count islands" algorithm. The component only remembers
// which step it is on: the picture, the counter and the message are all worked
// out again from steps[0..index] (see islandSteps.js).
//   Next step / Right arrow / Space (when the box has the focus): one step on
//   Play / Pause: a step every 0.6 seconds, stopping at the end
//   Reset: back to the start
function IslandCounter({ grid = DEFAULT_GRID }) {
  const steps = useMemo(() => buildSteps(grid), [grid])
  const [index, setIndex] = useState(-1) // -1: no step has happened yet
  const [playing, setPlaying] = useState(false)

  const last = steps.length - 1
  const atEnd = index >= last
  const running = playing && !atEnd
  const state = useMemo(() => replay(grid, steps, index), [grid, steps, index])
  const rows = grid.length
  const cols = Math.max(0, ...grid.map((row) => row.length))
  const total = steps.filter((step) => step.type === 'new').length

  // Every message the steps can show, laid out invisibly in the same spot, so the
  // box is as tall as the longest one and the page does not move as it changes.
  const messages = useMemo(() => [START_MESSAGE, ...steps.map((step, i) => describe(step, { last: i === steps.length - 1, total }))], [steps, total])

  useEffect(() => {
    if (!running) return undefined
    const timer = setTimeout(() => setIndex((i) => Math.min(i + 1, last)), PLAY_MS)
    return () => clearTimeout(timer)
  }, [running, index, last])

  const next = () => {
    setPlaying(false)
    setIndex((i) => Math.min(i + 1, last))
  }
  const togglePlay = () => {
    if (running) {
      setPlaying(false)
    } else {
      if (atEnd) setIndex(-1)
      setPlaying(true)
    }
  }
  const reset = () => {
    setPlaying(false)
    setIndex(-1)
  }

  // Right arrow anywhere in the box; Space too, except on a button (where it
  // already presses that button).
  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || (event.key === ' ' && event.target.tagName !== 'BUTTON')) {
      event.preventDefault()
      if (!atEnd) next()
    }
  }

  return (
    <div className="visual-card island-counter" tabIndex={0} role="group" aria-label="Counting islands, step by step. Press Space or the right arrow for the next step." onKeyDown={onKeyDown}>
      <div className="island-bar">
        <p className="island-count" aria-live="polite">Islands: <strong>{state.count}</strong></p>
        <p className="island-step">{steps.length === 0 ? 'No steps' : `Step ${Math.max(index + 1, 0)} / ${steps.length}`}</p>
      </div>

      {cols > 0 && (
        <div
          className="island-grid"
          style={{ '--cols': cols }}
          role="img"
          aria-label={`A ${rows} by ${cols} grid of land and water. ${state.count} ${state.count === 1 ? 'island' : 'islands'} found so far.`}
        >
          {state.cells.flatMap((row, r) =>
            row.map((cell, c) => {
              const current = state.current && state.current[0] === r && state.current[1] === c
              return (
                <span
                  key={`${r},${c}`}
                  className={`island-cell${current ? ' current' : ''}`}
                  style={{ background: !cell.land ? WATER : cell.island ? colourOf(cell.island) : UNSEEN_LAND }}
                >
                  {cell.land ? 1 : 0}
                </span>
              )
            }),
          )}
        </div>
      )}

      <div style={{ display: 'grid' }}>
        {messages.map((text, i) => (
          <p key={i} className="visual-caption" aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden' }}>{text}</p>
        ))}
        <p className="visual-caption" aria-live="polite" style={{ gridArea: '1 / 1' }}>{state.message}</p>
      </div>

      <div className="island-controls">
        <button type="button" className="tracer-btn" onClick={next} disabled={atEnd}>Next step</button>
        <button type="button" className="tracer-btn primary" onClick={togglePlay} disabled={steps.length === 0}>
          {running ? 'Pause' : atEnd && steps.length > 0 ? 'Replay' : 'Play'}
        </button>
        <button type="button" className="tracer-btn" onClick={reset} disabled={index === -1 && !playing}>Reset</button>
      </div>

      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: WATER }} /> water</li>
        <li><span className="swatch" style={{ background: UNSEEN_LAND }} /> land not reached yet</li>
        <li><span className="swatch" style={{ background: ISLAND_COLOURS[0] }} /><span className="swatch" style={{ background: ISLAND_COLOURS[1] }} /><span className="swatch" style={{ background: ISLAND_COLOURS[2] }} /> land in an island (one colour each)</li>
        <li><span className="swatch island-swatch-current" /> the cell of this step</li>
      </ul>
    </div>
  )
}

export default IslandCounter
