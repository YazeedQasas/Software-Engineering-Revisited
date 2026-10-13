import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import HeapTracer from './HeapTracer.jsx'
import { HeapRuleVisual, HeapifyCostVisual } from './HeapVisuals.jsx'

const versus = [
  { prop: 'The rule', bst: 'left < node < right', heap: 'parent <= children (min-heap)' },
  { prop: 'Left and right siblings', bst: 'ordered: left is smaller', heap: 'in no order at all' },
  { prop: 'Shape', bst: 'any shape (can be lopsided)', heap: 'always complete: no gaps' },
  { prop: 'Stored as', bst: 'nodes with pointers', heap: 'a plain list' },
  { prop: 'Smallest item', bst: 'go left until you cannot: O(log n)', heap: 'the first item: O(1)' },
  { prop: 'Find any given value', bst: 'O(log n) if balanced', heap: 'O(n): no help from the order' },
  { prop: 'Sorted order out', bst: 'in-order walk: O(n)', heap: 'pop everything: O(n log n)' },
]

const compare = [
  { name: 'Unsorted list', peek: 'O(n)', insert: 'O(1)', remove: 'O(n)', note: 'Fast to add to, slow to find the smallest.' },
  { name: 'Sorted list', peek: 'O(1)', insert: 'O(n)', remove: 'O(n)', note: 'Fast to peek, but every insert shifts items along.' },
  { name: 'Heap', peek: 'O(1)', insert: 'O(log n)', remove: 'O(log n)', note: 'Good at all three, which is the point.' },
  { name: 'Balanced search tree', peek: 'O(log n)', insert: 'O(log n)', remove: 'O(log n)', note: 'Also fine, but more code and more memory per item.' },
]

const operations = [
  { op: 'Peek at the smallest', time: 'O(1)', why: 'It is always the first item of the list.' },
  { op: 'Push', time: 'O(log n)', why: 'Float up at most the height of the tree. On random data it is usually just a swap or two.' },
  { op: 'Pop the smallest', time: 'O(log n)', why: 'Sink down at most the height of the tree.' },
  { op: 'Build from a list of n items', time: 'O(n)', why: 'Sinking from the bottom up: most items barely move (see the picture).' },
  { op: 'Build by pushing n items one at a time', time: 'O(n log n)', why: 'n pushes of up to log n each. Correct, but slower than heapify.' },
  { op: 'Find or delete a given value', time: 'O(n)', why: 'The heap order tells you nothing about where a value is.' },
  { op: 'Heap sort (build, then pop everything)', time: 'O(n log n)', why: 'n pops of log n each.' },
]

const properties = [
  { prop: 'Height', value: 'log₂ n', why: 'A complete tree has no gaps, so it is as short as a tree can be.' },
  { prop: 'Space', value: 'O(n)', why: 'One list slot per item. No pointers, no wasted slots.' },
  { prop: 'Extra space while working', value: 'O(1)', why: 'Sifting up or down is a loop over a few variables.' },
  { prop: 'Duplicates', value: 'allowed', why: 'The rule is "no bigger" and "no smaller", so equal items are fine.' },
  { prop: 'Order of equal items', value: 'not kept', why: 'A heap is not stable. Add a counter to break ties if order matters.' },
]

const heapq = [
  { op: 'heapq.heappush(heap, x)', time: 'O(log n)', why: 'Adds x and floats it up.' },
  { op: 'heapq.heappop(heap)', time: 'O(log n)', why: 'Removes and returns the smallest, then sinks the replacement.' },
  { op: 'heap[0]', time: 'O(1)', why: 'Peek at the smallest without removing it.' },
  { op: 'heapq.heapify(my_list)', time: 'O(n)', why: 'Rearranges the list in place into a heap.' },
  { op: 'heapq.heappushpop(heap, x)', time: 'O(log n)', why: 'Push x, then pop the smallest, in one step (faster than doing both).' },
  { op: 'heapq.nsmallest(k, items)', time: 'O(n log k)', why: 'Keeps a heap of only k items while it scans. Much better than sorting when k is small.' },
  { op: 'min(my_list)', time: 'O(n)', why: 'What you do without a heap: look at everything, every time.' },
]

