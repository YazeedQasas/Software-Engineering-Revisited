# Changelog

All notable changes to this project are logged here, newest first.

## [Unreleased]


## [0.5] - 2026-10-13

### Added

- **Heaps** page (Tree Data Structures), the last page of the Trees section,
  built like the other tree pages and focused on the heap as a data structure
  and priority queue (Heap Sort already covered the sorting side): a one-page
  recap, the heap rule (a complete tree stored in a list, where every parent
  is no bigger than its children in a min-heap or no smaller in a max-heap)
  with the same seven numbers shown as both kinds of heap and as the plain
  list each is stored in, what the rule does not say (siblings and cousins
  are in no order), a table comparing a heap with a binary search tree, and
  push (float up) and pop (move the last item to the top and sink down)
  explained. The interactive code tracer has a switch for Push, Pop and Build
  (heapify) and shows the list as bars with the same heap drawn as a tree
  underneath, with presets for an item that stays put, rises part way or
  rises to the top; pops from a small heap, a sorted heap, one with
  duplicates and a heap of two; and building from a random, backwards,
  already-a-heap and duplicate-filled list. It also covers why building a heap
  is O(n) rather than O(n log n) with a diagram of how far each level can
  sink, a one-sentence definition, what it costs (tables of operations and
  properties, and how a heap compares with an unsorted list, a sorted list and
  a search tree as a priority queue), a section on Python's `heapq` (its
  operations with costs, and the three traps: it is a min-heap only, the list
  is not sorted, and ties compare the next item), when to use it, and an
  8-question self-quiz.
- `CodeTracer` now sizes its bars over every step, so a value added later (a
  heap push) fits.

- **B-Trees** page (Tree Data Structures), built like the other tree pages:
  a one-page recap, the problem of slow storage (a disk search costs the
  number of blocks read, not comparisons, shown as 20 reads for a binary tree
  against 3 for a B-tree on a million keys), what a B-tree is (a search tree
  stretched so a node holds many sorted keys and a node with k keys has k + 1
  children, with a labelled example and a table of the five rules for an
  order-4 tree), searching with a looping animation of a search that reads
  only three nodes, inserting by splitting a full node and sending the middle
  key up (before-and-after picture and the `split_node` code) with the tree
  growing at the top so every leaf stays on the same level, and a table of
  the four delete cases (just remove, swap with a neighbour, borrow from a
  sibling, merge). The interactive code tracer has a switch for Search and
  Insert: search counts the nodes read from disk and turns the matching key
  green, and insert shows the call stack, a node with too many keys turning
  red, the middle key and new node being handed up to the caller, and the tree
  growing a level, with presets for room in the leaf, a leaf split, a split
  the parent absorbs, and a cascade that splits the root. It also covers a
  one-sentence definition, what it costs (O(log n), but with the height set by
  the base: 3 levels for a billion keys at 1,000 children per node against 30
  for a binary tree, with a bar chart and tables of levels, operations and
  properties), how it relates to AVL and B+ trees, how SQLite and Python
  fit in, when to use it, and an 8-question self-quiz.
- Reusable `BTreeView` component for drawing multi-key nodes, and a
  `view="btree"` option on `CodeTracer` with a call stack and a "handed up to
  the caller" box.

- **AVL Trees** page (Tree Data Structures), built like the other tree
  pages and picking up from the last page's warning that sorted inserts turn
  a search tree into a chain: a one-page recap, the problem shown as the same
  seven sorted values going into a plain search tree (a chain of height 6)
  and an AVL tree (height 2), the balance factor (left height minus right
  height, which must stay between −1 and +1) with a valid and a too-leaning
  tree side by side, rotations explained with before-and-after pictures of
  the two single rotations plus the code for `rotate_right` and
  `rotate_left`, a picture of the double rotation that straightens a bend
  first, and a table of the four cases (left-left, right-right, left-right,
  right-left). The interactive code tracer inserts one value into a small AVL
  tree with the recursive code: every node shows its balance factor,
  refreshed as the code reaches it on the way back up, an out-of-balance node
  turns red, and the rotation moves the nodes and highlights the new top,
  with five cases to try (no rotation, and each of the four rotation cases).
  It also covers a one-sentence definition, what it costs (O(log n) for
  search, insert and delete with at most one rotation per insert, and why
  the height is at most about 1.44 log₂ n, shown with the thinnest AVL tree
  of each height and a table up to height 30), how AVL compares with a plain
  search tree and a red-black tree, the Python tools that stand in for one,
  when to use it, and an 8-question self-quiz.
