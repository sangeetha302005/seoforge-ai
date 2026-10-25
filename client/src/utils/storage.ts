import { Project, BusinessProfile } from '../types';
import { INITIAL_DEMO_PROJECT } from '../data/initialDemoData';

const STORAGE_KEY_USER_PROJECTS = 'seoforge_user_projects_v2';
const STORAGE_KEY_DEMO_WORKSPACE = 'seoforge_demo_workspace_v2';
const STORAGE_KEY_ACTIVE_PROJECT_ID = 'seoforge_active_project_id_v2';
const STORAGE_KEY_WORKSPACE_MODE = 'seoforge_workspace_mode_v2';

/**
 * Creates a clean, unpopulated initial user project
 * (Never inherits Apex Dental Studio or Bengaluru defaults)
 */
export function createDefaultUserProject(customName?: string): Project {
  const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const business: BusinessProfile = {
    brandName: '',
    industry: '',
    mainService: '',
    targetAudience: '',
    city: '',
    websiteUrl: '',
    primaryTopic: '',
    language: 'English',
    contentTone: 'informative',
    targetWordCount: 2000,
    businessGoal: 'generate leads',
    supportingBlogCount: 4
  };

  return {
    id: newId,
    name: customName || 'New SEO Campaign',
    createdAt: now,
    updatedAt: now,
    isDemo: false,
    generationStatus: 'not_generated',
    business,
    keywords: [],
    outline: null,
    pillar: null,
    supportingBlogs: [],
    localSeo: null
  };
}

// -------------------------------------------------------------
// Workspace Mode Management ('user' vs 'demo')
// -------------------------------------------------------------

export function getWorkspaceMode(): 'user' | 'demo' {
  try {
    const mode = localStorage.getItem(STORAGE_KEY_WORKSPACE_MODE);
    if (mode === 'demo' || mode === 'user') return mode;
  } catch (err) {
    console.error('Failed to read workspace mode:', err);
  }
  return 'user';
}

export function setWorkspaceMode(mode: 'user' | 'demo'): void {
  try {
    localStorage.setItem(STORAGE_KEY_WORKSPACE_MODE, mode);
  } catch (err) {
    console.error('Failed to save workspace mode:', err);
  }
}

// -------------------------------------------------------------
// Demo Workspace Storage (Dedicated & Isolated)
// -------------------------------------------------------------

export function getDemoWorkspace(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEMO_WORKSPACE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DEMO_WORKSPACE, JSON.stringify(INITIAL_DEMO_PROJECT));
      return INITIAL_DEMO_PROJECT;
    }
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      isDemo: true,
      generationStatus: 'demo_sample'
    };
  } catch (err) {
    console.error('Failed to load Demo Workspace, resetting to default demo:', err);
    return INITIAL_DEMO_PROJECT;
  }
}

export function saveDemoWorkspace(demo: Project): void {
  try {
    const updated = {
      ...demo,
      isDemo: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_DEMO_WORKSPACE, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save Demo Workspace:', err);
  }
}

export function resetDemoWorkspace(): Project {
  try {
    const freshDemo = {
      ...INITIAL_DEMO_PROJECT,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_DEMO_WORKSPACE, JSON.stringify(freshDemo));
    return freshDemo;
  } catch (err) {
    console.error('Failed to reset Demo Workspace:', err);
    return INITIAL_DEMO_PROJECT;
  }
}

// -------------------------------------------------------------
// User Projects Storage (Dedicated & Isolated from Demo)
// -------------------------------------------------------------

export function getUserProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_PROJECTS);
    if (!raw) {
      // Create one clean, empty starter project
      const starter = createDefaultUserProject('First SEO Campaign');
      localStorage.setItem(STORAGE_KEY_USER_PROJECTS, JSON.stringify([starter]));
      return [starter];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const starter = createDefaultUserProject('First SEO Campaign');
      localStorage.setItem(STORAGE_KEY_USER_PROJECTS, JSON.stringify([starter]));
      return [starter];
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read user projects from localStorage:', err);
    const starter = createDefaultUserProject('First SEO Campaign');
    return [starter];
  }
}

export function saveUserProject(project: Project): void {
  try {
    const projects = getUserProjects();
    const updated: Project = {
      ...project,
      isDemo: false,
      updatedAt: new Date().toISOString()
    };
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = updated;
    } else {
      projects.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEY_USER_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save user project:', err);
  }
}

