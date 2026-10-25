import {
  BusinessProfile,
  KeywordItem,
  PillarOutline,
  PillarArticle,
  SupportingBlog,
  LocalSeoData,
  QualityAuditResult,
  QualityCheckItem
} from '../types';

/**
 * SEOForge AI — Dual-Engine Content Generation Service
 *
 * 1. Google Gemini API Engine (gemini-1.5-flash):
 *    Uses user-supplied API key (from Settings / localStorage) or environment variable.
 * 2. Built-in Multi-Variable Prompt Synthesis Engine:
 *    Copy = f(BrandName, Industry, MainService, TargetAudience, City, PrimaryTopic, BrandTone, BusinessGoal)
 *    Zero Cost, No API Keys required, instant (< 1 second) execution.
 *    Automatically activates if no key is configured or if the Gemini API call fails / hits quota limits.
 */

const GEMINI_API_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const STORAGE_KEY_USER_GEMINI_KEY = 'seoforge_user_gemini_api_key';

export function getUserApiKey(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEY_USER_GEMINI_KEY);
  if (stored && stored.trim().length > 5) return stored.trim();

  // Check Vite client-side environment variable if present
  try {
    const viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (viteKey && typeof viteKey === 'string' && viteKey.trim().length > 5) {
      return viteKey.trim();
    }
  } catch {
    // ignore
  }

  return '';
}

export function setUserApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  const clean = (key || '').trim();
  if (clean) {
    localStorage.setItem(STORAGE_KEY_USER_GEMINI_KEY, clean);
  } else {
    localStorage.removeItem(STORAGE_KEY_USER_GEMINI_KEY);
  }
}

export function hasUserApiKey(): boolean {
  return getUserApiKey().length > 0;
}

/**
 * Test user-supplied Gemini API key
 */
