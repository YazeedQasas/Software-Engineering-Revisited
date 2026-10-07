# Major Release: Curriculum rebuilt on the roadmap.sh DSA plan

**Type:** Major (breaking change to the curriculum structure)
**Version:** _to be assigned by the maintainer_
**Date:** 2026-10-07
**Source plan:** https://roadmap.sh/datastructures-and-algorithms
**Language:** Python

## Summary

The previous three-route outline (Data Structures, Algorithms, Patterns)
is replaced by a single route, **Data Structures & Algorithms**, that walks
the roadmap.sh roadmap in a fixed learning order. It is major because
every sidebar entry except a few page IDs has changed, and several
existing pages are no longer reachable.

## New learning order

| # | Stage | Topics |
|---|-------|--------|
| 1 | Basic Data Structures | Array, Linked Lists, Queues, Stacks, Hash Tables |
| 2 | Algorithmic Complexity | Time vs Space, How to Calculate Complexity, Big-O, Common Runtimes |
| 3 | Sorting Algorithms | Bubble, Insertion, Selection, Merge, Quick, Heap |
| 4 | Search Algorithms | Linear, Binary |
| 5 | Tree Data Structures | Tree Search (BFS/DFS), Traversals, Binary Trees, BST, AVL, B-Trees, Heap |
| 6 | Graph Data Structures | Directed, Undirected, Graph Search, Dijkstra, Bellman-Ford, A*, Prim, Kruskal |
| 7 | Advanced Data Structures | Trie, Segment Trees, Fenwick Trees, Union-Find, Suffix Trees/Arrays |
| 8 | Indexing | Linear, Tree-Based |
| 9 | Problem Solving | All techniques on one page |

## Added

- New plan in `src/topics.js` (40 topics across 9 stages), each with a
  short beginner-level blurb shown on its placeholder page.
- **Problem Solving Techniques** page: Brute Force, Recursion, Divide and
  Conquer, Greedy, Backtracking, Dynamic Programming, Randomised
  Algorithms, Two Pointer, Sliding Window, Fast and Slow Pointers, Merge
  Intervals, Cyclic Sort, Two Heaps, Kth Element, Island Traversal and
  Multi-threaded. Each is explained as what it is, what it does, and where
  it is seen.
- Route overview now lists the stages and links to the source roadmap.
- Topics not in the old plan: Time vs Space, How to Calculate Complexity,
  Common Runtimes, all six sorts as separate entries, Tree Search,
  AVL Trees, B-Trees, Directed/Undirected Graphs, Bellman-Ford, A*,
  Fenwick/Segment/Suffix trees, Indexing.

## Changed

- Sidebar is now one route instead of three. The route ID changed from
  `data-structures` to `dsa`.
- Order follows the roadmap rather than the old Foundation / Linear /
  Trees & Graphs grouping.
- Existing finished pages kept and re-mapped: Array, Linked Lists, Stacks,
  Queues (shared Stacks & Queues page), Hash Tables, Big-O.

## Removed

- Algorithms route and Patterns route (their placeholder topics, such as
  Greedy, Backtracking, Dynamic Programming and the pattern list, are now
  covered by the single Problem Solving page or dropped).
- Topics with no counterpart in the new plan: Recursion (now a technique
  card), Strings, Matrix, Deques, Balanced Trees (AVL is kept), Topological
  Sort, Floyd-Warshall, Bit Manipulation, Number Theory, String Matching.
- The **Strings** page is no longer linked from the sidebar. Its files
  (`Strings.jsx`, `StringsVisuals.*`) are still in the repo.

## Not included from the roadmap

Pick a Language, Programming Fundamentals, "What are Data Structures?",
"Why are they important?", Big-Theta and Big-Omega as separate pages
(mentioned in the Big-O blurb), "Complex Data Structures" (B/B+ Trees,
Skip List, ISAM, 2-3 Trees), and "Platforms to Practice".

## Upgrade notes

- Bookmarks or code referring to topic IDs from the old plan (for example
  `bst`, `heaps`, `graphs`, `binary-trees`) will not match; check
  `src/topics.js` for the new IDs.
- Pages for the new topics are placeholders until written.
