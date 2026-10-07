import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import { MemoryLayoutVisual, ShiftVisual } from './ArraysVisuals.jsx'

const operations = [
  { op: 'arr[i]', time: 'O(1)', space: 'O(1)', why: 'Direct address calculation.' },
  { op: 'arr[i] = x', time: 'O(1)', space: 'O(1)', why: 'Direct write, nothing shifts.' },
  { op: 'arr.append(x)', time: 'O(1) amortized', space: 'O(1)', why: 'Usually a plain write; the rare resize is spread over many appends.' },
  { op: 'arr.pop()', time: 'O(1)', space: 'O(1)', why: 'Removes from the end, so nothing else moves.' },
  { op: 'arr.insert(0, x)', time: 'O(n)', space: 'O(1)', why: 'Every element slides one slot right.' },
  { op: 'arr.pop(0)', time: 'O(n)', space: 'O(1)', why: 'Every element slides one slot left to close the gap.' },
  { op: 'x in arr', time: 'O(n)', space: 'O(1)', why: 'No ordering to exploit, so it may check every element.' },
  { op: 'arr[i:j]', time: 'O(j − i)', space: 'O(j − i)', why: 'Copies that range into a brand new list.' },
]

const examples = [
  {
    id: 'read-index',
    prompt: 'Reading arr[7] from an array of n elements.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Direct address calculation, no scanning required.',
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
    id: 'slice-copy',
    prompt: 'Copying a list of n items with arr[:].',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Every element is copied into a brand new list, so both the work and the extra memory grow with n.',
  },
]

