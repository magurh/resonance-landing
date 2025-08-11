export const metadata = {
  title: "Disclaimer — Resonance",
  description: "Legal disclaimer for Resonance.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="w-full h-28 bg-[#2a0d2e]" />
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">Disclaimer</h1>
        <p className="mt-6 text-white/80 leading-relaxed">
          This communication is not intended for, and should not be acted upon
          by, any person in the United Kingdom. The information contained herein
          does not constitute a financial promotion under the Financial Services
          and Markets Act 2000 (FSMA) and is not directed at or intended for
          distribution to any person in the UK.
        </p>
        <a
          href="/"
          className="mt-8 inline-block underline decoration-white/40 hover:decoration-white"
        >
          ← Back to home
        </a>
      </section>
    </main>
  );
}
