import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import HeapSortTracer from './HeapSortTracer.jsx'
import { HeapShapeVisual, HeapStepVisual } from './HeapSortVisuals.jsx'

const cases = [
  { name: 'Best case', input: 'already sorted', time: 'O(n log n)', why: 'It still builds the heap and then takes the biggest item out n times.' },
  { name: 'Average case', input: 'in random order', time: 'O(n log n)', why: 'n removals, each repairing a heap that is only about log n levels tall.' },
  { name: 'Worst case', input: 'sorted backwards', time: 'O(n log n)', why: 'The same shape of work. Heap sort has no bad input.' },
]

const parts = [
  { part: 'Build the heap', time: 'O(n)', why: 'Most items sit near the bottom of the tree and barely have to move.' },
  { part: 'One sift down', time: 'O(log n)', why: 'An item can sink at most the height of the tree, about log n levels.' },
  { part: 'n − 1 removals', time: 'O(n log n)', why: 'Each swaps the top to the end, then does one sift down.' },
]

const properties = [
  { prop: 'Extra space', value: 'O(1)', why: 'The heap lives inside the list itself, and the sift down is a loop.' },
  { prop: 'In place', value: 'Yes', why: 'Items are only swapped within the same list.' },
  { prop: 'Stable', value: 'No', why: 'Swapping the top with the last item jumps equal items over each other.' },
  { prop: 'Adaptive', value: 'No', why: 'It does the same work whatever order the input is in.' },
  { prop: 'Guaranteed', value: 'Yes', why: 'O(n log n) in every case, with no extra memory.' },
]

const examples = [
  {
    id: 'sift-down',
    prompt: 'Sifting one item down from the top of a heap of n items until it is bigger than its children.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'It can move down at most one level per step, and a heap of n items is only about log n levels tall.',
  },
  {
    id: 'build-heap',
    prompt: 'Building a max-heap from an unsorted list of n items by sifting down from the last parent to the top.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Half the items are leaves that need no work, and the rest sink only a short way. The total works out to linear.',
  },
  {
    id: 'extract-max',
    prompt: 'Removing the biggest item from a heap of n items and repairing the heap.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Swap the top with the last item, then sift it down one path of about log n levels.',
  },
  {
    id: 'peek-max',
    prompt: 'Finding the biggest item in a max-heap that is already built (just looking at it).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'It is always at position 0.',
  },
  {
    id: 'random',
    prompt: 'Heap sort on a list of n items in random order.',
    time: 'O(n log n)',
    space: 'O(1)',
    explanation: 'Linear to build the heap, then n removals of log n each.',
  },
  {
    id: 'sorted',
    prompt: 'Heap sort on a list of n items that is already sorted.',
    time: 'O(n log n)',
    space: 'O(1)',
    explanation: 'It is not adaptive, so a sorted list takes as long as any other.',
  },
  {
    id: 'backwards',
    prompt: 'Heap sort on a list of n items sorted in reverse order (which is already a max-heap).',
    time: 'O(n log n)',
    space: 'O(1)',
    explanation: 'Building the heap is free, but taking the items out one by one still costs n removals of log n each.',
  },
  {
    id: 'heapq',
    prompt: 'Sorting by pushing all n items onto a separate heap with heapq, then popping them all off.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'The same n log n of work, but the separate heap holds a copy of all n items.',
  },
]

