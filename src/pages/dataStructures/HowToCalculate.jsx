import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  LoopGridVisual,
  HalvingVisual,
  RecursionTreeVisual,
} from './HowToCalculateVisuals.jsx'

const rules = [
  { rule: 'Sequential: add', example: 'a loop over n, then another loop over n', result: 'n + n = 2n → O(n)' },
  { rule: 'Nested: multiply', example: 'a loop over n with another loop over n inside it', result: 'n × n → O(n²)' },
  { rule: 'Drop constants', example: '3n + 5 steps', result: 'O(n)' },
  { rule: 'Drop smaller terms', example: 'n² + n steps', result: 'O(n²)' },
  { rule: 'Different inputs, different letters', example: 'a loop over list a (n items) nested over list b (m items)', result: 'O(n × m), not O(n²)' },
  { rule: 'Branches: take the worst', example: 'an if with an O(1) branch and an O(n) branch', result: 'O(n)' },
  { rule: 'Halving: log', example: 'a loop that cuts the remaining range in half each time', result: 'O(log n)' },
  { rule: 'Recursion: calls × work per call', example: 'about n calls, constant work each', result: 'O(n)' },
]

const hidden = [
  { op: 'len(x)', time: 'O(1)', space: 'O(1)', why: 'Python stores the length.' },
  { op: 'x in my_list', time: 'O(n)', space: 'O(1)', why: 'A hidden loop that checks each item.' },
  { op: 'x in my_set / my_dict', time: 'O(1) avg', space: 'O(1)', why: 'Hashing jumps straight to it.' },
  { op: 'my_list.insert(0, x) / pop(0)', time: 'O(n)', space: 'O(1)', why: 'Everything shifts over.' },
  { op: 'my_list[i:j]', time: 'O(j − i)', space: 'O(j − i)', why: 'Builds a new list by copying.' },
  { op: 'a + b (two lists)', time: 'O(len(a) + len(b))', space: 'O(len(a) + len(b))', why: 'Builds a brand new list.' },
  { op: 'min(x) / max(x) / sum(x)', time: 'O(n)', space: 'O(1)', why: 'Has to look at every item.' },
  { op: 'sorted(x) / x.sort()', time: 'O(n log n)', space: 'O(n)', why: 'Python sorts with Timsort; sorted() also makes a copy.' },
  { op: "''.join(parts)", time: 'O(total length)', space: 'O(total length)', why: 'One pass to build the final string.' },
  { op: 'repeated s = s + ch in a loop', time: 'O(n²) worst', space: 'O(n)', why: 'Each + may copy the whole string so far.' },
]

const sizes = [
  { limit: 'n up to about 10', fits: 'O(n!)', note: 'Trying every ordering is fine.' },
  { limit: 'n up to about 20', fits: 'O(2ⁿ)', note: 'Trying every subset is fine.' },
  { limit: 'n up to a few hundred', fits: 'O(n³)', note: 'Three nested loops still finish.' },
  { limit: 'n up to a few thousand', fits: 'O(n²)', note: 'Two nested loops are fine.' },
  { limit: 'n up to about 10⁵ or 10⁶', fits: 'O(n log n) or O(n)', note: 'You need sorting-speed or better.' },
  { limit: 'n up to 10⁹ or more', fits: 'O(log n) or O(1)', note: 'You cannot even look at every item.' },
]

const examples = [
  {
    id: 'constants',
    prompt: 'A loop over n items that does three O(1) statements per item, plus one inner loop of fixed length 10.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Roughly 13n steps. A fixed inner loop is just a constant, and constants are dropped.',
  },
  {
    id: 'sequential',
    prompt: 'One loop over n items, followed by a second separate loop over the same n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Sequential work adds: n + n = 2n, and the 2 is dropped.',
  },
  {
    id: 'triangle',
    prompt: 'for i in range(n): for j in range(i): count += 1',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'The inner loop runs 0 + 1 + 2 + ... + (n − 1) times, which is n(n − 1) / 2. Drop the constants and you keep n².',
  },
  {
    id: 'doubling',
    prompt: 'i = 1, then: while i < n: i *= 2',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'i doubles each pass, so it reaches n after about log₂ n passes.',
  },
  {
    id: 'hidden-in',
    prompt: 'for x in nums: if x in other (where other is a plain list of n items)',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'The "in" on a list is a hidden loop, so it is a loop of n inside a loop of n.',
  },
  {
    id: 'list-plus',
    prompt: 'result = []; for x in nums: result = result + [x]',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Each + builds a new list by copying everything so far: 1 + 2 + ... + n copies. The list itself ends up holding n items.',
  },
  {
    id: 'merge-sort',
    prompt: 'Merge sort on n items.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'About log n levels of splitting, each doing n work to merge, and the merging needs a spare array.',
  },
  {
    id: 'binary-search-rec',
    prompt: 'Recursive binary search on a sorted list of n items, passing low and high indexes (no slicing).',
    time: 'O(log n)',
    space: 'O(log n)',
    explanation: 'The range halves each call, so there are about log n calls, all still open at the deepest point.',
  },
]

