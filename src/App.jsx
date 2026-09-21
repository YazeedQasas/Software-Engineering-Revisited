import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import { topics } from './topics.js'
import './App.css'

function App() {
  const [activeTopicId, setActiveTopicId] = useState(topics[0].id)
  const activeTopic = topics.find((topic) => topic.id === activeTopicId)

  return (
    <div className="app">
      <Sidebar
        topics={topics}
        activeTopicId={activeTopicId}
        onSelect={setActiveTopicId}
      />
      <main className="content">
        <h2>{activeTopic.label}</h2>
        <p>Content coming soon.</p>
      </main>
    </div>
  )
}

export default App
