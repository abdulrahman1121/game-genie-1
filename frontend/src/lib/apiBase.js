// src/lib/apiBase.js
// Prod (GH Pages): always use Render
// Dev: also use Render by default via VITE_API_BASE
export const API_BASE =
  window.location.hostname.endsWith('github.io') || import.meta.env.PROD
    ? 'https://game-genie-1.onrender.com/api'
    : (import.meta.env.VITE_API_BASE || 'https://game-genie-1.onrender.com/api');
