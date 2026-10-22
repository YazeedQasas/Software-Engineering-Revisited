import {
  BruteVisual,
  StackVisual,
  DivideVisual,
  GreedyVisual,
  BacktrackVisual,
  TableVisual,
  PivotVisual,
  PointersVisual,
  WindowVisual,
  ChaseVisual,
  MergeVisual,
  CyclicVisual,
  HeapsVisual,
  KthVisual,
  ThreadsVisual,
} from './ProblemSolvingIso.jsx'
import IslandCounter from './IslandCounter.jsx'

// The small isometric picture for each technique.
const visuals = {
  brute: BruteVisual,
  stack: StackVisual,
  divide: DivideVisual,
  greedy: GreedyVisual,
  backtrack: BacktrackVisual,
  table: TableVisual,
  pivot: PivotVisual,
  pointers: PointersVisual,
  window: WindowVisual,
  chase: ChaseVisual,
  merge: MergeVisual,
  cyclic: CyclicVisual,
  heaps: HeapsVisual,
  kth: KthVisual,
  islands: IslandCounter,
  threads: ThreadsVisual,
}

const techniques = [
  {
    group: 'General strategies',
    items: [
      {
        name: 'Brute Force',
        what: 'Try every possible answer and keep the one that works.',
        how: 'List every candidate (every pair, every ordering, every subset), test each one against the rule, and return the first that passes, or the best of those that do. It needs no cleverness, only a loop, or nested loops, over all the possibilities. It is always correct, but the number of candidates usually grows fast.',
        use: 'Small inputs, and as the first, obviously correct version to test faster ones against. Checking every pair in a list is O(n²).',
        visual: 'brute',
        code: `def pair_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):      # every pair, once
            if nums[i] + nums[j] == target:
                return i, j
    return None`,
      },
      {
        name: 'Recursion',
        what: 'A function that solves a problem by calling itself on a smaller version of the same problem.',
        how: 'It has two parts. The base case is the smallest version of the problem, answered directly, and it is what stops the calls. The recursive case shrinks the problem, calls the function on the smaller version, and uses that answer to build its own. Each call waits until the smaller call returns: factorial(5) is 5 × factorial(4), which is 4 × factorial(3), and so on down to factorial(1).',
        use: 'Walking a tree or nested data, factorial, and anything that is naturally defined in terms of a smaller copy of itself.',
        visual: 'stack',
        code: `def factorial(n):
    if n <= 1:                         # base case: stop here
        return 1
    return n * factorial(n - 1)        # a smaller copy of the problem`,
      },
      {
        name: 'Divide and Conquer',
        what: 'Split the problem into independent pieces, solve each piece, then combine the answers.',
        how: 'Three steps. Divide the input, usually into two halves. Conquer each half, by the same method, until the pieces are trivial. Combine the answers of the pieces into the answer for the whole. Halving gives about log n levels, and each level does about n work in total, which is where O(n log n) comes from.',
        use: 'Merge sort, quick sort and binary search.',
        visual: 'divide',
        code: `def largest(nums):
    if len(nums) == 1:
        return nums[0]
    mid = len(nums) // 2
    return max(largest(nums[:mid]), largest(nums[mid:]))     # split, solve, combine`,
      },
      {
        name: 'Greedy Algorithms',
        what: 'At each step take the option that looks best right now and never go back.',
        how: 'Put the options in order of how good they look, often by sorting them, then go through them and take each one that still fits, without ever reconsidering. It is very fast, but it is only correct when the best-looking choice can never make the final answer worse, so you need a reason, or tests on small cases. With the coins 25, 10, 5 and 1 it works. With the coins 1, 3 and 4, making 6 greedily gives 4 + 1 + 1, but 3 + 3 is better.',
        use: 'Making change with standard coins, Kruskal and Prim for minimum spanning trees, and scheduling the most meetings in one room.',
        visual: 'greedy',
        code: `def make_change(amount, coins):          # coins listed biggest first
    result = []
    for coin in coins:
        while amount >= coin:
            amount -= coin
            result.append(coin)
    return result

make_change(68, (25, 10, 5, 1))     # [25, 25, 10, 5, 1, 1, 1]  (the best)
make_change(6, (4, 3, 1))           # [4, 1, 1]  (but 3 + 3 is better)`,
      },
      {
        name: 'Backtracking',
        what: 'Build an answer step by step, and the moment a choice cannot lead to a valid answer, undo it and try the next one.',
        how: 'Choose an option for the next step and check it against the rules. If it is allowed, move on to the step after. If a later step finds that no option is allowed, go back, undo the last choice, and try its next option. Dead ends are abandoned as soon as they appear, so most of the possible answers are never built. The worst case is still exponential, because if little can be pruned, nearly every possibility is visited.',
        use: 'Sudoku, N-Queens, and generating permutations, combinations and subsets.',
        visual: 'backtrack',
        code: `def queens(n, cols=()):               # cols[row] = column of that row's queen
    row = len(cols)
    if row == n:
        return list(cols)
    for col in range(n):
        if all(col != c and abs(col - c) != row - r for r, c in enumerate(cols)):
            found = queens(n, cols + (col,))      # choose, then explore
            if found:
                return found
    # no column worked: return None, and the caller tries its next column

queens(4)     # [1, 3, 0, 2]`,
      },
      {
        name: 'Dynamic Programming',
        what: 'Break a problem into overlapping sub-problems, solve each once, and store the result so it is never recomputed.',
        how: 'Start with the recursive solution and notice that the same sub-problem gets solved again and again. Then remember each answer, either the first time it is worked out (memoisation, using a dictionary or a cache), or by filling a table from the smallest sub-problems upwards (bottom-up). Every distinct sub-problem is now solved once. Fibonacci of 40 goes from 331 million recursive calls to about 80.',
        use: 'Fibonacci, the knapsack problem, longest common subsequence, and edit distance.',
        visual: 'table',
        code: `def fib(n):
    table = [0, 1]
    for i in range(2, n + 1):
        table.append(table[i - 1] + table[i - 2])     # both already in the list
    return table[n]

fib(40)     # 102334155. (The recursive version with @lru_cache does the same.)`,
      },
      {
        name: 'Randomised Algorithms',
        what: 'Use random choices inside the algorithm.',
        how: 'At a point where a fixed rule could be defeated by an unlucky input, choose at random instead. Quick sort with a random pivot is the classic case: no input can reliably force the slow O(n²) behaviour, so the running time is good on average. The result is either correct every time, with an average running time, or correct with high probability.',
        use: 'Picking a random pivot in quick sort, hashing, shuffling and sampling.',
        visual: 'pivot',
        code: `import random

def quick_sort(nums):
    if len(nums) <= 1:
        return nums
    pivot = random.choice(nums)            # a random pivot
    small = [x for x in nums if x < pivot]
    same = [x for x in nums if x == pivot]
    big = [x for x in nums if x > pivot]
    return quick_sort(small) + same + quick_sort(big)`,
      },
    ],
  },
  {
    group: 'Array and list patterns',
    items: [
      {
        name: 'Two Pointer Technique',
        what: 'Keep two indexes into a list and move them according to a rule, often one from each end moving inward.',
        how: 'Start one pointer at each end of a sorted list and look at the pair. If their sum is too small, move the left pointer right to get a bigger number. If it is too big, move the right pointer left. Each move rules out one number for good, so one pass is enough: O(n) instead of the O(n²) of trying every pair.',
        use: 'Finding a pair that adds up to a target, checking a palindrome, and merging two sorted lists.',
        visual: 'pointers',
        code: `def pair_sum(nums, target):                 # nums is sorted
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return left, right
        if total < target:
            left += 1                      # too small: drop the smallest
        else:
            right -= 1                     # too big: drop the biggest
    return None`,
      },
      {
        name: 'Sliding Window Technique',
        what: 'Keep a window over a contiguous part of the list, then slide it forward by adding one item on the right and dropping one on the left.',
        how: 'Work out the answer for the first window. Then slide one step: add the new item on the right, subtract the item that left on the left, and update the answer from the previous one instead of starting again. Each slide costs a constant amount, so the whole pass is O(n). For problems where the window size is not fixed, the window grows on the right and shrinks on the left as the rule requires.',
        use: 'The biggest sum of k consecutive items, and the longest substring without repeated letters.',
        visual: 'window',
        code: `def best_window(nums, k):
    window = sum(nums[:k])
    best = window
    for right in range(k, len(nums)):
        window += nums[right] - nums[right - k]      # add the new, drop the old
        best = max(best, window)
    return best`,
      },
      {
        name: 'Fast and Slow Pointers',
        what: 'Two pointers moving through the same sequence at different speeds, such as one step versus two.',
        how: 'Move the slow pointer one step and the fast pointer two steps at a time. If the sequence has a loop, the fast pointer enters it and eventually catches the slow one from behind, so they meet. If there is no loop, the fast pointer reaches the end. To find the middle, stop when the fast pointer reaches the end: the slow pointer is at the middle. It takes O(n) time and only O(1) memory.',
        use: 'Detecting a cycle in a linked list, and finding the middle node.',
        visual: 'chase',
        code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next              # one step
        fast = fast.next.next         # two steps
        if slow is fast:
            return True
    return False`,
      },
      {
        name: 'Merge Intervals',
        what: 'Sort ranges by their start, then walk through them merging any that overlap.',
        how: 'Sort the ranges by start. Keep the range being built. For each next range, if it starts at or before the end of the current one, they overlap, so stretch the current one to end at whichever end is later. Otherwise the current one is finished, and the next range starts a new one. After the sort it is a single pass, so the whole thing is O(n log n).',
        use: 'Merging meeting times, finding free slots in a calendar, and combining overlapping ranges.',
        visual: 'merge',
        code: `def merge(intervals):
    intervals.sort()
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:                  # overlaps the last one
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
      },
      {
        name: 'Cyclic Sort',
        what: 'When values are in a known range like 1 to n, put each value directly at its own index by swapping.',
        how: 'Look at the item at position i. If its value belongs at some other position j, and that position does not already hold it, swap them. Repeat until the item at position i is where it belongs or has no place, then move on to the next position. Every swap puts one value in its final place, so it is O(n) with no extra memory. Afterwards, the positions that hold the wrong value show which numbers are missing or duplicated.',
        use: 'Finding the missing number and finding duplicates.',
        visual: 'cyclic',
        code: `def missing_number(nums):               # the numbers 0 to n, with one missing
    i = 0
    while i < len(nums):
        j = nums[i]                     # the number j belongs at position j
        if j < len(nums) and nums[i] != nums[j]:
            nums[i], nums[j] = nums[j], nums[i]
        else:
            i += 1
    for i in range(len(nums)):
        if nums[i] != i:
            return i
    return len(nums)`,
      },
    ],
  },
  {
    group: 'Heap, search and grid patterns',
    items: [
      {
        name: 'Two Heaps',
        what: 'Keep a max-heap for the smaller half of the numbers and a min-heap for the larger half.',
        how: 'Put each new number into the right heap, then rebalance so that the two heaps differ in size by at most one. The top of each heap is a middle value: with an odd count the median is the top of the bigger heap, and with an even count it is the average of the two tops. Adding a number costs O(log n), and reading the median is O(1).',
        use: 'The running median of a stream of numbers.',
        visual: 'heaps',
        code: `import heapq

def add(small, large, x):               # small: max-heap (negatives), large: min-heap
    heapq.heappush(small, -x)
    heapq.heappush(large, -heapq.heappop(small))
    if len(large) > len(small):
        heapq.heappush(small, -heapq.heappop(large))

def median(small, large):
    return -small[0] if len(small) > len(large) else (-small[0] + large[0]) / 2`,
      },
      {
        name: 'Kth Element',
        what: 'Use a heap of size k (or quickselect) to find the k-th smallest or largest item without fully sorting.',
        how: 'To find the k-th largest, keep a min-heap holding the k biggest numbers seen so far. For each new number, if it is bigger than the smallest number in the heap, replace that smallest one with it. When the numbers run out, the top of the heap is the k-th largest. It costs O(n log k) instead of the O(n log n) of sorting, and it works on a stream.',
        use: 'The top 10 most frequent words, and the k-th largest number.',
        visual: 'kth',
        code: `import heapq

def kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)                  # a min-heap of the k biggest so far
    for x in nums[k:]:
        if x > heap[0]:                  # beats the smallest of the k biggest
            heapq.heapreplace(heap, x)
    return heap[0]`,
      },
      {
        name: 'Island Traversal',
        what: 'Treat a grid as a graph and run BFS or DFS from each unvisited land cell, marking everything connected to it.',
        how: 'Scan the grid cell by cell. When you reach a land cell that has not been visited, count a new region and flood fill from it: use BFS or DFS to visit every neighbouring land cell (up, down, left and right), marking each one as visited. Marked cells are skipped by the scan. Each cell is visited a constant number of times, so it takes O(rows × columns). The code below uses a recursive depth-first fill that tries the neighbours down, up, right, then left.',
        use: 'Counting islands, flood fill (the paint bucket in a drawing program), and finding the biggest connected region.',
        visual: 'islands',
        code: `def count_islands(grid):
    seen, count = set(), 0

    def fill(r, c):                      # flood fill one island
        if not (0 <= r < len(grid) and 0 <= c < len(grid[0])) or grid[r][c] != 1 or (r, c) in seen:
            return
        seen.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            fill(r + dr, c + dc)

    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == 1 and (r, c) not in seen:
                count += 1               # a new island
                fill(r, c)
    return count`,
      },
      {
        name: 'Multi-threaded',
        what: 'Split the work across several threads or processes that run at the same time.',
        how: 'Divide the job into independent tasks and hand them to a pool of workers that run together. In Python, threads help when tasks spend their time waiting, for the network or the disk, because the waits overlap. Processes help with heavy computing, because each one runs on its own core. The danger is workers that share data, which is covered just below.',
        risk: {
          title: 'The catch: race conditions.',
          text: 'If two threads read and change the same piece of memory at the same time, the result depends on which one happens to go first. This is called a race condition. Say two threads each run counter += 1. That is really three steps: read the number, add 1, write it back. If both threads read 5 before either one writes, both write 6, and one of the two additions is lost. The bug depends on timing, so it can hide for a long time and then appear at random, which makes it hard to find. (In regular Python this particular case is rare, because of how the interpreter switches between threads, but it is still possible, and in many other languages it is easy to trigger.)',
          waysTitle: 'Three ways to prevent it:',
          ways: [
            { name: 'Mutex / locking', text: 'A lock lets only one thread at a time into the part of the code that touches the shared data. A thread that arrives while the lock is taken waits until it is released. It works for any kind of data, but waiting slows things down, and a lock that is never released, or two threads that each wait for a lock the other one holds (a deadlock), can freeze the program.' },
            { name: 'Atomic operations', text: 'An atomic operation happens as one indivisible step, so no other thread can ever see it half finished. An atomic increment cannot lose an update. No lock is needed and it is fast, but it only covers simple operations on a single value. In Python, counter += 1 is not atomic. A few built-in operations, such as list.append, are atomic in CPython, and queue.Queue is built to be shared safely between threads.' },
            { name: 'Data isolation', text: 'Do not share the data at all. Give each thread its own copy, or its own piece of the work, and combine the results at the end. With nothing shared there is nothing to race on and no locks to get wrong. In Python a thread can have its own variables with threading.local(), a pool can hand each worker its own chunk of the input and collect the returned results, and separate processes always have separate memory.' },
          ],
          codeTitle: 'Preventing the lost update with a lock:',
          code: `import threading

counter = 0
lock = threading.Lock()

def add_many():
    global counter
    for _ in range(100_000):
        with lock:                 # only one thread at a time in here
            counter += 1

threads = [threading.Thread(target=add_many) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(counter)     # 400000, every time`,
        },
        use: 'Downloading many files at once, and processing chunks of a large dataset in parallel.',
        visual: 'threads',
        code: `from concurrent.futures import ThreadPoolExecutor
import time

def download(name):
    time.sleep(1)                        # pretend to wait for the network
    return name

with ThreadPoolExecutor() as pool:
    results = list(pool.map(download, ["a", "b", "c", "d"]))
# about 1 second in all, not 4: the four waits overlap`,
      },
    ],
  },
]

