import Icon from './Icon'
import { posts } from '../data/posts'

export default function Blog() {
  return (
    <section className="section blog blog--home" id="blog">
      <div className="container blog__home-wrap">
        <div className="blog__home-card" data-reveal>
          <div className="blog__home-avatar" aria-hidden="true">
            <img src="/images/logo.jpeg" alt="" />
          </div>
          <div className="blog__home-copy">
            <p className="eyebrow">
              <span className="status-dot status-dot--dark" />
              From the community · Explore and grow
            </p>
            <h2>Her Space <em>Studio.</em></h2>
            <p>Practical fitness, nutrition and wellness insights for women building a stronger everyday routine.</p>
          </div>
          <a href="http://localhost:4173/blog" className="blog__home-cta">
            <span>Visit the blog</span>
            <span className="blog__home-cta-icon"><Icon name="arrowUpRight" size={19} /></span>
          </a>
        </div>
      </div>
    </section>
  )
}
