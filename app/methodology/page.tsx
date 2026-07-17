import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { canonical } from "@/lib/site";

export const metadata: Metadata = { title: "Methodology", description: "The archive’s evidence rules, historical-comparison boundaries, status language, and correction workflow.", alternates: { canonical: canonical("/methodology/") } };

const rules = [
  ["Primary record first", "Orders, laws, rulings, transcripts, and authenticated statements lead; reporting adds context."],
  ["Status is part of the fact", "Proposal, order, blocked provision, charge, judgment, appeal, and conclusion remain distinct."],
  ["Mechanisms, not identity", "Compare consolidation methods without treating Trump, fascism, and Nazism as synonyms."],
  ["Counterevidence stays visible", "Courts, elections, dissent, reversals, denials, lawful purposes, and resistance stay attached."],
  ["Tests never manufacture claims", "A score cannot turn association into guilt, rhetoric into law, or risk into outcome."],
  ["Every surface stands alone", "Titles, cards, social copy, metadata, and images remain independently accurate."],
] as const;

export default function MethodologyPage() { return <main><SiteHeader active="methodology" />
  <section className="page-intro page-intro--method"><span className="kicker">Publication standard</span><h1>Strong warning. Exact claim.</h1><p>Concern demands defensible facts, status, uncertainty, and historical limits.</p></section>
  <section className="method-rules"><div><span className="kicker">Six non-negotiable rules</span><h2>Six publication rules.</h2></div><ol>{rules.map((rule, index) => <li key={rule[0]}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{rule[0]}</h3><p title={rule[1]}>{rule[1]}</p></div></li>)}</ol></section>
  <section className="comparison-framework"><div><span className="kicker">Historical comparison</span><h2>Where the analogy helps—and fails.</h2></div><div className="comparison-grid"><article><strong>Compare</strong><ul><li>Internal-enemy construction</li><li>Election delegitimation</li><li>Emergency and terror labels</li><li>Administrative and party capture</li><li>Pressure on press, courts, civil society</li><li>Normalization by institutional allies</li></ul></article><article><strong>Do not collapse</strong><ul><li>Competitive system into completed one-party rule</li><li>Harsh rhetoric into an enacted criminal power</li><li>Political grievance into racial extermination doctrine</li><li>Selective enforcement risk into proven mass detention</li><li>International realignment into identical war aims</li><li>Analogy into prediction or inevitability</li></ul></article></div></section>
  <section className="legal-answer"><span className="kicker">The combatant question</span><h2>No current ideology-to-combatant shortcut.</h2><p>The PATRIOT Act did not create authority to label domestic political opponents enemy combatants and bypass the courts. Domestic terrorism is defined but is not a standalone federal charge. Existing crimes, warrants, due process, habeas corpus, the First Amendment, and judicial review still matter. The practical danger is broader and more ordinary: selective investigations, associative theories, financial scrutiny, immigration or security authorities where applicable, and the chilling effect of official labels.</p><Link href="/evidence/antifa-domestic-terrorist-designation-legal-effect/">Open the legal-boundary record →</Link></section>
  <section className="workflow"><div><span className="kicker">Revision workflow</span><h2>Publish for revision.</h2></div><ol><li><strong>01 · Frame</strong><span>One narrow event and one defensible title.</span></li><li><strong>02 · Retrieve</strong><span>Capture source, publisher, URL, date, and limits.</span></li><li><strong>03 · Challenge</strong><span>Find denials, lawful purposes, counterevidence, and status.</span></li><li><strong>04 · Score</strong><span>Use applicable criteria; explain every point.</span></li><li><strong>05 · Review</strong><span>Check card, page, share copy, image, and metadata.</span></li><li><strong>06 · Correct</strong><span>Append material changes; never erase history silently.</span></li></ol></section>
  <SiteFooter /></main>; }
