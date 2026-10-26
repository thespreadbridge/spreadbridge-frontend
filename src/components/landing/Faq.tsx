import { homeFaqs } from '@/lib/public-faq';



export function Faq() {
  return (
    <section className="sb-section">
      <div className="shell">
        <span className="sb-eyebrow">자주 묻는 질문</span>
        <h2 className="sb-h2">자주 묻는 질문</h2>
        <div className="sb-faq-list">
          {homeFaqs.map(({ question: q, answer: a }) => (
            <details key={q} className="sb-faq-item">
              <summary className="sb-faq-q">{q}</summary>
              <p className="sb-faq-a">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
