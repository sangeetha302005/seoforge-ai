import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  KeyRound,
  Share2,
  FileText,
  Layers,
  MapPin,
  Terminal,
  ShieldCheck,
  FolderKanban,
  ExternalLink
} from 'lucide-react';
import { Project } from '../types';

export type WorkspaceView =
  | 'overview'
  | 'setup'
  | 'keywords'
  | 'cluster'
  | 'pillar'
  | 'supporting'
  | 'local-seo'
  | 'prompts'
  | 'quality'
  | 'projects';

interface SidebarProps {
  currentView: WorkspaceView;
  onNavigate: (view: WorkspaceView) => void;
  project: Project;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  project,
  mobileOpen,
  onCloseMobile
}) => {
  const keywordCount = project?.keywords?.length || 0;
  const supportingCount = project?.supportingBlogs?.length || 0;
  const hasPillar = Boolean(project?.pillar);

  const navItems: Array<{
    id: WorkspaceView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'setup', label: 'New SEO Strategy', icon: Sparkles },
    { id: 'keywords', label: 'Keyword Planner', icon: KeyRound, badge: keywordCount > 0 ? keywordCount : undefined },
    { id: 'cluster', label: 'Content Cluster', icon: Share2, badge: supportingCount > 0 ? `${supportingCount + 1}` : undefined },
    { id: 'pillar', label: 'Pillar Article', icon: FileText, badge: hasPillar ? 'Ready' : undefined, badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'supporting', label: 'Supporting Blogs', icon: Layers, badge: supportingCount > 0 ? supportingCount : undefined },
    { id: 'local-seo', label: 'Local SEO Assistant', icon: MapPin },
    { id: 'prompts', label: 'Prompt Library', icon: Terminal, badge: '8 Prompts', badgeColor: 'bg-brand-100 text-brand-700' },
    { id: 'quality', label: 'Quality & SEO Review', icon: ShieldCheck },
    { id: 'projects', label: 'Saved Projects', icon: FolderKanban }
  ];

  const handleSelect = (view: WorkspaceView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Active Campaign Card */}
      <div className={`p-4 border-b border-slate-100 ${
        project?.isDemo
          ? 'bg-gradient-to-br from-amber-50 to-orange-50/60'
          : 'bg-gradient-to-br from-slate-50 to-brand-50/40'
      }`}>
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {project?.isDemo ? 'Demo Workspace' : 'Active Campaign'}
          </div>
          {project?.isDemo && (
            <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-300 uppercase">
              Sample Data
            </span>
          )}
        </div>
        <div className="mt-1 font-bold text-slate-900 text-sm truncate" title={project?.name}>
          {project?.name || 'Untitled Project'}
        </div>
        <div className="mt-1 flex items-center text-xs text-slate-500 space-x-1 truncate">
          <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
          <span className="truncate">{project?.business?.city || 'Local'}</span>
          <span>•</span>
          <span className="truncate text-brand-700 font-medium">{project?.business?.mainService || 'SEO'}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-brand-700 text-white'
                      : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-2.5 text-slate-700">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-brand-900">
            <span>Intent-First SEO</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Cluster interconnected articles to build compounding search authority.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="no-print hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
