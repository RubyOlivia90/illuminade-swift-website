import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ command }) => {
  const config = {
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

  if (command === 'build') {
    config.base = './'
  }

  return config
})