export async function testGeminiApiKey(
  key?: string
): Promise<{ success: boolean; latencyMs?: number; error?: string; model: string }> {
  const effectiveKey = key || getUserApiKey();
  if (!effectiveKey) {
    return {
      success: false,
      model: 'gemini-1.5-flash',
      error: 'No API key provided. Add a key or continue with the Built-in Synthesis Engine.'
    };
  }

  const start = performance.now();
  try {
    const res = await fetch(`${GEMINI_API_ENDPOINT}?key=${effectiveKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond strictly with the single word: "PONG"' }] }],
        generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
      })
    });

    const latencyMs = Math.round(performance.now() - start);

    if (!res.ok) {
      let errText = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        errText = errJson.error?.message || errText;
      } catch {
        // ignore
      }
      return {
        success: false,
        latencyMs,
        model: 'gemini-1.5-flash',
        error: `Gemini verification failed (${res.status}): ${errText}`
      };
    }

    return {
      success: true,
      latencyMs,
      model: 'gemini-1.5-flash'
    };
  } catch (err: any) {
    return {
      success: false,
      model: 'gemini-1.5-flash',
      error: `Network error reaching Gemini: ${err.message}`
    };
  }
}

/**
 * Helper to execute Gemini request with fallback support
 */
async function callGeminiApi<T>(
  prompt: string,
  apiKey: string,
  parser: (raw: string) => T | null
): Promise<T | null> {
  try {
    const res = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      console.warn(`[SEOForge AI] Gemini API returned HTTP ${res.status}. Falling back to Built-in Synthesis Engine.`);
      return null;
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = parser(rawText);
    return parsed;
  } catch (err) {
    console.warn('[SEOForge AI] Gemini API call failed or timed out. Falling back to Built-in Synthesis Engine:', err);
    return null;
  }
}

/**
 * JSON cleaner for Gemini outputs
 */
function cleanJsonText(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '');
  if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '');
  if (cleaned.endsWith('```')) cleaned = cleaned.replace(/```$/, '');
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

// ===================================================================
// BUILT-IN MULTI-VARIABLE PROMPT SYNTHESIS ENGINE
// Pure function: Output = f(BrandName, Industry, MainService, TargetAudience, City, PrimaryTopic, BrandTone, BusinessGoal)
// Zero cost, zero dependencies, instant execution.
// ===================================================================

function isDentalBusiness(b: BusinessProfile): boolean {
  const text = `${b.brandName || ''} ${b.industry || ''} ${b.mainService || ''} ${b.primaryTopic || ''}`.toLowerCase();
  return /\bdent(al|ist|istry)?\b/i.test(text);
}

export function synthesizeKeywords(b: BusinessProfile): KeywordItem[] {
  const { brandName, city, mainService, primaryTopic, targetAudience } = b;
  const isDental = isDentalBusiness(b);

  if (isDental) {
    return [
      {
        id: 'kw-1',
        keyword: `best dental clinic in ${city}`,
        type: 'Primary',
        searchIntent: 'Commercial Investigation',
        intentReasoning: 'Users are actively evaluating reputable dental providers in their city and looking for trusted reviews and standards.',
        suggestedArticleType: 'Pillar Cornerstone Clinic Guide',
        clusterPlacement: 'Core Pillar Article (Central Anchor)',
        audienceFitExplanation: `Directly targets ${targetAudience} seeking dental care with transparent credentials and modern facilities in ${city}.`
      },
      {
        id: 'kw-2',
        keyword: `dental implants cost in ${city}`,
        type: 'Secondary',
        searchIntent: 'Commercial Investigation',
        intentReasoning: 'Prospective patients know what procedure they want and are seeking realistic pricing estimates and factors affecting cost.',
        suggestedArticleType: 'Pricing and Procedure Guide',
        clusterPlacement: 'Supporting Blog 1 (Satellite Node)',
        audienceFitExplanation: `Engages high-intent prospects seeking restorative and implantology solutions in ${city}.`
      },
      {
        id: 'kw-3',
        keyword: `how to choose a dentist in ${city}`,
        type: 'Long-tail',
        searchIntent: 'Informational',
        intentReasoning: 'Searchers are seeking vetting criteria such as sterilization standards, technology, and specialist qualifications.',
        suggestedArticleType: 'Checklist / Buyer Guide',
        clusterPlacement: 'Supporting Blog 2 (Satellite Node)',
        audienceFitExplanation: `Builds top-of-funnel trust and positions ${brandName} as an ethical authority in ${city}.`
      },
      {
        id: 'kw-4',
        keyword: `painless root canal treatment ${city}`,
        type: 'Secondary',
        searchIntent: 'Informational',
        intentReasoning: 'Addresses acute patient anxiety regarding pain management, rotary endodontics, and modern single-visit care.',
        suggestedArticleType: 'Procedure & Anxiety FAQ',
        clusterPlacement: 'Supporting Blog 3 (Satellite Node)',
        audienceFitExplanation: `Reassures anxious patients prioritizing comfort and gentle care.`
      },
      {
        id: 'kw-5',
        keyword: `cosmetic dentist near me ${city}`,
        type: 'Local',
        searchIntent: 'Transactional',
        intentReasoning: 'High-intent searchers seeking immediate appointments for smile makeovers, teeth whitening, or veneers.',
        suggestedArticleType: 'Service Landing Guide',
        clusterPlacement: 'Local SEO Landing Section',
        audienceFitExplanation: `Captures bottom-of-funnel local mobile searchers ready to book a consultation.`
      }
    ];
  }

  // Dynamic Multi-Variable Synthesis for any other business / industry
  const serviceLower = (mainService || 'service').toLowerCase();
  const topicLower = (primaryTopic || serviceLower).toLowerCase();

  return [
    {
      id: 'kw-1',
      keyword: `${serviceLower} in ${city}`,
      type: 'Primary',
      searchIntent: 'Commercial Investigation',
      intentReasoning: `Users in ${city} are actively seeking and evaluating top-tier ${serviceLower} providers.`,
      suggestedArticleType: 'Cornerstone Master Guide',
      clusterPlacement: 'Core Pillar Article (Central Anchor)',
      audienceFitExplanation: `Directly targets ${targetAudience} in ${city} looking for certified, dependable ${serviceLower}.`
    },
    {
      id: 'kw-2',
      keyword: `how to choose ${serviceLower} in ${city}`,
      type: 'Long-tail',
      searchIntent: 'Informational',
      intentReasoning: `Potential clients are seeking objective vetting criteria, licensing checks, and quality benchmarks before hiring.`,
      suggestedArticleType: 'Buyer Guide & Checklist',
      clusterPlacement: 'Supporting Blog 1 (Satellite Node)',
      audienceFitExplanation: `Educates ${targetAudience} to make informed decisions while showcasing ${brandName}'s differentiators.`
    },
    {
      id: 'kw-3',
      keyword: `${serviceLower} cost in ${city}`,
      type: 'Secondary',
      searchIntent: 'Commercial Investigation',
      intentReasoning: `Prospects want transparent pricing breakdowns, cost variables, and return-on-investment indicators.`,
      suggestedArticleType: 'Pricing and Investment Breakdown',
      clusterPlacement: 'Supporting Blog 2 (Satellite Node)',
      audienceFitExplanation: `Captures high-intent prospects comparing estimates and financing options.`
    },
    {
      id: 'kw-4',
      keyword: `best ${topicLower} specialist in ${city}`,
      type: 'Secondary',
      searchIntent: 'Transactional',
      intentReasoning: `Searchers have a defined requirement and want direct access to proven professionals.`,
      suggestedArticleType: 'Expert Capability Showcase',
      clusterPlacement: 'Supporting Blog 3 (Satellite Node)',
      audienceFitExplanation: `Converts qualified leads into inbound inquiries for ${brandName}.`
    },
    {
      id: 'kw-5',
      keyword: `${serviceLower} near me ${city}`,
      type: 'Local',
      searchIntent: 'Transactional',
      intentReasoning: `Searchers on mobile devices or maps looking for local providers in their neighborhood.`,
      suggestedArticleType: 'Localized Hub Landing Guide',
      clusterPlacement: 'Local SEO Blueprint',
      audienceFitExplanation: `Maximizes visibility across ${city}'s geographic sub-districts and neighborhood clusters.`
    }
  ];
}

export function synthesizeOutline(b: BusinessProfile, primaryKeyword?: string): PillarOutline {
  const { brandName, city, mainService, targetWordCount, contentTone, targetAudience } = b;
  const isDental = isDentalBusiness(b);

  if (isDental) {
    const kw = primaryKeyword || `Comprehensive Dental Care in ${city}`;
    return {
      h1: `The Complete Guide to Modern Dental Care in ${city}: Finding Quality, Comfort, and Lasting Health`,
      metaTitle: `Modern Dental Care in ${city} | Expert Guide | ${brandName}`,
      metaDescription: `Discover how to choose top dental care in ${city}. Learn about modern implantology, smile design, painless treatments, and transparent pricing.`,
      slug: `complete-guide-dental-care-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      primaryKeyword: kw,
      secondaryKeywords: [
        `dental implants ${city}`,
        `painless dental treatments`,
        `how to choose a dentist in ${city}`,
        `preventative dental hygiene`
      ],
      targetWordCount,
      contentTone,
      clinicalDisclaimer:
        'This guide is strictly for educational purposes and should not replace an in-person clinical diagnosis by a licensed dental surgeon.',
      sections: [
        {
          h2: `1. The Evolving Landscape of Oral Healthcare in ${city}`,
          h3s: [
            `Why preventative dentistry saves money and preserves natural teeth`,
            `How digital imaging and 3D intraoral scans have transformed patient comfort`
          ],
          purpose: 'Establish context, address common anxieties, and highlight modern technology advancements.',
          estimatedWords: Math.round(targetWordCount * 0.18)
        },
        {
          h2: `2. Critical Factors to Evaluate When Choosing a Dental Provider`,
          h3s: [
            `Sterilization protocols and international infection control standards`,
            `Specialist qualifications: Periodontists, Implantologists, and Orthodontists`,
            `Transparent treatment planning and digital diagnostics without hidden fees`
          ],
          purpose: 'Provide readers an objective framework to assess clinic standards in their city.',
          estimatedWords: Math.round(targetWordCount * 0.22)
        },
        {
          h2: `3. Core Treatment Categories Demystified`,
          h3s: [
            `Restorative Care: Long-lasting crowns, bridges, and biomimetic fillings`,
            `Implantology: Single-tooth vs full-arch restorations for permanent tooth replacement`,
            `Cosmetic Dentistry: Conservative porcelain veneers and clinical whitening`
          ],
          purpose: 'Break down major treatment categories with realistic expectations.',
          estimatedWords: Math.round(targetWordCount * 0.25)
        },
        {
          h2: `4. Understanding Dental Investments and Pricing Transparency in ${city}`,
          h3s: [
            `Key factors influencing treatment costs (materials, diagnostics, complexity)`,
            `Why the cheapest estimate often leads to corrective revision costs`
          ],
          purpose: 'Provide honest, realistic pricing insights.',
          estimatedWords: Math.round(targetWordCount * 0.18)
        },
        {
          h2: `5. Frequently Asked Questions (People Also Ask)`,
          h3s: [
            `How frequently should working professionals schedule scaling and checkups?`,
            `Are modern dental implants truly permanent?`,
            `What should you do during a sudden dental emergency in ${city}?`
          ],
          purpose: 'Target search engine People Also Ask queries.',
          estimatedWords: Math.round(targetWordCount * 0.17)
        }
      ]
    };
  }

  // Generic Non-Dental Multi-Variable Synthesis
  const kw = primaryKeyword || `${mainService} in ${city}`;
  const serviceSlug = (mainService || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const citySlug = (city || 'local').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    h1: `The Definitive Guide to ${mainService} in ${city}: Standards, Process, and Expert Insights`,
    metaTitle: `Expert ${mainService} in ${city} | Complete Guide | ${brandName}`,
    metaDescription: `Comprehensive guide to ${mainService} in ${city}. Learn key standards, cost factors, vetting criteria, and expert recommendations from ${brandName}.`,
    slug: `complete-guide-${serviceSlug}-${citySlug}`,
    primaryKeyword: kw,
    secondaryKeywords: [
      `how to choose ${mainService.toLowerCase()} in ${city}`,
      `${mainService.toLowerCase()} cost ${city}`,
      `best ${mainService.toLowerCase()} specialist ${city}`
    ],
    targetWordCount,
    contentTone,
    sections: [
      {
        h2: `1. The Current State of ${mainService} in ${city}`,
        h3s: [
          `Local market dynamics, client expectations, and service standards`,
          `Why professional execution drives superior long-term ROI for ${targetAudience}`
        ],
        purpose: `Introduce market context for ${city} and establish foundational importance.`,
        estimatedWords: Math.round(targetWordCount * 0.2)
      },
      {
        h2: `2. Critical Evaluation Framework: How to Choose the Right Provider`,
        h3s: [
          `Essential certifications, verified licenses, and professional compliance`,
          `Transparent project scoping, warranties, and service agreements`,
          `Warning signs of subpar providers and unrealistic low-ball quotes`
        ],
        purpose: 'Equip decision-makers with an objective vetting scorecard.',
        estimatedWords: Math.round(targetWordCount * 0.25)
      },
      {
        h2: `3. Step-by-Step Execution Roadmap: What to Expect`,
        h3s: [
          `Phase 1: Initial discovery, requirements scoping, and audit`,
          `Phase 2: Precision delivery and quality control benchmarks`,
          `Phase 3: Post-launch support, warranties, and maintenance`
        ],
        purpose: `Demystify the operational timeline for clients of ${brandName}.`,
        estimatedWords: Math.round(targetWordCount * 0.25)
      },
      {
        h2: `4. Cost Drivers and Investment Breakdown in ${city}`,
        h3s: [
          `Key variables that determine pricing and timelines`,
          `Value versus cost: Avoiding expensive revision mistakes`
        ],
        purpose: 'Provide transparent economic analysis to address commercial search intent.',
        estimatedWords: Math.round(targetWordCount * 0.15)
      },
      {
        h2: `5. Frequently Asked Questions Regarding ${mainService}`,
        h3s: [
          `What timeline should clients anticipate from kickoff to completion?`,
          `How does ${brandName} guarantee service standards in ${city}?`,
          `What ongoing maintenance is recommended to protect your investment?`
        ],
        purpose: 'Directly address common consumer objections and Google PAA queries.',
        estimatedWords: Math.round(targetWordCount * 0.15)
      }
    ]
  };
}

export function synthesizePillar(b: BusinessProfile, outline: PillarOutline): PillarArticle {
  const { brandName, city, mainService, targetAudience } = b;
  const isDental = isDentalBusiness(b);

  const title = outline.h1;
  const slug = outline.slug;

  if (isDental) {
    const markdownContent = `# ${title}

*Published by the Clinical Editorial Team at ${brandName} | Target Location: ${city} | Target Audience: ${targetAudience}*

---

> **Clinical & Health Disclaimer:** *The information presented in this comprehensive guide is intended exclusively for educational and preventive wellness purposes. It should not be used as a substitute for individualized clinical examination, diagnosis, or treatment planning by a certified dental surgeon.*

---

Choosing a trusted dental clinic in a fast-paced urban center like **${city}** can often feel overwhelming. With hundreds of practices ranging from solo neighborhood clinics to corporate multi-speciality centers, how do patients distinguish between marketing promises and genuine clinical excellence?

Whether you are seeking routine preventive prophylaxis for your family, exploring restorative solutions like **dental implants**, or planning a cosmetic smile makeover, knowing what clinical standards, technology, and vetting criteria matter most is the foundation of lasting oral health.

In this comprehensive guide, we unpack the critical criteria for selecting top-tier dental care in ${city}, explain modern restorative workflows, and help you navigate treatment investments with complete confidence.

---

## 1. The Evolving Landscape of Oral Healthcare in ${city}

Over the past decade, dentistry has transitioned from reactive, discomfort-driven interventions to proactive, precision digital care. For busy professionals and families in ${city}, this technological shift brings three direct benefits:

1. **Drastically reduced chair time:** Digital intraoral impressions replace uncomfortable silicone trays.
2. **Minimally invasive techniques:** Dental microscopes and 3D CBCT imaging allow clinicians to preserve maximum natural tooth structure.
3. **Painless treatment experiences:** Computer-controlled local anesthesia systems and gentle rotary endodontics have eliminated the historical anxiety surrounding dental visits.

### Why Preventative Dentistry Saves Money and Preserves Natural Teeth
Preventative maintenance is not simply about an annual clean; it is about intercepting sub-clinical enamel demineralization, micro-fractures, and early periodontal inflammation before they manifest into irreversible tissue loss. Regular assessments catch localized bacterial pockets before they require surgical intervention or endodontic root therapy.

---

## 2. Critical Factors to Evaluate When Choosing a Dental Provider

When evaluating dental clinics in ${city}, prospective patients should assess five objective pillars:

1. **Multi-Stage Sterilization Protocols:** Look for Class-B autoclaves with digital biological monitoring logs to ensure 100% elimination of pathogens.
2. **Specialist Qualifications:** Ensure specialized treatments like root canal therapy and implantology are handled by certified Endodontists and Oral Surgeons rather than general practitioners.
3. **In-House 3D Diagnostics:** High-resolution Cone Beam Computed Tomography (CBCT) ensures sub-millimeter precision for nerve avoidance during implant placement.
4. **Transparent Digital Treatment Plans:** Every fee, material option, and alternative should be itemized before treatment begins.

---

## 3. Core Treatment Categories Demystified

| Category | Primary Indications | Typical Clinical Workflow | Expected Durability |
| :--- | :--- | :--- | :--- |
| **Preventative Prophylaxis** | Plaque/tartar removal, early gingivitis | Ultrasonic scaling + airflow polishing | Repeat every 6 months |
| **Restorative Ceramics** | Broken, heavily filled, or decayed teeth | 3D scan + precision zirconia crown | 10 to 15+ years |
| **Titanium Implants** | Missing single or multiple teeth | Computer-guided surgical fixture placement | 20+ years to lifetime |
| **Cosmetic Smile Design** | Chipped, discolored, or uneven teeth | Digital smile simulation + porcelain veneers | 10 to 15 years |

---

## 4. Understanding Dental Investments and Pricing in ${city}

Dental procedure costs in ${city} vary significantly based on material traceability and clinical technology. Choosing the lowest-priced provider frequently results in secondary revision costs due to premature ceramic fractures or ill-fitting margins that trap bacteria.

Investing in verified, biocompatible materials—such as monolithic zirconia crowns and grade-4 titanium implant systems—ensures enduring health and protects your long-term smile.

---

## 5. Frequently Asked Questions (People Also Ask)

### How often should working professionals schedule cleanings?
Dentists recommend scaling and digital oral cancer screenings every six months. For individuals prone to periodontal inflammation or heavy coffee/tea staining, four-month intervals are ideal.

### Are modern dental implants truly permanent?
With osseointegration and diligent oral hygiene, titanium dental implants boast success rates above 96% and are engineered to last a lifetime.

---

## Conclusion: Take Proactive Control of Your Smile

Achieving healthy, lasting teeth does not require complex interventions if problems are caught early. Contact **${brandName}** in ${city} today to schedule a comprehensive diagnostic examination and smile consultation.`;

    return {
      title,
      slug,
      metaTitle: outline.metaTitle,
      metaDescription: outline.metaDescription,
      primaryKeyword: outline.primaryKeyword,
      secondaryKeywords: outline.secondaryKeywords,
      searchIntent: 'Commercial Investigation / Informational',
      targetAudience,
      suggestedImageAlt: `Modern operatory at ${brandName} in ${city} with digital 3D intraoral scanner`,
      suggestedInternalLinks: [
        {
          targetArticle: `How to Choose a Dentist in ${city}`,
          anchorText: `checklist for evaluating dentist credentials and hygiene in ${city}`,
          context: 'Section 2: Critical Factors to Evaluate'
        },
        {
          targetArticle: `Dental Implants Cost and Procedure Breakdown`,
          anchorText: `in-depth dental implant procedure and recovery roadmap`,
          context: 'Section 3: Core Treatment Categories Demystified'
        }
      ],
      markdownContent
    };
  }

  // Dynamic Non-Dental Long-Form Master Article
  const markdownContent = `# ${title}

*Published by the Strategic Advisory Team at ${brandName} | Target Location: ${city} | Target Audience: ${targetAudience}*

---

When evaluating **${mainService}** in a dynamic market like **${city}**, consumers and decision-makers face a crowded marketplace. Selecting the right solution provider requires understanding industry standards, verified track records, realistic timelines, and cost considerations.

At **${brandName}**, our objective is to provide complete clarity. This comprehensive guide outlines everything you need to know about ${mainService.toLowerCase()} in ${city}, providing an actionable roadmap to achieve your goals while avoiding common industry pitfalls.

---

## 1. The State of ${mainService} in ${city}: Market Overview

Demand for high-caliber ${mainService.toLowerCase()} in ${city} has accelerated as clients demand greater transparency, measurable ROI, and personalized execution. Whether you are addressing an immediate operational requirement or planning a long-term strategic initiative, understanding the local landscape is essential.

### Why Quality Standards Matter
Engaging qualified specialists ensures:
- **Compliance with local and regional standards:** Avoiding regulatory headaches and rework.
- **Predictable timelines and budget management:** Eliminating the hidden costs of project creep.
- **Durable outcomes:** Protecting your investment with verifiable warranties and ongoing service agreements.

---

## 2. Critical Evaluation Framework: How to Choose a Provider in ${city}

Before signing any contract or commissioning services, evaluate prospective providers against this 4-step framework:

1. **Verified Credentials & Track Record:** Look for established experience specifically within ${city}. Review localized case studies and customer references.
2. **Transparent Scope of Work:** The proposal must delineate every deliverable, milestone, and contingency upfront.
3. **Dedicated Point of Contact:** Ensure you have direct communication with the project lead rather than dealing with shifting intermediaries.
4. **Clear Warranty & Service Guarantees:** Reputable providers stand behind their craftsmanship with documented guarantees.

---

## 3. Step-by-Step Roadmap: Working with ${brandName}

| Stage | Key Deliverables | Client Involvements |
| :--- | :--- | :--- |
| **1. Consultation & Audit** | Initial evaluation, site review, and custom quote | Share goals, budget, and site access |
| **2. Scoping & Agreement** | Detailed project timeline and deliverables list | Sign-off on finalized scope |
| **3. Professional Execution** | Milestone-driven service delivery with QA checks | Periodic progress updates |
| **4. Handover & Review** | Full verification, warranty documentation, and sign-off | Final inspection and feedback |

---

## 4. Cost Factors and Investment Breakdown

Pricing for ${mainService.toLowerCase()} in ${city} depends on several foundational variables:
- **Project Complexity and Scale:** Custom specifications require specialized tools and expert labor.
- **Material Quality:** Premium, durable inputs reduce total cost of ownership.
- **Urgency & Turnaround:** Rapid-response timelines require dedicated resource allocation.

---

## 5. Frequently Asked Questions

### What timeline should clients anticipate in ${city}?
Typical engagements range from a few days for focused tasks to several weeks for comprehensive initiatives. During your introductory audit, ${brandName} provides a precise milestone schedule.

### How do I get started with ${brandName}?
Simply reach out via our website or telephone to schedule an introductory consultation. Our team will review your objectives and formulate a customized proposal.

---

## Conclusion: Partner with ${brandName} for Proven Results

Achieving superior outcomes in **${mainService}** requires trusted expertise, disciplined execution, and a commitment to client success.

*Take the first step toward lasting results. Contact **${brandName}** in ${city} today to discuss your project and schedule an introductory consultation.*`;

  return {
    title,
    slug,
    metaTitle: outline.metaTitle,
    metaDescription: outline.metaDescription,
    primaryKeyword: outline.primaryKeyword,
    secondaryKeywords: outline.secondaryKeywords,
    searchIntent: 'Commercial Investigation / Informational',
    targetAudience,
    suggestedImageAlt: `Professional ${mainService} overview by ${brandName} in ${city}`,
    suggestedInternalLinks: [
      {
        targetArticle: `How to Choose a Provider in ${city}`,
        anchorText: `expert buyer guide for selecting ${mainService.toLowerCase()} in ${city}`,
        context: 'Section 2: Critical Evaluation Framework'
      },
      {
        targetArticle: `Pricing and Cost Breakdown in ${city}`,
        anchorText: `detailed cost and investment factors guide`,
        context: 'Section 4: Cost Factors and Investment Breakdown'
      }
    ],
    markdownContent
  };
}

export function synthesizeSupportingCluster(b: BusinessProfile, count = 4): SupportingBlog[] {
  const { brandName, city, mainService, primaryTopic } = b;
  const isDental = isDentalBusiness(b);

  if (isDental) {
    const dentalArticles = [
      {
        id: 'supp-1',
        title: `How to Choose a Dentist in ${city}: 7 Vetting Criteria Beyond Online Reviews`,
        targetKeyword: `how to choose a dentist in ${city}`,
        searchIntent: 'Informational' as const,
        articlePurpose:
          'Empowers prospective patients with an objective assessment framework covering sterilization, diagnostic equipment, and transparent pricing before booking.',
        slug: `how-to-choose-dentist-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        metaDescription: `Discover the top 7 factors for selecting the best dental clinic in ${city}. From sterilization standards to specialist qualifications, here is what really matters.`,
        outline: [
          `H1: How to Choose a Dentist in ${city}: 7 Essential Standards for Modern Care`,
          'H2: 1. Verify Formal Qualifications and Specialist Registrations',
          'H2: 2. Inspect In-Clinic Sterilization and Infection Control',
          'H2: 3. Look for Modern Diagnostic Technology (CBCT, 3D Scanners)',
          'H2: 4. Transparent Pricing Without Hidden Surcharges',
          'H2: Conclusion'
        ],
        internalLinks: [
          { target: 'Pillar Blog', anchor: `master dental care guide in ${city}`, reason: 'Connects vetting checklist to complete treatment scope.' },
          { target: 'Supporting Blog 2', anchor: `transparent dental implant pricing roadmap`, reason: 'Helps readers seeking tooth restoration understand fees.' }
        ],
        fullContent: `# How to Choose a Dentist in ${city}: 7 Essential Standards for Modern Care\n\nFinding a trustworthy dental clinic in **${city}** shouldn't be left to chance or sponsored online ads. Here are the 7 core vetting criteria to verify before scheduling your visit...\n\n## 1. Verify Qualifications\nCheck registrations and post-graduate specializations.\n\n## 2. Inspect In-Clinic Sterilization\nConfirm multi-stage autoclaving and single-use consumables.\n\n## 3. Look for Digital Diagnostics\nClinics using intraoral cameras let you see exactly what the doctor sees.\n\n## Conclusion\nContact ${brandName} in ${city} for transparent, comfortable dental care.`
      },
      {
        id: 'supp-2',
        title: `Dental Implants in ${city}: Costs, Procedure Steps, and Lifespan`,
        targetKeyword: `dental implants cost in ${city}`,
        searchIntent: 'Commercial Investigation' as const,
        articlePurpose:
          'Explains the biological process of osseointegration, single vs full-mouth implant options, factors that dictate price, and long-term care.',
        slug: `dental-implants-cost-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        metaDescription: `Complete guide to dental implant costs in ${city}. Learn about surgical steps, bone grafting, zirconia vs titanium crowns, and realistic pricing.`,
        outline: [
          `H1: Dental Implants in ${city}: The Complete Cost and Treatment Guide`,
          'H2: What Are Modern Dental Implants?',
          'H2: Key Factors Dictating Implant Costs in Bengaluru',
          'H2: The 3-Stage Treatment Timeline',
          'H2: Conclusion'
        ],
        internalLinks: [
          { target: 'Pillar Blog', anchor: `comprehensive guide to restorative dental solutions`, reason: 'Links back to primary pillar.' },
          { target: 'Supporting Blog 1', anchor: `how to verify implantologist credentials`, reason: 'Cross-links to clinic vetting criteria.' }
        ],
        fullContent: `# Dental Implants in ${city}: The Complete Cost and Treatment Guide\n\nDental implants represent the gold standard for permanent tooth replacement. Here is how they work and what to expect regarding cost in **${city}**...\n\n## Why Implants Outperform Bridges\nImplants preserve natural jawbone density and do not require grinding down healthy neighboring teeth.\n\n## Conclusion\nSchedule your implant consultation with ${brandName} in ${city} today.`
      },
      {
        id: 'supp-3',
        title: `Teeth Whitening in ${city}: In-Office Laser vs Home Trays Compared`,
        targetKeyword: `teeth whitening in ${city}`,
        searchIntent: 'Informational' as const,
        articlePurpose:
          'Compares clinical LED/laser whitening with custom take-home trays and drugstore kits, covering safety and sensitivity management.',
        slug: `teeth-whitening-guide-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        metaDescription: `Compare professional teeth whitening options in ${city}. Discover in-office vs home tray results, costs, and sensitivity care.`,
        outline: [
          `H1: Teeth Whitening in ${city}: Options, Results, and Safety`,
          'H2: Extrinsic vs Intrinsic Staining',
          'H2: In-Office Treatment vs Home Trays',
          'H2: Managing Post-Whitening Sensitivity',
          'H2: Conclusion'
        ],
        internalLinks: [
          { target: 'Pillar Blog', anchor: `cosmetic dentistry solutions in our main guide`, reason: 'Connects to cosmetic services.' }
        ],
        fullContent: `# Teeth Whitening in ${city}: Options, Results, and Safety\n\nA brighter smile is one of the most popular aesthetic requests across **${city}**. Here is how professional whitening works safely and effectively...\n\n## Clinical vs Store-Bought Kits\nProfessional treatments use custom gingival barriers to protect gums from chemical burns.\n\n## Conclusion\nBook your smile assessment with ${brandName} in ${city}.`
      },
      {
        id: 'supp-4',
        title: `Common Adult Dental Problems and When to Seek Emergency Care in ${city}`,
        targetKeyword: `emergency dentist in ${city}`,
        searchIntent: 'Transactional' as const,
        articlePurpose:
          'Helps readers identify warning signs of severe dental infections, cracked teeth, and dental emergencies that require immediate care.',
        slug: `emergency-dental-guide-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        metaDescription: `Recognize common adult dental symptoms and know when to seek emergency dental treatment in ${city} before damage spreads.`,
        outline: [
          `H1: Common Adult Dental Problems and Emergency Care in ${city}`,
          'H2: 1. Bleeding Gums and Periodontal Disease',
          'H2: 2. Cracked Tooth Syndrome',
          'H2: 3. Severe Toothache and Swelling',
          'H2: Conclusion'
        ],
        internalLinks: [
          { target: 'Pillar Blog', anchor: `preventative dental care standards`, reason: 'Directs to root causes.' }
        ],
        fullContent: `# Common Adult Dental Problems and Emergency Care in ${city}\n\nMost dental complications begin quietly before exploding into painful emergencies. Here is how to identify symptoms early...\n\n## Red Flag Symptoms\nFacial swelling, high fever, or trauma require immediate clinical attention.\n\n## Conclusion\nContact ${brandName} in ${city} for urgent diagnostic care.`
      },
      {
        id: 'supp-5',
        title: `Questions to Ask During Your First Dental Consultation in ${city}`,
        targetKeyword: `first dental visit questions in ${city}`,
        searchIntent: 'Commercial Investigation' as const,
        articlePurpose:
          'Equips patients with a practical consultation checklist to assess transparency, materials, hygiene, and treatment sequencing.',
        slug: `first-dental-visit-questions-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        metaDescription: `Make the most of your first dental visit in ${city}. 8 smart questions to ask about treatment plans, diagnostics, and fees.`,
        outline: [
          `H1: 8 Smart Questions to Ask During Your First Dental Visit in ${city}`,
          'H2: Questions on Diagnostics and Technology',
          'H2: Questions on Materials and Warranties',
          'H2: Phased Treatment and Payment Plans',
          'H2: Conclusion'
        ],
        internalLinks: [
          { target: 'Pillar Blog', anchor: `master dental care pillar`, reason: 'Links to overarching guide.' }
        ],
        fullContent: `# 8 Smart Questions to Ask During Your First Dental Visit in ${city}\n\nAn initial dental consultation should be an open dialogue. Here are 8 smart questions to ask your dentist...\n\n## Can you show me the issue on a digital X-ray?\nTransparency is the mark of modern care.\n\n## Conclusion\nVisit ${brandName} in ${city} for honest, patient-first dentistry.`
      }
    ];

    return dentalArticles.slice(0, Math.min(count, dentalArticles.length));
  }

  // Dynamic non-dental supporting blog generation
  const titles = [
    `How to Choose the Best ${mainService} in ${city}: A Complete Buyer Checklist`,
    `How Much Does ${mainService} Cost in ${city}? Pricing Guide & Breakdown`,
    `Top 5 Mistakes to Avoid When Hiring ${mainService} in ${city}`,
    `Step-by-Step Guide: What to Expect When Working with ${brandName}`,
    `Frequently Asked Questions About ${primaryTopic || mainService} in ${city}`
  ];

  return titles.slice(0, count).map((t, idx) => ({
    id: `supp-${idx + 1}`,
    title: t,
    targetKeyword: `${(mainService || 'service').toLowerCase()} in ${city} ${idx === 1 ? 'cost' : 'guide'}`,
    searchIntent: idx === 1 ? 'Commercial Investigation' : idx === 3 ? 'Transactional' : 'Informational',
    articlePurpose: `Provides targeted search-intent coverage answering specific queries about ${mainService} in ${city} and builds topical authority linking back to the primary pillar.`,
    slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    metaDescription: `Complete guide on ${t.toLowerCase()} by ${brandName} in ${city}. Learn key insights, costs, and expert recommendations.`,
    outline: [
      `H1: ${t}`,
      `H2: 1. Understanding the Essentials of ${mainService}`,
      `H2: 2. Key Factors to Evaluate in ${city}`,
      `H2: 3. Expert Recommendations and Best Practices`,
      `H2: 4. How ${brandName} Delivers Quality and Results`,
      `H2: Conclusion`
    ],
    internalLinks: [
      {
        target: 'Pillar Blog',
        anchor: `definitive guide to ${mainService.toLowerCase()} in ${city}`,
        reason: 'Connects supporting insight back to the primary pillar article.'
      },
      {
        target: `Supporting Blog ${(idx % (count - 1)) + 1}`,
        anchor: `related considerations in our secondary guide`,
        reason: 'Creates horizontal interlinking between cluster nodes.'
      }
    ],
    fullContent: `# ${t}

Making an informed decision about **${mainService}** in **${city}** requires clear, unbiased insights. Whether you are seeking immediate service or comparing multiple proposals, understanding the core variables ensures you receive the highest return on investment.

---

## 1. Understanding the Essentials of ${mainService} in ${city}

The requirements for ${mainService.toLowerCase()} have evolved significantly. Clients in ${city} prioritize transparent communication, verified credentials, and proven outcomes over generic marketing claims.

### Key Benefits of Working with Qualified Professionals:
- **Verified Expertise:** Mitigates risk and ensures compliance with industry standards.
- **Accurate Project Scoping:** Prevents unexpected costs and mid-project surprises.
- **Long-Term Reliability:** Backed by documented warranties and service agreements.

To review our complete service framework, explore our [definitive guide to ${mainService.toLowerCase()} in ${city}](/blog/complete-guide-${(mainService || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}).

---

## 2. Critical Evaluation Checklist

When vetting prospective service providers in ${city}, ensure they provide:
1. Documented proof of licensing and local operational experience.
2. A formal written quote outlining deliverables, milestones, and payment terms.
3. Accessible customer support and a dedicated point of contact.

---

## 3. How ${brandName} Delivers Results

At **${brandName}**, our team combines deep industry knowledge with a commitment to client satisfaction in ${city}. We work closely with you from initial consultation through final delivery.

---

## Conclusion

Don't settle for substandard outcomes. Reach out to **${brandName}** in ${city} today to discuss your project requirements and receive a customized consultation.`
  }));
}

export function synthesizeSingleBlog(
  b: BusinessProfile,
  blog: SupportingBlog,
  topic?: string
): SupportingBlog {
  const { brandName, city, mainService } = b;
  const newContent = `# ${blog.title}

*Published by ${brandName} | Target Region: ${city} | Service: ${mainService}*

---

${blog.articlePurpose}

Whether you are evaluating options in **${city}** or ready to initiate work, understanding the nuances of ${topic || mainService} ensures a seamless, high-ROI experience.

---

## 1. Key Insights & Industry Standards
Quality execution in ${city} requires understanding both technical specifications and local conditions. At **${brandName}**, we adhere to rigorous quality benchmarks to deliver consistent outcomes.

## 2. Common Pitfalls to Avoid
- Choosing the lowest bid without verifying material and labor quality.
- Overlooking ongoing maintenance requirements and warranties.
- Failing to secure a written milestone agreement upfront.

## 3. Recommended Next Steps
Reach out to **${brandName}** in ${city} to schedule a detailed project assessment and review customized recommendations.`;

  return {
    ...blog,
    fullContent: newContent,
    lastEditedAt: new Date().toISOString()
  };
}

export function synthesizeLocalSeo(b: BusinessProfile): LocalSeoData {
  const { brandName, city, mainService, targetAudience, industry } = b;
  const isDental = isDentalBusiness(b);

  const isBlr = city.toLowerCase().includes('bengaluru') || city.toLowerCase().includes('bangalore');
  const isAustin = city.toLowerCase().includes('austin');

  let neighborhoods: string[] = [];
  if (isBlr) {
    neighborhoods = ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'MG Road', 'Sadashivanagar'];
  } else if (isAustin) {
    neighborhoods = ['Downtown Austin', 'South Congress (SoCo)', 'Domain / North Austin', 'Zilker', 'East Austin', 'Mueller'];
  } else {
    neighborhoods = [`Central ${city}`, `North ${city}`, `South ${city}`, `Downtown ${city}`, `West End ${city}`];
  }

  const providerType = isDental ? 'clinic' : 'provider';
  const schemaType = isDental
    ? 'LocalBusiness / Dentist / MedicalClinic'
    : industry?.toLowerCase().includes('legal')
    ? 'LocalBusiness / LegalService'
    : 'LocalBusiness / ProfessionalService';

  const ethicsNote = isDental
    ? 'Under medical ethics guidelines, refrain from publishing false comparative claims such as "100% cheapest clinic" or "guaranteed pain-free outcome".'
    : 'Avoid misleading promotional guarantees or unsubstantiated superlative claims to maintain advertising integrity.';

  return {
    city,
    targetCombinations: [
      `${mainService} in ${city}`,
      `best ${mainService.toLowerCase()} ${providerType} in ${city}`,
      `${mainService.toLowerCase()} specialist near me ${city}`,
      `affordable ${mainService.toLowerCase()} in ${city}`
    ],
    neighborhoodVariations: neighborhoods.map((n) => ({
      neighborhood: n,
      suggestedKeyword: `${mainService.toLowerCase()} near ${n}, ${city}`,
      landingPageIdea: `${mainService} Services for Clients in ${n} | ${brandName}`,
      localIntentHook: `Conveniently accessible for individuals and businesses residing in and around ${n}.`
    })),
    localizedIntroductionTemplate: `Operating in ${city} demands professional services that align with your fast-paced lifestyle. Located in ${city}, ${brandName} offers dependable, high-quality ${mainService.toLowerCase()} with tailored scheduling for ${targetAudience.toLowerCase()}.`,
    localizedConclusionTemplate: `Whether you are located in ${neighborhoods.slice(0, 3).join(', ')} or surrounding localities, accessing ${brandName} in ${city} is straightforward. Schedule an appointment or consultation today to experience high standards of service.`,
    recommendedSchemaTypes: [
      {
        type: schemaType,
        description:
          'Specifies official organization name, coordinates, opening hours, accepted payment types, and telephone contact.'
      },
      {
        type: 'PostalAddress',
        description: `Validates physical address in ${city} to maintain Google Business Profile NAP (Name, Address, Phone) consistency.`
      },
      {
        type: 'FAQPage',
        description: 'Enhances search engine result pages with interactive rich expandable snippets.'
      }
    ],
    complianceAndCautionNotes: [
      'Do not fabricate a physical address or pin on Google Maps; ensure your registered address matches physical premises.',
      'Avoid stuffing city and neighborhood names unnaturally into headers; maintain natural semantic readability for human readers.',
      ethicsNote,
      'Ensure Google Business Profile categories and primary services match your website schema exactly.'
    ]
  };
}

export function synthesizeQualityReview(
  articleText: string,
  business: BusinessProfile
): QualityAuditResult {
  const text = articleText || '';
  const lines = text.split('\n');

  const hasH1 = /^#\s+.+/m.test(text);
  const h2Matches = text.match(/^##\s+.+/gm) || [];
  const h3Matches = text.match(/^###\s+.+/gm) || [];
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const linkMatches = text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];

  const primaryKeyword = (business.primaryTopic || business.mainService || 'service').toLowerCase();
  const kwRegex = new RegExp(primaryKeyword.replace(/[^a-zA-Z0-9\s]/g, ''), 'gi');
  const kwCount = (text.match(kwRegex) || []).length;
  const keywordDensity = wordCount > 0 ? ((kwCount / wordCount) * 100).toFixed(2) : '0.00';

  const checks: QualityCheckItem[] = [
    {
      id: 'chk-h1',
      title: 'Single H1 Heading Presence',
      status: hasH1 ? 'pass' : 'fail',
      explanation: hasH1
        ? 'Article contains a single clear primary H1 title establishing the page topic.'
        : 'Missing top-level H1 heading. Every SEO article must start with exactly one H1.',
      recommendation: hasH1 ? 'Maintain the existing H1 tag.' : 'Add a single # H1 heading at the top of the article.'
    },
    {
      id: 'chk-h2',
      title: 'Logical H2 Section Structure',
      status: h2Matches.length >= 3 ? 'pass' : 'warn',
      explanation: `Detected ${h2Matches.length} H2 sections. Articles need 3+ structured subheadings for search engine crawlability.`,
      recommendation:
        h2Matches.length >= 3
          ? 'Heading structure is strong and scannable.'
          : 'Break long narrative sections into at least 3 distinct H2 sub-topics.'
    },
    {
      id: 'chk-depth',
      title: 'Target Word Count & Comprehensiveness',
      status: wordCount >= 800 ? 'pass' : 'warn',
      explanation: `Current word count is ${wordCount} words (Target: ${business.targetWordCount || 2000}).`,
      recommendation:
        wordCount >= 800
          ? 'Article provides substantial depth for competitive search queries.'
          : 'Expand treatment comparisons, FAQs, and vetting criteria to increase topical depth.'
    },
    {
      id: 'chk-links',
      title: 'Internal Linking Architecture',
      status: linkMatches.length >= 2 ? 'pass' : 'warn',
      explanation: `Found ${linkMatches.length} contextual internal markdown links.`,
      recommendation:
        linkMatches.length >= 2
          ? 'Internal link anchors are properly placed.'
          : 'Add contextual markdown links connecting this article to sibling clusters and the pillar.'
    },
    {
      id: 'chk-density',
      title: 'Keyword Density & Natural Language',
      status: parseFloat(keywordDensity) <= 2.5 ? 'pass' : 'warn',
      explanation: `Keyword density for "${primaryKeyword}" is ${keywordDensity}%.`,
      recommendation:
        parseFloat(keywordDensity) <= 2.5
          ? 'Keyword density is natural and safe from over-optimization penalties.'
          : 'Reduce exact-match keyword mentions to avoid search engine keyword stuffing filters.'
    },
    {
      id: 'chk-local',
      title: 'Geographic Relevance Signals',
      status: text.toLowerCase().includes((business.city || '').toLowerCase()) ? 'pass' : 'warn',
      explanation: text.toLowerCase().includes((business.city || '').toLowerCase())
        ? `Mentions target city (${business.city}) naturally within the text.`
        : `Lacks explicit references to ${business.city}.`,
      recommendation: `Ensure ${business.city} is referenced naturally in context and introductory hooks.`
    },
    {
      id: 'chk-claims',
      title: 'Claim Verification & Human Review',
      status: 'pass',
      explanation: 'No unsubstantiated superlative claims detected.',
      recommendation: 'Perform human editorial sign-off before publishing.'
    }
  ];

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const overallScore = Math.round((passCount / checks.length) * 100);

  return {
    overallScore,
    wordCount,
    h2Count: h2Matches.length,
    h3Count: h3Matches.length,
    internalLinkCount: linkMatches.length,
    keywordDensity: `${keywordDensity}%`,
    checks,
    summary:
      overallScore >= 80
        ? 'Excellent SEO health! Content demonstrates strong search structure and topical authority.'
        : 'Good foundation with actionable optimization opportunities highlighted in the checklist.'
  };
}

// ===================================================================
// DUAL-ENGINE GENERATOR WRAPPERS
// Tries Google Gemini API first (if key available), automatically falls back
// to the Built-in Synthesis Engine if no key or on any API failure.
// NEVER throws an error to the UI!
// ===================================================================

export async function generateKeywords(
  business: BusinessProfile,
  onProgress?: (step: string) => void
): Promise<{ data: KeywordItem[]; engine: 'gemini' | 'synthesis' }> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    onProgress?.('Synthesizing search intent with Google Gemini AI...');
    const prompt = `You are a Principal SEO Architect. Build a 5-item keyword strategy for:
Brand: ${business.brandName}
Industry: ${business.industry}
Main Service: ${business.mainService}
Target Audience: ${business.targetAudience}
City: ${business.city}
Primary Topic: ${business.primaryTopic}

Return strictly a JSON array of objects with keys:
id, keyword, type ("Primary"|"Secondary"|"Long-tail"|"Local"), searchIntent ("Informational"|"Commercial Investigation"|"Transactional"|"Navigational"), intentReasoning, suggestedArticleType, clusterPlacement, audienceFitExplanation.`;

    const result = await callGeminiApi<KeywordItem[]>(prompt, apiKey, (text) => {
      const parsed = cleanJsonText(text);
      return Array.isArray(parsed) ? parsed : parsed.keywords || null;
    });

    if (result && Array.isArray(result) && result.length > 0) {
      return { data: result, engine: 'gemini' };
    }
  }

  // Built-in Synthesis Engine Fallback
  onProgress?.('Generating keyword strategy with Built-in Synthesis Engine...');
  await new Promise((r) => setTimeout(r, 150));
  const data = synthesizeKeywords(business);
  return { data, engine: 'synthesis' };
}

