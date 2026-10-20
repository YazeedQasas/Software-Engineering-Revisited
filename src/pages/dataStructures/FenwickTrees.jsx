import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import FenwickTracer from './FenwickTracer.jsx'
import { QueryVisual, LowbitVisual, UpdateVisual, RangeVisual, TreeVisual, WorkVisual } from './FenwickVisuals.jsx'
import { BASE, coverOf, fenTree, lowbit } from './fenData.js'

const TREE = fenTree(BASE)

// One row per box: its number in binary, the lowest 1, and what it adds up.
const owns = BASE.map((_, k) => {
  const i = k + 1
  const { from, to } = coverOf(i)
  return {
    i,
    binary: i.toString(2).padStart(4, '0'),
    low: lowbit(i),
    covers: from === to ? `${to}` : `${from} to ${to}`,
    sum: TREE[i],
    sums: BASE.slice(from - 1, to).join(' + '),
  }
})

const versus = [
  { prop: 'Sum of the first i numbers', seg: 'O(log n)', fen: 'O(log n)' },
  { prop: 'Sum of any range', seg: 'O(log n)', fen: 'O(log n): two prefix sums, subtracted' },
  { prop: 'Change one number', seg: 'O(log n): overwrite it', fen: 'O(log n): add an amount to it' },
  { prop: 'Setting it up', seg: 'O(n)', fen: 'O(n)' },
  { prop: 'Memory', seg: 'about 2n nodes (4n slots in simple code)', fen: 'n + 1 slots' },
  { prop: 'Lines of code', seg: 'three recursive functions', fen: 'two short loops' },
  { prop: 'Min, max, gcd of a range', seg: 'yes', fen: 'no: it needs to undo a combine, as subtracting undoes a sum' },
  { prop: 'Best when', seg: 'you need more than sums', fen: 'you only need sums (or counts) and want the least code' },
]

const costs = [
  { what: 'Build the tree', time: 'O(n)', why: 'Every box is finished once, and hands its sum to just one box above it.' },
  { what: 'Sum of the first i numbers', time: 'O(log n)', why: 'Each step removes the lowest 1 from a binary number, so there are at most as many steps as it has 1s, which is at most log n.' },
  { what: 'Sum of any range', time: 'O(log n)', why: 'Two of those walks, and one subtraction.' },
  { what: 'Add to one number', time: 'O(log n)', why: 'Each step adds the lowest 1 of i, and the new i always has a lowest 1 at least twice as big, so i passes n after at most about log n steps.' },
  { what: 'Extra memory', time: 'O(n)', why: 'A list of n + 1 slots. The walks use only a few variables, with no recursion.' },
]

const examples = [
  {
    id: 'build',
    prompt: 'Building a Fenwick tree over n numbers with the loop that hands each finished box up to the box above it.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each of the n boxes is finished once and passes its sum to one box. The list of n + 1 slots is the extra space.',
  },
  {
    id: 'prefix',
    prompt: 'Asking a Fenwick tree for the sum of the first i numbers, in an array of n numbers.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'At most one step per binary digit of i, so at most about log n steps. A loop needs only total and i, no recursion.',
  },
  {
    id: 'update',
    prompt: 'Adding an amount to one of the n numbers and fixing the Fenwick tree.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Each step adds the lowest 1 of i, and the new i always has a lowest 1 at least twice as big, so there are at most about log n steps.',
  },
  {
    id: 'range',
    prompt: 'Asking a Fenwick tree for the sum of positions left to right: prefix_sum(right) - prefix_sum(left - 1).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Two walks of at most log n steps each, and one subtraction. Still O(log n).',
  },
  {
    id: 'loop',
    prompt: 'No tree: adding up positions left to right with a for loop, in an array of n numbers.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'In the worst case the range is the whole array, so every number is added. Only a running total is kept.',
  },
  {
    id: 'prefix-update',
    prompt: 'Changing one of n numbers when you keep a prefix-sum array.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every prefix sum after that position includes the changed number, so up to n entries have to be rewritten.',
  },
  {
    id: 'lowbit',
    prompt: 'Working out the lowest 1-bit of a number: i & -i.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'It is a single operation on one number. The computer does it in one step, whatever the size of i.',
  },
  {
    id: 'build-by-update',
    prompt: 'Building a Fenwick tree over n numbers by starting with zeros and calling update once for every number.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'n updates, each O(log n). It works, but handing each box up to the one above it builds the same tree in O(n).',
  },
]

