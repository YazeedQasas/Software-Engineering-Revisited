# Changelog

All notable changes to this project are logged here, newest first.

## [Unreleased]


## [0.2] - 2026-10-07

### Added

- **Time vs Space Complexity** page (Algorithmic Complexity), built around a
  repeatable four-step method that works the same way for time and for
  space: name the input, find what matters, count it in terms of n, then
  combine. Includes a one-page recap, the "running total vs. high-water
  mark" way of seeing time and space, a step-by-step worked example (two
  duplicate-check solutions), the call stack as hidden space, a table for
  reading complexity off common code shapes, time-space trade-offs, and
  how to talk about both in an interview. Includes two diagrams and an
  8-question self-quiz.
- **How to Calculate Complexity** page (Algorithmic Complexity), the
  practice side of the four-step method: a one-page recap, "count first,
  then squint" (with a table showing why constants and smaller terms
  fade), the rules in one place, worked examples for loops (sequential,
  nested, dependent and halving) and recursion (recursion trees, merge
  sort, naive Fibonacci), a table of hidden costs in Python built-ins, where
  the method bends (worst case, amortized, constants), and how to use it
  before and after writing code. Includes three diagrams and an 8-question
  self-quiz.
- **Common Runtimes** page (Algorithmic Complexity): all eight families
  from O(1) to O(n!), each with how it feels, a short Python example and
  why, a graph for each family (drawn against a dashed O(n) line, with real
  step counts), plus the "doubling test", a combined growth chart, a table of step counts at
  n = 10 to 1,000,000, a guide to reading the family off the code, what
  moves code between families, and how to use them as a budget. Includes
  a one-page recap and an 8-question self-quiz.

### Changed

- README rewritten for first-time readers and reviewers: what the project
  is, the curriculum and its status, how a finished page is structured,
  how to run it, and how the code is laid out.

## [0.1] - 2026-10-07

### Added

- **Arrays & Dynamic Arrays** page, rebuilt from scratch: a one-page recap
  up front, then what an array is, the problem it solves, the address-math
  trick behind O(1) access, a step-by-step walkthrough (reads, writes,
  appends, front inserts), an operations cost table with time and extra
  space, trade-offs against linked lists and hash tables, and when to use
  it. Includes two diagrams (memory layout and the shift on insert) and a
  5-question self-quiz.
- **Linked Lists** page, rebuilt to the same structure: a one-page recap up
  front, then what a linked list is, the problem it solves, the
  pointer-instead-of-address trick, a walkthrough (walking to a node,
  inserting, pushing to the front, deleting), the dummy node trick, singly
  vs. doubly vs. circular lists, an operations cost table with time and
  extra space, trade-offs against arrays and hash tables, and when to use
  one. Includes four diagrams and an 8-question self-quiz.
- **Queues** is now its own page, built to the same structure: a one-page
  recap up front, then what a queue is, why arrival order matters, the
  two-pointer (front and back) trick, a walkthrough with `collections.deque`
  and a from-scratch version, deques, circular queues and priority queues,
  building a queue from two stacks, an operations cost table with time and
  extra space, trade-offs against lists, stacks and priority queues, and
  when to use one. Includes two new diagrams and an 8-question self-quiz.
- **Stacks** is now its own page, built to the same structure: a one-page
  recap up front, then what a stack is, the problem of finding your way
  back, the one-open-end trick, a walkthrough with a bracket-matching
  diagram, the call stack, min-stacks and monotonic stacks, an operations
  cost table with time and extra space, trade-offs against lists, queues
  and recursion, and when to use one. Includes three diagrams and an
  8-question self-quiz.
- **Hash Tables (Maps & Sets)** page, rebuilt to the same structure and
  opening with a plain-language explanation of hashing (hash functions,
  fingerprints, why only immutable values can be hashed). Then a one-page
  recap, why searching is the problem, the hash-then-jump trick, a
  walkthrough with `dict` and `set`, collisions (chaining vs. open
  addressing), load factor and rehashing, an operations cost table with
  time and extra space, why it is average O(1) but worst-case O(n),
  trade-offs against lists and sorted structures, and when to use one.
  Includes two new diagrams and an 8-question self-quiz.
- Reusable "paper page" style for two-column recap sheets.

### Removed

- The earlier Arrays content (two pointers, sliding window and prefix sums)
  is gone from the page; it is in git history if it gets its own page.
- The combined Stacks & Queues page is gone, split into separate Stacks
  and Queues pages (its diagrams moved with them).
- Linked Lists no longer has its reversal, cycle detection and merge
  sections (fast and slow pointers remain a card on the Problem Solving
  Techniques page).
- Hash Tables no longer has its Two-Sum section and diagram (the
  duplicate-check and frequency-counting examples remain).

## [0.0] - 2026-10-07

### Added

- **Stacks & Queues** page: LIFO vs. FIFO fundamentals, implementing a
  queue from two stacks, monotonic stacks for the next-greater-element
  pattern, and deques — each backed by real Python, an animated diagram,
  a cheat sheet, and an 8-question self-quiz. Shared by the Stacks and
  Queues entries.
- New curriculum plan following the roadmap.sh Data Structures & Algorithms
  roadmap, in Python: 40 topics across 9 sections — Basic Data Structures,
  Algorithmic Complexity, Sorting Algorithms, Search Algorithms, Tree Data
  Structures, Graph Data Structures, Advanced Data Structures, Indexing and
  Problem Solving. Every topic has a short beginner-level blurb on its
  placeholder page.
- **Problem Solving Techniques** page covering every technique on the
  roadmap (Brute Force, Recursion, Divide and Conquer, Greedy, Backtracking,
  Dynamic Programming, Randomised, Two Pointer, Sliding Window, Fast and Slow
  Pointers, Merge Intervals, Cyclic Sort, Two Heaps, Kth Element, Island
  Traversal, Multi-threaded), each as what it is, what it does and where
  it is seen.
- Section overview page: choosing a section shows a card and blurb for each
  of its topics.
- Major release notes drafted in `docs/releases/major-roadmap-restructure.md`.

### Changed

- **Replaced the previous plan.** The three routes (Data Structures,
  Algorithms, Patterns) and their outline are gone, replaced by one route,
  Data Structures & Algorithms, in the learning order above.
- Sidebars reorganised: the left sidebar lists the 9 sections as tabs
  (with topic counts) and the second sidebar shows only the active
  section's topics.
- Existing pages re-mapped into the new plan: Array, Linked Lists, Stacks,
  Queues, Hash Tables and Big-O.

### Removed

- Topics with no place in the new plan: Recursion (now a technique card),
  Strings, Matrix, Deques, Topological Sort, Floyd-Warshall, Bit
  Manipulation, Number Theory, String Matching and the Patterns list.
  The Strings page files remain in the repo but are no longer linked.
