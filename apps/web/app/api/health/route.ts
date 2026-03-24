// app/api/health/route.ts
// Route Handlers are how you create API endpoints in Next.js.
// The file must export named functions matching HTTP methods: GET, POST, etc.
// This health endpoint will be called by Kubernetes liveness probes in Phase 5
// to check if the Next.js app is alive.

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "civicpulse-web",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.0.0",
    },
    { status: 200 },
  );
}
