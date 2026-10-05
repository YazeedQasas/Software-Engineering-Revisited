import ComplexityQuiz from '../../components/ComplexityQuiz.jsx'
import {
  StringBasicsVisual,
  ConcatenationVisual,
  PalindromeVisual,
  AnagramVisual,
  SubstringSearchVisual,
} from './StringsVisuals.jsx'

const operations = [
  { op: 's[i]', time: 'O(1)', why: 'Same contiguous-memory indexing as a list.' },
  { op: 'len(s)', time: 'O(1)', why: 'Length is tracked, not counted.' },
  { op: 's[i:j]', time: 'O(j − i)', why: 'Copies the slice into a brand new string.' },
  { op: 's + s2', time: 'O(n + m)', why: 'Allocates a new string and copies both into it.' },
  { op: 's * k', time: 'O(n × k)', why: 'Copies the string k times into a new one.' },
  { op: 's in s2 / s2.find(s)', time: 'O(n × m) worst case', why: 'Naive substring search checks every starting position.' },
  { op: "''.join(pieces)", time: 'O(n)', why: 'One pass over the total character count.' },
  { op: 's.split()', time: 'O(n)', why: 'One pass to find separators.' },
  { op: 's.lower() / s.upper()', time: 'O(n)', why: 'New string, one pass.' },
  { op: 's.strip()', time: 'O(n)', why: 'New string, one pass.' },
  { op: 'sorted(s)', time: 'O(n log n)', why: 'Returns a sorted list of characters.' },
  { op: 's[::-1]', time: 'O(n)', why: 'Builds the reversed string, one pass.' },
]

const examples = [
  {
    id: 'read-char',
    prompt: 's[5] on a string of n characters.',
    time: 'O(1)',
    space: 'O(1)',
    explanation: 'Same direct indexing as a list — no scanning required.',
  },
  {
    id: 'naive-concat',
    prompt: 'Building an n-character string with s += char in a loop, n times.',
    time: 'O(n²)',
    space: 'O(n)',
    explanation: 'Each += copies everything accumulated so far — 1 + 2 + 3 + ... + n copies, which is O(n²) total.',
  },
  {
    id: 'join-build',
    prompt: 'Building an n-character string by appending to a list, then \'\'.join(pieces).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Appends are O(1) amortized, and join does one single O(n) pass at the end.',
  },
  {
    id: 'palindrome-check',
    prompt: 'Checking whether an n-character string is a palindrome with two pointers.',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Each step moves both pointers inward once — no extra memory needed.',
  },
  {
    id: 'anagram-check',
    prompt: 'Checking if two n-character strings are anagrams with Counter(a) == Counter(b).',
    time: 'O(n)',
    space: 'O(n)',
    explanation: 'Building each frequency map is one O(n) pass; comparing them costs O(n) more.',
  },
  {
    id: 'substring-worst',
    prompt: 'Naive substring search where both the haystack and the needle have length n (worst case).',
    time: 'O(n²)',
    space: 'O(1)',
    explanation: 'Up to n starting positions, each comparing up to n characters.',
  },
  {
    id: 'sort-chars',
    prompt: 'sorted(s) on an n-character string.',
    time: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Sorting cost, plus a new n-length list to hold the sorted characters.',
  },
  {
    id: 'char-membership',
    prompt: 'Checking if a single character exists in a string of n characters (c in s).',
    time: 'O(n)',
    space: 'O(1)',
    explanation: 'Worst case, every character gets checked once; no extra memory needed.',
  },
]

