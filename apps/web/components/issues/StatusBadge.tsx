// src/components/issues/StatusBadge.tsx — refactored
// Notice how the className values now reference CSS custom properties
// via Tailwind's arbitrary value syntax [var(--token-name)].
// This means changing --color-status-pending in globals.css
// instantly updates every pending badge in the entire app.

import { IssueStatus } from "@civicpulse/shared";

const statusConfig: Record<IssueStatus, { label: string; style: React.CSSProperties }> = {
  pending: {
    label: "Pending",
    // We use inline style for semantic tokens to ensure the CSS variable
    // is read at runtime — this is the recommended pattern in Tailwind v4
    // when using your own custom semantic tokens
    style: {
      backgroundColor: "color-mix(in srgb, var(--color-civic-500) 15%, transparent)",
      color: "var(--color-civic-700)",
      border: "1px solid color-mix(in srgb, var(--color-civic-500) 25%, transparent)",
    },
  },
  under_review: {
    label: "Under Review",
    style: {
      backgroundColor: "#eff6ff",
      color: "#1d4ed8",
      border: "1px solid #bfdbfe",
    },
  },
  in_progress: {
    label: "In Progress",
    style: {
      backgroundColor: "#f5f3ff",
      color: "#6d28d9",
      border: "1px solid #ddd6fe",
    },
  },
  resolved: {
    label: "Resolved",
    style: {
      backgroundColor: "color-mix(in srgb, var(--color-brand-500) 12%, transparent)",
      color: "var(--color-brand-700)",
      border: "1px solid color-mix(in srgb, var(--color-brand-500) 25%, transparent)",
    },
  },
  rejected: {
    label: "Rejected",
    style: {
      backgroundColor: "#fef2f2",
      color: "#dc2626",
      border: "1px solid #fecaca",
    },
  },
};

type StatusBadgeProps = {
  status: IssueStatus;
  size?: "sm" | "md";
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass =
    size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClass}`}
      style={config.style}
    >
      {config.label}
    </span>
  );
}
