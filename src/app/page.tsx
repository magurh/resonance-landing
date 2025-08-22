"use client";

// Drop-in visual upgrade for your landing page.
// Optional deps (recommended):
//   npm i framer-motion lucide-react
// Tailwind required (you already have it). No shadcn/ui needed.

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ExternalLink,
  Database,
  SignalHigh,
  ShieldCheck,
  Activity,
  ArrowRight,
  Twitter,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────────
// Types & data
// ────────────────────────────────────────────────────────────────────────────────

type TabKey = "overview" | "data" | "delegate" | "monitor";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "data", label: "Our Data" },
  { key: "delegate", label: "Delegate & Stake" },
  { key: "monitor", label: "Monitor" },
];

// Quick stats to give the page visual rhythm
const stats = [
  { label: "Since epoch", value: "315" },
  { label: "FTSO feeds", value: "60+" },
  { label: "Networks supported", value: "6" },
  { label: "Uptime", value: ">99%" },
];


const linkClasses =
  "font-semibold text-white/90 hover:text-white transition " +
  "focus-visible:underline focus-visible:decoration-white/60 underline-offset-4 " +
  "focus-visible:outline-none rounded";

// ────────────────────────────────────────────────────────────────────────────────
// Utility components
// ────────────────────────────────────────────────────────────────────────────────

function Background() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Brand gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_0%,#6e235c_0%,transparent_60%),radial-gradient(900px_500px_at_90%_10%,#18324f_0%,transparent_60%)] opacity-60" />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to_right,rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.15)_1px,transparent_1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 [mask-image:radial-gradient(white,transparent_80%)]" />
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function GradientCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/25 to-white/5">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-start gap-3">
          {icon && <div className="mt-1 opacity-80">{icon}</div>}
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">{title}</h3>
            <div className="mt-3 text-white/80 leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold transition hover:shadow-md"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
    >
      {children}
    </Link>
  );
}

