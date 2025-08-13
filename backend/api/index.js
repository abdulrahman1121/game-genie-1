console.log('index.js: loading start');
const express = require('express');
console.log('index.js: express required');
const serverless = require('serverless-http');
console.log('index.js: serverless-http required');

const app = express();
console.log('index.js: app created');

app.get('/health', (_req, res) => {
  console.log('index.js: /health hit');
  res.json({ ok: true });
});

module.exports = serverless(app);
console.log('index.js: export done');
