const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const openaiRoutes = require('../routes/openaiRoutes'); // same routes as before

const app = express();

const allowed = [
  'https://abdulrahman1121.github.io', // or your GH Pages custom domain
  'https://www.yourdomain.com',           // keep for future Webflow prod
  'https://<your-webflow-site>.webflow.io'// Webflow staging
];
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
  credentials: true
}));

app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/openai', openaiRoutes);

// ✅ export a handler instead of listening on a port
module.exports = serverless(app);
