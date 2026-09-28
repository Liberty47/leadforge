import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [react()],
  base: '/',
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || '',
    ),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
      env.VITE_SUPABASE_ANON_KEY ||
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        env.SUPABASE_ANON_KEY ||
        '',
    ),
  },
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
  }
})
