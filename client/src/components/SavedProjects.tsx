import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Download,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  FileText,
  Layers,
  Check,
  RotateCcw,
  Compass,
  Copy,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Project } from '../types';
import { exportCompleteContentPack } from '../utils/exportUtils';

interface SavedProjectsProps {
  allProjects: Project[];
  activeProjectId: string;
  workspaceMode: 'user' | 'demo';
  onSelectProject: (id: string) => void;
  onCreateNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onSwitchToDemo: () => void;
  onResetDemo: () => void;
  onImportDemo: () => void;
}

export const SavedProjects: React.FC<SavedProjectsProps> = ({
  allProjects,
  activeProjectId,
  workspaceMode,
  onSelectProject,
  onCreateNewProject,
  onDeleteProject,
  onRenameProject,
  onSwitchToDemo,
  onResetDemo,
  onImportDemo
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const [exportingId, setExportingId] = useState<string | null>(null);

  const filtered = allProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.business.brandName.toLowerCase().includes(search.toLowerCase()) ||
      p.business.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartRename = (p: Project) => {
    setEditingId(p.id);
    setRenameText(p.name);
  };

  const handleSaveRename = (id: string) => {
    if (renameText.trim()) {
      onRenameProject(id, renameText.trim());
    }
    setEditingId(null);
  };

  const handleExportPack = async (project: Project) => {
    try {
      setExportingId(project.id);
      await exportCompleteContentPack(project);
    } catch (err) {
      console.error(err);
      alert('Failed to export content pack.');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
              <FolderKanban className="w-3.5 h-3.5 text-brand-600" />
              <span>Project Storage & Workspaces</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Saved SEO Campaigns ({allProjects.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              All campaigns persist locally in your browser's localStorage. Reopen projects, rename, or export complete content packs anytime.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onCreateNewProject}
              className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved projects by name, brand, or city..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Dedicated Demo Workspace Card */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-slate-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Dedicated Demo Workspace
              </span>
              {workspaceMode === 'demo' && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Currently Active
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Apex Dental Studio — Bengaluru Clinic (Sample Data)
            </h3>
            <p className="text-xs text-slate-600 max-w-xl">
              An isolated sandbox environment with a complete 2,000-word pillar article, 5 supporting blogs, 7 intent-tagged keywords, and localized schema. Testing or resetting here never affects your real projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onSwitchToDemo}
              className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition ${
                workspaceMode === 'demo'
                  ? 'bg-slate-900 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{workspaceMode === 'demo' ? 'In Demo Workspace' : 'Open Demo Workspace'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset the dedicated demo workspace to original sample state? Real user campaigns will not be affected.')) {
                  onResetDemo();
                }
              }}
              className="flex items-center space-x-1.5 bg-white border border-amber-200 hover:bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-2 rounded-xl transition"
              title="Reset sample dental data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset Demo Data</span>
            </button>

            <button
              onClick={onImportDemo}
              className="flex items-center space-x-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition"
              title="Copy demo dataset into a new user project that you can edit freely"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Clone into My Campaigns</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Projects Grid Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
          User Campaigns ({filtered.length})
        </h2>
      </div>

      {/* User Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => {
          const isActive = workspaceMode === 'user' && proj.id === activeProjectId;
          const isEditing = editingId === proj.id;
          const isExporting = exportingId === proj.id;

          return (
            <div
              key={proj.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                isActive ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  {isActive ? (
                    <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Active Campaign
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Campaign
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(proj.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={renameText}
                      onChange={(e) => setRenameText(e.target.value)}
                      className="w-full text-xs font-bold border border-brand-400 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(proj.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveRename(proj.id)}
                        className="bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-slate-400 text-xs hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug truncate" title={proj.name}>
                      {proj.name}
                    </h3>
                    <div className="mt-1 flex items-center space-x-1.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{proj.business.brandName || 'Brand Pending'}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5">
                        <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
                        <span>{proj.business.city || 'Location Pending'}</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Campaign stats pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 rounded-xl py-1.5 px-1 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Keywords</span>
                    <div className="font-extrabold text-slate-800 text-xs mt-0.5">
                      {proj.keywords?.length || 0}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl py-1.5 px-1 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Pillar</span>
                    <div className="font-extrabold text-slate-800 text-xs mt-0.5">
                      {proj.pillar ? '1 Ready' : 'None'}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl py-1.5 px-1 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Satellites</span>
                    <div className="font-extrabold text-slate-800 text-xs mt-0.5">
                      {proj.supportingBlogs?.length || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleStartRename(proj)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    title="Rename campaign"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleExportPack(proj)}
                    disabled={isExporting}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition"
                    title="Export Markdown/TXT ZIP pack"
                  >
                    <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce text-brand-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete campaign "${proj.name}"? This cannot be undone.`)) {
                        onDeleteProject(proj.id);
                      }
                    }}
                    disabled={allProjects.length <= 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-30"
                    title={allProjects.length <= 1 ? 'Cannot delete the only campaign' : 'Delete campaign'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!isActive ? (
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition"
                  >
                    Open Campaign
                  </button>
                ) : (
                  <span className="text-xs text-brand-600 font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Loaded</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
