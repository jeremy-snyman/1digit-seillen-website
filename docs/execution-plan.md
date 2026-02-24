# 1Digit Website — Execution Plan

## Execution Model: Plan → Write → Verify Loop

Every phase follows a strict three-agent loop:

1. **Plan Agent** — Reviews the phase requirements, identifies exact files to create/modify, dependencies from prior phases, and acceptance criteria
2. **Write Agent** — Implements the code for that phase based on the plan
3. **Verify Agent** — Runs the dev server, checks for build errors, takes screenshots with Playwright, validates against acceptance criteria

A phase is only complete when the Verify Agent confirms all acceptance criteria pass. If verification fails, the loop repeats with a targeted fix.

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│  PLAN   │────▶│  WRITE  │────▶│  VERIFY  │
│  Agent  │     │  Agent  │     │  Agent   │
└─────────┘     └─────────┘     └──────────┘
     ▲                               │
     │          fails                │
     └───────────────────────────────┘
```

---

## Pre-requisites

**Source of truth:**
- Design spec: `docs/1_digit_website_master_spec_v_2_with_content_addendum.md`
- Design reference: https://portfolite.framer.website/
- This execution plan: `docs/execution-plan.md`

**Key decisions:**
- Accent color: Neon Lime `#C8FF00`
- Hosting: Generic Node adapter (undecided platform)
- Scope: Full build — all 14+ pages
- Brand assets: Text-based placeholder logo
- Fonts: Inter (primary), Plus Jakarta Sans (display)
- Framework: Astro 5, Tailwind CSS, React islands, MDX

---

## Phase 1: Foundation

### 1.1 Plan
**Goal:** Establish the design system, layout shell, navigation, and footer. After this phase, the dev server runs and shows a styled page with header, empty main area, and footer.

**Dependencies:** None (starting from fresh Astro starter)

**Files to create/modify:**

