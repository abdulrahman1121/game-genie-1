const express = require('express');
const router = express.Router();
const { createSessionToken } = require('../lib/sessionToken');

router.post('/start', (req, res) => {
  const { token, expiresAt } = createSessionToken();
  res.json({ sessionToken: token, expiresAt });
});

module.exports = router;
