import React, { useState } from 'react';
import {
  KeyRound,
  Filter,
  Search,
  Copy,
  Check,
  Edit2,
  Plus,
  Trash2,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';
import { KeywordItem, SearchIntent, Project } from '../types';

interface KeywordPlannerProps {
  project: Project;
  onUpdateKeywords: (keywords: KeywordItem[]) => void;
  onNavigateToCluster: () => void;
}

export const KeywordPlanner: React.FC<KeywordPlannerProps> = ({
  project,
  onUpdateKeywords,
  onNavigateToCluster
}) => {
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [editingItem, setEditingItem] = useState<KeywordItem | null>(null);

  // Manual research checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    autocomplete: false,
    paa: false,
    trends: false,
    mappack: false
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const keywords = project.keywords || [];

  const filteredKeywords = keywords.filter((k) => {
    const matchesIntent = filterIntent === 'all' || k.searchIntent.toLowerCase() === filterIntent.toLowerCase();
    const matchesSearch =
      k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.suggestedArticleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.intentReasoning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIntent && matchesSearch;
  });

  const handleCopySingle = (k: KeywordItem) => {
    navigator.clipboard.writeText(k.keyword);
    setCopiedId(k.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyAll = () => {
    const text = keywords
      .map(
        (k) =>
          `• ${k.keyword} [${k.type} | ${k.searchIntent}]\n  Article Type: ${k.suggestedArticleType}\n  Role: ${k.clusterPlacement}\n  Intent Reasoning: ${k.intentReasoning}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const updated = keywords.map((k) => (k.id === editingItem.id ? editingItem : k));
    onUpdateKeywords(updated);
    setEditingItem(null);
  };

  const handleDeleteKeyword = (id: string) => {
    const updated = keywords.filter((k) => k.id !== id);
    onUpdateKeywords(updated);
  };

  const handleAddNewKeyword = () => {
    const newItem: KeywordItem = {
      id: `kw-${Date.now()}`,
      keyword: `new ${project.business.mainService.toLowerCase()} keyword in ${project.business.city}`,
      type: 'Secondary',
      searchIntent: 'Commercial Investigation',
      intentReasoning: 'Newly added custom target query.',
      suggestedArticleType: 'Supporting Blog Guide',
      clusterPlacement: 'Supporting Blog Node',
      audienceFitExplanation: `Directly targets ${project.business.targetAudience}.`
    };
    onUpdateKeywords([...keywords, newItem]);
    setEditingItem(newItem);
  };

  const getIntentColor = (intent: SearchIntent) => {
    switch (intent) {
      case 'Informational':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Commercial Investigation':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Transactional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Navigational':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Primary':
        return 'bg-brand-600 text-white';
      case 'Secondary':
        return 'bg-slate-800 text-white';
      case 'Long-tail':
        return 'bg-slate-200 text-slate-800';
      case 'Local':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
              <KeyRound className="w-3.5 h-3.5 text-brand-600" />
              <span>Step 2: Search Intent Architecture</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Keyword & Search Intent Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Organize target queries by commercial intent and cluster placement. Each keyword addresses a distinct buyer stage to maximize topical authority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddNewKeyword}
              className="flex items-center space-x-1.5 bg-white border border-slate-200 hover:border-brand-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5 text-brand-600" />
              <span>Add Keyword</span>
            </button>
            <button
              onClick={handleCopyAll}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy Portfolio'}</span>
            </button>
            <button
              onClick={onNavigateToCluster}
              className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition"
            >
              <span>View Visual Cluster</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Intent Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Intent:</span>
            </span>
            {[
              { id: 'all', label: 'All Intents' },
              { id: 'Informational', label: 'Informational' },
              { id: 'Commercial Investigation', label: 'Commercial' },
              { id: 'Transactional', label: 'Transactional' },
              { id: 'Navigational', label: 'Navigational' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterIntent(f.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  filterIntent.toLowerCase() === f.id.toLowerCase()
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords or roles..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Keyword Target</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Search Intent</th>
                <th className="py-3 px-4">Suggested Article Type</th>
                <th className="py-3 px-4">Cluster Placement</th>
                <th className="py-3 px-4">Search Psychology & Fit</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKeywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{kw.keyword}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {kw.id}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getTypeBadge(kw.type)}`}>
                      {kw.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getIntentColor(kw.searchIntent)}`}>
                      {kw.searchIntent}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {kw.suggestedArticleType}
                  </td>
                  <td className="py-3.5 px-4 text-brand-700 font-semibold">
                    {kw.clusterPlacement}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                    <p className="line-clamp-2" title={kw.intentReasoning}>
                      {kw.intentReasoning}
                    </p>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleCopySingle(kw)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded transition"
                        title="Copy keyword"
                      >
                        {copiedId === kw.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setEditingItem(kw)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded transition"
                        title="Edit keyword details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteKeyword(kw.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Delete keyword"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {keywords.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Keywords Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure your business brief in "New SEO Strategy" to generate an intent-aligned keyword portfolio, or add custom keywords manually below.
              </p>
              <button
                onClick={handleAddNewKeyword}
                className="inline-flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Keyword</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Research Checklist & AI Estimates Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-start space-x-3 mb-4">
          <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-white">
              Data Integrity Notice & Live Validation Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              SEOForge AI generates strategic keyword intent classifications based on search psychology and semantic relevance. We do not claim to possess real-time Google search volumes or difficulty scores. For production campaigns, use this recommended manual verification checklist:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
          <div
            onClick={() => toggleChecklist('autocomplete')}
            className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition border border-slate-700/60"
          >
            {checklist.autocomplete ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-semibold text-slate-200">1. Google Search Autocomplete Validation</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Type "{project.business.mainService} in {project.business.city}" in incognito to verify real search query completions.
              </p>
            </div>
          </div>

          <div
            onClick={() => toggleChecklist('paa')}
            className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition border border-slate-700/60"
          >
            {checklist.paa ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-semibold text-slate-200">2. People Also Ask (PAA) Scraping</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Expand 3-4 PAA questions to discover high-priority FAQ subheadings for your pillar outline.
              </p>
            </div>
          </div>

          <div
            onClick={() => toggleChecklist('trends')}
            className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition border border-slate-700/60"
          >
            {checklist.trends ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-semibold text-slate-200">3. Google Trends Geographic Verification</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Check 12-month query momentum filtered specifically by state or sub-region in India/globally.
              </p>
            </div>
          </div>

          <div
            onClick={() => toggleChecklist('mappack')}
            className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition border border-slate-700/60"
          >
            {checklist.mappack ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-semibold text-slate-200">4. Local Map Pack Competitor Review</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Inspect local 3-pack competitors in {project.business.city} to identify missing service attributes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Keyword Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Edit Keyword Target</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Keyword</label>
              <input
                type="text"
                value={editingItem.keyword}
                onChange={(e) => setEditingItem({ ...editingItem, keyword: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Long-tail">Long-tail</option>
                  <option value="Local">Local</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Search Intent</label>
                <select
                  value={editingItem.searchIntent}
                  onChange={(e) => setEditingItem({ ...editingItem, searchIntent: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Informational">Informational</option>
                  <option value="Commercial Investigation">Commercial Investigation</option>
                  <option value="Transactional">Transactional</option>
                  <option value="Navigational">Navigational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Suggested Article Type</label>
              <input
                type="text"
                value={editingItem.suggestedArticleType}
                onChange={(e) => setEditingItem({ ...editingItem, suggestedArticleType: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cluster Placement</label>
              <input
                type="text"
                value={editingItem.clusterPlacement}
                onChange={(e) => setEditingItem({ ...editingItem, clusterPlacement: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Intent Reasoning & Search Psychology</label>
              <textarea
                rows={2}
                value={editingItem.intentReasoning}
                onChange={(e) => setEditingItem({ ...editingItem, intentReasoning: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
