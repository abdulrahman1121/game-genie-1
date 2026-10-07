const { checkAndIncrement } = require('../lib/sessionUsage');

// Per-session (per token nonce) caps on routes that cost real external API credits
// (OpenAI or WordsAPI), so a single 20-minute session can't be replayed to mint unlimited
// requests even with a valid token.
//
// If req.session is missing, this just calls next() rather than erroring -- that only
// happens when a caller exercises this router without requireSession in front of it (e.g.
// route-level tests), never in the real app, where requireSession always runs first.
function createUsageLimiter(routeKey, limit) {
  return (req, res, next) => {
    if (!req.session) return next();

    const { nonce, exp } = req.session;
    const { allowed } = checkAndIncrement(nonce, exp, routeKey, limit);
    if (!allowed) {
      return res.status(429).json({ error: `Session limit reached for ${routeKey} (max ${limit} per session)` });
    }
    next();
  };
}

module.exports = createUsageLimiter;