function ProblemSolving() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Problem Solving</p>
      <h2>Problem Solving Techniques</h2>
      <p>
        Everything before this was a tool: a data structure or an algorithm. These
        are the <strong>approaches</strong> for choosing and combining those tools.
        Each one says what it is, how it works and where you will usually see it, with a small picture and a short piece of code.
      </p>

      {techniques.map((section) => (
        <section className="notebook-section" key={section.group}>
          <h3>{section.group}</h3>
          {section.items.map((t) => {
            const Visual = visuals[t.visual]
            return (
              <div className="topic-card" key={t.name}>
                <h4>{t.name}</h4>
                <p>
                  <strong>What it is:</strong> {t.what}
                </p>
                <p>
                  <strong>How it works:</strong> {t.how}
                </p>
                {t.risk && (
                  <>
                    <p>
                      <strong>{t.risk.title}</strong> {t.risk.text}
                    </p>
                    <p>
                      <strong>{t.risk.waysTitle}</strong>
                    </p>
                    <ul>
                      {t.risk.ways.map((way) => (
                        <li key={way.name}>
                          <strong>{way.name}:</strong> {way.text}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p>
                  <strong>Where it is usually used:</strong> {t.use}
                </p>
                <Visual />
                <div className="code-block">
                  <code>{t.code}</code>
                </div>
                {t.risk && (
                  <>
                    <p>
                      <strong>{t.risk.codeTitle}</strong>
                    </p>
                    <div className="code-block">
                      <code>{t.risk.code}</code>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </section>
      ))}
    </article>
  )
}

export default ProblemSolving
