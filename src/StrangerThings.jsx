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
        5: "The gate is opening...",
        4: "Prepare yourself...",
        3: "The darkness fades...",
        2: "Light approaches...",
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

// Audio Component - Plays Stranger Things Theme
function IntroAudio({ isPlaying, onComplete }) {
    const audioRef = useRef(null)

    useEffect(() => {
        if (isPlaying) {
            // Play actual Stranger Things theme
            if (!audioRef.current) {
                audioRef.current = new Audio('/sounds/stranger-things-124008.mp3')
                audioRef.current.volume = 0.7
            }
            audioRef.current.play().catch(e => console.log('Audio play failed:', e))
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }, [isPlaying])

    // Stop audio when intro completes
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                // Fade out
                const fadeOut = setInterval(() => {
                    if (audioRef.current && audioRef.current.volume > 0.1) {
                        audioRef.current.volume -= 0.1
                    } else {
                        clearInterval(fadeOut)
                        if (audioRef.current) {
                            audioRef.current.pause()
                        }
                    }
                }, 100)
            }
        }
    }, [])

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

    // Sequence timing - Extended to 20 seconds
    useEffect(() => {
        // Phase 1: Show characters after 1s (display for 6 seconds)
        const charTimer = setTimeout(() => {
            setPhase('characters')
            setShowCharacters(true)
        }, 1000)

        // Phase 2: Show title after 7s (display for 6 seconds)
        const titleTimer = setTimeout(() => {
            setPhase('title')
            setShowCharacters(false)
            setShowTitle(true)
        }, 7000)

        // Phase 3: Countdown after 13s
        const countdownTimer = setTimeout(() => {
            setPhase('countdown')
            setShowTitle(false)
            setCountdown(5) // 5 second countdown
        }, 13000)

        return () => {
            clearTimeout(charTimer)
            clearTimeout(titleTimer)
            clearTimeout(countdownTimer)
        }
    }, [])

    // Countdown sequence - 2 seconds per number with lightning
    useEffect(() => {
        if (countdown === null) return

        // Flash lightning on each countdown number
        if (countdown > 0) {
            setLightningActive(true)
            setTimeout(() => setLightningActive(false), 150)
            setTimeout(() => {
                setLightningActive(true)
                setTimeout(() => setLightningActive(false), 100)
            }, 200)
        }

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 2000) // 2 seconds per number
            return () => clearTimeout(timer)
        } else if (countdown === 0) {
            const timer = setTimeout(() => {
                setPhase('portal')
                setPortalActive(true)
                setTimeout(onComplete, 1500)
            }, 2000)
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

            {/* Lightning Bolt Lines */}
            {lightningActive && (
                <div className="lightning-bolts">
                    <div className="lightning-bolt bolt-1" key={`bolt1-${Date.now()}`}></div>
                    <div className="lightning-bolt bolt-2" key={`bolt2-${Date.now()}`}></div>
                    <div className="lightning-bolt bolt-3" key={`bolt3-${Date.now()}`}></div>
                </div>
            )}

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
