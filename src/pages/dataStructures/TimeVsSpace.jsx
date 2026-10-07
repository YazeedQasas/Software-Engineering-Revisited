import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import { TimeVsSpaceVisual, CallStackSpaceVisual } from './TimeVsSpaceVisuals.jsx'

const steps = [
  {
    step: '1. Name the input',
    time: 'What is n? (If there are two inputs, call them n and m.)',
    space: 'Same question. Everything is measured against n.',
  },
  {
    step: '2. Find what matters',
    time: 'Which line or block repeats? That is where the time goes.',
    space: 'What does the code create? Lists, sets, strings, and recursive calls that are still open.',
  },
  {
    step: '3. Count it in terms of n',
    time: 'How many times does that work run as n grows?',
    space: 'How big does each thing get as n grows?',
  },
  {
    step: '4. Combine and simplify',
    time: 'Add things that happen one after another, multiply things nested inside each other, keep the biggest term, drop constants.',
    space: 'Add up what exists at the same moment, at the peak. Leave out the input itself.',
  },
]

const shapes = [
  { shape: 'a few assignments and arithmetic', time: 'O(1)', space: 'O(1)', why: 'Fixed work and a fixed number of variables.' },
  { shape: 'one loop over n, only counters inside', time: 'O(n)', space: 'O(1)', why: 'n steps, but nothing grows.' },
  { shape: 'one loop over n, appending to a new list', time: 'O(n)', space: 'O(n)', why: 'n steps, and the new list ends up holding n items.' },
  { shape: 'two loops one after the other', time: 'O(n)', space: 'O(1)', why: 'n + n = 2n, and the 2 is dropped.' },
  { shape: 'a loop nested inside a loop, counters only', time: 'O(n²)', space: 'O(1)', why: 'n × n steps, no new data.' },
  { shape: 'a loop that halves the range each step', time: 'O(log n)', space: 'O(1)', why: 'Halving n down to 1 takes about log n steps.' },
  { shape: 'recursion n deep, O(1) work per call', time: 'O(n)', space: 'O(n)', why: 'n calls, and all n frames are open at the deepest point.' },
  { shape: 'naive Fibonacci (two calls per call)', time: 'O(2ⁿ)', space: 'O(n)', why: 'Calls multiply, but only one path of depth n is open at a time.' },
  { shape: 'the same, with memoization', time: 'O(n)', space: 'O(n)', why: 'Each value is computed once and stored.' },
  { shape: 'slicing or copying arr[i:j]', time: 'O(j − i)', space: 'O(j − i)', why: 'Every element is copied into a new list.' },
]

const examples = [
  {
    id: 'sum-loop',
    prompt: 'Summing a list of n numbers with a for loop and one total variable.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One step per item, and the only memory used is the total and the loop variable.',
  },
  {
    id: 'squares-list',
    prompt: 'Building a new list of the squares of n numbers: [x * x for x in nums].',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One step per item, and the new list holds n results at the end.',
  },
  {
    id: 'squares-generator',
    prompt: 'Summing the squares of n numbers with a generator: sum(x * x for x in nums).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Same number of steps, but a generator hands out one value at a time instead of building the whole list.',
  },
  {
    id: 'nested-counters',
    prompt: 'Two nested loops that both run over n items, counting pairs with only a counter variable.',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'n × n steps, but nothing is stored beyond the counters.',
  },
  {
    id: 'factorial-recursive',
    prompt: 'A recursive factorial(n), where each call does constant work and calls factorial(n - 1).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'n calls in total, and at the deepest point all n of them are still waiting on the call stack.',
  },
  {
    id: 'fib-naive',
    prompt: 'Naive recursive Fibonacci: fib(n) = fib(n - 1) + fib(n - 2).',
    time: 'O(2ⁿ)',
    space: 'O(n)',
    explanation: 'The number of calls roughly doubles with each level, but only one chain of at most n calls is open at any moment.',
  },
  {
    id: 'fib-memo',
    prompt: 'Recursive Fibonacci with memoization (a dict caching each result).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each value from 0 to n is computed once, and the cache plus the call stack both grow to about n.',
  },
  {
    id: 'sorted-copy',
    prompt: 'Calling sorted(nums) on a list of n numbers.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Sorting takes n log n steps, and sorted() builds a brand new n-item list instead of changing the original.',
  },
]

