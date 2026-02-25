import { useState, useEffect, useCallback } from 'react';
import type { InsightArticle, BodyBlock } from '@content/data/insights/index';
import BlockEditor from './BlockEditor';

interface Props {
  initial?: InsightArticle;
  isNew?: boolean;
}

const researchTypes = [
  'Strategic Brief',
  'Technical Analysis',
  'Framework Analysis',
  'Market Report',
  'Case Study',
];

const ctaTypes = [
  { value: 'ai-readiness', label: 'AI Readiness Assessment' },
  { value: 'platform-discussion', label: 'Platform Discussion' },
  { value: 'architecture-review', label: 'Architecture Review' },
  { value: 'security-review', label: 'Security Review' },
];

const statusOptions = ['draft', 'scheduled', 'published', 'archived'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function wordCount(blocks: BodyBlock[]): number {
  let count = 0;
  for (const block of blocks) {
    if ('content' in block && typeof block.content === 'string') {
      count += block.content.split(/\s+/).length;
    }
    if ('items' in block && Array.isArray(block.items)) {
      for (const item of block.items) {
        count += item.split(/\s+/).length;
      }
    }
    if ('heading' in block && typeof block.heading === 'string') {
      count += block.heading.split(/\s+/).length;
    }
  }
  return count;
}

function createEmptyArticle(): InsightArticle {
  return {
    id: `insight-${Date.now()}`,
    slug: '',
    title: '',
    thesis: '',
    summary: '',
    researchType: 'Strategic Brief',
    category: '',
    tags: [],
    campaignTag: null,
    publishDate: new Date().toISOString().split('T')[0],
    readTimeMinutes: 0,
    ctaType: 'ai-readiness',
    isPinned: false,
    isCampaignFeatured: false,
    primaryConversionTarget: '/ai-readiness-assessment',
    external: false,
    externalUrl: null,
    seoTitle: '',
    seoDescription: '',
    ogImage: '',
    bodyBlocks: [],
    status: 'draft',
  };
}

export default function ArticleEditor({ initial, isNew }: Props) {
  const [article, setArticle] = useState<InsightArticle>(
    initial || createEmptyArticle(),
  );
  const [tagsInput, setTagsInput] = useState(article.tags.join(', '));
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // localStorage auto-save
  const storageKey = `admin_draft_${article.slug || 'new'}`;

  useEffect(() => {
    if (isNew) {
      const saved = localStorage.getItem('admin_draft_new');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setArticle(parsed);
          setTagsInput(parsed.tags?.join(', ') || '');
        } catch { /* ignore */ }
      }
    }
  }, [isNew]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(article));
    }, 1000);
    return () => clearTimeout(timer);
  }, [article, storageKey]);

  // Auto-calc read time
  useEffect(() => {
    const words = wordCount(article.bodyBlocks);
    const readTime = Math.max(1, Math.ceil(words / 200));
    if (readTime !== article.readTimeMinutes) {
      setArticle((prev) => ({ ...prev, readTimeMinutes: readTime }));
    }
  }, [article.bodyBlocks]);

  function update(field: string, value: unknown) {
    setArticle((prev) => ({ ...prev, [field]: value }));
  }

  function updateTags(input: string) {
    setTagsInput(input);
    const tags = input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    update('tags', tags);
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!article.title) errs.push('Title is required');
    if (!article.thesis) errs.push('Thesis is required');
    if (!article.category) errs.push('Category is required');
    if (!article.summary) errs.push('Summary is required');
    if (!article.slug) errs.push('Slug is required');
    if (!article.ctaType) errs.push('CTA type is required');
    return errs;
  }

  async function copyToClipboard() {
    const errs = validate();
    if (errs.length > 0 && article.status === 'published') {
      setErrors(errs);
      return;
    }
    setErrors([]);
    const json = JSON.stringify(article, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadJson() {
    const errs = validate();
    if (errs.length > 0 && article.status === 'published') {
      setErrors(errs);
      return;
    }
    setErrors([]);
    const blob = new Blob([JSON.stringify(article, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug || 'article'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputClass =
    'w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20 transition-colors';
  const labelClass = 'block text-body-sm font-medium text-content-secondary mb-1';

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-xl font-semibold text-content">
          {isNew ? 'New Article' : 'Edit Article'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-button border border-surface-border text-body-sm text-content-secondary hover:border-content/20 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button
            onClick={downloadJson}
            className="px-4 py-2 rounded-button bg-glow-steel/20 text-content text-body-sm font-medium border border-surface-border hover:border-content/20 transition-colors"
          >
            Download JSON
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-3 rounded-card bg-red-500/10 border border-red-500/20">
          <ul className="text-body-sm text-red-300 space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Core fields */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-heading-md font-semibold text-content">Core</h2>

          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => {
                update('title', e.target.value);
                if (isNew || !initial) {
                  update('slug', slugify(e.target.value));
                }
              }}
              className={inputClass}
              placeholder="Article title..."
            />
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              value={article.slug}
              onChange={(e) => update('slug', e.target.value)}
              className={inputClass}
              placeholder="article-slug"
            />
          </div>

          <div>
            <label className={labelClass}>Thesis *</label>
            <textarea
              value={article.thesis}
              onChange={(e) => update('thesis', e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="The core argument or finding..."
            />
          </div>

          <div>
            <label className={labelClass}>Summary *</label>
            <textarea
              value={article.summary}
              onChange={(e) => update('summary', e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Brief description for previews..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Research Type</label>
              <select
                value={article.researchType}
                onChange={(e) => update('researchType', e.target.value)}
                className={inputClass}
              >
                {researchTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <input
                type="text"
                value={article.category}
                onChange={(e) => update('category', e.target.value)}
                className={inputClass}
                placeholder="Data Strategy, AI Readiness, etc."
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => updateTags(e.target.value)}
              className={inputClass}
              placeholder="AI readiness, data platforms, governance"
            />
          </div>
        </div>

        {/* Publishing */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-heading-md font-semibold text-content">Publishing</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={article.status}
                onChange={(e) => update('status', e.target.value)}
                className={inputClass}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Publish Date</label>
              <input
                type="date"
                value={article.publishDate}
                onChange={(e) => update('publishDate', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CTA Type *</label>
              <select
                value={article.ctaType}
                onChange={(e) => update('ctaType', e.target.value)}
                className={inputClass}
              >
                {ctaTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Read Time (auto)</label>
              <input
                type="number"
                value={article.readTimeMinutes}
                onChange={(e) => update('readTimeMinutes', parseInt(e.target.value) || 0)}
                className={inputClass}
                min="1"
              />
            </div>
            <div>
              <label className={labelClass}>Campaign Tag</label>
              <input
                type="text"
                value={article.campaignTag || ''}
                onChange={(e) => update('campaignTag', e.target.value || null)}
                className={inputClass}
                placeholder="Optional campaign tag"
              />
            </div>
            <div>
              <label className={labelClass}>Primary Conversion</label>
              <input
                type="text"
                value={article.primaryConversionTarget}
                onChange={(e) => update('primaryConversionTarget', e.target.value)}
                className={inputClass}
                placeholder="/ai-readiness-assessment"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={article.isPinned}
                onChange={(e) => update('isPinned', e.target.checked)}
                className="rounded"
              />
              <span className="text-body-sm text-content-secondary">Pinned</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={article.isCampaignFeatured}
                onChange={(e) => update('isCampaignFeatured', e.target.checked)}
                className="rounded"
              />
              <span className="text-body-sm text-content-secondary">Campaign Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={article.external}
                onChange={(e) => update('external', e.target.checked)}
                className="rounded"
              />
              <span className="text-body-sm text-content-secondary">External</span>
            </label>
          </div>

          {article.external && (
            <div>
              <label className={labelClass}>External URL</label>
              <input
                type="url"
                value={article.externalUrl || ''}
                onChange={(e) => update('externalUrl', e.target.value || null)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-heading-md font-semibold text-content">SEO</h2>

          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              type="text"
              value={article.seoTitle}
              onChange={(e) => update('seoTitle', e.target.value)}
              className={inputClass}
              placeholder="Override page title for search engines..."
            />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea
              value={article.seoDescription}
              onChange={(e) => update('seoDescription', e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Meta description for search results..."
            />
          </div>
          <div>
            <label className={labelClass}>OG Image Path</label>
            <input
              type="text"
              value={article.ogImage}
              onChange={(e) => update('ogImage', e.target.value)}
              className={inputClass}
              placeholder="/images/insights/article-name.png"
            />
          </div>
        </div>

        {/* Body Blocks */}
        <BlockEditor
          blocks={article.bodyBlocks}
          onChange={(blocks) => update('bodyBlocks', blocks)}
        />
      </div>
    </div>
  );
}
