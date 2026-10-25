import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Copy,
  Check,
  Code2,
  AlertTriangle,
  Compass,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { Project } from '../types';

interface LocalSeoAssistantProps {
  project: Project;
}

export const LocalSeoAssistant: React.FC<LocalSeoAssistantProps> = ({ project }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const localSeo = project.localSeo;
  const business = project.business;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!localSeo) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Local SEO Strategy Not Yet Generated</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Local search signals, neighborhood landing variations, and structured schema will be created when you build your SEO Strategy for {business.brandName || 'this campaign'}.
          </p>
        </div>
      </div>
    );
  }

  // Generate clean JSON-LD Schema markup
  const isDental = business.industry.toLowerCase().includes('dent') || business.mainService.toLowerCase().includes('dent');
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': isDental ? 'Dentist' : (business.industry.toLowerCase().includes('legal') ? 'LegalService' : 'LocalBusiness'),
    name: business.brandName || 'Business Name',
    description: `Leading provider of ${business.mainService || 'services'} in ${business.city || 'your area'}.`,
    url: business.websiteUrl || `https://${(business.brandName || 'business').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.city || 'City',
      addressRegion: business.city.toLowerCase().includes('bengaluru') ? 'Karnataka' : 'Region',
      addressCountry: business.city.toLowerCase().includes('bengaluru') ? 'IN' : 'US'
    },
    areaServed: localSeo?.neighborhoodVariations?.map((n) => n.neighborhood) || [business.city],
    priceRange: '$$ - $$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00'
      }
    ]
  };

  const schemaString = JSON.stringify(schemaJsonLd, null, 2);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Step 4: Localized Search Signals</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Local SEO Assistant — {business.city}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Optimize for local search intent, neighborhood landing hubs, and structured LocalBusiness schema without spammy keyword stuffing.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-right">
            <span className="text-slate-400">Target Region</span>
            <div className="font-extrabold text-slate-900 text-sm">{business.city}</div>
          </div>
        </div>

        {/* Natural Geo-Targeted Keyword Combinations */}
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-brand-600" />
            <span>Natural Service + City Combinations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localSeo?.targetCombinations.map((combo, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between hover:bg-slate-100 transition"
              >
                <div className="font-bold text-slate-800">{combo}</div>
                <button
                  onClick={() => handleCopy(`combo-${idx}`, combo)}
                  className="text-slate-400 hover:text-brand-600 transition"
                  title="Copy keyword"
                >
                  {copiedSection === `combo-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neighborhood Variations Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Neighborhood-Specific Variations</h3>
            <p className="text-xs text-slate-500">
              Specific sub-district hubs in {business.city} to structure local landing pages and service area signals.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Neighborhood</th>
                <th className="py-2.5 px-3">Localized Search Keyword</th>
                <th className="py-2.5 px-3">Landing Page Concept</th>
                <th className="py-2.5 px-3">Local Intent Hook</th>
                <th className="py-2.5 px-2 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localSeo?.neighborhoodVariations.map((n, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">{n.neighborhood}</td>
                  <td className="py-3 px-3 font-mono text-brand-700">{n.suggestedKeyword}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{n.landingPageIdea}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{n.localIntentHook}</td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleCopy(`n-${idx}`, n.suggestedKeyword)}
                      className="p-1 text-slate-400 hover:text-brand-600 rounded"
                    >
                      {copiedSection === `n-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Localized Introduction & Conclusion Copy Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Intro */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase text-brand-600 tracking-wider">
                Localized Introduction Template
              </span>
              <button
                onClick={() =>
                  handleCopy('intro', localSeo?.localizedIntroductionTemplate || '')
                }
                className="flex items-center space-x-1 text-xs text-slate-500 hover:text-brand-600 font-semibold"
              >
                {copiedSection === 'intro' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'intro' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              "{localSeo?.localizedIntroductionTemplate}"
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Tip: Weaves city lifestyle and transit ease naturally into your opening paragraph.
          </div>
        </div>

        {/* Conclusion / CTA */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase text-brand-600 tracking-wider">
                Location-Aware CTA Template
              </span>
              <button
                onClick={() =>
                  handleCopy('conclusion', localSeo?.localizedConclusionTemplate || '')
                }
                className="flex items-center space-x-1 text-xs text-slate-500 hover:text-brand-600 font-semibold"
              >
                {copiedSection === 'conclusion' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'conclusion' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              "{localSeo?.localizedConclusionTemplate}"
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Tip: Reassures local visitors about proximity, parking, and appointment scheduling.
          </div>
        </div>
      </div>

      {/* JSON-LD LocalBusiness Schema Markup */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-brand-400" />
            <h3 className="font-bold text-sm text-white">
              Generated JSON-LD LocalBusiness Schema Markup
            </h3>
          </div>
          <button
            onClick={() => handleCopy('schema', schemaString)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'schema' ? 'Copied JSON-LD!' : 'Copy Schema'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Embed this code snippet inside the <code className="text-brand-300 bg-slate-800 px-1 py-0.5 rounded">&lt;head&gt;</code> of your website to declare official address, service areas, and business credentials.
        </p>

        <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-brand-200 overflow-x-auto border border-slate-800 leading-relaxed max-h-56">
          {schemaString}
        </pre>
      </div>

      {/* Ethical Caution & Compliance Checklist */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-950 shadow-xs">
        <div className="flex items-start space-x-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-amber-900">
              Local SEO Compliance & Credential Verification Guidelines
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              Strict rules to prevent spam penalties and maintain credibility with prospective local clients:
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-3 text-xs text-amber-900">
          {localSeo?.complianceAndCautionNotes.map((note, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
