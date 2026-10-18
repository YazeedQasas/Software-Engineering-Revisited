import { useEffect, useState } from 'react'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Ticks a counter round and round, unless the person prefers no motion.
// Returns [tick, setTick] so the step dots can jump to a frame.
export function useLoop(length, ms) {
  const [tick, setTick] = useState(0)
  const still = reducedMotion()
  useEffect(() => {
    if (still) return undefined
    const timer = setInterval(() => setTick((t) => (t + 1) % length), ms)
    return () => clearInterval(timer)
  }, [still, length, ms])
  return [tick, setTick]
}

// A row of dots under a looping animation: the current frame is filled in,
// and clicking a dot jumps to that frame.
export function StepDots({ count, tick, onPick }) {
  return (
    <div className="visual-dots" role="group" aria-label="Pick a step of the animation">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={i === tick ? 'on' : ''}
          aria-label={`Step ${i + 1} of ${count}`}
          aria-current={i === tick ? 'step' : undefined}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  )
}
