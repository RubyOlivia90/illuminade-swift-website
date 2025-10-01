import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This tells Vite to treat the app as a SPA, which handles routing correctly
  // for deployment on services like Render.
  appType: 'spa', 
  server: {
    // Your proxy settings for local development remain the same.
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})