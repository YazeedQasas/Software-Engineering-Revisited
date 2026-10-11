import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import QuickSortTracer from './QuickSortTracer.jsx'
import { SplitsVisual, StepVisual } from './QuickSortVisuals.jsx'

const cases = [
  { name: 'Best case', input: 'every pivot lands in the middle', time: 'O(n log n)', why: 'Halving each time gives about log n levels of n work.' },
  { name: 'Average case', input: 'in random order', time: 'O(n log n)', why: 'Most pivots split reasonably, so the depth stays near log n.' },
  { name: 'Worst case', input: 'every pivot is the smallest or largest', time: 'O(n²)', why: 'Each pass peels off one item, so there are n levels of nearly n work. With the last item as pivot, sorted or backwards input does this.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(log n) typical, O(n) worst', why: 'Only the recursion stack. Lopsided splits stack up to n calls.' },
  { prop: 'In place', value: 'Yes', why: 'Items are swapped inside the same list; no copies.' },
  { prop: 'Stable', value: 'No', why: 'Swaps across the list can carry equal items past each other.' },
  { prop: 'Adaptive', value: 'No', why: 'It does not speed up on sorted input, and with a last-item pivot it is at its worst there.' },
  { prop: 'Pivot choice', value: 'last, random or median of three', why: 'Random or median-of-three pivots make the bad cases extremely unlikely.' },
]

const examples = [
  {
    id: 'partition',
    prompt: 'One partition step over a piece of n items: compare each to the pivot and swap the small ones to the left.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One pass through the piece, with swaps done in place.',
  },
  {
    id: 'balanced',
    prompt: 'Quick sort on n items when every pivot splits its piece into two equal halves.',
    time: 'O(n log n)',
    space: 'O(log n)',
    explanation: 'About log n levels of n work each, and the recursion is only log n deep.',
  },
  {
    id: 'random',
    prompt: 'Quick sort on a list of n items in random order (average case).',
    time: 'O(n log n)',
    space: 'O(log n)',
    explanation: 'Random order makes reasonably even splits likely.',
  },
  {
    id: 'sorted-last',
    prompt: 'Quick sort that picks the last item as pivot, on a list of n items that is already sorted.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'The last item is the largest, so each pass peels off one item: n levels of work, and n calls deep.',
  },
  {
    id: 'backwards-last',
    prompt: 'Quick sort that picks the last item as pivot, on a list of n items sorted in reverse.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'The last item is the smallest, which is just as lopsided as the largest.',
  },
  {
    id: 'random-pivot',
    prompt: 'Quick sort with a randomly chosen pivot, on a list of n items that is already sorted (expected case).',
    time: 'O(n log n)',
    space: 'O(log n)',
    explanation: 'A random pivot is rarely the smallest or largest, so already sorted input is no longer special.',
  },
  {
    id: 'all-equal',
    prompt: 'The simple quick sort shown here on a list of n items that are all equal.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Nothing is smaller than the pivot, so every pass peels off just one item, like sorted input.',
  },
  {
    id: 'builtin',
    prompt: 'Sorting the same n items with Python\'s built-in sorted().',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Timsort guarantees n log n and sorted() builds a new list.',
  },
]

