// contexts/UserContext.tsx
// We will build the full auth system in Week 6.
// This is a preview of how use() makes context consumption cleaner.
"use client";

import { createContext, use } from "react";
import type { User } from "@civicpulse/shared";

// Create the context with undefined as the default —
// components must be wrapped in the provider to use it
export const UserContext = createContext<User | null>(null);

// A helper hook built on top of use() — this is the pattern
// recommended in the React 19 docs for typed context access
export function useUser(): User | null {
  // use() reads context — works exactly like useContext() but
  // can be called conditionally when needed
  return use(UserContext);
}
