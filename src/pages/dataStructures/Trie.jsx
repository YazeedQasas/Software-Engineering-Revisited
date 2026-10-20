import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import TrieTracer from './TrieTracer.jsx'
import { BuildVisual, EndMarkVisual, AutocompleteVisual, WorkVisual } from './TrieVisuals.jsx'

const versus = [
  { prop: 'Is “cart” stored?', trie: 'walk 4 letters down, then check the ring', set: 'hash the word (reads all 4 letters), then look it up' },
  { prop: 'Every word starting with “ca”', trie: 'walk 2 letters, then collect what is below', set: 'check every single word' },
  { prop: 'Words in alphabetical order', trie: 'free: visit the children in order', set: 'not kept in any order' },
  { prop: 'Memory', trie: 'shares prefixes, but every node is an object with its own dict', set: 'one string per word, no sharing' },
  { prop: 'Effort to use', trie: 'you write it yourself', set: 'built into Python' },
]

const costs = [
  { what: 'Insert a word of L letters', time: 'O(L)', why: 'One step per letter: find the child, or make it.' },
  { what: 'Search for a word of L letters', time: 'O(L)', why: 'One step per letter, then a single check of the ring. It does not matter how many words are stored.' },
  { what: 'Check a prefix of L letters', time: 'O(L)', why: 'The same walk, without the final ring check.' },
  { what: 'List every word under a prefix', time: 'O(L + m)', why: 'L steps to walk down the prefix, then m to visit all the nodes below it.' },
  { what: 'Build a trie from N words of up to L letters', time: 'O(N × L)', why: 'N inserts, each O(L).' },
  { what: 'Extra memory', time: 'O(N × L)', why: 'Worst case, no two words share a letter and every letter needs its own node. Shared prefixes make it smaller in practice.' },
]

const examples = [
  {
    id: 'insert',
    prompt: 'Inserting one word of n letters into a trie that has no matching prefix.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'One step per letter, and every letter needs a brand new node.',
  },
  {
    id: 'search',
    prompt: 'Searching for a word of n letters in a trie that holds a million words.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'The walk follows one letter at a time, so the million words do not matter. It only keeps track of the current node.',
  },
  {
    id: 'scan',
    prompt: 'No trie: checking a plain list of n short words (at most 10 letters each) for any word that starts with "ca", using word.startswith("ca").',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Every word has to be checked. Each check looks at only 2 letters, which is constant work.',
  },
  {
    id: 'build',
    prompt: 'Building a trie from n words, each at most 10 letters long.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Each word costs at most 10 steps, which is a constant, so n words cost about n steps. In the worst case each word adds up to 10 new nodes.',
  },
  {
    id: 'twice',
    prompt: 'Inserting a word of n letters that is already in the trie.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'It still walks all n letters, but every node exists already, so nothing new is made.',
  },
  {
    id: 'binary',
    prompt: 'No trie: finding where the words starting with "ca" begin in a sorted list of n short words, using binary search.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'Each comparison throws away half of the list. A sorted list can answer prefix questions too, but it is slow to insert into.',
  },
  {
    id: 'collect',
    prompt: 'Collecting every word below a node, when there are n nodes below it.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Every node below is visited once. The list of answers can hold up to n words, and the recursion can go n levels deep.',
  },
  {
    id: 'set',
    prompt: 'Checking whether a word of n letters is in a Python set of words: word in words.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'It feels like O(1), but Python must read every letter to compute the hash, and again to compare. A trie takes about the same time for a lookup.',
  },
]