export function createUserProject(name?: string, customBusiness?: Partial<BusinessProfile>): Project {
  const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const business: BusinessProfile = {
    brandName: customBusiness?.brandName || '',
    industry: customBusiness?.industry || '',
    mainService: customBusiness?.mainService || '',
    targetAudience: customBusiness?.targetAudience || '',
    city: customBusiness?.city || '',
    websiteUrl: customBusiness?.websiteUrl || '',
    primaryTopic: customBusiness?.primaryTopic || '',
    language: customBusiness?.language || 'English',
    contentTone: customBusiness?.contentTone || 'informative',
    targetWordCount: customBusiness?.targetWordCount || 2000,
    businessGoal: customBusiness?.businessGoal || 'generate leads',
    supportingBlogCount: customBusiness?.supportingBlogCount || 4
  };

  const newProject: Project = {
    id: newId,
    name: name || (business.brandName ? `${business.brandName} SEO Campaign` : 'New SEO Campaign'),
    createdAt: now,
    updatedAt: now,
    isDemo: false,
    generationStatus: 'not_generated',
    business,
    keywords: [],
    outline: null,
    pillar: null,
    supportingBlogs: [],
    localSeo: null
  };

  const projects = getUserProjects();
  projects.unshift(newProject);
  localStorage.setItem(STORAGE_KEY_USER_PROJECTS, JSON.stringify(projects));
  setActiveProjectId(newId);
  setWorkspaceMode('user');

  return newProject;
}

export function deleteUserProject(id: string): { success: boolean; message?: string } {
  try {
    let projects = getUserProjects();
    if (projects.length <= 1) {
      return { success: false, message: 'You must maintain at least one user project. Create a new campaign before deleting this one.' };
    }
    projects = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_USER_PROJECTS, JSON.stringify(projects));
    if (getActiveProjectId() === id) {
      setActiveProjectId(projects[0].id);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export function renameUserProject(id: string, newName: string): void {
  const projects = getUserProjects();
  const proj = projects.find((p) => p.id === id);
  if (proj) {
    proj.name = newName.trim();
    proj.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_USER_PROJECTS, JSON.stringify(projects));
  }
}

/**
 * Import Demo into User Projects
 * Clones the sample dental data into a distinct user project so the user can test editing it without affecting the demo workspace.
 */
export function importDemoToUserProjects(): Project {
  const demo = getDemoWorkspace();
  const newId = `proj-imported-demo-${Date.now()}`;
  const now = new Date().toISOString();

  const cloned: Project = {
    ...JSON.parse(JSON.stringify(demo)),
    id: newId,
    name: 'Apex Dental Studio (Imported Copy)',
    createdAt: now,
    updatedAt: now,
    isDemo: false,
    generationStatus: 'demo_sample'
  };

  const projects = getUserProjects();
  projects.unshift(cloned);
  localStorage.setItem(STORAGE_KEY_USER_PROJECTS, JSON.stringify(projects));
  setActiveProjectId(newId);
  setWorkspaceMode('user');
  return cloned;
}

// -------------------------------------------------------------
// Active Project Selection & Routing
// -------------------------------------------------------------

export function getActiveProjectId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT_ID);
    if (active) return active;
  } catch (err) {
    console.error(err);
  }
  const userProjects = getUserProjects();
  return userProjects[0]?.id || 'proj-default';
}

export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT_ID, id);
  } catch (err) {
    console.error(err);
  }
}

export function getActiveProject(): Project {
  const mode = getWorkspaceMode();
  if (mode === 'demo') {
    return getDemoWorkspace();
  }

  const projects = getUserProjects();
  const activeId = getActiveProjectId();
  const found = projects.find((p) => p.id === activeId);
  if (found) return found;

  if (projects.length > 0) {
    setActiveProjectId(projects[0].id);
    return projects[0];
  }

  const starter = createDefaultUserProject('First SEO Campaign');
  return starter;
}

export function saveActiveProject(project: Project): void {
  const mode = getWorkspaceMode();
  if (mode === 'demo' || project.id === INITIAL_DEMO_PROJECT.id) {
    saveDemoWorkspace(project);
  } else {
    saveUserProject(project);
  }
}

// -------------------------------------------------------------
// Backwards Compatibility Aliases
// -------------------------------------------------------------
export const getProjects = getUserProjects;
export const saveProject = saveActiveProject;
export const createProject = createUserProject;
export const deleteProject = deleteUserProject;
export const renameProject = renameUserProject;
export const resetToBengaluruDemo = resetDemoWorkspace;
