import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import SegTreeTracer from './SegTreeTracer.jsx'
import { QueryVisual, BuildVisual, UpdateVisual, SameTreeVisual, WorkVisual } from './SegTreeVisuals.jsx'

const cases = [
  { name: 'Completely outside', swatch: '#e4e4e2', means: 'The node covers none of the positions we want.', action: 'Return 0 (nothing to add). Do not look at its children.' },
  { name: 'Completely inside', swatch: '#86d69f', means: 'The node covers only positions we want.', action: 'Return its stored sum. Do not look at its children.' },
  { name: 'Partly inside', swatch: '#ffe27a', means: 'The range cuts through the node: some of its positions are wanted and some are not.', action: 'Ask both children, and add their answers.' },
]

const versus = [
  { prop: 'Sum of a range', loop: 'O(n)', prefix: 'O(1)', tree: 'O(log n)' },
  { prop: 'Change one number', loop: 'O(1)', prefix: 'O(n)', tree: 'O(log n)' },
  { prop: 'Setting it up', loop: 'nothing to do', prefix: 'O(n)', tree: 'O(n)' },
  { prop: 'Extra memory', loop: 'none', prefix: 'O(n)', tree: 'O(n)' },
  { prop: 'Min, max, gcd of a range', loop: 'yes, O(n)', prefix: 'no: you cannot “subtract” a minimum', tree: 'yes, O(log n)' },
  { prop: 'Best when', loop: 'few questions, or a tiny array', prefix: 'many questions, and the numbers never change', tree: 'many questions and many changes' },
]

const costs = [
  { what: 'Build the tree', time: 'O(n)', why: 'There are about 2n nodes, and each one is filled in once from its two children.' },
  { what: 'Sum (or min, max…) of any range', time: 'O(log n)', why: 'At each level only the nodes the range edges cut through are opened, which is at most two. There are about log n levels.' },
  { what: 'Change one number', time: 'O(log n)', why: 'One node per level has to be recalculated, from the leaf up to the root.' },
  { what: 'The answer for the whole array', time: 'O(1)', why: 'It is already stored in the root.' },
  { what: 'Extra memory', time: 'O(n)', why: 'About 2n − 1 nodes. The simple code on this page reserves 4n slots in a list so it never runs out of room.' },
  { what: 'Add a value to a whole range at once', time: 'O(log n)', why: 'Needs a trick called lazy propagation (below). Without it, this takes O(n).' },
]

const examples = [
  {
    id: 'build',
    prompt: 'Building a segment tree over n numbers.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'About 2n nodes are built, each with one addition. The tree itself takes space in proportion to n.',
  },
  {
    id: 'query',
    prompt: 'Asking a segment tree for the sum of positions left to right, in an array of n numbers.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'At most two nodes per level are opened, and there are about log n levels. The recursion goes one level deeper at a time, so it holds about log n open calls.',
  },
  {
    id: 'update',
    prompt: 'Changing one of the n numbers and fixing the segment tree.',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'One node per level is rewritten, from the leaf up to the root. The recursion is about log n calls deep.',
  },
  {
    id: 'loop',
    prompt: 'No tree: adding up positions left to right with a for loop, in an array of n numbers.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'In the worst case the range is the whole array, so every number is added. Only a running total is kept.',
  },
  {
    id: 'prefix-query',
    prompt: 'Using a prefix-sum array (already built) to get the sum of any range of an array of n numbers: prefix[right + 1] - prefix[left].',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Two lookups and one subtraction, however long the range is. The catch is what happens when a number changes.',
  },
  {
    id: 'prefix-update',
    prompt: 'Changing one of n numbers when you keep a prefix-sum array.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every prefix sum after that position includes the changed number, so up to n entries have to be rewritten.',
  },
  {
    id: 'root',
    prompt: 'Reading the sum of the whole array from the root of a segment tree: tree[1].',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The root already holds it. It is one list lookup.',
  },
  {
    id: 'build-by-update',
    prompt: 'Building a segment tree over n numbers by starting with zeros and calling update once for every number.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'n updates, each O(log n). It works, but the direct bottom-up build is O(n), which is faster.',
  },
]

