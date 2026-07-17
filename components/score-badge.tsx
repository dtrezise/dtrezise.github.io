"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { TestAssessment, TestDefinition } from "@/data/models";
import { scoreBand } from "@/data/models";
import { testPath } from "@/lib/site";

export function ScoreBadge({ assessment, test }: { assessment: TestAssessment; test: TestDefinition }) {
  const [tappedOpen, setTappedOpen] = useState(false);
  const touchRef = useRef(false);
  const popoverId = useId();
  const score = assessment.normalizedScore;

  return (
    <span className={`score-cluster ${tappedOpen ? "is-open" : ""}`} style={{ "--test-color": test.color } as React.CSSProperties}>
      <Link
        className="score-badge"
        href={testPath(test.slug, test.rubricAnchor)}
        aria-describedby={popoverId}
        onPointerDown={(event) => { touchRef.current = event.pointerType === "touch"; }}
        onClick={(event) => {
          if (touchRef.current && !tappedOpen) {
            event.preventDefault();
            setTappedOpen(true);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setTappedOpen(false);
            event.currentTarget.blur();
          }
        }}
      >
        <strong>{score === null ? "N/A" : score}</strong>
        <span>{score === null ? "Not scored" : scoreBand(score)}</span>
      </Link>
      <span className="score-popover" id={popoverId} role="tooltip">
        <span className="score-popover__top">
          <strong>{test.name}</strong>
          <em>{assessment.finding}</em>
        </span>
        <span className="score-popover__math">
          {assessment.earnedPoints}/{assessment.possiblePoints || 0} applicable points
          {score === null ? " · No direct criteria" : ` · ${score}/100`}
        </span>
        <span className="score-popover__criteria">
          {assessment.criteria.map((criterion) => {
            const definition = test.criteria.find((item) => item.id === criterion.criterionId);
            return (
              <span key={criterion.criterionId}>
                <b>{criterion.score === null ? "N/A" : criterion.score}</b>
                <span><strong>{definition?.name}</strong>{criterion.rationale}</span>
              </span>
            );
          })}
        </span>
        <span className="score-popover__link">Click again to open the complete rubric →</span>
      </span>
    </span>
  );
}
