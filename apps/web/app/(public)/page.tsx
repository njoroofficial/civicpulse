// app/(public)/page.tsx
// This is the homepage — accessible at the root URL '/'.
// It lives inside (public) which gives it the public layout with the nav bar.
//
// KEY CONCEPT: This is an async Server Component.
// In traditional React, you'd use useEffect + useState to fetch data.
// Here, you just write 'async' and 'await' directly in the component.
// The data fetching happens on the SERVER — the browser receives
// fully-rendered HTML, not a loading spinner followed by data.

import type { Metadata } from "next";

// The 'metadata' export overrides the root layout's default metadata
// specifically for this page. The title template means this renders as
// "Home | CivicPulse" in the browser tab.
export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  // In a few weeks, this will fetch real data from our FastAPI backend.
  // For now, we hardcode placeholder data to establish the component structure.
  // The shape of this data matches our Issue type from @civicpulse/shared.
  const stats = {
    totalIssues: 1247,
    resolvedIssues: 834,
    activeVoters: 5621,
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Your city. Your voice.
          <br />
          <span className="text-green-600">Your responsibility.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Report infrastructure issues in Nairobi, vote on what matters most to
          your community, and watch the government resolve them — transparently,
          in real time.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/report"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Report an Issue
          </a>
          <a
            href="/issues"
            className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            View All Issues
          </a>
        </div>
      </section>

      {/* Stats Section — server-rendered, no loading state needed */}
      <section className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center p-6 rounded-xl border border-border">
          <div className="text-3xl font-bold text-green-600">
            {stats.totalIssues.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Issues Reported
          </div>
        </div>
        <div className="text-center p-6 rounded-xl border border-border">
          <div className="text-3xl font-bold text-green-600">
            {stats.resolvedIssues.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Resolved</div>
        </div>
        <div className="text-center p-6 rounded-xl border border-border">
          <div className="text-3xl font-bold text-green-600">
            {stats.activeVoters.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Active Citizens
          </div>
        </div>
      </section>
    </div>
  );
}
