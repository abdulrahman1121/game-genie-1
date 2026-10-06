// Stateless, signed session tokens: no database writes, validity is just checking the
// HMAC signature and expiry on each request. Protects the OpenAI/WordsAPI-calling routes
// from being hit directly by scripts that never went through a real game session.
const crypto = require('crypto');

const SESSION_DURATION_MS = 20 * 60 * 1000; // 20 minutes, matches the frontend's session duration

function sign(encodedPayload) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  return crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function createSessionToken() {
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_MS;
  const payload = JSON.stringify({ iat: now, exp: expiresAt, nonce: crypto.randomBytes(8).toString('hex') });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = sign(encodedPayload);
  return { token: `${encodedPayload}.${signature}`, expiresAt };
}

function verifySessionToken(token) {
  if (typeof token !== 'string' || token.split('.').length !== 2) {
    return { valid: false, reason: 'malformed' };
  }

  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return { valid: false, reason: 'bad signature' };
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'bad payload' };
  }

  if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, payload };
}

module.exports = { createSessionToken, verifySessionToken, SESSION_DURATION_MS };
