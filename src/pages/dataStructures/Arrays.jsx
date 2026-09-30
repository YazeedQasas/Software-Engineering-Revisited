import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  MemoryLayoutVisual,
  ResizeVisual,
  ShiftVisual,
  TwoPointersVisual,
  SlidingWindowVisual,
  PrefixSumVisual,
} from './ArraysVisuals.jsx'

const operations = [
  { op: 'arr[i]', time: 'O(1)', why: 'Direct address calculation.' },
  { op: 'arr[i] = x', time: 'O(1)', why: 'Direct write, no shifting.' },
  { op: 'len(arr)', time: 'O(1)', why: 'Python lists track their length; no counting needed.' },
  { op: 'arr.append(x)', time: 'O(1) amortized', why: 'Occasional resize-and-copy, spread out over many cheap appends.' },
  { op: 'arr.pop()', time: 'O(1) amortized', why: 'Removes from the end — nothing else has to move.' },
  { op: 'arr.insert(0, x)', time: 'O(n)', why: 'Shifts every existing element right.' },
  { op: 'arr.pop(0)', time: 'O(n)', why: 'Shifts every remaining element left.' },
  { op: 'x in arr', time: 'O(n)', why: 'Linear search — no ordering to exploit.' },
  { op: 'arr.index(x)', time: 'O(n)', why: 'Linear search for the first match.' },
  { op: 'arr[i:j]', time: 'O(j − i)', why: 'Copies the sliced range into a new list.' },
  { op: 'arr.sort()', time: 'O(n log n)', why: "Python's Timsort." },
  { op: 'arr.extend(other)', time: 'O(len(other))', why: 'Appends each element of other.' },
]

const examples = [
  {
    id: 'read-index',
    prompt: 'Reading arr[7] from an array of n elements.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Direct address calculation — no scanning required.',
  },
  {
    id: 'append-end',
    prompt: 'arr.append(x) on a Python list (amortized).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Usually a simple write; the occasional resize-and-copy is spread across many cheap appends.',
  },
  {
    id: 'insert-front',
    prompt: 'arr.insert(0, x) on a Python list of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every existing element has to shift one slot to the right to make room.',
  },
  {
    id: 'search-unsorted',
    prompt: 'x in arr on an unsorted list of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'With no ordering to exploit, Python may have to check every element.',
  },
  {
    id: 'binary-search-arr',
    prompt: 'Binary search for a value in a sorted array of n items.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Each comparison eliminates half of the remaining range.',
  },
  {
    id: 'build-prefix',
    prompt: 'Building a prefix-sum array from an n-element array.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One pass to compute it, and it needs its own n-element array to store the running totals.',
  },
  {
    id: 'two-pointer-pair',
    prompt: 'Two-pointer scan for a pair that sums to a target, in a sorted array of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Each step moves one pointer and rules out one element for good — no nested loop needed.',
  },
  {
    id: 'tuple-hash',
    prompt: 'Adding a tuple of fixed length to a Python set.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Tuples are immutable and hashable, so they hash like any other set element — no scanning.',
  },
]

