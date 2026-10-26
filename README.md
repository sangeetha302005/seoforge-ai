# SEOForge AI — AI SEO Blog & Content Cluster Generator

> **Tagline:** *Forge smarter content. Build stronger search visibility.*  
> **Product Category:** AI-powered SEO content planning, topic cluster architecture, and blog generation workstation.

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://seoforge-ai-one.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Web Application

**Official Production URL:** 👉 **[https://seoforge-ai-one.vercel.app/](https://seoforge-ai-one.vercel.app/)**

- **Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS
- **Capabilities:** Interactive visual cluster canvas, in-browser markdown editor, local SEO assistant, and persistent browser-based project management.
- **Generation:** Dual-Engine setup with Google Gemini AI + Built-in Multi-Variable Synthesis Fallback.

---

## 1. Overview & Dual-Engine Architecture

**SEOForge AI** is a production-ready workstation designed for digital marketing agencies, SEO professionals, and growing businesses. Rather than churning out disconnected, low-intent blog articles, SEOForge AI establishes **topical authority** through an interconnected hub-and-spoke content architecture.

### Dual-Engine Intelligence
SEOForge AI features a resilient **Dual-Engine Setup** that guarantees 100% uptime and seamless generation:
1. **Google Gemini API (`gemini-1.5-flash`):** When configured with a `GEMINI_API_KEY`, the application connects directly to Google Gemini for deep reasoning, semantic keyword grouping, and tailored long-form copy.
2. **Built-in Multi-Variable Synthesis Fallback Engine:** If no API key is supplied (or if API quotas are exhausted), the system seamlessly synthesizes complete SEO strategies and articles in `< 1 second` using deterministic multi-variable algorithmic modeling:
   $$\text{Copy} = f(\text{Brand}, \text{Industry}, \text{Location}, \text{Services}, \text{Target Audience}, \text{USPs}, \text{Tone}, \text{Goal})$$

### Core Capabilities
- **Strict Data Isolation:** Dedicated **Demo Workspace** segregated completely from user projects at the storage, API, and state levels.
- **Niche-Specific Dynamic Output:** Generated content adapts to the user's actual business, industry, and city (e.g. Austin roofing content for roofers, not dental data).
- **Reusable Prompt Engineering:** 8 canonical, production-grade prompt templates shared identically between backend generation and the frontend Prompt Library with dynamic `{variable}` hydration.
- **Deterministic Quality Audit Engine:** Evaluates H1-H3 depth, keyword placement, keyword density, mobile scannability, internal linking counts, and claim verification flags.
- **In-Browser Markdown Editor:** Live word counts, readability metrics, and side-by-side markdown preview.

---

## 2. Technology Stack

- **Frontend:**
  - React 18 with TypeScript and Vite 5
  - Tailwind CSS for modern SaaS aesthetics (mesh gradients, deep slate/indigo palettes)
  - Lucide React for modern iconography
  - JSZip for packaging complete SEO content bundles
- **Backend & Python Service:**
  - Node.js & Express (ES Modules) for REST API and local daemon
  - Python 3.11 with Streamlit for standalone cloud generation (`app.py`)
- **Persistence & Storage:**
  - Browser `localStorage` with isolated namespaces:
    - `seoforge_user_projects_v2`: User-created campaigns with independent IDs and state.
    - `seoforge_demo_workspace_v2`: Isolated sample workspace for *Apex Dental Studio*.
- **Security:**
  - Zero client-side API key exposure.
  - `.env` strictly excluded from version control (`.gitignore`).
  - `.env.example` provided for clean onboarding.

---

## 3. Dedicated Demo Workspace vs. User Projects

| Feature | User Projects (`seoforge_user_projects_v2`) | Dedicated Demo Workspace (`seoforge_demo_workspace_v2`) |
| :--- | :--- | :--- |
| **Storage Key** | `seoforge_user_projects_v2` | `seoforge_demo_workspace_v2` |
| **Default Content** | Clean, empty state ready for your business brief | Preloaded *Apex Dental Studio* (Bengaluru) sample data |
| **Content Source** | Live Gemini AI or Built-in Synthesis Engine | Pre-rendered demonstration dataset (`isDemo: true`) |
| **Inheritance** | Never inherits dental data | Isolated to the sample workspace |
| **Reset Behavior** | Untouched by "Reset Demo Workspace" | Reset to original Bengaluru dental clinic sample |

---

## 4. End-to-End Workflow & Features

### A. Business Brief & Campaign Setup
- Define brand name, industry, primary service, target audience, city, website, tone, target word count (1500–3000), commercial goal, and cluster size (3, 4, or 5 supporting blogs).
- Fully validated inputs; switching between projects seamlessly loads the selected project's specific brief and data.

### B. Search Intent Keyword Planner
- Segments keywords into Primary, Secondary, Long-tail, and Local search queries.
- Classifies user intent: *Informational*, *Commercial Investigation*, *Transactional*, *Navigational*.
- Explains search psychology, cluster placement, and audience fit.

### C. Cornerstone Pillar Article & Outline Blueprint
- Hierarchical outline generator establishing section purposes, estimated word allocations, and H1–H3 subsections.
- Long-form cornerstone article (~2,000+ words) with markdown headings, comparison tables, People Also Ask FAQs, and non-misleading conclusion CTAs.
- Full metadata suite: SEO title tag (with length counter), URL slug, meta description, and internal link suggestions.

### D. Supporting Satellite Blog Cluster
- Generates 3 to 5 articles addressing distinct search intents (buyer vetting checklists, pricing breakdowns, preparation steps, common mistakes).
- Explicit bidirectional internal linking pathways connecting satellites to the central pillar and adjacent sister nodes.
- Interactive Hub-and-Spoke visual constellation canvas and card grid view.

### E. Local SEO Assistant
- Natural service + location keyword combinations avoiding keyword stuffing.
- Sub-district and neighborhood variations.
- Validated **JSON-LD Schema.org** generator (`LocalBusiness`, `ProfessionalService`, `Dentist`, etc.).

### F. Reusable Prompt Engineering Library
Contains 8 canonical prompt templates used across AI generation and the reference library:
1. **Master SEO Strategy Prompt** (Topic cluster architecture)
2. **Keyword and Search Intent Prompt** (Query classification & psychology)
3. **Pillar Blog Outline Prompt** (Hierarchical blueprint)
4. **Long-Form Pillar Article Prompt** (E-E-A-T long-form drafting)
5. **Supporting Blog Cluster Prompt** (Satellite node generation)
6. **Local SEO Adaptation Prompt** (Geo-targeted signals & schema)
7. **Internal Linking Recommendation Prompt** (Closed-loop link maps)
8. **SEO Content Quality Review Prompt** (Audit & search compliance)

### G. Deterministic Quality Audit Engine
Rule-based auditing engine checking:
- Presence of exactly one H1 heading and sequential H2/H3 structure.
- Target keyword placement in H1, meta title, and early introduction.
- Keyword density calculation (flags over-optimization penalties if >2.5%).
- Meta title (45–60 chars) and meta description (125–160 chars) length checks.
- Paragraph scannability (flags blocks over 85 words) and internal link counts.

---

## 5. Deployment Guide (Vercel)

The repository includes a production-ready `vercel.json` configuration for 1-click deployment:
1. Push or fork this repository to your GitHub account.
2. Open **[vercel.com/new](https://vercel.com/new)** and import your repository (`seoforge-ai`).
3. Leave the default settings (Root directory: `./`, Framework: Vite).
4. Click **Deploy**. Vercel will install dependencies, build the React client, and serve the application globally with 100% feature parity.

---

## 6. Local Installation & Development

### Prerequisites
- Node.js version 18.0 or higher (v20.x tested and verified)
- npm version 9.0 or higher

### Development Setup (Hot Reloading)

```bash
# 1. Clone repository and navigate to root directory
cd seoforge-ai

# 2. Install dependencies
npm install
npm install --prefix client

# 3. Configure environment
cp .env.example .env
# Edit .env to set your GEMINI_API_KEY (optional; Built-in Synthesis Engine runs by default)

# 4. Start backend server and Vite client concurrently
npm run dev
```

- Client runs at: **`http://localhost:5173`**
- Server runs at: **`http://localhost:5000`**

### Running the Automated Test Suite

```bash
npm test
```

Runs the 41-assertion end-to-end test suite (`test-workflow.js`), validating:
1. Health endpoint and environment key detection.
2. Connection testing with diagnostic error codes and missing-key handling.
3. Prevention of silent fallback to demo data for unconfigured/failing live AI requests.
4. Non-dental dynamic demo generation for other niches (e.g. Austin Elite Roofing).
5. Dedicated Demo Workspace endpoint isolation.
6. Deterministic quality review engine (H2 counts, internal links, 7 quality rules).

---

## 7. Limitations & SEO Disclaimer

> **Search Engine Ranking Notice:**  
> SEOForge AI is a specialized content strategy and prompt engineering workstation. Search engine rankings, organic traffic volumes, indexing timelines, and business conversion rates depend on dynamic external factors (search engine algorithmic changes, domain authority, backlink velocity, competitor activity, and technical page-speed metrics). **Specific ranking outcomes cannot and should not be guaranteed.**

> **Regulated Industry & Human Fact-Checking Guidelines:**  
> When generating content for healthcare, legal, financial, or engineering services (Your Money or Your Life — YMYL topics):
> - Clinical procedures, medical claims, pricing estimates, and statutory information must be reviewed and verified by a licensed human professional prior to publication.
> - SEOForge AI automatically includes medical/legal disclaimer notices in generated outlines and drafts. Do not remove these disclaimers for live client deployments.
> - Never invent physical addresses, false customer reviews, or unverified regulatory accreditations.

---

## 8. License

MIT License. Designed and built for professional digital marketing teams and agency workflows.
