import { API_BASE } from './apiBase.js';

const STORAGE_KEY = 'api_session_token';

function readStoredToken() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStoredToken(token, expiresAt) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt }));
}

function isStillValid(stored) {
  return !!stored?.token && Date.now() < stored.expiresAt;
}

async function requestNewToken() {
  const res = await fetch(`${API_BASE}/session/start`, { method: 'POST' });
  const data = await res.json();
  writeStoredToken(data.sessionToken, data.expiresAt);
  return data.sessionToken;
}

async function getSessionToken() {
  const stored = readStoredToken();
  if (isStillValid(stored)) return stored.token;
  return requestNewToken();
}

// Drop-in replacement for fetch(`${API_BASE}${path}`, options) that attaches the signed
// session token every /api/openai/* route requires. Refreshes and retries once on a 401,
// in case the cached token expired right at the edge of its window.
export async function apiFetch(path, options = {}) {
  const token = await getSessionToken();
  const headers = { ...(options.headers || {}), 'X-Session-Token': token };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    const freshToken = await requestNewToken();
    return fetch(`${API_BASE}${path}`, { ...options, headers: { ...(options.headers || {}), 'X-Session-Token': freshToken } });
  }

  return res;
}
