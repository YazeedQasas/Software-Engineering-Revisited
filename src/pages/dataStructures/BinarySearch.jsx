import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import BinarySearchTracer from './BinarySearchTracer.jsx'
import { IsoHalvingVisual, IsoShrinkVisual } from './BinarySearchVisuals.jsx'

const cases = [
  { name: 'Best case', where: 'the target is the middle item', checks: '1', time: 'O(1)', why: 'The very first comparison finds it and the search stops.' },
  { name: 'Average case', where: 'the target is somewhere in the list', checks: 'about log₂ n', time: 'O(log n)', why: 'Most targets are found only after the list has been cut down several times.' },
  { name: 'Worst case', where: 'the target is found last, or is not in the list', checks: 'log₂ n + 1', time: 'O(log n)', why: 'The list is halved until one item is left, and only then can you be sure.' },
]

const growth = [
  { n: '8', linear: '8', binary: '4' },
  { n: '100', linear: '100', binary: '7' },
  { n: '1,000', linear: '1,000', binary: '10' },
  { n: '1,000,000', linear: '1,000,000', binary: '20' },
  { n: '1,000,000,000', linear: '1,000,000,000', binary: '30' },
]

const builtins = [
  { op: 'bisect.bisect_left(my_list, x)', time: 'O(log n)', space: 'O(1)', why: 'Python’s ready-made binary search. It returns where x is, or where it would go.' },
  { op: 'bisect.insort(my_list, x)', time: 'O(n)', space: 'O(1)', why: 'Finding the spot is O(log n), but sliding items over to make room is O(n).' },
  { op: 'x in my_list', time: 'O(n)', space: 'O(1)', why: 'Still a linear search, even if the list happens to be sorted.' },
  { op: 'sorted(my_list)', time: 'O(n log n)', space: 'O(n)', why: 'The price of getting an unsorted list ready for binary search.' },
  { op: 'x in my_set / my_dict', time: 'O(1) avg', space: 'O(1)', why: 'Not a binary search: hashing jumps straight to it.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(1)', why: 'Just low, high and mid. (A recursive version uses O(log n) for the call stack.)' },
  { prop: 'Needs sorted input', value: 'Yes', why: 'The whole trick is that one comparison tells you which half to throw away.' },
  { prop: 'Needs random access', value: 'Yes', why: 'It has to jump straight to the middle, which an array does and a linked list does not.' },
  { prop: 'Works on', value: 'sorted arrays and lists', why: 'Anything sorted that you can index into in constant time.' },
  { prop: 'Returns', value: 'a match, not always the first', why: 'With duplicates it returns whichever copy the middle lands on.' },
]

const examples = [
  {
    id: 'sorted',
    prompt: 'Binary search for a value in a sorted list of n items (worst case).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Each check halves what is left, so about log₂ n checks, and the loop only needs three variables.',
  },
  {
    id: 'middle',
    prompt: 'Binary search for a value that happens to be the middle item of a sorted list of n items.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The very first comparison matches, so the search stops immediately.',
  },
  {
    id: 'missing',
    prompt: 'Binary search for a value that is not in a sorted list of n items.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The range keeps halving until it is empty, which takes about log₂ n checks.',
  },
  {
    id: 'recursive',
    prompt: 'A recursive binary search on a sorted list of n items (worst case), passing low and high as arguments.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'Same number of checks, but each halving is a nested call, so the call stack grows to log₂ n frames.',
  },
  {
    id: 'in-sorted',
    prompt: 'Checking whether x is in a sorted Python list of n items with x in my_list.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The in operator does not know the list is sorted. It is a plain linear search.',
  },
  {
    id: 'bisect',
    prompt: 'Finding where x belongs in a sorted list of n items with bisect.bisect_left(my_list, x).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'That is binary search, written in C and ready to use.',
  },
  {
    id: 'sort-first',
    prompt: 'Sorting an unsorted list of n items with sorted(), then binary searching it once.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'The sort dominates, and sorted() builds a new list of n items. The O(log n) search is just a rounding error next to it.',
  },
  {
    id: 'set-lookup',
    prompt: 'Checking whether x is in a set of n items, for comparison (average case).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Hashing jumps straight to the right bucket. There is no halving at all.',
  },
]

