const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { createSessionToken, SESSION_DURATION_MS } = require('../lib/sessionToken');

// Backstops the per-session usage caps: without this, someone could bypass those caps simply
// by minting a fresh token whenever the old one's limits were reached. Window matches the
// token's own lifetime so this reads as "N tokens per session-length window, per IP."
const sessionStartLimiter = rateLimit({
  windowMs: SESSION_DURATION_MS, // 20 minutes
  limit: 30, // 30 new session tokens per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many session requests from this IP, please try again later.' },
});

router.post('/start', sessionStartLimiter, (req, res) => {
  const { token, expiresAt } = createSessionToken();
  res.json({ sessionToken: token, expiresAt });
});

module.exports = router;
