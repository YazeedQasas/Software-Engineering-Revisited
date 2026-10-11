import './SubtopicSidebar.css'

function SubtopicSidebar({ topic, section, activeSubtopicId, onSelectSubtopic }) {
  const items = topic?.children?.filter((child) => child.category === section)

  if (!items?.length) {
    return null
  }

  return (
    <aside className="subtopic-sidebar">
      <h2 className="subtopic-sidebar-title">{section}</h2>
      <nav>
        <ul className="subtopic-list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={
                  activeSubtopicId === item.id
                    ? 'subtopic-button active'
                    : 'subtopic-button'
                }
                onClick={() => onSelectSubtopic(item.id)}
              >
                <span className="subtopic-name">{item.label}</span>
                {item.badges?.map((badge) => (
                  <span key={badge} className="badge">{badge}</span>
                ))}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default SubtopicSidebar