- `CodeTracer`'s tree view can now put a small badge on any node (used for
  balance factors) and draw nodes red with their own legend label.

- **Binary Search Trees** page (Tree Data Structures), built like the other
  tree pages: a one-page recap, "the one rule" (everything on the left is
  smaller, everything on the right is larger, at every node) with the tree
  colour-coded either side of the root, the classic trap of a value that fits
  its parent but not an ancestor shown as a valid and an invalid tree side by
  side, searching explained as binary search drawn as a tree with a looping
  animation of a search ruling out whole sides, finding the smallest and
  largest value, how insert is a search that ends by hanging the new value
  on an empty spot, and a table of the three delete cases (a leaf, one child,
  two children with the successor idea). The interactive code tracer has a
  switch for Search, Insert and Delete: search and insert walk down the tree
  with the compared nodes numbered, insert shows the new node appearing while
  every other node stays put, and delete is the recursive version with a live
  call stack, a highlighted node being deleted, and the successor being found
  and copied up (with presets for a leaf, one child, two children, the root
  and a value that is not there). It also covers a one-sentence definition,
  what it costs (O(h) for everything, with a diagram of the same seven values
  inserted in two different orders giving a balanced tree or a chain, tables
  of operations on balanced and skewed trees, properties, how a search tree
  compares with an unsorted list, a sorted list, and a hash table, and the
  Python tools that stand in for one), when to use it, and an 8-question
  self-quiz.
- `CodeTracer`'s tree view can now show a plain walk down a tree with no
  waiting list, custom legend labels, and a tree that changes from step to
  step. `TreeView` has a red state for a misplaced node.

