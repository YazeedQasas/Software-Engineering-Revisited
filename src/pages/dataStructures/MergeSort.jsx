import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import MergeSortTracer from './MergeSortTracer.jsx'
import { RecursionTreeVisual } from './HowToCalculateVisuals.jsx'

const cases = [
  { name: 'Best case', input: 'already sorted', time: 'O(n log n)', why: 'Every level still copies and merges all n items, even if the merging goes quickly.' },
  { name: 'Average case', input: 'in random order', time: 'O(n log n)', why: 'About log n levels of splitting, each doing n work to merge.' },
  { name: 'Worst case', input: 'sorted backwards', time: 'O(n log n)', why: 'The same shape of work. The order of the input does not change how it splits.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(n)', why: 'Merging copies the two halves into temporary lists.' },
  { prop: 'Recursion depth', value: 'O(log n)', why: 'Halving means the calls never stack more than about log n deep.' },
  { prop: 'In place', value: 'No', why: 'It needs that extra copy space to merge.' },
  { prop: 'Stable', value: 'Yes', why: 'Using <= when comparing means that on a tie the left item goes first, so equal items keep their order.' },
  { prop: 'Adaptive', value: 'No', why: 'The standard version does the same work whatever the input order.' },
]

const examples = [
  {
    id: 'merge-two',
    prompt: 'Merging two already sorted lists with n items between them into one new sorted list.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One pass looking at the front of each list, and the result list holds all n items.',
  },
  {
    id: 'levels',
    prompt: 'Counting how many times n items can be halved before each piece has only 1 item.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Halving n down to 1 takes about log₂ n steps.',
  },
  {
    id: 'random',
    prompt: 'Merge sort on a list of n items in random order.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'About log n levels, each merging n items, with temporary copies of up to n items.',
  },
  {
    id: 'sorted',
    prompt: 'Merge sort on a list of n items that is already sorted.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'It is not adaptive. It still splits all the way down and merges back up.',
  },
  {
    id: 'backwards',
    prompt: 'Merge sort on a list of n items sorted in reverse order.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'The worst case is the same as every other case, which is its big selling point.',
  },
  {
    id: 'slices',
    prompt: 'Merge sort that makes new lists with slices (nums[:mid] and nums[mid:]) at every split instead of using index ranges.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Slicing copies n items per level, which does not change the total. The copies alive at once along one path add up to about 2n.',
  },
  {
    id: 'linked-list',
    prompt: 'Merge sort on a linked list of n nodes, merging by relinking the existing nodes instead of copying.',
    time: 'O(n log n)',
    space: 'O(log n)',
    explanation: 'No copying is needed, so only the recursion stack, about log n deep, uses extra memory.',
  },
  {
    id: 'median',
    prompt: 'Finding the median of n numbers by merge-sorting them and taking the middle one.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'The sort dominates the cost, and picking the middle item afterwards is a single step.',
  },
]

