import express from 'express';
import {
  isGeminiConfigured,
  getModel,
  testGeminiConnection,
  generateKeywordsLive,
  generateOutlineLive,
  generatePillarLive,
  generateSupportingClusterLive,
  generateSingleBlogLive,
  generateLocalSeoLive
} from '../services/geminiService.js';
import {
  generateDemoKeywords,
  generateDemoOutline,
  generateDemoPillar,
  generateDemoSupportingCluster,
  generateDemoLocalSeo,
  generateDemoQualityReview,
  getBengaluruDentalDemo
} from '../services/demoService.js';

const router = express.Router();

/**
 * Health check & configuration status
 */
router.get('/health', (req, res) => {
  const configured = isGeminiConfigured();
  res.json({
    status: 'ok',
    geminiConfigured: configured,
    mode: configured ? 'live' : 'demo',
    model: getModel(),
    message: configured
      ? 'Live Google Gemini AI integration is configured.'
      : 'SEOForge AI is running in Demo Mode. Configure GEMINI_API_KEY in .env to activate live API generation.'
  });
});

/**
 * Real Connection Test endpoint
 * Executes an actual lightweight ping against the Gemini API.
 */
router.all('/test-connection', async (req, res) => {
  try {
    const result = await testGeminiConnection();
    if (result.success) {
      return res.status(200).json(result);
    } else {
      const statusCode = result.code === 'KEY_MISSING' ? 400 : 502;
      return res.status(statusCode).json(result);
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      error: err.message
    });
  }
});

/**
 * Dedicated Demo Workspace data endpoint
 * Returns the full sample dataset for Apex Dental Studio (Bengaluru)
 */
router.get('/demo-workspace', (req, res) => {
  const demoData = getBengaluruDentalDemo();
  res.json({
    data: demoData,
    isDemo: true,
    message: 'Loaded sample data for Demo Workspace.'
  });
});

/**
 * 1. Generate Keywords & Search Intent Plan
 */
router.post('/generate/keywords', async (req, res) => {
  const { business, forceDemo } = req.body;
  if (!business || !business.brandName) {
    return res.status(400).json({ error: 'Business profile with brand name is required.', code: 'INVALID_INPUT' });
  }

  // Explicit demo mode requested
  if (forceDemo) {
    const data = generateDemoKeywords(business);
    return res.json({
      data,
      isDemo: true,
      message: 'Generated in Demo Mode using realistic SEO content strategy.'
    });
  }

  // Live AI path
  if (!isGeminiConfigured()) {
    return res.status(400).json({
      error: 'Google Gemini API key is not configured on the server. Please add your GEMINI_API_KEY to the root .env file and restart the server, or enable Demo Mode in Settings.',
      code: 'GEMINI_NOT_CONFIGURED'
    });
  }

  try {
    const data = await generateKeywordsLive(business);
    return res.json({
      data,
      isDemo: false,
      message: 'Generated using live Google Gemini AI.'
    });
  } catch (err) {
    console.error('Live Gemini keyword generation error:', err);
    return res.status(502).json({
      error: `Gemini AI keyword generation failed: ${err.message}`,
      code: err.code || 'AI_GENERATION_FAILED',
      details: err.message
    });
  }
});

/**
 * 2. Generate Pillar Blog Outline
 */
