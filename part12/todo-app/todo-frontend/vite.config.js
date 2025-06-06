import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'frontend'
    ],
    watch: {
      usePolling: true
    },
    host: true,
    hmr: {
      host: 'localhost'
    },
    
  },test: {
    environment: 'jsdom',
  }
})