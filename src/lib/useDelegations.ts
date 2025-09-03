// src/lib/useDelegations.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type DelegationPoint = {
  epoch: number;
  total: number;
  wflr?: number;
  stake?: number;
};

type Options = {
  /** Daily refresh hour (UTC). Default: 12 */
  refreshHourUTC?: number;
  /** Daily refresh minute (UTC). Default: 0 */
  refreshMinuteUTC?: number;
  /** Test mode: refresh every N ms (overrides daily schedule). e.g. 60_000 for 1 min */
  refreshEveryMs?: number;
};

// ─── CSV helpers ───────────────────────────────────────────────────────────────

function detectDelimiter(headerLine: string): "," | ";" {
  const commas = (headerLine.match(/,/g) || []).length;
  const semis = (headerLine.match(/;/g) || []).length;
  return semis > commas ? ";" : ",";
}

// Parse a single CSV line into fields, honoring quotes and the given delimiter
function parseCSVLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQ) {
      if (ch === '"') {
        // Escaped quote?
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQ = true;
      } else if (ch === delim) {
        out.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur.trim());
  return out;
}

function toNumberLoose(raw?: string) {
  if (!raw) return 0;
  // strip thousands separators/spaces; keep decimal dot
  const cleaned = raw.replace(/[ _]/g, "").replace(/,(?=\d{3}\b)/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function idxOf(headers: string[], ...cands: string[]) {
  const lower = headers.map((h) => h.toLowerCase());
  for (const c of cands) {
    const i = lower.indexOf(c);
    if (i >= 0) return i;
  }
  // try a loose contains match
  for (let i = 0; i < lower.length; i++) {
    if (cands.some((c) => lower[i].includes(c))) return i;
  }
  return -1;
}

function parseCSVtoSeries(csv: string): DelegationPoint[] {
  const lines = csv.replace(/\r\n?/g, "\n").split("\n").filter((l) => l.trim().length);
  if (!lines.length) return [];
  const delim = detectDelimiter(lines[0]);

  const header = parseCSVLine(lines[0], delim).map((s) => s.trim());
  const iEpoch = idxOf(header, "epoch", "reward_epoch");
  const iWflr = idxOf(header, "total_wflr", "wflr");
  const iStake = idxOf(header, "total_stake", "stake");

  // 👇 recognize your column name
  const iTotal = idxOf(header, "total_delegations", "total", "total_amount", "delegations_total");

  const out: DelegationPoint[] = [];
  for (let r = 1; r < lines.length; r++) {
    const cells = parseCSVLine(lines[r], delim);
    if (!cells.length) continue;

    const epoch = toNumberLoose(cells[iEpoch]);
    if (!Number.isFinite(epoch) || epoch <= 0) continue;

    const wflr = iWflr >= 0 ? toNumberLoose(cells[iWflr]) : 0;
    const stake = iStake >= 0 ? toNumberLoose(cells[iStake]) : 0;
    const total = iTotal >= 0 ? toNumberLoose(cells[iTotal]) : wflr + stake;

    out.push({ epoch, total, ...(iWflr >= 0 ? { wflr } : {}), ...(iStake >= 0 ? { stake } : {}) });
  }
  out.sort((a, b) => a.epoch - b.epoch);
  return out;
}


// ─── scheduling helpers ───────────────────────────────────────────────────────

function nextDailyUTC(hour = 12, minute = 0) {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute, 0, 0));
  if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
  return next;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a published Google Sheets CSV of delegations.
 * Columns accepted:
 *  - epoch, total_wflr, total_stake
 *  - epoch, wflr, stake
 *  - epoch, total
 *
 * Default: fetch immediately + once/day at 12:00 UTC.
 * For testing: pass refreshEveryMs (e.g. 60_000 for 1 min).
 */
export function useDelegationsCSV(csvUrl: string, opts?: Options) {
  const [series, setSeries] = useState<DelegationPoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCSV = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      // cache-bust so Google doesn't serve stale CSV
      const bust = csvUrl + (csvUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
      const res = await fetch(bust, { cache: "no-store", mode: "cors", signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCSVtoSeries(text);

      if (!parsed.length) {
        throw new Error("Parsed 0 rows. Check header names & delimiter, and that the Sheet is 'Published to web' as CSV.");
      }

      setSeries(parsed);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e?.message || "Failed to fetch delegations.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchCSV();

  useEffect(() => {
    const controller = new AbortController();

    // initial fetch
    fetchCSV(controller.signal);

    // clear any old timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // testing mode: fixed interval
    if (opts?.refreshEveryMs && opts.refreshEveryMs > 0) {
      intervalRef.current = setInterval(() => fetchCSV(), opts.refreshEveryMs);
      return () => {
        controller.abort();
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    // daily schedule at UTC time
    const hour = opts?.refreshHourUTC ?? 12;
    const minute = opts?.refreshMinuteUTC ?? 0;
    const now = new Date();
    const next = nextDailyUTC(hour, minute);
    const msToNext = Math.max(1000, next.getTime() - now.getTime());

    timeoutRef.current = setTimeout(() => {
      fetchCSV();
      intervalRef.current = setInterval(fetchCSV, 24 * 60 * 60 * 1000);
    }, msToNext);

    return () => {
      controller.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [csvUrl, opts?.refreshHourUTC, opts?.refreshMinuteUTC, opts?.refreshEveryMs]);

  const latest = useMemo(() => (series?.length ? series[series.length - 1] : null), [series]);

  return { series, latest, loading, error, refresh };
}
