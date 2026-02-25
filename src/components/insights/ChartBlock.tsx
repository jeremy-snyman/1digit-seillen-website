import { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartBlockProps {
  chartType: string;
  caption: string;
  data: Record<string, unknown>[];
}

function getCssVar(name: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return raw ? `rgb(${raw})` : '#6B7280';
}

function useThemeColors() {
  const [colors, setColors] = useState({
    text: '#D5DBE6',
    muted: '#B8C7D9',
    border: '#D8E7F2',
    accent: '#5064820',
    steel: '#506482',
    blue: '#BECDE1',
  });

  useEffect(() => {
    function update() {
      setColors({
        text: getCssVar('--color-content-secondary'),
        muted: getCssVar('--color-content-muted'),
        border: getCssVar('--color-surface-border'),
        accent: getCssVar('--color-glow-steel'),
        steel: getCssVar('--color-glow-steel'),
        blue: getCssVar('--color-glow-blue'),
      });
    }

    update();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          update();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return colors;
}

/** Monochrome bar palette */
const barPalette = ['rgb(80 100 130)', 'rgb(120 140 165)', 'rgb(190 205 225)'];

function CostComparisonChart({
  data,
  colors,
}: {
  data: Record<string, unknown>[];
  colors: ReturnType<typeof useThemeColors>;
}) {
  // Detect multi-series (e.g. typical vs recommended)
  const keys = Object.keys(data[0] || {}).filter((k) => k !== 'name');
  const isMultiSeries = keys.length > 1;

  if (isMultiSeries) {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${colors.border}33`} />
          <XAxis
            dataKey="name"
            tick={{ fill: colors.muted, fontSize: 12 }}
            axisLine={{ stroke: `${colors.border}66` }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: colors.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgb(16 19 28)',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.text,
              fontSize: 13,
            }}
          />
          {keys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={barPalette[i % barPalette.length]}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Single value series
  const valueKey = keys[0] || 'cost';
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={`${colors.border}33`} />
        <XAxis
          dataKey="name"
          tick={{ fill: colors.muted, fontSize: 12 }}
          axisLine={{ stroke: `${colors.border}66` }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: colors.muted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <Tooltip
          contentStyle={{
            background: 'rgb(16 19 28)',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            color: colors.text,
            fontSize: 13,
          }}
          formatter={(value: number) =>
            valueKey === 'cost'
              ? [`€${value.toLocaleString()}`, 'Annual Cost']
              : [value.toLocaleString(), valueKey]
          }
        />
        <Bar dataKey={valueKey} radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {data.map((_, index) => (
            <Cell key={index} fill={barPalette[index % barPalette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function ChartBlock({ chartType, caption, data }: ChartBlockProps) {
  const colors = useThemeColors();

  return (
    <figure className="my-8 max-w-[680px] mx-auto" role="img" aria-label={caption}>
      <CostComparisonChart data={data} colors={colors} />
      <figcaption className="text-body-sm text-content-muted text-center mt-3">
        {caption}
      </figcaption>
    </figure>
  );
}
