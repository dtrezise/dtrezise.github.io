import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { scoreBands, scoreScale } from "@/data/models";
import { testDefinitions } from "@/data/tests";
import { canonical, testPath } from "@/lib/site";

export const metadata: Metadata = { title: "Tests", description: "Reusable standards for scoring the archive without manufacturing facts.", alternates: { canonical: canonical("/tests/") } };

export default function TestsPage() {
  return <main><SiteHeader active="tests" />
    <section className="page-intro"><span className="kicker">Reusable test system</span><h1>Tests, applied openly.</h1><p>Scores interpret evidence; every point has a rationale and N/A leaves the denominator.</p></section>
    <section className="test-index" aria-label="Test definitions">{testDefinitions.map((test, index) => <article key={test.id} style={{ "--test-color": test.color } as React.CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><div><h2 title={test.name}>{test.name}</h2><p title={test.purpose}>{test.purpose}</p><small>{test.criteria.length} criteria · color {test.color}</small><Link href={testPath(test.slug)}>Open rubric →</Link></div></article>)}</section>
    <section className="scoring-system"><div><span className="kicker">Criterion scale</span><h2>Score only supported evidence.</h2></div><ol>{scoreScale.map((item) => <li key={item.points}><strong>{item.points}</strong><span><b>{item.name}</b>{item.description}</span></li>)}</ol><div className="band-row" aria-label="Common score bands">{scoreBands.map((band) => <span key={band.name}><strong>{band.min}–{band.max}</strong>{band.name}</span>)}</div></section>
    <SiteFooter /></main>;
}
