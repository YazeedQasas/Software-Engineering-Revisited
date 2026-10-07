import './Sidebar.css'

function Sidebar({ sections, activeSection, onSelectSection }) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Software Engineering Revisited</h1>
      <nav>
        <ul className="topic-list">
          {sections.map((section) => (
            <li key={section.name}>
              <button
                type="button"
                className={
                  section.name === activeSection
                    ? 'topic-button active'
                    : 'topic-button'
                }
                onClick={() => onSelectSection(section.name)}
              >
                {section.name}
                <span className="topic-count">{section.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
