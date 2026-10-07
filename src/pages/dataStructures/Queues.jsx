import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  QueueVisual,
  QueueLinkedVisual,
  PriorityVisual,
  TwoStacksQueueVisual,
  DequeVisual,
} from './QueuesVisuals.jsx'

const operations = [
  { op: 'queue.append(x)', time: 'O(1)', space: 'O(1)', why: 'Enqueue: attach at the back.' },
  { op: 'queue.popleft()', time: 'O(1)', space: 'O(1)', why: 'Dequeue: detach from the front, nothing else moves.' },
  { op: 'queue[0]', time: 'O(1)', space: 'O(1)', why: 'Peek at the front without removing it.' },
  { op: 'len(queue)', time: 'O(1)', space: 'O(1)', why: 'A deque tracks its own size.' },
  { op: 'list.pop(0)', time: 'O(n)', space: 'O(1)', why: 'The wrong tool: every remaining item shifts left.' },
  { op: 'x in queue', time: 'O(n)', space: 'O(1)', why: 'No ordering to exploit, so scan.' },
  { op: 'queue[i] (middle of a deque)', time: 'O(n)', space: 'O(1)', why: 'No jumping to position i; you walk there.' },
  { op: 'heappush / heappop (priority queue)', time: 'O(log n)', space: 'O(1)', why: 'The heap re-sorts a short path, not everything.' },
]

const examples = [
  {
    id: 'enqueue',
    prompt: 'queue.append(x) on a collections.deque.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Attaching at the back is one cheap step.',
  },
  {
    id: 'dequeue',
    prompt: 'queue.popleft() on a collections.deque.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Detaching from the front moves nothing else.',
  },
  {
    id: 'peek',
    prompt: 'Peeking at the front of a queue with queue[0].',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The front is always right there.',
  },
  {
    id: 'list-pop-zero',
    prompt: 'Dequeuing from a plain Python list with list.pop(0), on a list of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every remaining element has to shift left to fill the gap.',
  },
  {
    id: 'drain-queue',
    prompt: 'Dequeuing all n items from a deque, one at a time.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'n steps that each cost O(1) add up to O(n), and nothing extra is built.',
  },
  {
    id: 'membership',
    prompt: 'Checking whether a value is somewhere in a queue of n items.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'A queue only promises order at its ends, so the middle has to be scanned.',
  },
  {
    id: 'two-stack-dequeue',
    prompt: 'One dequeue on a queue built from two stacks (amortized).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The occasional full dump from one stack to the other is spread across many cheap dequeues.',
  },
  {
    id: 'priority-pop',
    prompt: 'Removing the highest-priority item from a priority queue (heap) of n items.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The heap fixes itself along one short path from the top down, not across all n items.',
  },
]

