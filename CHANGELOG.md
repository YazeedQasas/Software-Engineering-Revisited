# Changelog

All notable changes to this project are logged here, newest first.

## [Unreleased]

## [0.8] - 2026-10-21

### Added

- **Indexing: Linear** page (Indexing), built animation-first on a table of
  twelve employees. It opens with a looping animation that finds one row with no
  index (nine rows read) and then with a sorted index (a binary search of the
  index, three reads, and a curved arrow from the index entry to its row, then
  one row read). Then a one-page recap, the idea in four steps with the Python to
  build the index, and three kinds of linear index: the sorted (dense) index, the
  sparse index (an animation over a table kept sorted in blocks of three, with
  one index entry per block) and the hash index (an animation of buckets, showing
  why it is fast for "equals" but cannot answer a range). "The Price of an
  Index" is an animation of adding a row: the table just appends it, but the
  sorted index has to slide everything after it down. The interactive code tracer
  runs the real Python line by line for scanning the table, binary-searching the
  sorted index and finding a block with the sparse index, with the index
  beside the table, lo, mid and hi markers, and a counter of index reads and
  table reads, and presets such as the first row, a missing id and an id smaller
  than every block. It also covers a comparison of no index, sorted, sparse and
  hash, a one-sentence definition, what it costs (with a log-scale picture for a
  million rows and a table), when to use it, and an 8-question self-quiz.
- New shared `IndexTables` (an index beside its table, with entries that slide
  when the list changes, optional blocks, lo/mid/hi tags and connector arrows),
  an `index` view in the code tracer, and an `indexData.js` helper with the
  employee table and the dense, sparse and hash indexes.
- **Indexing: Tree-Based** page (Indexing), built animation-first on the same
  twelve employees, now indexed by a B+ tree. It opens with a looping animation
  of a lookup walking from the root, through a page of signposts, to the leaf
  that holds the key and its row's slot (each page numbered in the order it was
  read, then the row fetched from the table). Then a one-page recap, the idea in
  four steps (cut the sorted keys into pages, index the pages, repeat up to a
  single root, look up by choosing a branch at each level) with the `Page`
  class, "Why Not Just a Sorted List?" with a table of reads for a thousand, a
  million and a billion rows, and "B+ Tree, Not B-Tree" with a comparison table.
  "Ranges" is an animation that walks down once and then follows the dashed
  links between the leaves, and "Changing It" is an animation of a full page
  splitting and the first key of the new page being copied up into the parent.
  The interactive code tracer runs the real Python line by line for a lookup and
  for a range scan, with the pages numbered as they are read, the rows found so
  far, the links followed drawn thick, and presets such as the smallest id, a
  missing id, an id bigger than all, a range inside one leaf, a range that runs
  off the end and an empty range. "In a Real Database" shows real
  `EXPLAIN QUERY PLAN` output from Python's built-in `sqlite3` module (a scan
  turning into a search with an index, a range using the index, ORDER BY needing
  no sort, and a leading-wildcard LIKE that cannot use one), plus a note on
  multi-column indexes. It also covers a comparison of no index, a sorted list,
  a hash and a B+ tree, a one-sentence definition, what it costs (with a
  log-scale picture for a million rows and a table), when to use it, and an
  8-question self-quiz.
- Dashed links between leaves and the table slot under each key for
  `BTreeView`, and a `bplus` view in the code tracer, with a B+ tree in the
  shared `indexData.js` helper.

## [0.7] - 2026-10-20

### Added

