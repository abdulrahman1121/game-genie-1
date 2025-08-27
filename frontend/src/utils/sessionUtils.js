import { v4 as uuidv4 } from 'uuid';

// Session token management utilities
export const SESSION_KEY = 'game_session';
export const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Initialize or retrieve session token
export function initSession() {
  let session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  const now = Date.now();
  const isNewSession = !session || !session.token || !session.timestamp || now - session.timestamp > SESSION_DURATION; // + Track new session

  if (isNewSession) {
    session = {
      token: uuidv4(),
      timestamp: now,
      coins: 0,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { ...session, isNewSession }; // + Return isNewSession flag
}

// Update coin count in session
export function updateCoins(coinsEarned) {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  if (session && Date.now() - session.timestamp <= SESSION_DURATION) {
    session.coins += coinsEarned;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session.coins;
  }
  return 0; // Session expired or invalid
}

// Get current coin count
export function getCoins() {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  if (session && Date.now() - session.timestamp <= SESSION_DURATION) {
    return session.coins;
  }
  return 0; // Session expired or invalid
}

// Check if session is valid
export function isSessionValid() {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  return session && Date.now() - session.timestamp <= SESSION_DURATION;
}