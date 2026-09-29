import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import SubtopicSidebar from './components/SubtopicSidebar.jsx'
import Placeholder from './pages/Placeholder.jsx'
import { topics } from './topics.js'
import { topicPages } from './pages/index.js'
import './App.css'

function App() {
  const firstTopic = topics[0]
  const [activeTopicId, setActiveTopicId] = useState(firstTopic.id)
  const [activeSubtopicId, setActiveSubtopicId] = useState(null)

  const activeTopic = topics.find((topic) => topic.id === activeTopicId)
  const activeChild = activeTopic?.children?.find(
    (child) => child.id === activeSubtopicId,
  )
  const pageEntry = topicPages[activeTopicId]

  const selectTopic = (topicId) => {
    setActiveTopicId(topicId)
    setActiveSubtopicId(null)
  }

  const selectSubtopic = (topicId, subtopicId) => {
    setActiveTopicId(topicId)
    setActiveSubtopicId(subtopicId)
  }

  let content
  if (activeSubtopicId && activeChild) {
    const SubtopicPage = pageEntry?.subtopics?.[activeSubtopicId]
    content = SubtopicPage ? (
      <SubtopicPage />
    ) : (
      <Placeholder
        eyebrow={activeTopic.label}
        title={activeChild.label}
        blurb={activeChild.blurb}
      />
    )
  } else {
    const OverviewPage = pageEntry?.overview
    content = OverviewPage ? (
      <OverviewPage topic={activeTopic} />
    ) : (
      <>
        <h2>{activeTopic.label}</h2>
        <p>Content coming soon.</p>
      </>
    )
  }

  return (
    <div className="app">
      <Sidebar
        topics={topics}
        activeTopicId={activeTopicId}
        onSelectTopic={selectTopic}
      />
      <SubtopicSidebar
        topic={activeTopic}
        activeSubtopicId={activeSubtopicId}
        onSelectSubtopic={selectSubtopic}
      />
      <div className="rings" aria-hidden="true" />
      <main className="content">{content}</main>
    </div>
  )
}

export default App