- **Trie** page (Advanced Data Structures), built animation-first with short,
  plain explanations. It opens with a looping animation that builds a trie from
  five words: new nodes green, reused nodes blue, a double ring where a word
  ends, and a caption saying what is new each time (14 letters, only 8 nodes).
  Then a one-page recap, the idea in four steps with the `TrieNode` class (plus
  a note that a trie is not balanced and that the flag can be a value), "Where a
  Word Ends" (two tries with identical nodes where only the ring says whether
  "do" is a word) and "Autocomplete: Walk, Then Collect", an animation of typing
  a prefix that shows the walk down, the branches ruled out and the suggestions.
  The interactive code tracer runs the real Python for insert, search and
  starts-with (autocomplete) line by line, including the recursive `collect`
  with its call stack and output list, with presets for a new node, a new
  branch, a word that is a prefix of another, a path that breaks and a prefix
  that is not a word. It also covers a trie against a hash set, a one-sentence
  definition, what it costs (O(L) per word, with a picture of memory and lookup
  steps counted from a real word list and a table), when to use it, and an
  8-question self-quiz.
- New shared `rings` option for tree nodes (a double outer ring) in `TreeView`
  and the code tracer, and a `trieData.js` helper that builds and lays out a
  trie.
- **Segment Trees** page (Advanced Data Structures), built animation-first. It
  opens with a looping animation that asks a segment tree for the sum of
  positions 2 to 6 (green nodes used whole, yellow nodes opened, grey nodes
  ignored), then a one-page recap, the idea in four steps and a table of the
  three cases a node can be in (outside, inside, partly inside). Looping
  animations show building the tree from the bottom up and changing one number
  (only one node per level is fixed). The interactive code tracer runs the real
  Python for build, query and update line by line, with the call stack under
  the tree and presets such as a range, the whole array, a single position and
  six numbers (an uneven tree). It also covers the same tree answering minimums
  instead of sums, a segment tree against a plain loop and prefix sums, a
  one-sentence definition, what it costs (with a picture of steps for 1000
  numbers and a table, plus a note on lazy propagation), when to use it and an
  8-question self-quiz.
- New shared `sub` caption for tree nodes (e.g. the range a node covers), and
  `good` and `slotLabels` options in the code tracer's tree view, with a
  `segData.js` helper that builds and lays out a segment tree.
- **Fenwick Trees** page (Advanced Data Structures), built animation-first. It
  opens with a looping animation that asks for the sum of the first 7 numbers,
  drawn as bars above the array: each stored sum is as wide as the part of the
  array it adds up. Then a one-page recap, the idea in four steps, and "Who
  Adds Up What", a looping animation of every bar with its number in binary and
  the lowest 1 picked out (that is what decides the width), plus a table.
  Looping animations show asking for a prefix (removing the lowest 1 hops left),
  changing a number (adding the lowest 1 hops right to every bar over it), any
  range as two prefixes (one taken away from the other) and the tree hiding in
  the list (bar i joined to bar i + (i & -i)). The interactive code tracer runs
  the real Python for prefix sum, update, range sum and the O(n) build line by
  line, with the binary numbers and the sums read so far beside the bars, and
  presets such as a range where one bar cancels out and six numbers (not a power
  of 2). It also covers a Fenwick tree against a segment tree, a one-sentence
  definition, what it costs (with a picture of steps for 1000 numbers and a
  table), when to use it and an 8-question self-quiz.
- New shared `FenwickView` (bars over an array, and a `Bits` row showing a
  number in binary with its lowest 1 picked out) and a `fenwick` view in the
  code tracer, with a `fenData.js` helper.
- **Disjoint Sets (Union-Find)** page (Advanced Data Structures), built
  animation-first. It opens with a looping animation of eight things being
  joined into groups, one union at a time (one colour per group, a parent list
  underneath, and two "same group?" questions answered by climbing to the
  roots). Then a one-page recap, the idea in four steps, and "Finding the Root",
  an animation of find climbing a chain, which shows why a find can take O(n).
  "Two Tricks That Keep Trees Short" has an animation of the same two groups
  joined both ways (the smaller group goes under the bigger one, with the
  reason the height stays near log n) and an animation of path halving
  flattening the chain over two finds. The interactive code tracer runs the real
  Python for find and union line by line, with group colours, the size under
  each root and the parent list, and presets such as a long chain, a lone
  thing joining a group (the swap), two things already together and four
  unions in a row where the last returns False. It also covers what you can
  ask (and what you cannot: no splitting, no path), a comparison with group
  labels and with graph search, a one-sentence definition, what it costs (with
  a log-scale picture for a million things and a table), when to use it, and an
  8-question self-quiz.
