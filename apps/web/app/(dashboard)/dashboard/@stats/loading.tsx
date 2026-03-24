// app/(dashboard)/dashboard/@stats/loading.tsx
export default function StatsLoading() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-background p-5 rounded-xl border border-border space-y-2"
        >
          <div className="bg-muted animate-pulse rounded h-8 w-20" />
          <div className="bg-muted animate-pulse rounded h-4 w-32" />
        </div>
      ))}
    </div>
  );
}
