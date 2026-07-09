import { useState, useEffect } from 'react'

function HeroBackground({ posters }) {
  const [faceIndex, setFaceIndex] = useState(0)
  const faces = posters.slice(0, 4)

  useEffect(() => {
    if (faces.length < 2) return

    const interval = setInterval(() => {
      setFaceIndex((prev) => prev + 1)
    }, 4000)

    return () => clearInterval(interval)
  }, [faces.length])

  if (faces.length === 0) return null

  const rotation = faceIndex * -90

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1600px' }}>
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(-50vw) rotateY(${rotation}deg)`,
          transition: 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        {faces.map((poster, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${poster})`,
              transform: `rotateY(${i * 90}deg) translateZ(50vw)`,
              backfaceVisibility: 'hidden',
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
         background:
  'linear-gradient(to bottom, rgba(21,19,15,0.35) 0%, rgba(21,19,15,0.55) 50%, rgba(21,19,15,0.97) 100%)',
        }}
      />
    </div>
  )
}

export default HeroBackground