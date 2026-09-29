import { useState } from 'react'
import './Sidebar.css'

function Sidebar({
  topics,
  activeTopicId,
  activeSubtopicId,
  onSelectTopic,
  onSelectSubtopic,
}) {
  const [expandedIds, setExpandedIds] = useState(() => new Set([activeTopicId]))

  const expand = (topicId) => {
    setExpandedIds((prev) => new Set(prev).add(topicId))
  }

  const toggleExpanded = (topicId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
      } else {
        next.add(topicId)
      }
      return next
    })
  }

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Software Engineering Revisited</h1>
      <nav>
        <ul className="topic-list">
          {topics.map((topic) => {
            const hasChildren = Boolean(topic.children?.length)
            const isExpanded = expandedIds.has(topic.id)
            const isTopicActive = activeTopicId === topic.id && !activeSubtopicId

            return (
              <li key={topic.id}>
                <div className="topic-row">
                  <button
                    type="button"
                    className={
                      isTopicActive ? 'topic-button active' : 'topic-button'
                    }
                    onClick={() => {
                      onSelectTopic(topic.id)
                      if (hasChildren) expand(topic.id)
                    }}
                  >
                    {topic.label}
                  </button>
                  {hasChildren && (
                    <button
                      type="button"
                      className={
                        isExpanded ? 'chevron-button open' : 'chevron-button'
                      }
                      aria-expanded={isExpanded}
                      aria-label={
                        isExpanded
                          ? `Collapse ${topic.label}`
                          : `Expand ${topic.label}`
                      }
                      onClick={() => toggleExpanded(topic.id)}
                    >
                      <span className="chevron" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <ul className="subtopic-list">
                    {topic.children.map((child) => (
                      <li key={child.id}>
                        <button
                          type="button"
                          className={
                            activeTopicId === topic.id &&
                            activeSubtopicId === child.id
                              ? 'subtopic-button active'
                              : 'subtopic-button'
                          }
                          onClick={() => onSelectSubtopic(topic.id, child.id)}
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
