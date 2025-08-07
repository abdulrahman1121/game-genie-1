import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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