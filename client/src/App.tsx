import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, WorkspaceView } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { BusinessSetupForm } from './components/BusinessSetupForm';
import { KeywordPlanner } from './components/KeywordPlanner';
import { ContentClusterView } from './components/ContentClusterView';
import { BlogEditor } from './components/BlogEditor';
import { LocalSeoAssistant } from './components/LocalSeoAssistant';
import { PromptLibrary } from './components/PromptLibrary';
import { QualityReviewView } from './components/QualityReviewView';
import { SavedProjects } from './components/SavedProjects';

import { Project, BusinessProfile, PillarArticle, SupportingBlog, KeywordItem } from './types';
import {
  getUserProjects,
  saveUserProject,
  createUserProject,
  deleteUserProject,
  renameUserProject,
  getDemoWorkspace,
  saveDemoWorkspace,
  resetDemoWorkspace,
  importDemoToUserProjects,
  getWorkspaceMode,
  setWorkspaceMode,
  getActiveProject,
  saveActiveProject,
  setActiveProjectId
} from './utils/storage';
import {
  checkBackendHealth
} from './utils/apiClient';
import {
  generateKeywords,
  generateOutline,
  generatePillar,
  generateSupportingCluster,
  generateLocalSeo,
  generateSingleBlog,
  hasUserApiKey
} from './services/aiGenerator';