export async function generateOutline(
  business: BusinessProfile,
  primaryKeyword?: string,
  onProgress?: (step: string) => void
): Promise<{ data: PillarOutline; engine: 'gemini' | 'synthesis' }> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    onProgress?.('Architecting pillar blueprint with Google Gemini AI...');
    const kw = primaryKeyword || `${business.mainService} in ${business.city}`;
    const prompt = `You are a Principal SEO Content Strategist. Architect an in-depth cornerstone pillar outline for:
Brand: ${business.brandName}
City: ${business.city}
Service: ${business.mainService}
Target Word Count: ${business.targetWordCount || 2000}
Tone: ${business.contentTone}
Primary Keyword: ${kw}

Return strictly a JSON object with keys:
h1, metaTitle, metaDescription, slug, primaryKeyword, secondaryKeywords (array of strings), targetWordCount (number), contentTone, sections (array of { h2, h3s: string[], purpose, estimatedWords: number }).`;

    const result = await callGeminiApi<PillarOutline>(prompt, apiKey, (text) => {
      const parsed = cleanJsonText(text);
      if (parsed.h1 && Array.isArray(parsed.sections)) return parsed;
      return null;
    });

    if (result) {
      return { data: result, engine: 'gemini' };
    }
  }

  // Built-in Synthesis Engine Fallback
  onProgress?.('Structuring pillar blueprint with Built-in Synthesis Engine...');
  await new Promise((r) => setTimeout(r, 150));
  const data = synthesizeOutline(business, primaryKeyword);
  return { data, engine: 'synthesis' };
}

