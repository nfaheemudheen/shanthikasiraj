import Icon from './Icon'
import { contactInfo, navLinks, socials } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta" data-reveal>
          <div>
            <p className="eyebrow eyebrow--light">
              <span className="status-dot" />
              Your next chapter
            </p>
            <h2>
              Ready to feel <em>strong?</em>
            </h2>
          </div>
          <a href="#contact" className="btn btn--accent">
            Book your consultation
            <Icon name="arrowUpRight" size={18} />
          </a>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <a href="#home" className="brand brand--footer" aria-label="Shanthi Kasiraj — back to top">
              <span className="brand__mark">SK</span>
              <span className="brand__text">
                <strong>Shanthi</strong>
                <small>Fitness &amp; Wellness</small>
              </span>
            </a>
            <p>
              Certified fitness coach &amp; nutritionist helping women build strength, confidence and a
              lifestyle that lasts.
            </p>
            <div className="footer__socials">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} — ${social.handle}`}
                >
                  <Icon name={social.icon} size={17} />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h3>Explore</h3>
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
            <a href="#contact">Contact</a>
          </nav>

          <div className="footer__col">
            <h3>Get in touch</h3>
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
            <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <span>{contactInfo.location}</span>
          </div>

          <div className="footer__col footer__col--hours">
            <h3>Studio hours</h3>
            <p>
              Monday – Saturday
              <strong>6:00 AM – 8:00 PM</strong>
            </p>
            <p>
              Sunday
              <strong>Rest &amp; recover</strong>
            </p>
            <span className="footer__note">
              <span className="status-dot" />
              Accepting new clients
            </span>
          </div>
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true">
        SHANTHI
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} Shanthi Kasiraj. All rights reserved.</p>
        
        <a href="#home" className="footer__top">
          Back to top
          <Icon name="arrowUp" size={14} />
        </a>
      </div>
    </footer>
  )
}
