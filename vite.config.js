import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  if (command === 'build') {
    // --- PRODUCTION BUILD CONFIG ---
    // This is the new change. Using an empty string is an alternative
    // way to ensure all asset paths are relative.
    return {
      base: '', 
      plugins: [react()],
    }
  } else {
    // --- LOCAL DEVELOPMENT CONFIG ---
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