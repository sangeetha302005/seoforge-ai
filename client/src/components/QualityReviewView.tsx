import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Search,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { Project, QualityAuditResult } from '../types';
import { auditArticleQuality } from '../utils/seoAuditor';

interface QualityReviewViewProps {
  project: Project;
  onOpenEditor: (type: 'pillar' | 'supporting', supportingId?: string) => void;
}

export const QualityReviewView: React.FC<QualityReviewViewProps> = ({
  project,
  onOpenEditor
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>('pillar');

  const pillar = project.pillar;
  const supportingBlogs = project.supportingBlogs || [];

  const isPillarSelected = selectedArticleId === 'pillar';
  const currentSupporting = !isPillarSelected
    ? supportingBlogs.find((b) => b.id === selectedArticleId) || supportingBlogs[0]
    : undefined;

  const articleText = isPillarSelected
    ? pillar?.markdownContent || ''
    : currentSupporting?.fullContent || '';

  const primaryKeyword = isPillarSelected
    ? pillar?.primaryKeyword || project.business.primaryTopic
    : currentSupporting?.targetKeyword || '';

  const metaTitle = isPillarSelected ? pillar?.metaTitle : currentSupporting?.title;
  const metaDescription = isPillarSelected ? pillar?.metaDescription : currentSupporting?.metaDescription;

  const audit: QualityAuditResult = auditArticleQuality(articleText, {
    primaryKeyword,
    city: project.business.city,
    metaTitle,
    metaDescription
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-brand-600';
    return 'text-amber-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'bg-brand-50 border-brand-200';
    return 'bg-amber-50 border-amber-200';
  };

  if (!pillar && supportingBlogs.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">No Articles Available for Quality Audit</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Once you generate or write your pillar guide and supporting articles for {project.business.brandName || 'this campaign'}, the rule-based audit engine will automatically evaluate your content health.
          </p>
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
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Step 5: Content Verification & Compliance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              SEO Content Quality & Health Review
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Transparent, deterministic rule-based checks analyzing heading hierarchy, keyword distribution, readability scannability, internal link density, and human verification alerts.
            </p>
          </div>

          {/* Article Selector Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Auditing:</span>
            <select
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 max-w-xs"
            >
              {pillar && (
                <option value="pillar">★ Central Pillar: {pillar.title?.slice(0, 32) || 'Pillar Article'}...</option>
              )}
              {supportingBlogs.map((b, idx) => (
                <option key={b.id} value={b.id}>
                  Satellite #{idx + 1}: {b.title?.slice(0, 32) || 'Satellite'}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Score Card Banner */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-5 rounded-2xl border flex flex-col justify-center ${getScoreBg(audit.overallScore)}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall SEO Health</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-4xl font-black ${getScoreColor(audit.overallScore)}`}>
                {audit.overallScore}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {audit.overallScore >= 80 ? 'Optimal structural & semantic score' : 'Revisions recommended'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-center text-xs">
            <span className="text-slate-400 font-semibold">Article Length & Depth</span>
            <div className="font-extrabold text-slate-900 text-xl mt-1">{audit.wordCount} Words</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {audit.wordCount >= 1500 ? 'Comprehensive depth' : 'Shorter topical guide'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-center text-xs">
            <span className="text-slate-400 font-semibold">Heading Architecture</span>
            <div className="font-extrabold text-slate-900 text-xl mt-1">
              {audit.h2Count} H2s • {audit.h3Count} H3s
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Structured reading breakdown</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-center text-xs">
            <span className="text-slate-400 font-semibold">Keyword Density</span>
            <div className="font-extrabold text-brand-600 text-xl mt-1">{audit.keywordDensity}</div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">Target: {primaryKeyword}</p>
          </div>
        </div>
      </div>

      {/* Audit Checklist Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Rule-Based Structural Verification</h3>
            <p className="text-xs text-slate-500">Measurable condition checks evaluated against search quality guidelines.</p>
          </div>

          <button
            onClick={() => onOpenEditor(isPillarSelected ? 'pillar' : 'supporting', currentSupporting?.id)}
            className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
          >
            <span>Open in Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {audit.checks.map((check) => (
            <div
              key={check.id}
              className={`p-4 rounded-xl border text-xs flex items-start space-x-3.5 ${
                check.status === 'pass'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : check.status === 'warn'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-rose-50/40 border-rose-200'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {check.status === 'pass' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : check.status === 'warn' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{check.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      check.status === 'pass'
                        ? 'bg-emerald-100 text-emerald-800'
                        : check.status === 'warn'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{check.explanation}</p>
                <div className="text-[11px] text-brand-800 font-semibold bg-white/70 p-2 rounded-lg border border-slate-200/50 mt-1">
                  💡 Actionable Fix: {check.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers & Ethics Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white text-xs space-y-3">
        <div className="flex items-center space-x-2 text-brand-400 font-bold">
          <Info className="w-4 h-4" />
          <span>Professional Compliance & Ranking Policy Notice</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Search engine algorithms assess hundreds of dynamic signals including domain authority, user interaction metrics, competitor updates, and backlink graphs. Transparent audit tools evaluate formatting, keyword balance, and link structures; they do not simulate proprietary search engine ranking algorithms.
        </p>
        <p className="text-slate-400 leading-relaxed">
          For health, financial, and legal services, always ensure human subject-matter experts review claims, pricing, and treatment descriptions before publication.
        </p>
      </div>
    </div>
  );
};
