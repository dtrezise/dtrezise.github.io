import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { eboxes } from "@/data/eboxes";
import { scoreBands, scoreScale } from "@/data/models";
import { testBySlug, testDefinitions } from "@/data/tests";
import { canonical, eboxPath, testPath } from "@/lib/site";

export function generateStaticParams() { return testDefinitions.map((test) => ({ slug: test.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const test = testBySlug.get(slug); return test ? { title: test.name, description: test.purpose, alternates: { canonical: canonical(testPath(test.slug)) } } : {}; }

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const test = testBySlug.get(slug); if (!test) notFound();
  const records = eboxes.flatMap((ebox) => { const result = ebox.assessments.find((item) => item.testId === test.id); return result ? [{ ebox, result }] : []; });
  return <main><SiteHeader active="tests" />
    <section className="rubric-hero" style={{ "--test-color": test.color } as React.CSSProperties}><div><span className="kicker">{test.id}</span><h1>{test.name}</h1><p>{test.purpose}</p></div><aside><strong>Boundary</strong><p>{test.boundary}</p></aside></section>
    <section className="rubric" id={test.rubricAnchor}><div className="rubric__heading"><span className="kicker">Complete rubric</span><h2>{test.criteria.length} criteria. No hidden weights.</h2></div><ol>{test.criteria.map((criterion, index) => <li id={`${test.slug}-${criterion.id}`} key={criterion.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{criterion.name}</h3><p>{criterion.description}</p><small>{criterion.scoringGuidance}</small></div><em>0–4 points</em></li>)}</ol></section>
    <section className="rubric-scoring"><div><h2>Point guidance</h2>{scoreScale.map((item) => <p key={item.points}><strong>{item.points} · {item.name}</strong>{item.description}</p>)}</div><div><h2>Normalized bands</h2>{scoreBands.map((band) => <p key={band.name}><strong>{band.min}–{band.max}</strong>{band.name}</p>)}<small>N/A criteria are excluded. Score = earned ÷ applicable possible points × 100.</small></div></section>
    <section className="rubric-records"><div><span className="kicker">Applied records</span><h2>{records.length} record{records.length === 1 ? "" : "s"} use this test.</h2></div><div>{records.map(({ ebox, result }) => <Link href={eboxPath(ebox.slug)} key={ebox.id} title={ebox.title}><span>{ebox.id}</span><strong>{ebox.title}</strong><em>{result.finding} · {result.normalizedScore ?? "N/A"}{result.normalizedScore === null ? "" : "/100"}</em></Link>)}</div></section>
    <SiteFooter /></main>;
}
