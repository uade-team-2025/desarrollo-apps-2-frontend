import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.lottie'],
  server: {
    proxy: {
      '/api-auth': {
        target: 'http://ec2-13-217-71-142.compute-1.amazonaws.com:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-auth/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Host', req.headers.host || '');
            proxyReq.setHeader('X-Real-IP', req.socket.remoteAddress || '');
            proxyReq.setHeader(
              'X-Forwarded-For',
              req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
            );
            const protocol =
              (req.socket as any).encrypted || req.headers['x-forwarded-proto']
                ? 'https'
                : 'http';
            proxyReq.setHeader('X-Forwarded-Proto', protocol);
          });
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          ui: ['@chakra-ui/react', '@emotion/react'],
          maps: ['leaflet', 'react-leaflet'],
          utils: ['axios', 'dayjs', 'react-hook-form', 'react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
