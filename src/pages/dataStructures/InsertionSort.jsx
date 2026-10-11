import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import InsertionSortTracer from './InsertionSortTracer.jsx'
import { ShiftsVisual } from './InsertionSortVisuals.jsx'

const cases = [
  { name: 'Best case', input: 'already sorted', time: 'O(n)', shifts: '0', why: 'Each item is checked once against its left neighbor and stays put.' },
  { name: 'Average case', input: 'in random order', time: 'O(n²)', shifts: 'about n²/4', why: 'On average each item moves past about half of the sorted items.' },
  { name: 'Worst case', input: 'sorted backwards', time: 'O(n²)', shifts: 'n(n−1)/2', why: 'Each new item is smaller than everything before it and travels all the way to the front.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(1)', why: 'Just the held key and a couple of index variables.' },
  { prop: 'In place', value: 'Yes', why: 'Items shift inside the same list.' },
  { prop: 'Stable', value: 'Yes', why: 'It only shifts items that are strictly bigger than the key, so equal items keep their order.' },
  { prop: 'Adaptive', value: 'Yes, naturally', why: 'The closer to sorted the input is, the less work it does, with no extra flag needed.' },
  { prop: 'Online', value: 'Yes', why: 'It can keep sorting as new items arrive, since each one is simply inserted into the sorted part.' },
]

const examples = [
  {
    id: 'one-insert',
    prompt: 'Inserting one new item into an already sorted list of n items by shifting larger items right.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'In the worst case the new item is smaller than everything, so all n items shift one slot.',
  },
  {
    id: 'worst-case',
    prompt: 'Insertion sort on a list of n items sorted in reverse order.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'Each new item travels all the way to the front: 1 + 2 + ... + (n − 1) shifts.',
  },
  {
    id: 'best-case',
    prompt: 'Insertion sort on a list that is already sorted.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Each item is compared once with its left neighbor, finds it is already in place, and the inner loop never runs.',
  },
  {
    id: 'average-case',
    prompt: 'Insertion sort on a list of n items in random order.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'About half the pairs are out of order, which is still on the order of n² shifts.',
  },
  {
    id: 'nearly-sorted',
    prompt: 'Insertion sort on n items where every item is at most 3 positions away from its sorted place.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Each item shifts at most 3 slots, a constant, so the total work is about 3n steps.',
  },
  {
    id: 'binary-insertion',
    prompt: 'Insertion sort that finds each item\'s spot with binary search, but still shifts items to make room.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'Binary search cuts the comparisons to n log n, but the shifting still costs O(n) per item, and shifting dominates.',
  },
  {
    id: 'new-list',
    prompt: 'Insertion sort that builds a separate sorted list by inserting each input item into it, instead of working in place.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'The shifting is the same, and the second list holds n items.',
  },
  {
    id: 'builtin',
    prompt: 'Sorting the same n items with Python\'s built-in sorted().',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Timsort is far faster than insertion sort for large inputs, and sorted() builds a new list.',
  },
]

