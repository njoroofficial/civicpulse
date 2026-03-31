// app/(public)/layout.tsx
// This layout wraps only the public routes: /, /issues, /issues/[id]
// It adds the public navigation header. Because it's nested inside the
// root layout, the HTML/body structure is already provided — we only
// need to add the UI structure specific to public pages.

// Notice: still a Server Component (no "use client").
// The navigation bar is rendered on the server — no client JavaScript
// needed just to display a nav bar with links.

import { Navbar } from "@/components/layout/Navbar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";

export default function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Navbar />
      <main>{children}</main>
      {modal}
    </div>
  );
}
