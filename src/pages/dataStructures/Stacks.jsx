import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import { StackVisual, BracketsVisual, MonotonicStackVisual } from './StacksVisuals.jsx'

const operations = [
  { op: 'stack.append(x)', time: 'O(1) amortized', space: 'O(1)', why: 'Push: a plain write at the end of a list.' },
  { op: 'stack.pop()', time: 'O(1)', space: 'O(1)', why: 'Pop: remove from the end, nothing shifts.' },
  { op: 'stack[-1]', time: 'O(1)', space: 'O(1)', why: 'Peek at the top without removing it.' },
  { op: 'len(stack) / if stack', time: 'O(1)', space: 'O(1)', why: 'A list tracks its own size.' },
  { op: 'x in stack', time: 'O(n)', space: 'O(1)', why: 'No ordering to exploit, so scan.' },
  { op: 'min-stack: get the minimum', time: 'O(1)', space: 'O(n) overall', why: 'A second stack remembers the minimum at every level.' },
  { op: 'monotonic stack over n items', time: 'O(n)', space: 'O(n)', why: 'Each item is pushed once and popped at most once.' },
  { op: 'stack.pop(0) (wrong end)', time: 'O(n)', space: 'O(1)', why: 'The bottom is not the stack end; everything shifts.' },
]

const examples = [
  {
    id: 'push',
    prompt: 'stack.append(x) on a list used as a stack (amortized).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'An ordinary list append, with the occasional resize spread across many cheap pushes.',
  },
  {
    id: 'pop',
    prompt: 'stack.pop() on a list used as a stack.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Removing from the end moves nothing else.',
  },
  {
    id: 'peek',
    prompt: 'Peeking at the top of a stack with stack[-1].',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The top is always right at the end.',
  },
  {
    id: 'membership',
    prompt: 'Checking whether a value is somewhere in a stack of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'A stack only promises order at the top, so everything else may need to be scanned.',
  },
  {
    id: 'brackets',
    prompt: 'Checking that all brackets in a string of n characters are balanced, using a stack.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One pass over the string, and in the worst case (all opening brackets) the stack holds n items.',
  },
  {
    id: 'reverse',
    prompt: 'Reversing a list of n items by pushing them all onto a stack and popping them off.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'n pushes and n pops at O(1) each, and the stack holds all n items at once.',
  },
  {
    id: 'min-stack',
    prompt: 'Reading the current minimum from a min-stack that tracks its minimum alongside every push.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The answer is already sitting on top of the helper stack, so reading it is a peek.',
  },
  {
    id: 'monotonic-stack',
    prompt: 'Computing the next greater element for every item in an array of n numbers with a monotonic stack.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each index is pushed once and popped at most once, even with the while loop inside the for loop.',
  },
]

