import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  LinkedListVisual,
  SinglyVsDoublyVisual,
  InsertDeleteVisual,
  ReversalVisual,
  CycleDetectionVisual,
  MergeVisual,
} from './LinkedListsVisuals.jsx'

const operations = [
  { op: 'head.value / head.next', time: 'O(1)', why: 'Direct field access on the node you already have.' },
  { op: 'insert/delete at the head', time: 'O(1)', why: 'Rewire one pointer.' },
  { op: 'insert/delete at the tail (tail pointer kept)', time: 'O(1)', why: 'Already standing right there.' },
  { op: 'insert/delete at the tail (no tail pointer)', time: 'O(n)', why: 'Have to walk the whole list to find the end.' },
  { op: 'insert/delete given a node (doubly linked)', time: 'O(1)', why: 'prev is already known, no walking needed.' },
  { op: 'insert/delete given a node (singly linked)', time: 'O(n)', why: 'Must walk from head to find the predecessor.' },
  { op: 'access the i-th node', time: 'O(n)', why: 'No random access -- walk from head, one next at a time.' },
  { op: 'search for a value', time: 'O(n)', why: 'No ordering to exploit, must walk.' },
  { op: 'reverse the whole list', time: 'O(n)', why: 'One pass, three pointers.' },
  { op: "detect a cycle (Floyd's)", time: 'O(n)', why: 'Fast pointer laps slow pointer within n steps.' },
]

const examples = [
  {
    id: 'head-access',
    prompt: 'head.value on a singly linked list.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Direct field access on the node you already hold.',
  },
  {
    id: 'insert-after-ref',
    prompt: 'Inserting a new node right after a node you already have a reference to.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Rewire two pointers -- no walking required.',
  },
  {
    id: 'index-access',
    prompt: 'Accessing the i-th element of a singly linked list with n nodes.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'No random access -- you have to walk from head, one next at a time.',
  },
  {
    id: 'reverse-list',
    prompt: 'Reversing a singly linked list with n nodes (iterative, three pointers).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One pass through the list; just prev, curr, and a temporary next.',
  },
  {
    id: 'cycle-detect',
    prompt: 'Detecting a cycle in a linked list with n nodes using fast/slow pointers.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: "The fast pointer laps the slow one within n steps if a cycle exists -- no extra memory needed.",
  },
  {
    id: 'delete-singly',
    prompt: 'Deleting a node given only a reference to it, in a singly linked list (no prev pointer).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: "You don't know who points to this node, so you have to walk from head to find its predecessor.",
  },
  {
    id: 'merge-lists',
    prompt: 'Merging two sorted linked lists with a total of n nodes.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One combined pass through both lists, splicing existing nodes onto the result.',
  },
  {
    id: 'delete-doubly',
    prompt: 'Deleting a node given a reference to it, in a doubly linked list.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The node already knows its own prev, so no walking is needed to rewire around it.',
  },
]

