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
import { Hero } from "@/components/layout/Hero";

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

  const stats = [
    { value: "1,247", label: "Issues Reported" },
    { value: "834", label: "Resolved" },
    { value: "5,621", label: "Active Citizens" },
  ];

  return <Hero stats={stats} />;
}
