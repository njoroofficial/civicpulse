// src/components/layout/Navbar.tsx
"use client";

import { use } from "react";
import { UserContext } from "@/contexts/UserContext";
import Link from "next/link";

export function Navbar() {
  // With use(), we could call this inside a condition if needed.
  // For the navbar we always need it, but the ability to call it
  // conditionally is what makes use() more flexible than useContext().
  const user = use(UserContext);

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          🏙️ CivicPulse
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/issues"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Issues
          </Link>

          {/* Conditional rendering based on auth state —
              use() lets us read the context and branch on its value */}
          {user ? (
            <>
              <Link
                href="/report"
                className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Report Issue
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-muted-foreground">{user.name}</span>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
