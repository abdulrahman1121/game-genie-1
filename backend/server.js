const express = require('express');
const cors = require('cors');
const openaiRoutes = require('./routes/openaiRoutes');
const RENDER_URL = process.env.RENDER_URL;
const { db } = require('./firebase');

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'https://abdulrahman1121.github.io'],
}));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Expose URL for frontend
app.get('/api/config', (req, res) => {
  res.json({ renderUrl: process.env.RENDER_URL});
});

// Use OpenAI routes for game logic
app.use('/api/openai', openaiRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});