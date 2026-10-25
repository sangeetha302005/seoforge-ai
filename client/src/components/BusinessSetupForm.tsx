import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Building2,
  MapPin,
  Target,
  FileText,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { BusinessProfile, ContentTone, BusinessGoal } from '../types';
import { INITIAL_DEMO_PROJECT } from '../data/initialDemoData';

interface BusinessSetupFormProps {
  initialBusiness: BusinessProfile;
  onSubmit: (business: BusinessProfile) => Promise<void>;
  isLoading: boolean;
  loadingStep?: string;
  isDemoMode: boolean;
}

export const BusinessSetupForm: React.FC<BusinessSetupFormProps> = ({
  initialBusiness,
  onSubmit,
  isLoading,
  loadingStep,
  isDemoMode
}) => {
  const [formData, setFormData] = useState<BusinessProfile>({ ...initialBusiness });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Synchronize form when active project changes
  useEffect(() => {
    setFormData({ ...initialBusiness });
    setErrors({});
  }, [initialBusiness]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.brandName.trim()) errs.brandName = 'Brand / Business Name is required.';
    if (!formData.industry.trim()) errs.industry = 'Industry / Business Type is required.';
    if (!formData.mainService.trim()) errs.mainService = 'Main Service or Product is required.';
    if (!formData.targetAudience.trim()) errs.targetAudience = 'Target Audience is required.';
    if (!formData.city.trim()) errs.city = 'City or Target Location is required.';
    if (!formData.primaryTopic.trim()) errs.primaryTopic = 'Primary SEO Topic is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleResetToDemo = () => {
    setFormData({ ...INITIAL_DEMO_PROJECT.business });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Step 1: Campaign Configuration</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Configure Your Business & SEO Parameters
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Specify your niche, audience, and search topic. SEOForge AI uses these variables to build intent-aligned keyword maps, cornerstone pillar blogs, and interconnected supporting clusters.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetToDemo}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 px-3.5 py-2 rounded-xl transition shrink-0 self-start sm:self-auto"
            title="Load Bengalore Dental Clinic sample details"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Bengaluru Demo</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Identity */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Business Identity & Core Offering</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business or Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="e.g. Apex Dental Studio"
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    errors.brandName ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.brandName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.brandName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Type or Industry <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. Healthcare / Dental Clinic"
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    errors.industry ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.industry && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.industry}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Service or Product <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mainService}
                  onChange={(e) => setFormData({ ...formData, mainService: e.target.value })}
                  placeholder="e.g. Cosmetic & Restorative Dentistry"
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    errors.mainService ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.mainService && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.mainService}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City or Target Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className={`w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                      errors.city ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
                    }`}
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                {errors.city && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Audience Profile <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g. Urban working professionals and families"
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    errors.targetAudience ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.targetAudience && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.targetAudience}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl || ''}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: SEO Strategy & Editorial Parameters */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-brand-600" />
              <span>SEO Cluster Architecture & Editorial Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary SEO Topic Anchor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.primaryTopic}
                  onChange={(e) => setFormData({ ...formData, primaryTopic: e.target.value })}
                  placeholder="e.g. Comprehensive Dental Care & Implants"
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    errors.primaryTopic ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.primaryTopic && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.primaryTopic}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Business Goal
                </label>
                <select
                  value={formData.businessGoal}
                  onChange={(e) => setFormData({ ...formData, businessGoal: e.target.value as BusinessGoal })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                >
                  <option value="generate leads">Generate Inquiries & Qualified Leads</option>
                  <option value="build trust">Build Clinical Trust & Authority</option>
                  <option value="increase awareness">Increase Local Brand Awareness</option>
                  <option value="explain services">Explain Technical Services & Pricing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Content Editorial Tone
                </label>
                <select
                  value={formData.contentTone}
                  onChange={(e) => setFormData({ ...formData, contentTone: e.target.value as ContentTone })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition capitalize"
                >
                  <option value="informative">Informative & Educational (Recommended for SEO)</option>
                  <option value="professional">Authoritative & Professional</option>
                  <option value="conversational">Approachable & Conversational</option>
                  <option value="persuasive">Persuasive & Benefit-Driven</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Pillar Word Count
                </label>
                <select
                  value={formData.targetWordCount}
                  onChange={(e) => setFormData({ ...formData, targetWordCount: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                >
                  <option value={1500}>1,500 Words (Standard Guide)</option>
                  <option value={2000}>2,000 Words (Deep Pillar — Recommended)</option>
                  <option value={2500}>2,500 Words (Definitive Master Guide)</option>
                  <option value={3000}>3,000 Words (Exhaustive Authority Asset)</option>
                </select>
              </div>
            </div>

            {/* Supporting Blogs Selector: 3, 4, or 5 */}
            <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-brand-600" />
                  <span>Number of Supporting Cluster Blogs</span>
                </label>
                <span className="text-[11px] font-semibold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-md">
                  {formData.supportingBlogCount} Satellite Articles
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Choose how many satellite articles will orbit your central pillar. Each blog tackles a unique search intent angle (Buyer Checklist, Pricing Guide, Mistake Prevention, etc.).
              </p>

              <div className="grid grid-cols-3 gap-3">
                {([3, 4, 5] as const).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, supportingBlogCount: num })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                      formData.supportingBlogCount === num
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{num} Blogs</span>
                    {formData.supportingBlogCount === num && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button & Loading Feedback */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-400">
              {isDemoMode ? (
                <span className="text-brand-600 font-medium">
                  ⚡ Built-in Synthesis Engine active: Instant generation without external API dependencies.
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">
                  ✨ Live Gemini AI active: Generating customized strategy via Gemini 1.5 Flash.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-brand-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingStep || 'Forging SEO Strategy...'}</span>
                </>
              ) : (
                <>
                  <span>Build My SEO Strategy</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
