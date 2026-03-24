// app/(public)/issues/page.tsx
// The issue list page — accessible at '/issues'.
//
// CRITICAL CONCEPT: The "use cache" directive.
// When you add "use cache" at the top of a file or inside a function,
// Next.js caches the result of that component/function.
// The FIRST request renders it fresh, stores the result, and subsequent
// requests get the cached version instantly — no server round-trip.
//
// For CivicPulse, the issue list is a perfect candidate for caching
// because: (a) it's the most visited page, (b) a slight delay in
// showing new issues is acceptable, (c) we can invalidate the cache
// explicitly when a new issue is submitted.

"use cache"; // ← This single directive transforms this into a cached page

import type { Metadata } from "next";
import { cacheLife } from "next/cache"; // Next.js 16 cache configuration API

export const metadata: Metadata = {
  title: "Issues",
  description: "Browse all reported infrastructure issues in Nairobi.",
};

// Placeholder type — will be replaced with import from @civicpulse/shared
// once we wire up the package in the next step
type PlaceholderIssue = {
  id: string;
  title: string;
  category: string;
  status: string;
  voteCount: number;
  location: { ward: string };
};

// This simulates what we'll eventually fetch from our FastAPI backend
async function getIssues(): Promise<PlaceholderIssue[]> {
  // 'use cache' inside a function caches just this function's result,
  // not the entire component. This is more granular and powerful.
  "use cache";

  // Tell Next.js how long to cache this data.
  // cacheLife("minutes") = cache for a few minutes before revalidating.
  // Other options: "seconds", "hours", "days", "weeks", "max"
  cacheLife("minutes");

  // In Week 12, this becomes:
  // return await fetch(`${process.env.API_URL}/api/v1/issues`).then(r => r.json())
  return [
    {
      id: "1",
      title: "Large pothole on Ngong Road near Junction Mall",
      category: "road_infrastructure",
      status: "pending",
      voteCount: 234,
      location: { ward: "Kilimani Ward" },
    },
    {
      id: "2",
      title: "Water pipe burst — Westlands Avenue",
      category: "water_sanitation",
      status: "in_progress",
      voteCount: 187,
      location: { ward: "Westlands Ward" },
    },
    {
      id: "3",
      title: "Broken street lights — Hurlingham",
      category: "electricity",
      status: "under_review",
      voteCount: 95,
      location: { ward: "Dagoretti North Ward" },
    },
  ];
}

// A mapping from status strings to human-readable labels and colours.
// This is a presentation concern — it belongs here, not in the shared types.
const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  under_review: {
    label: "Under Review",
    className: "bg-blue-100 text-blue-800",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-800",
  },
  resolved: { label: "Resolved", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
};

export default async function IssuesPage() {
  // Because getIssues() is cached, this await resolves instantly on
  // subsequent requests — the component doesn't block on data fetching
  const issues = await getIssues();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Issues</h1>
          <p className="text-muted-foreground mt-1">
            {issues.length} issues reported by Nairobi citizens
          </p>
        </div>
        <a
          href="/report"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + Report Issue
        </a>
      </div>

      <div className="flex flex-col gap-4">
        {issues.map((issue) => {
          const status = statusConfig[issue.status] ?? statusConfig.pending;
          return (
            <a
              key={issue.id}
              href={`/issues/${issue.id}`}
              className="block p-6 rounded-xl border border-border hover:border-green-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg leading-tight mb-2">
                    {issue.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>📍 {issue.location.ward}</span>
                    <span>•</span>
                    <span className="capitalize">
                      {issue.category.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${status?.className}`}
                  >
                    {status?.label}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    ▲ {issue.voteCount} votes
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
