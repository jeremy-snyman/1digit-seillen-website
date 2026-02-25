import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import ChartBlock from './ChartBlock';

export function hydrateChartBlock(el: HTMLElement) {
  const chartType = el.dataset.chartType ?? 'cost-comparison';
  const caption = el.dataset.chartCaption ?? '';
  const dataStr = el.dataset.chartData ?? '[]';

  let data: Record<string, unknown>[];
  try {
    data = JSON.parse(dataStr);
  } catch {
    data = [];
  }

  const root = createRoot(el);
  root.render(createElement(ChartBlock, { chartType, caption, data }));
}
