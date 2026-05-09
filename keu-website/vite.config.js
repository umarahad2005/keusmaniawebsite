import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    open: true,
    host: true,
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
      input: {
        main:     resolve(__dirname, 'index.html'),
        packages: resolve(__dirname, 'packages.html'),
        about:    resolve(__dirname, 'about.html'),
        gallery:  resolve(__dirname, 'gallery.html'),
        contact:  resolve(__dirname, 'contact.html'),
      },
      output: {
        manualChunks: {
          three: ['three'],
          gsap:  ['gsap'],
          lenis: ['lenis'],
        },
      },
    },
  },
})
