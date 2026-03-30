// components/issues/VoteButton.tsx
"use client";

import { useOptimistic, useState, useEffect, useTransition } from "react";

type VoteState = {
  count: number;
  hasVoted: boolean;
};

type VoteButtonProps = {
  issueId: string;
  initialVoteCount: number;
  onVote?: (issueId: string) => Promise<void>;
};

function getVoteStorageKey(issueId: string): string {
  return `civicpulse:voted:${issueId}`;
}

export function VoteButton({
  issueId,
  initialVoteCount,
  onVote,
}: VoteButtonProps) {
  // We still need regular state for the localStorage-persisted hasVoted,
  // because that represents ground truth from the browser's perspective.
  const [hasVoted, setHasVoted] = useState(false);

  // useTransition gives us isPending without managing it ourselves.
  // It marks the async operation as a "transition" — a lower-priority
  // update that React can interrupt if something more urgent comes along.
  // startTransition wraps the async work, isPending tells us it's running.
  const [isPending, startTransition] = useTransition();

  // useOptimistic takes the REAL state (the ground truth) and a reducer
  // function that describes how to compute the optimistic state.
  // React manages the two-reality reconciliation for us automatically.
  const [optimisticVoteState, addOptimisticVote] = useOptimistic(
    // The real state — what we know is true from the server
    { count: initialVoteCount, hasVoted },

    // The reducer — given current state and an update, return the optimistic state.
    // This is called synchronously and immediately when addOptimisticVote() fires.
    (currentState, _action: "vote") => ({
      count: currentState.count + 1,
      hasVoted: true,
    }),
  );

  useEffect(() => {
    const stored = localStorage.getItem(getVoteStorageKey(issueId));
    if (stored === "true") setHasVoted(true);
  }, [issueId]);

  function handleVote() {
    if (optimisticVoteState.hasVoted || isPending) return;

    // startTransition wraps the async work — this is the React 19 pattern
    // for kicking off a server mutation from a Client Component.
    startTransition(async () => {
      // addOptimisticVote fires IMMEDIATELY and synchronously.
      // The component re-renders right now showing count + 1 and hasVoted: true.
      // No await, no delay — the user sees the update instantly.
      addOptimisticVote("vote");

      try {
        await onVote?.(issueId);
        // If we get here, the server accepted the vote.
        // Persist the real hasVoted state and to localStorage.
        setHasVoted(true);
        localStorage.setItem(getVoteStorageKey(issueId), "true");
      } catch (error) {
        // We do NOT need to manually roll back the optimistic update.
        // When startTransition's async function rejects, React automatically
        // reverts optimisticVoteState to the real state ({ count: initialVoteCount, hasVoted }).
        // This is the entire point of useOptimistic — rollback is guaranteed.
        console.error("Vote failed:", error);
      }
    });
  }

  return (
    <button
      onClick={handleVote}
      disabled={optimisticVoteState.hasVoted || isPending}
      aria-label={
        optimisticVoteState.hasVoted
          ? "You voted for this issue"
          : "Vote for this issue"
      }
      aria-pressed={optimisticVoteState.hasVoted}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${
          optimisticVoteState.hasVoted
            ? "bg-green-600 text-white cursor-default"
            : "border border-green-600 text-green-600 hover:bg-green-50 active:scale-95"
        }
        ${isPending ? "opacity-70" : ""}
      `}
    >
      <span aria-hidden="true">{optimisticVoteState.hasVoted ? "▲" : "△"}</span>
      <span>
        {/* We read from optimisticVoteState, not from the raw count prop.
            This is what makes the UI feel instant — it reflects the
            optimistic reality, not the server's current truth. */}
        {optimisticVoteState.count.toLocaleString()}
        <span className="sr-only"> votes</span>
      </span>
    </button>
  );
}
