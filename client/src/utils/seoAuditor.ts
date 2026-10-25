import { QualityAuditResult, QualityCheckItem } from '../types';

export function auditArticleQuality(
  articleText: string,
  options: {
    primaryKeyword?: string;
    city?: string;
    metaTitle?: string;
    metaDescription?: string;
  } = {}
): QualityAuditResult {
  const text = articleText || '';
  const lines = text.split('\n');
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;

  const h1Matches = text.match(/^#\s+(.+)$/gm) || [];
  const h2Matches = text.match(/^##\s+(.+)$/gm) || [];
  const h3Matches = text.match(/^###\s+(.+)$/gm) || [];
  const linkMatches = text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];

  const checks: QualityCheckItem[] = [];

  // 1. H1 Check
  if (h1Matches.length === 1) {
    checks.push({
      id: 'h1-check',
      title: 'H1 Heading Architecture',
      status: 'pass',
      explanation: 'Found exactly one top-level H1 heading defining the primary article topic.',
      recommendation: 'Optimal. Do not add multiple H1 tags to preserve clear document hierarchy.'
    });
  } else if (h1Matches.length === 0) {
    checks.push({
      id: 'h1-check',
      title: 'H1 Heading Architecture',
      status: 'fail',
      explanation: 'Missing H1 heading. Search engines require a clear top-level topic title.',
      recommendation: 'Add a single # Heading at the very beginning of the article.'
    });
  } else {
    checks.push({
      id: 'h1-check',
      title: 'H1 Heading Architecture',
      status: 'warn',
      explanation: `Found ${h1Matches.length} H1 tags. Best practice is exactly one H1 per URL.`,
      recommendation: 'Convert secondary H1 headings into H2 subsections (##).'
    });
  }

  // 2. Heading Hierarchy
  if (h2Matches.length >= 3) {
    checks.push({
      id: 'hierarchy-check',
      title: 'Heading Hierarchy (H2 / H3)',
      status: 'pass',
      explanation: `Logical structure with ${h2Matches.length} H2 sections and ${h3Matches.length} H3 subtopics.`,
      recommendation: 'Excellent. Sections segment the content into scannable reading modules.'
    });
  } else {
    checks.push({
      id: 'hierarchy-check',
      title: 'Heading Hierarchy (H2 / H3)',
      status: 'warn',
      explanation: `Only ${h2Matches.length} H2 sections detected. In-depth guides usually need 4+ H2s.`,
      recommendation: 'Add structured H2 sections covering FAQs, comparison tables, and steps.'
    });
  }

  // 3. Primary Keyword in Strategic Locations
  const kw = (options.primaryKeyword || '').toLowerCase().trim();
  if (kw) {
    const cleanKw = kw.replace(/[^a-z0-9\s]/g, '');
    const kwRegex = new RegExp(`\\b${cleanKw}\\b`, 'gi');
    const kwCount = (text.toLowerCase().match(kwRegex) || []).length;
    const density = wordCount > 0 ? (kwCount / wordCount) * 100 : 0;

    const inH1 = h1Matches.some(h => h.toLowerCase().includes(kw));
    const inFirst100 = words.slice(0, 100).join(' ').toLowerCase().includes(kw);

    if (inH1 && inFirst100) {
      checks.push({
        id: 'kw-placement',
        title: 'Keyword Placement (H1 & Intro)',
        status: 'pass',
        explanation: `Target keyword "${options.primaryKeyword}" is present in the H1 title and early intro.`,
        recommendation: 'Great work! Early keyword presence confirms search relevance.'
      });
    } else {
      checks.push({
        id: 'kw-placement',
        title: 'Keyword Placement (H1 & Intro)',
        status: 'warn',
        explanation: `Target keyword is ${inH1 ? 'in H1 but missing in intro' : 'missing in H1'}.`,
        recommendation: `Include "${options.primaryKeyword}" naturally within the first 100 words and H1.`
      });
    }

    // 4. Keyword Density
    if (density > 2.5) {
      checks.push({
        id: 'kw-density',
        title: 'Keyword Density & Optimization',
        status: 'warn',
        explanation: `High keyword density detected (${density.toFixed(2)}%, ${kwCount} occurrences).`,
        recommendation: 'Reduce repetitive exact-match phrases to avoid keyword-stuffing flags. Use semantic synonyms.'
      });
    } else if (density >= 0.4) {
      checks.push({
        id: 'kw-density',
        title: 'Keyword Density & Optimization',
        status: 'pass',
        explanation: `Balanced keyword density (${density.toFixed(2)}%, ${kwCount} occurrences).`,
        recommendation: 'Natural integration without forced repetition.'
      });
    } else {
      checks.push({
        id: 'kw-density',
        title: 'Keyword Density & Optimization',
        status: 'warn',
        explanation: `Low keyword density (${density.toFixed(2)}%, ${kwCount} occurrences).`,
        recommendation: `Weave "${options.primaryKeyword}" into 1-2 additional subheadings or body paragraphs.`
      });
    }
  }

  // 5. Meta Title & Description Length Check
  const metaTitle = options.metaTitle || '';
  const metaDesc = options.metaDescription || '';

  if (metaTitle.length >= 40 && metaTitle.length <= 65) {
    checks.push({
      id: 'meta-title',
      title: 'Meta Title Length',
      status: 'pass',
      explanation: `Title length is optimal (${metaTitle.length} characters). Avoids search result truncation.`,
      recommendation: 'Maintain between 45 and 60 characters.'
    });
  } else if (metaTitle.length > 0) {
    checks.push({
      id: 'meta-title',
      title: 'Meta Title Length',
      status: 'warn',
      explanation: `Title is ${metaTitle.length} characters (recommended: 45–60 characters).`,
      recommendation: metaTitle.length > 65 ? 'Shorten to prevent Google SERP clipping.' : 'Expand with location or brand suffix.'
    });
  }

  if (metaDesc.length >= 120 && metaDesc.length <= 165) {
    checks.push({
      id: 'meta-desc',
      title: 'Meta Description Length',
      status: 'pass',
      explanation: `Description length is optimal (${metaDesc.length} characters). Fits search snippets nicely.`,
      recommendation: 'Keeps click-through rates high.'
    });
  } else if (metaDesc.length > 0) {
    checks.push({
      id: 'meta-desc',
      title: 'Meta Description Length',
      status: 'warn',
      explanation: `Meta description is ${metaDesc.length} characters (recommended: 125–160 characters).`,
      recommendation: metaDesc.length > 165 ? 'Shorten slightly to avoid cutoff on mobile SERPs.' : 'Add a clear call to action to boost CTR.'
    });
  }

  // 6. Scannability & Paragraph Length
  const longParagraphs = lines.filter(l => {
    const pWords = l.trim().split(/\s+/);
    return !l.startsWith('#') && !l.startsWith('|') && pWords.length > 85;
  });

  if (longParagraphs.length === 0) {
    checks.push({
      id: 'scannability',
      title: 'Paragraph Scannability & Mobile UX',
      status: 'pass',
      explanation: 'Paragraphs are concise and well-paced for mobile and desktop screens.',
      recommendation: 'Maintain short blocks of 2-4 sentences with subheadings and bullet lists.'
    });
  } else {
    checks.push({
      id: 'scannability',
      title: 'Paragraph Scannability & Mobile UX',
      status: 'warn',
      explanation: `Found ${longParagraphs.length} dense paragraphs exceeding 85 words.`,
      recommendation: 'Break long text blocks into 2-3 shorter paragraphs or convert steps into bullet points.'
    });
  }

  // 7. Internal Linking Health
  if (linkMatches.length >= 2) {
    checks.push({
      id: 'internal-links',
      title: 'Internal Linking Architecture',
      status: 'pass',
      explanation: `Identified ${linkMatches.length} contextual internal link placeholders connecting cluster nodes.`,
      recommendation: 'Distributes PageRank authority smoothly across supporting subtopics.'
    });
  } else {
    checks.push({
      id: 'internal-links',
      title: 'Internal Linking Architecture',
      status: 'warn',
      explanation: `Found only ${linkMatches.length} internal links. Hub-and-spoke clusters thrive on 2-4 links.`,
      recommendation: 'Add link anchors pointing to relevant supporting articles and the central pillar.'
    });
  }

  // 8. Local Relevance Check
  if (options.city) {
    const cityRegex = new RegExp(`\\b${options.city}\\b`, 'gi');
    const cityMentions = (text.match(cityRegex) || []).length;
    if (cityMentions >= 2 && cityMentions <= 15) {
      checks.push({
        id: 'local-relevance',
        title: 'Local SEO Geo-Relevance',
        status: 'pass',
        explanation: `Target location "${options.city}" appears ${cityMentions} times naturally in context.`,
        recommendation: 'Geo-signals are clear without artificial location keyword repetition.'
      });
    } else if (cityMentions > 15) {
      checks.push({
        id: 'local-relevance',
        title: 'Local SEO Geo-Relevance',
        status: 'warn',
        explanation: `City "${options.city}" is mentioned ${cityMentions} times. Risk of geographic keyword stuffing.`,
        recommendation: 'Remove redundant city mentions from body paragraphs; keep them in key titles and intro.'
      });
    } else {
      checks.push({
        id: 'local-relevance',
        title: 'Local SEO Geo-Relevance',
        status: 'warn',
        explanation: `City "${options.city}" is mentioned only ${cityMentions} time(s).`,
        recommendation: `Add natural geographic context for ${options.city} in the introduction and concluding CTA.`
      });
    }
  }

  // 9. Fact Checking & Regulatory Human Verification Flag
  const statsMatches = text.match(/\b\d+(\.\d+)?%\b|\b\d+([,\.]\d+)?\s+(studies|patients|percent|trials|years)\b/gi) || [];
  const medicalWords = text.match(/\b(cure|guaranteed|painless|surgery|clinical|infection|implant)\b/gi) || [];

  if (medicalWords.length > 0 || statsMatches.length > 0) {
    checks.push({
      id: 'human-verification',
      title: 'Claim Verification & Human Review Alert',
      status: 'warn',
      explanation: `Detected ${statsMatches.length} statistical references and ${medicalWords.length} specialized domain terms.`,
      recommendation: 'Rule-based compliance notice: Ensure a qualified human expert verifies all specific numerical data, medical assertions, and pricing statements before publishing.'
    });
  }

  // Calculate score
  const passCount = checks.filter(c => c.status === 'pass').length;
  const overallScore = Math.round((passCount / checks.length) * 100);

  return {
    overallScore,
    wordCount,
    h2Count: h2Matches.length,
    h3Count: h3Matches.length,
    internalLinkCount: linkMatches.length,
    keywordDensity: kw ? `${((((text.toLowerCase().match(new RegExp(`\\b${kw.replace(/[^a-z0-9\\s]/g, '')}\\b`, 'gi')) || []).length) / Math.max(1, wordCount)) * 100).toFixed(2)}%` : 'N/A',
    checks,
    summary: overallScore >= 80
      ? 'Strong SEO structural integrity! Content satisfies heading hierarchy, natural keyword placement, and internal linkability.'
      : 'Good draft. Address the flagged warnings above to enhance readability, search intent alignment, and compliance.'
  };
}
