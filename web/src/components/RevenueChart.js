"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money } from "@/lib/format";
import { useThemeColors } from "./useThemeColors";

const label = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const { date, revenue, units } = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-[var(--shadow-pop)]">
      <div className="text-muted">{new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</div>
      <div className="mt-0.5 font-semibold tabular">{money(revenue, currency)}</div>
      <div className="text-muted tabular">{units} units sold</div>
    </div>
  );
}

export function RevenueChart({ data, currency }) {
  const c = useThemeColors(["brand-600", "line", "line-strong", "faint"]);
  // Reserve the space until colours are known, so the chart never renders in the wrong theme
  if (!c) return <div className="h-64 w-full" />;
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c["brand-600"]} stopOpacity={0.28} />
              <stop offset="100%" stopColor={c["brand-600"]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={c.line} />
          <XAxis dataKey="date" tickFormatter={label} tickLine={false} axisLine={false} minTickGap={28} tick={{ fill: c.faint, fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) => money(v, currency, { compact: true })}
            tickLine={false}
            axisLine={false}
            width={56}
            tick={{ fill: c.faint, fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ stroke: c["line-strong"] }} />
          <Area type="monotone" dataKey="revenue" stroke={c["brand-600"]} strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
