// app/(public)/layout.tsx
// This layout wraps only the public routes: /, /issues, /issues/[id]
// It adds the public navigation header. Because it's nested inside the
// root layout, the HTML/body structure is already provided — we only
// need to add the UI structure specific to public pages.

// Notice: still a Server Component (no "use client").
// The navigation bar is rendered on the server — no client JavaScript
// needed just to display a nav bar with links.

export default function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-bold text-lg">
            🏙️ CivicPulse
          </a>
          <nav className="flex gap-4 text-sm">
            <a
              href="/issues"
              className="hover:text-foreground text-muted-foreground transition-colors"
            >
              Issues
            </a>
            <a
              href="/report"
              className="hover:text-foreground text-muted-foreground transition-colors"
            >
              Report Issue
            </a>
            <a
              href="/login"
              className="hover:text-foreground text-muted-foreground transition-colors"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      {/* The modal renders on top of everything when a route is intercepted.
          When no interception is active, Next.js passes null here and nothing renders. */}
      {modal}
    </div>
  );
}
