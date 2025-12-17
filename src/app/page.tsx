"use client";

import DelegationTrend from "@/components/DelegationTrend";
import { useDelegationsCSV } from "@/lib/useDelegations";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiX } from "react-icons/si";
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
  Clock,
  Coins,
  Wallet,
  Users
} from "lucide-react";
// ────────────────────────────────────────────────────────────────────────────────
// Types & data
// ────────────────────────────────────────────────────────────────────────────────

// Types
type TabKey = "overview" | "data" | "delegate" | "monitor" | "tips";

// Add to tabs array
const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "data", label: "Our Data" },
  { key: "delegate", label: "Delegate & Stake" },
  { key: "monitor", label: "Monitor" },
  { key: "tips", label: "Tips" },
];

const linkClasses =
  "font-semibold text-white/90 hover:text-white transition " +
  "focus-visible:underline focus-visible:decoration-white/60 underline-offset-4 " +
  "focus-visible:outline-none rounded";

const DELEGATIONS_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbR6hIfC_P2sVAEvWXGA_myLV6iH42omqRPvvaB1USwpqGV_dRylyPyDBPedJ8n8kNNMObZadAKK80/pub?gid=0&single=true&output=csv";

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
// Reward eligibility
// ────────────────────────────────────────────────────────────────────────────────

const ELIG_BASE = {
  // Set this to the FIRST epoch boundary to count from:
  timeUTC: "2025-08-01T12:00:00Z",
  count: 0,
};

function getEligibilityInfo(now = new Date()) {
  const TICK_MS = 84 * 60 * 60 * 1000; // 3.5 days
  const base = new Date(ELIG_BASE.timeUTC);
  let ticks = 0;
  if (now > base) ticks = Math.floor((now.getTime() - base.getTime()) / TICK_MS);
  const total = ELIG_BASE.count + ticks;
  const nextTick = new Date(base.getTime() + (ticks + 1) * TICK_MS);
  return { total, nextTick };
}


