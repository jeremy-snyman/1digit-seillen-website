#!/usr/bin/env node
/**
 * IndexNow submission script.
 * Usage:
 *   node scripts/submit-urls.mjs https://1digit.co.uk/insights/my-article
 *   node scripts/submit-urls.mjs --sitemap   (submits all URLs from sitemap)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const SITE = 'https://1digit.co.uk';
const KEY_FILE = resolve(process.cwd(), 'public/47e1f4cc2799a8681075cb759e1d1fe7.txt');
const KEY = process.env.INDEXNOW_KEY || readFileSync(KEY_FILE, 'utf-8').trim();

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap-index.xml`);
  const xml = await res.text();
  const sitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const urls = [];
  for (const sitemapUrl of sitemapUrls) {
    const r = await fetch(sitemapUrl);
    const x = await r.text();
    urls.push(...[...x.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]));
  }
  return urls;
}

async function submitUrls(urls) {
  const body = {
    host: new URL(SITE).hostname,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  return res.status;
}

const args = process.argv.slice(2);
let urls = [];

if (args[0] === '--sitemap') {
  console.log('Fetching URLs from sitemap...');
  urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs`);
} else if (args.length > 0) {
  urls = args;
} else {
  console.error('Usage: node scripts/submit-urls.mjs <url> [url2 ...] | --sitemap');
  process.exit(1);
}

console.log('Submitting to IndexNow...');
const status = await submitUrls(urls);

if (status === 200 || status === 202) {
  console.log(`✓ IndexNow accepted (${status}): ${urls.length} URL(s)`);
} else if (status === 422) {
  console.error(`✗ IndexNow rejected URLs (422) — check they are on ${SITE}`);
  process.exit(1);
} else if (status === 429) {
  console.error('✗ IndexNow rate limit hit (429) — try again later');
  process.exit(1);
} else {
  console.error(`✗ Unexpected status ${status}`);
  process.exit(1);
}
