import { Suspense, useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Text3D, Center, Float, Stars, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import StrangerThingsIntro from './StrangerThings'
import './App.css'

// Real Earth Globe Component
function RealEarthGlobe() {
  const earthRef = useRef()
  const cloudsRef = useRef()
  const glowRef = useRef()
  const particlesRef = useRef()

  // Load Earth textures
  const [earthTexture, nightTexture, cloudsTexture] = useTexture([
    '/textures/earth_daymap.jpg',
    '/textures/earth_night.jpg',
    '/textures/earth_clouds.png'
  ])

  // Create particle overlay for golden shimmer
  const particles = useMemo(() => {
    const points = []
    const colors = []
    const radius = 2.55
    const particleCount = 3000

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      points.push(x, y, z)

      const gold = Math.random() * 0.3 + 0.7
      colors.push(1, gold, 0.2)
    }

    return {
      positions: new Float32Array(points),
      colors: new Float32Array(colors)
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 2) * 0.05
    }
  })

  return (
    <group position={[0, -0.5, 0]}>
      {/* Outer Glow */}
      <mesh ref={glowRef} scale={1.15}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Real Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          emissiveMap={nightTexture}
          emissive={new THREE.Color(0xffaa00)}
          emissiveIntensity={0.8}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef} scale={1.02}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Golden Particle Overlay */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Atmospheric Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.8, 64]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Floating 3D Geometric Shapes
function FloatingShape({ position, shape, color, scale = 1 }) {
  const meshRef = useRef()
  const rotationSpeed = useMemo(() => ({
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02,
  }), [])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x
      meshRef.current.rotation.y += rotationSpeed.y
      meshRef.current.rotation.z += rotationSpeed.z
    }
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case 'icosahedron':
        return <icosahedronGeometry args={[0.4 * scale, 0]} />
      case 'octahedron':
        return <octahedronGeometry args={[0.4 * scale, 0]} />
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.35 * scale, 0]} />
      default:
        return <icosahedronGeometry args={[0.4 * scale, 0]} />
    }
  }, [shape, scale])

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
      position={position}
    >
      <mesh ref={meshRef}>
        {geometry}
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  )
}

// 3D Firework
function Firework({ position, color }) {
  const pointsRef = useRef()
  const [exploded, setExploded] = useState(false)
  const [visible, setVisible] = useState(true)

  const particles = useMemo(() => {
    const points = []
    const count = 150

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const r = 0.01

      points.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
    }

    return new Float32Array(points)
  }, [])

  useEffect(() => {
    setTimeout(() => setExploded(true), 100)
    setTimeout(() => setVisible(false), 2500)
  }, [])

  useFrame(() => {
    if (pointsRef.current && exploded && visible) {
      const positions = pointsRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const direction = new THREE.Vector3(
          positions[i],
          positions[i + 1],
          positions[i + 2]
        ).normalize()

        positions[i] += direction.x * 0.06
        positions[i + 1] += direction.y * 0.06 - 0.008
        positions[i + 2] += direction.z * 0.06
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.material.opacity -= 0.006
    }
  })

  if (!visible) return null

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Fireworks Manager
function FireworksManager() {
  const [fireworks, setFireworks] = useState([])

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#00D4FF', '#FF6B9D', '#6BCB77', '#FFFFFF']

    const createFirework = () => {
      const newFirework = {
        id: Date.now() + Math.random(),
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 6 - 3
        ],
        color: colors[Math.floor(Math.random() * colors.length)]
      }
      setFireworks(prev => [...prev.slice(-10), newFirework])
    }

    const interval = setInterval(createFirework, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {fireworks.map(fw => (
        <Firework key={fw.id} position={fw.position} color={fw.color} />
      ))}
    </>
  )
}

// HTML Overlay for Text
function HtmlOverlay() {
  return (
    <div className="html-overlay">
      <h1 className="title-3d">HAPPY NEW YEAR</h1>
      <h2 className="year-3d">2026</h2>
    </div>
  )
}

