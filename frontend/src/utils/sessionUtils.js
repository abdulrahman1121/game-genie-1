import { v4 as uuidv4 } from 'uuid';

export const SESSION_KEY = 'game_session';
export const BONUS_SESSION_KEY = 'bonus_session';
export const SESSION_DURATION = 1 * 60 * 1000; // 2 minutes in milliseconds

export function initSession(sessionKey = SESSION_KEY) {
  let session = JSON.parse(sessionStorage.getItem(sessionKey));
  const now = Date.now();
  const isNewSession = !session || !session.token || !session.timestamp || now - session.timestamp > SESSION_DURATION;

  if (isNewSession) {
    session = {
      token: uuidv4(), // New token for new session
      timestamp: now,
      coins: sessionKey === SESSION_KEY ? 0 : (session?.coins || 0), // Reset coins for game session, preserve for bonus session
    };
    sessionStorage.setItem(sessionKey, JSON.stringify(session));
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