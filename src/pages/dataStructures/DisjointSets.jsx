import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import UnionFindTracer from './UnionFindTracer.jsx'
import { GroupsVisual, FindVisual, FlattenVisual, SizeVisual, WorkVisual } from './UnionFindVisuals.jsx'

const asks = [
  { question: 'Are a and b in the same group?', how: 'find(a) == find(b)', cost: 'nearly O(1)' },
  { question: 'Join the groups of a and b', how: 'union(a, b)', cost: 'nearly O(1)' },
  { question: 'How big is the group of a?', how: 'size[find(a)]', cost: 'nearly O(1)' },
  { question: 'How many groups are there?', how: 'start at n, and take 1 away for every union that returned True', cost: 'O(1) to read' },
]

const versus = [
  { prop: 'Are a and b together?', label: 'O(1): compare two labels', search: 'O(V + E): search the graph', uf: 'nearly O(1)' },
  { prop: 'Join two groups', label: 'O(n): relabel a whole group', search: 'O(1): just add the edge', uf: 'nearly O(1)' },
  { prop: 'Connections keep arriving', label: 'slow: every join relabels', search: 'slow: search again each time', uf: 'fast: that is what it is for' },
  { prop: 'Gives the path between a and b?', label: 'no', search: 'yes (BFS)', uf: 'no: only yes or no' },
  { prop: 'Can remove a connection?', label: 'no', search: 'yes, delete the edge', uf: 'no: groups only merge' },
  { prop: 'Extra memory', label: 'O(n)', search: 'O(V + E) for the graph', uf: 'O(n): two lists' },
  { prop: 'Best when', label: 'a handful of joins, many questions', search: 'you need the route itself', uf: 'many joins and many questions' },
]

const costs = [
  { what: 'Set it up', time: 'O(n)', why: 'Every thing starts as its own root: one pass to fill the two lists.' },
  { what: 'find, with no tricks, worst case', time: 'O(n)', why: 'Unlucky joins can build a chain as long as the group, and find has to climb all of it.' },
  { what: 'find, smaller group under the bigger', time: 'O(log n)', why: 'A thing only gets one hop deeper when its group is put under a group at least as big, so the group at least doubles each time. That can happen at most log n times.' },
  { what: 'find, with both tricks', time: 'nearly O(1)', why: 'Exactly, it is O(α(n)): the inverse Ackermann function, which is below 5 for any n you could ever store. In practice, treat it as constant.' },
  { what: 'union and connected', time: 'nearly O(1)', why: 'Two finds, a comparison and a couple of assignments.' },
  { what: 'Extra memory', time: 'O(n)', why: 'The parent list and the size list, one slot per thing.' },
]

const examples = [
  {
    id: 'build',
    prompt: 'Setting up a disjoint set for n things: parent = list(range(n)) and size = [1] * n.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One slot in each of the two lists for every thing. They have to be filled in, so it is a pass over n things.',
  },
  {
    id: 'chain',
    prompt: 'One find with no tricks, where the parent pointers of n things form a single chain.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'It follows every pointer to reach the top. It only needs a variable to hold where it is now.',
  },
  {
    id: 'by-size',
    prompt: 'One find, when the smaller group has always gone under the bigger one (but find does not shorten paths).',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Trees stay about log n hops tall, because a thing only gets deeper when its group at least doubles.',
  },
  {
    id: 'both',
    prompt: 'One find, with the smaller group under the bigger and path halving (the code on this page).',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Strictly it is the inverse Ackermann function, which is under 5 for any number of things you could ever store. In practice it is constant.',
  },
  {
    id: 'union',
    prompt: 'One union(a, b) with both tricks.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Two finds, then a comparison and two assignments. So it costs the same as a find: nearly constant.',
  },
  {
    id: 'connected',
    prompt: 'Asking whether two things are in the same group: find(a) == find(b)',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Two finds and a comparison, so nearly constant.',
  },
  {
    id: 'all',
    prompt: 'Joining n things into one big group with n − 1 unions, both tricks on.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'n − 1 calls, each nearly O(1), is about n steps in all. The two lists hold n things each.',
  },
  {
    id: 'relabel',
    prompt: 'Joining two groups when every thing stores its own group number, so one whole group has to be renumbered.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'In the worst case almost every thing has to be given a new number. Union-Find avoids this by only changing one pointer.',
  },
]

