import type { Metadata } from "next";
import Link from "next/link";
import { Archive } from "@/components/archive";
import { PlaybookComparison } from "@/components/playbook-comparison";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { eboxes } from "@/data/eboxes";
import { testDefinitions } from "@/data/tests";
import { canonical, lastReviewed, socialImagePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trump’s Kampf — Democratic Deconstruction Archive",
  description: "A source-first archive testing rhetoric, policy, personnel systems, election actions, and institutional change against democratic and historical standards.",
  alternates: { canonical: canonical("/") },
  openGraph: {
    title: "Trump’s Kampf — The evidence archive",
    description: "Compare mechanisms. Preserve differences. Follow the record.",
    url: canonical("/"),
    type: "website",
    images: [{ url: canonical(socialImagePath("archive")), width: 1200, height: 630, alt: "Trump’s Kampf — Democratic Deconstruction Archive" }],
  },
  twitter: { card: "summary_large_image", title: "Trump’s Kampf — The evidence archive", description: "Compare mechanisms. Preserve differences. Follow the record.", images: [canonical(socialImagePath("archive"))] },
};

export default function Home() {
  const sourceCount = new Set(eboxes.flatMap((ebox) => ebox.sources.map((source) => source.url))).size;
  const primaryCount = eboxes.filter((ebox) => ebox.sources.some((source) => source.sourceType === "Official record" || source.sourceType === "Court record" || source.sourceType === "Direct statement")).length;

  return (
    <main>
      <SiteHeader active="archive" />
      <section className="hero">
        <div className="hero__copy">
          <span className="kicker">Democracy under pressure / evidence under review</span>
          <h1><span>History does not repeat.</span>Power teaches us where to look.</h1>
          <p className="hero__lede">Tracking rhetoric, policy, power, elections, and democratic safeguards.</p>
          <div className="hero__actions"><a className="button button--primary" href="#archive">Examine the evidence</a><Link className="button button--ghost" href="/methodology/">Read the comparison rules</Link></div>
        </div>
        <aside className="hero__thesis">
          <h2>A warning, not a verdict.</h2>
          <p>Compare mechanisms—not identities or inevitable outcomes.</p>
          <p className="hero__boundary">Elections, opposition, federalism, civil society, and courts still constrain power.</p>
        </aside>
      </section>
      <section className="scoreboard" aria-label="Archive statistics">
        <div><strong>{eboxes.length}</strong><span>published records</span></div>
        <div><strong>{sourceCount}</strong><span>distinct source links</span></div>
        <div><strong>{testDefinitions.length}</strong><span>reusable tests</span></div>
        <div><strong>{primaryCount}</strong><span>primary-source records</span></div>
        <div><strong>{lastReviewed}</strong><span>last evidence review</span></div>
      </section>
      <section className="integrity-strip" aria-label="Editorial integrity boundaries">
        <div><span>FACT</span><p>What is established.</p></div>
        <div><span>STATUS</span><p>What remains unresolved.</p></div>
        <div><span>ANALYSIS</span><p>Why it may matter.</p></div>
        <div><span>TEST</span><p>How criteria score it.</p></div>
      </section>
      <PlaybookComparison />
      <Archive />
      <SiteFooter />
    </main>
  );
}
