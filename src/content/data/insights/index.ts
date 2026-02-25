// ── Insights Module — Types & Data Layer ──

import articlesData from './articles.json';

// ── Body Block Types (discriminated union) ──

export type BodyBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'section'; heading: string; content: string }
  | { type: 'bulletList'; items: string[] }
  | { type: 'numberedList'; items: string[] }
  | { type: 'quote'; content: string; attribution?: string }
  | { type: 'diagram'; diagramType: string; caption: string; data?: Record<string, unknown> }
  | { type: 'chart'; chartType: string; caption: string; data: Record<string, unknown>[] }
  | { type: 'callout'; content: string };

// ── Article Interface ──

export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  thesis: string;
  summary: string;
  researchType: string;
  category: string;
  tags: string[];
  campaignTag: string | null;
  publishDate: string;
  readTimeMinutes: number;
  ctaType: 'ai-readiness' | 'platform-discussion' | 'architecture-review' | 'security-review';
  isPinned: boolean;
  isCampaignFeatured: boolean;
  primaryConversionTarget: string;
  external: boolean;
  externalUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  coverImage: string | null;
  bodyBlocks: BodyBlock[];
  status: 'draft' | 'scheduled' | 'published' | 'archived';
}

// ── Serialisable metadata (no bodyBlocks — safe for client props) ──

export type InsightMeta = Omit<InsightArticle, 'bodyBlocks'>;

// ── Data Access ──

const articles: InsightArticle[] = articlesData as InsightArticle[];

/** All articles, sorted newest-first */
export function getAllInsights(): InsightArticle[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}

/** Published articles only, newest-first */
export function getPublishedInsights(): InsightArticle[] {
  return getAllInsights().filter((a) => a.status === 'published');
}

/** Single article by slug */
export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

/** The pinned article (at most one) — fallback to latest published */
export function getPinnedInsight(): InsightArticle | undefined {
  const published = getPublishedInsights();
  return published.find((a) => a.isPinned) ?? published[0];
}

/** Campaign-featured articles */
export function getCampaignFeaturedInsights(): InsightArticle[] {
  return getPublishedInsights().filter((a) => a.isCampaignFeatured);
}

/** Articles in a given category */
export function getInsightsByCategory(category: string): InsightArticle[] {
  return getPublishedInsights().filter((a) => a.category === category);
}

/** Distinct categories from published articles */
export function getAllCategories(): string[] {
  const cats = new Set(getPublishedInsights().map((a) => a.category));
  return [...cats].sort();
}

/** Distinct tags from published articles */
export function getAllTags(): string[] {
  const tags = new Set(getPublishedInsights().flatMap((a) => a.tags));
  return [...tags].sort();
}

/** Strip bodyBlocks for client serialisation */
export function toMeta(article: InsightArticle): InsightMeta {
  const { bodyBlocks: _, ...meta } = article;
  return meta;
}
