import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import SuffixTracer from './SuffixTracer.jsx'
import { SuffixesVisual, TrieToTreeVisual, LcpVisual, WorkVisual } from './SuffixVisuals.jsx'
import { WORD, lcpArray, suffixArray } from './suffixData.js'

const SA = suffixArray(WORD)
const LCP = lcpArray(WORD, SA)

// The sorted suffixes of banana, with where each one starts.
const sorted = SA.map((start, k) => ({ rank: k, start, text: WORD.slice(start), lcp: LCP[k] }))

const versus = [
  { prop: 'Getting the text ready', scan: 'nothing to do', array: 'sort the suffixes: O(n log n) with a good algorithm', tree: 'O(n) with a clever algorithm (Ukkonen’s), but fiddly to write' },
  { prop: 'Does the pattern appear? (m letters)', scan: 'O(n × m) worst case, O(n + m) with KMP', array: 'O(m log n)', tree: 'O(m)' },
  { prop: 'List all k places', scan: 'scan again', array: 'O(m log n + k)', tree: 'O(m + k)' },
  { prop: 'Memory', scan: 'none extra', array: 'n numbers', tree: 'up to 2n nodes, several numbers each: many times the array' },
  { prop: 'Longest repeated piece', scan: 'O(n²) the simple way', array: 'largest number in the LCP list: O(n)', tree: 'deepest node with two or more leaves below it' },
  { prop: 'The text changes', scan: 'nothing to redo', array: 'rebuild', tree: 'rebuild' },
  { prop: 'Best when', scan: 'one or two searches', array: 'many searches, and memory matters', tree: 'many searches, and speed matters most' },
]

const costs = [
  { what: 'Search a suffix array (pattern of m letters, text of n)', time: 'O(m log n)', why: 'Binary search takes about log n steps, and each step compares up to m letters.' },
  { what: 'Search a suffix tree', time: 'O(m)', why: 'One step down per letter of the pattern, however long the text is.' },
  { what: 'List the k places a pattern appears', time: '+ O(k)', why: 'The matches are side by side in the array and in the leaves under one node, so they are simply read off.' },
  { what: 'Build a suffix array', time: 'O(n log n) or O(n)', why: 'Clever algorithms (prefix doubling, SA-IS) avoid comparing whole suffixes. The one-line sorted() version is simpler but slower, and copies every suffix while it sorts.' },
  { what: 'Build the LCP list', time: 'O(n)', why: 'Kasai’s algorithm does it in one pass. The simple version on this page compares each pair of neighbours from scratch, which is slower in the worst case.' },
  { what: 'Build a suffix tree', time: 'O(n)', why: 'Ukkonen’s algorithm. Putting every suffix into a trie one letter at a time is O(n²).' },
  { what: 'Memory', time: 'O(n)', why: 'Both are proportional to the text, but a suffix tree needs far more memory per letter than a list of numbers.' },
]

const examples = [
  {
    id: 'copy',
    prompt: 'Writing out every suffix of a word of n letters as its own string: [s[i:] for i in range(n)]',
    time: 'O(n²)',
    space: 'O(n²)',
    explanation: 'The suffixes have n, n − 1, n − 2 … 1 letters, which add up to about n²/2 letters. That is why the suffix array keeps only the starting numbers.',
  },
  {
    id: 'array-search',
    prompt: 'Searching a suffix array of n letters for a pattern of 3 letters, with binary search.',
    time: 'O(log n)',
    space: 'O(1)',
    explanation: 'About log n halvings, and each one compares just 3 letters, which is a constant. Only a few variables are kept.',
  },
  {
    id: 'tree-search',
    prompt: 'Walking down a suffix tree to check whether a pattern of n letters appears in the text.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One step per letter of the pattern, however long the text is. It only needs to remember where it is.',
  },
  {
    id: 'scan',
    prompt: "Scanning a text of n letters, checking s[i:i + 3] == 'ana' at every position i.",
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One check per position, and each check looks at only 3 letters. Nothing is stored.',
  },
  {
    id: 'build-fast',
    prompt: 'Building a suffix array of n letters with a fast algorithm such as SA-IS.',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'It never compares whole suffixes, and the result is a list of n numbers.',
  },
  {
    id: 'longest-repeat',
    prompt: 'Finding the longest repeated piece of text when you already have the LCP list of n numbers: max(lcp)',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'One pass over the list, keeping the biggest number so far.',
  },
  {
    id: 'trie-naive',
    prompt: 'Building a trie of all n suffixes by inserting every letter of every suffix.',
    time: 'O(n²)',
    space: 'O(n²)',
    explanation: 'About n²/2 letters get inserted, and nearly every one can need a node of its own. Squashing the single-child chains later is what makes a suffix tree small.',
  },
  {
    id: 'lookup',
    prompt: 'Reading where the k-th smallest suffix starts: sa[k]',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'It is one lookup in a list.',
  },
]

