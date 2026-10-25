/**
 * SEOForge AI - Gemini AI Service
 * Handles live generation with Google Gemini API when GEMINI_API_KEY is configured.
 * Implements strict prompt engineering using the unified Prompt Library and robust JSON extraction.
 */

import { getPromptById, hydratePromptString } from './prompts.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return '';
  const trimmed = key.trim();
  if (trimmed === 'your_gemini_api_key_here' || trimmed === 'your_api_key_here') return '';
  return trimmed;
}

export function getModel() {
  return process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : 'gemini-1.5-flash';
}

export function isGeminiConfigured() {
  const key = getApiKey();
  return Boolean(key && key.length > 10);
}

/**
 * Robust JSON extraction helper
 * Extracts first JSON array or object from raw LLM output, handling backticks and conversational text.
 */
export function cleanJsonOutput(raw) {
  if (typeof raw !== 'string') return raw;
  let cleaned = raw.trim();

  // Strip markdown code fences if wrapped entirely
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  cleaned = cleaned.trim();

  // Direct parse attempt
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Locate first '{' or '[' and matching closing token
    const firstBracket = cleaned.indexOf('[');
    const firstBrace = cleaned.indexOf('{');

    let startIdx = -1;
    let endIdx = -1;

    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf(']');
    } else if (firstBrace !== -1) {
      startIdx = firstBrace;
      endIdx = cleaned.lastIndexOf('}');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const candidate = cleaned.slice(startIdx, endIdx + 1);
      try {
        return JSON.parse(candidate);
      } catch (innerErr) {
        throw new Error(`Failed to parse AI JSON response: ${innerErr.message}. Output was: ${candidate.slice(0, 150)}...`);
      }
    }

    throw new Error(`Could not locate valid JSON structure in AI response: ${initialErr.message}`);
  }
}

/**
 * Call Gemini REST API
 */
async function callGemini(systemPrompt, userPrompt, temperature = 0.5) {
  const apiKey = getApiKey();
  if (!apiKey) {
    const err = new Error('Google Gemini API key is missing. Set GEMINI_API_KEY in the root .env file.');
    err.code = 'GEMINI_NOT_CONFIGURED';
    throw err;
  }

  const model = getModel();
  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemPrompt}\n\n---\n\n${userPrompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: 4096,
      topP: 0.95
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedMessage = errorBody;
    let errorCode = 'API_ERROR';

    try {
      const errJson = JSON.parse(errorBody);
      parsedMessage = errJson?.error?.message || errorBody;
      errorCode = errJson?.error?.status || `HTTP_${response.status}`;
    } catch {
      // ignore
    }

    const err = new Error(`Gemini API error [${response.status} ${errorCode}]: ${parsedMessage}`);
    err.status = response.status;
    err.code = errorCode;
    throw err;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const blockReason = data?.candidates?.[0]?.finishReason;
    throw new Error(`Gemini returned an empty response. Finish reason: ${blockReason || 'unknown'}`);
  }

  return text;
}

/**
 * Real Connection Test
 * Executes an actual lightweight ping against the configured Gemini model.
 */
