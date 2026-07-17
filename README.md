# Trump’s Kampf

A local-first, source-first evidence archive for examining democratic deconstruction, authoritarian rhetoric, institutional change, historical mechanisms, and the legal guardrails that remain.

## Run locally

Requires Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/](http://localhost:3000/).

## Verify

```bash
pnpm test
pnpm lint
```

The automated suite builds the site and checks permanent IDs, source completeness, score math, N/A denominators, canonical routes, eBox share routes, social metadata, rubric routes, keyboard-accessibility hooks, and responsive CSS.

## Content architecture

- `data/eboxes.ts` — the structured eBox source of truth
- `data/tests.ts` — reusable test definitions, criteria, colors, and boundaries
- `data/models.ts` — evidence, revision, scoring, and publication types
- `components/ebox-view.tsx` — shared archive/detail eBox renderer
- `components/share-ebox.tsx` — accessible destination-aware share composer
- `app/evidence/[slug]/` — canonical eBox pages and generated social images
- `app/tests/[slug]/` — full rubric pages
- `app/methodology/` — editorial, legal, and historical-comparison rules

Set `NEXT_PUBLIC_SITE_URL` to the final public origin before deployment. Until then, canonical and share URLs intentionally use `http://localhost:3000`.

## Publication posture

The project is openly concerned about democratic deconstruction and disciplined about separating factual record, procedural status, analysis, tests, limiting context, and sources. Historical comparisons operate at the level of specific mechanisms; they are not claims of identity, inevitability, or equivalence to Nazi Germany’s one-party racial dictatorship, genocide, or aggressive war.
