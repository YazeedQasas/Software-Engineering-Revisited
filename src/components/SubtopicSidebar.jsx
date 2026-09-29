import './SubtopicSidebar.css'

const categoryOrder = [
  'Foundation',
  'Core Linear Structures',
  'Trees & Graphs',
  'Good to Know',
]

function SubtopicSidebar({ topic, activeSubtopicId, onSelectSubtopic }) {
  if (!topic?.children?.length) {
    return null
  }

  const groups = categoryOrder
    .map((category) => ({
      category,
      items: topic.children.filter((child) => child.category === category),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <aside className="subtopic-sidebar">
      <h2 className="subtopic-sidebar-title">{topic.label}</h2>
      <nav>
        {groups.map((group) => (
          <div key={group.category} className="subtopic-group">
            <p className="subtopic-group-label">{group.category}</p>
            <ul className="subtopic-list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={
                      activeSubtopicId === item.id
                        ? 'subtopic-button active'
                        : 'subtopic-button'
                    }
                    onClick={() => onSelectSubtopic(topic.id, item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default SubtopicSidebar
