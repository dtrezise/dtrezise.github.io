export const archiveWideReviewDate = "2026-07-17";
export const mostRecentRecordReviewDate = "2026-10-07";
export const reviewCycleDays = 30;

export const editorialStandards = [
  ["Source hierarchy", "Primary records lead. Reporting supplies context, response, and implementation detail."],
  ["Claim boundaries", "Records distinguish fact, status, attribution, analysis, and unresolved allegation."],
  ["Correction discipline", "Material changes are appended to the revision record; prior wording is not silently erased."],
  ["Historical restraint", "Mechanisms are compared without identity claims, inevitability claims, or historical equivalence."],
  ["Review cadence", "Live legal, election, enforcement, and institutional records are monitored for status changes and stale review dates."],
] as const;

export const publicationLimits = [
  "This temporary archive does not yet accept submissions through the site. A verified correction and response channel is required before broad public promotion.",
  "A record may be current in one respect and stale in another; the last-checked label applies only to the record as written.",
  "Automated monitoring may identify a lead or status change, but no claim is published without source and editorial review.",
] as const;
