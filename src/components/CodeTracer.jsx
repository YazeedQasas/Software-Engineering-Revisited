import { useEffect, useMemo, useState } from 'react'
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
//   vars: { name: value }, note: string
// }
function CodeTracer({ code, presets, buildSteps }) {
  const [presetIndex, setPresetIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)

  const steps = useMemo(
    () => buildSteps(presets[presetIndex].values),
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

  const maxValue = Math.max(...steps[0].array.map((item) => item.value))
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
