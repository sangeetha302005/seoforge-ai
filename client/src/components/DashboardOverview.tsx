import React, { useState } from 'react';
import {
  FolderKanban,
  FileText,
  Layers,
  Share2,
  Sparkles,
  ArrowRight,
  MapPin,
  Trash2,
  Edit2,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';
import { Project } from '../types';
import { WorkspaceView } from './Sidebar';

interface DashboardOverviewProps {
  currentProject: Project;
  allProjects: Project[];
  onNavigate: (view: WorkspaceView) => void;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  isDemoMode: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentProject,
  allProjects,
  onNavigate,
  onSelectProject,
  onDeleteProject,
  onRenameProject,
  isDemoMode
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Exact figures reflecting stored localStorage data
  const totalProjects = allProjects.length;
  const totalPillars = allProjects.filter((p) => p.pillar !== null).length;
  const totalSupporting = allProjects.reduce((acc, p) => acc + (p.supportingBlogs?.length || 0), 0);
  const totalClusters = allProjects.filter((p) => (p.keywords?.length || 0) > 0).length;

  const handleStartRename = (p: Project) => {
    setEditingId(p.id);
    setRenameValue(p.name);
  };

  const handleSaveRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameProject(id, renameValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: SEOForge AI */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800/80 p-7 sm:p-10 shadow-2xl text-white">
        {/* Soft ambient atmospheric radial glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-300 mb-4 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>AI-Powered Topical Authority Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              SEOForge <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal mt-3 leading-relaxed">
              Turn search intent into compounding organic visibility with structured content clusters, cornerstone pillar guides, and local SEO blueprints.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('setup')}
                className="group inline-flex items-center space-x-2.5 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Build New SEO Strategy</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards (Actual localStorage Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalProjects}</span>
            <span className="text-[11px] text-slate-500">saved in storage</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pillars Created</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalPillars}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">Cornerstone Guides</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Supporting Blogs</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalSupporting}</span>
            <span className="text-[11px] text-slate-500">satellite articles</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Content Clusters</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalClusters}</span>
            <span className="text-[11px] text-brand-600 font-semibold">Active topic hubs</span>
          </div>
        </div>
      </div>

      {/* Active Campaign Detail & Quick Nav */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase text-brand-600 tracking-wider">Current Focus Campaign</span>
            <h2 className="text-lg font-bold text-slate-900">{currentProject.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{currentProject.business.brandName}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-brand-600" />
                <span>{currentProject.business.city}</span>
              </span>
              <span>•</span>
              <span>Goal: <strong className="text-slate-700 capitalize">{currentProject.business.businessGoal}</strong></span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('cluster')}
              className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Open Visual Cluster</span>
            </button>
            <button
              onClick={() => onNavigate('pillar')}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Edit Pillar Blog</span>
            </button>
          </div>
        </div>

        {/* Campaign Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="text-slate-400 font-medium">Primary Keyword Focus</div>
            <div className="font-bold text-slate-800 text-sm mt-1 truncate">
              {currentProject.pillar?.primaryKeyword || currentProject.business.primaryTopic}
            </div>
            <div className="mt-2 text-brand-700 font-semibold flex items-center space-x-1 cursor-pointer hover:underline" onClick={() => onNavigate('keywords')}>
              <span>View Keyword Portfolio ({currentProject.keywords.length})</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="text-slate-400 font-medium">Supporting Satellite Cluster</div>
            <div className="font-bold text-slate-800 text-sm mt-1">
              {currentProject.supportingBlogs.length} Articles Configured
            </div>
            <div className="mt-2 text-brand-700 font-semibold flex items-center space-x-1 cursor-pointer hover:underline" onClick={() => onNavigate('supporting')}>
              <span>Manage Supporting Blogs</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="text-slate-400 font-medium">Target Tone & Length</div>
            <div className="font-bold text-slate-800 text-sm mt-1 capitalize">
              {currentProject.business.contentTone} • ~{currentProject.business.targetWordCount} words
            </div>
            <div className="mt-2 text-brand-700 font-semibold flex items-center space-x-1 cursor-pointer hover:underline" onClick={() => onNavigate('quality')}>
              <span>Audit SEO Quality & Readability</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Your Saved Projects</h3>
            <p className="text-xs text-slate-500">Switch between ongoing SEO campaigns or manage project data</p>
          </div>
          <button
            onClick={() => onNavigate('setup')}
            className="flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition"
          >
            <span>+ Create Project</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Project Name</th>
                <th className="py-2.5 px-3">Brand & Location</th>
                <th className="py-2.5 px-3">Keywords</th>
                <th className="py-2.5 px-3">Supporting Blogs</th>
                <th className="py-2.5 px-3">Last Updated</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProjects.map((p) => {
                const isCurrent = p.id === currentProject.id;
                const isEditing = editingId === p.id;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/80 transition ${
                      isCurrent ? 'bg-brand-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="border border-brand-400 rounded px-2 py-1 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(p.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveRename(p.id)}
                            className="bg-brand-600 text-white px-2 py-1 rounded text-[11px] font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900">{p.name}</span>
                          {isCurrent && (
                            <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{p.business.brandName}</div>
                      <div className="text-[11px] text-slate-400">{p.business.city}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {p.keywords?.length || 0}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {p.supportingBlogs?.length || 0}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {!isCurrent && (
                          <button
                            onClick={() => onSelectProject(p.id)}
                            className="text-brand-600 hover:text-brand-800 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-50 transition"
                          >
                            Open
                          </button>
                        )}
                        <button
                          onClick={() => handleStartRename(p)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                          title="Rename project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete project "${p.name}"?`)) {
                              onDeleteProject(p.id);
                            }
                          }}
                          disabled={allProjects.length <= 1}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition disabled:opacity-30"
                          title={allProjects.length <= 1 ? 'Cannot delete the only project' : 'Delete project'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