- **Binary Trees** page (Tree Data Structures), built like the other tree
  pages and starting from binary search ("draw every choice you could make
  and you get a binary tree"): a one-page recap, what makes a tree binary
  (at most two children, left and right matter, every node is the top of
  two smaller trees), a gallery of the five named shapes (full, perfect,
  complete, balanced and skewed) with a table of their rules and how they
  overlap, "the doubling trick" (each level holds twice as many nodes, so
  height h holds at most 2^(h+1) − 1 and a tree's height lies between
  log₂ n and n − 1) with a table up to a height of 30, two ways to store a
  tree (linked nodes and a plain list where the children of position i are
  at 2i + 1 and 2i + 2) with a diagram and why the list form wastes space on
  skewed trees, an interactive code tracer that finds a tree's height
  recursively (the call stack grows, and each node gets its answer written
  on it as soon as it is worked out, on a balanced tree, a lopsided tree and
  a chain), a one-sentence definition, what it costs (O(n) to look at
  everything, O(h) to go down one path, with a diagram of the same seven
  nodes balanced against chained, a table of operations, the properties, and
  where `heapq` fits), when to use it, and an 8-question self-quiz.
- `CodeTracer`'s tree view can now write a result on each finished node
  instead of its visit number.

- **Tree Traversals (In / Pre / Post-Order)** page (Tree Data Structures),
  built like the other tree page: a one-page recap, a short primer on binary
  trees (left and right children, a Python `Node` class, and why the example
  values make it a binary search tree), the idea explained as "when do you
  visit the node?" with a diagram of a node between its two subtrees and
  three numbered moments (before, between, after), a looping animation of
  the three orders on the same tree with numbered badges, a table of the
  rule and output of each order, and the one traversal function shown with
  the three places the visit can go. The interactive code tracer has a
  switch for pre-, in- and post-order and two trees to try (balanced and
  lopsided): the running call is blue, calls waiting on the stack are
  yellow, visited nodes are grey and numbered, and a live call stack and an
  output strip show recursion opening and closing and what `print` has
  written so far. It also covers a one-sentence definition, what it costs
  (O(n) time, O(h) space with a diagram of a shallow tree against a chain,
  and why building new lists inside the recursion slows it to O(n log n) or
  O(n²)), when to use each order (sorted output, copying, deleting,
  expression trees), and an 8-question self-quiz.
- `CodeTracer`'s tree view can now show a recursive call stack and an output
  list, and the page reuses `TreeView` for the new trees.

- **Tree Search Algorithms (BFS & DFS)** page (Tree Data Structures), the
  first page of the Trees section, built to the same structure as the
  search pages: a one-page recap, a "what is a tree?" primer for beginners
  (a labelled diagram of the root, leaves and levels, a table of the words
  node, edge, root, parent, child, leaf, level, height and subtree, and how
  to store a tree as a Python dict of children), a looping animation of the
  idea that searches the same tree breadth-first and depth-first side by
  side with numbered badges showing the order, and two interactive code
  tracers (BFS with a queue, DFS with a stack) on that tree. In the tracers
  the node being looked at is blue, nodes waiting their turn are yellow and
  shown in a live queue or stack strip, finished nodes are grey and numbered
  in the order they were reached, and a match turns green, with five
  searches to try: find C, F, H, the root, or something that is not in the
  tree. It also covers DFS written with recursion, a one-sentence
  definition, what it costs (O(n) time for both, O(w) space for BFS and
  O(h) space for DFS with a diagram of a wide tree against a tall one, a
  table counting how many nodes each search looks at, a side-by-side
  comparison table, and why `list.pop(0)` makes BFS slow), when to use each,
  and an 8-question self-quiz.
- Reusable `TreeView` component for drawing a tree with colour-coded nodes
  and order badges, and a `view="tree"` option on `CodeTracer` that plays the
  code beside the tree and its queue or stack.


## [0.4] - 2026-10-12

### Added

- **Binary Search** page (Search Algorithms), built exactly like the Linear
  Search page: a one-page recap, a looping isometric animation of the idea
  (check the middle cube, fade the half that cannot hold the target, repeat
  on what is left until the match turns green), an interactive code tracer
  on the same sorted list as the linear page (the middle cube floats up and
  turns blue, thrown-away cubes fade, a match turns green, and `low`,
  `high` and `mid` are shown as variables, with six searches to try: found
  in the middle, dead centre as the best case, first item, last item as the
  worst case, missing and duplicates), a one-sentence definition, what it
  costs (O(1) best, O(log n) average and worst, with a diagram of 16 items
  halving down to one, a table of worst-case checks for linear vs. binary
  search from 8 items up to a billion, and the time and extra space of
  `bisect`, `in`, `sorted` and sets), when to use it, and an 8-question
  self-quiz that includes the recursive O(log n) space case.
- **Linear Search** page (Search Algorithms), built to the same structure as
  the sorting pages and explained with isometric 3D animations: a one-page
  recap, a looping isometric animation of the idea (a marker walks along a
  row of cubes, ruling each out until the match turns green), an
  interactive code tracer in the same isometric style (the cube being
  checked floats up, ruled-out cubes fade, a match turns green, with five
  searches to try: found in the middle, first item, last item, missing and
  duplicates), a one-sentence definition, what it costs (best, average and
  worst case shown as three small isometric rows, plus the time and extra
  space of Python's `in`, `index` and `count`), when to use it, and an
  8-question self-quiz.
- Reusable `IsoRow` component for isometric rows of cubes, and a `view="iso"`
  option on `CodeTracer` that plays the code beside them.


## [0.3] - 2026-10-11

### Added

- **Bubble Sort** page (Sorting Algorithms): a one-page recap, then an
  interactive code tracer (press play and the running line of code is
  highlighted while the bars slide, with step, back, speed, a scrubber and
  four starting lists), a one-sentence definition, what it costs (best,
  average and worst case, space, in place, stable) with a cost diagram,
  when to use it, and an 8-question self-quiz.
- **Insertion Sort** page (Sorting Algorithms), built like Bubble Sort: a
  one-page recap, an interactive code tracer (the item being inserted
  floats above the row while larger items shift right and the sorted section
  grows from the left), a one-sentence definition, what it costs (best,
  average and worst case, space, in place, stable, adaptive, online) with a
  shifts diagram, when to use it, and an 8-question self-quiz.
- **Selection Sort** page (Sorting Algorithms), built like the other sorts: a
  one-page recap, an interactive code tracer (a raised bar tracks the
  smallest item found so far, and the sorted section grows from the left),
  a one-sentence definition, what it costs (O(n²) in every case, at most
  n − 1 swaps, in place, not stable, not adaptive) with a diagram comparing
  how many moves each simple sort makes, when to use it, and an
  8-question self-quiz.
- **Merge Sort** page (Sorting Algorithms), built like the other sorts: a
  one-page recap, an interactive code tracer for the recursive code (the
  piece being worked on stands out while the rest fades, finished pieces
  turn green, and during a merge the chosen bar slides into place), a
  one-sentence definition, what it costs (O(n log n) in every case, O(n)
  extra space, stable, not in place, not adaptive) with the recursion-tree
  diagram, when to use it, and an 8-question self-quiz.
- **Quick Sort** page (Sorting Algorithms), built like the other sorts and
  explained with the two-pointer method: pick the right-most item as the
  pivot, walk one pointer in from each end swapping items that are on the
  wrong side, then swap the pivot into place and repeat on each side. It has
  a one-page recap, a seven-step worked example with a diagram for each
  step (pivot, left and right pointers, swaps, the crossing point, the pivot
  landing in its final place, then each side repeated), an interactive code
  tracer (the pivot is raised, the left and right pointers are shown under the bars, and the pivot turns
  green when it lands in its final place) with the example list from my
  notes as the first preset, a one-sentence definition, what it costs
  (O(n log n) best and average, O(n²) worst, why the pivot decides, in
  place, not stable) with a good-pivots vs. bad-pivots diagram, when to use
  it, and an 8-question self-quiz.
- **Heap Sort** page (Sorting Algorithms), built like the other sorts: a
  one-page recap, a short "tree hiding in a list" explanation with a diagram
  of the same items as a row and as a tree, an interactive code tracer (the
  list is shown as bars and, underneath, as the heap tree: watch the heap
  being built, the biggest item swapping to the end and turning green, the
  tree shrinking, and the new top sinking down), an eight-step worked
  example with a diagram for each step, a one-sentence definition,
  what it costs (building the heap in O(n), O(log n) per removal, O(n log n)
  in every case, O(1) extra space, not stable), when to use it, and an
  8-question self-quiz.
- Small badges next to the sorting algorithms in the topic sidebar and the
  section overview: Bubble Sort "Educational", Insertion Sort "Small
  datasets", Selection Sort "Reduce writes", Merge Sort "Large datasets",
  "Linked lists" and "Guaranteed performance", Quick Sort "Large
  datasets", "Arrays", "Memory efficient", "Average speed" and "Unstable", and
  Heap Sort "Guarantees O(n log n) sorting performance" and "Handles Quick Sort
  O(n²) worst case".
  Any topic can carry badges through an optional `badges` list.
- Reusable `CodeTracer` component for step-through code and list animations,
  ready for the other sorting pages. It can mark a sorted region on
  either side, mark sorted blocks anywhere, fade everything outside the part
  being worked on, show pointer markers under the bars, lift a held item out of
  the list, size the bars to fit longer lists, and draw a heap
  as a tree under the bars.

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
