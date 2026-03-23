# ADR 0001: Monorepo with pnpm workspaces

## Status
Accepted

## Context
CivicPulse has a Next.js frontend and a FastAPI backend that share TypeScript 
type definitions for API request/response shapes. We need a repository structure 
that enables code sharing without the overhead of publishing private npm packages.

## Decision
Use a monorepo managed by pnpm workspaces. The `packages/shared` workspace 
contains all shared types and Zod schemas, referenced by `apps/web` as a 
local workspace dependency.

## Consequences
- Single `git clone` gets the entire system
- Atomic commits across frontend + backend are possible
- Shared types are always in sync between apps
- Trade-off: slightly more complex initial setup compared to separate repos
