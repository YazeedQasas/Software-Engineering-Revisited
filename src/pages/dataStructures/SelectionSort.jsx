import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import SelectionSortTracer from './SelectionSortTracer.jsx'
import { MovesVisual } from './SelectionSortVisuals.jsx'

const cases = [
  { name: 'Best case', input: 'already sorted', time: 'O(n²)', swaps: '0', why: 'It still scans the whole unsorted part on every pass to be sure of the smallest.' },
  { name: 'Average case', input: 'in random order', time: 'O(n²)', swaps: 'up to n − 1', why: 'The same n(n−1)/2 comparisons, and about one swap per pass.' },
  { name: 'Worst case', input: 'sorted backwards', time: 'O(n²)', swaps: 'up to n − 1', why: 'Still the same comparisons. Selection sort never does worse than n − 1 swaps.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(1)', why: 'Just the index of the smallest item and a couple of loop variables.' },
  { prop: 'In place', value: 'Yes', why: 'Items are swapped inside the same list.' },
  { prop: 'Stable', value: 'No', why: 'A swap can jump an item over equal ones: sorting [2a, 2b, 1] puts 1 first and 2a after 2b.' },
  { prop: 'Adaptive', value: 'No', why: 'It does the same scanning whether the input is sorted or not.' },
  { prop: 'Swaps', value: 'at most n − 1', why: 'One swap per pass, and each swap puts an item in its final place.' },
]

const examples = [
  {
    id: 'find-min',
    prompt: 'Finding the position of the smallest item in an unsorted list of n items by scanning.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You have to look at every item once, remembering the best so far.',
  },
  {
    id: 'one-pass',
    prompt: 'One pass of selection sort: find the smallest remaining item and swap it into place.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The scan costs up to n, and the swap is a single step.',
  },
  {
    id: 'already-sorted',
    prompt: 'Selection sort on a list of n items that is already sorted.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'It is not adaptive. It still scans the entire unsorted part on every pass.',
  },
  {
    id: 'worst-case',
    prompt: 'Selection sort on a list of n items sorted in reverse order.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'The same n(n − 1) / 2 comparisons as any other input.',
  },
  {
    id: 'average-case',
    prompt: 'Selection sort on a list of n items in random order.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'The comparison count never depends on the order of the input.',
  },
  {
    id: 'swaps-only',
    prompt: 'Counting only the swaps selection sort makes on a list of n items (at most one per pass).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'At most n − 1 swaps in total, which is why it suits cases where writing is expensive.',
  },
  {
    id: 'new-list',
    prompt: 'Sorting by repeatedly pulling the minimum out of the input list into a new list (min() then remove()).',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Each of the n rounds scans and removes in O(n), and the new list holds n items.',
  },
  {
    id: 'builtin',
    prompt: 'Sorting the same n items with Python\'s built-in sorted().',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Timsort is far faster than selection sort for large inputs, and sorted() builds a new list.',
  },
]

