import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // This function makes the config conditional based on 'dev' or 'build'
  if (command === 'build') {
    // --- PRODUCTION BUILD CONFIG ---
    // This is the key: It forces Vite to use relative paths for assets
    // so your index.html can find the JS and CSS files.
    return {
      base: './',
      plugins: [react()],
    }
  } else {
    // --- LOCAL DEVELOPMENT CONFIG ---
    // Your local server settings remain unchanged and will work as before.
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