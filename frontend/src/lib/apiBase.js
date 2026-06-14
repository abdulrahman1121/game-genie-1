// src/lib/apiBase.js
// Prod (GH Pages): always use Render
// Dev: also use Render by default via VITE_API_BASE
export const API_BASE =
  window.location.hostname.endsWith('github.io') || import.meta.env.PROD
    ? 'https://api.gogamegenie.com'
    : (import.meta.env.VITE_API_BASE || 'https://api.gogamegenie.com');