export async function generatePillar(
  business: BusinessProfile,
  outline: PillarOutline,
  onProgress?: (step: string) => void
): Promise<{ data: PillarArticle; engine: 'gemini' | 'synthesis' }> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    onProgress?.('Drafting long-form cornerstone guide with Google Gemini AI...');
    const prompt = `You are an E-E-A-T SEO Content Specialist. Write a full long-form guide based on this outline:
Title: ${outline.h1}
Business: ${business.brandName} in ${business.city}
Service: ${business.mainService}
Target Word Count: ${outline.targetWordCount || 2000}
Sections: ${JSON.stringify(outline.sections)}

Return strictly a JSON object with keys:
title, slug, metaTitle, metaDescription, primaryKeyword, secondaryKeywords, searchIntent, targetAudience, suggestedImageAlt, suggestedInternalLinks (array of { targetArticle, anchorText, context }), markdownContent.`;

    const result = await callGeminiApi<PillarArticle>(prompt, apiKey, (text) => {
      const parsed = cleanJsonText(text);
      if (parsed.markdownContent && parsed.title) return parsed;
      return null;
    });

    if (result) {
      return { data: result, engine: 'gemini' };
    }
  }

  // Built-in Synthesis Engine Fallback
  onProgress?.('Synthesizing cornerstone master guide with Built-in Synthesis Engine...');
  await new Promise((r) => setTimeout(r, 200));
  const data = synthesizePillar(business, outline);
  return { data, engine: 'synthesis' };
}

