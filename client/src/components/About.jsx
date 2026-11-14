import Icon from './Icon'
import { contactInfo } from '../data/content'

const credentials = [
  { title: 'Certified Fitness Coach', text: 'Personalised strength and conditioning for women.' },
  { title: 'Certified Nutritionist', text: 'Practical guidance for sustainable, everyday results.' },
  { title: 'Women-only Coaching', text: 'Support, accountability and confidence in every session.' },
]

export default function About() {
  return (
    <section className="section about about--qualifications" id="about">
      <div className="container about__qualifications-frame">
        <div className="about__qualifications-media" data-reveal>
          <div className="about__qualifications-photo">
            <img
              src="/images/image2/DSC00469.JPG"
              alt="Shanthi Kasiraj, fitness coach and nutritionist, speaking to camera"
              width="1080"
              height="1350"
              loading="lazy"
            />
            <span className="about__qualifications-tag">Shanthi Kasiraj</span>
          </div>
          <p className="about__qualifications-caption">Strength · confidence · sustainable change</p>
        </div>

        <div className="about__qualifications-copy" data-reveal style={{ '--delay': '100ms' }}>
          <p className="eyebrow eyebrow--light"><span className="status-dot" /> About your coach</p>
          <h2>Qualifications <em>&amp; Approach</em></h2>
          <p className="about__qualifications-intro">
            Shanthi Kasiraj is a certified fitness coach and nutritionist who helps women transform their bodies and routines through sustainable, realistic coaching.
          </p>

          <div className="about__credentials">
            {credentials.map((credential) => (
              <div className="about__credential" key={credential.title}>
                <span className="about__credential-icon"><Icon name="check" size={17} strokeWidth="2.2" /></span>
                <span><strong>{credential.title}</strong><small>{credential.text}</small></span>
              </div>
            ))}
          </div>

          <blockquote className="about__quote-card">
            <span className="about__quote-mark">“</span>
            <p>Strength is not about changing everything overnight — it is about showing up consistently for yourself.</p>
            <cite>— Shanthi Kasiraj, Founder &amp; Coach</cite>
          </blockquote>

          <a href={contactInfo.phoneHref} className="about__qualifications-link">Talk to Shanthi Kasiraj <Icon name="arrowUpRight" size={17} /></a>
        </div>
      </div>
    </section>
  )
}