// ────────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [active, setActive] = useState<TabKey>("overview");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000); // tick every minute
    return () => clearInterval(id);
  }, []);
  const { total: eligAllTime } = useMemo(() => getEligibilityInfo(new Date(now)), [now]);
    const stats = useMemo(
    () => [
      {
        label: "Uptime",
        value: ">99%",
        icon: <ShieldCheck className="h-4 w-4 opacity-80" />,
      },
      {
        label: "Delegations",
        value: "200M+",
        icon: <Users className="h-4 w-4 opacity-80" />,
      },
      {
        label: "Eligible Epochs",
        value: String(eligAllTime),
        icon: <Coins className="h-4 w-4 opacity-80" />,
      },
      {
        label: "Eligibility Streak",
        value: "100%",
        icon: <Coins className="h-4 w-4 opacity-80" />,
      },
    ],
    [eligAllTime]
  );
  // grab data from public csv
  const { series: liveSeries} =
    useDelegationsCSV(DELEGATIONS_CSV, { refreshHourUTC: 12, refreshMinuteUTC: 0 });

  return (
    <main className="min-h-screen bg-neutral-950 text-white antialiased">
      <Background />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-[#3a0d2e]/90 to-[#0e1b2a]/70 backdrop-blur supports-[backdrop-filter]:bg-transparent supports-[backdrop-filter]:backdrop-saturate-150">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-xl ring-2 ring-white/80">
                <Image src="/logo.jpeg" alt="Resonance logo" fill className="object-cover" />
              </div>
              <span className="text-sm sm:text-base font-semibold tracking-tight">Resonance</span>
            </Link>
            <div className="hidden md:block">
              <SegmentedTabs active={active} onChange={setActive} />
            </div>
            <div className="flex items-center gap-3">
              <GhostButton href="https://x.com/resonanceoracle" aria-label="Follow on X">
                <SiX className="h-4 w-4" />
                <span className="hidden sm:inline">Tune in</span>
              </GhostButton>
            </div>
          </div>
        </Container>
      </header>

        {/* Hero */}
      <section className="border-b border-white/10">
        <Container>
          {/* On md+ we want bottom alignment; on mobile it just stacks */}
          <div className="grid items-end gap-8 py-14 md:grid-cols-2 md:py-18">
            {/* LEFT column — title, copy, CTAs, stats */}
            <div className="order-1 md:order-none">
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
                Driving decentralization and elevating the performance of Flare Network’s enshrined protocols.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <PrimaryButton href="https://portal.flare.network/">Flare Portal</PrimaryButton>
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
                    <div className="rounded-2xl bg-neutral-950 h-full">
                      <div className="rounded-2xl bg-white/5 p-4 text-center backdrop-blur h-full flex flex-col justify-center">
                        {s.icon && <div className="mb-1 flex justify-center">{s.icon}</div>}
                        <div className="text-xl font-bold">{s.value}</div>
                        <div className="mt-1 text-xs text-white/70">{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT column — chart (bare), aligned to hero bottom on md+ */}
            <div className="relative order-2 md:order-none self-end">
              {/* Spacing so it visually starts below the H1 on mobile */}
              <div
                className="
                  relative mt-4 md:mt-0
                  before:content-[''] before:absolute
                  before:-top-6 before:-right-4
                  before:h-48 before:w-48 before:rounded-full
                  before:opacity-80 before:blur-2xl
                  before:[background:radial-gradient(closest-side,rgba(168,85,247,0.35),rgba(34,211,238,0.20)_60%,transparent_72%)]
                "
              >
                <DelegationTrend
                  variant="bare"                           // no card frame; uses hero background
                  title="Community Delegations"
                  height={260}
                  maxWidthClass="max-w-md md:max-w-lg"
                  loopAnimationInterval={30_000}           // re-animate line every 30s
                  dataOverride={liveSeries || undefined}
                />
              </div>
            </div>
          </div>

          {/* Tabs for small screens */}
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
                  Resonance is already an established data provider on Flare, registered since <strong>reward epoch 315</strong>.
                  Our mission is to harden core protocols, drive decentralization, and raise oracle accuracy—
                  side by side with a growing network of independent providers.
                </p>
              </GradientCard>
              <GradientCard title="Why Resonance?" icon={<ShieldCheck className="h-5 w-5" />}>
                <p>
                  We’ve been part of the Flare ecosystem for a long time and
                  we know Flare’s protocols inside out, and truly <strong>resonate</strong> with their design. Our focus is durability,
                  transparent methodology, and the network’s long‑term health over short‑term wins.
                </p>
              </GradientCard>
              <GradientCard title="What’s next?" icon={<Activity className="h-5 w-5" />}>
                <p>

                  We started with a <strong>1M FLR</strong> self-bond, and now sitting at around
                  <strong> 3M</strong> stake. Our delegations crossed <strong>200M</strong>,
                  reflecting growing community trust. Our goal: a battle-tested, boringly reliable
                  provider you never have to think about.
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
                  We run nodes and indexers on Bitcoin, Ethereum, XRP, DOGE, as well as Flare, and Songbird to facilitate these services.
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
                  <CopyField text="NodeID-GZFJBtR95xYQf785nJwXK5dQ1MsEtbXEx" />{"  "}
                  <CopyField text="NodeID-PSA7QAZ3s8cWwbuZ3qiCfodcRAa1DwHxA" />
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
          {active === "tips" && (
            <div className="mx-auto max-w-3xl space-y-6"> {/* centered & stacked */}
              <GradientCard title="How are delegated tokens used?" icon={<Wallet className="h-5 w-5" />}>
                <p>
                  Flare supports two delegation types that grant <strong>vote power</strong> to infrastructure providers running
                  Flare’s enshrined protocols:
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-2">
                  <li>
                    <strong>Stake delegations (FLR)</strong> — native FLR staked on the P-chain.
                  </li>
                  <li>
                    <strong>WFLR delegations (ERC-20)</strong> — wrapped FLR delegated on the EVM C-chain.
                  </li>
                </ul>
                <p className="mt-3">
                  For an infrastructure provider, more <strong>vote power</strong> simply means a stronger impact on Flare’s <strong>enshrined oracles</strong> and <strong>validation</strong>.
                  Your delegated tokens actively support the network’s core protocols.
                </p>
              </GradientCard>

              <GradientCard title="How are my rewards calculated?" icon={<Coins className="h-5 w-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Rewards are computed every <strong>3.5 days</strong> (a <em>reward epoch</em>). These epochs always start
                    on <strong>Monday mornings</strong> and <strong>Thursday evenings (UTC time)</strong>.
                  </li>
                  <li>
                    After each epoch, rewards are calculated per provider and their delegators. Providers must meet a set of
                    <strong> minimum performance requirements</strong> to be eligible.
                  </li>
                  <li>
                    If eligible, rewards are then shared <strong>proportionally to your delegation</strong>, from the total rewards earned
                    by the provider you have delegated to.
                  </li>
                </ul>
              </GradientCard>

              <GradientCard title="When will I receive my rewards?" icon={<Clock className="h-5 w-5" />}>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>WFLR delegations:</strong> rewards for these delegations are typically available
                    for claiming approximately <strong>6–18 hours</strong> after epoch end.
                  </li>
                  <li>
                    <strong>Stake delegations (FLR): these rewards are available </strong> every <strong>2 weeks</strong>,
                    and bundle together 4 reward epochs.
                  </li>
                </ul>
                <p className="mt-3 text-white/80">
                  <strong>First-time delay:</strong> note that vote power for the next epoch is based on a
                  <strong> randomly chosen block</strong> from the current epoch. If that block predates your delegation,
                  your tokens won’t count until the following epoch. Thus, in unlucky situations, first rewards may
                  take about <strong>1 week</strong>. Make sure to follow our socials, as we will be posting regularly
                  when rewards can be claimed!
                </p>
              </GradientCard>

              <GradientCard title="How do I Delegate or Stake?" icon={<ExternalLink className="h-5 w-5" />}>
                <p>
                  The simplest path is via the{" "}
                  <a
                    href="https://portal.flare.network/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    <strong>Flare Portal</strong>
                  </a>
                  . Standard delegations use <strong>WFLR</strong>, while stake delegations use native <strong>FLR</strong>.
                  Connect your wallet, then follow these steps:
                </p>

                <h4 className="mt-4 text-sm md:text-base font-semibold text-white">a) WFLR Delegations</h4>
                <ol className="mt-2 list-decimal pl-5 space-y-2">
                  <li>Open the <strong>Account</strong> tab.</li>
                  <li>Wrap some <strong>FLR → WFLR</strong> (keep a little FLR for gas).</li>
                  <li>Click <strong>Delegate</strong> and pick your provider (you can split across two).</li>
                  <li>Confirm the transactions and wait for network confirmation.</li>
                </ol>

                <h4 className="mt-6 text-sm md:text-base font-semibold text-white">b) Stake Delegations (FLR)</h4>
                <ol className="mt-2 list-decimal pl-5 space-y-2">
                  <li>Open the <strong>Staking</strong> tab.</li>
                  <li>
                    Press <strong>Deposit</strong> to move FLR to the <strong>P-chain</strong> (staking chain) from the <strong>C-chain</strong> (EVM chain).
                  </li>
                  <li>
                    Click <strong>Stake</strong>, set amount, add the validator <strong>NodeID</strong> you wish to delegate to, and choose a duration
                    (minimum <strong>2 weeks</strong>).
                  </li>
                </ol>
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
              <h4 className="font-semibold text-white">X</h4>
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

