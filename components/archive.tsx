"use client";

import { useMemo, useState } from "react";
import { categories, eboxes } from "@/data/eboxes";
import { EBoxView } from "./ebox-view";

export function Archive() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All records");
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...eboxes]
      .filter((ebox) => category === "All records" || ebox.category === category)
      .filter((ebox) => !term || [ebox.id, ebox.title, ebox.factualSummary, ebox.whyItMatters, ebox.status, ebox.context, ...ebox.subjects, ...ebox.tags].join(" ").toLowerCase().includes(term))
      .sort((a, b) => order === "newest" ? b.sortDate.localeCompare(a.sortDate) : a.sortDate.localeCompare(b.sortDate));
  }, [query, category, order]);

  function clear() { setQuery(""); setCategory("All records"); }

  return (
    <section className="archive" id="archive" aria-labelledby="archive-heading">
      <div className="archive__intro">
        <div><span className="kicker">Evidence archive</span><h2 id="archive-heading">Browse the record.</h2></div>
        <p>Search records; open one for analysis, scores, sources, and limits.</p>
      </div>
      <div className="archive-controls" aria-label="Evidence filters">
        <label><span>Search records</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: election, terrorism, Project 2025…" /></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>Order</span><select value={order} onChange={(event) => setOrder(event.target.value as "newest" | "oldest")}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
      </div>
      <div className="results-line" aria-live="polite"><span>{visible.length} evidence record{visible.length === 1 ? "" : "s"}</span>{query || category !== "All records" ? <button type="button" onClick={clear}>Clear filters</button> : null}</div>
      <div className="ebox-list">{visible.map((ebox, index) => <EBoxView key={ebox.id} ebox={ebox} compact index={index} />)}</div>
      {!visible.length ? <div className="empty-state"><h3>No matching record.</h3><p>Try a broader search or clear the category filter.</p></div> : null}
    </section>
  );
}