function SegmentTrees() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Advanced Data Structures</p>
      <h2>Segment Trees</h2>
      <p>
        Here is a question you may need to answer thousands of times:{' '}
        <em>what is the sum of the numbers from position 2 to position 6?</em>{' '}
        And between questions, some of the numbers change. A loop answers each
        question by adding up the range, which gets slow. A{' '}
        <strong>segment tree</strong> keeps the sum of{' '}
        <strong>many ranges ready in advance</strong>, so any range can be
        answered by combining a few of them.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <QueryVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Segment Trees &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A tree over an array. Each node stores a <strong>summary of a range</strong> (a sum, a minimum…).</li>
                <li>Leaves are single numbers. The root covers everything.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Many <strong>range questions</strong>, mixed with many <strong>changes</strong>.</li>
                <li>Both stay fast.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Split the range in half again and again.</li>
                <li>A node = its left child + its right child.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Answering a range</h4>
              <ul>
                <li><strong>Outside</strong>: ignore it.</li>
                <li><strong>Inside</strong>: use its stored value.</li>
                <li><strong>Partly</strong>: ask both children.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Changing a number</h4>
              <ul>
                <li>Overwrite the leaf.</li>
                <li>Fix every node above it, up to the root: <strong>one per level</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Build: <code>O(n)</code>.</li>
                <li>Query and update: <code>O(log n)</code>.</li>
                <li>Memory: <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Slower than prefix sums when nothing ever changes.</li>
                <li>More code than a plain loop.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Lots of range sums, minimums or maximums, <strong>and</strong> lots of updates.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Off-by-one on the range edges (are they inclusive?).</li>
                <li>Returning 0 for an empty range when the question is a minimum: it should be infinity.</li>
                <li>Forgetting to fix the nodes above after a change.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Split.</strong> The root covers the whole array. Cut that range in half: each half becomes a child. Keep cutting until every range is a single position. Those are the leaves.</li>
          <li><strong>Store.</strong> Each node keeps the sum of the range it covers. A leaf is just its number, and any other node is the sum of its two children.</li>
          <li><strong>Ask.</strong> To get the sum of a range, start at the root and use the rules in the table below.</li>
          <li><strong>Change.</strong> To change a number, overwrite its leaf and recalculate the nodes above it.</li>
        </ol>
        <p>
          The tree is kept in a plain Python list, with the same numbering trick
          as a heap: the root is at position 1, and the children of position{' '}
          <code>k</code> are at <code>2k</code> and <code>2k + 1</code>. The list
          is made <code>4 × n</code> long, which is always enough, even when{' '}
          <code>n</code> is not a power of two and the tree comes out slightly
          uneven.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Building It, Bottom Up</h3>
        <p>
          The leaves come straight from the array. Then every node above is just
          the sum of its two children. Nothing else is needed.
        </p>
        <BuildVisual />
        <p>
          Eight numbers need 15 nodes: 8 leaves and 7 above them. In general, a
          tree over <code>n</code> numbers has <code>2n &minus; 1</code> nodes, so
          the tree is only about twice the size of the array.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Asking a Question</h3>
        <p>
          At every node, compare what the node covers with the range you want.
          There are only three cases:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>The node is&hellip;</th>
                <th>Which means</th>
                <th>So</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row) => (
                <tr key={row.name}>
                  <td>
                    <span className="swatch" style={{ background: row.swatch, marginRight: 6 }} />
                    <strong>{row.name}</strong>
                  </td>
                  <td>{row.means}</td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Why is this fast? Only the nodes that the <em>edges</em> of the range
          cut through are &ldquo;partly inside&rdquo;. A range has two edges, so
          at most two nodes per level are opened. Everything else is either used
          whole or skipped, and the tree has only about log n levels.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Changing a Number</h3>
        <p>
          Overwrite the leaf. Then every node whose range includes that position
          is out of date, and there is exactly one of those on each level, so
          they can be fixed one by one on the way back up.
        </p>
        <UpdateVisual />
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          The tree holds the numbers <code>[2, 5, 1, 4, 9, 3, 7, 6]</code>. The
          small label under each node is the part of the array it covers. Press{' '}
          <strong>Play</strong>, and watch the recursion in the call stack under
          the tree. Here is the class that wraps the three functions:
        </p>
        <div className="code-block">
          <code>{`class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)
        build(nums, self.tree, 1, 0, self.n - 1)

    def query(self, left, right):
        return query(self.tree, 1, 0, self.n - 1, left, right)

    def update(self, i, value):
        update(self.tree, 1, 0, self.n - 1, i, value)`}</code>
        </div>
        <SegTreeTracer />
        <p>
          In <strong>Query</strong>, try <strong>Positions 2 to 6</strong> and
          count the green nodes: only three stored sums are used for five
          numbers. Then <strong>The whole array</strong>: the root is completely
          inside the range, so the answer comes back at once. In{' '}
          <strong>Update</strong>, notice that the second half of the tree is
          never visited when the position is in the first half. And in{' '}
          <strong>Build</strong>, try six numbers: the tree comes out slightly
          uneven, and everything still works.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Same Tree, Different Question</h3>
        <p>
          Nothing in the tree is really about sums. It only needs a way to
          combine two children into their parent. Swap <code>+</code> for{' '}
          <code>min</code> and the same tree answers &ldquo;what is the smallest
          number from position 2 to 6?&rdquo;.
        </p>
        <SameTreeVisual />
        <p>
          The same trick works for the largest value, the greatest common divisor,
          a product, or &ldquo;how many numbers in this range are even?&rdquo;.
          The one thing to get right is what an{' '}
          <em>outside</em> node returns: something that changes nothing when it
          is combined. That is 0 for a sum, infinity for a minimum, and 1 for a
          product.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Segment Tree or Prefix Sums?</h3>
        <p>
          For sums there is a simpler idea: a <em>prefix-sum</em> array, where
          entry <code>i</code> holds the sum of everything before position{' '}
          <code>i</code>. Then any range sum is one subtraction. But if a number
          changes, every entry after it has to be rewritten. The segment tree
          is the middle road:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Plain loop</th>
                <th>Prefix sums</th>
                <th>Segment tree</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.loop}</td>
                  <td>{row.prefix}</td>
                  <td>{row.tree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Segment Tree in One Breath</h3>
        <div className="definition">
          A segment tree is a binary tree built over an array, in which every
          node stores a summary (such as the sum, minimum or maximum) of the
          range of positions it covers, and is computed from its two children.
          Any range can be answered by combining at most about 2 log n stored
          summaries, and changing one number only means fixing the log n nodes
          above it.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A loop pays for every number in the range. The tree pays for the
              number of <em>levels</em>, which grows very slowly: a million
              numbers need only about 20 levels.
            </p>
            <p>
              <code>O(n)</code> to build, <code>O(log n)</code> to query or
              update, and <code>O(n)</code> memory.
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
        <p>
          <strong>Lazy propagation</strong> is the next step up. If the task is
          &ldquo;add 5 to every number from position 2 to 6&rdquo;, the tree can
          leave a note on a node (&ldquo;everything below me still needs +5&rdquo;)
          and only push it down when something needs to look inside. That keeps
          even range changes at O(log n).
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You have many range questions and many changes.</strong> Live
          scores, stock prices over a window of days, counters per time slot.
        </p>
        <p>
          <strong>The question is a minimum, a maximum or a gcd.</strong> Prefix
          sums cannot do those, because they cannot undo a combine.
        </p>
        <p>
          <strong>The numbers never change.</strong> For sums, prefix sums are
          simpler and answer in O(1). For minimums, a structure called a sparse
          table also answers in O(1).
        </p>
        <p>
          <strong>You only add to numbers and ask for sums.</strong> A Fenwick
          tree, the next page, does that with much less code and memory.
        </p>
        <p>
          <strong>Only a few questions will ever be asked.</strong> Just loop.
          Building the tree costs O(n), which is not worth it for one question.
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

export default SegmentTrees
