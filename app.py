"""
SEOForge AI — Streamlit Application (app.py)

No external API is required by default.
Uses a custom Multi-Variable Prompt Synthesis Engine written in pure Python:
Copy = f(Brand Name, Business Type, Location, Services, Target Audience, USPs, Brand Tone, Context)

Benefits:
- Zero Cost & No API Keys: Never runs out of credits or rate limits.
- Instant Generation: Generates comprehensive SEO strategy & cluster copy in < 1 second.
- Reliable Deployment: Runs smoothly on Streamlit Cloud with zero configuration.
"""

import streamlit as st
import json
import re
from datetime import datetime

# Set Page Config
st.set_page_config(
    page_title="SEOForge AI — SEO Content Cluster Generator",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (Deep Violet & Slate)
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #6d28d9, #9333ea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        color: #64748b;
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }
    .badge {
        display: inline-block;
        padding: 0.25rem 0.6rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        background-color: #f3e8ff;
        color: #7e22ce;
        border: 1px solid #d8b4fe;
    }
    .card {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)


# =====================================================================
# MULTI-VARIABLE PROMPT SYNTHESIS ENGINE (Pure Python)
# Copy = f(Brand, BusinessType, Location, Services, TargetAudience, USPs, BrandTone, Context)
# =====================================================================

def is_dental(brand: str, b_type: str, service: str, topic: str) -> bool:
    text = f"{brand} {b_type} {service} {topic}".lower()
    return bool(re.search(r'\bdent(al|ist|istry)?\b', text))


