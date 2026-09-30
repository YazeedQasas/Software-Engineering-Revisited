import { useState } from 'react'

const complexityOptions = [
  'O(1)',
  'O(log n)',
  'O(√n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(2ⁿ)',
  'O(n!)',
]

function shuffled(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function OptionRow({ label, correct, guess, revealed, onGuess }) {
  const answered = guess !== null || revealed

  return (
    <div className="quiz-option-row">
      <span className="quiz-option-label">{label}</span>
      <div className="quiz-option-buttons">
        {complexityOptions.map((option) => {
          const isCorrect = option === correct
          const isGuess = option === guess
          let className = 'option-chip'
          if (answered) {
            if (isCorrect) className += ' correct'
            else if (isGuess) className += ' incorrect'
            else className += ' muted'
          }
          return (
            <button
              key={option}
              type="button"
              className={className}
              disabled={answered}
              onClick={() => onGuess(option)}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function QuizCard({ prompt, time, space, explanation }) {
  const [timeGuess, setTimeGuess] = useState(null)
  const [spaceGuess, setSpaceGuess] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const answered = revealed || (timeGuess !== null && spaceGuess !== null)

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <p className="quiz-prompt">{prompt}</p>
        {!answered && (
          <button
            type="button"
            className="quiz-reveal"
            onClick={() => setRevealed(true)}
          >
            Show answer
          </button>
        )}
      </div>
      <OptionRow
        label="Time"
        correct={time}
        guess={timeGuess}
        revealed={revealed}
        onGuess={setTimeGuess}
      />
      <OptionRow
        label="Space"
        correct={space}
        guess={spaceGuess}
        revealed={revealed}
        onGuess={setSpaceGuess}
      />
      {answered && <p className="quiz-explanation">{explanation}</p>}
    </div>
  )
}

function ComplexityQuiz({ examples }) {
  const [items] = useState(() => shuffled(examples))

  return (
    <div className="quiz-grid">
      {items.map((example) => (
        <QuizCard key={example.id} {...example} />
      ))}
    </div>
  )
}

export default ComplexityQuiz