function CopyField({ text, mono = false }: { text: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const short = useMemo(() => (text.length > 20 ? `${text.slice(0, 8)}…${text.slice(-6)}` : text), [text]);
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5">
      <code className={"break-all text-sm " + (mono ? "font-mono" : "")}>{short}</code>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
        className="rounded-lg border border-white/15 bg-white/10 p-1 hover:bg-white/15"
        title="Copy to clipboard"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function SegmentedTabs({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  return (
    <div className="relative inline-flex rounded-2xl border border-white/20 bg-white/10 p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          role="tab"
          aria-selected={active === t.key}
          className={
            "relative z-10 rounded-xl px-4 md:px-6 py-2 text-sm font-semibold transition focus-visible:outline-none " +
            (active === t.key ? "text-neutral-900" : "text-white/80 hover:text-white")
          }
        >
          {/* Active pill */}
          {active === t.key && (
            <motion.span
              layoutId="tab-active"
              className="absolute inset-0 -z-10 rounded-xl bg-white shadow"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [active, setActive] = useState<TabKey>("overview");

  return (
    <main className="min-h-screen bg-neutral-950 text-white antialiased">
      <Background />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-[#3a0d2e]/90 to-[#0e1b2a]/70 backdrop-blur supports-[backdrop-filter]:bg-transparent supports-[backdrop-filter]:backdrop-saturate-150">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              {/* If you have an SVG logo, swap this Image for it */}
              <div className="relative h-8 w-8 overflow-hidden rounded-xl ring-2 ring-white/80">
                <Image src="/logo.jpeg" alt="Resonance logo" fill className="object-cover" />
              </div>
              <span className="text-sm sm:text-base font-semibold tracking-tight">Resonance</span>
            </Link>
            <div className="hidden md:block">
              <SegmentedTabs active={active} onChange={setActive} />
            </div>
            <div className="flex items-center gap-3">
              <GhostButton href="https://x.com/resonanceoracle">
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">Follow</span>
              </GhostButton>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="border-b border-white/10">
        <Container>
          <div className="grid gap-8 py-14 md:grid-cols-2 md:py-18">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight
                          bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300
                          bg-clip-text text-transparent
                          drop-shadow-[0_1px_10px_rgba(168,85,247,0.15)]"
              >
                Resonance
              </motion.h1>
              <p className="mt-4 max-w-[60ch] text-white/80 leading-relaxed">
                <span className="font-semibold text-white/90">Robust · Reliable · Accurate</span><br />
                Driving decentralization and elevating the performance of Flare Network's enshrined protocols.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <PrimaryButton href="https://portal.flare.network/">
                  Flare Portal
                </PrimaryButton>
                <GhostButton href="https://flare-systems-explorer.flare.network/providers/fsp/0xEB5Bb53864d7E2e67E62a8671F816737Eec45cF4">
                  Explore <ExternalLink className="h-4 w-4" />
                </GhostButton>
                <Pill>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live
                </Pill>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 items-stretch">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-[2px] bg-gradient-to-r from-[#6e235c] to-[#18324f] h-full"
                  >
                    {/* opaque patch so the gradient never tints the inner glass */}
                    <div className="rounded-2xl bg-neutral-950 h-full">
                      {/* the actual tile — SAME look as your Fix 1 */}
                      <div className="rounded-2xl bg-white/5 p-4 text-center backdrop-blur h-full">
                        <div className="text-xl font-bold">{s.value}</div>
                        <div className="mt-1 text-xs text-white/70">{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Decorative orb */}
              <div className="absolute -top-10 -right-8 h-56 w-56 rounded-full bg-gradient-to-tr from-fuchsia-500/40 to-cyan-400/40 blur-3xl" />
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <SignalHigh className="h-5 w-5 opacity-80" />
                    <span className="text-sm font-medium">FTSO Provider</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 opacity-80" />
                    <span className="text-sm font-medium">FDC Attestations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 opacity-80" />
                    <span className="text-sm font-medium">Flare Validator</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 opacity-80" />
                    <span className="text-sm font-medium">Monitoring & reliability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for small screens (fallback) */}
          <div className="mt-4 md:hidden">
            <SegmentedTabs active={active} onChange={setActive} />
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="py-12">
        <Container>
          {active === "overview" && (
            <div className="grid gap-6 md:grid-cols-3">
              <GradientCard title="Who are we?" icon={<SignalHigh className="h-5 w-5" />}>
                <p>
                  Resonance is a new data provider on Flare, registered since <strong>reward epoch 315</strong>.
                  Our mission is to harden core protocols, drive decentralization, and raise oracle accuracy—
                  side by side with a growing network of independent providers.
                </p>
              </GradientCard>
              <GradientCard title="Why Resonance?" icon={<ShieldCheck className="h-5 w-5" />}>
                <p>
                  Though new as an infrastructure provider, we’ve been part of the Flare ecosystem for a long time.
                  We know Flare’s protocols inside out and truly <strong>resonate</strong> with their design. Our focus is durability,
                  transparent methodology, and the network’s long‑term health over short‑term wins.
                </p>
              </GradientCard>
              <GradientCard title="What’s next?" icon={<Activity className="h-5 w-5" />}>
                <p>
                  We’re fine‑tuning our pipelines and steadily lifting reward rates. The goal: a battle‑tested,
                  boringly reliable infra provider you never have to think about.
                </p>
              </GradientCard>
            </div>
          )}

          {active === "data" && (
            <div className="grid gap-6 md:grid-cols-3">
              <GradientCard title="Flare Validator" icon={<ShieldCheck className="h-5 w-5" />}>
                <p>
                  We validate P‑ and C‑chain blocks on Flare mainnet and participate in the Snowman consensus. That is, we propose,
                  verify, and finalize blocks, keeping fraud impractical and guarantees strong.
                </p>
              </GradientCard>
              <GradientCard title="FTSO" icon={<SignalHigh className="h-5 w-5" />}>
                <p>
                  We provide time‑series data for the <strong>Flare Time Series Oracle (FTSO)</strong> across <strong>60+ feeds</strong>,
                  aggregated from trusted exchanges. Built for outlier‑resistance, predictable delivery, and clear reasoning.
                </p>
              </GradientCard>
              <GradientCard title="FDC" icon={<Database className="h-5 w-5" />}>
                <p>
                  We support all current <strong>Flare Data Connector (FDC)</strong> attestations used for bridging external chain data.
                  We run nodes and indexers on Bitcoin, Ethereum, XRP, DOGE, as well as Flare and Songbird to facilitate these services.
                </p>
              </GradientCard>
            </div>
          )}

          {active === "delegate" && (
            <div className="grid gap-6 md:grid-cols-2">
              <GradientCard title="WFLR Delegations" icon={<SignalHigh className="h-5 w-5" />}>
                <p>
                  Wrapped <strong>WFLR</strong> tokens can support Flare’s enshrined protocols through delegations. Community members
                  can entrust data providers with additional vote power. Delegate in minutes via the
                  {" "}
                  <a
                    href="https://portal.flare.network/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    Flare Portal
                  </a>
                  .
                </p>
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-white mb-2">
                    Our delegation address
                  </h4>
                  <CopyField text="0x62571dE064cAC560207b7116C6d87C818f7376cC" mono />
                </div>
              </GradientCard>

              <GradientCard title="Stake Delegations" icon={<ShieldCheck className="h-5 w-5" />}>
                <p>
                  Flare is a delegated Proof‑of‑Stake chain: delegate stake on the P‑chain to an existing validator without
                  running a node yourself. As with vote power, more stake means more impact across enshrined protocols.
                </p>
                <div className="mt-4 space-y-3">
                  <h4 className="text-sm md:text-base font-semibold text-white mb-2">
                    Our validator nodes
                  </h4>
                  <CopyField text="NodeID-PSA7QAZ3s8cWwbuZ3qiCfodcRAa1DwHxA" />{"  "}
                  <CopyField text="NodeID-GZFJBtR95xYQf785nJwXK5dQ1MsEtbXEx" />
                </div>
              </GradientCard>
            </div>
          )}

          {active === "monitor" && (
            <div className="grid gap-6 md:grid-cols-2">
              <GradientCard title="Flare Systems Explorer" icon={<Activity className="h-5 w-5" />}>
                <p>
                  Maintained by the Foundation, the
                  {" "}
                  <a
                    href="https://flare-systems-explorer.flare.network/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    explorer
                  </a>
                  {" "}
                  offers live insights into FTSO and FDC, including provider weights, uptime, success rates, and delegation rewards.
                  View our technical profile
                  {" "}
                  <a
                    href="https://flare-systems-explorer.flare.network/providers/fsp/0xEB5Bb53864d7E2e67E62a8671F816737Eec45cF4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    here
                  </a>
                  .
                </p>
              </GradientCard>
              <GradientCard title="Analytics Platforms" icon={<Database className="h-5 w-5" />}>
                <p>Great community and provider platforms with extremely useful insights:</p>
                <ul className="mt-3 list-disc pl-5 space-y-2">
                  <li>
                    <a
                      href="https://catenalytica.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClasses}
                    >
                      Catenalytica Platform
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://flaremetrics.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClasses}
                    >
                      Flare Metrics
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://flare.space/dapp/flare-advisor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClasses}
                    >
                      Flare Advisor
                    </a>
                  </li>
                </ul>
              </GradientCard>
            </div>
          )}
        </Container>
      </section>

      {/* Footer */}
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