const examples = [
  {
    id: 'peek',
    prompt: 'Reading the smallest item of a min-heap of n items without removing it.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The smallest item is always at position 0.',
  },
  {
    id: 'push',
    prompt: 'Pushing one item onto a min-heap of n items with heapq.heappush (worst case).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The new item may float all the way up, which is the height of the tree, about log n. It is a loop with a few variables.',
  },
  {
    id: 'pop',
    prompt: 'Popping the smallest item from a min-heap of n items with heapq.heappop.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The item moved to the top may sink all the way down, which is at most the height of the tree.',
  },
  {
    id: 'heapify',
    prompt: 'Turning an unsorted list of n items into a heap in place with heapq.heapify.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Half the items are leaves that need no work, and the rest sink only a short way. The total works out to linear.',
  },
  {
    id: 'push-all',
    prompt: 'Building a heap by calling heappush n times on an initially empty heap.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'n pushes, each up to log n. The heap holds all n items. Heapify does the same job in O(n).',
  },
  {
    id: 'search',
    prompt: 'Checking whether a particular value is anywhere in a min-heap of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The only order is parent-before-child. Nothing says which side of a node a value is on, so you may have to look at every item.',
  },
  {
    id: 'validate',
    prompt: 'Checking that a list of n items is a valid min-heap, by comparing every parent with its children.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every item is compared with its parent once, and a loop needs only a counter.',
  },
  {
    id: 'insort',
    prompt: 'Adding one item to a priority queue kept as a sorted Python list with bisect.insort, for comparison.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The spot is found in O(log n), but every item after it has to shift along by one. A heap avoids the shifting.',
  },
]

