function DataStructuresOverview({ topic }) {
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
    </article>
  )
}

export default DataStructuresOverview
