import Icon from './Icon'
import { contactInfo, socials } from '../data/content'

const communityLinks = [
  ...socials,
  { label: 'WhatsApp', handle: 'Join the coaching community', href: contactInfo.whatsapp, icon: 'whatsapp' },
]

export default function Community() {
  return (
    <section className="section community" id="community">
      <div className="container community__inner">
        <div className="community__heading" data-reveal>
          <p className="eyebrow"><span className="status-dot status-dot--dark" /> The community</p>
          <h2>Keep showing up<br /><em>with us.</em></h2>
          <p>Follow along for workouts, nutrition ideas, encouragement and real-life progress from a community of women choosing themselves every day.</p>
        </div>
        <div className="community__links" data-reveal style={{ '--delay': '100ms' }}>
          {communityLinks.map((social) => (
            <a className="community__link" href={social.href} target="_blank" rel="noopener noreferrer" key={social.label}>
              <span className="community__link-icon"><Icon name={social.icon} size={20} /></span>
              <span><strong>{social.label}</strong><small>{social.handle}</small></span>
              <Icon name="arrowUpRight" size={17} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
