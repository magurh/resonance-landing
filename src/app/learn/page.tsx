// src/app/learn/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Twitter } from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────────
// Page-local UI primitives (mirrors your home page look)
// ────────────────────────────────────────────────────────────────────────────────

function Background() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_0%,#6e235c_0%,transparent_60%),radial-gradient(900px_500px_at_90%_10%,#18324f_0%,transparent_60%)] opacity-60" />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to_right,rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.15)_1px,transparent_1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 [mask-image:radial-gradient(white,transparent_80%)]" />
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ext = href.startsWith("http");
  return (
    <Link
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
    >
      {children}
    </Link>
  );
}

function SegmentedTabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { key: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-2xl border border-white/20 bg-white/10 p-1">
      {items.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          role="tab"
          aria-selected={value === t.key}
          className={
            "relative z-10 rounded-xl px-4 md:px-6 py-2 text-sm font-semibold transition focus-visible:outline-none " +
            (value === t.key ? "text-neutral-900 bg-white shadow" : "text-white/80 hover:text-white")
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function GradientCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/25 to-white/5">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">{title}</h3>
        <div className="mt-3 text-white/80 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Diagram({
  src,
  alt,
  caption,
  frame = "none",                 // "paper" | "none"
  bg = "#F4EAF7",
  height = 320,
  crop,                           // { top,right,bottom,left,unit }
  radius = 22,                    // rounded-corner crop (px)
}: {
  src: string;
  alt: string;
  caption?: string;
  frame?: "paper" | "none";
  bg?: string;
  height?: number;
  crop?: { top?: number; right?: number; bottom?: number; left?: number; unit?: "px" | "%" };
  radius?: number;
}) {
  const unit = crop?.unit ?? "%";
  const t = crop?.top ?? 0, r = crop?.right ?? 0, b = crop?.bottom ?? 0, l = crop?.left ?? 0;
  const clip = `inset(${t}${unit} ${r}${unit} ${b}${unit} ${l}${unit} round ${radius}px)`;

  return (
    <figure
      className={"mt-4 " + (frame === "paper" ? "rounded-2xl p-3 ring-1 ring-white/10 shadow-sm" : "")}
      style={frame === "paper" ? { backgroundColor: bg } : undefined}
    >
      <div className={"relative w-full overflow-hidden " + (frame === "paper" ? "rounded-lg" : "")} style={{ height }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover"
          style={{ clipPath: clip }}   // ← crops with rounded corners
          priority
        />
      </div>
      {caption && frame !== "none" && (
        <figcaption className="mt-2 text-xs text-neutral-700">{caption}</figcaption>
      )}
    </figure>
  );
}



// ────────────────────────────────────────────────────────────────────────────────
// Learn page
// ────────────────────────────────────────────────────────────────────────────────

type LearnTab = "ftso" | "fdc" | "consensus";

export default function LearnPage() {
  const [tab, setTab] = useState<LearnTab>("ftso");

  return (
    <main className="min-h-screen bg-neutral-950 text-white antialiased relative">
      <Background />

      {/* Header — same look as home */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-[#3a0d2e]/90 to-[#0e1b2a]/70 backdrop-blur supports-[backdrop-filter]:bg-transparent supports-[backdrop-filter]:backdrop-saturate-150">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-xl ring-2 ring-white/80">
                <Image src="/logo.jpeg" alt="Resonance logo" fill className="object-cover" />
              </div>
              <span className="text-sm sm:text-base font-semibold tracking-tight">Resonance</span>
            </Link>

            {/* Header tabs */}
            <div className="hidden md:flex items-center gap-3">
              <SegmentedTabs
                value={tab}
                onChange={setTab}
                items={[
                  { key: "ftso", label: "FTSO" },
                  { key: "fdc", label: "FDC" },
                  { key: "consensus", label: "Consensus" },
                ]}
              />
              {/* Home & Twitter */}
              <GhostButton href="/">Home</GhostButton>
              <GhostButton href="https://x.com/resonanceoracle">
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">Twitter</span>
              </GhostButton>
            </div>

            {/* Compact right side on small screens */}
            <div className="md:hidden">
              <GhostButton href="/">Home</GhostButton>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="pb-3 md:hidden">
            <SegmentedTabs
              value={tab}
              onChange={setTab}
              items={[
                { key: "ftso", label: "FTSO" },
                { key: "fdc", label: "FDC" },
                { key: "consensus", label: "Consensus" },
              ]}
            />
          </div>
        </Container>
      </header>

      {/* Body */}
      <section className="py-10">
        <Container>
          {/* Title changes per tab */}
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
            {tab === "ftso" && "Flare Time Series Oracle"}
            {tab === "fdc" && "Flare Data Connector"}
            {tab === "consensus" && "Consensus"}
          </h1>
          <p className="mt-3 text-white/80 max-w-[70ch]">
            {tab === "ftso" && "How Flare brings external time-series data on-chain in a decentralized and robust way."}
            {tab === "fdc" && "How events from external chains and web2 sources are attested and bridged into Flare."}
            {tab === "consensus" && "A high-level view of Snowman-style consensus and validation on Flare."}
          </p>

          {/* FTSO content */}
          {tab === "ftso" && (
            <div className="mt-8 space-y-6">
              <GradientCard title="Overview">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Oracle problem:</strong> blockchains are closed systems, bringing off-chain data on-chain quickly, reliably, and securely.
                  </li>
                  <li>
                    <strong>Centralization risk:</strong> single providers become points of failure and manipulation.
                  </li>
                  <li>Flare proposes two complementary solutions for time-series data.</li>
                </ul>
              </GradientCard>

              <GradientCard title="Anchor Feeds (≈ 90s latency)">
                <p>
                  Every price is computed from submissions by <em>all</em> data providers, then finalized via signatures.
                </p>
                <Diagram
                  src="/learn/ftso_scaling.png"
                  alt="FTSO anchor feed aggregation"
                  frame="none"                 // only the picture
                  height={200}
                  crop={{ top: 0, right: 0, bottom: 0, left: 0, unit: "%" }}
                  radius={22}
                />
                <ol className="mt-4 list-decimal pl-5 space-y-2">
                  <li>Providers commit encrypted price submissions on-chain.</li>
                  <li>Commits are revealed after a fixed interval (prevents copycats).</li>
                  <li>Providers perform off-chain aggregation (weighted median) to get a single price.</li>
                  <li>The aggregated price is signed by providers; with ≥50% agreement, prices finalize.</li>
                </ol>
              </GradientCard>

              <GradientCard title="Block-latency Feeds (≈ 1.8s latency)">
                <p>
                  To further reduce latency while maintaining security, Flare uses randomness via{" "}
                  <strong>cryptographic sortition</strong> to select small per-block committees.
                </p>
                <Diagram
                  src="/learn/ftso_fast_updates.png"
                  alt="FTSO block-latency fixed-step updates"
                  caption="Per-block committees submit fixed-step moves; incentives align with anchor feeds."
                />
                <ol className="mt-4 list-decimal pl-5 space-y-2">
                  <li>Each block, providers check if they’re selected to submit updates.</li>
                  <li>
                    Eligible providers prepare updates relative to the current on-chain price using small{" "}
                    <em>fixed-step</em> moves (up / down / same), not full prices.
                  </li>
                  <li>Providers submit their preferred move; the contract updates the price accordingly.</li>
                </ol>
              </GradientCard>
            </div>
          )}

          {/* FDC placeholder */}
          {tab === "fdc" && (
            <div className="mt-8 space-y-6">
              <GradientCard title="Overview">{/* TODO: content */}</GradientCard>
              <GradientCard title="Attestation Flow">{/* TODO: content */}</GradientCard>
              <GradientCard title="Bridging Guarantees">{/* TODO: content */}</GradientCard>
            </div>
          )}

          {/* Consensus placeholder */}
          {tab === "consensus" && (
            <div className="mt-8 space-y-6">
              <GradientCard title="Overview">{/* TODO: content */}</GradientCard>
              <GradientCard title="Validator Duties">{/* TODO: content */}</GradientCard>
              <GradientCard title="Finalization & Safety">{/* TODO: content */}</GradientCard>
            </div>
          )}
        </Container>
      </section>

      {/* Footer — same as home */}
      <footer className="border-t border-white/10 py-10">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="font-semibold text-white">Disclaimer</h4>
              <Link
                href="/disclaimer"
                className="mt-2 inline-block underline decoration-white/40 hover:decoration-white"
              >
                Read full disclaimer →
              </Link>
            </div>
            <div>
              <h4 className="font-semibold text-white">Contact</h4>
              <p className="mt-2">
                <a
                  href="mailto:resonanceoracle@gmail.com"
                  className="underline decoration-white/40 hover:decoration-white"
                >
                  resonanceoracle@gmail.com
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Twitter</h4>
              <p className="mt-2">
                <a
                  href="https://x.com/resonanceoracle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/40 hover:decoration-white"
                >
                  x.com/resonanceoracle
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 text-white/50">© {new Date().getFullYear()} Resonance. All rights reserved.</div>
        </Container>
      </footer>
    </main>
  );
}
