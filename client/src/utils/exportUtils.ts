import JSZip from 'jszip';
import { Project } from '../types';
import { PROMPT_LIBRARY, hydratePrompt } from '../data/promptLibrary';

/**
 * Download a simple text or markdown file
 */
export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdownFile(filename: string, content: string): void {
  const cleanName = filename.endsWith('.md') ? filename : `${filename}.md`;
  downloadTextFile(cleanName, content, 'text/markdown;charset=utf-8');
}

/**
 * Print friendly article view
 */
export function printArticle(title: string, markdownContent: string): void {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups to open the print-friendly view.');
    return;
  }

  // Convert basic markdown to readable HTML for printing
  const htmlBody = markdownContent
    .replace(/^# (.*$)/gim, '<h1 style="font-size:24pt; color:#111827; margin-bottom:12px; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size:18pt; color:#1f2937; margin-top:20px; margin-bottom:8px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="font-size:14pt; color:#374151; margin-top:16px; margin-bottom:6px;">$1</h3>')
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left:4px solid #7c3aed; background:#f5f3ff; padding:10px 16px; margin:16px 0; font-style:italic;">$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<u style="color:#7c3aed;">$1</u>')
    .replace(/\n\n/g, '</p><p style="line-height:1.6; margin-bottom:12px; color:#1f2937; font-size:11pt;">')
    .replace(/---/g, '<hr style="border:0; border-top:1px solid #e5e7eb; margin:20px 0;">');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — SEOForge AI Print View</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; padding: 20px; }
          .header { border-bottom: 2px solid #7c3aed; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 14pt; font-weight: bold; color: #7c3aed; }
          .disclaimer { font-size: 8pt; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
          th { background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">⚡ SEOForge AI — Content Print View</div>
          <div style="font-size: 9pt; color: #6b7280;">Printed on ${new Date().toLocaleDateString()}</div>
        </div>
        <article>
          <p style="line-height:1.6; margin-bottom:12px; color:#1f2937; font-size:11pt;">${htmlBody}</p>
        </article>
        <div class="disclaimer">
          Note: This content was generated and formatted using SEOForge AI. Search engine rankings and traffic performance are not guaranteed. Review and verify medical, legal, or pricing claims before live publication.
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

/**
 * Generate Complete SEO Content Pack as a ZIP archive with README-style index
 */
export async function exportCompleteContentPack(project: Project): Promise<void> {
  const zip = new JSZip();
  const { business, keywords, outline, pillar, supportingBlogs, localSeo } = project;
  const brandSlug = (business.brandName || 'Brand').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // 1. README.md Index
  const readmeContent = `# SEOForge AI — Complete SEO Content Pack
## Project: ${project.name}
*Generated on ${new Date(project.updatedAt).toLocaleString()} by SEOForge AI*

---

### Business Profile Overview
- **Brand / Business Name:** ${business.brandName}
- **Industry / Vertical:** ${business.industry}
- **Core Service / Product:** ${business.mainService}
- **Target Audience:** ${business.targetAudience}
- **Target City / Region:** ${business.city}
- **Primary Topic Anchor:** ${business.primaryTopic}
- **Content Tone:** ${business.contentTone}
- **Target Word Count:** ${business.targetWordCount} words
- **Strategic Goal:** ${business.businessGoal}

---

### Content Pack Structure & File Manifest
1. \`00_strategy_and_keywords.md\` — Complete search intent taxonomy, audience fit reasoning, and keyword portfolio.
2. \`01_pillar_outline.md\` — Comprehensive H1-H3 blueprint, section objectives, and target word counts.
3. \`02_pillar_article.md\` — Authoritative cornerstone blog article (~${pillar ? pillar.markdownContent.split(/\s+/).length : 0} words) with SEO metadata.
4. \`03_supporting_blogs/\` — Folder containing all ${supportingBlogs.length} satellite blog articles answering distinct search questions.
5. \`04_local_seo_blueprint.md\` — Geo-targeted keyword combinations, neighborhood variations, schema markup, and localized intro/outros.
6. \`05_reusable_prompt_library.md\` — All 8 professional prompt engineering templates customized for this campaign.

---

### Internal Linking Architecture Summary
The Content Cluster strategy relies on a hub-and-spoke internal linking model:
- **Central Hub (Pillar):** \`${pillar?.slug || 'pillar-guide'}\`
- **Satellite Nodes (Supporting Blogs):**
${supportingBlogs.map((b, i) => `  - [Node ${i + 1}] ${b.title} (\`${b.slug}\`) -> Links to Central Hub`).join('\n')}

---

### Mandatory Disclaimer
*Notice: This content pack provides structured search-intent blueprints. Google search rankings, traffic volumes, and business conversions depend on numerous algorithmic and competition variables and cannot be guaranteed. Ensure human subject-matter experts review all factual, medical, legal, and pricing claims prior to public distribution.*
`;

  zip.file('README.md', readmeContent);

  // 2. 00_strategy_and_keywords.md
  let kwContent = `# SEO Keyword Portfolio & Search Intent Analysis
**Brand:** ${business.brandName} | **City:** ${business.city} | **Target Goal:** ${business.businessGoal}

---

| Keyword | Type | Search Intent | Suggested Article Type | Cluster Role |
| :--- | :--- | :--- | :--- | :--- |
${keywords.map(k => `| **${k.keyword}** | ${k.type} | \`${k.searchIntent}\` | ${k.suggestedArticleType} | ${k.clusterPlacement} |`).join('\n')}

---

## Detailed Intent Reasoning & Audience Fit
${keywords.map(k => `
### ${k.keyword} (${k.type})
- **Search Intent:** ${k.searchIntent}
- **Why Users Search This:** ${k.intentReasoning}
- **Target Audience Fit:** ${k.audienceFitExplanation}
- **Recommended Placement:** ${k.clusterPlacement}
`).join('\n')}
`;
  zip.file('00_strategy_and_keywords.md', kwContent);

  // 3. 01_pillar_outline.md
  if (outline) {
    let outlineContent = `# Pillar Blog Outline Blueprint
**H1:** ${outline.h1}
**Slug:** \`${outline.slug}\`
**Target Word Count:** ${outline.targetWordCount} words | **Tone:** ${outline.contentTone}

### SEO Metadata
- **Meta Title:** ${outline.metaTitle}
- **Meta Description:** ${outline.metaDescription}
- **Primary Keyword:** ${outline.primaryKeyword}
- **Secondary Keywords:** ${outline.secondaryKeywords.join(', ')}

---

## Content Blueprint & Section Objectives
${outline.sections.map((s, i) => `
### ${s.h2}
*Target Words: ~${s.estimatedWords}*
- **Purpose:** ${s.purpose}
${s.h3s.map(h3 => `  - *H3:* ${h3}`).join('\n')}
`).join('\n')}

${outline.clinicalDisclaimer ? `\n> **Disclaimer:** ${outline.clinicalDisclaimer}\n` : ''}
`;
    zip.file('01_pillar_outline.md', outlineContent);
  }

  // 4. 02_pillar_article.md
  if (pillar) {
    let pillarFrontmatter = `---
title: "${pillar.title.replace(/"/g, '\\"')}"
slug: "${pillar.slug}"
metaTitle: "${pillar.metaTitle.replace(/"/g, '\\"')}"
metaDescription: "${pillar.metaDescription.replace(/"/g, '\\"')}"
primaryKeyword: "${pillar.primaryKeyword}"
secondaryKeywords: [${pillar.secondaryKeywords.map(k => `"${k}"`).join(', ')}]
searchIntent: "${pillar.searchIntent}"
targetAudience: "${pillar.targetAudience}"
suggestedImageAlt: "${pillar.suggestedImageAlt}"
lastEditedAt: "${pillar.lastEditedAt || new Date().toISOString()}"
---

${pillar.markdownContent}
`;
    zip.file('02_pillar_article.md', pillarFrontmatter);
  }

  // 5. 03_supporting_blogs/
  const suppFolder = zip.folder('03_supporting_blogs');
  if (suppFolder && supportingBlogs.length > 0) {
    supportingBlogs.forEach((blog, idx) => {
      const filename = `${String(idx + 1).padStart(2, '0')}_${blog.slug}.md`;
      const blogContent = `---
title: "${blog.title.replace(/"/g, '\\"')}"
slug: "${blog.slug}"
targetKeyword: "${blog.targetKeyword}"
searchIntent: "${blog.searchIntent}"
articlePurpose: "${blog.articlePurpose.replace(/"/g, '\\"')}"
metaDescription: "${blog.metaDescription.replace(/"/g, '\\"')}"
lastEditedAt: "${blog.lastEditedAt || new Date().toISOString()}"
internalLinks:
${blog.internalLinks.map(l => `  - target: "${l.target}"\n    anchor: "${l.anchor}"\n    reason: "${l.reason}"`).join('\n')}
---

${blog.fullContent}
`;
      suppFolder.file(filename, blogContent);
    });
  }

  // 6. 04_local_seo_blueprint.md
  if (localSeo) {
    let localContent = `# Local SEO Optimization Blueprint for ${business.brandName} (${localSeo.city})

---

## 1. Natural Geo-Targeted Keyword Combinations
${localSeo.targetCombinations.map(c => `- \`${c}\``).join('\n')}

---

## 2. Neighborhood & District Variations
| Neighborhood / District | Suggested Keyword | Landing Page Concept | Local Intent Hook |
| :--- | :--- | :--- | :--- |
${localSeo.neighborhoodVariations.map(n => `| **${n.neighborhood}** | \`${n.suggestedKeyword}\` | ${n.landingPageIdea} | ${n.localIntentHook} |`).join('\n')}

---

## 3. Localized Copy Templates

### Localized Introduction Template
> ${localSeo.localizedIntroductionTemplate}

### Localized Conclusion & CTA Template
> ${localSeo.localizedConclusionTemplate}

---

## 4. Recommended Schema.org Structured Data
${localSeo.recommendedSchemaTypes.map(s => `- **${s.type}:** ${s.description}`).join('\n')}

---

## 5. Local Compliance & Verification Caution Notes
${localSeo.complianceAndCautionNotes.map(n => `⚠️ ${n}`).join('\n\n')}
`;
    zip.file('04_local_seo_blueprint.md', localContent);
  }

  // 7. 05_reusable_prompt_library.md
  let promptContent = `# SEOForge AI — Reusable Prompt Engineering Library
**Customized for:** ${business.brandName} (${business.mainService} in ${business.city})

This library contains all 8 professional prompt templates pre-hydrated with current campaign variables.

---
`;
  PROMPT_LIBRARY.forEach(tmpl => {
    const hydrated = hydratePrompt(tmpl, project);
    promptContent += `
## ${tmpl.title}
*Category: ${tmpl.category}*
**Purpose:** ${tmpl.purpose}
**Accepted Variables:** \`${tmpl.variables.join('`, `')}\`

\`\`\`markdown
${hydrated}
\`\`\`

---
`;
  });
  zip.file('05_reusable_prompt_library.md', promptContent);

  // Generate ZIP and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `${brandSlug}-seoforge-content-pack.zip`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