export function App() {
  const [workspaceMode, setLocalWorkspaceMode] = useState<'user' | 'demo'>(getWorkspaceMode());
  const [allProjects, setAllProjects] = useState<Project[]>(getUserProjects());
  const [currentProject, setCurrentProject] = useState<Project>(getActiveProject());
  const [currentView, setCurrentView] = useState<WorkspaceView>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // AI & Mode states
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [forceDemo, setForceDemo] = useState<boolean>(false);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Editor sub-state
  const [activeEditorType, setActiveEditorType] = useState<'pillar' | 'supporting'>('pillar');
  const [activeSupportingId, setActiveSupportingId] = useState<string | undefined>(undefined);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial load & health verification
  useEffect(() => {
    const mode = getWorkspaceMode();
    setLocalWorkspaceMode(mode);
    setAllProjects(getUserProjects());
    setCurrentProject(getActiveProject());

    checkBackendHealth().then((health) => {
      const configured = Boolean(health.geminiConfigured) || hasUserApiKey();
      setGeminiConfigured(configured);
      setIsDemoMode(!configured || forceDemo);
    }).catch(() => {
      const hasKey = hasUserApiKey();
      setGeminiConfigured(hasKey);
      setIsDemoMode(!hasKey || forceDemo);
    });
  }, [forceDemo]);

  // Sync state helper
  const updateProject = (updated: Project) => {
    saveActiveProject(updated);
    setCurrentProject(updated);
    if (workspaceMode === 'user') {
      setAllProjects(getUserProjects());
    }
  };

  // Switch to specific user project
  const handleSelectProject = (id: string) => {
    setWorkspaceMode('user');
    setLocalWorkspaceMode('user');
    setActiveProjectId(id);
    const projects = getUserProjects();
    setAllProjects(projects);
    const proj = projects.find((p) => p.id === id);
    if (proj) {
      setCurrentProject(proj);
      showToast(`Switched to campaign "${proj.name}"`);
    }
  };

  // Switch to Demo Workspace
  const handleSwitchToDemo = () => {
    setWorkspaceMode('demo');
    setLocalWorkspaceMode('demo');
    const demo = getDemoWorkspace();
    setCurrentProject(demo);
    showToast('Entered Demo Workspace (Apex Dental Studio sample data)');
  };

  // Switch to User Workspace
  const handleSwitchToUser = () => {
    setWorkspaceMode('user');
    setLocalWorkspaceMode('user');
    const projects = getUserProjects();
    setAllProjects(projects);
    const active = getActiveProject();
    setCurrentProject(active);
    showToast('Switched to User Campaigns');
  };

  // Create new project
  const handleCreateNewProject = () => {
    setWorkspaceMode('user');
    setLocalWorkspaceMode('user');
    const newProj = createUserProject();
    setAllProjects(getUserProjects());
    setCurrentProject(newProj);
    setCurrentView('setup');
    showToast('Started new blank SEO campaign.');
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    deleteUserProject(id);
    const remaining = getUserProjects();
    setAllProjects(remaining);
    const active = getActiveProject();
    setCurrentProject(active);
    showToast('Campaign deleted.');
  };

  // Rename project
  const handleRenameProject = (id: string, newName: string) => {
    renameUserProject(id, newName);
    const updatedList = getUserProjects();
    setAllProjects(updatedList);
    if (currentProject.id === id) {
      setCurrentProject({ ...currentProject, name: newName });
    }
    showToast('Campaign renamed.');
  };

  // Reset Demo Workspace back to original
  const handleResetDemoWorkspace = () => {
    const freshDemo = resetDemoWorkspace();
    if (workspaceMode === 'demo') {
      setCurrentProject(freshDemo);
    }
    showToast('Demo Workspace reset to original Bengaluru dental clinic sample.');
  };

  // Clone demo to user campaigns
  const handleImportDemo = () => {
    const cloned = importDemoToUserProjects();
    setWorkspaceMode('user');
    setLocalWorkspaceMode('user');
    setAllProjects(getUserProjects());
    setCurrentProject(cloned);
    showToast('Demo dataset cloned into a new editable campaign.');
  };

  // Full strategy generation from Business Setup Form (Dual-Engine: Gemini + Built-in Synthesis)
  const handleBuildStrategy = async (business: BusinessProfile) => {
    try {
      setIsGenerating(true);

      // Step 1: Keywords
      const kwRes = await generateKeywords(business, setGenerationStep);

      // Step 2: Outline
      const outlineRes = await generateOutline(business, kwRes.data[0]?.keyword, setGenerationStep);

      // Step 3: Full Pillar Blog
      const pillarRes = await generatePillar(business, outlineRes.data, setGenerationStep);

      // Step 4: Supporting Cluster
      const clusterRes = await generateSupportingCluster(
        business,
        business.supportingBlogCount,
        setGenerationStep
      );

      // Step 5: Local SEO
      const localSeoRes = await generateLocalSeo(business, setGenerationStep);

      const isLive = kwRes.engine === 'gemini';

      const updatedProject: Project = {
        ...currentProject,
        name: business.brandName ? `${business.brandName} SEO Campaign` : currentProject.name,
        business,
        keywords: kwRes.data,
        outline: outlineRes.data,
        pillar: pillarRes.data,
        supportingBlogs: clusterRes.data,
        localSeo: localSeoRes.data,
        generationStatus: isLive ? 'ai_generated' : 'demo_sample',
        updatedAt: new Date().toISOString()
      };

      updateProject(updatedProject);
      showToast(
        isLive
          ? '✨ Content Cluster forged with Google Gemini AI!'
          : '⚡ Content Cluster synthesized instantly with Built-in Engine!'
      );
      setCurrentView('cluster');
    } catch (err: any) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Regenerate single supporting blog
  const handleRegenerateSupportingBlog = async (blog: SupportingBlog) => {
    try {
      const res = await generateSingleBlog(
        currentProject.business,
        blog,
        currentProject.business.primaryTopic || currentProject.business.mainService
      );
      const updatedBlogs = currentProject.supportingBlogs.map((b) =>
        b.id === blog.id
          ? { ...b, fullContent: res.data.fullContent, lastEditedAt: new Date().toISOString() }
          : b
      );
      updateProject({
        ...currentProject,
        supportingBlogs: updatedBlogs
      });
      showToast(`Regenerated "${blog.title}"`);
    } catch (err: any) {
      console.error('Regeneration error:', err);
    }
  };

  // Add satellite node
  const handleAddSupportingNode = () => {
    const idx = currentProject.supportingBlogs.length + 1;
    const service = currentProject.business.mainService || 'Service';
    const city = currentProject.business.city || 'Local';
    const newBlog: SupportingBlog = {
      id: `supp-custom-${Date.now()}`,
      title: `${service} Strategy Guide #${idx} in ${city}`,
      targetKeyword: `${service.toLowerCase()} guide ${idx} ${city.toLowerCase()}`,
      searchIntent: 'Informational',
      articlePurpose: `Supplemental satellite blog covering focused search intent for ${service} in ${city}.`,
      slug: `guide-${idx}-${service.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      metaDescription: `Strategic insights on ${service} in ${city} from ${currentProject.business.brandName}.`,
      outline: [
        `H1: ${service} Guide #${idx} in ${city}`,
        `H2: Overview and Objectives`,
        `H2: Practical Recommendations`,
        `H2: Conclusion`
      ],
      internalLinks: [
        {
          target: 'Pillar Article',
          anchor: `comprehensive guide to ${service.toLowerCase()} in ${city}`,
          reason: 'Passes topical relevance back to pillar.'
        }
      ],
      fullContent: `# ${service} Guide #${idx} in ${city}\n\nStrategic insights for ${currentProject.business.brandName} in ${city}.\n\n## Overview\nReview fundamentals and standards.\n\n## Conclusion\nContact ${currentProject.business.brandName} for expert assistance.`,
      lastEditedAt: new Date().toISOString()
    };

    updateProject({
      ...currentProject,
      supportingBlogs: [...currentProject.supportingBlogs, newBlog]
    });
    showToast(`Added satellite node "${newBlog.title}"`);
  };

  // Open editor for pillar or supporting blog
  const handleOpenEditor = (type: 'pillar' | 'supporting', blogId?: string) => {
    setActiveEditorType(type);
    setActiveSupportingId(blogId);
    setCurrentView(type);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentProject={currentProject}
        allProjects={allProjects}
        workspaceMode={workspaceMode}
        onSelectProject={handleSelectProject}
        onCreateNewProject={handleCreateNewProject}
        onSwitchToDemo={handleSwitchToDemo}
        onSwitchToUser={handleSwitchToUser}
        isDemoMode={isDemoMode}
        onGoToOverview={() => setCurrentView('overview')}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Workspace Body — Starts directly on SEOForge AI Dashboard */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          project={currentProject}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* View 1: Main Dashboard Overview */}
          {currentView === 'overview' && (
            <DashboardOverview
              currentProject={currentProject}
              allProjects={allProjects}
              onNavigate={(v) => setCurrentView(v)}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onRenameProject={handleRenameProject}
              isDemoMode={isDemoMode}
            />
          )}

          {/* View 2: Business Setup Form */}
          {currentView === 'setup' && (
            <BusinessSetupForm
              initialBusiness={currentProject.business}
              onSubmit={handleBuildStrategy}
              isLoading={isGenerating}
              loadingStep={generationStep}
              isDemoMode={isDemoMode}
            />
          )}

          {/* View 3: Keyword Planner */}
          {currentView === 'keywords' && (
            <KeywordPlanner
              project={currentProject}
              onUpdateKeywords={(keywords: KeywordItem[]) =>
                updateProject({ ...currentProject, keywords })
              }
              onNavigateToCluster={() => setCurrentView('cluster')}
            />
          )}

          {/* View 4: Content Cluster Visual Canvas */}
          {currentView === 'cluster' && (
            <ContentClusterView
              project={currentProject}
              onOpenArticleEditor={handleOpenEditor}
              onRegenerateSupportingBlog={handleRegenerateSupportingBlog}
              onAddSupportingBlog={handleAddSupportingNode}
            />
          )}

          {/* View 5: Pillar Article Editor */}
          {currentView === 'pillar' && (
            <BlogEditor
              project={currentProject}
              articleType="pillar"
              onSavePillar={(pillar: PillarArticle) => updateProject({ ...currentProject, pillar })}
              onSaveSupportingBlog={() => {}}
              onBackToCluster={() => setCurrentView('cluster')}
              onRegenerate={async () => {
                if (currentProject.outline) {
                  const res = await generatePillar(
                    currentProject.business,
                    currentProject.outline
                  );
                  updateProject({ ...currentProject, pillar: res.data });
                  showToast('Regenerated pillar article.');
                }
              }}
            />
          )}

          {/* View 6: Supporting Blog Editor */}
          {currentView === 'supporting' && (
            <BlogEditor
              project={currentProject}
              articleType="supporting"
              supportingBlogId={activeSupportingId}
              onSavePillar={() => {}}
              onSaveSupportingBlog={(blog: SupportingBlog) => {
                const updatedBlogs = currentProject.supportingBlogs.map((b) =>
                  b.id === blog.id ? blog : b
                );
                updateProject({ ...currentProject, supportingBlogs: updatedBlogs });
              }}
              onBackToCluster={() => setCurrentView('cluster')}
              onRegenerate={async () => {
                const targetBlog = currentProject.supportingBlogs.find(
                  (b) => b.id === activeSupportingId
                );
                if (targetBlog) {
                  await handleRegenerateSupportingBlog(targetBlog);
                }
              }}
            />
          )}

          {/* View 7: Local SEO Assistant */}
          {currentView === 'local-seo' && <LocalSeoAssistant project={currentProject} />}

          {/* View 8: Reusable Prompt Library */}
          {currentView === 'prompts' && (
            <PromptLibrary project={currentProject} onNavigate={(v) => setCurrentView(v)} />
          )}

          {/* View 9: SEO Quality Review */}
          {currentView === 'quality' && (
            <QualityReviewView project={currentProject} onOpenEditor={handleOpenEditor} />
          )}

          {/* View 10: Saved Projects List */}
          {currentView === 'projects' && (
            <SavedProjects
              allProjects={allProjects}
              activeProjectId={currentProject.id}
              workspaceMode={workspaceMode}
              onSelectProject={handleSelectProject}
              onCreateNewProject={handleCreateNewProject}
              onDeleteProject={handleDeleteProject}
              onRenameProject={handleRenameProject}
              onSwitchToDemo={handleSwitchToDemo}
              onResetDemo={handleResetDemoWorkspace}
              onImportDemo={handleImportDemo}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
