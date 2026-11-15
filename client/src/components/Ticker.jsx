export default function Ticker({ items, className = '' }) {
  const row = (hidden) => (
    <div className="ticker__row" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <span className="ticker__item" key={`${item}-${index}`}>
          <span>{item}</span>
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
