import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import BubbleSortTracer from './BubbleSortTracer.jsx'
import { ComparisonsVisual } from './BubbleSortVisuals.jsx'

const cases = [
  { name: 'Best case', input: 'already sorted', time: 'O(n)', swaps: '0', why: 'One pass finds nothing to swap, so the early exit stops it.' },
  { name: 'Average case', input: 'in random order', time: 'O(n²)', swaps: 'about n²/4', why: 'Roughly half of all pairs start out of order.' },
  { name: 'Worst case', input: 'sorted backwards', time: 'O(n²)', swaps: 'n(n−1)/2', why: 'Every pair is out of order, so every comparison swaps.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(1)', why: 'It only swaps items inside the list and uses a couple of variables.' },
  { prop: 'In place', value: 'Yes', why: 'No second list is needed.' },
  { prop: 'Stable', value: 'Yes', why: 'It only swaps when the left item is strictly bigger, so equal items never pass each other.' },
  { prop: 'Adaptive', value: 'Yes, with the early exit', why: 'Nearly sorted input finishes in few passes.' },
  { prop: 'Comparisons', value: 'n(n−1)/2 without early exit', why: 'The same staircase of work, whatever the order.' },
]

const examples = [
  {
    id: 'one-pass',
    prompt: 'One full pass of bubble sort over a list of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'It compares each neighboring pair once, about n − 1 comparisons.',
  },
  {
    id: 'worst-case',
    prompt: 'Bubble sort on a list of n items sorted in reverse order.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'Every pair is out of order, so it needs about n passes of about n comparisons, all swapping.',
  },
  {
    id: 'best-case',
    prompt: 'Bubble sort with the early-exit check, on a list that is already sorted.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The first pass makes no swaps, so it stops after a single pass.',
  },
  {
    id: 'average-case',
    prompt: 'Bubble sort on a list of n items in random order.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'About half the pairs are out of order, which is still on the order of n² swaps and comparisons.',
  },
  {
    id: 'turtle',
    prompt: 'Bubble sort on a sorted list, except that the smallest value is at the very end.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'A small value moves left only one slot per pass, so it takes about n passes to reach the front, however sorted the rest is.',
  },
  {
    id: 'is-sorted',
    prompt: 'Checking whether a list is already sorted by comparing each item with the next one.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One pass is enough, and it is exactly what bubble sort\'s early-exit check does.',
  },
  {
    id: 'sort-copy',
    prompt: 'Bubble sorting a copy of the list, so the original is left alone.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'The sort itself is still O(n²), but the copy holds n items.',
  },
  {
    id: 'builtin',
    prompt: 'Sorting the same n items with Python\'s built-in sorted() instead.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Timsort is far faster than bubble sort for large inputs, and sorted() builds a new list.',
  },
]

function BubbleSort() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Sorting Algorithms</p>
      <h2>Bubble Sort</h2>
      <p>
        Bubble sort is the simplest sorting algorithm there is, which makes
        it the perfect place to start. You&rsquo;ll almost never use it in
        real code, but understanding why it&rsquo;s slow, and exactly where
        the slowness comes from, sets up every sorting algorithm that
        follows.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Bubble Sort &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A sorting algorithm that repeatedly swaps neighbors that are out of order.</li>
                <li>Each pass, the largest remaining value &ldquo;bubbles&rdquo; to the right end.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Sorted data is easier to search, compare and group.</li>
                <li>We need <em>some</em> procedure that turns any order into sorted order.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>If every neighboring pair is in order, the whole list is in order.</li>
                <li>So keep fixing neighbors until nothing needs fixing.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Walk the list comparing each pair. If left &gt; right, swap them.</li>
                <li>After pass 1, the biggest is last. After pass 2, the second biggest is in place, and so on.</li>
                <li>Each pass can stop one position earlier.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. The early exit</h4>
              <ul>
                <li>If a whole pass makes <strong>no swaps</strong>, the list is sorted. Stop.</li>
                <li>This makes already-sorted input <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Best: <code>O(n)</code> (sorted, with the early exit).</li>
                <li>Average and worst: <code>O(n&sup2;)</code>.</li>
                <li>Space: <code>O(1)</code>. In place and <strong>stable</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Very slow on large input, and it does many swaps.</li>
                <li>Small values drift left only one slot per pass (&ldquo;turtles&rdquo;).</li>
                <li>Insertion sort is usually the better simple sort.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Learning how sorting and swapping work.</li>
                <li>Tiny lists, or checking if a list is already sorted.</li>
                <li>Almost never in real code: use <code>sorted()</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Forgetting the early exit.</li>
                <li>Using <code>&gt;=</code> instead of <code>&gt;</code>, which breaks stability.</li>
                <li>Running the inner loop one step too far and indexing past the end.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Reading code is one thing; watching it run is another. Press{' '}
          <strong>Play</strong> and the highlighted line marks which line of
          the code is running right now, while the bars show the list
          changing in step with it. You can pause, step forward or back one
          line at a time, drag the slider to jump around, and change the
          speed.
        </p>
        <BubbleSortTracer />
        <p>
          Try the different starting lists. <strong>Already sorted</strong>{' '}
          ends after one pass thanks to the early exit.{' '}
          <strong>Backwards</strong> is the worst case: every comparison
          swaps. <strong>One turtle</strong> is nearly sorted, but watch how
          long the lone 1 takes to crawl to the front.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Bubble Sort in One Breath</h3>
        <div className="definition">
          Bubble sort repeatedly walks through a list swapping any two
          neighbors that are in the wrong order, until a full pass needs no
          swaps.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. One pass compares about{' '}
              <code>n</code> pairs. The first pass does <code>n &minus; 1</code>{' '}
              comparisons, the next one <code>n &minus; 2</code>, then{' '}
              <code>n &minus; 3</code>, down to 1. That staircase adds up to{' '}
              <code>n(n &minus; 1) / 2</code>, and dropping the constants
              leaves <code>O(n&sup2;)</code>: a loop inside a loop.
            </p>
            <p>
              Two ways the cost can change. If the input is already sorted
              and you have the early exit, one pass finds no swaps and
              stops: <code>O(n)</code>. If it&rsquo;s sorted backwards,
              every comparison triggers a swap, which is the worst case.
            </p>
          </div>
          <ComparisonsVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Input</th>
                <th>Time</th>
                <th>Swaps</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.input}</td>
                  <td><code>{row.time}</code></td>
                  <td>{row.swaps}</td>
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
          <strong>Stable</strong> means that two items with equal values keep
          their original order. It matters when you sort by more than one
          thing: sort people by name, then stably by age, and people of the
          same age stay in name order.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You&rsquo;re learning.</strong> Bubble sort is the clearest
          way to see what a sort is doing: compare, swap, repeat. Every
          other algorithm in this section is easier once you&rsquo;ve
          watched this one.
        </p>
        <p>
          <strong>The list is tiny, or nearly sorted.</strong> For a few
          items the difference is invisible, and with the early exit it
          finishes quickly on data that is only slightly out of place.
        </p>
        <p>
          <strong>In real code, don&rsquo;t.</strong> Use{' '}
          <code>sorted()</code> or <code>list.sort()</code>, which are
          faster and well tested. The page you&rsquo;re reading is about
          understanding, not production.
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

export default BubbleSort
