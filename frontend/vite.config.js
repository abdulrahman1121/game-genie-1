// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/game-genie-1/' : '/', // important for GH Pages
}));


// resolve: {
//     alias: {
//       'firebase/firestore': 'firebase/firestore'
//     }