function BinarySearch() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Search Algorithms</p>
      <h2>Binary Search</h2>
      <p>
        Binary search is how you look up a word in a dictionary: you do not
        start at page one, you open it somewhere in the middle, see whether
        your word comes before or after, and throw away the half that cannot
        hold it. Do that a few times and you are there. It is far faster than
        linear search, with one catch: the list must already be sorted.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Binary Search &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>Look at the middle item of a <strong>sorted</strong> list, then throw away the half that cannot contain the target.</li>
                <li>Also called a <strong>half-interval search</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;Is this value in the list, and where?&rdquo; when the list is big.</li>
                <li>Linear search works but gets slow, since it may check every item.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>In a sorted list, one comparison tells you which side the target is on.</li>
                <li>So every check rules out <strong>half</strong> of what is left, not just one item.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Keep a window, <code>low</code> to <code>high</code>, that starts as the whole list.</li>
                <li>Compare the middle item with the target. Equal? Return its position.</li>
                <li>Too small? Move <code>low</code> up past it. Too big? Move <code>high</code> down past it.</li>
                <li>Window empty (<code>low &gt; high</code>)? Return <code>-1</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li><strong>Best:</strong> the target is the middle: 1 check.</li>
                <li><strong>Average:</strong> about <code>log&#8322; n</code> checks.</li>
                <li><strong>Worst:</strong> the target is missing: <code>log&#8322; n + 1</code> checks.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(1)</code> best, <code>O(log n)</code> average and worst.</li>
                <li>Space: <code>O(1)</code> (loop), <code>O(log n)</code> (recursion).</li>
                <li>1,000,000 items take about 20 checks.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>The list must be sorted, and sorting costs <code>O(n log n)</code>.</li>
                <li>It needs to jump to the middle, so it wants an array, not a linked list.</li>
                <li>A hash table answers in <code>O(1)</code> but cannot answer &ldquo;what is next to it?&rdquo;.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>The data is sorted (or stays sorted) and you search it many times.</li>
                <li>The list is large, so skipping most of it really pays.</li>
                <li>You want the closest value, or where something would be inserted.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>On unsorted data it gives <strong>wrong answers</strong>, silently.</li>
                <li>Off-by-one: use <code>low = mid + 1</code> and <code>high = mid - 1</code>, or the loop can run forever.</li>
                <li>With duplicates it returns <em>a</em> match, not necessarily the first.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea: Halve It, Then Halve It Again</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Think of the number guessing game. I pick a number from 1 to
              100 and tell you &ldquo;higher&rdquo; or &ldquo;lower&rdquo;
              after each guess. You would not guess 1, then 2, then 3. You
              would say 50, and whatever I answer, half the numbers are gone
              at once.
            </p>
            <p>
              Watch the cubes: the sorted row is checked in the middle first.
              That cube is too small, so it and everything to its left fade
              out. The search then moves to the middle of what remains, and
              this time it lands on the target. Every check does the work of
              many, because the sorting is what lets one look rule out a
              whole half.
            </p>
          </div>
          <IsoHalvingVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong> and the highlighted line marks which
          line of the code is running right now, while the isometric cubes
          show the search in step with it. The yellow cube is the value
          being looked for. The middle cube being checked floats up and
          turns blue, cubes that have been thrown away fade, and a match
          turns green. The <code>low</code>, <code>high</code> and{' '}
          <code>mid</code> variables are shown under the cubes, so you can
          see the window shrink. You can pause, step forward or back one
          line at a time, drag the slider to jump around, and change the
          speed.
        </p>
        <BinarySearchTracer />
        <p>
          Try the different searches and count the checks. <strong>Right in
          the centre</strong> is over after one. <strong>Last item</strong>{' '}
          takes four, which is the most any search of eight items can
          need. <strong>Not in the list</strong> ends when the window is
          empty, with <code>low</code> having passed <code>high</code>. With{' '}
          <strong>Duplicates</strong>, notice that it returns position 3,
          even though there are 7s at positions 2, 4 and 5 too: it stops at
          the first one the middle lands on, not the first one in the list.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Binary Search in One Breath</h3>
        <div className="definition">
          Binary search finds a target in a sorted list by repeatedly
          comparing it with the middle item and discarding the half that
          cannot contain it, until it finds the target or nothing is left.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. Each check is one comparison,
              so the cost is how many times you can cut the list in half
              before only one item is left. That is exactly what a
              logarithm counts.
            </p>
            <p>
              If the middle item is the target, one check:{' '}
              <code>O(1)</code>. Otherwise 16 items become 8, then 4, then
              2, then 1, so four cuts. In general a list of{' '}
              <code>n</code> items needs at most about <code>log&#8322; n</code>{' '}
              checks, so binary search is <code>O(log n)</code>: double the
              list and the worst case grows by just <em>one</em> check.
            </p>
          </div>
          <IsoShrinkVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Where the target is</th>
                <th>Checks</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.where}</td>
                  <td>{row.checks}</td>
                  <td><code>{row.time}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          To feel how big the difference is, here is the most checks each
          search can need (the worst case) as the list grows:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>List size (n)</th>
                <th>Linear search</th>
                <th>Binary search</th>
              </tr>
            </thead>
            <tbody>
              {growth.map((row) => (
                <tr key={row.n}>
                  <td><strong>{row.n}</strong></td>
                  <td>{row.linear}</td>
                  <td>{row.binary}</td>
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
        <p>Python ships with a binary search, and a few lookalikes that are not one:</p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Time</th>
                <th>Extra space</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {builtins.map((row) => (
                <tr key={row.op}>
                  <td><code>{row.op}</code></td>
                  <td><code>{row.time}</code></td>
                  <td><code>{row.space}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>The data is already sorted.</strong> This is the whole
          requirement. A sorted list, a sorted column in a file, a sorted
          array of timestamps: all of them can be searched in{' '}
          <code>O(log n)</code>.
        </p>
        <p>
          <strong>You search the same data many times.</strong> Sorting costs{' '}
          <code>O(n log n)</code> once, and every search after that costs
          only <code>O(log n)</code> instead of <code>O(n)</code>. Searching
          once does not pay the sorting bill back, but searching a thousand
          times does.
        </p>
        <p>
          <strong>The list is large.</strong> For ten items the difference
          is invisible, and linear search is simpler. For a million, 20
          checks against up to a million is the difference between instant
          and noticeable.
        </p>
        <p>
          <strong>You need the neighbours, not just a yes or no.</strong>{' '}
          Because the data is in order, binary search can tell you the
          closest value, the first item greater than x, or exactly where a
          new item should be inserted. A hash table cannot.
        </p>
        <p>
          <strong>You can guess your way to an answer.</strong> The idea works
          on anything that goes from &ldquo;no&rdquo; to &ldquo;yes&rdquo; in
          one direction, such as finding the first version of a program that
          has a bug, or the smallest number that satisfies a test.
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

export default BinarySearch
