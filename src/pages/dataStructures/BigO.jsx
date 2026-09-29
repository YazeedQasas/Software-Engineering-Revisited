import { useState } from 'react'
import bigOChart from '../../assets/image.png'

const cheatSheet = [
  { notation: 'O(1)', name: 'Constant', time: 'Array index access, hash map get/set', space: 'A fixed number of variables' },
  { notation: 'O(log n)', name: 'Logarithmic', time: 'Binary search', space: 'Recursive binary search call stack' },
  { notation: 'O(√n)', name: 'Root', time: 'Trial-division primality test', space: 'Usually O(1) extra space' },
  { notation: 'O(n)', name: 'Linear', time: 'Looping through an array once', space: 'Copying an array' },
  { notation: 'O(n log n)', name: 'Linearithmic', time: 'Merge sort, quicksort (average case)', space: "Merge sort's temporary arrays" },
  { notation: 'O(n²)', name: 'Quadratic', time: 'Nested loop comparing every pair', space: 'An n × n matrix' },
  { notation: 'O(2ⁿ)', name: 'Exponential', time: 'Naive recursive Fibonacci', space: 'Call stack of depth n' },
  { notation: 'O(n!)', name: 'Factorial', time: 'Generating every permutation', space: 'Storing every permutation' },
]

const examples = [
  {
    id: 'array-access',
    prompt: 'Accessing arr[5] in an array.',
    answer: 'O(1) time, O(1) space',
    explanation: 'Arrays support direct index access — one lookup, no matter how big the array is.',
  },
  {
    id: 'single-loop',
    prompt: 'Looping through every element of an n-element array once.',
    answer: 'O(n) time, O(1) space',
    explanation: 'Each element is visited exactly once; no extra memory grows with n.',
  },
  {
    id: 'binary-search',
    prompt: 'Binary search for a target in a sorted array of n elements.',
    answer: 'O(log n) time, O(1) space',
    explanation: 'Each comparison halves the search space; the iterative version uses no extra memory.',
  },
  {
    id: 'primality',
    prompt: 'Checking whether n is prime by testing divisors up to √n.',
    answer: 'O(√n) time, O(1) space',
    explanation: 'A factor larger than √n would need a matching factor smaller than √n, so you never need to check past it.',
  },
  {
    id: 'nested-loop',
    prompt: 'Comparing every pair of elements in an n-element array (nested loop).',
    answer: 'O(n²) time, O(1) space',
    explanation: 'The outer loop runs n times, and for each pass the inner loop runs n times too.',
  },
  {
    id: 'merge-sort',
    prompt: 'Merge sort on an n-element array.',
    answer: 'O(n log n) time, O(n) space',
    explanation: 'log n levels of splitting, each doing O(n) work to merge, plus O(n) temporary arrays.',
  },
  {
    id: 'fibonacci',
    prompt: 'Naive recursive Fibonacci, fib(n), with no memoization.',
    answer: 'O(2ⁿ) time, O(n) space',
    explanation: 'Each call branches into two more calls, so the call tree has ~2ⁿ nodes — but the call stack only ever goes n deep.',
  },
  {
    id: 'permutations',
    prompt: 'Generating every permutation of an n-element array.',
    answer: 'O(n!) time, O(n!) space to store them all',
    explanation: 'There are n! possible orderings, and producing each one costs work proportional to that count.',
  },
]

function ComplexityExample({ prompt, answer, explanation }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="quiz-card">
      <p className="quiz-prompt">{prompt}</p>
      {revealed ? (
        <div className="quiz-answer">
          <span className="quiz-answer-badge">{answer}</span>
          <p className="quiz-explanation">{explanation}</p>
        </div>
      ) : (
        <button
          type="button"
          className="quiz-reveal"
          onClick={() => setRevealed(true)}
        >
          Show answer
        </button>
      )}
    </div>
  )
}

function BigO() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Big-O Complexity</h2>

      <section className="notebook-section">
        <h3>Time Complexity</h3>
        <div className="pinned-photo">
          <img
            src={bigOChart}
            alt="Hand-drawn graph of time vs. input size (n) comparing Big-O growth curves, from best to worst: O(1), O(log n), O(√n), O(n), O(n log n), O(n²), O(2^n), O(n!)"
          />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Cheat Sheet</h3>
        <div className="table-wrap">
          <table className="bigo-table">
            <thead>
              <tr>
                <th>Notation</th>
                <th>Name</th>
                <th>Time example</th>
                <th>Space example</th>
              </tr>
            </thead>
            <tbody>
              {cheatSheet.map((row) => (
                <tr key={row.notation}>
                  <td>
                    <code>{row.notation}</code>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.time}</td>
                  <td>{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Test Yourself</h3>
        <p>Guess the time (and space) complexity before revealing the answer.</p>
        <div className="quiz-list">
          {examples.map((example) => (
            <ComplexityExample key={example.id} {...example} />
          ))}
        </div>
      </section>
    </article>
  )
}

export default BigO
