# SEOForge AI — AI SEO Blog & Content Cluster Generator

> **Tagline:** *Forge smarter content. Build stronger search visibility.*  
> **Product Category:** AI-powered SEO content planning, topic cluster architecture, and blog generation workstation.

---

## 1. Overview & Architecture

**SEOForge AI** is a production-ready, full-stack web application designed for digital marketing agencies, SEO professionals, and growing businesses. Rather than churning out disconnected, low-intent blog articles, SEOForge AI establishes **topical authority** through a hub-and-spoke content architecture.

The platform provides:
- **Real Google Gemini AI Integration:** Connects securely to the Google Gemini API (`gemini-1.5-flash` or custom models) via a server-side environment variable.
- **Strict Data Isolation:** Dedicated **Demo Workspace** segregated completely from user projects at the storage, API, and state levels.
- **Zero Silent Fallbacks:** If live AI fails or no API key is configured, the system explicitly reports the failure with actionable error codes; it never silently substitutes unrelated demo data.
- **Niche-Specific Dynamic Fallbacks:** When running in explicit Demo Mode, generated samples dynamically adapt to the user's actual business, industry, and city (e.g., generating roofing content for a roofing company, not dental data).
- **Reusable Prompt Engineering:** 8 canonical, production-grade prompt templates shared identically between backend generation and the frontend Prompt Library with dynamic `{variable}` hydration.
- **Deterministic Quality Audit Engine:** Evaluates H1-H3 depth, keyword placement, keyword density, mobile scannability, internal linking counts, and claim verification flags.
- **Export Content Pack:** Download individual articles as Markdown/TXT, print formatted views, or export a complete, production-ready ZIP pack with a `README.md` index.

---

## 2. Technology Stack

- **Frontend:**
  - React 18 with TypeScript and Vite 5
  - Tailwind CSS for responsive SaaS styling (deep violet, midnight navy, clean slate backgrounds)
  - Lucide React for consistent iconography
  - JSZip for client-side packaging of complete SEO content packs
- **Backend:**
  - Node.js & Express (ES Modules)
  - RESTful API endpoints for health, connection test, demo workspace, keywords, outline, pillar, cluster, local SEO, and quality audits
  - Secure server-side Google Gemini AI integration with `@google/genai`
- **Persistence & Storage:**
  - Browser `localStorage` with isolated namespaces:
    - `seoforge_user_projects_v2`: User-created campaigns with independent IDs and state.
    - `seoforge_demo_workspace_v2`: Isolated sample workspace for *Apex Dental Studio*.
- **Security:**
  - Zero client-side API key exposure.
  - `.env` excluded from version control (`.gitignore`).
  - `.env.example` provided for clean onboarding.

---

## 3. Dedicated Demo Workspace vs. User Projects

To ensure strict data hygiene and avoid confusing sample data with client projects:

| Feature | User Projects (`seoforge_user_projects_v2`) | Dedicated Demo Workspace (`seoforge_demo_workspace_v2`) |
| :--- | :--- | :--- |
| **Storage Key** | `seoforge_user_projects_v2` | `seoforge_demo_workspace_v2` |
| **Default Content** | Clean, empty state ready for your business brief | Preloaded *Apex Dental Studio* (Bengaluru) sample data |
| **Content Source** | Live Gemini AI (or explicit niche demo if selected) | Fully rendered demonstration dataset (`isDemo: true`) |
| **Inheritance** | Never inherits dental data | Isolated to the sample workspace |
| **Reset Behavior** | Untouched by "Reset Demo Workspace" | Reset to original Bengaluru dental clinic sample |
| **Import Option** | Users can optionally clone demo data as a new project | N/A |

---

## 4. Google Gemini AI Connection & Error Handling

