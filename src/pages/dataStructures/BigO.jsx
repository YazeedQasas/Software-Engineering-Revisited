import { useState } from 'react'
import bigOChart from '../../assets/image.png'
import {
  GrowthVsSpeedVisual,
  BoundsVisual,
  DominantTermVisual,
  AmortizedCostVisual,
} from './BigOVisuals.jsx'

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

function shuffled(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

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
  const [shuffledExamples] = useState(() => shuffled(examples))

  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Big-O Complexity</h2>

      <section className="notebook-section">
        <h3>What Is Big-O Notation?</h3>
        <p>
          Big-O notation describes how an algorithm&rsquo;s running time (or
          memory use) grows as its input size, n, grows &mdash; not the exact
          number of seconds or bytes it takes. It&rsquo;s a way to talk about{' '}
          <em>scalability</em>, independent of hardware, language, or how
          fast your machine happens to be today.
        </p>
        <div className="definition">
          In short: Big-O answers the question &ldquo;if I double the input,
          roughly how much more work does this do?&rdquo;
        </div>
      </section>

      <section className="notebook-section">
        <h3>Key Concepts</h3>

        <div className="concept-row">
          <div className="concept-text">
            <h4>It measures growth, not speed</h4>
            <p>
              An O(n) algorithm on a slow computer can easily run slower in
              wall-clock time than an O(n&sup2;) algorithm on a fast one for
              small inputs. Big-O only tells you how the work scales as n
              gets large &mdash; it says nothing about constant factors like
              CPU speed, so two algorithms with the same Big-O can still
              have very different real-world running times.
            </p>
          </div>
          <GrowthVsSpeedVisual />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Worst, average, and best case</h4>
            <p>
              Big-O most commonly describes the <strong>worst case</strong>{' '}
              &mdash; the most work an algorithm could do on the hardest
              possible input. Technically, worst/best/tight case have their
              own notation (Big-O for an upper bound, Big-Omega &Omega; for
              a best-case bound, Big-Theta &Theta; for a tight bound
              that&rsquo;s both), but in interviews &ldquo;Big-O&rdquo; is
              almost always used loosely to mean &ldquo;worst case,&rdquo;
              and that&rsquo;s a safe default unless you&rsquo;re asked
              otherwise.
            </p>
          </div>
          <BoundsVisual />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Drop constants and lower-order terms</h4>
            <p>
              O(2n), O(n + 100), and O(n) are all just <code>O(n)</code>.
              Once n gets large enough, constant multipliers and smaller
              terms stop mattering compared to the dominant term &mdash; so
              an algorithm that does 3n + 5 operations is still described
              as <code>O(n)</code>, not <code>O(3n + 5)</code>.
            </p>
          </div>
          <DominantTermVisual />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Amortized cost</h4>
            <p>
              Not every operation costs the same every time &mdash;{' '}
              <strong>amortized analysis</strong> looks at the average cost
              over a sequence of operations, not the worst single one.
              Example: appending to a dynamic array is usually{' '}
              <code>O(1)</code>, but occasionally the array is full and has
              to resize into new memory, copying every existing element
              &mdash; an <code>O(n)</code> hit. Because that resize happens
              rarely (capacity doubles each time), the cost of copying is
              spread out over all the cheap appends that came before it, so
              the <strong>amortized</strong> cost per append still works
              out to <code>O(1)</code>.
            </p>
          </div>
          <AmortizedCostVisual />
        </div>
      </section>

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
        <div className="quiz-grid">
          {shuffledExamples.map((example) => (
            <ComplexityExample key={example.id} {...example} />
          ))}
        </div>
      </section>
    </article>
  )
}

export default BigO
