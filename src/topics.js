export const topics = [
  {
    id: 'data-structures',
    label: 'Data Structures',
    children: [
      { id: 'big-o', label: 'Big-O Complexity', category: 'Foundation', blurb: 'State time and space complexity for every operation you mention, and explain amortized cost (e.g., why appending to a dynamic array is O(1) on average).' },
      { id: 'arrays', label: 'Arrays & Dynamic Arrays', category: 'Foundation', blurb: 'Indexing, insertion/deletion costs, resizing, and patterns like two pointers, sliding window, and prefix sums.' },
      { id: 'strings', label: 'Strings', category: 'Foundation', blurb: 'Immutability, building strings efficiently, and common problems like anagrams, palindromes, and substring search.' },
      { id: 'hash-tables', label: 'Hash Tables (Maps & Sets)', category: 'Foundation', blurb: "How hashing works, collisions (chaining vs. open addressing), load factor, and why lookups are O(1) average but O(n) worst case. The most-used tool in interview solutions." },
      { id: 'linked-lists', label: 'Linked Lists', category: 'Core Linear Structures', blurb: 'Singly vs. doubly linked, reversal, cycle detection (fast/slow pointers), merging, and when they beat arrays.' },
      { id: 'stacks-queues', label: 'Stacks & Queues', category: 'Core Linear Structures', blurb: 'LIFO vs. FIFO, implementing one with the other, monotonic stacks, and deques.' },
      { id: 'binary-trees', label: 'Binary Trees', category: 'Trees & Graphs', blurb: 'Traversals (pre/in/post-order, level-order), recursion vs. iteration, height, and path problems.' },
      { id: 'bst', label: 'Binary Search Trees', category: 'Trees & Graphs', blurb: 'The ordering property, search/insert/delete, validating a BST, and why balance matters (brief awareness of AVL/red-black trees is enough).' },
      { id: 'heaps', label: 'Heaps / Priority Queues', category: 'Trees & Graphs', blurb: 'Min-heap vs. max-heap, heapify, and classic uses like top-k elements and merging sorted lists.' },
      { id: 'graphs', label: 'Graphs', category: 'Trees & Graphs', blurb: 'Adjacency list vs. matrix, BFS vs. DFS, cycle detection, topological sort, and shortest paths (Dijkstra at a conceptual level).' },
      { id: 'tries', label: 'Tries', category: 'Good to Know', blurb: 'Prefix trees for autocomplete and word-search problems.' },
      { id: 'union-find', label: 'Union-Find (Disjoint Set)', category: 'Good to Know', blurb: 'Connected components, with path compression and union by rank.' },
    ],
  },
]
