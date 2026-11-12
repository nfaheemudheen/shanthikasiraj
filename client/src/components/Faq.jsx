import { useState } from 'react'
import Icon from './Icon'
import { faqs, contactInfo } from '../data/content'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="section faq" id="faq">
      <div className="container faq__grid">
        <div className="faq__intro" data-reveal>
          <p className="eyebrow">
            <span className="status-dot status-dot--dark" />
            Good questions
          </p>
          <h2 className="section-title">
            Before you <em>begin.</em>
          </h2>
          <p className="section-head__copy">
            Everything you might be wondering before your first session. Still curious? I’m one message
            away.
          </p>

          <div className="faq__card">
            <span className="faq__card-icon">
              <Icon name="whatsapp" size={22} />
            </span>
            <div>
              <strong>Prefer a quick chat?</strong>
              <p>Send a message on WhatsApp and I’ll reply personally.</p>
              <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="link-arrow">
                Message me
                <Icon name="arrowUpRight" size={15} />
              </a>
            </div>
          </div>
        </div>

        <div className="faq__list" data-reveal style={{ '--delay': '100ms' }}>
          {faqs.map((item, index) => {
            const isOpen = open === index
            return (
              <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="faq-item__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    <span className="faq-item__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="faq-item__question">{item.q}</span>
                    <span className="faq-item__icon">
                      <Icon name="plus" size={18} />
                    </span>
                  </button>
                </h3>
                <div
                  className="faq-item__panel"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                >
                  <div className="faq-item__panel-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
