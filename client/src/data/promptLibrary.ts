import { PromptTemplate } from '../types';

export const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    id: 'master-strategy',
    title: '1. Master SEO Strategy Prompt',
    category: 'Architecture',
    purpose: 'Architects an entire topic cluster, search-intent hierarchy, and topical authority map for any business niche.',
    variables: ['business_name', 'business_type', 'main_service', 'city', 'target_audience', 'business_goal', 'supporting_blog_count'],
    description: 'Use this prompt to establish the overarching topical authority framework before writing a single word.',
    rawPrompt: `You are a Principal SEO Architect and Content Strategist.
Your goal is to build an authoritative, search-intent-focused Content Cluster for:
- Business Name: {business_name}
- Industry / Business Type: {business_type}
- Core Service: {main_service}
- Target Location: {city}
- Primary Audience: {target_audience}
- Business Goal: {business_goal}
- Supporting Article Count: {supporting_blog_count}

Task:
1. Identify the core "Pillar Entity" that establishes deep topical authority for {main_service}.
2. Formulate {supporting_blog_count} interconnected supporting blog topics that resolve distinct stages of the user search journey (Informational questions, Commercial comparison, Pricing hesitation, Process expectations).
3. Map explicit internal linking pathways: each supporting article must pass PageRank equity to the central Pillar, and relevant sister articles must cross-link.
4. Establish quality constraints: Ensure zero keyword stuffing, no fabricated statistics, and appropriate regulatory or professional disclaimers where applicable.
5. Provide a strategic justification for how this cluster achieves the goal of "{business_goal}".`
  },
  {
    id: 'keyword-intent',
    title: '2. Keyword and Search Intent Prompt',
    category: 'Research',
    purpose: 'Classifies search queries into informational, commercial, transactional, and local buckets with strategic reasoning.',
    variables: ['business_type', 'main_service', 'city', 'target_audience', 'business_goal'],
    description: 'Generates structured keyword suggestions without fabricated search-volume metrics, focusing on intent alignment.',
    rawPrompt: `You are a Search Intent Specialist and Keyword Researcher.
Analyze the target market for a {business_type} in {city} offering {main_service} aimed at {target_audience}.

Generate a structured keyword portfolio divided into:
1. Primary Keyword (The definitive category anchor)
2. Secondary Keywords (High-intent variations & subtopics)
3. Long-tail Keywords (Specific questions, problem-to-solution queries)
4. Local Keywords (Service + city/neighborhood combinations)

For each keyword, provide:
- Exact search phrase
- Search Intent classification (Informational, Commercial Investigation, Transactional, Navigational)
- Intent Reasoning (Why is the user searching this?)
- Suggested Article Type (e.g., Ultimate Guide, Buyer Checklist, Pricing Calculator, FAQ)
- Cluster Placement (Core Pillar Anchor vs. Satellite Node)
- Target Audience Fit (How it directly resonates with {target_audience} and supports {business_goal})

Constraint: Do not invent fake monthly search volumes or algorithmic difficulty scores. Ground recommendations in semantic search demand and real buyer psychology.`
  },
  {
    id: 'pillar-outline',
    title: '3. Pillar Blog Outline Prompt',
    category: 'Content Planning',
    purpose: 'Creates a hierarchical, intent-aligned H1-H3 blueprint for long-form authoritative pillar blogs.',
    variables: ['business_name', 'main_service', 'city', 'primary_keyword', 'target_audience', 'target_word_count', 'content_tone'],
    description: 'Generates a logical outline before writing, ensuring all intent touchpoints, examples, and FAQs are planned.',
    rawPrompt: `You are an SEO Content Outline Architect.
Design a comprehensive, highly structured outline for a Pillar Blog Article.
Context:
- Brand: {business_name}
- Core Topic: {main_service} in {city}
- Target Primary Keyword: {primary_keyword}
- Audience: {target_audience}
- Target Length: ~{target_word_count} words
- Tone: {content_tone}

Outline Requirements:
1. One compelling H1 heading incorporating the primary keyword naturally.
2. 5 to 7 logical H2 sections that break the topic into definitive learning pillars.
3. Descriptive H3 subsections under each H2 covering practical advice, comparisons, and common hurdles.
4. Dedicated "Frequently Asked Questions" section targeting Google People Also Ask (PAA) queries.
5. An ethical, non-misleading conclusion with a clear call to action.
6. A clinical/professional disclaimer note if the topic involves health, law, or financial planning.
7. Estimated word count allocation per section to achieve the target {target_word_count} words.`
  },
  {
    id: 'pillar-article',
    title: '4. Long-Form Pillar Article Prompt',
    category: 'Writing',
    purpose: 'Drafts exhaustive, human-readable, non-repetitive pillar content based on a vetted outline.',
    variables: ['business_name', 'main_service', 'city', 'primary_keyword', 'target_audience', 'business_goal', 'target_word_count', 'content_tone'],
    description: 'Writes long-form pillar articles adhering to Google Search Quality Rater Guidelines (E-E-A-T).',
    rawPrompt: `You are a Principal Content Specialist writing on behalf of {business_name} in {city}.
Write a comprehensive, authoritative, long-form Pillar Blog article in Markdown targeting "{primary_keyword}".
Target Audience: {target_audience}
Word Count Target: ~{target_word_count} words
Tone: {content_tone}
Primary Business Goal: {business_goal}

Content Standards:
- Heading Hierarchy: Exactly one H1 at top; clean H2s and H3s following logical sequence.
- Readability: Short, punchy paragraphs (2-4 sentences max). Use bullet points, bold key concepts, and formatted comparison tables for complex ideas.
- Natural Keyword Use: Integrate "{primary_keyword}" and semantic synonyms organically without forced repetition.
- Practical Substance: Offer genuine domain insights, vetting checklists, and step-by-step guidance rather than superficial generic advice.
- Internal Linking Anchor Opportunities: Weave in natural anchor text placeholders pointing to supporting subtopics (pricing, buying guides, FAQs).
- Regulatory / Professional Disclaimers: Include clear disclaimers for healthcare or regulated services (advise readers to consult qualified professionals).
- No Hallucinations: Avoid fabricated statistics, fake scientific studies, or unverifiable claims.
- Call to Action: Conclude with a helpful, reassuring CTA aligned with "{business_goal}".`
  },
  {
    id: 'supporting-cluster',
    title: '5. Supporting Blog Cluster Prompt',
    category: 'Content Planning & Writing',
    purpose: 'Creates satellite blog articles answering specific sub-questions that link to and reinforce the pillar.',
    variables: ['business_name', 'business_type', 'main_service', 'city', 'primary_keyword', 'supporting_blog_count'],
    description: 'Generates the supporting cluster articles with distinct search intents, unique angles, and linking relationships.',
    rawPrompt: `You are an SEO Topical Authority Engineer.
Develop {supporting_blog_count} supporting blog articles designed to orbit and empower the central Pillar Blog on "{primary_keyword}" for {business_name} ({business_type} in {city}).

Each supporting article must cover a completely DIFFERENT search intent angle:
1. Buyer Evaluation / Selection Guide (e.g., How to Choose a Provider in {city})
2. Pricing and Budget Breakdown (e.g., Cost, Investment Factors, and Financing Options)
3. Mistake Prevention or Preparation (e.g., Common Errors, Preparation Checklists)
4. Deep-Dive Procedure or Methodology (e.g., Step-by-Step Experience, Recovery/Timeline)
5. Urgency / Symptom / FAQ Guide (e.g., When to Seek Help, Warning Signs)

For EACH supporting article:
- Blog Title (Intent-driven, non-clickbait)
- Target Keyword & Search Intent
- Article Purpose (What specific user anxiety or question does it solve?)
- URL Slug & Meta Description (130-155 characters)
- Full Article Content in Markdown (~800-1200 words) with H1, H2s, H3s
- Explicit Internal Links: Anchor text back to the Pillar Blog and to adjacent supporting nodes.`
  },
  {
    id: 'local-seo',
    title: '6. Local SEO Adaptation Prompt',
    category: 'Localization',
    purpose: 'Adapts content for localized search signals, neighborhood landmarks, and schema markup without spammy repetition.',
    variables: ['business_name', 'main_service', 'city', 'target_audience'],
    description: 'Generates natural local keyword combinations, neighborhood variations, schema markup, and localized introductions.',
    rawPrompt: `You are a Senior Local Search Specialist.
Create a Local SEO Optimization blueprint for {business_name} providing {main_service} in {city}.

Generate:
1. Natural Service + City combinations that mirror real human conversational search queries.
2. Prominent neighborhood/district-specific variations in {city} with tailored landing page angles.
3. A localized Introduction paragraph template weaving in commute accessibility and local community context naturally.
4. A localized Conclusion & CTA template highlighting clinic/office convenience.
5. Recommended Schema.org structured data types (e.g., LocalBusiness, MedicalClinic, PostalAddress, OpeningHoursSpecification) with JSON-LD formatting guidance.
6. A Local Compliance & Caution Checklist: explicit warnings against address fabrication, fake reviews, and unnatural city-keyword stuffing.`
  },
  {
    id: 'internal-linking',
    title: '7. Internal Linking Recommendation Prompt',
    category: 'Technical SEO',
    purpose: 'Maps bidirectional internal linking architecture to pass PageRank and topical context throughout the cluster.',
    variables: ['business_name', 'main_service', 'city', 'primary_keyword'],
    description: 'Produces an exact internal link map specifying source pages, target pages, and descriptive anchor text.',
    rawPrompt: `You are an Information Architecture and Internal Linking Specialist.
Design a closed-loop internal link graph for {business_name}'s SEO Content Cluster on "{main_service} in {city}".

Map out:
1. Pillar-to-Supporting Links: How the central pillar routes readers to specific subtopics when deeper explanation is warranted.
2. Supporting-to-Pillar Links: Exact anchor texts where every satellite blog points back to the pillar as the definitive source.
3. Cross-Cluster Supporting Links: Logical horizontal connections between related supporting articles (e.g., from the Pricing guide to the First-Visit Checklist).
4. Anchor Text Best Practices: Ensure anchor texts are descriptive, varied, and contextual rather than repetitive exact-match or generic "click here" links.
5. Provide a quick markdown table linking Source Article -> Destination Article -> Contextual Anchor Text -> Search Intent Benefit.`
  },
  {
    id: 'quality-review',
    title: '8. SEO Content Quality Review Prompt',
    category: 'Audit & Compliance',
    purpose: 'Performs a comprehensive editorial, structural, and factual safety audit before publishing.',
    variables: ['business_name', 'city', 'primary_keyword', 'business_goal'],
    description: 'Audits articles for heading hierarchy, keyword density, mobile scannability, and unverified claim flags.',
    rawPrompt: `You are an SEO Quality Auditor and Search Compliance Evaluator.
Audit the following content against Google Search Quality Rater Guidelines, mobile readability, and search intent alignment.

Evaluation Criteria:
1. Heading Architecture: Single H1 check, logical H2/H3 sequence, absence of skipped heading levels.
2. Search Intent Alignment: Does the article actually satisfy what a searcher looking for "{primary_keyword}" wants?
3. Keyword Distribution & Over-optimization: Verify primary keyword presence in H1, early introduction, and subheadings without unnatural repetition (>2.5% density).
4. Scannability & Readability: Identify any dense paragraphs exceeding 4 sentences; evaluate use of lists, tables, and callouts.
5. Factual & Regulatory Safety: Highlight any unverified statistical claims, health claims, or financial guarantees requiring human editorial verification.
6. Local Authenticity: If targeting {city}, ensure local references are natural and not artificial geographic stuffing.
7. Call to Action: Does the final CTA align ethically with "{business_goal}" without deceptive pressure?`
  }
];

export function hydratePrompt(template: PromptTemplate, project: any): string {
  let text = template.rawPrompt;
  const b = project?.business || {};

  const replacements: Record<string, string> = {
    business_name: b.brandName || '[Your Business Name]',
    business_type: b.industry || '[Your Industry / Business Type]',
    main_service: b.mainService || '[Your Core Service]',
    city: b.city || '[Target City / Location]',
    target_audience: b.targetAudience || '[Target Audience]',
    business_goal: b.businessGoal || 'generate leads',
    supporting_blog_count: String(b.supportingBlogCount || 4),
    primary_keyword: project?.pillar?.primaryKeyword || b.primaryTopic || '[Primary Keyword]',
    target_word_count: String(b.targetWordCount || 2000),
    content_tone: b.contentTone || 'informative'
  };

  Object.entries(replacements).forEach(([key, val]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    text = text.replace(regex, val);
  });

  return text;
}
