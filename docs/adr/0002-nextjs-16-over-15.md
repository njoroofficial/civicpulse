# ADR 0002: Use Next.js 16.2 instead of Next.js 15

## Status
Accepted

## Context
The curriculum was originally designed around Next.js 15. Next.js 16 was 
released October 2025, with 16.2 current as of March 2026.

## Decision
Use Next.js 16.2 for CivicPulse.

## Reasons
1. Security: Next.js 15 has an unpatched CVSS 10.0 RCE vulnerability 
   (CVE-2025-66478). Running 15 in production is indefensible.
2. Explicit caching: The 'use cache' directive in 16 is cleaner to learn 
   and reason about than the implicit PPR model in 15.
3. Turbopack stable: 87% faster dev server startup — meaningful for a 
   48-week daily-use project.
4. Zero migration cost: No Next.js code has been written yet.

## Consequences
- proxy.ts replaces middleware.ts throughout the curriculum
- 'use cache' directive replaces experimental.ppr config
- All documentation referencing Next.js 15 features is superseded