function SelectionSort() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Sorting Algorithms</p>
      <h2>Selection Sort</h2>
      <p>
        Bubble sort fixes neighbors, and insertion sort slides items into a
        sorted hand. Selection sort takes a different approach: it
        <em> chooses</em>. For each position, in order, it looks through
        everything that&rsquo;s left, finds the item that belongs there, and
        puts it there once.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Selection Sort &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>Repeatedly <strong>selects</strong> the smallest remaining item and puts it at the front of the unsorted part.</li>
                <li>The sorted section grows from the left, one item per pass.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>A simple sort that moves items as little as possible.</li>
                <li>Each item is placed directly into its final spot, then never touched again.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>The next slot has exactly one correct occupant: the smallest item left.</li>
                <li>So find it, rather than shuffling items around until things fit.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Scan the unsorted part, remembering the <strong>index</strong> of the smallest.</li>
                <li>Swap it with the first unsorted position. That position is now locked.</li>
                <li>Repeat for the rest.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Very few swaps</h4>
              <ul>
                <li>At most one swap per pass: <strong>n &minus; 1 swaps</strong> in total.</li>
                <li>Bubble sort can need about n&sup2;/2 swaps for the same list.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li><code>O(n&sup2;)</code> in <em>every</em> case: always n(n&minus;1)/2 comparisons.</li>
                <li>Space: <code>O(1)</code>. In place.</li>
                <li><strong>Not</strong> stable, <strong>not</strong> adaptive.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>No speed-up on sorted or nearly sorted input.</li>
                <li>Equal items can change their relative order.</li>
                <li>Slow on large input.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Writing or moving items is expensive, but comparing is cheap.</li>
                <li>The list is small and you want the simplest code.</li>
                <li>Idea behind heap sort: same selection, with a smarter way to find the smallest.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Remember the <em>index</em> of the smallest, not just its value.</li>
                <li>The inner loop starts at <code>i + 1</code>.</li>
                <li>Don&rsquo;t rely on it keeping equal items in order.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong> and the highlighted line marks which
          line of the code is running right now, while the bars show the
          list changing in step with it. The bar raised above the row is the{' '}
          <strong>smallest item found so far</strong> in this pass, and the
          bar being looked at is highlighted blue. Watch the raised bar
          change hands whenever a smaller value turns up, and watch how few
          swaps there are. You can pause, step forward or back one line at a
          time, drag the slider to jump around, and change the speed.
        </p>
        <SelectionSortTracer />
        <p>
          Try the different starting lists, and notice what doesn&rsquo;t
          change. <strong>Already sorted</strong> takes exactly as many
          comparisons as <strong>Backwards</strong>, because every pass has
          to scan the rest of the list to be sure it found the smallest.
          What does change is the number of swaps, which is where selection
          sort shines.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Selection Sort in One Breath</h3>
        <div className="definition">
          Selection sort repeatedly finds the smallest item in the unsorted
          part of the list and swaps it into the next position of the sorted
          part.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work. Pass one scans <code>n &minus; 1</code> items
              to find the smallest, pass two scans <code>n &minus; 2</code>,
              and so on down to 1. That adds up to{' '}
              <code>n(n &minus; 1) / 2</code> comparisons, so{' '}
              <code>O(n&sup2;)</code>. And that number doesn&rsquo;t depend
              on the input at all: the scan has no way to stop early,
              because the smallest item could be anywhere.
            </p>
            <p>
              That&rsquo;s selection sort&rsquo;s defining trait, good and
              bad. The bad: a sorted list costs as much as a shuffled one.
              The good: it makes at most one swap per pass, so{' '}
              <code>n &minus; 1</code> swaps in total, however jumbled the
              input.
            </p>
          </div>
          <MovesVisual />
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
          Why isn&rsquo;t it stable? A swap takes the smallest item from far
          away and drops it into position <code>i</code>, sending whatever
          was there to the distant spot. That can carry an item past other
          items equal to it. Insertion sort and bubble sort only ever move
          an item past strictly bigger ones, which is why they stay stable.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>Moving items is the expensive part.</strong> If each write
          is costly, like writing to flash memory that wears out or moving
          large records, then at most <code>n &minus; 1</code> swaps is
          a real advantage, even though the comparisons are the same
          as everywhere else.
        </p>
        <p>
          <strong>The list is tiny and you want the simplest code.</strong>{' '}
          It&rsquo;s short, has no early-exit flag to get wrong, and its
          cost never surprises you.
        </p>
        <p>
          <strong>You want to understand heap sort later.</strong> Heap
          sort is selection sort with one clever upgrade: a heap finds the
          next smallest item in <code>O(log n)</code> instead of scanning
          for it, which turns <code>O(n&sup2;)</code> into{' '}
          <code>O(n log n)</code>.
        </p>
        <p>
          <strong>Otherwise, pick something else.</strong> Insertion sort
          is faster on nearly sorted data and stable. For large inputs use{' '}
          <code>sorted()</code>.
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

export default SelectionSort
