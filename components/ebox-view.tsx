import Link from "next/link";
import { latestReviewDate, reviewState, type EBox } from "@/data/models";
import { testById } from "@/data/tests";
import { eboxPath, testPath } from "@/lib/site";
import { ScoreBadge } from "./score-badge";
import { ShareEBox } from "./share-ebox";

export function EBoxView({ ebox, compact = false, index }: { ebox: EBox; compact?: boolean; index?: number }) {
  return (
    <article className={`ebox ${ebox.featured ? "ebox--featured" : ""} ${compact ? "ebox--compact" : ""}`} id={ebox.id} data-ebox-id={ebox.id}>
      <div className="ebox__index" aria-hidden="true">{String((index ?? 0) + 1).padStart(2, "0")}</div>
      <div className="ebox__main">
        <div className="ebox__meta"><span>{ebox.category}</span><time>{ebox.dateLabel}</time></div>
        <h2>{compact ? <Link href={eboxPath(ebox.slug)} title={ebox.title}>{ebox.title}</Link> : ebox.title}</h2>
        <div className={`status-row ${compact ? "status-row--compact" : ""}`}><span>{compact ? "Status" : "Record status"}</span><strong title={compact ? ebox.status : undefined}>{ebox.status}</strong><em>{ebox.publicationState}</em></div>
        {!compact ? <div className={`review-state review-state--${reviewState(ebox) === "Current review" ? "current" : "due"}`}><span>Evidence review</span><strong>{reviewState(ebox)}</strong><em>Last checked {latestReviewDate(ebox) ?? "unavailable"}{ebox.nextReviewDate ? ` · next review ${ebox.nextReviewDate}` : ""}</em></div> : null}

        <div className="record-summary">
          <section className="fact-block" aria-labelledby={`${ebox.id}-facts`}>
            <span className="section-tag">{compact ? "Record" : "Factual record"}</span>
            <p id={`${ebox.id}-facts`}>{ebox.factualSummary}</p>
          </section>
          <aside className="significance-block">
            <span className="section-tag">{compact ? "Why it matters" : "Why it matters · analysis"}</span>
            <p>{ebox.whyItMatters}</p>
          </aside>
        </div>

        <div className="ebox__actions">
          {compact ? <Link className="record-link" href={eboxPath(ebox.slug)}>Open record <span aria-hidden="true">→</span></Link> : null}
          <ShareEBox slug={ebox.slug} title={ebox.title} status={ebox.status} context={ebox.context} summary={ebox.factualSummary} />
        </div>

        <section className={`test-panels ${compact ? "test-panels--compact" : ""}`} aria-label="Applicable tests">
          {ebox.assessments.map((assessment) => {
            const test = testById.get(assessment.testId);
            if (!test) return null;
            return (
              <article className="test-panel" style={{ "--test-color": test.color } as React.CSSProperties} key={assessment.testId}>
                <div className="test-panel__head">
                  <div><Link href={testPath(test.slug, test.rubricAnchor)} title={compact ? test.name : undefined}>{test.name}</Link><span>{assessment.finding}</span></div>
                  <ScoreBadge assessment={assessment} test={test} />
                </div>
                {!compact ? <p>{assessment.analysis}</p> : null}
                {!compact ? <small>{assessment.editorialReview.status} · {assessment.editorialReview.date}</small> : null}
              </article>
            );
          })}
        </section>

        <details className="evidence-drawer">
          <summary><span>Sources &amp; context</span><strong>{ebox.sources.length} source{ebox.sources.length === 1 ? "" : "s"}</strong></summary>
          <div className="evidence-drawer__body">
            <div className="boundary-note"><span>Limiting context</span><p>{ebox.limitingContext}</p></div>
            <ol className="source-list">
              {ebox.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer"><span>{source.sourceType}</span><strong>{source.title}</strong><em>{source.publisher} ↗</em></a>
                  <p>{source.limitingContext}</p>
                  <small>Retrieved {source.retrievalDate}</small>
                </li>
              ))}
            </ol>
            {!compact ? (
              <div className="revision-block">
                <h3>Revision & correction record</h3>
                {ebox.revisions.map((revision) => <p key={revision.revision}><strong>v{revision.revision} · {revision.date}</strong>{revision.note}{revision.correction ? ` Correction: ${revision.correction}` : ""}</p>)}
                {ebox.privateCompanion ? <small>Private expert/interview companion record exists; contents are not published.</small> : null}
              </div>
            ) : null}
          </div>
        </details>
        <a className="stable-anchor" href={`#${ebox.id}`} aria-label={`Permanent anchor for ${ebox.id}`}>{ebox.id}</a>
      </div>
    </article>
  );
}
