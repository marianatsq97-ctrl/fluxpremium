'use client';

import React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error('useChart must be used within a <ChartContainer />');
  return context;
}

const THEMES = { light: '', dark: '.dark' };

export const ChartContainer = React.forwardRef(({ id, className, children, config = {}, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} ref={ref} className={cn('flex aspect-video justify-center text-xs', className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

export function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item?.theme || item?.color);
  if (!colorConfig.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const vars = colorConfig
        .map(([key, item]) => {
          const color = item.theme?.[theme] || item.color;
          return color ? `--color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join('\n');
      return `${prefix} [data-chart=${id}] {\n${vars}\n}`;
    })
    .join('\n');

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export const ChartTooltipContent = React.forwardRef(({ active, payload, className }, ref) => {
  if (!active || !payload?.length) return null;

  return (
    <div ref={ref} className={cn('grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl', className)}>
      {payload.map((item) => (
        <div key={`${item.dataKey}-${item.name}`} className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-mono tabular-nums">{Number(item.value || 0).toLocaleString('pt-BR')}</span>
        </div>
      ))}
    </div>
  );
});
ChartTooltipContent.displayName = 'ChartTooltipContent';

export const ChartLegend = RechartsPrimitive.Legend;

export const ChartLegendContent = React.forwardRef(({ className, payload, nameKey }, ref) => {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div ref={ref} className={cn('flex items-center justify-center gap-4 pt-3', className)}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const label = config[key]?.label || item.value;
        return (
          <div key={String(item.value)} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: item.color }} />
            {label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegendContent';
