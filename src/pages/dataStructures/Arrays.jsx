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
  { op: 'Access by index', time: 'O(1)', why: 'Direct address calculation — no scanning required.' },
  { op: 'Search, unsorted', time: 'O(n)', why: 'No ordering to exploit, so you may have to check every element.' },
  { op: 'Search, sorted (binary search)', time: 'O(log n)', why: 'Each comparison eliminates half of the remaining range.' },
  { op: 'Insert / delete at the end', time: 'O(1) amortized', why: 'Occasional resize-and-copy, spread out over many cheap appends.' },
  { op: 'Insert / delete at the front or middle', time: 'O(n)', why: 'Everything after the gap has to shift over.' },
  { op: 'Build a prefix-sum array', time: 'O(n) time, O(n) space', why: 'One pass, plus a second array to hold the running totals.' },
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
    prompt: 'Appending one element to the end of a dynamic array (amortized).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Usually a simple write; the occasional resize-and-copy is spread across many cheap appends.',
  },
  {
    id: 'insert-front',
    prompt: 'Inserting a new first element into an array of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every existing element has to shift one slot to the right to make room.',
  },
  {
    id: 'search-unsorted',
    prompt: 'Searching for a value in an unsorted array of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'With no ordering to exploit, you may have to check every element.',
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
    id: 'single-resize',
    prompt: 'One resize-and-copy event on a dynamic array that currently holds n elements.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'That single resize has to allocate a new array and copy every existing element — it just doesn’t happen often.',
  },
]

function Arrays() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Arrays &amp; Dynamic Arrays</h2>
      <p>
        Let&rsquo;s build this up together, one idea at a time &mdash; starting
        from what an array actually is in memory, through why dynamic arrays
        grow the way they do, and finishing with three patterns that turn up
        constantly in interviews.
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
        <div className="definition">
          In short: contiguous, same-size slots let the computer calculate
          any element&rsquo;s address directly, instead of searching for it.
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
              <code>list</code>, JavaScript&rsquo;s <code>Array</code>, or
              Java&rsquo;s <code>ArrayList</code> let you keep appending
              forever?
            </p>
            <p>
              They cheat, in a very organized way. Underneath, a dynamic
              array keeps a real fixed-size array with some spare capacity.
              Append when there&rsquo;s room, and it&rsquo;s a simple{' '}
              <code>O(1)</code> write. Once it&rsquo;s full, it allocates a
              brand new array &mdash; usually double the size &mdash;
              copies every element over, then makes the append. You saw
              this exact idea back in Big-O Complexity: that occasional
              expensive copy is what amortized analysis is about, and
              it&rsquo;s why append is still <code>O(1)</code> on average.
            </p>
          </div>
          <ResizeVisual />
        </div>
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
      </section>

      <section className="notebook-section">
        <h3>Cheat Sheet</h3>
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
                  <td>{row.op}</td>
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
