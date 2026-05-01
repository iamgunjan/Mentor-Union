import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api -> Express server so the client can call fetch('/api/...')
// without CORS or hard-coded host issues.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
