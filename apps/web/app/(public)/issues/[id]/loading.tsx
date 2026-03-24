// app/(public)/issues/[id]/loading.tsx

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-md ${className}`} />;
}

export default function IssueDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back link skeleton */}
      <SkeletonLine className="h-4 w-24 mb-6" />

      <div className="p-8 rounded-xl border border-border space-y-6">
        {/* Title + status badge row */}
        <div className="flex items-start justify-between gap-4">
          <SkeletonLine className="h-8 w-2/3" />
          <SkeletonLine className="h-7 w-20 rounded-full" />
        </div>

        {/* Description — three lines of text */}
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-4/5" />
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-5 w-36" />
            <SkeletonLine className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-5 w-32" />
            <SkeletonLine className="h-4 w-24" />
          </div>
        </div>

        {/* Vote section */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <SkeletonLine className="h-8 w-40" />
          <SkeletonLine className="h-10 w-44 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
