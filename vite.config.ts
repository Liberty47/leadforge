import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  // Expose the project's public Supabase variables without replacing them with
  // empty build-time constants when Vite cannot read the deployment env file.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  server: {
    allowedHosts: ['.vercel.run', '.vercel.app'],
  },
  preview: {
    allowedHosts: ['.vercel.run', '.vercel.app'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
