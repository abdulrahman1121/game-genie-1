// No serverless-http, no listeners, no timers
const express = require('express');

const app = express();
// keep it minimal first
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

// Export the Express app as a plain handler
module.exports = (req, res) => app(req, res);