function FenwickTrees() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Advanced Data Structures</p>
      <h2>Fenwick Trees</h2>
      <p>
        Here is a question you may need to answer thousands of times:{' '}
        <em>what is the sum of the first 7 numbers?</em> And between questions,
        some of the numbers change. A <strong>Fenwick tree</strong> (also called
        a <strong>Binary Indexed Tree</strong>) keeps the sums of{' '}
        <strong>a few well-chosen groups of numbers</strong> in an ordinary list,
        and any prefix can be built from just a handful of them.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <QueryVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Fenwick Trees &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A plain <strong>list</strong> of stored sums. The tree is only in how you jump around it.</li>
                <li>Positions are numbered from <strong>1</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Many <strong>sums</strong>, mixed with many <strong>changes</strong>.</li>
                <li>Both stay fast, with very little code.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Box <code>i</code> adds up the positions ending at <code>i</code>.</li>
                <li>How many? The value of the <strong>lowest 1</strong> in <code>i</code>&rsquo;s binary: <code>i &amp; -i</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Asking for the first i</h4>
              <ul>
                <li>Read box <code>i</code>.</li>
                <li>Remove its lowest 1: <code>i -= i &amp; -i</code>.</li>
                <li>Repeat until <code>i</code> is 0.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Changing a number</h4>
              <ul>
                <li>Add the amount to box <code>i</code>.</li>
                <li>Add the lowest 1: <code>i += i &amp; -i</code>.</li>
                <li>Repeat until <code>i</code> passes <code>n</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Build: <code>O(n)</code>.</li>
                <li>Prefix sum, range sum, update: <code>O(log n)</code>.</li>
                <li>Memory: <code>n + 1</code> slots.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Mostly sums (and counts). No min or max.</li>
                <li>Hard to read at first: the binary trick is not obvious.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Lots of sums <strong>and</strong> lots of changes, and you want short code.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Position <strong>0</strong>: the update loop never ends.</li>
                <li>Update <strong>adds</strong> an amount, it does not overwrite.</li>
                <li>Off-by-one between positions (from 1) and the Python list (from 0).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Count from 1.</strong> Call the positions 1, 2, 3 and so on. (A Fenwick tree cannot use position 0: you will see why in a moment.)</li>
          <li><strong>Give each position a box.</strong> Box <code>i</code> stores the sum of the positions that <em>end</em> at <code>i</code>. Some boxes add up one position, some add up two, some four. The next section shows which.</li>
          <li><strong>Ask.</strong> To get the sum of the first <code>i</code> numbers, read box <code>i</code>, hop left to the box for whatever positions are still uncovered, and keep hopping until nothing is left.</li>
          <li><strong>Change.</strong> To add an amount to position <code>i</code>, add it to box <code>i</code> and to every other box that includes position <code>i</code>.</li>
        </ol>
        <p>
          Everything lives in one list of <code>n + 1</code> slots. Slot 0 is
          never used, and box <code>i</code> is simply <code>tree[i]</code>. There
          are no nodes and no pointers: the hops are done with a little binary
          arithmetic, on the next few pages.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Who Adds Up What</h3>
        <p>
          How many positions does box <code>i</code> add up? Write{' '}
          <code>i</code> in binary and look at its <strong>lowest 1</strong>.
          Whatever that 1 is worth is the number of positions the box covers.
        </p>
        <LowbitVisual />
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Box</th>
                <th>In binary</th>
                <th>Lowest 1</th>
                <th>Adds up positions</th>
                <th>Stores</th>
              </tr>
            </thead>
            <tbody>
              {owns.map((row) => (
                <tr key={row.i}>
                  <td><strong>{row.i}</strong></td>
                  <td><code>{row.binary}</code></td>
                  <td>{row.low}</td>
                  <td>{row.covers}</td>
                  <td>{row.sums.includes('+') ? `${row.sums} = ${row.sum}` : row.sum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The code for &ldquo;the value of the lowest 1&rdquo; is{' '}
          <code>i &amp; -i</code>. You do not need to know why it works to use it:
          in Python, <code>6 &amp; -6</code> is <code>2</code>, and{' '}
          <code>8 &amp; -8</code> is <code>8</code>. (It works because a computer
          stores <code>-i</code> by flipping every digit of <code>i</code> and
          adding 1, which leaves exactly the lowest 1 in common.) It also explains
          the ban on position 0: <code>0 &amp; -0</code> is <code>0</code>, so a
          hop from 0 goes nowhere.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Asking a Question</h3>
        <p>
          Start at <code>i</code>. Read box <code>i</code>: it covers the last{' '}
          <code>i &amp; -i</code> positions. What is left is everything before
          those, which is the first <code>i &minus; (i &amp; -i)</code> numbers.
          That number is just <code>i</code> with its lowest 1 removed, so it
          ends at another box. Repeat until nothing is left. Watch the binary
          numbers lose their 1s one by one:
        </p>
        <QueryVisual bits />
        <p>
          A number has at most as many 1s as it has digits, and a number up to{' '}
          <code>n</code> has about <code>log n</code> digits. So no question ever
          reads more than about <code>log n</code> boxes.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Changing a Number</h3>
        <p>
          Now the other direction. Which boxes add up position <code>i</code>?
          Box <code>i</code> itself, and then every box whose range grows over
          it. The next one is found by <em>adding</em> the lowest 1 instead of
          removing it. Keep going until the number is bigger than{' '}
          <code>n</code>.
        </p>
        <UpdateVisual />
        <p>
          Notice that the tree is given an <strong>amount to add</strong>, not a
          new value. To set position 3 to 6 when it holds 1, add 5. If you need
          to overwrite numbers, keep a separate copy of the array so you can work
          out the difference.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Any Range: Two Prefixes</h3>
        <p>
          A Fenwick tree only knows sums that start at position 1. A sum of any
          range can be made from two of those: take everything up to the right
          end, then take away everything before the left end.
        </p>
        <RangeVisual />
        <p>
          It is the same trick as prefix sums in an ordinary array, but each
          prefix costs <code>O(log n)</code> to get instead of one lookup, and in
          exchange a change no longer costs <code>O(n)</code>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Tree Hiding in the List</h3>
        <p>
          So where is the tree? Join every box to the box a change hands itself
          up to, <code>i + (i &amp; -i)</code>, and a tree appears. Following a
          change from a position to the root is exactly the update loop.
        </p>
        <TreeVisual />
        <p>
          Asking walks a different way, by removing 1s rather than adding them,
          which is why the answer to a question is not a path in this tree.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          The tree holds the numbers <code>[2, 5, 1, 4, 9, 3, 7, 6]</code>. Press{' '}
          <strong>Play</strong>, and watch the line of code, the bars and the
          binary numbers change together. Here is the class that wraps the four
          pieces:
        </p>
        <div className="code-block">
          <code>{`class FenwickTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (self.n + 1)
        for i in range(1, self.n + 1):
            self.tree[i] += nums[i - 1]
            j = i + (i & -i)
            if j <= self.n:
                self.tree[j] += self.tree[i]

    def prefix_sum(self, i):
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total

    def update(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i

    def range_sum(self, left, right):
        return self.prefix_sum(right) - self.prefix_sum(left - 1)`}</code>
        </div>
        <FenwickTracer />
        <p>
          In <strong>Sum of the first i</strong>, try <strong>First 7 numbers</strong>{' '}
          and watch three bars stand in for seven numbers, then{' '}
          <strong>First 8</strong>: one bar is enough. In <strong>Update</strong>,{' '}
          <strong>Add 1 to position 1</strong> is the longest walk: four bars. In{' '}
          <strong>Sum of a range</strong>, <strong>Positions 5 to 7</strong> reads
          bar 4 twice: it is added once and taken away once, so it cancels. And{' '}
          <strong>Build</strong> shows the O(n) trick: each finished bar hands its
          sum to the bar above, so every number is added a few times at most,
          never from scratch.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Fenwick Tree or Segment Tree?</h3>
        <p>
          Both answer sums and take changes in <code>O(log n)</code>. The Fenwick
          tree is smaller and shorter. The segment tree can do more. The rule of
          thumb: if the question is a sum or a count, start with a Fenwick tree.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Segment tree</th>
                <th>Fenwick tree</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.seg}</td>
                  <td>{row.fen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Fenwick Tree in One Breath</h3>
        <div className="definition">
          A Fenwick tree is a list in which slot <code>i</code> stores the sum of
          the <code>i &amp; -i</code> positions that end at position{' '}
          <code>i</code>. The sum of the first <code>i</code> numbers is found by
          reading slot <code>i</code> and repeatedly removing the lowest 1 of{' '}
          <code>i</code>, and a number is changed by repeatedly adding the lowest
          1 of <code>i</code>, so both take about log n steps.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A loop pays for every number in the range. The tree pays for the
              number of <em>1s in a binary number</em>, which grows very slowly:
              a million positions need at most about 20 steps.
            </p>
            <p>
              <code>O(n)</code> to build, <code>O(log n)</code> to ask or change,
              and just <code>n + 1</code> slots of memory.
            </p>
          </div>
          <WorkVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>What</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((row) => (
                <tr key={row.what}>
                  <td><strong>{row.what}</strong></td>
                  <td><code>{row.time}</code></td>
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
          <strong>You have many sums and many changes.</strong> Scores on a live
          leaderboard, money moving in and out of accounts, counters per time
          slot.
        </p>
        <p>
          <strong>You are counting.</strong> &ldquo;How many players have a score
          below 50?&rdquo; becomes a prefix sum if you keep one counter per
          score, which is why Fenwick trees show up in ranking problems.
        </p>
        <p>
          <strong>You want short code.</strong> The whole thing is about ten
          lines, with no recursion.
        </p>
        <p>
          <strong>You need a minimum, a maximum or a gcd.</strong> Use a
          segment tree. The Fenwick tree needs to take away what it added, and
          there is no way to undo a minimum.
        </p>
        <p>
          <strong>The numbers never change.</strong> A plain prefix-sum array
          answers in O(1).
        </p>
        <p>
          <strong>Only a few questions will ever be asked.</strong> Just loop.
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

export default FenwickTrees
