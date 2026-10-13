import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// isSsrBuild: the build-time pre-render bundle (src/entry-server.jsx) keeps its
// node_modules external, so it gets no manual chunks.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: '/',
  publicDir: isSsrBuild ? false : 'public',
  server: {
    port: 5173,
    open: true,
    host: true,
    proxy: {
      // Forward /api/* to the local dev API server (scripts/dev-api.js, port 3001)
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Don't flood the console when the API isn't running — log once per kind
        configure(proxy) {
          const seen = new Set()
          proxy.on('error', (err, req, res) => {
            const key = err.code || err.message
            if (!seen.has(key)) {
              seen.add(key)
              console.warn(`[vite] /api proxy: ${err.code || err.message} — is "npm run dev:api" running?`)
            }
            if (res && !res.headersSent && typeof res.writeHead === 'function') {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'API unavailable' }))
            }
          })
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks: {
          react:  ['react', 'react-dom', 'react-router-dom'],
          gsap:   ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'gsap/Flip', 'gsap/DrawSVGPlugin', 'gsap/CustomEase'],
          lenis:  ['lenis'],
        },
      },
    },
  },
}))