function Heaps() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Tree Data Structures</p>
      <h2>Heaps</h2>
      <p>
        Sometimes you do not need all your data sorted. You only need the{' '}
        <em>next</em> item: the most urgent task, the shortest route, the
        cheapest offer. A sorted list gives you that instantly, but is slow to
        add to. An unsorted list is quick to add to, but finding the smallest
        means looking at everything. A <strong>heap</strong> is the
        in-between: it keeps just enough order that the smallest item is
        always on top, and adding or removing an item takes only{' '}
        <code>O(log n)</code>. It is the structure behind every{' '}
        <strong>priority queue</strong>.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Heaps &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A <strong>complete</strong> binary tree stored in a list, where every parent is no bigger than its children (a <strong>min-heap</strong>).</li>
                <li>Flip the rule and you get a <strong>max-heap</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;Give me the smallest (or most urgent) item&rdquo;, over and over, while new items keep arriving.</li>
                <li>Sorting everything each time is wasteful.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Do not sort. Only guarantee that each parent beats its children.</li>
                <li>That is enough to keep the best item at the top, and it is cheap to repair after a change.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li><strong>Push:</strong> add at the end, <strong>float up</strong> while smaller than the parent.</li>
                <li><strong>Pop:</strong> take the top, move the last item there, <strong>sink down</strong> while bigger than a child.</li>
                <li>Position <code>i</code> has children at <code>2i + 1</code>, <code>2i + 2</code> and a parent at <code>(i &minus; 1) // 2</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li><strong>Peek:</strong> always <code>O(1)</code>.</li>
                <li><strong>Push:</strong> best 1 comparison, worst <code>log n</code> swaps.</li>
                <li><strong>Pop:</strong> up to <code>log n</code> swaps.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Peek <code>O(1)</code>, push and pop <code>O(log n)</code>.</li>
                <li>Build from a list: <code>O(n)</code>.</li>
                <li>Space: <code>O(n)</code>, one slot per item.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Only the top is easy to reach. Searching is <code>O(n)</code>.</li>
                <li>The list is <strong>not</strong> sorted, only partly ordered.</li>
                <li>Not stable for equal items.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You need a priority queue, or the top k items.</li>
                <li>Scheduling, Dijkstra&rsquo;s shortest paths, merging sorted lists, running medians, heap sort.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Python&rsquo;s <code>heapq</code> is a <strong>min</strong>-heap. For a max-heap, negate the values.</li>
                <li>Printing a heap does not show sorted order.</li>
                <li>The &ldquo;heap&rdquo; in memory management is an unrelated thing.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Heap Rule</h3>
        <p>
          A heap has two properties, and both matter.
        </p>
        <p>
          <strong>The shape is a complete binary tree.</strong> Every level is
          full except possibly the last, which is filled from the left. That
          means no gaps, so the tree fits neatly in a plain list with
          nothing wasted: position <code>0</code> is the top, the children of
          position <code>i</code> are at <code>2i + 1</code> and{' '}
          <code>2i + 2</code>, and its parent is at <code>(i &minus; 1) // 2</code>.
          You met this on the Binary Trees and Heap Sort pages. No pointers,
          just arithmetic.
        </p>
        <p>
          <strong>The order is parent before children.</strong> In a{' '}
          <strong>min-heap</strong>, every item is no bigger than its
          children. In a <strong>max-heap</strong>, every item is no smaller.
          That is the whole rule. Here are the same seven numbers arranged
          both ways:
        </p>
        <HeapRuleVisual />
        <p>
          Look carefully at what the rule does <em>not</em> say. It says
          nothing about siblings: in the min-heap, the left child 3 is larger
          than the right child 2, and that is fine. It says nothing about
          cousins either: 7, deep on the left, is larger than 5 on the right,
          and equally fine. A heap is only <em>partly</em> ordered. But it has
          one guarantee that matters: following any path down from the top,
          the numbers never decrease. So the top of a min-heap is smaller
          than everything under it, which is everything. The smallest item
          is always at position 0.
        </p>
        <p>
          It is easy to confuse a heap with a binary search tree, so here is
          the difference side by side:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Binary search tree</th>
                <th>Min-heap</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.bst}</td>
                  <td>{row.heap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A search tree is built to <em>find</em> things. A heap gives up on
          finding anything but the extreme, and in return gets simpler, more
          compact, and quicker at changing.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Push and Pop: Float Up, Sink Down</h3>
        <p>
          Both operations follow the same pattern: make a change that keeps
          the <em>shape</em> right, then repair the <em>order</em> along a
          single path.
        </p>
        <p>
          <strong>Push</strong> adds the new item in the one place that keeps
          the tree complete: the end of the list. But it might be smaller than
          its parent, which breaks the rule. So compare it with its parent
          and swap if it is smaller, then compare with the new parent, and
          keep going until it is no longer smaller or it reaches the top. It{' '}
          <strong>floats up</strong>, one level per swap.
        </p>
        <p>
          <strong>Pop</strong> removes the top. That leaves a hole in the
          most important place. The trick is to fill it with the{' '}
          <em>last</em> item of the list, which keeps the tree complete.
          That item is probably too big for the top, so compare it with its
          two children, swap it with the <em>smaller</em> one, and keep going
          down until both children are bigger or there are none. It{' '}
          <strong>sinks down</strong>. (You swap with the smaller child so
          that the one moving up is no bigger than the other child. Pick the
          bigger one and the rule would break.)
        </p>
        <p>
          Either way, the item moves along one path of the tree, which is at
          most its height, and a complete tree is only <code>log&#8322; n</code>{' '}
          tall. That is where the <code>O(log n)</code> comes from.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Pick an operation, then press <strong>Play</strong>. The
          highlighted line is the one running now. The list is shown as bars,
          and as the tree it stands for underneath, so you can watch
          the same swaps in both. The lifted yellow bar is the item that is
          floating up or sinking down, and the blue bars are the ones it is
          being compared with. You can pause, step forward or back one line at
          a time, drag the slider to jump around, and change the speed.
        </p>
        <HeapTracer />
        <p>
          In <strong>Push</strong>, compare the three: 10 does not move at
          all, 4 rises two levels, and 1 rises all the way to the top. In{' '}
          <strong>Pop</strong>, notice that the item moved to the top is
          always the one that was last, and that it sinks past the{' '}
          <em>smaller</em> child each time. <strong>Build</strong> turns a
          jumbled list into a heap in place: it starts at the last item that
          has a child and works backwards to the top. Try{' '}
          <strong>Already a heap</strong> to see it do almost no work.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Building a Heap in O(n)</h3>
        <p>
          You could build a heap from a list by pushing the items in one at a
          time, which costs <code>O(n log n)</code>. But there is a faster
          way, and the Build tracer above uses it. Go through the list from
          the last parent back to the top, and sink each item into place.
          (The items in the second half of the list are leaves, and a leaf is
          already a tiny heap.)
        </p>
        <p>
          That looks like <code>n</code> sinks of <code>log n</code> each,
          but it is much cheaper than it looks, because how far an item can
          sink depends on how <em>far from the bottom</em> it is. Half of all
          the items are leaves and cannot sink at all. A quarter are one level
          up, so can sink at most one step. Only the single top item can sink
          the full height.
        </p>
        <HeapifyCostVisual />
        <p>
          Add it up over all levels, and the total is proportional to{' '}
          <code>n</code>, not <code>n log n</code>. That is why{' '}
          <code>heapq.heapify</code> is linear, and why it is the right way to
          turn an existing list into a heap.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Heaps in One Breath</h3>
        <div className="definition">
          A heap is a complete binary tree, stored in a list, in which every
          parent is no bigger than its children (a min-heap) or no smaller
          (a max-heap), so the smallest (or largest) item is always on top and
          can be removed in <code>O(log n)</code>.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((row) => (
                <tr key={row.op}>
                  <td><strong>{row.op}</strong></td>
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
        <p>
          If what you want is a priority queue, here is how a heap stacks up
          against the other ways of keeping items:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Structure</th>
                <th>Peek smallest</th>
                <th>Insert</th>
                <th>Remove smallest</th>
                <th>Worth knowing</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td><code>{row.peek}</code></td>
                  <td><code>{row.insert}</code></td>
                  <td><code>{row.remove}</code></td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Heaps in Python: heapq</h3>
        <p>
          You rarely write a heap yourself. Python&rsquo;s{' '}
          <code>heapq</code> module works on an ordinary list, treating it
          as exactly the complete tree on this page:
        </p>
        <div className="code-block">
          <code>{`import heapq

heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)

heap[0]                  # 1  -> peek at the smallest, O(1)
heapq.heappop(heap)      # 1  -> remove and return it
heapq.heappop(heap)      # 3

nums = [5, 3, 8, 1, 9]
heapq.heapify(nums)      # rearranges the list in place into a heap, O(n)`}</code>
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {heapq.map((row) => (
                <tr key={row.op}>
                  <td><code>{row.op}</code></td>
                  <td><code>{row.time}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Three things catch people out:</p>
        <ul>
          <li>
            <strong>It is a min-heap only.</strong> For a max-heap, push the{' '}
            <em>negated</em> values (<code>heappush(heap, -x)</code>) and
            negate again when you pop.
          </li>
          <li>
            <strong>The list is not sorted.</strong> Printing <code>heap</code>{' '}
            shows the heap order, not ascending order. Only <code>heap[0]</code>{' '}
            is guaranteed to be the smallest.
          </li>
          <li>
            <strong>Ties compare the next item.</strong> A priority queue
            usually stores pairs like <code>(priority, task)</code>. If two
            priorities are equal, Python compares the tasks, which can fail if
            they cannot be compared. Put a counter in the middle:{' '}
            <code>(priority, counter, task)</code>. It also keeps equal
            priorities in the order they arrived.
          </li>
        </ul>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You need a priority queue.</strong> Task schedulers,
          event simulations and anything that must always handle the most
          urgent item next. Items arrive in any order and leave in priority
          order.
        </p>
        <p>
          <strong>You only need the best few.</strong> The top <code>k</code>{' '}
          items out of a huge stream: keep a min-heap of size <code>k</code>{' '}
          and throw out its smallest whenever a bigger one arrives. This costs{' '}
          <code>O(n log k)</code> and uses only <code>O(k)</code> memory,
          instead of sorting everything.
        </p>
        <p>
          <strong>You are merging sorted sources.</strong> To merge{' '}
          <code>k</code> sorted lists, keep a heap holding the front item of
          each list and repeatedly pop the smallest. <code>heapq.merge</code>{' '}
          does it for you.
        </p>
        <p>
          <strong>A shortest-path or &ldquo;cheapest next&rdquo; algorithm.</strong>{' '}
          Dijkstra&rsquo;s algorithm, coming up in Graphs, uses a heap to
          pick the closest unvisited place each step. A running median can be
          kept with two heaps, a max-heap for the smaller half and a min-heap
          for the larger half.
        </p>
        <p>
          <strong>You need a sort that cannot go wrong.</strong> Heap sort is
          just &ldquo;build a heap, pop everything&rdquo;, with a guaranteed{' '}
          <code>O(n log n)</code> and no extra memory.
        </p>
        <p>
          <strong>Skip it when you need to search or keep full order.</strong>{' '}
          A heap cannot find a value quickly or give you sorted output
          cheaply. For that, use a search tree or a sorted list.
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

export default Heaps
