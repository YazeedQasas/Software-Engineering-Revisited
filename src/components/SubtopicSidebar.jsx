import './SubtopicSidebar.css'

function SubtopicSidebar({ topic, activeSubtopicId, onSelectSubtopic }) {
  if (!topic?.children?.length) {
    return null
  }

  const categoryOrder = []
  for (const child of topic.children) {
    if (!categoryOrder.includes(child.category)) {
      categoryOrder.push(child.category)
    }
  }

  const groups = categoryOrder.map((category) => ({
    category,
    items: topic.children.filter((child) => child.category === category),
  }))

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
