import { useState } from 'react';
import type { InsightArticle, BodyBlock } from '@content/data/insights/index';

interface Props {
  article: InsightArticle;
}

function blockToText(block: BodyBlock): string[] {
  const lines: string[] = [];

  switch (block.type) {
    case 'paragraph':
      lines.push(block.content, '');
      break;
    case 'section':
      lines.push('', block.heading.toUpperCase(), '');
      block.content.split('\n\n').forEach((p) => {
        lines.push(p, '');
      });
      break;
    case 'bulletList':
      block.items.forEach((item) => lines.push(`  •  ${item}`));
      lines.push('');
      break;
    case 'numberedList':
      block.items.forEach((item, i) => lines.push(`  ${i + 1}.  ${item}`));
      lines.push('');
      break;
    case 'quote':
      lines.push(`"${block.content}"`);
      if (block.attribution) lines.push(`— ${block.attribution}`);
      lines.push('');
      break;
    case 'callout':
      lines.push(`[Note] ${block.content}`, '');
      break;
    case 'diagram':
      lines.push(`[Diagram: ${block.caption}]`, '');
      break;
    case 'chart':
      lines.push(`[Chart: ${block.caption}]`, '');
      break;
  }

  return lines;
}

export default function PdfDownload({ article }: Props) {
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 25;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const date = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(article.publishDate));

      function checkPage(needed: number) {
        if (y + needed > pageHeight - 30) {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `1Digit Insights  |  ${article.slug}`,
            margin,
            pageHeight - 12,
          );
          doc.text(
            `Page ${doc.getNumberOfPages()}`,
            pageWidth - margin,
            pageHeight - 12,
            { align: 'right' },
          );

          doc.addPage();
          y = margin;
        }
      }

      // Header
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text('1DIGIT INSIGHTS', margin, y);
      doc.text(date, pageWidth - margin, y, { align: 'right' });
      y += 8;

      // Separator
      doc.setDrawColor(200);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;

      // Title
      doc.setFontSize(22);
      doc.setTextColor(30);
      const titleLines = doc.splitTextToSize(article.title, maxWidth);
      checkPage(titleLines.length * 9);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 9 + 4;

      // Metadata
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `${article.researchType}  ·  ${article.readTimeMinutes} min read  ·  ${article.category}`,
        margin,
        y,
      );
      y += 10;

      // Thesis
      doc.setFontSize(12);
      doc.setTextColor(50);
      const thesisLines = doc.splitTextToSize(article.thesis, maxWidth);
      checkPage(thesisLines.length * 6 + 8);
      doc.text(thesisLines, margin, y);
      y += thesisLines.length * 6 + 8;

      // Separator
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Body blocks
      for (const block of article.bodyBlocks) {
        const textLines = blockToText(block);

        for (const line of textLines) {
          if (!line) {
            y += 4;
            continue;
          }

          // Detect section headings
          const isHeading =
            block.type === 'section' &&
            line === block.heading.toUpperCase();

          if (isHeading) {
            doc.setFontSize(13);
            doc.setTextColor(30);
            checkPage(12);
            doc.text(line, margin, y);
            y += 8;
          } else {
            doc.setFontSize(10);
            doc.setTextColor(60);
            const wrapped = doc.splitTextToSize(line, maxWidth);
            checkPage(wrapped.length * 5);
            doc.text(wrapped, margin, y);
            y += wrapped.length * 5 + 2;
          }
        }
      }

      // Final footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `1Digit Insights  |  ${article.slug}`,
        margin,
        pageHeight - 12,
      );
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        pageWidth - margin,
        pageHeight - 12,
        { align: 'right' },
      );

      doc.save(`${article.slug}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center my-8">
      <button
        onClick={generate}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-button border border-surface-border text-content text-body-sm font-medium hover:border-content/20 hover:bg-tint/5 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download as PDF
          </>
        )}
      </button>
    </div>
  );
}
