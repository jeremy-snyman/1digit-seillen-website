// ── Insights Module — Types & Data Layer ──

import articlesData from './articles.json';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLES_PATH = join(process.cwd(), 'src/content/data/insights/articles.json');

// ── Body Block Types (discriminated union) ──

export interface BlockHeading {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export type BodyBlock =
  | { type: 'paragraph'; content: string; blockHeading?: BlockHeading }
  | { type: 'section'; heading: string; content: string; blockHeading?: BlockHeading }
  | { type: 'bulletList'; items: string[]; blockHeading?: BlockHeading }
  | { type: 'numberedList'; items: string[]; blockHeading?: BlockHeading }
  | { type: 'quote'; content: string; attribution?: string; blockHeading?: BlockHeading }
  | { type: 'diagram'; diagramType: string; caption: string; data?: Record<string, unknown>; blockHeading?: BlockHeading }
  | { type: 'chart'; chartType: string; caption: string; data: Record<string, unknown>[]; blockHeading?: BlockHeading }
  | { type: 'callout'; content: string; blockHeading?: BlockHeading };

// ── Article Interface ──

/**
 * Insights article SEO conventions:
 * - seoTitle: ≤60 chars, primary keyword first, no brand suffix ("| 1Digit" added by SEOHead)
 * - seoDescription: 150–160 chars, lead with the claim, active voice
 * - ogImage: /images/og/insights/<slug>.png (1200×630)
 * - faqs / howToSteps: optional — populate when article contains a natural FAQ block or a How-To list
 */
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
  /** Gate this article behind the lead-capture form (default false). */
  requiresLeadGate?: boolean;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  coverImage: string | null;
  bodyBlocks: BodyBlock[];
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  faqs?: { question: string; answer: string }[];
  howToSteps?: { name: string; text: string }[];
  author?: {
    name: string;
    role?: string;
    bio?: string;
    linkedinUrl?: string;
    avatarUrl?: string;
  };
  citations?: { name: string; url?: string; publisher?: string }[];
  mentions?: { name: string; url?: string; type?: 'Organization' | 'Thing' | 'Product' }[];
}

// ── Serialisable metadata (no bodyBlocks — safe for client props) ──

export type InsightMeta = Omit<InsightArticle, 'bodyBlocks'>;

// ── Data Access (cached — for public/static pages) ──

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

// ── Fresh Data Access (reads from disk — for admin pages) ──

function readFresh(): InsightArticle[] {
  const raw = readFileSync(ARTICLES_PATH, 'utf-8');
  return JSON.parse(raw) as InsightArticle[];
}

/** All articles fresh from disk, sorted newest-first */
export function getAllInsightsFresh(): InsightArticle[] {
  return readFresh().sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}

/** Single article by slug, fresh from disk */
export function getInsightBySlugFresh(slug: string): InsightArticle | undefined {
  return readFresh().find((a) => a.slug === slug);
}

/** Published articles only, fresh from disk, newest-first */
export function getPublishedInsightsFresh(): InsightArticle[] {
  return getAllInsightsFresh().filter((a) => a.status === 'published');
}

/** The pinned article fresh from disk — fallback to latest published */
export function getPinnedInsightFresh(): InsightArticle | undefined {
  const published = getPublishedInsightsFresh();
  return published.find((a) => a.isPinned) ?? published[0];
}

/** Distinct categories from published articles, fresh from disk */
export function getAllCategoriesFresh(): string[] {
  const cats = new Set(getPublishedInsightsFresh().map((a) => a.category));
  return [...cats].sort();
}

/** Distinct tags from published articles, fresh from disk */
export function getAllTagsFresh(): string[] {
  const tags = new Set(getPublishedInsightsFresh().flatMap((a) => a.tags));
  return [...tags].sort();
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