function TimeVsSpace() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Algorithmic Complexity</p>
      <h2>Time vs Space Complexity</h2>
      <p>
        Every piece of code costs two things: how long it runs and how much
        memory it needs. Complexity is just a careful way of measuring both
        as the input gets bigger. The useful part is that it&rsquo;s a
        repeatable process, not a gut feeling, and this page lays that
        process out so you can reuse it on any code you meet.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Time vs Space Complexity &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What they are</h4>
              <ul>
                <li><strong>Time complexity</strong>: how the number of steps grows as the input grows.</li>
                <li><strong>Space complexity</strong>: how the extra memory used grows as the input grows.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. Why we measure growth</h4>
              <ul>
                <li>Stopwatch times depend on the computer, the language and the day.</li>
                <li>Counting steps and memory as a function of <code>n</code> doesn&rsquo;t.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li><strong>Time is a running total</strong>: steps add up and never come back.</li>
                <li><strong>Space is a high-water mark</strong>: memory is freed and reused, so count the peak.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The four steps</h4>
              <ul>
                <li>Name the input (<code>n</code>).</li>
                <li>Find what repeats (time) or what&rsquo;s created (space).</li>
                <li>Count it in terms of <code>n</code>.</li>
                <li>Combine: add sequential, multiply nested, keep the biggest term.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Space, precisely</h4>
              <ul>
                <li>Usually means <strong>auxiliary space</strong>: extra memory, not counting the input.</li>
                <li>Counts new lists, sets and strings, <em>and</em> the call stack.</li>
                <li>Recursion depth <code>d</code> costs <code>O(d)</code> space.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Common shapes</h4>
              <ul>
                <li>One loop, counters only: <code>O(n)</code> time, <code>O(1)</code> space.</li>
                <li>Loop that builds a list: <code>O(n)</code> and <code>O(n)</code>.</li>
                <li>Nested loops: <code>O(n&sup2;)</code> time.</li>
                <li>Time and space can differ: naive Fibonacci is <code>O(2&#8319;)</code> time but <code>O(n)</code> space.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. The trade</h4>
              <ul>
                <li>Often you can buy time with memory: sets, caches, precomputed tables.</li>
                <li>Or save memory with more time: recompute, generators, in-place changes.</li>
                <li>Sometimes you get both for free: a better algorithm.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Which to spend</h4>
              <ul>
                <li>Default: speed matters most, memory is cheap.</li>
                <li>Flip it when the data is huge or the device is small.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Say it out loud</h4>
              <ul>
                <li>State <code>n</code>, then time, then space.</li>
                <li>Mention worst vs. average case when they differ.</li>
                <li>Say whether you counted the input.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Time and Space in One Breath</h3>
        <div className="definition">
          Time complexity says how the number of steps grows with the input.
          Space complexity says how the extra memory grows with the input.
          Same question, two resources.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why Not Just Use a Stopwatch?</h3>
        <p>
          The obvious way to compare two pieces of code is to time them. But
          the same code runs at different speeds on a laptop and a phone,
          changes with whatever else your computer is doing, and a fast
          machine can make a bad algorithm look fine on a small test.
        </p>
        <p>
          What we really want to know is a property of the algorithm itself:
          <em> what happens when the input doubles? Or grows a thousandfold?</em>{' '}
          So instead of measuring seconds, we count steps (and memory cells)
          and describe how that count grows with the input size{' '}
          <code>n</code>. The answer holds on every machine.
        </p>
      </section>

      <section className="notebook-section">
        <h3>A Running Total and a High-Water Mark</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Here&rsquo;s the idea that makes both ideas click. Picture your
              program as a film, running from start to finish.
            </p>
            <p>
              <strong>Time is the running total.</strong> Every step the
              program takes adds to the count, and you can&rsquo;t take a
              step back. Time only goes up.
            </p>
            <p>
              <strong>Space is a high-water mark.</strong> Memory gets
              created and then freed up again as the program goes, so the
              amount in use rises and falls. What matters isn&rsquo;t the
              total ever used, it&rsquo;s the <em>peak</em>, the single
              moment when the most memory is alive at once.
            </p>
          </div>
          <TimeVsSpaceVisual />
        </div>
        <p>
          That&rsquo;s why a loop that makes a temporary list and throws it
          away on every pass doesn&rsquo;t keep adding up in space: the old
          list is gone before the next one appears. But the steps spent
          building each list still add to the time.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Same Four Steps, for Both</h3>
        <p>
          Here&rsquo;s the process, once, for both resources. Every time you
          analyze code, walk down this table. The next topic, calculating
          complexity, uses exactly the same steps.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>For time, ask</th>
                <th>For space, ask</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((row) => (
                <tr key={row.step}>
                  <td><strong>{row.step}</strong></td>
                  <td>{row.time}</td>
                  <td>{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work</h3>
        <p>
          Let&rsquo;s run the four steps on one real problem: does a list of
          numbers contain a duplicate? We&rsquo;ll solve it two ways and ask
          the same questions of each.
        </p>
        <h4>Version A: compare every pair</h4>
        <div className="code-block">
          <code>{`def has_duplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False`}</code>
        </div>
        <p>
          <strong>Time.</strong> Step 1: <code>n</code> is the length of{' '}
          <code>nums</code>. Step 2: the comparison inside the inner loop is
          what repeats. Step 3: the outer loop runs about <code>n</code>{' '}
          times, and for each of those the inner loop runs up to{' '}
          <code>n</code> more. Step 4: nested, so multiply:{' '}
          <code>O(n&sup2;)</code> in the worst case, when there&rsquo;s no
          duplicate and every pair gets checked.
        </p>
        <p>
          <strong>Space.</strong> Step 2: what does the code create? Just{' '}
          <code>i</code> and <code>j</code>. Step 3: those don&rsquo;t grow
          with <code>n</code>. So <code>O(1)</code>. Slow, but it needs no
          extra memory.
        </p>

        <h4>Version B: remember what you&rsquo;ve seen</h4>
        <div className="code-block">
          <code>{`def has_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`}</code>
        </div>
        <p>
          <strong>Time.</strong> One loop over <code>n</code> items, and
          inside it a set lookup and an add, each <code>O(1)</code> on
          average (you saw why in Hash Tables). One loop times constant work:{' '}
          <code>O(n)</code>.
        </p>
        <p>
          <strong>Space.</strong> Step 2: the <code>seen</code> set is the
          new thing. Step 3: in the worst case, with no duplicates, every
          number ends up in it. So <code>O(n)</code>.
        </p>
        <div className="definition">
          Look at what just happened: Version B went from{' '}
          <code>O(n&sup2;)</code> time down to <code>O(n)</code>, and paid
          for it by going from <code>O(1)</code> space up to{' '}
          <code>O(n)</code>. That swap is the heart of this whole topic.
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Part of Space People Miss: the Call Stack</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              When you count space, it&rsquo;s easy to look only for lists
              and sets. But recursion hides memory too. Every call that
              hasn&rsquo;t finished yet keeps a <strong>frame</strong> on the
              call stack, holding its variables and where to return to.
            </p>
            <p>
              So a recursive function that goes <code>n</code> calls deep
              uses <code>O(n)</code> space, even if every call does tiny
              work and never creates a list. The loop version of the same
              function uses one set of variables, <code>O(1)</code>. (You
              met the call stack in Stacks; this is its cost.)
            </p>
          </div>
          <CallStackSpaceVisual />
        </div>
        <div className="code-block">
          <code>{`def factorial_loop(n):        # O(n) time, O(1) space
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def factorial_recursive(n):   # O(n) time, O(n) space
    if n <= 1:
        return 1
    return n * factorial_recursive(n - 1)`}</code>
        </div>
        <p>
          Python also stops you at about a thousand nested calls by default,
          which is the call stack&rsquo;s space limit showing up in
          practice.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reading Complexity Off the Code</h3>
        <p>
          With the four steps in hand, most code falls into a handful of
          recognizable shapes. Notice that time and space don&rsquo;t always
          match: naive Fibonacci takes exponential time but only linear
          space, because it only ever has one chain of calls open at once.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Code shape</th>
                <th>Time</th>
                <th>Extra space</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {shapes.map((row) => (
                <tr key={row.shape}>
                  <td>{row.shape}</td>
                  <td><code>{row.time}</code></td>
                  <td><code>{row.space}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="definition">
          &ldquo;Extra space&rdquo; here is <strong>auxiliary space</strong>:
          the memory the algorithm adds on top of the input it was given.
          Strictly, total space is the input plus the extra, but in
          interviews and in this site we count only the extra, unless a
          question says otherwise. If in doubt, say which one you mean.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Trading One for the Other</h3>
        <p>
          The duplicate example wasn&rsquo;t a coincidence. Time and space
          are linked, and you can often spend one to save the other.
        </p>
        <p>
          <strong>Spend memory to save time.</strong> Store something once
          so you never have to recompute or search for it again. A{' '}
          <code>set</code> turns a repeated scan into a lookup. A cache
          (memoization) remembers the answer to a call, so naive Fibonacci
          drops from <code>O(2&#8319;)</code> to <code>O(n)</code>. A
          precomputed table or prefix-sum array answers range questions
          instantly.
        </p>
        <p>
          <strong>Spend time to save memory.</strong> Recompute instead of
          storing, or process things one at a time. A generator walks
          through the data without ever holding it all:
        </p>
        <div className="code-block">
          <code>{`total = sum([x * x for x in nums])   # builds a whole list first: O(n) space
total = sum(x * x for x in nums)     # one value at a time:       O(1) space`}</code>
        </div>
        <p>
          Changing a list in place (<code>nums.sort()</code>) instead of
          making a sorted copy (<code>sorted(nums)</code>) is the same
          move.
        </p>
        <p>
          <strong>Sometimes you get both.</strong> It isn&rsquo;t always a
          trade. Binary search on a sorted list beats a linear scan in time
          and uses no extra memory. A better algorithm can beat the trade
          entirely.
        </p>
      </section>

      <section className="notebook-section">
        <h3>What You Trade Away</h3>
        <p>
          <strong>Cleverness for clarity.</strong> Saving the last bit of
          memory often makes code harder to read. Unless memory is
          genuinely the constraint, the simpler version is usually the right
          one.
        </p>
        <p>
          <strong>Big-O hides constants.</strong> Two <code>O(n)</code>{' '}
          algorithms can differ by a large factor in practice, and for small
          inputs a &ldquo;worse&rdquo; algorithm can win. Complexity tells
          you how things <em>scale</em>, not who is faster on ten items.
        </p>
        <p>
          <strong>Worst case vs. typical case.</strong> A single label hides
          which input you mean. Hash lookups are <code>O(1)</code> on average
          and <code>O(n)</code> in the worst case; both are true, and it
          helps to say which one you&rsquo;re quoting.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Deciding Which One to Spend</h3>
        <p>
          <strong>Default to saving time.</strong> Memory is usually cheap
          and a slow program is usually what users notice, so spending space
          for speed is the common choice.
        </p>
        <p>
          <strong>Flip it when memory is the real limit.</strong> Huge
          datasets that don&rsquo;t fit in memory, embedded devices, and
          anything streaming data it can&rsquo;t keep all at once push you
          toward low-space solutions.
        </p>
        <p>
          <strong>Always say both out loud.</strong> In an interview, the
          strong answer is the one that names <code>n</code>, gives time
          and space, notes whether the input is counted, and mentions the
          trade you made. Something like: &ldquo;this is <code>O(n)</code>{' '}
          time and <code>O(n)</code> extra space; I could get{' '}
          <code>O(1)</code> space by sorting in place, at the cost of{' '}
          <code>O(n log n)</code> time.&rdquo;
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

export default TimeVsSpace
