import { useEffect, useState } from 'react'
import Icon from './Icon'
import { contactInfo, goalOptions, socials } from '../data/content'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  goal: '',
  message: '',
  consent: false,
  website: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const phone = values.phone.trim()
  const message = values.message.trim()

  if (name.length < 2) errors.name = 'Please tell me your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (phone) {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 15) errors.phone = 'Please enter a valid phone number.'
  }
  if (!values.goal) errors.goal = 'Choose what you’re interested in.'
  if (message.length < 10) errors.message = 'A little more detail helps me help you (10+ characters).'
  if (!values.consent) errors.consent = 'Please accept the privacy note so I can reply.'

  return errors
}

const nextSteps = [
  'I read your message and reply within 24 hours.',
  'We book a free 15-minute discovery call.',
  'You receive a plan built around your life.',
]

export default function Contact({ preselectedGoal, onGoalConsumed }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [formError, setFormError] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    if (!preselectedGoal) return
    setValues((current) => ({ ...current, goal: preselectedGoal }))
    setErrors((current) => ({ ...current, goal: undefined }))
  }, [preselectedGoal])

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormError('')
  }

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }))
    const fieldErrors = validate(values)
    setErrors((current) => ({ ...current, [field]: fieldErrors[field] }))
  }

  const showError = (field) => Boolean(touched[field] && errors[field])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    const nextErrors = validate(values)
    setTouched({ name: true, email: true, phone: true, goal: true, message: true, consent: true })

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setFormError('Almost there — please check the highlighted fields.')
      document.querySelector('.contact-form [aria-invalid="true"]')?.focus()
      return
    }

    setStatus('sending')
    setFormError('')
    setErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        setErrors(payload?.errors || {})
        setFormError(
          payload?.message ||
            'Something went wrong while sending. Please try again or email wellnesswithshanthikasiraj1@gmail.com.',
        )
        setStatus('idle')
        return
      }

      setLastName(values.name.trim().split(' ')[0])
      setStatus('success')
      setValues(EMPTY)
      setTouched({})
      onGoalConsumed?.()
    } catch (error) {
      setStatus('idle')
      setFormError(
        'I couldn’t reach the server. Please check your connection, or email wellnesswithshanthikasiraj1@gmail.com.',
      )
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__card" data-reveal>
          <div className="contact__info">
            <p className="eyebrow eyebrow--light">
              <span className="status-dot" />
              Let’s begin
            </p>
            <h2 className="contact__title">
              Let’s build your <em>strongest</em> chapter.
            </h2>
            <p className="contact__lead">
              Tell me where you are and where you want to go. I’ll come back to you within 24 hours with
              honest guidance and a clear next step.
            </p>

            <ul className="contact__details">
              <li>
                <span className="contact__detail-icon">
                  <Icon name="mail" size={19} />
                </span>
                <div>
                  <small>Email</small>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </div>
              </li>
              <li>
                <span className="contact__detail-icon">
                  <Icon name="phone" size={19} />
                </span>
                <div>
                  <small>Call</small>
                  <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
                </div>
              </li>
              <li>
                <span className="contact__detail-icon">
                  <Icon name="whatsapp" size={19} />
                </span>
                <div>
                  <small>WhatsApp</small>
                  <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
                    {contactInfo.whatsappLabel}
                  </a>
                </div>
              </li>
              <li>
                <span className="contact__detail-icon">
                  <Icon name="clock" size={19} />
                </span>
                <div>
                  <small>Studio hours</small>
                  <span>{contactInfo.hours}</span>
                </div>
              </li>
            </ul>

            <div className="contact__steps">
              <p className="contact__steps-title">What happens next</p>
              <ol>
                {nextSteps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="contact__socials">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} — ${social.handle}`}
                >
                  <Icon name={social.icon} size={18} />
                </a>
              ))}
              <span>Follow the everyday journey</span>
            </div>
          </div>

          <div className="contact__form-wrap">
            {status === 'success' ? (
              <div className="form-success" role="status">
                <span className="form-success__icon">
                  <Icon name="check" size={30} />
                </span>
                <p className="eyebrow">
                  <span className="status-dot status-dot--dark" />
                  Request received
                </p>
                <h3>Thank you{lastName ? `, ${lastName}` : ''}.</h3>
                <p>
                  Your consultation request is with me. I’ll reply within 24 hours — usually sooner. Keep an
                  eye on your inbox (and your WhatsApp).
                </p>
                <div className="form-success__actions">
                  <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--sm">
                    <Icon name="whatsapp" size={16} />
                    Message on WhatsApp
                  </a>
                  <button type="button" className="btn btn--outline btn--sm" onClick={() => setStatus('idle')}>
                    Send another request
                  </button>
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-form__head">
                  <h3>Book a free consultation</h3>
                  <p>No pressure, no commitment — just a conversation about you.</p>
                </div>

                {formError && (
                  <p className="form-alert" role="alert">
                    <Icon name="sparkle" size={16} />
                    {formError}
                  </p>
                )}

                <div className="form-row">
                  <div className={`field ${showError('name') ? 'has-error' : ''}`}>
                    <label htmlFor="name">
                      Full name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={values.name}
                      onChange={(event) => update('name', event.target.value)}
                      onBlur={() => handleBlur('name')}
                      aria-invalid={showError('name')}
                      aria-describedby={showError('name') ? 'name-error' : undefined}
                      required
                    />
                    {showError('name') && (
                      <p className="field__error" id="name-error">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className={`field ${showError('email') ? 'has-error' : ''}`}>
                    <label htmlFor="email">
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={(event) => update('email', event.target.value)}
                      onBlur={() => handleBlur('email')}
                      aria-invalid={showError('email')}
                      aria-describedby={showError('email') ? 'email-error' : undefined}
                      required
                    />
                    {showError('email') && (
                      <p className="field__error" id="email-error">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`field ${showError('phone') ? 'has-error' : ''}`}>
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 00000 00000"
                      value={values.phone}
                      onChange={(event) => update('phone', event.target.value)}
                      onBlur={() => handleBlur('phone')}
                      aria-invalid={showError('phone')}
                      aria-describedby={showError('phone') ? 'phone-error' : undefined}
                    />
                    {showError('phone') && (
                      <p className="field__error" id="phone-error">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className={`field ${showError('goal') ? 'has-error' : ''}`}>
                    <label htmlFor="goal">
                      I’m interested in <span aria-hidden="true">*</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        id="goal"
                        name="goal"
                        value={values.goal}
                        onChange={(event) => update('goal', event.target.value)}
                        onBlur={() => handleBlur('goal')}
                        aria-invalid={showError('goal')}
                        aria-describedby={showError('goal') ? 'goal-error' : undefined}
                        required
                      >
                        <option value="">Choose a focus…</option>
                        {goalOptions.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                      <Icon name="chevronRight" size={16} className="select-chevron" />
                    </div>
                    {showError('goal') && (
                      <p className="field__error" id="goal-error">
                        {errors.goal}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`field ${showError('message') ? 'has-error' : ''}`}>
                  <label htmlFor="message">
                    Tell me about your goals <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Where are you now, and what would you love to feel or achieve?"
                    value={values.message}
                    onChange={(event) => update('message', event.target.value)}
                    onBlur={() => handleBlur('message')}
                    aria-invalid={showError('message')}
                    aria-describedby={showError('message') ? 'message-error' : undefined}
                    maxLength={2000}
                    required
                  />
                  <span className="field__count">{values.message.length} / 2000</span>
                  {showError('message') && (
                    <p className="field__error" id="message-error">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Honeypot — hidden from people, tempting for bots */}
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={(event) => update('website', event.target.value)}
                  />
                </div>

                <div className={`consent ${showError('consent') ? 'has-error' : ''}`}>
                  <label htmlFor="consent">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      checked={values.consent}
                      onChange={(event) => update('consent', event.target.checked)}
                      onBlur={() => handleBlur('consent')}
                      aria-invalid={showError('consent')}
                      aria-describedby={showError('consent') ? 'consent-error' : undefined}
                    />
                    <span className="consent__box" aria-hidden="true">
                      <Icon name="check" size={12} />
                    </span>
                    <span>
                      I’m happy for Shanthi to contact me about my enquiry. My details stay private and are
                      never shared.
                    </span>
                  </label>
                  {showError('consent') && (
                    <p className="field__error" id="consent-error">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn btn--accent contact-form__submit" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send my request
                      <Icon name="arrowUpRight" size={18} />
                    </>
                  )}
                </button>

                <p className="contact-form__note">
                  <Icon name="clock" size={14} />
                  Typically responds within 24 hours · Mon–Sat
                </p>

                <div className="form-perks">
                  <span>
                    <Icon name="check" size={13} /> Personalised plan
                  </span>
                  <span>
                    <Icon name="check" size={13} /> Women-only coaching
                  </span>
                  <span>
                    <Icon name="check" size={13} /> No spam, ever
                  </span>
                </div>

                <div className="form-direct">
                  <p>Prefer to talk it through?</p>
                  <div className="form-direct__actions">
                    <a href={contactInfo.phoneHref}>
                      <Icon name="phone" size={14} /> Call
                    </a>
                    <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
                      <Icon name="whatsapp" size={14} /> WhatsApp
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