| Action | File | Purpose |
|--------|------|---------|
| Install | `package.json` | Add: @astrojs/tailwind, tailwindcss, @astrojs/react, react, react-dom, @astrojs/mdx, @astrojs/sitemap, @astrojs/node, motion, recharts, sharp, zod, nodemailer, @fontsource/inter, @fontsource-variable/plus-jakarta-sans |
| Modify | `astro.config.mjs` | Add integrations (tailwind, react, mdx, sitemap, node), set output: hybrid |
| Create | `tailwind.config.mjs` | Design tokens: colors (surface, content, accent #C8FF00, glass), fonts, spacing, border-radius, shadows |
| Modify | `tsconfig.json` | Add path aliases: @/, @components/, @layouts/, @lib/, @content/, @assets/ |
| Create | `src/styles/global.css` | Tailwind layers, base resets (dark bg, white text, antialiased), glass-card utilities, reduced-motion media query, focus-visible styles, ::selection |
| Create | `src/styles/fonts.css` | @fontsource imports: Inter 300-700, Plus Jakarta Sans variable |
| Create | `src/styles/animations.css` | CSS keyframes: marquee, bounce, fade-in-up |
| Rewrite | `src/layouts/Layout.astro` | Base HTML shell: lang, charset, viewport, SEOHead, font imports, global styles, ViewTransitions, SkipLink, slot |
| Create | `src/layouts/PageLayout.astro` | Wraps Layout with Header + `<main id="main-content">` + Footer |
| Create | `src/components/global/Header.astro` | Sticky glass nav (position:sticky, top:0, z-50, backdrop-blur, bg-surface/80). Logo left, nav links center/right, "AI Readiness Assessment" CTA button. Active page via Astro.url.pathname |
| Create | `src/components/global/Navigation.astro` | Desktop horizontal nav links from navigation.ts data. Hover underline animation |
| Create | `src/components/global/MobileMenu.astro` | Full-screen overlay, hamburger toggle, all nav links + CTA |
| Create | `src/components/global/Footer.astro` | Dark section, large italic CTA headline, primary CTA button, social links (LinkedIn, X, GitHub), bottom bar with copyright + privacy + terms links |
| Create | `src/components/global/Logo.astro` | Text-based "1DIGIT" with accent dot. Accepts size prop |
| Create | `src/components/global/SkipLink.astro` | Visually hidden until focused, links to #main-content |
| Create | `src/components/ui/Button.astro` | Variants: primary (accent filled), secondary (white filled), outline (white border), ghost. Sizes: sm, md, lg. Renders as `<a>` if href provided, `<button>` otherwise |
| Create | `src/components/ui/Badge.astro` | Uppercase small label pill with subtle background |
| Create | `src/components/ui/GlassCard.astro` | Glass morphism card: bg-glass, backdrop-blur, border, rounded-card. Optional hover prop for lift + glow |
| Create | `src/components/ui/SectionHeading.astro` | Pattern: optional Badge above, large heading (h2), optional description paragraph |
| Create | `src/components/ui/Icon.astro` | Inline SVG wrapper. Accept name prop |
| Create | `src/components/ui/Tag.astro` | Small pill for skills/capabilities |
| Create | `src/components/layout/Section.astro` | Section wrapper with consistent py-section padding, optional bg color |
| Create | `src/components/layout/Container.astro` | Max-w-container mx-auto px-6 lg:px-8 |
| Create | `src/components/seo/SEOHead.astro` | Props: title, description, ogImage, noIndex. Renders meta, OG, Twitter, canonical, structured data |
| Create | `src/content/data/navigation.ts` | Main nav items array + CTA nav item |
| Create | `src/lib/constants.ts` | SITE object: name, tagline, url, description, social links |
| Delete | `src/components/Welcome.astro` | Remove default starter component |
| Delete | `src/assets/astro.svg` | Remove default starter asset |
| Delete | `src/assets/background.svg` | Remove default starter asset |
| Modify | `src/pages/index.astro` | Temporary: just renders PageLayout with "Coming soon" placeholder |

### 1.2 Write
Execute all file creations and modifications listed above.

### 1.3 Verify
**Acceptance criteria:**
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without errors
- [ ] Browser at localhost shows: sticky header with glass effect, "1DIGIT" logo, navigation links, CTA button
- [ ] Footer is visible at bottom with CTA and social links
- [ ] Mobile viewport (375px): hamburger menu appears, nav links hidden
- [ ] Desktop viewport (1440px): full horizontal nav visible
- [ ] Page background is pure black (#000)
- [ ] Text is white, accent elements are neon lime
- [ ] Skip link appears on tab focus
- [ ] No console errors in browser

**Verify method:** Run dev server, take Playwright screenshots at 375px and 1440px, check build output.

---

## Phase 2: Home Page

### 2.1 Plan
**Goal:** Build the complete home page with all 8 sections from the spec, including the smoke canvas animation, logo marquee, and scroll-triggered reveals.

**Dependencies:** Phase 1 complete (layout shell, all UI primitives)

**Files to create/modify:**

| Action | File | Purpose |
|--------|------|---------|
| Rewrite | `src/pages/index.astro` | Import and compose all home sections in order |
| Create | `src/components/home/HeroSection.astro` | Full viewport height. SmokeCanvas absolute bg. H1: "AI Starts With Your Data." Subtitle. Two CTAs. Scroll indicator |
| Create | `src/components/home/SmokeCanvas.tsx` | React island (client:load). Canvas 2D smoke: ~60 particles, dark grays, blur(50px), Perlin noise movement, requestAnimationFrame. Reduced-motion: static gradient fallback |
| Create | `src/components/home/DataBarrierSection.astro` | Two-column: left large heading "The Real Barrier to AI", right description text. Wrapped in ScrollReveal |
| Create | `src/components/home/WhatWeDoSummary.astro` | Badge "WHAT WE DO" + SectionHeading + 5-card grid of CapabilityCards |
| Create | `src/components/home/CapabilityCard.astro` | GlassCard with icon, title, short desc, "Learn more →" link. Cards: AI Readiness, Smart Data Platforms, AI-Enabled Products, Data Augmentation, AI Architecture & Governance |
| Create | `src/components/home/TachyonIonosBlock.astro` | Two-card horizontal layout: Tachyon card + IONOS card. Each with product name, one-liner, CTA |
| Create | `src/components/home/TrustSignals.astro` | Horizontal row of trust icons: "Secure SDLC", "Governance Frameworks", "ISO 27001 Awareness", "GDPR Compliant" |
| Create | `src/components/home/OutcomesProof.astro` | 2-3 metric cards with large numbers + descriptions (placeholder data) |
| Create | `src/components/home/AssessmentCTA.astro` | Full-width section with accent glow bg, heading, CTA button |
| Create | `src/components/home/LogoMarquee.astro` | Uses Marquee component with placeholder partner/tech logos (grayscale SVGs) |
| Create | `src/components/interactive/ScrollReveal.astro` | IntersectionObserver wrapper: fade-up on enter viewport. Props: delay, direction. CSS transitions. prefers-reduced-motion bypass |
| Create | `src/components/interactive/Marquee.astro` | Pure CSS infinite scroll. Props: speed, direction, pauseOnHover. Duplicated slot content. @keyframes marquee |

### 2.2 Write
Implement all home page components and assemble them in index.astro.

### 2.3 Verify
**Acceptance criteria:**
- [ ] Home page loads with smoke animation visible in hero
- [ ] Hero text "AI Starts With Your Data." renders large and bold
- [ ] Two CTA buttons visible below subtitle
- [ ] Scroll indicator animates (bounce) at bottom of hero
- [ ] Scrolling down reveals each section with fade-up animation
- [ ] Logo marquee auto-scrolls smoothly, pauses on hover
- [ ] 5 capability cards render in grid with glass morphism styling
- [ ] Tachyon and IONOS cards are side-by-side
- [ ] Trust signals row is visible
- [ ] Assessment CTA section has accent-colored background/glow
- [ ] Footer smoke effect visible
- [ ] Mobile (375px): all sections stack vertically, cards go single-column
- [ ] Desktop (1440px): proper grid layouts, two-column where specified
- [ ] Reduced motion (test with devtools): smoke is static gradient, no scroll animations
- [ ] No build errors, no console errors

**Verify method:** Run dev server, take Playwright full-page screenshot, scroll through and capture each section, test mobile viewport, test reduced-motion via CSS override.

---

## Phase 3: Core Content Pages

### 3.1 Plan
**Goal:** Build What We Do, How We Work, Data Platforms, and About pages with all sections per spec.

**Dependencies:** Phase 1 (layout, UI), Phase 2 (ScrollReveal, Marquee)

**Files to create/modify:**

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/pages/what-we-do.astro` | Page hero + 4 pillar sections + cross-links |
| Create | `src/pages/how-we-work.astro` | Process hero + sticky scroll timeline + cadence + client needs + ways of working + definition of done + CTA |
| Create | `src/pages/data-platforms.astro` | Hero + non-technical explanation + 6 pillar grid + patterns + data quality + cost + CTAs |
| Create | `src/pages/about.astro` | Mission + differentiators + values + team + partners + CTA |
| Create | `src/components/content/PillarCard.astro` | Large card: problem → approach → deliverables list → timeframe → CTA. Uses ExpandableDetail for tech deep-dive |
| Create | `src/components/content/ProcessTimeline.astro` | Container for ProcessStep items with connecting line |
| Create | `src/components/content/ProcessStep.astro` | Numbered step with icon, title, description. Matches Portfolite's 1/2/3 step pattern |
| Create | `src/components/content/ServiceCard.astro` | Icon + title + description glass card |
| Create | `src/components/content/FeatureList.astro` | Checkmark bullet list of deliverables |
| Create | `src/components/content/DiagramPlaceholder.astro` | Dashed border container with "Diagram coming soon" text, SVG-ready |
| Create | `src/components/content/ExpandableDetail.astro` | Click to expand/collapse progressive disclosure. Uses `<details>`/`<summary>` for no-JS fallback |
| Create | `src/components/layout/TwoColumn.astro` | Responsive two-column (stack on mobile, side-by-side desktop). Props: reversed, ratio |
| Create | `src/components/layout/StickyScrollLayout.astro` | Left column: position:sticky top:6rem. Right column: scrolls normally. Used for How We Work process |
| Create | `src/content/data/services.ts` | Services/capabilities data objects |
| Create | `src/content/data/team.ts` | Team member data: name, role, bio, placeholder image |

### 3.2 Write
Implement all content pages and new components. Content copy comes directly from the master spec.

### 3.3 Verify
**Acceptance criteria:**
- [ ] All 4 pages accessible via nav links
- [ ] What We Do: 4 pillars render with problem/approach/deliverables/CTA, expandable details work
- [ ] What We Do: Pillar 4 has "View Full Architecture Framework" link to /architecture
- [ ] How We Work: Sticky scroll layout works (left image stays fixed while right content scrolls)
- [ ] How We Work: 4 process steps render with numbered icons
- [ ] Data Platforms: 6 pillar cards in 3x2 grid
- [ ] Data Platforms: Diagram placeholder visible
- [ ] About: Mission, differentiators, values, team placeholders, IONOS partner mention
- [ ] All pages have consistent header/footer
- [ ] All pages have scroll-reveal animations
- [ ] All pages responsive (375px, 768px, 1440px)
- [ ] Cross-links between pages work
- [ ] No build errors, no console errors

**Verify method:** Navigate to each page, take screenshots at multiple viewports, test interactive elements (expand/collapse, sticky scroll), verify links.

---

## Phase 4: Product Pages

### 4.1 Plan
**Goal:** Build Tachyon and Smart Lakehouse on IONOS product pages.

**Dependencies:** Phase 1 (layout, UI), Phase 3 (ServiceCard, DiagramPlaceholder, FeatureList)

**Files to create:**

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/pages/tachyon.astro` | Product hero + problem + how it works (diagram) + capabilities grid + use cases + architecture diagram + deployment options + CTA |
| Create | `src/pages/smart-lakehouse-ionos.astro` | Hero + partnership positioning + what it delivers + benefits grid + use cases + cost comparison narrative + calculator placeholder + CTA |

### 4.2 Write
Implement both product pages using existing components. All content from master spec.

### 4.3 Verify
**Acceptance criteria:**
- [ ] Tachyon page: product definition, capabilities in grid, use cases, architecture diagram placeholder, "Book a Tachyon walkthrough" CTA
- [ ] IONOS page: partnership messaging ("technology provider, not reseller"), benefits, cost narrative
- [ ] Both pages accessible from navigation and cross-links
- [ ] Both pages responsive
- [ ] Scroll reveals work
- [ ] No build errors

**Verify method:** Navigate to each product page, screenshot at desktop and mobile, verify all sections present.

---

## Phase 5: Products & Pricing + Trust & Security

### 5.1 Plan
**Goal:** Build pricing page with structured packages and FAQ, and trust/security page.

**Dependencies:** Phase 1 (layout, UI), Phase 3 (FeatureList)

**Files to create:**

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/pages/products-pricing.astro` | Hero + pricing philosophy + engagement model flow + 6 pricing cards + what you get + FAQ accordion + CTA |
| Create | `src/pages/trust-security.astro` | Hero + Secure SDLC + privacy + governance + AI risk + compliance badges + CTA |
| Create | `src/components/content/PricingCard.astro` | Glass card: tier name, description, includes list, duration, price band, CTA button |
| Create | `src/components/interactive/Accordion.astro` | Container that manages open/closed state of children |
| Create | `src/components/interactive/AccordionItem.astro` | Question + expandable answer. + icon when closed, x when open. Smooth height transition. Uses `<details>`/`<summary>` |
| Create | `src/content/data/pricing.ts` | 6 pricing packages: AI Maturity Scan, Full AI Readiness Review, AI Strategy & Roadmap, Smart Data Platform, AI-Enabled Products, AI Ops Retainer. Each with: name, description, includes[], duration, priceRange, cta |
| Create | `src/content/data/faq.ts` | FAQ items for Products & Pricing page. Procurement friction removal focus |

### 5.2 Write
Implement both pages and new components.

### 5.3 Verify
**Acceptance criteria:**
- [ ] Pricing page: 6 pricing cards with correct price bands from spec
- [ ] Pricing page: Engagement model flow visible (Diagnostic → Strategy → Build → Operate)
- [ ] Pricing page: FAQ accordion toggles open/close with animation
- [ ] Pricing page: Only one FAQ item open at a time (optional, can allow multiple)
- [ ] Trust & Security: All sections present (SDLC, privacy, governance, AI risk, compliance)
- [ ] Both pages responsive
- [ ] CTA buttons link correctly
- [ ] No build errors

**Verify method:** Navigate to each page, test accordion interactions, verify pricing data matches spec, screenshot at multiple viewports.

---

## Phase 6: Interactive Features (Assessment + Contact)

### 6.1 Plan
**Goal:** Build the AI Readiness Assessment (multi-step form + scoring + radar chart results) and Contact form with server-side API endpoints.

**Dependencies:** Phase 1 (layout, UI). This is the most complex phase.

**Files to create:**

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/content/data/assessment-questions.ts` | 5 pillars (Leadership, Data Maturity, Platform Architecture, Governance & Risk, Operational Readiness) × 3-5 questions each. Each question: text + options with numeric values |
| Create | `src/lib/validation.ts` | Zod schemas: contactSchema (name, email, company, role?, message, consent), assessmentSchema (name, email, company, role, consent, answers record) |
| Create | `src/lib/assessment-scoring.ts` | calculateScores(): averages per pillar → 0-100, overall composite, band (emerging/developing/established/advanced/leading), 3-5 recommendations based on weakest pillars |
| Create | `src/lib/email.ts` | Nodemailer wrapper: createTransport from env vars, sendEmail(to, subject, body) |
| Create | `src/pages/ai-readiness-assessment.astro` | Page shell with AssessmentForm React island |
| Create | `src/components/forms/AssessmentForm.tsx` | Multi-step wizard (client:visible). Steps: Intro → 5 pillar question sets → Data capture (name/email/company/role/consent) → Submit. ProgressIndicator at top. Zod validation per step. POST to /api/ai-readiness. On success: display results inline or navigate to results |
| Create | `src/components/forms/FormField.tsx` | Reusable: input/radio/select with label, error message, required indicator. Dark themed |
| Create | `src/components/forms/FormStep.tsx` | Step container with enter/exit transitions |
| Create | `src/components/forms/ConsentCheckbox.tsx` | GDPR checkbox with privacy policy link |
| Create | `src/components/forms/ProgressIndicator.tsx` | Step progress bar: "Step 3 of 7" with visual indicator |
| Create | `src/pages/ai-readiness-results.astro` | Results page shell with ResultsDashboard React island. Reads results from URL state or props |
| Create | `src/components/charts/RadarChart.tsx` | Recharts ResponsiveContainer + Radar + PolarGrid. 5 axes. Dark theme: grid #333, labels #fff, fill accent at 30% opacity. client:visible |
| Create | `src/components/charts/ResultsDashboard.tsx` | Score band display + RadarChart + pillar breakdown + 3-5 recommendation cards + "Book a call" CTA. client:visible |
| Create | `src/components/charts/ScoreBand.tsx` | Visual score indicator with band label and color |
| Create | `src/pages/contact.astro` | Two-column: ContactForm left, contact info right (email, social, response time, booking placeholder) |
| Create | `src/components/forms/ContactForm.tsx` | Form (client:visible): name, email, company, role?, message, consent. Zod validation. POST to /api/contact. Success/error states. Loading spinner |
| Create | `src/pages/api/contact.ts` | POST endpoint: parse JSON, Zod validate, send email notification, return success/error. prerender = false |
| Create | `src/pages/api/ai-readiness.ts` | POST endpoint: parse JSON, Zod validate, calculate scores, send email notification to team, return scores. prerender = false |
| Create | `.env.example` | SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SITE_URL |

### 6.2 Write
Implement all forms, charts, API endpoints, and scoring logic.

### 6.3 Verify
**Acceptance criteria:**
- [ ] Assessment page loads with intro step
- [ ] Progress indicator shows current step
- [ ] Can navigate through all 5 pillar question steps
- [ ] Questions render as radio groups with options
- [ ] Data capture step collects name, email, company, role, consent
- [ ] Validation errors show on empty/invalid fields
- [ ] Submit sends POST to /api/ai-readiness
- [ ] API returns calculated scores with band and recommendations
- [ ] Results page shows radar chart with 5 axes
- [ ] Score band renders with correct interpretation
- [ ] 3-5 recommendations display based on weakest pillars
- [ ] "Book a call" CTA visible on results
- [ ] Contact page: form renders with all fields
- [ ] Contact form validates and submits to /api/contact
- [ ] API returns success response
- [ ] Success message shown after submit
- [ ] Both forms work on mobile
- [ ] Consent checkboxes required before submit
- [ ] `npm run build` succeeds (hybrid mode with API routes)
- [ ] No console errors

**Verify method:** Run dev server, fill out assessment form end-to-end, verify API response in network tab, check radar chart renders, test contact form submission, test validation errors, screenshot at mobile and desktop.

---

## Phase 7: Insights/Blog

### 7.1 Plan
**Goal:** Set up MDX-based content system with article listing, individual article pages, and search.

**Dependencies:** Phase 1 (layout, UI)

**Files to create:**

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/content/config.ts` | Astro content collection: insights schema (title, excerpt, author, publishDate, category, tags[], seoTitle, seoDescription, ogImage?, draft, relatedArticles?) |
| Create | `src/pages/insights/index.astro` | Fetch all published articles, render ArticleGrid + TagFilter + SearchBar |
| Create | `src/pages/insights/[...slug].astro` | getStaticPaths from collection, render article with ArticleLayout |
| Create | `src/layouts/ArticleLayout.astro` | Article header (title, author, date, category badge, reading time) + narrow content container + InlineCTA + RelatedArticles + footer CTA + Article structured data |
| Create | `src/components/insights/ArticleCard.astro` | Preview card: title, excerpt, date, category badge, "Read more" link |
| Create | `src/components/insights/ArticleGrid.astro` | Responsive grid of ArticleCards |
| Create | `src/components/insights/TagFilter.astro` | Horizontal tag/category filter pills. CSS-driven show/hide with JS enhancement |
| Create | `src/components/insights/RelatedArticles.astro` | Related articles row at bottom of article |
| Create | `src/components/insights/InlineCTA.astro` | CTA block for embedding within article body |
| Create | `src/components/insights/SearchBar.tsx` | Client-side search (client:idle) filtering articles by title/excerpt/tags |
| Create | `src/content/insights/why-data-fragmentation-is-the-real-barrier-to-ai.mdx` | Seed article 1 |
| Create | `src/content/insights/enterprise-ai-readiness-checklist.mdx` | Seed article 2 |
| Create | `src/content/insights/building-cost-efficient-data-platforms.mdx` | Seed article 3 |

### 7.2 Write
Implement content collection, pages, components, and seed articles.

### 7.3 Verify
**Acceptance criteria:**
- [ ] `/insights` page shows grid of 3 seed articles
- [ ] Tag filter pills render for all categories
- [ ] Clicking a tag filters visible articles
- [ ] Search bar filters articles by title/excerpt
- [ ] Clicking an article card navigates to `/insights/[slug]`
- [ ] Article page renders: title, author, date, category, reading time, body content, inline CTA, related articles
- [ ] Article has correct structured data (schema.org Article)
- [ ] OG meta tags set from frontmatter
- [ ] Article layout is narrow/readable (max-width ~680-900px)
- [ ] Mobile responsive
- [ ] No build errors

**Verify method:** Navigate to /insights, test filter and search, click through to each article, inspect meta tags, screenshot at multiple viewports.

---

## Phase 8: Remaining Pages

### 8.1 Plan
**Goal:** Build Architecture deep-dive, Campaign landing template, legal pages, and 404.

**Dependencies:** Phase 1 (layout, UI), Phase 3 (ExpandableDetail, DiagramPlaceholder), Phase 5 (Accordion)

**Files to create:**

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/pages/architecture.astro` | Not in nav. Sections: philosophy, reference architecture (5-layer diagram placeholder), SDLC integration, security & compliance, delivery governance, CTA. Uses ExpandableDetail for progressive disclosure |
| Create | `src/layouts/CampaignLayout.astro` | Minimal header (logo only, no nav), slot, minimal footer (legal links only). UTM capture from Astro.url.searchParams |
| Create | `src/pages/campaign/[...slug].astro` | Dynamic campaign pages. Hero + message + proof points + FAQ + CTA |
| Create | `src/pages/privacy.astro` | Privacy policy content page |
| Create | `src/pages/terms.astro` | Terms of service content page |
| Create | `src/pages/404.astro` | Dark themed "Lost in the data?" with link home |

### 8.2 Write
Implement all remaining pages.

### 8.3 Verify
**Acceptance criteria:**
- [ ] Architecture page accessible via link from What We Do pillar 4 (not in main nav)
- [ ] Architecture: 5-layer reference architecture diagram placeholder visible
- [ ] Architecture: expandable details work for technical content
- [ ] Campaign layout: minimal header (logo only), no navigation
- [ ] Privacy and Terms pages render with content
- [ ] 404 page shows on invalid URLs
- [ ] Footer links to privacy and terms work from all pages
- [ ] No build errors

**Verify method:** Navigate to each page, verify layout differences (campaign vs standard), test 404 by visiting invalid URL, verify architecture is not in nav but accessible via direct link.

---

## Phase 9: Polish

### 9.1 Plan
**Goal:** Final quality pass — animations, accessibility, performance, SEO, cross-browser, cookie consent.

**Dependencies:** All previous phases complete.

**Tasks:**

| Task | Details |
|------|---------|
| Scroll reveals | Wrap all remaining unwrapped sections in ScrollReveal. Ensure consistent timing (600ms ease-out, staggered delays) |
| View Transitions | Verify `<ViewTransitions />` in Layout.astro provides smooth page-to-page fades |
| Cookie Consent | Create `src/components/global/CookieConsent.astro`: bottom banner, Accept/Manage buttons, store preference in localStorage, block analytics until consent |
| Accessibility | Heading hierarchy (one H1/page), ARIA labels on icons/buttons, alt text on images, color contrast (4.5:1 body, 3:1 large), focus-visible on all focusable elements, skip link works, form labels + error messages |
| Reduced motion | Verify all animations stop with prefers-reduced-motion: reduce. Smoke becomes static. Marquees stop. Scroll reveals show immediately |
| Performance | Use Astro `<Image>` everywhere, lazy-load below-fold images, priority-load hero, preload critical fonts (Inter 400/600/700), verify React islands use client:visible/idle (not client:load except SmokeCanvas) |
| SEO | Unique title + description per page, OG + Twitter meta per page, structured data (Organization on home, Article on insights, FAQ on pricing, BreadcrumbList on all), sitemap generates correctly, robots.txt, canonical URLs |
| Cross-browser | Test Chrome, Safari, Edge: glass morphism (backdrop-filter), smooth scroll, canvas smoke, font rendering, form inputs |
| Lighthouse | Run on Home, Assessment, Insights. Target 90+ on Performance, Accessibility, Best Practices, SEO |

### 9.2 Write
Implement cookie consent, add ScrollReveal wrappers, fix any accessibility/performance issues found.

### 9.3 Verify
**Acceptance criteria:**
- [ ] Lighthouse Performance ≥ 90 on Home
- [ ] Lighthouse Accessibility ≥ 90 on Home
- [ ] Lighthouse Best Practices ≥ 90 on Home
- [ ] Lighthouse SEO ≥ 90 on Home
- [ ] Cookie consent banner appears on first visit
- [ ] Accept/dismiss persists across page loads
- [ ] Tab through entire home page — logical focus order, no focus traps
- [ ] All images have alt text
- [ ] One H1 per page (check all pages)
- [ ] prefers-reduced-motion disables all animations
- [ ] All pages render correctly in Safari (glass morphism, fonts)
- [ ] Sitemap.xml generates with all pages
- [ ] robots.txt accessible at /robots.txt
- [ ] No console errors on any page
- [ ] Build size reasonable (check dist/ output)

**Verify method:** Run Lighthouse via Playwright or CLI, test accessibility with devtools, test reduced motion via CSS override, check Safari rendering, inspect network tab for unnecessary JS, validate sitemap.xml content.

---

## Summary

| Phase | Description | Depends On | Key Deliverables |
|-------|-------------|------------|------------------|
| 1 | Foundation | — | Design system, layout shell, nav, footer, UI primitives |
| 2 | Home Page | 1 | All 8 home sections, smoke animation, marquee, scroll reveals |
| 3 | Core Content Pages | 1, 2 | What We Do, How We Work, Data Platforms, About |
| 4 | Product Pages | 1, 3 | Tachyon, Smart Lakehouse on IONOS |
| 5 | Pricing + Trust | 1, 3 | Products & Pricing (with FAQ), Trust & Security |
| 6 | Interactive Features | 1 | AI Readiness Assessment + results + Contact form + API endpoints |
| 7 | Insights/Blog | 1 | MDX articles, listing, search, 3 seed articles |
| 8 | Remaining Pages | 1, 3, 5 | Architecture, Campaign template, Privacy, Terms, 404 |
| 9 | Polish | All | Animations, a11y, performance, SEO, cookie consent, cross-browser |

**Parallel opportunities:** Phases 3, 4, 5, 6, 7 can all begin after Phase 1 completes (they share the foundation but don't depend on each other). Phase 8 needs some Phase 3+5 components. Phase 9 requires everything else.
