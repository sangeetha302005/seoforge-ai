import { BusinessProfile, KeywordItem, PillarOutline, PillarArticle, SupportingBlog, LocalSeoData, Project } from '../types';

export interface HealthStatus {
  status: string;
  geminiConfigured: boolean;
  mode: 'live' | 'demo';
  model: string;
  message: string;
}

export interface ConnectionTestResult {
  success: boolean;
  code: string;
  model: string;
  latencyMs?: number;
  message?: string;
  error?: string;
}

async function handleResponse<T>(res: Response, defaultError: string): Promise<T> {
  if (!res.ok) {
    let errorDetail = `${defaultError} (HTTP ${res.status})`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) {
        errorDetail = errorJson.error;
      } else if (errorJson.message) {
        errorDetail = errorJson.message;
      }
    } catch {
      // ignore
    }
    const err = new Error(errorDetail);
    (err as any).status = res.status;
    throw err;
  }
  return await res.json();
}

export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend /api/health call failed or server not reached; defaulting to Demo Mode:', err);
    return {
      status: 'offline',
      geminiConfigured: false,
      mode: 'demo',
      model: 'gemini-1.5-flash',
      message: 'Running in standalone Demo Mode. Backend is either starting or offline.'
    };
  }
}

export async function apiTestConnection(): Promise<ConnectionTestResult> {
  const res = await fetch('/api/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return await res.json();
}

export async function apiGetDemoWorkspace(): Promise<{ data: Project; isDemo: boolean; message: string }> {
  const res = await fetch('/api/demo-workspace');
  return handleResponse(res, 'Failed to fetch demo workspace');
}

export async function apiGenerateKeywords(
  business: BusinessProfile,
  forceDemo = false
): Promise<{ data: KeywordItem[]; isDemo: boolean; message: string }> {
  const res = await fetch('/api/generate/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business, forceDemo })
  });
  return handleResponse(res, 'Failed to generate keywords');
}

export async function apiGenerateOutline(
  business: BusinessProfile,
  primaryKeyword: string,
  forceDemo = false
): Promise<{ data: PillarOutline; isDemo: boolean; message: string }> {
  const res = await fetch('/api/generate/outline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business, primaryKeyword, forceDemo })
  });
  return handleResponse(res, 'Failed to generate outline');
}

export async function apiGeneratePillar(
  business: BusinessProfile,
  outline: PillarOutline,
  forceDemo = false
): Promise<{ data: PillarArticle; isDemo: boolean; message: string }> {
  const res = await fetch('/api/generate/pillar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business, outline, forceDemo })
  });
  return handleResponse(res, 'Failed to generate pillar article');
}

export async function apiGenerateSupportingCluster(
  business: BusinessProfile,
  count: number,
  forceDemo = false
): Promise<{ data: SupportingBlog[]; isDemo: boolean; message: string }> {
  const res = await fetch('/api/generate/supporting-cluster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business, count, forceDemo })
  });
  return handleResponse(res, 'Failed to generate supporting cluster');
}

export async function apiGenerateSingleBlog(
  business: BusinessProfile,
  blogDetails: Partial<SupportingBlog>,
  pillarTopic: string,
  forceDemo = false
): Promise<{ data: { fullContent: string }; isDemo: boolean; message: string }> {
  const res = await fetch('/api/generate/single-blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business, blogDetails, pillarTopic, forceDemo })
  });
  return handleResponse(res, 'Failed to regenerate blog');
}

export async function apiGenerateLocalSeo(
  business: BusinessProfile,
  forceDemo = false
): Promise<{ data: LocalSeoData; isDemo: boolean; message: string }> {
  const res = await fetch('/api/generate/local-seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business, forceDemo })
  });
  return handleResponse(res, 'Failed to generate local SEO');
}
