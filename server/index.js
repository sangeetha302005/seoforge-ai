import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { isGeminiConfigured } from './services/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', apiRouter);

// Serve static frontend build if client/dist exists
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // Fallback for SPA routing in Express 5
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      const indexPath = path.join(clientDist, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    next();
  });
} else {
  // Informational root endpoint if frontend is not yet built
  app.get('/', (req, res) => {
    res.json({
      app: 'SEOForge AI Backend Service',
      status: 'online',
      version: '1.0.0',
      mode: isGeminiConfigured() ? 'Live Gemini AI' : 'Demo Mode',
      endpoints: [
        '/api/health',
        '/api/generate/keywords',
        '/api/generate/outline',
        '/api/generate/pillar',
        '/api/generate/supporting-cluster',
        '/api/generate/single-blog',
        '/api/generate/local-seo',
        '/api/generate/quality-review'
      ]
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SEOForge AI Server running at http://localhost:${PORT}`);
  console.log(`🔑 AI Mode: ${isGeminiConfigured() ? 'LIVE (Gemini API Active)' : 'DEMO MODE (Configured Sample Data)'}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💻 Static Client: ${fs.existsSync(clientDist) ? 'Mounted from client/dist' : 'Run Vite dev server'}`);
  console.log(`======================================================\n`);
});
