function Placeholder({ eyebrow, title, blurb }) {
  return (
    <article className="topic-page">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <div className="topic-card">
        <span className="status-tag">Not started</span>
        <p>{blurb}</p>
      </div>
    </article>
  )
}

export default Placeholder
