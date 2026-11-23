
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ai': {
        target: 'http://localhost:10000',
        changeOrigin: true
      },
      '/students': {
        target: 'http://localhost:10000',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:10000',
        changeOrigin: true
      }
    }
  }
})
