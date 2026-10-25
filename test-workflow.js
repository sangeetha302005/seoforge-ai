/**
 * SEOForge AI - Comprehensive End-to-End Workflow Verification Suite
 * Tests AI connection verification, error handling, demo isolation,
 * dynamic non-dental generation, and quality audit.
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting SEOForge AI End-to-End Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  // Test 1: Health check
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert(res.status === 200, 'Health endpoint responds with HTTP 200');
    assert(data.status === 'ok', 'Health status is "ok"');
    assert(data.geminiConfigured === false, 'Detects unconfigured GEMINI_API_KEY accurately');
    assert(data.mode === 'demo', 'Defaults mode to demo when no API key configured');
  } catch (err) {
    assert(false, 'Health check endpoint accessible', err.message);
  }

  // Test 2: Connection test with unconfigured key
  try {
    const res = await fetch(`${BASE_URL}/api/test-connection`, { method: 'POST' });
    const data = await res.json();
    assert(res.status === 400, 'Test connection returns HTTP 400 when key missing');
    assert(data.code === 'KEY_MISSING', 'Test connection reports code "KEY_MISSING"');
    assert(data.success === false, 'Test connection returns success: false');
    assert(data.error.includes('GEMINI_API_KEY'), 'Test connection error mentions GEMINI_API_KEY');
  } catch (err) {
    assert(false, 'Connection test endpoint', err.message);
  }

  // Test 3: Live generation blocked when API key is missing (NO silent demo fallback!)
  const roofingBusiness = {
    brandName: 'Austin Elite Roofing',
    industry: 'Home Services & Construction',
    mainService: 'Residential Roof Replacement & Storm Damage Repair',
    targetAudience: 'Homeowners and property managers in the Austin metro',
    city: 'Austin',
    websiteUrl: 'https://austineliteroofing.com',
    primaryTopic: 'Roof Replacement & Storm Inspection in Austin',
    language: 'English',
    contentTone: 'informative',
    targetWordCount: 2000,
    businessGoal: 'generate leads',
    supportingBlogCount: 4
  };

  try {
    const res = await fetch(`${BASE_URL}/api/generate/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: roofingBusiness, forceDemo: false })
    });
    const data = await res.json();
    assert(res.status === 400, 'Keyword generation without API key returns HTTP 400 error (not silent fallback)');
    assert(data.code === 'GEMINI_NOT_CONFIGURED', 'Error code is GEMINI_NOT_CONFIGURED');
    assert(data.error.includes('Gemini API key is not configured'), 'Error message clearly explains missing key');
  } catch (err) {
    assert(false, 'Keyword generation error handling', err.message);
  }

  // Test 4: Dynamic Demo Generation for Non-Dental Business (Austin Roofing)
  // When forceDemo is explicitly true, it must generate roofing content, NEVER dental!
  try {
    // 4A: Keywords
    const kwRes = await fetch(`${BASE_URL}/api/generate/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: roofingBusiness, forceDemo: true })
    });
    const kwData = await kwRes.json();
    assert(kwRes.status === 200, 'Demo keyword generation returns HTTP 200');
    assert(kwData.isDemo === true, 'Keywords tagged with isDemo: true');
    assert(Array.isArray(kwData.data) && kwData.data.length >= 4, 'Returns array of 4+ keywords');
    const allKwText = kwData.data.map(k => k.keyword).join(' ');
    assert(!allKwText.toLowerCase().includes('dental') && !allKwText.toLowerCase().includes('teeth'), 'Keywords do NOT contain dental terms for roofing business');
    assert(allKwText.toLowerCase().includes('roof') && allKwText.toLowerCase().includes('austin'), 'Keywords contain "roof" and "austin"');

    // 4B: Outline
    const outlineRes = await fetch(`${BASE_URL}/api/generate/outline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: roofingBusiness, primaryKeyword: kwData.data[0].keyword, forceDemo: true })
    });
    const outlineData = await outlineRes.json();
    assert(outlineRes.status === 200, 'Demo outline generation returns HTTP 200');
    assert(!outlineData.data.h1.toLowerCase().includes('dental'), 'Outline H1 does NOT mention dental care');
    assert(outlineData.data.h1.toLowerCase().includes('roof'), 'Outline H1 mentions roof replacement');

    // 4C: Pillar Article
    const pillarRes = await fetch(`${BASE_URL}/api/generate/pillar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: roofingBusiness, outline: outlineData.data, forceDemo: true })
    });
    const pillarData = await pillarRes.json();
    assert(pillarRes.status === 200, 'Demo pillar generation returns HTTP 200');
    assert(!pillarData.data.markdownContent.toLowerCase().includes('dental'), 'Pillar markdown does NOT contain dental terms');
    assert(pillarData.data.markdownContent.includes('Austin Elite Roofing'), 'Pillar markdown includes "Austin Elite Roofing"');
    assert(pillarData.data.markdownContent.includes('Austin'), 'Pillar markdown includes "Austin"');

    // 4D: Supporting Cluster
    const clusterRes = await fetch(`${BASE_URL}/api/generate/supporting-cluster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: roofingBusiness, count: 4, forceDemo: true })
    });
    const clusterData = await clusterRes.json();
    assert(clusterRes.status === 200, 'Demo cluster generation returns HTTP 200');
    assert(clusterData.data.length === 4, 'Returns 4 supporting blogs');
    const allTitles = clusterData.data.map(b => b.title).join(' ');
    assert(!allTitles.toLowerCase().includes('dentist'), 'Supporting blogs do NOT mention dentist for roofing business');
    assert(allTitles.toLowerCase().includes('roof'), 'Supporting blogs mention roof');

    // 4E: Local SEO
    const localRes = await fetch(`${BASE_URL}/api/generate/local-seo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: roofingBusiness, forceDemo: true })
    });
    const localData = await localRes.json();
    assert(localRes.status === 200, 'Demo Local SEO generation returns HTTP 200');
    assert(localData.data.city === 'Austin', 'Local SEO city is Austin');
    const allNeighborhoods = localData.data.neighborhoodVariations.map(n => n.neighborhood).join(' ');
    assert(!allNeighborhoods.includes('Indiranagar'), 'Local SEO does NOT use Bengaluru neighborhoods for Austin');
    assert(allNeighborhoods.includes('Austin'), 'Local SEO neighborhood variations use Austin');
  } catch (err) {
    assert(false, 'Dynamic demo generation workflow', err.message);
  }

  // Test 5: Dedicated Demo Workspace Endpoint
  try {
    const demoRes = await fetch(`${BASE_URL}/api/demo-workspace`);
    const demoData = await demoRes.json();
    assert(demoRes.status === 200, 'Demo workspace endpoint returns HTTP 200');
    assert(demoData.data.id === 'proj-bengaluru-dental-demo', 'Demo project ID is proj-bengaluru-dental-demo');
    assert(demoData.data.business.brandName === 'Apex Dental Studio', 'Demo project is Apex Dental Studio');
    assert(demoData.data.business.city === 'Bengaluru', 'Demo project city is Bengaluru');
    assert(demoData.data.pillar !== null, 'Demo project contains pre-generated pillar');
    assert(demoData.data.supportingBlogs.length === 5, 'Demo project contains 5 supporting blogs');
  } catch (err) {
    assert(false, 'Demo workspace endpoint', err.message);
  }

  // Test 6: Deterministic Quality Review Engine
  try {
    const sampleArticle = `# The Complete Guide to Roofing in Austin\n\n## 1. Overview\nQuality roofing protects your home from severe storms.\n\n## 2. Choosing a Contractor\nAlways check [Austin Elite Roofing guarantees](/guarantees) and licensing.\n\n## 3. Maintenance\nRegular inspections save money. Learn more in our [cost guide](/pricing).\n\n## Conclusion\nCall our Austin team today.`;
    const reviewRes = await fetch(`${BASE_URL}/api/generate/quality-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleText: sampleArticle, business: roofingBusiness })
    });
    const reviewData = await reviewRes.json();
    assert(reviewRes.status === 200, 'Quality review endpoint returns HTTP 200');
    assert(reviewData.data.h2Count === 4, 'Accurately detected 4 H2 headings');
    assert(reviewData.data.internalLinkCount === 2, 'Accurately detected 2 internal links');
    assert(reviewData.data.checks.length === 7, 'Evaluated all 7 quality checklist rules');
  } catch (err) {
    assert(false, 'Quality review engine', err.message);
  }

  console.log(`\n======================================================`);
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed (${passed + failed} total)`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
