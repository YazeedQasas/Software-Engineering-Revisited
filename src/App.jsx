import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import SubtopicSidebar from './components/SubtopicSidebar.jsx'
import Placeholder from './pages/Placeholder.jsx'
import { topics } from './topics.js'
import { topicPages } from './pages/index.js'
import './App.css'

function App() {
  const topic = topics[0]
  const sections = []
  for (const child of topic.children) {
    const existing = sections.find((s) => s.name === child.category)
    if (existing) {
      existing.count += 1
    } else {
      sections.push({ name: child.category, count: 1 })
    }
  }

  const [activeSection, setActiveSection] = useState(sections[0].name)
  const [activeSubtopicId, setActiveSubtopicId] = useState(null)

  const activeChild = topic.children.find(
    (child) => child.id === activeSubtopicId,
  )
  const pageEntry = topicPages[topic.id]

  const selectSection = (sectionName) => {
    setActiveSection(sectionName)
    setActiveSubtopicId(null)
  }

  const selectSubtopic = (subtopicId) => {
    setActiveSubtopicId(subtopicId)
  }

  let content
  if (activeSubtopicId && activeChild) {
    const SubtopicPage = pageEntry?.subtopics?.[activeSubtopicId]
    content = SubtopicPage ? (
      <SubtopicPage />
    ) : (
      <Placeholder
        eyebrow={activeSection}
        title={activeChild.label}
        blurb={activeChild.blurb}
      />
    )
  } else {
    const OverviewPage = pageEntry?.overview
    content = OverviewPage ? (
      <OverviewPage topic={topic} section={activeSection} />
    ) : (
      <>
        <h2>{topic.label}</h2>
        <p>Content coming soon.</p>
      </>
    )
  }

  return (
    <div className="app">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSelectSection={selectSection}
      />
      <SubtopicSidebar
        topic={topic}
        section={activeSection}
        activeSubtopicId={activeSubtopicId}
        onSelectSubtopic={selectSubtopic}
      />
      <div className="rings" aria-hidden="true" />
      <main className="content">{content}</main>
    </div>
  )
}

export default App
