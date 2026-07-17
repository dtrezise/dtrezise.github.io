import assert from "node:assert/strict";
import test from "node:test";
import { eboxBySlug } from "../data/eboxes";
import { historicalLeaders, leaderScore, playbookGroups } from "../data/playbook-comparison";

test("playbook matrix uses published evidence and complete historical score columns", () => {
  assert.ok(historicalLeaders.length >= 3);
  assert.ok(playbookGroups.length >= 5);
  for (const leader of historicalLeaders) {
    assert.match(leader.source.url, /^https:\/\//);
    assert.ok(leaderScore(leader.id) >= 0 && leaderScore(leader.id) <= 100);
  }
  for (const group of playbookGroups) {
    assert.ok(group.items.length > 0, `${group.label} needs at least one sub-item`);
    for (const item of group.items) {
      assert.ok(item.trumpEvidence.length > 0, `${item.label} needs Trump-administration evidence`);
      for (const slug of item.trumpEvidence) assert.ok(eboxBySlug.has(slug), `${item.label}: missing evidence ${slug}`);
      for (const leader of historicalLeaders) assert.ok(item.scores[leader.id] >= 0 && item.scores[leader.id] <= 4);
    }
  }
});
