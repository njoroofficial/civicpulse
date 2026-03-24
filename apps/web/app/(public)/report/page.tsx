// app/(public)/report/page.tsx
// The FULL reporting page — shown on direct navigation or hard refresh.
// We'll build the complete multi-step form here in Week 6.
// For now, a clear placeholder that shows the structure.

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
      <p className="text-muted-foreground mb-8">
        Help improve Nairobi by reporting infrastructure problems in your area.
      </p>
      <div className="p-8 rounded-xl border border-border">
        <p className="text-muted-foreground text-center">
          Multi-step reporting form — coming in Week 6
        </p>
      </div>
    </div>
  );
}
