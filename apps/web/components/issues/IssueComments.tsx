// components/issues/IssueComments.tsx
// A Client Component that receives a Promise of comments from a Server Component parent.
// This pattern is called "passing a promise as a prop" — it lets the server
// start the fetch before the client component even mounts.
"use client";

import { use } from "react";
import type { Comment } from "@civicpulse/shared";

type IssueCommentsProps = {
  // Notice: the prop type is Promise<Comment[]>, not Comment[].
  // The Server Component parent passes the unfulfilled Promise directly.
  commentsPromise: Promise<Comment[]>;
};

export function IssueComments({ commentsPromise }: IssueCommentsProps) {
  // use() suspends this component until the Promise resolves.
  // While suspended, the nearest Suspense boundary (our loading.tsx) renders.
  // When resolved, this component re-renders with the actual comments array.
  // There is no useEffect, no useState, no isLoading flag — just the data.
  const comments = use(commentsPromise);

  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No updates yet. Officials will post progress notes here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`p-4 rounded-lg border ${
            comment.isOfficialUpdate
              ? // Official updates get a distinct visual treatment —
                // they carry institutional weight and should look authoritative
                "border-green-200 bg-green-50"
              : "border-border bg-background"
          }`}
        >
          {comment.isOfficialUpdate && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Official Update
              </span>
              <span className="text-xs text-green-600">🏛️ Nairobi County</span>
            </div>
          )}
          <p className="text-sm leading-relaxed">{comment.content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(comment.createdAt).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
