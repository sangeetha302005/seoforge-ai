import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Code2,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Project, PromptTemplate } from '../types';
import { PROMPT_LIBRARY, hydratePrompt } from '../data/promptLibrary';
import { WorkspaceView } from './Sidebar';

interface PromptLibraryProps {
  project: Project;
  onNavigate: (view: WorkspaceView) => void;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ project, onNavigate }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [hydrateWithData, setHydrateWithData] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', 'Architecture', 'Research', 'Content Planning', 'Writing', 'Localization', 'Technical SEO', 'Audit & Compliance'];

  const filtered = PROMPT_LIBRARY.filter(
    (p) => filterCategory === 'all' || p.category.toLowerCase() === filterCategory.toLowerCase()
  );

  const handleCopy = (prompt: PromptTemplate) => {
    const textToCopy = hydrateWithData ? hydratePrompt(prompt, project) : prompt.rawPrompt;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseInProject = (templateId: string) => {
    switch (templateId) {
      case 'master-strategy':
        onNavigate('setup');
        break;
      case 'keyword-intent':
        onNavigate('keywords');
        break;
      case 'pillar-outline':
      case 'pillar-article':
        onNavigate('pillar');
        break;
      case 'supporting-cluster':
        onNavigate('supporting');
        break;
      case 'local-seo':
        onNavigate('local-seo');
        break;
      case 'internal-linking':
        onNavigate('cluster');
        break;
      case 'quality-review':
        onNavigate('quality');
        break;
      default:
        onNavigate('overview');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
              <Terminal className="w-3.5 h-3.5 text-brand-600" />
              <span>Prompt Engineering System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Reusable SEO Prompt Engineering Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect, copy, and execute the 8 production-grade prompt templates powering SEOForge AI. Built around repeatable E-E-A-T and search-intent workflows.
            </p>
          </div>

          {/* Hydration Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <span className="text-slate-500 pl-2">Display Mode:</span>
            <button
              onClick={() => setHydrateWithData(false)}
              className={`px-3 py-1 rounded-lg transition ${
                !hydrateWithData ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw Placeholders {'{var}'}
            </button>
            <button
              onClick={() => setHydrateWithData(true)}
              className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                hydrateWithData ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Hydrated with {project.business.brandName}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition capitalize ${
                filterCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All 8 Prompts' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="space-y-6">
        {filtered.map((prompt) => {
          const displayText = hydrateWithData ? hydratePrompt(prompt, project) : prompt.rawPrompt;
          const isCopied = copiedId === prompt.id;

          return (
            <div
              key={prompt.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase bg-brand-100 text-brand-700 px-2 py-0.5 rounded">
                      {prompt.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{prompt.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{prompt.purpose}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleCopy(prompt)}
                    className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied Prompt!' : 'Copy Prompt'}</span>
                  </button>

                  <button
                    onClick={() => handleUseInProject(prompt.id)}
                    className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs"
                  >
                    <span>Use in Project</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Variables List */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-semibold mr-1">Accepted Variables:</span>
                {prompt.variables.map((v) => (
                  <span
                    key={v}
                    className="bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200"
                  >
                    {'{' + v + '}'}
                  </span>
                ))}
              </div>

              {/* Prompt Text Box */}
              <div className="relative">
                <pre className="bg-slate-900 text-brand-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto border border-slate-800">
                  {displayText}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
