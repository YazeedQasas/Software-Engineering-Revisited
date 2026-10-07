import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import { GrowthChartVisual, RuntimeGraphVisual } from './CommonRuntimesVisuals.jsx'

const doubling = [
  { cls: 'O(1)', doubleIt: 'No change', n10: '1', n100: '1', n1000: '1', n1m: '1' },
  { cls: 'O(log n)', doubleIt: 'One more step', n10: '3', n100: '7', n1000: '10', n1m: '20' },
  { cls: 'O(√n)', doubleIt: 'About 1.4× more', n10: '3', n100: '10', n1000: '32', n1m: '1,000' },
  { cls: 'O(n)', doubleIt: '2× more', n10: '10', n100: '100', n1000: '1,000', n1m: '1,000,000' },
  { cls: 'O(n log n)', doubleIt: 'A bit over 2× more', n10: '33', n100: '664', n1000: '9,966', n1m: '20 million' },
  { cls: 'O(n²)', doubleIt: '4× more', n10: '100', n100: '10,000', n1000: '1,000,000', n1m: '1 trillion' },
  { cls: 'O(2ⁿ)', doubleIt: 'Squares the total', n10: '1,024', n100: '1.3 × 10³⁰', n1000: 'more than atoms in the universe', n1m: 'impossible' },
  { cls: 'O(n!)', doubleIt: 'Worse than squaring', n10: '3,628,800', n100: 'impossible', n1000: 'impossible', n1m: 'impossible' },
]

const examples = [
  {
    id: 'dict-get',
    prompt: 'prices["apple"] on a dict of n items (average case).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'One hash and one jump, no matter how many items there are.',
  },
  {
    id: 'binary-search',
    prompt: 'Binary search for a value in a sorted list of n items (iterative).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Each comparison throws away half the remaining range.',
  },
  {
    id: 'is-prime',
    prompt: 'Testing whether a number n is prime by trial division up to its square root.',
    time: 'O(√n)',
    space: 'O(1)',
    explanation: 'If n has a divisor, it has one no bigger than √n, so you only try numbers up to √n.',
  },
  {
    id: 'find-max',
    prompt: 'Finding the largest value in an unsorted list of n numbers with a loop.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You have to look at every number once.',
  },
  {
    id: 'sort-list',
    prompt: 'Sorting a list of n numbers with Python\'s sorted().',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Comparison sorting takes n log n steps, and sorted() builds a new list.',
  },
  {
    id: 'all-pairs',
    prompt: 'Checking every pair of items in a list of n items with two nested loops.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'About n × n / 2 pairs, and nothing is stored.',
  },
  {
    id: 'subsets',
    prompt: 'A recursive function that makes two calls per item (include it or skip it), n levels deep, counting all subsets.',
    time: 'O(2ⁿ)',
    space: 'O(n)',
    explanation: 'The number of calls doubles at each level, but only one chain of n calls is open at a time.',
  },
  {
    id: 'permutations',
    prompt: 'Building a list of every ordering of n different items, and just counting how many there are by generating them (time only, ignoring the copying).',
    time: 'O(n!)',
    space: 'O(n!)',
    explanation: 'There are n! orderings, and storing them all takes room for n!.',
  },
]