- New shared `states`, `legend` and `strips` options in the code tracer's tree
  view, and a `.cell-name` label for rows of cells, with a `ufData.js` helper
  that runs the real find and union and lays out a forest.
- **Suffix Trees and Arrays** page (Advanced Data Structures), built
  animation-first on the word banana. It opens with a looping animation that cuts
  the word into its six suffixes, slides them together and sorts them (the rows
  physically move to their new places), reads off the suffix array, and ends by
  showing that every place "ana" appears is a suffix that starts with it, and
  that those suffixes sit side by side. Then a one-page recap, the idea in four
  steps (every substring is the start of some suffix), "The Suffix Array" with a
  table of the sorted suffixes and the one-line Python, and "The LCP List", an
  animation of what neighbouring suffixes share (the biggest number is the
  longest repeated piece, and the sum gives the number of different
  substrings). "The Suffix Tree" is an animation of the trie of all suffixes
  (23 nodes) being squashed into the suffix tree (11 nodes), with the leaves
  read left to right giving the suffix array again. The interactive code tracer
  runs the real Python for two searches line by line: a binary search of the
  suffix array (lo, mid and hi markers, the matching letters in green, the first
  differing letter in red, then the block of matches) and a walk down the suffix
  tree (a thick trail along the edges followed, the pattern matched so far),
  with presets for a pattern that appears twice, once, three times, not at all
  and one that ends inside an edge. It also covers scanning against the array and
  the tree, a one-sentence definition, what it costs (with a log-scale picture
  for a 10-letter pattern in a million letters and a table), when to use it, and
  an 8-question self-quiz.
- New shared `SuffixRows` (sorted suffixes as rows that slide when re-ordered)
  and a `suffix` view in the code tracer, edge text and highlighted edges
  (`hotEdges`) for `TreeView`, and a `suffixData.js` helper that builds the
  suffix array, the LCP list, the suffix trie and the suffix tree.

## [0.6] - 2026-10-18

### Added

