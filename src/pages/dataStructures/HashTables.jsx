import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  HashingIdeaVisual,
  HashFunctionVisual,
  HashTableVisual,
  CollisionVisual,
  LoadFactorVisual,
  WorstCaseVisual,
} from './HashTablesVisuals.jsx'

const operations = [
  { op: 'd[key]', time: 'O(1) avg, O(n) worst', space: 'O(1)', why: 'Hash the key, jump to its bucket. Worst case: everything collided into one bucket.' },
  { op: 'd[key] = value', time: 'O(1) avg, O(n) worst', space: 'O(1)', why: 'Same hash-and-jump as reading.' },
  { op: 'key in d', time: 'O(1) avg, O(n) worst', space: 'O(1)', why: 'Same hashing, just checking presence.' },
  { op: 'del d[key]', time: 'O(1) avg, O(n) worst', space: 'O(1)', why: 'Find the bucket, remove the entry.' },
  { op: 'd.get(key, default)', time: 'O(1) avg', space: 'O(1)', why: 'Lookup with a fallback instead of a KeyError.' },
  { op: 'len(d)', time: 'O(1)', space: 'O(1)', why: 'Tracked, not counted.' },
  { op: 'iterate over d', time: 'O(n)', space: 'O(1)', why: 'Visits every entry once.' },
  { op: 'x in s / s.add(x)', time: 'O(1) avg, O(n) worst', space: 'O(1)', why: 'A set is a dict with keys only, so the same mechanism.' },
  { op: 's1 & s2', time: 'O(min(len(s1), len(s2)))', space: 'O(min(len(s1), len(s2)))', why: 'Checks each element of the smaller set against the larger.' },
  { op: 's1 | s2', time: 'O(len(s1) + len(s2))', space: 'O(len(s1) + len(s2))', why: 'Builds a new set holding both.' },
  { op: 'one resize and rehash', time: 'O(n)', space: 'O(n)', why: 'Allocate a bigger table and re-place every entry.' },
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
    id: 'list-membership',
    prompt: 'x in nums for a plain list of n numbers.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'A list has no hashing to jump with, so it may have to check every element.',
  },
  {
    id: 'dedupe-set',
    prompt: 'Checking a list of n items for duplicates using a set.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One O(1) membership check per item, and the set itself can grow to size n.',
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
        Python&rsquo;s <code>dict</code> and <code>set</code> are hash
        tables, and they&rsquo;re probably the most useful tools in your
        whole toolbox. To really understand them, we first need to
        understand the idea underneath: <strong>hashing</strong>.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Hash Tables &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What hashing is</h4>
              <ul>
                <li>A <strong>hash function</strong> turns any input (text, number, tuple) into a fixed-size number.</li>
                <li>Same input always gives the same number. Different inputs usually give different numbers.</li>
                <li>Only unchangeable (immutable) things can be hashed: strings, numbers, tuples, not lists.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. What it is</h4>
              <ul>
                <li>Stores <strong>key&ndash;value pairs</strong> and finds any key in roughly constant time.</li>
                <li>Python&rsquo;s <code>dict</code> is a hash table. A <code>set</code> is the same with keys only.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The problem it solves</h4>
              <ul>
                <li>In a list, finding something means scanning every item: <code>O(n)</code>.</li>
                <li>Keeping the list sorted helps, but then you can&rsquo;t cheaply add items.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The trick</h4>
              <ul>
                <li>Don&rsquo;t search. <em>Compute</em> where the item should be: <code>index = hash(key) % table size</code>.</li>
                <li>Jump straight to that bucket, same spirit as array indexing.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. How it works</h4>
              <ul>
                <li><strong>Insert:</strong> hash the key, jump to the bucket, store the pair.</li>
                <li><strong>Look up:</strong> hash the key again, jump to the same bucket, read the value.</li>
                <li>Missing key: <code>d[key]</code> raises <code>KeyError</code>; <code>d.get(key)</code> returns <code>None</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Collisions and growing</h4>
              <ul>
                <li>Two keys can land in the same bucket: a <strong>collision</strong>.</li>
                <li><strong>Chaining</strong> keeps a small list per bucket; <strong>open addressing</strong> probes for the next free slot.</li>
                <li>When the table gets too full (load factor), it grows and re-places every key: amortized <code>O(1)</code> inserts.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Costs at a glance</h4>
              <ul>
                <li>Get, set, delete, <code>in</code>: <code>O(1)</code> average.</li>
                <li>Worst case <code>O(n)</code> when everything collides.</li>
                <li>Extra space: <code>O(n)</code> for the table itself.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. What you trade away</h4>
              <ul>
                <li>No sorted order and no range queries (&ldquo;all keys between 10 and 20&rdquo;).</li>
                <li>Extra memory for spare buckets.</li>
                <li>Versus a list: no positions, just keys.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Use it when</h4>
              <ul>
                <li>Counting how often things appear.</li>
                <li>Checking &ldquo;have I seen this before?&rdquo; (deduplication).</li>
                <li>Caching results, or looking things up by a name or id.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>First, What Is Hashing?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Hashing means taking <em>anything</em> and boiling it down to a
              number. The machine that does it is called a{' '}
              <strong>hash function</strong>. Feed it the text{' '}
              <code>&quot;amy&quot;</code> and it hands back a number. Feed
              it a different input and you get a different number.
            </p>
            <p>
              Think of it as a fingerprint. A fingerprint is small and
              always the same for the same person, yet it&rsquo;s enough to
              tell people apart without comparing everything about them.
              A hash is a fingerprint for data.
            </p>
          </div>
          <HashingIdeaVisual />
        </div>
        <p>A good hash function follows a few rules:</p>
        <p>
          <strong>The same input always gives the same number.</strong>{' '}
          Hash <code>&quot;amy&quot;</code> today, tomorrow, or a thousand
          times in a row, and the answer doesn&rsquo;t change. That&rsquo;s
          what lets us find something again later.
        </p>
        <p>
          <strong>A tiny change gives a very different number.</strong>{' '}
          <code>&quot;amy&quot;</code> and <code>&quot;amz&quot;</code> land
          far apart, which spreads values out instead of clumping them.
        </p>
        <p>
          <strong>It&rsquo;s fast.</strong> Hashing has to be quick, or
          it&rsquo;d defeat the purpose of being a shortcut.
        </p>
        <p>You can try it right in Python:</p>
        <div className="code-block">
          <code>{`hash(42)                  # 42
hash("amy")               # a big number, e.g. 8251637109...
hash("amy") == hash("amy")  # True -- same input, same number
hash((1, 2))              # tuples work too

hash([1, 2])              # TypeError: unhashable type: 'list'`}</code>
        </div>
        <p>
          Notice the last line. Only things that <strong>can&rsquo;t change</strong>{' '}
          can be hashed. If a list could be edited after being hashed, its
          fingerprint would no longer match, and anything stored under it
          would be lost. This is exactly why tuples, strings and numbers
          work as dictionary keys and lists don&rsquo;t, the mutable vs.
          immutable idea from Arrays.
        </p>
        <div className="definition">
          One more honest detail: two different inputs can occasionally
          produce the same number, since there are far more possible inputs
          than numbers. That&rsquo;s called a <strong>collision</strong>,
          and we&rsquo;ll deal with it in a moment. Python also changes the
          hash of text each time it starts, so don&rsquo;t expect to see the
          same numbers twice across runs.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Hash Tables in One Breath</h3>
        <div className="definition">
          A hash table stores key&ndash;value pairs and uses hashing to
          compute exactly where each key lives, so it can find any key in
          roughly constant time.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why Searching Is the Problem</h3>
        <p>
          Say you&rsquo;re keeping a million customer records, and you need
          to look one up by name. If they sit in a plain list, the only way
          to find &ldquo;amy&rdquo; is to check them one by one until you
          stumble on her. That&rsquo;s <code>O(n)</code>, and it happens
          every single time you ask.
        </p>
        <p>
          You could sort the list and use binary search, which is{' '}
          <code>O(log n)</code>, but now every new customer means shuffling
          the list to keep it sorted. You&rsquo;d love a structure that finds
          things instantly <em>and</em> lets you add things cheaply.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Trick: Let the Key Tell You Where It Lives</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Think of a coat check. You hand over your coat and get a
              numbered ticket. Later, you don&rsquo;t search the whole room;
              the number tells them exactly which hook to go to.
            </p>
            <p>
              A hash table does the same with keys. It keeps an array of
              slots called <strong>buckets</strong>. To decide where a key
              goes, it hashes the key to get a big number, then takes that
              number <strong>modulo</strong> (remainder after dividing by)
              the number of buckets to land on a valid slot:{' '}
              <code>index = hash(key) % number_of_buckets</code>. Storing
              and finding both repeat the same calculation, so they always
              agree on the spot.
            </p>
          </div>
          <HashFunctionVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work</h3>
        <p>
          Let&rsquo;s store three people in a table with five buckets, then
          look one up. Imagine the hashing worked out like this:{' '}
          <code>cara</code> goes to bucket 0, <code>amy</code> to bucket 2,{' '}
          <code>ben</code> to bucket 4.
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Now ask for <code>ben</code>&rsquo;s age. The table hashes{' '}
              <code>&quot;ben&quot;</code>, takes the remainder to get 4,
              and opens bucket 4. It never glances at buckets 0 to 3. That
              one hash and one jump is the whole lookup, and it takes the
              same effort whether the table holds three entries or three
              million.
            </p>
          </div>
          <HashTableVisual />
        </div>
        <p>In Python, all of that is hidden behind ordinary dictionary syntax:</p>
        <div className="code-block">
          <code>{`ages = {"cara": 28, "amy": 30, "ben": 25}

ages["ben"]            # 25   -> hash, jump, read
ages["dan"] = 41       # add a new pair
ages["amy"] = 31       # same key: replaces the old value
"cara" in ages         # True
del ages["cara"]       # remove a pair

ages["zoe"]            # KeyError: 'zoe'
ages.get("zoe")        # None -- no error, no crash
ages.get("zoe", 0)     # 0    -- or give your own default`}</code>
        </div>
        <p>
          A <code>set</code> is the same machine with the values taken out:
          it only remembers which keys exist, which makes it perfect for
          &ldquo;is this in here?&rdquo;
        </p>
        <div className="code-block">
          <code>{`seen = {1, 2, 3}
5 in seen        # False
seen.add(5)      # now True
seen.add(5)      # no effect -- already there, sets never repeat`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>When Two Keys Want the Same Spot</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Remember the collision from earlier? With only a few buckets
              and many possible keys, sooner or later two keys hash to the
              same bucket. It&rsquo;s not a bug, just something every hash
              table has to handle. There are two classic fixes.
            </p>
            <p>
              <strong>Chaining</strong> lets each bucket hold a little list.
              A second key just joins the list in that bucket.{' '}
              <strong>Open addressing</strong> keeps one item per bucket
              instead, and if the spot is taken, probes forward to the next
              free slot. CPython&rsquo;s <code>dict</code> uses open
              addressing. Either way, the lookup finds the right bucket, then
              checks the few items there for the exact key.
            </p>
          </div>
          <CollisionVisual />
        </div>
        <div className="concept-row">
          <div className="concept-text">
            <h4>A table that fills up gets slow</h4>
            <p>
              The fuller the table, the more collisions. The{' '}
              <strong>load factor</strong>, entries divided by buckets,
              measures this. When it crosses a threshold (CPython resizes a
              dict at about two-thirds full), the table allocates a bigger
              bucket array and <strong>rehashes</strong> every key into it.
              Every key has to be re-placed because the index depends on the
              table size: <code>hash(key) % 8</code> and{' '}
              <code>hash(key) % 16</code> are different spots.
            </p>
            <p>
              That&rsquo;s one expensive step, but it&rsquo;s rare, so
              inserts stay <code>O(1)</code> amortized, the same story as a
              growing array.
            </p>
          </div>
          <LoadFactorVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>What Each Move Costs</h3>
        <p>
          Almost everything is a hash-and-jump, so almost everything costs
          the same thing.
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
              {operations.map((row) => (
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
        <div className="concept-row">
          <div className="concept-text">
            <h4>Why &ldquo;usually&rdquo; and not &ldquo;always&rdquo;</h4>
            <p>
              With a good hash function, keys spread evenly, so each bucket
              holds a handful of entries at most and lookups are{' '}
              <code>O(1)</code> on average. But hashing only spreads things
              out <em>on average</em>. In the worst case, whether from a
              poor hash function or someone crafting keys to collide on
              purpose, everything lands in one bucket and a lookup has to
              scan a chain of <code>n</code> entries: <code>O(n)</code>.
            </p>
            <p>
              Python guards against the second case by randomizing string
              hashes each run, which makes deliberately colliding keys much
              harder to build.
            </p>
          </div>
          <WorstCaseVisual />
        </div>
        <div className="definition">
          &ldquo;Extra space&rdquo; means memory beyond the table. A single
          lookup or insert adds nothing, but the table itself costs{' '}
          <code>O(n)</code> and always keeps some empty buckets spare, so it
          uses more memory than a list holding the same data.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What You Trade Away</h3>
        <p>
          <strong>Versus a list.</strong> A hash table finds a key in{' '}
          <code>O(1)</code> where a list needs <code>O(n)</code>, but you
          lose positions: there&rsquo;s no &ldquo;the third item&rdquo;, only
          &ldquo;the item called amy&rdquo;.
        </p>
        <p>
          <strong>Versus a sorted structure, like a balanced tree.</strong>{' '}
          Hash lookups are usually faster, but a hash table doesn&rsquo;t keep
          keys in sorted order. You can&rsquo;t cheaply ask for the smallest
          key, the next key after 50, or every key between 10 and 20. Python
          dicts remember the order you <em>inserted</em> keys, which is
          handy, but that&rsquo;s not the same as sorted. If you need those
          questions answered, a tree is the better tool.
        </p>
        <p>
          <strong>Memory and keys.</strong> The spare buckets cost extra
          space, and keys must be hashable, which rules out lists and other
          mutable things. A tuple makes a fine stand-in when you need a
          &ldquo;list-like&rdquo; key.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You&rsquo;re asking &ldquo;have I seen this before?&rdquo;</strong>{' '}
          Against a list that question costs <code>O(n)</code> every time.
          Against a set, it&rsquo;s <code>O(1)</code>. That single swap turns
          many slow loops into fast ones.
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
        <p>
          <strong>You&rsquo;re counting.</strong> Word frequencies, votes,
          how many times each character appears: a dictionary mapping each
          thing to its count answers all of it in one pass.
        </p>
        <div className="code-block">
          <code>{`from collections import Counter

counts = Counter(["a", "b", "a", "c", "b", "a"])
counts["a"]              # 3
counts.most_common(1)    # [('a', 3)]`}</code>
        </div>
        <p>
          <strong>You want to remember answers.</strong> Caching results (so
          you never compute the same thing twice) and looking records up by
          an id or a name are hash-table jobs. Many speed-up tricks in
          later topics come down to &ldquo;store it in a dict so it&rsquo;s a
          lookup, not a search&rdquo;.
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

export default HashTables
