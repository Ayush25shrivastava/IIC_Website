import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        cookieDomainRewrite: '',
      },
      '/tickets': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        cookieDomainRewrite: '',
      },
    },
  },
  optimizeDeps: {
    include: ['lenis'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) {
            return 'three';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'framer';
          }
        },
      },
    },
  },
})