function HowToCalculate() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Algorithmic Complexity</p>
      <h2>How to Calculate Complexity</h2>
      <p>
        The last page gave you a four-step method for time and space. This
        page is the practice: how each step actually works on real code, in
        a way that you can repeat without second-guessing yourself. By the
        end, you should be able to look at a function and walk to an answer
        instead of guessing one.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">How to Calculate Complexity &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What you&rsquo;re doing</h4>
              <ul>
                <li>Counting how many steps (or memory cells) the code uses as a function of <code>n</code>.</li>
                <li>Then simplifying that count to its dominant term.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. Why guessing fails</h4>
              <ul>
                <li>Two people can eyeball the same code and disagree.</li>
                <li>A fixed procedure gives everyone the same answer.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. Count first, then squint</h4>
              <ul>
                <li>Count precisely (<code>3n + 5</code>), then zoom out.</li>
                <li>For big <code>n</code>, only the biggest term matters, and constants fade.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The rules</h4>
              <ul>
                <li>Sequential: <strong>add</strong>. Nested: <strong>multiply</strong>.</li>
                <li>Drop constants and smaller terms.</li>
                <li>Different inputs get different letters (<code>n</code>, <code>m</code>).</li>
                <li>Branches: take the worst. Halving: <code>log n</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Loops</h4>
              <ul>
                <li>One loop over <code>n</code>: <code>O(n)</code>.</li>
                <li>Inner loop depends on the outer one (<code>range(i)</code>): sum is <code>n(n&minus;1)/2</code>, still <code>O(n&sup2;)</code>.</li>
                <li><code>i *= 2</code> or <code>i //= 2</code>: <code>O(log n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Recursion</h4>
              <ul>
                <li>Time: number of calls &times; work per call.</li>
                <li>Draw the tree: work per level &times; number of levels.</li>
                <li>Space: how deep the calls go.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Hidden costs</h4>
              <ul>
                <li>Built-ins hide loops: <code>x in list</code>, slicing, <code>+</code> on lists, <code>sorted</code>, <code>min</code>.</li>
                <li>Always ask what one line really costs.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Where it bends</h4>
              <ul>
                <li>Worst, average and best case can differ.</li>
                <li>Amortized cost spreads rare expensive steps.</li>
                <li>Big-O hides constants.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Using it</h4>
              <ul>
                <li>Before coding: use the limits on <code>n</code> to pick a target.</li>
                <li>After coding: annotate each line and walk the steps.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Calculating Complexity in One Breath</h3>
        <div className="definition">
          Calculating complexity means counting how many times the work
          repeats as the input grows, adding or multiplying those counts
          the way the code is structured, and keeping only the biggest
          term.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why Eyeballing Isn&rsquo;t Enough</h3>
        <p>
          With simple code, you can often just feel the answer: one loop,
          so linear. But code gets trickier fast. A loop that starts inside
          another loop, a call to something that hides a loop, a recursive
          function that calls itself twice: these are where two careful
          people reading the same code arrive at different answers.
        </p>
        <p>
          The fix is the same as in any subject: replace instinct with a
          procedure. Count the work carefully, line by line if you need to,
          then simplify by a few fixed rules. Once the procedure is
          automatic, the tricky cases stop being tricky.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Count First, Then Squint</h3>
        <p>
          Here&rsquo;s the idea that holds the whole process together.
          Calculating complexity has two phases, and keeping them separate
          is what stops you getting confused.
        </p>
        <p>
          <strong>Phase one: count.</strong> Work out roughly how many steps
          the code takes in terms of <code>n</code>, as exactly as you
          reasonably can. Say it comes out to <code>3n&sup2; + 5n + 2</code>.
        </p>
        <p>
          <strong>Phase two: squint.</strong> Now zoom out, as if{' '}
          <code>n</code> were a million. At that scale, the{' '}
          <code>5n</code> and the <code>2</code> are so small next to{' '}
          <code>3n&sup2;</code> that you can&rsquo;t see them, and the 3 only
          scales the whole picture. What survives is the shape:{' '}
          <code>n&sup2;</code>.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>n</th>
                <th>3n² (the big term)</th>
                <th>5n + 2 (the rest)</th>
                <th>The rest as a share of the total</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>10</code></td><td><code>300</code></td><td><code>52</code></td><td>about 15%</td></tr>
              <tr><td><code>100</code></td><td><code>30,000</code></td><td><code>502</code></td><td>about 1.6%</td></tr>
              <tr><td><code>1,000</code></td><td><code>3,000,000</code></td><td><code>5,002</code></td><td>about 0.17%</td></tr>
              <tr><td><code>1,000,000</code></td><td><code>3 trillion</code></td><td><code>about 5 million</code></td><td>about 0.00017%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          That fading is exactly why we drop constants and smaller terms.
          It isn&rsquo;t sloppiness; it&rsquo;s the point of measuring{' '}
          <em>growth</em>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Rules, in One Place</h3>
        <p>
          Everything in phase two comes down to a handful of rules.
          You&rsquo;ll use all of them constantly, so it&rsquo;s worth
          seeing them side by side.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Example</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((row) => (
                <tr key={row.rule}>
                  <td><strong>{row.rule}</strong></td>
                  <td>{row.example}</td>
                  <td><code>{row.result}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work: Loops</h3>
        <p>
          Let&rsquo;s apply the steps to code, easiest first. For each one,
          the same questions: what&rsquo;s <code>n</code>, what repeats, how
          many times, how do the pieces combine?
        </p>

        <h4>One loop, with some extra steps</h4>
        <div className="code-block">
          <code>{`def total_and_print(nums):
    total = 0              # 1 step
    for x in nums:         # runs n times
        total += x         #   1 step each time
        print(x)           #   1 step each time
    return total           # 1 step`}</code>
        </div>
        <p>
          Count: <code>1 + n &times; 2 + 1 = 2n + 2</code>. Squint: drop the
          2 and the extra 2, and you get <code>O(n)</code>. Space: only{' '}
          <code>total</code> and <code>x</code>, so <code>O(1)</code>.
        </p>

        <h4>Two loops, one after the other</h4>
        <div className="code-block">
          <code>{`def two_passes(nums):
    smallest = min(nums)    # n steps
    largest = max(nums)     # n steps
    return largest - smallest`}</code>
        </div>
        <p>
          Sequential work adds: <code>n + n = 2n</code>, so{' '}
          <code>O(n)</code>. Running three, or ten, passes over the data is
          still <code>O(n)</code>. A fixed number of passes never changes the
          growth.
        </p>

        <h4>Nested loops: multiply, but check the bounds</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Picture each pass of the inner loop as one square on a grid.
              If both loops run <code>n</code> times, the grid is{' '}
              <code>n &times; n</code> and every square counts. But what if
              the inner loop only runs up to the outer loop&rsquo;s current
              value?
            </p>
            <p>
              Then the first pass runs 0 times, the next 1, then 2, and so
              on, up to <code>n &minus; 1</code>. That adds up to{' '}
              <code>n(n &minus; 1) / 2</code>, about half of the grid. Half
              of <code>n&sup2;</code> is still <code>n&sup2;</code> once you
              drop constants, so it&rsquo;s <code>O(n&sup2;)</code> either
              way.
            </p>
          </div>
          <LoopGridVisual />
        </div>
        <div className="code-block">
          <code>{`for i in range(n):
    for j in range(n):       # n * n squares: O(n^2)
        count += 1

for i in range(n):
    for j in range(i):       # 0 + 1 + ... + (n-1): still O(n^2)
        count += 1`}</code>
        </div>
        <p>
          One more check on nesting: it only multiplies if the inner loop
          really does run on every pass of the outer one, and if the two
          loops run over <em>different</em> inputs, use different letters.
          A loop over list <code>a</code> (<code>n</code> items) with a loop
          over list <code>b</code> (<code>m</code> items) inside it is{' '}
          <code>O(n &times; m)</code>. Calling that <code>O(n&sup2;)</code>{' '}
          is a mistake.
        </p>

        <h4>Halving: the log pattern</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Whenever a loop shrinks the remaining work by a fraction each
              time, usually half, count how many times you can halve{' '}
              <code>n</code> before you reach 1. Halving 64 takes 6 steps;
              halving a million takes about 20. That count is{' '}
              <code>log&#8322; n</code>.
            </p>
            <p>
              Doubling works the same way in reverse: a counter that doubles
              until it passes <code>n</code> also takes about{' '}
              <code>log n</code> steps.
            </p>
          </div>
          <HalvingVisual />
        </div>
        <div className="code-block">
          <code>{`i = 1
while i < n:
    i *= 2          # 1, 2, 4, 8, ... reaches n in about log2(n) steps

low, high = 0, len(arr) - 1
while low <= high:  # binary search: each pass halves the range
    ...`}</code>
        </div>
        <div className="definition">
          Quick test for a log: <em>does the amount of work left shrink by a
          fixed fraction each time around?</em> If yes, you&rsquo;re looking
          at <code>O(log n)</code>.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work: Recursion</h3>
        <p>
          Loops are easy to count because you can see the repetition.
          Recursion hides it, so use a different question: <strong>how many
          calls happen in total, and how much work does each call do on its
          own?</strong> Multiply them.
        </p>
        <p>
          <strong>One call each time.</strong> A function that calls itself
          once on a problem one smaller, like <code>factorial(n)</code>,
          makes <code>n</code> calls and does constant work in each, so{' '}
          <code>O(n)</code> time. The calls stack up <code>n</code> deep, so{' '}
          <code>O(n)</code> space.
        </p>
        <p>
          <strong>One call on half the problem.</strong> Recursive binary
          search makes one call on half the data each time: about{' '}
          <code>log n</code> calls with constant work each, so{' '}
          <code>O(log n)</code> time and <code>O(log n)</code> space.
        </p>
        <p>
          <strong>Two calls, so draw the tree.</strong> When a function
          calls itself more than once, count the calls by drawing the{' '}
          <em>recursion tree</em>: each call is a box, and its recursive
          calls are the boxes beneath it. Then ask two questions: how much
          work does each <em>level</em> do in total, and how many levels
          are there?
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Merge sort splits the list in half, sorts each half, and
              merges. Look at any level of the tree: the pieces always add
              up to <code>n</code> items, and merging them costs about{' '}
              <code>n</code> in total. Halving <code>n</code> until pieces
              are size 1 gives about <code>log n</code> levels. So the total
              is <code>n</code> per level times <code>log n</code> levels:{' '}
              <code>O(n log n)</code>.
            </p>
          </div>
          <RecursionTreeVisual />
        </div>
        <div className="code-block">
          <code>{`def fib(n):                # two calls per call -> the tree doubles each level
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
# about 2^n calls in total  -> O(2^n) time
# but only one chain of at most n calls is open at once -> O(n) space`}</code>
        </div>
        <p>
          That last point trips people up, so check it every time: time
          counts <em>all</em> the calls, but space counts only the deepest
          chain open at one moment.
        </p>
      </section>

      <section className="notebook-section">
        <h3>What One Line Really Costs</h3>
        <p>
          The most common mistake isn&rsquo;t in counting loops. It&rsquo;s
          treating a line as cheap when it hides a loop of its own. In
          Python, a lot of short, innocent-looking operations do real work
          underneath:
        </p>
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
              {hidden.map((row) => (
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
        <div className="code-block">
          <code>{`# Looks like one loop, is really two:
for x in nums:
    if x in other_list:     # hidden loop of n  -> O(n^2) overall
        ...

# Same idea, made cheap by changing the data structure:
other_set = set(other_list)
for x in nums:
    if x in other_set:      # O(1) average   -> O(n) overall
        ...`}</code>
        </div>
        <p>
          So at every line, ask one extra question: <em>is this a single
          step, or is it secretly a loop?</em> This is also where everything
          you learned in the data structure pages pays off.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Where the Method Bends</h3>
        <p>
          <strong>One code, several answers.</strong> The cost often
          depends on the input itself. Searching a list might find the item
          first (best case, <code>O(1)</code>) or last (worst case,{' '}
          <code>O(n)</code>). When you say a single complexity, you usually
          mean the worst case, unless you say otherwise.
        </p>
        <p>
          <strong>Amortized cost.</strong> Some operations are usually
          cheap and occasionally expensive, like appending to a list that
          sometimes has to resize. Spread over many operations, the average
          cost per operation is still small, and that&rsquo;s what
          &ldquo;amortized&rdquo; means.
        </p>
        <p>
          <strong>Constants are hidden, not gone.</strong> Two{' '}
          <code>O(n)</code> solutions can differ a lot in real speed, and
          for small inputs a &ldquo;worse&rdquo; complexity can win. The
          method tells you how things scale, which is exactly what matters
          once the input gets large.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Using It Before and After You Write Code</h3>
        <p>
          <strong>After you code: annotate.</strong> Write the cost beside
          each line or block, then combine them with the rules. That&rsquo;s
          the most reliable way to catch a hidden loop.
        </p>
        <p>
          <strong>Before you code: work backward from the limits.</strong>{' '}
          The size of the input tells you how slow you&rsquo;re allowed to
          be. As a rough rule of thumb for Python, you can do about ten
          million simple steps in a second, so:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>If the input size is&hellip;</th>
                <th>Aim for&hellip;</th>
                <th>Because&hellip;</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((row) => (
                <tr key={row.limit}>
                  <td>{row.limit}</td>
                  <td><code>{row.fits}</code></td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          These are guidelines, not laws, but they&rsquo;re a fast way to
          rule out an approach before you spend time on it. If the limit is
          100,000 items and your idea is two nested loops, you already know
          it&rsquo;s too slow.
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

export default HowToCalculate
