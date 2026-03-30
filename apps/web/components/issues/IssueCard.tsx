// components/issues/IssueCard.tsx
// It composes StatusBadge and CategoryTag (both Server Components)
// and VoteButton (a Client Component passed as a child effectively).
//
// ARCHITECTURE NOTE:
// IssueCard receives a VoteButton as a composed child rather than
// rendering it directly. This pattern — "passing client leaves into
// server trees" — keeps the server/client boundary clean and explicit.

import Link from "next/link";
import type { Issue } from "@civicpulse/shared";
import { StatusBadge } from "./StatusBadge";
import { CategoryTag } from "./CategoryTag";
import { VoteButton } from "./VoteButton";

type IssueCardProps = {
  issue: Issue;
  // 'variant' controls the visual density of the card
  // 'list' is the default compact view for the issues list page
  // 'featured' is a larger format for highlighted issues on the homepage
  variant?: "list" | "featured";
};

export function IssueCard({ issue, variant = "list" }: IssueCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article className={`card card-hover group ${isFeatured ? "p-8" : "p-6"}`}>
      {/* Card header — title row with status badge */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <Link
          href={`/issues/${issue.id}`}
          className={`
            font-semibold leading-tight transition-colors
            group-hover:text-(--color-brand-600)
            ${isFeatured ? "text-2xl" : "text-lg"}
          `}
          style={{ color: "var(--color-text-primary)" }}
        >
          {/* group-hover on the parent article applies a style to this link
              when the CARD is hovered — not just the link itself.
              This makes the entire card feel clickable. */}
          {issue.title}
        </Link>
        <div className="shrink-0">
          <StatusBadge status={issue.status} size={isFeatured ? "md" : "sm"} />
        </div>
      </div>

      {/* Description — only shown in featured variant */}
      {isFeatured && issue.description && (
        <p
          className="leading-relaxed mb-4 line-clamp-3"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {issue.description}
        </p>
      )}

      {/* Metadata row — category, location */}
      <div className="flex items-center gap-4 mb-4">
        <CategoryTag category={issue.category} />
        {issue.location.ward && (
          <span
            className="text-sm flex items-center gap-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span aria-hidden="true">📍</span>
            {issue.location.ward}
          </span>
        )}
      </div>

      {/* Card footer — vote button + additional metadata */}
      <div
        className="flex items-center justify-between pt-3 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <VoteButton issueId={issue.id} initialVoteCount={issue.voteCount} />

        {/* Photo count indicator — if the issue has photos attached */}
        {issue.photoUrls.length > 0 && (
          <span
            className="text-xs flex items-center gap-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span aria-hidden="true">📷</span>
            {issue.photoUrls.length} photo
            {issue.photoUrls.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </article>
  );
}
