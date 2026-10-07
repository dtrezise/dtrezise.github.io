export type PublicationState = "Published" | "Under review" | "Corrected";

export type EvidenceSource = {
  sourceType: "Official record" | "Court record" | "Legislation" | "Policy blueprint" | "Direct statement" | "Reporting" | "Historical analysis";
  title: string;
  publisher: string;
  url: string;
  retrievalDate: string;
  limitingContext: string;
};

export type Revision = {
  revision: string;
  date: string;
  note: string;
  correction?: string;
};

export type CriterionDefinition = {
  id: string;
  name: string;
  description: string;
  scoringGuidance: string;
};

export type TestDefinition = {
  id: string;
  slug: string;
  name: string;
  color: string;
  purpose: string;
  boundary: string;
  rubricAnchor: string;
  criteria: CriterionDefinition[];
};

export type CriterionAssessment = {
  criterionId: string;
  score: 0 | 1 | 2 | 3 | 4 | null;
  rationale: string;
};

export type TestFinding = "Fails" | "Implicates" | "Not directly implicated" | "Passes";

export type TestAssessment = {
  testId: string;
  finding: TestFinding;
  criteria: CriterionAssessment[];
  earnedPoints: number;
  possiblePoints: number;
  normalizedScore: number | null;
  analysis: string;
  editorialReview: {
    status: "Reviewed" | "Provisional";
    date: string;
  };
};

export type EBox = {
  id: string;
  slug: string;
  title: string;
  category: string;
  context: string;
  dateLabel: string;
  sortDate: string;
  status: string;
  publicationState: PublicationState;
  factualSummary: string;
  whyItMatters: string;
  limitingContext: string;
  subjects: string[];
  tags: string[];
  sources: EvidenceSource[];
  assessments: TestAssessment[];
  revisions: Revision[];
  lastChecked?: string;
  nextReviewDate?: string;
  privateCompanion?: {
    available: true;
    access: "Private editorial record";
  };
  featured?: boolean;
};

export function latestReviewDate(ebox: EBox) {
  return ebox.lastChecked ?? ebox.revisions.at(-1)?.date ?? null;
}

export function reviewState(ebox: EBox, asOf = "2026-10-07") {
  const latest = latestReviewDate(ebox);
  if (!latest) return "Review date unavailable";
  if (ebox.nextReviewDate && ebox.nextReviewDate < asOf) return "Review due";
  return latest === asOf ? "Current review" : "Monitoring required";
}

export const scoreScale = [
  { points: 0, name: "Direct conflict", description: "The record directly conflicts with the criterion." },
  { points: 1, name: "Substantial conflict", description: "The record materially conflicts with the criterion." },
  { points: 2, name: "Mixed or limited", description: "The evidence is indirect, unresolved, divided, or materially limited." },
  { points: 3, name: "Mostly aligns", description: "The record mostly aligns, with meaningful reservations." },
  { points: 4, name: "Strongly aligns", description: "The available evidence strongly supports alignment." },
] as const;

export const scoreBands = [
  { min: 0, max: 24, name: "Severe conflict" },
  { min: 25, max: 49, name: "Fails" },
  { min: 50, max: 64, name: "Mixed or contested" },
  { min: 65, max: 79, name: "Substantial alignment" },
  { min: 80, max: 100, name: "Passes" },
] as const;

export function scoreBand(score: number | null) {
  if (score === null) return "Not scored";
  return scoreBands.find((band) => score >= band.min && score <= band.max)?.name ?? "Not scored";
}

export function assessment(
  testId: string,
  finding: TestFinding,
  criteria: CriterionAssessment[],
  analysis: string,
  status: "Reviewed" | "Provisional" = "Reviewed",
): TestAssessment {
  const applicable = criteria.filter((criterion) => criterion.score !== null);
  const earnedPoints = applicable.reduce((sum, criterion) => sum + (criterion.score ?? 0), 0);
  const possiblePoints = applicable.length * 4;
  const normalizedScore = possiblePoints === 0 ? null : Math.round((earnedPoints / possiblePoints) * 100);

  return {
    testId,
    finding,
    criteria,
    earnedPoints,
    possiblePoints,
    normalizedScore,
    analysis,
    editorialReview: { status, date: "2026-07-17" },
  };
}
