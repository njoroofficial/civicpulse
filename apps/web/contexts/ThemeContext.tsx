// contexts/ThemeContext.tsx
// This file has three jobs:
// 1. Create a context that holds the current theme and the toggle function
// 2. Provide a ThemeProvider component that manages the actual state
// 3. Export a useTheme hook that any component can call to read/toggle the theme
"use client";
// ThemeProvider must be a Client Component because it uses useState and
// reads/writes to localStorage — both are browser-only capabilities.

import {
  createContext,
  use,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// The shape of everything the context exposes to consumers
type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  // We also expose setTheme for cases where you want to set a specific
  // theme directly rather than toggling — useful for a settings page
  setTheme: (theme: Theme) => void;
};

// We initialise with undefined so that useTheme() can detect when it's
// called outside of a ThemeProvider and throw a helpful error
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// The key we use in localStorage — namespaced to avoid collisions
// with other apps that might also use 'theme' as a key
const STORAGE_KEY = "civicpulse:theme";

type ThemeProviderProps = {
  children: ReactNode;
  // defaultTheme lets the server pass in an initial value.
  // In a future enhancement, we could read this from a cookie
  // so the server-rendered HTML already has the correct theme class.
  defaultTheme?: Theme;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  // We initialise from localStorage if available, falling back to defaultTheme.
  // The function form of useState (lazy initialisation) means this runs only
  // once on mount — not on every render. This is important for performance
  // because localStorage reads, while fast, are synchronous and blocking.
  const [theme, setThemeState] = useState<Theme>(() => {
    // During server-side rendering, window does not exist.
    // This guard prevents a crash during Next.js's server render phase.
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Theme) ?? defaultTheme;
  });

  // Whenever the theme changes, apply the 'dark' class to <html>
  // and persist the preference to localStorage.
  // This useEffect is the bridge between React's state and the DOM.
  useEffect(() => {
    const root = document.documentElement; // this is the <html> element
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // useCallback prevents toggleTheme from being recreated on every render,
  // which matters because it will be passed through Context to many consumers.
  // Without useCallback, every context consumer would re-render unnecessarily
  // every time ThemeProvider re-renders for any reason.
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext>
  );
  // Note: React 19 simplified Context — you no longer write
  // <ThemeContext.Provider value={...}>, just <ThemeContext value={...}>.
  // This is a small but clean React 19 improvement.
}

// The custom hook that any component calls to access theme state and controls.
// Throwing when used outside ThemeProvider gives developers an immediate,
// clear error message instead of a confusing "cannot read property of undefined".
export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useTheme must be used inside a ThemeProvider. " +
        "Wrap your application in <ThemeProvider> in the root layout.",
    );
  }
  return context;
}
