export type SearchIntent = 'Informational' | 'Commercial Investigation' | 'Transactional' | 'Navigational';

export type ContentTone = 'professional' | 'conversational' | 'informative' | 'persuasive';

export type BusinessGoal = 'generate leads' | 'build trust' | 'increase awareness' | 'explain services';

export interface BusinessProfile {
  brandName: string;
  industry: string;
  mainService: string;
  targetAudience: string;
  city: string;
  websiteUrl?: string;
  primaryTopic: string;
  language: string;
  contentTone: ContentTone;
  targetWordCount: number;
  businessGoal: BusinessGoal;
  supportingBlogCount: 3 | 4 | 5;
}

export interface KeywordItem {
  id: string;
  keyword: string;
  type: 'Primary' | 'Secondary' | 'Long-tail' | 'Local';
  searchIntent: SearchIntent;
  intentReasoning: string;
  suggestedArticleType: string;
  clusterPlacement: string;
  audienceFitExplanation: string;
}

export interface OutlineSection {
  h2: string;
  h3s: string[];
  purpose: string;
  estimatedWords: number;
}

export interface PillarOutline {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetWordCount: number;
  contentTone: string;
  sections: OutlineSection[];
  clinicalDisclaimer?: string;
}

export interface InternalLinkItem {
  targetArticle: string;
  anchorText: string;
  context: string;
}

export interface PillarArticle {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  targetAudience: string;
  suggestedImageAlt: string;
  suggestedInternalLinks: InternalLinkItem[];
  markdownContent: string;
  lastEditedAt?: string;
}

export interface SupportingBlogInternalLink {
  target: string;
  anchor: string;
  reason: string;
}

export interface SupportingBlog {
  id: string;
  title: string;
  targetKeyword: string;
  searchIntent: SearchIntent;
  articlePurpose: string;
  slug: string;
  metaDescription: string;
  outline: string[];
  internalLinks: SupportingBlogInternalLink[];
  fullContent: string;
  lastEditedAt?: string;
}

export interface NeighborhoodVariation {
  neighborhood: string;
  suggestedKeyword: string;
  landingPageIdea: string;
  localIntentHook: string;
}

export interface LocalSeoData {
  city: string;
  targetCombinations: string[];
  neighborhoodVariations: NeighborhoodVariation[];
  localizedIntroductionTemplate: string;
  localizedConclusionTemplate: string;
  recommendedSchemaTypes: Array<{ type: string; description: string }>;
  complianceAndCautionNotes: string[];
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  generationStatus?: 'ai_generated' | 'demo_sample' | 'manual' | 'not_generated';
  business: BusinessProfile;
  keywords: KeywordItem[];
  outline: PillarOutline | null;
  pillar: PillarArticle | null;
  supportingBlogs: SupportingBlog[];
  localSeo: LocalSeoData | null;
}

export interface QualityCheckItem {
  id: string;
  title: string;
  status: 'pass' | 'warn' | 'fail';
  explanation: string;
  recommendation: string;
}

export interface QualityAuditResult {
  overallScore: number;
  wordCount: number;
  h2Count: number;
  h3Count: number;
  internalLinkCount: number;
  keywordDensity: string;
  checks: QualityCheckItem[];
  summary: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  purpose: string;
  variables: string[];
  rawPrompt: string;
  description: string;
}
