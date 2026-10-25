import React from 'react';
import {
  Flame,
  Sparkles,
  ArrowRight,
  Layers,
  KeyRound,
  MapPin,
  Link2,
  FileCheck,
  CheckCircle2,
  Zap,
  TrendingUp,
  ShieldCheck,
  Code2
} from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onExploreDemo
}) => {
  return (
    <div className="bg-slate-900 text-white min-h-screen selection:bg-brand-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 bg-brand-950/80 border border-brand-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-300 mb-8 backdrop-blur-md shadow-lg shadow-brand-500/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI-Powered Topical Authority & Content Cluster Engine</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Turn Search Intent Into{' '}
            <span className="bg-gradient-to-r from-brand-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Content That Ranks.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Stop publishing isolated, random blog posts. SEOForge AI architects authoritative content clusters: central pillar guides, search-intent satellite articles, local SEO blueprints, and structured internal linking.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartBuilding}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-xl shadow-brand-500/30 hover:scale-105 transition-all"
            >
              <span>Start Building My Content Cluster</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Explore Demo (Bengaluru Dental Clinic)</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Full Offline Demo Mode Included</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Google Gemini AI Integration</span>
            </div>
            <div className="flex items-center space-x-1.5 hidden md:flex">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>8 Reusable Prompt Templates</span>
            </div>
          </div>
        </div>

        {/* Visual Content Cluster Preview Box */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="relative rounded-2xl border border-slate-700/80 bg-slate-950/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-xs font-mono text-slate-400">SEOForge Content Cluster Graph Preview</span>
              </div>
              <span className="bg-brand-500/20 text-brand-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-brand-500/40">
                Hub & Spoke Architecture
              </span>
            </div>

            {/* Interactive preview diagram representation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Satellite Node 1 & 2 */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-brand-500/50 transition">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Commercial Node</span>
                  <div className="text-xs font-bold text-white mt-1">Dental Implants Cost in Bengaluru</div>
                  <div className="text-[11px] text-slate-400 mt-1">Pricing guide & material transparency</div>
                  <div className="mt-2 text-[10px] text-brand-400 font-mono flex items-center space-x-1">
                    <Link2 className="w-3 h-3" />
                    <span>Links to Central Pillar</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-brand-500/50 transition">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Buyer Guide Node</span>
                  <div className="text-xs font-bold text-white mt-1">How to Choose a Dentist in Bengaluru</div>
                  <div className="text-[11px] text-slate-400 mt-1">Sterilization & specialist credentials checklist</div>
                  <div className="mt-2 text-[10px] text-brand-400 font-mono flex items-center space-x-1">
                    <Link2 className="w-3 h-3" />
                    <span>Links to Central Pillar</span>
                  </div>
                </div>
              </div>

              {/* Central Pillar Card */}
              <div className="bg-gradient-to-b from-brand-950 to-slate-900 border-2 border-brand-500 rounded-2xl p-5 shadow-xl shadow-brand-500/20 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow">
                  Central Pillar Authority
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-600/30 border border-brand-400/40 mx-auto flex items-center justify-center text-brand-300 mt-2 mb-3">
                  <Flame className="w-6 h-6 text-brand-400" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  The Complete Guide to Modern Dental Care in Bengaluru
                </h4>
                <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2">
                  Comprehensive 2,000+ word clinical guide establishing core domain topical authority.
                </p>
                <div className="mt-4 pt-3 border-t border-brand-800/60 flex items-center justify-center space-x-3 text-[11px] text-brand-300 font-semibold">
                  <span>~2,150 Words</span>
                  <span>•</span>
                  <span>5 Connected Satellites</span>
                </div>
              </div>

              {/* Satellite Node 3 & 4 */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-brand-500/50 transition">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Cosmetic Node</span>
                  <div className="text-xs font-bold text-white mt-1">Teeth Whitening Cost & Safety</div>
                  <div className="text-[11px] text-slate-400 mt-1">Clinical LED vs take-home tray comparison</div>
                  <div className="mt-2 text-[10px] text-brand-400 font-mono flex items-center space-x-1">
                    <Link2 className="w-3 h-3" />
                    <span>Links to Central Pillar</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-brand-500/50 transition">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Symptom Node</span>
                  <div className="text-xs font-bold text-white mt-1">Common Adult Dental Problems</div>
                  <div className="text-[11px] text-slate-400 mt-1">When to seek emergency dental care</div>
                  <div className="mt-2 text-[10px] text-brand-400 font-mono flex items-center space-x-1">
                    <Link2 className="w-3 h-3" />
                    <span>Links to Central Pillar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 sm:py-24 bg-slate-950/60 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Engineered for Real Search Visibility
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Transform search queries into organized, high-ranking content assets designed for both human readers and search engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 transition group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Authoritative Pillar Blogs</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Generate exhaustive 1,500–3,000 word cornerstone articles with strict H1-H3 hierarchy, clinical/ethical disclaimers, FAQs, and structured comparisons.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 transition group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Content Clusters (3–5 Nodes)</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Build satellite supporting blogs that resolve specific user questions (pricing, mistakes, vetting, and timelines) rather than repeating the pillar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 transition group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Keyword Intent Analysis</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Categorize keywords into Informational, Commercial, and Transactional buckets with transparent reasoning—no fake search volume claims.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 transition group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Local SEO Adaptation</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Natural service + city combinations, localized neighborhood landing concepts, and schema markup without unnatural keyword stuffing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 transition group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Closed-Loop Internal Linking</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Explicit bidirectional link maps and anchor text suggestions that route readers and search engine crawlers through the entire content cluster.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 transition group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">8 Reusable Prompts & Audit</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Inspect and copy 8 production-grade prompt engineering templates, paired with a deterministic SEO health auditor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">End-to-End Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              From Business Details to Complete SEO Content Pack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-white">Configure Business</h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Enter brand name, main service, target audience, city, tone, and strategic business goals.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-white">Plan Keywords</h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Review structured Primary, Secondary, Long-tail, and Local search intent classifications.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-white">Generate Content</h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Craft the cornerstone pillar blog and 3–5 satellite supporting blogs with internal link maps.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="font-bold text-sm text-white">Review & Publish</h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Audit SEO quality, edit articles live, and prepare high-ranking content ready for publication.
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={onStartBuilding}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 transition"
            >
              <span>Build Your SEO Campaign Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">SEOForge AI</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Content Cluster & Topic Authority Generator</span>
            </div>

            <div className="flex items-center space-x-6 text-slate-400">
              <button onClick={onStartBuilding} className="hover:text-white transition">New Strategy</button>
              <button onClick={onExploreDemo} className="hover:text-white transition">Demo Mode</button>
            </div>
          </div>

          {/* Legal / SEO disclaimer */}
          <div className="pt-6 text-slate-500 leading-relaxed text-[11px]">
            <p className="font-semibold text-slate-400 mb-1">Important Search Engine & Medical/Professional Notice:</p>
            <p>
              SEOForge AI is a structured content strategy and prompt engineering workstation. Search engine rankings, organic traffic volumes, indexing speeds, and commercial conversions depend upon dynamic third-party search algorithms, domain history, competitor activity, and backlink factors and are strictly not guaranteed. 
            </p>
            <p className="mt-1.5">
              Content generated for regulated domains (such as healthcare, law, and financial advisory) is provided for informational and editorial scaffolding only. Clinical protocols, pricing guidelines, and factual assertions must be independently verified by licensed professionals before public dissemination.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
