import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const server1ProxyTarget = env.VITE_SERVER1_PROXY_TARGET || 'http://localhost:5001';

  return {
    // The production site is mounted below /renaissance while local and
    // preview builds may be served from /. Relative bundle URLs work in both.
    base: './',
    plugins: [
      tailwindcss(),
      react()
    ],
    server: {
      proxy: {
        '/api/v1': {
          target: server1ProxyTarget,
          changeOrigin: true,
          cookieDomainRewrite: '',
        },
        // Match the ticket API path only. A plain '/tickets' prefix also
        // captures the client route '/tickets-accommodation' and sends it
        // to Express instead of letting Vite serve the SPA fallback.
        '^/tickets(?:/|$)': {
          target: server1ProxyTarget,
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
          }
        }
      },
    },
  };
});