- **Kruskal's Algorithm** page (Graph Data Structures), built animation-first
  with short, plain explanations, on the same seven-town map as Prim's so the
  two can be compared. It opens with a looping animation: the edges are sorted
  cheapest first and shown as a list of chips under the graph (kept in green,
  skipped in red, never looked at faded), node colours show which nodes are
  already joined into one group, and a caption explains each decision. Kruskal
  keeps six of the twelve edges (total cost 23, the same tree as Prim's) and
  stops after looking at only eight. Then a short recap, the idea in four
  steps, and "The Loop Test": an animation of the one question asked of every
  edge (are its two ends already in the same group?), with A-B skipped because
  both ends are in one group and C-D kept because it joins two groups, and a
  short explanation of Union-Find (parent pointers, find, join). The
  interactive code tracer runs the real Python, including `find` with path
  halving, line by line, with a badge on each node showing its root after every
  `find`, the sorted edge list, the groups and the edges kept, and presets for
  the seven towns and for two separate groups where every edge is looked at but
  only four are kept (a spanning forest). A side-by-side picture shows Prim and
  Kruskal after three edges (one growing tree against separate groups that join
  later), with a comparison table. It also covers a one-sentence definition,
  what it costs (O(E log E), with a bar picture of edges sorted, looked at and
  kept, and a table including Union-Find without shortcuts), when to use it
  (sparse graphs, graphs in pieces, clustering), and an 8-question self-quiz.
- New shared `kruskalRun` helper (it runs Union-Find the same way as the Python
  on the page), four group colours for nodes, and the styles for the sorted
  edge chips.
- **Prim's Algorithm** page (Graph Data Structures), built animation-first
  with short, plain explanations. It uses a map of seven towns (a ring of six
  with one in the middle joined to all of them) and the cost of every possible
  cable. It opens with a looping animation that grows the tree one edge at a
  time: tree nodes and edges green, the edges leaving the tree in gold, the
  cheapest one in blue, and a caption listing the candidates and the winner.
  Then a short recap, "What is a spanning tree?" (a tree costing 37, the minimum
  spanning tree costing 23, and the loop an extra edge creates, with a small
  words table), the idea in four steps, and "Why the cheapest edge is safe"
  (the edges crossing from the tree to the outside, the cheapest one, and an
  edge with both ends inside the tree shown red because it would close a loop).
  The interactive code tracer runs the real `heapq` version line by line and
  shows the heap of (weight, from, to), the nodes in the tree and the edges
  chosen, with presets for starting at A, starting at D (a different pick order
  but the same tree and cost) and two separate groups where Prim only reaches
  its own piece. A side-by-side picture puts Dijkstra's tree (cost 50) next to
  Prim's (cost 23), with a comparison table. It also covers a one-sentence
  definition, what it costs (O(E log V), with a picture of the heap work from a
  real run and a table), when to use it, and an 8-question self-quiz.
- New weighted example graph for minimum spanning trees, a gold "candidate"
  edge colour, and `crossingEdges` and `primRounds` helpers in the shared graph
  data.
- **A* Algorithm** page (Graph Data Structures), built around an isometric
  grid world (the cube-tile look of the search pages) and a nine-step
  walkthrough where every step adds one idea. A 7x7 map has tall dark walls, a
  teal start tile on the left and a purple goal tile on the right, plus a
  dead-end pocket near the goal. It opens with a looping race: Dijkstra and A*
  side by side, tile by tile, until each turns its route green (Dijkstra visits
  38 tiles, A* only 17). Then "A* Step by Step" (Back / Next step with step
  dots), every picture read from a real run of the algorithm: the map, what
  Dijkstra would do, the guess h (tiles across plus tiles up) shown on every
  tile, g + h = f with a callout, tiles waiting in the heap, taking the
  smallest f, looking at neighbours, a dead end that costs time but not
  correctness, and reaching the goal with the route numbered by cost so far.
  Then a short recap, the idea in four steps, a table for choosing a guess
  (straight line, Manhattan, diagonal, 0), and "never overestimate": the same
  search with an honest guess and with a guess four times too big, which
  charges up the left side of a second map and comes back with 20 steps
  instead of 12. A section "The Same Map as a Graph" shows the grid turning
  into a graph: a dot appears on every open tile (walls get none), the tiles
  fade away while the dots slide into a flat lattice and a line fades in
  between every two touching tiles, then A* finds the same 14-step route on it,
  with a table matching tile, wall, step cost and guess to node, no node, edge
  weight and a guess worked out from coordinates. A "Tiles / A graph" switch on
  the walkthrough and on the tracer redraws any step as dots and lines, with
  light green lines for where each node was reached from. The interactive code
  tracer runs the real Python on the grid
  (a number on each tile is its f, a pointer floats over the neighbour being
  checked, with the heap and visited list underneath), with presets for the
  honest guess and the too-big guess. It also covers a one-sentence
  definition, what it costs (worst case the same as Dijkstra, with a bar
  picture of tiles visited and a table), an A* versus Dijkstra table, when to
  use it, and an 8-question self-quiz.
- New shared `IsoGrid` component (a grid of isometric tiles with a pointer and
  a callout, and a graph drawing of the same grid), extra tile colours in `IsoRow` (wall, start, goal, visited), and
  an `isogrid` view in the code tracer. The tracer's colour key and rows of
  slots are now shared pieces used by the graph and grid views.
- **Bellman-Ford Algorithm** page (Graph Data Structures), built
  animation-first with short, plain explanations. It opens with a looping
  animation on a five-node graph with one negative road: each frame is one
  pass over every edge, showing which distances change, which nodes already
  have their cheapest cost (green) and the routes found so far. The edges are
  listed in an unlucky order on purpose, so the news from the start takes all
  four passes to reach the last node. Then a short recap, an animation of the
  graph that broke Dijkstra (a negative road locks in the wrong answer) now
  solved correctly, the idea in three steps, and "Why V - 1 passes?" (after
  pass k, every cheapest route of up to k roads is correct). The interactive
  code tracer runs the real Python line by line and shows the edge list (with
  the edge being checked), the distances and the green routes, with presets for
  the unlucky edge order, a lucky edge order (everything settles in pass 1 and
  the rest of the passes do nothing) and a negative cycle where the extra
  check pass still improves something and the function returns `None`. A
  further animation shows a loop that costs -1 per lap getting cheaper on every
  pass. It also covers a one-sentence definition, what it costs (O(V x E),
  with a grid of passes by edges showing how few of the checks change
  anything, and a table), a Dijkstra versus Bellman-Ford comparison table, when
  to use it, and an 8-question self-quiz.
- New directed example graphs with negative roads (one with a negative cycle)
  and a `bellmanFordPasses` helper were added to the shared graph data.
- **Dijkstra's Algorithm** page (Graph Data Structures), built animation-first
  with short, plain explanations. It opens with a looping animation on a map of
  six towns with road costs: Dijkstra finishes the closest open node each
  frame, with the best distance so far on every node and the cheapest road into
  each node drawn green. Then a short recap, an animation of the route with the
  fewest roads (cost 15) next to the cheapest route (more roads, cost 13), the
  idea in four steps, and an animation of "relaxing" a road (B drops from 4 to
  3 once C is finished). The interactive code tracer runs the real `heapq`
  version line by line and shows the heap, the distances and the visited set,
  with out-of-date heap entries being skipped, and has presets for starting at
  A, starting in the middle, and two separate groups where unreachable nodes
  stay at ∞. Another animation reads the route back by following `previous`
  (with the `route_to` function), and one shows why a single negative road
  breaks the algorithm (a node is locked in too early). It also covers a
  one-sentence definition, what it costs (O((V + E) log V), with a picture of
  the heap work from a real run and a table including the plain-list O(V²)
  version), when to use it (and when to use BFS, Bellman-Ford or A*), and an
  8-question self-quiz.
- The graph animation frames can now show a colour legend, and the graph
  tracer's rows of slots can be green or wide. New weighted example graphs and
  a `dijkstraRounds` helper were added to the shared graph data.
- **Graph Search Algorithms (BFS & DFS)** page (Graph Data Structures), built
  animation-first with short, plain explanations. It opens with a looping
  race: breadth-first and depth-first search side by side on the same graph,
  with each node numbered in the order it is visited and the edge that found it
  drawn green, so the ripple and the dive are obvious. Then a short recap and
  "why remember where you have been?", an animation of a search with no memory
  going round a cycle for ever and then stopping once it has a visited set. A
  comparison table of the two searches follows. The interactive code tracer has
  a BFS / DFS switch (iterative BFS with a queue, recursive DFS with its call
  stack) and shows the node being visited in blue, the neighbour being checked
  dashed, waiting nodes in yellow, visited nodes grey and numbered, green edges
  for the ones that found a new node, and a live queue (or call stack) and
  visited set underneath, with presets for starting at 0, starting in the
  middle, and a graph in two separate pieces where the search stops short.
  Another animation shows breadth-first search reaching nodes ring by ring and
  following "who found me" back to a shortest path. It also covers a
  one-sentence definition, what it costs (O(V + E), with a picture of the work
  and a table covering the adjacency matrix, a visited list instead of a set,
  and list.pop(0) as a queue), when to use each, and an 8-question self-quiz.
- The graph tracer view can now show rows of slots (a queue, a call stack, a
  visited set), and colour edges as well as nodes. The animation frames with a
  caption and step dots are now a shared component.
- **Undirected Graphs** page (Graph Data Structures), built animation-first
  like the other graph pages, with short, plain explanations. It opens with a
  looping animation of a graph of six friends in seven short frames (a line
  that works both ways, going from 0 to 1 and straight back, the neighbours of
  a node, degree, and a path), then a short recap and the key idea "a line is
  two arrows", shown as a plain line swapping into a pair of opposite arrows,
  with a small table comparing directed and undirected graphs and a table of
  the words to know. "Two ways to write it down" animates each edge lighting up
  twice in the adjacency list and twice in the adjacency matrix, with the
  matrix diagonal shaded to show the grid is a mirror image of itself, plus the
  Python for each and an `add_edge` that writes both ends. The interactive code
  tracer builds an undirected graph edge by edge (each edge appears as a plain
  line and is written into the list twice and into the grid twice), with
  presets for friends, roads between towns and two separate groups. Two more
  animations cover a graph that falls into separate pieces (components) and a
  tree that grows a cycle when one extra edge is added. It also has a
  one-sentence definition, what it costs (how many entries the list and grid
  need, counting two per edge, and a table of five questions), when to use it,
  and an 8-question self-quiz.
- `GraphStore` can now light up several entries at once and shade the matrix
  diagonal, and the list-versus-grid size picture takes its numbers as
  options so directed and undirected pages can share it.
- **Graph Theory Basics** page (Graph Data Structures), a new first page of the
  Graphs section, placed before Directed Graphs and built animation-first with
  short, plain explanations. It opens with a looping animation of the seven
  bridges of Königsberg (1736): a map of four pieces of land and seven bridges
  fades into a graph, each land becomes a node, each bridge an edge, the
  degrees (3, 5, 3, 3) appear, and the answer to "can you cross every bridge
  exactly once?" falls out of counting. Then a short recap, a table of
  everyday things as graphs (friends, roads, the web, flights, a degree plan),
  a gallery of six kinds of graph (undirected, directed, weighted,
  disconnected, with a cycle, and a tree) with the words connected, component,
  cycle and tree explained in a few sentences, and degree with the rule that
  all degrees add up to twice the edges. The interactive code tracer counts
  every node's degree edge by edge and then applies Euler's rule, with presets
  for the seven bridges (no walk), a small town (a walk exists) and a ring
  (a walk that comes back to the start). It also covers where the graph tools
  coming up (search, shortest paths, spanning trees) fit in, a one-sentence
  definition, how big a graph can get (a picture of complete graphs of 3 to 7
  nodes, a table of the most edges up to a million nodes, and sparse versus
  dense), when to think "graph", and an 8-question self-quiz.
- `GraphView` can now draw several edges between the same two nodes (they fan
  out), give an edge its own `id`, and put a small badge on a node. The
  graph tracer view can show undirected graphs, node badges and a row of
  labelled values without the list and grid. The looping-animation helper and
  step dots are now shared between pages.
- **Directed Graphs** page (Graph Data Structures), the first page of the
  Graphs section. It is built animation-first with shorter, plainer
  explanations: after a two-sentence introduction it opens with a looping
  animation (with clickable step dots) that shows, in six short captions,
  nodes, an edge, an arrow that only goes one way, two people who follow each
  other, a path and a cycle. Then a short recap, a small table of the words to
  know (node, edge, neighbour, in- and out-degree, path, cycle), and "two ways
  to write it down": an animation that lights up one edge at a time in the
  drawing, the adjacency list and the adjacency matrix together, plus the
  Python for each and a mention of the plain list of pairs. The interactive
  code tracer builds a graph one edge at a time: the edge appears in the
  drawing, then lands in the list and in the grid, with presets for a "who
  follows who" graph, a task-order graph and a graph of mutual friends. It
  also covers loops and order (a looping cycle animation beside a graph with no
  cycle, and what a DAG is), a one-sentence definition, what it costs (a
  picture of how many entries the list and the grid need for a spread-out and
  a crowded graph, and a table comparing the two on six questions), when to
  use it, and an 8-question self-quiz.
- Reusable `GraphView` component for drawing graphs with one-way arrows
  (edges bend apart when two nodes point at each other, and can show weights),
  a `GraphStore` component that writes a graph as an adjacency list beside an
  adjacency matrix, and a `view="graph"` option on `CodeTracer`.


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
