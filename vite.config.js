import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',          // relative paths so assets load anywhere
  build: {
    target: 'es2017',  // transpile JS so Safari/iOS can run it
    outDir: 'dist',    // default build folder
    assetsDir: 'assets' // keep assets organized
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
