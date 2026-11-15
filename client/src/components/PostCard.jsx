import Icon from './Icon'
import { topicLabel } from '../data/blog'
import { Link } from '../router'

export default function PostCard({ post, index = 0 }) {
  return (
    <article className="journal-card" style={{ '--delay': `${Math.min(index, 5) * 70}ms` }}>
      <Link to={`/blog/${post.slug}`} className="journal-card__media" aria-label={`Read ${post.title}`}>
        <img src={post.cover} alt={post.coverAlt} loading="lazy" decoding="async" />
        <span className="journal-chip">{topicLabel(post.topics[0])}</span>
        <span className="journal-card__arrow" aria-hidden="true">
          <Icon name="arrowUpRight" size={17} />
        </span>
      </Link>
      <div className="journal-card__body">
        <p className="journal-card__meta">
          <span><Icon name="calendar" size={13} />{post.dateLabel}</span>
          <span className="journal-card__dot" aria-hidden="true" />
          <span><Icon name="clock" size={13} />{post.readTime} min read</span>
        </p>
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p className="journal-card__excerpt">{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="journal-card__cta">
          Read article
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </article>
  )
}
