import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { eboxes } from "../data/eboxes";
import { mostRecentRecordReviewDate } from "../data/editorial";
import { latestReviewDate, reviewState, scoreBands } from "../data/models";
import { testById, testDefinitions } from "../data/tests";
import { eboxPath, testPath, trailingSlash } from "../lib/site";

test("every eBox has a permanent unique ID and slug", () => {
  assert.equal(new Set(eboxes.map((ebox) => ebox.id)).size, eboxes.length);
  assert.equal(new Set(eboxes.map((ebox) => ebox.slug)).size, eboxes.length);
  for (const ebox of eboxes) {
    assert.match(ebox.id, /^TK-REC-\d{4}$/);
    assert.match(ebox.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(eboxPath(ebox.slug), `/evidence/${ebox.slug}/`);
  }
});

test("every published eBox has a complete source and revision record", () => {
  for (const ebox of eboxes.filter((item) => item.publicationState === "Published")) {
    assert.ok(ebox.sources.length > 0, `${ebox.id} needs a source`);
    assert.ok(ebox.revisions.length > 0, `${ebox.id} needs revision metadata`);
    for (const source of ebox.sources) {
      assert.ok(source.title && source.publisher && source.url && source.sourceType);
      assert.match(source.url, /^https:\/\//);
      assert.match(source.retrievalDate, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(source.limitingContext.length > 20);
    }
  }
});

test("every assessment has criterion-level support and correct N/A math", () => {
  for (const ebox of eboxes) {
    for (const result of ebox.assessments) {
      const definition = testById.get(result.testId);
      assert.ok(definition, `${ebox.id} references unknown ${result.testId}`);
      assert.deepEqual(result.criteria.map((item) => item.criterionId), definition.criteria.map((item) => item.id));
      assert.ok(result.criteria.every((item) => item.rationale.length > 15), `${ebox.id}/${result.testId} needs rationales`);
      const applicable = result.criteria.filter((item) => item.score !== null);
      const earned = applicable.reduce((sum, item) => sum + (item.score ?? 0), 0);
      const possible = applicable.length * 4;
      const normalized = possible ? Math.round((earned / possible) * 100) : null;
      assert.equal(result.earnedPoints, earned);
      assert.equal(result.possiblePoints, possible);
      assert.equal(result.normalizedScore, normalized);
      assert.ok(result.analysis.length > 25);
      if (result.finding === "Not directly implicated" && applicable.length === 0) assert.equal(result.normalizedScore, null);
    }
  }
});

test("tests use unique identifying colors, full criteria, and common score bands", () => {
  assert.equal(new Set(testDefinitions.map((definition) => definition.color)).size, testDefinitions.length);
  assert.equal(new Set(testDefinitions.map((definition) => definition.id)).size, testDefinitions.length);
  for (const definition of testDefinitions) {
    assert.ok(definition.purpose && definition.boundary && definition.rubricAnchor);
    assert.ok(definition.criteria.length >= 5);
    assert.equal(testPath(definition.slug, definition.rubricAnchor), `/tests/${definition.slug}/#${definition.rubricAnchor}`);
  }
  assert.deepEqual(scoreBands.map((band) => [band.min, band.max, band.name]), [
    [0, 24, "Severe conflict"], [25, 49, "Fails"], [50, 64, "Mixed or contested"], [65, 79, "Substantial alignment"], [80, 100, "Passes"],
  ]);
});

test("all internal route helpers preserve deploy-safe trailing slashes", () => {
  assert.equal(trailingSlash("/tests"), "/tests/");
  assert.equal(trailingSlash("/tests/demo#rubric"), "/tests/demo/#rubric");
  assert.equal(trailingSlash("/"), "/");
});

test("record freshness is explicit and review-due states cannot be hidden", () => {
  const updated = eboxes.find((ebox) => ebox.slug === "broadcast-license-threats-election-speech");
  assert.ok(updated);
  assert.equal(latestReviewDate(updated), "2026-10-07");
  assert.equal(reviewState(updated, "2026-10-07"), "Current review");
  assert.equal(reviewState(updated, "2026-10-22"), "Review due");
  const latest = eboxes.find((ebox) => latestReviewDate(ebox) === mostRecentRecordReviewDate);
  assert.ok(latest);
  assert.equal(reviewState(latest), "Current review");
  const baseline = eboxes.find((ebox) => ebox.slug === "antifa-domestic-terrorist-designation-legal-effect");
  assert.ok(baseline);
  assert.equal(reviewState(baseline), "Monitoring required");
});

test("share dialog, score popover, and mobile layout include keyboard-accessible behavior", async () => {
  const [share, badge, css] = await Promise.all([
    readFile(new URL("../components/share-ebox.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/score-badge.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(share, /role="dialog"/);
  assert.match(share, /aria-modal="true"/);
  assert.match(share, /event\.key === "Escape"/);
  assert.match(share, /event\.key !== "Tab"/);
  assert.match(share, /trigger\?\.focus/);
  assert.match(share, /navigator\.share/);
  assert.match(share, /Copy Post/);
  assert.match(share, /Copy Link/);
  assert.match(badge, /role="tooltip"/);
  assert.match(badge, /aria-describedby/);
  assert.match(badge, /pointerType === "touch"/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /\.share-overlay/);
  assert.match(css, /\.score-popover/);
});
