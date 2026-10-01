import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  HashFunctionVisual,
  CollisionVisual,
  LoadFactorVisual,
  WorstCaseVisual,
  TwoSumVisual,
} from './HashTablesVisuals.jsx'

const operations = [
  { op: 'd[key]', time: 'O(1) avg, O(n) worst', why: 'Hash the key, jump to its bucket. Worst case: everything collided into one bucket.' },
  { op: 'd[key] = value', time: 'O(1) avg, O(n) worst', why: 'Same lookup mechanism as reading.' },
  { op: 'key in d', time: 'O(1) avg, O(n) worst', why: 'Same hashing, just checking presence.' },
  { op: 'del d[key]', time: 'O(1) avg, O(n) worst', why: 'Find the bucket, remove the entry.' },
  { op: 'len(d)', time: 'O(1)', why: 'Tracked, not counted.' },
  { op: 'd.get(key, default)', time: 'O(1) avg', why: 'Lookup with a fallback instead of a KeyError.' },
  { op: 'd.keys() / .values() / .items()', time: 'O(1) to create, O(n) to iterate', why: "Views into the dict, not copies." },
  { op: 's.add(x)', time: 'O(1) avg', why: 'Same hashing as a dict key, no value attached.' },
  { op: 'x in s', time: 'O(1) avg, O(n) worst', why: 'Same mechanism as dict lookup.' },
  { op: 's1 & s2', time: 'O(min(len(s1), len(s2)))', why: 'Checks every element of the smaller set against the larger.' },
  { op: 's1 | s2', time: 'O(len(s1) + len(s2))', why: 'Combines both sets.' },
]

const examples = [
  {
    id: 'dict-lookup-avg',
    prompt: 'd[key] on a dict with n entries (average case).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'A good hash function spreads keys evenly, so each bucket holds only a few entries.',
  },
  {
    id: 'dict-lookup-worst',
    prompt: 'd[key] on a dict with n entries, worst case (every key collided into one bucket).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'With everything piled into one bucket, a lookup degrades to scanning a chain of n entries.',
  },
  {
    id: 'set-membership',
    prompt: 'x in s for a set with n elements (average case).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Sets use the exact same hashing mechanism as dict keys.',
  },
  {
    id: 'two-sum-hash',
    prompt: 'Two-Sum via a hash map on an array of n numbers.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One pass, checking each complement against a growing map.',
  },
  {
    id: 'dedupe-set',
    prompt: 'Checking a list of n items for duplicates using a set.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One O(1) membership check per item, plus the set itself can grow to size n.',
  },
  {
    id: 'counter-freq',
    prompt: 'Counting character frequencies in an n-character string with Counter.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One pass to build the frequency map, which holds up to n distinct keys.',
  },
  {
    id: 'dict-resize',
    prompt: 'One resize-and-rehash event on a dict holding n entries.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'A new, bigger bucket array has to be allocated and every existing entry rehashed into it.',
  },
  {
    id: 'set-intersection',
    prompt: 's1 & s2 where both sets have n elements.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Checks each element of one set against the other, and the result can hold up to n entries.',
  },
]