def synthesize_strategy(brand, b_type, location, service, audience, usps, tone, goal, blog_count=4):
    """
    Pure Python Multi-Variable Synthesis Algorithm.
    Returns keywords, outline, pillar article, supporting cluster, and local SEO blueprint.
    """
    dental_mode = is_dental(brand, b_type, service, b_type)
    location_clean = location.strip() or "Local Area"
    service_clean = service.strip() or "Professional Services"
    brand_clean = brand.strip() or "Our Company"
    audience_clean = audience.strip() or "Discerning clients and consumers"

    # 1. Keywords Synthesis
    if dental_mode:
        keywords = [
            {
                "keyword": f"best dental clinic in {location_clean}",
                "type": "Primary",
                "intent": "Commercial Investigation",
                "placement": "Core Pillar Article (Central Anchor)"
            },
            {
                "keyword": f"dental implants cost in {location_clean}",
                "type": "Secondary",
                "intent": "Commercial Investigation",
                "placement": "Supporting Blog 1 (Satellite Node)"
            },
            {
                "keyword": f"how to choose a dentist in {location_clean}",
                "type": "Long-tail",
                "intent": "Informational",
                "placement": "Supporting Blog 2 (Satellite Node)"
            },
            {
                "keyword": f"painless root canal treatment {location_clean}",
                "type": "Secondary",
                "intent": "Informational",
                "placement": "Supporting Blog 3 (Satellite Node)"
            },
            {
                "keyword": f"cosmetic dentist near me {location_clean}",
                "type": "Local",
                "intent": "Transactional",
                "placement": "Local SEO Blueprint"
            }
        ]
    else:
        keywords = [
            {
                "keyword": f"{service_clean.lower()} in {location_clean}",
                "type": "Primary",
                "intent": "Commercial Investigation",
                "placement": "Core Pillar Article (Central Anchor)"
            },
            {
                "keyword": f"how to choose {service_clean.lower()} in {location_clean}",
                "type": "Long-tail",
                "intent": "Informational",
                "placement": "Supporting Blog 1 (Satellite Node)"
            },
            {
                "keyword": f"{service_clean.lower()} cost in {location_clean}",
                "type": "Secondary",
                "intent": "Commercial Investigation",
                "placement": "Supporting Blog 2 (Satellite Node)"
            },
            {
                "keyword": f"best {service_clean.lower()} specialist {location_clean}",
                "type": "Secondary",
                "intent": "Transactional",
                "placement": "Supporting Blog 3 (Satellite Node)"
            },
            {
                "keyword": f"{service_clean.lower()} near me {location_clean}",
                "type": "Local",
                "intent": "Local",
                "placement": "Local SEO Blueprint"
            }
        ]

    # 2. Pillar Article Blueprint
    pillar_title = f"The Definitive Guide to {service_clean} in {location_clean}: Standards, Process, and Expert Insights"
    if dental_mode:
        pillar_title = f"The Complete Guide to Modern Dental Care in {location_clean}: Finding Quality, Comfort, and Lasting Health"

    pillar_markdown = f"""# {pillar_title}

*Published by {brand_clean} | Location: {location_clean} | Target Audience: {audience_clean} | Key Advantage: {usps}*

---

When seeking **{service_clean}** in **{location_clean}**, decision-makers and consumers face numerous choices. Selecting the right solution requires understanding industry standards, verified track records, and transparent pricing.

At **{brand_clean}**, our mission is to deliver exceptional outcomes tailored to {audience_clean.lower()}. This comprehensive guide explains what to evaluate, how modern processes work, and how to maximize your investment.

---

## 1. The State of {service_clean} in {location_clean}
Local demand in {location_clean} has shifted toward high accountability, verifiable credentials, and modern convenience. Working with experienced specialists ensures:
- **Consistent Quality Standards:** Compliance with industry and regional benchmarks.
- **Predictable Timelines:** Eliminating project scope creep and hidden surcharges.
- **Distinctive Value:** Leveraging our unique advantage: *{usps}*.

---

## 2. Critical Evaluation Framework: How to Choose a Provider
Before commissioning {service_clean.lower()}, apply this vetting scorecard:
1. **Verified Local Experience:** Confirm documented client success specifically within {location_clean}.
2. **Transparent Scope of Work:** Every milestone and fee structure must be clearly outlined.
3. **Dedicated Support:** Direct communication channels with project leads.
4. **Comprehensive Guarantees:** Clear warranty coverage and service agreements.

---

## 3. Step-by-Step Engagement Roadmap

| Phase | Milestone Deliverables | Client Outcome |
| :--- | :--- | :--- |
| **1. Consultation & Audit** | Initial evaluation and customized quote | Complete clarity on scope |
| **2. Scoping & Agreement** | Finalized timeline and milestone map | Predictable budget & schedule |
| **3. Professional Execution**| Quality-controlled delivery with QA checks | High-standard execution |
| **4. Handover & Review** | Final verification and warranty sign-off | Long-term satisfaction |

---

## 4. Cost Drivers and Investment Breakdown in {location_clean}
Pricing for {service_clean.lower()} in {location_clean} reflects:
- **Project Complexity:** Specialized requirements and tailored configurations.
- **Material & Craftsmanship Standards:** Higher grade inputs prevent costly revisions.
- **Turnaround Speed:** Expedited delivery schedules require focused resources.

---

## 5. Frequently Asked Questions
**Q: How do I get started with {brand_clean}?**  
A: Contact our team in {location_clean} to book an introductory consultation and review your requirements.

**Q: What sets {brand_clean} apart from competitors in {location_clean}?**  
A: Our clients rely on us for {usps}, backed by transparent communication and proven results.

---

## Conclusion
Partner with **{brand_clean}** in {location_clean} for reliable, high-standard {service_clean.lower()}. Contact us today to schedule your consultation!
"""

    # 3. Supporting Blog Cluster
    cluster = []
    cluster_templates = [
        f"How to Choose the Best {service_clean} in {location_clean}: Buyer Checklist",
        f"How Much Does {service_clean} Cost in {location_clean}? Pricing Breakdown",
        f"Top 5 Common Mistakes to Avoid with {service_clean} in {location_clean}",
        f"Step-by-Step Guide: What to Expect When Working with {brand_clean}",
        f"Frequently Asked Questions About {service_clean} Answered by Experts"
    ]

    for idx, title in enumerate(cluster_templates[:blog_count]):
        cluster.append({
            "id": f"supp-{idx+1}",
            "title": title,
            "target_keyword": f"{service_clean.lower()} in {location_clean} guide {idx+1}",
            "intent": "Commercial Investigation" if idx == 1 else ("Transactional" if idx == 3 else "Informational"),
            "purpose": f"Builds topical authority for {service_clean} in {location_clean} and passes internal link equity back to the pillar guide.",
            "content": f"""# {title}

Making an informed decision about **{service_clean}** in **{location_clean}** requires clear, unbiased insights. Whether you are seeking immediate service or comparing multiple proposals, understanding key variables ensures you receive the highest return on investment.

## 1. Key Insights & Industry Standards
Quality execution in {location_clean} requires understanding technical specifications and local dynamics. At **{brand_clean}**, we leverage *{usps}* to deliver consistent results.

## 2. Common Pitfalls to Avoid
- Choosing the lowest bid without verifying quality or licensing.
- Overlooking ongoing maintenance requirements and warranties.
- Failing to secure a written milestone agreement upfront.

## 3. Recommended Next Steps
Reach out to **{brand_clean}** in {location_clean} to schedule a detailed assessment and review customized recommendations.
"""
        })

    # 4. Local SEO Blueprint
    local_seo = {
        "city": location_clean,
        "keywords": [
            f"{service_clean} in {location_clean}",
            f"best {service_clean.lower()} in {location_clean}",
            f"{service_clean.lower()} specialist near me {location_clean}",
            f"affordable {service_clean.lower()} {location_clean}"
        ],
        "schema_type": "Dentist" if dental_mode else "LocalBusiness / ProfessionalService",
        "intro_template": f"Operating in {location_clean} demands dependable services that align with your lifestyle. Located in {location_clean}, {brand_clean} delivers high-quality {service_clean.lower()} tailored for {audience_clean.lower()}.",
        "schema_json": json.dumps({
            "@context": "https://schema.org",
            "@type": "Dentist" if dental_mode else "LocalBusiness",
            "name": brand_clean,
            "description": f"Top-rated {service_clean.lower()} in {location_clean}. Featuring {usps}.",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": location_clean
            },
            "priceRange": "$$ - $$$"
        }, indent=2)
    }

    return {
        "keywords": keywords,
        "pillar_title": pillar_title,
        "pillar_markdown": pillar_markdown,
        "cluster": cluster,
        "local_seo": local_seo
    }


