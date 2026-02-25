// ── Insights Module — Utilities ──

// ── Date Formatting ──

export function formatInsightDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatInsightDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

// ── Category Slug ──

/** Lowercases and hyphenates a category name for CSS class usage */
export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

// ── CTA Map ──

export interface CtaConfig {
  heading: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export const ctaMap: Record<string, CtaConfig> = {
  'ai-readiness': {
    heading: 'Evaluate Your AI Readiness',
    description:
      'Our structured assessment benchmarks your organisation across five pillars and provides a clear roadmap.',
    primaryLabel: 'Take the Assessment',
    primaryHref: '/ai-readiness-assessment',
    secondaryLabel: 'Discuss Your Results',
    secondaryHref: '/contact?topic=ai-readiness',
  },
  'platform-discussion': {
    heading: 'Explore Platform Options',
    description:
      'Discuss how a purpose-built data platform can reduce cost, improve governance, and accelerate your AI initiatives.',
    primaryLabel: 'Discuss Platforms',
    primaryHref: '/contact?topic=platform',
    secondaryLabel: 'View Our Platforms',
    secondaryHref: '/our-platforms',
  },
  'architecture-review': {
    heading: 'Review Your Architecture',
    description:
      'Our architects can assess your current data infrastructure and identify optimisation opportunities.',
    primaryLabel: 'Request a Review',
    primaryHref: '/contact?topic=architecture',
    secondaryLabel: 'How We Work',
    secondaryHref: '/what-we-do',
  },
  'security-review': {
    heading: 'Strengthen Your Data Governance',
    description:
      'Understand how your data security and governance posture compares to enterprise best practice.',
    primaryLabel: 'Explore Trust & Security',
    primaryHref: '/trust-security',
    secondaryLabel: 'Get in Touch',
    secondaryHref: '/contact?topic=security',
  },
};

/** Resolve CTA config with fallback to ai-readiness */
export function getCtaConfig(ctaType: string): CtaConfig {
  return ctaMap[ctaType] ?? ctaMap['ai-readiness'];
}

// ── Schema.org Article JSON-LD ──

export interface ArticleSchemaInput {
  title: string;
  summary: string;
  publishDate: string;
  slug: string;
  ogImage?: string;
  siteUrl?: string;
}

export function buildArticleSchema(input: ArticleSchemaInput): Record<string, unknown> {
  const siteUrl = input.siteUrl ?? 'https://1digit.io';
  const url = `${siteUrl}/insights/${input.slug}`;
  const image = input.ogImage
    ? `${siteUrl}${input.ogImage}`
    : `${siteUrl}/images/og/insights-default.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.summary,
    datePublished: input.publishDate,
    url,
    image,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Organization',
      name: '1Digit',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: '1Digit',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` },
    },
  };
}

// ── Canonical URL ──

export function buildInsightCanonical(slug: string, siteUrl = 'https://1digit.io'): string {
  return `${siteUrl}/insights/${slug}`;
}
