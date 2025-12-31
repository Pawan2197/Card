import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './StrangerThings.css'

// Ash Particles Canvas
function AshParticles() {
    const canvasRef = useRef(null)
    const particlesRef = useRef([])
    const animationRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Create particles
        const particleCount = 200
        particlesRef.current = []

        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedY: -(Math.random() * 0.5 + 0.2),
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                wobble: Math.random() * Math.PI * 2
            })
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current.forEach(particle => {
                particle.wobble += 0.02
                particle.x += particle.speedX + Math.sin(particle.wobble) * 0.3
                particle.y += particle.speedY

                if (particle.y < -10) {
                    particle.y = canvas.height + 10
                    particle.x = Math.random() * canvas.width
                }

                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(180, 180, 180, ${particle.opacity})`
                ctx.fill()
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationRef.current)
        }
    }, [])

    return <canvas ref={canvasRef} className="ash-canvas" />
}

// Character Card Component
function CharacterCard({ image, name, delay, isVisible }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="character-card"
                    initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{
                        duration: 1.2,
                        delay: delay,
                        type: "spring",
                        stiffness: 100
                    }}
                >
                    <div className="character-glow"></div>
                    <img src={image} alt={name} className="character-image" />
                    <motion.div
                        className="character-name"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: delay + 0.5, duration: 0.5 }}
                    >
                        {name}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Title Sequence
function TitleSequence({ show, phase }) {
    return (
        <AnimatePresence mode="wait">
            {show && phase === 'title' && (
                <motion.div
                    className="title-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1 }}
                >
                    <motion.h1
                        className="main-title"
                        initial={{ letterSpacing: '50px', opacity: 0 }}
                        animate={{ letterSpacing: '15px', opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    >
                        THE UPSIDE DOWN
                    </motion.h1>
                    <motion.p
                        className="subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                    >
                        Presents
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Countdown Component
function Countdown({ count, show }) {
    const messages = {
        3: "Opening the gate...",
        2: "The darkness awaits...",
        1: "Welcome to 2026!",
        0: "HAPPY NEW YEAR!"
    }

    return (
        <AnimatePresence mode="wait">
            {show && count !== null && (
                <motion.div
                    key={count}
                    className="countdown-container"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="countdown-message">{messages[count]}</span>
                    {count > 0 && (
                        <motion.span
                            className="countdown-number"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {count}
                        </motion.span>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Portal Effect
function Portal({ active }) {
    return (
        <motion.div
            className="portal"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: active ? 60 : 0,
                opacity: active ? 1 : 0
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        />
    )
}

// Audio Component
function IntroAudio({ isPlaying }) {
    const audioRef = useRef(null)

    useEffect(() => {
        // Create eerie synth sound using Web Audio API
        if (isPlaying) {
            const AudioContext = window.AudioContext || window.webkitAudioContext
            const audioContext = new AudioContext()

            // Create eerie drone sound
            const createDrone = (freq, startTime, duration) => {
                const oscillator = audioContext.createOscillator()
                const gainNode = audioContext.createGain()
                const filter = audioContext.createBiquadFilter()

                oscillator.connect(filter)
                filter.connect(gainNode)
                gainNode.connect(audioContext.destination)

                oscillator.type = 'sawtooth'
                oscillator.frequency.setValueAtTime(freq, startTime)
                oscillator.frequency.exponentialRampToValueAtTime(freq * 1.02, startTime + duration)

                filter.type = 'lowpass'
                filter.frequency.setValueAtTime(400, startTime)

                gainNode.gain.setValueAtTime(0, startTime)
                gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.5)
                gainNode.gain.linearRampToValueAtTime(0.06, startTime + duration - 0.5)
                gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

                oscillator.start(startTime)
                oscillator.stop(startTime + duration)
            }

            // Create arpeggio
            const createArpeggio = (baseFreq, startTime) => {
                const notes = [1, 1.25, 1.5, 2]
                notes.forEach((mult, i) => {
                    const osc = audioContext.createOscillator()
                    const gain = audioContext.createGain()

                    osc.connect(gain)
                    gain.connect(audioContext.destination)

                    osc.type = 'sine'
                    osc.frequency.value = baseFreq * mult

                    const noteStart = startTime + i * 0.3
                    gain.gain.setValueAtTime(0, noteStart)
                    gain.gain.linearRampToValueAtTime(0.1, noteStart + 0.05)
                    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.8)

                    osc.start(noteStart)
                    osc.stop(noteStart + 1)
                })
            }

            const now = audioContext.currentTime

            // Play eerie intro
            createDrone(55, now, 8)
            createDrone(82.5, now + 0.5, 7.5)
            createArpeggio(220, now + 1)
            createArpeggio(165, now + 3)
            createArpeggio(220, now + 5)

            audioRef.current = audioContext

            return () => {
                audioContext.close()
            }
        }
    }, [isPlaying])

    return null
}

// Main Intro Component  
function StrangerThingsIntro({ onComplete }) {
    const [phase, setPhase] = useState('start') // start, characters, title, countdown, portal
    const [showCharacters, setShowCharacters] = useState(false)
    const [showTitle, setShowTitle] = useState(false)
    const [countdown, setCountdown] = useState(null)
    const [portalActive, setPortalActive] = useState(false)
    const [lightningActive, setLightningActive] = useState(false)
    const [audioStarted, setAudioStarted] = useState(false)

    // Start audio on first interaction
    useEffect(() => {
        const startAudio = () => {
            setAudioStarted(true)
            document.removeEventListener('click', startAudio)
        }
        document.addEventListener('click', startAudio)
        // Also try to auto-start
        setAudioStarted(true)
        return () => document.removeEventListener('click', startAudio)
    }, [])

    // Lightning flashes
    useEffect(() => {
        const interval = setInterval(() => {
            setLightningActive(true)
            setTimeout(() => setLightningActive(false), 100)
            setTimeout(() => {
                setLightningActive(true)
                setTimeout(() => setLightningActive(false), 80)
            }, 150)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    // Sequence timing
    useEffect(() => {
        // Phase 1: Show characters after 0.5s
        const charTimer = setTimeout(() => {
            setPhase('characters')
            setShowCharacters(true)
        }, 500)

        // Phase 2: Show title after 4s
        const titleTimer = setTimeout(() => {
            setPhase('title')
            setShowCharacters(false)
            setShowTitle(true)
        }, 4000)

        // Phase 3: Countdown after 7s
        const countdownTimer = setTimeout(() => {
            setPhase('countdown')
            setShowTitle(false)
            setCountdown(3)
        }, 7000)

        return () => {
            clearTimeout(charTimer)
            clearTimeout(titleTimer)
            clearTimeout(countdownTimer)
        }
    }, [])

    // Countdown sequence
    useEffect(() => {
        if (countdown === null) return

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else if (countdown === 0) {
            const timer = setTimeout(() => {
                setPhase('portal')
                setPortalActive(true)
                setTimeout(onComplete, 1500)
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [countdown, onComplete])

    const characters = [
        { image: '/images/mind_flayer.jpg', name: 'The Mind Flayer', delay: 0 },
        { image: '/images/demogorgon.jpg', name: 'Demogorgon', delay: 0.3 },
        { image: '/images/hero.jpg', name: 'The Hero', delay: 0.6 }
    ]

    return (
        <div className="stranger-things-container">
            {/* Audio */}
            <IntroAudio isPlaying={audioStarted} />

            {/* Background */}
            <div className="upside-down-bg" />

            {/* Ash particles */}
            <AshParticles />

            {/* Red vignette on lightning */}
            <motion.div
                className="lightning-flash"
                animate={{ opacity: lightningActive ? 0.3 : 0 }}
                transition={{ duration: 0.1 }}
            />

            {/* Character Cards */}
            <div className="characters-container">
                {characters.map((char, i) => (
                    <CharacterCard
                        key={char.name}
                        image={char.image}
                        name={char.name}
                        delay={char.delay}
                        isVisible={showCharacters}
                    />
                ))}
            </div>

            {/* Title */}
            <TitleSequence show={showTitle} phase={phase} />

            {/* Countdown */}
            <Countdown count={countdown} show={phase === 'countdown'} />

            {/* Portal */}
            <Portal active={portalActive} />

            {/* Skip button */}
            <motion.button
                className="skip-button"
                onClick={onComplete}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
            >
                Skip Intro →
            </motion.button>
        </div>
    )
}

export default StrangerThingsIntro