function Strings() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Strings</h2>
      <p>
        Let&rsquo;s keep building the same way &mdash; one idea at a time,
        grounded in real Python. Strings share a lot of DNA with the arrays
        we just covered: same contiguous-memory indexing, same O(1) access.
        But one property changes everything about how you should write
        code that touches them: they&rsquo;re immutable. That single fact
        drives almost every performance question you&rsquo;ll get asked
        about strings.
      </p>

      <section className="notebook-section">
        <h3>Strings Are Arrays, With One Big Catch</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Indexing and slicing work exactly like they did for a list
              &mdash; <code>s[0]</code> is a direct address calculation,{' '}
              <code>O(1)</code>, no matter how long the string is.
            </p>
            <p>
              The catch: a string cannot be changed in place. Not a
              character, not a slice, nothing. It&rsquo;s Python&rsquo;s
              immutable sequence type &mdash; exactly like a tuple is to a
              list. And just like a tuple, that immutability is what makes
              a string <strong>hashable</strong>: it&rsquo;s exactly why you
              can use a string as a dictionary key.
            </p>
          </div>
          <StringBasicsVisual />
        </div>
        <div className="code-block">
          <code>{`s = "hello"
s[0]        # 'h'
s[0] = 'H'  # TypeError: 'str' object does not support item assignment

d = {"apple": 3, "banana": 5}   # fine -- strings are hashable`}</code>
        </div>
      </section>

      <section className="notebook-section">
        <h3>Building Strings Efficiently</h3>
        <div className="concept-row">
          <div className="concept-text">
            <p>
              Here&rsquo;s where immutability bites you if you&rsquo;re not
              careful. Every time you write <code>s = s + "x"</code>,
              Python can&rsquo;t just tack <code>"x"</code> onto the end
              &mdash; strings are frozen. It allocates a brand new string
              the right size and copies the old contents in, plus the new
              character. Do that in a loop and you&rsquo;re re-copying
              everything accumulated so far, every single time.
            </p>
            <p>
              Notice this is different from <code>list.append()</code>,
              which gets to reuse spare capacity most of the time. A string
              has no spare capacity to reuse &mdash; it&rsquo;s immutable,
              so every concatenation is a fresh full copy. There&rsquo;s no
              amortization here.
            </p>
          </div>
          <ConcatenationVisual />
        </div>
        <div className="code-block">
          <code>{`# Naive -- O(n^2) in the worst case
result = ""
for char in some_n_char_string:
    result += char   # copies everything accumulated so far, every time
# 1 + 2 + 3 + ... + n copies = O(n^2) total

# Efficient -- O(n) total
pieces = []
for char in some_n_char_string:
    pieces.append(char)    # O(1) amortized, just like any list append
result = ''.join(pieces)    # O(n), one single copy at the end`}</code>
        </div>
        <div className="definition">
          In short: collect pieces in a list, join once at the end. Never
          build a string with += inside a loop.
        </div>
        <p>
          Worth untangling: the naive loop is <code>O(n&sup2;)</code>{' '}
          <strong>time</strong> but only <code>O(n)</code>{' '}
          <strong>space</strong>, and those aren&rsquo;t the same question.
          At each step the old string becomes garbage the instant{' '}
          <code>result</code> is rebound to the new one, so it&rsquo;s freed
          &mdash; the strings from early iterations don&rsquo;t pile up in
          memory, they come and go. What never goes away is the{' '}
          <em>time</em> already spent copying them, which is why 1 + 2 +
          3 + ... + n copies still adds up to <code>O(n&sup2;)</code>. Same
          auxiliary-space idea as <code>insert</code>/<code>pop</code> back
          in Arrays: peak memory at any one moment, not a running total of
          everything ever allocated.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Common String Problems</h3>
        <p>
          Three shapes come up constantly. Two of them reuse patterns you
          already know from Arrays &mdash; you&rsquo;re not learning new
          tools here, just pointing familiar ones at strings.
        </p>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Palindromes</h4>
            <p>
              A palindrome reads the same forwards and backwards &mdash;{' '}
              &ldquo;racecar&rdquo;, &ldquo;level&rdquo;. You&rsquo;ve
              already met the tool for this: two pointers. Start one at
              each end, walk them toward the middle, and stop the moment
              two characters don&rsquo;t match.
            </p>
          </div>
          <PalindromeVisual />
        </div>
        <div className="code-block">
          <code>{`def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`}</code>
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Anagrams</h4>
            <p>
              Two strings are anagrams if one is a rearrangement of the
              other&rsquo;s characters &mdash; &ldquo;listen&rdquo; and{' '}
              &ldquo;silent&rdquo;. Sorting both and comparing works (
              <code>O(n log n)</code>), but counting how many times each
              character appears is faster: build a frequency map for each
              string and compare them.
            </p>
          </div>
          <AnagramVisual />
        </div>
        <div className="code-block">
          <code>{`from collections import Counter

def is_anagram(a, b):
    return Counter(a) == Counter(b)
# O(n) time: one pass to build each frequency map, one pass to compare them`}</code>
        </div>

        <div className="concept-row">
          <div className="concept-text">
            <h4>Substring Search</h4>
            <p>
              Does &ldquo;ell&rdquo; appear inside &ldquo;hello&rdquo;?
              Python&rsquo;s <code>in</code> and <code>.find()</code>{' '}
              handle this for you, but it&rsquo;s worth knowing what&rsquo;s
              happening underneath: the naive approach slides the shorter
              string across the longer one, checking for a match at every
              position.
            </p>
          </div>
          <SubstringSearchVisual />
        </div>
        <div className="code-block">
          <code>{`def naive_search(haystack, needle):
    n, m = len(haystack), len(needle)
    for i in range(n - m + 1):
        if haystack[i:i + m] == needle:
            return i
    return -1
# O(n x m) worst case: up to n starting positions, each comparing up to m characters`}</code>
        </div>
        <p>
          Python&rsquo;s actual <code>str.find()</code> and <code>in</code>{' '}
          use a smarter algorithm under the hood and perform much better in
          practice, but the naive version above is what you&rsquo;d be
          expected to produce by hand in an interview.
        </p>
      </section>

      <section className="notebook-section">
        <h3>Cheat Sheet</h3>
        <p>Common Python string operations, and what each one actually costs:</p>
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

export default Strings