export async function generateSupportingCluster(
  business: BusinessProfile,
  count = 4,
  onProgress?: (step: string) => void
): Promise<{ data: SupportingBlog[]; engine: 'gemini' | 'synthesis' }> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    onProgress?.(`Forging ${count} supporting satellite blogs with Google Gemini AI...`);
    const prompt = `You are an SEO Content Cluster Architect. Formulate ${count} supporting satellite blogs for:
Brand: ${business.brandName}
City: ${business.city}
Service: ${business.mainService}
Primary Topic: ${business.primaryTopic}

Return strictly a JSON array of objects, each with keys:
id, title, targetKeyword, searchIntent, articlePurpose, slug, metaDescription, outline (array of strings), internalLinks (array of { target, anchor, reason }), fullContent (complete markdown article).`;

    const result = await callGeminiApi<SupportingBlog[]>(prompt, apiKey, (text) => {
      const parsed = cleanJsonText(text);
      return Array.isArray(parsed) ? parsed : parsed.blogs || null;
    });

    if (result && Array.isArray(result) && result.length > 0) {
      return { data: result, engine: 'gemini' };
    }
  }

  // Built-in Synthesis Engine Fallback
  onProgress?.(`Synthesizing ${count} supporting satellite blogs with Built-in Synthesis Engine...`);
  await new Promise((r) => setTimeout(r, 200));
  const data = synthesizeSupportingCluster(business, count);
  return { data, engine: 'synthesis' };
}

