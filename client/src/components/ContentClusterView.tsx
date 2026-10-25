import React, { useState } from 'react';
import {
  Share2,
  FileText,
  Layers,
  ArrowRight,
  Link2,
  Edit3,
  RotateCw,
  Copy,
  Check,
  Plus,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  Network
} from 'lucide-react';
import { Project, SupportingBlog } from '../types';

interface ContentClusterViewProps {
  project: Project;
  onOpenArticleEditor: (type: 'pillar' | 'supporting', supportingId?: string) => void;
  onRegenerateSupportingBlog: (blog: SupportingBlog) => Promise<void>;
  onAddSupportingBlog: () => void;
}

export const ContentClusterView: React.FC<ContentClusterViewProps> = ({
  project,
  onOpenArticleEditor,
  onRegenerateSupportingBlog,
  onAddSupportingBlog
}) => {
  const [viewMode, setViewMode] = useState<'graph' | 'grid'>('graph');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const pillar = project.pillar;
  const supportingBlogs = project.supportingBlogs || [];

  const handleCopyBlog = (blog: SupportingBlog) => {
    navigator.clipboard.writeText(blog.fullContent);
    setCopiedId(blog.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async (blog: SupportingBlog) => {
    try {
      setRegeneratingId(blog.id);
      await onRegenerateSupportingBlog(blog);
    } finally {
      setRegeneratingId(null);
    }
  };

  if (!pillar && supportingBlogs.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <Share2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Content Cluster Not Yet Generated</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Build your central cornerstone pillar and supporting satellite blogs by generating your brief under "New SEO Strategy", or start building manually by adding a satellite node.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onAddSupportingBlog}
            className="inline-flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Satellite Node</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
              <Share2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Step 3: Hub & Spoke Content Architecture</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              SEO Content Cluster Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              1 Central Cornerstone Pillar connected to {supportingBlogs.length} Intent-Driven Satellite Articles. Internal links flow authority back to the core pillar.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'graph' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Visual Graph</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Card Grid</span>
              </button>
            </div>

            <button
              onClick={onAddSupportingBlog}
              className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Satellite Node</span>
            </button>
          </div>
        </div>

        {/* Cluster Stats Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-slate-400">Total Cluster Words</span>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5">
              ~{(pillar?.markdownContent?.split(/\s+/).length || 0) +
                supportingBlogs.reduce((acc, b) => acc + b.fullContent.split(/\s+/).length, 0)}{' '}
              words
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-slate-400">Internal Link Connections</span>
            <div className="font-extrabold text-brand-700 text-sm mt-0.5">
              {supportingBlogs.reduce((acc, b) => acc + (b.internalLinks?.length || 0), 0) +
                (pillar?.suggestedInternalLinks?.length || 0)}{' '}
              Bidirectional Anchors
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-slate-400">Cluster Density</span>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5">
              1 Pillar + {supportingBlogs.length} Satellites
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-slate-400">Topical Anchor</span>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5 truncate">
              {project.business.primaryTopic}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Graph Canvas Mode */}
      {viewMode === 'graph' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Background constellation grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            {/* Center Pillar Node */}
            <div className="flex justify-center">
              <div className="max-w-xl w-full bg-gradient-to-b from-brand-950 via-slate-900 to-slate-950 border-2 border-brand-500 rounded-3xl p-6 shadow-2xl shadow-brand-500/25 relative group hover:border-brand-400 transition-all">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[11px] font-black uppercase px-4 py-1 rounded-full tracking-wider shadow-lg">
                  ★ Central Pillar Entity (Authority Anchor)
                </div>

                <div className="flex items-start justify-between gap-4 mt-2">
                  <div>
                    <span className="text-[10px] font-mono text-brand-300 uppercase tracking-widest">
                      Target Keyword: {pillar?.primaryKeyword || project.business.primaryTopic}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-white mt-1 leading-snug">
                      {pillar?.title || 'Pillar Blog Title'}
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                      {pillar?.metaDescription || 'Long-form cornerstone article establishing core topical domain authority.'}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="inline-block bg-brand-500/20 text-brand-300 border border-brand-500/40 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      ~{pillar?.markdownContent?.split(/\s+/).length || 2000} Words
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                    <Link2 className="w-3.5 h-3.5 text-brand-400" />
                    <span>/{pillar?.slug || 'pillar-guide'}</span>
                  </div>

                  <button
                    onClick={() => onOpenArticleEditor('pillar')}
                    className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open in Editor</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Connecting Visual Divider with Arrows */}
            <div className="flex items-center justify-center space-x-2 text-xs font-mono text-brand-400">
              <span className="w-16 h-px bg-gradient-to-r from-transparent to-brand-500/50" />
              <span>▲ Passes PageRank & Topical Intent ▲</span>
              <span className="w-16 h-px bg-gradient-to-l from-transparent to-brand-500/50" />
            </div>

            {/* Satellite Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportingBlogs.map((blog, idx) => (
                <div
                  key={blog.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-brand-500/60 rounded-2xl p-5 shadow-lg hover:shadow-brand-500/10 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-slate-800 text-brand-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Satellite Node {idx + 1}
                      </span>
                      <span className="bg-brand-950 text-brand-400 border border-brand-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {blog.searchIntent}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-brand-300 transition leading-snug">
                      {blog.title}
                    </h3>

                    <div className="mt-2 text-[11px] text-slate-400 font-mono truncate">
                      KW: <span className="text-slate-300 font-medium">{blog.targetKeyword}</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {blog.articlePurpose}
                    </p>

                    {/* Internal Linking Anchor */}
                    <div className="mt-3 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] space-y-1">
                      <div className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider flex items-center space-x-1">
                        <Link2 className="w-3 h-3" />
                        <span>Anchor to Pillar</span>
                      </div>
                      <div className="text-slate-300 font-medium italic truncate">
                        "{blog.internalLinks?.[0]?.anchor || 'comprehensive pillar guide'}"
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleCopyBlog(blog)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                        title="Copy article markdown"
                      >
                        {copiedId === blog.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleRegenerate(blog)}
                        disabled={regeneratingId === blog.id}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-40"
                        title="Regenerate article"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${regeneratingId === blog.id ? 'animate-spin text-brand-400' : ''}`} />
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenArticleEditor('supporting', blog.id)}
                      className="flex items-center space-x-1 bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition"
                    >
                      <span>Edit Node</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card Grid List Mode */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          {/* Pillar Card In Grid */}
          <div className="bg-white border-2 border-brand-500 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Central Pillar Blog
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2">{pillar?.title}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-3xl">{pillar?.metaDescription}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 font-mono">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Primary: {pillar?.primaryKeyword}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Slug: /{pillar?.slug}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    Length: ~{pillar?.markdownContent.split(/\s+/).length || 2000} words
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenArticleEditor('pillar')}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shrink-0"
              >
                Edit Pillar
              </button>
            </div>
          </div>

          {/* Supporting Blogs In Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportingBlogs.map((b, idx) => (
              <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-brand-600 uppercase">
                      Satellite Blog #{idx + 1}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {b.searchIntent}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                  <div className="text-xs text-slate-500 font-mono mt-1">KW: {b.targetKeyword}</div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{b.articlePurpose}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    ~{b.fullContent.split(/\s+/).length} words
                  </span>
                  <button
                    onClick={() => onOpenArticleEditor('supporting', b.id)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800"
                  >
                    Open Editor →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
