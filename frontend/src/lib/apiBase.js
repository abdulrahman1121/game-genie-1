// src/lib/apiBase.js
const PROD_API = 'https://api.gogamegenie.com/api';

export const API_BASE =
  window.location.hostname.endsWith('github.io') || import.meta.env.PROD
    ? PROD_API
    : (import.meta.env.VITE_API_BASE || PROD_API);