export async function testGeminiConnection() {
  const apiKey = getApiKey();
  const model = getModel();

  if (!apiKey) {
    return {
      success: false,
      code: 'KEY_MISSING',
      model,
      error: 'GEMINI_API_KEY is not configured on the server. Please add your API key to the root .env file and restart the server.'
    };
  }

  const startTime = Date.now();
  try {
    const testPrompt = `System: You are an API verification bot.\nUser: Reply with strictly valid JSON: {"status":"connected","service":"SEOForge AI"}`;
    const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: testPrompt }] }],
        generationConfig: { maxOutputTokens: 100, temperature: 0.1 }
      })
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorBody = await response.text();
      let parsedMessage = errorBody;
      let errorCode = `HTTP_${response.status}`;

      try {
        const errJson = JSON.parse(errorBody);
        parsedMessage = errJson?.error?.message || errorBody;
        errorCode = errJson?.error?.status || errorCode;
      } catch {
        // keep text
      }

      if (response.status === 400 || errorCode === 'INVALID_ARGUMENT') {
        return {
          success: false,
          code: 'INVALID_API_KEY',
          model,
          latencyMs,
          error: `Invalid Google Gemini API key or request parameters: ${parsedMessage}`
        };
      }

      if (response.status === 403 || errorCode === 'PERMISSION_DENIED') {
        return {
          success: false,
          code: 'PERMISSION_DENIED',
          model,
          latencyMs,
          error: `API key lacks permission for model "${model}": ${parsedMessage}`
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          code: 'MODEL_NOT_FOUND',
          model,
          latencyMs,
          error: `The configured model "${model}" was not found or is deprecated.`
        };
      }

      if (response.status === 429 || errorCode === 'RESOURCE_EXHAUSTED') {
        return {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          model,
          latencyMs,
          error: `Gemini API rate limit or quota exceeded: ${parsedMessage}`
        };
      }

      return {
        success: false,
        code: errorCode,
        model,
        latencyMs,
        error: `Gemini API error (${response.status}): ${parsedMessage}`
      };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = cleanJsonOutput(rawText || '{}');

    return {
      success: true,
      code: 'CONNECTED',
      latencyMs,
      model,
      data: parsed,
      message: `Successfully connected to Google Gemini (${model}) in ${latencyMs}ms.`
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      code: 'NETWORK_FAILURE',
      model,
      latencyMs,
      error: `Failed to reach Google Gemini API endpoint: ${err.message}`
    };
  }
}

/**
 * 1. Keyword & Search Intent Strategy
 * Uses Prompt Template #2 from the shared Prompt Library
 */
export async function generateKeywordsLive(business) {
  const template = getPromptById('keyword-intent');
  const systemPrompt = `You are a Senior SEO Strategist and Search Intent Architect.
Follow this exact framework:
${template.rawPrompt}

You MUST return strictly valid JSON (an array of 6 to 8 keyword objects) with no conversational markdown wrappers.

JSON schema:
[
  {
    "id": "kw-1",
    "keyword": "string",
    "type": "Primary" | "Secondary" | "Long-tail" | "Local",
    "searchIntent": "Informational" | "Commercial Investigation" | "Transactional" | "Navigational",
    "intentReasoning": "string",
    "suggestedArticleType": "string",
    "clusterPlacement": "string",
    "audienceFitExplanation": "string"
  }
]`;

  const userPrompt = hydratePromptString(
    `Execute the keyword plan for:
Business Name: {business_name}
Industry: {business_type}
Main Service: {main_service}
Target Location: {city}
Target Audience: {target_audience}
Business Goal: {business_goal}
Primary Topic: ${business.primaryTopic || business.mainService}`,
    business
  );

  const raw = await callGemini(systemPrompt, userPrompt, 0.4);
  const parsed = cleanJsonOutput(raw);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Gemini did not return a valid array of keywords.');
  }

  // Ensure each has unique ID
  return parsed.map((item, idx) => ({
    id: item.id || `kw-${Date.now()}-${idx + 1}`,
    keyword: item.keyword || `Keyword ${idx + 1}`,
    type: item.type || (idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : idx === 2 ? 'Long-tail' : 'Local'),
    searchIntent: item.searchIntent || 'Informational',
    intentReasoning: item.intentReasoning || '',
    suggestedArticleType: item.suggestedArticleType || 'Comprehensive Guide',
    clusterPlacement: item.clusterPlacement || (idx === 0 ? 'Core Pillar Anchor' : 'Satellite Node'),
    audienceFitExplanation: item.audienceFitExplanation || ''
  }));
}

/**
 * 2. Pillar Blog Outline
 * Uses Prompt Template #3 from the shared Prompt Library
 */
