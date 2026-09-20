import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or local directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Register API Routes
app.use('/api', apiRouter);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'JanNiti AI API',
    description: 'Digital Public Infrastructure for Smarter Planning in India',
    tagline: 'Turning Citizen Voices into Smarter Public Infrastructure',
    endpoints: [
      '/api/health',
      '/api/requests',
      '/api/analyze-request',
      '/api/hotspots',
      '/api/recommendations',
      '/api/statistics',
      '/api/predictions',
      '/api/policy-copilot',
      '/api/datasets'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` JanNiti AI Server running on http://localhost:${PORT}`);
  console.log(` Google Gemini Integration: ${process.env.GEMINI_API_KEY ? 'Active API Key Detected' : 'Resilient Intelligent Fallback Mode'}`);
  console.log(`====================================================`);
});
