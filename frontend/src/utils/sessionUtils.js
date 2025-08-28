import { v4 as uuidv4 } from 'uuid';

export const SESSION_KEY = 'game_session';
export const SESSION_DURATION = 2 * 60 * 1000; // 10 minutes in milliseconds

export function initSession() {
  let session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  const now = Date.now();
  const isNewSession = !session || !session.token || !session.timestamp || now - session.timestamp > SESSION_DURATION;

  if (isNewSession) {
    session = {
      token: session?.token || uuidv4(), // Preserve token if session exists
      timestamp: now,
      coins: session?.coins || 0, // Preserve coins for new session
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { ...session, isNewSession };
}

export function updateCoins(coinsEarned) {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  if (session && Date.now() - session.timestamp <= SESSION_DURATION) {
    session.coins += coinsEarned;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session.coins;
  }
  return 0; // Session expired or invalid
}

export function getCoins() {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  if (session && Date.now() - session.timestamp <= SESSION_DURATION) {
    return session.coins;
  }
  return 0; // Session expired or invalid
}

export function isSessionValid() {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  return session && Date.now() - session.timestamp <= SESSION_DURATION;
}