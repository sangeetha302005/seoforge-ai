import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  ChevronDown,
  Plus,
  Check,
  Menu,
  X,
  Compass,
  ArrowRight,
  FolderKanban
} from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  currentProject: Project;
  allProjects: Project[];
  workspaceMode: 'user' | 'demo';
  onSelectProject: (id: string) => void;
  onCreateNewProject: () => void;
  onSwitchToDemo: () => void;
  onSwitchToUser: () => void;
  isDemoMode: boolean;
  onGoToOverview: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  allProjects,
  workspaceMode,
  onSelectProject,
  onCreateNewProject,
  onSwitchToDemo,
  onSwitchToUser,
  isDemoMode,
  onGoToOverview,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline — Clicking navigates to Main Dashboard Overview */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={onGoToOverview}
              className="flex items-center space-x-2.5 cursor-pointer group"
              title="Go to SEOForge AI Main Dashboard"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-200 bg-clip-text text-transparent">
                    SEOForge
                  </span>
                  <span className="bg-brand-500/20 border border-brand-500/40 text-brand-300 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                  Forge smarter content. Build stronger search visibility.
                </p>
              </div>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Demo Workspace Banner & Toggle */}
            {workspaceMode === 'demo' ? (
              <div className="flex items-center bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-1.5" />
                <span className="font-bold text-amber-300 mr-2 text-[11px] hidden sm:inline">
                  Demo Workspace (Sample Data)
                </span>
                <button
                  onClick={onSwitchToUser}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase transition tracking-wider"
                >
                  Exit Demo
                </button>
              </div>
            ) : (
              <button
                onClick={onSwitchToDemo}
                className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
                title="Open the pre-built Apex Dental Studio demo workspace"
              >
                <Compass className="w-3.5 h-3.5 text-brand-400" />
                <span>Explore Demo</span>
              </button>
            )}

            {/* Project Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs px-3 py-1.5 rounded-lg transition text-slate-200"
              >
                <span className="text-slate-400 hidden sm:inline">Project:</span>
                <span className="font-semibold text-white max-w-[130px] sm:max-w-[170px] truncate">
                  {currentProject?.name || 'Campaign'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {/* User Projects Section */}
                  <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span>Your Campaigns</span>
                    <button
                      onClick={() => {
                        onCreateNewProject();
                        setDropdownOpen(false);
                      }}
                      className="text-brand-400 hover:text-brand-300 flex items-center space-x-1 text-xs normal-case font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Project</span>
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1">
                    {allProjects.map((p) => {
                      const isSelected = workspaceMode === 'user' && p.id === currentProject?.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProject(p.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                            isSelected ? 'bg-brand-950/60 text-brand-300 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <div className="truncate font-medium">{p.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {p.business?.city || 'Location'} • {p.business?.mainService || 'Service'}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dedicated Demo Workspace Section */}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Sample Workspace
                    </div>
                    <button
                      onClick={() => {
                        onSwitchToDemo();
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                        workspaceMode === 'demo' ? 'bg-amber-950/40 text-amber-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="truncate font-medium flex items-center space-x-1.5">
                          <span>Apex Dental Studio</span>
                          <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1 py-0.2 rounded font-bold uppercase">
                            Sample Data
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">Bengaluru • Cosmetic & Restorative Dentistry</div>
                      </div>
                      {workspaceMode === 'demo' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Status Badge — Clean informative pill */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                isDemoMode
                  ? 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
              title={isDemoMode ? 'Built-in Multi-Variable Synthesis Engine Active' : 'Live Google Gemini AI Connected'}
            >
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-violet-400' : 'bg-emerald-400'}`} />
              <span className="hidden md:inline">{isDemoMode ? 'Built-in Engine' : 'Live Gemini AI'}</span>
              <Sparkles className="w-3 h-3 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