router.post('/generate/outline', async (req, res) => {
  const { business, primaryKeyword, forceDemo } = req.body;
  if (!business || !business.brandName) {
    return res.status(400).json({ error: 'Business profile is required.', code: 'INVALID_INPUT' });
  }

  if (forceDemo) {
    const data = generateDemoOutline(business, primaryKeyword);
    return res.json({
      data,
      isDemo: true,
      message: 'Outline generated in Demo Mode.'
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(400).json({
      error: 'Google Gemini API key is not configured on the server. Please add your GEMINI_API_KEY to .env or enable Demo Mode.',
      code: 'GEMINI_NOT_CONFIGURED'
    });
  }

  try {
    const data = await generateOutlineLive(business, primaryKeyword);
    return res.json({
      data,
      isDemo: false,
      message: 'Outline generated using live Google Gemini AI.'
    });
  } catch (err) {
    console.error('Live Gemini outline generation error:', err);
    return res.status(502).json({
      error: `Gemini AI outline generation failed: ${err.message}`,
      code: err.code || 'AI_GENERATION_FAILED',
      details: err.message
    });
  }
});

/**
 * 3. Generate Full Pillar Article
 */
router.post('/generate/pillar', async (req, res) => {
  const { business, outline, forceDemo } = req.body;
  if (!business || !business.brandName) {
    return res.status(400).json({ error: 'Business profile is required.', code: 'INVALID_INPUT' });
  }

  if (forceDemo) {
    const data = generateDemoPillar(business, outline);
    return res.json({
      data,
      isDemo: true,
      message: 'Pillar article generated in Demo Mode.'
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(400).json({
      error: 'Google Gemini API key is not configured on the server. Please add your GEMINI_API_KEY to .env or enable Demo Mode.',
      code: 'GEMINI_NOT_CONFIGURED'
    });
  }

  try {
    const data = await generatePillarLive(business, outline);
    return res.json({
      data,
      isDemo: false,
      message: 'Pillar article generated using live Google Gemini AI.'
    });
  } catch (err) {
    console.error('Live Gemini pillar generation error:', err);
    return res.status(502).json({
      error: `Gemini AI pillar writing failed: ${err.message}`,
      code: err.code || 'AI_GENERATION_FAILED',
      details: err.message
    });
  }
});

/**
 * 4. Generate Supporting Content Cluster
 */
router.post('/generate/supporting-cluster', async (req, res) => {
  const { business, count = 4, forceDemo } = req.body;
  if (!business || !business.brandName) {
    return res.status(400).json({ error: 'Business profile is required.', code: 'INVALID_INPUT' });
  }

  if (forceDemo) {
    const data = generateDemoSupportingCluster(business, count);
    return res.json({
      data,
      isDemo: true,
      message: 'Supporting content cluster generated in Demo Mode.'
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(400).json({
      error: 'Google Gemini API key is not configured on the server. Please add your GEMINI_API_KEY to .env or enable Demo Mode.',
      code: 'GEMINI_NOT_CONFIGURED'
    });
  }

  try {
    const data = await generateSupportingClusterLive(business, count);
    return res.json({
      data,
      isDemo: false,
      message: 'Supporting content cluster generated using live Google Gemini AI.'
    });
  } catch (err) {
    console.error('Live Gemini supporting cluster error:', err);
    return res.status(502).json({
      error: `Gemini AI cluster generation failed: ${err.message}`,
      code: err.code || 'AI_GENERATION_FAILED',
      details: err.message
    });
  }
});

/**
 * 5. Regenerate Single Blog
 */
router.post('/generate/single-blog', async (req, res) => {
  const { business, blogDetails, pillarTopic, forceDemo } = req.body;
  if (!business || !blogDetails) {
    return res.status(400).json({ error: 'Business profile and blog details are required.', code: 'INVALID_INPUT' });
  }

  if (forceDemo) {
    const demoCluster = generateDemoSupportingCluster(business, 5);
    const found = demoCluster.find(b => b.targetKeyword === blogDetails.targetKeyword) || demoCluster[0];
    return res.json({
      data: { fullContent: found.fullContent },
      isDemo: true,
      message: 'Regenerated in Demo Mode.'
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(400).json({
      error: 'Google Gemini API key is not configured on the server. Please add your GEMINI_API_KEY to .env or enable Demo Mode.',
      code: 'GEMINI_NOT_CONFIGURED'
    });
  }

  try {
    const fullContent = await generateSingleBlogLive(business, blogDetails, pillarTopic);
    return res.json({
      data: { fullContent },
      isDemo: false,
      message: 'Regenerated using live Google Gemini AI.'
    });
  } catch (err) {
    console.error('Live Gemini single blog regeneration error:', err);
    return res.status(502).json({
      error: `Gemini AI blog regeneration failed: ${err.message}`,
      code: err.code || 'AI_GENERATION_FAILED',
      details: err.message
    });
  }
});

/**
 * 6. Generate Local SEO Recommendations
 */
router.post('/generate/local-seo', async (req, res) => {
  const { business, forceDemo } = req.body;
  if (!business || !business.brandName) {
    return res.status(400).json({ error: 'Business profile is required.', code: 'INVALID_INPUT' });
  }

  if (forceDemo) {
    const data = generateDemoLocalSeo(business);
    return res.json({
      data,
      isDemo: true,
      message: 'Local SEO strategy generated in Demo Mode.'
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(400).json({
      error: 'Google Gemini API key is not configured on the server. Please add your GEMINI_API_KEY to .env or enable Demo Mode.',
      code: 'GEMINI_NOT_CONFIGURED'
    });
  }

  try {
    const data = await generateLocalSeoLive(business);
    return res.json({
      data,
      isDemo: false,
      message: 'Local SEO strategy generated using live Google Gemini AI.'
    });
  } catch (err) {
    console.error('Live Gemini local SEO error:', err);
    return res.status(502).json({
      error: `Gemini AI local SEO generation failed: ${err.message}`,
      code: err.code || 'AI_GENERATION_FAILED',
      details: err.message
    });
  }
});

/**
 * 7. Content Quality & SEO Review (Deterministic rules engine)
 */
router.post('/generate/quality-review', (req, res) => {
  const { articleText, business } = req.body;
  const audit = generateDemoQualityReview(articleText, business || {});
  res.json({
    data: audit,
    isDemo: false,
    message: 'Content audited with SEOForge deterministic rules engine.'
  });
});

export default router;
