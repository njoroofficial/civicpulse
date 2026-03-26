// components/issues/VoteButton.tsx
// "use client" is placed here — on the LEAF component that needs interactivity.
// The IssueCard that contains this button remains a Server Component.
// Only this small piece of JavaScript ships to and runs in the browser.
"use client";

import { useState } from "react";

type VoteButtonProps = {
  issueId: string;
  initialVoteCount: number;
  // We'll replace this with a real Server Action in Week 7
  // For now, it accepts an optional callback for future wiring
  onVote?: (issueId: string) => Promise<void>;
};

export function VoteButton({
  issueId,
  initialVoteCount,
  onVote,
}: VoteButtonProps) {
  // useState lives here — this is why we need "use client"
  // 'hasVoted' tracks whether THIS user has voted in this session
  // In Week 5 we'll persist this in the database
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [isPending, setIsPending] = useState(false);

  async function handleVote() {
    // Optimistic update — update the UI immediately, before the
    // server confirms. This makes the app feel instant.
    // If the server call fails, we roll back below.
    if (hasVoted) return; // prevent double-voting

    setHasVoted(true);
    setVoteCount((prev) => prev + 1); // optimistic increment

    try {
      setIsPending(true);
      // If an onVote callback was provided, call it
      // This is where the real API call will live in Week 5
      await onVote?.(issueId);
    } catch (error) {
      // Rollback the optimistic update on failure
      // The user sees their vote "un-do" itself, which is honest UX
      setHasVoted(false);
      setVoteCount((prev) => prev - 1);
      console.error("Vote failed:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={hasVoted || isPending}
      aria-label={hasVoted ? "You voted for this issue" : "Vote for this issue"}
      aria-pressed={hasVoted}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${
          hasVoted
            ? // Voted state — green, filled, disabled appearance
              "bg-green-600 text-white cursor-default"
            : // Default state — outlined, hoverable
              "border border-green-600 text-green-600 hover:bg-green-50 active:scale-95"
        }
        ${isPending ? "opacity-70" : ""}
      `}
    >
      {/* The triangle arrow flips direction based on voted state */}
      <span aria-hidden="true">{hasVoted ? "▲" : "△"}</span>
      <span>
        {voteCount.toLocaleString()}
        <span className="sr-only"> votes</span>
      </span>
      {isPending && (
        <span className="sr-only" aria-live="polite">
          Saving your vote...
        </span>
      )}
    </button>
  );
}
