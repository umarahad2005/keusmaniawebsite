# SKILL: 3D Scene Agent
## Role
You build the Three.js hero experience. Sacred, premium, immersive.

## Prerequisites
Read `agents/project-state.json`. Structure must be "done".

## Scene Concept
A deep navy night sky. Thousands of gold particles form a slow-rotating dome (representing the pilgrimage). A soft ambient glow pulses. On scroll, particles scatter then reform. Mouse movement creates subtle parallax.

## Full Implementation: `src/js/scene.js`

```js
import * as THREE from 'three'

export function initScene() {
  const canvas = document.getElementById('hero-canvas')
  if (!canvas) return

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x0d1b35, 1)

  // Scene + Camera
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 4

  // === PARTICLE DOME ===
  const particleCount = 4000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    // Fibonacci sphere distribution (even spread)
    const phi = Math.acos(1 - 2 * (i / particleCount))
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const r = 2.5 + (Math.random() - 0.5) * 0.4

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // Gold to white color variation
    const t = Math.random()
    colors[i * 3]     = 0.788 + t * 0.212  // R: gold to white
    colors[i * 3 + 1] = 0.659 + t * 0.341  // G
    colors[i * 3 + 2] = 0.298 + t * 0.702  // B
  }

  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const particleMat = new THREE.PointsMaterial({
    size: 0.012,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  })

  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  // === INNER GLOW SPHERE ===
  const glowGeo = new THREE.SphereGeometry(0.8, 32, 32)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity: 0.04,
    wireframe: false,
  })
  const glowSphere = new THREE.Mesh(glowGeo, glowMat)
  scene.add(glowSphere)

  // === WIREFRAME RING (equator) ===
  const ringGeo = new THREE.TorusGeometry(2.5, 0.004, 8, 120)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.3 })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.PI / 2
  scene.add(ring)

  // === STARS BACKGROUND ===
  const starCount = 2000
  const starPositions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3]     = (Math.random() - 0.5) * 40
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMat = new THREE.PointsMaterial({ size: 0.006, color: 0xffffff, transparent: true, opacity: 0.5 })
  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // === MOUSE PARALLAX ===
  let mouse = { x: 0, y: 0 }
  let targetRotation = { x: 0, y: 0 }
  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.3
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.2
  })

  // === SCROLL SCATTER (GSAP hook) ===
  // Expose for Animation Agent to use
  window._sceneObjects = { particles, particleGeo, ring, glowSphere, camera }

  // === RESIZE ===
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // === ANIMATION LOOP ===
  const clock = new THREE.Clock()
  function animate() {
    requestAnimationFrame(animate)
    const t = clock.getElapsedTime()

    // Slow rotation
    particles.rotation.y = t * 0.04
    particles.rotation.x = t * 0.015
    ring.rotation.z = t * 0.02
    glowSphere.rotation.y = t * 0.08

    // Mouse parallax lerp
    targetRotation.x += (mouse.y - targetRotation.x) * 0.04
    targetRotation.y += (mouse.x - targetRotation.y) * 0.04
    scene.rotation.x = targetRotation.x
    scene.rotation.y = targetRotation.y

    // Breathe opacity
    particleMat.opacity = 0.75 + Math.sin(t * 0.5) * 0.1

    renderer.render(scene, camera)
  }
  animate()
}
```

## Hero Canvas HTML (add to index.html hero section)
```html
<section id="hero" class="hero">
  <canvas id="hero-canvas"></canvas>
  <div class="hero-content">
    <p class="hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
    <h1 class="hero-title">
      Your Sacred Journey<br>
      <span class="gold">Begins Here</span>
    </h1>
    <p class="hero-sub">Premium Hajj & Umrah services from Lahore, Pakistan.<br>Trusted by thousands of pilgrims since 2005.</p>
    <div class="hero-cta">
      <a href="/packages.html" class="btn-primary">View Packages</a>
      <a href="https://wa.me/923XXXXXXXXX" class="btn-whatsapp" target="_blank">
        <img src="/icons/whatsapp.svg" alt=""> Book on WhatsApp
      </a>
    </div>
    <div class="hero-scroll-hint">
      <span>Scroll to explore</span>
      <div class="scroll-line"></div>
    </div>
  </div>
</section>
```

## Hero CSS (add to components.css)
```css
.hero {
  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: var(--color-navy-dark);
}
#hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 0 var(--space-6);
}
.hero-bismillah {
  font-family: var(--font-arabic);
  font-size: var(--text-2xl);
  color: var(--color-gold);
  margin-bottom: var(--space-4);
  letter-spacing: 0.05em;
}
.hero-title {
  font-family: var(--font-heading);
  font-size: var(--text-hero);
  color: var(--color-white);
  line-height: 1.15;
  margin-bottom: var(--space-6);
}
.hero-title .gold { color: var(--color-gold); }
.hero-sub {
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.75);
  max-width: 560px;
  line-height: 1.7;
  margin-bottom: var(--space-8);
}
.hero-cta { display: flex; gap: var(--space-4); flex-wrap: wrap; justify-content: center; }
.hero-scroll-hint {
  position: absolute;
  bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: rgba(255,255,255,0.4);
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, rgba(201,168,76,0.8), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse { 0%,100%{opacity:0.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }
```

## Output Required
- Complete `src/js/scene.js`
- Hero section HTML added to `index.html`
- Hero CSS added to `components.css`
- Update `agents/project-state.json` → `status.3d_scene = "done"`
- Update `outputs.three_scene_config` with scene object keys
