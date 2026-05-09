import { useEffect } from 'react'
import * as THREE from 'three'

const HERO_BG = 0x0d1b35
const GOLD    = 0xc9a84c

function isLowEndGPU() {
  try {
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl') || probe.getContext('experimental-webgl')
    if (!gl) return true
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ''
    return /Mali-4|Adreno \(TM\) 3|Adreno 3\d\d/i.test(renderer || '')
  } catch {
    return true
  }
}

/**
 * Mounts the gold particle dome onto a <canvas ref>.
 * Returns nothing — fully self-contained; cleans up on unmount.
 *
 *   const canvasRef = useRef(null)
 *   useThreeScene(canvasRef)
 */
export function useThreeScene(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isLowEndGPU() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none'
      return
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(HERO_BG, 0) // transparent — Kaaba photo shines through

    const scene  = new THREE.Scene()
    scene.fog    = new THREE.FogExp2(HERO_BG, 0.04)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 4

    // Particle dome (Fibonacci sphere)
    const particleCount = 4000
    const positions     = new Float32Array(particleCount * 3)
    const colors        = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const phi   = Math.acos(1 - 2 * (i / particleCount))
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r     = 2.5 + (Math.random() - 0.5) * 0.4
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      const t = Math.random()
      colors[i * 3]     = 0.788 + t * 0.212
      colors[i * 3 + 1] = 0.659 + t * 0.341
      colors[i * 3 + 2] = 0.298 + t * 0.702
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Inner glow sphere
    const glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.05 }),
    )
    scene.add(glowSphere)

    // Wireframe equator
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.004, 8, 120),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.3 }),
    )
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    // Star background
    const starCount     = 2000
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3]     = (Math.random() - 0.5) * 40
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      size: 0.006, color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false,
    }))
    scene.add(stars)

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const onPointerMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX
      const y = e.touches ? e.touches[0].clientY : e.clientY
      mouse.x = (x / window.innerWidth  - 0.5) * 0.3
      mouse.y = (y / window.innerHeight - 0.5) * 0.2
    }
    document.addEventListener('mousemove', onPointerMove, { passive: true })
    document.addEventListener('touchmove', onPointerMove, { passive: true })

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let isVisible = true
    let io
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => { isVisible = entries[0].isIntersecting },
        { threshold: 0 },
      )
      io.observe(canvas.parentElement || canvas)
    }

    // Expose scene objects (Animation hook can scrub them on scroll)
    window._sceneObjects = { particles, particleGeo, ring, glowSphere, stars, camera, scene }

    // Render loop
    const clock = new THREE.Clock()
    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      if (!isVisible) return
      const t = clock.getElapsedTime()
      particles.rotation.y = t * 0.04
      particles.rotation.x = t * 0.015
      ring.rotation.z      = t * 0.02
      glowSphere.rotation.y = t * 0.08
      target.x += (mouse.y - target.x) * 0.04
      target.y += (mouse.x - target.y) * 0.04
      scene.rotation.x = target.x
      scene.rotation.y = target.y
      particleMat.opacity = 0.75 + Math.sin(t * 0.5) * 0.10
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousemove', onPointerMove)
      document.removeEventListener('touchmove', onPointerMove)
      io?.disconnect()
      delete window._sceneObjects
      // Dispose Three.js resources
      particleGeo.dispose()
      particleMat.dispose()
      starGeo.dispose()
      stars.material.dispose()
      glowSphere.geometry.dispose()
      glowSphere.material.dispose()
      ring.geometry.dispose()
      ring.material.dispose()
      renderer.dispose()
    }
  }, [canvasRef])
}
