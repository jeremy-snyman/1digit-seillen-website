import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { InsightArticle } from '@content/data/insights/index';

export const prerender = false;

const ARTICLES_PATH = join(process.cwd(), 'src/content/data/insights/articles.json');

function readArticles(): InsightArticle[] {
  const raw = readFileSync(ARTICLES_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeArticles(articles: InsightArticle[]): void {
  writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2) + '\n', 'utf-8');
}

/** GET — return all articles */
export const GET: APIRoute = async () => {
  try {
    const articles = readArticles();
    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Admin API] Read error:', error);
    return new Response(JSON.stringify({ error: 'Failed to read articles' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/** POST — create or update an article */
export const POST: APIRoute = async ({ request }) => {
  try {
    const article: InsightArticle = await request.json();

    if (!article.slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const articles = readArticles();
    const existingIndex = articles.findIndex((a) => a.slug === article.slug);

    if (existingIndex >= 0) {
      articles[existingIndex] = article;
    } else {
      articles.push(article);
    }

    writeArticles(articles);

    return new Response(JSON.stringify({ success: true, article }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Admin API] Save error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save article' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/** DELETE — remove an article by slug (passed as ?slug=xxx) */
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const articles = readArticles();
    const filtered = articles.filter((a) => a.slug !== slug);

    if (filtered.length === articles.length) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    writeArticles(filtered);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Admin API] Delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete article' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
