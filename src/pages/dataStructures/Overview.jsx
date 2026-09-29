const categoryOrder = [
  'Foundation',
  'Core Linear Structures',
  'Trees & Graphs',
  'Good to Know',
]

function DataStructuresOverview({ topic }) {
  const groups = categoryOrder
    .map((category) => ({
      category,
      items: topic.children.filter((child) => child.category === category),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <article className="topic-page">
      <h2>{topic.label}</h2>

      <div className="callout">
        <strong>Interviewer tip:</strong> beyond knowing each structure,
        interviewers love trade-off questions like &ldquo;array vs. linked
        list?&rdquo; or &ldquo;hash map vs. BST?&rdquo; &mdash; for every
        structure, be ready to say what it&rsquo;s good at, what it&rsquo;s
        bad at, and when you&rsquo;d choose it.
      </div>

      <p>Pick a topic from the sidebar to open its page.</p>

      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="notebook-category">{group.category}</h3>
          <ul className="plain-list">
            {group.items.map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong> &mdash; {item.blurb}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </article>
  )
}

export default DataStructuresOverview
