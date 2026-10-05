import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  StackVisual,
  QueueVisual,
  TwoStacksQueueVisual,
  MonotonicStackVisual,
  DequeVisual,
} from './StacksQueuesVisuals.jsx'

const operations = [
  { op: 'stack.append(x)', time: 'O(1) amortized', why: 'Pushing is just a list append.' },
  { op: 'stack.pop()', time: 'O(1) amortized', why: 'Removes from the end, no shifting.' },
  { op: 'stack[-1]', time: 'O(1)', why: 'Peek at the top without removing it.' },
  { op: 'deque.append(x)', time: 'O(1)', why: 'Enqueue at the back.' },
  { op: 'deque.popleft()', time: 'O(1)', why: 'Dequeue from the front -- deque is a doubly linked list, no shifting.' },
  { op: 'list.pop(0)', time: 'O(n)', why: 'The wrong tool for a queue: shifts every remaining element left.' },
  { op: 'deque.appendleft(x)', time: 'O(1)', why: 'Push onto the front.' },
  { op: 'deque.pop()', time: 'O(1)', why: 'Pop from the back.' },
  { op: 'x in stack / x in queue', time: 'O(n)', why: 'No shortcuts -- linear search either way.' },
]

const examples = [
  {
    id: 'stack-push',
    prompt: 'stack.append(x) on a list used as a stack.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'An ordinary list append -- amortized O(1), same as any dynamic array.',
  },
  {
    id: 'stack-pop',
    prompt: 'stack.pop() on a list used as a stack.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Removing from the end needs no shifting.',
  },
  {
    id: 'deque-popleft',
    prompt: 'queue.popleft() on a collections.deque.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'A deque is a doubly linked list under the hood, so the front is just as cheap as the back.',
  },
  {
    id: 'list-pop-zero',
    prompt: 'list.pop(0) used to dequeue from a plain list (the wrong tool for the job).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every remaining element has to shift left to fill the gap.',
  },
  {
    id: 'two-stack-dequeue',
    prompt: 'One dequeue operation on a queue implemented with two stacks (amortized).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Occasional full dumps from in-stack to out-stack are spread across many cheap dequeues.',
  },
  {
    id: 'monotonic-stack',
    prompt: 'Computing the next-greater-element answer for every item in an array of n numbers with a monotonic stack.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each index is pushed once and popped at most once, even with the while loop inside the for loop.',
  },
  {
    id: 'membership-check',
    prompt: 'Checking whether a value exists anywhere in a stack or queue of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'No hashing or ordering to exploit here -- just a linear scan.',
  },
  {
    id: 'deque-build',
    prompt: 'Pushing n items onto an empty deque one at a time with appendleft.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'n O(1) pushes add up to O(n); the deque itself holds n elements.',
  },
]

