import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['firebase/firestore'] // Exclude firebase/firestore from bundling
    }
  },
  base: '/game-genie-1/' // Ensure this matches your GitHub Pages URL
});

