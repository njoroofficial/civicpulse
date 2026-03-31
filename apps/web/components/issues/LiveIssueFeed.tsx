// components/issues/LiveIssueFeed.tsx
// A Client Component that displays newly reported issues in real time.
// It renders independently from the cached issue list — the cached list
// shows historical issues, this component shows what is happening right now.
"use client";

import { useState, useCallback } from "react";
import { useSSE } from "@/hooks/useSSE";
import type { IssueMapPin } from "@civicpulse/shared";
import Link from "next/link";

// The maximum number of live issues to show before we stop accumulating.
// Beyond this, we show a "View all" prompt rather than an endless stream.
const MAX_LIVE_ISSUES = 5;

export function LiveIssueFeed() {
  // liveIssues accumulates issues received via SSE while the user is on the page.
  // When the user refreshes, the cache has been revalidated and includes these
  // new issues in the main list — the live feed then empties and starts fresh.
  const [liveIssues, setLiveIssues] = useState<IssueMapPin[]>([]);
  const [newCount, setNewCount] = useState(0);

  // useCallback is important here — this function is passed to useSSE and
  // stored in a ref. If we defined it inline in the JSX, a new reference
  // would be created on every render. Although the ref prevents reconnection,
  // a stable reference is cleaner and avoids any subtle closure issues.
  const handleNewIssue = useCallback((issue: IssueMapPin) => {
    setLiveIssues((prev) => {
      // Prevent duplicates — if this issue ID is already in the list, skip it.
      // This matters when the EventSource reconnects and we replay recent events.
      if (prev.some((existing) => existing.id === issue.id)) return prev;

      // Prepend the new issue and cap the list length
      const updated = [issue, ...prev].slice(0, MAX_LIVE_ISSUES);
      return updated;
    });

    // Track total count even beyond what we show — so we can display
    // "12 new issues while you were here" if the user stays a long time
    setNewCount((prev) => prev + 1);
  }, []);

  const { isConnected, error } = useSSE<IssueMapPin>({
    url: "/api/issues/stream",
    eventName: "new-issue",
    onMessage: handleNewIssue,
  });

  // If no live issues have arrived yet, show the connection status
  // so the user knows real-time updates are active
  if (liveIssues.length === 0) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
        style={{
          backgroundColor: "var(--color-background-muted)",
          color: "var(--color-text-muted)",
        }}
      >
        {/* Connection status indicator */}
        <span
          className={`
            w-2 h-2 rounded-full shrink-0
            ${isConnected ? "bg-green-500 animate-pulse" : "bg-neutral-400"}
          `}
          aria-hidden="true"
        />
        {error ? (
          <span style={{ color: "var(--color-status-rejected)" }}>{error}</span>
        ) : isConnected ? (
          <span>Listening for new issues in Nairobi...</span>
        ) : (
          <span>Connecting to live feed...</span>
        )}
      </div>
    );
  }

  return (
    <section aria-label="Newly reported issues" aria-live="polite">
      {/* Section header with live indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
            aria-hidden="true"
          />
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            JUST REPORTED
          </h2>
          {/* aria-live="polite" on the section above means screen readers
              announce new issues as they arrive — but 'politely', meaning
              they wait until the user is not currently interacting */}
        </div>
        {newCount > MAX_LIVE_ISSUES && (
          <Link
            href="/issues"
            className="text-xs hover:underline"
            style={{ color: "var(--color-brand-600)" }}
          >
            +{newCount - MAX_LIVE_ISSUES} more → View all
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {liveIssues.map((issue, index) => (
          <Link
            key={issue.id}
            href={`/issues/${issue.id}`}
            className="block card card-hover p-4"
            // The newest item (index 0) gets a subtle "new" highlight
            style={
              index === 0
                ? {
                    borderColor: "var(--color-brand-300)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-brand-50) 60%, var(--color-background-card))",
                  }
                : {}
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium text-sm leading-snug truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {issue.title}
                </p>
                {issue.location.ward && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    📍 {issue.location.ward}
                  </p>
                )}
              </div>
              {/* 'New' badge on the first item only */}
              {index === 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-brand-500) 15%, transparent)",
                    color: "var(--color-brand-700)",
                  }}
                >
                  NEW
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
