import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the static build works from any path (e.g. GitHub Pages).
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          fluid: ['@fluid-design/fluid-ui', '@headlessui/react', 'framer-motion'],
        },
      },
    },
  },
});
