import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import { BfsTracer, DfsTracer } from './TreeSearchTracer.jsx'
import { TreeVocabVisual, TreeOrderVisual, TreeShapeVisual } from './TreeSearchVisuals.jsx'
import { BFS_ORDER, DFS_ORDER } from './searchTree.js'

const vocabulary = [
  { term: 'Node', meaning: 'One item in the tree. It holds a value.', here: 'A, B, C, D, E, F, G, H' },
  { term: 'Edge', meaning: 'The line joining a node to one of its children.', here: 'A–B, A–C, B–D, …' },
  { term: 'Root', meaning: 'The one node at the very top, with nothing above it.', here: 'A' },
  { term: 'Parent and child', meaning: 'A node and the nodes directly below it.', here: 'B is the parent of D and E' },
  { term: 'Leaf', meaning: 'A node with no children. A dead end.', here: 'E, F, G, H' },
  { term: 'Level (depth)', meaning: 'How many edges you cross to get there from the root.', here: 'A is level 0, H is level 3' },
  { term: 'Height', meaning: 'The number of levels below the root: the longest way down.', here: '3 (A → B → D → H)' },
  { term: 'Subtree', meaning: 'Any node together with everything below it. A tree made of trees.', here: 'B, D, E and H' },
]

// How many nodes each search looks at before it stops, for each target.
const lookedAt = (order, target) => {
  const at = order.indexOf(target)
  return at === -1 ? order.length : at + 1
}

const targets = [
  { target: 'A', label: 'A (the root)' },
  { target: 'C', label: 'C' },
  { target: 'F', label: 'F' },
  { target: 'H', label: 'H (deepest)' },
  { target: 'Z', label: 'Z (not in the tree)' },
]

const compare = [
  { prop: 'The to-do list', bfs: 'a queue: first in, first out', dfs: 'a stack: last in, first out' },
  { prop: 'Looks at nodes', bfs: 'level by level', dfs: 'down one branch, then back up' },
  { prop: 'Time', bfs: 'O(n)', dfs: 'O(n)' },
  { prop: 'Extra space', bfs: 'O(w): the widest level', dfs: 'O(h): the height of the tree' },
  { prop: 'Finds the nearest match first', bfs: 'Yes', dfs: 'No' },
  { prop: 'Written as', bfs: 'a loop and a queue', dfs: 'a loop and a stack, or recursion' },
]

const builtins = [
  { op: 'queue.popleft()  (a deque)', time: 'O(1)', why: 'Built for taking from the front. This is what BFS should use.' },
  { op: 'queue.append(x)  (a deque)', time: 'O(1)', why: 'Adding at the back is just as cheap.' },
  { op: 'my_list.pop(0)', time: 'O(n)', why: 'Every other item has to shuffle forward by one. A BFS built on it slows to O(n²).' },
  { op: 'stack.append(x) and stack.pop()  (a list)', time: 'O(1) avg', why: 'Both work at the end of the list, which is exactly what a stack needs.' },
  { op: 'tree[node]  (a dict)', time: 'O(1) avg', why: 'Looking up a node’s children is a hash lookup.' },
]

const examples = [
  {
    id: 'bfs-all',
    prompt: 'BFS visiting every node of a complete binary tree with n nodes (the last level holds about half of them).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each node goes into the queue once and comes out once. At its fullest the queue holds the whole bottom level, which is about n / 2 nodes.',
  },
  {
    id: 'dfs-balanced',
    prompt: 'DFS with a stack visiting every node of a balanced binary tree with n nodes.',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Every node is visited once. The stack only holds the path down plus a few waiting siblings, and a balanced tree is only about log n levels tall.',
  },
  {
    id: 'dfs-chain',
    prompt: 'Recursive DFS on a tree with n nodes where every node has just one child (a long chain).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Still n nodes to visit, but the chain is n levels tall, so n calls are waiting on the call stack at the deepest point.',
  },
  {
    id: 'root',
    prompt: 'BFS or DFS looking for a value that is the root of a tree with n nodes.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'The root is the first node taken out, and it matches. The search stops before touching anything else.',
  },
  {
    id: 'pop-zero',
    prompt: 'BFS on a tree with n nodes, using a plain list as the queue and taking from the front with my_list.pop(0).',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Each pop(0) shifts the remaining items along, which costs O(n), and it happens n times. A deque makes this O(n).',
  },
  {
    id: 'bst-search',
    prompt: 'Looking for a value in a balanced binary search tree of n nodes by going left or right at each node (for comparison).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'The ordering tells you which side to take, so half the tree is skipped each step. No BFS or DFS needed. That comes later.',
  },
  {
    id: 'count',
    prompt: 'Counting the nodes of a balanced binary tree with n nodes using a recursive DFS.',
    time: 'O(n)',
    space: 'O(log n)',
    explanation: 'Every node is counted once, and the recursion only goes as deep as the tree is tall.',
  },
  {
    id: 'build-dict',
    prompt: 'Storing a tree of n nodes as a dict that maps each node to the list of its children.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One entry per node, and every node appears once as somebody’s child.',
  },
]

