import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure correct paths when hosted at domain root or GitHub Pages
  base: '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
