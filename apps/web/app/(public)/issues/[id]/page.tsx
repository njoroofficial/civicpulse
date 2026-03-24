// app/(public)/issues/[id]/page.tsx
// Dynamic route — accessible at '/issues/1', '/issues/2', etc.
// The folder name [id] tells Next.js this segment is dynamic.
// Next.js passes it to the component as the 'params' prop.
//
// generateMetadata is an async function that runs BEFORE the page renders.
// It lets you set dynamic meta tags based on the actual data —
// so the browser tab shows "Pothole on Ngong Road | CivicPulse"
// instead of just "Issue | CivicPulse".

import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Next.js 16: params is now a Promise — you must await it.
// This was one of the breaking changes from Next.js 14→15→16.
// The reason: Next.js defers computing params to enable streaming,
// so they're not synchronously available when the component first runs.
type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params; // await params — this is the Next.js 16 pattern

  // In production, we'd fetch the real issue title here for the meta tag.
  // For now, we use a placeholder.
  return {
    title: `Issue #${id}`,
    description: `View details and status of community issue #${id}`,
  };
}

export default async function IssueDetailPage({ params }: PageProps) {
  const { id } = await params;

  // In a future week, this will be a real fetch to our FastAPI backend.
  // The notFound() function is a Next.js utility that renders the nearest
  // not-found.tsx file and returns a 404 HTTP status — never throw a raw error
  // for a missing resource.
  const mockIssue = {
    id,
    title: "Large pothole on Ngong Road near Junction Mall",
    description:
      "There is a very large and deep pothole approximately 1 metre wide on the southbound lane of Ngong Road, roughly 200m before the Junction Mall entrance. It has caused at least 3 tyre blowouts this week and is a serious safety hazard, especially at night when it is invisible.",
    category: "road_infrastructure",
    status: "pending",
    voteCount: 234,
    location: {
      ward: "Kilimani Ward",
      county: "Nairobi County",
      address: "Ngong Road, near Junction Mall",
    },
    reportedBy: "John Kamau",
    createdAt: new Date("2026-03-01"),
  };

  // If the issue doesn't exist, render 404 — not a crash
  if (!mockIssue) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <a
          href="/issues"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to all issues
        </a>
      </div>

      <div className="p-8 rounded-xl border border-border">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold leading-tight">
            {mockIssue.title}
          </h1>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full shrink-0">
            Pending
          </span>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-8">
          {mockIssue.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Location</span>
            <p className="font-medium">{mockIssue.location.address}</p>
            <p className="text-muted-foreground">{mockIssue.location.ward}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Reported by</span>
            <p className="font-medium">{mockIssue.reportedBy}</p>
            <p className="text-muted-foreground">
              {mockIssue.createdAt.toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">
            ▲ {mockIssue.voteCount} community votes
          </div>
          {/* We'll wire up real voting with optimistic updates in Week 5 */}
          <button className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Vote — This Needs Fixing
          </button>
        </div>
      </div>
    </div>
  );
}
