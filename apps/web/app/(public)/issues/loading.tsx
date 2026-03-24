// app/(public)/issues/loading.tsx
// This component renders IMMEDIATELY when a user navigates to /issues,
// before any data fetching has started. Next.js streams this HTML to the
// browser first, then replaces it with the real page once data is ready.
//
// The key principle: match the skeleton's shape to the real content.
// The user should feel like the content is "filling in", not "appearing from nowhere".

// A reusable skeleton pulse element — the 'animate-pulse' Tailwind class
// creates a gentle fade in/out animation that signals "loading" to the user
function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-md ${className}`} />;
}

// A skeleton that matches the exact structure of one IssueCard
function IssueCardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Mimics the issue title — wide, prominent */}
          <SkeletonLine className="h-6 w-3/4" />
          {/* Mimics the location + category meta row */}
          <div className="flex gap-3">
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-4 w-32" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Mimics the status badge */}
          <SkeletonLine className="h-6 w-20 rounded-full" />
          {/* Mimics the vote count */}
          <SkeletonLine className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function IssuesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mimics the page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <SkeletonLine className="h-9 w-48" />
          <SkeletonLine className="h-5 w-32" />
        </div>
        <SkeletonLine className="h-10 w-32 rounded-lg" />
      </div>

      {/* Render 5 skeleton cards — matches the expected number of results */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <IssueCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
