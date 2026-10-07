function DataStructuresOverview({ topic, section }) {
  const items = topic.children.filter((child) => child.category === section)

  return (
    <article className="topic-page">
      <p className="eyebrow">{topic.label}</p>
      <h2>{section}</h2>

      <p>Pick a topic from the second sidebar to open it.</p>

      {items.map((item) => (
        <div className="topic-card" key={item.id}>
          <h4>{item.label}</h4>
          <p>{item.blurb}</p>
        </div>
      ))}
    </article>
  )
}

export default DataStructuresOverview
