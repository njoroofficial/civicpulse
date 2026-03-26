// app/(public)/issues/page.tsx
"use cache";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { IssueCard } from "@/components/issues/IssueCard";
import type { Issue } from "@civicpulse/shared";
import { IssueStatus, IssueCategory } from "@civicpulse/shared";
import Link from "next/link";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Issues</h1>
          <p className="text-muted-foreground mt-1">
            {issues.length} issues reported by Nairobi citizens
          </p>
        </div>
        <Link
          href="/report"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + Report Issue
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {issues.map((issue) => (
          // IssueCard is a Server Component rendering a Client Component (VoteButton) inside it.
          // The key prop tells React which list item is which during reconciliation.
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
