// app/(dashboard)/dashboard/@stats/page.tsx
// This renders in the {stats} slot. It fetches its own data independently.
// We simulate slower data (officials analytics are more complex to compute)

import { cacheLife } from "next/cache";

async function getDashboardStats() {
  "use cache";
  cacheLife("minutes");

  // Simulated data — real data comes from FastAPI in Week 12
  return {
    totalIssues: 1247,
    pendingIssues: 413,
    resolvedThisMonth: 89,
    avgResolutionDays: 12.4,
  };
}

export default async function StatsSlot() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-4 gap-4">
      {[
        { label: "Total Issues", value: stats.totalIssues.toLocaleString() },
        {
          label: "Pending Review",
          value: stats.pendingIssues.toLocaleString(),
        },
        {
          label: "Resolved This Month",
          value: stats.resolvedThisMonth.toLocaleString(),
        },
        { label: "Avg. Resolution", value: `${stats.avgResolutionDays}d` },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="bg-background p-5 rounded-xl border border-border"
        >
          <div className="text-2xl font-bold text-green-600">{value}</div>
          <div className="text-sm text-muted-foreground mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
