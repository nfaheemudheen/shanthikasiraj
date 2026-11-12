import Icon from './Icon'
import { services } from '../data/content'

export default function Services({ onChoose }) {
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section-head section-head--light">
          <div>
            <p className="eyebrow eyebrow--light">
              <span className="status-dot" />
              Work with me
            </p>
            <h2 className="section-title">
              What will I <em>give you?</em>
            </h2>
          </div>
          <p className="section-head__copy">
            Three ways to work together, one goal: a stronger, healthier you. Every programme is built
            around your body, your schedule and your real life.
          </p>
        </div>

        <div className="services__grid">
          {services.map((service, index) => (
            <article
              className="service-card"
              key={service.id}
              data-reveal
              style={{ '--delay': `${index * 100}ms` }}
            >
              <div className="service-card__media">
                <img src={service.image} alt={service.alt} width="640" height="480" loading="lazy" />
                <span className="service-card__tag">{service.tag}</span>
                <span className="service-card__number">{service.number}</span>
              </div>

              <div className="service-card__body">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-card__points">
                  {service.points.map((point) => (
                    <li key={point}>
                      <Icon name="check" size={13} />
                      {point}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="service-card__cta"
                  onClick={() => onChoose(service.short)}
                >
                  Start this programme
                  <span className="service-card__cta-icon">
                    <Icon name="arrowUpRight" size={18} />
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="services__note" data-reveal>
          <span className="services__note-icon">
            <Icon name="sparkle" size={22} />
          </span>
          <p>
            Not sure which one is right for you? <a href="#contact">Tell me your goal</a> and I’ll point you
            in the right direction — no pressure.
          </p>
        </div>
      </div>
    </section>
  )
}
