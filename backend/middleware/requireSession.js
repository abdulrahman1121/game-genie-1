const { verifySessionToken } = require('../lib/sessionToken');

function requireSession(req, res, next) {
  const token = req.header('X-Session-Token');
  if (!token) {
    return res.status(401).json({ error: 'Missing session token' });
  }

  const result = verifySessionToken(token);
  if (!result.valid) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }

  req.session = result.payload;
  next();
}

module.exports = requireSession;
