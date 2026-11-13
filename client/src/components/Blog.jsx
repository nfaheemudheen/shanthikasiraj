import Icon from './Icon'

const blogUrl = 'https://new-kappa-sand-18.vercel.app/blog'

export default function Blog() {
  return (
    <section className="section blog" id="blog">
      <div className="container blog__frame">
        <span className="blog__badge" aria-hidden="true"><img src="/images/logo.jpeg" alt="" /></span>
        <div className="blog__intro" data-reveal>
          <p className="eyebrow">
            <span className="status-dot" />
            From the community · Explore and grow
          </p>
          <h2 className="section-title">
            Her Space <em>Studio.</em>
          </h2>
          <p>
            Practical fitness, nutrition and wellness insights for women building a stronger everyday routine.
          </p>
        </div>

        <a
          className="blog__link"
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          style={{ '--delay': '100ms' }}
        >
          <span>Visit the blog</span>
          <span className="blog__link-arrow">
            <Icon name="arrowUpRight" size={20} />
          </span>
        </a>
      </div>
    </section>
  )
}
