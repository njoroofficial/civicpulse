// app/(dashboard)/dashboard/layout.tsx
// This layout receives three props:
//   - children: the content of dashboard/page.tsx
//   - stats: the content of @stats/page.tsx
//   - issuetable: the content of @issuetable/page.tsx
// All three render simultaneously, each with their own Suspense boundary.
// If @issuetable is slow, @stats still renders — they're independent.

"use client";

import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardLayout({
  children,
  stats,
  issuetable,
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  issuetable: React.ReactNode;
}) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const previousTheme = theme;

    setTheme("light");

    return () => {
      setTheme(previousTheme);
    };
  }, [setTheme]);
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Dashboard header */}
      <header
        className="border-b sticky top-0 z-50"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="container h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold">🏙️ CivicPulse</span>
            <span style={{ color: "var(--color-text-muted)" }}>/</span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Officials Dashboard
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* children renders the dashboard/page.tsx heading */}
        {children}

        {/* Stats panel — renders immediately when its data is ready,
            independently of whether issuetable has loaded */}
        <div>{stats}</div>

        {/* Issue table — may load more slowly, but doesn't block stats */}
        <div>{issuetable}</div>
      </div>
    </div>
  );
}
