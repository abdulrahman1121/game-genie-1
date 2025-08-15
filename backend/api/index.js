// backend/api/index.js  (CommonJS)
const express = require('express');
const serverless = require('serverless-http');

module.exports = (req, res) => {
  const app = express();

  // Minimal route first
  app.get('/health', (_req, _res) => {
    _res.status(200).json({ ok: true });
  });

  // IMPORTANT: avoid waiting for empty event loop (prevents 504 hang)
  const handler = serverless(app, { callbackWaitsForEmptyEventLoop: false });
  return handler(req, res);
};