function Trie() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Advanced Data Structures</p>
      <h2>Trie</h2>
      <p>
        Suppose you type <code>ca</code> into a search box and it suggests{' '}
        <em>cap, car, cart, cat</em>. How did it find them without checking
        every word it knows? A <strong>trie</strong> (said like &ldquo;try&rdquo;)
        is a tree built for exactly this: <strong>each step down spells one more
        letter</strong>, so words that start the same way share a path.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <BuildVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Trie &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>A tree where each node is <strong>one letter</strong>.</li>
                <li>A path from the root spells a <strong>prefix</strong>.</li>
                <li>Also called a <strong>prefix tree</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>&ldquo;Which words start with these letters?&rdquo;</li>
                <li>Without checking every word.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Words that start alike <strong>share nodes</strong>.</li>
                <li>Following a word means following its letters down.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. The ring</h4>
              <ul>
                <li>Each node has an <code>is_end</code> flag: <strong>does a word end here?</strong></li>
                <li>That is how &ldquo;do&rdquo; and &ldquo;dog&rdquo; can both be words.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. The three jobs</h4>
              <ul>
                <li><strong>insert</strong> a word.</li>
                <li><strong>search</strong> for a whole word.</li>
                <li><strong>starts_with</strong>: every word under a prefix.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Costs at a glance</h4>
              <ul>
                <li>Time: <code>O(L)</code> for a word of L letters.</li>
                <li>It does not depend on how many words are stored.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. What you trade away</h4>
              <ul>
                <li>Lots of nodes, so it can use more memory than a plain list.</li>
                <li>You have to write it yourself.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. Use it when</h4>
              <ul>
                <li>Autocomplete, spell checking, word games, prefix lookups.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Forgetting <code>is_end</code>: &ldquo;ca&rdquo; would look like a word.</li>
                <li>Returning <code>True</code> from <code>search</code> as soon as the path exists.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Start at the root.</strong> It is an empty node: no letters yet.</li>
          <li><strong>Take the next letter</strong> of the word. If the current node has a child for it, move down. If not, make one first.</li>
          <li><strong>Repeat</strong> until the word runs out.</li>
          <li><strong>Mark the last node</strong> as the end of a word.</li>
        </ol>
        <p>
          Each node needs only two things: its children, kept in a dictionary
          that maps a letter to the child node, and that end-of-word flag.
        </p>
        <div className="code-block">
          <code>{`class TrieNode:
    def __init__(self):
        self.children = {}    # letter -> TrieNode
        self.is_end = False   # does a word end here?

root = TrieNode()           # the root holds no letter`}</code>
        </div>
        <p>
          Two things worth knowing. A trie is a tree, but{' '}
          <strong>not a balanced one</strong>: nothing rearranges it, and its
          shape is decided entirely by the words you put in. And the flag can
          be swapped for a <strong>value</strong>: store, say, a definition or a
          count on the last node instead of <code>True</code>, and the trie
          becomes a map from strings to values (a missing value means no word
          ends there).
        </p>
      </section>

      <section className="notebook-section">
        <h3>Where a Word Ends</h3>
        <p>
          The path alone is not enough. Look at these two tries: they have
          exactly the same nodes.
        </p>
        <EndMarkVisual />
        <p>
          In both, the path <code>d &rarr; o</code> exists, because &ldquo;dog&rdquo;
          passes through it. But only in the second trie is &ldquo;do&rdquo; a{' '}
          <em>word</em>. The ring (the <code>is_end</code> flag) is what tells
          them apart. That is why <code>search</code> checks the ring at the
          end, and does not just ask whether the path exists.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Autocomplete: Walk, Then Collect</h3>
        <p>
          Looking for every word that starts with a prefix takes two moves.{' '}
          <strong>Walk</strong> down the prefix&rsquo;s letters. Then{' '}
          <strong>collect</strong> every word below the node you land on.
        </p>
        <AutocompleteVisual />
        <p>
          The walk is as long as the prefix, however many words there are. The
          other branches are never touched, and that is what makes it fast.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Press <strong>Play</strong>. The trie holds <em>cap, car, cart, cat,
          dog, dot</em>. Pick an operation, then a preset, and watch the code
          line by line. The number on each node is the order it was reached,
          and a double ring means a word ends there.
        </p>
        <TrieTracer />
        <p>
          Try <strong>Insert &ldquo;do&rdquo;</strong>: no new nodes are made,
          and only a ring appears. Then <strong>Search &ldquo;ca&rdquo;</strong>:
          the whole path exists, but the answer is still <code>False</code>
          because no word ends there. And with <strong>Starts with
          &ldquo;ca&rdquo;</strong>, watch the call stack under the tree: the
          words come out in alphabetical order, because{' '}
          <code>collect</code> visits the children in sorted order.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trie or Hash Set?</h3>
        <p>
          A Python <code>set</code> of words also answers &ldquo;is this word
          stored?&rdquo; quickly. A trie earns its place when you ask about{' '}
          <em>prefixes</em>:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Trie</th>
                <th>Set of words</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.trie}</td>
                  <td>{row.set}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>A Trie in One Breath</h3>
        <div className="definition">
          A trie is a tree in which each node stands for one letter and each
          path from the root spells a prefix. Words that start the same way
          share their first nodes, and a flag on a node says whether a word ends
          there. Inserting, searching and finding everything under a prefix all
          start by walking the word&rsquo;s letters, so they take time in
          proportion to the word&rsquo;s length, not to the number of words
          stored.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Every job starts by walking down the letters of a word. So the
              time depends on how <em>long the word is</em> (call it L), not on
              how many words are in the trie:
            </p>
            <p>
              <code>O(L)</code> to insert or search, and memory that grows with
              the total number of letters stored.
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
        <p>
          One more trade-off. This page keeps each node&rsquo;s children in a
          dictionary, which only stores the letters that exist. Another common
          version uses a fixed list of 26 slots per node, one per letter. It is
          a little faster to index, but every node pays for 26 slots even when
          it has one child.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Reach for It When&hellip;</h3>
        <p>
          <strong>You need autocomplete or type-ahead.</strong> Search boxes,
          phone keyboards, code editors suggesting names.
        </p>
        <p>
          <strong>You check words against a dictionary</strong> and want to know
          early that no word can continue this way. Spell checkers and word
          games like Boggle stop a search the moment a prefix dies.
        </p>
        <p>
          <strong>You match by the start of a key.</strong> Routers use a
          trie-like structure to find the longest matching address prefix.
        </p>
        <p>
          <strong>You only need to know if a whole word is there.</strong> A
          plain <code>set</code> is simpler and smaller. Use that.
        </p>
        <p>
          <strong>You need to find a pattern in the middle of text.</strong> A
          trie only knows how words <em>begin</em>. Suffix trees, later in this
          section, handle that.
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

export default Trie
