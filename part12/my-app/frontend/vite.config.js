import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    sourcemap: true,
    outDir: './dist',
    emptyOutDir: true
  },
  
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true
    },
    allowedHosts: [
      'frontend'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  },
})
