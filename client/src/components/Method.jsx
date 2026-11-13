import Icon from './Icon'
import { method } from '../data/content'

export default function Method() {
  return (
    <section className="section method" id="method">
      <div className="container">
        <div className="section-head method__head">
          <div>
            <p className="eyebrow">
              <span className="status-dot status-dot--dark" />
              The approach
            </p>
            <h2 className="section-title">
              Simple, sustainable, <em>yours.</em>
            </h2>
          </div>
          <p className="section-head__copy">
            No crash plans. No all-or-nothing rules. Just a clear four-step method that meets you where you
            are and keeps you moving forward.
          </p>
        </div>

        <div className="method__grid">
          {method.map((step, index) => (
            <article
              key={step.number}
              className="method-card"
              data-reveal
              style={{ '--delay': `${index * 90}ms` }}
            >
              <span className="method-card__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span className="method-card__line" aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="method__banner" data-reveal>
          <div className="method__banner-icon">
            <Icon name="leaf" size={26} />
          </div>
          <p>
            <strong>Results that stay.</strong> Because the goal was never a number on a scale — it’s a body
            and mind you feel at home in.
          </p>
          <a href="#contact" className="btn btn--light btn--sm">
            Start your journey
            <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