function LinkedLists() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Linked Lists</h2>
      <p>
        Let&rsquo;s keep building the same way &mdash; one idea at a time,
        grounded in real Python. Linked lists trade away the one
        superpower arrays have, O(1) random access, for a different one:
        O(1) insertion and deletion anywhere, as long as you already hold
        a pointer to the spot. No shifting, ever. That trade-off is exactly
        the kind of question interviewers love to ask, and by the end
        you&rsquo;ll be able to answer it properly.
      </p>

      <section className="notebook-section">
        <h3>What Is a Linked List?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              An array lives in one contiguous block of memory &mdash;
              that&rsquo;s what makes indexing <code>O(1)</code>. A linked
              list throws that away on purpose: each node is its own small,
              independent object holding a value and a pointer to the next
              node. The nodes can live anywhere in memory; the only thing
              connecting them is those pointers.
            </p>
          </div>
          <LinkedListVisual />
        </div>
        <div className="code-block">
          <code>{`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

head = Node(4)
head.next = Node(9)
head.next.next = Node(2)
# 4 -> 9 -> 2 -> None`}</code>
        </div>
        <p>
          Notice there&rsquo;s no <code>arr[i]</code> here. To find the 3rd
          node you start at <code>head</code> and follow <code>next</code>{' '}
          three times &mdash; <code>O(n)</code>, not <code>O(1)</code>. You
          gave up random access the moment you gave up contiguous memory.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Singly vs. Doubly Linked</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A singly linked list&rsquo;s nodes only know what comes next
              &mdash; you can only walk forward. A doubly linked
              list&rsquo;s nodes also keep a <code>prev</code> pointer, so
              you can walk backward too, and &mdash; more importantly
              &mdash; delete a node in <code>O(1)</code> once you&rsquo;re
              holding it, without needing to walk from <code>head</code> to
              find its predecessor first.
            </p>
          </div>
          <SinglyVsDoublyVisual />
        </div>
        <div className="code-block">
          <code>{`class DNode:
    def __init__(self, value):
        self.value = value
        self.next = None
        self.prev = None`}</code>
        </div>
        <p>
          The cost: every node carries an extra pointer, so a doubly
          linked list uses more memory per element. Python&rsquo;s own{' '}
          <code>collections.deque</code> is a doubly linked list under the
          hood &mdash; exactly why it gives you <code>O(1)</code> appends
          and pops from both ends.
        </p>
      </section>

      <section className="notebook-section">
        <h3>When Linked Lists Beat Arrays</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              This is the classic trade-off question, and now you can
              actually answer it. Insert or delete at a known position:{' '}
              <code>O(1)</code> for a linked list (rewire two pointers),{' '}
              <code>O(n)</code> for an array (shift everything after it).
              Access by index: <code>O(1)</code> for an array,{' '}
              <code>O(n)</code> for a linked list (walk from head). Neither
              one is &ldquo;better&rdquo; &mdash; they&rsquo;re optimized
              for opposite access patterns.
            </p>
          </div>
          <InsertDeleteVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reversal</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Reversing a linked list in place is the single most common
              linked-list interview question, and the technique is always
              the same three pointers: <code>prev</code>, <code>curr</code>,
              and a temporary <code>next</code>. At each step, save{' '}
              <code>curr.next</code> before you overwrite it, point{' '}
              <code>curr</code> back at <code>prev</code>, then slide both
              pointers forward one node.
            </p>
          </div>
          <ReversalVisual />
        </div>
        <div className="code-block">
          <code>{`def reverse(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
# O(n) time, O(1) space -- just three pointers, no extra structure`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Cycle Detection (Fast &amp; Slow Pointers)</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              How do you tell if a linked list loops back on itself
              instead of ending at <code>None</code>? Walking it with one
              pointer risks an infinite loop. The fix is{' '}
              <strong>Floyd&rsquo;s cycle detection</strong>: run two
              pointers at once, one moving one step at a time, the other
              two steps. If there&rsquo;s a cycle, the fast pointer
              eventually laps the slow one and they land on the same node.
              If there&rsquo;s no cycle, the fast pointer just hits{' '}
              <code>None</code> first.
            </p>
          </div>
          <CycleDetectionVisual />
        </div>
        <div className="code-block">
          <code>{`def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
# O(n) time, O(1) space -- no visited-set needed, just two pointers`}</code>
        </div>
        <p>
          Worth noticing: this answers the same &ldquo;have I seen this
          before?&rdquo; question a hash set would, but in{' '}
          <code>O(1)</code> space instead of <code>O(n)</code> &mdash;
          the two-pointer trick doesn&rsquo;t need to remember anything, it
          just needs to catch up.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Merging Two Sorted Lists</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Given two already-sorted linked lists, merge them into one
              sorted list. This is the exact merge step from merge sort,
              just applied to linked lists instead of arrays &mdash; and
              linked lists make it cleaner, since splicing a node onto the
              result is <code>O(1)</code>, no shifting required.
            </p>
          </div>
          <MergeVisual />
        </div>
        <div className="code-block">
          <code>{`def merge(a, b):
    dummy = Node(None)
    tail = dummy
    while a and b:
        if a.value <= b.value:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
# O(n + m) time, O(1) extra space -- reuses existing nodes, just rewires next`}</code>
        </div>
        <p>
          The <code>dummy</code> node is a common trick: it gives{' '}
          <code>tail</code> somewhere to start without needing a special
          case for the very first node you attach.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Cheat Sheet</h3>
        <p>Common linked-list operations, and what each one actually costs:</p>
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

export default LinkedLists
