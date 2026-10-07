# Software Engineering Revisited

An interactive study site for **data structures and algorithms**, written in
Python and built with React. Every topic is explained from first principles
for a beginner, with real code, small animated diagrams, a cost table, and a
quiz you can test yourself on.

I'm building it to learn the material properly, by explaining each idea well
enough that someone with no background could follow it. If you're reviewing
this repo, the quickest way to judge the work is to open one finished page
(for example **Hash Tables** or **Linked Lists**) and read it top to bottom.

## What's inside

The curriculum follows the [roadmap.sh Data Structures & Algorithms
roadmap](https://roadmap.sh/datastructures-and-algorithms): **40 topics across
9 sections**, all in Python. Every topic has a page. Some are fully written;
the rest show a short plain-English summary until their turn comes.

| # | Section | Topics | Status |
|---|---------|--------|--------|
| 1 | Basic Data Structures | Arrays, Linked Lists, Queues, Stacks, Hash Tables | **Written** (all 5) |
| 2 | Algorithmic Complexity | Time vs Space, Calculating Complexity, Big-O, Common Runtimes | all four written |
| 3 | Sorting Algorithms | Bubble, Insertion, Selection, Merge, Quick, Heap | Planned |
| 4 | Search Algorithms | Linear, Binary | Planned |
| 5 | Tree Data Structures | Tree search, Traversals, Binary Trees, BST, AVL, B-Trees, Heaps | Planned |
| 6 | Graph Data Structures | Directed, Undirected, BFS/DFS, Dijkstra, Bellman-Ford, A*, Prim's, Kruskal's | Planned |
| 7 | Advanced Data Structures | Trie, Segment Tree, Fenwick Tree, Union-Find, Suffix Trees | Planned |
| 8 | Indexing | Linear, Tree-based | Planned |
| 9 | Problem Solving | Techniques overview (recursion, greedy, backtracking, DP, two pointers, and more) | Written |

Progress is tracked release by release in [CHANGELOG.md](CHANGELOG.md). The
current release is **0.2**, which adds the Algorithmic Complexity pages
(Time vs Space, How to Calculate Complexity, Common Runtimes) on top of the
five Basic Data Structures pages from 0.1.

## What a finished page looks like

Every rebuilt page follows the same structure, so you always know where to
look:

1. **One-page recap**: a two-column "paper" summary of the whole page, so you
   can skim it for a quick refresher.
2. **What it is**, in one sentence.
3. **The problem it solves**: why the structure exists and what goes wrong
   without it.
4. **The core idea**: the one insight that makes it work, usually with an
   analogy.
5. **How it works**: a small concrete example walked through step by step,
   with a diagram and runnable Python.
6. **What each operation costs**: a table of time and extra-space complexity,
   including the worst case and what causes it.
7. **Trade-offs**: how it compares with its nearest alternatives.
8. **When to use it**: real situations where you'd pick it.
9. **Test yourself**: a quiz where you guess the time and space complexity
   before the answer is revealed.

Pages are written to be read by a beginner: new terms are explained where
they first appear, and later pages build on earlier ones (for example,
Hash Tables leans on what Arrays taught about mutability).

![Hand-drawn graph of time vs. input size comparing Big-O growth curves, from best to worst: O(1), O(log n), O(√n), O(n), O(n log n), O(n²), O(2^n), O(n!)](src/assets/image.png)

## Tech stack

- **React 19** and **Vite** for the app and dev server
- Plain **CSS** (no UI framework), with hand-built **SVG** diagrams
- **oxlint** for linting
- No backend and no database: it's a static site

## Run it locally

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Other commands:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run oxlint
```

## Project layout

```
src/
  topics.js                  The curriculum: every section and topic, with its summary
  App.jsx                    Layout and navigation state (section + topic)
  components/
    Sidebar.jsx              Left sidebar: the 9 sections
    SubtopicSidebar.jsx      Second sidebar: the topics in the chosen section
    ComplexityQuiz.jsx       The "guess the complexity" quiz used on every page
  pages/
    index.js                 Maps a topic id to its page component
    Placeholder.jsx          Shown for topics that aren't written yet
    dataStructures/          One page per topic (e.g. HashTables.jsx), plus a
                             matching *Visuals.jsx file holding its diagrams
  styles/
    notebook.css             Shared look: code blocks, callouts, tables, paper recap
    visualAnimations.css     Shared animations for the diagrams
docs/releases/               Longer release notes for major releases
CHANGELOG.md                 What changed in each release
```

## Adding a topic

1. Add its entry to `src/topics.js` (a short summary is enough to start).
   It shows up automatically in the sidebar with a placeholder page.
2. When it's ready to write, create the page in
   `src/pages/dataStructures/`, with a `Visuals` file for its diagrams.
3. Register the page in `src/pages/index.js` against the topic's id.

## Roadmap

Next up is finishing the Data Structures route (a rebuild of the Big-O and
Problem Solving pages to match the structure above), then Sorting and
Searching, followed by Trees, Graphs and the advanced structures.
