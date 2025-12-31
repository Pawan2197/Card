import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import gsap from 'gsap'
import './App.css'

function App() {
  const [init, setInit] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [countdownComplete, setCountdownComplete] = useState(false)
  const [explosions, setExplosions] = useState([])

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !countdownComplete) {
      setCountdownComplete(true)
      setTimeout(() => setShowCard(true), 500)
      setTimeout(() => setShowTitle(true), 1200)

      // Create multiple explosions
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          setExplosions(prev => [...prev, {
            id: Date.now() + i,
            x: 10 + Math.random() * 80,
            y: 20 + Math.random() * 50
          }])
        }, i * 200)
      }
    }
  }, [countdown, countdownComplete])

  // GSAP animations for numbers
  useEffect(() => {
    if (showTitle) {
      gsap.fromTo('.number-item',
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.5)'
        }
      )
    }
  }, [showTitle])

  // Continuous explosion effect
  useEffect(() => {
    if (countdownComplete) {
      const interval = setInterval(() => {
        setExplosions(prev => [...prev.slice(-12), {
          id: Date.now(),
          x: 5 + Math.random() * 90,
          y: 10 + Math.random() * 60
        }])
      }, 600)
      return () => clearInterval(interval)
    }
  }, [countdownComplete])

  const particlesLoaded = useCallback(async (container) => {
    console.log('Particles loaded', container)
  }, [])

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: true, zIndex: 0 },
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 120,
    particles: {
      color: {
        value: ["#FFD700", "#FF6B9D", "#00D4FF", "#FF6B6B", "#6BCB77", "#C9B1FF", "#FFFFFF"]
      },
      move: {
        direction: "bottom",
        enable: true,
        outModes: { default: "out" },
        random: true,
        speed: { min: 3, max: 8 },
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 150,
      },
      opacity: {
        value: { min: 0.3, max: 0.9 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
        }
      },
      shape: {
        type: ["circle", "square", "star"],
      },
      size: {
        value: { min: 2, max: 6 },
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: {
          enable: true,
          speed: 10,
        }
      },
      tilt: {
        enable: true,
        value: { min: 0, max: 360 },
        animation: {
          enable: true,
          speed: 30,
        }
      },
      wobble: {
        enable: true,
        distance: 30,
        speed: 15,
      }
    },
    detectRetina: true,
  }), [])

  const letters = "HAPPY NEW YEAR".split('')

  return (
    <div className="celebration-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Particles */}
      {init && countdownComplete && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particlesOptions}
        />
      )}

      {/* Firework Explosions */}
      <AnimatePresence>
        {explosions.map((explosion) => (
          <motion.div
            key={explosion.id}
            className="explosion"
            style={{ left: `${explosion.x}%`, top: `${explosion.y}%` }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="explosion-particle"
                style={{
                  '--angle': `${i * 22.5}deg`,
                  '--color': ['#FFD700', '#FF6B9D', '#00D4FF', '#FF6B6B', '#6BCB77'][i % 5]
                }}
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={{
                  x: Math.cos(i * 22.5 * Math.PI / 180) * 120,
                  y: Math.sin(i * 22.5 * Math.PI / 180) * 120,
                  scale: 0,
                  opacity: 0
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Countdown */}
      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            className="countdown"
            key={countdown}
            initial={{ scale: 0, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 2, opacity: 0, rotateY: 180 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            {countdown}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="celebration-card"
            initial={{ scale: 0, rotateX: 90, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 1
            }}
          >
            {/* Glow Effect */}
            <div className="card-glow"></div>
            <div className="card-sparkles">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="sparkle" style={{
                  '--delay': `${Math.random() * 3}s`,
                  '--x': `${Math.random() * 100}%`,
                  '--y': `${Math.random() * 100}%`,
                  '--size': `${4 + Math.random() * 8}px`
                }} />
              ))}
            </div>

            {/* Year Transition */}
            <motion.div
              className="year-transition"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="old-year">2025</span>
              <motion.span
                className="arrow"
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ✦
              </motion.span>
              <span className="new-year">2026</span>
            </motion.div>

            {/* Animated Title */}
            {showTitle && (
              <motion.div className="main-title">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    className="title-letter"
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: i * 0.06,
                      type: "spring",
                      stiffness: 300,
                      damping: 15
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Big Year Display */}
            {showTitle && (
              <div className="big-year">
                <span className="number-item">2</span>
                <span className="number-item">0</span>
                <span className="number-item">2</span>
                <span className="number-item">6</span>
              </div>
            )}

            {/* Subtitle */}
            <motion.p
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              ✨ Wishing you a year filled with magic, success & endless joy! ✨
            </motion.p>

            {/* Decorative Elements */}
            <div className="decorations">
              <motion.span
                className="deco deco-1"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >🎆</motion.span>
              <motion.span
                className="deco deco-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >🎊</motion.span>
              <motion.span
                className="deco deco-3"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >🎇</motion.span>
              <motion.span
                className="deco deco-4"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              >🥂</motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Celebration */}
      {showCard && (
        <motion.div
          className="bottom-celebration"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          {['🎉', '🎊', '✨', '🎆', '🥂', '🎇', '✨', '🎊', '🎉'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -20, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default App
