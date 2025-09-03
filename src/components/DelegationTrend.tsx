// src/components/DelegationTrend.tsx
"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from "recharts";
import { useMemo, useEffect, useState } from "react";

// summed data
const raw = [
  { epoch: 316, total: 1126000 },
  { epoch: 317, total: 1126000 },
  { epoch: 318, total: 12395668.337 },
  { epoch: 319, total: 27392301.771 },
  { epoch: 320, total: 56347955.058 },
  { epoch: 321, total: 74919994.593 },
  { epoch: 322, total: 80375156.666 },
  { epoch: 323, total: 79649511.372 },
  { epoch: 324, total: 103032638.369 },
  { epoch: 325, total: 173353343.921 },
];

const fmtCompactInt = (v: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 0 }).format(Math.round(v));

type MinimalTooltipPayload = { value?: number | string | Array<number | string> };
type MinimalTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: MinimalTooltipPayload[];
};

function CustomTooltip({ active, payload, label }: MinimalTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const raw = payload[0]?.value;
  const val =
    typeof raw === "number"
      ? raw
      : Number(Array.isArray(raw) ? raw[0] ?? 0 : raw ?? 0);

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <div className="text-white/70">Epoch {String(label)}</div>
      <div className="font-semibold text-white">
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 0,
        }).format(val)}
      </div>
    </div>
  );
}

type Point = { epoch: number; total: number };

export default function DelegationTrend({
  title = "Community Delegations",
  height = 260,
  maxWidthClass = "max-w-3xl",
  variant = "card", // "card" | "bare"
  loopAnimationInterval = 0,
  dataOverride,
}: {
  title?: string;
  height?: number;
  maxWidthClass?: string;
  variant?: "card" | "bare";
  loopAnimationInterval?: number;
  dataOverride?: Point[];
}) {
    const data = useMemo<Point[]>(
    () => (dataOverride?.length ? dataOverride : raw /* or RAW */),
    [dataOverride]
  );

  const xTicks = useMemo(() => {
    const epochs = Array.from(new Set(data.map(d => d.epoch))).sort((a, b) => a - b);
    const len = epochs.length;
    if (len <= 1) return epochs;

    const desired = (len % 2 === 0) ? 4 : 5;    // even → 4, odd → 5
    const N = Math.min(desired, len);           // don’t exceed available points

    const ticks: number[] = [];
    for (let i = 0; i < N; i++) {
      const idx = Math.round((i * (len - 1)) / (N - 1)); // 0 .. last
      ticks.push(epochs[idx]);
    }
    return Array.from(new Set(ticks)); // guard against rounding duplicates
  }, [data]);


  // — re-animate by remounting the chart —
  const [lineKey, setLineKey] = useState(0);

  useEffect(() => {
    if (!loopAnimationInterval) return;
    const id = setInterval(() => setLineKey((k) => k + 1), loopAnimationInterval);
    return () => clearInterval(id);
  }, [loopAnimationInterval]);

  // inner chart body (shared for both variants)
  const ChartBody = (
    <>
      {/* centered title */}
      <div className="mb-3">
        <h3
          className="text-xl sm:text-xl font-semibold tracking-tight text-center
                    bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300
                    bg-clip-text text-transparent
                    drop-shadow-[0_1px_8px_rgba(168,85,247,0.18)]"
        >
          {title}
        </h3>
      </div>

      <div className="h-[220px] sm:h-[240px]" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, left: 16, bottom: 14 }}>
            <defs>
              <linearGradient id="strokeBrand" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="fillBrand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(168,85,247,0.25)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0.00)" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />

            <XAxis
              ticks={xTicks}
              dataKey="epoch"
              interval="preserveStartEnd"
              tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700 }}
              axisLine={{
                stroke: "rgba(255,255,255,0.55)",
                strokeWidth: 1.5,
                strokeLinecap: "round",
              }}
              tickLine={{
                stroke: "rgba(255,255,255,0.40)",
                strokeWidth: 1.25,
              }}
            >
              <Label
                value="Reward Epoch"
                position="insideBottom"
                offset={-10}
                style={{ fill: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 700 }}
              />
            </XAxis>

            <YAxis
              allowDecimals={false}
              tickFormatter={fmtCompactInt}
              tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700 }}
              axisLine={{ 
                stroke: "rgba(255,255,255,0.55)",
                strokeWidth: 1.5,
                strokeLinecap: "round",
              }}
              tickLine={{
                stroke: "rgba(255,255,255,0.40)",
                strokeWidth: 1.25,
              }}
              width={64}
            >
            </YAxis>

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.25)" }} />

            {/* Only the line remounts */}
            <Line
              key={lineKey}
              type="monotone"
              dataKey="total"
              stroke="url(#strokeBrand)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              fill="url(#fillBrand)"
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );


  if (variant === "bare") {
    // no card UI at all; just constrain width
    return <div className={`mx-auto ${maxWidthClass}`}>{ChartBody}</div>;
  }

  // default "card" variant (unchanged from before)
  return (
    <div className={`mx-auto ${maxWidthClass} relative rounded-2xl p-[1px] bg-gradient-to-b from-white/25 to-white/5`}>
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur">
        {/* background accents only for "card" */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 opacity-50 blur-3xl">
            <div className="absolute -top-1/2 -left-1/3 h-[160%] w-[160%]
                            [background:radial-gradient(50%_50%_at_20%_20%,rgba(110,35,92,0.35)_0%,transparent_60%),
                                         radial-gradient(45%_45%_at_85%_15%,rgba(24,50,79,0.35)_0%,transparent_60%)]" />
          </div>
          <div
            className="absolute inset-0 opacity-[0.10]
                       [background-image:linear-gradient(to_right,rgba(255,255,255,.15)_1px,transparent_1px),
                                         linear-gradient(to_bottom,rgba(255,255,255,.15)_1px,transparent_1px)]
                       [background-size:40px_40px]"
          />
        </div>
        {ChartBody}
      </div>
    </div>
  );
}
