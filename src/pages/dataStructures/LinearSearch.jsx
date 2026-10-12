import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import LinearSearchTracer from './LinearSearchTracer.jsx'
import { IsoScanVisual, IsoCasesVisual } from './LinearSearchVisuals.jsx'

const cases = [
  { name: 'Best case', where: 'the target is the first item', checks: '1', time: 'O(1)', why: 'The very first comparison finds it and the search stops.' },
  { name: 'Average case', where: 'the target is somewhere in the middle', checks: 'about n / 2', time: 'O(n)', why: 'On average you look through about half the list before finding it.' },
  { name: 'Worst case', where: 'the target is last, or not in the list', checks: 'n', time: 'O(n)', why: 'You have to look at every item, and only then can you be sure.' },
]

const builtins = [
  { op: 'x in my_list', time: 'O(n)', space: 'O(1)', why: 'A linear search written in C: checks each item until one matches.' },
  { op: 'my_list.index(x)', time: 'O(n)', space: 'O(1)', why: 'Linear search for the first match; raises ValueError if missing.' },
  { op: 'my_list.count(x)', time: 'O(n)', space: 'O(1)', why: 'Never stops early, since it has to count every match.' },
  { op: 'x in my_set / my_dict', time: 'O(1) avg', space: 'O(1)', why: 'Not a linear search: hashing jumps straight to it.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(1)', why: 'Just the loop counter.' },
  { prop: 'Needs sorted input', value: 'No', why: 'It makes no assumptions about the order of the items.' },
  { prop: 'Needs preparation', value: 'No', why: 'No sorting, no index, no hash table to build first.' },
  { prop: 'Works on', value: 'lists, strings, linked lists, files', why: 'Anything you can walk through one item at a time.' },
  { prop: 'Returns', value: 'the first match', why: 'It stops at the first one it finds.' },
]

const examples = [
  {
    id: 'first',
    prompt: 'Linear search for a value that is the first item in a list of n items.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The first comparison matches, so the search stops immediately.',
  },
  {
    id: 'last',
    prompt: 'Linear search for a value that is the last item in a list of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every other item has to be ruled out first, so all n items are checked.',
  },
  {
    id: 'missing',
    prompt: 'Linear search for a value that is not in a list of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You can only be sure it is missing after looking at every item.',
  },
  {
    id: 'average',
    prompt: 'Linear search for a value that is somewhere in the middle of a list of n items (typical case).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'About n / 2 checks, and the constant is dropped, so it is still linear.',
  },
  {
    id: 'in-list',
    prompt: 'Checking whether x is in a plain Python list of n items with x in my_list.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The in operator on a list is a hidden linear search.',
  },
  {
    id: 'collect',
    prompt: 'Linear search that collects the position of every match into a new list (worst case: every item matches).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'It cannot stop early, so it checks all n items, and the result list can grow to n positions.',
  },
  {
    id: 'sorted-early-exit',
    prompt: 'Linear search on a sorted list that stops as soon as it passes the place where the target would be (worst case).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Stopping early helps a missing value, but the worst case is still looking through everything.',
  },
  {
    id: 'set-lookup',
    prompt: 'Checking whether x is in a set of n items, for comparison (average case).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Hashing jumps straight to the right bucket. There is no scanning at all.',
  },
]