function QuickSort() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Sorting Algorithms</p>
      <h2>Quick Sort</h2>
      <p>
        Merge sort splits the list the easy way and does the hard work when
        putting it back together. Quick sort flips that around: it does the
        hard work first, while splitting, so that nothing needs gluing back
        together afterwards. It is usually the fastest sorting algorithm in
        practice, and it comes with one famous catch.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Quick Sort &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A <strong>divide and conquer</strong> sort. Pick a <strong>pivot</strong>, move smaller items to its left and bigger ones to its right, then sort each side the same way.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Simple sorts are <code>O(n&sup2;)</code>.</li>
                <li>Merge sort is fast but needs <code>O(n)</code> extra memory. Quick sort sorts <em>in place</em>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>After partitioning, the pivot is in its <strong>final place</strong>, and nothing will ever cross it.</li>
                <li>So the two sides are independent problems, and no merge step is needed.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Pivot = the right-most item.</li>
                <li><strong>Two pointers:</strong> <code>left</code> walks right looking for something <strong>&ge; pivot</strong>; <code>right</code> walks left looking for something <strong>&lt; pivot</strong>.</li>
                <li>Swap the two items, and keep going until the pointers meet or cross.</li>
                <li>Swap the pivot with the first item of the right side. It is now in its final place.</li>
                <li>Repeat on the left side and the right side.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. The pivot decides everything</h4>
              <ul>
                <li>Even splits: about <code>log n</code> levels.</li>
                <li>Lopsided splits (pivot is the smallest or largest): about <code>n</code> levels.</li>
                <li>Fix: pick a random pivot, or the median of three.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Best and average: <code>O(n log n)</code>. Worst: <code>O(n&sup2;)</code>.</li>
                <li>Space: <code>O(log n)</code> stack (<code>O(n)</code> worst). In place.</li>
                <li><strong>Not</strong> stable.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>No guarantee: the worst case is quadratic.</li>
                <li>Not stable.</li>
                <li>Deep recursion on bad splits can overflow the stack.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You are sorting arrays in memory and want speed with little extra space.</li>
                <li>Stability does not matter.</li>
                <li>Many language libraries build on it (for example C&rsquo;s <code>qsort</code>); Python uses Timsort.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Last-item pivot on sorted or backwards input: quadratic.</li>
                <li>Many equal items can cause the same problem in this simple version.</li>
                <li>Base case <code>lo &gt;= hi</code>; recurse on <code>p &minus; 1</code> and <code>p + 1</code>, not <code>p</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Method, Step by Step</h3>
        <p>
          Let&rsquo;s sort <code>3 7 1 8 2 5 9 4 6</code> by hand. Follow the
          yellow pivot and the two pointers: <strong>left</strong> (blue,
          below the numbers) and <strong>right</strong> (red, above them).
        </p>

        <div className="concept-row">
          <div className="concept-text">
            <h4>1) Pick a pivot</h4>
            <p>
              Take the right-most number: here it is <strong>6</strong>.
              Every other number is going to be compared with it, to find
              out whether it belongs above the pivot or below it.
            </p>
          </div>
          <StepVisual rows={[{ values: [3, 7, 1, 8, 2, 5, 9, 4, 6], pivot: 8 }]} />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>2) Start two pointers</h4>
            <p>
              <strong>Left</strong> walks from the left towards the right,
              looking for the first number that is <strong>6 or more</strong>.
              It skips the 3 and stops at <strong>7</strong>.{' '}
              <strong>Right</strong> walks from the right towards the left,
              looking for the first number that is <strong>smaller than
              6</strong>. The 4 already qualifies, so it stops there. The
              7 is on the wrong side and so is the 4.
            </p>
          </div>
          <StepVisual
            rows={[
              {
                values: [3, 7, 1, 8, 2, 5, 9, 4, 6],
                pivot: 8,
                pointers: [
                  { index: 1, kind: 'left', text: '≥ 6?' },
                  { index: 7, kind: 'right', text: '< 6?' },
                ],
                swap: [1, 7],
              },
            ]}
          />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>3) Swap the two numbers</h4>
            <p>
              Swap the 7 and the 4. Now the small number sits on the left
              and the big number sits on the right, which is where each
              belongs.
            </p>
          </div>
          <StepVisual rows={[{ values: [3, 4, 1, 8, 2, 5, 9, 7, 6], pivot: 8, marked: [1, 7] }]} />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>4) Keep checking and swapping</h4>
            <p>
              Carry on from where the pointers stopped. Left moves past the
              1 and stops at <strong>8</strong>. Right moves past the 9 and
              stops at <strong>5</strong>. Swap them.
            </p>
            <p>
              Do it again, and the pointers meet in the middle: left stops
              at <strong>8</strong> and right stops at <strong>2</strong>,
              so right is now to the left of left. They have{' '}
              <strong>crossed</strong>, and that is the signal to stop. This
              crossing point is the &ldquo;middle&rdquo;: everything to its
              left is smaller than 6, everything to its right is 6 or more,
              and nothing is left to swap.
            </p>
          </div>
          <StepVisual
            rows={[
              {
                values: [3, 4, 1, 8, 2, 5, 9, 7, 6],
                pivot: 8,
                pointers: [
                  { index: 3, kind: 'left', text: '≥ 6?' },
                  { index: 5, kind: 'right', text: '< 6?' },
                ],
                swap: [3, 5],
                caption: 'left stops at 8, right stops at 5: swap them',
              },
              {
                values: [3, 4, 1, 5, 2, 8, 9, 7, 6],
                pivot: 8,
                marked: [3, 5],
                pointers: [
                  { index: 5, kind: 'left', text: '≥ 6?' },
                  { index: 4, kind: 'right', text: '< 6?' },
                ],
                dividers: [{ after: 4, label: 'mid' }],
                caption: 'the pointers have crossed: this is the middle',
              },
            ]}
          />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>5) Swap the pivot into the middle</h4>
            <p>
              Swap the <strong>first number of the right side</strong> (the
              8) with the pivot. The 6 now sits exactly between the numbers
              smaller than it and the numbers larger than it.
            </p>
            <p>
              This is the key moment: the 6 is in its{' '}
              <strong>final place</strong>. It is where it will be in the
              fully sorted list, so it never has to move again.
            </p>
          </div>
          <StepVisual
            rows={[
              {
                values: [3, 4, 1, 5, 2, 6, 9, 7, 8],
                pivot: 5,
                pivotText: 'Final place',
                dividers: [{ after: 4 }, { after: 5 }],
              },
            ]}
          />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>6) Do the same on the left side</h4>
            <p>
              The left side, <code>3 4 1 5 2</code>, is now its own small
              sorting problem, and the 6 and everything after it can be
              ignored. Its pivot is the right-most number, <strong>2</strong>.
              Left stops at the 3 (2 or more). Right skips the 5 and stops
              at the 1 (smaller than 2). Swap, carry on, and swap the pivot
              into the middle, exactly as before.
            </p>
            <p>
              Repeat on the smaller pieces that creates, until the whole
              left side reads <code>1 2 3 4 5</code>.
            </p>
          </div>
          <StepVisual
            rows={[
              {
                values: [3, 4, 1, 5, 2, 6, 9, 7, 8],
                pivot: 4,
                faded: [5, 6, 7, 8],
                pointers: [
                  { index: 0, kind: 'left', text: '≥ 2?' },
                  { index: 2, kind: 'right', text: '< 2?' },
                ],
                swap: [0, 2],
                caption: 'the left side on its own, with 2 as the pivot',
              },
              {
                values: [1, 2, 3, 4, 5, 6, 9, 7, 8],
                locked: [0, 1, 2, 3, 4, 5],
                faded: [6, 7, 8],
                caption: 'after repeating on the smaller pieces',
              },
            ]}
          />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>7) Do the same on the right side</h4>
            <p>
              The right side is <code>9 7 8</code>, and its pivot is{' '}
              <strong>8</strong>. Left stops at the 9 (8 or more) and right
              stops at the 7 (smaller than 8). Swap them, and the pointers
              cross. Finally swap the pivot with the first number of the
              right side, which puts the 8 in its final place.
            </p>
            <p>
              Every piece is now down to one number or none, so there is
              nothing left to do: the list is sorted.
            </p>
          </div>
          <StepVisual
            rows={[
              {
                values: [1, 2, 3, 4, 5, 6, 9, 7, 8],
                pivot: 8,
                faded: [0, 1, 2, 3, 4, 5],
                pointers: [
                  { index: 6, kind: 'left', text: '≥ 8?' },
                  { index: 7, kind: 'right', text: '< 8?' },
                ],
                swap: [6, 7],
                caption: 'left stops at 9, right stops at 7: swap them',
              },
              {
                values: [1, 2, 3, 4, 5, 6, 7, 9, 8],
                pivot: 8,
                faded: [0, 1, 2, 3, 4, 5],
                marked: [6, 7],
                pointers: [
                  { index: 7, kind: 'left', text: '≥ 8?' },
                  { index: 6, kind: 'right', text: '< 8?' },
                ],
                dividers: [{ after: 6, label: 'mid' }],
                caption: 'the pointers have crossed',
              },
              {
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                locked: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                caption: 'the pivot swaps into place: sorted',
              },
            ]}
          />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong> and the highlighted line marks which
          line of the code is running right now, while the bars show the
          list changing in step with it. The raised bar is the{' '}
          <strong>pivot</strong>, and the two markers under the bars are the{' '}
          <strong>left</strong> and <strong>right</strong> pointers. Watch
          left walk right until it finds something that is the pivot or
          bigger, right walk left until it finds something smaller, and
          the two items swap. When the pointers cross, the pivot swaps into
          the gap and turns green, because it is now in its final place.
          Bars outside the piece being worked on are faded. You can pause,
          step forward or back one line at a time, drag the slider to jump
          around, and change the speed.
        </p>
        <QuickSortTracer />
        <p>
          <strong>Example from my notes</strong> is the list <code>3 7 1 8 2 5
          9 4 6</code>. After the first partition it reads{' '}
          <code>3 4 1 5 2 | 6 | 9 7 8</code>, with the 6 locked in. Then try
          the other lists and compare how many steps they take.{' '}
          <strong>Random</strong> is the quickest, because the pivots split
          the list reasonably evenly. <strong>Already sorted</strong> and{' '}
          <strong>Backwards</strong> are the slowest: the last item is
          always the biggest or smallest, so every partition peels off a
          single item and leaves the rest. That is the famous catch.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Quick Sort in One Breath</h3>
        <div className="definition">
          Quick sort picks a pivot, moves smaller items to its left and
          larger items to its right so the pivot lands in its final place,
          and then sorts each side the same way.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work with the same tree as merge sort. Each
              partition scans its piece once, so one level of the tree
              costs about <code>n</code>. What changes is how many levels
              there are, and that depends entirely on the pivot.
            </p>
            <p>
              If the pivot splits a piece roughly in half, the pieces shrink
              fast and there are about <code>log n</code> levels:{' '}
              <code>O(n log n)</code>. If the pivot is always the smallest
              or largest item, it removes only itself, the pieces shrink by
              one each time, and there are about <code>n</code> levels:{' '}
              <code>O(n&sup2;)</code>. On random data, the splits are good
              often enough that the average is <code>O(n log n)</code>.
            </p>
          </div>
          <SplitsVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Input</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.input}</td>
                  <td><code>{row.time}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td><code>{row.value}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="definition">
          The worst case is easy to avoid in practice. Pick the pivot at
          random, or take the median of the first, middle and last items,
          and no particular input can reliably trigger it. That is why quick
          sort, despite its quadratic worst case, is so widely used.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You are sorting an array in memory and speed matters.</strong>{' '}
          Quick sort scans memory in order and swaps in place, which
          processors handle very well. In practice it is often faster than
          merge sort despite the same <code>O(n log n)</code> average.
        </p>
        <p>
          <strong>Memory is tight.</strong> It needs only the recursion
          stack, <code>O(log n)</code> on typical input, where merge sort
          needs <code>O(n)</code> extra space.
        </p>
        <p>
          <strong>Stability and guarantees do not matter.</strong> If equal
          items must keep their order, or you cannot risk a slow case, use
          merge sort. Python&rsquo;s <code>sorted()</code> picks Timsort for
          exactly those reasons.
        </p>
        <p>
          <strong>You want to find the k-th smallest item.</strong> The same
          partition idea, recursing on only one side, finds it in{' '}
          <code>O(n)</code> on average. It is called quickselect.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Test Yourself</h3>
        <p>Guess the time (and space) complexity before revealing the answer.</p>
        <ComplexityQuiz examples={examples} />
      </section>
    </article>
  )
}

export default QuickSort
