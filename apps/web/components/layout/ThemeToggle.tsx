// components/layout/ThemeToggle.tsx
// A simple Client Component that reads the current theme and fires toggleTheme.
// It knows nothing about localStorage, nothing about the <html> class —
// all of that complexity is hidden inside ThemeProvider.
// This component's only job is to render the right icon and call toggleTheme.
"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="p-2 rounded-md transition-colors hover:bg-(--color-background-muted)"
      suppressHydrationWarning
    >
      <span
        aria-hidden="true"
        className="text-lg leading-none"
        suppressHydrationWarning
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