function LinearSearch() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Search Algorithms</p>
      <h2>Linear Search</h2>
      <p>
        Linear search is how you look for a lost item: check one place, then
        the next, then the next, until you find it or run out of places. It
        is the simplest search there is, and also the one the others are
        measured against.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Linear Search &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>Look at each item in turn until you find the target or run out of items.</li>
                <li>Also called a <strong>sequential search</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;Is this value in the list, and where?&rdquo;</li>
                <li>Often the list has no order and no index, so there is nothing to lean on.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>With no structure to exploit, the only way to be certain is to check every item.</li>
                <li>Rule items out one at a time, stopping as soon as you find the match.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Start at the first item and compare it with the target.</li>
                <li>Equal? Return its position. Not equal? Move to the next item.</li>
                <li>Past the last item? Return <code>-1</code> (not found).</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li><strong>Best:</strong> the target is first: 1 check.</li>
                <li><strong>Average:</strong> about <code>n / 2</code> checks.</li>
                <li><strong>Worst:</strong> the target is last or missing: <code>n</code> checks.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(1)</code> best, <code>O(n)</code> average and worst.</li>
                <li>Space: <code>O(1)</code>.</li>
                <li>No sorting or setup needed.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Slow on big lists: a million items can mean a million checks.</li>
                <li>Binary search needs sorted data but is <code>O(log n)</code>.</li>
                <li>A hash table answers in <code>O(1)</code> after being built.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>The data is unsorted, small, or only searched once.</li>
                <li>You can only walk the data one item at a time (a linked list, a file).</li>
                <li>You want the first item matching any condition, not just equality.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>It returns only the <strong>first</strong> match.</li>
                <li>Position <code>0</code> is falsy: write <code>if result != -1</code>, not <code>if result</code>.</li>
                <li><code>x in my_list</code> and <code>.index()</code> are linear searches in disguise.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea: Check One at a Time</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Picture a row of closed boxes, one of which holds what you are
              looking for. With no labels and no clue which one it is, you
              open them in order. Each one that turns out to be the wrong
              box gets ruled out, and the moment you open the right one,
              you stop.
            </p>
            <p>
              That is the whole algorithm. Watch the cubes: the marker
              checks one cube at a time, rules it out, and moves on, until
              it reaches the one that matches. The cost depends entirely on
              where in the row the match happens to be.
            </p>
          </div>
          <IsoScanVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong> and the highlighted line marks which
          line of the code is running right now, while the isometric cubes
          show the search in step with it. The yellow cube is the value
          being looked for. The cube being checked floats up and turns blue,
          cubes that have been ruled out fade, and a match turns green. You
          can pause, step forward or back one line at a time, drag the
          slider to jump around, and change the speed.
        </p>
        <LinearSearchTracer />
        <p>
          Try the different searches and count the checks. <strong>First
          item</strong> is over after one. <strong>Last item</strong> and{' '}
          <strong>Not in the list</strong> both take all eight, because the
          search cannot know the value is missing until it has looked
          everywhere. With <strong>Duplicates</strong>, notice that it stops
          at the first 7 and never sees the others.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Linear Search in One Breath</h3>
        <div className="definition">
          Linear search checks the items of a list one at a time, from the
          front, until it finds the target or reaches the end.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. Each check is one comparison,
              so the cost is the number of items looked at before the search
              stops. That depends on where the target sits.
            </p>
            <p>
              If it is the first item, one check: <code>O(1)</code>. If it
              is somewhere in the middle, about <code>n / 2</code> checks.
              If it is the last item, or not there at all, all{' '}
              <code>n</code> checks. We describe a search by its worst case,
              so linear search is <code>O(n)</code>: double the list and the
              worst-case work doubles.
            </p>
          </div>
          <IsoCasesVisual />
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
        <p>You already use linear search all the time in Python, often without noticing:</p>
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
          <strong>The data is not sorted.</strong> Binary search needs a
          sorted list, and sorting costs <code>O(n log n)</code>. If you
          only search once, sorting first to save a few checks does not pay
          for itself.
        </p>
        <p>
          <strong>The list is small.</strong> For a few dozen items the
          difference is invisible, and linear search has the least to get
          wrong.
        </p>
        <p>
          <strong>You can only walk the data one item at a time.</strong>{' '}
          A linked list has no way to jump to the middle, and a file or a
          stream arrives in order, so scanning is the only option.
        </p>
        <p>
          <strong>You are matching on a condition, not a value.</strong>{' '}
          &ldquo;The first user older than 30&rdquo; or &ldquo;the first
          word that starts with <code>q</code>&rdquo; cannot use binary
          search or hashing, but a linear scan handles it with one changed
          line.
        </p>
        <p>
          <strong>If you search the same data many times,</strong> pay once
          to organize it: sort it and use binary search, or put the items in
          a set or dict.
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

export default LinearSearch