function Arrays() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Arrays &amp; Dynamic Arrays</h2>
      <p>
        Let&rsquo;s build this up together, one idea at a time &mdash; starting
        from what an array actually is in memory, through mutability, why
        dynamic arrays grow the way they do, and finishing with three
        patterns that turn up constantly in interviews. Every idea gets real
        Python alongside it, not just a metaphor.
      </p>

      <section className="notebook-section">
        <h3>Let&rsquo;s Start From the Basics</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Picture a long shelf with numbered slots, all the same size,
              sitting right next to each other with no gaps. That&rsquo;s an
              array. Because every slot is the same size and they&rsquo;re
              packed together, the computer never has to search for
              anything &mdash; it can calculate exactly where any slot is.
            </p>
            <p>
              Here&rsquo;s the trick: to find <code>arr[3]</code>, the
              computer doesn&rsquo;t walk through <code>arr[0]</code>,{' '}
              <code>arr[1]</code>, <code>arr[2]</code> first. It computes{' '}
              <code>address = base + (index &times; size)</code> &mdash; one
              multiplication, one addition &mdash; and jumps straight there.
              That&rsquo;s the whole reason array access is{' '}
              <code>O(1)</code>: the math doesn&rsquo;t get any harder no
              matter how long the array is.
            </p>
          </div>
          <MemoryLayoutVisual />
        </div>
        <p>In Python, this is just a list &mdash; indexing and assignment are both direct, O(1) operations:</p>
        <div className="code-block">
          <code>{`arr = [12, 7, 45, 3, 90, 21]

arr[3]        # 3
arr[3] = 99   # arr is now [12, 7, 45, 99, 90, 21]`}</code>
        </div>
        <div className="definition">
          In short: contiguous, same-size slots let the computer calculate
          any element&rsquo;s address directly, instead of searching for it.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Mutable vs. Immutable</h3>
        <p>
          One more property matters as much as size: can you change
          what&rsquo;s inside after it&rsquo;s created? Python actually
          gives you both flavors of &ldquo;array&rdquo; side by side.
        </p>
        <p>
          A <code>list</code> is <strong>mutable</strong> &mdash; you can
          reassign elements, append, remove, all of it. A <code>tuple</code>{' '}
          looks almost identical but is <strong>immutable</strong>: once
          built, it&rsquo;s frozen. No item assignment, no append, no pop.
        </p>
        <div className="code-block">
          <code>{`nums = [1, 2, 3]     # list: mutable
nums[0] = 99          # fine -> [99, 2, 3]
nums.append(4)        # fine -> [99, 2, 3, 4]

point = (1, 2)        # tuple: immutable
point[0] = 99          # TypeError: 'tuple' object does not support item assignment`}</code>
        </div>
        <p>Two reasons interviewers like to poke at this:</p>
        <p>
          <strong>Safety.</strong> Pass a tuple into a function and you know
          it can&rsquo;t be silently changed behind your back. Pass a list,
          and the function is free to mutate it.
        </p>
        <p>
          <strong>Hashability.</strong> Only immutable objects can be
          dictionary keys or set members, because Python needs an
          object&rsquo;s hash to stay the same for as long as it&rsquo;s
          stored.
        </p>
        <div className="code-block">
          <code>{`seen = set()
seen.add((1, 2))   # fine -- tuples are hashable
seen.add([1, 2])   # TypeError: unhashable type: 'list'`}</code>
        </div>
        <div className="definition">
          In short: a list is a mutable dynamic array; a tuple is its
          immutable, fixed-size twin &mdash; same contiguous-memory idea,
          but nothing about it can change after creation.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Now Let&rsquo;s Make It Grow</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Here&rsquo;s a wrinkle: a real array&rsquo;s size is fixed the
              moment it&rsquo;s created. The memory right after it might
              already belong to something else, so you can&rsquo;t just tack
              on a 7th slot to a 6-slot array. So how does Python&rsquo;s{' '}
              <code>list</code> let you keep appending forever?
            </p>
            <p>
              It cheats, in a very organized way. Underneath, a dynamic
              array keeps a real fixed-size array with some spare capacity.
              Append when there&rsquo;s room, and it&rsquo;s a simple{' '}
              <code>O(1)</code> write. Once it&rsquo;s full, it allocates a
              brand new array &mdash; bigger than before &mdash; copies
              every element over, then makes the append. You saw this exact
              idea back in Big-O Complexity: that occasional expensive copy
              is what amortized analysis is about, and it&rsquo;s why append
              is still <code>O(1)</code> on average.
            </p>
          </div>
          <ResizeVisual />
        </div>
        <p>
          We&rsquo;ve been saying &ldquo;doubles&rdquo; because that&rsquo;s
          the classic textbook growth factor for teaching amortized
          analysis. Real implementations vary &mdash; CPython&rsquo;s list
          actually grows by roughly 1.125&times; (12.5%) once it&rsquo;s
          past a few elements, Java&rsquo;s <code>ArrayList</code> uses
          1.5&times;, and so on. The exact ratio doesn&rsquo;t matter for
          the Big-O argument: any constant growth factor greater than 1
          still gives amortized <code>O(1)</code> append.
        </p>
      </section>

      <section className="notebook-section">
        <h3>What Happens When You Insert in the Middle?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Not every insertion is created equal, and this trips people up
              constantly. Adding to the end is the cheap case above &mdash;{' '}
              <code>O(1)</code> amortized. But insert a new element at the
              front, or anywhere in the middle, and every element after
              that point has to shift over one slot to make room. In the
              worst case &mdash; inserting at index 0 &mdash; that&rsquo;s
              every single element: <code>O(n)</code>.
            </p>
            <p>
              Deletion works the same way in reverse: remove from the end
              and nothing else moves (<code>O(1)</code>); remove from the
              front or middle and everything after the gap slides back to
              close it (<code>O(n)</code>).
            </p>
          </div>
          <ShiftVisual />
        </div>
        <div className="code-block">
          <code>{`arr = [1, 2, 3, 4, 5]

arr.append(6)      # [1, 2, 3, 4, 5, 6]   -> O(1) amortized
arr.pop()            # removes 6            -> O(1) amortized

arr.insert(0, 99)    # [99, 1, 2, 3, 4, 5] -> O(n), shifts everything right
arr.pop(0)            # removes 99           -> O(n), shifts everything left`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Three Patterns You&rsquo;ll Use Constantly</h3>
        <p>
          These techniques turn a lot of &ldquo;obviously O(n&sup2;)&rdquo;
          array problems into O(n) ones. They come up so often in
          interviews that it&rsquo;s worth internalizing the shape of each
          one, not just memorizing an example.
        </p>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Two Pointers</h4>
            <p>
              Instead of comparing every element to every other element,
              walk two markers through the array &mdash; often starting at
              opposite ends and moving toward each other. On a sorted
              array, you can decide which pointer to move just by comparing
              the two values you&rsquo;re looking at right now, and each
              step rules out one element for good. That turns an{' '}
              <code>O(n&sup2;)</code> nested loop into a single{' '}
              <code>O(n)</code> pass.
            </p>
          </div>
          <TwoPointersVisual />
        </div>
        <div className="code-block">
          <code>{`def has_pair_with_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        total = arr[left] + arr[right]
        if total == target:
            return True
        if total < target:
            left += 1
        else:
            right -= 1
    return False`}</code>
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Sliding Window</h4>
            <p>
              When a problem asks about every contiguous chunk of size k (or
              every chunk that satisfies some condition), don&rsquo;t
              recompute the whole chunk from scratch each time you move
              over. Keep a running total for the current window, and when
              you slide it one step: subtract the element that just fell
              out the back, add the element that just entered the front.
              One subtraction and one addition replaces an entire re-scan.
            </p>
          </div>
          <SlidingWindowVisual />
        </div>
        <div className="code-block">
          <code>{`def max_sum_window(arr, k):
    window_sum = sum(arr[:k])
    best = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        best = max(best, window_sum)
    return best`}</code>
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Prefix Sums</h4>
            <p>
              If you&rsquo;ll be asked for the sum of a range &mdash;{' '}
              sum(i, j) &mdash; more than once, don&rsquo;t add it up each
              time. Build a prefix-sum array once, where{' '}
              <code>prefix[k]</code> holds the running total of everything
              up to index k. After that, any range sum is one subtraction:{' '}
              <code>sum(i, j) = prefix[j] &minus; prefix[i &minus; 1]</code>.
              The <code>O(n)</code> setup pays for itself the moment you ask
              a second question.
            </p>
          </div>
          <PrefixSumVisual />
        </div>
        <div className="code-block">
          <code>{`def build_prefix(arr):
    prefix = [arr[0]]
    for value in arr[1:]:
        prefix.append(prefix[-1] + value)
    return prefix

def range_sum(prefix, i, j):
    return prefix[j] - (prefix[i - 1] if i > 0 else 0)`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Cheat Sheet</h3>
        <p>Common Python list operations, and what each one actually costs:</p>
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

export default Arrays
