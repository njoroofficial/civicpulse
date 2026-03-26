// components/issues/StatusBadge.tsx

// It renders purely based on its props, produces static HTML,
// and sends zero JavaScript to the browser.
// This is the ideal component: stateless, pure, server-rendered.

import { IssueStatus } from "@civicpulse/shared";

// We define the visual config for each status here, co-located
// with the component that uses it. This is intentional —
// presentation concerns belong near the presentation layer.
const statusConfig: Record<IssueStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    under_review: {
      label: "Under Review",
      className: "bg-blue-100 text-blue-800 border border-blue-200",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-purple-100 text-purple-800 border border-purple-200",
    },
    resolved: {
      label: "Resolved",
      className: "bg-green-100 text-green-800 border border-green-200",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 border border-red-200",
    },
  };

type StatusBadgeProps = {
  status: IssueStatus;
  // 'size' is a union of string literals — TypeScript will error
  // if you pass any string other than "sm" or "md"
  size?: "sm" | "md";
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];

  const sizeClass =
    size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${sizeClass}
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}
