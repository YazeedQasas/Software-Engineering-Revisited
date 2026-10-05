import DataStructuresOverview from './dataStructures/Overview.jsx'
import BigO from './dataStructures/BigO.jsx'
import Arrays from './dataStructures/Arrays.jsx'
import Strings from './dataStructures/Strings.jsx'
import HashTables from './dataStructures/HashTables.jsx'
import LinkedLists from './dataStructures/LinkedLists.jsx'
import StacksQueues from './dataStructures/StacksQueues.jsx'

export const topicPages = {
  'data-structures': {
    overview: DataStructuresOverview,
    subtopics: {
      'big-o': BigO,
      arrays: Arrays,
      strings: Strings,
      'hash-tables': HashTables,
      'linked-lists': LinkedLists,
      'stacks-queues': StacksQueues,
    },
  },
}
