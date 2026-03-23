# 🏙️ CivicPulse

> A civic engagement platform where Nairobi citizens report infrastructure issues,
> vote on community priorities, and track government resolution in real time.

## Architecture

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: FastAPI, Python 3.12, PostgreSQL + PostGIS, Redis
- **Infrastructure**: Docker, Kubernetes, Terraform, GitHub Actions

## Project Structure
```
civicpulse/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # FastAPI backend
├── packages/
│   └── shared/       # Shared TypeScript types & utilities
└── docs/             # Architecture Decision Records (ADRs)
```

## Getting Started
```bash
# Install dependencies
pnpm install

# Start development (see individual app READMEs)
pnpm dev:web
```

## Status

🚧 Under active development — building from beginner to production.