function SuffixTrees() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Advanced Data Structures</p>
      <h2>Suffix Trees and Arrays</h2>
      <p>
        Here is a question you may need to answer thousands of times:{' '}
        <em>does the word &ldquo;ana&rdquo; appear in &ldquo;banana&rdquo;, and
        where?</em> For a short word, just look. For a genome, a book or a pile
        of log files that never changes, looking at every letter each time is too
        slow. So prepare the text once. A <strong>suffix array</strong> and a{' '}
        <strong>suffix tree</strong> both do it by remembering{' '}
        <strong>every suffix of the text</strong>, in order.
      </p>

      <section className="notebook-section">
        <h3>See It First</h3>
        <SuffixesVisual />
      </section>

      <section className="notebook-section">
        <h3>The Whole Page, on One Page</h3>
        <p>A quick map of everything below. Skim it now, or come back to it for a refresher.</p>
        <div className="paper-page">
          <p className="paper-title">Suffix Trees and Arrays &middot; Recap</p>
          <div className="paper-cols">
            <div className="paper-block">
              <h4>1. What it is</h4>
              <ul>
                <li>All the <strong>suffixes</strong> of a text, in dictionary order.</li>
                <li>Kept as a list of numbers (<strong>array</strong>) or as a squashed trie (<strong>tree</strong>).</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>2. The problem it solves</h4>
              <ul>
                <li>Search the <strong>same text</strong> again and again.</li>
                <li>Does it contain a pattern? Where? How often? What is repeated?</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>3. The core idea</h4>
              <ul>
                <li>Every substring is the <strong>start of some suffix</strong>.</li>
                <li>Sorted, the suffixes that start the same sit <strong>side by side</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>4. Suffix array</h4>
              <ul>
                <li>Where each suffix starts, in sorted order.</li>
                <li>Search: <strong>binary search</strong>.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>5. LCP list</h4>
              <ul>
                <li>Letters each suffix shares with the one above it.</li>
                <li>Biggest number = longest repeated piece.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>6. Suffix tree</h4>
              <ul>
                <li>A trie of all suffixes, ending in <code>$</code>, with single-child chains squashed.</li>
                <li>Search: <strong>walk down</strong>, one letter at a time.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>7. Costs at a glance</h4>
              <ul>
                <li>Array search: <code>O(m log n)</code>.</li>
                <li>Tree search: <code>O(m)</code>.</li>
                <li>Build: <code>O(n)</code> with clever algorithms.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>8. What you trade away</h4>
              <ul>
                <li>Hard to build well by hand.</li>
                <li>A tree takes much more memory than an array.</li>
                <li>If the text changes, rebuild.</li>
              </ul>
            </div>

            <div className="paper-block">
              <h4>9. Watch out for</h4>
              <ul>
                <li>Forgetting the <code>$</code> in a tree.</li>
                <li>Comparing the <strong>whole</strong> suffix instead of its first <code>m</code> letters.</li>
                <li>A suffix is <code>s[i:]</code>: the number <code>i</code> names it.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="notebook-section">
        <h3>The Idea in Four Steps</h3>
        <ol>
          <li><strong>Every substring starts somewhere.</strong> If &ldquo;ana&rdquo; appears in banana at position 1, then the suffix that starts at 1, &ldquo;anana&rdquo;, begins with &ldquo;ana&rdquo;. So <em>finding a substring is finding a suffix that starts with it</em>.</li>
          <li><strong>List every suffix.</strong> A word of <code>n</code> letters has <code>n</code> suffixes: <code>s[0:]</code>, <code>s[1:]</code>, <code>s[2:]</code> and so on.</li>
          <li><strong>Sort them.</strong> Suffixes that begin with the same letters end up next to each other, so all the matches for a pattern form <em>one block</em>.</li>
          <li><strong>Store them cleverly.</strong> Copying them all would take far too much memory, so keep either just their starting numbers (a suffix array), or a trie that shares their letters (a suffix tree).</li>
        </ol>
      </section>

      <section className="notebook-section">
        <h3>The Suffix Array</h3>
        <p>
          The suffix array is the simplest of the two: a list of the starting
          places of the suffixes, in the order the suffixes would sit in a
          dictionary. No letters are copied, because a number is enough to name a
          suffix. For banana it is <code>[{SA.join(', ')}]</code>.
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Row</th>
                <th>Starts at</th>
                <th>The suffix</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.rank}>
                  <td>{row.rank}</td>
                  <td><strong>{row.start}</strong></td>
                  <td><code>{row.text}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="code-block">
          <code>{`def suffix_array(s):
    return sorted(range(len(s)), key=lambda i: s[i:])

suffix_array("banana")      # [5, 3, 1, 0, 4, 2]`}</code>
        </div>
        <p>
          That one line sorts the numbers <code>0</code> to <code>n &minus; 1</code>{' '}
          by the suffix each one starts. It is fine for short words, but it copies
          every suffix while it sorts, so it needs about <code>n²</code> memory.
          Real code uses cleverer algorithms that take <code>O(n log n)</code> or
          even <code>O(n)</code> time.
        </p>
        <p>
          <strong>Searching</strong> uses the block idea. The suffixes that start
          with the pattern are side by side, so binary search finds where the
          block begins, and a second binary search finds where it ends. The
          numbers in between are every place the pattern appears. The tracer
          below runs exactly this.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The LCP List: What Neighbours Share</h3>
        <p>
          Once the suffixes are sorted, two neighbours often start with the same
          letters. The <strong>LCP list</strong> (longest common prefix) records
          how many, for each row and the one above it:
        </p>
        <LcpVisual />
        <div className="code-block">
          <code>{`def common_prefix(a, b):
    k = 0
    while k < len(a) and k < len(b) and a[k] == b[k]:
        k += 1
    return k

sa = suffix_array(s)
lcp = [0] + [common_prefix(s[sa[k - 1]:], s[sa[k]:]) for k in range(1, len(sa))]
# banana: [${LCP.join(', ')}]

best = max(range(len(lcp)), key=lambda k: lcp[k])
print(s[sa[best]:sa[best] + lcp[best]])      # ana`}</code>
        </div>
        <p>
          Two surprising answers fall out of it. The biggest number is the{' '}
          <strong>longest repeated piece</strong> of the text. And the number of{' '}
          <strong>different substrings</strong> is the number of all substrings
          counted by where they start, <code>n(n + 1) / 2</code>, minus the sum of
          the LCP list. For banana that is 21 &minus; 6 = 15.
        </p>
      </section>

      <section className="notebook-section">
        <h3>The Suffix Tree</h3>
        <p>
          A suffix tree keeps the same sorted suffixes, but in a trie (see the
          Trie page), so letters that suffixes share are stored only once.
          There is one catch: a suffix like &ldquo;a&rdquo; is also the{' '}
          <em>start</em> of &ldquo;ana&rdquo;. To make every suffix end at its
          own leaf, a special letter <code>$</code> is added to the end of the
          text.
        </p>
        <TrieToTreeVisual />
        <p>
          A tree with <code>n</code> leaves, in which every node that is not a
          leaf has at least two children, can never have more than{' '}
          <code>2n</code> nodes. That is what the squashing buys. Real
          implementations also avoid copying the letters of an edge: they store
          two numbers, the start and end of those letters in the text.
        </p>
        <p>
          <strong>Searching</strong> is the Trie page again: start at the root and
          follow the pattern down, one edge at a time. If the pattern is used up,
          every leaf below you is a place it appears. If it ends{' '}
          <em>inside</em> an edge, that is fine too.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Trace It Yourself</h3>
        <p>
          Both searches use the word <code>banana</code>. Press <strong>Play</strong>{' '}
          and watch the code, the rows or tree, and the variables change
          together. The tree is built from <code>banana$</code>, and its edges are
          stored in a dictionary keyed by the first letter of each label:
        </p>
        <div className="code-block">
          <code>{`class Node:
    def __init__(self):
        self.edges = {}       # first letter -> (label, child)
        self.start = None     # leaves only: where this suffix starts

def leaves_below(node):
    if not node.edges:
        return [node.start]
    found = []
    for label, child in node.edges.values():
        found += leaves_below(child)
    return found`}</code>
        </div>
        <SuffixTracer />
        <p>
          In <strong>Suffix array: binary search</strong>, try{' '}
          <strong>&ldquo;ana&rdquo;</strong>: the first search finds the top of the
          block, the second finds the bottom, and the green rows are the two
          matches, side by side. Then <strong>&ldquo;nab&rdquo;</strong>: the
          block is empty, so first and lo end up on the same row. In{' '}
          <strong>Suffix tree: walk down</strong>, the thick line is the way
          the search came. Try <strong>&ldquo;ban&rdquo;</strong>: the pattern
          ends in the middle of the edge <code>banana$</code>, which still counts
          as a match. And <strong>&ldquo;a&rdquo;</strong> stops at a node with
          three leaves below it, so three matches.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Scan, Array or Tree?</h3>
        <p>
          For one search, <code>pattern in text</code> is the right answer and
          none of this is worth it. The structures pay off when the text stays
          the same and the questions keep coming:
        </p>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Scan the text</th>
                <th>Suffix array</th>
                <th>Suffix tree</th>
              </tr>
            </thead>
            <tbody>
              {versus.map((row) => (
                <tr key={row.prop}>
                  <td><strong>{row.prop}</strong></td>
                  <td>{row.scan}</td>
                  <td>{row.array}</td>
                  <td>{row.tree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Suffix Trees and Arrays in One Breath</h3>
        <div className="definition">
          A suffix array lists where every suffix of a text starts, in the order
          the suffixes sort. A suffix tree is a trie of all the suffixes, with
          chains of single-child nodes squashed into edges. Because every
          substring is the start of some suffix, either one answers &ldquo;does
          this pattern appear, and where?&rdquo; in time that depends on the
          pattern, not on the length of the text.
        </div>
      </section>

      <section className="notebook-section">
        <h3>What It Costs</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              A scan pays for the length of the text. The array pays for the
              pattern times the number of halvings, which is only about 20 even
              for a million letters. The tree pays for the pattern alone.
            </p>
            <p>
              <code>O(m log n)</code> to search the array, <code>O(m)</code> to
              search the tree, and <code>O(n)</code> memory for both.
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
          <strong>The text stays the same and you search it many times.</strong> A
          genome, a book, a big log file, a dictionary of text snippets.
        </p>
        <p>
          <strong>You want to know about repeats.</strong> The longest repeated
          piece, how many different substrings there are, or the longest piece two
          texts share (join them with a separator and use the LCP list).
        </p>
        <p>
          <strong>You want the cheapest memory.</strong> Use the array. A suffix
          tree is faster to search but several times bigger.
        </p>
        <p>
          <strong>You only search once or twice.</strong> Just use{' '}
          <code>in</code> or <code>find</code>.
        </p>
        <p>
          <strong>The text keeps changing.</strong> Both have to be rebuilt.
        </p>
        <p>
          <strong>You are matching whole words by their first letters.</strong> A
          trie of the words (autocomplete) is simpler.
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

export default SuffixTrees
