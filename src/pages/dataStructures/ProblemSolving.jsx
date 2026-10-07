const techniques = [
  {
    group: 'General strategies',
    items: [
      {
        name: 'Brute Force',
        what: 'Try every possible answer and keep the one that works.',
        does: 'Always correct and the easiest to write, but usually slow. Start here to get a working answer, then ask what work you are repeating.',
        use: 'Checking every pair in a list: O(n^2).',
      },
      {
        name: 'Recursion',
        what: 'A function that solves a problem by calling itself on a smaller version of the same problem, with a base case that stops it.',
        does: 'Turns problems that look like "smaller copies of themselves" (trees, nested data, factorial) into a few lines of code.',
        use: 'Walking a tree, computing factorial.',
      },
      {
        name: 'Divide and Conquer',
        what: 'Split the problem into independent pieces, solve each piece, then combine the answers.',
        does: 'Cuts the work down by halving the problem at each level, which is where O(n log n) comes from.',
        use: 'Merge sort, quick sort, binary search.',
      },
      {
        name: 'Greedy Algorithms',
        what: 'At each step take the option that looks best right now and never go back.',
        does: 'Very fast and simple. It only gives the best overall answer when the problem allows it, so you need to be able to argue why.',
        use: 'Making change with standard coins, Kruskal and Prim, scheduling the most meetings.',
      },
      {
        name: 'Backtracking',
        what: 'Build an answer step by step, and the moment a choice cannot lead to a valid answer, undo it and try the next one.',
        does: 'A smarter brute force: it prunes dead ends early instead of exploring them fully.',
        use: 'Sudoku, N-Queens, generating permutations.',
      },
      {
        name: 'Dynamic Programming',
        what: 'Break a problem into overlapping sub-problems, solve each once, and store the result so it is never recomputed.',
        does: 'Turns exponential recursion into polynomial time by remembering answers (memoization or a table).',
        use: 'Fibonacci, knapsack, longest common subsequence.',
      },
      {
        name: 'Randomised Algorithms',
        what: 'Use random choices inside the algorithm.',
        does: 'Avoids worst-case inputs and often simplifies the code. Results are either correct on average or correct with high probability.',
        use: 'Picking a random pivot in quick sort, hashing, shuffling.',
      },
    ],
  },
  {
    group: 'Array and list patterns',
    items: [
      {
        name: 'Two Pointer Technique',
        what: 'Keep two indexes into a list and move them according to a rule, often one from each end moving inward.',
        does: 'Replaces a nested loop (O(n^2)) with a single pass (O(n)), usually on sorted data.',
        use: 'Finding a pair that sums to a target, checking a palindrome.',
      },
      {
        name: 'Sliding Window Technique',
        what: 'Keep a window over a contiguous part of the list, then slide it forward by adding one item on the right and dropping one on the left.',
        does: 'Updates the answer for the new window from the previous one instead of recomputing, so it is O(n).',
        use: 'Max sum of k consecutive items, longest substring without repeats.',
      },
      {
        name: 'Fast and Slow Pointers',
        what: 'Two pointers moving through the same sequence at different speeds, such as one step versus two.',
        does: 'If there is a loop the fast pointer eventually catches the slow one; otherwise the slow pointer lands in the middle when the fast one hits the end.',
        use: 'Cycle detection in a linked list, finding the middle node.',
      },
      {
        name: 'Merge Intervals',
        what: 'Sort ranges by their start, then walk through them merging any that overlap.',
        does: 'Handles overlapping ranges in one pass after sorting.',
        use: 'Merging meeting times, finding free slots.',
      },
      {
        name: 'Cyclic Sort',
        what: 'When values are in a known range like 1 to n, put each value directly at its own index by swapping.',
        does: 'Sorts in O(n) with no extra memory, and the leftovers show you what is missing or duplicated.',
        use: 'Find the missing number, find duplicates.',
      },
    ],
  },
  {
    group: 'Heap, search and grid patterns',
    items: [
      {
        name: 'Two Heaps',
        what: 'Keep a max-heap for the smaller half of the numbers and a min-heap for the larger half.',
        does: 'The middle values are always on top of the heaps, so you can read the median in O(1).',
        use: 'Running median of a stream.',
      },
      {
        name: 'Kth Element',
        what: 'Use a heap of size k (or quickselect) to find the k-th smallest or largest item without fully sorting.',
        does: 'O(n log k) instead of O(n log n), and it works on streaming data.',
        use: 'Top 10 most frequent words, k-th largest number.',
      },
      {
        name: 'Island Traversal',
        what: 'Treat a grid as a graph and run BFS or DFS from each unvisited land cell, marking everything connected to it.',
        does: 'Finds connected regions in a matrix.',
        use: 'Counting islands, flood fill, biggest region.',
      },
      {
        name: 'Multi-threaded',
        what: 'Split the work across several threads or processes that run at the same time.',
        does: 'Speeds up work that can be done in independent parts, but adds the problems of shared data, locks and race conditions. In Python, threads help with waiting (network, files) while processes help with heavy computing.',
        use: 'Downloading many files at once, processing chunks of a big dataset in parallel.',
      },
    ],
  },
]

function ProblemSolving() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures &amp; Algorithms</p>
      <h2>Problem Solving Techniques</h2>
      <p>
        Everything before this was a tool (a data structure or an algorithm).
        These are the <strong>approaches</strong> for choosing and combining
        those tools. Each card below says what the technique is, what it does
        for you, and a classic place you will see it. You do not need to
        master them yet; the goal is to recognise the name and the idea.
      </p>

      {techniques.map((section) => (
        <section className="notebook-section" key={section.group}>
          <h3>{section.group}</h3>
          {section.items.map((t) => (
            <div className="topic-card" key={t.name}>
              <h4>{t.name}</h4>
              <p>
                <strong>What it is:</strong> {t.what}
              </p>
              <p>
                <strong>What it does:</strong> {t.does}
              </p>
              <p>
                <strong>Seen in:</strong> {t.use}
              </p>
            </div>
          ))}
        </section>
      ))}
    </article>
  )
}

export default ProblemSolving