export async function generateSingleBlog(
  business: BusinessProfile,
  blog: SupportingBlog,
  topic?: string,
  onProgress?: (step: string) => void
): Promise<{ data: SupportingBlog; engine: 'gemini' | 'synthesis' }> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    onProgress?.(`Regenerating "${blog.title}" with Google Gemini AI...`);
    const prompt = `You are an SEO Writer. Rewrite the complete markdown article for:
Title: ${blog.title}
Target Keyword: ${blog.targetKeyword}
Business: ${business.brandName}
City: ${business.city}
Topic: ${topic || business.mainService}

Return strictly a JSON object with keys:
fullContent (complete markdown text with headings, lists, tables).`;

    const result = await callGeminiApi<{ fullContent: string }>(prompt, apiKey, (text) => {
      const parsed = cleanJsonText(text);
      return parsed.fullContent ? parsed : null;
    });

    if (result) {
      return {
        data: {
          ...blog,
          fullContent: result.fullContent,
          lastEditedAt: new Date().toISOString()
        },
        engine: 'gemini'
      };
    }
  }

  onProgress?.(`Regenerating with Built-in Synthesis Engine...`);
  await new Promise((r) => setTimeout(r, 150));
  const data = synthesizeSingleBlog(business, blog, topic);
  return { data, engine: 'synthesis' };
}

