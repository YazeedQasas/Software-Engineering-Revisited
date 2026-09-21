import './Sidebar.css'

function Sidebar({ topics, activeTopicId, onSelect }) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Software Engineering Revisited</h1>
      <nav>
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                className={
                  topic.id === activeTopicId
                    ? 'topic-button active'
                    : 'topic-button'
                }
                onClick={() => onSelect(topic.id)}
              >
                {topic.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