function MergeSort() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Sorting Algorithms</p>
      <h2>Merge Sort</h2>
      <p>
        The three sorts so far all take about <code>n&sup2;</code> steps,
        which gets painful fast. Merge sort is the first one that breaks
        that barrier. It does it with a different way of thinking, called
        divide and conquer: don&rsquo;t sort a big list, split it until
        sorting is trivial, then put the pieces back together.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Merge Sort &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A <strong>divide and conquer</strong> sort: split the list in half, sort each half, <strong>merge</strong> the two sorted halves.</li>
                <li>It calls itself on each half, so it is recursive.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>The simple sorts are <code>O(n&sup2;)</code>: too slow for big lists.</li>
                <li>We want a sort that stays fast on <em>any</em> input.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Merging two <em>already sorted</em> lists is easy: one pass, always taking the smaller front item.</li>
                <li>A single item is already sorted. So split down to single items, then merge back up.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li><strong>Split</strong> at the middle, <strong>recurse</strong> on both halves.</li>
                <li><strong>Merge</strong>: compare the front of each half, take the smaller, repeat; when one side runs out, take the rest.</li>
                <li>Base case: a piece of 0 or 1 items.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Why n log n</h4>
              <ul>
                <li>Halving gives about <code>log n</code> levels.</li>
                <li>Each level merges all <code>n</code> items once.</li>
                <li>Levels &times; work per level = <code>n log n</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Best, average, worst: <code>O(n log n)</code>.</li>
                <li>Space: <code>O(n)</code> for the temporary copies.</li>
                <li><strong>Stable</strong>. Not in place. Not adaptive.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Needs extra memory, unlike the simple sorts.</li>
                <li>More overhead on tiny lists, where insertion sort wins.</li>
                <li>No speed-up on already sorted input.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You need a guaranteed <code>O(n log n)</code>, whatever the input.</li>
                <li>You need stability, or you are sorting a linked list.</li>
                <li>The data is too big for memory and sits on disk.</li>
                <li>Python&rsquo;s own sort is a merge sort hybrid.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>The base case is <code>lo &gt;= hi</code>; without it, infinite recursion.</li>
                <li>The right half starts at <code>mid + 1</code>, not <code>mid</code>.</li>
                <li>Use <code>&lt;=</code> in the merge to keep it stable.</li>
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
          list changing in step with it. Bars outside the piece being
          worked on are faded, and green bars are pieces that are already
          sorted. First watch the list split down to single items, then
          watch each merge: the two bars being compared are blue, and the
          chosen bar slides into its place. You can pause, step forward or
          back one line at a time, drag the slider to jump around, and
          change the speed.
        </p>
        <MergeSortTracer />
        <p>
          This one has more steps than the earlier sorts, because the code
          is recursive: use <strong>Fast</strong> or drag the slider to
          get around. Try the different starting lists, and notice that
          they all take the same number of steps. Merge sort rebuilds every
          piece whatever order it started in, which is both its strength
          (no bad inputs) and its weakness (no easy ones).
        </p>
      </section>

      <section className="notebook-section">
        <h3>Merge Sort in One Breath</h3>
        <div className="definition">
          Merge sort splits a list in half, sorts each half the same way,
          and then merges the two sorted halves into one sorted list.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A recursive algorithm is best counted with a tree. Each box is
              one call, and its two boxes below are the halves it splits
              into. Look at any one level of the tree: the pieces always add
              up to <code>n</code> items, and merging them costs about{' '}
              <code>n</code> in total.
            </p>
            <p>
              How many levels are there? Halving <code>n</code> until the
              pieces have one item takes about <code>log n</code> steps. So
              the total is <code>n</code> work per level times{' '}
              <code>log n</code> levels, which is <code>O(n log n)</code>.
              For a million items that is about twenty million steps,
              instead of the trillion a quadratic sort needs.
            </p>
          </div>
          <RecursionTreeVisual />
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
          This is the trade you met in Time vs Space: merge sort buys speed
          with memory. The simple sorts needed <code>O(1)</code> extra space
          and <code>O(n&sup2;)</code> time; merge sort needs{' '}
          <code>O(n)</code> extra space and gets <code>O(n log n)</code>.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You need a guarantee.</strong> Merge sort&rsquo;s worst
          case is the same as its average case, so there is no input that
          makes it slow. That matters when you can&rsquo;t control or
          predict the data.
        </p>
        <p>
          <strong>Order of equal items matters.</strong> It is stable, so
          sorting people by age after sorting by name keeps same-age
          people in name order.
        </p>
        <p>
          <strong>You&rsquo;re sorting a linked list.</strong> Merging only
          ever looks at the front of each list, which linked lists do
          well, and relinking nodes needs no extra copies. Sorting a
          linked list this way takes <code>O(n log n)</code> time and only{' '}
          <code>O(log n)</code> extra space.
        </p>
        <p>
          <strong>The data doesn&rsquo;t fit in memory.</strong> Sort chunks
          that do fit, then merge the sorted chunks from disk. This is how
          databases sort huge tables.
        </p>
        <p>
          <strong>In day-to-day Python,</strong> just call{' '}
          <code>sorted()</code>. Its algorithm, Timsort, is built from merge
          sort plus insertion sort, so you have been using this idea all
          along.
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

export default MergeSort
