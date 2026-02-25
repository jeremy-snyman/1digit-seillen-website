import { useState } from 'react';
import type { BodyBlock } from '@content/data/insights/index';

interface Props {
  blocks: BodyBlock[];
  onChange: (blocks: BodyBlock[]) => void;
}

const blockTypeLabels: Record<string, string> = {
  paragraph: 'Paragraph',
  section: 'Section',
  bulletList: 'Bullet List',
  numberedList: 'Numbered List',
  quote: 'Quote',
  callout: 'Callout',
  diagram: 'Diagram',
  chart: 'Chart',
};

const diagramTypes = [
  'architecture-layered',
  'lifecycle-flow',
  'data-flow',
  'governance-layer',
  'platform-stack',
];

const chartTypes = [
  'cost-comparison',
  'margin-shift',
  'risk-matrix',
  'lifecycle-timeline',
];

function createEmptyBlock(type: string): BodyBlock {
  switch (type) {
    case 'paragraph':
      return { type: 'paragraph', content: '' };
    case 'section':
      return { type: 'section', heading: '', content: '' };
    case 'bulletList':
      return { type: 'bulletList', items: [''] };
    case 'numberedList':
      return { type: 'numberedList', items: [''] };
    case 'quote':
      return { type: 'quote', content: '', attribution: '' };
    case 'callout':
      return { type: 'callout', content: '' };
    case 'diagram':
      return { type: 'diagram', diagramType: 'architecture-layered', caption: '' };
    case 'chart':
      return { type: 'chart', chartType: 'cost-comparison', caption: '', data: [] };
    default:
      return { type: 'paragraph', content: '' };
  }
}

function BlockField({
  block,
  index,
  onChange,
}: {
  block: BodyBlock;
  index: number;
  onChange: (index: number, block: BodyBlock) => void;
}) {
  switch (block.type) {
    case 'paragraph':
      return (
        <textarea
          value={block.content}
          onChange={(e) => onChange(index, { ...block, content: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20 resize-y"
          placeholder="Paragraph text..."
        />
      );

    case 'section':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.heading}
            onChange={(e) => onChange(index, { ...block, heading: e.target.value })}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm font-semibold focus:outline-none focus:border-content/20"
            placeholder="Section heading..."
          />
          <textarea
            value={block.content}
            onChange={(e) => onChange(index, { ...block, content: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20 resize-y"
            placeholder="Section content (use blank lines for paragraph breaks)..."
          />
        </div>
      );

    case 'bulletList':
    case 'numberedList':
      return (
        <div className="space-y-2">
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-content-muted text-body-sm mt-2 w-6 text-right flex-shrink-0">
                {block.type === 'numberedList' ? `${i + 1}.` : '•'}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = e.target.value;
                  onChange(index, { ...block, items });
                }}
                className="flex-1 px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20"
                placeholder={`Item ${i + 1}...`}
              />
              <button
                onClick={() => {
                  const items = block.items.filter((_, j) => j !== i);
                  onChange(index, { ...block, items: items.length ? items : [''] });
                }}
                className="text-content-muted hover:text-red-400 text-xs px-2"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange(index, { ...block, items: [...block.items, ''] })}
            className="text-body-sm text-glow-blue hover:underline ml-8"
          >
            + Add item
          </button>
        </div>
      );

    case 'quote':
      return (
        <div className="space-y-2">
          <textarea
            value={block.content}
            onChange={(e) => onChange(index, { ...block, content: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm font-serif italic focus:outline-none focus:border-content/20 resize-y"
            placeholder="Quote text..."
          />
          <input
            type="text"
            value={block.attribution || ''}
            onChange={(e) => onChange(index, { ...block, attribution: e.target.value })}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20"
            placeholder="Attribution (optional)..."
          />
        </div>
      );

    case 'callout':
      return (
        <textarea
          value={block.content}
          onChange={(e) => onChange(index, { ...block, content: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20 resize-y"
          placeholder="Callout text..."
        />
      );

    case 'diagram':
      return (
        <div className="space-y-2">
          <select
            value={block.diagramType}
            onChange={(e) => onChange(index, { ...block, diagramType: e.target.value })}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20"
          >
            {diagramTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="text"
            value={block.caption}
            onChange={(e) => onChange(index, { ...block, caption: e.target.value })}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20"
            placeholder="Caption..."
          />
        </div>
      );

    case 'chart':
      return (
        <div className="space-y-2">
          <select
            value={block.chartType}
            onChange={(e) => onChange(index, { ...block, chartType: e.target.value })}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20"
          >
            {chartTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="text"
            value={block.caption}
            onChange={(e) => onChange(index, { ...block, caption: e.target.value })}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20"
            placeholder="Caption..."
          />
          <textarea
            value={JSON.stringify(block.data, null, 2)}
            onChange={(e) => {
              try {
                const data = JSON.parse(e.target.value);
                onChange(index, { ...block, data });
              } catch {
                // Invalid JSON, ignore
              }
            }}
            rows={4}
            className="w-full px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm font-mono focus:outline-none focus:border-content/20 resize-y"
            placeholder='[{"name": "Item", "value": 100}]'
          />
        </div>
      );

    default:
      return <p className="text-content-muted text-body-sm">Unknown block type</p>;
  }
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [addType, setAddType] = useState('paragraph');

  function updateBlock(index: number, block: BodyBlock) {
    const updated = [...blocks];
    updated[index] = block;
    onChange(updated);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  }

  function addBlock() {
    onChange([...blocks, createEmptyBlock(addType)]);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-heading-md font-semibold text-content">Body Blocks</h3>

      {blocks.map((block, i) => (
        <div key={i} className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-medium text-glow-blue">
              {blockTypeLabels[block.type] || block.type} #{i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveBlock(i, -1)}
                disabled={i === 0}
                className="text-content-muted hover:text-content disabled:opacity-30 text-xs px-2 py-1"
              >
                ↑
              </button>
              <button
                onClick={() => moveBlock(i, 1)}
                disabled={i === blocks.length - 1}
                className="text-content-muted hover:text-content disabled:opacity-30 text-xs px-2 py-1"
              >
                ↓
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this block?')) removeBlock(i);
                }}
                className="text-content-muted hover:text-red-400 text-xs px-2 py-1"
              >
                Delete
              </button>
            </div>
          </div>
          <BlockField block={block} index={i} onChange={updateBlock} />
        </div>
      ))}

      {/* Add block */}
      <div className="flex items-center gap-2">
        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value)}
          className="px-3 py-2 rounded bg-tint/5 border border-surface-border text-content text-body-sm focus:outline-none focus:border-content/20"
        >
          {Object.entries(blockTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          onClick={addBlock}
          className="px-4 py-2 rounded-button bg-glow-steel/20 text-content text-body-sm font-medium border border-surface-border hover:border-content/20 transition-colors"
        >
          + Add Block
        </button>
      </div>
    </div>
  );
}