function Stacks() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Stacks</h2>
      <p>
        You use stacks all the time without noticing: the Undo button, the
        Back button in your browser, the pile of plates at a buffet. A stack
        is the simplest data structure there is, and its single rule is what
        makes it surprisingly powerful.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Stacks &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A pile where you only touch the <strong>top</strong>: push on, pop off, peek at it.</li>
                <li><strong>LIFO</strong>: last in, first out. The newest item leaves first.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Some tasks must be undone or finished in the reverse of the order they started: undo, nested brackets, backtracking.</li>
                <li>You need to remember &ldquo;where was I?&rdquo; and come back to it.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The trick</h4>
              <ul>
                <li>Everything happens at one end, so nothing ever shifts.</li>
                <li>The most recent thing is always the next thing you need.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>In Python a plain <code>list</code> is a stack: <code>append</code> pushes, <code>pop()</code> pops, <code>stack[-1]</code> peeks.</li>
                <li>Check it&rsquo;s not empty before popping or peeking.</li>
                <li>Bracket matching: push openers, pop on closers, and an empty stack at the end means balanced.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Smarter stacks</h4>
              <ul>
                <li><strong>Call stack</strong>: every function call pushes a frame. Too deep gives a stack overflow.</li>
                <li><strong>Min-stack</strong>: a second stack tracks the minimum, so <code>get_min</code> is <code>O(1)</code>.</li>
                <li><strong>Monotonic stack</strong>: keep items in sorted order by popping the ones that break it. Solves &ldquo;next greater element&rdquo; in <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li><code>O(1)</code>: push, pop, peek, length</li>
                <li><code>O(n)</code>: search, scanning the whole stack</li>
                <li>Monotonic stack over n items: <code>O(n)</code> total.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>No reaching the middle or the bottom. You only get the top.</li>
                <li>Versus a queue: newest first instead of oldest first.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Undo and history, the browser Back button.</li>
                <li>Matching brackets, evaluating expressions, depth-first search.</li>
                <li>Turning recursion into a loop.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Popping or peeking an empty stack raises an error.</li>
                <li>Recursion without a stopping case: stack overflow.</li>
                <li>Forgetting leftover items: a non-empty stack at the end often means a mismatch.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Stacks in One Breath</h3>
        <div className="definition">
          A stack is a pile where you can only add to or take from the top,
          so the item you added last is always the first one to come back
          off.
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Problem of Finding Your Way Back</h3>
        <p>
          Think about writing in a document and pressing Undo. The editor
          has to undo your <em>latest</em> change first, then the one
          before it, and so on, backward through time. Or think about
          exploring a maze: when you hit a dead end, you need to retrace
          your steps in exactly the reverse order you took them.
        </p>
        <p>
          In both cases the thing you need next is whatever you did most
          recently. A list with free access to every position doesn&rsquo;t
          say that anywhere, so the code has to remember which index is
          &ldquo;the latest&rdquo; and be careful never to touch the rest.
          That bookkeeping is easy to get wrong.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Trick: One Open End</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Picture a stack of plates. You can only put a plate on top or
              take the top plate off. Nobody pulls one out of the middle,
              so the last plate placed is the first one removed. This is{' '}
              <strong>LIFO</strong>: last in, first out.
            </p>
            <p>
              The rule is the whole feature. Because every change happens at
              one end, nothing ever has to shift, so adding and removing
              are both <code>O(1)</code>. And because the newest item is
              always on top, the &ldquo;most recent thing&rdquo; is
              always the next thing you get.
            </p>
          </div>
          <StackVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work</h3>
        <p>
          Python&rsquo;s plain <code>list</code> is already a perfect stack.
          You met these operations back in Arrays: the end of a list is
          where everything is cheap.
        </p>
        <div className="code-block">
          <code>{`stack = []
stack.append("a")    # push -> [a]
stack.append("b")    # push -> [a, b]
stack.append("c")    # push -> [a, b, c]

stack[-1]            # peek -> "c", still there
stack.pop()          # pop  -> "c", stack is [a, b]
stack.pop()          # pop  -> "b", stack is [a]`}</code>
        </div>
        <p>
          Popping or peeking an empty stack raises an error, so check first:
        </p>
        <div className="code-block">
          <code>{`if stack:                # an empty list is falsy
    top = stack.pop()`}</code>
        </div>
        <p>
          Now a real problem. Is <code>&quot;([])&quot;</code> a valid
          arrangement of brackets, while <code>&quot;([)]&quot;</code> is
          not? Every closing bracket must match the <em>most recent</em>{' '}
          unmatched opening one, which is exactly what a stack hands you.
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Walk through the string. When you see an opening bracket,
              push it. When you see a closing bracket, pop the top and make
              sure it&rsquo;s the matching opener. If the stack is empty
              when you finish, every bracket found its partner.
            </p>
          </div>
          <BracketsVisual />
        </div>
        <div className="code-block">
          <code>{`def is_balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack     # leftovers mean an unmatched opener`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Where Stacks Hide, and Where They Get Clever</h3>
        <h4>The call stack</h4>
        <p>
          The most important stack you&rsquo;ll never write yourself. Every
          time a function is called, Python pushes a frame holding its
          variables and where to return to. When it finishes, the frame is
          popped. Recursion simply piles frames higher. Recurse without a
          stopping case and the pile keeps growing until Python gives up
          with a <em>stack overflow</em>. The name isn&rsquo;t a metaphor.
        </p>
        <p>
          That also means any recursive solution can be turned into a loop
          with an explicit stack, which is how depth-first search is often
          written.
        </p>

        <h4>A stack that knows its minimum</h4>
        <p>
          Suppose you want a stack that can also tell you its smallest item
          instantly. Keep a second stack beside the first, and every time
          you push, also push the smaller of the new value and the current
          minimum onto it. Pop both together. The top of the helper stack is
          always the answer.
        </p>
        <div className="code-block">
          <code>{`class MinStack:
    def __init__(self):
        self.items = []
        self.mins = []

    def push(self, x):
        self.items.append(x)
        self.mins.append(min(x, self.mins[-1]) if self.mins else x)

    def pop(self):
        self.mins.pop()
        return self.items.pop()

    def get_min(self):
        return self.mins[-1]    # O(1)`}</code>
        </div>

        <h4>Monotonic stacks</h4>
        <p>
          A monotonic stack keeps its items in sorted order by popping
          anything that breaks the order <em>before</em> pushing the new
          one. The classic use is &ldquo;next greater element&rdquo;: for
          every number, find the next one to its right that beats it.
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Scan left to right. Whenever the current number is bigger than
              the top of the stack, that top item has just found its answer:
              pop it and record the current number. Then push the current
              index and keep going.
            </p>
          </div>
          <MonotonicStackVisual />
        </div>
        <div className="code-block">
          <code>{`def next_greater(nums):
    result = [-1] * len(nums)
    stack = []   # indices; values decrease from bottom to top
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            result[stack.pop()] = num
        stack.append(i)
    return result`}</code>
        </div>
        <p>
          It looks like a loop inside a loop, but every index is pushed once
          and popped at most once, so the whole thing is{' '}
          <code>O(n)</code>, not <code>O(n&sup2;)</code>.
        </p>
      </section>

      <section className="notebook-section">
        <h3>What Each Move Costs</h3>
        <p>
          Everything a stack is meant to do is cheap. The expensive rows are
          the ones that fight the stack&rsquo;s own rules.
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
        <div className="definition">
          &ldquo;Extra space&rdquo; means memory beyond the stack itself. Push
          and pop add nothing. The bracket checker and the monotonic stack
          each build a stack that can grow to <code>n</code> items, so they
          cost <code>O(n)</code> extra.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What You Trade Away</h3>
        <p>
          <strong>Versus a plain list.</strong> A list could do everything a
          stack does and more, but the restriction is the point. A reader who
          sees a stack knows the data is only ever touched at the top, and
          that makes the code easier to trust.
        </p>
        <p>
          <strong>Versus a queue.</strong> A stack gives back the{' '}
          <em>newest</em> item first, a queue gives back the{' '}
          <em>oldest</em>. Pick a stack when the most recent thing is the
          one that needs attention next, and a queue when whoever has waited
          longest should go first.
        </p>
        <p>
          <strong>Versus recursion.</strong> Recursion uses the call stack
          for free, but it&rsquo;s limited in depth. An explicit stack in
          your own code can grow as large as memory allows, at the cost of
          writing the bookkeeping yourself.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You need to undo or backtrack.</strong> Editor undo, the
          browser Back button, and solving a maze or puzzle by trying a
          path and stepping back when it fails all use a stack of previous
          states.
        </p>
        <p>
          <strong>Things are nested.</strong> Matching brackets in code,
          evaluating arithmetic expressions, and depth-first search through
          a tree or graph all have the &ldquo;finish the innermost one
          first&rdquo; shape that a stack handles naturally.
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

export default Stacks
