// app/not-found.tsx
// This file renders whenever notFound() is called anywhere in the application,
// OR when a user visits a URL that doesn't match any route.
// Next.js automatically returns a 404 HTTP status code when this renders.
//
// Unlike error.tsx, this does NOT need to be a Client Component —
// it has no interactive reset logic, just static content and navigation links.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-muted-foreground/20 mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist, or the issue may have been
          removed from CivicPulse.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/issues"
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Browse Issues
          </a>
          <a
            href="/"
            className="border border-border px-6 py-2.5 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
