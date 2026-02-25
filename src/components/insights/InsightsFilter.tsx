import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { InsightMeta } from '@content/data/insights/index';

interface Props {
  articles: InsightMeta[];
  categories: string[];
  tags: string[];
}

function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function catSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function ArticleCardReact({ article }: { article: InsightMeta }) {
  const slug = catSlug(article.category);
  const badgeClass = `cat-badge-${slug}`;
  const gradientClass = `cat-gradient-${slug}`;

  return (
    <a href={`/insights/${article.slug}`} className="group block h-full">
      <article className="glass-card-hover h-full flex flex-col overflow-hidden relative">
        {/* Gradient hover overlay */}
        <div
          className={`${gradientClass} absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[16px] z-0`}
          aria-hidden="true"
        />

        {/* Content area */}
        <div className="relative z-10 p-6 flex-1 flex flex-col">
          {/* Category pill + date */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`${badgeClass} px-2.5 py-1 rounded-full text-xs font-medium`}>
              {article.category}
            </span>
            <span className="text-[0.875rem] leading-[1.5] text-content-muted">
              {formatDateShort(article.publishDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[1.25rem] leading-[1.3] font-semibold mb-3 text-content group-hover:text-glow-blue transition-colors">
            {article.title}
          </h3>

          {/* Thesis excerpt */}
          <p className="text-[0.875rem] leading-[1.5] text-content-secondary flex-1 mb-5 line-clamp-3">
            {article.thesis}
          </p>

          {/* Read time + arrow */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgb(var(--color-surface-border) / var(--alpha-surface-border))' }}>
            <span className="text-[0.875rem] leading-[1.5] text-content-muted">
              {article.readTimeMinutes} min read
            </span>
            <span className="text-glow-blue text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
              Read <span className="text-xs">→</span>
            </span>
          </div>
        </div>

        {/* Image area */}
        <div className="mx-4 mb-4 h-48 rounded-xl overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className={`${gradientClass} w-full h-full flex items-center justify-center`} style={{ backgroundColor: 'rgb(var(--color-surface-elevated))' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-surface-overlay) / 0.6)' }}>
                <svg className="w-6 h-6 text-content-muted opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}

export default function InsightsFilter({ articles, categories, tags }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const fuseRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') ?? '';
    const tagStr = params.get('tags') ?? '';
    const q = params.get('q') ?? '';

    if (cat) setSelectedCategory(cat);
    if (tagStr) setSelectedTags(tagStr.split(',').filter(Boolean));
    if (q) {
      setSearchQuery(q);
      setDebouncedQuery(q);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTags.length) params.set('tags', selectedTags.join(','));
    if (debouncedQuery) params.set('q', debouncedQuery);

    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [selectedCategory, selectedTags, debouncedQuery]);

  // Lazy-load Fuse.js on search focus
  const loadFuse = useCallback(async () => {
    if (fuseRef.current) return;
    const Fuse = (await import('fuse.js')).default;
    fuseRef.current = new Fuse(articles, {
      keys: ['title', 'thesis', 'tags', 'category'],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [articles]);

  // Filter logic
  const filtered = useMemo(() => {
    let results = articles;

    if (selectedCategory) {
      results = results.filter((a) => a.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      results = results.filter((a) =>
        selectedTags.some((t) => a.tags.includes(t)),
      );
    }

    if (debouncedQuery && fuseRef.current) {
      const searchSlugs = new Set(
        fuseRef.current.search(debouncedQuery).map((r: any) => r.item.slug),
      );
      results = results.filter((a) => searchSlugs.has(a.slug));
    } else if (debouncedQuery && !fuseRef.current) {
      const q = debouncedQuery.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.thesis.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return results;
  }, [articles, selectedCategory, selectedTags, debouncedQuery]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function reset() {
    setSelectedCategory('');
    setSelectedTags([]);
    setSearchQuery('');
    setDebouncedQuery('');
  }

  const hasFilters = selectedCategory || selectedTags.length > 0 || debouncedQuery;

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={loadFuse}
            className="w-full px-4 py-2.5 rounded-button bg-tint/5 border border-surface-border text-content placeholder:text-content-muted text-body-sm focus:outline-none focus:border-content/20 transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-body-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-surface-elevated text-content border border-content/20'
                : 'bg-tint/5 text-content-secondary border border-surface-border hover:border-content/10'
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const slug = catSlug(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-body-sm font-medium transition-colors ${
                  isSelected
                    ? `cat-badge-${slug}`
                    : 'bg-tint/5 text-content-secondary border border-surface-border hover:border-content/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-glow-steel/20 text-glow-blue border border-glow-steel/30'
                  : 'bg-tint/5 text-content-muted border border-surface-border hover:border-content/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={reset}
            className="text-body-sm text-content-muted hover:text-content transition-colors underline underline-offset-2"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((article) => (
            <ArticleCardReact key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-body-lg text-content-muted mb-4">No articles match your filters.</p>
          <button
            onClick={reset}
            className="text-glow-blue text-body-sm font-medium hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
