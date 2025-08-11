import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000' // Match backend port
    }
  },
  resolve: {
    alias: {
      'firebase/firestore': 'firebase/firestore'
    }
  },
  build: {
    // No external Firebase
  },
  base: '/game-genie-1/'
});