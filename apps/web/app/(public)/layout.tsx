// app/(public)/layout.tsx
// This layout wraps only the public routes: /, /issues, /issues/[id]
// It adds the public navigation header. Because it's nested inside the
// root layout, the HTML/body structure is already provided — we only
// need to add the UI structure specific to public pages.

// Notice: still a Server Component (no "use client").
// The navigation bar is rendered on the server — no client JavaScript
// needed just to display a nav bar with links.

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";

export default function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <header
        className="border-b sticky top-0 z-50 backdrop-blur"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor:
            "color-mix(in srgb, var(--color-background) 95%, transparent)",
        }}
      >
        <div className="container h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg"
            style={{ color: "var(--color-text-primary)" }}
          >
            🏙️ CivicPulse
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/issues"
              className="text-sm transition-colors hover:text-(--color-brand-600)"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Issues
            </Link>
            <Link
              href="/report"
              className="text-sm transition-colors hover:text-(--color-brand-600)"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Report Issue
            </Link>
            <Link
              href="/login"
              className="text-sm transition-colors hover:text-(--color-brand-600)"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Sign In
            </Link>

            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>{children}</main>
      {modal}
    </div>
  );
}
