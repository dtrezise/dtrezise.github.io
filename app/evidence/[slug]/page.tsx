import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EBoxView } from "@/components/ebox-view";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { eboxBySlug, eboxes } from "@/data/eboxes";
import { canonical, eboxPath, socialImagePath } from "@/lib/site";

export function generateStaticParams() { return eboxes.map((ebox) => ({ slug: ebox.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ebox = eboxBySlug.get(slug);
  if (!ebox) return {};
  const url = canonical(eboxPath(ebox.slug));
  const image = canonical(socialImagePath(ebox.slug));
  return {
    title: ebox.title,
    description: ebox.factualSummary,
    alternates: { canonical: url },
    openGraph: { title: ebox.title, description: ebox.factualSummary, url, type: "article", images: [{ url: image, width: 1200, height: 630, alt: `${ebox.title} — ${ebox.status}` }] },
    twitter: { card: "summary_large_image", title: ebox.title, description: ebox.factualSummary, images: [image] },
  };
}

export default async function EvidencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ebox = eboxBySlug.get(slug);
  if (!ebox) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    identifier: ebox.id,
    name: ebox.title,
    datePublished: ebox.revisions[0]?.date,
    dateModified: ebox.revisions.at(-1)?.date,
    url: canonical(eboxPath(ebox.slug)),
    description: ebox.factualSummary,
    citation: ebox.sources.map((source) => source.url),
    about: ebox.subjects,
  };

  return (
    <main>
      <SiteHeader active="archive" />
      <section className="record-masthead"><div><span className="kicker">Permanent evidence record</span><p>{ebox.id}</p></div><Link href="/#archive">← Return to archive</Link></section>
      <div className="record-shell"><EBoxView ebox={ebox} /></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteFooter />
    </main>
  );
}
