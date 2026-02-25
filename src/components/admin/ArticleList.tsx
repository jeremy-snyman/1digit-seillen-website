import { useState, useMemo } from 'react';
import type { InsightArticle } from '@content/data/insights/index';

interface Props {
  articles: InsightArticle[];
}

const statusColors: Record<string, string> = {
  draft: 'bg-tint/10 text-content-muted',
  scheduled: 'bg-amber-500/20 text-amber-300',
  published: 'bg-emerald-500/20 text-emerald-300',
  archived: 'bg-tint/5 text-content-muted',
};

type SortKey = 'title' | 'status' | 'category' | 'publishDate';

export default function ArticleList({ articles: initialArticles }: Props) {
  const [articles, setArticles] = useState(initialArticles);
  const [sortKey, setSortKey] = useState<SortKey>('publishDate');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    const clone = [...articles];
    clone.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'publishDate') {
        cmp = new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      } else {
        cmp = (a[sortKey] as string).localeCompare(b[sortKey] as string);
      }
      return sortAsc ? cmp : -cmp;
    });
    return clone;
  }, [articles, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key !== 'publishDate');
    }
  }

  function togglePin(slug: string) {
    setArticles((prev) =>
      prev.map((a) => ({
        ...a,
        isPinned: a.slug === slug ? !a.isPinned : false,
      })),
    );
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(articles, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'articles.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Validation: articles with missing required fields
  const warnings = articles.filter(
    (a) => !a.thesis || !a.category || !a.ctaType || !a.summary,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-xl font-semibold text-content">Articles</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={exportJson}
            className="px-4 py-2 rounded-button border border-surface-border text-body-sm text-content-secondary hover:border-content/20 transition-colors"
          >
            Export JSON
          </button>
          <a
            href="/admin/insights/new"
            data-astro-reload
            className="px-4 py-2 rounded-button bg-glow-steel/20 text-content text-body-sm font-medium border border-surface-border hover:border-content/20 transition-colors"
          >
            New Article
          </a>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="mb-4 p-3 rounded-card bg-amber-500/10 border border-amber-500/20">
          <p className="text-body-sm text-amber-300">
            {warnings.length} article{warnings.length > 1 ? 's' : ''} with missing required fields:{' '}
            {warnings.map((a) => a.title).join(', ')}
          </p>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border">
              {(['title', 'status', 'category', 'publishDate'] as SortKey[]).map(
                (key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="text-left px-4 py-3 text-body-sm text-content-muted font-medium cursor-pointer hover:text-content transition-colors select-none"
                  >
                    {key === 'publishDate' ? 'Date' : key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortKey === key && (
                      <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </th>
                ),
              )}
              <th className="text-left px-4 py-3 text-body-sm text-content-muted font-medium">
                Pinned
              </th>
              <th className="text-right px-4 py-3 text-body-sm text-content-muted font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((article) => (
              <tr
                key={article.slug}
                className="border-b border-surface-border/50 hover:bg-tint/3 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="text-body-sm text-content font-medium">
                    {article.title}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[article.status] || statusColors.draft}`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-body-sm text-content-secondary">
                  {article.category}
                </td>
                <td className="px-4 py-3 text-body-sm text-content-muted">
                  {new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(article.publishDate))}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePin(article.slug)}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${
                      article.isPinned
                        ? 'bg-glow-steel/20 text-glow-blue'
                        : 'text-content-muted hover:text-content'
                    }`}
                  >
                    {article.isPinned ? 'Pinned' : 'Pin'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/insights/${article.slug}`}
                      data-astro-reload
                      className="text-body-sm text-glow-blue hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href={`/admin/insights/preview/${article.slug}`}
                      data-astro-reload
                      className="text-body-sm text-content-muted hover:text-content"
                    >
                      Preview
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