function DisjointSets() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Advanced Data Structures</p>
      <h2>Disjoint Sets (Union-Find)</h2>
      <p>
        Here is a question you may need to answer thousands of times:{' '}
        <em>are these two things in the same group?</em> And between questions,
        groups keep <strong>merging</strong>: two friends connect, a cable joins
        two networks. A <strong>disjoint set</strong> keeps track of the groups
        so that both the question and the merge are almost instant.{' '}
        <em>Disjoint</em> just means no overlap: every thing is in exactly one
        group. It is also called <strong>Union-Find</strong>, after its two
        operations.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <GroupsVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Disjoint Sets &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A <strong>forest of trees</strong>, stored in one plain list, <code>parent</code>.</li>
                <li>Each tree is a group. Its <strong>root</strong> is the group&rsquo;s name.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;Are <code>a</code> and <code>b</code> in the same group?&rdquo;</li>
                <li>&ldquo;Join their groups.&rdquo;</li>
                <li>Many times, and groups only ever <strong>merge</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Every thing points at a parent. A root points at itself.</li>
                <li>Same group <strong>if and only if</strong> same root.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. find(x)</h4>
              <ul>
                <li>Follow the parent pointers up until a thing points at itself.</li>
                <li>That thing is the root.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. union(a, b)</h4>
              <ul>
                <li>Find both roots.</li>
                <li>If they differ, point one root at the other.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Two tricks</h4>
              <ul>
                <li><strong>Smaller under bigger</strong>: keeps trees short.</li>
                <li><strong>Path halving</strong>: find shortens the path it climbs.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Costs at a glance</h4>
              <ul>
                <li>Set up: <code>O(n)</code>.</li>
                <li>find, union: <strong>nearly <code>O(1)</code></strong>.</li>
                <li>Memory: <code>O(n)</code>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. What you trade away</h4>
              <ul>
                <li>No splitting a group and no removing a thing.</li>
                <li>Only yes or no: it cannot show the path between two things.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Join the <strong>roots</strong>, not the things themselves.</li>
                <li><code>size</code> is only right at a root.</li>
                <li>Compare <code>find(a)</code> with <code>find(b)</code>, not <code>a</code> with <code>b</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Start alone.</strong> Every thing is in a group of its own. Each one points at itself: <code>parent[x] = x</code>.</li>
          <li><strong>A group is a tree.</strong> Every thing points at a <em>parent</em> in the same group. The one at the top, which points at itself, is the <strong>root</strong>, and it is the name of the group.</li>
          <li><strong>find.</strong> To see which group a thing is in, climb the pointers to the root. Two things are in the same group exactly when they climb to the same root.</li>
          <li><strong>union.</strong> To join two groups, find both roots. If they are different, point one root at the other. That joins the two trees into one.</li>
        </ol>
        <p>
          The whole structure is two plain lists. Things are numbered{' '}
          <code>0</code> to <code>n &minus; 1</code>, <code>parent[x]</code> says
          where <code>x</code> points, and a second list, <code>size</code>, will
          count the members of each group (it is used by the first trick below).
          There are no node objects and no pointers: a list index <em>is</em> the
          pointer. If your things are names, give each name a number first.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Finding the Root</h3>
        <p>
          <code>find</code> is just a walk up. Here it is on five things that
          were joined in an unlucky order, so that the tree is a long chain:
        </p>
        <FindVisual />
        <p>
          That is the weakness. Every hop is one more step, and a chain can be as
          long as the group, so a find could take <code>O(n)</code>. Everything
          clever in Union-Find is about keeping the trees short.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Two Tricks That Keep Trees Short</h3>
        <p>
          <strong>Trick 1: the smaller group goes under the bigger one.</strong>{' '}
          When two roots are joined, either one can go on top. Keep a{' '}
          <code>size</code> for every root, and always put the root of the smaller
          group underneath:
        </p>
        <SizeVisual />
        <p>
          Why does that work? A thing only gets one hop deeper when its group
          goes under another group that is at least as big, so its group at least
          doubles. A group can only double about <code>log n</code> times before
          it holds everyone. So no tree is ever taller than about{' '}
          <code>log n</code>.
        </p>
        <p>
          <strong>Trick 2: tidy up while climbing.</strong> As <code>find</code>{' '}
          climbs, it points every thing it passes at its grandparent. The path
          gets shorter every time anybody uses it:
        </p>
        <FlattenVisual />
        <p>
          That is called <strong>path halving</strong>, and it is one line:{' '}
          <code>parent[x] = parent[parent[x]]</code>. (A close cousin,{' '}
          <em>path compression</em>, points everything on the path straight at the
          root, with a recursive <code>find</code>. Either one works.) Used
          together, the two tricks make <code>find</code> and <code>union</code>{' '}
          so fast that they are treated as constant time.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Eight things, numbered 0 to 7. Press <strong>Play</strong> and watch the
          trees, the <code>parent</code> list and the line of code change
          together. Here is the class that wraps the three functions:
        </p>
        <div className="code-block">
          <code>{`class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        root_a = self.find(a)
        root_b = self.find(b)
        if root_a == root_b:
            return False
        if self.size[root_a] < self.size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.size[root_a] += self.size[root_b]
        return True

    def connected(self, a, b):
        return self.find(a) == self.find(b)`}</code>
        </div>
        <UnionFindTracer />
        <p>
          In <strong>Find</strong>, try <strong>find(4)</strong> and watch the
          yellow node: 4 is pointed at its grandparent, then 2 at the root, and
          the <code>parent</code> list changes to match. Then{' '}
          <strong>find(0)</strong>: a root climbs nowhere. In{' '}
          <strong>Union</strong>, <strong>union(6, 4)</strong> hits the swap
          (<code>root_a, root_b = root_b, root_a</code>): 6 is a group of one, so it goes under the bigger group, not the
          other way round. And in <strong>Four unions in a row</strong>, the last
          call, <code>union(0, 2)</code>, returns <code>False</code>: by then 0 and
          2 are already in the same group.
        </p>
      </section>

      <section className="notebook-section">
        <h3>What You Can Ask</h3>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>How</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {asks.map((row) => (
                <tr key={row.question}>
                  <td><strong>{row.question}</strong></td>
                  <td><code>{row.how}</code></td>
                  <td>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          And what it <em>cannot</em> do. Groups only ever merge, so there is no
          way to split a group or take one thing out of it: the pointers of the
          other things might lead through it. It also says only{' '}
          <em>yes, together</em> or <em>no, apart</em>. It does not know how the
          two things are connected, and it cannot list the members of a group
          quickly. If you need the actual route between two things, use a graph
          search.
        </p>
        <p>
          One more use falls out of <code>union</code> returning{' '}
          <code>False</code>: if the two things are already in the same group,
          connecting them would close a loop. That is exactly how{' '}
          <strong>Kruskal&rsquo;s algorithm</strong> decides to skip an edge.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Union-Find or Something Simpler?</h3>
        <p>
          There are two obvious ways to answer &ldquo;are these connected?&rdquo;
          without Union-Find. One is to give every thing a group label and
          relabel a whole group on every join. The other is to keep the
          connections as a graph and search it each time. Each is fast at one
          half of the job:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>A group label on each thing</th>
                <th>Search the graph</th>
                <th>Union-Find</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.label}</td>
                  <td>{row.search}</td>
                  <td>{row.uf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Disjoint Set in One Breath</h3>
        <div className="definition">
          A disjoint set (Union-Find) is a collection of non-overlapping groups,
          stored as a forest in which every thing points at a parent and the root
          of each tree names its group. <code>find</code> climbs to the root, and{' '}
          <code>union</code> points one root at the other. Putting the smaller
          tree under the bigger one and shortening paths as they are climbed makes
          both operations take nearly constant time.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Without the tricks, one unlucky find can take as long as the group
              is big. With them, it takes a few hops, even for a million things.
            </p>
            <p>
              <code>O(n)</code> to set up, <code>nearly O(1)</code> for each find
              or union, and <code>O(n)</code> memory.
            </p>
          </div>
          <WorkVisual />
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>What</th>
                <th>Time</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((row) => (
                <tr key={row.what}>
                  <td><strong>{row.what}</strong></td>
                  <td><code>{row.time}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>Connections keep arriving and you keep asking.</strong> Are
          these two computers on the same network yet? Are these two accounts the
          same person?
        </p>
        <p>
          <strong>You are building a minimum spanning tree.</strong> Kruskal&rsquo;s
          algorithm leans on it for every edge.
        </p>
        <p>
          <strong>You are looking for a loop as you add edges.</strong> If both
          ends are already in the same group, the new edge closes a loop.
        </p>
        <p>
          <strong>You are counting groups that merge.</strong> Islands that join,
          friend circles, pixels that touch.
        </p>
        <p>
          <strong>You need to remove a connection or split a group.</strong> Union-Find
          cannot. Keep the graph and search it.
        </p>
        <p>
          <strong>You need the route from one thing to another.</strong> Use BFS
          or DFS. Union-Find only says whether a route exists.
        </p>
        <p>
          <strong>The connections never change.</strong> One search labels every
          group in O(V + E), and that is simpler.
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

export default DisjointSets