function Arrays() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Arrays &amp; Dynamic Arrays</h2>
      <p>
        Almost every other data structure you&rsquo;ll meet is either built on
        top of an array or invented to fix one of its weaknesses. So
        it&rsquo;s worth knowing this one really well.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Arrays &amp; Dynamic Arrays &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>Items stored one after another in memory, indexed from 0.</li>
                <li>Python&rsquo;s <code>list</code> is the everyday version.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Scattered items force you to follow a trail to reach number k: <code>O(n)</code> just to read.</li>
                <li>Arrays make &ldquo;give me item k&rdquo; instant.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The trick</h4>
              <ul>
                <li>Same-size slots, no gaps, so the position is <em>calculated</em>, not searched.</li>
                <li><code>address = start + index &times; size</code> &rarr; <code>O(1)</code> for any index.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Mutability</h4>
              <ul>
                <li><code>list</code> is <strong>mutable</strong>: reassign, append, remove freely.</li>
                <li><code>tuple</code> is <strong>immutable</strong>: frozen once built.</li>
                <li>Only immutable (hashable) objects can be dict keys or set members.</li>
                <li>Pass a tuple and nobody can change it behind your back.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Growing</h4>
              <ul>
                <li>A real array has a fixed size; a dynamic array hides spare room at the back.</li>
                <li>Room left: append is a plain write. Full: allocate bigger, copy everything once, then append.</li>
                <li>The rare copy is spread over many cheap appends: <strong>amortized</strong> <code>O(1)</code>.</li>
                <li>Any constant growth factor above 1 gives the same result.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. End is cheap, front is not</h4>
              <ul>
                <li>Items stay packed, so inserting or deleting at the front shifts everything: <code>O(n)</code>.</li>
                <li>The middle shifts only what comes after it, but worst case is still about <code>n</code>.</li>
                <li>The end moves nothing: <code>append</code> / <code>pop()</code> are <code>O(1)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Costs at a glance</h4>
              <ul>
                <li><code>O(1)</code>: <code>arr[i]</code>, <code>arr[i] = x</code>, <code>append</code>, <code>pop()</code></li>
                <li><code>O(n)</code>: <code>insert</code> / <code>pop(0)</code>, <code>x in arr</code>, slices and copies</li>
                <li>Extra space counts memory <em>beyond</em> the array. Shifting adds none; a slice or <code>sorted(arr)</code> adds <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. What you trade away</h4>
              <ul>
                <li>Linked list: fast front inserts, but reaching item k means k steps.</li>
                <li>Hash table: fast &ldquo;is it in here?&rdquo;, but no order.</li>
                <li>Arrays keep order and sit compactly in memory.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Use it when</h4>
              <ul>
                <li>You read by position or sweep through everything.</li>
                <li>You add and remove at the end (stack-style).</li>
                <li>Constantly working at the front? Look at a queue or linked list.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Arrays in One Breath</h3>
        <div className="definition">
          An array stores items one after another in memory, so you can jump
          straight to any item by its position.
        </div>
        <p>
          In Python, the everyday version of this is the <code>list</code>:
          ordered, indexed from 0, and happy to grow when you add to it.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Where Things Get Painful Without One</h3>
        <p>
          Imagine your items were scattered all over memory, each one just
          pointing to where the next lives. To reach the 500th item, you
          would have to start at the first and follow the trail 499 times.
          Reaching the millionth item would take a million hops.
        </p>
        <p>
          That&rsquo;s <code>O(n)</code> just to <em>read</em> something you
          already know the position of. Lots of problems are really
          &ldquo;give me item number k&rdquo; over and over, and paying a
          full walk each time is a terrible deal.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Trick: Do the Math, Skip the Search</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Picture a long shelf of numbered slots, all the same size,
              pushed right up against each other. Because the slots are
              identical and have no gaps, you never need to look for
              anything. You can <em>calculate</em> where slot 3 is, the way
              you know which house is number 3 on a street where every
              house is the same width.
            </p>
            <p>
              The computer does exactly that:{' '}
              <code>address = start + (index &times; item size)</code>. One
              multiply, one add, then jump. It takes the same effort for
              slot 3 or slot 3,000,000, and that&rsquo;s the entire reason
              array access is <code>O(1)</code>.
            </p>
          </div>
          <MemoryLayoutVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work</h3>
        <p>Let&rsquo;s walk a tiny list through its life and see what each step really does.</p>
        <div className="code-block">
          <code>{`arr = [12, 7, 45, 3]

arr[2]          # 45   -> computed address, one jump
arr[2] = 99     # [12, 7, 99, 3]   -> one write

arr.append(8)   # [12, 7, 99, 3, 8]
arr.pop()       # back to [12, 7, 99, 3]`}</code>
        </div>
        <p>
          Reads, writes, and anything at the <strong>end</strong> are cheap.
          Appending is cheap because a list quietly keeps spare room at the
          back. When that room runs out, Python allocates a bigger block,
          copies everything across once, and carries on. That copy is
          expensive, but it happens so rarely that the average append still
          costs <code>O(1)</code>. This is the amortized idea from Big-O
          Complexity.
        </p>
        <p>The front is a different story:</p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              The items must stay packed with no gaps, so making room at
              index 0 means <em>every</em> element slides one slot right.
              Removing from the front is the same dance in reverse: the
              whole line shuffles left to close the hole. Insert or delete
              in the middle and only the items after that point move, but in
              the worst case that is still almost everything.
            </p>
          </div>
          <ShiftVisual />
        </div>
        <div className="code-block">
          <code>{`arr = [1, 2, 3, 4, 5]

arr.insert(0, 99)   # [99, 1, 2, 3, 4, 5]   -> everything shifts right
arr.pop(0)          # [1, 2, 3, 4, 5]       -> everything shifts left`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>What Each Move Costs</h3>
        <p>
          Here&rsquo;s the whole picture in one place. Notice how the pattern
          from the walkthrough shows up: the end is cheap, the front is not.
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
        <p>
          The worst cases come from two places. <strong>Shifting</strong>{' '}
          makes front and middle inserts or deletes <code>O(n)</code>, and
          the occasional <strong>resize</strong> makes a single unlucky
          append <code>O(n)</code> even though the average stays{' '}
          <code>O(1)</code>.
        </p>
        <div className="definition">
          &ldquo;Extra space&rdquo; means memory beyond the array itself.{' '}
          <code>insert</code> and <code>pop</code> rearrange items inside the
          existing block, so they add nothing. A slice or{' '}
          <code>sorted(arr)</code> builds a second array, so it costs{' '}
          <code>O(n)</code> extra.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What You Trade Away</h3>
        <p>
          Arrays buy you instant access by position, and they pay for it in
          other places. Here&rsquo;s how they stack up against the two
          structures you&rsquo;ll meet next to them:
        </p>
        <p>
          <strong>Versus a linked list.</strong> A linked list can insert or
          delete at the front in <code>O(1)</code> because nothing has to
          shift, but it can&rsquo;t jump to the middle: reaching item k means
          walking k steps. Arrays are the mirror image.
        </p>
        <p>
          <strong>Versus a hash table.</strong> If you want to know
          &ldquo;is this value in here?&rdquo;, an array has to scan (
          <code>O(n)</code>) while a hash table answers in roughly{' '}
          <code>O(1)</code>. The array&rsquo;s advantage is that it keeps
          items in order and sits compactly in memory, which makes walking
          through it fast in practice.
        </p>
        <p>
          One more Python detail: a <code>tuple</code> is an array that
          can&rsquo;t change after it&rsquo;s built. You give up appending
          and reassigning, and in return it&rsquo;s hashable, so it can be a
          dictionary key or live in a set, which a list can&rsquo;t.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You mostly read by position or loop through everything.</strong>{' '}
          Scores in a game, pixels in an image row, daily temperatures: the
          data has a natural order and you touch it by index or in a sweep.
        </p>
        <p>
          <strong>You add and remove at the end.</strong> A list used as a
          stack (<code>append</code> and <code>pop</code>) is exactly what
          arrays do best. If you find yourself constantly working at the
          front, that&rsquo;s the signal to look at a queue or linked list
          instead.
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

export default Arrays
