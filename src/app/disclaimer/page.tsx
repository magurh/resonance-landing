import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Disclaimer — Resonance",
  description: "Legal disclaimer for Resonance.",
};

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

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white antialiased relative">
      <Background />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-[#3a0d2e]/90 to-[#0e1b2a]/70 backdrop-blur supports-[backdrop-filter]:bg-transparent supports-[backdrop-filter]:backdrop-saturate-150">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-xl ring-2 ring-white/80">
                <Image src="/logo.jpeg" alt="Resonance logo" fill className="object-cover" />
              </div>
              <span className="text-sm sm:text-base font-semibold tracking-tight">Resonance</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Home
            </Link>
          </div>
        </Container>
      </header>

      {/* BODY */}
      <section className="py-10">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
              Disclaimer
            </h1>

            <p className="mt-6 text-white/80 leading-relaxed">
              This communication is not intended for, and should not be acted upon by, any person in the United
              Kingdom. The information contained herein does not constitute a financial promotion under the
              Financial Services and Markets Act 2000 (FSMA) and is not directed at or intended for distribution
              to any person in the UK.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block underline decoration-white/40 hover:decoration-white"
            >
              ← Back to home
            </Link>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
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
              <h4 className="font-semibold text-white"> </h4>
              <p className="mt-2 text-white/70">
              
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
          <div className="mt-8 text-white/50">
            © {new Date().getFullYear()} Resonance. All rights reserved.
          </div>
        </Container>
      </footer>
    </main>
  );
}
