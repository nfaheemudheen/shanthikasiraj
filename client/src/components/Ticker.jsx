import Icon from './Icon'

export default function Ticker({ items, className = '', icon = 'sparkle' }) {
  const row = (hidden) => (
    <div className="ticker__row" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <span className="ticker__item" key={`${item}-${index}`}>
          <span>{item}</span>
          <Icon name={icon} size={15} className="ticker__icon" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`ticker ${className}`} aria-hidden="true">
      <div className="ticker__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
