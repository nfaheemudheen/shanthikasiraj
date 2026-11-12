import { useId } from 'react'

export default function Seal({ text = 'CERTIFIED FITNESS COACH • NUTRITIONIST • ', center = 'SK', className = '' }) {
  const id = useId().replace(/:/g, '')
  const pathId = `seal-path-${id}`

  return (
    <div className={`seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="seal__ring">
        <defs>
          <path id={pathId} d="M 60,60 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0" />
        </defs>
        <text className="seal__text">
          <textPath href={`#${pathId}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="seal__center">{center}</span>
    </div>
  )
}
