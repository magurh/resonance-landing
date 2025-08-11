import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resonance — Signal Provider for Flare Networks",
  description: "Accurate, transparent oracle signals for the Flare ecosystem.",
  openGraph: {
    title: "Resonance",
    description: "Signal Provider for Flare Networks",
    images: [{ url: "/background.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonance",
    description: "Signal Provider for Flare Networks",
    images: ["/background.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-neutral-950">
      <body>{children}</body>
    </html>
  );
}
