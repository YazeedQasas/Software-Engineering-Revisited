import bigOChart from '../../assets/image.png'

function BigO() {
  return (
    <article className="topic-page">
      <p className="eyebrow">Data Structures</p>
      <h2>Big-O Complexity</h2>

      <section className="notebook-section">
        <h3>Time Complexity</h3>
        <div className="pinned-photo">
          <img
            src={bigOChart}
            alt="Hand-drawn graph of time vs. input size (n) comparing Big-O growth curves, from best to worst: O(1), O(log n), O(√n), O(n), O(n log n), O(n²), O(2^n), O(n!)"
          />
        </div>
      </section>
    </article>
  )
}

export default BigO