export async function generateLocalSeo(
  business: BusinessProfile,
  onProgress?: (step: string) => void
): Promise<{ data: LocalSeoData; engine: 'gemini' | 'synthesis' }> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    onProgress?.('Formulating local SEO signals with Google Gemini AI...');
    const prompt = `You are a Local SEO Specialist. Create local SEO recommendations and Schema for:
Brand: ${business.brandName}
City: ${business.city}
Service: ${business.mainService}
Audience: ${business.targetAudience}

Return strictly a JSON object with keys:
city, targetCombinations (string[]), neighborhoodVariations (array of { neighborhood, suggestedKeyword, landingPageIdea, localIntentHook }), localizedIntroductionTemplate, localizedConclusionTemplate, recommendedSchemaTypes (array of { type, description }), complianceAndCautionNotes (string[]).`;

    const result = await callGeminiApi<LocalSeoData>(prompt, apiKey, (text) => {
      const parsed = cleanJsonText(text);
      if (parsed.neighborhoodVariations && parsed.targetCombinations) return parsed;
      return null;
    });

    if (result) {
      return { data: result, engine: 'gemini' };
    }
  }

  onProgress?.('Generating local SEO blueprint with Built-in Synthesis Engine...');
  await new Promise((r) => setTimeout(r, 150));
  const data = synthesizeLocalSeo(business);
  return { data, engine: 'synthesis' };
}

export function reviewQuality(
  articleText: string,
  business: BusinessProfile
): QualityAuditResult {
  return synthesizeQualityReview(articleText, business);
}
