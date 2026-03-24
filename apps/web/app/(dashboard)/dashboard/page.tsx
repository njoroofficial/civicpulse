// app/(dashboard)/dashboard/page.tsx
// This renders in the {children} slot of the dashboard layout.
// It contains the page heading and any non-async content.

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics Overview</h1>
      <p className="text-muted-foreground mt-1">
        Nairobi County Infrastructure Dashboard
      </p>
    </div>
  );
}
