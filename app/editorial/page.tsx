import type { Metadata } from "next";
import Link from "next/link";
import { editorialStandards, publicationLimits, reviewCycleDays } from "@/data/editorial";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { canonical } from "@/lib/site";

export const metadata: Metadata = { title: "Editorial standards", description: "The archive’s source, review, correction, and historical-comparison standards.", alternates: { canonical: canonical("/editorial/") } };

export default function EditorialPage() { return <main><SiteHeader active="editorial" />
  <section className="page-intro page-intro--method"><span className="kicker">Editorial operations</span><h1>Every strong claim needs a visible trail.</h1><p>Source discipline, review dates, limiting context, and corrections protect the work.</p></section>
  <section className="method-rules"><div><span className="kicker">Publication standards</span><h2>Five rules for every record.</h2></div><ol>{editorialStandards.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol></section>
  <section className="editorial-grid"><article><span className="kicker">Review cadence</span><h2>Records are monitored, not frozen.</h2><p>Live legal, election, enforcement, and institutional records are scheduled for review at least every {reviewCycleDays} days and sooner when a material ruling, implementation event, correction, or credible response appears.</p></article><article><span className="kicker">Score discipline</span><h2>A score is analysis, not proof.</h2><p>Tests are reusable rubrics. They cannot manufacture a fact, turn association into guilt, or replace the sources and limiting context attached to each record.</p></article></section>
  <section className="publication-limits"><span className="kicker">Current limits</span><h2>What this temporary public archive does not yet do.</h2><ul>{publicationLimits.map((item) => <li key={item}>{item}</li>)}</ul><Link href="/methodology/">Read the full comparison method</Link></section>
  <SiteFooter />
</main>; }
