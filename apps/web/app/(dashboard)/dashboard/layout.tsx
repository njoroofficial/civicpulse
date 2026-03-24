// app/(dashboard)/dashboard/layout.tsx
// This layout receives three props:
//   - children: the content of dashboard/page.tsx
//   - stats: the content of @stats/page.tsx
//   - issuetable: the content of @issuetable/page.tsx
// All three render simultaneously, each with their own Suspense boundary.
// If @issuetable is slow, @stats still renders — they're independent.

export default function DashboardLayout({
  children,
  stats,
  issuetable,
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  issuetable: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Dashboard header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-6 h-14 flex items-center gap-4">
          <a href="/" className="font-bold text-lg">
            🏙️ CivicPulse
          </a>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Officials Dashboard</span>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* children renders the dashboard/page.tsx heading */}
        {children}

        {/* Stats panel — renders immediately when its data is ready,
            independently of whether issuetable has loaded */}
        <div>{stats}</div>

        {/* Issue table — may load more slowly, but doesn't block stats */}
        <div>{issuetable}</div>
      </div>
    </div>
  );
}
