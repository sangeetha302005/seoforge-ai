import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Copy,
  Check,
  Download,
  Printer,
  RotateCw,
  Eye,
  Edit3,
  Layers,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Link2,
  FileCode,
  AlertCircle
} from 'lucide-react';
import { Project, PillarArticle, SupportingBlog, QualityAuditResult } from '../types';
import { downloadMarkdownFile, downloadTextFile, printArticle } from '../utils/exportUtils';
import { auditArticleQuality } from '../utils/seoAuditor';

interface BlogEditorProps {
  project: Project;
  articleType: 'pillar' | 'supporting';
  supportingBlogId?: string;
  onSavePillar: (pillar: PillarArticle) => void;
  onSaveSupportingBlog: (blog: SupportingBlog) => void;
  onBackToCluster: () => void;
  onRegenerate: () => Promise<void>;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  project,
  articleType,
  supportingBlogId,
  onSavePillar,
  onSaveSupportingBlog,
  onBackToCluster,
  onRegenerate
}) => {
  const isPillar = articleType === 'pillar';

  const initialBlog: SupportingBlog | undefined = !isPillar
    ? project.supportingBlogs.find((b) => b.id === supportingBlogId) || project.supportingBlogs[0]
    : undefined;

  // Local state for article fields
  const [title, setTitle] = useState(isPillar ? project.pillar?.title || '' : initialBlog?.title || '');
  const [content, setContent] = useState(
    isPillar ? project.pillar?.markdownContent || '' : initialBlog?.fullContent || ''
  );
  const [metaTitle, setMetaTitle] = useState(
    isPillar ? project.pillar?.metaTitle || '' : initialBlog?.title || ''
  );
  const [metaDesc, setMetaDesc] = useState(
    isPillar ? project.pillar?.metaDescription || '' : initialBlog?.metaDescription || ''
  );
  const [slug, setSlug] = useState(isPillar ? project.pillar?.slug || '' : initialBlog?.slug || '');
  const [primaryKw, setPrimaryKw] = useState(
    isPillar ? project.pillar?.primaryKeyword || '' : initialBlog?.targetKeyword || ''
  );
  const [imageAlt, setImageAlt] = useState(
    isPillar ? project.pillar?.suggestedImageAlt || '' : `Illustrative diagram for ${initialBlog?.title || 'article'}`
  );

  // Synchronize local editor state when project or article selection changes
  useEffect(() => {
    if (isPillar) {
      setTitle(project.pillar?.title || '');
      setContent(project.pillar?.markdownContent || '');
      setMetaTitle(project.pillar?.metaTitle || '');
      setMetaDesc(project.pillar?.metaDescription || '');
      setSlug(project.pillar?.slug || '');
      setPrimaryKw(project.pillar?.primaryKeyword || project.business.primaryTopic || '');
      setImageAlt(project.pillar?.suggestedImageAlt || `Illustrative graphic for ${project.pillar?.title || 'article'}`);
    } else {
      const blog = project.supportingBlogs.find((b) => b.id === supportingBlogId) || project.supportingBlogs[0];
      setTitle(blog?.title || '');
      setContent(blog?.fullContent || '');
      setMetaTitle(blog?.title || '');
      setMetaDesc(blog?.metaDescription || '');
      setSlug(blog?.slug || '');
      setPrimaryKw(blog?.targetKeyword || '');
      setImageAlt(`Illustrative diagram for ${blog?.title || 'supporting article'}`);
    }
    setSaveSuccess(false);
  }, [project.id, articleType, supportingBlogId, project.pillar, project.supportingBlogs]);

  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'outline' | 'audit'>('content');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copyArticleSuccess, setCopyArticleSuccess] = useState(false);
  const [copyMetaSuccess, setCopyMetaSuccess] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Live metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));

  // Live SEO Quality Audit
  const audit: QualityAuditResult = auditArticleQuality(content, {
    primaryKeyword: primaryKw,
    city: project.business.city,
    metaTitle,
    metaDescription: metaDesc
  });

  const handleSave = () => {
    if (isPillar) {
      if (!project.pillar) return;
      const updated: PillarArticle = {
        ...project.pillar,
        title,
        markdownContent: content,
        metaTitle,
        metaDescription: metaDesc,
        slug,
        primaryKeyword: primaryKw,
        suggestedImageAlt: imageAlt,
        lastEditedAt: new Date().toISOString()
      };
      onSavePillar(updated);
    } else {
      if (!initialBlog) return;
      const updated: SupportingBlog = {
        ...initialBlog,
        title,
        fullContent: content,
        slug,
        metaDescription: metaDesc,
        targetKeyword: primaryKw,
        lastEditedAt: new Date().toISOString()
      };
      onSaveSupportingBlog(updated);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyArticle = () => {
    navigator.clipboard.writeText(content);
    setCopyArticleSuccess(true);
    setTimeout(() => setCopyArticleSuccess(false), 2000);
  };

  const handleCopyMeta = () => {
    const metaPayload = `SEO Title: ${metaTitle}\nURL Slug: /${slug}\nMeta Description: ${metaDesc}\nTarget Keyword: ${primaryKw}\nImage Alt Text: ${imageAlt}`;
    navigator.clipboard.writeText(metaPayload);
    setCopyMetaSuccess(true);
    setTimeout(() => setCopyMetaSuccess(false), 2000);
  };

  const handleDownloadMd = () => {
    downloadMarkdownFile(slug || 'seo-article', content);
  };

  const handleDownloadTxt = () => {
    downloadTextFile(`${slug || 'seo-article'}.txt`, content);
  };

  const handlePrint = () => {
    printArticle(title, content);
  };

  const handleRegenerateClick = async () => {
    if (window.confirm('Regenerate article? Any unsaved edits will be replaced with fresh AI/Demo content.')) {
      try {
        setIsRegenerating(true);
        await onRegenerate();
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToCluster}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Return to visual cluster"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isPillar ? 'bg-brand-600 text-white' : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {isPillar ? 'Cornerstone Pillar Article' : 'Satellite Supporting Blog'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {wordCount} words • ~{readingTimeMinutes} min read
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 truncate max-w-2xl">
                {title}
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center space-x-1.5 font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Changes Saved!' : 'Save Changes'}</span>
            </button>

            <button
              onClick={handleCopyArticle}
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition"
              title="Copy markdown content"
            >
              {copyArticleSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copyArticleSuccess ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadMd}
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition"
              title="Download as .md file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.MD</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition"
              title="Download as .txt file"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>.TXT</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition"
              title="Print formatted article view"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleRegenerateClick}
              disabled={isRegenerating}
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition disabled:opacity-50"
              title="Regenerate article content"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-brand-600' : ''}`} />
              <span>{isRegenerating ? 'Writing...' : 'Regenerate'}</span>
            </button>
          </div>
        </div>

        {/* Tab Controls & View Mode */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'content'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Article Content</span>
            </button>

            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'metadata'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>SEO Metadata & Links</span>
            </button>

            {isPillar && project.outline && (
              <button
                onClick={() => setActiveTab('outline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'outline'
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Outline Blueprint</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SEO Quality Audit ({audit.overallScore}/100)</span>
            </button>
          </div>

          {activeTab === 'content' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition ${
                  viewMode === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Mode</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition ${
                  viewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Mode</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Article Content (Edit vs Preview) */}
      {activeTab === 'content' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          {viewMode === 'edit' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Article Title (H1 Heading)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-base font-bold text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Markdown Article Content
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {wordCount} words • {content.split('\n').length} lines
                  </span>
                </div>
                <textarea
                  rows={26}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full font-mono text-xs sm:text-sm p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed bg-slate-50/50"
                  placeholder="Enter markdown article content..."
                />
              </div>
            </div>
          ) : (
            /* Rendered Markdown Preview */
            <article className="prose max-w-none text-slate-800 leading-relaxed font-sans space-y-4">
              {content
                .split('\n\n')
                .filter((p) => p.trim())
                .map((block, idx) => {
                  if (block.startsWith('# ')) {
                    return (
                      <h1 key={idx} className="text-2xl sm:text-3xl font-black text-slate-900 border-b border-slate-200 pb-3 pt-2">
                        {block.replace(/^#\s+/, '')}
                      </h1>
                    );
                  }
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-2 border-b border-slate-100 pb-2">
                        {block.replace(/^##\s+/, '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-bold text-slate-800 mt-4 mb-1">
                        {block.replace(/^###\s+/, '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="border-l-4 border-brand-500 bg-brand-50/60 p-3.5 rounded-r-xl text-xs sm:text-sm text-slate-700 italic my-3">
                        {block.replace(/^>\s+/, '')}
                      </blockquote>
                    );
                  }
                  if (block.startsWith('|')) {
                    const rows = block.split('\n');
                    return (
                      <div key={idx} className="overflow-x-auto my-4">
                        <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
                          <tbody className="divide-y divide-slate-200">
                            {rows.map((row, rIdx) => {
                              if (row.includes('---')) return null;
                              const cells = row.split('|').filter((c) => c.trim());
                              return (
                                <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'}>
                                  {cells.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-2 border-r border-slate-200 last:border-r-0">
                                      {cell.trim()}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm text-slate-700 leading-relaxed">
                      {block}
                    </p>
                  );
                })}
            </article>
          )}
        </div>
      )}

      {/* Tab 2: SEO Metadata & Internal Links */}
      {activeTab === 'metadata' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">SEO Metadata & Social Graph</h3>
              <p className="text-xs text-slate-500">Configure title tags, search snippets, URL slugs, and image alt text.</p>
            </div>
            <button
              onClick={handleCopyMeta}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              {copyMetaSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copyMetaSuccess ? 'Copied Metadata!' : 'Copy Metadata'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                SEO Title Tag <span className="text-slate-400 font-normal">({metaTitle.length}/60 chars)</span>
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Slug
              </label>
              <div className="flex items-center text-xs border border-slate-200 rounded-xl px-3 bg-slate-50">
                <span className="text-slate-400 font-mono">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full py-2.5 bg-transparent focus:outline-none font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meta Description <span className="text-slate-400 font-normal">({metaDesc.length}/155 chars)</span>
              </label>
              <textarea
                rows={2}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Keyword
              </label>
              <input
                type="text"
                value={primaryKw}
                onChange={(e) => setPrimaryKw(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Suggested Image Alt Text
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Internal Link Suggestions */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center space-x-1.5">
              <Link2 className="w-4 h-4 text-brand-600" />
              <span>Recommended Internal Linking Pathways</span>
            </h4>
            <div className="space-y-2">
              {isPillar ? (
                project.pillar?.suggestedInternalLinks?.map((link, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-800">Target: {link.targetArticle}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">Section Context: {link.context}</div>
                    </div>
                    <div className="text-[11px] font-mono text-brand-700 bg-brand-50 border border-brand-200 px-2 py-1 rounded shrink-0">
                      Anchor: "{link.anchorText}"
                    </div>
                  </div>
                ))
              ) : (
                initialBlog?.internalLinks?.map((link, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-800">Target: {link.target}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">Reason: {link.reason}</div>
                    </div>
                    <div className="text-[11px] font-mono text-brand-700 bg-brand-50 border border-brand-200 px-2 py-1 rounded shrink-0">
                      Anchor: "{link.anchor}"
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Outline Blueprint */}
      {activeTab === 'outline' && isPillar && project.outline && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Pillar Article Outline Blueprint</h3>
            <p className="text-xs text-slate-500">
              Planned heading structure with estimated word allocations and user search intent objectives.
            </p>
          </div>

          <div className="space-y-3">
            {project.outline.sections.map((sec, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{sec.h2}</span>
                  <span className="bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                    ~{sec.estimatedWords} words
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>Section Objective:</strong> {sec.purpose}
                </p>
                {sec.h3s.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 pl-3 space-y-1">
                    {sec.h3s.map((h3, hIdx) => (
                      <div key={hIdx} className="text-slate-700 text-[11px] flex items-center space-x-1.5">
                        <span className="text-brand-500">•</span>
                        <span>{h3}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: SEO Quality Audit */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Content Quality & SEO Health Audit</h3>
              <p className="text-xs text-slate-500">
                Rule-based checks analyzing heading hierarchy, keyword distribution, readability, and factual claim alerts.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-brand-600">{audit.overallScore}/100</span>
              <div className="text-[10px] text-slate-400 font-medium">Health Rating</div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400">Total Words</span>
              <div className="font-bold text-slate-900 mt-0.5">{audit.wordCount}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400">H2 / H3 Headings</span>
              <div className="font-bold text-slate-900 mt-0.5">{audit.h2Count} H2s • {audit.h3Count} H3s</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400">Keyword Density</span>
              <div className="font-bold text-brand-600 mt-0.5">{audit.keywordDensity}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400">Internal Links</span>
              <div className="font-bold text-emerald-600 mt-0.5">{audit.internalLinkCount} links</div>
            </div>
          </div>

          {/* Check Items List */}
          <div className="space-y-3">
            {audit.checks.map((c) => (
              <div
                key={c.id}
                className={`p-3.5 rounded-xl border text-xs flex items-start space-x-3 ${
                  c.status === 'pass'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : c.status === 'warn'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {c.status === 'pass' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{c.title}</div>
                  <p className="text-slate-600 mt-0.5">{c.explanation}</p>
                  <p className="text-[11px] text-brand-700 mt-1 font-medium">
                    Recommendation: {c.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            <strong>Algorithmic Integrity Disclaimer:</strong> Content quality audits are structural checks against best practices and search quality guidelines. These checks help ensure human scannability and semantic clarity; they do not guarantee top Google SERP ranking or indexation.
          </div>
        </div>
      )}
    </div>
  );
};
