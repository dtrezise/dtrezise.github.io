import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { eboxes } from "../data/eboxes";
import { testDefinitions } from "../data/tests";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(path: string) {
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

function assertNoInternalEvidenceTerm(html: string) {
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleText, /\beBoxes?\b/i);
}

test("archive, navigation, metadata, and first-pass eBoxes server-render", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Trump’s Kampf/);
  assert.match(html, /Democratic Deconstruction Archive/);
  assert.match(html, /Compare mechanisms/);
  assert.match(html, /Playbook comparison chart/);
  assert.match(html, /Trump administration/);
  assert.match(html, /Media control &amp; access/);
  assert.match(html, /Militarized immigration enforcement/);
  assert.match(html, /Viktor Orbán/);
  assert.match(html, /Adolf Hitler/);
  assert.match(html, /Mao Zedong/);
  assert.match(html, /Joseph Stalin/);
  assert.match(html, /Kim Il-sung/);
  assert.match(html, /How to read this matrix/);
  assert.equal((html.match(/data-ebox-id="TK-REC-/g) ?? []).length, eboxes.length);
  assert.equal((html.match(/class="share-trigger"/g) ?? []).length, eboxes.length);
  assert.match(html, /aria-label="Evidence filters"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /most recent record review/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
  assertNoInternalEvidenceTerm(html);
});

test("every eBox has a functioning canonical detail route and social metadata", async () => {
  for (const ebox of eboxes) {
    const response = await render(`/evidence/${ebox.slug}/`);
    assert.equal(response.status, 200, ebox.slug);
    const html = await response.text();
    assert.match(html, new RegExp(`data-ebox-id="${ebox.id}"`));
    assert.match(html, /rel="canonical"/);
    assert.match(html, new RegExp(`/evidence/${ebox.slug}/`));
    assert.match(html, new RegExp(`/social/${ebox.slug}\\.svg`));
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:description"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /class="share-trigger"/);
    assert.match(html, /class="evidence-drawer"/);
    assertNoInternalEvidenceTerm(html);
  }
});

test("every eBox has a generated static social image", async () => {
  await access(join(process.cwd(), "dist", "client", "social", "archive.svg"), constants.R_OK);
  for (const ebox of eboxes) {
    await access(join(process.cwd(), "dist", "client", "social", `${ebox.slug}.svg`), constants.R_OK);
  }
});

test("every test route resolves its complete rubric and applied records", async () => {
  for (const definition of testDefinitions) {
    const response = await render(`/tests/${definition.slug}/`);
    assert.equal(response.status, 200, definition.slug);
    const html = await response.text();
    assert.match(html, new RegExp(`id="${definition.rubricAnchor}"`));
    assert.match(html, /N\/A criteria are excluded/);
    assert.ok((html.match(/0–4 points/g) ?? []).length >= definition.criteria.length);
    assertNoInternalEvidenceTerm(html);
  }
});

test("all top-level internal links resolve", async () => {
  for (const path of ["/", "/tests/", "/methodology/", "/editorial/", "/about/"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assertNoInternalEvidenceTerm(await response.text());
  }
});
