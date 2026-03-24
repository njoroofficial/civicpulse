// app/(public)/issues/[id]/error.tsx
"use client";

import { useEffect } from "react";

export default function IssueDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Issue detail error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold mb-2">Issue unavailable</h2>
      <p className="text-muted-foreground mb-8">
        This issue couldn't be loaded. It may have been removed, or there may be
        a temporary server problem.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Retry
        </button>
        <a
          href="/issues"
          className="border border-border px-5 py-2.5 rounded-lg font-medium hover:bg-accent transition-colors"
        >
          All Issues
        </a>
      </div>
    </div>
  );
}