function StacksQueues() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Stacks &amp; Queues</h2>
      <p>
        Let&rsquo;s keep building the same way &mdash; one idea at a time,
        grounded in real Python. Stacks and queues are two of the simplest
        data structures you&rsquo;ll meet, but they&rsquo;re everywhere:
        undo buttons, browser history, breadth-first search, matching
        parentheses. The whole idea is just <em>restricting how</em> you&rsquo;re
        allowed to touch a collection &mdash; and useful behavior falls out
        for free.
      </p>

      <section className="notebook-section">
        <h3>Stacks: Last In, First Out</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A stack only lets you touch one end, the <strong>top</strong>.
              Push something on, and it&rsquo;s the first thing that comes
              back off &mdash; <strong>LIFO</strong>. Python&rsquo;s plain{' '}
              <code>list</code> already does this perfectly: you&rsquo;ve
              been using a stack since Arrays.
            </p>
          </div>
          <StackVisual />
        </div>
        <div className="code-block">
          <code>{`stack = []
stack.append(1)   # push -> [1]
stack.append(2)   # push -> [1, 2]
stack.pop()         # pop -> 2, stack is now [1]
stack[-1]            # peek -> 1, without removing it`}</code>
        </div>
        <p>
          The most important stack you&rsquo;ll never type out yourself:
          the <strong>call stack</strong>. Every function call pushes a
          frame; every return pops one. Recurse too deep with nothing to
          stop it, and you get a <em>stack overflow</em> &mdash; the name
          is not a metaphor.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Queues: First In, First Out</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A queue only lets you add at the <strong>back</strong> and
              remove from the <strong>front</strong> &mdash;{' '}
              <strong>FIFO</strong>, first come first served. Don&rsquo;t
              reach for a plain <code>list</code> here: you already know
              from Arrays that <code>list.pop(0)</code> is <code>O(n)</code>,
              since everything shifts left. Use{' '}
              <code>collections.deque</code> instead.
            </p>
          </div>
          <QueueVisual />
        </div>
        <div className="code-block">
          <code>{`from collections import deque

queue = deque()
queue.append(1)     # enqueue -> [1]
queue.append(2)     # enqueue -> [1, 2]
queue.popleft()       # dequeue -> 1, queue is now [2]`}</code>
        </div>
        <p>
          Why is this fast? You already know the answer from Linked Lists:{' '}
          <code>deque</code> is a doubly linked list under the hood, so
          both ends are <code>O(1)</code> &mdash; no shifting, ever.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Patterns You&rsquo;ll Use Constantly</h3>
        <p>
          Three shapes come up constantly once you start combining stacks
          and queues with the tricks you already know.
        </p>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Implementing One With the Other</h4>
            <p>
              Classic interview question: build a queue out of nothing but
              stacks. The trick is two stacks &mdash; <code>in</code> for
              enqueuing, <code>out</code> for dequeuing. When{' '}
              <code>out</code> runs dry, dump everything from{' '}
              <code>in</code> into it, which reverses the order right back
              into FIFO.
            </p>
          </div>
          <TwoStacksQueueVisual />
        </div>
        <div className="code-block">
          <code>{`class QueueFromStacks:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def enqueue(self, x):
        self.in_stack.append(x)

    def dequeue(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
        return self.out_stack.pop()
# O(1) amortized -- each element is pushed and popped by each stack at most once`}</code>
        </div>

        <h4>Monotonic Stacks</h4>
        <p>
          A monotonic stack keeps its elements in sorted order by popping
          off anything that breaks the order <em>before</em> pushing the
          new element. The classic use: &ldquo;next greater element&rdquo;
          &mdash; for every number, find the next one to its right that
          beats it.
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Scan left to right. Whenever the current number is bigger
              than what&rsquo;s sitting on top of the stack, that top
              element has just found its answer &mdash; pop it and record
              the current number. Then push the current number&rsquo;s
              index and keep going.
            </p>
          </div>
          <MonotonicStackVisual />
        </div>
        <div className="code-block">
          <code>{`def next_greater(nums):
    result = [-1] * len(nums)
    stack = []  # indices, values decreasing bottom to top
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            result[stack.pop()] = num
        stack.append(i)
    return result
# O(n) time -- each index is pushed once and popped at most once,
# so the while loop doesn't make this O(n^2)`}</code>
        </div>

        <h4>Deques: Push or Pop Either End</h4>
        <p>
          A <code>deque</code> is a stack and a queue at the same time
          &mdash; <code>O(1)</code> push and pop at <em>both</em> ends.
          It&rsquo;s also the right tool behind &ldquo;sliding window
          maximum&rdquo; style problems, where you need to drop values off
          either side of the window as it moves.
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Think of it as the deque from Linked Lists&rsquo; doubly
              linked structure made explicit &mdash; you get{' '}
              <code>append</code>/<code>pop</code> on the right and{' '}
              <code>appendleft</code>/<code>popleft</code> on the left, all
              four at <code>O(1)</code>.
            </p>
          </div>
          <DequeVisual />
        </div>
        <div className="code-block">
          <code>{`dq = deque([2, 3, 4])
dq.append(5)        # [2, 3, 4, 5]
dq.appendleft(1)     # [1, 2, 3, 4, 5]
dq.pop()              # 5, deque is now [1, 2, 3, 4]
dq.popleft()          # 1, deque is now [2, 3, 4]`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Cheat Sheet</h3>
        <p>Common stack, queue, and deque operations, and what each one actually costs:</p>
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

export default StacksQueues