function Queues() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Queues</h2>
      <p>
        You already know queues from real life: the line at a shop, the
        printer waiting on its jobs, the cars at a toll booth. A queue is a
        collection with one simple rule about fairness, and a lot of
        everyday software leans on that rule.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Queues &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A line: add at the <strong>back</strong>, remove from the <strong>front</strong>.</li>
                <li><strong>FIFO</strong>: first in, first out. The oldest item always leaves first.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Lots of work needs to be handled in arrival order, fairly.</li>
                <li>A plain list can do it, but <code>list.pop(0)</code> shifts everything: <code>O(n)</code> per dequeue.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The trick</h4>
              <ul>
                <li>Only touch the two ends, and keep a pointer to each.</li>
                <li>Nothing ever shifts, so both enqueue and dequeue are <code>O(1)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>In Python use <code>collections.deque</code>: <code>append</code> to enqueue, <code>popleft</code> to dequeue, <code>queue[0]</code> to peek.</li>
                <li>Check it&rsquo;s not empty before dequeuing.</li>
                <li>Under the hood: a linked list with a front and a back pointer.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Variations</h4>
              <ul>
                <li><strong>Deque</strong>: add and remove at both ends.</li>
                <li><strong>Circular queue</strong>: fixed size, the back wraps around to reuse freed slots.</li>
                <li><strong>Priority queue</strong>: the most important item leaves first, not the oldest. <code>O(log n)</code> per operation.</li>
                <li>A queue can be built from two stacks (amortized <code>O(1)</code>).</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li><code>O(1)</code>: enqueue, dequeue, peek, length</li>
                <li><code>O(n)</code>: search, reaching the middle, <code>list.pop(0)</code></li>
                <li><code>O(log n)</code>: priority queue push and pop</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>No searching or jumping to the middle. You only get the ends.</li>
                <li>Versus a stack: the opposite order. Stack = newest first, queue = oldest first.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Order of arrival matters: task scheduling, print jobs, buffering.</li>
                <li>Exploring level by level, as in breadth-first search.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Using a list as a queue with <code>pop(0)</code>: a hidden <code>O(n&sup2;)</code> loop.</li>
                <li>Dequeuing from an empty queue raises an error.</li>
                <li>Using a plain queue when you really need priority order.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Queues in One Breath</h3>
        <div className="definition">
          A queue is a line: new items join at the back, items leave from the
          front, so whatever has waited longest is always served next.
        </div>
      </section>

      <section className="notebook-section">
        <h3>Why Order of Arrival Matters</h3>
        <p>
          Imagine a print server where a hundred people send documents at
          once. If it handled them in random order, someone could wait
          forever while others cut ahead. What you want is the rule
          everybody already understands: first come, first served.
        </p>
        <p>
          You could fake that with a plain list, adding to the end and
          taking from the start. It works, but remember what you learned
          about arrays: removing from the front makes every other item
          shuffle one slot left. On a queue of a million jobs, every single
          dequeue would pay that cost. And a list lets anyone grab any item
          anytime, so the &ldquo;fair line&rdquo; is only a promise nobody
          enforces.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Trick: Two Doors, One Direction</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Picture a one-way corridor with a door at each end. People
              enter through the back door and leave through the front door,
              and nobody can slip in or out anywhere else. That&rsquo;s a
              queue: you only ever touch the <strong>front</strong> and the{' '}
              <strong>back</strong>, so the order people joined is exactly
              the order they leave. This is <strong>FIFO</strong>.
            </p>
            <p>
              The speed comes from a trick you already know from Linked
              Lists. Build the queue as a chain of nodes and keep a pointer
              to <em>both</em> ends. Adding means attaching a node at the
              back pointer. Removing means moving the front pointer one
              node along. Nothing shifts, so both doors are{' '}
              <code>O(1)</code>.
            </p>
          </div>
          <QueueLinkedVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work</h3>
        <p>
          In Python you rarely build this yourself.{' '}
          <code>collections.deque</code> is the ready-made version, with both
          ends already cheap:
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Enqueue three people, then serve one. Each new arrival goes to
              the back, and <code>popleft</code> hands back whoever has
              waited longest. The people in the middle never move.
            </p>
          </div>
          <QueueVisual />
        </div>
        <div className="code-block">
          <code>{`from collections import deque

queue = deque()
queue.append("Ana")      # enqueue -> [Ana]
queue.append("Ben")      # enqueue -> [Ana, Ben]
queue.append("Cy")       # enqueue -> [Ana, Ben, Cy]

queue[0]                 # peek -> "Ana", still in line
queue.popleft()          # dequeue -> "Ana", queue is [Ben, Cy]
len(queue)               # 2`}</code>
        </div>
        <p>
          Dequeuing from an empty queue raises an error, so check first:
        </p>
        <div className="code-block">
          <code>{`if queue:                # an empty deque is falsy
    next_person = queue.popleft()`}</code>
        </div>
        <p>
          And for the curious, here&rsquo;s the same thing written from
          scratch with the nodes from Linked Lists:
        </p>
        <div className="code-block">
          <code>{`class Queue:
    def __init__(self):
        self.front = None
        self.back = None

    def enqueue(self, value):
        node = Node(value)
        if self.back:
            self.back.next = node   # attach after the current last node
        else:
            self.front = node       # first item: it is both ends
        self.back = node

    def dequeue(self):
        node = self.front
        self.front = node.next
        if self.front is None:      # the line is now empty
            self.back = None
        return node.value`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Same Line, Different Rules</h3>
        <p>
          The basic queue has a few close relatives, each changing one rule.
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <h4>Deque: two doors, both ways</h4>
            <p>
              A <strong>deque</strong> (&ldquo;double-ended queue&rdquo;,
              said &ldquo;deck&rdquo;) lets you add and remove at{' '}
              <em>both</em> ends in <code>O(1)</code>. It works as a queue,
              as a stack, or both at once. It&rsquo;s the same{' '}
              <code>collections.deque</code> you&rsquo;ve been using.
            </p>
          </div>
          <DequeVisual />
        </div>
        <div className="code-block">
          <code>{`dq = deque([2, 3, 4])
dq.append(5)         # [2, 3, 4, 5]
dq.appendleft(1)     # [1, 2, 3, 4, 5]
dq.pop()             # 5
dq.popleft()         # 1`}</code>
        </div>

        <h4>Circular queue: a ring with a fixed size</h4>
        <p>
          Sometimes you want a queue with a hard size limit, like a buffer
          holding the last 100 events. A <strong>circular queue</strong>{' '}
          stores its items in a fixed-size array and treats the end as
          connected to the start. When the back reaches the last slot, it
          wraps around to slot 0 and reuses the space the front has
          already freed. Nothing is ever shifted and nothing is reallocated.
        </p>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Priority queue: most important first</h4>
            <p>
              In a <strong>priority queue</strong> the item that leaves
              first is the one with the highest priority, not the one that
              waited longest, like an emergency room that treats the worst
              cases first. It&rsquo;s usually built on a heap, which makes
              adding and removing <code>O(log n)</code> instead of{' '}
              <code>O(1)</code>. You&rsquo;ll meet the heap itself later.
            </p>
          </div>
          <PriorityVisual />
        </div>
        <div className="code-block">
          <code>{`import heapq

tasks = []
heapq.heappush(tasks, (3, "write report"))
heapq.heappush(tasks, (1, "fix outage"))
heapq.heappush(tasks, (2, "reply to email"))

heapq.heappop(tasks)   # (1, "fix outage") -- lowest number first`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Classic Puzzle: A Queue From Two Stacks</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Interviewers love asking you to build a queue using only
              stacks (last in, first out). The trick is that reversing a
              reversal restores the original order. Keep an <code>in</code>{' '}
              stack for new arrivals and an <code>out</code> stack for
              leaving. When <code>out</code> runs dry, pour everything from{' '}
              <code>in</code> into it, which flips the order back into
              first-in, first-out.
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
        return self.out_stack.pop()`}</code>
        </div>
        <p>
          The pour is expensive but rare: each item is moved at most once, so
          dequeue is <code>O(1)</code> amortized, the same idea as a growing
          array.
        </p>
      </section>

      <section className="notebook-section">
        <h3>What Each Move Costs</h3>
        <p>
          The pattern is the same as always: the two ends are cheap, and
          anything in the middle isn&rsquo;t.
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
          &ldquo;Extra space&rdquo; means memory beyond the queue itself. Each
          of these operations adds nothing beyond a few pointers. Holding the
          queue&rsquo;s items still costs <code>O(n)</code> overall.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What You Trade Away</h3>
        <p>
          <strong>Versus a list.</strong> A list lets you read any position,
          search, and sort. A queue deliberately takes that away and gives
          you a fast, fair line in return. The restriction is the feature: a
          reader seeing a queue knows exactly how the data flows.
        </p>
        <p>
          <strong>Versus a stack.</strong> They&rsquo;re mirror images. A
          stack gives back the <em>newest</em> item first, a queue gives
          back the <em>oldest</em>. Which one you want depends on whether
          recent or waiting-longest work should come first.
        </p>
        <p>
          <strong>Versus a priority queue.</strong> A plain queue is fair by
          arrival. If some jobs matter more than others, you pay{' '}
          <code>O(log n)</code> per operation for a priority queue and get
          importance order in return.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>Order of arrival decides the order of work.</strong> Print
          jobs, customer-support tickets, messages waiting to be processed,
          and the buffer between a fast producer and a slow consumer are all
          queues.
        </p>
        <p>
          <strong>You&rsquo;re exploring level by level.</strong> Breadth-first
          search visits everything one step away, then everything two steps
          away, and so on. A queue holds the &ldquo;visit these next&rdquo;
          list, and it&rsquo;s the reason a queue shows up in so many
          graph and tree problems later.
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

export default Queues
