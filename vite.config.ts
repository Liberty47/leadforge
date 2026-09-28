import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    allowedHosts: ['.vercel.run', '.vercel.app'],
  },
  preview: {
    allowedHosts: ['.vercel.run', '.vercel.app'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
})
