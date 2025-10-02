import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // This function makes the config conditional based on the command
  if (command === 'build') {
    // --- THIS IS THE FIX FOR PRODUCTION ---
    // FIX: Changing 'base: "./"' to 'base: ""' forces the most minimal 
    // relative path resolution for static assets, which is often required 
    // for HashRouter apps on Render/static hosts.
    return {
      base: '',
      plugins: [react()],
    }
  } else {
    // --- THIS IS FOR LOCAL DEVELOPMENT ---
    // Your local server settings remain untouched and will work as before.
    return {
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:1337',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
    }
  }
})