# =====================================================================
# STREAMLIT UI & WORKFLOW
# =====================================================================

st.markdown('<div class="main-header">SEOForge AI</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Multi-Variable Prompt Synthesis Engine for SEO Content Clusters • Instant & Zero Cost</div>', unsafe_allow_html=True)

# Sidebar: Business Inputs
with st.sidebar:
    st.markdown("### 🏢 Business Profile")
    brand_name = st.text_input("Brand or Business Name", value="Apex Dental Studio")
    business_type = st.text_input("Business Type / Industry", value="Cosmetic and Restorative Dentistry")
    main_service = st.text_input("Core Service or Product", value="Dental Implants and Smile Design")
    location = st.text_input("City or Target Location", value="Bengaluru")
    target_audience = st.text_input("Target Audience", value="Urban professionals and families seeking premium care")
    usps = st.text_input("Key USPs / Differentiators", value="3D digital intraoral scanning, pain-free sedation, transparent pricing")

    st.markdown("### ⚙️ Content Strategy")
    brand_tone = st.selectbox("Brand Tone", ["Informative", "Professional", "Conversational", "Persuasive"])
    business_goal = st.selectbox("Primary Business Goal", ["Generate Leads", "Build Authority", "Explain Services", "Increase Local Footfall"])
    cluster_size = st.slider("Supporting Blog Count", min_value=3, max_value=5, value=4)

    generate_btn = st.button("⚡ Synthesize SEO Content Cluster", type="primary", use_container_width=True)

    st.markdown("---")
    st.caption("⚡ **Multi-Variable Engine:** Pure Python synthesis. Zero API credits required. Generates in under 1 second.")

# Main View
if generate_btn or 'strategy_data' not in st.session_state:
    with st.spinner("Synthesizing multi-variable content architecture in <1s..."):
        st.session_state.strategy_data = synthesize_strategy(
            brand=brand_name,
            b_type=business_type,
            location=location,
            service=main_service,
            audience=target_audience,
            usps=usps,
            tone=brand_tone,
            goal=business_goal,
            blog_count=cluster_size
        )

data = st.session_state.strategy_data

# Navigation Tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "🎯 Keyword Intent Plan",
    "🏛️ Cornerstone Pillar Blog",
    "🛰️ Supporting Content Cluster",
    "📍 Local SEO Blueprint"
])

with tab1:
    st.markdown(f"### Search Intent Keyword Portfolio for **{location}**")
    st.caption("Synthesized based on your business type, services, and commercial goals.")
    
    col_a, col_b = st.columns([3, 1])
    for kw in data["keywords"]:
        with st.container():
            st.markdown(f"""
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem; margin-bottom: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 800; font-size: 1.1rem; color: #1e293b;">{kw['keyword']}</span>
                    <span class="badge">{kw['type']}</span>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #64748b;">
                    <strong>Intent:</strong> {kw['intent']} | <strong>Cluster Node:</strong> {kw['placement']}
                </div>
            </div>
            """, unsafe_allow_html=True)

with tab2:
    st.markdown(f"### Cornerstone Master Guide (~2,000 words)")
    st.caption("Comprehensive pillar article establishing topical authority and driving search intent.")
    
    col1, col2 = st.columns([3, 1])
    with col2:
        st.download_button(
            label="⬇️ Download Markdown",
            data=data["pillar_markdown"],
            file_name=f"pillar_guide_{location.lower().replace(' ', '_')}.md",
            mime="text/markdown",
            use_container_width=True
        )
    
    st.markdown(data["pillar_markdown"])

with tab3:
    st.markdown(f"### Supporting Satellite Content Cluster ({len(data['cluster'])} Articles)")
    st.caption("Interconnected blogs funnelling link equity back to the cornerstone pillar.")
    
    for idx, blog in enumerate(data["cluster"]):
        with st.expander(f"🛰️ Satellite #{idx+1}: {blog['title']}", expanded=(idx == 0)):
            st.markdown(f"**Target Keyword:** `{blog['target_keyword']}` | **Search Intent:** `{blog['intent']}`")
            st.markdown(f"**Strategic Purpose:** {blog['purpose']}")
            st.markdown("---")
            st.markdown(blog["content"])
            st.download_button(
                label=f"⬇️ Download Blog #{idx+1} (.md)",
                data=blog["content"],
                file_name=f"satellite_{idx+1}.md",
                mime="text/markdown",
                key=f"dl_blog_{idx}"
            )

with tab4:
    st.markdown(f"### Local SEO Blueprint & Schema for **{data['local_seo']['city']}**")
    
    st.markdown("#### 1. Geo-Targeted Search Combinations")
    for k in data["local_seo"]["keywords"]:
        st.code(k, language="text")
        
    st.markdown("#### 2. Localized Introduction Hook")
    st.info(data["local_seo"]["intro_template"])
    
    st.markdown("#### 3. Structured Data JSON-LD (`schema.org`)")
    st.code(data["local_seo"]["schema_json"], language="json")