// Main Scene
function Scene() {
  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#FFD700" />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#00D4FF" />
      <pointLight position={[0, -10, 5]} intensity={0.5} color="#FF6B9D" />
      <spotLight
        position={[5, 10, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#FFFFFF"
        castShadow
      />

      {/* Stars Background */}
      <Stars
        radius={100}
        depth={50}
        count={7000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Real Earth Globe with Textures */}
      <Suspense fallback={null}>
        <RealEarthGlobe />
      </Suspense>

      {/* Floating Geometric Shapes */}
      <FloatingShape position={[-4.5, -2.5, -1]} shape="icosahedron" color="#B8860B" scale={1.8} />
      <FloatingShape position={[-3.8, -3.2, 0.5]} shape="octahedron" color="#DAA520" scale={1.2} />
      <FloatingShape position={[4.5, -2.5, -1]} shape="dodecahedron" color="#B8860B" scale={1.8} />
      <FloatingShape position={[3.8, -3.2, 0.5]} shape="icosahedron" color="#DAA520" scale={1.2} />
      <FloatingShape position={[-5, 1, -2]} shape="octahedron" color="#FFD700" scale={0.8} />
      <FloatingShape position={[5, 1, -2]} shape="dodecahedron" color="#FFD700" scale={0.8} />

      {/* Fireworks */}
      <FireworksManager />

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.6}
        minPolarAngle={Math.PI / 3}
      />
    </>
  )
}

// Audio Manager Component - Plays Stranger Things theme
function AudioManager({ isPlaying }) {
  const themeAudioRef = useRef(null)
  const retryHandlersRef = useRef(null)

  useEffect(() => {
    // Create audio on mount - use Stranger Things theme
    if (!themeAudioRef.current) {
      themeAudioRef.current = new Audio('/sounds/stranger-things-124008.mp3')
      themeAudioRef.current.volume = 0.6
      themeAudioRef.current.loop = true
    }

    if (isPlaying) {
      // Try to play immediately
      themeAudioRef.current.play().catch(() => {
        // If blocked by browser, add listeners to retry on first interaction
        const retryPlay = () => {
          themeAudioRef.current?.play()
          document.removeEventListener('click', retryPlay)
          document.removeEventListener('touchstart', retryPlay)
          document.removeEventListener('keydown', retryPlay)
        }
        retryHandlersRef.current = retryPlay
        document.addEventListener('click', retryPlay)
        document.addEventListener('touchstart', retryPlay)
        document.addEventListener('keydown', retryPlay)
      })
    } else {
      themeAudioRef.current.pause()
      // Clean up retry handlers if sound is disabled
      if (retryHandlersRef.current) {
        document.removeEventListener('click', retryHandlersRef.current)
        document.removeEventListener('touchstart', retryHandlersRef.current)
        document.removeEventListener('keydown', retryHandlersRef.current)
      }
    }
  }, [isPlaying])

  return null
}

function App() {
  const [showIntro, setShowIntro] = useState(true) // Show Stranger Things intro first
  const [audioEnabled, setAudioEnabled] = useState(true) // Sound OFF by default - user clicks to enable

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
  }, [])

  // Stranger Things intro
  if (showIntro) {
    return <StrangerThingsIntro onComplete={handleIntroComplete} />
  }

  // New Year Celebration
  return (
    <div className="app-container">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(to bottom, #000510, #0a0a1a, #000510)' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Audio Manager - tries to auto-play, will play on first click if blocked */}
      <AudioManager isPlaying={audioEnabled} />

      {/* HTML Overlay for text */}
      <HtmlOverlay />

      {/* Sound Toggle - ON/OFF button */}
      <button
        className={`sound-toggle ${audioEnabled ? 'active' : ''}`}
        onClick={() => setAudioEnabled(!audioEnabled)}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>

      {/* Bottom Message */}
      <div className="bottom-message">
        <p>✨ Wishing you a year filled with magic, success & endless joy! ✨</p>
        <div className="emoji-row">
          <span>🎆</span>
          <span>🎊</span>
          <span>🌍</span>
          <span>🥂</span>
          <span>🎇</span>
        </div>
      </div>
    </div>
  )
}

export default App