function HeapSort() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Sorting Algorithms</p>
      <h2>Heap Sort</h2>
      <p>
        Remember selection sort? It repeatedly finds the biggest item by
        scanning for it, which is slow. Heap sort does exactly the same
        thing, except it keeps the items in a structure called a{' '}
        <strong>heap</strong> that always has the biggest item ready at the
        top. The result is a sort that is guaranteed <code>O(n log n)</code>{' '}
        and needs no extra memory.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Heap Sort &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>Turn the list into a <strong>max-heap</strong>, then repeatedly move the biggest item to the end.</li>
                <li>It is selection sort with a smarter way to find the biggest item.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Selection sort re-scans for the biggest item every time: <code>O(n&sup2;)</code>.</li>
                <li>Merge sort needs extra memory, and quick sort can hit a bad case. Heap sort has neither problem.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>A heap keeps the biggest item on top, and fixing it after a removal only takes <code>O(log n)</code>.</li>
                <li>So taking out the biggest item n times costs <code>n log n</code>, not <code>n&sup2;</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li><strong>Build</strong> a max-heap from the list.</li>
                <li><strong>Swap</strong> the top (the biggest) with the last item of the heap. That item is now locked in at the end.</li>
                <li>Shrink the heap, <strong>sift</strong> the new top down to repair it, and repeat.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. A tree in an array</h4>
              <ul>
                <li>A heap is a tree where every parent is at least as big as its children.</li>
                <li>It is stored in the list itself: children of <code>i</code> are <code>2i + 1</code> and <code>2i + 2</code>.</li>
                <li><strong>Sift down</strong>: swap an item with its bigger child until it is bigger than both.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li><code>O(n log n)</code> in <em>every</em> case.</li>
                <li>Build the heap <code>O(n)</code>; each removal <code>O(log n)</code>.</li>
                <li>Space: <code>O(1)</code>. In place. <strong>Not</strong> stable.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Usually slower than quick sort in practice: it jumps around memory.</li>
                <li>Not stable, not adaptive.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You need a guaranteed <code>O(n log n)</code> <em>and</em> no extra memory.</li>
                <li>Quick sort&rsquo;s bad case is unacceptable.</li>
                <li>The same heap powers priority queues, and some fast sorts fall back to heap sort on bad input.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>The children of <code>i</code> are <code>2i + 1</code> and <code>2i + 2</code> (with 0-based positions).</li>
                <li>Sift down must stop at the heap&rsquo;s shrinking <code>size</code>, not the list&rsquo;s end.</li>
                <li>Build from the last parent <em>down to the top</em>, not top-down.</li>
                <li>Python&rsquo;s <code>heapq</code> is a <em>min</em>-heap.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Heap Idea: a Tree Hiding in a List</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A <strong>max-heap</strong> is a tree with one rule: every
              parent is at least as big as its children. That puts the
              biggest item of all at the very top, and it tells you
              nothing about the order of the others.
            </p>
            <p>
              Here is the neat trick: you don&rsquo;t need pointers to
              store the tree. Lay the tree out level by level in an
              ordinary list, and the shape is implied by the positions.
              The children of position <code>i</code> are at{' '}
              <code>2i + 1</code> and <code>2i + 2</code>, and its parent
              is at <code>(i &minus; 1) // 2</code>. A tree of a million
              items is only about 20 levels tall, which is where the{' '}
              <code>log n</code> comes from.
            </p>
            <p>
              The one repair move you need is <strong>sift down</strong>: if
              an item is smaller than one of its children, swap it with the
              bigger child, and repeat from there. It sinks until it is
              bigger than both children, or it reaches the bottom.
            </p>
          </div>
          <HeapShapeVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong> and the highlighted line marks which
          line of the code is running right now. The bars show the list,
          and the circles underneath show the same items as the heap tree.
          First the tree is built, from the last parent upwards. Then
          watch the biggest item at the top swap with the last item of the
          heap: it turns green on the right, the tree shrinks by one, and
          the new top sinks down to repair it. The raised bar is the item
          being sifted down. You can pause, step forward or back one line
          at a time, drag the slider to jump around, and change the speed.
        </p>
        <HeapSortTracer />
        <p>
          Try the different starting lists. <strong>Backwards</strong> is
          already a valid max-heap, so building it does nothing, yet it
          takes just as many removals as any other list. And notice that{' '}
          <strong>Already sorted</strong> is <em>not</em> fast: the order
          you start in never helps heap sort.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Method, Step by Step</h3>
        <p>
          Now let&rsquo;s do it by hand, on the same list the first preset
          uses: <code>5 3 8 1 9 2 7</code>. Each picture shows the list as
          boxes and as the heap tree. Blue marks the items being checked,
          yellow marks the items that just swapped, and green is sorted.
        </p>

        <div className="concept-row">
          <div className="concept-text">
            <h4>1) See the list as a tree</h4>
            <p>
              Write the list level by level: position 0 on top, then its two
              children, and so on. For a max-heap, every parent must be at
              least as big as its children, and this list breaks that rule.
              Position 1 holds a 3, but one of its children is a 9.
            </p>
          </div>
          <HeapStepVisual rows={[{ values: [5, 3, 8, 1, 9, 2, 7], hot: [1, 3, 4] }]} />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>2) Build the heap from the bottom up</h4>
            <p>
              Leaves have no children, so they are already fine. Start at
              the <strong>last parent</strong>, position 2, which holds 8.
              Its children are 2 and 7. The 8 is bigger than both, so
              nothing needs to move.
            </p>
          </div>
          <HeapStepVisual rows={[{ values: [5, 3, 8, 1, 9, 2, 7], hot: [2, 5, 6] }]} />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>3) Move one parent up, and sift down</h4>
            <p>
              Next parent: position 1, holding 3. Its children are 1 and 9,
              and the <strong>bigger</strong> child is 9. Since 9 is bigger
              than 3, swap them. This is a <strong>sift down</strong>: the
              small item sinks, and the bigger one rises.
            </p>
          </div>
          <HeapStepVisual
            rows={[
              { values: [5, 3, 8, 1, 9, 2, 7], hot: [1, 3, 4], caption: 'before: 3 has a bigger child, 9' },
              { values: [5, 9, 8, 1, 3, 2, 7], swapped: [1, 4], caption: 'after the swap' },
            ]}
          />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>4) Finish at the top</h4>
            <p>
              The last parent is position 0, holding 5. Its children are 9
              and 8, and the bigger one is 9, so swap. Now the 5 is at
              position 1, with children 1 and 3. It is bigger than both, so
              it stops sinking.
            </p>
            <p>
              The <strong>heap is built</strong>: every parent is at least
              as big as its children, and the biggest item, 9, is on top.
            </p>
          </div>
          <HeapStepVisual rows={[{ values: [9, 5, 8, 1, 3, 2, 7], swapped: [0, 1], caption: 'heap built: the biggest item is on top' }]} />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>5) Swap the top with the last item</h4>
            <p>
              The biggest item belongs at the end of the sorted list. Swap
              the top (9) with the last item of the heap (7). The 9 is now
              in its final place, so lock it in and drop it from the heap,
              which has shrunk to 6 items.
            </p>
          </div>
          <HeapStepVisual rows={[{ values: [7, 5, 8, 1, 3, 2, 9], size: 6, swapped: [0] }]} />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>6) Sift the new top down</h4>
            <p>
              The 7 on top is smaller than its children, so the heap rule is
              broken again, but only along one path. Its children are 5 and
              8; swap with the bigger, 8. Now the 7 is at position 2, and
              its only child (position 5, holding 2) is smaller, so it
              stops. The heap is valid again.
            </p>
          </div>
          <HeapStepVisual rows={[{ values: [8, 5, 7, 1, 3, 2, 9], size: 6, swapped: [0, 2] }]} />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>7) Repeat until the heap is empty</h4>
            <p>
              Each round does the same two things: swap the top with the
              last item of the heap and lock it in, then sift the new top
              down. The heap shrinks by one and the sorted section on the
              right grows by one. Here is the list after each round.
            </p>
          </div>
          <HeapStepVisual
            rows={[
              { values: [8, 5, 7, 1, 3, 2, 9], size: 6, showTree: false, caption: 'round 1: 9 locked in' },
              { values: [7, 5, 2, 1, 3, 8, 9], size: 5, showTree: false, caption: 'round 2: 8 locked in' },
              { values: [5, 3, 2, 1, 7, 8, 9], size: 4, showTree: false, caption: 'round 3: 7 locked in' },
              { values: [3, 1, 2, 5, 7, 8, 9], size: 3, showTree: false, caption: 'round 4: 5 locked in' },
              { values: [2, 1, 3, 5, 7, 8, 9], size: 2, showTree: false, caption: 'round 5: 3 locked in' },
              { values: [1, 2, 3, 5, 7, 8, 9], size: 1, showTree: false, caption: 'round 6: 2 locked in' },
            ]}
          />
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>8) Done</h4>
            <p>
              When only one item is left in the heap, it is the smallest,
              and it is already in the right place. The whole list is
              sorted, and no extra memory was needed: the heap lived inside
              the list the whole time.
            </p>
          </div>
          <HeapStepVisual rows={[{ values: [1, 2, 3, 5, 7, 8, 9], size: 0, showTree: false, caption: 'sorted' }]} />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Heap Sort in One Breath</h3>
        <div className="definition">
          Heap sort arranges the list into a max-heap, then repeatedly swaps
          the biggest item to the end and repairs the heap that remains,
          until the whole list is sorted.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <p>
          Count the work in two parts. <strong>Building the heap</strong>{' '}
          costs <code>O(n)</code>: it looks like <code>n</code> sift-downs
          of <code>log n</code> each, but half the items are at the bottom
          and don&rsquo;t move, a quarter move one level, and so on, which
          adds up to linear. <strong>Taking items out</strong> costs{' '}
          <code>n &minus; 1</code> removals. Each swaps the top to the end
          and sifts the new top down one path through a tree about{' '}
          <code>log n</code> levels tall, so <code>O(log n)</code> each.
          That is <code>n</code> times <code>log n</code>, and it dwarfs the
          build step: <code>O(n log n)</code> overall.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((row) => (
                <tr key={row.part}>
                  <td><strong>{row.part}</strong></td>
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
          Heap sort is the only common sort that is{' '}
          <code>O(n log n)</code> in every case <em>and</em> uses{' '}
          <code>O(1)</code> extra space. Merge sort has the guarantee but
          needs <code>O(n)</code> memory. Quick sort has the small memory
          use but can degrade to <code>O(n&sup2;)</code>.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You need both a guarantee and tight memory.</strong>{' '}
          Embedded systems and real-time code often can&rsquo;t afford
          merge sort&rsquo;s extra array or quick sort&rsquo;s rare slow
          case. Heap sort has neither problem.
        </p>
        <p>
          <strong>You want a safety net for quick sort.</strong> Some fast
          sorts, such as the introsort behind C++&rsquo;s{' '}
          <code>std::sort</code>, run quick sort but switch to heap sort if
          the recursion gets too deep, which removes quick sort&rsquo;s
          worst case.
        </p>
        <p>
          <strong>You really need a priority queue, not a full sort.</strong>{' '}
          The heap is the more useful half. It gives you the biggest (or
          smallest) item in <code>O(1)</code> and lets you add and remove
          in <code>O(log n)</code>. Python&rsquo;s <code>heapq</code> module
          is a min-heap you can use directly, and the Heap topic later
          covers the data structure on its own.
        </p>
        <p>
          <strong>For everyday sorting,</strong> use <code>sorted()</code>.
          Heap sort is rarely the fastest in practice, because it jumps
          around memory instead of scanning it in order.
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

export default HeapSort
