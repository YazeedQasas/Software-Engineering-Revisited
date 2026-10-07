// Plan follows the roadmap.sh "Data Structures & Algorithms" roadmap
// (https://roadmap.sh/datastructures-and-algorithms), in the order we walk it.
// Language: Python.
export const topics = [
  {
    id: 'dsa',
    label: 'Data Structures & Algorithms',
    children: [
      // 1. Basic data structures
      { id: 'arrays', label: 'Array', category: '1. Basic Data Structures', blurb: 'A row of values stored side by side in memory. Jump to any position instantly by index; inserting or deleting in the middle means shifting everything after it. In Python this is a list.' },
      { id: 'linked-lists', label: 'Linked Lists', category: '1. Basic Data Structures', blurb: 'A chain of nodes where each node holds a value and a pointer to the next one. Cheap to insert or remove once you are at the spot, but you have to walk the chain to find it.' },
      { id: 'queues', label: 'Queues', category: '1. Basic Data Structures', blurb: 'First in, first out (FIFO), like a line at a shop. Add at the back, remove from the front. Used for scheduling and breadth-first search.' },
      { id: 'stacks', label: 'Stacks', category: '1. Basic Data Structures', blurb: 'Last in, first out (LIFO), like a pile of plates. Push and pop at the same end. Used for undo, the call stack, and matching brackets.' },
      { id: 'hash-tables', label: 'Hash Tables', category: '1. Basic Data Structures', blurb: 'Stores key-value pairs and finds a key in roughly constant time by turning it into an array position with a hash function. Python dicts and sets are hash tables.' },

      // 2. Algorithmic complexity
      { id: 'time-vs-space', label: 'Time vs Space Complexity', category: '2. Algorithmic Complexity', blurb: 'Time complexity is how the number of steps grows with input size; space complexity is how much extra memory grows. Often you can trade one for the other.' },
      { id: 'calculate-complexity', label: 'How to Calculate Complexity', category: '2. Algorithmic Complexity', blurb: 'Count how many times the work repeats as the input grows: a single loop is linear, nested loops multiply, halving the input each step is logarithmic. Drop constants and keep the biggest term.' },
      { id: 'big-o', label: 'Big-O Notation', category: '2. Algorithmic Complexity', blurb: 'The standard way to describe the worst-case growth rate of an algorithm, ignoring constants. Big-Theta (tight bound) and Big-Omega (lower bound) are its close relatives.' },
      { id: 'common-runtimes', label: 'Common Runtimes', category: '2. Algorithmic Complexity', blurb: 'The growth rates you will meet again and again, from fastest to slowest: constant O(1), logarithmic O(log n), linear O(n), O(n log n), polynomial O(n^2), exponential O(2^n), factorial O(n!).' },

      // 3. Sorting
      { id: 'bubble-sort', label: 'Bubble Sort', category: '3. Sorting Algorithms', blurb: 'Repeatedly compare neighbouring items and swap them if they are out of order; the largest value "bubbles" to the end each pass. Simple but slow: O(n^2).' },
      { id: 'insertion-sort', label: 'Insertion Sort', category: '3. Sorting Algorithms', blurb: 'Build a sorted section one item at a time by sliding each new item into its correct place, like sorting playing cards in your hand. O(n^2), but very fast on nearly sorted data.' },
      { id: 'selection-sort', label: 'Selection Sort', category: '3. Sorting Algorithms', blurb: 'Find the smallest remaining item and put it at the front, repeat. Always O(n^2) but makes very few swaps.' },
      { id: 'merge-sort', label: 'Merge Sort', category: '3. Sorting Algorithms', blurb: 'Split the list in half, sort each half, then merge the two sorted halves. A reliable O(n log n) that needs O(n) extra space.' },
      { id: 'quick-sort', label: 'Quick Sort', category: '3. Sorting Algorithms', blurb: 'Pick a pivot, move smaller items to its left and larger to its right, then sort each side. O(n log n) on average, O(n^2) on a bad pivot, and sorts in place.' },
      { id: 'heap-sort', label: 'Heap Sort', category: '3. Sorting Algorithms', blurb: 'Turn the list into a heap, then repeatedly pull out the largest item. Guaranteed O(n log n) and in place, though usually slower in practice than quick sort.' },

      // 4. Searching
      { id: 'linear-search', label: 'Linear Search', category: '4. Search Algorithms', blurb: 'Check every item one by one until you find the target. Works on any list, sorted or not: O(n).' },
      { id: 'binary-search', label: 'Binary Search', category: '4. Search Algorithms', blurb: 'On a sorted list, look at the middle and throw away the half that cannot contain the target. Repeat. O(log n).' },

      // 5. Trees
      { id: 'tree-search', label: 'Tree Search Algorithms (BFS & DFS)', category: '5. Tree Data Structures', blurb: 'Two ways to visit every node: breadth-first goes level by level using a queue; depth-first dives down one branch before backing up, using recursion or a stack.' },
      { id: 'tree-traversals', label: 'Tree Traversals (In / Pre / Post-Order)', category: '5. Tree Data Structures', blurb: 'Depth-first visiting orders. Pre-order: node, left, right. In-order: left, node, right (gives sorted output on a BST). Post-order: left, right, node.' },
      { id: 'binary-trees', label: 'Binary Trees', category: '5. Tree Data Structures', blurb: 'A tree where every node has at most two children, called left and right. The base shape for most of the trees below.' },
      { id: 'bst', label: 'Binary Search Trees', category: '5. Tree Data Structures', blurb: 'A binary tree where everything on the left is smaller and everything on the right is larger, so search, insert and delete take O(log n) when the tree is balanced.' },
      { id: 'avl-trees', label: 'AVL Trees', category: '5. Tree Data Structures', blurb: 'A self-balancing BST that rotates nodes after inserts and deletes to keep the left and right heights within 1, guaranteeing O(log n).' },
      { id: 'b-trees', label: 'B-Trees', category: '5. Tree Data Structures', blurb: 'A balanced tree where each node holds many keys and has many children. Built for disks and databases, where reading fewer, bigger blocks matters.' },
      { id: 'heaps', label: 'Heap', category: '5. Tree Data Structures', blurb: 'A tree stored in an array where each parent is smaller (min-heap) or larger (max-heap) than its children. The biggest or smallest item is always on top. Powers priority queues.' },

      // 6. Graphs
      { id: 'directed-graphs', label: 'Directed Graphs', category: '6. Graph Data Structures', blurb: 'Nodes connected by edges that have a direction, like one-way streets or "follows" on social media. Can be stored as an adjacency list or matrix.' },
      { id: 'undirected-graphs', label: 'Undirected Graphs', category: '6. Graph Data Structures', blurb: 'Nodes connected by edges that work both ways, like friendships or two-way roads.' },
      { id: 'graph-search', label: 'Graph Search Algorithms (BFS & DFS)', category: '6. Graph Data Structures', blurb: 'The same two ideas as on trees, plus a "visited" set so you never loop forever. BFS finds the fewest-edges path; DFS explores deep and is good for cycles and connectivity.' },
      { id: 'dijkstra', label: "Dijkstra's Algorithm", category: '6. Graph Data Structures', blurb: 'Finds the cheapest path from one node to all others by always expanding the closest unvisited node. Needs non-negative edge weights.' },
      { id: 'bellman-ford', label: 'Bellman-Ford Algorithm', category: '6. Graph Data Structures', blurb: 'Shortest paths that also work with negative edge weights, by relaxing every edge up to V-1 times. Slower than Dijkstra but can detect negative cycles.' },
      { id: 'a-star', label: 'A* Algorithm', category: '6. Graph Data Structures', blurb: 'Dijkstra with a guess: a heuristic estimates the distance left to the goal so the search heads in the right direction. Common in maps and games.' },
      { id: 'prims', label: "Prim's Algorithm", category: '6. Graph Data Structures', blurb: 'Builds a minimum spanning tree (the cheapest set of edges connecting every node) by growing from one node and always adding the cheapest edge leaving the tree.' },
      { id: 'kruskals', label: "Kruskal's Algorithm", category: '6. Graph Data Structures', blurb: 'Builds a minimum spanning tree by sorting all edges by weight and adding each one unless it would form a cycle (checked with Union-Find).' },

      // 7. Advanced data structures
      { id: 'trie', label: 'Trie', category: '7. Advanced Data Structures', blurb: 'A tree where each step down spells out one more character, so words sharing a prefix share a path. Used for autocomplete and spell checking.' },
      { id: 'segment-tree', label: 'Segment Trees', category: '7. Advanced Data Structures', blurb: 'A tree that stores a summary (sum, min, max) of each range of an array, so range queries and point updates both take O(log n).' },
      { id: 'fenwick-tree', label: 'Fenwick Trees', category: '7. Advanced Data Structures', blurb: 'Also called a Binary Indexed Tree. A compact array trick for prefix sums with updates in O(log n); simpler than a segment tree but less flexible.' },
      { id: 'union-find', label: 'Disjoint Set (Union-Find)', category: '7. Advanced Data Structures', blurb: 'Tracks which items belong to the same group. find() tells you a group, union() merges two. Nearly O(1) with path compression.' },
      { id: 'suffix-trees', label: 'Suffix Trees and Arrays', category: '7. Advanced Data Structures', blurb: 'Structures built from every suffix of a string, making substring search and repeated-pattern problems fast.' },

      // 8. Indexing
      { id: 'indexing-linear', label: 'Indexing: Linear', category: '8. Indexing', blurb: 'An index kept as a flat sorted or hashed list that points at where data lives. Quick to build, but lookups scan or binary-search the whole list.' },
      { id: 'indexing-tree', label: 'Indexing: Tree-Based', category: '8. Indexing', blurb: 'Indexes stored as a balanced tree (usually a B-Tree or B+ Tree), the way databases find rows without scanning the whole table.' },

      // 9. Problem solving
      { id: 'problem-solving', label: 'Problem Solving Techniques', category: '9. Problem Solving', blurb: 'One page covering every technique on the roadmap: what each one is and what it does.' },
    ],
  },
]
