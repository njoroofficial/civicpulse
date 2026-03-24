// app/(public)/issues/error.tsx
// MUST be a Client Component because it uses the 'reset' callback,
// which needs to trigger a re-render via browser interaction.
// error.tsx is automatically given two props by Next.js:
//   - error: the Error object that was thrown
//   - reset: a function that attempts to re-render the failed subtree
"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  // 'digest' is a hash of the error that appears in your server logs.
  // In production, you never show raw error messages to users (security risk).
  // But you CAN show the digest, which your team can then look up in logs.
  reset: () => void;
};

export default function IssuesError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // In a real application, this is where you'd log to Sentry:
    // Sentry.captureException(error);
    // For now, we log to the console — we add Sentry in Week 22.
    console.error("Issues page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        {/* An error state that's honest but not alarming */}
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Couldn't load issues</h2>
        <p className="text-muted-foreground mb-8">
          We had trouble connecting to the server. This is usually temporary —
          please try again.
        </p>

        {/* In development, show the error message for debugging.
            In production (NODE_ENV === 'production'), hide it — never expose
            internal error messages to end users. */}
        {process.env.NODE_ENV === "development" && (
          <details className="text-left text-sm bg-muted p-4 rounded-lg mb-6">
            <summary className="cursor-pointer font-medium mb-2">
              Developer details
            </summary>
            <code className="text-red-600 break-all">{error.message}</code>
            {error.digest && (
              <p className="text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </details>
        )}

        <div className="flex gap-3 justify-center">
          {/* reset() asks Next.js to try rendering the page again.
              This works for transient errors like network timeouts. */}
          <button
            onClick={reset}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
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