function TreeSearch() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Tree Data Structures</p>
      <h2>Tree Search Algorithms (BFS &amp; DFS)</h2>
      <p>
        Linear and binary search looked through a row of items. A tree is
        different: it branches. From any node there may be several ways to
        go, and no sorting to tell you which one to take. So how do you look
        through every node without missing one or going round in circles?
        There are two classic answers. <strong>Breadth-first search</strong>{' '}
        (BFS) explores the tree one level at a time.{' '}
        <strong>Depth-first search</strong> (DFS) dives down one branch as
        far as it goes, then backs up. They are almost the same code.
      </p>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Tree Search (BFS &amp; DFS) &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What they are</h4>
              <ul>
                <li><strong>BFS:</strong> visit every node on one level before going down to the next.</li>
                <li><strong>DFS:</strong> follow one branch to the bottom, then back up and try the next.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem they solve</h4>
              <ul>
                <li>&ldquo;Is this value anywhere in the tree?&rdquo; or &ldquo;visit every node&rdquo;.</li>
                <li>A tree has no row to walk along. From each node there are several ways on, and you must remember the ones you skipped.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Keep a to-do list of nodes waiting to be looked at.</li>
                <li>Take one off, look at it, add its children to the list. Repeat.</li>
                <li>The <strong>kind of list</strong> is the only difference between BFS and DFS.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. How they work</h4>
              <ul>
                <li>Start with the root in the list.</li>
                <li><strong>BFS:</strong> a <strong>queue</strong>. Take from the front, add children at the back.</li>
                <li><strong>DFS:</strong> a <strong>stack</strong>. Take from the top, push children on top.</li>
                <li>List empty? Every node has been looked at.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. Best, average, worst</h4>
              <ul>
                <li><strong>Best:</strong> the target is the root: 1 node looked at.</li>
                <li><strong>Worst:</strong> the target is the last node reached, or missing: all <code>n</code> nodes.</li>
                <li>Which node is &ldquo;last&rdquo; depends on BFS vs DFS.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(n)</code> for both. Each node is handled once.</li>
                <li>Space: BFS <code>O(w)</code> (the widest level), DFS <code>O(h)</code> (the height).</li>
                <li><code>w</code> can be about <code>n / 2</code>. <code>h</code> can be anything from <code>log n</code> to <code>n</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>BFS can need a lot of memory on wide trees.</li>
                <li>DFS can need a lot on tall, stringy trees, and may wander deep before finding something shallow.</li>
                <li>Neither skips anything: on an ordered tree (a BST) you can do much better.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use them when</h4>
              <ul>
                <li><strong>BFS:</strong> you want the closest match, or to work level by level.</li>
                <li><strong>DFS:</strong> you must explore everything, the answer is probably deep, or recursion fits naturally.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Use a <code>deque</code> for BFS: <code>list.pop(0)</code> is <code>O(n)</code>.</li>
                <li>DFS with a stack visits children in reverse unless you reverse them.</li>
                <li>On a <strong>graph</strong>, which can loop back on itself, you must also remember visited nodes. A tree never loops.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>First, What Is a Tree?</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A tree is a set of <strong>nodes</strong> joined by{' '}
              <strong>edges</strong>, arranged like a family tree or the
              folders on your computer. There is one node at the top, the{' '}
              <strong>root</strong>. Every other node hangs below exactly one
              node above it, its <strong>parent</strong>. Nothing ever loops
              back up, so there is exactly one way to get from the root to
              any node.
            </p>
            <p>
              This one has eight nodes. We will search it on this page, so
              get to know it. The nodes with no children are the{' '}
              <strong>leaves</strong>, and the deepest node, H, is three
              steps below the root.
            </p>
          </div>
          <TreeVocabVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>What it means</th>
                <th>In this tree</th>
              </tr>
            </thead>
            <tbody>
              {vocabulary.map((row) => (
                <tr key={row.term}>
                  <td><strong>{row.term}</strong></td>
                  <td>{row.meaning}</td>
                  <td>{row.here}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>In Python, a simple way to store this tree is a dict that maps each node to the list of its children:</p>
        <div className="code-block">
          <code>{`tree = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F', 'G'],
    'D': ['H'],
    'E': [], 'F': [], 'G': [], 'H': [],
}

tree['B']    # ['D', 'E']   -> the children of B
tree['E']    # []           -> a leaf has no children`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea: Two Ways to Explore a Maze</h3>
        <p>
          Imagine you have to check every room in a building. You could check
          every room on the ground floor first, then every room on the next
          floor up, and so on: that is <strong>breadth-first</strong>, like
          ripples spreading out from a stone dropped in a pond. Or you could
          pick a door, keep going through doors until you hit a dead end,
          then back up to the last junction and try the other way: that is{' '}
          <strong>depth-first</strong>, like walking a maze.
        </p>
        <p>
          Both visit exactly the same nodes. Only the order differs. Watch
          the numbers appear: breadth-first goes <code>{BFS_ORDER.join(' ')}</code>,
          level by level, while depth-first goes <code>{DFS_ORDER.join(' ')}</code>,
          all the way down the left branch to H before it comes back for E.
        </p>
        <TreeOrderVisual />
        <p>
          What makes the difference is a to-do list of nodes that have been
          spotted but not looked at yet. When you take a node you add its
          children to that list, and then you must decide which one to take
          next. Take the <strong>oldest</strong> one (a queue) and you spread
          out level by level. Take the <strong>newest</strong> one (a stack)
          and you keep diving into whatever you just found.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself: Breadth-First Search</h3>
        <p>
          Press <strong>Play</strong> and the highlighted line marks which
          line of the code is running right now, while the tree and the queue
          show the search in step with it. The blue node is the one being
          looked at. Yellow nodes are waiting in the queue, and the one with
          the blue outline in the queue is next out. Grey nodes are done,
          numbered in the order they were reached, and a match turns green.
          You can pause, step forward or back one line at a time, drag the
          slider to jump around, and change the speed.
        </p>
        <BfsTracer />
        <p>
          Try <strong>Find H</strong> and count: H is the deepest node and
          the last one reached, so BFS looks at all eight. Notice how the
          queue always holds nodes from at most two levels, and how the
          numbers go across each level before dropping down.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself: Depth-First Search</h3>
        <p>
          This is the same tracer with the queue swapped for a stack. Compare
          the code: <code>popleft()</code> became <code>pop()</code>, and the
          children are added in <code>reversed</code> order. That is the
          whole difference.
        </p>
        <DfsTracer />
        <p>
          Now <strong>Find H</strong> takes only four looks, because DFS
          heads straight down the left branch, while <strong>Find C</strong>{' '}
          takes six, because DFS goes all the way into B&rsquo;s side before
          coming back for it. Watch the stack grow when a node with two
          children is taken, and shrink as the dead ends are cleared.
        </p>
        <p>
          Why <code>reversed</code>? A stack gives back the last thing you
          put in. To explore B before C, B has to be pushed <em>last</em>, so
          that it is on top. Without the reversal, DFS would still be a
          correct depth-first search, but it would explore the right side
          first.
        </p>
      </section>

      <section className="notebook-section">
        <h3>DFS Without the Stack: Recursion</h3>
        <p>
          Depth-first search is often written with recursion instead,
          because a function that calls itself already has a stack built in:
          the <strong>call stack</strong>. Each call is one step down the
          tree, and returning from it is the step back up.
        </p>
        <div className="code-block">
          <code>{`def dfs(tree, node, target):
    if node == target:
        return node
    for child in tree[node]:           # go down into each child in turn
        found = dfs(tree, child, target)
        if found is not None:          # it was somewhere down there
            return found
    return None                        # not in this subtree`}</code>
        </div>
        <p>
          It looks at the nodes in the same order as the stack version, and
          it is shorter. The price is that very deep trees can run out of
          call stack space (Python stops at about 1,000 nested calls by
          default), which is when the explicit stack is the safer choice.
        </p>
      </section>

      <section className="notebook-section">
        <h3>BFS and DFS in One Breath</h3>
        <div className="definition">
          Breadth-first search explores a tree level by level using a queue.
          Depth-first search explores one branch as far down as it goes
          before backing up, using a stack (or recursion). Both look at every
          node at most once.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Count the work like you learned. Every node goes onto the list
              once and comes off once, and each takes a constant amount of
              work plus a look at its children. So both searches do work
              proportional to the number of nodes: <code>O(n)</code>.
              Neither is faster than the other in the worst case. The same
              goes for a missing value, where every node has to be ruled
              out.
            </p>
            <p>
              The difference is <em>memory</em>. The to-do list is the only
              extra space, and its size depends on the shape of the tree.
              BFS has to hold a whole level at once, so a wide, bushy tree
              fills its queue. DFS only holds the way down, so a tall, thin
              tree fills its stack.
            </p>
          </div>
          <TreeShapeVisual />
        </div>
        <p>
          Here is the same eight-node tree again, with the number of nodes
          each search looks at before it stops:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Looking for</th>
                <th>BFS looks at</th>
                <th>DFS looks at</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((row) => (
                <tr key={row.target}>
                  <td><strong>{row.label}</strong></td>
                  <td>{lookedAt(BFS_ORDER, row.target)}</td>
                  <td>{lookedAt(DFS_ORDER, row.target)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Neither wins every time. It depends on where the target sits. The
          best case is the same for both (the root, one look) and the worst
          case is the same too (all <code>n</code>).
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Breadth-first</th>
                <th>Depth-first</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.bfs}</td>
                  <td>{row.dfs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          In the table, <code>n</code> is the number of nodes, <code>w</code>{' '}
          is the width of the widest level, and <code>h</code> is the height.
          For a balanced tree <code>h</code> is about <code>log n</code>, but
          for a chain it is <code>n</code>. The choice of data structure for
          the to-do list matters too:
        </p>
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
              {builtins.map((row) => (
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
        <h3>Reach for Them When&hellip;</h3>
        <p>
          <strong>You want the closest match (BFS).</strong> BFS reaches every
          node at distance 1 before any at distance 2, so the first match it
          finds is always one of the shallowest. Think &ldquo;the nearest
          exit&rdquo; or &ldquo;the fewest steps from here&rdquo;.
        </p>
        <p>
          <strong>You need to work level by level (BFS).</strong> Printing a
          tree row by row, or finding the average value on each level, falls
          out of a queue naturally.
        </p>
        <p>
          <strong>You have to visit everything (DFS).</strong> Adding up all
          the values, counting nodes, copying a tree, or listing the files
          in a folder and every folder inside it. DFS does it with the least
          fuss, and often with recursion.
        </p>
        <p>
          <strong>The tree is wide and shallow (DFS).</strong> A queue of a
          whole level is expensive, while a stack only holds the way down.
        </p>
        <p>
          <strong>The tree is tall and thin (BFS).</strong> Each level has
          only a few nodes, so the queue stays small, while DFS would have
          to hold the whole path down.
        </p>
        <p>
          <strong>The tree is ordered.</strong> If it is a binary search tree
          you can skip half of it at every step, so neither is needed. And
          when the structure is a graph that can loop back on itself, the
          same two ideas still work with one addition: a record of the nodes
          you have already visited.
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

export default TreeSearch