function HashTables() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Hash Tables (Maps &amp; Sets)</h2>
      <p>
        Let&rsquo;s keep building the same way &mdash; one idea at a time,
        grounded in real Python. Hash tables, Python&rsquo;s{' '}
        <code>dict</code> and <code>set</code>, are the single most useful
        tool in your interview toolkit: they trade a little memory for
        near-constant-time lookups, insertions, and deletions. By the end
        you&rsquo;ll know not just how to use them, but why they work, when
        they fall apart, and the patterns that solve a huge fraction of
        &ldquo;can you make this faster?&rdquo; questions.
      </p>

      <section className="notebook-section">
        <h3>What Is a Hash Table?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A hash table stores key-value pairs by running each key
              through a <strong>hash function</strong>, which turns it into
              a number, then taking that number modulo the table&rsquo;s
              size to get a bucket index. Instead of searching, you{' '}
              <em>compute</em> exactly where to look &mdash; same spirit as
              array indexing, with one extra step up front.
            </p>
          </div>
          <HashFunctionVisual />
        </div>
        <div className="code-block">
          <code>{`ages = {"amy": 30, "ben": 25}
ages["amy"]          # 30            -> O(1) average
ages["cara"] = 28    # add a new key -> O(1) average
"amy" in ages         # True          -> O(1) average

seen = {1, 2, 3}     # a set: same idea, no value attached
5 in seen             # False -> O(1) average
seen.add(5)           # O(1) average`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Collisions: Chaining vs. Open Addressing</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Two different keys can hash to the same index &mdash;
              that&rsquo;s a <strong>collision</strong>, and it&rsquo;s
              inevitable once there are more possible keys than buckets.
              Two common fixes: <strong>chaining</strong> keeps a small
              list at each bucket and appends collisions to it;{' '}
              <strong>open addressing</strong> keeps everything in the
              array itself and probes forward to the next empty slot when
              it finds one occupied. CPython&rsquo;s <code>dict</code> uses
              open addressing internally.
            </p>
          </div>
          <CollisionVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Load Factor &amp; Resizing</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Load factor is <code>(entries) / (buckets)</code>. As it
              climbs, collisions get more likely and operations slow down.
              Just like a dynamic array, a hash table resizes once load
              factor crosses a threshold (CPython resizes a dict once
              it&rsquo;s about two-thirds full): allocate a bigger bucket
              array, then rehash every existing key into it.
            </p>
            <p>
              You&rsquo;ve seen this shape before, back in Arrays: that
              occasional expensive rehash is spread across many cheap
              operations, so insertion stays <code>O(1)</code> amortized.
            </p>
          </div>
          <LoadFactorVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why O(1) Average but O(n) Worst Case</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              With a good hash function, keys spread evenly across
              buckets, so each one holds only a handful of entries &mdash;
              checking one is basically <code>O(1)</code>. But a hash
              function only spreads things out <em>on average</em>. In the
              worst case &mdash; a poor hash function, or an adversary who
              crafts keys to collide on purpose &mdash; every key could
              land in the same bucket, and you&rsquo;re stuck scanning a
              chain of n entries: <code>O(n)</code>.
            </p>
            <p>
              This is also why Python randomizes the hash of strings by
              default (hash randomization) &mdash; it makes that
              adversarial worst case much harder to engineer on purpose.
            </p>
          </div>
          <WorstCaseVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Patterns You&rsquo;ll Use Constantly</h3>
        <p>
          Three shapes come up constantly, and they all boil down to the
          same trick: trade memory for a lookup you&rsquo;d otherwise have
          to search for.
        </p>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Fast Lookups (Two-Sum)</h4>
            <p>
              The classic: given an array, find two numbers that add up to
              a target. Brute force checks every pair &mdash;{' '}
              <code>O(n&sup2;)</code>. A hash map does it in one pass: for
              each number, check if its complement (target minus number) is
              already in the map. If it is, you&rsquo;re done. If not,
              record this number and keep going.
            </p>
          </div>
          <TwoSumVisual />
        </div>
        <div className="code-block">
          <code>{`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None
# O(n) time, O(n) space -- one hash lookup replaces an entire inner loop`}</code>
        </div>

        <h4>Deduplication</h4>
        <p>
          Checking &ldquo;have I seen this before?&rdquo; against a list is{' '}
          <code>O(n)</code> every single time. Against a set, it&rsquo;s{' '}
          <code>O(1)</code>.
        </p>
        <div className="code-block">
          <code>{`def has_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`}</code>
        </div>

        <h4>Frequency Counting</h4>
        <p>
          You already saw this in Strings&rsquo; anagram check &mdash;
          it&rsquo;s really a hash table pattern wearing a string costume.
          Count occurrences once, and you can answer a lot of questions
          without rescanning.
        </p>
        <div className="code-block">
          <code>{`from collections import Counter

counts = Counter(["a", "b", "a", "c", "b", "a"])
counts["a"]              # 3
counts.most_common(1)    # [('a', 3)]`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Cheat Sheet</h3>
        <p>Common Python dict and set operations, and what each one actually costs:</p>
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
                  <td><code>{row.op}</code></td>
                  <td><code>{row.time}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Test Yourself</h3>
        <p>Guess the time (and space) complexity before revealing the answer.</p>
        <ComplexityQuiz examples={examples} />
      </section>
    </article>
  )
}

export default HashTables