export async function generateOutlineLive(business, primaryKeyword) {
  const template = getPromptById('pillar-outline');
  const systemPrompt = `You are an elite SEO Content Architect.
Follow this exact framework:
${template.rawPrompt}

Return strictly valid JSON conforming to this schema:
{
  "h1": "string",
  "metaTitle": "string (50-60 chars)",
  "metaDescription": "string (120-155 chars)",
  "slug": "string",
  "primaryKeyword": "string",
  "secondaryKeywords": ["string", "string"],
  "targetWordCount": number,
  "contentTone": "string",
  "sections": [
    {
      "h2": "string",
      "h3s": ["string", "string"],
      "purpose": "string",
      "estimatedWords": number
    }
  ],
  "clinicalDisclaimer": "string or null"
}`;

  const userPrompt = hydratePromptString(
    `Create the pillar blog outline for:
Business Name: {business_name}
Core Topic: {main_service} in {city}
Target Primary Keyword: {primary_keyword}
Target Audience: {target_audience}
Target Length: ~{target_word_count} words
Tone: {content_tone}`,
    business,
    { primaryKeyword }
  );

  const raw = await callGemini(systemPrompt, userPrompt, 0.5);
  const parsed = cleanJsonOutput(raw);
  if (!parsed || !parsed.h1) {
    throw new Error('Gemini did not return a valid pillar outline structure.');
  }
  return parsed;
}

/**
 * 3. Pillar Article Full Writing
 * Uses Prompt Template #4 from the shared Prompt Library
 */
export async function generatePillarLive(business, outline) {
  const template = getPromptById('pillar-article');
  const systemPrompt = `You are a Principal Content Strategist and Subject Matter Specialist.
Follow this exact editorial standard:
${template.rawPrompt}

Write the exhaustive, human-readable, non-repetitive long-form Pillar Blog article in Markdown based on the outline provided.
Return raw Markdown starting immediately with the # H1 title.`;

  const primaryKeyword = outline?.primaryKeyword || business.primaryTopic || business.mainService;

  const userPrompt = hydratePromptString(
    `Write the full long-form Pillar Article for:
Brand: {business_name}
Location: {city}
Service: {main_service}
Primary Keyword: {primary_keyword}
Target Audience: {target_audience}
Goal: {business_goal}
Target Word Count: {target_word_count}
Tone: {content_tone}

Outline Specification:
${JSON.stringify(outline, null, 2)}

Write the complete article now in Markdown:`,
    business,
    { primaryKeyword, targetWordCount: outline?.targetWordCount || business.targetWordCount || 2000 }
  );

  const markdownContent = await callGemini(systemPrompt, userPrompt, 0.6);

  const safeCitySlug = (business.city || 'local').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const safeServiceSlug = (business.mainService || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    title: outline?.h1 || `Comprehensive Guide to ${business.mainService} in ${business.city}`,
    slug: outline?.slug || `guide-${safeServiceSlug}-${safeCitySlug}`,
    metaTitle: outline?.metaTitle || `${business.mainService} in ${business.city} | ${business.brandName}`,
    metaDescription: outline?.metaDescription || `Exhaustive guide to ${business.mainService} in ${business.city} for ${business.targetAudience}.`,
    primaryKeyword,
    secondaryKeywords: outline?.secondaryKeywords || [],
    searchIntent: 'Commercial Investigation / Informational',
    targetAudience: business.targetAudience,
    suggestedImageAlt: `Professional ${business.mainService} overview at ${business.brandName} in ${business.city}`,
    suggestedInternalLinks: [
      {
        targetArticle: `How to Choose a Provider in ${business.city}`,
        anchorText: `vetting checklist for ${business.mainService} in ${business.city}`,
        context: 'Decision Framework Section'
      },
      {
        targetArticle: `Pricing and Cost Breakdown in ${business.city}`,
        anchorText: `detailed cost and investment factors`,
        context: 'Pricing & Budget Section'
      }
    ],
    markdownContent
  };
}

/**
 * 4. Supporting Cluster Generation
 * Uses Prompt Template #5 from the shared Prompt Library
 */
