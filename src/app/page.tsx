"use client";

import { useState } from "react";
import Link from "next/link";

type TabKey = "overview" | "data" | "delegate" | "monitor";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "data", label: "Our Data" },
  { key: "delegate", label: "Delegate & Stake" },
  { key: "monitor", label: "Monitor" },
];

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "rounded-2xl px-7 md:px-9 py-2 text-base font-semibold leading-5",
        // thicker border, same height
        active
          ? "bg-white text-neutral-900 border-2 border-white shadow-sm"
          : "bg-white/10 text-white border-2 border-white/25 hover:bg-white/15",
        // focus ring
        "transition outline-none focus-visible:ring-2 focus-visible:ring-white/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}


function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
      <div className="mt-3 text-white/80 leading-relaxed">{children}</div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="ml-2 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-xs sm:text-sm hover:bg-white/15 transition"
      title="Copy to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function Home() {
  const [active, setActive] = useState<TabKey>("overview");

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Solid header */}
      <header className="w-full h-32 sm:h-40 md:h-48 bg-[#2a0d2e]" />

      <section className="mx-auto max-w-6xl px-6">
        {/* Title row: header bottom through logo center */}
        <div className="flex items-end gap-4 -mt-8 sm:-mt-8 md:-mt-10">
          <img
            src="/logo.jpeg"
            alt="Resonance logo"
            className="h-16 sm:h-16 md:h-20 w-auto rounded-2xl object-cover ring-4 ring-white/90 shadow-xl"
          />
          <div className="pb-0 -translate-y-[8px] md:-translate-y-[12px]">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Resonance
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/80">
              Signal Provider for Flare Networks
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Sections"
          className="mt-10 sm:mt-12 flex flex-wrap gap-4"
        >
          {tabs.map((t) => (
            <TabButton
              key={t.key}
              active={active === t.key}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </TabButton>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {active === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Who are we?">
              <p>
                Resonance is a new data provider on Flare, registered since{" "}
                <strong>reward epoch 316</strong>. Our mission is to harden core
                protocols, drive decentralization, and raise oracle accuracy—side
                by side with a growing network of independent providers.
              </p>
            </Card>
            <Card title="Why Resonance?">
              <p>
                Though new as an infrastructure provider, we have been part of the Flare ecosystem for a long time.
                We know Flare’s protocols inside out and truly <strong>resonate</strong> with their design.
                Our focus is durability, transparent methodology, and the network’s long-term health over short-term wins.
              </p>
            </Card>
            <Card title="What's next?">
              <p>
                We are working towards fine-tuning our pipelines, and
                steadily lift reward rates. The goal: a battle-tested, boringly
                reliable infra provider you never have to think about.
              </p>
            </Card>
          </div>
        )}

        {active === "data" && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Flare Validator">
              <p>
                We validate P- and C-chain blocks on Flare mainnet, maintain history,
                and participate in the Snowman consensus protocol: propose, verify, and finalize—
                keeping fraud impractical and security guarantees strong.
              </p>
            </Card>
            <Card title="FTSO">
              <p>
                We provide time-series data for the{" "}
                <strong>Flare Time Series Oracle (FTSO)</strong> across{" "}
                <strong>60+ feeds</strong>, aggregated from various trusted exchanges.
                Our setup is built for outlier-resistance, predictable delivery, and clear
                reasoning.
              </p>
            </Card>
            <Card title="FDC">
              <p>
                We support all current{" "}
                <strong>Flare Data Connector (FDC)</strong> attestations,
                which are used for bridging data from external chains onto Flare.
                Under the hood, we are running nodes and indexers on Bitcoin, Ethereum, XRP, DOGE,
                and Songbird to facilitate these services.
              </p>
            </Card>
          </div>
        )}

        {active === "delegate" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="WFLR Delegations">
              <p>
                Within the Flare network, wrapped <strong>WFLR</strong> tokens can
                be used to support the network’s enshrined protocols through delegations.
                As such, community members can entrust data providers with additional
                vote power. Delegations can be done in minutes via the&nbsp;
                <a
                  href="https://portal.flare.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/40 hover:decoration-white"
                >
                  Flare Portal.
                </a>
                <br />
                <br />
                <strong>Our delegation address</strong>
              </p>
              <p className="mt-2 flex items-center">
                <code className="rounded bg-white/10 px-2 py-1 break-all">
                  0x62571dE064cAC560207b7116C6d87C818f7376cC
                </code>
                <CopyButton text="0x62571dE064cAC560207b7116C6d87C818f7376cC" />
              </p>
            </Card>

            <Card title="Stake Delegations">
              <p>
                Flare is a delegated Proof-of-Stake chain: you can delegate stake on the
                P-chain to an existing validator, without the need to run a validator node
                yourself. As with vote power, more stake means more impact in validation and within the enshrined protocols.
                <br />
                <br />
                <strong>Our validator nodes</strong>
              </p>
              <p className="mt-3">
                <code className="rounded bg-white/10 px-2 py-1 break-all">
                  NodeID-PSA7QAZ3s8cWwbuZ3qiCfodcRAa1DwHxA
                </code>
                <CopyButton text="NodeID-PSA7QAZ3s8cWwbuZ3qiCfodcRAa1DwHxA" />
              </p>
              <p className="mt-3">
                <code className="rounded bg-white/10 px-2 py-1 break-all">
                  NodeID-GZFJBtR95xYQf785nJwXK5dQ1MsEtbXEx
                </code>
                <CopyButton text="NodeID-GZFJBtR95xYQf785nJwXK5dQ1MsEtbXEx" />
              </p>
            </Card>
          </div>
        )}

        {active === "monitor" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Flare Systems Explorer">
              <p>
                Maintained by the Flare Foundation, the&nbsp;
                <a
                    href="https://flare-systems-explorer.flare.network/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/40 hover:decoration-white"
                  >
                    explorer
                  </a>
                &nbsp;offers live insights
                into the FTSO and FDC protocols, as well as various
                data provider metrics, such as weights, uptime, success rates, or
                even staking and delegation reward rates. It is thus the best
                tool to check anything related to Flare’s enshrined protocols.
                <br /><br />
                You can find our technical profile&nbsp;
                <a
                    href="https://flare-systems-explorer.flare.network/providers/fsp/0xEB5Bb53864d7E2e67E62a8671F816737Eec45cF4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/40 hover:decoration-white break-all"
                  >
                    here
                  </a>.
              </p>
            </Card>
            <Card title="Analytics Platforms">
              <div>
                <p>
                  There are many community and infra-provider platforms with useful
                  delegation insights:
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-2">
                  <li>
                    <a
                      href="https://catenalytica.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/40 hover:decoration-white"
                    >
                      Catenalytica Platform
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://flaremetrics.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/40 hover:decoration-white"
                    >
                      Flare Metrics
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://flare.space/dapp/flare-advisor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/40 hover:decoration-white"
                    >
                      Flare Advisor
                    </a>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 pb-12 text-sm text-white/70">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="font-medium text-white">Disclaimer</h4>
            <Link
              href="/disclaimer"
              className="mt-2 inline-block underline decoration-white/40 hover:decoration-white"
            >
              Read full disclaimer →
            </Link>
          </div>
          <div>
            <h4 className="font-medium text-white">Contact</h4>
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
            <h4 className="font-medium text-white">Twitter</h4>
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
        <div className="mt-8 text-white/50">
          © {new Date().getFullYear()} Resonance. All rights reserved.
        </div>
      </footer>

    </main>
  );
}