### Secure Backend Setup
The Google Gemini API key is stored exclusively on the server and is never transmitted to the browser:
1. Create a `.env` file in the root `seoforge-ai/` directory (or copy `.env.example`):
   ```env
   PORT=5000
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
2. Restart the server:
   ```bash
   npm run dev
   # or for production:
   npm start
   ```

### Live Connection Testing
In the **Settings** modal, clicking **"Test Live Gemini Connection"** executes a real end-to-end ping to the Gemini API (`POST /api/test-connection`). It verifies:
- API Key validity
- Active model configuration (`gemini-1.5-flash`)
- Round-trip latency in milliseconds
- Real-time diagnostic error codes:
  - `KEY_MISSING`: API key not set in `.env`
  - `INVALID_API_KEY`: API key is rejected or expired
  - `RATE_LIMIT_EXCEEDED`: API quota exhausted
  - `PERMISSION_DENIED`: API key lacks required permissions
  - `MODEL_NOT_FOUND`: Specified model name is invalid

### No Silent Fallbacks
When a user requests live AI generation without configuring an API key or when the API fails:
- The backend responds with HTTP 400 (`GEMINI_NOT_CONFIGURED`) or HTTP 502 (`AI_GENERATION_FAILED`).
- The frontend displays an informative banner and guidance modal explaining the exact error.
- **The application will NEVER silently return unrelated demo content (e.g. dental articles) for a live request.**

---

## 5. End-to-End Workflow & Features

### A. Business Brief & Campaign Setup
- Define brand name, industry, primary service, target audience, city, website, tone, target word count (1500–3000), commercial goal, and cluster size (3, 4, or 5 supporting blogs).
- Fully validated inputs; switching between projects seamlessly loads the selected project's specific brief and data.

### B. Search Intent Keyword Planner
- Segments keywords into Primary, Secondary, Long-tail, and Local search queries.
- Classifies user intent: *Informational*, *Commercial Investigation*, *Transactional*, *Navigational*.
- Explains search psychology, cluster placement, and audience fit.
- Includes a manual search verification checklist (Google Autocomplete, People Also Ask, Google Trends).

### C. Cornerstone Pillar Article & Outline Blueprint
- Hierarchical outline generator establishing section purposes, estimated word allocations, and H1–H3 subsections.
- Long-form cornerstone article (~2,000+ words) with markdown headings, clinical/commercial disclaimers, comparison tables, People Also Ask FAQs, and non-misleading conclusion CTAs.
- Full metadata suite: SEO title tag (with length counter), URL slug, meta description, image alt text, and internal link suggestions.

### D. Supporting Satellite Blog Cluster
- Generates 3 to 5 articles addressing distinct search intents (buyer vetting checklists, pricing breakdowns, preparation steps, common mistakes).
- Explicit bidirectional internal linking pathways connecting satellites to the central pillar and adjacent sister nodes.
- Interactive Hub-and-Spoke visual constellation canvas and card grid view.

### E. Local SEO Assistant
- Natural service + location keyword combinations avoiding spammy repetition.
- Sub-district and neighborhood variations (e.g., Austin downtown/neighborhoods, Bengaluru localities, or any chosen city).
- Validated **JSON-LD Schema.org** generator (`LocalBusiness`, `ProfessionalService`, `Dentist`, etc.).
- Localized introductions, geo-aware CTAs, and ethical compliance guidelines.

### F. Reusable Prompt Engineering Library
Contains 8 canonical prompt templates used identically across both backend AI generation and the frontend reference library:
1. **Master SEO Strategy Prompt** (Topic cluster architecture)
2. **Keyword and Search Intent Prompt** (Query classification & psychology)
3. **Pillar Blog Outline Prompt** (Hierarchical blueprint)
4. **Long-Form Pillar Article Prompt** (E-E-A-T long-form drafting)
5. **Supporting Blog Cluster Prompt** (Satellite node generation)
6. **Local SEO Adaptation Prompt** (Geo-targeted signals & schema)
7. **Internal Linking Recommendation Prompt** (Closed-loop link maps)
8. **SEO Content Quality Review Prompt** (Audit & search compliance)

*Features live variable hydration:* Toggle between raw `{variable}` placeholders and fully hydrated prompts populated with the current project's business data.

### G. SEO Content Quality Review (Deterministic Engine)
Transparent, rule-based auditing engine checking:
- Presence of exactly one H1 heading.
- Heading hierarchy (H2 and H3 sequence).
- Target keyword placement in H1, meta title, and early introduction.
- Keyword density calculation (flags over-optimization penalties if >2.5%).
- Meta title (45–60 chars) and meta description (125–160 chars) length checks.
- Paragraph scannability (flags blocks over 85 words).
- Internal link counts and anchor text availability.
- Local geographic relevance.
- **Claim Verification & Human Review Alert:** Scans for statistics, numerical claims, and specialized terms requiring human editorial sign-off.

### H. Multi-Format Content Export Pack
- Live word counter and reading time.
- Switch between **Edit Mode** (raw markdown with line counts) and **Preview Mode** (rendered typography, styled tables, blockquotes, and headings).
- Download individual articles as `.md` or `.txt`, or open a print-friendly view.
- Export a structured ZIP content pack containing all strategy files, outlines, pillar articles, supporting blogs, local SEO blueprints, and hydrated prompts.

---

## 6. Installation & Running Instructions

### Prerequisites
- Node.js version 18.0 or higher (v20.x tested and verified)
- npm version 9.0 or higher

### Development Setup (Hot Reloading)

```bash
# 1. Clone repository and navigate to root directory
cd seoforge-ai

# 2. Install root and client dependencies
npm install
npm install --prefix client

# 3. Configure environment
cp .env.example .env
# Edit .env to set your GEMINI_API_KEY (optional for demo mode)

# 4. Start backend server and Vite client concurrently
npm run dev
```

- Client runs at: **`http://localhost:5173`**
- Server runs at: **`http://localhost:5000`**

### Production Build & Single-Port Server

```bash
# Build React client into client/dist
npm run build

# Start full-stack server (Serves API + Built Client on port 5000)
npm start
```

- Full-stack application available at: **`http://localhost:5000`**

### Running the Automated Test Suite

```bash
npm test
```

Runs the 41-assertion end-to-end test suite (`test-workflow.js`), validating:
1. Health endpoint and environment key detection.
2. Connection testing with error codes and missing-key handling.
3. Prevention of silent fallback to demo data for unconfigured/failing live AI requests.
4. Non-dental dynamic demo generation for other niches (e.g. Austin Elite Roofing).
5. Dedicated Demo Workspace endpoint isolation.
6. Deterministic quality review engine (H2 counts, internal links, 7 quality rules).

---

## 7. Limitations, Verification & SEO Disclaimer

> **Important Search Engine Notice:**  
> SEOForge AI is a specialized content strategy and prompt engineering workstation. Search engine rankings, organic traffic volumes, indexing timelines, and business conversion rates depend on dynamic external factors (search engine algorithmic changes, domain authority, backlink velocity, competitor activity, and technical page-speed metrics). **Specific ranking outcomes cannot and should not be guaranteed.**

> **Regulated Industry & Human Fact-Checking Guidelines:**  
> When generating content for healthcare, legal, financial, or engineering services (Your Money or Your Life — YMYL topics):
> - Clinical procedures, medical claims, pricing estimates, and statutory information must be reviewed and verified by a licensed human professional prior to publication.
> - SEOForge AI automatically includes medical/legal disclaimer notices in generated outlines and drafts. Do not remove these disclaimers for live client deployments.
> - Never invent physical addresses, false customer reviews, or unverified regulatory accreditations.

---

## 8. License

MIT License. Designed and built for professional digital marketing teams and agency workflows.