function CommonRuntimes() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Algorithmic Complexity</p>
      <h2>Common Runtimes</h2>
      <p>
        You&rsquo;ve learned to count complexity. Now meet the answers.
        Almost every algorithm you&rsquo;ll ever analyze lands in one of
        about eight families, and once you&rsquo;ve seen each family&rsquo;s
        shape and a typical piece of code, you&rsquo;ll start recognizing
        them on sight.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Common Runtimes &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What they are</h4>
              <ul>
                <li>The handful of growth families that nearly every algorithm falls into.</li>
                <li>Fastest to slowest: <code>1</code>, <code>log n</code>, <code>&radic;n</code>, <code>n</code>, <code>n log n</code>, <code>n&sup2;</code>, <code>2&#8319;</code>, <code>n!</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. Why know them</h4>
              <ul>
                <li>They tell you in advance whether an approach can work at your input size.</li>
                <li>Recognizing a shape is faster than recounting from scratch.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The doubling test</h4>
              <ul>
                <li>Ask: what happens to the steps if <code>n</code> doubles?</li>
                <li>Same, +1 step, 2&times;, 4&times;, or squared. That is the family.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The fast ones</h4>
              <ul>
                <li><code>O(1)</code>: indexing, dict lookup.</li>
                <li><code>O(log n)</code>: binary search, halving.</li>
                <li><code>O(&radic;n)</code>: trial division up to the root.</li>
                <li><code>O(n)</code>: one pass over the data.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. The middle</h4>
              <ul>
                <li><code>O(n log n)</code>: good sorting, divide and conquer.</li>
                <li><code>O(n&sup2;)</code>: all pairs, simple sorts, nested loops. <code>O(n&sup3;)</code> is its bigger cousin.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. The cliffs</h4>
              <ul>
                <li><code>O(2&#8319;)</code>: every subset, branching recursion.</li>
                <li><code>O(n!)</code>: every ordering.</li>
                <li>Only workable for tiny <code>n</code> (about 20 and about 10).</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Spotting them in code</h4>
              <ul>
                <li>Halving range: log. One loop: linear. Nested loops: quadratic.</li>
                <li>Two calls per call: exponential. Try every order: factorial.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. What changes the class</h4>
              <ul>
                <li>The right data structure (set vs. list) or a sorted input.</li>
                <li>Caching repeated work (memoization): exponential &rarr; linear.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Rules of thumb</h4>
              <ul>
                <li>Linear and <code>n log n</code> are the sweet spot for large input.</li>
                <li>Quadratic is fine up to a few thousand items.</li>
                <li>Exponential and factorial mean &ldquo;find a better idea&rdquo;.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Common Runtimes in One Breath</h3>
        <div className="definition">
          The common runtimes are the standard growth rates, from constant
          to factorial, that describe almost every algorithm, ordered by how
          badly the work blows up as the input grows.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why Learn the Families?</h3>
        <p>
          Once you can calculate complexity, you&rsquo;ll notice the answers
          keep repeating. A single loop is linear. A halving loop is
          logarithmic. A pair of nested loops is quadratic. There just
          aren&rsquo;t that many <em>shapes</em> to learn, and each one
          comes with a feel for how it behaves when the input gets big.
        </p>
        <p>
          That feel matters in practice. If you know your input can hold a
          million items and your idea is quadratic, you can tell in seconds,
          before writing any code, that it won&rsquo;t work. If you spot
          that a slow idea is one of the cliff shapes, you know to look for
          a different approach, not to optimize the one you have.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Doubling Test</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Here&rsquo;s the single best way to feel the difference
              between the families. Ask one question of any algorithm:{' '}
              <strong>if I double the input, what happens to the number of
              steps?</strong>
            </p>
            <p>
              Constant: nothing. Logarithmic: one extra step. Linear: twice
              as many. Quadratic: four times as many. Exponential: the work
              squares. The chart shows the same story as a picture: the
              families start close together on tiny inputs and then pull
              apart dramatically.
            </p>
          </div>
          <GrowthChartVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>If n doubles</th>
                <th>n = 10</th>
                <th>n = 100</th>
                <th>n = 1,000</th>
                <th>n = 1,000,000</th>
              </tr>
            </thead>
            <tbody>
              {doubling.map((row) => (
                <tr key={row.cls}>
                  <td><code>{row.cls}</code></td>
                  <td>{row.doubleIt}</td>
                  <td>{row.n10}</td>
                  <td>{row.n100}</td>
                  <td>{row.n1000}</td>
                  <td>{row.n1m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The numbers are approximate steps, rounded. Read across a row to
          see how quickly each family runs away from the one above it.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Meeting Each One</h3>
        <p>
          Each family below has the same three parts: how it feels, a short
          piece of code that lands there, and why.
        </p>

        <h4>O(1): constant</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> the size of the input doesn&rsquo;t
              matter. You do a fixed amount of work and you&rsquo;re done.
            </p>
          </div>
          <RuntimeGraphVisual kind="constant" />
        </div>
        <div className="code-block">
          <code>{`def first_item(items):
    return items[0]              # one step, however long the list is

price = prices["apple"]          # dict lookup: hash and jump (average case)`}</code>
        </div>
        <p>
          <strong>Why:</strong> indexing uses address arithmetic and a dict
          uses hashing. Neither one searches.
        </p>

        <h4>O(log n): logarithmic</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> a huge input shrinks to nothing in a
              handful of steps, because every step discards a big share of
              what&rsquo;s left. A million items takes about 20 steps.
            </p>
          </div>
          <RuntimeGraphVisual kind="log" />
        </div>
        <div className="code-block">
          <code>{`def binary_search(sorted_nums, target):
    low, high = 0, len(sorted_nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_nums[mid] == target:
            return mid
        if sorted_nums[mid] < target:
            low = mid + 1        # throw away the left half
        else:
            high = mid - 1       # throw away the right half
    return -1`}</code>
        </div>
        <p>
          <strong>Why:</strong> halving. The input must be sorted so the
          comparison tells you which half to keep.
        </p>

        <h4>O(&radic;n): square root</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> faster than a full pass, but
              slower than a halving. It&rsquo;s the rarest of the families,
              and usually shows up when a problem has a natural symmetry, like
              factors that come in pairs.
            </p>
          </div>
          <RuntimeGraphVisual kind="sqrt" />
        </div>
        <div className="code-block">
          <code>{`def is_prime(n):                 # here n is the number's value
    if n < 2:
        return False
    i = 2
    while i * i <= n:            # stop at the square root
        if n % i == 0:
            return False
        i += 1
    return True`}</code>
        </div>
        <p>
          <strong>Why:</strong> divisors come in pairs that multiply to{' '}
          <code>n</code>, so if there&rsquo;s a small one there&rsquo;s a
          matching large one. Checking up to <code>&radic;n</code> is enough
          to find the small one.
        </p>

        <h4>O(n): linear</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> one pass. Double the data, double
              the time.
            </p>
          </div>
          <RuntimeGraphVisual kind="linear" />
        </div>
        <div className="code-block">
          <code>{`def largest(nums):
    best = nums[0]
    for x in nums:               # look at each item once
        if x > best:
            best = x
    return best`}</code>
        </div>
        <p>
          <strong>Why:</strong> there&rsquo;s no way to know the largest
          without checking every item at least once, so this is as good as
          it gets for an unsorted list.
        </p>

        <h4>O(n log n): linearithmic</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> a bit worse than one pass, a lot
              better than a nested one. It&rsquo;s the price of sorting well,
              and the shape of &ldquo;halve it log n times, and do n work at
              each level&rdquo;.
            </p>
          </div>
          <RuntimeGraphVisual kind="nlogn" />
        </div>
        <div className="code-block">
          <code>{`def has_duplicate(nums):
    nums = sorted(nums)          # n log n
    for i in range(1, len(nums)):  # n
        if nums[i] == nums[i - 1]:
            return True
    return False                 # total: n log n + n  ->  O(n log n)`}</code>
        </div>
        <p>
          <strong>Why:</strong> a sort that compares items has to do about{' '}
          <code>n log n</code> work. Merge sort and Python&rsquo;s own sort
          both land here.
        </p>

        <h4>O(n&sup2;): quadratic</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> comparing everything with everything
              else. Fine for a few thousand items, painful for a million.
            </p>
          </div>
          <RuntimeGraphVisual kind="quadratic" />
        </div>
        <div className="code-block">
          <code>{`def count_equal_pairs(nums):
    count = 0
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):    # every pair
            if nums[i] == nums[j]:
                count += 1
    return count`}</code>
        </div>
        <p>
          <strong>Why:</strong> a loop inside a loop. Bubble sort,
          insertion sort and selection sort are all here. Its bigger
          cousin, <code>O(n&sup3;)</code>, is three nested loops, and the
          whole group is called <strong>polynomial</strong> time:
        </p>
        <div className="code-block">
          <code>{`for i in range(n):
    for j in range(n):
        for k in range(n):       # n * n * n  ->  O(n^3)
            ...`}</code>
        </div>

        <h4>O(2ⁿ): exponential</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> every extra item doubles the work.
              Thirty items is already around a billion steps.
            </p>
          </div>
          <RuntimeGraphVisual kind="exponential" />
        </div>
        <div className="code-block">
          <code>{`def count_subsets(items, i=0):
    if i == len(items):
        return 1
    skip = count_subsets(items, i + 1)    # leave item i out
    take = count_subsets(items, i + 1)    # put item i in
    return skip + take                    # two calls per level: 2^n`}</code>
        </div>
        <p>
          <strong>Why:</strong> for each item you make a yes-or-no choice,
          and the choices multiply: <code>2 &times; 2 &times; ... &times; 2</code>,
          n times. Naive Fibonacci lands here too, and memoization is
          the classic way out.
        </p>

        <h4>O(n!): factorial</h4>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              <strong>Feels like:</strong> the worst of the common ones. Ten
              items already means over three and a half million possibilities.
            </p>
          </div>
          <RuntimeGraphVisual kind="factorial" />
        </div>
        <div className="code-block">
          <code>{`def permutations(items):
    if len(items) <= 1:
        return [items]
    result = []
    for i in range(len(items)):
        rest = items[:i] + items[i + 1:]       # everything but item i
        for p in permutations(rest):           # n choices, then n-1, then n-2...
            result.append([items[i]] + p)
    return result`}</code>
        </div>
        <p>
          <strong>Why:</strong> choose the first item (n ways), then the
          second (n&minus;1 ways), and so on: <code>n &times; (n&minus;1)
          &times; ... &times; 1 = n!</code>. Trying every ordering, as in the
          brute-force traveling salesman problem, is the usual source.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reading the Family Off the Code</h3>
        <p>
          With each family&rsquo;s shape in mind, you can often name the
          class just from how the code is built:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>If you see&hellip;</th>
                <th>Think&hellip;</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>no loops, no recursion, just a few steps or a lookup</td><td><code>O(1)</code></td></tr>
              <tr><td>a loop where the range halves (or a counter that doubles)</td><td><code>O(log n)</code></td></tr>
              <tr><td>a loop that stops at the square root</td><td><code>O(&radic;n)</code></td></tr>
              <tr><td>a single loop over the input</td><td><code>O(n)</code></td></tr>
              <tr><td>a sort, or halving with a full pass at every level</td><td><code>O(n log n)</code></td></tr>
              <tr><td>a loop inside a loop over the same input</td><td><code>O(n²)</code></td></tr>
              <tr><td>recursion that calls itself twice, cutting n by 1</td><td><code>O(2ⁿ)</code></td></tr>
              <tr><td>trying every ordering of the items</td><td><code>O(n!)</code></td></tr>
            </tbody>
          </table>
        </div>
        <div className="definition">
          Remember the lesson from the space pages: these are{' '}
          <em>time</em> classes. The space of the same code can be a
          different family. The subsets example takes <code>O(2ⁿ)</code>{' '}
          time but only <code>O(n)</code> space, because only one chain of
          calls is open at once.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What Moves You Between Families</h3>
        <p>
          The family isn&rsquo;t a fixed property of the problem. It&rsquo;s
          a property of <em>your approach</em>, and changing the approach is
          the whole game of making code faster.
        </p>
        <p>
          <strong>Swap the data structure.</strong> Checking membership in a
          list is <code>O(n)</code>; in a set, <code>O(1)</code>. A nested
          loop that does a list lookup inside becomes a single pass.
        </p>
        <p>
          <strong>Use the input&rsquo;s shape.</strong> A sorted input lets
          you replace a linear scan with binary search, <code>O(n)</code>{' '}
          down to <code>O(log n)</code>.
        </p>
        <p>
          <strong>Stop repeating yourself.</strong> Naive Fibonacci
          recomputes the same values over and over, which is why it&rsquo;s
          exponential. Cache each answer once and it drops to{' '}
          <code>O(n)</code>.
        </p>
        <p>
          Not every drop is possible, though. Comparison sorting can&rsquo;t
          beat <code>n log n</code>, and some problems, such as visiting
          every city exactly once on the shortest route, have no known fast
          solution at all.
        </p>
      </section>

      <section className="notebook-section">
        <h3>What You Trade Away</h3>
        <p>
          <strong>Big-O is about growth, not speed.</strong> A linear
          algorithm with a heavy constant can lose to a quadratic one on a
          small input. The families tell you what happens as <code>n</code>{' '}
          gets large, which is where the differences stop being subtle.
        </p>
        <p>
          <strong>Faster classes often cost more elsewhere.</strong> The
          set that makes lookups <code>O(1)</code> costs <code>O(n)</code>{' '}
          space, and sorting first to unlock binary search costs{' '}
          <code>O(n log n)</code> up front. Pick the cheapest overall, not
          just the best-looking row.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Using the Families Day to Day</h3>
        <p>
          <strong>As a budget.</strong> Before you code, match the input
          size to a family you can afford. Linear and{' '}
          <code>n log n</code> handle millions of items. Quadratic is fine
          to a few thousand. Exponential only works up to about 20 items,
          and factorial to about 10.
        </p>
        <p>
          <strong>As a warning light.</strong> When your solution is
          quadratic or worse, it&rsquo;s a prompt to ask: is there a data
          structure that turns the inner loop into a lookup? Is the input
          sorted, or could it be? Am I recomputing something I could store?
        </p>
        <p>
          <strong>As a shared vocabulary.</strong> Saying &ldquo;this is
          <code> n log n</code> because of the sort&rdquo; communicates the
          whole argument in a sentence, and that&rsquo;s exactly how
          engineers and interviewers talk.
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

export default CommonRuntimes
