// app/(dashboard)/dashboard/@issuetable/loading.tsx
export default function IssueTableLoading() {
  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="bg-muted animate-pulse rounded h-5 w-48" />
      </div>
      <div className="p-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-6">
            <div className="bg-muted animate-pulse rounded h-4 flex-1" />
            <div className="bg-muted animate-pulse rounded h-4 w-24" />
            <div className="bg-muted animate-pulse rounded h-4 w-16" />
            <div className="bg-muted animate-pulse h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