function InsertionSort() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Sorting Algorithms</p>
      <h2>Insertion Sort</h2>
      <p>
        If you&rsquo;ve ever sorted playing cards in your hand, you already
        know insertion sort. You pick up one card at a time and slide it
        into its place among the cards you&rsquo;re already holding. It&rsquo;s
        as simple as bubble sort, but it&rsquo;s the one real code actually
        uses.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Insertion Sort &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>Builds a sorted section one item at a time.</li>
                <li>Take the next item and slide it into place among the items already sorted, like cards in your hand.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>A simple sorting procedure that is also fast on small or nearly sorted data.</li>
                <li>Sorting from scratch is hard; inserting into a list that is already sorted is easy.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>The left part of the list is always sorted.</li>
                <li>Each step grows it by one: place the next item where it belongs.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Pick up the next item (the <strong>key</strong>).</li>
                <li>Walk left past every bigger item, shifting each one right.</li>
                <li>Drop the key into the gap. Repeat for every item.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Shifting, not swapping</h4>
              <ul>
                <li>Bigger items slide one slot right; the key is written once, at the end.</li>
                <li>Far fewer writes than bubble sort, which swaps again and again.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Best: <code>O(n)</code> (already sorted).</li>
                <li>Average and worst: <code>O(n&sup2;)</code>.</li>
                <li>Space: <code>O(1)</code>. In place, <strong>stable</strong>, <strong>adaptive</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Quadratic on big, shuffled input.</li>
                <li>Moves items only one slot at a time.</li>
                <li>Beats bubble sort on every count that matters.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>The list is small, or nearly sorted already.</li>
                <li>Items arrive one at a time and must stay sorted.</li>
                <li>Inside faster sorts: Python&rsquo;s own sort uses it on small chunks.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Check <code>j &gt;= 0</code> <em>before</em> reading <code>nums[j]</code>.</li>
                <li>Drop the key at <code>j + 1</code>, not <code>j</code>.</li>
                <li>Using <code>&gt;=</code> instead of <code>&gt;</code> breaks stability.</li>
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
          list changing in step with it. The bar that floats above the row
          is the <strong>key</strong>, the item being inserted. Watch the
          bigger bars slide one slot right to open a gap for it, then watch
          it drop in. You can pause, step forward or back one line at a
          time, drag the slider to jump around, and change the speed.
        </p>
        <InsertionSortTracer />
        <p>
          Try the different starting lists. <strong>Already sorted</strong>{' '}
          barely does anything: each key looks left once and stays where it
          is. <strong>Backwards</strong> is the worst case: every key
          travels all the way to the front. <strong>Nearly sorted</strong>{' '}
          shows why insertion sort is liked in practice: only the few
          out-of-place items cost anything.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Insertion Sort in One Breath</h3>
        <div className="definition">
          Insertion sort grows a sorted section one item at a time, by
          taking the next item and shifting larger items right until it fits
          into its place.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work the way you learned. The outer loop runs{' '}
              <code>n &minus; 1</code> times, once per key. The inner loop
              shifts items, and how many it shifts depends entirely on how
              far the key is from where it belongs.
            </p>
            <p>
              That makes the cost depend on the input. An already sorted
              list needs no shifts at all, only one comparison per key:{' '}
              <code>O(n)</code>. A backwards list needs the most shifts,
              since every key must travel all the way to the front, adding
              up to <code>n(n &minus; 1) / 2</code>, which is{' '}
              <code>O(n&sup2;)</code>. A random list lands in between, with
              about half as many, which is still <code>O(n&sup2;)</code>.
            </p>
          </div>
          <ShiftsVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Input</th>
                <th>Time</th>
                <th>Shifts</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.input}</td>
                  <td><code>{row.time}</code></td>
                  <td>{row.shifts}</td>
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
          <strong>Adaptive</strong> means the algorithm does less work the
          closer the input is to sorted. Bubble sort needs an extra flag to
          get this; insertion sort gets it for free, because an item that
          is already in place stops the inner loop immediately.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>The list is small.</strong> For a handful of items its low
          overhead beats the fancier algorithms. That&rsquo;s why many fast
          sorts, including Python&rsquo;s own, switch to insertion sort for
          small chunks.
        </p>
        <p>
          <strong>The list is nearly sorted.</strong> A leaderboard that
          gets one new score, or a list where only a few items are out of
          place, costs close to <code>O(n)</code>.
        </p>
        <p>
          <strong>Items arrive one at a time.</strong> Because each new item
          is simply inserted into the sorted part, insertion sort can keep a
          list sorted as data streams in.
        </p>
        <p>
          <strong>Compared with bubble sort,</strong> it has the same
          worst case but does far fewer writes, so it is almost always the
          better of the two simple sorts. For large, shuffled data, use{' '}
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

export default InsertionSort