export async function generateSupportingClusterLive(business, count = 4) {
  const template = getPromptById('supporting-cluster');
  const systemPrompt = `You are an SEO Topical Authority Engineer.
Follow this exact framework:
${template.rawPrompt}

You MUST return strictly valid JSON (an array of ${count} supporting blog objects).

JSON format:
[
  {
    "id": "supp-1",
    "title": "string",
    "targetKeyword": "string",
    "searchIntent": "Informational" | "Commercial Investigation" | "Transactional",
    "articlePurpose": "string",
    "slug": "string",
    "metaDescription": "string",
    "outline": ["H1: ...", "H2: ...", "H2: ..."],
    "internalLinks": [
      { "target": "Pillar Blog", "anchor": "string", "reason": "string" }
    ],
    "fullContent": "Full markdown content (~800-1200 words) with H1, H2s, H3s, bullet points, and conclusion..."
  }
]`;

  const userPrompt = hydratePromptString(
    `Generate the supporting cluster:
Business: {business_name}
Business Type: {business_type}
Service: {main_service}
Primary Topic / Pillar: {primary_keyword}
City: {city}
Target Audience: {target_audience}
Number of Supporting Blogs: {supporting_blog_count}`,
    business,
    { count, primaryKeyword: business.primaryTopic || business.mainService }
  );

  const raw = await callGemini(systemPrompt, userPrompt, 0.6);
  const parsed = cleanJsonOutput(raw);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(`Gemini did not return an array of supporting blogs.`);
  }

  return parsed.map((item, idx) => ({
    id: item.id || `supp-${Date.now()}-${idx + 1}`,
    title: item.title || `${business.mainService} Satellite Guide #${idx + 1}`,
    targetKeyword: item.targetKeyword || `${business.mainService} ${business.city}`,
    searchIntent: item.searchIntent || 'Informational',
    articlePurpose: item.articlePurpose || 'Answers specific audience question and routes authority back to pillar.',
    slug: item.slug || `guide-${idx + 1}-${(business.city || 'local').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    metaDescription: item.metaDescription || `Helpful guide regarding ${business.mainService} in ${business.city}.`,
    outline: Array.isArray(item.outline) ? item.outline : ['H1: ' + (item.title || 'Guide')],
    internalLinks: Array.isArray(item.internalLinks) ? item.internalLinks : [
      {
        target: 'Pillar Blog',
        anchor: `comprehensive guide to ${business.primaryTopic || business.mainService}`,
        reason: 'Passes PageRank and topical context back to cornerstone pillar.'
      }
    ],
    fullContent: item.fullContent || `# ${item.title}\n\nContent for ${business.mainService} in ${business.city}.`
  }));
}

/**
 * 5. Single Blog Regeneration
 */
export async function generateSingleBlogLive(business, blogDetails, pillarTopic) {
  const systemPrompt = `You are a specialist SEO writer.
Write a complete, high-quality supporting blog article in Markdown for the specified topic.
Requirements:
- Start with H1 matching the title.
- Include logical H2s and H3s with actionable advice.
- Embed natural internal link placeholders back to the pillar topic "${pillarTopic}".
- Include concise FAQ or conclusion.
- Return raw Markdown only.`;

  const userPrompt = `Write the full supporting blog article for:
Title: ${blogDetails.title}
Target Keyword: ${blogDetails.targetKeyword}
Search Intent: ${blogDetails.searchIntent}
Purpose: ${blogDetails.articlePurpose}
Business: ${business.brandName} (${business.industry}) in ${business.city}
Target Audience: ${business.targetAudience}`;

  return await callGemini(systemPrompt, userPrompt, 0.6);
}

/**
 * 6. Local SEO Generation
 * Uses Prompt Template #6 from the shared Prompt Library
 */
export async function generateLocalSeoLive(business) {
  const template = getPromptById('local-seo');
  const systemPrompt = `You are a Senior Local Search Specialist.
Follow this exact framework:
${template.rawPrompt}

Return strictly valid JSON:
{
  "city": "string",
  "targetCombinations": ["string", "string"],
  "neighborhoodVariations": [
    {
      "neighborhood": "string",
      "suggestedKeyword": "string",
      "landingPageIdea": "string",
      "localIntentHook": "string"
    }
  ],
  "localizedIntroductionTemplate": "string",
  "localizedConclusionTemplate": "string",
  "recommendedSchemaTypes": [
    { "type": "string", "description": "string" }
  ],
  "complianceAndCautionNotes": ["string", "string"]
}`;

  const userPrompt = hydratePromptString(
    `Generate local SEO strategy:
Brand: {business_name}
Service: {main_service}
City: {city}
Audience: {target_audience}`,
    business
  );

  const raw = await callGemini(systemPrompt, userPrompt, 0.4);
  const parsed = cleanJsonOutput(raw);
  if (!parsed || !Array.isArray(parsed.targetCombinations)) {
    throw new Error('Gemini did not return valid local SEO architecture.');
  }
  return parsed;
}
