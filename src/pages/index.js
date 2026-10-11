import DataStructuresOverview from './dataStructures/Overview.jsx'
import TimeVsSpace from './dataStructures/TimeVsSpace.jsx'
import HowToCalculate from './dataStructures/HowToCalculate.jsx'
import CommonRuntimes from './dataStructures/CommonRuntimes.jsx'
import BubbleSort from './dataStructures/BubbleSort.jsx'
import InsertionSort from './dataStructures/InsertionSort.jsx'
import SelectionSort from './dataStructures/SelectionSort.jsx'
import MergeSort from './dataStructures/MergeSort.jsx'
import QuickSort from './dataStructures/QuickSort.jsx'
import HeapSort from './dataStructures/HeapSort.jsx'
import BigO from './dataStructures/BigO.jsx'
import Arrays from './dataStructures/Arrays.jsx'
import HashTables from './dataStructures/HashTables.jsx'
import LinkedLists from './dataStructures/LinkedLists.jsx'
import Queues from './dataStructures/Queues.jsx'
import Stacks from './dataStructures/Stacks.jsx'
import ProblemSolving from './dataStructures/ProblemSolving.jsx'

export const topicPages = {
  dsa: {
    overview: DataStructuresOverview,
    subtopics: {
      arrays: Arrays,
      'linked-lists': LinkedLists,
      queues: Queues,
      stacks: Stacks,
      'hash-tables': HashTables,
      'time-vs-space': TimeVsSpace,
      'calculate-complexity': HowToCalculate,
      'common-runtimes': CommonRuntimes,
      'bubble-sort': BubbleSort,
      'insertion-sort': InsertionSort,
      'selection-sort': SelectionSort,
      'merge-sort': MergeSort,
      'quick-sort': QuickSort,
      'heap-sort': HeapSort,
      'big-o': BigO,
      'problem-solving': ProblemSolving,
    },
  },
}
