import { useState } from 'react'
import Icon from './Icon'

export default function JournalNewsletter({ compact = false }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setStatus('error')
        setMessage(data.message || 'That did not work. Please try again in a moment.')
        return
      }
      setStatus('success')
      setMessage(data.message || 'You are on the list — see you in your inbox.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Could not reach the server. Please try again in a moment.')
    }
  }

  return (
    <section className={`journal-newsletter ${compact ? 'journal-newsletter--compact' : ''}`}>
      <div className={compact ? '' : 'container'}>
        <div className="journal-newsletter__frame" data-reveal>
          <div className="journal-newsletter__copy">
            <p className="eyebrow">
              <span className="status-dot status-dot--dark" />
              The Sunday note
            </p>
            <h2 className="section-title">
              One honest email, <em>every week.</em>
            </h2>
            <p>
              A short read on strength, food and hormones — plus the one habit I would give every woman.
              No spam, no selling, unsubscribe anytime.
            </p>
          </div>

          <form className="journal-form" onSubmit={submit}>
            <label htmlFor={compact ? 'journal-email-compact' : 'journal-email'}>Your email address</label>
            <div className="journal-form__row">
              <div className="journal-form__field">
                <Icon name="mail" size={18} />
                <input
                  id={compact ? 'journal-email-compact' : 'journal-email'}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (status !== 'idle') setStatus('idle')
                  }}
                  disabled={status === 'loading'}
                />
              </div>
              <button type="submit" className="journal-btn journal-btn--dark" disabled={status === 'loading'}>
                {status === 'loading' ? 'Joining…' : 'Join the list'}
                {status !== 'loading' && <Icon name="arrowRight" size={16} />}
              </button>
            </div>
            <p className={`journal-form__note ${status === 'error' ? 'is-error' : ''} ${status === 'success' ? 'is-success' : ''}`}>
              {status === 'success' && <Icon name="check" size={15} />}
              {message || 'A weekly read, sent with care. Around 4 minutes of your Sunday.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
