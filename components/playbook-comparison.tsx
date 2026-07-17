import Link from "next/link";
import { Fragment } from "react";
import { eboxBySlug } from "@/data/eboxes";
import { historicalLeaders, leaderScore, playbookGroups, scoreLabel } from "@/data/playbook-comparison";

export function PlaybookComparison() {
  return (
    <section className="playbook-chart" id="playbook" aria-labelledby="playbook-heading">
      <div className="playbook-chart__intro">
        <div><span className="kicker">Historical comparison</span><h2 id="playbook-heading">Playbook comparison chart</h2></div>
        <p>Read across: the first column is the current record; each historical column rates resemblance for that specific mechanism on a 0–4 scale.</p>
      </div>
      <div className="playbook-chart__legend" aria-label="Comparison score legend"><strong>0 none</strong><strong>1 low</strong><strong>2 limited</strong><strong>3 material</strong><strong>4 strong</strong><span>Scores compare methods, not leaders or outcomes.</span></div>
      <div className="playbook-chart__table-wrap">
        <table>
          <caption>Trump administration evidence compared with historical authoritarian playbooks by democratic-deconstruction mechanism.</caption>
          <thead>
            <tr>
              <th scope="col">Deconstruction item</th>
              <th scope="col" className="playbook-chart__trump-head">Trump administration <small>Published evidence</small></th>
              {historicalLeaders.map((leader) => <th key={leader.id} scope="col" className="playbook-chart__leader-head"><a href={leader.source.url} target="_blank" rel="noreferrer">{leader.name} ↗</a><small>{leader.period}</small><b>{leaderScore(leader.id)}<em>/100</em></b></th>)}
            </tr>
          </thead>
          <tbody>
            {playbookGroups.map((group) => <Fragment key={group.id}>
              <tr className="playbook-chart__group" key={group.id}><th colSpan={historicalLeaders.length + 2} scope="colgroup">{group.label}</th></tr>
              {group.items.map((item) => {
                const records = item.trumpEvidence.map((slug) => eboxBySlug.get(slug)).filter(Boolean);
                return <tr key={item.id}>
                  <th scope="row" className="playbook-chart__item"><strong>{item.label}</strong><span>{item.description}</span></th>
                  <td className="playbook-chart__trump-evidence"><span>Documented</span><div>{records.map((record) => record ? <Link key={record.id} href={`/evidence/${record.slug}/`}>{record.id.replace("TK-REC-", "#")}</Link> : null)}</div></td>
                  {historicalLeaders.map((leader) => {
                    const score = item.scores[leader.id];
                    return <td key={leader.id} className="playbook-chart__cell"><span className={`comparison-score comparison-score--${score}`} aria-label={`${leader.name}: ${score} of 4, ${scoreLabel(score)} resemblance`} title={`${scoreLabel(score)} resemblance`}><b>{score}</b><small>/4</small></span><em>{scoreLabel(score)}</em></td>;
                  })}
                </tr>;
              })}
            </Fragment>)}
          </tbody>
        </table>
      </div>
      <details className="playbook-chart__method">
        <summary>How to read this matrix</summary>
        <div><p>Each historical cell rates resemblance in one documented mechanism only: 0 means no material resemblance in this archive; 4 means a strong resemblance in method. Header totals are the simple average across the listed items—not a diagnosis, prediction, or measure of identity.</p><p>Historical differences are decisive: the United States remains a competitive federal system with courts, elections, civil society, and independent reporting. The Hitler column is limited to early-consolidation tactics and never claims Nazi one-party rule, racial dictatorship, genocide, or aggressive war are present.</p><Link href="/methodology/">Read the comparison rules →</Link></div>
      </details>
    </section>
  );
}
