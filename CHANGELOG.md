# Changelog

All notable changes to this project are logged here, newest first.


## [Released]

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
