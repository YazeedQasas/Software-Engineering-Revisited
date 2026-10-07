import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  LinkedListVisual,
  WalkVisual,
  InsertDeleteVisual,
  SinglyVsDoublyVisual,
} from './LinkedListsVisuals.jsx'

const operations = [
  { op: 'head.value / head.next', time: 'O(1)', space: 'O(1)', why: 'Direct field access on the node you already hold.' },
  { op: 'insert / delete at the head', time: 'O(1)', space: 'O(1)', why: 'Rewire one pointer.' },
  { op: 'insert after a node you hold', time: 'O(1)', space: 'O(1)', why: 'Rewire two pointers, nothing shifts.' },
  { op: 'insert / delete at the tail (tail pointer kept)', time: 'O(1)', space: 'O(1)', why: 'You are already standing at the end.' },
  { op: 'insert / delete at the tail (no tail pointer)', time: 'O(n)', space: 'O(1)', why: 'Must walk the whole list to find the end.' },
  { op: 'delete a node you hold (doubly linked)', time: 'O(1)', space: 'O(1)', why: 'The node already knows its prev.' },
  { op: 'delete a node you hold (singly linked)', time: 'O(n)', space: 'O(1)', why: 'Must walk from head to find who points at it.' },
  { op: 'access the i-th node', time: 'O(n)', space: 'O(1)', why: 'No jumping, so walk from head one hop at a time.' },
  { op: 'search for a value', time: 'O(n)', space: 'O(1)', why: 'No ordering to exploit, so walk and check.' },
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
    id: 'prepend',
    prompt: 'Adding a new node at the front of a singly linked list with n nodes.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Point the new node at the old head and call it the new head. Nothing else moves.',
  },
  {
    id: 'insert-after-ref',
    prompt: 'Inserting a new node right after a node you already have a reference to.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Rewire two pointers. No walking required.',
  },
  {
    id: 'index-access',
    prompt: 'Accessing the i-th element of a singly linked list with n nodes.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'No random access: you walk from head, one next at a time.',
  },
  {
    id: 'append-no-tail',
    prompt: 'Adding a node at the end of a singly linked list with n nodes, when you only keep a head pointer.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'You have to walk the entire list just to find the last node.',
  },
  {
    id: 'search-list',
    prompt: 'Searching an unsorted linked list of n nodes for a value.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'No ordering to exploit, so you may have to visit every node.',
  },
  {
    id: 'delete-singly',
    prompt: 'Deleting a node given only a reference to it, in a singly linked list.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: "You don't know who points to this node, so you have to walk from head to find its predecessor.",
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
        If arrays are the structure that&rsquo;s great at &ldquo;give me item
        number k&rdquo;, linked lists are the structure that&rsquo;s great at
        &ldquo;put something right here&rdquo;. They&rsquo;re the cleanest
        example of one idea you&rsquo;ll keep running into: every structure
        is a trade, and you pick the trade that fits your problem.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Linked Lists &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A chain of small separate objects (nodes). Each holds a value and a pointer to the next node.</li>
                <li>The list is reached through its first node, the <strong>head</strong>. The last node points to <code>None</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>In an array, inserting at the front or middle shifts everything after it: <code>O(n)</code>.</li>
                <li>A growing array also needs one big block of free memory, and copies itself when it fills up.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The trick</h4>
              <ul>
                <li>Don&rsquo;t keep items side by side. Keep each one wherever it fits, and let it point to the next.</li>
                <li>Changing the order means changing pointers, so nothing has to move.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How it works</h4>
              <ul>
                <li>Reaching the k-th node means starting at head and hopping k times: <code>O(n)</code>.</li>
                <li>Inserting after a node you hold: point the new node at the next one, then point the old one at the new node. <code>O(1)</code>.</li>
                <li>Adding at the head is just as cheap.</li>
                <li><strong>Dummy node</strong>: a throwaway node placed before the head, so the head isn&rsquo;t a special case. Return <code>dummy.next</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Singly, doubly, circular</h4>
              <ul>
                <li><strong>Singly</strong>: only <code>next</code>. Walk forward only.</li>
                <li><strong>Doubly</strong>: <code>next</code> and <code>prev</code>. Walk both ways, and delete a node you hold in <code>O(1)</code>. Costs an extra pointer per node.</li>
                <li><strong>Circular</strong>: the last node points back to the first. Great for round-robin loops, but stop when you return to the start, not at <code>None</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li><code>O(1)</code>: head access, insert or delete at the head, insert after a node you hold</li>
                <li><code>O(n)</code>: reach the i-th node, search, find the tail without a tail pointer</li>
                <li>Most operations need only <code>O(1)</code> extra space.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>No jumping to position k, so no <code>O(1)</code> indexing.</li>
                <li>Extra memory per element for the pointer(s).</li>
                <li>Nodes are scattered in memory, so scanning is slower in practice than an array.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>You constantly add and remove in the middle or at the front, holding on to the spot.</li>
                <li>You rarely need &ldquo;give me item k&rdquo;.</li>
                <li>It&rsquo;s the building block under queues, LRU caches and undo history.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Losing the head, or overwriting a <code>next</code> before you&rsquo;ve saved it, orphans the rest of the list.</li>
                <li>Forgetting the empty-list and one-node cases.</li>
                <li>Looping until <code>None</code> on a circular list never ends.</li>
                <li>Deleting in a singly linked list needs the <em>previous</em> node, not just the one you want gone.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Linked Lists in One Breath</h3>
        <div className="definition">
          A linked list is a chain of nodes where each node holds a value and
          a pointer to the next one, so you can add or remove items anywhere
          without moving the rest.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What Goes Wrong With a Packed Shelf</h3>
        <p>
          Arrays keep everything shoulder to shoulder, and that&rsquo;s
          exactly what makes them awkward to change. Squeeze a new item in
          near the front and every item behind it has to shuffle over one
          slot to make room. With a million items, that&rsquo;s a million
          moves for a single insert.
        </p>
        <p>
          There&rsquo;s a second, quieter problem: an array needs one
          unbroken stretch of free memory big enough for all of it. When it
          outgrows that stretch, the whole thing gets copied somewhere
          bigger. If your data is constantly being edited in the middle,
          you&rsquo;re paying the shuffle cost over and over.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Trick: Directions Instead of Addresses</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Think of a treasure hunt. Each clue holds a prize and a note
              saying where the next clue is hidden. The clues can be
              anywhere. All you need is the first one, and each one leads
              you to the next.
            </p>
            <p>
              A linked list works exactly like that. Each <strong>node</strong>{' '}
              is its own small object holding a value and a pointer to the
              next node, and the nodes can live anywhere in memory. To add or
              remove one, you just change which clue points where. Nothing
              else has to move.
            </p>
          </div>
          <LinkedListVisual />
        </div>
      </section>

      <section className="notebook-section">
        <h3>Watching It Work</h3>
        <p>
          Let&rsquo;s build a tiny three-node list and see what each step
          really does.
        </p>
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
          Now the catch. There&rsquo;s no <code>arr[i]</code> here. To reach
          a node you start at <code>head</code> and follow{' '}
          <code>next</code> one hop at a time:
        </p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Getting to the 4th node costs three hops, and getting to the
              millionth costs a million. That&rsquo;s <code>O(n)</code>:
              you gave up the address-math shortcut the moment you gave up
              side-by-side memory.
            </p>
          </div>
          <WalkVisual />
        </div>
        <div className="code-block">
          <code>{`def get(head, i):
    node = head
    for _ in range(i):
        node = node.next
    return node.value`}</code>
        </div>
        <p>Here&rsquo;s what you get in return. Inserting once you&rsquo;re standing at the right spot:</p>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              To put a new node after <code>A</code>, point the new node at
              whatever <code>A</code> used to point to, then point{' '}
              <code>A</code> at the new node. Two pointer changes, and every
              other node stays exactly where it was. Order matters: if you
              redirect <code>A</code> first, you lose track of the rest of
              the list.
            </p>
          </div>
          <InsertDeleteVisual />
        </div>
        <div className="code-block">
          <code>{`def insert_after(node, value):
    new = Node(value)
    new.next = node.next   # first: keep hold of the rest
    node.next = new        # then: splice in

def push_front(head, value):
    new = Node(value)
    new.next = head
    return new             # the new node is the head now`}</code>
        </div>
        <p>
          Deleting is the mirror image: make the previous node skip over the
          one you want gone.
        </p>
        <div className="code-block">
          <code>{`def delete_after(node):
    if node.next:
        node.next = node.next.next   # the skipped node is unreachable`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Dummy Node Trick</h3>
        <p>
          Here&rsquo;s a small annoyance you&rsquo;ll hit the moment you
          start writing real list code. Deleting a node means changing the
          pointer of the node <em>before</em> it. But the head has no node
          before it, so removing the head needs its own special case.
          Inserting at the front has the same problem.
        </p>
        <div className="code-block">
          <code>{`def remove_value(head, target):
    # special case: the head itself is the one to remove
    while head and head.value == target:
        head = head.next

    node = head
    while node and node.next:
        if node.next.value == target:
            node.next = node.next.next
        else:
            node = node.next
    return head`}</code>
        </div>
        <p>
          The fix is to cheat. Create a throwaway <strong>dummy node</strong>{' '}
          (it holds no real data) and point it at the head. Now every real
          node, including the old head, has something before it, so one
          rule works for all of them.
        </p>
        <div className="code-block">
          <code>{`def remove_value(head, target):
    dummy = Node(None)
    dummy.next = head          # dummy -> old head -> ...

    node = dummy
    while node.next:
        if node.next.value == target:
            node.next = node.next.next
        else:
            node = node.next
    return dummy.next          # the real head, even if it changed`}</code>
        </div>
        <div className="definition">
          In short: a dummy node is a placeholder in front of the list, so
          the head stops being a special case. You return{' '}
          <code>dummy.next</code> at the end to get the real head.
        </div>
        <p>
          It costs one extra node, which is <code>O(1)</code> space, and it
          removes a whole class of off-by-one bugs. You&rsquo;ll see it
          whenever a list is being built or has its head changed, such as
          merging two lists or removing duplicates.
        </p>
      </section>

      <section className="notebook-section">
        <h3>One Way, Both Ways, or Around Again</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              So far each node only knows what comes next, which makes it a{' '}
              <strong>singly</strong> linked list. Notice the catch in{' '}
              <code>delete_after</code>: to remove a node you needed the one
              <em> before</em> it, and a singly linked node can&rsquo;t tell
              you who that is.
            </p>
            <p>
              A <strong>doubly</strong> linked list gives every node a{' '}
              <code>prev</code> pointer as well. Now a node knows both
              neighbors, so you can walk backward and delete a node you
              already hold in <code>O(1)</code>. The price is one extra
              pointer in every node. Python&rsquo;s{' '}
              <code>collections.deque</code> is built on this idea, which is
              how it gets <code>O(1)</code> adds and removes at both ends.
            </p>
            <p>
              A <strong>circular</strong> linked list changes the ending
              instead: the last node points back to the first rather than to{' '}
              <code>None</code>, so the list never runs out. It works with
              one pointer per node or two. It&rsquo;s a natural fit for
              anything that goes round and round, like a round-robin
              scheduler giving each task a turn, or a playlist on repeat.
            </p>
          </div>
          <SinglyVsDoublyVisual />
        </div>
        <div className="code-block">
          <code>{`class DNode:
    def __init__(self, value):
        self.value = value
        self.next = None
        self.prev = None

# Circular: close the loop by pointing the last node back at the first
head = Node(4)
head.next = Node(9)
head.next.next = Node(2)
head.next.next.next = head   # 4 -> 9 -> 2 -> back to 4`}</code>
        </div>
        <p>
          The one thing to watch with a circular list: there is no{' '}
          <code>None</code> to stop at, so a normal &ldquo;walk until
          <code> None</code>&rdquo; loop never ends. Stop when you arrive back
          at the node you started from instead.
        </p>
        <div className="code-block">
          <code>{`def visit_all(head):
    node = head
    while True:
        print(node.value)
        node = node.next
        if node is head:   # came full circle
            break`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>What Each Move Costs</h3>
        <p>
          The pattern from the walkthrough shows up in every row: if you
          already hold the spot, the change is cheap. If you have to{' '}
          <em>find</em> the spot first, you pay for the walk.
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
          The worst case almost always has the same cause:{' '}
          <strong>walking</strong>. Reaching the i-th node, searching, finding
          the tail, and finding a predecessor all mean hopping along from the
          head.
        </p>
        <div className="definition">
          &ldquo;Extra space&rdquo; means memory beyond the list itself.
          These operations only juggle a few pointers, so they add{' '}
          <code>O(1)</code>. Storing the list in the first place still costs{' '}
          <code>O(n)</code>, and each node carries pointer overhead an array
          doesn&rsquo;t.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What You Trade Away</h3>
        <p>
          <strong>Versus an array.</strong> They&rsquo;re opposites. An array
          reads by position in <code>O(1)</code> but pays <code>O(n)</code>{' '}
          to insert in the middle. A linked list inserts in <code>O(1)</code>{' '}
          once it holds the spot but pays <code>O(n)</code> to reach
          position k. Neither is better; they&rsquo;re built for opposite
          habits.
        </p>
        <p>
          <strong>Memory.</strong> Every node carries at least one pointer on
          top of its value, so a linked list uses more memory than an array
          of the same data. The nodes are also scattered, while an array is
          one tight block that processors scan very quickly. Even when the
          Big-O looks equal, arrays often win in practice for plain
          walking.
        </p>
        <p>
          <strong>Versus a hash table.</strong> For &ldquo;is this value in
          here?&rdquo;, a hash table answers in roughly <code>O(1)</code>,
          while a linked list has to walk node by node, <code>O(n)</code>.
          A linked list keeps order and makes edits cheap; a hash table
          trades the order away for fast lookups.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You edit in the middle or at the front, and you hold the
          spot.</strong> A text editor&rsquo;s undo history, or a playlist
          where you keep inserting and removing songs next to the current
          one, are natural fits.
        </p>
        <p>
          <strong>You&rsquo;re building something bigger.</strong> Linked
          lists sit underneath queues, and underneath LRU caches, where a
          doubly linked list plus a hash table gives <code>O(1)</code> for
          everything. You&rsquo;ll see that combination again later.
        </p>
        <p>
          One honest note for everyday Python: plain lists are usually the
          right default, and a linked list earns its place when the
          pointer-rewiring really is the point.
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

export default LinkedLists
