import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [showMessage, setShowMessage] = useState(false)
  const [fireworks, setFireworks] = useState([])
  const [confetti, setConfetti] = useState([])

  // Generate confetti particles
  useEffect(() => {
    const particles = []
    for (let i = 0; i < 150; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 3 + Math.random() * 4,
        color: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6', '#c9b1ff', '#fff'][Math.floor(Math.random() * 7)],
        size: 5 + Math.random() * 10
      })
    }
    setConfetti(particles)
  }, [])

  // Generate fireworks
  useEffect(() => {
    const createFirework = () => {
      const newFirework = {
        id: Date.now() + Math.random(),
        left: 10 + Math.random() * 80,
        bottom: 20 + Math.random() * 40,
        color: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6', '#fff'][Math.floor(Math.random() * 6)]
      }
      setFireworks(prev => [...prev.slice(-8), newFirework])
    }

    const interval = setInterval(createFirework, 800)
    return () => clearInterval(interval)
  }, [])

  // Animate message appearance
  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="celebration-container">
      {/* Animated Background Gradient */}
      <div className="background-gradient"></div>

      {/* Stars */}
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              '--size': `${2 + Math.random() * 3}px`
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      <div className="confetti-container">
        {confetti.map(particle => (
          <div
            key={particle.id}
            className="confetti"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          />
        ))}
      </div>

      {/* Fireworks */}
      <div className="fireworks-container">
        {fireworks.map(fw => (
          <div
            key={fw.id}
            className="firework"
            style={{
              left: `${fw.left}%`,
              bottom: `${fw.bottom}%`,
              '--fw-color': fw.color
            }}
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="firework-particle"
                style={{ '--angle': `${i * 30}deg` }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className={`celebration-card ${showMessage ? 'show' : ''}`}>
        <div className="card-glow"></div>

        {/* Decorative elements */}
        <div className="decoration-top-left">✨</div>
        <div className="decoration-top-right">🎆</div>
        <div className="decoration-bottom-left">🎇</div>
        <div className="decoration-bottom-right">✨</div>

        {/* Year Display */}
        <div className="year-display">
          <span className="year-old">2024</span>
          <span className="year-arrow">→</span>
          <span className="year-new">2025</span>
        </div>

        {/* Main Message */}
        <h1 className="main-title">
          <span className="title-word">Happy</span>
          <span className="title-word">New</span>
          <span className="title-word">Year!</span>
        </h1>

        {/* Subtitle */}
        <p className="subtitle">
          Wishing you a year filled with joy, success, and endless possibilities!
        </p>

        {/* Animated divider */}
        <div className="divider">
          <span className="divider-star">⭐</span>
        </div>

        {/* Greeting Message */}
        <div className="greeting-box">
          <p className="greeting-text">
            May all your dreams come true and every moment be magical!
            Here's to new beginnings, new adventures, and new memories! 🎉
          </p>
        </div>

        {/* Countdown style numbers */}
        <div className="celebration-numbers">
          <span>2</span>
          <span>0</span>
          <span>2</span>
          <span>5</span>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="bottom-decoration">
        <span>🎊</span>
        <span>🥂</span>
        <span>🎉</span>
        <span>🎊</span>
      </div>
    </div>
  )
}

export default App
