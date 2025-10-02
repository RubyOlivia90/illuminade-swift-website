import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',          // makes paths relative → fixes mobile 404
  build: {
    target: 'es2017',  // safe for Safari
    outDir: 'dist',    // Vite build folder
    assetsDir: 'assets' // compiled JS/CSS go here
  },
})
