// app/(public)/issues/page.tsx
"use cache";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import Link from "next/link";
import { IssueCard } from "@/components/issues/IssueCard";
import { LiveIssueFeed } from "@/components/issues/LiveIssueFeed";
import type { Issue } from "@civicpulse/shared";
import { IssueStatus, IssueCategory } from "@civicpulse/shared";

export const metadata: Metadata = {
  title: "Issues",
  description: "Browse all reported infrastructure issues in Nairobi.",
};

async function getIssues(): Promise<Issue[]> {
  "use cache";
  cacheLife("minutes");

  // Placeholder data shaped exactly like our shared Issue type
  // When we wire up FastAPI in Week 12, only this function changes
  return [
    {
      id: "1",
      title: "Large pothole on Ngong Road near Junction Mall",
      description:
        "A very large and deep pothole approximately 1 metre wide on the southbound lane of Ngong Road, roughly 200m before Junction Mall.",
      category: IssueCategory.ROAD_INFRASTRUCTURE,
      status: IssueStatus.PENDING,
      location: {
        latitude: -1.2921,
        longitude: 36.7819,
        ward: "Kilimani Ward",
        county: "Nairobi County",
        address: "Ngong Road, near Junction Mall",
      },
      voteCount: 234,
      reportedBy: "user-001",
      photoUrls: ["https://example.com/photo1.jpg"],
      createdAt: new Date("2026-03-01"),
      updatedAt: new Date("2026-03-01"),
    },
    {
      id: "2",
      title: "Water pipe burst — Westlands Avenue flooding road",
      description:
        "A burst water pipe has been flooding the road for three days causing traffic chaos.",
      category: IssueCategory.WATER_SANITATION,
      status: IssueStatus.IN_PROGRESS,
      location: {
        latitude: -1.2678,
        longitude: 36.8034,
        ward: "Westlands Ward",
        county: "Nairobi County",
        address: "Westlands Avenue",
      },
      voteCount: 187,
      reportedBy: "user-002",
      photoUrls: [],
      createdAt: new Date("2026-03-02"),
      updatedAt: new Date("2026-03-03"),
    },
    {
      id: "3",
      title: "Broken street lights along entire Hurlingham stretch",
      description:
        "All street lights on the main Hurlingham road have been out for two weeks. Very dangerous at night.",
      category: IssueCategory.ELECTRICITY,
      status: IssueStatus.UNDER_REVIEW,
      location: {
        latitude: -1.2996,
        longitude: 36.7838,
        ward: "Dagoretti North Ward",
        county: "Nairobi County",
        address: "Hurlingham Road",
      },
      voteCount: 95,
      reportedBy: "user-003",
      photoUrls: [
        "https://example.com/photo2.jpg",
        "https://example.com/photo3.jpg",
      ],
      createdAt: new Date("2026-03-05"),
      updatedAt: new Date("2026-03-05"),
    },
  ];
}

export default async function IssuesPage() {
  const issues = await getIssues();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Community Issues
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {issues.length} issues reported by Nairobi citizens
          </p>
        </div>
        <Link href="/report" className="btn-primary">
          + Report Issue
        </Link>
      </div>

      {/*
        Two-column layout on larger screens — live feed in a sidebar,
        full issue list in the main column.
        On mobile (small screens), the live feed stacks above the list.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main column — cached, server-rendered issue list */}
        <div className="flex flex-col gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>

        {/* Sidebar — real-time live feed */}
        {/* This entire aside is NOT cached — it is a Client Component that
            establishes its own SSE connection. The page itself is cached,
            but this section is excluded from the cache because it has
            the "use client" directive in its component definition. 
            
            Next.js 16 handles this correctly: the cached page HTML omits
            the LiveIssueFeed output (it renders as an empty placeholder),
            and the client hydrates and starts the SSE connection.
            This is the Cache Components model working exactly as intended. */}
        <aside className="lg:sticky lg:top-24">
          <LiveIssueFeed />
        </aside>
      </div>
    </div>
  );
}
